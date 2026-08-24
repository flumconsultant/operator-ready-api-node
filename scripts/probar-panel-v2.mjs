/**
 * El panel, usado de verdad en un navegador.
 *
 * ---- Por qué existe además del compilador ----
 *
 * Que `vite build` termine en verde solo dice que el código es JavaScript
 * válido. No dice si la pantalla de inicio se dibuja, si el anillo de avance
 * marca el porcentaje que corresponde, si el chip de una sección vacía sale
 * gris o si la vista previa de Google recorta el título donde tiene que
 * recortarlo. Todo eso compila igual de bien estando mal.
 *
 * Aquí se levanta el sitio compilado, se responde a la API del panel con datos
 * REALES del repositorio —el esquema de industrias y su contenido, no un
 * invento— y se recorre el panel como lo recorrería una persona: entrar, mirar
 * Hoy, abrir Contenido, filtrar, abrir una industria, escribir un título largo
 * y ver dónde lo corta Google.
 *
 * Los datos son los del repositorio a propósito. Con datos inventados, una
 * pantalla que falla justo con contenido real —un nombre de veinte caracteres,
 * una sección sin campos— pasa la prueba.
 *
 * Uso:  node scripts/probar-panel-v2.mjs
 *       CHROMIUM_PATH=… node scripts/probar-panel-v2.mjs   (en este entorno)
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const SALIDA = 'capturas-panel';
mkdirSync(SALIDA, { recursive: true });

const tipo = (p) => p.endsWith('.js') ? 'text/javascript' : p.endsWith('.css') ? 'text/css'
  : p.endsWith('.svg') ? 'image/svg+xml' : p.endsWith('.webp') ? 'image/webp'
  : p.endsWith('.png') ? 'image/png' : p.endsWith('.woff2') ? 'font/woff2' : 'text/html';

const srv = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  for (const f of [`dist${u}`, `dist/_pages${u}.html`, 'dist/index.html']) {
    if (existsSync(f) && statSync(f).isFile()) { res.writeHead(200, { 'content-type': tipo(f) }); return res.end(readFileSync(f)); }
  }
  res.writeHead(404); res.end();
}).listen(4401);

/* ---- Los datos, sacados del repositorio --------------------------------- */

const esquema = JSON.parse(readFileSync('src/content/esquemas/industrias.json', 'utf8'));
const industrias = JSON.parse(readFileSync('src/content/industrias.json', 'utf8'));

const claves = industrias.map((x, i) => ({ clave: String(i), nombre: x.es?.nombre || `#${i}` }));

const conocimiento = [
  { _archivo: 'identidad.json', titulo: 'Identidad', campos: [
    { id: 'promesa', rotulo: 'Promesa', valor: 'Operaciones que deciden solas.' },
    { id: 'categoria', rotulo: 'Categoría', valor: 'Consultoría AI-native' },
    { id: 'filosofia', rotulo: 'Filosofía', valor: '' },
  ] },
  { _archivo: 'comercial.json', titulo: 'Comercial', campos: [
    { id: 'rango', rotulo: 'Rango de proyecto', valor: '' },
    { id: 'cobro', rotulo: 'Modelo de cobro', valor: '' },
    { id: 'incluye', rotulo: 'Qué incluye', valor: '' },
  ] },
];

const articulos = [
  { archivo: 'quien-responde.json', sha: 'a1', articulo: { estado: 'publicado', fecha: new Date().toISOString().slice(0, 10), es: { titulo: 'Quién responde cuando responde un agente', slug: 'quien-responde' }, en: { titulo: 'Who answers', slug: 'who-answers' } } },
  { archivo: 'sin-ingles.json', sha: 'a2', articulo: { estado: 'publicado', fecha: '2026-08-20', es: { titulo: 'Un artículo que solo existe en español', slug: 'solo-es' } } },
];

const RESPUESTAS = {
  yo: { ok: true, nombre: 'carlos' },
  listar: { ok: true, articulos, vacio_en: '' },
  'listar-esquemas': { ok: true, esquemas: [{ id: 'industrias', titulo: 'Industrias', campos: esquema.campos.length }] },
  'listar-paginas': { ok: true, paginas: conocimiento },
  suscriptores: { ok: true, configurado: true, totales: { confirmado: 12, pendiente: 3, baja: 1 },
    ultimos: [
      { email: 'maria.velez@ejemplo.pe', estado: 'confirmado', idioma: 'es', alta_en: `${new Date().toISOString().slice(0, 7)}-03`, confirmado_en: `${new Date().toISOString().slice(0, 7)}-03`, origen: 'insights' },
      { email: 'jsalas@ejemplo.pe', estado: 'pendiente', idioma: 'es', alta_en: '2026-07-19', confirmado_en: null, origen: '' },
    ], fallos: [] },
  'diagnostico-correo': { ok: true, estado: 'bien' },
  historial: { ok: true, versiones: [
    { fecha: new Date(Date.now() - 2 * 86400000).toISOString(), quien: 'Carlos', que: 'Reordenó Oportunidades y reescribió el resumen' },
    { fecha: new Date(Date.now() - 6 * 86400000).toISOString(), quien: 'Agente', que: 'Añadió dos métricas de la última planta' },
    { fecha: new Date(Date.now() - 40 * 86400000).toISOString(), quien: 'Ana', que: 'Tradujo Portada y Cierre al inglés' },
  ] },
};

/* ---- El recorrido -------------------------------------------------------- */

const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const fallos = [];

/* Si el recorrido se rompe a mitad —un botón que ya no existe, una pantalla que
   no llega a dibujarse— el proceso moriría con una excepción y sin escribir
   ninguna línea de ::error. Un despliegue leyendo eso vería un fallo sin causa.
   Aquí la excepción se convierte en el hallazgo que es: el panel dejó de poder
   usarse en ese punto. */
process.on('uncaughtException', (e) => {
  console.log(`::error::El recorrido se rompió antes de terminar: ${e.message}`);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  console.log(`::error::El recorrido se rompió antes de terminar: ${e?.message || e}`);
  process.exit(1);
});
const di = (ok, texto) => { console.log(`${ok ? 'ok ' : '✗  '} ${texto}`); if (!ok) fallos.push(texto); };
const quejas = [];

async function abrirPanel(ancho, alto) {
  const ctx = await b.newContext({ viewport: { width: ancho, height: alto } });
  const pg = await ctx.newPage();
  pg.on('console', (m) => { if (m.type() === 'error') quejas.push(m.text()); });
  pg.on('pageerror', (e) => quejas.push(e.message));
  await pg.route('**/api/panel.php*', async (ruta) => {
    const req = ruta.request();
    let accion = new URL(req.url()).searchParams.get('accion');
    let cuerpo = {};
    if (req.method() === 'POST') { cuerpo = JSON.parse(req.postData() || '{}'); accion = cuerpo.accion; }
    let datos = RESPUESTAS[accion];
    if (accion === 'abrir-esquema') {
      datos = { ok: true, esquema, datos: industrias, claves, idioma: cuerpo.idioma || 'es' };
    }
    if (!datos) datos = { ok: true };
    await ruta.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(datos) });
  });
  await pg.goto('http://localhost:4401/admin', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(700);
  return { ctx, pg };
}

/* ---- 1. Móvil: la pantalla de inicio ------------------------------------- */

const movil = await abrirPanel(390, 844);
{
  const { pg } = movil;
  di(await pg.locator('.pnl-hoy').count() === 1, 'se entra por la pantalla Hoy');
  di(/Buen[oa]s/.test(await pg.locator('.pnl-hoy-cab h2').innerText()), 'saluda por la hora del día');

  const titular = await pg.locator('.pnl-hoy-titular').innerText().catch(() => '');
  di(titular.includes('Quién responde'), `la tarjeta del agente enseña el último artículo · «${titular.slice(0, 40)}»`);

  const deudas = await pg.locator('.pnl-hoy-deuda').allInnerTexts();
  /* Cuatro campos vacíos en el conocimiento de prueba y un artículo sin
     inglés: las dos cifras se calculan, no se escriben. */
  di(deudas.some((d) => d.startsWith('4')), `cuenta los campos de conocimiento sin escribir · ${JSON.stringify(deudas)}`);
  di(deudas.some((d) => d.includes('inglés')), 'cuenta los artículos sin versión en inglés');

  di(await pg.locator('.pnl-mod').count() === 4, 'la cuadrícula de módulos tiene cuatro');
  di(await pg.locator('.pnl-mod-barra').count() === 2, 'solo llevan barra los dos módulos con avance real');

  /* La barra de pestañas: cuatro destinos, 44 px de alto real. */
  const pestanas = pg.locator('.pnl-pestana');
  di(await pestanas.count() === 4, 'la barra inferior tiene cuatro pestañas');
  const alturas = await pestanas.evaluateAll((ns) => ns.map((n) => n.getBoundingClientRect().height));
  di(alturas.every((h) => h >= 44), `todas las pestañas miden 44 px o más · ${alturas.join(', ')}`);

  await pg.screenshot({ path: `${SALIDA}/1-hoy-movil.png`, fullPage: true });
}

/* ---- 2. Móvil: la lista de industrias ------------------------------------ */
{
  const { pg } = movil;
  await pg.locator('.pnl-pestana', { hasText: 'Contenido' }).click();
  await pg.waitForTimeout(500);
  await pg.locator('.pnl-tarjeta', { hasText: 'Industrias' }).click();
  await pg.waitForTimeout(900);

  const filas = pg.locator('.pnl-fila-elem');
  const n = await filas.count();
  di(n === claves.length, `la lista enseña las ${claves.length} industrias · salieron ${n}`);
  di(await pg.locator('.pnl-anillo').count() === n, 'cada fila lleva su anillo de avance');

  const pastillas = await pg.locator('.pnl-fila-elem').first().locator('.pnl-idioma').allInnerTexts();
  di(pastillas.join('') === 'ESEN', `las pastillas de idioma dicen ES y EN · ${JSON.stringify(pastillas)}`);

  /* El anillo tiene que decir un porcentaje calculado, no uno fijo. */
  const pcts = await pg.locator('.pnl-anillo > span').allInnerTexts();
  di(pcts.every((p) => /^\d+$/.test(p)), `los anillos llevan su cifra · ${pcts.join(' ')}`);

  await pg.screenshot({ path: `${SALIDA}/2-lista-movil.png`, fullPage: true });

  /* Los filtros. «Sin escribir» no puede devolver más filas que «Todas». */
  await pg.locator('.pnl-chip', { hasText: 'Sin escribir' }).click();
  await pg.waitForTimeout(300);
  const tras = await pg.locator('.pnl-fila-elem').count();
  di(tras <= n, `el filtro «Sin escribir» reduce o mantiene · ${tras} de ${n}`);
  await pg.locator('.pnl-chip', { hasText: 'Todas' }).click();
  await pg.waitForTimeout(300);
  di(await pg.locator('.pnl-fila-elem').count() === n, 'y «Todas» las devuelve');
}

/* ---- 3. Móvil: el editor ------------------------------------------------- */
{
  const { pg } = movil;
  await pg.locator('.pnl-fila-elem').first().click();
  await pg.waitForTimeout(700);

  di(await pg.locator('.pnl-avance-barra').count() === 1, 'en el móvil el editor lleva la barra de avance del elemento');
  const cifra = await pg.locator('.pnl-avance-cifra').innerText();
  di(/^\d+\/\d+$/.test(cifra), `y su cifra · ${cifra}`);
  di((await pg.locator('.pnl-avance .pnl-pastilla').innerText()).toLowerCase().includes('al día'), 'y la pastilla dice «Al día» antes de tocar nada');

  const puntos = await pg.locator('.pnl-punto').count();
  di(puntos > 0, `el índice lleva ${puntos} puntos de estado`);
  const estados = await pg.locator('.pnl-punto').evaluateAll((ns) => [...new Set(ns.map((x) => x.dataset.estado))]);
  di(estados.length > 0, `estados presentes · ${estados.join(', ')}`);

  /* Escribir marca el elemento como sin publicar. Es el comportamiento que
     evita la pregunta «¿esto llegó a salir?». */
  const primera = pg.locator('.pnl-entrada').first();
  await primera.fill('Manufactura industrial de prueba');
  await pg.waitForTimeout(300);
  di((await pg.locator('.pnl-avance .pnl-pastilla').innerText()).toLowerCase().includes('sin publicar'), 'al escribir, la pastilla pasa a «Sin publicar»');
  di(await pg.locator('.pnl-pastilla').count() === 1, 'y lo dice UNA vez, no tres');

  /* Nada se sale por el lado. Un panel que se desplaza en horizontal en un
     móvil es un panel donde la mitad de los controles quedan fuera. */
  const desborda = await pg.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  di(!desborda, 'el editor no se desborda a lo ancho en 390 px');

  await pg.screenshot({ path: `${SALIDA}/3-editor-movil.png`, fullPage: true });
}

/* ---- 4. La vista previa de Google, en el editor de artículos -------------- */
{
  const { pg } = movil;
  await pg.locator('.pnl-pestana', { hasText: 'Artículos' }).click();
  await pg.waitForTimeout(600);
  await pg.locator('.pnl-tarjeta').first().click();
  await pg.waitForTimeout(600);

  const serp = pg.locator('.pnl-serp');
  di(await serp.count() >= 1, 'el editor de artículo enseña la vista previa de Google');

  const largo = 'Un titular deliberadamente larguísimo que pasa de sesenta caracteres para ver el corte';
  await pg.locator('textarea').first().fill(largo);
  await pg.waitForTimeout(300);
  const dibujado = await serp.locator('.pnl-serp-titulo').first().innerText();
  di(dibujado.endsWith('…'), `el título de más de 60 se corta con puntos · «${dibujado}»`);
  di(dibujado.length <= 62, `y el corte respeta el límite · ${dibujado.length} caracteres`);
  di((await serp.first().innerText()).includes('se corta'), 'y lo dice con palabras debajo');

  /* Y que la vista previa del artículo no se coma la pantalla ni tape la barra
     de abajo. Estaba escrita como dos columnas fijas, así que en un móvil se
     repartía 390 px entre el formulario y una previsualización de fondo claro
     que acababa encima de las pestañas. Se veía y compilaba igual de bien. */
  await pg.locator('button', { hasText: 'Ver vista previa' }).first().click().catch(() => {});
  await pg.waitForTimeout(400);
  const columnas = await pg.locator('.pnl-doble').evaluate((n) => getComputedStyle(n).gridTemplateColumns);
  di(columnas.split(' ').length === 1, `con la vista previa abierta en el móvil, una sola columna · ${columnas}`);

  const tapada = await pg.evaluate(() => {
    const barra = document.querySelector('.pnl-pestanas');
    if (!barra) return 'no hay barra';
    const c = barra.getBoundingClientRect();
    const encima = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
    return encima && barra.contains(encima) ? '' : 'la barra inferior está tapada por otra cosa';
  });
  di(tapada === '', tapada || 'nada se monta encima de la barra inferior');

  await pg.screenshot({ path: `${SALIDA}/4-google-movil.png`, fullPage: true });
}

await movil.ctx.close();

/* ---- 5. Escritorio: el panel derecho ------------------------------------- */
{
  const { ctx, pg } = await abrirPanel(1440, 1000);
  di(await pg.locator('.pnl-pestanas').isVisible() === false, 'en el ordenador no hay barra de pestañas: ya está la columna lateral');
  di(await pg.locator('.pnl-lateral').isVisible(), 'y sí está la columna lateral');

  await pg.locator('.pnl-nav-item', { hasText: 'Contenido' }).first().click();
  await pg.waitForTimeout(500);
  await pg.locator('.pnl-tarjeta', { hasText: 'Industrias' }).click();
  await pg.waitForTimeout(900);
  await pg.locator('.pnl-fila-elem').first().click();
  await pg.waitForTimeout(700);

  const lado = pg.locator('.pnl-lado');
  di(await lado.isVisible(), 'a 1440 px aparece el panel derecho con la vista previa y el estado');
  di((await lado.innerText()).includes('Campos escritos'), 'y dice cuántos campos están escritos');

  /* Las tres columnas del handoff, medidas y no supuestas. */
  const anchos = await pg.evaluate(() => {
    const g = document.querySelector('.pnl-editor');
    return g ? getComputedStyle(g).gridTemplateColumns : '';
  });
  di(anchos.startsWith('250px') && anchos.endsWith('320px'), `el editor son tres columnas: índice, formulario y estado · ${anchos}`);
  di(await pg.locator('.pnl-indice').evaluate((n) => getComputedStyle(n).flexDirection) === 'column', 'el índice de secciones es una columna vertical, no una tira de chips');
  di(await pg.locator('.pnl-lateral').evaluate((n) => n.getBoundingClientRect().width) === 76, 'y la columna de módulos se queda en un riel de 76 px');
  di(await pg.locator('.pnl-historial li').count() > 0, 'el panel derecho enseña el historial de versiones');
  di((await pg.locator('.pnl-editor-cab').innerText()).includes('Sin cambios'), 'y el botón de publicar está en la barra del editor');

  await pg.screenshot({ path: `${SALIDA}/5-editor-escritorio.png`, fullPage: false });
  await ctx.close();
}

/* ---- 6. Y a 1280, donde el panel derecho no cabe -------------------------
 *
 * Se comprueba con un ARTÍCULO y no con una industria, y la diferencia es
 * informativa: el esquema de industrias no tiene meta título ni meta
 * descripción —los genera el compilador, no se escriben a mano— así que ahí la
 * vista previa no se dibuja, y hace bien. Enseñar un resultado de búsqueda
 * inventado a partir de campos que no lo alimentan sería peor que no enseñar
 * nada. */
{
  const { ctx, pg } = await abrirPanel(1280, 900);
  di(await pg.locator('.pnl-lado').isVisible() === false, 'a 1280 px el panel derecho se retira');

  await pg.locator('.pnl-nav-item', { hasText: 'Artículos' }).first().click();
  await pg.waitForTimeout(500);
  await pg.locator('.pnl-tarjeta').first().click();
  await pg.waitForTimeout(700);
  di(await pg.locator('.pnl-serp').first().isVisible(), 'y la vista previa del artículo sigue dentro del formulario');
  await ctx.close();
}

/* ---- 7. Lo que NO se dibuja cuando no hay con qué ------------------------ */
{
  const { ctx, pg } = await abrirPanel(1440, 1000);
  await pg.locator('.pnl-nav-item', { hasText: 'Contenido' }).first().click();
  await pg.waitForTimeout(500);
  await pg.locator('.pnl-tarjeta', { hasText: 'Industrias' }).click();
  await pg.waitForTimeout(900);
  await pg.locator('.pnl-fila-elem').first().click();
  await pg.waitForTimeout(700);
  di(await pg.locator('.pnl-serp').count() === 0,
     'una industria no tiene meta título ni meta descripción, así que no se le inventa una vista previa de Google');
  await ctx.close();
}

await b.close();
srv.close();

console.log('');
if (quejas.length) {
  for (const q of [...new Set(quejas)].slice(0, 6)) console.log(`::warning::consola del navegador: ${q}`);
}
if (fallos.length) {
  for (const f of fallos) console.log(`::error::${f}`);
  console.log(`\n${fallos.length} ${fallos.length === 1 ? 'comprobación falla' : 'comprobaciones fallan'}.`);
  process.exit(1);
}
console.log(`Todo el recorrido del panel funciona. Capturas en ${SALIDA}/.`);
