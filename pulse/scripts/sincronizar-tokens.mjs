// Copia el sistema de diseño de BECOME a Pulse.
//
// Los tokens viven una sola vez, en `tokens/` de la raíz del repositorio: es la
// fuente de verdad del color, la tipografía y el resto. Pulse no los redefine,
// los importa. Este script los concatena en un único archivo generado para que
// Next.js pueda servirlos sin salir de su carpeta, y para que el día que Pulse
// se mude a su propio repositorio el archivo generado siga ahí y siga siendo
// válido.
//
//   node pulse/scripts/sincronizar-tokens.mjs
//
// Si cambia un token en `tokens/`, se vuelve a ejecutar y se comitea el
// resultado. No hay más magia.

import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
// Dos sitios posibles: `../../tokens` mientras Pulse vive dentro del
// repositorio del sitio, y `../tokens` cuando Pulse esté en el suyo y los
// tokens se hayan copiado a su raíz. El script funciona igual en los dos.
const origen = [resolve(aqui, "../../tokens"), resolve(aqui, "../tokens")].find(
  existsSync,
);
if (!origen) {
  console.error(
    "No encuentro la carpeta tokens/. Debe estar en la raíz del repositorio.",
  );
  process.exit(1);
}
const destino = resolve(aqui, "../web/src/app/tokens.css");

// El orden importa: `colors.css` define las variables semánticas que el resto
// referencia, y `fonts.css` lleva el @import, que en CSS debe ir el primero de
// toda la hoja.
const orden = [
  "fonts.css",
  "base.css",
  "colors.css",
  "typography.css",
  "spacing.css",
  "radius.css",
  "effects.css",
  "motion.css",
  "patterns.css",
];

const presentes = new Set(readdirSync(origen).filter((f) => f.endsWith(".css")));
const archivos = [
  ...orden.filter((f) => presentes.has(f)),
  ...[...presentes].filter((f) => !orden.includes(f)).sort(),
];

const partes = [
  "/* GENERADO — no editar a mano.",
  " * Fuente: tokens/ en la raíz del repositorio.",
  " * Regenerar: node pulse/scripts/sincronizar-tokens.mjs",
  " */",
  "",
];

// Los @import van al principio de la hoja o el navegador los ignora, así que se
// extraen de cada archivo y se reagrupan arriba.
const imports = [];
for (const archivo of archivos) {
  const bruto = readFileSync(join(origen, archivo), "utf8");
  const limpio = bruto.replace(/^[ \t]*@import\b[^\n]*;[ \t]*$/gm, (linea) => {
    imports.push(linea.trim());
    return "";
  });
  partes.push(`/* ---- tokens/${archivo} ---- */`, limpio.trim(), "");
}

writeFileSync(destino, [...imports, "", ...partes].join("\n"));
console.log(
  `tokens.css regenerado desde ${archivos.length} archivos de tokens/`,
);
