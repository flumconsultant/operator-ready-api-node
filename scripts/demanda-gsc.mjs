/**
 * Convierte el informe de consultas de Search Console en demanda medida.
 *
 * ---- Por qué existe ----
 *
 * El observatorio medía quién responde cada pregunta y nunca si alguien la
 * hacía. La demanda se daba por supuesta porque la pregunta estaba escrita en
 * `preguntas.md`, y ese archivo se llena a mano. Así entraron el 1 de septiembre
 * de 2026 quince preguntas razonadas y no medidas.
 *
 * Search Console es el único dato del sistema que no es la estimación de nadie:
 * son búsquedas que ocurrieron, con las palabras exactas que alguien escribió, y
 * cuántas veces. Su límite —y hay que tenerlo delante— es que solo ve aquello
 * para lo que el sitio ya aparece. Para lo que no posiciona, es ciega. Sirve
 * para confirmar y para descubrir el vecindario de lo que ya funciona, no para
 * decir que una pregunta no se busca.
 *
 * ---- Cómo se consigue el archivo ----
 *
 * En Search Console: Rendimiento → pestaña «Consultas» → Exportar → CSV.
 * Del ZIP sale un archivo de consultas; se guarda como
 * `automatizacion/consultas-gsc.csv`. No lleva datos personales: son consultas
 * agregadas, sin usuario. No hace falta ninguna clave ni conectar nada.
 *
 * Uso:
 *   node scripts/demanda-gsc.mjs
 */

import { readFileSync, existsSync } from 'node:fs';

const CSV = 'automatizacion/consultas-gsc.csv';

/* Una consulta con muchas impresiones y mala posición es alguien que preguntó,
   nos vio de refilón y no entró. Es el hueco más barato que existe: la demanda
   ya está demostrada y solo falta la respuesta. */
const IMPRESIONES_MINIMAS = 10;
const POSICION_FLOJA = 10;

if (!existsSync(CSV)) {
  /* Esto no es un fallo, pero tampoco es un «todo bien». La diferencia entre
     «miré y no hay demanda» y «no pude mirar» es la que hace que un diagnóstico
     valga algo, y callarla es cómo se acaba tomando decisiones sobre nada. */
  console.log(`No está ${CSV}, así que hoy no hay demanda medida que aportar.`);
  console.log('');
  console.log('No es un error: es que nadie ha exportado el informe todavía.');
  console.log('Search Console → Rendimiento → Consultas → Exportar → CSV, y el');
  console.log(`archivo de consultas se guarda como ${CSV}.`);
  console.log('');
  console.log('Mientras no esté, la única evidencia disponible son las sugerencias');
  console.log('del buscador y cómo formula la gente la pregunta en foros. Vale, pero');
  console.log('es más débil, y hay que decir en el informe que se usó esa.');
  process.exit(0);
}

/* Search Console exporta con la cabecera en el idioma de la cuenta, y las
   comillas aparecen solo cuando la consulta lleva una coma. Se parsea a mano
   porque traer una dependencia para cinco columnas no se sostiene. */
function filas(texto) {
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim());
  const partir = (linea) => {
    const celdas = [];
    let actual = '';
    let comillas = false;
    for (const c of linea) {
      if (c === '"') comillas = !comillas;
      else if (c === ',' && !comillas) {
        celdas.push(actual);
        actual = '';
      } else actual += c;
    }
    celdas.push(actual);
    return celdas.map((c) => c.trim());
  };
  const cabecera = partir(lineas[0]).map((c) => c.toLowerCase());
  return { cabecera, datos: lineas.slice(1).map(partir) };
}

/* Clics e impresiones son enteros y el separador de miles cambia con el idioma
   de la cuenta: «1.480» y «1,480» son mil cuatrocientos ochenta. Se quita todo
   lo que no sea dígito y se acabó la ambigüedad.

   Se probó con un export en español y «1.480» entraba como 1,48: las 1.480
   impresiones de una consulta con demanda real se convertían en ruido de fondo
   y la consulta desaparecía del informe. */
const entero = (v) => (v === undefined ? 0 : parseInt(v.replace(/[^\d]/g, ''), 10) || 0);

/* La posición sí es decimal, y ahí el último separador es el decimal. */
const decimal = (v) => {
  if (v === undefined) return NaN;
  const limpio = v.replace(/[%\s]/g, '');
  const conComa = /,\d{1,2}$/.test(limpio);
  return parseFloat(conComa ? limpio.replace(/\./g, '').replace(',', '.') : limpio.replace(/,/g, ''));
};

const { cabecera, datos } = filas(readFileSync(CSV, 'utf8'));
const col = (...nombres) => cabecera.findIndex((c) => nombres.some((n) => c.includes(n)));

const iConsulta = col('consulta', 'quer');
const iImpresiones = col('impresion', 'impression');
const iPosicion = col('posici', 'position');
const iClics = col('clic', 'click');

if (iConsulta === -1 || iImpresiones === -1) {
  console.log(`::error::No reconozco las columnas de ${CSV}. Cabecera leída: ${cabecera.join(' | ')}`);
  console.log('Se esperaba una columna de consultas y otra de impresiones. ¿Es el');
  console.log('export de «Consultas» y no el de páginas o el de países?');
  process.exit(1);
}

const consultas = datos
  .map((f) => ({
    texto: f[iConsulta],
    impresiones: entero(f[iImpresiones]),
    clics: iClics === -1 ? null : entero(f[iClics]),
    posicion: iPosicion === -1 ? null : decimal(f[iPosicion]),
  }))
  .filter((c) => c.texto);

const totalImpresiones = consultas.reduce((s, c) => s + c.impresiones, 0);
console.log(`${consultas.length} consultas en ${CSV}, ${totalImpresiones} impresiones en total.\n`);

/* Una consulta con forma de pregunta es la que mejor se convierte en artículo:
   ya viene con la duda dentro, y el título puede repetirla tal cual. */
/* El `\b` de JavaScript es ASCII: entre la «é» de «qué» y el espacio siguiente
   no hay frontera de palabra, así que `^qué\b` no casa nunca. Se perdían todas
   las preguntas que empiezan por «qué» y por «por qué», que en español son la
   mitad. Con `(?=\s|$)` funciona igual y con tildes. */
const ARRANQUES = /^(por qué|por que|qué|que|cómo|como|porque|quién|quien|cuándo|cuando|cuál|cual|dónde|donde|what|how|why|who|when|which|where|is|does|do|can)(?=\s|$)/i;
const preguntas = consultas.filter((c) => ARRANQUES.test(c.texto) || c.texto.includes('?'));

console.log(`Con forma de pregunta: ${preguntas.length}\n`);
if (preguntas.length) {
  console.log('  Las más buscadas, por impresiones:');
  for (const c of [...preguntas].sort((a, b) => b.impresiones - a.impresiones).slice(0, 25)) {
    const pos = c.posicion ? ` · posición media ${c.posicion.toFixed(1)}` : '';
    console.log(`    · «${c.texto}» — ${c.impresiones} impresiones${pos}`);
  }
  console.log('');
}

/* Y el hueco más barato: nos ven y no entran. */
const desaprovechadas = consultas
  .filter(
    (c) =>
      c.impresiones >= IMPRESIONES_MINIMAS &&
      c.posicion !== null &&
      !Number.isNaN(c.posicion) &&
      c.posicion > POSICION_FLOJA,
  )
  .sort((a, b) => b.impresiones - a.impresiones);

if (desaprovechadas.length) {
  console.log(`Se buscan y nos ven de lejos (${IMPRESIONES_MINIMAS}+ impresiones, más allá de la posición ${POSICION_FLOJA}):`);
  console.log('La demanda ya está demostrada. Falta la respuesta.\n');
  for (const c of desaprovechadas.slice(0, 25)) {
    console.log(`    · «${c.texto}» — ${c.impresiones} impresiones · posición media ${c.posicion.toFixed(1)}`);
  }
  console.log('');
} else if (iPosicion !== -1) {
  console.log(`Ninguna consulta con ${IMPRESIONES_MINIMAS}+ impresiones se queda más allá de la posición ${POSICION_FLOJA}.\n`);
}

console.log('Recuerda el límite: esto solo ve aquello para lo que el sitio ya aparece.');
console.log('Que una pregunta no esté aquí no significa que no se busque; significa');
console.log('que no posicionamos para ella, que es una cosa bien distinta.');
