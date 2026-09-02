/**
 * Publicar la configuración del diagnóstico TRAMMY.
 *
 * El panel escribe los cambios en la hoja. Este comando los mete dentro del
 * flujo y lo republica, que es lo que hace que el formulario los use.
 *
 * Ese paso existe por una razón medida: el formulario de n8n se pinta en una
 * segunda petición, y si la ejecución que la sirve hizo antes cualquier llamada
 * de red, la página se cuelga —cero de cinco intentos— y quien la rellena ve un
 * spinner eterno. Con la configuración escrita dentro del flujo, cinco de
 * cinco. El precio es este comando.
 *
 *   npm run trammy:publicar
 */

process.env.NODE_USE_ENV_PROXY ??= '1';

import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';

const TOKEN = process.env.TRAMMY_CONFIG_TOKEN || 'cfg-dqqfr9wlgu';
const BASE = 'https://n8n.srv836595.hstgr.cloud';
const FLUJO = 'kBbKnGEnIIwqX5dW';
const COMPILADA = 'automatizacion/n8n/trammy-config.json';

const paso = (texto) => console.log(`· ${texto}`);

paso('Leyendo la configuración de la hoja…');
const respuesta = await fetch(`${BASE}/webhook/trammy-config?token=${TOKEN}`, {
  signal: AbortSignal.timeout(60000),
});
if (!respuesta.ok) {
  console.error(`La API de configuración respondió ${respuesta.status}. ¿Está activo el flujo «TRAMMY · API de configuración»?`);
  process.exit(1);
}
const config = await respuesta.json();
if (config.ok !== true) {
  console.error(`La API de configuración devolvió un error: ${config.error || 'sin detalle'}`);
  process.exit(1);
}

writeFileSync(COMPILADA, JSON.stringify(config, null, 2));
paso(`${config.preguntas.length} preguntas · ${config.perfiles.length} perfiles · ${Object.keys(config.textos).length} textos`);

paso('Metiéndola dentro del flujo…');
execFileSync('node', ['scripts/n8n-curar-trammy.mjs'], { stdio: 'inherit' });

paso('Publicando…');
execFileSync('node', ['scripts/n8n.mjs', 'actualizar', FLUJO, 'automatizacion/n8n/trammy-flujo-1.json'], { stdio: 'inherit' });
execFileSync('node', ['scripts/n8n.mjs', 'activar', FLUJO], { stdio: 'inherit' });

/* Comprobar que la página sale de verdad, y no solo que la API dijo que sí. */
paso('Comprobando que el formulario responde…');
const pagina1 = await fetch(`${BASE}/form/trammy-diagnostico`, { signal: AbortSignal.timeout(30000) });
console.log(`  la página de acceso responde ${pagina1.status}`);

const primera = JSON.parse(readFileSync(COMPILADA, 'utf8')).preguntas[0];
console.log(`\nListo. La primera pregunta que verá la gente es:\n  «${primera.texto}»`);
