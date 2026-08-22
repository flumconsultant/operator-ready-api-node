import { createServer } from 'node:http';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';
const leer=(f)=>JSON.parse(readFileSync(f,'utf8'));
const docs=readdirSync('src/content/conocimiento').filter(f=>f.endsWith('.json')).map(f=>({...leer('src/content/conocimiento/'+f),_archivo:f,_sha:'x'}));
let guardado=null;
const tipo=(p)=>p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.webp')?'image/webp':p.endsWith('.woff2')?'font/woff2':'text/html';
const srv=createServer(async(q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);
 if(u==='/api/panel.php'){let b='';for await(const c of q)b+=c;const p=b?JSON.parse(b):Object.fromEntries(new URL(q.url,'http://x').searchParams);
  const res=(o)=>{r.writeHead(200,{'content-type':'application/json'});r.end(JSON.stringify(o));};
  if(p.accion==='yo')return res({ok:true,nombre:'Carlos'});
  if(p.accion==='listar')return res({ok:true,articulos:[]});
  if(p.accion==='listar-paginas')return res({ok:true,paginas:p.carpeta==='conocimiento'?docs:[]});
  if(p.accion==='guardar-pagina'){guardado=p;return res({ok:true,cambiados:1});}
  return res({ok:true});}
 for(const f of [`dist${u}`,`dist/_pages${u}.html`,'dist/index.html']) if(existsSync(f)&&statSync(f).isFile()){r.writeHead(200,{'content-type':tipo(f)});return r.end(readFileSync(f));}
 r.writeHead(404);r.end();}).listen(4800);

const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const err=[]; pg.on('pageerror',e=>err.push(e.message));
await pg.goto('http://localhost:4800/admin',{waitUntil:'networkidle'});
await pg.waitForTimeout(500);
await pg.getByRole('button',{name:'Conocimiento'}).click();
await pg.waitForTimeout(500);
const tarjetas=await pg.locator('button:has-text("¿")').count();
console.log(`1. lista ${tarjetas} documentos, cada uno con su pregunta`);
await pg.getByText('Identidad y fronteras',{exact:true}).first().click();
await pg.waitForTimeout(500);
const areas=await pg.locator('textarea').count();
const anadir=await pg.getByRole('button',{name:'Añadir'}).count();
console.log(`2. abre identidad · ${areas} párrafos · ${anadir} listas con botón de añadir`);
/* Escribir en una lista vacía: es exactamente lo que Carlos hará primero. */
/* «Qué NO hace BECOME» es la primera lista del documento, así que su botón
   Añadir es el primero. Lo que falló en el primer intento fue el relleno: se
   escribía en «el último campo de la página», que es otro control. La fila
   nueva nace vacía, así que se busca por eso. */
await pg.getByRole('button', { name: 'Añadir' }).first().click();
await pg.waitForTimeout(250);
const vacios = pg.locator('input[type="text"], textarea').filter({ hasNotText: /./ });
const total = await pg.locator('input[type="text"], textarea').count();
let rellenado = false;
for (let k = 0; k < total; k++) {
  const el = pg.locator('input[type="text"], textarea').nth(k);
  if ((await el.inputValue()) === '') { await el.fill('No desarrollamos capacidades de diagnóstico clínico.'); rellenado = true; break; }
}
console.log(`   (fila nueva rellenada: ${rellenado ? 'sí' : 'no'})`);
await pg.waitForTimeout(150);
await pg.getByRole('button',{name:'Guardar y publicar'}).click();
await pg.waitForTimeout(600);
const enviado=guardado?.valores?.noHacemos;
console.log(`3. guarda carpeta=${guardado?.carpeta} archivo=${guardado?.archivo}`);
console.log(`4. la línea nueva llegó: ${Array.isArray(enviado)&&enviado.length===1?'ok — «'+enviado[0].slice(0,45)+'…»':'✗ '+JSON.stringify(enviado)}`);
console.log(err.length?'✗ errores: '+err.join(' | '):'sin errores de JavaScript');
await b.close(); srv.close();
process.exit(err.length||guardado?.carpeta!=='conocimiento'||!Array.isArray(enviado)?1:0);
