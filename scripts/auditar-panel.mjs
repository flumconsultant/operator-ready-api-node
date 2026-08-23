/* Contraste y foco medidos en el navegador, no calculados a ojo. */
import { createServer } from 'node:http';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';
const leer=(f)=>JSON.parse(readFileSync(f,'utf8'));
const ESQ=['industrias'].map(i=>leer(`src/content/esquemas/${i}.json`));
const tipo=(p)=>p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.woff2')?'font/woff2':'text/html';
createServer(async(q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);
 if(u==='/api/panel.php'){let b='';for await(const c of q)b+=c;const p=b?JSON.parse(b):{accion:new URL(q.url,'http://x').searchParams.get('accion')};
  const res=(o)=>{r.writeHead(200,{'content-type':'application/json'});r.end(JSON.stringify(o));};
  if(p.accion==='yo')return res({ok:true,nombre:'carlos@meetbecome.com'});
  if(p.accion==='listar')return res({ok:true,articulos:[]});
  if(p.accion==='listar-esquemas')return res({ok:true,esquemas:ESQ.map(e=>({id:e.id,titulo:e.titulo,campos:e.campos.length}))});
  if(p.accion==='abrir-esquema'){const e=ESQ[0];const d=leer(e.archivoDatos);
   return res({ok:true,esquema:e,datos:d,idioma:'es',claves:d.map((v,i)=>({clave:String(i),nombre:v.es.nombre})),sha:'x'});}
  return res({ok:true});}
 for(const f of [`dist${u}`,`dist/_pages${u}.html`,'dist/index.html']) if(existsSync(f)&&statSync(f).isFile()){r.writeHead(200,{'content-type':tipo(f)});return r.end(readFileSync(f));}
 r.writeHead(404);r.end();}).listen(5100);
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await pg.goto('http://localhost:5100/admin',{waitUntil:'networkidle'});
await pg.waitForTimeout(600);
await pg.getByRole('button',{name:'Contenido'}).click(); await pg.waitForTimeout(300);
await pg.getByText('Industrias',{exact:true}).first().click(); await pg.waitForTimeout(700);

const r = await pg.evaluate(() => {
  const lum = (c) => { const [r,g,b]=c.match(/\d+/g).map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;}); return .2126*r+.7152*g+.0722*b; };
  const fondoDe = (el) => { let n=el; while(n){const bg=getComputedStyle(n).backgroundColor; if(bg&&!bg.includes('rgba(0, 0, 0, 0)'))return bg; n=n.parentElement;} return 'rgb(10,14,39)'; };
  const ratio = (a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+.05)/(y+.05);};
  const malos = [], pequenos = [];
  for (const el of document.querySelectorAll('.pnl *')) {
    const t = el.textContent?.trim();
    if (!t || el.children.length) continue;
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    const grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
    const r = ratio(cs.color, fondoDe(el));
    const min = grande ? 3 : 4.5;
    if (r < min) malos.push(`${t.slice(0,26)} · ${r.toFixed(2)}:1 (mín ${min})`);
  }
  for (const el of document.querySelectorAll('.pnl button, .pnl a, .pnl input, .pnl select, .pnl textarea')) {
    const c = el.getBoundingClientRect();
    if (c.width && c.height && (c.height < 44 || c.width < 24)) pequenos.push(`${(el.textContent||el.tagName).trim().slice(0,20)} ${Math.round(c.width)}×${Math.round(c.height)}`);
  }
  return { malos, pequenos, total: document.querySelectorAll('.pnl *').length };
});
console.log(`elementos revisados: ${r.total}`);
console.log(r.malos.length ? `✗ contraste bajo (${r.malos.length}):\n   ${r.malos.slice(0,8).join('\n   ')}` : 'ok  todo el texto pasa el contraste mínimo');
console.log(r.pequenos.length ? `✗ tocables pequeños (${r.pequenos.length}): ${r.pequenos.slice(0,6).join(' · ')}` : 'ok  todos los controles llegan a 44px de alto');
/* Y que el foco se vea al tabular. */
await pg.keyboard.press('Tab'); await pg.keyboard.press('Tab');
const foco = await pg.evaluate(() => { const e=document.activeElement; const cs=getComputedStyle(e); return { que:(e.textContent||e.tagName).trim().slice(0,24), outline: cs.outlineWidth+' '+cs.outlineColor }; });
console.log(`foco visible en «${foco.que}» → ${foco.outline}`);
await b.close(); process.exit(r.malos.length||r.pequenos.length?1:0);
