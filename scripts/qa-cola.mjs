/**
 * Mide cuántas preguntas le quedan al sistema por cubrir.
 *
 * ---- Por qué existe ----
 *
 * El 1 de septiembre de 2026 no salió artículo. La rutina diaria se ejecutó,
 * tardó 63 segundos y reportó éxito. No falló nada: no había nada que escribir.
 *
 * Las 19 preguntas de `preguntas.md` estaban las 19 cubiertas. El informe del
 * observatorio del 30 de agosto lo había dicho con todas las letras —«con estos
 * dos huecos escritos, preguntas.md se queda sin preguntas pendientes»— y lo
 * dijo en el último párrafo de un archivo que nadie tenía por qué abrir ese día.
 *
 * Ese es el fallo real, y no es del redactor: **el aviso existía y no llegaba a
 * ninguna parte**. Un sistema que se queda sin combustible tiene que decirlo
 * antes de pararse, no dentro de un informe, y no el día que ya se paró.
 *
 * Esto lo cuenta cada día desde el centinela. Avisa cuando quedan menos de
 * siete preguntas —una semana de margen, tiempo de sobra para que el domingo
 * siguiente el observatorio reponga— y se pone en rojo cuando quedan menos de
 * tres, que es cuando ya no da tiempo.
 *
 * No inventa preguntas ni edita nada. Cuenta, que es lo que faltaba.
 *
 * Uso:
 *   node scripts/qa-cola.mjs            informa y sale en verde siempre
 *   node scripts/qa-cola.mjs --vigilar  se pone en rojo si la cola está seca
 */

import { readFileSync } from 'node:fs';

const PREGUNTAS = 'automatizacion/preguntas.md';
const SEGUIMIENTO = 'automatizacion/seguimiento.md';

/* Una semana de margen: si el domingo que viene el observatorio repone, no se
   nota nada. Menos de tres es la zona en la que ya no da tiempo a reponer
   antes de que el redactor se quede sin nada delante. */
const AVISO = 7;
const ROJO = 3;

const VIGILAR = process.argv.includes('--vigilar');

/* Comparar preguntas escritas a mano en dos archivos distintos por dos manos
   distintas. Se quitan tildes, signos y mayúsculas: lo que queda es la pregunta
   sin la ortografía, que es lo único que se puede comparar sin falsos negativos
   por una coma de más. */
const normalizar = (t) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function leerPreguntas() {
  const lineas = readFileSync(PREGUNTAS, 'utf8').split('\n');
  const fuera = lineas.findIndex((l) => l.trim() === '---');
  const cuerpo = fuera === -1 ? lineas : lineas.slice(fuera + 1);

  const preguntas = [];
  let pilar = 'sin pilar';
  for (const linea of cuerpo) {
    const titulo = linea.match(/^##\s+(.+)$/);
    if (titulo) {
      pilar = titulo[1].trim();
      continue;
    }
    const punto = linea.match(/^-\s+(.+)$/);
    if (!punto) continue;
    /* `[sin verificar]` marca una pregunta que encaja con lo que hacemos pero
       de la que nadie ha comprobado que la busque alguien. Cuenta para que el
       redactor no se quede sin nada delante, y se cuenta aparte para que no se
       confunda con demanda medida. */
    const crudo = punto[1].trim();
    const sinVerificar = crudo.startsWith('[sin verificar]');
    preguntas.push({
      pilar,
      texto: crudo.replace(/^\[sin verificar\]\s*/, ''),
      sinVerificar,
    });
  }
  return preguntas;
}

function leerCubiertas() {
  const lineas = readFileSync(SEGUIMIENTO, 'utf8').split('\n');
  const registro = lineas.findIndex((l) => l.trim().startsWith('## Registro'));
  const cuerpo = registro === -1 ? lineas : lineas.slice(registro + 1);

  const filas = [];
  for (const linea of cuerpo) {
    if (linea.trim().startsWith('## ') && !linea.includes('Registro')) break;
    if (!linea.trim().startsWith('|')) continue;
    const celdas = linea.split('|').map((c) => c.trim());
    /* La cabecera y la línea de guiones de la tabla no son artículos. */
    if (celdas.length < 5) continue;
    if (/^-+$/.test(celdas[1].replace(/\s/g, ''))) continue;
    if (celdas[1].toLowerCase() === 'artículo') continue;
    /* Un artículo bilingüe responde la misma pregunta en los dos idiomas. La
       fila las lista separadas por ` / `, porque contar la inglesa como
       pendiente para siempre es exactamente cómo se falsea una cola llena. */
    const preguntas = celdas[3]
      .split(' / ')
      .map((q) => q.trim())
      .filter(Boolean);
    filas.push({ articulo: celdas[1].replace(/`/g, ''), preguntas });
  }
  return filas;
}

const preguntas = leerPreguntas();
const filas = leerCubiertas();
const cubiertas = new Set(filas.flatMap((f) => f.preguntas.map(normalizar)));

const pendientes = preguntas.filter((p) => !cubiertas.has(normalizar(p.texto)));

/* Una fila de seguimiento cuya pregunta ya no está en preguntas.md señala una
   de dos cosas: alguien borró la pregunta, o la escribió distinta en los dos
   sitios. Las dos ensucian la cuenta, así que se dicen en vez de callarse. */
const conocidas = new Set(preguntas.map((p) => normalizar(p.texto)));
const huerfanas = filas.flatMap((f) =>
  f.preguntas
    .filter((q) => !conocidas.has(normalizar(q)))
    .map((q) => ({ articulo: f.articulo, pregunta: q })),
);

console.log(`Preguntas en ${PREGUNTAS}: ${preguntas.length}`);
console.log(`Artículos con fila en ${SEGUIMIENTO}: ${filas.length}`);
console.log(`Preguntas pendientes: ${pendientes.length}\n`);

const medidas = pendientes.filter((p) => !p.sinVerificar);
const propuestas = pendientes.filter((p) => p.sinVerificar);

if (pendientes.length) {
  let pilar = '';
  for (const p of pendientes) {
    if (p.pilar !== pilar) {
      pilar = p.pilar;
      console.log(`  ${pilar}`);
    }
    console.log(`    · ${p.texto}${p.sinVerificar ? '  [sin verificar]' : ''}`);
  }
  console.log('');
}

console.log(`  De ellas, con demanda comprobada: ${medidas.length}`);
console.log(`  Propuestas sin verificar: ${propuestas.length}\n`);

if (huerfanas.length) {
  console.log('Filas de seguimiento cuya pregunta no está en preguntas.md');
  console.log('(o se borró la pregunta, o está escrita distinta en cada archivo):');
  for (const f of huerfanas) console.log(`    · ${f.articulo} → «${f.pregunta}»`);
  console.log('');
}

const dias = pendientes.length;
/* Una cola llena solo de propuestas sin verificar no es una cola llena: es una
   lista de intuiciones. Aguanta los días, sí, pero nadie ha comprobado que
   ninguna de esas preguntas la busque una persona. Se dice, y se dice aunque
   todo lo demás esté en verde. */
if (propuestas.length && medidas.length < ROJO) {
  console.log(
    `::warning::De las ${dias} preguntas pendientes, ${propuestas.length} están ` +
      `sin verificar y solo ${medidas.length} tienen demanda comprobada. El ` +
      `observatorio tiene que revisarlas el domingo: quitarles la marca a las ` +
      `que se busquen de verdad y borrar las que no.`,
  );
}

if (dias >= AVISO) {
  console.log(`La cola aguanta ${dias} días de publicación. Nada que hacer.`);
  process.exit(0);
}

const falta =
  `Quedan ${dias} preguntas sin cubrir: menos de ${AVISO}, que es una semana. ` +
  `Hay que añadir preguntas nuevas a ${PREGUNTAS} antes de que el redactor se ` +
  `quede sin nada delante y el día pase en blanco sin que nadie se entere.`;

if (dias < ROJO) {
  console.log(`::error::${falta}`);
  if (VIGILAR) process.exit(1);
} else {
  console.log(`::warning::${falta}`);
}
