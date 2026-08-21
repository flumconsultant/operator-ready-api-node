import React from 'react';
import { useLocation } from 'react-router-dom';
import { Ico } from '../icons.jsx';
import { ALMACENAMIENTO } from '../../content/legal.js';
import {
  decisionGuardada, aceptarAnalitica, rechazarAnalitica,
} from '../../analitica.js';

/**
 * El consentimiento de cookies.
 *
 * ---- Qué cambió, y por qué el aviso ya no puede ser informativo ----
 *
 * Antes este componente decía «aquí no te seguimos» y era verdad: no había
 * analítica, ni píxeles, ni un solo script de terceros, así que pedir permiso
 * habría sido un trámite falso.
 *
 * Con Google Analytics instalado eso deja de ser cierto, y un aviso que solo
 * informa deja de valer: hay una cookie de terceros que identifica al visitante
 * entre páginas y una transferencia de datos a otro país. Eso se consiente o no
 * se hace.
 *
 * ---- Las reglas que sigue, y por qué ----
 *
 * · Aceptar y Rechazar tienen el MISMO peso visual. Un «rechazar» en gris
 *   pequeño al lado de un «aceptar» verde grande es la forma más común de
 *   invalidar un consentimiento: el que decide no es la persona, es el diseño.
 * · Rechazar cuesta un clic, igual que aceptar. Nada de «configurar» como
 *   único camino para decir que no.
 * · Nada se enciende antes de responder. La etiqueta de Google se carga en
 *   todas las páginas, pero con todos los permisos denegados: en ese estado no
 *   escribe cookies. Solo al aceptar pasan a concedidos.
 * · Cambiar de opinión es posible y borra lo que se escribió mientras tanto.
 *   Un rechazo posterior que dejara las cookies puestas no sería un rechazo.
 *
 * Y no se cierra solo al hacer scroll ni al seguir navegando: seguir leyendo no
 * es decir que sí.
 */

const VISTO = 'become.cookies.visto';
const CLAVES_PROPIAS = ['become.formulario', 'become.suscripcion.cerrado', 'become.suscripcion.hecho'];

const T = {
  es: {
    titulo: 'Cookies y medición',
    texto: 'Usamos Google Analytics para saber qué páginas se leen y desde dónde. No vendemos ni compartimos tus datos, y no hay publicidad. Puedes decir que no y el sitio funciona igual.',
    aceptar: 'Aceptar',
    rechazar: 'Rechazar',
    ver: 'Ver detalle',
    cerrar: 'Cerrar',
    panelTitulo: 'Qué guarda este sitio',
    panelLead: 'La lista completa, y qué depende de tu decisión.',
    medicion: 'Medición con Google Analytics',
    medicionQue: 'Cuenta visitas y páginas vistas para saber qué contenido sirve. Escribe cookies propias del sitio y envía los datos a Google, en Estados Unidos.',
    activa: 'Activada',
    inactiva: 'Desactivada',
    necesarias: 'Estrictamente necesarias',
    necesariasQue: 'Sin estas no funciona lo que pides. No se pueden desactivar y no sirven para seguirte.',
    borrar: 'Borrar lo guardado',
    borrado: 'Borrado. Lo que estuvieras escribiendo en un formulario se ha perdido.',
    politica: 'Política de cookies',
    politicaRuta: '/es/cookies',
    guardar: 'Guardar decisión',
  },
  en: {
    titulo: 'Cookies and measurement',
    texto: 'We use Google Analytics to know which pages get read and where from. We don’t sell or share your data, and there is no advertising. You can say no and the site works the same.',
    aceptar: 'Accept',
    rechazar: 'Reject',
    ver: 'See details',
    cerrar: 'Close',
    panelTitulo: 'What this site stores',
    panelLead: 'The full list, and what depends on your choice.',
    medicion: 'Measurement with Google Analytics',
    medicionQue: 'Counts visits and page views so we know which content is useful. It writes first-party cookies and sends the data to Google, in the United States.',
    activa: 'On',
    inactiva: 'Off',
    necesarias: 'Strictly necessary',
    necesariasQue: 'Without these, what you ask for does not work. They cannot be switched off and they are not used to track you.',
    borrar: 'Clear what is stored',
    borrado: 'Cleared. Anything you were typing in a form is gone.',
    politica: 'Cookie Policy',
    politicaRuta: '/en/cookies',
    guardar: 'Save choice',
  },
};

const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const escribir = (k, v) => { try { localStorage.setItem(k, v); } catch { /* modo privado */ } };

/** Se expone para que el pie pueda reabrir el panel desde «Configurar cookies». */
export const abrirPanelCookies = () => window.dispatchEvent(new CustomEvent('become:cookies'));

const botonBase = {
  minHeight: 44, padding: '0 20px', borderRadius: 2, cursor: 'pointer',
  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase', fontSize: 11, fontWeight: 600,
  flex: '1 1 130px',
};

function Panel({ lang, alCerrar, decision, alDecidir }) {
  const t = T[lang] || T.es;
  const [borrado, setBorrado] = React.useState(false);
  const [medicion, setMedicion] = React.useState(decision === 'aceptado');
  const caja = React.useRef(null);
  const previo = React.useRef(null);

  React.useEffect(() => {
    previo.current = document.activeElement;
    caja.current?.querySelector('button')?.focus();
    const enTecla = (e) => {
      if (e.key === 'Escape') { alCerrar(); return; }
      if (e.key !== 'Tab') return;
      const focos = caja.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])');
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

        {/* La medición, con su interruptor. Apagado si nunca se aceptó: lo que
            no se ha consentido no puede aparecer encendido. */}
        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-hairline-dark)' }}>
          <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={medicion}
              onChange={(e) => setMedicion(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 3, flex: 'none', accentColor: 'var(--electric-green)' }}
            />
            <span>
              <span style={{ display: 'block', font: 'var(--type-body)', fontSize: 15, color: 'var(--white)' }}>
                {t.medicion} · {medicion ? t.activa : t.inactiva}
              </span>
              <span style={{ display: 'block', margin: '4px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--slate-300)' }}>
                {t.medicionQue}
              </span>
            </span>
          </label>
        </div>

        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-hairline-dark)' }}>
          <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 15, color: 'var(--white)' }}>{t.necesarias}</p>
          <p style={{ margin: '4px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--slate-300)' }}>{t.necesariasQue}</p>
        </div>

        <div style={{ marginTop: 'var(--space-5)', display: 'grid', gap: 'var(--space-4)' }}>
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

        <div style={{ marginTop: 'var(--space-7)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => { alDecidir(medicion ? 'aceptado' : 'rechazado'); alCerrar(); }}
            style={{ ...botonBase, border: 0, background: 'var(--accent)', color: 'var(--navy-950)' }}
          >
            {t.guardar}
          </button>
          <button
            type="button" onClick={borrar} disabled={borrado}
            style={{
              ...botonBase, fontWeight: 400,
              background: 'transparent', color: borrado ? 'var(--slate-400)' : 'var(--white)',
              border: '1px solid var(--border-hairline-dark)', cursor: borrado ? 'default' : 'pointer',
            }}
          >
            {t.borrar}
          </button>
        </div>
        <p style={{ margin: 'var(--space-5) 0 0' }}>
          <a href={t.politicaRuta} style={{ font: 'var(--type-mono)', fontSize: 13, color: 'var(--electric-green)' }}>
            {t.politica}
          </a>
        </p>
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
  const [decision, setDecision] = React.useState(() => decisionGuardada());

  React.useEffect(() => {
    if (pathname.startsWith('/admin')) return undefined;
    /* Un momento de margen: el aviso que aparece a la vez que la página
       compite con lo primero que la persona ha venido a leer. */
    const reloj = setTimeout(() => { if (!decisionGuardada()) setAviso(true); }, 1200);
    const abrir = () => setPanel(true);
    window.addEventListener('become:cookies', abrir);
    return () => { clearTimeout(reloj); window.removeEventListener('become:cookies', abrir); };
  }, [pathname]);

  const decidir = React.useCallback((valor) => {
    if (valor === 'aceptado') aceptarAnalitica(); else rechazarAnalitica();
    escribir(VISTO, String(Date.now()));
    setDecision(valor);
    setAviso(false);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {aviso && (
        <div
          role="region"
          aria-label={t.titulo}
          style={{
            position: 'fixed', zIndex: 1100,
            left: 'max(16px, env(safe-area-inset-left))',
            bottom: 'max(16px, env(safe-area-inset-bottom))',
            width: 'min(400px, calc(100vw - 32px))',
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

          {/* Los dos con el mismo tamaño, el mismo alto y el mismo peso. Un
              «rechazar» más pequeño o más apagado que el «aceptar» invalida el
              consentimiento: quien decide deja de ser la persona. */}
          <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button
              type="button" onClick={() => decidir('aceptado')}
              style={{ ...botonBase, border: 0, background: 'var(--accent)', color: 'var(--navy-950)' }}
            >
              {t.aceptar}
            </button>
            <button
              type="button" onClick={() => decidir('rechazado')}
              style={{ ...botonBase, background: 'transparent', color: 'var(--white)', border: '1px solid var(--white)' }}
            >
              {t.rechazar}
            </button>
          </div>
          <button
            type="button" onClick={() => setPanel(true)}
            style={{
              marginTop: 'var(--space-4)', minHeight: 44, padding: 0, border: 0, background: 'none',
              cursor: 'pointer', font: 'var(--type-mono)', fontSize: 13, color: 'var(--electric-green)',
              textDecoration: 'underline',
            }}
          >
            {t.ver}
          </button>
        </div>
      )}

      {panel && (
        <Panel
          lang={lang}
          decision={decision}
          alDecidir={decidir}
          alCerrar={() => setPanel(false)}
        />
      )}
    </>
  );
}
