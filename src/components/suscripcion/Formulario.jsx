import React from 'react';
import { Ico } from '../icons.jsx';

/**
 * Formulario de suscripción. Uno solo, usado en los tres sitios donde aparece
 * —al pie del artículo, en el widget flotante y en el aviso—, porque tres
 * copias del mismo formulario se desincronizan a la segunda corrección.
 *
 * Las reglas de formulario que se aplican aquí, y por qué:
 *
 * · Etiqueta visible, no solo el texto de dentro del campo. Ese texto
 *   desaparece al escribir, y con él la única pista de qué se estaba pidiendo.
 * · Se valida al salir del campo, no en cada tecla: marcar en rojo mientras
 *   alguien todavía escribe su dirección es decirle que se equivoca antes de
 *   que haya terminado.
 * · El error va debajo del campo, enlazado con aria-describedby y anunciado por
 *   role="alert". Un borde rojo no lo oye nadie.
 * · El botón se desactiva mientras envía y lo dice. Sin eso se pulsa dos veces
 *   y salen dos correos de confirmación.
 */

export const TEXTOS = {
  es: {
    titulo: 'Recibe los artículos',
    lead: 'Un correo cuando publicamos. Nada de resúmenes de lo que ya dijo otro, y baja en un clic.',
    etiqueta: 'Tu correo',
    boton: 'Suscribirme',
    enviando: 'Enviando…',
    listo: 'Revisa tu correo',
    listoDetalle: 'Te hemos enviado un enlace para confirmar. Hasta que lo pulses no recibirás nada.',
    vacio: 'Escribe tu dirección de correo.',
    malo: 'Esa dirección no parece válida. Revisa que esté completa.',
    privacidad: 'Solo para los artículos. Nunca compartimos tu dirección.',
  },
  en: {
    titulo: 'Get the articles',
    lead: 'One email when we publish. No roundups of what someone else already said, and one-click unsubscribe.',
    etiqueta: 'Your email',
    boton: 'Subscribe',
    enviando: 'Sending…',
    listo: 'Check your inbox',
    listoDetalle: 'We sent you a link to confirm. Until you click it, you receive nothing.',
    vacio: 'Enter your email address.',
    malo: 'That address does not look right. Check it is complete.',
    privacidad: 'For the articles only. We never share your address.',
  },
};

const PARECE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Formulario({ lang = 'es', origen = '', compacto = false, oscuro = false, alTerminar }) {
  /* Sobre navy los mismos colores dejan de leerse: el gris de las etiquetas
     desaparece y el borde del campo se funde con el fondo. En vez de un tema
     entero, tres valores que cambian y el resto igual. */
  const col = oscuro
    ? { titulo: 'var(--white)', texto: 'var(--slate-300)', tenue: 'var(--slate-400)', campo: 'rgba(255,255,255,.06)', borde: 'var(--border-hairline-dark)', escrito: 'var(--white)' }
    : { titulo: 'var(--text-heading)', texto: 'var(--text-muted)', tenue: 'var(--text-faint)', campo: 'var(--white)', borde: 'var(--border-hairline)', escrito: 'var(--text-body)' };
  const t = TEXTOS[lang] || TEXTOS.es;
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);
  const [hecho, setHecho] = React.useState(false);
  const [trampa, setTrampa] = React.useState('');
  const idError = React.useId();
  const idCampo = React.useId();
  const campo = React.useRef(null);

  const validar = (v) => {
    if (!v.trim()) return t.vacio;
    if (!PARECE_CORREO.test(v.trim())) return t.malo;
    return '';
  };

  const enviar = async (e) => {
    e.preventDefault();
    const mal = validar(email);
    if (mal) { setError(mal); campo.current?.focus(); return; }

    setEnviando(true); setError('');
    try {
      const r = await fetch('/api/suscripcion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'alta', email: email.trim(), idioma: lang, origen, empresa: trampa }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.mensaje || 'No se pudo completar la suscripción. Inténtalo de nuevo.');
      setHecho(true);
      alTerminar?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (hecho) {
    return (
      <div role="status" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <Ico name="yes" size={22} style={{ color: 'var(--text-accent)', marginTop: 2 }} />
        <div>
          <p style={{ margin: 0, font: 'var(--type-body)', color: col.titulo }}>{t.listo}</p>
          <p style={{ margin: '4px 0 0', font: 'var(--type-body)', fontSize: 14, color: col.texto }}>{t.listoDetalle}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate>
      {!compacto && (
        <>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: col.titulo }}>
            {t.titulo}
          </p>
          <p style={{ margin: 'var(--space-3) 0 var(--space-5)', font: 'var(--type-body)', fontSize: 15, color: col.texto }}>
            {t.lead}
          </p>
        </>
      )}

      <label htmlFor={idCampo} style={{ display: 'block', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: col.tenue, marginBottom: 6 }}>
        {t.etiqueta}
      </label>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <input
          ref={campo}
          id={idCampo}
          /* type=email saca el teclado con la arroba en el móvil; autoComplete
             deja que el navegador la rellene sin escribirla. */
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
          onBlur={() => email && setError(validar(email))}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? idError : undefined}
          placeholder="tu@empresa.com"
          style={{
            flex: '1 1 220px', minWidth: 0,
            /* 16px o iOS hace zoom al enfocar y descoloca la página; 48 de alto
               para que el dedo acierte sin apuntar. */
            height: 48, padding: '0 14px', fontSize: 16,
            font: 'var(--type-body)', color: col.escrito,
            background: col.campo,
            border: `1px solid ${error ? '#c2410c' : col.borde}`,
            borderRadius: 2,
          }}
        />
        <button
          type="submit"
          disabled={enviando}
          style={{
            height: 48, padding: '0 22px', border: 0, borderRadius: 2,
            background: enviando ? 'var(--slate-400)' : 'var(--accent)',
            color: 'var(--navy-950)', cursor: enviando ? 'progress' : 'pointer',
            font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
            textTransform: 'uppercase', fontSize: 12, fontWeight: 600,
          }}
        >
          {enviando ? t.enviando : t.boton}
        </button>
      </div>

      {/* Trampa para robots. Fuera de la vista pero no con display:none, que
          algunos rellenadores automáticos sí saben saltarse. Ni tabulable ni
          visible para un lector de pantalla: una persona no llega nunca. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={`${idCampo}-e`}>Empresa</label>
        <input id={`${idCampo}-e`} type="text" tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
      </div>

      {error && (
        <p id={idError} role="alert" style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 14, color: '#c2410c' }}>
          {error}
        </p>
      )}

      <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 13, color: col.tenue }}>
        {t.privacidad}
      </p>
    </form>
  );
}
