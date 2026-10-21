// Ajustes editables desde Configuración del front. Se guardan en la pestaña
// «_config» del Sheet (clave · valor JSON) y se combinan con CONFIG
// (config.js), que queda como valor por defecto. Sin dependencias: build.mjs
// lo pega en «Elegir prompts», «Datos del monitor» y el guardado.

const DIAS_SEMANA = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
const AJUSTES_POR_DEFECTO = {
  monitor: { nombre: 'BCP · Monitor de Visibilidad en IA', organizacion: 'BCP · Marketing y Comunicaciones', pais: 'PE' },
  // La corrida automática: el disparador de n8n revisa cada hora si toca.
  automatizacion: { activa: true, hora: 7, dias: DIAS_SEMANA.slice() },
  // Claude busca en la web antes de responder (como las apps de los motores).
  captura: { buscar_siempre: true }
};
const PAISES_CONTEXTO = { PE: { pais: 'Perú', ciudad: 'Lima' } };

// Filas de la pestaña _config → {clave: valor}
function leerAjustes(filas) {
  const salida = {};
  for (const f of filas || []) {
    const clave = String(f.clave || '').trim();
    if (!clave) continue;
    try { salida[clave] = JSON.parse(f.valor); } catch (e) { /* valor roto: se ignora */ }
  }
  return salida;
}

const listaTexto = (v, max) => (Array.isArray(v) ? v : String(v || '').split(/[,\n]/))
  .map(x => String(x).trim()).filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).slice(0, max);
const dominioLimpio = d => String(d || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
const COLORES_EXTRA = ['#c026d3', '#f97316', '#0f766e', '#be123c', '#2563eb', '#65a30d', '#7c3aed', '#0891b2'];

// Valida y normaliza un ajuste. → {ok, valor} | {ok: false, error}
function validarAjuste(clave, valor, config) {
  if (clave === 'monitor') {
    const v = valor || {};
    const nombre = String(v.nombre || '').trim().slice(0, 80), organizacion = String(v.organizacion || '').trim().slice(0, 80);
    if (!nombre) return { ok: false, error: 'El nombre del monitor no puede estar vacío.' };
    return { ok: true, valor: { nombre, organizacion, pais: String(v.pais || 'PE').toUpperCase().slice(0, 2) } };
  }
  if (clave === 'automatizacion') {
    const v = valor || {};
    const hora = Math.round(Number(v.hora));
    if (!(hora >= 0 && hora <= 23)) return { ok: false, error: 'La hora debe estar entre 0 y 23.' };
    const dias = listaTexto(v.dias, 7).filter(d => DIAS_SEMANA.includes(d));
    if (v.activa !== false && !dias.length) return { ok: false, error: 'Elige al menos un día.' };
    return { ok: true, valor: { activa: v.activa !== false, hora, dias } };
  }
  if (clave === 'captura') {
    return { ok: true, valor: { buscar_siempre: !(valor && valor.buscar_siempre === false) } };
  }
  if (clave === 'marca') {
    const v = valor || {};
    const alias = listaTexto(v.alias, 15);
    const dominios = listaTexto(v.dominios, 10).map(dominioLimpio).filter(Boolean);
    if (!dominios.length) return { ok: false, error: 'La marca necesita al menos un dominio propio.' };
    // El nombre de la marca no se edita: es la llave de todo el historial.
    return { ok: true, valor: { alias: [config.marca.nombre].concat(alias.filter(a => a !== config.marca.nombre)), dominios } };
  }
  if (clave === 'competidores') {
    if (!Array.isArray(valor)) return { ok: false, error: 'La lista de competidores no es válida.' };
    const vistos = new Set();
    const lista = [];
    for (const c of valor.slice(0, 25)) {
      const nombre = String((c && c.nombre) || '').trim().slice(0, 60);
      if (!nombre || vistos.has(nombre.toLowerCase()) || nombre === config.marca.nombre) continue;
      vistos.add(nombre.toLowerCase());
      const previo = (config.competidores || []).find(x => x.nombre === nombre);
      lista.push({
        nombre,
        alias: [nombre].concat(listaTexto(c.alias, 10).filter(a => a !== nombre)),
        dominios: listaTexto(c.dominios, 6).map(dominioLimpio).filter(Boolean),
        color: /^#[0-9a-f]{6}$/i.test(c.color || '') ? c.color : (previo && previo.color) || COLORES_EXTRA[lista.length % COLORES_EXTRA.length]
      });
    }
    if (!lista.length) return { ok: false, error: 'Agrega al menos un competidor.' };
    return { ok: true, valor: lista };
  }
  return { ok: false, error: 'Ajuste desconocido: ' + clave };
}

// CONFIG + ajustes guardados = la configuración con la que se mide.
function configEfectiva(config, ajustes) {
  ajustes = ajustes || {};
  const c = Object.assign({}, config);
  const marca = ajustes.marca && validarAjuste('marca', ajustes.marca, config);
  if (marca && marca.ok) c.marca = Object.assign({}, config.marca, marca.valor);
  const comp = ajustes.competidores && validarAjuste('competidores', ajustes.competidores, config);
  if (comp && comp.ok) c.competidores = comp.valor;
  return c;
}

function ajustesVigentes(ajustes, config) {
  const a = ajustes || {};
  const c = configEfectiva(config, a);
  const auto = a.automatizacion && validarAjuste('automatizacion', a.automatizacion, config);
  const mon = a.monitor && validarAjuste('monitor', a.monitor, config);
  const cap = a.captura && validarAjuste('captura', a.captura, config);
  return {
    monitor: mon && mon.ok ? mon.valor : AJUSTES_POR_DEFECTO.monitor,
    automatizacion: auto && auto.ok ? auto.valor : AJUSTES_POR_DEFECTO.automatizacion,
    captura: cap && cap.ok ? cap.valor : AJUSTES_POR_DEFECTO.captura,
    marca: { nombre: c.marca.nombre, alias: c.marca.alias, dominios: c.marca.dominios },
    competidores: c.competidores.map(x => ({ nombre: x.nombre, alias: x.alias, dominios: x.dominios, color: x.color }))
  };
}

// ¿Le toca correr a la corrida programada en este momento (hora de Lima)?
function tocaCorrer(automatizacion, fecha) {
  const a = Object.assign({}, AJUSTES_POR_DEFECTO.automatizacion, automatizacion || {});
  if (a.activa === false) return false;
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Lima', hour: 'numeric', hourCycle: 'h23', weekday: 'short' }).formatToParts(fecha || new Date());
  const hora = Number((partes.find(p => p.type === 'hour') || {}).value);
  const dia = { Mon: 'lun', Tue: 'mar', Wed: 'mie', Thu: 'jue', Fri: 'vie', Sat: 'sab', Sun: 'dom' }[(partes.find(p => p.type === 'weekday') || {}).value];
  return hora === Number(a.hora) && (a.dias || []).includes(dia);
}

// Lista de bancos para el Analista: «BCP (Banco de Crédito del Perú, ViaBCP); …»
function marcasParaAnalista(config) {
  return [config.marca].concat(config.competidores || [])
    .map(m => `${m.nombre} (${(m.alias || []).filter(a => a !== m.nombre).join(', ') || 'sin alias'})`).join('; ');
}

// Línea de sistema que da a cada motor el país del usuario (las APIs no
// geolocalizan como la app: sin esto, Claude preguntó «¿en qué país estás?»).
function contextoPais(codigo) {
  const p = PAISES_CONTEXTO[String(codigo || 'PE').toUpperCase()] || PAISES_CONTEXTO.PE;
  return `El usuario está en ${p.ciudad}, ${p.pais}.`;
}

// POST /geo-config-save {clave, valor}
function planGuardarAjuste(body, filas, meta, ahora, config) {
  body = body || {};
  const clave = String(body.clave || '').trim();
  const v = validarAjuste(clave, body.valor, config);
  if (!v.ok) return { ok: false, status: 400, respuesta: { ok: false, error: v.error }, peticiones: [] };
  const registro = { clave, valor: JSON.stringify(v.valor), actualizado: ahora };
  return { ok: true, status: 200, respuesta: { ok: true, clave, valor: v.valor }, peticiones: planUpsertSistema('_config', registro, 'clave', filas, meta) };
}
