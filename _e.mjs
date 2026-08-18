import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1440,height:900}});
p.on('pageerror',e=>console.log('PAGEERROR:',e.message));
p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE:',m.text())});
await p.goto('http://localhost:4174/es/contacto',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log('BUTTONS:', await p.locator('button').allInnerTexts());
await b.close();
