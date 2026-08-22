/**
 * El catálogo de conectores: la única fuente sobre lo que este sitio conecta.
 *
 * Cada carpeta de `conectores/` declara un sistema ajeno con el que hablamos:
 * qué hace, con qué llaves, qué acciones tiene, cuáles no se pueden deshacer y
 * quién comprueba el resultado. De esa declaración sale la documentación, y
 * saldrán después los avisos de caducidad y las herramientas del agente.
 *
 * ---- Por qué esto es un guardián y no una lista ----
 *
 * Una lista de integraciones escrita a mano dura tres semanas. Alguien añade un
 * secreto un martes por la noche, no actualiza el documento, y a partir de ahí
 * el documento miente —y lo peor de un inventario que miente es que se sigue
 * consultando—.
 *
 * Así que esto no se limita a leer los manifiestos: los CONTRASTA con el
 * repositorio, en las dos direcciones.
 *
 *   · Toda llave declarada tiene que usarse de verdad en algún sitio. Si no,
 *     el manifiesto describe algo que ya no existe.
 *   · Y al revés, que es la que importa: TODA llave que el repositorio use
 *     tiene que estar declarada. Un secreto nuevo sin conector que lo declare
 *     detiene esto en rojo. Ese es el fallo que se quería impedir: una llave
 *     que existe, caduca y no está en ninguna lista.
 *
 * ---- Y una regla propia ----
 *
 * Toda acción marcada `irreversible` necesita un modo ensayo. Publicar en la
 * página de LinkedIn de la empresa para comprobar si funciona no se puede
 * deshacer sin que alguien lo haya visto. Si no hay forma de ensayar, no se
 * puede probar, y lo que no se puede probar se rompe en silencio.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'conectores';
const SALIDA = 'docs/CATALOGO.md';

/* Llaves que el repositorio usa y que NINGÚN conector tiene por qué declarar.
   Cada exención lleva su motivo: una lista de excepciones sin motivos se
   convierte en el sitio donde se esconde lo que no apetece arreglar. */
const EXENTAS = {
  GITHUB_TOKEN: 'Lo emite GitHub solo, para cada ejecución. No existe fuera de ella y nadie lo renueva.',
  GITHUB_REPOSITORY: 'Lo pone GitHub en cada ejecución. Es el nombre del repositorio, no una llave.',
  PANEL_RAMA: 'Configuración, no credencial: la rama por defecto, que GitHub ya conoce.',
};

const fallos = [];
const avisos = [];

/* ---- Los manifiestos ------------------------------------------------------ */
const conectores = [];
for (const nombre of readdirSync(DIR).sort()) {
  const ruta = join(DIR, nombre, 'conector.json');
  if (!statSync(join(DIR, nombre)).isDirectory()) continue;
  if (!existsSync(ruta)) { fallos.push(`${nombre}: falta conector.json`); continue; }

  let c;
  try { c = JSON.parse(readFileSync(ruta, 'utf8')); }
  catch (e) { fallos.push(`${nombre}: el manifiesto no es JSON válido — ${e.message}`); continue; }

  for (const campo of ['nombre', 'sistema', 'queHace', 'implementacion', 'credenciales', 'acciones']) {
    if (c[campo] === undefined) fallos.push(`${nombre}: falta el campo «${campo}»`);
  }
  if (c.nombre && c.nombre !== nombre) fallos.push(`${nombre}: el manifiesto se llama «${c.nombre}» y la carpeta «${nombre}»`);

  /* Que el archivo que dice implementarlo exista. Un manifiesto que apunta a un
     script borrado describe un conector que ya no está. */
  for (const parte of String(c.implementacion || '').split('·').map((s) => s.trim())) {
    if (parte && !existsSync(parte)) fallos.push(`${nombre}: la implementación «${parte}» no existe`);
  }

  for (const a of c.acciones || []) {
    if (a.efecto === 'irreversible' && !a.ensayo) {
      avisos.push(`${nombre} · ${a.nombre}: acción irreversible sin modo ensayo. No hay forma de probarla sin causar el efecto.`);
    }
  }
  if (!c.centinela) {
    avisos.push(`${nombre}: sin centinela. Nadie comprueba el resultado, solo que la ejecución terminó.`);
  }

  conectores.push(c);
}

/* ---- Las llaves, contrastadas contra el repositorio ----------------------- */
const fuentes = [];
const recorrer = (dir) => {
  for (const f of readdirSync(dir)) {
    const r = join(dir, f);
    if (statSync(r).isDirectory()) { if (f !== 'node_modules' && f !== 'dist') recorrer(r); }
    else if (/\.(yml|yaml|mjs|js|php)$/.test(f)) fuentes.push(r);
  }
};
for (const d of ['.github/workflows', 'scripts', 'assets/api']) if (existsSync(d)) recorrer(d);

const texto = fuentes.map((f) => readFileSync(f, 'utf8')).join('\n');
const usadas = new Set([
  ...[...texto.matchAll(/secrets\.([A-Z][A-Z0-9_]{2,})/g)].map((m) => m[1]),
  ...[...texto.matchAll(/getenv\(['"]([A-Z][A-Z0-9_]{2,})['"]\)/g)].map((m) => m[1]),
]);

const declaradas = new Map();
for (const c of conectores) {
  for (const k of c.credenciales || []) {
    if (!k.clave) { fallos.push(`${c.nombre}: una credencial sin campo «clave»`); continue; }
    if (declaradas.has(k.clave)) {
      avisos.push(`La llave ${k.clave} la declaran dos conectores: ${declaradas.get(k.clave).nombre} y ${c.nombre}.`);
    }
    declaradas.set(k.clave, { ...k, conector: c.nombre });
  }
}

/* La comprobación que da sentido a todo esto. */
for (const k of usadas) {
  if (EXENTAS[k]) continue;
  if (!declaradas.has(k)) {
    fallos.push(`La llave ${k} se usa en el repositorio y no la declara ningún conector. Añádela al manifiesto que corresponda, o al catálogo de exentas con su motivo.`);
  }
}
for (const [k, v] of declaradas) {
  /* Las públicas por diseño y las que solo lee PHP por otro camino no se
     buscan igual; se avisa, no se detiene. */
  if (!usadas.has(k) && !v.publica) {
    avisos.push(`La llave ${k} la declara «${v.conector}» y no aparece usada en el repositorio. ¿Sobra?`);
  }
}

/* ---- El documento --------------------------------------------------------- */
const conCaducidad = [...declaradas.values()].filter((k) => /^\d+d$/.test(k.caduca || ''));

const md = [];
md.push('# Catálogo de conectores');
md.push('');
md.push('> Generado por `scripts/catalogo.mjs` a partir de `conectores/*/conector.json`.');
md.push('> No se edita a mano: se edita el manifiesto y se vuelve a generar.');
md.push('');
md.push(`${conectores.length} conectores · ${declaradas.size} llaves · ${conCaducidad.length} con fecha de caducidad`);
md.push('');
md.push('## Registro de llaves');
md.push('');
md.push('| Llave | Conector | Caduca | Cómo se renueva |');
md.push('| --- | --- | --- | --- |');
for (const [clave, k] of [...declaradas].sort()) {
  const caduca = k.publica ? 'pública por diseño' : (k.caduca || '—');
  md.push(`| \`${clave}\` | ${k.conector} | ${caduca} | ${(k.renueva || '—').replace(/\|/g, '\\|')} |`);
}
md.push('');
md.push('Tres reglas, sin excepciones: ninguna llave viaja por un chat ni por correo —una clave que pasa por una conversación es una clave que hay que rotar—; ninguna llave entra en el código; y toda llave con caducidad avisa antes, no después.');
md.push('');
md.push('## Conectores');
md.push('');
for (const c of conectores) {
  md.push(`### ${c.nombre}`);
  md.push('');
  md.push(`**${c.sistema}** — ${c.queHace}`);
  md.push('');
  md.push(`- Implementación: \`${c.implementacion}\``);
  md.push(`- Se dispara: ${(c.disparadores || ['—']).join(', ')}`);
  md.push(`- Acciones: ${(c.acciones || []).map((a) => `${a.nombre}${a.efecto === 'irreversible' ? ' (irreversible)' : ''}`).join(', ') || '—'}`);
  md.push(`- Registro de lo hecho: ${c.registro || 'no lleva'}`);
  md.push(`- Centinela: ${c.centinela || '**ninguno**'}`);
  if (c.datosPersonales) md.push('- **Guarda datos personales de terceros.**');
  if (c.notas) { md.push(''); md.push(c.notas); }
  md.push('');
}

writeFileSync(SALIDA, `${md.join('\n')}\n`);

/* ---- Veredicto ------------------------------------------------------------ */
console.log(`${conectores.length} conectores · ${declaradas.size} llaves · ${conCaducidad.length} con caducidad`);
console.log(`Escrito ${SALIDA}`);
if (avisos.length) {
  console.log('');
  for (const a of avisos) console.log(`::warning::${a}`);
}
if (fallos.length) {
  console.log('');
  for (const f of fallos) console.error(`::error::${f}`);
  console.error(`::error::El catálogo no cuadra con el repositorio: ${fallos.length} ${fallos.length === 1 ? 'problema' : 'problemas'}.`);
  process.exit(1);
}
console.log('\nEl catálogo cuadra con el repositorio.');
