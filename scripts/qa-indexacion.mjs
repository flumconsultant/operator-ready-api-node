/**
 * La revisión de indexación, contra lo que se va a subir y no contra el código.
 *
 * ---- Por qué mira `dist` y no `src` ----
 *
 * Todo lo que decide si Google indexa una página —el canonical, los hreflang,
 * el título, el H1, el enlace que lleva hasta ella— se genera al compilar. Una
 * comprobación sobre el código fuente da por buena una intención; esta da por
 * buena una página. Son cosas distintas y la que importa es la segunda.
 *
 * ---- Qué exige, y por qué cada cosa ----
 *
 *   · Un canonical, y que se apunte a sí mismo. Dos páginas que se declaran
 *     canónicas de una tercera es la forma más rápida de que ninguna aparezca.
 *   · Los hreflang recíprocos. Google ignora un par que no se confirma desde
 *     el otro lado, y entonces las dos versiones compiten entre ellas.
 *   · Ningún noindex accidental. Es una línea que se escribe en un momento y
 *     tarda semanas en notarse.
 *   · Un H1. Ni cero ni dos.
 *   · La marca una sola vez en el título. «… | BECOME | BECOME» se publica tal
 *     cual en el resultado de búsqueda.
 *   · Ni un enlace interno hacia una dirección vieja. Un enlace a un redirect
 *     funciona para una persona y le cuesta un salto a un rastreador; y si
 *     además está en el sitemap, es una contradicción declarada.
 *   · Y cada página, alcanzable desde su índice con un enlace de HTML. Una
 *     página que solo aparece en el sitemap está anunciada pero no enlazada, y
 *     el sitemap es una sugerencia, no una promesa.
 *
 * Lo que NO puede comprobar es la respuesta del servidor: los 301, los 200 y
 * las cadenas de redirección solo existen cuando hay un servidor delante. Eso
 * lo mide `scripts/verificar-redirects.mjs`, después de subir.
 *
 * Uso:  node scripts/qa-indexacion.mjs
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITIO = 'https://meetbecome.com';
const PAGINAS = 'dist/_pages';
const SITEMAP = 'dist/sitemap.xml';

/* Las direcciones que se mudaron. Solo pueden aparecer en las reglas de
   redirección del .htaccess, en este archivo y en la documentación: en una
   página compilada, nunca. El camino completo y no el fragmento, porque
   «retail-consumo» es el principio de «retail-consumo-masivo». */
const VIEJAS = [
  '/es/industrias/servicios-financieros',
  '/es/industrias/retail-consumo',
  '/es/industrias/travel-hospitality',
  '/es/industrias/real-estate-construction',
  '/es/industrias/healthcare-life-sciences',
  '/en/industries/financial-services',
  '/en/industries/retail-consumer',
  '/en/industries/healthcare-life-sciences',
];

/* Las quince que Google todavía no había rastreado el 23 de agosto de 2026.
   No son un caso especial técnico: son la lista que hay que poder mirar de un
   vistazo mientras se resuelven. */
const PENDIENTES = [
  '/es/casos-de-uso/escalar-ia',
  '/es/casos-de-uso/redisenar-procesos-criticos',
  '/en/use-cases/scale-ai-beyond-pilots',
  '/es/servicios/become-now/operaciones',
  '/es/servicios/become-now/project-management-pmo',
  '/es/nosotros',
  '/es/industrias/banca-seguros-fintech',
  '/es/industrias/mineria-energia',
  '/es/industrias/retail-consumo-masivo',
  '/es/industrias/turismo-hoteleria',
  '/en/use-cases/redesign-critical-workflows',
  '/es/servicios/become-now/recursos-humanos',
  '/es/servicios/become-now/legal-compliance-risk',
  '/es/servicios/become-now/data-analytics',
  '/en/services/become-now/data-analytics',
];

const fallos = [];
const mal = (m) => { fallos.push(m); console.log(`✗  ${m}`); };
const bien = (m) => console.log(`ok  ${m}`);

/* ---- Las páginas compiladas -------------------------------------------- */

const archivos = [];
const recorrer = (dir) => {
  for (const f of readdirSync(dir)) {
    const ruta = join(dir, f);
    if (statSync(ruta).isDirectory()) recorrer(ruta);
    else if (f.endsWith('.html')) archivos.push(ruta);
  }
};
if (!existsSync(PAGINAS)) {
  console.error('::error::No hay dist/_pages. Compila primero: npx vite build && node scripts/seo.mjs');
  process.exit(1);
}
recorrer(PAGINAS);

const rutaDe = (f) => f.replace(PAGINAS, '').replace(/\.html$/, '') || '/';
const paginas = new Map(archivos.map((f) => [rutaDe(f), readFileSync(f, 'utf8')]));

console.log(`Páginas compiladas: ${paginas.size}\n`);

/* ---- Sitemap ------------------------------------------------------------ */

if (!existsSync(SITEMAP)) {
  console.error('::error::No hay dist/sitemap.xml.');
  process.exit(1);
}
const sitemap = readFileSync(SITEMAP, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const rutas = urls.map((u) => u.replace(SITIO, ''));

if (urls.length !== new Set(urls).size) {
  const vistas = new Set(); const repes = new Set();
  for (const u of urls) { if (vistas.has(u)) repes.add(u); vistas.add(u); }
  mal(`el sitemap repite ${repes.size} direcciones: ${[...repes].join(', ')}`);
} else bien(`el sitemap tiene ${urls.length} direcciones y ninguna repetida`);

for (const v of VIEJAS) {
  if (rutas.includes(v)) mal(`el sitemap incluye la dirección vieja ${v}`);
}
if (!VIEJAS.some((v) => rutas.includes(v))) bien('ninguna dirección vieja está en el sitemap');

for (const r of rutas) {
  if (r.includes('?') || r.includes('#')) mal(`el sitemap trae parámetros en ${r}`);
  if (!paginas.has(r)) mal(`el sitemap anuncia ${r} y no hay página compilada para esa ruta`);
}

/* ---- Cada página -------------------------------------------------------- */

let sinH1 = 0;
const conCuerpo = [...paginas.values()].filter((h) => /<h1[\s>]/.test(h)).length;

for (const [ruta, html] of paginas) {
  const canon = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
  if (canon.length !== 1) mal(`${ruta}: ${canon.length} etiquetas canonical; tiene que haber una`);
  else if (canon[0] !== `${SITIO}${ruta}`) mal(`${ruta}: el canonical apunta a ${canon[0]} en vez de a sí misma`);

  if (/name="robots"[^>]*noindex|noindex[^>]*name="robots"/i.test(html)) mal(`${ruta}: lleva noindex`);

  const titulo = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  if (!titulo) mal(`${ruta}: sin título`);
  else if ((titulo.match(/BECOME/g) || []).length > 1) mal(`${ruta}: la marca aparece ${(titulo.match(/BECOME/g) || []).length} veces en el título «${titulo}»`);

  /* El H1 solo existe si la página está prerenderizada. Sin prerenderizar,
     todas llegan vacías y contarlas daría un verde falso: por eso se cuenta
     cuántas traen cuerpo y se decide al final. */
  if (/<h1[\s>]/.test(html)) {
    const n = (html.match(/<h1[\s>]/g) || []).length;
    if (n !== 1) mal(`${ruta}: tiene ${n} etiquetas H1`);
  } else sinH1++;

  for (const v of VIEJAS) {
    if (new RegExp(`${v.replace(/[/-]/g, '\\$&')}(?=["'/?#\\s]|$)`).test(html)) {
      mal(`${ruta}: enlaza a la dirección vieja ${v}`);
    }
  }
}

if (conCuerpo === 0) {
  console.log('\n·  Ninguna página trae cuerpo: no se han comprobado los H1. Ejecuta scripts/prerender.mjs y repite.');
} else if (sinH1) {
  mal(`${sinH1} páginas sin H1 (de ${paginas.size}); el prerenderizado no las cubrió`);
} else bien(`las ${paginas.size} páginas tienen exactamente un H1`);

/* ---- Hreflang recíprocos ------------------------------------------------ */

const alternos = new Map();
for (const [ruta, html] of paginas) {
  const pares = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g)]
    .map((m) => [m[1], m[2].replace(SITIO, '')]);
  alternos.set(ruta, pares);
}
let rotos = 0;
for (const [ruta, pares] of alternos) {
  for (const [idioma, destino] of pares) {
    if (idioma === 'x-default') continue;
    if (destino === ruta) continue;
    const suyos = alternos.get(destino);
    if (!suyos) { mal(`${ruta}: declara hreflang «${idioma}» hacia ${destino}, que no existe`); rotos++; continue; }
    if (!suyos.some(([, d]) => d === ruta)) { mal(`${ruta} ↔ ${destino}: el par de hreflang no es recíproco`); rotos++; }
  }
}
if (!rotos) bien(`los pares de hreflang son recíprocos en las ${paginas.size} páginas`);

/* ---- Las quince: anunciadas y además enlazadas --------------------------- */

console.log('\n── Las quince pendientes de rastreo');
for (const p of PENDIENTES) {
  const enSitemap = rutas.includes(p);
  const padre = p.slice(0, p.lastIndexOf('/')) || '/es';
  const indice = paginas.get(padre);
  /* Se busca el enlace en el HTML del índice: `href="/es/…"`. La página tiene
     que estar prerenderizada para que el enlace exista. */
  const enlazada = indice ? new RegExp(`href="${p.replace(/[/-]/g, '\\$&')}"`).test(indice) : false;
  if (!enSitemap) mal(`${p}: no está en el sitemap`);
  if (indice && !enlazada) mal(`${p}: el sitemap la anuncia pero ${padre} no la enlaza`);
  if (!indice) mal(`${p}: no existe la página índice ${padre}`);
  if (enSitemap && enlazada) bien(`${p} · en el sitemap y enlazada desde ${padre}`);
}

/* ---- El límite clínico de Salud ----------------------------------------- */

/* Las frases exactas que publica hoy la página, en cada idioma. No es una
   comprobación de SEO: es la única declaración del sitio que dice que BECOME no
   se mete en decisiones médicas, y borrarla por descuido al reordenar bloques
   cambiaría lo que la empresa promete. */
for (const [ruta, marca] of [
  ['/es/industrias/salud-farmaceutica', /no desarrolla ni valida capacidades de diagn[óo]stico/i],
  ['/en/industries/healthcare-pharma', /not position these solutions as substitutes for diagnosis/i],
]) {
  const pagina = paginas.get(ruta);
  if (!pagina) { mal(`no existe la página ${ruta}`); continue; }
  if (!conCuerpo) continue;
  if (!marca.test(pagina)) mal(`${ruta}: ya no publica su límite clínico`);
  else bien(`${ruta} conserva íntegro su límite clínico`);
}

console.log('');
if (fallos.length) {
  for (const f of fallos) console.log(`::error::${f}`);
  console.log(`\n${fallos.length} ${fallos.length === 1 ? 'problema' : 'problemas'} de indexación.`);
  process.exit(1);
}
console.log('Sitemap, canonicals, hreflang, títulos, H1 y enlaces internos: sin hallazgos.');
