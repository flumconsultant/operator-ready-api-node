import { chromium } from 'playwright';
const routes = ['/es','/es/servicios','/es/servicios/become-now','/es/servicios/transformation-discovery','/es/servicios/build-and-embed','/es/framework','/es/nosotros','/es/insights','/es/contacto','/es/casos-de-uso','/es/casos-de-uso/pilotos-que-no-escalan','/es/servicios/become-now/finanzas','/es/legal/privacidad'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
const errs=[];
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  p.on('console', m => { if (m.type()==='error') errs.push(`${w} ${m.text()}`); });
  p.on('pageerror', e => errs.push(`${w} ${e.message}`));
  for (const r of routes) {
    const res = await p.goto('http://localhost:4174'+r, { waitUntil: 'networkidle' });
    if (res.status() !== 200) errs.push(`${r} -> ${res.status()}`);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(400);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (ov) errs.push(`${r} @${w}: overflow horizontal`);
  }
  await p.close();
}
console.log(errs.length ? errs.join('\n') : 'todo limpio');
await b.close();
