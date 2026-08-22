/**
 * ¿Cabe el presupuesto de la subida dentro del plazo del paso que la ejecuta?
 *
 * Esta comprobación existe porque el mismo error ocurrió dos veces, con dos
 * números distintos:
 *
 *   · 21 de agosto — el paso de subida tenía 6 minutos. Un tropiezo del FTP se
 *     los comió y el artículo del día se quedó en el repositorio.
 *   · 22 de agosto — se subió a 16, pero el paso programa TRES intentos de 5
 *     minutos más esperas de 45 y 90 segundos: 17 minutos y medio. Se cortó a
 *     los 16:12, en mitad del tercer intento, y el artículo del día volvió a
 *     quedarse en el repositorio.
 *
 * Lo que falla no es el número: es que hay dos números que tienen que
 * relacionarse entre sí —lo que el paso programa y lo que el paso dura— y viven
 * a doscientas líneas de distancia en el mismo archivo. Nadie los compara al
 * cambiar uno. Esto los compara.
 *
 * Corre dentro del propio despliegue, antes de compilar: si los plazos no
 * cuadran, el despliegue falla en veinte segundos y en ROJO, con la aritmética
 * escrita, en vez de fallar a los veinte minutos y en gris.
 *
 * Y una nota sobre el gris: cuando un paso agota su `timeout-minutes`, GitHub
 * marca el trabajo como «cancelled», no como «failed». En la lista de Actions
 * eso no parece un error, parece que alguien lo paró a mano. Por eso la
 * comprobación tiene que ser previa: el fallo tardío no se ve.
 */

import { readFileSync } from 'node:fs';

const RUTA = '.github/workflows/deploy.yml';
const yml = readFileSync(RUTA, 'utf8');

/* Margen de seguridad. No es superstición: el reloj del paso empieza antes que
   el primer intento (instalar lftp, resolver DNS, negociar TLS) y sigue
   corriendo después del último. Un presupuesto que cuadra al segundo es un
   presupuesto que no cuadra. */
const MARGEN_S = 90;

/* Lo que tarda todo lo que NO es la subida: instalar dependencias, bajar el
   navegador del prerenderizado, compilar, prerenderizar y las comprobaciones
   posteriores. Medido sobre los despliegues reales: entre 3 y 5 minutos. Se
   toma el peor caso con holgura. */
const RESTO_DEL_TRABAJO_MIN = 8;

const fallos = [];
const decir = [];

/* ---- Los números, leídos del propio archivo ---------------------------- */

/* El plazo del trabajo: el primer `timeout-minutes` del archivo, que está a la
   altura del job y no dentro de ningún paso (dos niveles de sangría). */
const mTrabajo = yml.match(/^ {4}timeout-minutes: (\d+)$/m);
if (!mTrabajo) fallos.push(`No se encontró el timeout-minutes del trabajo en ${RUTA}.`);
const trabajoMin = mTrabajo ? Number(mTrabajo[1]) : null;

/* El bloque del paso que sube al hosting, desde su nombre hasta el siguiente
   paso. Todo lo demás se busca dentro de él y no en el archivo entero: así un
   `timeout` de otro paso no puede colarse en esta cuenta. */
const iPaso = yml.indexOf('      - name: Subir a public_html');
if (iPaso < 0) fallos.push(`No se encontró el paso «Subir a public_html» en ${RUTA}.`);
const siguiente = yml.indexOf('\n      - name: ', iPaso + 1);
const paso = iPaso < 0 ? '' : yml.slice(iPaso, siguiente < 0 ? yml.length : siguiente);

const mPaso = paso.match(/^ {8}timeout-minutes: (\d+)$/m);
if (!mPaso) fallos.push('El paso «Subir a public_html» no declara timeout-minutes.');
const pasoMin = mPaso ? Number(mPaso[1]) : null;

/* Cada intento lleva su propio `timeout N lftp`. */
const mIntento = paso.match(/timeout (\d+) lftp/);
if (!mIntento) fallos.push('No se encontró el «timeout N lftp» de cada intento.');
const intentoS = mIntento ? Number(mIntento[1]) : null;

/* Cuántos intentos programa el bucle. */
const mBucle = paso.match(/for intento in ([\d ]+); do/);
if (!mBucle) fallos.push('No se encontró el bucle de reintentos.');
const intentos = mBucle ? mBucle[1].trim().split(/\s+/).length : null;

/* Y cuánto se espera entre uno y otro: ESPERA=$((intento * N)). */
const mEspera = paso.match(/ESPERA=\$\(\(intento \* (\d+)\)\)/);
if (!mEspera) fallos.push('No se encontró la espera entre intentos.');
const esperaBase = mEspera ? Number(mEspera[1]) : null;

/* ---- La aritmética ------------------------------------------------------ */

if (!fallos.length) {
  /* Las esperas van entre intentos, así que hay una menos que intentos: con
     tres intentos se espera dos veces, 1×base y 2×base. */
  let esperasS = 0;
  for (let i = 1; i < intentos; i++) esperasS += i * esperaBase;

  const programadoS = intentos * intentoS + esperasS;
  const disponibleS = pasoMin * 60;

  decir.push(`Intentos de subida:      ${intentos} × ${intentoS}s = ${intentos * intentoS}s`);
  decir.push(`Esperas entre intentos:  ${esperasS}s`);
  decir.push(`Margen de seguridad:     ${MARGEN_S}s`);
  decir.push(`─────────────────────────────────────────`);
  decir.push(`El paso puede gastar:    ${programadoS + MARGEN_S}s (${((programadoS + MARGEN_S) / 60).toFixed(1)} min)`);
  decir.push(`El paso tiene:           ${disponibleS}s (${pasoMin} min)`);

  if (programadoS + MARGEN_S > disponibleS) {
    const necesarios = Math.ceil((programadoS + MARGEN_S) / 60);
    fallos.push(
      `El paso «Subir a public_html» programa hasta ${((programadoS + MARGEN_S) / 60).toFixed(1)} minutos `
      + `de trabajo y solo tiene ${pasoMin}. El tercer intento se corta a medias y el despliegue `
      + `termina en gris, marcado como «cancelado». Sube su timeout-minutes a ${necesarios} o más, `
      + `o baja el número de intentos o su duración.`,
    );
  }

  decir.push('');
  decir.push(`El trabajo entero tiene: ${trabajoMin} min`);
  decir.push(`Necesita al menos:       ${pasoMin} (subida) + ${RESTO_DEL_TRABAJO_MIN} (compilar y comprobar) = ${pasoMin + RESTO_DEL_TRABAJO_MIN} min`);

  if (trabajoMin < pasoMin + RESTO_DEL_TRABAJO_MIN) {
    fallos.push(
      `El trabajo tiene ${trabajoMin} minutos, y solo la subida ya puede gastar ${pasoMin}. `
      + `Compilar y comprobar se llevan otros ${RESTO_DEL_TRABAJO_MIN}: el trabajo muere por tiempo `
      + `justo cuando la subida está reintentando. Sube su timeout-minutes a ${pasoMin + RESTO_DEL_TRABAJO_MIN} o más.`,
    );
  }
}

/* ---- El veredicto ------------------------------------------------------- */

for (const l of decir) console.log(l);

if (fallos.length) {
  console.log('');
  for (const f of fallos) console.error(`::error::${f}`);
  process.exit(1);
}

console.log('');
console.log('Los plazos cuadran: lo que la subida puede llegar a gastar cabe en su paso, y el paso cabe en el trabajo.');
