import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

/**
 * Prerenderiza el texto de TODAS las páginas, no solo el de los artículos.
 *
 * ---- Qué estaba pasando ----
 *
 * seo.mjs ya metía el cuerpo de los artículos dentro de #root, porque sus
 * bloques son datos y se pueden convertir a HTML sin navegador. Las demás
 * páginas no: son componentes de React, así que el HTML que salía del servidor
 * llevaba la cabecera correcta y el cuerpo VACÍO.
 *
 * Medido sobre dist: las 72 páginas no-artículo servían 0 caracteres legibles y
 * ni un solo <h1>. Para Google es tolerable, porque ejecuta JavaScript. Para
 * GPTBot, ClaudeBot, PerplexityBot y OAI-SearchBot no lo es: no lo ejecutan.
 * De la home, de Servicios, del Framework y de las catorce páginas de programa
 * leían el título y la descripción, y nada más. El sitio entero estaba
 * optimizado para que lo citaran y era justo lo que no se podía leer.
 *
 * ---- Por qué con navegador y no con renderToString ----
 *
 * Las páginas usan react-router, framer-motion y three.js. Renderizarlas en
 * Node exigiría enrutador de memoria y sustitutos para todo lo que toca el DOM
 * y la GPU; cada componente nuevo sería una ocasión más de romper el build por
 * algo que no se ve. El navegador ya estaba en el proyecto para las tarjetas de
 * compartir, monta la página igual que un visitante y no hay nada que fingir.
 *
 * ---- Y por qué el esquema y no el DOM entero ----
 *
 * Copiar el #root completo metería en cada HTML las transformaciones en línea
 * de las animaciones, los lienzos de three.js y miles de nodos que no dicen
 * nada. Lo que un rastreador necesita es el texto y su jerarquía: h1 a h3,
 * párrafos, listas y el destino de los enlaces internos. Eso es lo que se
 * escribe, en orden de documento, y pesa una fracción.
 *
 * React lo sustituye al montar, igual que hace con el cuerpo de los artículos.
 * El contenido servido y el que ve la persona son el mismo texto: no hay dos
 * versiones, que es lo que un buscador penaliza.
 */

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');
const PUERTO = 4319;

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon',
};

/* Sirve dist igual que Hostinger: la ruta con su HTML propio si existe, y si no
   index.html. Sin esto la página se montaría sin la cabecera que se le acaba de
   generar, y el prerenderizado saldría de otra versión de la página. */
function servidor() {
  return http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    const candidatos = [
      join(DIST, '_pages', url.replace(/\/$/, '') + '.html'),
      join(DIST, url),
      join(DIST, 'index.html'),
    ];
    const f = candidatos.find((c) => existsSync(c) && !c.endsWith('/'));
    if (!f) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TIPOS[extname(f)] || 'application/octet-stream' });
    res.end(readFileSync(f));
  });
}

const escapa = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

async function esquemaDe(pagina) {
  return pagina.evaluate(() => {
    const raiz = document.getElementById('root');
    if (!raiz) return null;
    const salida = [];
    const vistos = new Set();

    /* Lo que flota por encima de la página no es la página: el aviso de
       privacidad y el de suscripción son elementos fijos, y sin este filtro
       «AQUÍ NO TE SEGUIMOS» acababa siendo lo primero que leía un rastreador
       en las 72 páginas, por delante del H1. */
    const flotante = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.position === 'fixed' || cs.position === 'sticky') return true;
        const rol = n.getAttribute?.('role');
        if (rol === 'dialog' || rol === 'region') return true;
      }
      return false;
    };

    const visible = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      /* El menú móvil y el de escritorio existen los dos en el DOM; sin este
         filtro el esquema llevaría la navegación entera dos veces. */
      return el.getClientRects().length > 0;
    };

    const texto = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();

    /* `summary` estaba fuera: las preguntas de cada FAQ viven ahí, así que el
       HTML servido llevaba las respuestas sin las preguntas. */
    for (const el of raiz.querySelectorAll('h1, h2, h3, p, li, summary, figcaption, th, td')) {
      if (el.closest('header, footer, nav, [data-form-rail]')) continue;
      if (!visible(el) || flotante(el)) continue;
      /* Un <p> dentro de un <li> saldría dos veces, una por cada etiqueta. */
      if (el.parentElement?.closest('li') && el.tagName !== 'LI' && el.tagName !== 'SUMMARY') continue;
      const t = texto(el);
      if (!t || t.length < 2) continue;
      const clave = el.tagName + '|' + t;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      salida.push({ etiqueta: el.tagName.toLowerCase(), texto: t });
    }

    /* ---- Los enlaces, que son por donde se llega al resto del sitio ----
     *
     * Se recogen en dos listas: los del CUERPO —contextuales, los que dicen
     * algo sobre esta página en concreto— y los del MENÚ Y EL PIE, que son los
     * mismos en todas.
     *
     * Los del menú y el pie estaban descartados. El comentario que había aquí
     * decía que «se añaden aparte, una vez», y no era verdad: nada los añadía
     * después. El resultado, medido sobre las 88 páginas: diez rutas sin un
     * solo enlace entrante para quien no ejecuta JavaScript —las dos homes, las
     * seis legales y las dos de IA responsable—. Para GPTBot o PerplexityBot,
     * que no ejecutan JavaScript, esas diez páginas sencillamente no existían:
     * no había forma de llegar a ellas navegando.
     *
     * Repetirlos en las 88 páginas no es un problema: es exactamente lo que
     * hace la navegación de cualquier sitio, y son cuarenta enlaces.
     *
     * Y el texto puede venir de `aria-label`. El logotipo es un enlace a la
     * home con una imagen dentro y ningún texto; exigir texto visible es lo que
     * dejaba huérfanas a /es y /en, que son las dos páginas más importantes. */
    const enlaces = [];
    const navegacion = [];
    for (const a of raiz.querySelectorAll('a[href^="/"]')) {
      if (!visible(a) || flotante(a)) continue;
      const t = texto(a) || (a.getAttribute('aria-label') || '').trim();
      const href = a.getAttribute('href');
      if (!t || !href || vistos.has('A|' + href)) continue;
      vistos.add('A|' + href);
      (a.closest('header, footer') ? navegacion : enlaces).push({ href, texto: t });
    }

    return { bloques: salida, enlaces, navegacion };
  });
}

function aHtml(esquema) {
  const trozos = [];
  for (const b of esquema.bloques) {
    const t = escapa(b.texto);
    if (b.etiqueta === 'li') trozos.push(`<li>${t}</li>`);
    else if (b.etiqueta === 'th' || b.etiqueta === 'td') trozos.push(`<p>${t}</p>`);
    else trozos.push(`<${b.etiqueta}>${t}</${b.etiqueta}>`);
  }
  /* Los <li> sueltos se agrupan para que el HTML sea válido: una lista fuera de
     su <ul> es lo primero que marca un validador. */
  const html = trozos
    .join('')
    .replace(/(<li>.*?<\/li>)+/g, (m) => `<ul>${m}</ul>`);
  const lista = (enlaces, etiqueta) => (enlaces?.length
    ? `<nav aria-label="${etiqueta}"><ul>${enlaces
        .map((e) => `<li><a href="${escapa(e.href)}">${escapa(e.texto)}</a></li>`)
        .join('')}</ul></nav>`
    : '');
  /* Primero los del cuerpo y después los del menú: el orden en el documento es
     el orden en que se leen, y los contextuales dicen más sobre esta página
     que la navegación, que es idéntica en las 88. */
  return html + lista(esquema.enlaces, 'En esta página') + lista(esquema.navegacion, 'Navegación del sitio');
}

/* ------------------------------------------------------------------ marcha */

const rutas = [...readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
  .matchAll(/<loc>https:\/\/meetbecome\.com([^<]*)<\/loc>/g)]
  .map((m) => m[1] || '/');

const srv = servidor();
await new Promise((r) => srv.listen(PUERTO, r));

const navegador = await chromium.launch({
  /* En el entorno de despliegue el binario está donde diga PLAYWRIGHT_BROWSERS_PATH;
     en local puede estar en otro sitio, y no es motivo para romper el build. */
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});

let hechos = 0;
let vacios = 0;

for (const ruta of rutas) {
  const destino = join(DIST, '_pages', `${ruta === '/' ? 'index' : ruta}.html`);
  if (!existsSync(destino)) continue;
  const html = readFileSync(destino, 'utf8');
  /* Los artículos ya traen su cuerpo desde seo.mjs, hecho con sus propios
     datos. Volver a escribirlo desde el DOM sería cambiar una fuente exacta
     por una aproximación. */
  if (!html.includes('<div id="root"></div>')) continue;

  const pagina = await navegador.newPage({ viewport: { width: 1440, height: 1200 } });
  try {
    await pagina.goto(`http://localhost:${PUERTO}${ruta}`, { waitUntil: 'networkidle', timeout: 30000 });
    /* Reveal monta con IntersectionObserver: sin recorrer la página, la mitad
       del texto no existe todavía en el DOM y se prerenderizaría a medias. */
    await pagina.evaluate(async () => {
      const alto = document.documentElement.scrollHeight;
      for (let y = 0; y < alto; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 45));
      }
      window.scrollTo(0, 0);
    });
    await pagina.waitForTimeout(250);

    const esquema = await esquemaDe(pagina);
    const cuerpo = esquema ? aHtml(esquema) : '';
    if (cuerpo.length < 200) {
      vacios += 1;
      console.warn(`prerender: ${ruta} salió con ${cuerpo.length} caracteres`);
    }
    writeFileSync(destino, html.replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`));
    hechos += 1;
  } catch (e) {
    vacios += 1;
    console.warn(`prerender: ${ruta} falló — ${e.message.split('\n')[0]}`);
  } finally {
    await pagina.close();
  }
}

await navegador.close();
srv.close();

console.log(`prerender: ${hechos} páginas con su texto dentro del HTML${vacios ? ` · ${vacios} sin resolver` : ''}`);
/* Que falle el build si se queda mudo del todo: publicar 72 páginas vacías sin
   enterarse es exactamente el fallo que este paso existe para evitar. */
if (hechos === 0) process.exit(1);
