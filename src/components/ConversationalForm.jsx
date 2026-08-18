import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, PaperPlaneTilt, X, Clock } from '@phosphor-icons/react';
import BackdropField from './Field.jsx';

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
 * ---- Por qué ocupa toda la pantalla ----
 *
 * Un formulario metido en una columna de una página larga compite con todo lo
 * que tiene alrededor: el menú, el pie, la sección siguiente asomando. Cada uno
 * de esos elementos es una salida. Al abrirse a pantalla completa desaparecen
 * todas menos dos —responder o cerrar— y la conversación pasa a ser lo único
 * que ocurre. El fondo es el mismo campo de partículas del resto del sitio, así
 * que no se siente como una ventana modal ajena sino como entrar dentro.
 *
 * Lo que una capa a pantalla completa obliga a hacer bien, y aquí se hace:
 * Esc cierra, el foco queda atrapado dentro mientras está abierta y vuelve al
 * botón que la abrió al salir, el fondo no hace scroll, y si ya hay respuestas
 * escritas se pide confirmación antes de descartar.
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

/* Todo el texto de interfaz del formulario, en los dos idiomas. Los campos en
   sí (label, help, options) los define quien usa el componente — esto es solo
   el chrome que el componente pone alrededor: botones, avisos, el carril. */
const STRINGS = {
  es: {
    required: 'Este campo es obligatorio.',
    emailInvalid: 'Revisa el email: falta algo.',
    recibido: (email) => (
      <>
        Lo hemos recibido y te responderemos a la dirección que nos has dejado.
        Si prefieres escribirnos directamente, estamos en{' '}
        <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>.
      </>
    ),
    sending: 'Enviando…',
    errorSend: (email) => (
      <>
        No hemos podido enviarlo. Vuelve a intentarlo en un momento, o
        escríbenos a <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>{' '}
        y lo leemos igual.
      </>
    ),
    errorRate: 'Has enviado varios mensajes seguidos. Espera un momento antes de volver a intentarlo.',
    privacyNote: 'Usaremos estos datos únicamente para responder y preparar la conversación adecuada. No te suscribimos a nada ni compartimos la información.',
    railLabel: 'Recorrido del formulario',
    answeredOf: (a, t) => `${a} de ${t} respondidas`,
    left: (n) => ` · quedan ${n}`,
    questionAria: (i, label) => `Pregunta ${i}: ${label}`,
    answeredSuffix: ' (respondida)',
    reviewAndSend: 'Revisar y enviar',
    srSummary: 'Resumen antes de enviar',
    srQuestion: (i, total, label) => `Pregunta ${i} de ${total}: ${label}`,
    reviewQuestion: '¿Lo revisamos antes de enviar?',
    edit: 'Editar',
    optional: ' · opcional',
    back: 'Atrás',
    review: 'Revisar',
    next: 'Siguiente',
    enterTextarea: 'Ctrl + Enter para continuar',
    enterDefault: 'Enter para continuar',
    footerNote: (email) => (
      <>
        Tarda menos de dos minutos. Usaremos lo que escribas solo para preparar
        la respuesta; no te suscribimos a nada. ¿Prefieres escribir directamente?{' '}
        <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
      </>
    ),
    modeSteps: 'Una pregunta a la vez',
    modeAll: 'Ver todo el formulario',
    confirmClose: 'Tienes respuestas sin enviar. ¿Cerrar de todas formas?',
    closeForm: 'Cerrar el formulario',
    close: 'Cerrar',
    startDefault: 'Empezar',
    hint: (n) => `${n} preguntas · menos de dos minutos · sin compromiso`,
  },
  en: {
    required: 'This field is required.',
    emailInvalid: 'Check the email — something’s missing.',
    recibido: (email) => (
      <>
        We’ve got it, and we’ll reply to the address you left us. If you’d
        rather write to us directly, we’re at{' '}
        <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>.
      </>
    ),
    sending: 'Sending…',
    errorSend: (email) => (
      <>
        We couldn’t send it. Try again in a moment, or email us at{' '}
        <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>{' '}
        and we’ll read it just the same.
      </>
    ),
    errorRate: 'You’ve sent several messages in a row. Give it a moment before trying again.',
    privacyNote: 'We’ll use this information only to respond and prepare the right conversation. We won’t subscribe you to anything or share it.',
    railLabel: 'Form journey',
    answeredOf: (a, t) => `${a} of ${t} answered`,
    left: (n) => ` · ${n} left`,
    questionAria: (i, label) => `Question ${i}: ${label}`,
    answeredSuffix: ' (answered)',
    reviewAndSend: 'Review and send',
    srSummary: 'Summary before sending',
    srQuestion: (i, total, label) => `Question ${i} of ${total}: ${label}`,
    reviewQuestion: 'Want to review it before sending?',
    edit: 'Edit',
    optional: ' · optional',
    back: 'Back',
    review: 'Review',
    next: 'Next',
    enterTextarea: 'Ctrl + Enter to continue',
    enterDefault: 'Enter to continue',
    footerNote: (email) => (
      <>
        Takes under two minutes. We’ll only use what you write to prepare the
        response — no subscriptions. Prefer to email us directly?{' '}
        <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
      </>
    ),
    modeSteps: 'One question at a time',
    modeAll: 'See the whole form',
    confirmClose: 'You have unsent answers. Close anyway?',
    closeForm: 'Close the form',
    close: 'Close',
    startDefault: 'Start',
    hint: (n) => `${n} questions · under two minutes · no commitment`,
  },
};

/* El endpoint vive en el propio hosting (assets/api/contacto.php). Es una
   ruta relativa a propósito: así funciona igual en meetbecome.com y en
   cualquier entorno de prueba, sin configurar dominios por ambiente. */
const ENDPOINT = '/api/contacto.php';

/** Envía el formulario. Devuelve null si fue bien, o la clave del error. */
async function enviar({ fields, values, formId, lang, honeypot }) {
  const emailField = fields.find((f) => f.type === 'email');
  const payload = {
    form: formId,
    lang,
    website: honeypot,          // el señuelo: si viene relleno, es un robot
    replyTo: emailField ? String(values[emailField.name] || '').trim() : '',
    answers: fields.map((f) => ({
      label: f.short || f.label,
      value: values[f.name],
    })),
  };

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    /* Sin red, o el servidor no responde */
    return 'send';
  }
  if (res.status === 429) return { kind: 'rate' };

  /* La etapa la manda el servidor cuando el envío falla ('auth', 'conexion'…).
     No dice nada de la infraestructura, pero convierte "no funciona" en un
     dato accionable sin tener que abrir las herramientas del navegador. */
  let etapa = null;
  try { etapa = (await res.clone().json())?.stage ?? null; } catch { /* sin JSON */ }
  if (!res.ok) return { kind: 'send', stage: etapa };

  /* Un 200 con HTML en vez de JSON significa que el servidor devolvió una
     página en lugar de ejecutar el PHP: sin esto, un endpoint mal desplegado
     se leería como un envío correcto y los mensajes se perderían en silencio. */
  try {
    const data = await res.json();
    return data && data.ok === true ? null : { kind: 'send', stage: etapa };
  } catch {
    return { kind: 'send', stage: null };
  }
}

const isFilled = (f, v) => {
  if (f.type === 'multi') return Array.isArray(v) && v.length > 0;
  return typeof v === 'string' ? v.trim().length > 0 : Boolean(v);
};

const validate = (f, v, t) => {
  if (f.required && !isFilled(f, v)) return t.required;
  if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) {
    return t.emailInvalid;
  }
  return null;
};

function Conversation({
  fields,
  submitLabel,
  confirmation,
  dark = true,
  formName,
  bare = false,
  onDirty,
  lang = 'es',
  formId = 'contacto',
}) {
  const t = STRINGS[lang];
  const reduced = useReducedMotion();
  const [sending, setSending] = React.useState(false);
  const [sendError, setSendError] = React.useState(null);
  const honeypotRef = React.useRef(null);
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
    /* El foco va al campo, no al contenedor: si no, hay que tabular en cada
       paso. Va en el fotograma siguiente y no tras la animación: con 260 ms de
       espera, quien escribe rápido y encadena con Enter perdía las primeras
       letras de la respuesta siguiente. */
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [step, mode, isReview, reduced]);

  const set = (name, v) => setValues((p) => ({ ...p, [name]: v }));

  /* El escenario necesita saber si hay respuestas para avisar antes de cerrar */
  React.useEffect(() => {
    onDirty?.(fields.some((f) => f.default === undefined && isFilled(f, values[f.name])));
  }, [values, fields, onDirty]);

  const next = () => {
    const err = validate(current, values[current.name], t);
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

  const submit = async (e) => {
    e?.preventDefault();
    if (sending) return;   // doble clic: un mensaje, no dos

    const firstBad = fields.findIndex((f) => validate(f, values[f.name], t));
    if (firstBad >= 0) {
      setError(validate(fields[firstBad], values[fields[firstBad].name], t));
      if (mode === 'steps') setStep(firstBad);
      return;
    }

    setError(null);
    setSendError(null);
    setSending(true);
    const fallo = await enviar({
      fields, values, formId, lang,
      honeypot: honeypotRef.current?.value || '',
    });
    setSending(false);

    /* La confirmación solo aparece si el correo salió de verdad. Darla por
       buena sin comprobarlo es peor que un error visible: quien escribe se
       va convencido de que le van a responder. */
    if (fallo) setSendError(fallo);
    else setSent(true);
  };

  /* El señuelo antispam. Fuera de la vista y fuera del orden de tabulación,
     pero sin display:none: hay robots que descartan lo que está oculto así. */
  const honeypot = (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
      <label htmlFor={`website-${formId}`}>No rellenar</label>
      <input id={`website-${formId}`} ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );

  if (sent) {
    return (
      <div role="status" aria-live="polite" style={{ maxWidth: 'var(--maxw-prose)' }}>
        <p style={{ margin: 0, font: 'var(--type-lead)', color: dark ? 'var(--white)' : 'var(--text-heading)' }}>
          {confirmation}
        </p>
        <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-body)', color: dark ? 'var(--slate-300)' : 'var(--text-muted)' }}>
          {t.recibido('hello@meetbecome.com')}
        </p>
      </div>
    );
  }

  const c = colors(dark, bare);

  const avisoEnvio = sendError ? (
    <p role="alert" style={c.error}>
      {sendError.kind === 'rate' ? t.errorRate : t.errorSend('hello@meetbecome.com')}
      {sendError.stage && (
        <span style={{ display: 'block', marginTop: 6, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', opacity: 0.7 }}>
          ref: {sendError.stage}
        </span>
      )}
    </p>
  ) : null;

  /* Sobre navy el formulario cae encima del nodo, y un campo vacío sobre
     partículas en movimiento es ilegible. Se le da suelo propio: no es una
     tarjeta decorativa, es lo que separa "escribir aquí" de "fondo". */
  const shell = bare ? null : dark
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
        <ModeToggle mode={mode} onChange={changeMode} c={c} t={t} />
        <div data-cols style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          {fields.map((f) => (
            <div key={f.name} style={{ gridColumn: f.wide ? '1 / -1' : 'auto' }}>
              <label htmlFor={f.name} style={c.label}>{f.label}</label>
              <Field f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} c={c} />
              {f.help && <p style={c.help}>{f.help}</p>}
            </div>
          ))}
        </div>
        {honeypot}
        {error && <p role="alert" style={c.error}>{error}</p>}
        {avisoEnvio}
        <p style={{ ...c.help, marginTop: 'var(--space-6)', maxWidth: '58ch' }}>
          {t.privacyNote}
        </p>
        <button type="submit" className="cta-primary" style={c.submit} disabled={sending} aria-busy={sending}>
          {sending ? t.sending : submitLabel}
        </button>
      </form>
    );
  }

  /* ---------------- modo conversación ---------------- */
  const answered = fields.filter((f) => isFilled(f, values[f.name])).length;
  const pct = Math.round((Math.min(step, total) / total) * 100);
  const left = total - answered;

  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ ...shell }} aria-label={formName}>
      <ModeToggle mode={mode} onChange={changeMode} c={c} t={t} />

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
        <nav data-form-rail aria-label={t.railLabel}>
          <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', letterSpacing: 'var(--track-mono)', color: c.faint }}>
            {t.answeredOf(answered, total)}
            {left > 0 && t.left(left)}
          </p>
          <div style={{ marginTop: 'var(--space-4)', height: 2, background: c.rule, borderRadius: 2, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
              style={{ height: '100%', background: 'var(--electric-green)' }}
            />
          </div>

          {/* Puntos: el recorrido comprimido para móvil, donde la lista entera
              empujaba la pregunta fuera de la primera pantalla — justo el dato
              que el carril existe para dar. */}
          <ol data-rail-dots style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {fields.map((f, i) => {
              const done = isFilled(f, values[f.name]);
              const here = i === step;
              const open = i <= reached;
              return (
                <li key={f.name}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    disabled={!open}
                    aria-label={`${t.questionAria(i + 1, f.short || f.label)}${done ? t.answeredSuffix : ''}`}
                    aria-current={here ? 'step' : undefined}
                    style={{
                      width: 34, height: 34, minHeight: 34, padding: 0, borderRadius: '50%',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${done || here ? 'var(--electric-green)' : c.border}`,
                      background: done ? 'var(--electric-green)' : here ? 'rgba(0,255,136,.14)' : 'transparent',
                      color: done ? 'var(--deep-navy)' : here ? 'var(--electric-green)' : c.faint,
                      font: 'var(--type-mono)', fontSize: 'var(--text-micro)', lineHeight: 1,
                      cursor: open ? 'pointer' : 'default', opacity: open ? 1 : 0.5,
                    }}
                  >
                    {done ? <Check size={12} weight="bold" aria-hidden="true" /> : i + 1}
                  </button>
                </li>
              );
            })}
          </ol>

          <ol data-rail-list style={{ listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0, display: 'grid' }}>
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
                  {t.reviewAndSend}
                </span>
              </button>
            </li>
          </ol>
        </nav>

        {/* ---- la pregunta activa ---- */}
        <div>
          {/* Anuncio para lectores de pantalla */}
          <p aria-live="polite" className="sr-only">
            {isReview ? t.srSummary : t.srQuestion(step + 1, total, current.label)}
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
                    <p style={c.question}>{t.reviewQuestion}</p>
                    <dl style={{ margin: 'var(--space-7) 0 0', display: 'grid', gap: 'var(--space-4)' }}>
                      {fields.map((f, i) => (
                        <div key={f.name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr) auto', gap: 'var(--space-5)', alignItems: 'baseline', paddingTop: 'var(--space-4)', borderTop: `1px solid ${c.rule}` }}>
                          <dt style={{ ...c.label, margin: 0 }}>{f.short || f.label}</dt>
                          <dd style={{ margin: 0, font: 'var(--type-body)', color: c.text }}>
                            {Array.isArray(values[f.name])
                              ? (values[f.name].join(', ') || '—')
                              : (values[f.name] || '—')}
                          </dd>
                          <button type="button" onClick={() => setStep(i)} style={c.editBtn}>{t.edit}</button>
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
                      {!current.required && <span style={{ color: c.faint, fontSize: 'var(--text-body-md)' }}>{t.optional}</span>}
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

          {honeypot}
          {error && <p role="alert" style={c.error}>{error}</p>}
          {avisoEnvio}

          <div style={{ marginTop: 'var(--space-7)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            {step > 0 && (
              <button type="button" onClick={back} disabled={sending} style={{ ...c.ghostBtn, gap: 8 }}>
                <ArrowLeft size={16} aria-hidden="true" /> {t.back}
              </button>
            )}
            {isReview ? (
              <button
                type="button" onClick={submit} className="cta-primary"
                disabled={sending} aria-busy={sending}
                style={{ ...c.submit, gap: 10, opacity: sending ? 0.7 : 1 }}
              >
                {sending ? t.sending : submitLabel}
                {!sending && <PaperPlaneTilt size={16} weight="bold" aria-hidden="true" />}
              </button>
            ) : (
              <button type="button" onClick={next} className="cta-primary" style={{ ...c.submit, gap: 10 }}>
                {step === total - 1 ? t.review : t.next} <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
            )}
            {!isReview && (
              <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: c.faint }}>
                {current.type === 'textarea' ? t.enterTextarea : t.enterDefault}
              </span>
            )}
          </div>

          <p style={{ ...c.help, marginTop: 'var(--space-7)', maxWidth: '54ch' }}>
            {t.footerNote('hello@meetbecome.com')}
          </p>
        </div>
      </div>
    </form>
  );
}

/* ---------------- piezas ---------------- */

function ModeToggle({ mode, onChange, c, t }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-7)' }}>
      {[['steps', t.modeSteps], ['all', t.modeAll]].map(([v, label]) => (
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
function colors(dark, stage) {
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
      fontSize: stage ? 'var(--text-h1)' : 'var(--text-h2)', lineHeight: 'var(--leading-heading)',
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

/* ---------------- el escenario a pantalla completa ---------------- */

/**
 * La invitación: lo único que ve la página hasta que alguien decide entrar.
 *
 * Dice cuánto cuesta (dos minutos, siete preguntas) antes de pedir el primer
 * dato. Un formulario que no declara su longitud la declara igualmente — a
 * mitad de camino, y para entonces ya es un motivo para abandonar.
 */
function Launcher({ dark, title, lead, count, launchLabel, onOpen, btnRef, t }) {
  const c = colors(dark);
  return (
    <div style={{ maxWidth: '46ch' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: c.text }}>
        {title}
      </h2>
      {lead && <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-lead)', color: dark ? 'var(--slate-100)' : 'var(--text-body)' }}>{lead}</p>}

      <p style={{ margin: 'var(--space-7) 0 0', display: 'inline-flex', alignItems: 'center', gap: 10, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: c.faint }}>
        <Clock size={18} aria-hidden="true" />
        {t.hint(count)}
      </p>

      <div style={{ marginTop: 'var(--space-7)' }}>
        <button ref={btnRef} type="button" onClick={onOpen} className="cta-primary" style={{ ...c.submit, gap: 10 }}>
          {launchLabel} <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function ConversationalForm({
  fields, submitLabel, confirmation, dark = true, formName,
  title, lead, launchLabel, lang = 'es', formId = 'contacto',
}) {
  const t = STRINGS[lang];
  const resolvedLaunchLabel = launchLabel ?? t.startDefault;
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const btnRef = React.useRef(null);
  const stageRef = React.useRef(null);

  const close = React.useCallback(() => {
    if (dirty && !window.confirm(t.confirmClose)) return;
    setOpen(false);
  }, [dirty, t]);

  /* Mientras el escenario está abierto: sin scroll detrás, Esc cierra y el
     tabulador no se escapa a la página que hay debajo. */
  React.useEffect(() => {
    if (!open) { btnRef.current?.focus(); return undefined; }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const stage = stageRef.current;
      if (!stage) return;
      const f = stage.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, close]);

  const launcher = (
    <Launcher
      dark={dark}
      title={title}
      lead={lead}
      count={fields.length}
      launchLabel={resolvedLaunchLabel}
      onOpen={() => setOpen(true)}
      btnRef={btnRef}
      t={t}
    />
  );

  if (!open) return launcher;

  const stage = (
    <motion.div
      ref={stageRef}
      role="dialog"
      aria-modal="true"
      aria-label={formName}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: EASE }}
      style={{
        position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
        background: 'var(--navy-950)',
        display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)',
      }}
    >
      {/* El mismo campo del resto del sitio: entrar en la conversación no es
          salir de la marca, es acercarse a ella. */}
      <BackdropField variant="dust" seed={5} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 40%, rgba(5,7,15,.5) 0%, rgba(5,7,15,.92) 70%)' }} />

      <header
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 'var(--space-6)', padding: 'var(--space-5) var(--gutter-page)',
          borderBottom: '1px solid var(--border-hairline-dark)',
        }}
      >
        <img src="/logo/wordmark-white.webp" alt="BECOME" width="104" height="18" style={{ height: 18, width: 'auto', display: 'block' }} />
        <button
          type="button"
          onClick={close}
          aria-label={t.closeForm}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '0 var(--space-5)',
            background: 'transparent', border: '1px solid var(--border-strong-dark)', borderRadius: 'var(--radius-pill)',
            color: 'var(--white)', cursor: 'pointer',
            font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
          }}
        >
          <X size={16} weight="bold" aria-hidden="true" /> {t.close}
        </button>
      </header>

      {/* Centrado vertical: una pregunta sola pegada al borde superior de una
          pantalla vacía se lee como un formulario que se quedó a medio cargar. */}
      <div style={{ position: 'relative', overflowY: 'auto', display: 'grid', alignContent: 'center', padding: 'var(--space-9) var(--gutter-page) var(--space-10)' }}>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: EASE, delay: 0.06 }}
          style={{ maxWidth: 'var(--maxw-content)', margin: '0 auto' }}
        >
          <Conversation
            fields={fields}
            submitLabel={submitLabel}
            confirmation={confirmation}
            dark
            formName={formName}
            bare
            onDirty={setDirty}
            lang={lang}
            formId={formId}
          />
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <>
      {launcher}
      {createPortal(stage, document.body)}
    </>
  );
}
