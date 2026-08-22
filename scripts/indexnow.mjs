/**
 * Avisa a los buscadores que usan IndexNow de lo que acaba de cambiar.
 *
 * Qué es: un protocolo abierto para decirle a un buscador «esta dirección
 * cambió» en vez de esperar a que vuelva a pasar por ahí. Lo usan Bing, Yandex,
 * Seznam, Naver y Yep. **Google no lo usa**, y conviene tenerlo claro para no
 * esperar de esto lo que no puede dar: para Google, el camino sigue siendo el
 * sitemap y Search Console.
 *
 * Entonces, ¿para qué? Porque el índice de Bing es el que alimenta a Copilot y
 * el que ChatGPT consulta cuando busca en la web. Un sitio que quiere aparecer
 * en respuestas de IA —que es literalmente el negocio de BECOME— gana semanas
 * ahí, no en Google. Bing suele indexar en horas lo que se le avisa.
 *
 * La clave NO es un secreto. Es el diseño del protocolo: se publica en el sitio
 * en `/<clave>.txt` para demostrar que quien avisa controla el dominio. Por eso
 * vive en el repositorio y no en los secretos de GitHub: guardarla como secreto
 * daría una falsa sensación de protección sobre un dato que cualquiera puede
 * leer pidiendo el archivo.
 *
 * Solo avisa de lo que cambió de verdad, leyendo el `lastmod` del sitemap. Un
 * aviso diario de las noventa páginas enteras sería ruido, y los buscadores
 * tratan el ruido como lo que es.
 *
 * Nunca hace fallar el despliegue. Es una cortesía hacia un buscador, no una
 * condición para publicar: si su servidor no responde, el sitio ya está en la
 * web igual y el sitemap sigue diciendo lo mismo.
 */

import { readFileSync, readdirSync } from 'node:fs';

const SITIO = 'https://meetbecome.com';
const HOST = 'meetbecome.com';
const DIAS = 2;

/* La clave es el nombre del archivo que la contiene: así no hay dos sitios
   donde escribirla y no pueden desincronizarse. Si algún día hay que rotarla,
   se borra el archivo y se pone otro; esto se entera solo. */
const archivos = readdirSync('assets').filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (archivos.length !== 1) {
  console.log(`::warning::Se esperaba exactamente un archivo de clave IndexNow en assets/ y hay ${archivos.length}. No se avisa a nadie.`);
  process.exit(0);
}
const clave = archivos[0].replace('.txt', '');
const contenido = readFileSync(`assets/${archivos[0]}`, 'utf8').trim();
if (contenido !== clave) {
  console.log('::warning::El archivo de clave IndexNow no contiene su propio nombre; el buscador rechazaría el aviso. No se envía.');
  process.exit(0);
}

/* Qué cambió: las direcciones cuyo lastmod es de hoy o de ayer. El margen de un
   día cubre el desfase entre la zona horaria del sitemap y la del servidor que
   ejecuta esto, que si no dejaría fuera justo lo recién publicado. */
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const corte = new Date(Date.now() - DIAS * 86400000).toISOString().slice(0, 10);

/* Bloque a bloque, y no con una sola expresión sobre el archivo entero: entre
   el <loc> y el <lastmod> de cada entrada van los enlaces hreflang, así que
   una expresión que los espere pegados no casa con nada — y «nada que avisar»
   se parece demasiado a «todo en orden» como para dejarlo pasar. */
const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)]
  .map(([, bloque]) => [
    bloque.match(/<loc>([^<]+)<\/loc>/)?.[1],
    bloque.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  ])
  .filter(([loc, lastmod]) => loc && lastmod && lastmod.slice(0, 10) >= corte)
  .map(([loc]) => loc);

if (!urls.length) {
  console.log('Ninguna dirección ha cambiado en los últimos días. No hay nada que avisar.');
  process.exit(0);
}

console.log(`Direcciones cambiadas desde ${corte}: ${urls.length}`);

const cuerpo = {
  host: HOST,
  key: clave,
  keyLocation: `${SITIO}/${clave}.txt`,
  urlList: urls,
};

try {
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(30000),
  });

  /* Los códigos que devuelve el protocolo, traducidos. Ninguno hace fallar el
     paso: se informa y se sigue. */
  const explicacion = {
    200: 'Recibido y aceptado.',
    202: 'Recibido. El buscador aún no ha comprobado la clave; lo hará al rastrear.',
    400: 'Petición mal formada. Revisa el cuerpo que se envía.',
    403: 'Clave rechazada: el buscador no encontró el archivo de clave en el sitio, o no coincide.',
    422: 'Alguna dirección no pertenece a este dominio, o la clave no corresponde.',
    429: 'Demasiados avisos. Se ignora este; el siguiente despliegue vuelve a intentarlo.',
  }[r.status] || 'Respuesta no documentada.';

  if (r.status === 200 || r.status === 202) {
    console.log(`IndexNow respondió ${r.status}. ${explicacion}`);
  } else {
    console.log(`::warning::IndexNow respondió ${r.status}. ${explicacion}`);
    console.log(`::warning::El sitio está publicado igual; esto solo afecta a la rapidez con que Bing y compañía se enteran.`);
  }
} catch (e) {
  console.log(`::warning::No se pudo avisar a IndexNow (${e.message}). El sitio está publicado igual.`);
}
