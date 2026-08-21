import { readFileSync, existsSync } from 'node:fs';

/**
 * Auditoría de SEO técnico sobre lo que de verdad se publica: los HTML de
 * dist/_pages, que es lo que ve un rastreador que no ejecuta JavaScript.
 */

const SITE = 'https://meetbecome.com';
const rutas = [...readFileSync('dist/sitemap.xml', 'utf8')
  .matchAll(/<loc>https:\/\/meetbecome\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/');

const uno = (h, re) => (h.match(re) || [])[1];
const todos = (h, re) => [...h.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))].map((m) => m[1]);

const fallos = [];
const avisos = [];
const titulos = new Map();
const descripciones = new Map();

for (const ruta of rutas) {
  const f = `dist/_pages${ruta}.html`;
  if (!existsSync(f)) { fallos.push([ruta, 'no existe el HTML pre-generado']); continue; }
  const h = readFileSync(f, 'utf8');
  const di = (m) => fallos.push([ruta, m]);
  const av = (m) => avisos.push([ruta, m]);

  const title = uno(h, /<title>([^<]*)<\/title>/);
  const desc = uno(h, /<meta name="description" content="([^"]*)"/);
  const canon = uno(h, /<link rel="canonical" href="([^"]*)"/);
  const robots = uno(h, /<meta name="robots" content="([^"]*)"/);
  const og = uno(h, /<meta property="og:title" content="([^"]*)"/);
  const ogImg = uno(h, /<meta property="og:image" content="([^"]*)"/);
  const ogTipo = uno(h, /<meta property="og:type" content="([^"]*)"/);
  const twitter = uno(h, /<meta name="twitter:card" content="([^"]*)"/);
  const lang = uno(h, /<html[^>]*\slang="([^"]*)"/);
  const viewport = uno(h, /<meta name="viewport" content="([^"]*)"/);
  const charset = /<meta charset=/i.test(h);
  const hreflang = todos(h, /<link rel="alternate" hreflang="([^"]*)"/);
  const h1 = todos(h, /<h1[^>]*>([\s\S]*?)<\/h1>/).map((x) => x.replace(/<[^>]*>/g, '').trim());
  const jsonld = todos(h, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  if (!title) di('sin <title>');
  else {
    // Google recorta alrededor de 60 caracteres; por encima el final no se ve.
    if (title.length > 62) av(`title de ${title.length} caracteres (se recorta): «${title}»`);
    if (title.length < 20) av(`title muy corto (${title.length}): «${title}»`);
    if (!/BECOME/.test(title)) av(`el title no nombra la marca: «${title}»`);
    if (titulos.has(title)) di(`title duplicado con ${titulos.get(title)}`);
    else titulos.set(title, ruta);
  }

  if (!desc) di('sin meta description');
  else {
    if (desc.length > 160) av(`description de ${desc.length} caracteres (se recorta)`);
    if (desc.length < 70) av(`description muy corta (${desc.length})`);
    if (descripciones.has(desc)) di(`description duplicada con ${descripciones.get(desc)}`);
    else descripciones.set(desc, ruta);
  }

  if (!canon) di('sin canonical');
  else if (canon !== SITE + ruta) di(`canonical apunta a ${canon} y la URL es ${SITE + ruta}`);

  if (robots && /noindex/.test(robots)) di(`noindex: ${robots}`);
  if (!lang) di('sin lang en <html>');
  else if (!/^(es|en)/.test(lang)) di(`lang raro: ${lang}`);
  if (!charset) di('sin <meta charset>');
  if (!viewport) di('sin viewport');
  else if (/user-scalable=no|maximum-scale=1(?!\d)/.test(viewport)) di(`el viewport impide ampliar: ${viewport}`);

  if (h1.length === 0) di('sin H1 en el HTML servido');
  else if (h1.length > 1) di(`${h1.length} H1: ${h1.join(' | ')}`);

  if (!og) av('sin og:title');
  if (!ogImg) av('sin og:image');
  if (!ogTipo) av('sin og:type');
  if (!twitter) av('sin twitter:card');

  if (hreflang.length < 2) av(`hreflang incompleto: ${hreflang.join(', ') || 'ninguno'}`);
  if (hreflang.length && !hreflang.includes('x-default')) av('sin hreflang x-default');

  for (const j of jsonld) {
    try { JSON.parse(j); } catch { di('JSON-LD inválido'); }
  }
  if (!jsonld.length) av('sin datos estructurados');

  // Texto legible sin ejecutar JavaScript
  const root = (h.match(/<div id="root">([\s\S]*)<\/div>/) || [])[1] || '';
  const texto = root.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (texto.length < 200) av(`solo ${texto.length} caracteres legibles sin JavaScript`);

  // Imágenes sin alt en lo pre-generado
  const imgs = todos(h, /<img\b([^>]*)>/g);
  const sinAlt = imgs.filter((a) => !/\salt=/.test(a)).length;
  if (sinAlt) di(`${sinAlt} <img> sin alt`);
}

const robotsTxt = existsSync('dist/robots.txt') ? readFileSync('dist/robots.txt', 'utf8') : '';
if (!robotsTxt) fallos.push(['/robots.txt', 'no existe']);
else if (!/Sitemap:/i.test(robotsTxt)) fallos.push(['/robots.txt', 'no declara el sitemap']);
if (!existsSync('dist/sitemap.xml')) fallos.push(['/sitemap.xml', 'no existe']);

console.log(`${rutas.length} rutas revisadas\n`);
console.log(`FALLOS (${fallos.length})`);
for (const [r, m] of fallos) console.log('  ' + r + ' — ' + m);
console.log(`\nAVISOS (${avisos.length})`);
const porTipo = new Map();
for (const [r, m] of avisos) {
  const clave = m.replace(/\d+/g, 'N').replace(/«.*»/, '«…»');
  if (!porTipo.has(clave)) porTipo.set(clave, []);
  porTipo.get(clave).push(r);
}
for (const [k, rs] of porTipo) console.log(`  ${k} — ${rs.length} rutas${rs.length <= 6 ? ': ' + rs.join(', ') : ' (p.ej. ' + rs.slice(0, 4).join(', ') + ')'}`);
