import React from 'react';
import { useLocation } from 'react-router-dom';
import { Ico } from '../icons.jsx';
import Formulario from './Formulario.jsx';

/**
 * La invitación a suscribirse: un botón discreto abajo a la derecha y un aviso
 * que aparece solo si alguien ha leído de verdad.
 *
 * ---- Sobre el aviso, y por qué está regulado como está ----
 *
 * Un aviso que interrumpe la lectura es la forma más rápida de convertir una
 * visita en un cierre de pestaña, y en un sitio que vende criterio hace además
 * un daño que no se ve: quien lo recibe deduce que aquí se prioriza capturar
 * un correo sobre dejarle terminar el párrafo. Por eso no basta con «que salga
 * más tarde». Las condiciones son acumulativas y todas tienen que cumplirse:
 *
 * 1. Solo en artículos. En la home o en la página de contacto, quien llega
 *    tiene otra intención y el aviso la interrumpe sin haber dado nada a cambio.
 * 2. Solo si se ha bajado más del 55% del artículo. Es la señal de que se está
 *    leyendo y no ojeando.
 * 3. Solo después de 40 segundos. El scroll rápido hasta el final no es leer.
 * 4. Una vez. Si se cierra, no vuelve en noventa días. Si alguien se suscribe,
 *    no vuelve nunca.
 *
 * El botón flotante no tiene ninguna de esas condiciones porque no interrumpe:
 * está ahí quieto para quien lo busque, y se puede cerrar.
 *
 * ---- Accesibilidad del aviso ----
 *
 * Es un diálogo de verdad: role="dialog" con aria-modal, el foco entra dentro
 * al abrirse y no se escapa mientras está abierto, Escape lo cierra, y al
 * cerrarse el foco vuelve exactamente al elemento que lo abrió. Sin la
 * devolución del foco, quien navega con teclado acaba tabulando desde el
 * principio de la página y no encuentra dónde se quedó.
 */

const CLAVE_CERRADO = 'become.suscripcion.cerrado';
const CLAVE_DENTRO = 'become.suscripcion.hecho';
const DIAS_SILENCIO = 90;
const UMBRAL_SCROLL = 0.55;
const SEGUNDOS = 40;

const T = {
  es: {
    abrir: 'Suscribirse a los artículos',
    cerrar: 'Cerrar',
    ahora: 'Suscribirme',
  },
  en: {
    abrir: 'Subscribe to the articles',
    cerrar: 'Close',
    ahora: 'Subscribe',
  },
};

/* localStorage falla en modo privado de algunos navegadores. Si falla, el
   aviso simplemente se comporta como si nunca se hubiera cerrado: molesto,
   pero mejor que romper la página. */
const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const escribir = (k, v) => { try { localStorage.setItem(k, v); } catch { /* modo privado */ } };

/* El aviso de cookies sale primero. Dos elementos fijos a la vez se tapan en
   un móvil, y el que interrumpe menos es el que debe esperar. */
const cookiesVistas = () => !!leer('become.consentimiento.v1');

function yaNoMolestar() {
  if (leer(CLAVE_DENTRO)) return true;
  const cerrado = Number(leer(CLAVE_CERRADO) || 0);
  return cerrado > 0 && Date.now() - cerrado < DIAS_SILENCIO * 86400000;
}

function Dialogo({ lang, origen, alCerrar }) {
  const t = T[lang] || T.es;
  const caja = React.useRef(null);
  const previo = React.useRef(null);

  React.useEffect(() => {
    previo.current = document.activeElement;
    /* El primer campo, no el botón de cerrar: quien abre esto quiere escribir
       su correo, y empezar por «cerrar» sugiere que lo normal es irse. */
    caja.current?.querySelector('input:not([tabindex="-1"])')?.focus();

    const enTecla = (e) => {
      if (e.key === 'Escape') { alCerrar(); return; }
      if (e.key !== 'Tab') return;
      const focos = caja.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focos?.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      /* El ciclo se cierra a mano: sin esto, tabular sale del diálogo y se
         sigue por la página de detrás, que está tapada y no se ve. */
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

  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      onMouseDown={(e) => e.target === e.currentTarget && alCerrar()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'grid', placeItems: 'center', padding: 'var(--space-5)',
        /* El velo no es decoración: dice que lo de detrás está inactivo y que
           pulsar fuera cierra. */
        background: 'rgba(5,7,15,.62)',
        animation: reduce ? 'none' : 'becomeVelo .18s ease-out',
      }}
    >
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-label={T[lang]?.abrir || T.es.abrir}
        style={{
          position: 'relative', width: 'min(460px, 100%)', overflow: 'hidden',
          /* Navy, retícula y destello: el mismo lenguaje que el panel de
             cookies y que la tarjeta de compartir. Tres piezas que aparecen
             encima del sitio deben parecer la misma familia, o el sitio parece
             tres sitios. */
          background: 'var(--navy-950)', borderRadius: 2,
          border: '1px solid var(--border-hairline-dark)',
          padding: 'var(--space-8)',
          boxShadow: '0 30px 80px rgba(5,7,15,.55)',
          animation: reduce ? 'none' : 'becomeAviso .22s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <button
          type="button"
          onClick={alCerrar}
          aria-label={t.cerrar}
          style={{
            position: 'absolute', top: 6, right: 6, width: 44, height: 44,
            display: 'grid', placeItems: 'center',
            border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--slate-400)', zIndex: 1,
          }}
        >
          <Ico name="no" size={20} />
        </button>
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
        <span aria-hidden="true" style={{
          position: 'absolute', width: 420, height: 420, right: -160, top: -180, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(0,255,136,.16) 0%, rgba(0,255,136,0) 62%)',
        }} />
        <div style={{ position: 'relative' }}>
          <Formulario lang={lang} origen={origen} oscuro alTerminar={() => escribir(CLAVE_DENTRO, '1')} />
        </div>
      </div>
    </div>
  );
}

export default function Invitacion() {
  const { pathname } = useLocation();
  const lang = pathname.startsWith('/en') ? 'en' : 'es';
  const t = T[lang] || T.es;

  const [abierto, setAbierto] = React.useState(false);
  const [ofrecer, setOfrecer] = React.useState(false);
  const [botonVisible, setBotonVisible] = React.useState(!yaNoMolestar());
  const [libre, setLibre] = React.useState(cookiesVistas);

  React.useEffect(() => {
    if (libre) return undefined;
    const reloj = setInterval(() => { if (cookiesVistas()) { setLibre(true); clearInterval(reloj); } }, 800);
    return () => clearInterval(reloj);
  }, [libre]);

  const esArticulo = /^\/(es|en)\/insights\/.+/.test(pathname);
  /* El panel es una herramienta de trabajo, no una página de captación. */
  const zonaVetada = pathname.startsWith('/admin');

  React.useEffect(() => { setOfrecer(false); }, [pathname]);

  React.useEffect(() => {
    if (!esArticulo || ofrecer || abierto || yaNoMolestar()) return undefined;

    const desde = Date.now();
    let leido = false;

    const mirar = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      if (alto <= 0) return;
      if ((window.scrollY / alto) >= UMBRAL_SCROLL) leido = true;
      if (leido && Date.now() - desde >= SEGUNDOS * 1000) {
        setOfrecer(true);
        setAbierto(true);
      }
    };

    /* passive: el navegador no tiene que esperar a ver si este manejador
       cancela el scroll, así que el desplazamiento no se traba. */
    window.addEventListener('scroll', mirar, { passive: true });
    const reloj = setInterval(mirar, 2000);
    return () => { window.removeEventListener('scroll', mirar); clearInterval(reloj); };
  }, [pathname, esArticulo, ofrecer, abierto]);

  const cerrar = React.useCallback(() => {
    setAbierto(false);
    escribir(CLAVE_CERRADO, String(Date.now()));
    setBotonVisible(false);
  }, []);

  if (zonaVetada) return null;

  return (
    <>
      <style>{`
        @keyframes becomeVelo { from { opacity: 0 } to { opacity: 1 } }
        @keyframes becomeAviso {
          from { opacity: 0; transform: translateY(12px) scale(.98) }
          to   { opacity: 1; transform: none }
        }
      `}</style>

      {/* El botón se esconde mientras el diálogo está abierto: un elemento fijo
          por encima puede tapar el control que tiene el foco, y eso es
          justamente lo que prohíbe la regla de foco no obstruido. */}
      {/* Solo en artículos, y por encima del de agendar.
          Antes salía en todo el sitio, pero desde que agendar tiene su propio
          botón fijo, dos pastillas en la misma esquina compiten y no se pulsa
          ninguna. Suscribirse solo significa algo donde hay algo que leer, así
          que aquí es donde se queda. */}
      {esArticulo && botonVisible && libre && !abierto && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          style={{
            position: 'fixed', zIndex: 900,
            right: 'max(16px, env(safe-area-inset-right))',
            /* 52 del botón de agendar + 12 de aire: se apilan, no se tapan. */
            bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 64px)',
            height: 48, padding: '0 18px', borderRadius: 999, border: 0,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--navy-950)', color: 'var(--white)', cursor: 'pointer',
            font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
            textTransform: 'uppercase', fontSize: 11,
            border: '1px solid rgba(0,255,136,.28)',
            boxShadow: '0 8px 28px rgba(5,7,15,.28), 0 0 0 4px rgba(0,255,136,.08)',
          }}
        >
          <Ico name="chat" size={18} style={{ color: 'var(--accent)' }} />
          {t.ahora}
        </button>
      )}

      {abierto && <Dialogo lang={lang} origen={pathname.slice(0, 60)} alCerrar={cerrar} />}
    </>
  );
}
