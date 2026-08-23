/* Prueba el editor con un panel.php de mentira: el módulo cree que habla con
   el servidor, y así se comprueba lo que solo se ve en un navegador —que las
   listas se dibujan, se reordenan y lo que se manda al guardar es lo correcto—
   sin tocar el repositorio de verdad. */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';

const leer = (f) => JSON.parse(readFileSync(f, 'utf8'));
const ESQUEMAS = ['industrias', 'servicios', 'metodo', 'programas'].map((id) => leer(`src/content/esquemas/${id}.json`));
let guardado = null;

const archivoDe = (e, lang) => (e.archivosPorIdioma ? e.archivosPorIdioma[lang] : e.archivoDatos);
const clavesDe = (e, datos, lang) => {
  const base = e.raiz ? datos[e.raiz] : datos;
  if (e.forma === 'mapa') return Object.entries(base).map(([k, v]) => {
    const f = e.porIdiomaDentro ? (v[lang] || v.es || {}) : v;
    return { clave: k, nombre: f[e.etiqueta] || k };
  });
  if (e.coleccion) return base.map((v, i) => ({ clave: String(i), nombre: v[lang]?.[e.etiqueta] || `Elemento ${i + 1}` }));
  return [{ clave: '', nombre: e.titulo }];
};

const tipo = (p) => p.endsWith('.js') ? 'text/javascript' : p.endsWith('.css') ? 'text/css'
  : p.endsWith('.svg') ? 'image/svg+xml' : p.endsWith('.webp') ? 'image/webp' : p.endsWith('.woff2') ? 'font/woff2' : 'text/html';

const srv = createServer(async (req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/api/panel.php') {
    let cuerpo = '';
    for await (const c of req) cuerpo += c;
    const p = cuerpo ? JSON.parse(cuerpo) : Object.fromEntries(new URL(req.url, 'http://x').searchParams);
    const responder = (o) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (p.accion === 'yo') return responder({ ok: true, nombre: 'Carlos' });
    if (p.accion === 'listar') return responder({ ok: true, articulos: [] });
    if (p.accion === 'listar-esquemas') return responder({ ok: true, esquemas: ESQUEMAS.map((e) => ({ id: e.id, titulo: e.titulo, campos: e.campos.length })) });
    if (p.accion === 'abrir-esquema') {
      const e = ESQUEMAS.find((x) => x.id === p.esquema);
      const lang = (e.idiomas || ['es']).includes(p.idioma) ? p.idioma : e.idiomas[0];
      const datos = leer(archivoDe(e, lang));
      return responder({ ok: true, esquema: e, datos, idioma: lang, claves: clavesDe(e, datos, lang), sha: 'x' });
    }
    if (p.accion === 'guardar-contenido') { guardado = p; return responder({ ok: true, cambiados: 1 }); }
    return responder({ ok: true });
  }
  for (const f of [`dist${u}`, `dist/_pages${u}.html`, 'dist/index.html']) {
    if (existsSync(f) && statSync(f).isFile()) { res.writeHead(200, { 'content-type': tipo(f) }); return res.end(readFileSync(f)); }
  }
  res.writeHead(404); res.end();
}).listen(4500);

const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pg = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errores = [];
pg.on('pageerror', (e) => errores.push(e.message));

await pg.goto('http://localhost:4500/admin', { waitUntil: 'networkidle' });
await pg.waitForTimeout(500);
await pg.getByRole('button', { name: 'Contenido' }).click();
await pg.waitForTimeout(400);
await pg.getByText('Industrias', { exact: true }).first().click();
await pg.waitForTimeout(600);

const industria = await pg.locator('select').first().inputValue();
console.log(`1. abre industrias · elemento ${Number(industria) + 1} de 6`);

/* Que las listas estén dibujadas de verdad, no solo el contenedor. */
const anadir = await pg.getByRole('button', { name: 'Añadir' }).count();
const quitar = await pg.getByRole('button', { name: 'Quitar' }).count();
const areas = await pg.locator('textarea').count();
const entradas = await pg.locator('input[type="text"]').count();
console.log(`2. dibuja ${anadir} listas · ${quitar} filas · ${entradas} campos de línea · ${areas} de párrafo`);

/* Cambiar de industria tiene que recargar los valores, no arrastrar los de antes. */
const primerTitular = await pg.locator('input[type="text"]').nth(1).inputValue();
await pg.locator('select').first().selectOption('1');
await pg.waitForTimeout(400);
const segundoTitular = await pg.locator('input[type="text"]').nth(1).inputValue();
console.log(`3. cambiar de industria recarga: ${primerTitular !== segundoTitular ? 'ok' : '✗ arrastra los valores'}`);

/* Y cambiar de idioma también. */
await pg.getByRole('button', { name: 'EN', exact: true }).click();
await pg.waitForTimeout(400);
const enIngles = await pg.locator('input[type="text"]').nth(1).inputValue();
console.log(`4. cambiar de idioma recarga: ${enIngles !== segundoTitular ? 'ok' : '✗'}`);

/* Reordenar: la primera oportunidad es la que más gente lee. */
await pg.getByRole('button', { name: 'ES', exact: true }).click();
await pg.waitForTimeout(400);
await pg.getByRole('button', { name: '↓' }).first().click();
await pg.waitForTimeout(200);
await pg.getByRole('button', { name: 'Guardar', exact: true }).click();
await pg.waitForTimeout(600);

const antes = leer('src/content/industrias.json')[1].es;
const enviado = guardado?.valores;
console.log(`5. guarda esquema=${guardado?.esquema} clave=${guardado?.clave} idioma=${guardado?.idioma}`);
const ok5 = guardado?.esquema === 'industrias' && guardado?.clave === '1' && guardado?.idioma === 'es';
const reordenado = JSON.stringify(enviado?.contexto?.[0]) === JSON.stringify(antes.contexto[1]);
console.log(`6. el reordenar llegó al servidor: ${reordenado ? 'ok' : '✗'}`);
console.log(`7. manda los ${Object.keys(enviado || {}).length} campos del esquema`);
/* Y las otras dos formas: un mapa por slug y un bloque único por idioma. */
for (const [id, rotulo] of [['servicios', 'Casos de uso'], ['metodo', 'Cómo transformamos'], ['programas', 'Programas NOW']]) {
  await pg.getByRole('button', { name: 'Volver' }).click();
  await pg.waitForTimeout(300);
  await pg.getByText(rotulo, { exact: true }).first().click();
  await pg.waitForTimeout(600);
  const sel = await pg.locator('select').count();
  const campos = await pg.locator('input[type="text"], textarea').count();
  const err = errores.length;
  await pg.getByRole('button', { name: 'EN', exact: true }).click();
  await pg.waitForTimeout(500);
  const tras = await pg.locator('input[type="text"], textarea').count();
  console.log(`8. ${rotulo}: ${sel ? 'con selector' : 'sin selector'} · ${campos} campos · cambia a EN y sigue con ${tras} · ${errores.length === err ? 'sin errores' : '✗ errores'}`);
}
console.log(errores.length ? `\n✗ errores en la página: ${errores.join(' | ')}` : '\nSin errores de JavaScript.');

await b.close(); srv.close();
process.exit(ok5 && reordenado && !errores.length ? 0 : 1);
