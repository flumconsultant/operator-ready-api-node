/**
 * Reúne la demanda medida que haya en `automatizacion/` y la convierte en
 * candidatos a pregunta.
 *
 * ---- Por qué existe ----
 *
 * El observatorio medía quién responde cada pregunta y nunca si alguien la
 * hacía. La demanda se daba por supuesta porque la pregunta estaba escrita en
 * `preguntas.md`, y ese archivo se llena a mano.
 *
 * Lee tres exports, y ninguno necesita clave, cuenta de pago ni que este
 * proceso alcance ningún servidor. Se dejan caer en la carpeta y ya:
 *
 *   · Search Console  — búsquedas reales con las que la gente llega al sitio.
 *     No es la estimación de nadie: son consultas que ocurrieron. Su límite es
 *     que solo ve aquello para lo que el sitio ya aparece.
 *   · Bing Webmaster  — volumen mensual con cifras exactas. Bing es un buscador
 *     chico, pero su volumen se comporta parecido y no cuesta nada.
 *   · Keyword Planner — volumen de Google. Sin campañas activas da rangos
 *     («100 - 1 mil») en vez de cifras. Para elegir entre dos preguntas sobra.
 *
 * ---- La advertencia que hay que leer antes que los números ----
 *
 * Para este nicho el volumen miente por abajo. «¿Cómo se decide qué comprar y
 * qué construir en inteligencia artificial?», preguntada por un directivo
 * peruano en español, sale como 0 o 10 en cualquier herramienta: no porque
 * nadie la haga, sino porque todas redondean a cero lo que está bajo su umbral,
 * y ahí abajo vive el cliente entero.
 *
 * Lo que se compra con esas preguntas no es tráfico, es que un asistente cite a
 * BECOME cuando alguien con presupuesto pregunte. Un cero aquí no es prueba de
 * que nadie la busque. Es ausencia de dato, que no es lo mismo, y este script
 * no dice una cosa por la otra.
 *
 * Uso:
 *   node scripts/demanda.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';

const CARPETA = 'automatizacion';

/* Un cero de una herramienta de volumen no es «nadie lo busca», es «está por
   debajo de mi umbral». Se marca aparte en vez de descartarlo. */
const VOLUMEN_VISIBLE = 10;
/* Impresiones que ya ocurrieron, con posición mala: demanda demostrada y
   respuesta ausente. El hueco más barato que existe. */
const IMPRESIONES_MINIMAS = 10;
const POSICION_FLOJA = 10;

/* ---------------------------------------------------------------- lectura */

function texto(ruta) {
  const bruto = readFileSync(ruta);
  /* Keyword Planner descarga en UTF-16 con BOM más veces de las que debería, y
     leído como UTF-8 sale un archivo de caracteres nulos que parece corrupto. */
  if (bruto[0] === 0xff && bruto[1] === 0xfe) return bruto.toString('utf16le');
  if (bruto[0] === 0xfe && bruto[1] === 0xff) return bruto.swap16().toString('utf16le');
  return bruto.toString('utf8').replace(/^﻿/, '');
}

function separador(linea) {
  const cuenta = (c) => (linea.match(new RegExp(`\\${c}`, 'g')) || []).length;
  return [['\t', cuenta('\t')], [';', cuenta(';')], [',', cuenta(',')]].sort(
    (a, b) => b[1] - a[1],
  )[0][0];
}

function partir(linea, sep) {
  const celdas = [];
  let actual = '';
  let comillas = false;
  for (const c of linea) {
    if (c === '"') comillas = !comillas;
    else if (c === sep && !comillas) {
      celdas.push(actual);
      actual = '';
    } else actual += c;
  }
  celdas.push(actual);
  return celdas.map((c) => c.trim());
}

/* Los tres exports nombran sus columnas distinto y además cambian con el
   idioma de la cuenta. Se busca por trozo de palabra en vez de por nombre
   exacto: es lo único que aguanta que Google traduzca una cabecera. */
const COLUMNAS = {
  termino: ['consulta', 'quer', 'palabra clave', 'keyword', 'término', 'termino'],
  volumen: [
    'promedio de búsquedas', 'promedio de busquedas', 'avg. monthly', 'avg monthly',
    'searches', 'búsquedas mensuales', 'busquedas mensuales', 'volumen', 'volume',
  ],
  impresiones: ['impresion', 'impression'],
  posicion: ['posici', 'position'],
  clics: ['clic', 'click'],
};

const buscaColumna = (cabecera, claves) =>
  cabecera.findIndex((c) => claves.some((k) => c.includes(k)));

/* Keyword Planner mete dos o tres líneas de preámbulo antes de la cabecera de
   verdad, y no siempre las mismas. Se busca la primera línea que parezca una
   cabecera en lugar de dar por hecho que es la primera. */
function cabeceraReal(lineas) {
  for (let i = 0; i < Math.min(lineas.length, 12); i++) {
    const sep = separador(lineas[i]);
    const celdas = partir(lineas[i], sep).map((c) => c.toLowerCase());
    if (celdas.length < 2) continue;
    if (buscaColumna(celdas, COLUMNAS.termino) === -1) continue;
    const tieneNumero =
      buscaColumna(celdas, COLUMNAS.volumen) !== -1 ||
      buscaColumna(celdas, COLUMNAS.impresiones) !== -1;
    if (tieneNumero) return { i, sep, celdas };
  }
  return null;
}

/* ------------------------------------------------------------------ cifras */

const MULTIPLOS = { k: 1e3, mil: 1e3, m: 1e6, mm: 1e6, millon: 1e6 };

/* «100 - 1 mil» es lo que da Keyword Planner sin campañas activas. Se queda el
   extremo bajo: elegir el alto para presumir de volumen es engañarse solo. */
function volumen(v) {
  if (!v) return null;
  const limpio = String(v).replace(/\s+/g, ' ').trim().toLowerCase();
  if (!limpio) return null;
  const trozo = (t) => {
    const m = t.match(/([\d.,]+)\s*(k|mil|mm|m|millon)?/);
    if (!m) return null;
    const n = parseFloat(m[1].replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.'));
    if (Number.isNaN(n)) return null;
    return Math.round(n * (m[2] ? MULTIPLOS[m[2]] || 1 : 1));
  };
  const partes = limpio.split(/\s*[-–—]\s*/);
  if (partes.length === 2) {
    const bajo = trozo(partes[0]);
    const alto = trozo(partes[1]);
    if (bajo !== null) return { valor: bajo, rango: alto !== null ? `${bajo}–${alto}` : null };
  }
  const n = trozo(limpio);
  return n === null ? null : { valor: n, rango: null };
}

const entero = (v) => (v === undefined ? 0 : parseInt(String(v).replace(/[^\d]/g, ''), 10) || 0);

const decimal = (v) => {
  if (v === undefined) return NaN;
  const limpio = String(v).replace(/[%\s]/g, '');
  const conComa = /,\d{1,2}$/.test(limpio);
  return parseFloat(conComa ? limpio.replace(/\./g, '').replace(',', '.') : limpio.replace(/,/g, ''));
};

/* El \b de JavaScript es ASCII: entre la «é» de «qué» y el espacio siguiente no
   hay frontera de palabra, así que ^qué\b no casa nunca y se pierden todas las
   preguntas que empiezan por «qué» y «por qué», que en español son la mitad. */
const ARRANQUES =
  /^(por qué|por que|para qué|para que|qué|que|cómo|como|porque|quién|quien|cuándo|cuando|cuál|cual|dónde|donde|cuánto|cuanto|what|how|why|who|when|which|where|is|are|does|do|can|should)(?=\s|$)/i;
const esPregunta = (t) => ARRANQUES.test(t) || t.includes('?');

/* ------------------------------------------------------------------ lectura */

function leer(ruta) {
  const lineas = texto(ruta).split(/\r?\n/).filter((l) => l.trim());
  if (!lineas.length) return { ruta, error: 'el archivo está vacío' };

  const cab = cabeceraReal(lineas);
  if (!cab) {
    return {
      ruta,
      error: 'no reconozco las columnas',
      muestra: lineas.slice(0, 4),
    };
  }

  const iTermino = buscaColumna(cab.celdas, COLUMNAS.termino);
  const iVolumen = buscaColumna(cab.celdas, COLUMNAS.volumen);
  const iImpresiones = buscaColumna(cab.celdas, COLUMNAS.impresiones);
  const iPosicion = buscaColumna(cab.celdas, COLUMNAS.posicion);
  const iClics = buscaColumna(cab.celdas, COLUMNAS.clics);

  /* Search Console trae impresiones y posición; las de volumen traen volumen.
     Es lo que distingue «te vieron» de «se busca». */
  const fuente = iImpresiones !== -1 && iPosicion !== -1 ? 'search-console' : 'volumen';

  const filas = lineas
    .slice(cab.i + 1)
    .map((l) => partir(l, cab.sep))
    .map((f) => ({
      termino: f[iTermino],
      /* Bing Webmaster llama «Impressions» a lo que es volumen mensual, y no
         trae posición. Search Console trae las dos cosas, y ahí las impresiones
         significan otra cosa: cuántas veces te vieron. La columna de posición es
         lo que distingue un caso del otro, así que solo se toman las impresiones
         como volumen cuando no la hay. */
      volumen:
        iVolumen !== -1
          ? volumen(f[iVolumen])
          : iImpresiones !== -1 && iPosicion === -1
            ? volumen(f[iImpresiones])
            : null,
      impresiones: iImpresiones === -1 ? null : entero(f[iImpresiones]),
      clics: iClics === -1 ? null : entero(f[iClics]),
      posicion: iPosicion === -1 ? null : decimal(f[iPosicion]),
    }))
    .filter((f) => f.termino);

  return { ruta, fuente, filas, columnas: cab.celdas };
}

/* -------------------------------------------------------------------- salida */

if (!existsSync(CARPETA)) {
  console.log(`::error::No existe la carpeta ${CARPETA}.`);
  process.exit(1);
}

const archivos = readdirSync(CARPETA)
  .filter((f) => /\.(csv|tsv)(\.(csv|tsv))?$/i.test(f))
  .map((f) => `${CARPETA}/${f}`);

if (!archivos.length) {
  /* Ni un fallo ni un «todo bien». La diferencia entre «miré y no hay demanda»
     y «no pude mirar» es la que hace que un diagnóstico valga algo. */
  console.log(`No hay ningún export de demanda en ${CARPETA}/, así que hoy no hay`);
  console.log('demanda medida que aportar. No es un error: es que nadie ha');
  console.log('exportado nada todavía.\n');
  console.log('Los tres, todos gratis y sin conectar nada, en docs/demanda.md.');
  console.log('El archivo se deja en esta carpeta con cualquier nombre .csv.\n');
  console.log('Mientras no haya ninguno, la única evidencia disponible son las');
  console.log('preguntas reales de gente en foros. Vale, y hay que decir en el');
  console.log('informe que se usó esa.');
  process.exit(0);
}

const leidos = archivos.map(leer);
const rotos = leidos.filter((l) => l.error);
const buenos = leidos.filter((l) => !l.error);

for (const r of rotos) {
  console.log(`::warning::${r.ruta}: ${r.error}.`);
  if (r.muestra) {
    console.log('  Primeras líneas, para que alguien lo mire:');
    for (const l of r.muestra) console.log(`    ${l.slice(0, 120)}`);
  }
  console.log('');
}

if (!buenos.length) {
  console.log('::error::Hay archivos, pero ninguno se pudo leer. No hay demanda medida.');
  process.exit(1);
}

const preguntas = [];
const desaprovechadas = [];
const bajoUmbral = [];

for (const { ruta, fuente, filas } of buenos) {
  const etiqueta = fuente === 'search-console' ? 'Search Console' : 'volumen de búsqueda';
  console.log(`${ruta} · ${filas.length} términos · ${etiqueta}`);

  if (fuente === 'search-console') {
    const total = filas.reduce((s, f) => s + (f.impresiones || 0), 0);
    console.log(`  ${total} impresiones en total\n`);
    for (const f of filas) {
      if (esPregunta(f.termino)) preguntas.push({ ...f, ruta, fuente });
      if (
        f.impresiones >= IMPRESIONES_MINIMAS &&
        f.posicion !== null &&
        !Number.isNaN(f.posicion) &&
        f.posicion > POSICION_FLOJA
      ) {
        desaprovechadas.push({ ...f, ruta });
      }
    }
  } else {
    console.log('');
    for (const f of filas) {
      if (!esPregunta(f.termino)) continue;
      const v = f.volumen?.valor ?? 0;
      if (v >= VOLUMEN_VISIBLE) preguntas.push({ ...f, ruta, fuente });
      else bajoUmbral.push({ ...f, ruta });
    }
  }
}

const cifra = (f) =>
  f.fuente === 'search-console'
    ? `${f.impresiones} impresiones${f.posicion ? ` · posición media ${f.posicion.toFixed(1)}` : ''}`
    : `${f.volumen?.rango || f.volumen?.valor} al mes`;

const peso = (f) => (f.fuente === 'search-console' ? f.impresiones : f.volumen?.valor ?? 0);

console.log(`Términos con forma de pregunta y señal: ${preguntas.length}\n`);
if (preguntas.length) {
  for (const f of [...preguntas].sort((a, b) => peso(b) - peso(a)).slice(0, 30)) {
    console.log(`    · «${f.termino}» — ${cifra(f)}`);
  }
  console.log('');
}

if (desaprovechadas.length) {
  console.log(`Se buscan y nos ven de lejos (${IMPRESIONES_MINIMAS}+ impresiones, más allá de la posición ${POSICION_FLOJA}):`);
  console.log('La demanda ya está demostrada. Falta la respuesta.\n');
  for (const f of desaprovechadas.sort((a, b) => b.impresiones - a.impresiones).slice(0, 25)) {
    console.log(`    · «${f.termino}» — ${f.impresiones} impresiones · posición media ${f.posicion.toFixed(1)}`);
  }
  console.log('');
}

if (bajoUmbral.length) {
  console.log(`Preguntas por debajo del umbral de la herramienta (${bajoUmbral.length}):`);
  console.log('Un cero aquí NO es «nadie lo busca». Es «está por debajo de lo que');
  console.log('esta herramienta sabe contar», y ahí abajo es donde vive el cliente');
  console.log('de una consultoría en español. No descartes una pregunta por esto.\n');
  for (const f of bajoUmbral.slice(0, 15)) console.log(`    · «${f.termino}»`);
  console.log('');
}

console.log('Los límites, que hay que decir en el informe:');
console.log('· Search Console solo ve aquello para lo que el sitio ya aparece.');
console.log('· El volumen es un promedio mensual con uno o dos meses de retraso.');
console.log('  Nada de esto es tiempo real, y ningún servicio de pago lo es.');
console.log('· Un cero es ausencia de dato, no prueba de que nadie lo busque.');
