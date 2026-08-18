import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, PaperPlaneTilt } from '@phosphor-icons/react';

/**
 * Formulario conversacional con el recorrido a la vista.
 *
 * Lo usan el contacto general y BECOME NOW™. La diferencia entre los dos es el
 * esquema que recibe, no el componente — dos implementaciones del mismo patrón
 * se habrían separado a la primera corrección.
 *
 * Se responde una pregunta cada vez, pero el recorrido entero está en pantalla:
 * a la izquierda se ven las diez preguntas, cuáles están contestadas, con qué, y
 * cuántas quedan. Es la corrección al formulario por pasos clásico, que esconde
 * el final y por eso se abandona: quien no sabe cuánto falta asume que falta
 * mucho. Con el recorrido visible la pregunta deja de ser "¿en qué me estoy
 * metiendo?" y pasa a ser "me quedan tres".
 *
 * El carril no es decorativo: cada fila contestada es un botón que devuelve a
 * esa pregunta. Corregir un dato no obliga a retroceder paso a paso.
 *
 * ---- Lo que este patrón sigue haciendo mal, y cómo se compensa ----
 *
 *   · Hay un interruptor a "ver todo el formulario" siempre visible, y la
 *     elección se recuerda. No es una opción escondida: es el mismo formulario.
 *     Quien usa lector de pantalla o gestor de contraseñas lo necesita.
 *   · Cada cambio de paso se anuncia por aria-live.
 *   · Enter avanza, salvo en un campo de texto largo, donde Enter escribe un
 *     salto de línea y es Ctrl+Enter quien avanza.
 *   · El último paso es un resumen editable, no un botón a ciegas.
 *   · Con prefers-reduced-motion las transiciones desaparecen; el flujo no.
 */

const EASE = [0.2, 0.7, 0.2, 1];
const MODE_KEY = 'become:form-mode';

const isFilled = (f, v) => {
  if (f.type === 'multi') return Array.isArray(v) && v.length > 0;
  return typeof v === 'string' ? v.trim().length > 0 : Boolean(v);
};

const validate = (f, v) => {
  if (f.required && !isFilled(f, v)) return 'Este campo es obligatorio.';
  if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) {
    return 'Revisa el email: falta algo.';
  }
  return null;
};

export default function ConversationalForm({
  fields,
  submitLabel,
  confirmation,
  dark = true,
  formName,
}) {
  const reduced = useReducedMotion();
  const [mode, setMode] = React.useState('steps');
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.type === 'multi' ? [] : (f.default ?? '')]))
  );
  const [reached, setReached] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [sent, setSent] = React.useState(false);
  const inputRef = React.useRef(null);

  /* La preferencia de modo se recuerda: quien elige el formulario completo no
     debería tener que volver a elegirlo en el segundo formulario del sitio. */
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (saved === 'all' || saved === 'steps') setMode(saved);
    } catch { /* almacenamiento bloqueado: se queda en pasos */ }
  }, []);
  const changeMode = (m) => {
    setMode(m);
    setError(null);
    try { localStorage.setItem(MODE_KEY, m); } catch { /* da igual */ }
  };

  const total = fields.length;
  const current = fields[step];
  const isReview = step === total;

  React.useEffect(() => {
    if (mode !== 'steps' || isReview) return;
    /* El foco va al campo, no al contenedor: si no, hay que tabular en cada paso */
    const id = setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 260);
    return () => clearTimeout(id);
  }, [step, mode, isReview, reduced]);

  const set = (name, v) => setValues((p) => ({ ...p, [name]: v }));

  const next = () => {
    const err = validate(current, values[current.name]);
    if (err) {
      setError(err);
      /* El foco vuelve al campo: si se queda en el botón, lo siguiente que
         escribes no va a ninguna parte. */
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setStep((s) => {
      const n = Math.min(s + 1, total);
      setReached((r) => Math.max(r, n));
      return n;
    });
  };
  const back = () => { setError(null); setStep((s) => Math.max(s - 1, 0)); };
  const jump = (i) => {
    if (i > reached) return;   // no se salta por delante: la validación es por paso
    setError(null);
    setStep(i);
  };

  const submit = (e) => {
    e?.preventDefault();
    const firstBad = fields.findIndex((f) => validate(f, values[f.name]));
    if (firstBad >= 0) {
      setError(validate(fields[firstBad], values[fields[firstBad].name]));
      if (mode === 'steps') setStep(firstBad);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" aria-live="polite" style={{ maxWidth: 'var(--maxw-prose)' }}>
        <p style={{ margin: 0, font: 'var(--type-lead)', color: dark ? 'var(--white)' : 'var(--text-heading)' }}>
          {confirmation}
        </p>
        <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-body)', color: dark ? 'var(--slate-300)' : 'var(--text-muted)' }}>
          Mientras el sitio está en construcción este formulario no está conectado a
          ningún destino, así que tu mensaje no ha salido del navegador. Escríbenos a{' '}
          <a href="mailto:hello@become.company" style={{ color: dark ? 'var(--electric-green)' : 'var(--text-accent)' }}>
            hello@become.company
          </a>{' '}
          y lo leemos hoy.
        </p>
      </div>
    );
  }

  const c = colors(dark);

  /* Sobre navy el formulario cae encima del nodo, y un campo vacío sobre
     partículas en movimiento es ilegible. Se le da suelo propio: no es una
     tarjeta decorativa, es lo que separa "escribir aquí" de "fondo". */
  const shell = dark
    ? {
        background: 'rgba(5,7,15,.62)',
        backdropFilter: 'blur(3px)',
        border: '1px solid var(--border-hairline-dark)',
        padding: 'var(--space-8)',
      }
    : null;

  /* ---------------- modo formulario completo ---------------- */
  if (mode === 'all') {
    return (
      <form onSubmit={submit} style={{ maxWidth: 880, ...shell }} aria-label={formName}>
        <ModeToggle mode={mode} onChange={changeMode} c={c} />
        <div data-cols style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          {fields.map((f) => (
            <div key={f.name} style={{ gridColumn: f.wide ? '1 / -1' : 'auto' }}>
              <label htmlFor={f.name} style={c.label}>{f.label}</label>
              <Field f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} c={c} />
              {f.help && <p style={c.help}>{f.help}</p>}
            </div>
          ))}
        </div>
        {error && <p role="alert" style={c.error}>{error}</p>}
        <p style={{ ...c.help, marginTop: 'var(--space-6)', maxWidth: '58ch' }}>
          Usaremos estos datos únicamente para responder y preparar la conversación
          adecuada. No te suscribimos a nada ni compartimos la información.
        </p>
        <button type="submit" className="cta-primary" style={c.submit}>{submitLabel}</button>
      </form>
    );
  }

  /* ---------------- modo conversación ---------------- */
  const answered = fields.filter((f) => isFilled(f, values[f.name])).length;
  const pct = Math.round((Math.min(step, total) / total) * 100);
  const left = total - answered;

  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ ...shell }} aria-label={formName}>
      <ModeToggle mode={mode} onChange={changeMode} c={c} />

      <div
        data-cols
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)',
          gap: 'var(--space-9)',
          alignItems: 'start',
        }}
      >
        {/* ---- el recorrido, entero y a la vista ---- */}
        <nav data-form-rail aria-label="Recorrido del formulario">
          <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', letterSpacing: 'var(--track-mono)', color: c.faint }}>
            {answered} de {total} respondidas
            {left > 0 && ` · quedan ${left}`}
          </p>
          <div style={{ marginTop: 'var(--space-4)', height: 2, background: c.rule, borderRadius: 2, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
              style={{ height: '100%', background: 'var(--electric-green)' }}
            />
          </div>

          <ol style={{ listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0, display: 'grid' }}>
            {fields.map((f, i) => {
              const done = isFilled(f, values[f.name]);
              const here = i === step;
              const open = i <= reached;
              const answer = Array.isArray(values[f.name]) ? values[f.name].join(', ') : values[f.name];
              return (
                <li key={f.name}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    disabled={!open}
                    aria-current={here ? 'step' : undefined}
                    style={{
                      ...c.railRow,
                      cursor: open ? 'pointer' : 'default',
                      opacity: open ? 1 : 0.55,
                      color: here ? c.text : c.faint,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        ...c.railDot,
                        borderColor: done || here ? 'var(--electric-green)' : c.border,
                        background: done ? 'var(--electric-green)' : 'transparent',
                        color: done ? 'var(--deep-navy)' : here ? 'var(--electric-green)' : c.faint,
                      }}
                    >
                      {done ? <Check size={12} weight="bold" /> : String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', fontWeight: here ? 600 : 400 }}>
                        {f.short || f.label}
                      </span>
                      {done && !here && (
                        <span style={{ display: 'block', font: 'var(--type-body)', fontSize: 'var(--text-micro)', color: c.faint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {answer}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => jump(total)}
                disabled={reached < total}
                aria-current={isReview ? 'step' : undefined}
                style={{
                  ...c.railRow,
                  cursor: reached >= total ? 'pointer' : 'default',
                  opacity: reached >= total ? 1 : 0.55,
                  color: isReview ? c.text : c.faint,
                }}
              >
                <span aria-hidden="true" style={{ ...c.railDot, borderColor: isReview ? 'var(--electric-green)' : c.border, color: isReview ? 'var(--electric-green)' : c.faint }}>
                  <PaperPlaneTilt size={12} weight="bold" />
                </span>
                <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', fontWeight: isReview ? 600 : 400 }}>
                  Revisar y enviar
                </span>
              </button>
            </li>
          </ol>
        </nav>

        {/* ---- la pregunta activa ---- */}
        <div>
          {/* Anuncio para lectores de pantalla */}
          <p aria-live="polite" className="sr-only">
            {isReview ? 'Resumen antes de enviar' : `Pregunta ${step + 1} de ${total}: ${current.label}`}
          </p>

          <div style={{ minHeight: 180 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isReview ? 'review' : current.name}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={reduced ? { duration: 0 } : { duration: 0.32, ease: EASE }}
              >
                {isReview ? (
                  <>
                    <p style={c.question}>¿Lo revisamos antes de enviar?</p>
                    <dl style={{ margin: 'var(--space-7) 0 0', display: 'grid', gap: 'var(--space-4)' }}>
                      {fields.map((f, i) => (
                        <div key={f.name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr) auto', gap: 'var(--space-5)', alignItems: 'baseline', paddingTop: 'var(--space-4)', borderTop: `1px solid ${c.rule}` }}>
                          <dt style={{ ...c.label, margin: 0 }}>{f.short || f.label}</dt>
                          <dd style={{ margin: 0, font: 'var(--type-body)', color: c.text }}>
                            {Array.isArray(values[f.name])
                              ? (values[f.name].join(', ') || '—')
                              : (values[f.name] || '—')}
                          </dd>
                          <button type="button" onClick={() => setStep(i)} style={c.editBtn}>Editar</button>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : (
                  <>
                    <p style={c.question}>
                      <span style={{ color: 'var(--electric-green)', font: 'var(--type-mono)', fontSize: 'var(--text-body-md)', marginRight: 12 }}>
                        {String(step + 1).padStart(2, '0')}
                      </span>
                      {current.label}
                      {!current.required && <span style={{ color: c.faint, fontSize: 'var(--text-body-md)' }}> · opcional</span>}
                    </p>
                    {current.help && <p style={{ ...c.help, marginTop: 'var(--space-4)' }}>{current.help}</p>}
                    <div style={{ marginTop: 'var(--space-6)' }}>
                      <Field
                        f={current}
                        value={values[current.name]}
                        onChange={(v) => { set(current.name, v); if (error) setError(null); }}
                        onEnter={next}
                        inputRef={inputRef}
                        c={c}
                        big
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && <p role="alert" style={c.error}>{error}</p>}

          <div style={{ marginTop: 'var(--space-7)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            {step > 0 && (
              <button type="button" onClick={back} style={{ ...c.ghostBtn, gap: 8 }}>
                <ArrowLeft size={16} aria-hidden="true" /> Atrás
              </button>
            )}
            {isReview ? (
              <button type="button" onClick={submit} className="cta-primary" style={{ ...c.submit, gap: 10 }}>
                {submitLabel} <PaperPlaneTilt size={16} weight="bold" aria-hidden="true" />
              </button>
            ) : (
              <button type="button" onClick={next} className="cta-primary" style={{ ...c.submit, gap: 10 }}>
                {step === total - 1 ? 'Revisar' : 'Siguiente'} <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
            )}
            {!isReview && (
              <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: c.faint }}>
                {current.type === 'textarea' ? 'Ctrl + Enter para continuar' : 'Enter para continuar'}
              </span>
            )}
          </div>

          <p style={{ ...c.help, marginTop: 'var(--space-7)', maxWidth: '54ch' }}>
            Tarda menos de dos minutos. Usaremos lo que escribas solo para preparar
            la respuesta; no te suscribimos a nada. ¿Prefieres escribir directamente?{' '}
            <a href="mailto:hello@become.company" style={{ color: dark ? 'var(--electric-green)' : 'var(--text-accent)' }}>
              hello@become.company
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}

/* ---------------- piezas ---------------- */

function ModeToggle({ mode, onChange, c }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-7)' }}>
      {[['steps', 'Una pregunta a la vez'], ['all', 'Ver todo el formulario']].map(([v, label]) => (
        <button
          key={v}
          type="button"
          aria-pressed={mode === v}
          onClick={() => onChange(v)}
          style={{
            background: 'transparent', border: 0, padding: '6px 0', cursor: 'pointer',
            font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
            color: mode === v ? 'var(--electric-green)' : c.faint,
            borderBottom: `1px solid ${mode === v ? 'var(--electric-green)' : 'transparent'}`,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Field({ f, value, onChange, onEnter, inputRef, c, big }) {
  const keyDown = (e) => {
    if (!onEnter) return;
    if (f.type === 'textarea') {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onEnter(); }
      return;
    }
    if (e.key === 'Enter') { e.preventDefault(); onEnter(); }
  };

  const base = big ? { ...c.input, ...c.inputBig } : c.input;

  if (f.type === 'textarea') {
    return (
      <textarea
        id={f.name} name={f.name} ref={inputRef} rows={big ? 4 : 5}
        value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={keyDown}
        placeholder={f.placeholder} required={f.required}
        style={{ ...base, minHeight: big ? 132 : 140, resize: 'vertical' }}
      />
    );
  }

  if (f.type === 'select') {
    return (
      <select
        id={f.name} name={f.name} ref={inputRef}
        value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={keyDown}
        style={base}
      >
        {f.options.map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  }

  if (f.type === 'multi') {
    const on = (o) => value.includes(o);
    return (
      <div role="group" aria-labelledby={f.name} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        {f.options.map((o, i) => (
          <label
            key={o}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              padding: '10px 16px', minHeight: 44,
              border: `1px solid ${on(o) ? 'var(--electric-green)' : c.border}`,
              borderRadius: 'var(--radius-pill)',
              background: on(o) ? 'rgba(0,255,136,.12)' : 'transparent',
              color: on(o) ? 'var(--electric-green)' : c.text,
              font: 'var(--type-body)', fontSize: 'var(--text-body-md)',
              textTransform: 'none', letterSpacing: 'normal', margin: 0,
              transition: 'background .2s ease, border-color .2s ease, color .2s ease',
            }}
          >
            <input
              type="checkbox" name={f.name} value={o} checked={on(o)}
              ref={i === 0 ? inputRef : undefined}
              onChange={() => onChange(on(o) ? value.filter((x) => x !== o) : [...value, o])}
              style={{ width: 'auto', minHeight: 0, margin: 0, accentColor: 'var(--electric-green)' }}
            />
            {o}
          </label>
        ))}
      </div>
    );
  }

  return (
    <input
      id={f.name} name={f.name} ref={inputRef} type={f.type || 'text'}
      value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={keyDown}
      placeholder={f.placeholder} required={f.required} autoComplete={f.autoComplete}
      inputMode={f.inputMode}
      style={base}
    />
  );
}

/* Los formularios viven sobre navy y sobre claro; los colores salen de aquí
   en vez de duplicar el componente. */
function colors(dark) {
  const text = dark ? 'var(--white)' : 'var(--text-heading)';
  const faint = dark ? 'var(--slate-400)' : 'var(--text-faint)';
  const border = dark ? 'var(--border-strong-dark)' : 'var(--border-strong)';
  return {
    text, faint, border,
    rule: dark ? 'var(--border-hairline-dark)' : 'var(--border-hairline)',
    label: {
      display: 'block', font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase', color: dark ? 'var(--slate-300)' : 'var(--text-muted)', marginBottom: 8,
    },
    question: {
      margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)',
      fontSize: 'var(--text-h2)', lineHeight: 'var(--leading-heading)',
      letterSpacing: 'var(--track-display)', color: text, maxWidth: '22ch',
    },
    help: {
      margin: 0, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)',
      color: dark ? 'var(--slate-300)' : 'var(--text-muted)',
    },
    error: {
      margin: 'var(--space-5) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)',
      color: dark ? 'var(--ice-blue)' : 'var(--text-heading)',
      borderLeft: '2px solid var(--electric-green)', paddingLeft: 'var(--space-4)',
    },
    input: {
      background: dark ? 'rgba(255,255,255,.04)' : 'var(--white)',
      border: `1px solid ${border}`,
      color: text,
    },
    inputBig: {
      font: 'var(--type-lead)', padding: '16px 18px', minHeight: 60,
      background: 'transparent', border: 0, borderBottom: `1px solid ${border}`,
      borderRadius: 0, paddingLeft: 0,
    },
    submit: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 52, padding: '0 var(--space-7)', borderRadius: 'var(--radius-pill)', border: 0,
      background: 'var(--electric-green)', color: 'var(--deep-navy)', cursor: 'pointer',
      font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
      width: 'auto', marginTop: 0,
    },
    ghostBtn: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 52, padding: '0 var(--space-6)', borderRadius: 'var(--radius-pill)',
      background: 'transparent', border: `1px solid ${border}`, color: text, cursor: 'pointer',
      font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
    },
    railRow: {
      display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)', gap: 12,
      alignItems: 'start', width: '100%', textAlign: 'left',
      background: 'transparent', border: 0, borderLeft: '1px solid transparent',
      padding: '10px 0', minHeight: 44,
    },
    railDot: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: '50%', border: '1px solid',
      font: 'var(--type-mono)', fontSize: 'var(--text-micro)', lineHeight: 1,
    },
    editBtn: {
      background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
      font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
      color: 'var(--electric-green)',
    },
  };
}
