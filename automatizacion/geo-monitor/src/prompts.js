// Prompts: listar (/geo-prompts), validar lo que llega a /geo-prompts-save y
// elegir cuáles entran en una corrida. Sin dependencias, como los otros dos.

// Categoría e intención son texto libre (vienen del universo de prompts de BCP).
// Estas listas solo son sugerencias para un formulario.
const CATEGORIAS = ['Reputación', 'Producto', 'Digital', 'Otra'];
const INTENCIONES = ['Informacional', 'Comparativa', 'Transaccional', 'Reputacional', 'Navegacional'];

function activoDe(v) {
  if (typeof v === 'boolean') return v;
  const s = String(v == null ? '' : v).trim().toLowerCase();
  if (s === '') return true;
  return ['true', 'verdadero', '1', 'si', 'sí', 'x'].includes(s);
}

// Etapa del funnel según la intención de búsqueda, si la hoja no la trae.
const ETAPA_POR_INTENCION = { informacional: 'tofu', comparativa: 'mofu', reputacional: 'mofu', transaccional: 'bofu', navegacional: 'bofu' };
const ETAPAS = ['tofu', 'mofu', 'bofu'];

function listaTags(v) {
  const lista = Array.isArray(v) ? v : String(v || '').split(/[,;|]/);
  return [...new Set(lista.map(t => String(t || '').trim()).filter(Boolean))];
}

function etapaDe(v, intencion) {
  const e = String(v || '').trim().toLowerCase();
  if (ETAPAS.includes(e)) return e;
  const i = String(intencion || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  return ETAPA_POR_INTENCION[i] || 'tofu';
}

function volumenDe(v) {
  const n = Math.round(Number(v));
  return isFinite(n) && n >= 0 ? Math.min(5, n) : 0;
}

function normalizarPrompt(f) {
  return {
    id: String(f.id || '').trim(),
    proyecto: String(f.proyecto || '').trim() || 'Sin proyecto',
    prompt: String(f.prompt || '').trim(),
    categoria: String(f.categoria || '').trim() || 'Otra',
    intencion: String(f.intencion || '').trim(),
    activo: activoDe(f.activo),
    fecha_creacion: String(f.fecha_creacion || f.creado || ''),
    // Sin tags en la hoja, el proyecto hace de tag.
    tags: listaTags(f.tags).length ? listaTags(f.tags) : [String(f.proyecto || '').trim() || 'Sin proyecto'],
    etapa: etapaDe(f.etapa, f.intencion),
    volumen: volumenDe(f.volumen),
    pais: String(f.pais || '').trim().toUpperCase() || 'PE'
  };
}

function listarPrompts(filas) {
  const prompts = filas
    .filter(f => f && f.id && String(f.prompt || '').trim())
    .map(normalizarPrompt)
    .sort((a, b) => b.fecha_creacion.localeCompare(a.fecha_creacion) || b.id.localeCompare(a.id));
  const proyectos = [...new Set(prompts.map(p => p.proyecto))].sort();
  const unicos = (base, campo) => [...new Set(base.concat(prompts.map(p => p[campo]).filter(Boolean)))].sort();
  return {
    prompts, proyectos,
    categorias: unicos(CATEGORIAS, 'categoria'), intenciones: unicos(INTENCIONES, 'intencion'),
    tags: [...new Set(prompts.flatMap(p => p.tags))].sort(), etapas: ETAPAS,
    total: prompts.length, activos: prompts.filter(p => p.activo).length
  };
}

// Devuelve la fila que hay que escribir (solo con las columnas que cambian,
// para que «Agregar o actualizar» no pise fecha_creacion al editar) o un error.
// hoy: AAAA-MM-DD en Lima.
function prepararGuardado(body, hoy, idNuevo) {
  body = body || {};
  const id = String(body.id || '').trim();
  if (body.accion === 'eliminar') {
    if (!id) return { ok: false, error: 'Falta el id del prompt a eliminar.' };
    return { ok: true, accion: 'eliminar', fila: { id, activo: false } };
  }
  const prompt = String(body.prompt || '').trim();
  const fila = { id: id || idNuevo };
  if (!id || body.prompt !== undefined) {
    if (!prompt) return { ok: false, error: 'El prompt no puede estar vacío.' };
    if (prompt.length > 2000) return { ok: false, error: 'El prompt pasa de 2.000 caracteres.' };
    fila.prompt = prompt;
  }
  if (!id || body.proyecto !== undefined) fila.proyecto = String(body.proyecto || '').trim() || 'Sin proyecto';
  if (!id || body.categoria !== undefined) {
    fila.categoria = String(body.categoria || '').trim().slice(0, 80) || 'Otra';
  }
  if (body.intencion !== undefined) fila.intencion = String(body.intencion || '').trim().slice(0, 40);
  if (body.tags !== undefined) fila.tags = listaTags(body.tags).map(t => t.slice(0, 40)).slice(0, 12);
  if (body.etapa !== undefined) {
    const e = String(body.etapa || '').trim().toLowerCase();
    if (e && !ETAPAS.includes(e)) return { ok: false, error: 'La etapa debe ser tofu, mofu o bofu.' };
    fila.etapa = e;
  }
  if (body.volumen !== undefined) fila.volumen = volumenDe(body.volumen);
  if (body.pais !== undefined) fila.pais = String(body.pais || '').trim().toUpperCase().slice(0, 2) || 'PE';
  if (!id || body.activo !== undefined) fila.activo = activoDe(body.activo);
  if (!id) fila.fecha_creacion = hoy;
  return { ok: true, accion: id ? 'editar' : 'crear', fila };
}

// Qué prompts entran en la corrida: los activos, y si llegan prompt_ids o
// proyecto, solo esos. Un prompt_id pedido a mano corre aunque esté inactivo.
function elegirPrompts(filas, peticion) {
  peticion = peticion || {};
  const ids = Array.isArray(peticion.prompt_ids) ? peticion.prompt_ids.map(String) : [];
  return filas
    .filter(f => f && f.id && String(f.prompt || '').trim())
    .map(normalizarPrompt)
    .filter(p => (ids.length ? ids.includes(p.id) : p.activo))
    .filter(p => !peticion.proyecto || p.proyecto === peticion.proyecto);
}
