// Prompts: listar (/geo-prompts), validar lo que llega a /geo-prompts-save y
// elegir cuáles entran en una corrida. Sin dependencias, como los otros dos.

const CATEGORIAS = ['Reputación', 'Producto', 'Digital', 'Otra'];

function activoDe(v) {
  if (typeof v === 'boolean') return v;
  const s = String(v == null ? '' : v).trim().toLowerCase();
  if (s === '') return true;
  return ['true', 'verdadero', '1', 'si', 'sí', 'x'].includes(s);
}

function normalizarPrompt(f) {
  return {
    id: String(f.id || '').trim(),
    proyecto: String(f.proyecto || '').trim() || 'Sin proyecto',
    prompt: String(f.prompt || '').trim(),
    categoria: String(f.categoria || '').trim() || 'Otra',
    activo: activoDe(f.activo),
    fecha_creacion: String(f.fecha_creacion || f.creado || '')
  };
}

function listarPrompts(filas) {
  const prompts = filas
    .filter(f => f && f.id && String(f.prompt || '').trim())
    .map(normalizarPrompt)
    .sort((a, b) => b.fecha_creacion.localeCompare(a.fecha_creacion) || b.id.localeCompare(a.id));
  const proyectos = [...new Set(prompts.map(p => p.proyecto))].sort();
  return { prompts, proyectos, categorias: CATEGORIAS, total: prompts.length, activos: prompts.filter(p => p.activo).length };
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
    const c = String(body.categoria || '').trim() || 'Otra';
    fila.categoria = CATEGORIAS.includes(c) ? c : 'Otra';
  }
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
