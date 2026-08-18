import { chromium } from 'playwright';
const SP=process.env.SP;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const jobs=[['/es','plexus'],['/es/servicios','corridor'],['/es/servicios/become-now','circuit'],['/es/servicios/build-and-embed','streams'],['/es/casos-de-uso','dust']];
for(const [r,name] of jobs){
  const p=await b.newPage({viewport:{width:1440,height:900}});
  await p.goto('http://localhost:4174'+r,{waitUntil:'networkidle'});
  const band=p.locator('div').filter({has:p.locator('canvas')}).first();
  // localizar el contenedor de la banda: el div que envuelve al Field
  const el = await p.evaluateHandle(() => {
    const cs=[...document.querySelectorAll('canvas')];
    for(const c of cs){ const host=c.parentElement?.parentElement; if(host && host.offsetHeight>150 && host.offsetHeight<700) return host; }
    return null;
  });
  const box = await el.asElement()?.boundingBox();
  if(box){ await p.evaluate((y)=>window.scrollTo(0,y-200), box.y); await p.waitForTimeout(1800); await el.asElement().screenshot({path:SP+'/band-'+name+'.png'}); }
  else console.log('no band on', r);
  await p.close();
}
await b.close();
