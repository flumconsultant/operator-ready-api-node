/**
 * Exporta TODO el texto visible del sitio a un solo Markdown, para revisarlo y
 * reescribirlo fuera del código.
 *
 *   node scripts/exportar-contenido.mjs
 *
 * ---- Por qué existe ----
 *
 * El texto del sitio vive repartido entre archivos de contenido, componentes de
 * React y el archivo de metadatos. Nadie que no programe puede leerlo entero, y
 * quien escribe no debería tener que abrir catorce archivos para saber qué dice
 * la web. Esto lo junta en un documento ordenado como el sitio: sección por
 * sección, página por página, en los dos idiomas.
 *
 * ---- Por qué sale del HTML ya generado y no de los archivos fuente ----
 *
 * Porque es la única forma de que salga TODO. Parte del texto son datos y parte
 * está escrita dentro de los componentes; leer los archivos fuente obligaría a
 * entender cada uno y aun así se escaparía lo que se compone en tiempo de
 * ejecución. El HTML prerenderizado ya contiene exactamente lo que un visitante
 * lee, con su jerarquía, así que es la fuente correcta: si aparece en el
 * documento, está en la web, y si está en la web, aparece.
 *
 * Requiere `dist/` ya construido y prerenderizado.
 *
 * ---- Cómo vuelve ----
 *
 * Cada bloque lleva delante un identificador en un comentario HTML, que no se
 * ve al leer el Markdown en cualquier visor. Junto al .md se escribe un .json
 * con ese identificador y el texto EXACTO de origen. Para aplicar los cambios,
 * se compara el .md devuelto contra el .json: lo que haya cambiado se busca
 * literalmente en `src/` y se sustituye. Sin el .json habría que adivinar qué
 * frase del sitio corresponde a cada párrafo editado, que es justo donde se
 * cometen los errores.
 *
 * Los artículos no entran: se escriben y se editan desde /admin, y volcarlos
 * aquí sería invitar a editarlos en el sitio equivocado.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { PAGES } = await import('../src/seo-meta.js');

if (!existsSync(join(ROOT, 'dist/sitemap.xml'))) {
  console.error('exportar: falta dist/. Ejecuta antes:  npx vite build && node scripts/seo.mjs && node scripts/prerender.mjs');
  process.exit(1);
}

/* ---- el orden del documento: el del sitio, no el alfabético ----
   Un índice ordenado por URL pone las legales entre los servicios y las
   industrias. Quien revisa el texto lo recorre como lo recorre un visitante. */
const SECCIONES = [
  ['Portada', ['/es', '/en']],
  ['Servicios', ['/es/servicios', '/es/servicios/become-now', '/es/servicios/become-discover', '/es/servicios/become-embed',
                 '/en/services', '/en/services/become-now', '/en/services/become-discover', '/en/services/become-embed']],
  ['Industrias', null],
  ['Cómo transformamos', ['/es/como-transformamos', '/en/how-we-transform']],
  ['Casos de uso', null],
  ['BECOME NOW™ — programas por área', null],
  ['Nosotros', ['/es/nosotros', '/es/nosotros/ia-responsable', '/en/about', '/en/about/responsible-ai']],
  ['Insights — portada del blog', ['/es/insights', '/en/insights']],
  ['Contacto', ['/es/contacto', '/en/contact']],
  ['Legal', ['/es/privacidad', '/es/terminos', '/es/cookies', '/en/privacy', '/en/terms', '/en/cookies']],
];

const rutas = [...readFileSync(join(ROOT, 'dist/sitemap.xml'), 'utf8')
  .matchAll(/<loc>https:\/\/meetbecome\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/');

const esArticulo = (r) => /\/(insights)\/.+/.test(r);
const grupo = (pref) => rutas.filter((r) => r.startsWith(pref) && !esArticulo(r)).sort();

SECCIONES[2][1] = [...grupo('/es/industrias'), ...grupo('/en/industries')];
SECCIONES[4][1] = [...grupo('/es/casos-de-uso'), ...grupo('/en/use-cases')];
SECCIONES[5][1] = [...grupo('/es/servicios/become-now/'), ...grupo('/en/services/become-now/')];

/* ------------------------------------------------------------ el HTML → texto */

const desescapa = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/** Los bloques de una página, en orden, tal y como se leen. */
function bloquesDe(ruta) {
  const f = join(ROOT, `dist/_pages${ruta === '/' ? '/index' : ruta}.html`);
  if (!existsSync(f)) return [];
  const html = readFileSync(f, 'utf8');
  const i = html.indexOf('<div id="root">');
  if (i < 0) return [];
  const cuerpo = html.slice(i + '<div id="root">'.length, html.indexOf('</div></body>', i));
  const salida = [];
  /* Solo texto. Los <nav> del final son la navegación del sitio, que se repite
     en las 88 páginas: revisarla 88 veces no aporta nada y esconde lo propio. */
  const sinNav = cuerpo.replace(/<nav[\s\S]*?<\/nav>/g, '');
  for (const m of sinNav.matchAll(/<(h1|h2|h3|li|p)>([\s\S]*?)<\/\1>/g)) {
    const texto = desescapa(m[2].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    if (texto) salida.push({ etiqueta: m[1], texto });
  }
  return salida;
}

/* ------------------------------------------------------------------ escribir */

/* ---- Los bloques que se repiten en muchas páginas ----
   Las 28 páginas de programa comparten la misma plantilla: de sus 163 bloques,
   más de un centenar son idénticos entre ellas. Volcarlos treinta veces haría
   el documento ilegible y, peor, escondería lo poco que cada programa dice de
   propio, que es justo lo que hay que revisar.
   Van una sola vez, en su propio archivo, con la nota de en cuántas páginas
   aparecen. Cambiar uno ahí los cambia en todas. */
const UMBRAL_COMPARTIDO = 5;

const porRuta = new Map();
for (const [, rs] of SECCIONES) for (const r of rs) porRuta.set(r, bloquesDe(r));

const cuenta = new Map();
for (const [, bs] of porRuta) {
  for (const t of new Set(bs.map((b) => b.texto))) cuenta.set(t, (cuenta.get(t) || 0) + 1);
}
const compartido = (t) => (cuenta.get(t) || 0) >= UMBRAL_COMPARTIDO;

const indice = {};
let n = 0;
const anota = (ruta, texto) => {
  const id = `b${String(++n).padStart(4, '0')}`;
  indice[id] = { ruta, texto };
  return id;
};

const ETIQUETA = { h1: '#', h2: '##', h3: '###' };
const NOMBRE = ['portada', 'servicios', 'industrias', 'como-transformamos',
  'casos-de-uso', 'programas', 'nosotros', 'insights', 'contacto', 'legal'];

const AVISO_LEGAL = '> **Cuidado con esta sección.** El texto legal lo revisó un abogado y cita datos reales de la empresa y del registro de la ANPD. Cambia la redacción si te parece, pero no los datos, los plazos ni las obligaciones: si algo de eso te chirría, márcalo con `NOTA:` y lo consultamos antes de tocarlo.';

function documento(titulo, rutas_, aviso) {
  const md = [`# ${titulo}`, ''];
  if (aviso) { md.push(aviso, ''); }
  for (const ruta of rutas_) {
    const bloques = (porRuta.get(ruta) || []).filter((b) => !compartido(b.texto));
    const meta = PAGES[ruta];
    if (!bloques.length && !meta) continue;
    md.push('## `' + ruta + '`', '');
    if (meta) {
      md.push('**En Google** (no se ve en la página):', '');
      md.push(`<!-- ${anota(ruta, meta[0])} -->`);
      md.push(`- **Título:** ${meta[0]}`);
      md.push(`<!-- ${anota(ruta, meta[1])} -->`);
      md.push(`- **Descripción:** ${meta[1]}`, '');
    }
    let enLista = false;
    for (const b of bloques) {
      if (b.etiqueta === 'li') {
        enLista = true;
        md.push(`<!-- ${anota(ruta, b.texto)} -->`);
        md.push(`- ${b.texto}`);
        continue;
      }
      if (enLista) { md.push(''); enLista = false; }
      md.push(`<!-- ${anota(ruta, b.texto)} -->`);
      md.push(ETIQUETA[b.etiqueta] ? `${ETIQUETA[b.etiqueta]} ${b.texto}` : b.texto, '');
    }
    if (enLista) md.push('');
    md.push('---', '');
  }
  return md.join('\n');
}

mkdirSync(join(ROOT, 'contenido/es'), { recursive: true });
mkdirSync(join(ROOT, 'contenido/en'), { recursive: true });

const escritos = [];
SECCIONES.forEach(([titulo, rs], i) => {
  const num = String(i + 1).padStart(2, '0');
  for (const [lang, dir] of [['es', 'contenido/es'], ['en', 'contenido/en']]) {
    const suyas = rs.filter((r) => (r.startsWith('/en') ? 'en' : 'es') === lang);
    if (!suyas.length) continue;
    const aviso = NOMBRE[i] === 'legal' ? AVISO_LEGAL : '';
    const texto = documento(titulo, suyas, aviso);
    if (texto.split('\n').length < 4) continue;
    const archivo = `${dir}/${num}-${NOMBRE[i]}.md`;
    writeFileSync(join(ROOT, archivo), texto);
    escritos.push(archivo);
  }
});

/* ---- el archivo de los bloques compartidos ---- */
{
  const repetidos = [...cuenta.entries()].filter(([t, c]) => c >= UMBRAL_COMPARTIDO);
  for (const lang of ['es', 'en']) {
    const md = [`# Bloques que se repiten en muchas páginas`, '',
      '> Estos textos NO están en ninguno de los otros archivos, para no leerlos treinta veces.',
      '> Cada uno aparece tal cual en las páginas que se indican, así que cambiar uno aquí lo cambia en todas ellas.', ''];
    let hubo = 0;
    for (const [texto, c] of repetidos) {
      const donde = [...porRuta].filter(([r, bs]) => (r.startsWith('/en') ? 'en' : 'es') === lang && bs.some((b) => b.texto === texto)).map(([r]) => r);
      if (!donde.length) continue;
      hubo++;
      md.push(`<!-- ${anota(donde[0], texto)} · en ${donde.length} páginas -->`);
      md.push(`- ${texto}  \`(${donde.length} páginas)\``);
    }
    if (hubo) {
      const archivo = `contenido/${lang}/99-repetidos.md`;
      writeFileSync(join(ROOT, archivo), md.join('\n'));
      escritos.push(archivo);
    }
  }
}

/* ---- el índice, que es lo primero que se abre ---- */
const indiceMd = [
  '# BECOME — el texto de la web, para revisarlo',
  '',
  `> ${new Date().toISOString().slice(0, 10)} · ${porRuta.size} páginas · ${n} bloques de texto`,
  '',
  '## Cómo funciona',
  '',
  '**Edita solo el texto.** Reescribe lo que quieras: titulares, párrafos, listas, y los títulos y descripciones que salen en Google. Si algo sobra, bórralo. Si falta algo, escríbelo donde toque.',
  '',
  '**No borres las líneas que empiezan por `<!--`.** No se ven al leer el documento en un visor de Markdown, y son lo único que me dice a qué punto exacto de la web pertenece cada párrafo. Sin ellas tendría que buscar cada frase a mano.',
  '',
  '**Deja recados con `NOTA:`** en una línea aparte. Los leo y no se publican.',
  '',
  '**Devuélveme los archivos que hayas tocado.** No hace falta que sean todos.',
  '',
  '## Por dónde empezar',
  '',
  'Si solo vas a revisar una cosa, que sea `es/01-portada.md`: es la página que más gente lee.',
  '',
  'Y si vas a revisar dos, la segunda es `es/99-repetidos.md`. Ahí está el texto que comparten las veintiocho páginas de programa. Es poco texto y sale en muchos sitios, así que es donde cada palabra rinde más.',
  '',
  '## Los archivos',
  '',
  '| Archivo | Qué es |',
  '| --- | --- |',
];
const QUE_ES = {
  portada: 'La home. Lo primero que ve todo el mundo.',
  servicios: 'Los tres servicios y la página que los compara.',
  industrias: 'El índice de industrias y las seis páginas de sector.',
  'como-transformamos': 'El método: los cinco sistemas, las seis etapas y los principios.',
  'casos-de-uso': 'Las seis necesidades de negocio.',
  programas: 'Los catorce programas de BECOME NOW™, por área.',
  nosotros: 'Quiénes somos, el equipo y la IA responsable.',
  insights: 'La portada del blog. Los artículos se editan en /admin.',
  contacto: 'El formulario y lo que lo acompaña.',
  legal: 'Privacidad, términos y cookies. Revisado por abogado: ojo.',
  repetidos: 'El texto que se repite en muchas páginas a la vez.',
};
for (const a of escritos.filter((x) => x.startsWith('contenido/es'))) {
  const clave = a.replace(/.*\d\d-/, '').replace('.md', '');
  indiceMd.push('| `' + a.replace('contenido/', '') + '` | ' + (QUE_ES[clave] || '') + ' |');
}
indiceMd.push('');
indiceMd.push('La carpeta `en/` es lo mismo en inglés. Si prefieres, revisa primero el español y yo adapto el inglés después: así lo escribes una vez.');
indiceMd.push('');
indiceMd.push('## Lo que no está aquí');
indiceMd.push('');
indiceMd.push('- **Los artículos de Insights.** Se escriben y se editan desde `/admin`, que es donde tienen vista previa y publicación.');
indiceMd.push('- **El menú y el pie.** Se repiten en las 88 páginas; si quieres cambiar una etiqueta, dímelo y ya está.');
writeFileSync(join(ROOT, 'contenido/00-indice.md'), indiceMd.join('\n'));

writeFileSync(join(ROOT, 'contenido/.indice.json'), JSON.stringify(indice, null, 1));
console.log(`exportado: ${n} bloques · ${escritos.length + 1} archivos en contenido/`);
