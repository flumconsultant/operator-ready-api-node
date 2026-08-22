import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';
const tipo=(p)=>p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.webp')?'image/webp':p.endsWith('.woff2')?'font/woff2':'text/html';
const srv=createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);
 for(const f of [`dist${u}`,`dist/_pages${u}.html`,'dist/index.html']) if(existsSync(f)&&statSync(f).isFile()){r.writeHead(200,{'content-type':tipo(f)});return r.end(readFileSync(f));}
 r.writeHead(404);r.end();}).listen(4700);
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
let fallos=0;
for (const id of process.argv.slice(2)) {
  const pag=JSON.parse(readFileSync(`src/content/paginas/${id}.json`,'utf8'));
  const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto('http://localhost:4700'+pag.ruta,{waitUntil:'networkidle'});
  await pg.waitForTimeout(700);
  const t=(await pg.evaluate(()=>document.body.innerText)).toLowerCase().replace(/\s+/g,' ');
  let mal=0;
  for(const c of pag.campos){
    const v=String(c.valor).toLowerCase().replace(/\s+/g,' ');
    if(!t.includes(v.slice(0,Math.min(70,v.length)))){mal++;console.log(`  ✗ ${id}/${c.id}: «${String(c.valor).slice(0,55)}»`);}
  }
  const h1=await pg.locator('h1').first().innerText().catch(()=>'(sin h1)');
  console.log(`${mal?'✗ ':'ok '}${pag.titulo.padEnd(18)} ${pag.campos.length-mal}/${pag.campos.length} campos · h1: «${h1.slice(0,48)}» · ${err.length?'✗ '+err.length+' errores':'sin errores'}`);
  fallos+=mal+err.length;
  await pg.context().close();
}
await b.close(); srv.close();
process.exit(fallos?1:0);
