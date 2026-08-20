/**
 * Empaqueta el sistema de diseño en dos archivos que se puedan entregar tal
 * cual a otra persona o a un modelo:
 *
 *   design-export/BECOME-design-system.md — todo en un documento legible
 *   design-export/tokens.json             — los mismos tokens, para máquinas
 *
 * Se GENERA desde el código, no se escribe a mano. Un sistema de diseño
 * documentado aparte del código empieza a mentir en la primera semana: alguien
 * cambia un color y la documentación sigue diciendo el anterior. Esto se
 * regenera con `npm run design:export` y no puede desfasarse.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (p) => readFileSync(join(ROOT, p), 'utf8');
const SALIDA = join(ROOT, 'design-export');
mkdirSync(SALIDA, { recursive: true });

/* ------------------------------------------------------------- tokens */

const GRUPOS = [
  ['colors',     'Color'],
  ['typography', 'Tipografía'],
  ['spacing',    'Espaciado'],
  ['radius',     'Radios'],
  ['effects',    'Sombras y efectos'],
  ['motion',     'Movimiento'],
  ['patterns',   'Tramas de fondo'],
  ['base',       'Base'],
];

const tokens = {};
const seccionesToken = [];

for (const [archivo, titulo] of GRUPOS) {
  const css = leer(`tokens/${archivo}.css`);
  const filas = [];
  let comentario = '';

  for (const linea of css.split('\n')) {
    /* Los comentarios de sección del propio CSS son la mejor documentación que
       hay: explican POR QUÉ existe cada grupo. Se conservan. */
    const cabecera = linea.match(/\/\*\s*-+\s*(.+?)\s*-+\s*\*\//);
    if (cabecera) { comentario = cabecera[1]; continue; }

    /* matchAll y no match: el archivo de espaciado declara hasta seis tokens
       en la misma línea, y con un solo match se perdían cinco de cada seis. */
    const encontrados = [...linea.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);(?:\s*\/\*\s*@kind\s+(\w+)\s*\*\/)?/g)];
    if (!encontrados.length) continue;
    for (const [, nombre, valor, kind] of encontrados) {
      tokens[nombre] = valor.trim();
      filas.push({ nombre, valor: valor.trim(), kind: kind || '', nota: comentario });
      comentario = '';
    }
  }
  seccionesToken.push({ titulo, archivo, filas });
}

/* ---------------------------------------------------------- componentes */

/** Las props de un componente, leídas de su desestructuración. */
function propsDe(codigo, nombre) {
  const re = new RegExp(
    `(?:export\\s+(?:default\\s+)?function\\s+${nombre}|(?:export\\s+)?const\\s+${nombre}\\s*=)\\s*\\(?\\s*\\{([^}]*)\\}`,
    's',
  );
  const m = codigo.match(re);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [izq, ...der] = p.split('=');
      return { nombre: izq.trim(), pordefecto: der.length ? der.join('=').trim() : null };
    })
    .filter((p) => /^[a-zA-Z_$][\w$]*$/.test(p.nombre));
}

/**
 * El comentario de bloque que precede INMEDIATAMENTE a la declaración.
 *
 * «Inmediatamente» es la parte que importa. La primera versión buscaba el
 * último comentario que hubiera antes y se traía con él todo el código que
 * hubiese en medio: la ficha de `Kicker` acabó conteniendo la explicación del
 * archivo entero más dos constantes. Ahora, si entre el comentario y la
 * declaración hay cualquier cosa que no sea espacio en blanco, se considera
 * que ese comentario no habla de este componente.
 */
function docDe(codigo, nombre) {
  const i = codigo.search(new RegExp(`(?:export\\s+(?:default\\s+)?function\\s+${nombre}\\b|(?:export\\s+)?const\\s+${nombre}\\s*=)`));
  if (i < 0) return '';

  const antes = codigo.slice(0, i).trimEnd();
  if (!antes.endsWith('*/')) return '';

  const abre = antes.lastIndexOf('/*');
  if (abre < 0) return '';

  const texto = antes
    .slice(abre + 2, antes.length - 2)
    .replace(/^\*/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*? ?/, '').trimEnd())
    .join('\n')
    .trim();

  /* Los separadores decorativos —«---------- texto ----------»— no explican
     nada de un componente; solo ordenan el archivo. */
  if (/^-{3,}[^\n]*-{3,}$/.test(texto)) return '';
  return texto;
}

/** El comentario de cabecera del archivo: para qué existe ese grupo. */
function docDeArchivo(codigo) {
  const m = codigo.match(/^(?:import[^\n]*\n|['"][^\n]*['"];?\n|\s*\n)*\/\*\*?([\s\S]*?)\*\//);
  if (!m) return '';
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^\s*\*? ?/, '').trimEnd())
    .join('\n')
    .trim();
}

const ARCHIVOS = readdirSync(join(ROOT, 'src/components'))
  .filter((f) => f.endsWith('.jsx'))
  .sort();

const componentes = [];
const docsArchivo = {};
for (const archivo of ARCHIVOS) {
  const codigo = leer(`src/components/${archivo}`);
  docsArchivo[`src/components/${archivo}`] = docDeArchivo(codigo);
  const nombres = [...codigo.matchAll(/export\s+(?:default\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/g)]
    .map((m) => m[1]);
  for (const nombre of [...new Set(nombres)]) {
    componentes.push({
      nombre,
      archivo: `src/components/${archivo}`,
      doc: docDe(codigo, nombre),
      props: propsDe(codigo, nombre),
    });
  }
}

/* --------------------------------------------------------------- iconos */

const iconos = [...leer('src/components/icons.jsx').matchAll(/^\s{2}([a-zA-Z0-9_]+):\s*\w/gm)].map((m) => m[1]);

/* ---------------------------------------------------- reglas del sistema */

/* Las reglas que no se leen en ningún token ni en ninguna prop: viven en los
   comentarios de global.css, que es donde se decidieron. */
const reglasCss = [...leer('src/styles/global.css').matchAll(/\/\*([\s\S]*?)\*\//g)]
  .map((m) => m[1].split('\n').map((l) => l.replace(/^\s*\*? ?/, '').trimEnd()).join('\n').trim())
  .filter((t) => t.length > 220);

/* ------------------------------------------------------------ escritura */

const md = [];
const add = (...l) => md.push(...l);

add('# BECOME — Sistema de diseño');
add('');
add('Generado desde el código con `npm run design:export`. No se edita a mano:');
add('cualquier cambio en `tokens/` o en `src/components/` se refleja aquí al');
add('regenerarlo, y así el documento no puede acabar describiendo un sitio que');
add('ya no existe.');
add('');
add(`**${Object.keys(tokens).length} tokens · ${componentes.length} componentes · ${iconos.length} iconos**`);
add('');
add('---');
add('');
add('## 1. Tokens');
add('');
add('Todos son variables CSS sobre `:root`. En los componentes se usan siempre');
add('a través de `var(--nombre)`; no hay valores literales en el código.');
add('');

for (const s of seccionesToken) {
  add(`### ${s.titulo}`, '');
  add('| Token | Valor | Nota |', '|---|---|---|');
  for (const f of s.filas) {
    add(`| \`${f.nombre}\` | \`${f.valor}\` | ${f.nota.replace(/\|/g, '\\|')} |`);
  }
  add('');
}

add('---', '', '## 2. Componentes', '');
add('Agrupados por archivo. Las props salen de la firma real de cada uno y el');
add('texto que las acompaña, del comentario que tienen en el código.', '');

let archivoActual = '';
for (const c of componentes) {
  if (c.archivo !== archivoActual) {
    archivoActual = c.archivo;
    add(`### \`${basename(c.archivo)}\``, '');
    const dArchivo = docsArchivo[c.archivo];
    if (dArchivo) add(dArchivo.split('\n').map((l) => `> ${l}`).join('\n'), '');
  }
  add(`#### ${c.nombre}`, '');
  if (c.doc) add(c.doc.split('\n').map((l) => `> ${l}`).join('\n'), '');
  if (c.props.length) {
    add('| Prop | Por defecto |', '|---|---|');
    for (const p of c.props) add(`| \`${p.nombre}\` | ${p.pordefecto ? `\`${p.pordefecto}\`` : '—' } |`);
  } else {
    add('_Sin props._');
  }
  add('');
}

/* ------------------------------------------------- patrones de página */

/*
 * El ritmo de una página: la secuencia de secciones con su banda y su titular.
 *
 * La primera versión de esto intentaba reproducir el árbol JSX con sangría, y
 * mentía: contaba mal los cierres y dibujaba secciones dentro de secciones que
 * en el código son hermanas. Un esqueleto inventado es peor que ninguno. Lo
 * que sí se puede leer del código sin equivocarse —y es lo que importa para
 * diseñar— es en qué orden se alternan las bandas y qué dice cada una.
 */
function ritmoDe(ruta) {
  const codigo = leer(ruta);
  const filas = [];
  const re = /<Section\b([^>]*)>([\s\S]*?)(?=<Section\b|$)/g;

  for (const [, attrs, cuerpo] of codigo.matchAll(re)) {
    const band = attrs.match(/band="([^"]+)"/)?.[1] || 'light';
    const id = attrs.match(/id="([^"]+)"/)?.[1];
    const kicker = cuerpo.match(/<Kicker[^>]*>([^<]+)</)?.[1]?.trim();
    const titular = cuerpo.match(/<Headline[^>]*>([^<]+)</)?.[1]?.trim();
    filas.push({ band, id, kicker, titular });
  }
  return filas;
}

add('---', '', '## 3. El ritmo de una página', '');
add('El catálogo dice qué piezas hay; esto, cómo se ordenan. Cada página alterna');
add('bandas, y la alternancia no es decorativa: marca los cambios de tema y es lo');
add('que el nodo 3D lee para saber de qué color pintar el fondo detrás.', '');
add('Dos bandas claras seguidas sin nada en medio se leen como una sola sección');
add('larga; dos oscuras seguidas, igual. El contraste es la puntuación.', '');

for (const [titulo, ruta] of [['Home', 'src/pages/Home.jsx'], ['Un servicio', 'src/pages/Discovery.jsx']]) {
  add(`**${titulo}** — \`${ruta}\``, '');
  add('| # | Banda | Ancla | Antetítulo | Titular |', '|---:|---|---|---|---|');
  ritmoDe(ruta).forEach((f, i) => {
    add(`| ${i + 1} | \`${f.band}\` | ${f.id ? `\`#${f.id}\`` : '—'} | ${f.kicker || '—'} | ${(f.titular || '—').replace(/\|/g, '\\|')} |`);
  });
  add('');
}

add('---', '', '## 4. Iconos', '');
add('Un set propio, con trazo y radio consistentes. Se usan como');
add('`<Ico name="…" />` o `<IcoBadge name="…" />`. Los nombres son la API: si');
add('uno no está en esta lista, el componente no lo dibuja.', '');
add(iconos.map((i) => `\`${i}\``).join(' · '), '');

add('---', '', '## 5. Las primitivas, enteras', '');
add('El catálogo de arriba da la API de cada componente: qué props acepta. Eso');
add('basta para USARLOS, pero no para reproducir el aspecto — un `Headline` se');
add('define tanto por su prop `size` como por el peso, el interlineado y el');
add('tracking que aplica, y eso solo está en el código.');
add('');
add('Va entero, que son trescientas líneas. Con esto y los tokens de arriba, el');
add('documento es autosuficiente: se puede reconstruir el sistema sin abrir el');
add('repositorio.');
add('');
add('```jsx');
add(leer('src/components/ui.jsx').trimEnd());
add('```', '');

add('---', '', '## 6. Reglas del sistema', '');
add('Decisiones que no se leen en un token ni en una prop, extraídas de los');
add('comentarios de `src/styles/global.css`, que es donde se tomaron.', '');
for (const r of reglasCss) add(r, '');

writeFileSync(join(SALIDA, 'BECOME-design-system.md'), `${md.join('\n')}\n`);

writeFileSync(join(SALIDA, 'tokens.json'), `${JSON.stringify({
  nombre: 'BECOME',
  generado: 'npm run design:export',
  tokens,
}, null, 2)}\n`);

console.log(
  `design: ${Object.keys(tokens).length} tokens · ${componentes.length} componentes · `
  + `${iconos.length} iconos · ${reglasCss.length} reglas → design-export/`,
);
