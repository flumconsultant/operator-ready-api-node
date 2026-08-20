import React from 'react';
import { useLocation } from 'react-router-dom';
import { Ico } from '../icons.jsx';
import { ALMACENAMIENTO } from '../../content/legal.js';

/**
 * Aviso y panel de lo que este sitio guarda en tu navegador.
 *
 * ---- Qué es y qué no es ----
 *
 * No es un muro de consentimiento, porque no habría nada que consentir: el
 * sitio no tiene analítica, ni píxeles, ni scripts de terceros. Pedir permiso
 * para cookies que no existen no protege a nadie; entrena a la gente a aceptar
 * sin leer, y gasta el único momento de atención que tienes con quien acaba de
 * llegar en un trámite falso.
 *
 * Así que dice lo que es verdad —que aquí no se te sigue— y ofrece ver la
 * lista y borrarla. Para una consultora que vende criterio, eso dice más que
 * un banner con dos botones.
 *
 * ---- Y si algún día hay analítica ----
 *
 * El panel ya está: se le añaden los interruptores por categoría, se ponen
 * apagados por defecto y el aviso pasa a tener «Aceptar» y «Rechazar» con el
 * mismo peso visual. La estructura no cambia. Lo que no se hace nunca es
 * encender algo antes de preguntar.
 */

const VISTO = 'become.cookies.visto';
const CLAVES_PROPIAS = ['become.formulario', 'become.suscripcion.cerrado', 'become.suscripcion.hecho'];

const T = {
  es: {
    titulo: 'Aquí no te seguimos',
    texto: 'Este sitio no usa analítica, ni píxeles publicitarios, ni scripts de terceros. Solo guarda lo necesario para que funcione lo que pides.',
    ver: 'Ver qué se guarda',
    ok: 'Entendido',
    cerrar: 'Cerrar',
    panelTitulo: 'Qué guarda este sitio',
    panelLead: 'La lista completa. Son tres cosas y las tres son necesarias para lo que has pedido.',
    borrar: 'Borrar lo guardado',
    borrado: 'Borrado. Lo que estuvieras escribiendo en un formulario se ha perdido.',
    politica: 'Política de cookies',
    politicaRuta: '/es/cookies',
    columnas: ['Qué', 'Para qué', 'Cuánto dura'],
  },
  en: {
    titulo: 'We do not track you here',
    texto: 'This site uses no analytics, no advertising pixels and no third-party scripts. It stores only what is needed for what you ask it to do.',
    ver: 'See what is stored',
    ok: 'Got it',
    cerrar: 'Close',
    panelTitulo: 'What this site stores',
    panelLead: 'The full list. Three things, and all three are needed for what you asked for.',
    borrar: 'Clear what is stored',
    borrado: 'Cleared. Anything you were typing in a form is gone.',
    politica: 'Cookie Policy',
    politicaRuta: '/en/cookies',
    columnas: ['What', 'Purpose', 'How long'],
  },
};

const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const escribir = (k, v) => { try { localStorage.setItem(k, v); } catch { /* modo privado */ } };

/** Se expone para que el pie pueda reabrir el panel desde «Configurar cookies». */
export const abrirPanelCookies = () => window.dispatchEvent(new CustomEvent('become:cookies'));

function Panel({ lang, alCerrar }) {
  const t = T[lang] || T.es;
  const [borrado, setBorrado] = React.useState(false);
  const caja = React.useRef(null);
  const previo = React.useRef(null);

  React.useEffect(() => {
    previo.current = document.activeElement;
    caja.current?.querySelector('button')?.focus();
    const enTecla = (e) => {
      if (e.key === 'Escape') { alCerrar(); return; }
      if (e.key !== 'Tab') return;
      const focos = caja.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focos?.length) return;
      const [primero, ultimo] = [focos[0], focos[focos.length - 1]];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', enTecla);
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', enTecla);
      document.body.style.overflow = antes;
      previo.current?.focus?.();
    };
  }, [alCerrar]);

  const borrar = () => {
    try {
      /* Solo lo nuestro, y por prefijo: barrer el almacén entero borraría lo
         que hayan guardado otras herramientas en el mismo navegador. */
      Object.keys(localStorage)
        .filter((k) => k.startsWith('become.') || CLAVES_PROPIAS.includes(k))
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch { /* modo privado */ }
    setBorrado(true);
  };

  return (
    <div
      onMouseDown={(e) => e.target === e.currentTarget && alCerrar()}
      style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'grid', placeItems: 'center', padding: 'var(--space-5)', background: 'rgba(5,7,15,.72)' }}
    >
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-label={t.panelTitulo}
        style={{
          position: 'relative', width: 'min(680px, 100%)', maxHeight: '84vh', overflowY: 'auto',
          background: 'var(--navy-950)', color: 'var(--white)', borderRadius: 2,
          border: '1px solid var(--border-hairline-dark)', padding: 'var(--space-8)',
          boxShadow: '0 30px 80px rgba(0,0,0,.55)',
        }}
      >
        <button
          type="button" onClick={alCerrar} aria-label={t.cerrar}
          style={{ position: 'absolute', top: 6, right: 6, width: 44, height: 44, display: 'grid', placeItems: 'center', border: 0, background: 'transparent', color: 'var(--slate-400)', cursor: 'pointer' }}
        >
          <Ico name="no" size={20} />
        </button>

        <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: 'var(--electric-green)' }}>
          {t.titulo}
        </p>
        <h2 style={{ margin: 'var(--space-3) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>
          {t.panelTitulo}
        </h2>
        <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 15, color: 'var(--slate-300)' }}>
          {t.panelLead}
        </p>

        <div style={{ marginTop: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
          {ALMACENAMIENTO.map((a) => (
            <div key={a.nombre} style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
              <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 13, color: 'var(--electric-green)' }}>{a.nombre}</p>
              <p style={{ margin: '4px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--slate-300)' }}>{a.finalidad[lang]}</p>
              <p style={{ margin: '4px 0 0', font: 'var(--type-mono)', fontSize: 12, color: 'var(--slate-400)' }}>
                {a.categoria[lang]} · {a.duracion[lang]}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-7)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button" onClick={borrar} disabled={borrado}
            style={{
              minHeight: 44, padding: '0 20px', borderRadius: 2, cursor: borrado ? 'default' : 'pointer',
              background: 'transparent', color: borrado ? 'var(--slate-400)' : 'var(--white)',
              border: '1px solid var(--border-hairline-dark)',
              font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11,
            }}
          >
            {t.borrar}
          </button>
          <a href={t.politicaRuta} style={{ font: 'var(--type-mono)', fontSize: 13, color: 'var(--electric-green)' }}>
            {t.politica}
          </a>
        </div>
        <p aria-live="polite" style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', fontSize: 13, color: 'var(--electric-green)', minHeight: '1.2em' }}>
          {borrado ? t.borrado : ''}
        </p>
      </div>
    </div>
  );
}

export default function Cookies() {
  const { pathname } = useLocation();
  const lang = pathname.startsWith('/en') ? 'en' : 'es';
  const t = T[lang] || T.es;

  const [aviso, setAviso] = React.useState(false);
  const [panel, setPanel] = React.useState(false);

  React.useEffect(() => {
    if (pathname.startsWith('/admin')) return undefined;
    /* Un momento de margen: el aviso que aparece a la vez que la página
       compite con lo primero que la persona ha venido a leer. */
    const reloj = setTimeout(() => { if (!leer(VISTO)) setAviso(true); }, 1200);
    const abrir = () => setPanel(true);
    window.addEventListener('become:cookies', abrir);
    return () => { clearTimeout(reloj); window.removeEventListener('become:cookies', abrir); };
  }, [pathname]);

  const cerrarAviso = () => { escribir(VISTO, String(Date.now())); setAviso(false); };

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {aviso && (
        <div
          role="region"
          aria-label={t.panelTitulo}
          style={{
            position: 'fixed', zIndex: 1100,
            left: 'max(16px, env(safe-area-inset-left))',
            bottom: 'max(16px, env(safe-area-inset-bottom))',
            width: 'min(380px, calc(100vw - 32px))',
            background: 'var(--navy-950)', color: 'var(--white)',
            border: '1px solid var(--border-hairline-dark)', borderRadius: 2,
            padding: 'var(--space-6)',
            boxShadow: '0 20px 60px rgba(5,7,15,.5)',
            animation: 'becomeCookies .28s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <style>{`
            @keyframes becomeCookies { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform:none } }
            @media (prefers-reduced-motion: reduce) { [role=region] { animation: none !important } }
          `}</style>

          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: 'var(--electric-green)' }}>
            <Ico name="trust" size={16} /> {t.titulo}
          </p>
          <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--slate-300)' }}>
            {t.texto}
          </p>
          <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button
              type="button" onClick={cerrarAviso}
              style={{
                minHeight: 44, padding: '0 20px', border: 0, borderRadius: 2, cursor: 'pointer',
                background: 'var(--accent)', color: 'var(--navy-950)',
                font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, fontWeight: 600,
              }}
            >
              {t.ok}
            </button>
            <button
              type="button" onClick={() => setPanel(true)}
              style={{
                minHeight: 44, padding: '0 16px', borderRadius: 2, cursor: 'pointer',
                background: 'transparent', color: 'var(--white)',
                border: '1px solid var(--border-hairline-dark)',
                font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11,
              }}
            >
              {t.ver}
            </button>
          </div>
        </div>
      )}

      {panel && <Panel lang={lang} alCerrar={() => { setPanel(false); cerrarAviso(); }} />}
    </>
  );
}
