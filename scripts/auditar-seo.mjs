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

/* ------------------------------------------------------------------------
   Comprobaciones de sitio, no de página.

   Las de arriba miran cada página por separado, y hay fallos que ninguna
   página tiene: los tiene la relación entre ellas. Las tres de aquí abajo
   salieron de una auditoría que esta misma herramienta había dado por buena,
   y por eso están: para que no vuelvan a colarse.
------------------------------------------------------------------------ */

/* 1. Páginas a las que no llega ningún enlace SIN JavaScript.
      GPTBot, ClaudeBot y PerplexityBot no ejecutan JavaScript: para ellos una
      página a la que no apunta ningún <a> del HTML sencillamente no existe.
      Llegaron a ser diez, entre ellas las dos portadas. */
{
  const cuerpo = (f) => {
    const h = readFileSync(f, 'utf8');
    const i = h.indexOf('<div id="root">');
    return i < 0 ? '' : h.slice(i, h.indexOf('</div></body>', i));
  };
  const entrantes = new Map(rutas.map((r) => [r, 0]));
  for (const r of rutas) {
    const f = `dist/_pages${r === '/' ? '/index' : r}.html`;
    if (!existsSync(f)) continue;
    for (const m of cuerpo(f).matchAll(/href="(\/[^"#?]*)"/g)) {
      if (entrantes.has(m[1])) entrantes.set(m[1], entrantes.get(m[1]) + 1);
    }
  }
  for (const [r, n] of entrantes) {
    if (n === 0) fallos.push([r, 'ningún enlace apunta aquí en el HTML sin JavaScript']);
  }
}

/* 2. Cadenas de redirección: A→B→C.
      Cada salto diluye lo que se traslada, y hay rastreadores que dejan de
      seguir a partir del segundo.
      No basta con mirar el destino de cada regla: la cadena que apareció de
      verdad la formaban dos reglas que por separado estaban bien —una cambiaba
      el tramo y la otra el slug— y el resultado de la primera caía en la
      segunda. Así que se prueban DIRECCIONES: las que aparecen literalmente en
      las reglas y las del sitemap, cada una recorrida como la recorrería el
      servidor. */
if (existsSync('dist/.htaccess')) {
  const reglas = [...readFileSync('dist/.htaccess', 'utf8').matchAll(/^\s*RedirectMatch\s+301\s+(\S+)\s+(\S+)\s*$/gm)]
    .map(([, patron, destino]) => [new RegExp(patron), destino]);
  const salto = (u) => {
    for (const [re, destino] of reglas) {
      if (re.test(u)) return u.replace(re, destino);
    }
    return null;
  };
  /* Las direcciones de prueba.
     El primer intento las sacaba solo del literal de cada regla, y tenía un
     punto ciego que se vio al probarlo: si borras una regla, desaparece
     también su caso de prueba, así que el fallo que causa esa ausencia no se
     detecta nunca. Justo el fallo que había.
     Ahora se combinan las dos mitades por separado: los TRAMOS que aparecen en
     las reglas (de dónde y a dónde) y los SLUGS finales. Cada tramo con cada
     slug. Así `/es/soluciones/pilotos-que-no-escalan` se prueba aunque ninguna
     regla la mencione, que es exactamente lo que hacía falta. */
  const muestras = new Set(rutas);
  const literales = [];
  for (const [re, destino] of reglas) {
    const limpia = (x) => x
      .replace(/^\^/, '')
      .replace(/\(\/\.\*\)\?\\?\$$/, '')
      .replace(/\/\?\\?\$$/, '')
      .replace(/\\?\$$/, '')
      .replace(/\$1$/, '')
      .replace(/\\/g, '')
      .replace(/\/$/, '');
    literales.push(limpia(re.source), limpia(destino));
  }
  const tramos = new Set();
  const slugs = new Set();
  for (const l of literales) {
    if (!/^\/[a-z0-9/-]*$/i.test(l) || l.length < 2) continue;
    muestras.add(l);
    const corte = l.lastIndexOf('/');
    if (corte > 0) { tramos.add(l.slice(0, corte)); slugs.add(l.slice(corte + 1)); }
  }
  for (const t of tramos) for (const sl of slugs) muestras.add(`${t}/${sl}`);
  for (const u of muestras) {
    const cadena = [u];
    let actual = u;
    for (let i = 0; i < 4; i++) {
      const siguiente = salto(actual);
      if (!siguiente || siguiente === actual) break;
      cadena.push(siguiente);
      actual = siguiente;
    }
    if (cadena.length > 2) {
      fallos.push([u, `${cadena.length - 1} saltos: ${cadena.join(' → ')}`]);
    } else if (cadena.length === 2 && rutas.includes(u)) {
      fallos.push([u, `está en el sitemap y redirige a ${cadena[1]}`]);
    }
  }
}

/* 3. El index.html de respaldo, que es lo que se sirve cuando la dirección no
      existe, no puede ser indexable ni declarar un canonical: si lo hace,
      cada errata del dominio se publica como una copia de la portada. */
if (existsSync('dist/index.html')) {
  const h = readFileSync('dist/index.html', 'utf8');
  if (!/name="robots"[^>]*noindex/.test(h)) {
    fallos.push(['/index.html', 'el respaldo de rutas desconocidas es indexable (falta noindex)']);
  }
  if (/rel="canonical"/.test(h)) {
    fallos.push(['/index.html', 'el respaldo declara un canonical que no le corresponde']);
  }
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
