/* ¿Sigue habiendo destello? Se pregunta en un navegador, no en el código. */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';

const tipo = (p) => p.endsWith('.js') ? 'text/javascript' : p.endsWith('.css') ? 'text/css'
  : p.endsWith('.svg') ? 'image/svg+xml' : p.endsWith('.webp') ? 'image/webp'
  : p.endsWith('.png') ? 'image/png' : p.endsWith('.woff2') ? 'font/woff2' : 'text/html';
const srv = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  for (const f of [`dist${u}`, `dist/_pages${u}.html`, 'dist/index.html']) {
    if (existsSync(f) && statSync(f).isFile()) {
      res.writeHead(200, { 'content-type': tipo(f) }); return res.end(readFileSync(f));
    }
  }
  res.writeHead(404); res.end();
}).listen(4322);

const RUTAS = ['/es', '/en', '/es/servicios/become-discover', '/es/insights/por-que-tu-equipo-no-usa-la-ia-que-le-diste'];
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
let fallos = 0;

console.log('CON JavaScript — el resumen debe estar oculto en todo momento');
for (const r of RUTAS) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const pg = await ctx.newPage();
  /* La aplicación se retrasa medio segundo a propósito: si el resumen se viera,
     es exactamente en esa ventana donde se vería. */
  await pg.route('**/*.js', async (ruta) => { await new Promise((k) => setTimeout(k, 500)); await ruta.continue(); });
  await pg.goto(`http://localhost:4322${r}`, { waitUntil: 'commit' });
  await pg.waitForTimeout(150);
  const visto = await pg.evaluate(() => {
    const d = document.querySelector('#root > [data-resumen-sin-js]');
    if (!d) return 'no está el resumen en el HTML';
    return getComputedStyle(d).display === 'none' ? null : `VISIBLE (display: ${getComputedStyle(d).display})`;
  });
  console.log(`  ${visto ? '✗' : 'ok'}  ${r}${visto ? ' → ' + visto : ''}`);
  if (visto) fallos++;
  await ctx.close();
}

console.log('\nSIN JavaScript — el resumen debe leerse entero');
for (const r of RUTAS) {
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:4322${r}`, { waitUntil: 'domcontentloaded' });
  const t = await pg.evaluate(() => document.querySelector('#root')?.innerText?.length || 0)
    .catch(async () => (await pg.textContent('#root'))?.trim().length || 0);
  const oculto = await pg.locator('#root > [data-resumen-sin-js]').isHidden().catch(() => true);
  console.log(`  ${oculto ? '✗' : 'ok'}  ${r} → ${t} caracteres de texto${oculto ? ' pero OCULTO' : ''}`);
  if (oculto) fallos++;
  await ctx.close();
}

await b.close(); srv.close();
console.log(fallos ? `\n${fallos} fallos` : '\nSin destello con JavaScript, y legible entero sin él.');
process.exit(fallos ? 1 : 0);
