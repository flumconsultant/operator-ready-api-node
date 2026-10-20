// El Google Sheet, organizado como lo usa el equipo de BCP:
//   · una pestaña por proyecto con sus prompts (Marca, Ahorros, Cards…)
//   · una pestaña por día de medición con los resultados (2026-10-21, …)
//   · las que empiezan con «_» son de sistema (respaldos, notas) y se ignoran.
// Se lee y escribe con la API de Google Sheets (nodos HTTP con la credencial de
// Sheets); aquí solo se arman las peticiones y se interpretan las respuestas.
// Sin dependencias: build.mjs lo pega en los nodos Code que lo necesitan.

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets/' + SHEET_ID;

// Encabezados de las pestañas de proyecto (los del Excel original de BCP, más
// id, activo y fecha para poder gestionarlos desde el front).
const COLUMNAS_PROMPTS = ['id', 'Categoría', 'Intención de Búsqueda', 'Prompt', 'Activo', 'Fecha de creación'];
const COLUMNAS_RESULTADOS = ['run_id', 'fecha', 'timestamp', 'prompt_id', 'proyecto', 'categoria', 'prompt', 'motor', 'estado',
  'menciona_bcp', 'posicion_bcp', 'sentimiento', 'marcas_mencionadas', 'fuentes', 'citado_bcp', 'error', 'respuesta',
  'n_menciones_bcp', 'n_menciones_bancos', 'detalle_marcas', 'sov_bcp'];

function esPestanaFecha(titulo) { return /^\d{4}-\d{2}-\d{2}$/.test(String(titulo || '').trim()); }
function esPestanaSistema(titulo) { return String(titulo || '').trim().startsWith('_'); }
function esPestanaProyecto(titulo) { return !esPestanaFecha(titulo) && !esPestanaSistema(titulo) && String(titulo || '').trim() !== ''; }

function pestanas(meta) {
  return ((meta && meta.sheets) || []).map(s => s.properties).filter(Boolean)
    .map(p => ({ id: p.sheetId, titulo: p.title, indice: p.index }));
}

// Rango A1 de una pestaña, con el nombre entre comillas (acepta espacios y tildes).
function rango(titulo, celdas) {
  return "'" + String(titulo).replace(/'/g, "''") + "'!" + celdas;
}

// Cuerpo de values:batchGetByDataFilter para leer varias pestañas en una llamada.
// desde (AAAA-MM-DD): solo las pestañas de resultados desde esa fecha.
function cuerpoLectura(meta, { prompts = false, resultadosDesde = null } = {}) {
  const filtros = [];
  for (const p of pestanas(meta)) {
    if (prompts && esPestanaProyecto(p.titulo)) filtros.push({ a1Range: rango(p.titulo, 'A:F') });
    if (resultadosDesde && esPestanaFecha(p.titulo) && p.titulo >= resultadosDesde) filtros.push({ a1Range: rango(p.titulo, 'A:U') });
  }
  // La API no acepta una lista vacía: sin nada que leer, se pide A1 de la primera pestaña.
  const primera = pestanas(meta)[0];
  if (!filtros.length && primera) filtros.push({ a1Range: rango(primera.titulo, 'A1:A1') });
  return { dataFilters: filtros, majorDimension: 'ROWS', valueRenderOption: 'UNFORMATTED_VALUE' };
}

function tituloDeRango(r) {
  const m = String(r || '').match(/^'((?:[^']|'')*)'!/) || String(r || '').match(/^([^!]+)!/);
  return m ? m[1].replace(/''/g, "'") : '';
}

function claveColumna(c) {
  const k = String(c || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  if (k === 'id') return 'id';
  if (k.startsWith('categ')) return 'categoria';
  if (k.startsWith('intenc')) return 'intencion';
  if (k.startsWith('prompt')) return 'prompt';
  if (k.startsWith('activo')) return 'activo';
  if (k.startsWith('fecha')) return 'fecha_creacion';
  return '';
}

// Respuesta de batchGetByDataFilter → {prompts: [...], resultados: [...]}.
// Cada prompt lleva su pestaña (= proyecto) y su número de fila.
function leerHojas(respuesta) {
  const prompts = [];
  const resultados = [];
  for (const vr of (respuesta && respuesta.valueRanges) || []) {
    const v = vr.valueRange || vr;
    const titulo = tituloDeRango(v.range);
    const filas = v.values || [];
    if (!filas.length) continue;
    if (esPestanaFecha(titulo)) {
      const cab = filas[0].map(String);
      filas.slice(1).forEach(f => {
        if (!f || !f.some(x => x !== '' && x !== null)) return;
        const o = {};
        cab.forEach((c, i) => { o[c] = f[i] === undefined ? '' : f[i]; });
        resultados.push(o);
      });
    } else if (esPestanaProyecto(titulo)) {
      const cab = filas[0].map(claveColumna);
      filas.slice(1).forEach((f, i) => {
        if (!f || !f.some(x => x !== '' && x !== null)) return;
        const o = { proyecto: titulo, _fila: i + 2 };
        cab.forEach((c, j) => { if (c) o[c] = f[j] === undefined ? '' : f[j]; });
        if (o.fecha_creacion !== undefined) o.fecha_creacion = fechaTexto(o.fecha_creacion);
        prompts.push(o);
      });
    }
  }
  return { prompts, resultados };
}

// Las fechas pueden volver como número de serie de Sheets (UNFORMATTED_VALUE).
function fechaTexto(v) {
  if (typeof v === 'number' && v > 20000 && v < 80000) {
    return new Date(Date.UTC(1899, 11, 30) + v * 864e5).toISOString().slice(0, 10);
  }
  return String(v || '');
}

function valoresPrompt(p) {
  return [p.id, p.categoria || '', p.intencion || '', p.prompt || '', p.activo === false ? 'FALSE' : 'TRUE', p.fecha_creacion || ''];
}

function valoresResultado(f) {
  return COLUMNAS_RESULTADOS.map(c => {
    const v = f[c];
    return v === undefined || v === null ? '' : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : v;
  });
}

// ─── Peticiones a la API de Sheets ─────────────────────────────────────────
const pedidoSheets = (method, ruta, body) => ({ method, url: SHEETS_API + ruta, body });
const crearPestana = (titulo, indice) =>
  pedidoSheets('POST', ':batchUpdate', { requests: [{ addSheet: { properties: Object.assign({ title: titulo }, indice === undefined ? {} : { index: indice }) } }] });
const escribir = (titulo, desde, valores) =>
  pedidoSheets('PUT', '/values/' + encodeURIComponent(rango(titulo, desde)) + '?valueInputOption=RAW', { values: valores });
const agregar = (titulo, valores) =>
  pedidoSheets('POST', '/values/' + encodeURIComponent(rango(titulo, 'A1')) + ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', { values: valores });
const borrarFila = (idPestana, fila) =>
  pedidoSheets('POST', ':batchUpdate', { requests: [{ deleteDimension: { range: { sheetId: idPestana, dimension: 'ROWS', startIndex: fila - 1, endIndex: fila } } }] });

// Crear, editar, activar/desactivar, mover de proyecto o eliminar un prompt.
// guardado: lo que devuelve prepararGuardado (prompts.js).
// → {ok, status, respuesta, peticiones}
function planGuardarPrompt(guardado, prompts, meta) {
  if (!guardado.ok) return { ok: false, status: 400, respuesta: { ok: false, error: guardado.error }, peticiones: [] };
  const tabs = pestanas(meta);
  const tab = titulo => tabs.find(t => t.titulo === titulo);
  const fila = guardado.fila;
  const actual = prompts.find(p => String(p.id).trim() === fila.id);
  const proyectosAlFinal = tabs.filter(t => esPestanaProyecto(t.titulo)).length;
  const asegurarPestana = (titulo, pet) => {
    if (!tab(titulo)) {
      pet.push(crearPestana(titulo, proyectosAlFinal));
      pet.push(escribir(titulo, 'A1', [COLUMNAS_PROMPTS]));
    }
  };

  if (guardado.accion === 'eliminar') {
    if (!actual) return { ok: false, status: 404, respuesta: { ok: false, error: 'No existe el prompt ' + fila.id }, peticiones: [] };
    return { ok: true, status: 200, respuesta: { ok: true, accion: 'eliminar', id: fila.id }, peticiones: [borrarFila(tab(actual.proyecto).id, actual._fila)] };
  }

  if (guardado.accion === 'editar') {
    if (!actual) return { ok: false, status: 404, respuesta: { ok: false, error: 'No existe el prompt ' + fila.id }, peticiones: [] };
    const nuevo = Object.assign({}, normalizarPrompt(actual), fila);
    const pet = [];
    if (nuevo.proyecto === actual.proyecto) {
      pet.push(escribir(actual.proyecto, 'A' + actual._fila + ':F' + actual._fila, [valoresPrompt(nuevo)]));
    } else {
      // Cambio de proyecto: se agrega en la pestaña nueva y se borra de la vieja.
      asegurarPestana(nuevo.proyecto, pet);
      pet.push(agregar(nuevo.proyecto, [valoresPrompt(nuevo)]));
      pet.push(borrarFila(tab(actual.proyecto).id, actual._fila));
    }
    return { ok: true, status: 200, respuesta: { ok: true, accion: 'editar', prompt: limpio(nuevo) }, peticiones: pet };
  }

  // Crear: un proyecto nuevo crea su pestaña.
  const nuevo = normalizarPrompt(fila);
  const pet = [];
  asegurarPestana(nuevo.proyecto, pet);
  pet.push(agregar(nuevo.proyecto, [valoresPrompt(nuevo)]));
  return { ok: true, status: 200, respuesta: { ok: true, accion: 'crear', prompt: limpio(nuevo) }, peticiones: pet };
}

function limpio(p) {
  const o = {};
  for (const k of Object.keys(p)) if (!k.startsWith('_')) o[k] = p[k];
  return o;
}

// Guardar las filas de una corrida en la pestaña del día (se crea si no está,
// justo después de las pestañas de proyecto, para que la más reciente quede primero).
function planGuardarResultados(filas, meta) {
  const porFecha = new Map();
  for (const f of filas) {
    if (!porFecha.has(f.fecha)) porFecha.set(f.fecha, []);
    porFecha.get(f.fecha).push(valoresResultado(f));
  }
  const tabs = pestanas(meta);
  const proyectos = tabs.filter(t => esPestanaProyecto(t.titulo)).length;
  const pet = [];
  for (const [fecha, valores] of porFecha) {
    if (tabs.some(t => t.titulo === fecha)) pet.push(agregar(fecha, valores));
    else {
      pet.push(crearPestana(fecha, proyectos));
      pet.push(escribir(fecha, 'A1', [COLUMNAS_RESULTADOS].concat(valores)));
    }
  }
  return pet;
}
