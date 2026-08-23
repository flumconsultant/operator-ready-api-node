/**
 * Comprueba contra el sitio publicado que las direcciones viejas redirigen.
 *
 * ---- Por qué esto no se puede dar por hecho leyendo el .htaccess ----
 *
 * Que la regla esté escrita no significa que actúe. Hay tres formas de que un
 * 301 declarado no ocurra, y ninguna se ve en el archivo:
 *
 *   · El módulo que la ejecuta no está activo en el servidor.
 *   · Otra regla la adelanta. `RedirectMatch` y `RewriteRule` los ejecutan dos
 *     módulos distintos, y si la reescritura de la SPA actúa primero, la
 *     dirección vieja responde 200 con la página nueva dentro. Para un buscador
 *     eso no es una mudanza: son dos páginas con el mismo contenido, que es
 *     justo lo que la mudanza venía a evitar.
 *   · El archivo no llegó a subirse.
 *
 * La única prueba es pedir la dirección y mirar el código que devuelve.
 *
 * ---- Qué exige ----
 *
 *   · La vieja responde 301 —no 302, que le dice a Google que no traslade
 *     nada— y apunta exactamente a la nueva.
 *   · La nueva responde 200.
 *   · Un solo salto. Una cadena 301→301 diluye lo que se traslada y hay
 *     rastreadores que abandonan en el segundo.
 *
 * No corre en este entorno de trabajo, que no tiene salida a internet: corre
 * en el despliegue, después de subir, que es cuando la respuesta es real.
 *
 * Uso:  node scripts/verificar-redirects.mjs [https://otro-dominio]
 */

const SITIO = process.argv[2] || 'https://meetbecome.com';

/* Las cinco de la mudanza de industrias, más las tres del lado inglés.
   Cada una: [dirección vieja, dirección nueva]. */
const MUDANZAS = [
  ['/es/industrias/servicios-financieros', '/es/industrias/banca-seguros-fintech'],
  ['/es/industrias/retail-consumo', '/es/industrias/retail-consumo-masivo'],
  ['/es/industrias/travel-hospitality', '/es/industrias/turismo-hoteleria'],
  ['/es/industrias/real-estate-construction', '/es/industrias/inmobiliario-construccion'],
  ['/es/industrias/healthcare-life-sciences', '/es/industrias/salud-farmaceutica'],
  ['/en/industries/financial-services', '/en/industries/banking-insurance-fintech'],
  ['/en/industries/retail-consumer', '/en/industries/retail-consumer-goods'],
  ['/en/industries/healthcare-life-sciences', '/en/industries/healthcare-pharma'],
];

/* Las seis nuevas tienen que responder 200. Si una diera 404, el 301 estaría
   mandando a los buscadores a una página que no existe, que es peor que no
   haber redirigido. */
const NUEVAS = [
  '/es/industrias/banca-seguros-fintech',
  '/es/industrias/mineria-energia',
  '/es/industrias/retail-consumo-masivo',
  '/es/industrias/turismo-hoteleria',
  '/es/industrias/inmobiliario-construccion',
  '/es/industrias/salud-farmaceutica',
];

/* Con cabeceras de navegador. El cortafuegos del hosting responde 403 a las
   peticiones que no parecen venir de uno, y una comprobación que recibe 403
   no está midiendo la redirección: está midiendo el cortafuegos. */
const COMO_NAVEGADOR = {
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'es-PE,es;q=0.9',
};

const pedir = async (url) => {
  const r = await fetch(url, { redirect: 'manual', headers: COMO_NAVEGADOR });
  return { codigo: r.status, destino: r.headers.get('location') || '' };
};

const fallos = [];
const di = (ok, texto) => { console.log(`${ok ? 'ok ' : '✗  '} ${texto}`); if (!ok) fallos.push(texto); };
const tabla = [];

console.log(`Contra ${SITIO}\n`);

for (const [vieja, nueva] of MUDANZAS) {
  try {
    const r = await pedir(`${SITIO}${vieja}`);
    tabla.push({ vieja, codigo: r.codigo, location: r.destino || '—', nueva, codigoNueva: '' });
    if (r.codigo !== 301) {
      /* El caso que más importa distinguir: 200 significa que la página nueva
         se está sirviendo TAMBIÉN en la dirección vieja. Contenido duplicado
         en dos direcciones, que es exactamente lo que el 301 evita. */
      di(false, `${vieja} responde ${r.codigo}${r.codigo === 200 ? ' — la página vieja sigue viva y duplica a la nueva' : ''}`);
      continue;
    }
    const destino = r.destino.replace(SITIO, '');
    if (destino !== nueva) { di(false, `${vieja} → 301 pero hacia «${destino}», no hacia «${nueva}»`); continue; }
    /* Y que el destino no vuelva a redirigir. */
    const seguido = await pedir(`${SITIO}${nueva}`);
    tabla[tabla.length - 1].codigoNueva = seguido.codigo;
    if (seguido.codigo !== 200) { di(false, `${vieja} → 301 → ${nueva} responde ${seguido.codigo}, no 200 (salto doble)`); continue; }
    di(true, `${vieja} → 301 → ${nueva} → 200`);
  } catch (e) {
    di(false, `${vieja} no se pudo consultar: ${e.message}`);
  }
}

console.log('');
for (const ruta of NUEVAS) {
  try {
    const r = await pedir(`${SITIO}${ruta}`);
    di(r.codigo === 200, `${ruta} responde ${r.codigo}`);
  } catch (e) {
    di(false, `${ruta} no se pudo consultar: ${e.message}`);
  }
}

/* Y por el otro nombre del dominio.
 *
 * `www` no va por el mismo camino: resuelve a través del CDN del hosting, y un
 * CDN puede servir de su caché una respuesta anterior a que la regla existiera.
 * Si una auditoría externa entra por ahí y esta comprobación solo mira el
 * dominio sin www, las dos miden bien y no coinciden. */
console.log('\n── Y por www, que va por el CDN y puede responder distinto');
for (const [vieja, nueva] of MUDANZAS.slice(0, 5)) {
  try {
    const r = await pedir(`https://www.meetbecome.com${vieja}`);
    const bien = r.codigo === 301 || r.codigo === 302;
    console.log(`${bien ? 'ok ' : '·  '} www${vieja} → ${r.codigo}${r.destino ? ` → ${r.destino.replace(SITIO, '')}` : ''}`);
    /* No cuenta como fallo del despliegue: si el certificado de www no cubre
       ese nombre, esto ni siquiera conecta, y eso es cosa del hosting. */
  } catch (e) {
    console.log(`·   www${vieja} no se pudo consultar: ${e.message.split('\n')[0]}`);
  }
}

/* La tabla que pide la auditoría, en el formato que pide. */
console.log('\n── Tabla\n');
console.log('| URL antigua | estado | Location | URL nueva | estado |');
console.log('|---|---|---|---|---|');
for (const f of tabla) console.log(`| ${f.vieja} | ${f.codigo} | ${f.location} | ${f.nueva} | ${f.codigoNueva || '—'} |`);

console.log('');
if (fallos.length) {
  for (const f of fallos) console.log(`::error::${f}`);
  console.log(`\n${fallos.length} ${fallos.length === 1 ? 'dirección no cumple' : 'direcciones no cumplen'}.`);
  process.exit(1);
}
console.log(`Las ${MUDANZAS.length} direcciones viejas redirigen con 301 y las ${NUEVAS.length} nuevas responden 200.`);
