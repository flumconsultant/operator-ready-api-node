// Sobrescribe A2:W61 de cada pestaña de fecha de Trinity, verificando antes que
// prompt_id y motor de cada fila coincidan.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const d = JSON.parse(readFileSync('hist3/import.json', 'utf8'));
const cab = d.cabResultados, iP = cab.indexOf('prompt_id'), iM = cab.indexOf('motor');
for (const [fecha, filas] of Object.entries(d.fechas)) {
  const r = execFileSync('node', ['tmp-sheet.mjs', 'leer', `'${fecha}'!A1:H${filas.length + 1}`], { maxBuffer: 50e6 }).toString().split('\n')[0];
  const vals = JSON.parse(r.slice(4)).values;
  const hojaIdx = cab.map(c => vals[0].indexOf(c));
  const ok = vals.length - 1 === filas.length && filas.every((f, i) => vals[i + 1][vals[0].indexOf('prompt_id')] === f[iP] && vals[i + 1][vals[0].indexOf('motor')] === f[iM] && vals[i + 1][0] === f[0]);
  if (!ok) { console.log(fecha, 'NO COINCIDE: no se escribe'); continue; }
  writeFileSync('hist3/filas.json', JSON.stringify(filas));
  const w = execFileSync('node', ['tmp-sheet.mjs', 'escribir', `'${fecha}'!A2:W${filas.length + 1}`, '@hist3/filas.json'], { maxBuffer: 50e6 }).toString().split('\n')[0];
  console.log(fecha, w.slice(0, 3), (JSON.parse(w.slice(4)).updatedCells || 0) + ' celdas');
}
