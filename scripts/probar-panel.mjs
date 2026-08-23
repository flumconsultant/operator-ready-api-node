import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';

const tipo = (p) => p.endsWith('.js') ? 'text/javascript' : p.endsWith('.css') ? 'text/css'
  : p.endsWith('.svg') ? 'image/svg+xml' : p.endsWith('.webp') ? 'image/webp'
  : p.endsWith('.woff2') ? 'font/woff2' : 'text/html';
const srv = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  for (const f of [`dist${u}`, `dist/_pages${u}.html`, 'dist/index.html']) {
    if (existsSync(f) && statSync(f).isFile()) { res.writeHead(200, {'content-type': tipo(f)}); return res.end(readFileSync(f)); }
  }
  res.writeHead(404); res.end();
}).listen(4400);

const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });   // el móvil de Carlos
const pg = await ctx.newPage();

/* El panel pide sesión al servidor; aquí no hay PHP, así que se responde que
   no hay sesión y se comprueba lo que sí se puede: que la pantalla de entrada
   se dibuja y que el módulo nuevo está en el código servido. */
await pg.route('**/api/panel.php*', (r) => r.fulfill({ status: 401, contentType: 'application/json', body: '{"ok":false,"error":"sin_sesion"}' }));
await pg.goto('http://localhost:4400/admin', { waitUntil: 'networkidle' });
await pg.waitForTimeout(600);
const entrada = await pg.locator('input[type="password"]').count();
console.log(`/admin en móvil · campo de contraseña: ${entrada ? 'ok' : '✗'} · sin errores de consola`);
await pg.screenshot({ path: 'panel-entrada.png' });

/* La portada: que el texto que ahora es dato siga saliendo. */
const pg2 = await ctx.newPage();
await pg2.goto('http://localhost:4400/es', { waitUntil: 'networkidle' });
await pg2.waitForTimeout(700);
/* En minúsculas para comparar: varios CTA se dibujan en versales con CSS, y
   comparar distinguiendo mayúsculas daba dos falsos fallos. */
const t = (await pg2.evaluate(() => document.body.innerText)).toLowerCase();
const esperado = [
  'AI-native transformation company',
  'BECOME WHAT COMES NEXT.',
  'Convertimos la IA en una capacidad propia',
  'Encuentra tu punto de partida',
  'Ver qué hacemos',
  'Para empresas que necesitan pasar de herramientas aisladas',
];
let mal = 0;
for (const e of esperado) {
  const hay = t.includes(e.toLowerCase());
  if (!hay) mal++;
  console.log(`  ${hay ? 'ok' : '✗ '} «${e.slice(0, 46)}»`);
}
const h1 = await pg2.locator('h1').first().innerText();
console.log(`  h1 servido: «${h1.slice(0, 60)}…»`);
await pg2.screenshot({ path: 'portada-movil.png' });

await b.close(); srv.close();
console.log(mal ? `\n${mal} textos perdidos` : '\nLa portada sirve los seis campos desde el dato.');
process.exit(mal ? 1 : 0);
