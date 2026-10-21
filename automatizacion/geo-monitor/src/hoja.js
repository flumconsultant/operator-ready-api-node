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
const COLUMNAS_PROMPTS = ['id', 'Categoría', 'Intención de Búsqueda', 'Prompt', 'Activo', 'Fecha de creación',
  'Tags', 'Etapa', 'Volumen', 'País'];
const COLUMNAS_RESULTADOS = ['run_id', 'fecha', 'timestamp', 'prompt_id', 'proyecto', 'categoria', 'prompt', 'motor', 'estado',
  'menciona_bcp', 'posicion_bcp', 'sentimiento', 'marcas_mencionadas', 'fuentes', 'citado_bcp', 'error', 'respuesta',
  'n_menciones_bcp', 'n_menciones_bancos', 'detalle_marcas', 'sov_bcp', 'fuentes_detalle', 'consultas_busqueda'];

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
// Pestañas de sistema que lee el monitor: correcciones de categoría de dominio,
// estado de las recomendaciones y auditorías GEO.
const SISTEMA = ['_dominios', '_recomendaciones', '_auditorias', '_config'];

function cuerpoLectura(meta, { prompts = false, resultadosDesde = null, sistema = false } = {}) {
  const filtros = [];
  for (const p of pestanas(meta)) {
    if (prompts && esPestanaProyecto(p.titulo)) filtros.push({ a1Range: rango(p.titulo, 'A:J') });
    if (resultadosDesde && esPestanaFecha(p.titulo) && p.titulo >= resultadosDesde) filtros.push({ a1Range: rango(p.titulo, 'A:W') });
    if (sistema && SISTEMA.includes(p.titulo)) filtros.push({ a1Range: rango(p.titulo, 'A:H') });
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
  if (k === 'tags' || k === 'tag') return 'tags';
  if (k.startsWith('etapa') || k.startsWith('funnel')) return 'etapa';
  if (k.startsWith('volumen')) return 'volumen';
  if (k === 'pais' || k === 'country') return 'pais';
  return '';
}

// Respuesta de batchGetByDataFilter → {prompts, resultados, sistema}.
// Cada prompt lleva su pestaña (= proyecto) y su número de fila.
function leerHojas(respuesta) {
  const prompts = [];
  const resultados = [];
  const sistema = {};
  for (const vr of (respuesta && respuesta.valueRanges) || []) {
    const v = vr.valueRange || vr;
    const titulo = tituloDeRango(v.range);
    const filas = v.values || [];
    if (!filas.length) continue;
    if (SISTEMA.includes(titulo)) {
      const cab = filas[0].map(String);
      sistema[titulo] = [];
      filas.slice(1).forEach((f, i) => {
        if (!f || !f.some(x => x !== '' && x !== null)) return;
        const o = { _fila: i + 2 };
        cab.forEach((c, j) => { o[c] = f[j] === undefined ? '' : f[j]; });
        sistema[titulo].push(o);
      });
    } else if (esPestanaFecha(titulo)) {
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
  return { prompts, resultados, sistema };
}

// Las fechas pueden volver como número de serie de Sheets (UNFORMATTED_VALUE).
function fechaTexto(v) {
  if (typeof v === 'number' && v > 20000 && v < 80000) {
    return new Date(Date.UTC(1899, 11, 30) + v * 864e5).toISOString().slice(0, 10);
  }
  return String(v || '');
}

function valoresPrompt(p) {
  return [p.id, p.categoria || '', p.intencion || '', p.prompt || '', p.activo === false ? 'FALSE' : 'TRUE', p.fecha_creacion || '',
    (p.tags || []).join(', '), p.etapa || '', p.volumen ? p.volumen : '', p.pais || 'PE'];
}

function valoresResultado(f) {
  return COLUMNAS_RESULTADOS.map(c => {
    const v = f[c];
    return v === undefined || v === null ? '' : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : v;
  });
}

// ─── Peticiones a la API de Sheets ─────────────────────────────────────────
const pedidoSheets = (method, ruta, body) => ({ method, url: SHEETS_API + ruta, body });
// Crea la pestaña y escribe sus filas en UNA sola petición (addSheet + appendCells
// con un sheetId elegido aquí). Con dos peticiones separadas, n8n las lanza con
// 300 ms de diferencia sin esperar la primera y la escritura puede llegar antes
// que la pestaña («Unable to parse range»): pasó en la corrida del 21/10.
function crearPestana(titulo, indice, filas, meta) {
  const usados = pestanas(meta).map(t => Number(t.id) || 0);
  let id = (Math.max(0, ...usados) % 2000000000) + 1;
  while (usados.includes(id)) id++;
  const celda = v => ({ userEnteredValue: typeof v === 'number' ? { numberValue: v } : typeof v === 'boolean' ? { boolValue: v } : { stringValue: v === null || v === undefined ? '' : String(v) } });
  const requests = [{ addSheet: { properties: Object.assign({ sheetId: id, title: titulo }, indice === undefined ? {} : { index: indice }) } }];
  if (filas && filas.length) requests.push({ appendCells: { sheetId: id, rows: filas.map(f => ({ values: f.map(celda) })), fields: 'userEnteredValue' } });
  return pedidoSheets('POST', ':batchUpdate', { requests });
}
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
  // Agrega filas a la pestaña del proyecto; si no existe, la crea con encabezados y filas a la vez.
  const agregarEn = (titulo, valores, pet) => {
    pet.push(tab(titulo) ? agregar(titulo, valores) : crearPestana(titulo, proyectosAlFinal, [COLUMNAS_PROMPTS].concat(valores), meta));
  };

  if (guardado.accion === 'eliminar') {
    if (!actual) return { ok: false, status: 404, respuesta: { ok: false, error: 'No existe el prompt ' + fila.id }, peticiones: [] };
    return { ok: true, status: 200, respuesta: { ok: true, accion: 'eliminar', id: fila.id }, peticiones: [borrarFila(tab(actual.proyecto).id, actual._fila)] };
  }

  if (guardado.accion === 'editar') {
    if (!actual) return { ok: false, status: 404, respuesta: { ok: false, error: 'No existe el prompt ' + fila.id }, peticiones: [] };
    // Se combina antes de normalizar, para que lo derivado (etapa según intención) use lo nuevo.
    const nuevo = normalizarPrompt(Object.assign({}, actual, fila));
    const pet = [];
    if (nuevo.proyecto === actual.proyecto) {
      pet.push(escribir(actual.proyecto, 'A' + actual._fila + ':J' + actual._fila, [valoresPrompt(nuevo)]));
    } else {
      // Cambio de proyecto: se agrega en la pestaña nueva y se borra de la vieja.
      agregarEn(nuevo.proyecto, [valoresPrompt(nuevo)], pet);
      pet.push(borrarFila(tab(actual.proyecto).id, actual._fila));
    }
    return { ok: true, status: 200, respuesta: { ok: true, accion: 'editar', prompt: limpio(nuevo) }, peticiones: pet };
  }

  // Crear: un proyecto nuevo crea su pestaña.
  const nuevo = normalizarPrompt(fila);
  const pet = [];
  agregarEn(nuevo.proyecto, [valoresPrompt(nuevo)], pet);
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
      pet.push(crearPestana(fecha, proyectos, [COLUMNAS_RESULTADOS].concat(valores), meta));
    }
  }
  return pet;
}

// ─── Pestañas de sistema (_recomendaciones, _dominios, _auditorias) ─────────
const COLUMNAS_SISTEMA = {
  _recomendaciones: ['id', 'estado', 'responsable', 'fecha_objetivo', 'fecha_hecha', 'actualizado'],
  _dominios: ['dominio', 'categoria', 'actualizado'],
  _auditorias: ['id', 'tipo', 'url', 'fecha', 'resultado'],
  _config: ['clave', 'valor', 'actualizado']
};

// Agrega o actualiza el registro cuya columna `clave` coincide. Crea la pestaña
// (al final del Sheet) si todavía no existe.
function planUpsertSistema(titulo, registro, clave, filas, meta) {
  const columnas = COLUMNAS_SISTEMA[titulo];
  const valores = columnas.map(c => registro[c] === undefined || registro[c] === null ? '' : registro[c]);
  const existe = pestanas(meta).some(t => t.titulo === titulo);
  if (!existe) return [crearPestana(titulo, undefined, [columnas, valores], meta)];
  const actual = (filas || []).find(f => String(f[clave]).trim() === String(registro[clave]).trim());
  if (!actual) return [agregar(titulo, [valores])];
  const fin = String.fromCharCode(64 + columnas.length);
  const combinado = columnas.map((c, i) => (registro[c] === undefined ? (actual[c] === undefined ? '' : actual[c]) : valores[i]));
  return [escribir(titulo, 'A' + actual._fila + ':' + fin + actual._fila, [combinado])];
}

const ESTADOS_RECOMENDACION = ['suggested', 'todo', 'in_progress', 'done', 'archived'];

// POST /geo-recs-save: {id, estado, responsable?, fecha_objetivo?}
function planGuardarRecomendacion(body, filas, meta, ahora) {
  body = body || {};
  const id = String(body.id || '').trim();
  if (!id) return { ok: false, status: 400, respuesta: { ok: false, error: 'Falta el id de la recomendación.' }, peticiones: [] };
  const estado = body.estado === undefined ? undefined : String(body.estado).trim();
  if (estado !== undefined && !ESTADOS_RECOMENDACION.includes(estado)) {
    return { ok: false, status: 400, respuesta: { ok: false, error: 'Estado no válido: ' + estado }, peticiones: [] };
  }
  const previo = (filas || []).find(f => String(f.id).trim() === id);
  const registro = { id, actualizado: ahora };
  if (estado !== undefined) registro.estado = estado;
  if (body.responsable !== undefined) registro.responsable = String(body.responsable || '').trim().slice(0, 80);
  if (body.fecha_objetivo !== undefined) registro.fecha_objetivo = String(body.fecha_objetivo || '').slice(0, 10);
  // Al pasar a «hecha» se guarda la fecha, para medir el impacto después.
  if (estado === 'done' && !(previo && previo.fecha_hecha)) registro.fecha_hecha = ahora.slice(0, 10);
  if (!previo && registro.estado === undefined) registro.estado = 'suggested';
  return { ok: true, status: 200, respuesta: { ok: true, recomendacion: registro }, peticiones: planUpsertSistema('_recomendaciones', registro, 'id', filas, meta) };
}

// POST /geo-domain-save: {dominio, categoria}
function planGuardarDominio(body, filas, meta, ahora, categorias) {
  body = body || {};
  const dominio = String(body.dominio || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const categoria = String(body.categoria || '').trim();
  if (!dominio) return { ok: false, status: 400, respuesta: { ok: false, error: 'Falta el dominio.' }, peticiones: [] };
  if (!categorias.includes(categoria)) return { ok: false, status: 400, respuesta: { ok: false, error: 'Categoría no válida: ' + categoria }, peticiones: [] };
  const registro = { dominio, categoria, actualizado: ahora };
  return { ok: true, status: 200, respuesta: { ok: true, dominio: registro }, peticiones: planUpsertSistema('_dominios', registro, 'dominio', filas, meta) };
}
