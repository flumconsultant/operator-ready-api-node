import React from 'react';
import { useLocation } from 'react-router-dom';
import { Ico } from './icons.jsx';

/**
 * El botón flotante para agendar una llamada de 30 minutos.
 *
 * ---- Por qué un enlace y no el widget de Calendly ----
 *
 * Calendly ofrece un script que incrusta el calendario dentro de la página.
 * Convierte algo mejor, y aun así no se usa aquí: ese script carga en todas las
 * páginas y escribe sus propias cookies de terceros. Acabaríamos con la
 * política de cookies contradiciendo otra vez al código, tres días después de
 * corregirla, y con una transferencia más que declarar.
 *
 * Un enlace que abre Calendly en otra pestaña no carga nada de terceros, no
 * escribe cookies aquí y funciona igual de rápido. Si algún día se quiere el
 * calendario incrustado, se hace con un iframe que solo se cargue AL PULSAR
 * —una acción deliberada— y se añade Calendly a la tabla de proveedores.
 *
 * ---- Por qué solo hay un botón flotante y este se lleva el sitio ----
 *
 * Ya había uno de suscripción abajo a la derecha, y el aviso de cookies abajo a
 * la izquierda. Un tercer elemento fijo no es «una llamada a la acción más»:
 * es la garantía de que no se pulsa ninguna, porque tres cosas compitiendo por
 * la misma esquina se leen como ruido y se ignoran juntas.
 *
 * Así que agendar se queda el sitio fijo en todo el sitio, y el de suscripción
 * pasa a aparecer solo en los artículos —que es donde suscribirse significa
 * algo, porque hay algo que leer—. No se pierde nada: la suscripción sigue
 * teniendo su aviso al terminar de leer y su formulario al pie.
 *
 * ---- Y por qué se puede cerrar, pero vuelve ----
 *
 * Un botón fijo que no se puede quitar tapa contenido en un móvil y no hay
 * salida. Este se cierra. Pero vuelve a los siete días: no es un aviso que ya
 * se ha leído, es el camino a la acción principal del negocio, y esconderlo
 * para siempre por un clic de más sería tirar la conversión por la ventana.
 */

export const CALENDLY = 'https://calendly.com/become-carlos-ramirez/30min';

const CLAVE_CERRADO = 'become.agenda.cerrado';
const DIAS_SILENCIO = 7;

const T = {
  es: {
    boton: 'Agenda 30 min',
    aria: 'Agendar una llamada de 30 minutos con Carlos Andrés Ramírez, se abre en una pestaña nueva',
    cerrar: 'Ocultar',
    tituloCta: '¿Prefieres hablarlo directamente?',
    textoCta: 'Treinta minutos con Carlos Andrés Ramírez para revisar tu punto de partida y decirte, con criterio, qué haría falta. Sin presentación comercial.',
    botonCta: 'Agendar 30 minutos',
    nota: 'Se abre en Calendly, en una pestaña nueva.',
  },
  en: {
    boton: 'Book 30 min',
    aria: 'Book a 30-minute call with Carlos Andrés Ramírez, opens in a new tab',
    cerrar: 'Hide',
    tituloCta: 'Would you rather talk it through?',
    textoCta: 'Thirty minutes with Carlos Andrés Ramírez to look at your starting point and tell you, with judgment, what it would take. No sales deck.',
    botonCta: 'Book 30 minutes',
    nota: 'Opens Calendly in a new tab.',
  },
};

const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const escribir = (k, v) => { try { localStorage.setItem(k, v); } catch { /* modo privado */ } };

/* El aviso de cookies sale primero: dos elementos fijos a la vez se tapan en un
   móvil, y el que interrumpe menos es el que debe esperar. */
const cookiesRespondidas = () => !!leer('become.consentimiento.v1');

const silenciado = () => {
  const cerrado = Number(leer(CLAVE_CERRADO) || 0);
  return cerrado > 0 && Date.now() - cerrado < DIAS_SILENCIO * 86400000;
};

/**
 * Se anota en la medición.
 *
 * Es el evento que de verdad importa del sitio: cuántas personas dan el paso de
 * agendar. Sin esto, en el informe una visita que agenda y una que se va se ven
 * exactamente igual.
 */
export function avisarClicAgenda(donde) {
  try {
    window.gtag?.('event', 'agendar_llamada', {
      origen: donde,
      transport_type: 'beacon',
    });
  } catch { /* la medición nunca puede impedir que se agende */ }
}

/** El enlace, con el trato que necesita cualquier salida a otro dominio. */
export function EnlaceAgenda({ lang = 'es', origen, children, style, className }) {
  const t = T[lang] || T.es;
  return (
    <a
      href={CALENDLY}
      target="_blank"
      /* noopener por seguridad; noreferrer además porque no hay razón para
         contarle a Calendly desde qué página exacta salió cada visita. */
      rel="noopener noreferrer"
      onClick={() => avisarClicAgenda(origen)}
      aria-label={t.aria}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

/** La llamada a la acción en el cuerpo de una página. */
export function BloqueAgenda({ lang = 'es', origen = 'bloque', dark = false }) {
  const t = T[lang] || T.es;
  return (
    <div style={{
      marginTop: 'var(--space-9)', padding: 'var(--space-7)',
      border: `1px solid ${dark ? 'var(--green-line)' : 'var(--border-strong)'}`,
      borderRadius: 2,
      background: dark ? 'rgba(0,255,136,.04)' : 'var(--white)',
      maxWidth: 'var(--maxw-prose)',
    }}>
      <p style={{
        margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
        fontSize: 'var(--text-h3)', lineHeight: 1.28,
        color: dark ? 'var(--white)' : 'var(--text-heading)',
      }}>
        {t.tituloCta}
      </p>
      <p style={{
        margin: 'var(--space-4) 0 0', font: 'var(--type-body)',
        color: dark ? 'var(--slate-200)' : 'var(--text-muted)',
      }}>
        {t.textoCta}
      </p>
      <EnlaceAgenda
        lang={lang}
        origen={origen}
        style={{
          marginTop: 'var(--space-6)', minHeight: 48, padding: '0 24px',
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'var(--accent)', color: 'var(--navy-950)',
          borderRadius: 2, textDecoration: 'none',
          font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
          textTransform: 'uppercase', fontSize: 12, fontWeight: 600,
        }}
      >
        <Ico name="calendar" size={17} />
        {t.botonCta}
      </EnlaceAgenda>
      <p style={{
        margin: 'var(--space-4) 0 0', font: 'var(--type-mono)', fontSize: 12,
        color: dark ? 'var(--slate-400)' : 'var(--text-faint)',
      }}>
        {t.nota}
      </p>
    </div>
  );
}

export default function Agendar() {
  const { pathname } = useLocation();
  const lang = pathname.startsWith('/en') ? 'en' : 'es';
  const t = T[lang] || T.es;

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (pathname.startsWith('/admin')) return undefined;
    if (silenciado()) return undefined;

    /* Espera a que se responda a las cookies y da un respiro: aparecer a la vez
       que la página compite con lo primero que se ha venido a leer. */
    const intenta = () => { if (cookiesRespondidas()) setVisible(true); };
    const reloj = setTimeout(intenta, 1800);
    const vigila = setInterval(intenta, 900);
    return () => { clearTimeout(reloj); clearInterval(vigila); };
  }, [pathname]);

  React.useEffect(() => {
    if (visible) return undefined;
    return undefined;
  }, [visible]);

  /* En la propia página de contacto sobra: ahí ya está el formulario y el
     bloque de agendar en el cuerpo, y un botón flotante encima solo taparía
     lo que la persona ha venido a hacer. */
  const enContacto = /^\/(es\/contacto|en\/contact)$/.test(pathname);

  if (pathname.startsWith('/admin') || enContacto || !visible) return null;

  return (
    <div
      style={{
        position: 'fixed', zIndex: 950,
        right: 'max(16px, env(safe-area-inset-right))',
        bottom: 'max(16px, env(safe-area-inset-bottom))',
        display: 'flex', alignItems: 'center', gap: 6,
        animation: 'becomeAgenda .32s cubic-bezier(.2,.7,.2,1)',
      }}
    >
      <style>{`
        @keyframes becomeAgenda { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform:none } }
        @media (prefers-reduced-motion: reduce) { [data-agenda] { animation: none !important } }
        .becomeAgendaBoton { transition: transform .2s ease, box-shadow .2s ease }
        .becomeAgendaBoton:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,255,136,.28) }
        @media (prefers-reduced-motion: reduce) { .becomeAgendaBoton:hover { transform: none } }
      `}</style>

      <EnlaceAgenda
        lang={lang}
        origen="flotante"
        className="becomeAgendaBoton"
        style={{
          height: 52, padding: '0 22px',
          display: 'inline-flex', alignItems: 'center', gap: 10,
          borderRadius: 999, textDecoration: 'none',
          background: 'var(--accent)', color: 'var(--navy-950)',
          font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
          textTransform: 'uppercase', fontSize: 12, fontWeight: 600,
          boxShadow: '0 10px 30px rgba(5,7,15,.35), 0 0 0 4px rgba(0,255,136,.12)',
        }}
      >
        <Ico name="calendar" size={18} />
        {t.boton}
      </EnlaceAgenda>

      {/* Cerrar: un elemento fijo sin salida tapa contenido en un móvil y no
          hay forma de quitarlo. 44 px, aunque el icono sea pequeño. */}
      <button
        type="button"
        onClick={() => { escribir(CLAVE_CERRADO, String(Date.now())); setVisible(false); }}
        aria-label={t.cerrar}
        style={{
          width: 44, height: 44, display: 'grid', placeItems: 'center',
          border: 0, borderRadius: 999, cursor: 'pointer',
          background: 'var(--navy-950)', color: 'var(--slate-300)',
          boxShadow: '0 8px 22px rgba(5,7,15,.3)',
        }}
      >
        <Ico name="no" size={16} />
      </button>
    </div>
  );
}
