/**
 * Cuánto pesa y cuánto tarda cada página, medido en un navegador de verdad.
 *
 * ---- Por qué en laboratorio y no con la herramienta de Google ----
 *
 * PageSpeed mide el sitio publicado, y eso llega horas tarde: cuando dice que
 * algo empeoró, ya está en la web. Esto mide `dist/` antes de subirlo, con la
 * CPU frenada cuatro veces y una red móvil simulada, para que el número se
 * parezca al de un teléfono real y no al de este servidor.
 *
 * Los números no son los de Google y no deben compararse con ellos: son de
 * laboratorio y sirven para comparar UNA versión con la ANTERIOR. Lo que
 * importa aquí es si algo se movió, no el número absoluto.
 *
 * ---- Qué mide, y por qué esos tres ----
 *
 *   · LCP  — cuándo aparece lo más grande de la pantalla. Es lo que la gente
 *            llama «tarda en cargar». Google pide menos de 2,5 s.
 *   · CLS  — cuánto se mueve la página sola mientras carga. Un botón que se
 *            desplaza cuando alguien va a pulsarlo. Google pide menos de 0,1.
 *   · TBT  — cuánto tiempo el navegador estuvo ocupado y no respondía al dedo.
 *            No es una métrica de Google, pero es la que predice la que sí lo
 *            es (INP), y es la que delata el JavaScript de más.
 *
 * Y el peso: cuántos bytes se descargan de verdad, que es lo que paga quien
 * entra con datos móviles.
 *
 * Uso:  node scripts/medir-rendimiento.mjs
 *       CHROMIUM_PATH=… node scripts/medir-rendimiento.mjs   (en este entorno)
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const PUERTO = 5300;

/* Las rutas que se miden. No son todas: son una de cada forma que tiene el
   sitio, porque medir noventa páginas para descubrir lo mismo nueve veces
   cuesta media hora y no dice nada nuevo. */
const RUTAS = [
  ['/es', 'portada'],
  ['/es/servicios', 'servicios'],
  ['/es/industrias/banca-seguros-fintech', 'una industria'],
  ['/es/casos-de-uso', 'casos de uso'],
  ['/es/insights', 'insights'],
  ['/es/contacto', 'contacto'],
];

/* Los presupuestos. Un aviso no es un fallo: es el número a partir del cual
   conviene mirar antes de que se convierta en un fallo. */
const TOPES = { lcp: 2500, cls: 0.1, tbt: 300, js: 200 * 1024 };

const tipo = (p) => p.endsWith('.js') ? 'text/javascript'
  : p.endsWith('.css') ? 'text/css'
  : p.endsWith('.woff2') ? 'font/woff2'
  : p.endsWith('.webp') ? 'image/webp'
  : p.endsWith('.svg') ? 'image/svg+xml'
  : p.endsWith('.json') ? 'application/json'
  : p.endsWith('.png') ? 'image/png'
  : p.endsWith('.jpg') ? 'image/jpeg'
  : 'text/html';

/* Comprime lo mismo que comprime el hosting.
 *
 * Sin esto la medida miente por cuatro: el bundle pesa 723 kB en disco y unos
 * 190 kB por el cable. El .htaccess declara DEFLATE y BROTLI para JavaScript,
 * CSS, HTML, JSON y SVG, así que aquí se hace lo mismo —gzip, que es el suelo
 * de los dos— y el número se parece a lo que paga quien entra con datos. */
const COMPRIME = /^(text\/|application\/(javascript|json|xml)|image\/svg)/;

const servidor = createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  for (const f of [`dist${u}`, `dist/_pages${u}.html`, 'dist/index.html']) {
    if (existsSync(f) && statSync(f).isFile()) {
      const t = tipo(f);
      let cuerpo = readFileSync(f);
      const cabeceras = { 'content-type': t };
      if (COMPRIME.test(t) && (q.headers['accept-encoding'] || '').includes('gzip')) {
        cuerpo = gzipSync(cuerpo);
        cabeceras['content-encoding'] = 'gzip';
      }
      /* Declarado a mano: sin content-length Node responde troceado, la
         cabecera no llega y la medida vuelve a contar el descomprimido. */
      cabeceras['content-length'] = String(cuerpo.length);
      r.writeHead(200, cabeceras);
      return r.end(cuerpo);
    }
  }
  r.writeHead(404); r.end();
}).listen(PUERTO);

const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

const filas = [];
for (const [ruta, nombre] of RUTAS) {
  const ctx = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const pg = await ctx.newPage();

  /* Bytes de verdad: lo que viaja por el cable, no lo que ocupa en disco.
     Se cuenta por respuesta y separando el JavaScript, que es el que se paga
     dos veces —al descargarlo y al ejecutarlo—. */
  const bytes = { total: 0, js: 0, css: 0, img: 0, fuente: 0 };
  pg.on('response', async (res) => {
    try {
      /* El tamaño que viajó, no el descomprimido: `body()` ya viene
         descomprimido, así que se lee de la cabecera cuando está. */
      const n = Number(res.headers()['content-length']) || (await res.body()).length;
      bytes.total += n;
      const t = res.request().resourceType();
      if (t === 'script') bytes.js += n;
      else if (t === 'stylesheet') bytes.css += n;
      else if (t === 'image') bytes.img += n;
      else if (t === 'font') bytes.fuente += n;
    } catch { /* una respuesta sin cuerpo no cuenta */ }
  });

  const cdp = await ctx.newCDPSession(pg);
  /* Cuatro veces más lenta. Es el freno que usa Lighthouse para móvil, y sin
     él este servidor mide como un ordenador de escritorio caro. */
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await pg.goto(`http://localhost:${PUERTO}${ruta}`, { waitUntil: 'load' });
  /* Cinco segundos de observación después de cargar: el desplazamiento de
     diseño y el trabajo tardío no ocurren en el instante del load. */
  await pg.waitForTimeout(5000);

  const m = await pg.evaluate(() => new Promise((listo) => {
    let lcp = 0, cls = 0, tbt = 0;
    for (const e of performance.getEntriesByType('largest-contentful-paint') || []) lcp = e.startTime;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
      /* El tiempo de bloqueo: de cada tarea larga, lo que pasa de 50 ms. */
      new PerformanceObserver((l) => { for (const e of l.getEntries()) tbt += Math.max(0, e.duration - 50); })
        .observe({ type: 'longtask', buffered: true });
    } catch { /* un navegador sin estos observadores devuelve lo que tenga */ }
    setTimeout(() => listo({ lcp: Math.round(lcp), cls: Math.round(cls * 1000) / 1000, tbt: Math.round(tbt) }), 400);
  }));

  filas.push({ nombre, ruta, ...m, ...bytes });
  await ctx.close();
}
await navegador.close();
servidor.close();

const kb = (n) => `${Math.round(n / 1024)} kB`;
const marca = (v, tope) => (v > tope ? '  ← pasa del presupuesto' : '');

console.log('Medido con la CPU frenada 4× y pantalla de móvil. Números de');
console.log('laboratorio: sirven para comparar con la versión anterior, no con Google.\n');
console.log(`${'página'.padEnd(15)}${'LCP'.padStart(8)}${'CLS'.padStart(8)}${'TBT'.padStart(8)}${'JS'.padStart(10)}${'total'.padStart(10)}`);
for (const f of filas) {
  console.log(
    f.nombre.padEnd(15) +
    `${f.lcp} ms`.padStart(8) +
    `${f.cls}`.padStart(8) +
    `${f.tbt} ms`.padStart(8) +
    kb(f.js).padStart(10) +
    kb(f.total).padStart(10),
  );
}

const avisos = [];
for (const f of filas) {
  if (f.lcp > TOPES.lcp) avisos.push(`${f.nombre}: LCP ${f.lcp} ms (tope ${TOPES.lcp})`);
  if (f.cls > TOPES.cls) avisos.push(`${f.nombre}: CLS ${f.cls} (tope ${TOPES.cls})`);
  if (f.tbt > TOPES.tbt) avisos.push(`${f.nombre}: TBT ${f.tbt} ms (tope ${TOPES.tbt})`);
  if (f.js > TOPES.js) avisos.push(`${f.nombre}: ${kb(f.js)} de JavaScript (tope ${kb(TOPES.js)})`);
}
console.log('');
if (avisos.length) {
  for (const a of avisos) console.log(`::warning::${a}`);
  console.log(`\n${avisos.length} ${avisos.length === 1 ? 'medida se pasa' : 'medidas se pasan'} del presupuesto.`);
} else {
  console.log('Las seis páginas caben en el presupuesto.');
}
/* Nunca tumba el despliegue: es una medida, no una puerta. Una red lenta en el
   servidor de turno no debería impedir publicar un texto corregido. */
process.exit(0);
