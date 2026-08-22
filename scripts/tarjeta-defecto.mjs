/**
 * La tarjeta que se ve al compartir cualquier página que NO sea un artículo.
 *
 *   node scripts/tarjeta-defecto.mjs
 *
 * Los artículos tienen la suya, con su titular, generada por
 * `tarjeta-social.mjs`. Las otras 82 páginas compartían una imagen en WebP, y
 * WhatsApp no dibuja vistas previas en WebP —LinkedIn, a ratos—: el enlace
 * salía desnudo, y un enlace desnudo se pulsa mucho menos.
 *
 * Esta es la misma plantilla que la de los artículos: misma retícula, misma
 * tipografía, mismo pie. Se regenera solo si cambia la frase o la marca, así
 * que no va en el build; el resultado se guarda en el repositorio.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const b64=(p)=>readFileSync(p).toString('base64');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Inter';font-weight:100 900;src:url(data:font/woff2;base64,${b64('src/fonts/inter-variable-latin.woff2')}) format('woff2')}
@font-face{font-family:'JetBrains Mono';font-weight:100 800;src:url(data:font/woff2;base64,${b64('src/fonts/jetbrains-mono-variable-latin.woff2')}) format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;overflow:hidden;background:#05070f;color:#fff;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.malla{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:56px 56px}
.brillo{position:absolute;width:780px;height:780px;right:-240px;top:-300px;background:radial-gradient(circle,rgba(0,255,136,.20) 0%,rgba(0,255,136,0) 62%)}
.marco{position:relative;height:100%;padding:68px 76px;display:flex;flex-direction:column}
.kicker{font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:.16em;text-transform:uppercase;color:#0f8}
h1{margin-top:auto;font-size:64px;font-weight:600;line-height:1.14;letter-spacing:-.02em;max-width:20ch;text-wrap:balance}
.pie{margin-top:auto;padding-top:34px;display:flex;align-items:baseline;justify-content:space-between;border-top:1px solid rgba(255,255,255,.14)}
.marca{font-size:26px;font-weight:700;letter-spacing:.22em}.marca em{font-style:normal;color:#0f8}
.sitio{font-family:'JetBrains Mono',monospace;font-size:18px;color:rgba(255,255,255,.5)}
</style></head><body><div class="malla"></div><div class="brillo"></div><div class="marco">
<div class="kicker">AI-native transformation company</div>
<h1>Convertimos la IA en una capacidad propia de tu empresa.</h1>
<div class="pie"><div class="marca">BEC<em>O</em>ME</div><div class="sitio">meetbecome.com</div></div>
</div></body></html>`;
const nav=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await nav.newPage({viewport:{width:1200,height:630}});
await p.setContent(html,{waitUntil:'load'});
await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:'assets/images/tarjetas/become.jpg',type:'jpeg',quality:82});
await nav.close();
console.log('tarjeta por defecto lista');
