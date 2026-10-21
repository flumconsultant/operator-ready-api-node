// trinity.json (filas del PDF) → filas de la hoja de resultados y prompts del proyecto «Pymes».
import { readFileSync, writeFileSync } from 'node:fs';
const SRC = '/home/user/operator-ready-api-node/automatizacion/geo-monitor/src/';
const src = f => readFileSync(SRC + f, 'utf8');
const { CONFIG, sovPorMarca, COLUMNAS_RESULTADOS, COLUMNAS_PROMPTS } = new Function(
  'const SHEET_ID = "x";\n' + src('config.js') + src('sov.js') + src('hoja.js') + '\nreturn { CONFIG, sovPorMarca, COLUMNAS_RESULTADOS, COLUMNAS_PROMPTS };')();
const filas = JSON.parse(readFileSync('trinity.json', 'utf8'));
// Palabras cortadas por el ancho de columna del PDF.
const ARREGLOS = [['financiamie nto', 'financiamiento'], ['recomiend an', 'recomiendan'], ['recomienda n', 'recomiendan'], ['independie nte', 'independiente'],
  ['emprended ores', 'emprendedores'], ['Financier a', 'Financiera'], ['Empresar ial', 'Empresarial'], ['Préstamo s', 'Préstamos'], ['ningun a', 'ninguna'],
  ['Negativ o', 'Negativo'], ['Positiv o', 'Positivo'], ['Comparta mos', 'Compartamos']];
const limpiar = t => ARREGLOS.reduce((s, [a, b]) => s.split(a).join(b), String(t || '')).replace(/\s+/g, ' ').trim();
const marcas = [CONFIG.marca].concat(CONFIG.competidores);
const clave = x => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const canon = n => { const m = marcas.find(b => [b.nombre].concat(b.alias || []).some(a => clave(a) === clave(n))); return m ? m.nombre : n; };
const SENT = { Positivo: 0.6, Neutro: 0, Negativo: -0.6 };
const id = n => 'pym-' + String(n).padStart(2, '0');

const prompts = new Map();
const porFecha = new Map();
for (const x of filas) {
  const prompt = limpiar(x.prompt), categoria = limpiar(x.categoria);
  if (!prompts.has(x.n) && categoria !== '—') prompts.set(x.n, { prompt, categoria });
  const menciona = x.mencion === 'Sí';
  const error = x.mencion === 'sin respuesta';
  // El 7 y 10-ago Trinity contaba como «marcas» a Gob.pe, SBS y Gestión: no son bancos, se sacan.
  const NO_BANCOS = ['Gob.pe', 'SBS', 'Gestión'];
  const lista = limpiar(x.marcas) === '—' ? [] : limpiar(x.marcas).split('>').map(p => p.trim().match(/^(.*?)\s*(\d+)?$/)).map(m => ({ marca: canon(m[1]), puntaje: m[2] ? Number(m[2]) : null }))
    .filter(m => !NO_BANCOS.includes(m.marca));
  const s = limpiar(x.sent);
  const sent = SENT[s] !== undefined ? SENT[s] : null;
  const detalle = lista.map((m, i) => ({ marca: m.marca, posicion: i + 1, menciones: 1, sentimiento: m.marca === CONFIG.marca.nombre ? sent : null, puntaje_trinity: m.puntaje }));
  const citas = (x.cita.match(/Sí \((\d+)\)/) || [])[1];
  const fila = {
    run_id: 'trinity_' + x.fecha.replace(/-/g, ''), fecha: x.fecha, timestamp: x.fecha + 'T12:00:00Z', prompt_id: id(x.n), proyecto: 'Pymes',
    categoria: prompts.get(x.n)?.categoria || categoria, prompt: prompts.get(x.n)?.prompt || prompt, motor: x.motor,
    estado: error ? 'error' : 'ok', menciona_bcp: menciona,
    posicion_bcp: menciona ? (lista.findIndex(m => m.marca === CONFIG.marca.nombre) + 1 || Number(x.pos.split('/')[0])) : '',
    sentimiento: menciona && sent !== null ? sent : '', marcas_mencionadas: lista.map(m => m.marca).join(', '),
    fuentes: citas ? CONFIG.marca.dominios[0] : '', citado_bcp: Boolean(citas), error: error ? 'Trinity: sin respuesta' : '',
    respuesta: '', n_menciones_bcp: menciona ? 1 : 0, n_menciones_bancos: lista.length,
    detalle_marcas: detalle.length ? JSON.stringify(detalle) : '', sov_bcp: error ? '' : menciona ? (sovPorMarca(detalle)[CONFIG.marca.nombre] || 0) : 0,
    // Las URLs y los textos completos están en el export HTML/JSON de Trinity (no en el PDF).
    fuentes_detalle: citas ? JSON.stringify(Array.from({ length: Number(citas) }, (_, i) => ({ url: 'https://www.viabcp.com/', title: 'viabcp.com (cita registrada por Trinity)', domain: 'viabcp.com', position: i + 1 }))) : '',
    consultas_busqueda: ''
  };
  if (!porFecha.has(x.fecha)) porFecha.set(x.fecha, []);
  porFecha.get(x.fecha).push(COLUMNAS_RESULTADOS.map(c => { const v = fila[c]; return typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : v; }));
}
const filasPrompts = [...prompts.entries()].sort((a, b) => a[0] - b[0]).map(([n, p]) => {
  const intencion = /^(que|donde|cual)\b.*(banco|recomiend|ofrece|conseguir|pedir|sacar)/.test(p.prompt) ? 'Comparativa' : /^como|^que hacer|^opciones/.test(p.prompt) ? 'Informacional' : 'Comercial';
  return [id(n), p.categoria, intencion, p.prompt, 'FALSE', '2026-08-07', 'Pymes, Trinity', '', '', 'PE'];
});
if (process.env.SIN_PROMPTS) filasPrompts.length = 0;
writeFileSync('import.json', JSON.stringify({ fechas: Object.fromEntries(porFecha), prompts: filasPrompts, cabResultados: COLUMNAS_RESULTADOS, cabPrompts: COLUMNAS_PROMPTS }));
console.log('prompts:', filasPrompts.length, '· fechas:', [...porFecha.keys()].join(' '), '· filas:', [...porFecha.values()].reduce((a, v) => a + v.length, 0));
for (const p of filasPrompts) console.log(' ', p[0], p[2].padEnd(13), p[1].padEnd(30), p[3]);
const ej = porFecha.get('2026-10-19')[21]; console.log('ejemplo:', JSON.stringify(Object.fromEntries(COLUMNAS_RESULTADOS.map((c, i) => [c, ej[i]]))).slice(0, 700));
