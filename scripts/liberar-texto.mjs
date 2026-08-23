/**
 * Saca el texto de un componente y lo deja como dato.
 *
 * Se usa una vez por archivo y se guarda porque cada página nueva vuelve a
 * necesitarlo. Hace dos cosas distintas según lo que encuentre:
 *
 *   · Los bloques de la página —Kicker, Headline, Lead, Body— cuyo contenido
 *     es texto puro pasan a `campos` del JSON de esa página, y quedan
 *     editables desde el panel.
 *   · Los arrays de copia declarados arriba —las tarjetas, los controles, los
 *     escenarios— pasan a `listas`. Esos NO se exponen todavía en el panel:
 *     varias de sus columnas son rutas de iconos y slugs, y un formulario que
 *     deje tocar «/icons/algo.webp» puede dejar una página sin imágenes.
 *
 * ---- Lo que nunca toca ----
 *
 * Si dentro de un bloque hay una llave —una variable, un enlace, otra
 * etiqueta— se queda donde está. Eso no es copia, es estructura, y moverla a
 * un formulario sería permitir que se rompa una página desde el navegador.
 *
 * ---- Y por qué compara ----
 *
 * Mover texto es el cambio donde una palabra perdida no la ve nadie hasta que
 * un cliente la busca. Cada array se evalúa antes de moverlo y se compara con
 * lo escrito; si no coinciden, no se escribe nada.
 *
 * Uso:  node scripts/liberar-texto.mjs <archivo.jsx> <id-de-pagina> [título] [ruta]
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const [ruta, id, titulo = id, rutaPublica = ''] = process.argv.slice(2);
if (!ruta || !id) {
  console.error('Falta el archivo o el id de la página.');
  process.exit(1);
}

const jsonRuta = `src/content/paginas/${id}.json`;
const pagina = existsSync(jsonRuta)
  ? JSON.parse(readFileSync(jsonRuta, 'utf8'))
  : { _: `Los rótulos y textos de ${titulo}.`, id, titulo, ruta: rutaPublica, campos: [] };
pagina.campos ||= [];

let s = readFileSync(ruta, 'utf8');
const niveles = ruta.split('/').length - 2;
const arriba = `${'../'.repeat(niveles)}content/paginas/index.js`;

/* ---- 1. Los bloques de la página ----------------------------------------- */
const ROTULOS = { Kicker: 'Antetítulo', Headline: 'Titular', Lead: 'Entrada', Body: 'Texto' };
const TOPES = { Kicker: 70, Headline: 130, Lead: 420, Body: 600 };
const TIPOS = { Kicker: 'linea', Headline: 'linea', Lead: 'parrafo', Body: 'parrafo' };

const vistos = new Set(pagina.campos.map((c) => c.id));
let seccion = 0;
let bloques = 0;

s = s.replace(/<(Kicker|Headline|Lead|Body)(\s[^>]*?)?>([\s\S]*?)<\/\1>/g, (todo, etiqueta, attrs = '', dentro) => {
  const texto = dentro.replace(/\s+/g, ' ').trim();
  if (!texto || texto.includes('{') || texto.includes('<')) return todo;
  if (etiqueta === 'Kicker') seccion++;
  const base = `s${seccion || 1}${etiqueta.toLowerCase()}`;
  let clave = base;
  let n = 2;
  while (vistos.has(clave)) clave = `${base}${n++}`;
  vistos.add(clave);
  pagina.campos.push({
    id: clave,
    rotulo: `Sección ${seccion || 1} · ${ROTULOS[etiqueta]}`,
    tipo: TIPOS[etiqueta],
    maximo: Math.max(TOPES[etiqueta], texto.length + 40),
    valor: texto,
  });
  bloques++;
  return `<${etiqueta}${attrs || ''}>{campo('${id}', '${clave}')}</${etiqueta}>`;
});

/* ---- 2. Los arrays de copia ----------------------------------------------- */
const listas = { ...(pagina.listas || {}) };
let arrays = 0;

for (const nombre of [...s.matchAll(/^const ([A-Z][A-Z_]*) = \[/gm)].map((m) => m[1])) {
  const i = s.indexOf(`const ${nombre} = [`);
  const j = s.indexOf('\n];', i);
  if (j < 0) { console.log(`  · ${nombre}: no encontré el cierre, se queda`); continue; }
  const literal = s.slice(i + `const ${nombre} = `.length, j + 2);
  let valor;
  try { valor = Function(`"use strict"; return (${literal});`)(); }
  catch (e) { console.log(`  · ${nombre}: no es un literal puro, se queda`); continue; }
  if (!Array.isArray(valor)) continue;
  /* La comprobación: lo que se va a escribir tiene que reproducir lo que
     había. Si no, no se toca nada. */
  if (JSON.stringify(JSON.parse(JSON.stringify(valor))) !== JSON.stringify(valor)) {
    console.log(`  · ${nombre}: no sobrevive a JSON, se queda`);
    continue;
  }
  listas[nombre] = valor;
  s = s.slice(0, i) + `const ${nombre} = LISTAS.${nombre};` + s.slice(j + 3);
  arrays++;
}

if (!bloques && !arrays) { console.log(`${ruta}: nada que liberar`); process.exit(0); }

/* ---- 3. Las importaciones -------------------------------------------------- */
const necesita = [];
if (bloques && !s.includes('campo(')) necesita.push('campo');
if (bloques && !/import \{[^}]*campo/.test(s)) necesita.push('campo');
if (arrays && !s.includes('listasDe')) necesita.push('listasDe');
const yaImporta = /import \{([^}]*)\} from '[^']*content\/paginas\/index\.js'/.exec(s);
const quiere = [...new Set([...(yaImporta ? yaImporta[1].split(',').map((x) => x.trim()) : []), ...(bloques ? ['campo'] : []), ...(arrays ? ['listasDe'] : [])])].filter(Boolean);

if (yaImporta) {
  s = s.replace(yaImporta[0], `import { ${quiere.join(', ')} } from '${arriba}'`);
} else {
  s = s.replace(/^(import .*\n)/, `import { ${quiere.join(', ')} } from '${arriba}';\n$1`);
}
if (arrays && !s.includes('const LISTAS =')) {
  s = s.replace(/^const [A-Z][A-Z_]* = LISTAS\./m, (m) => `const LISTAS = listasDe('${id}');\n\n${m}`);
}

writeFileSync(ruta, s);
if (Object.keys(listas).length) pagina.listas = listas;
writeFileSync(jsonRuta, `${JSON.stringify(pagina, null, 2)}\n`);

const palabras = pagina.campos.reduce((a, c) => a + String(c.valor).split(' ').length, 0)
  + JSON.stringify(listas).split(/\s+/).length;
console.log(`${ruta.split('/').pop()}: ${bloques} bloques · ${arrays} listas · ~${palabras} palabras como dato`);
