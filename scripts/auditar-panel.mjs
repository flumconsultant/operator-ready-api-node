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
let SIN_SESION=false;
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
  if(p.accion==='yo'){ if(SIN_SESION) return res({ok:false,error:'sin_sesion',mensaje:'No hay sesión.'});
   return res({ok:true,nombre:'carlos@meetbecome.com'}); }
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

/* En el móvil los módulos viven en un cajón. Abrirlo es parte del recorrido:
   una prueba que fuera directa al módulo no comprobaría la navegación, que es
   justo lo que cambió. */
const irA = async (modulo) => {
  if (await pg.locator('.pnl-lateral').isVisible()) {
    await pg.locator('.pnl-lateral .pnl-nav-item', { hasText: modulo }).first().click();
  } else {
    await pg.getByRole('button', { name: 'Abrir el menú' }).click();
    await pg.waitForTimeout(250);
    await pg.locator('.pnl-cajon .pnl-nav-item', { hasText: modulo }).first().click();
  }
  await pg.waitForTimeout(400);
};
await irA('Contenido');
await pg.getByText('Industrias',{exact:true}).first().click(); await pg.waitForTimeout(700);

/* ---- Comportamiento, antes de abrirlo todo -------------------------------- */
const fallos = [];
const di = (ok, texto) => { console.log(`${ok?'ok ':'✗  '} ${texto}`); if(!ok) fallos.push(texto); };

/* El marco: en 390 px la columna fija no está y el cajón sí. */
di(!(await pg.locator('.pnl-lateral').isVisible()), 'en móvil no hay columna lateral robando ancho');
di(await pg.getByRole('button', { name: /el menú/ }).isVisible(), 'y sí hay un botón de menú');
/* Icono Y palabra en los seis. Un panel que solo enseña dibujos obliga a
   aprenderse los dibujos, y el rótulo es lo que lee un lector de pantalla. */
await pg.getByRole('button', { name: 'Abrir el menú' }).click();
await pg.waitForTimeout(300);
const nav = await pg.locator('.pnl-cajon .pnl-nav-item').evaluateAll((ns) => ns.map((n) => ({
  texto: (n.textContent || '').trim(),
  icono: n.querySelectorAll('svg').length,
  oculto: n.querySelector('svg')?.getAttribute('aria-hidden') === 'true',
})));
const seis = nav.slice(0, 6);
di(seis.length === 6 && seis.every((m) => m.texto && m.icono === 1),
   `los seis módulos llevan icono y palabra: ${seis.map((m) => m.texto).join(', ')}`);
di(seis.every((m) => m.oculto), 'y el icono va oculto al lector, que ya oye la palabra');
di((await pg.locator('.pnl-cajon-caja').evaluateAll((n) => n.length)) === 1, 'el cajón se abre');
await pg.keyboard.press('Escape');
await pg.waitForTimeout(300);
di((await pg.locator('.pnl-cajon-caja').count()) === 0, 'y Escape lo cierra');
di(await pg.evaluate(() => document.activeElement?.getAttribute('aria-label')?.includes('menú')),
   'devolviendo el foco al botón que lo abrió');

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
await irA('Páginas');
await pg.locator('.pnl-tarjeta').first().click(); await pg.waitForTimeout(500);
const camposPagina = await pg.locator('.pnl-campo').count();
di(camposPagina > 0, `el módulo de Páginas dibuja ${camposPagina} campos (no una pantalla en blanco)`);
di(await pg.locator('.pnl-publicar .pnl-btn').isVisible(), 'y también tiene su barra de publicar abajo');
di(await pg.locator('.pnl-indice').count() === 0, 'sin índice, porque una página no declara secciones todavía');
await pg.getByRole('button',{name:'Volver'}).click(); await pg.waitForTimeout(300);

/* La deuda de conocimiento, que era el fallo de «está escondida». */
await irA('Conocimiento');
const deuda = (await pg.locator('.pnl-deuda').textContent() || '').trim();
di(/^\d+/.test(deuda) && !deuda.startsWith('0'), `los campos sin escribir se cuentan en la primera línea: «${deuda}»`);
const marcados = await pg.locator('.pnl-pendiente').count();
di(marcados > 0, `y ${marcados} documentos llevan su propia marca en la tarjeta`);

await irA('Contenido');
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
/* ---- Y el mismo panel en un ordenador ------------------------------------ */
console.log('');
const ancho = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await ancho.goto('http://localhost:5100/admin', { waitUntil: 'networkidle' });
await ancho.waitForTimeout(800);
di(await ancho.locator('.pnl-lateral').isVisible(), 'en 1440 px la columna de módulos está fija a la izquierda');
di(!(await ancho.locator('.pnl-superior').isVisible()), 'y desaparece el botón de menú, que ya no abre nada nuevo');
const lateral = await ancho.locator('.pnl-lateral').boundingBox();
di(lateral.x === 0 && Math.round(lateral.width) === 240, `mide ${Math.round(lateral.width)} px y empieza en el borde`);
di((await ancho.locator('.pnl-lateral .pnl-nav-item').count()) >= 6, 'con los seis módulos y las acciones del pie');
/* El salto al contenido, para quien va con teclado. */
await ancho.keyboard.press('Tab');
const salto = await ancho.evaluate(() => {
  const e = document.activeElement;
  return { texto: (e.textContent || '').trim(), visible: e.getBoundingClientRect().left >= 0 };
});
di(salto.texto === 'Saltar al contenido' && salto.visible, `el primer tabulador ofrece «${salto.texto}» y se ve`);

/* La pantalla de entrada, que vive fuera del marco y por eso no la toca nada
   de lo anterior. Se llega negando la sesión en el servidor de mentira. */
SIN_SESION = true;
const puerta = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await puerta.goto('http://localhost:5100/admin', { waitUntil: 'networkidle' });
await puerta.waitForTimeout(700);
di(await puerta.locator('.pnl-puerta').isVisible(), 'sin sesión aparece la pantalla de entrada, no una en blanco');
di(await puerta.locator('form input[type="password"]').isVisible(), 'con su campo de contraseña dentro de un formulario');
const cuerpoCampo = await puerta.locator('.pnl-puerta input').first().evaluate((n) => parseFloat(getComputedStyle(n).fontSize));
di(cuerpoCampo >= 16, `y los campos escriben a ${cuerpoCampo} px, que es lo que evita que iOS amplíe al enfocar`);

await b.close(); process.exit(r.malos.length||r.pequenos.length||fallos.length?1:0);
