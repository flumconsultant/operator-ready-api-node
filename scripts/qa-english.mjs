/**
 * English language and tone QA for everything under `/en/`.
 *
 * The Spanish guardian looks for words that slipped in untranslated. This one
 * has a different job, because the English side is already clean of Spanish:
 * what it looks for is copy that sounds like every other AI vendor.
 *
 * ---- Why generic AI language is treated as a defect ----
 *
 * «Unlock the power of AI», «cutting-edge», «seamless», «game-changing». None
 * of these is wrong. All of them are interchangeable: they could sit on any
 * competitor's page without changing meaning, which means they carry none. A
 * consultancy that sounds like the others is a consultancy that has to explain
 * why it is different later, in the room, instead of on the page.
 *
 * The list comes from the canonical English QA document, not from taste.
 *
 * ---- And the three things it will not tolerate ----
 *
 *   · Spanish left inside an English page. Not a style problem: a page that
 *     switches language mid-sentence reads as unfinished.
 *   · A link to an industry slug that no longer exists.
 *   · A page with no H1, or with more than one.
 *
 * It reads `dist/_pages/en`, which is what the server actually returns, and
 * not the source: a comment in the code can say anything without a reader ever
 * seeing it, and flagging that would be flagging a false positive.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'dist/_pages/en';
const HOME = 'dist/_pages/en.html';

const { GENERICO, CASTELLANO } = await import('./lexico.mjs');


/* Industry slugs that moved. A link to one of these is a link to a redirect,
   and the canonical rule is zero of them.
 *
 * Full paths, and matched with a boundary after. The first version listed bare
 * fragments and reported 42 problems that were not problems: «retail-consumer»
 * is the beginning of «retail-consumer-goods», which is the CURRENT slug, and
 * «retail-consumo» the beginning of «retail-consumo-masivo». A guardian that
 * cries wolf on the correct answer is worse than no guardian, because the next
 * real finding gets ignored with the rest.
 *
 * And `travel-hospitality` is legacy only in Spanish: in English it is the
 * live slug for that industry. The path is what tells them apart. */
const RUTAS_VIEJAS = [
  '/en/industries/financial-services',
  '/en/industries/retail-consumer',
  '/en/industries/healthcare-life-sciences',
  '/es/industrias/servicios-financieros',
  '/es/industrias/retail-consumo',
  '/es/industrias/travel-hospitality',
  '/es/industrias/real-estate-construction',
  '/es/industrias/healthcare-life-sciences',
];

const visible = (archivo) => {
  const s = readFileSync(archivo, 'utf8');
  const i = s.indexOf('<div id="root">');
  if (i < 0) return '';
  return s.slice(i, s.indexOf('</div></body>', i))
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
};

const paginas = [];
const recorrer = (dir) => {
  for (const f of readdirSync(dir)) {
    const ruta = join(dir, f);
    if (statSync(ruta).isDirectory()) recorrer(ruta);
    else if (f.endsWith('.html')) paginas.push(ruta);
  }
};
if (existsSync(RAIZ)) recorrer(RAIZ);
if (existsSync(HOME)) paginas.push(HOME);

if (!paginas.length) {
  console.error('::error::No English pages to review. Was the site built before this step?');
  process.exit(1);
}

const url = (r) => r.replace('dist/_pages', '').replace(/\.html$/, '') || '/en';
const hallazgos = [];
let vacias = 0;

for (const p of paginas) {
  const texto = visible(p);
  if (texto.length < 200) { vacias++; continue; }

  for (const [nivel, reglas] of [['generic', GENERICO], ['spanish', CASTELLANO]]) {
    for (const [expresion, arreglo] of reglas) {
      for (const m of texto.matchAll(expresion)) {
        hallazgos.push({
          nivel, ruta: url(p), palabra: m[0], arreglo,
          alrededor: texto.slice(Math.max(0, m.index - 55), m.index + m[0].length + 65).trim(),
        });
      }
    }
  }

  /* Enlaces a rutas que ya no existen. Se busca en el HTML entero y no en el
     texto visible: un enlace es un atributo, no una palabra. */
  const crudo = readFileSync(p, 'utf8');
  for (const vieja of RUTAS_VIEJAS) {
    /* El límite es lo que distingue una ruta vieja de la nueva que empieza
       igual: después del slug solo puede venir comilla, barra o fin. */
    if (new RegExp(`${vieja.replace(/[/-]/g, '\\$&')}(?=["'/?#\\s]|$)`).test(crudo)) {
      hallazgos.push({ nivel: 'legacy link', ruta: url(p), palabra: vieja, arreglo: 'point at the current slug', alrededor: '' });
    }
  }

  /* Un H1, ni cero ni dos. */
  const h1 = (crudo.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) {
    hallazgos.push({ nivel: 'headings', ruta: url(p), palabra: `${h1} H1`, arreglo: 'exactly one H1 per page', alrededor: '' });
  }
}

/* El mismo fallo que puede tener contra sí mismo el guardián español: si esto
   corre antes del prerenderizado, casi todas las páginas llegan vacías, no hay
   nada que revisar y el resultado es un verde falso. */
if (vacias > paginas.length / 3) {
  console.error(`::error::${vacias} of ${paginas.length} English pages arrive with no text. Run scripts/prerender.mjs before this QA, or the green is meaningless.`);
  process.exit(1);
}

const por = (n) => hallazgos.filter((h) => h.nivel === n);
console.log(`English pages reviewed: ${paginas.length}`);
console.log(`Generic AI language: ${por('generic').length} · Spanish left in: ${por('spanish').length} · Legacy links: ${por('legacy link').length} · Heading problems: ${por('headings').length}`);

for (const [titulo, lista] of [
  ['Generic AI language', por('generic')],
  ['Spanish inside an English page', por('spanish')],
  ['Links to industry slugs that moved', por('legacy link')],
  ['Headings', por('headings')],
]) {
  if (!lista.length) continue;
  console.log(`\n── ${titulo}`);
  const agrupado = new Map();
  for (const h of lista) {
    const k = h.palabra.toLowerCase();
    if (!agrupado.has(k)) agrupado.set(k, { ...h, rutas: new Set() });
    agrupado.get(k).rutas.add(h.ruta);
  }
  for (const [palabra, h] of agrupado) {
    console.log(`  «${palabra}» → ${h.arreglo}`);
    console.log(`     on ${[...h.rutas].slice(0, 6).join(', ')}${h.rutas.size > 6 ? ` and ${h.rutas.size - 6} more` : ''}`);
    if (h.alrededor) console.log(`     …${h.alrededor}…`);
  }
}

console.log('');
if (hallazgos.length) {
  console.error(`::error::English QA found ${hallazgos.length} issues under /en/. Each one is fixed, rewritten, or deliberately excepted with a reason.`);
  process.exit(1);
}
console.log('No generic AI language, no Spanish left in, no links to moved slugs, one H1 per page.');
