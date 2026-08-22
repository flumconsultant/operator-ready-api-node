/* Prueba el editor con un panel.php de mentira: el módulo cree que habla con
   el servidor, y así se comprueba lo que solo se ve en un navegador —que las
   listas se dibujan, se reordenan y lo que se manda al guardar es lo correcto—
   sin tocar el repositorio de verdad. */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';

const esquema = JSON.parse(readFileSync('src/content/esquemas/industrias.json', 'utf8'));
const datos = JSON.parse(readFileSync('src/content/industrias.json', 'utf8'));
let guardado = null;

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
    if (p.accion === 'listar-esquemas') return responder({ ok: true, esquemas: [{ id: 'industrias', titulo: esquema.titulo, campos: esquema.campos.length }] });
    if (p.accion === 'abrir-esquema') return responder({ ok: true, esquema, datos, sha: 'x' });
    if (p.accion === 'guardar-contenido') { guardado = p; return responder({ ok: true, cambiados: 1 }); }
    return responder({ ok: true });
  }
  for (const f of [`dist${u}`, `dist/_pages${u}.html`, 'dist/index.html']) {
    if (existsSync(f) && statSync(f).isFile()) { res.writeHead(200, { 'content-type': tipo(f) }); return res.end(readFileSync(f)); }
  }
  res.writeHead(404); res.end();
}).listen(4500);

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
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

const antes = datos[1].es;
const enviado = guardado?.valores;
console.log(`5. guarda esquema=${guardado?.esquema} indice=${guardado?.indice} idioma=${guardado?.idioma}`);
const ok5 = guardado?.esquema === 'industrias' && guardado?.indice === 1 && guardado?.idioma === 'es';
const reordenado = JSON.stringify(enviado?.contexto?.[0]) === JSON.stringify(antes.contexto[1]);
console.log(`6. el reordenar llegó al servidor: ${reordenado ? 'ok' : '✗'}`);
console.log(`7. manda los ${Object.keys(enviado || {}).length} campos del esquema`);
console.log(errores.length ? `\n✗ errores en la página: ${errores.join(' | ')}` : '\nSin errores de JavaScript.');

await b.close(); srv.close();
process.exit(ok5 && reordenado && !errores.length ? 0 : 1);
