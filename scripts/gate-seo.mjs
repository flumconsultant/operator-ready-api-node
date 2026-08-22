/**
 * El gate de publicación: lo que tiene que cumplirse para que una página salga.
 *
 * `auditar-seo.mjs` ya revisa lo que vive en la cabecera —canonical, hreflang,
 * sitemap, redirecciones, títulos—. Esto revisa lo que vive en el CUERPO y solo
 * se puede saber mirando el HTML que se sirve:
 *
 *   · que no haya dos páginas con el mismo título, la misma descripción o el
 *     mismo h1 —dos páginas diciéndose lo mismo compiten entre ellas—;
 *   · que toda página tenga un h1 en el HTML servido, no solo después de que
 *     el navegador ejecute JavaScript;
 *   · que los datos estructurados sean JSON válido, porque un bloque roto no
 *     avisa: simplemente se ignora;
 *   · que las imágenes lleven alt y declaren tamaño, que es la mitad del CLS;
 *   · y que cada industria enlace de verdad a un servicio, a sus casos de uso,
 *     a sus programas y al método.
 *
 * ---- Los enlaces del pie no cuentan ----
 *
 * El pie y el menú enlazan a todo el sitio. Contándolos, cualquier página sale
 * «perfectamente enlazada» y la comprobación no dice nada. Se cuentan solo los
 * del cuerpo, que el prerenderizado deja separados en su propia lista.
 *
 * ---- Y por qué exige el prerenderizado ----
 *
 * Sin él, el cuerpo de cada página está vacío: no hay h1, ni enlaces, ni nada
 * que revisar, y esto pasaría en verde por no haber mirado. Es el mismo fallo
 * que tuvo el QA de lenguaje, y se corta igual: si demasiadas páginas llegan
 * vacías, esto falla y lo dice.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'dist/_pages';
if (!existsSync(DIR)) {
  console.error('::error::No hay páginas compiladas. Ejecuta la compilación antes de este gate.');
  process.exit(1);
}

const paginas = [];
const recorrer = (dir) => {
  for (const f of readdirSync(dir)) {
    const ruta = join(dir, f);
    if (statSync(ruta).isDirectory()) recorrer(ruta);
    else if (f.endsWith('.html')) paginas.push(ruta);
  }
};
recorrer(DIR);

const url = (f) => f.slice(DIR.length).replace(/\.html$/, '') || '/';
const cabecera = (s) => s.slice(0, s.indexOf('</head>'));
const cuerpo = (s) => {
  const i = s.indexOf('<div id="root">');
  return i < 0 ? '' : s.slice(i, s.indexOf('</div></body>', i));
};
/* Los enlaces del menú y del pie van en su propia lista, con este rótulo. */
const soloCuerpo = (c) => c.replace(/<nav aria-label="Navegación del sitio">[\s\S]*?<\/nav>/g, '');

const fallos = [];
const verdes = [];
const porTitulo = new Map();
const porDesc = new Map();
const porH1 = new Map();
const sinH1 = [];
const jsonRoto = [];
const sinAlt = [];
const sinMedidas = [];
let vacias = 0;
let bloques = 0;

const anota = (mapa, clave, u) => {
  if (!clave) return;
  if (!mapa.has(clave)) mapa.set(clave, []);
  mapa.get(clave).push(u);
};

for (const f of paginas) {
  const s = readFileSync(f, 'utf8');
  const h = cabecera(s);
  const c = cuerpo(s);
  const u = url(f);

  anota(porTitulo, h.match(/<title>([\s\S]*?)<\/title>/)?.[1], u);
  anota(porDesc, h.match(/<meta name="description" content="([\s\S]*?)"/)?.[1], u);

  if (c.length < 200) { vacias++; continue; }

  const h1 = [...c.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  if (!h1.length) sinH1.push(u);
  for (const t of h1) anota(porH1, t, u);

  for (const img of s.match(/<img[^>]*>/g) || []) {
    if (!/\salt=/.test(img)) sinAlt.push(`${u} · ${img.slice(0, 70)}`);
    if (!(/\swidth=/.test(img) && /\sheight=/.test(img))) sinMedidas.push(`${u} · ${img.slice(0, 70)}`);
  }

  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    bloques++;
    try { JSON.parse(m[1]); } catch (e) { jsonRoto.push(`${u} · ${e.message.slice(0, 60)}`); }
  }
}

if (vacias > paginas.length / 3) {
  console.error(`::error::${vacias} de ${paginas.length} páginas llegan sin cuerpo. Falta el prerenderizado: sin él este gate no revisa nada y pasaría en verde por no haber mirado.`);
  process.exit(1);
}

const repetidos = (mapa) => [...mapa.entries()].filter(([, v]) => v.length > 1);

const comprobar = (bien, textoOk, textoMal) => {
  if (bien) verdes.push(textoOk); else fallos.push(textoMal);
};

comprobar(!repetidos(porTitulo).length, `Títulos únicos (${paginas.length} páginas)`,
  `Títulos repetidos: ${repetidos(porTitulo).slice(0, 3).map(([t, v]) => `«${t.slice(0, 40)}» en ${v.join(', ')}`).join(' | ')}`);
comprobar(!repetidos(porDesc).length, 'Descripciones únicas',
  `Descripciones repetidas: ${repetidos(porDesc).slice(0, 2).map(([, v]) => v.join(', ')).join(' | ')}`);
comprobar(!repetidos(porH1).length, 'H1 únicos',
  `H1 repetidos: ${repetidos(porH1).slice(0, 3).map(([t, v]) => `«${t.slice(0, 40)}» en ${v.join(', ')}`).join(' | ')}`);
comprobar(!sinH1.length, 'Todas las páginas llevan H1 en el HTML servido', `Sin H1: ${sinH1.slice(0, 6).join(', ')}`);
comprobar(!jsonRoto.length, `Datos estructurados válidos (${bloques} bloques)`, `JSON-LD roto: ${jsonRoto.slice(0, 3).join(' | ')}`);
comprobar(!sinAlt.length, 'Todas las imágenes llevan alt', `Imágenes sin alt (${sinAlt.length}): ${sinAlt.slice(0, 3).join(' | ')}`);
comprobar(!sinMedidas.length, 'Todas las imágenes declaran width y height', `Imágenes sin medidas (${sinMedidas.length}): ${sinMedidas.slice(0, 3).join(' | ')}`);

/* ---- Enlaces contextuales de cada industria ----------------------------- */
const industrias = paginas.filter((f) => /\/es\/industrias\/[^/]+\.html$/.test(f));
const malEnlazadas = [];
for (const f of industrias) {
  const c = soloCuerpo(cuerpo(readFileSync(f, 'utf8')));
  const enlaces = [...c.matchAll(/href="(\/es\/[^"#]*)"/g)].map((m) => m[1]);
  const servicio = enlaces.filter((x) => /^\/es\/servicios\/become-(discover|embed|now)$/.test(x)).length;
  const casos = new Set(enlaces.filter((x) => x.startsWith('/es/casos-de-uso/'))).size;
  const now = new Set(enlaces.filter((x) => x.startsWith('/es/servicios/become-now/'))).size;
  const metodo = enlaces.filter((x) => x === '/es/como-transformamos').length;
  if (!(servicio >= 1 && casos >= 2 && now >= 1 && metodo >= 1)) {
    malEnlazadas.push(`${url(f)} → servicio ${servicio}, casos ${casos}, NOW ${now}, método ${metodo}`);
  }
}
comprobar(!malEnlazadas.length, `Las ${industrias.length} industrias enlazan a servicio, casos, programas y método`,
  `Industrias mal enlazadas: ${malEnlazadas.join(' | ')}`);

/* ---- Veredicto ----------------------------------------------------------- */
for (const v of verdes) console.log(`   ok     ${v}`);
for (const f of fallos) console.error(`::error::${f}`);
console.log(`\n${verdes.length} comprobaciones en verde · ${fallos.length} fallos`);
if (fallos.length) process.exit(1);
