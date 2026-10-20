// Arma la respuesta de /geo-dashboard a partir de las filas de la hoja
// Resultados. Sin dependencias: build.mjs lo pega en el nodo Code «Dashboard».
//
// Las filas llegan de Google Sheets como texto: «TRUE», «0,25», «3». Por eso
// todo pasa por aBool y aNum antes de sumar.

function aBool(v) {
  if (typeof v === 'boolean') return v;
  return ['true', 'verdadero', '1', 'si', 'sí', 'x'].includes(String(v || '').trim().toLowerCase());
}

function aNum(v) {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v == null ? '' : v).trim().replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return isFinite(n) ? n : null;
}

function aLista(v) {
  if (Array.isArray(v)) return v;
  return String(v || '').split(/[,;|]/).map(s => s.trim()).filter(Boolean);
}

function pct(a, b) {
  return b ? Math.round((a / b) * 1000) / 10 : 0;
}

function promedio(xs) {
  const v = xs.filter(x => x !== null && x !== undefined);
  return v.length ? Math.round((v.reduce((s, x) => s + x, 0) / v.length) * 100) / 100 : null;
}

function normalizarFila(f) {
  return {
    run_id: String(f.run_id || ''),
    fecha: String(f.fecha || '').slice(0, 10),
    timestamp: String(f.timestamp || ''),
    prompt_id: String(f.prompt_id || ''),
    proyecto: String(f.proyecto || '').trim() || 'Sin proyecto',
    prompt: String(f.prompt || ''),
    motor: String(f.motor || ''),
    estado: String(f.estado || '').trim(),
    disponible: f.estado !== undefined ? String(f.estado).trim() === 'ok' : aBool(f.disponible),
    menciona: aBool(f.menciona_bcp !== undefined ? f.menciona_bcp : f.menciona),
    posicion: aNum(f.posicion_bcp !== undefined ? f.posicion_bcp : f.posicion),
    sentimiento: aNum(f.sentimiento),
    citado: aBool(f.citado_bcp !== undefined ? f.citado_bcp : f.citado),
    marcas: aLista(f.marcas_mencionadas !== undefined ? f.marcas_mencionadas : f.marcas),
    fuentes: aLista(f.fuentes),
    respuesta: String(f.respuesta || ''),
    error: String(f.error || ''),
    n_menciones_bcp: aNum(f.n_menciones_bcp),
    n_menciones_bancos: aNum(f.n_menciones_bancos),
    categoria: String(f.categoria || ''),
    detalle_marcas: String(f.detalle_marcas || ''),
    sov_bcp: aNum(f.sov_bcp)
  };
}

// Las métricas de un grupo de filas. Las filas con error no cuentan: si a un
// motor se le acabó el saldo, no es que no nos mencione.
function metricas(filas) {
  const validas = filas.filter(f => !f.error);
  const menc = validas.filter(f => f.menciona);
  return {
    total_respuestas: validas.length,
    menciones: menc.length,
    share_of_model: pct(menc.length, validas.length),
    citaciones: validas.filter(f => f.citado).length,
    tasa_citacion: pct(validas.filter(f => f.citado).length, validas.length),
    sentimiento_promedio: promedio(menc.map(f => f.sentimiento)),
    posicion_promedio: promedio(menc.map(f => f.posicion))
  };
}

// Variación en puntos porcentuales: el último día con datos contra el anterior.
function variacion(filas) {
  const fechas = [...new Set(filas.filter(f => !f.error).map(f => f.fecha))].sort();
  if (fechas.length < 2) return null;
  const ult = metricas(filas.filter(f => f.fecha === fechas[fechas.length - 1])).share_of_model;
  const ant = metricas(filas.filter(f => f.fecha === fechas[fechas.length - 2])).share_of_model;
  return Math.round((ult - ant) * 10) / 10;
}

function construirDashboard(filasCrudas, filtros, config) {
  filtros = filtros || {};
  const motores = config.motores;
  const marcaPropia = config.marca.nombre;
  const dominiosPropios = (config.marca.dominios || []).map(d => d.toLowerCase());
  const esPropio = d => dominiosPropios.some(p => d === p || d.endsWith('.' + p));

  const todas = filasCrudas
    .filter(f => f && (f.motor || f.prompt_id))
    .map(normalizarFila)
    .filter(f => motores.some(m => m.key === f.motor));

  const filas = todas.filter(f =>
    (!filtros.proyecto || f.proyecto === filtros.proyecto) &&
    (!filtros.motor || f.motor === filtros.motor) &&
    (!filtros.prompt_id || f.prompt_id === filtros.prompt_id) &&
    (!filtros.desde || f.fecha >= filtros.desde) &&
    (!filtros.hasta || f.fecha <= filtros.hasta)
  );

  const base = { motores, filtros };
  if (!filas.length) {
    return Object.assign(base, {
      vacio: !todas.length,
      kpis: Object.assign(metricas([]), {
        var_share_of_model: null, presencia_ai_overview: null,
        ultima_corrida: todas.length ? todas.map(f => f.timestamp || f.fecha).sort().pop() : null
      }),
      por_motor: [], tendencia: [], competidores: [], fuentes: [], proyectos: [], prompts: [], respuestas: []
    });
  }

  const validas = filas.filter(f => !f.error);
  const aio = validas.filter(f => f.motor === 'ai_overview');

  const kpis = Object.assign(metricas(filas), {
    var_share_of_model: variacion(filas),
    presencia_ai_overview: aio.length ? pct(aio.filter(f => f.disponible).length, aio.length) : null,
    ultima_corrida: filas.map(f => f.timestamp || f.fecha).sort().pop()
  });

  const por_motor = motores.map(m => {
    const fm = filas.filter(f => f.motor === m.key);
    const x = metricas(fm);
    return {
      motor: m.key, label: m.label,
      share_of_model: x.share_of_model, var_share_of_model: variacion(fm),
      menciones: x.menciones, total_respuestas: x.total_respuestas, citaciones: x.citaciones,
      sentimiento_promedio: x.sentimiento_promedio, posicion_promedio: x.posicion_promedio
    };
  });

  const fechas = [...new Set(validas.map(f => f.fecha))].sort();
  const tendencia = fechas.map(fecha => {
    const fd = validas.filter(f => f.fecha === fecha);
    const punto = { fecha };
    for (const m of motores) {
      const fm = fd.filter(f => f.motor === m.key);
      punto[m.key] = fm.length ? metricas(fm).share_of_model : null;
    }
    punto.total = metricas(fd).share_of_model;
    return punto;
  });

  const nombres = [marcaPropia].concat((config.competidores || []).map(c => c.nombre));
  const competidores = nombres
    .map(marca => {
      const n = validas.filter(f => f.marcas.includes(marca)).length;
      return { marca, menciones: n, share_of_model: pct(n, validas.length), es_bcp: marca === marcaPropia };
    })
    .sort((a, b) => b.menciones - a.menciones || (b.es_bcp ? 1 : 0) - (a.es_bcp ? 1 : 0))
    .map((c, i) => Object.assign({ ranking: i + 1 }, c));

  const conteo = {};
  for (const f of validas) for (const d of f.fuentes) conteo[d] = (conteo[d] || 0) + 1;
  const fuentes = Object.keys(conteo)
    .map(dominio => ({ dominio, citas: conteo[dominio], es_bcp: esPropio(dominio) }))
    .sort((a, b) => b.citas - a.citas)
    .slice(0, 30);

  const nombresProyectos = [...new Set(filas.map(f => f.proyecto))].sort();
  const proyectos = nombresProyectos.map(proyecto => {
    const fp = filas.filter(f => f.proyecto === proyecto);
    const x = metricas(fp);
    return {
      proyecto, prompts: new Set(fp.map(f => f.prompt_id)).size,
      share_of_model: x.share_of_model, var_share_of_model: variacion(fp), menciones: x.menciones
    };
  });

  // La matriz prompt × motor muestra la última respuesta válida de cada motor.
  const idsPrompts = [...new Set(filas.map(f => f.prompt_id))];
  const prompts = idsPrompts.map(id => {
    const fp = filas.filter(f => f.prompt_id === id);
    const ultima = fp.map(f => f.fecha).sort().pop();
    const mot = {};
    for (const m of motores) {
      const r = fp.filter(f => f.motor === m.key && !f.error)
        .sort((a, b) => (a.timestamp || a.fecha).localeCompare(b.timestamp || b.fecha)).pop();
      mot[m.key] = r
        ? { menciona: r.menciona, posicion: r.posicion, sentimiento: r.sentimiento, citado: r.citado, marcas: r.marcas, fecha: r.fecha, disponible: r.disponible }
        : null;
    }
    const recientes = fp.filter(f => f.fecha === ultima);
    return {
      prompt_id: id, prompt: fp[fp.length - 1].prompt, proyecto: fp[fp.length - 1].proyecto,
      share_of_model: metricas(recientes).share_of_model, ultima_fecha: ultima, motores: mot
    };
  });

  let respuestas = [];
  if (filtros.proyecto || filtros.prompt_id) {
    respuestas = filas
      .slice()
      .sort((a, b) => (b.timestamp || b.fecha).localeCompare(a.timestamp || a.fecha))
      .slice(0, 300)
      .map(f => ({
        fecha: f.fecha, timestamp: f.timestamp, motor: f.motor, prompt_id: f.prompt_id, prompt: f.prompt,
        menciona: f.menciona, posicion: f.posicion, sentimiento: f.sentimiento, citado: f.citado,
        disponible: f.disponible, marcas: f.marcas, fuentes: f.fuentes, respuesta: f.respuesta, error: f.error
      }));
  }

  return Object.assign(base, { vacio: false, kpis, por_motor, tendencia, competidores, fuentes, proyectos, prompts, respuestas });
}
