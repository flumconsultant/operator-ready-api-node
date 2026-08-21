/**
 * Google Analytics 4, con consentimiento.
 *
 * ---- Por qué no es solo pegar el fragmento ----
 *
 * El fragmento que da Google carga la etiqueta y empieza a escribir cookies en
 * cuanto se abre la página. Hacer eso aquí rompería tres cosas a la vez:
 *
 *   · La política de cookies publicada dice, con todas las letras, que este
 *     sitio no usa analítica. Un texto legal que se contradice con el código no
 *     es un detalle de redacción: es lo primero que mira quien reclama.
 *   · El aviso de privacidad dice «aquí no te seguimos».
 *   · Y encender algo antes de preguntar es exactamente lo que la propia
 *     página promete que no se hará nunca.
 *
 * ---- Cómo se resuelve sin perder medición ----
 *
 * Con el modo de consentimiento de Google (Consent Mode v2). La etiqueta se
 * carga en todas las páginas, pero arranca con TODOS los permisos denegados: en
 * ese estado no escribe una sola cookie ni identifica a nadie, y aun así envía
 * señales sin cookies que GA sí contabiliza. Es decir, se mide el tráfico
 * completo desde el primer momento; lo que no ocurre hasta que alguien acepta
 * es la parte que necesita cookies —distinguir visitas nuevas de recurrentes y
 * seguir una sesión entre páginas—.
 *
 * Al aceptar, los permisos pasan a concedidos y GA empieza a contar como
 * siempre. Al rechazar, se quedan denegados y no hay cookies.
 *
 * ---- Y por qué el page_view se manda a mano ----
 *
 * Este sitio es una SPA: al navegar no hay recarga, así que la etiqueta solo
 * vería la primera página de cada visita. `send_page_view: false` apaga el
 * automático y cada cambio de ruta manda el suyo, con la dirección y el título
 * ya actualizados. Sin esto, en el informe todo el tráfico aparecería como si
 * entrara por la home y se fuera sin ver nada más.
 */

export const MEDICION = 'G-VXPXSDD12K';

/* La decisión se guarda con la versión: si algún día se añade otra categoría,
   el consentimiento viejo deja de valer y se vuelve a preguntar, en vez de dar
   por consentido algo que nadie consintió. */
export const CLAVE_CONSENTIMIENTO = 'become.consentimiento.v1';

const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const escribir = (k, v) => { try { localStorage.setItem(k, v); } catch { /* modo privado */ } };

export const decisionGuardada = () => leer(CLAVE_CONSENTIMIENTO);

function gtag() {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}
window.gtag = window.gtag || gtag;

let arrancada = false;

/**
 * Los cuatro permisos del modo de consentimiento v2.
 *
 * Por defecto los cuatro van denegados. Al aceptar se concede SOLO el de
 * analítica: los tres de publicidad se quedan denegados para siempre, porque
 * este sitio no tiene publicidad ni remarketing y conceder un permiso que no
 * se usa es pedir más de lo necesario. La política dice «no hay publicidad», y
 * esto es lo que hace que sea verdad y no una intención.
 */
const TODOS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];
const denegarTodo = () => Object.fromEntries(TODOS.map((k) => [k, 'denied']));
const soloAnalitica = () => ({ ...denegarTodo(), analytics_storage: 'granted' });

/**
 * Carga la etiqueta una sola vez, con todo denegado por defecto.
 *
 * El `default` tiene que declararse ANTES de que cargue gtag.js, o durante ese
 * hueco la etiqueta funcionaría en su modo normal —con cookies— y el
 * consentimiento llegaría tarde. Por eso las dos cosas están aquí y en este
 * orden, y no repartidas entre el HTML y el componente del aviso.
 */
export function arrancarAnalitica() {
  if (arrancada || typeof window === 'undefined') return;
  /* El panel de administración no se mide: es una herramienta de trabajo, no
     una página del sitio, y su tráfico ensuciaría el informe con las visitas
     de quien lo edita. */
  if (window.location.pathname.startsWith('/admin')) return;
  arrancada = true;

  gtag('consent', 'default', {
    ...denegarTodo(),
    wait_for_update: 500,
  });

  const guardada = decisionGuardada();
  if (guardada === 'aceptado') gtag('consent', 'update', soloAnalitica());

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEDICION}`;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', MEDICION, {
    send_page_view: false,
    /* Sin dominio de cookie explícito, GA la escribiría también para
       subdominios que no son del sitio. */
    cookie_domain: 'auto',
    cookie_flags: 'SameSite=Lax;Secure',
    anonymize_ip: true,
  });

  paginaVista();
}

/** Una vista de página, con la dirección y el título que hay AHORA. */
export function paginaVista(ruta) {
  if (!arrancada) return;
  const camino = ruta || window.location.pathname + window.location.search;
  gtag('event', 'page_view', {
    page_path: camino,
    page_location: window.location.origin + camino,
    page_title: document.title,
  });
}

export function aceptarAnalitica() {
  escribir(CLAVE_CONSENTIMIENTO, 'aceptado');
  gtag('consent', 'update', soloAnalitica());
}

export function rechazarAnalitica() {
  escribir(CLAVE_CONSENTIMIENTO, 'rechazado');
  gtag('consent', 'update', denegarTodo());
  /* Rechazar después de haber aceptado tiene que borrar lo que se escribió
     mientras tanto. Si no, la decisión cambia y las cookies siguen ahí, que es
     lo mismo que no haber rechazado. */
  borrarCookiesDeGoogle();
}

export function borrarCookiesDeGoogle() {
  try {
    const dominio = window.location.hostname;
    /* `_ga` y `_ga_<ID>`; el `_gid` y los `_gat` son de versiones anteriores y
       pueden seguir ahí de una visita antigua. */
    for (const c of document.cookie.split(';')) {
      const nombre = c.split('=')[0].trim();
      if (!/^_ga|^_gid$|^_gat/.test(nombre)) continue;
      for (const d of [dominio, `.${dominio}`, `.${dominio.split('.').slice(-2).join('.')}`]) {
        document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
      }
      document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  } catch { /* modo privado */ }
}
