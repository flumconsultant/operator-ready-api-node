// Arma la respuesta de /geo-monitor-data: las hojas resultados y prompts con la
// forma de DATA.monitor y DATA.prompts del front «BCP · Monitor de Visibilidad
// en IA». El front calcula sus KPIs en el navegador a partir de estas
// observaciones. Sin dependencias: build.mjs lo pega en el nodo «Datos del
// monitor» junto con config.js, sov.js, dashboard.js (normalizarFila) y prompts.js.

// Nuestra clave de motor → la del front.
const MODELO_FRONT = { chatgpt: 'chatgpt', claude: 'claude', gemini: 'gemini', perplexity: 'perplexity', ai_overview: 'overview' };

function slug(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sin-proyecto';
}

function etiquetaSentimiento(v) {
  if (v === null) return null;
  return v > 0.2 ? 'positivo' : v < -0.2 ? 'negativo' : 'neutral';
}

// Una fila de resultados → una observación del front.
function observacion(f, config, meta) {
  const propios = (config.marca.dominios || []).map(d => d.toLowerCase());
  const esPropio = d => propios.some(p => d === p || d.endsWith('.' + p));
  const modelId = MODELO_FRONT[f.motor];
  const projectId = slug(f.proyecto);
  const error = f.estado === 'error' || (!f.estado && Boolean(f.error));
  const menciona = !error && f.menciona;
  const marcas = f.marcas;
  const propia = config.marca.nombre;
  // Share of Voice (sov.js). Las filas sin desglose por banco (anteriores al
  // 21/10) se aproximan con el orden de marcas_mencionadas.
  let detalle = leerDetalle(f.detalle_marcas);
  if (!detalle.length && !error) detalle = detalleDesdeRanking(marcas, propia, f.sentimiento, f.n_menciones_bcp);
  const sovByBrand = error ? {} : sovPorMarca(detalle);
  const sov = error ? null : menciona ? (f.sov_bcp !== null && f.detalle_marcas ? f.sov_bcp : (sovByBrand[propia] || 0)) : 0;
  // Proporción de menciones (la métrica anterior), por si se quiere comparar.
  const mentionShare = menciona && f.n_menciones_bancos > 0 && f.n_menciones_bcp > 0
    ? Math.round(Math.min(100, (f.n_menciones_bcp / f.n_menciones_bancos) * 100) * 10) / 10
    : menciona ? Math.round((100 / Math.max(1, marcas.length)) * 10) / 10 : 0;
  const idxPropio = f.fuentes.findIndex(esPropio);
  const sentimiento = menciona && f.sentimiento !== null ? f.sentimiento : null;
  return {
    id: [projectId, modelId, f.prompt_id, f.fecha].join(':'),
    projectId,
    modelId,
    promptId: f.prompt_id,
    date: f.fecha,
    timestamp: f.timestamp,
    status: error ? 'error' : menciona ? 'ok' : 'not_mentioned',
    // El front promedia `som` en su KPI principal: lleva el Share of Voice.
    som: sov,
    sov,
    sovByBrand,
    brandDetail: detalle,
    mentionShare: error ? null : mentionShare,
    category: (meta && meta.categoria) || f.categoria || '',
    intent: (meta && meta.intencion) || '',
    position: menciona ? f.posicion : null,
    linkPosition: idxPropio >= 0 ? idxPropio + 1 : null,
    mentions: menciona ? (f.n_menciones_bcp || 1) : 0,
    citations: f.fuentes.filter(esPropio).length,
    sentiment: sentimiento,
    sentimentLabel: etiquetaSentimiento(sentimiento),
    blockAppeared: modelId === 'overview' ? (!error && f.estado !== 'sin_overview') : null,
    brandMentioned: menciona,
    brandCited: !error && f.citado,
    sources: f.fuentes.map(d => ({ domain: d, url: 'https://' + d + '/' })),
    ranking: marcas,
    response: f.respuesta.length > MAX_RESPUESTA ? f.respuesta.slice(0, MAX_RESPUESTA) + '…' : f.respuesta,
    error: f.error,
    isExample: false,
    source: 'n8n · GEO Tracker'
  };
}

// El front muestra como mucho 6 meses; más atrás no se manda.
const DIAS_HISTORIA = 190;
// La respuesta completa queda en el Sheet; al front le basta con esto.
const MAX_RESPUESTA = 4000;

function construirMonitor(filasResultados, filasPrompts, config, hoy) {
  const desde = new Date(new Date(hoy + 'T12:00:00Z').getTime() - DIAS_HISTORIA * 864e5).toISOString().slice(0, 10);
  const metaPrompts = new Map(filasPrompts.filter(f => f && f.id).map(f => [String(f.id).trim(), normalizarPrompt(f)]));
  // Varias corridas el mismo día: se queda la última de cada prompt y motor.
  const porId = new Map();
  for (const crudo of filasResultados) {
    if (!crudo || !crudo.motor) continue;
    const f = normalizarFila(crudo);
    if (!MODELO_FRONT[f.motor] || !f.prompt_id || !f.fecha || f.fecha < desde) continue;
    const o = observacion(f, config, metaPrompts.get(f.prompt_id));
    const previa = porId.get(o.id);
    if (!previa || String(previa.timestamp) < String(o.timestamp)) porId.set(o.id, o);
  }
  const observations = [...porId.values()].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const prompts = filasPrompts.filter(f => f && f.id && String(f.prompt || '').trim()).map(normalizarPrompt);
  // Los proyectos salen de la hoja prompts (activos o con observaciones).
  const conDatos = new Set(observations.map(o => o.promptId));
  const proyectos = new Map();
  for (const p of prompts) {
    if (!p.activo && !conDatos.has(p.id)) continue;
    const id = slug(p.proyecto);
    if (!proyectos.has(id)) proyectos.set(id, { id, name: p.proyecto, promptIds: [], categorias: new Set() });
    const pr = proyectos.get(id);
    pr.promptIds.push(p.id);
    pr.categorias.add(p.categoria);
  }
  // Lo que ya tiene observaciones tiene que existir aunque la hoja prompts haya
  // cambiado (prompt borrado o movido de proyecto): el front busca ambos por id.
  const promptsVistos = new Set(prompts.map(p => p.id));
  const extra = [];
  for (const crudo of filasResultados) {
    if (!crudo || !crudo.motor || !crudo.prompt_id) continue;
    const f = normalizarFila(crudo);
    const id = slug(f.proyecto);
    if (!proyectos.has(id)) proyectos.set(id, { id, name: f.proyecto, promptIds: [], categorias: new Set() });
    const pr = proyectos.get(id);
    if (!pr.promptIds.includes(f.prompt_id)) pr.promptIds.push(f.prompt_id);
    if (crudo.categoria) pr.categorias.add(String(crudo.categoria));
    if (!promptsVistos.has(f.prompt_id)) {
      promptsVistos.add(f.prompt_id);
      extra.push({ id: f.prompt_id, proyecto: f.proyecto, prompt: f.prompt, categoria: String(crudo.categoria || 'Otra'), activo: false });
    }
  }
  prompts.push(...extra);

  const projects = [...proyectos.values()].map(p => ({
    id: p.id,
    name: p.name,
    description: `${p.promptIds.length} prompt${p.promptIds.length === 1 ? '' : 's'} · ${p.categorias.size} categoría${p.categorias.size === 1 ? '' : 's'}`,
    promptIds: p.promptIds,
    example: false
  }));

  const conteo = new Map();
  for (const o of observations) for (const s of o.sources) conteo.set(s.domain, (conteo.get(s.domain) || 0) + 1);
  const domains = [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([d]) => [d, 'https://' + d + '/']);

  return {
    ok: true,
    generado: new Date().toISOString(),
    monitor: {
      projects,
      observations,
      referenceDate: hoy,
      dates: [...new Set(observations.map(o => o.date))].sort(),
      domains
    },
    prompts: prompts.map(p => ({
      id: p.id, text: p.prompt, project: slug(p.proyecto), category: p.categoria, intent: p.intencion, active: p.activo,
      status: 'ok', position: null, linkPosition: null, sov: null, ranking: [],
      response: { isExample: false, screenshotUrl: null, text: '' }
    }))
  };
}
