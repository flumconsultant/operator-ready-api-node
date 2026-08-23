/* Contraste, tamaño de toque, foco y comportamiento, medidos en el navegador.
 *
 * Existe porque compilar dice que el código es válido, no que el panel
 * funcione: ya pasó una vez que el panel compilaba y salía en blanco.
 *
 * Las secciones plegables obligan a una precaución: si se mide la pantalla tal
 * como llega, se miden 113 elementos en vez de 637 y el resultado parece
 * bueno porque la mitad del formulario está escondida. Por eso se abren todas
 * las secciones ANTES de medir. */
import { createServer } from 'node:http';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';
const leer=(f)=>JSON.parse(readFileSync(f,'utf8'));
const ESQ=['industrias'].map(i=>leer(`src/content/esquemas/${i}.json`));
/* Una página real del sitio, para abrir también el módulo de Páginas: ahí el
   formulario es el mismo componente y un fallo suyo no se ve compilando. */
const PAG=readdirSync('src/content/paginas').filter(f=>f.endsWith('.json')).slice(0,3)
  .map(f=>({...leer(`src/content/paginas/${f}`),_archivo:f}));
const CON=readdirSync('src/content/conocimiento').filter(f=>f.endsWith('.json'))
  .map(f=>({...leer(`src/content/conocimiento/${f}`),_archivo:f}));
const tipo=(p)=>p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.woff2')?'font/woff2':'text/html';
createServer(async(q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);
 if(u==='/api/panel.php'){let b='';for await(const c of q)b+=c;const p=b?JSON.parse(b):{accion:new URL(q.url,'http://x').searchParams.get('accion')};
  const res=(o)=>{r.writeHead(200,{'content-type':'application/json'});r.end(JSON.stringify(o));};
  if(p.accion==='yo')return res({ok:true,nombre:'carlos@meetbecome.com'});
  if(p.accion==='listar')return res({ok:true,articulos:[]});
  if(p.accion==='listar-paginas'){const c=(p.carpeta||'paginas');
   return res({ok:true,paginas:c==='conocimiento'?CON:PAG});}
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

/* ---- Comportamiento, antes de abrirlo todo -------------------------------- */
const fallos = [];
const di = (ok, texto) => { console.log(`${ok?'ok ':'✗  '} ${texto}`); if(!ok) fallos.push(texto); };

const chips = await pg.locator('.pnl-chip').count();
di(chips === 10, `el índice dibuja ${chips} secciones (se esperan 10)`);

const abiertasAlLlegar = await pg.locator('.pnl-seccion-cab[aria-expanded="true"]').count();
di(abiertasAlLlegar === 1, `al abrir una industria hay ${abiertasAlLlegar} sección desplegada (se espera 1)`);

/* La barra de publicar existe, está apagada y dice por qué. */
const publicar = pg.locator('.pnl-publicar .pnl-btn');
di(await publicar.isDisabled(), 'al llegar, publicar está apagado');
di((await publicar.textContent()).includes('No hay cambios'), `y dice «${(await publicar.textContent()).trim()}»`);
const caja = await publicar.boundingBox();
const alto = pg.viewportSize().height;
di(caja.y + caja.height <= alto + 1 && caja.y > alto * 0.6, `y vive abajo, bajo el pulgar (y=${Math.round(caja.y)} de ${alto})`);

/* Escribir enciende publicar. */
await pg.locator('.pnl-seccion').first().locator('.pnl-entrada').first().fill('Manufactura industrial');
await pg.waitForTimeout(150);
di(!(await publicar.isDisabled()), 'al cambiar un campo, publicar se enciende');

/* Un chip lleva a su sección y la despliega. */
await pg.locator('.pnl-chip', { hasText: 'Métricas' }).click();
await pg.waitForTimeout(500);
di(await pg.locator('.pnl-seccion-cab:has-text("Métricas")').first().getAttribute('aria-expanded') === 'true',
   'tocar «Métricas» en el índice despliega esa sección');

/* Quitar una fila pregunta, y al preguntar enseña lo que se va a perder. */
const antes = await pg.locator('.pnl-seccion:has(.pnl-seccion-cab:has-text("Métricas")) .pnl-fila').count();
await pg.locator('.pnl-seccion:has(.pnl-seccion-cab:has-text("Métricas")) .pnl-btn--peligro').first().click();
await pg.waitForTimeout(250);
const hoja = pg.locator('.pnl-hoja');
di(await hoja.isVisible(), 'quitar una fila no borra: abre una confirmación');
const citado = (await pg.locator('.pnl-hoja-cita').textContent() || '').trim();
di(citado.length > 0 && citado !== '(la fila está vacía)', `y cita el texto de la fila: «${citado.slice(0,44)}…»`);
await pg.locator('.pnl-hoja .pnl-btn', { hasText: 'Cancelar' }).click();
await pg.waitForTimeout(200);
const despues = await pg.locator('.pnl-seccion:has(.pnl-seccion-cab:has-text("Métricas")) .pnl-fila').count();
di(despues === antes, `cancelar no quita nada (${antes} filas antes, ${despues} después)`);

/* El módulo de Páginas usa el mismo formulario. Se abre porque un componente
   compartido que se rompe en el segundo sitio compila igual de bien. */
await pg.getByRole('button',{name:'Páginas'}).click(); await pg.waitForTimeout(400);
await pg.locator('.pnl-tarjeta').first().click(); await pg.waitForTimeout(500);
const camposPagina = await pg.locator('.pnl-campo').count();
di(camposPagina > 0, `el módulo de Páginas dibuja ${camposPagina} campos (no una pantalla en blanco)`);
di(await pg.locator('.pnl-publicar .pnl-btn').isVisible(), 'y también tiene su barra de publicar abajo');
di(await pg.locator('.pnl-indice').count() === 0, 'sin índice, porque una página no declara secciones todavía');
await pg.getByRole('button',{name:'Volver'}).click(); await pg.waitForTimeout(300);

/* La deuda de conocimiento, que era el fallo de «está escondida». */
await pg.getByRole('button',{name:'Conocimiento'}).click(); await pg.waitForTimeout(500);
const deuda = (await pg.locator('.pnl-deuda').textContent() || '').trim();
di(/^\d+/.test(deuda) && !deuda.startsWith('0'), `los campos sin escribir se cuentan en la primera línea: «${deuda}»`);
const marcados = await pg.locator('.pnl-pendiente').count();
di(marcados > 0, `y ${marcados} documentos llevan su propia marca en la tarjeta`);

await pg.getByRole('button',{name:'Contenido'}).click(); await pg.waitForTimeout(300);
await pg.getByText('Industrias',{exact:true}).first().click(); await pg.waitForTimeout(700);

/* ---- Y ahora sí: abrir todo para medir sobre el formulario entero --------- */
/* De una en una y volviendo a preguntar: la lista se recalcula cada vez que
   una sección se abre, y recorrer la lista de antes deja de encontrarlas. */
for (let n = 0; n < 40; n++) {
  const cerrada = pg.locator('.pnl-seccion-cab[aria-expanded="false"]').first();
  if (!(await cerrada.count())) break;
  await cerrada.click();
}
await pg.waitForTimeout(400);
console.log('');

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
await b.close(); process.exit(r.malos.length||r.pequenos.length||fallos.length?1:0);
