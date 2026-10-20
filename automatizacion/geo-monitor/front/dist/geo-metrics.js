/* GEO Tracker BCP v2 · Métricas (SPEC v2 §4). Funciones puras, sin DOM: las usa
   geo-v2.js en el navegador y test-metrics.js en Node.
   Unidad base: una observación = un prompt × motor × fecha. Las respuestas con
   error o sin ejecutar NO entran en ningún denominador. */
(function (raiz) {
  'use strict';

  const MARCAS_BASE = [
    { id: 'bcp', name: 'BCP', isOwn: true, color: '#1a1a4e', domains: ['viabcp.com', 'bcp.com.pe'], aliases: ['BCP', 'Banco de Crédito del Perú', 'Banco de Crédito', 'ViaBCP'] },
    { id: 'bbva', name: 'BBVA', isOwn: false, color: '#f59e0b', domains: ['bbva.pe', 'bbva.com'], aliases: ['BBVA', 'BBVA Perú', 'BBVA Continental', 'Banco Continental'] },
    { id: 'interbank', name: 'Interbank', isOwn: false, color: '#8b5cf6', domains: ['interbank.pe'], aliases: ['Interbank'] },
    { id: 'scotiabank', name: 'Scotiabank', isOwn: false, color: '#10b981', domains: ['scotiabank.com.pe'], aliases: ['Scotiabank', 'Scotia'] },
    { id: 'falabella', name: 'Falabella', isOwn: false, color: '#84cc16', domains: ['bancofalabella.pe'], aliases: ['Falabella', 'Banco Falabella'] },
    { id: 'mibanco', name: 'Mibanco', isOwn: false, color: '#22c55e', domains: ['mibanco.com.pe'], aliases: ['Mibanco', 'Mi Banco'] },
    { id: 'banbif', name: 'BanBif', isOwn: false, color: '#0ea5e9', domains: ['banbif.com.pe'], aliases: ['BanBif', 'Banbif'] },
    { id: 'pichincha', name: 'Pichincha', isOwn: false, color: '#eab308', domains: ['pichincha.pe'], aliases: ['Pichincha', 'Banco Pichincha'] },
    { id: 'banco-de-la-nacion', name: 'Banco de la Nación', isOwn: false, color: '#64748b', domains: ['bn.com.pe'], aliases: ['Banco de la Nación', 'Banco de la Nacion'] },
    { id: 'ripley', name: 'Ripley', isOwn: false, color: '#a855f7', domains: ['bancoripley.com.pe'], aliases: ['Ripley', 'Banco Ripley'] },
    { id: 'comercio', name: 'Comercio', isOwn: false, color: '#94a3b8', domains: ['bancomercio.com'], aliases: ['Banco de Comercio', 'Comercio'] }
  ];

  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const finito = v => typeof v === 'number' && Number.isFinite(v);
  const promedio = xs => { const v = xs.filter(finito); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const pct = (a, b) => (b > 0 ? (a / b) * 100 : null);
  const redondear = (v, d = 1) => (finito(v) ? Math.round(v * 10 ** d) / 10 ** d : null);

  // ─── Respuestas válidas y marcas ──────────────────────────────────────────
  const esValida = o => !!o && o.status !== 'error' && o.status !== 'not_run';
  const validas = rows => (rows || []).filter(esValida);

  // Nombre que dio la IA → id de marca seguida (o null).
  function marcaDe(nombre, marcas) {
    const n = norm(nombre);
    if (!n) return null;
    for (const m of marcas) if ([m.name].concat(m.aliases || []).some(a => norm(a) === n)) return m.id;
    for (const m of marcas) if ([m.name].concat(m.aliases || []).some(a => norm(a).length > 3 && (n.startsWith(norm(a) + ' ') || n.endsWith(' ' + norm(a))))) return m.id;
    return null;
  }

  // Menciones de una respuesta: [{brandId, rank, count, sentiment (−100…100 | null), recommended, attributes}]
  // Usa brandDetail del Analista; si no lo hay (filas antiguas o demo) se
  // aproxima con el orden de `ranking`, y la marca propia con sus campos.
  function menciones(o, marcas) {
    if (!esValida(o)) return [];
    const propia = marcas.find(m => m.isOwn) || marcas[0];
    const por = new Map();
    const detalle = Array.isArray(o.brandDetail) ? o.brandDetail : [];
    if (detalle.length) {
      for (const d of detalle) {
        const id = marcaDe(d.marca || d.brand, marcas);
        if (!id || por.has(id)) continue;
        const s = Number(d.sentimiento ?? d.sentiment);
        por.set(id, { brandId: id, rank: Number(d.posicion ?? d.position) || por.size + 1, count: Math.max(1, Number(d.menciones ?? d.mentions) || 1),
          sentiment: Number.isFinite(s) ? Math.max(-100, Math.min(100, Math.abs(s) <= 1 ? s * 100 : s)) : null,
          recommended: d.recomendada === true || d.recommended === true, hasRecommendation: 'recomendada' in d || 'recommended' in d,
          attributes: Array.isArray(d.atributos) ? d.atributos : Array.isArray(d.attributes) ? d.attributes : [] });
      }
    } else {
      (o.ranking || []).forEach(nombre => {
        const id = marcaDe(nombre, marcas);
        if (id && !por.has(id)) por.set(id, { brandId: id, rank: por.size + 1, count: 1, sentiment: null, recommended: false, hasRecommendation: false, attributes: [] });
      });
    }
    // La marca propia: lo que diga la fila manda (mencionada, posición, sentimiento).
    if (o.brandMentioned && !por.has(propia.id)) por.set(propia.id, { brandId: propia.id, rank: o.position || por.size + 1, count: 1, sentiment: null, recommended: false, hasRecommendation: false, attributes: [] });
    if (por.has(propia.id)) {
      const p = por.get(propia.id);
      if (!o.brandMentioned && o.status === 'not_mentioned') por.delete(propia.id);
      else {
        if (finito(o.position) && o.position > 0) p.rank = o.position;
        if (finito(o.mentions) && o.mentions > 0) p.count = Math.max(p.count, o.mentions);
        if (p.sentiment === null && finito(o.sentiment)) p.sentiment = Math.max(-100, Math.min(100, Math.abs(o.sentiment) <= 1 ? o.sentiment * 100 : o.sentiment));
      }
    }
    return [...por.values()];
  }

  // ─── Métricas por marca (§4) ──────────────────────────────────────────────
  function metricasMarca(rows, brandId, marcas) {
    const ok = validas(rows);
    let aparece = 0, conteo = 0, recomendada = 0, conDato = 0;
    const rangos = [], sentimientos = [];
    for (const o of ok) {
      const m = menciones(o, marcas).find(x => x.brandId === brandId);
      if (!m) continue;
      aparece++; conteo += m.count;
      if (finito(m.rank) && m.rank > 0) rangos.push(m.rank);
      if (finito(m.sentiment)) sentimientos.push(m.sentiment);
      if (m.hasRecommendation) { conDato++; if (m.recommended) recomendada++; }
    }
    return {
      valid: ok.length,
      coverage: pct(aparece, ok.length),          // cobertura de marca
      position: promedio(rangos),                 // solo donde aparece; menor es mejor
      sentiment: promedio(sentimientos),          // −100…+100, solo donde aparece
      responsesMentioning: aparece,               // menciones de marca
      totalMentions: conteo,                      // menciones totales
      purchaseProbability: conDato ? pct(recomendada, conDato) : null
    };
  }

  // Share of Voice de menciones: menciones de la marca ÷ menciones de todas las
  // marcas seguidas × 100. Entre todas suman 100.
  function sovMenciones(rows, marcas) {
    const total = {};
    for (const m of marcas) total[m.id] = 0;
    for (const o of validas(rows)) for (const x of menciones(o, marcas)) total[x.brandId] += x.count;
    const suma = Object.values(total).reduce((a, b) => a + b, 0);
    const sov = {};
    for (const id of Object.keys(total)) sov[id] = suma > 0 ? (total[id] / suma) * 100 : null;
    return sov;
  }

  // SOV ponderado (legado): promedio del SoV calculado por n8n por respuesta válida.
  const sovPonderado = rows => promedio(validas(rows).map(o => (finito(o.sov) ? o.sov : finito(o.som) ? o.som : null)));

  const delta = (actual, anterior) => (finito(actual) && finito(anterior) ? actual - anterior : null);

  // Ranking de marcas con deltas vs periodo anterior.
  function ranking(rows, previas, marcas) {
    const sov = sovMenciones(rows, marcas), sovP = sovMenciones(previas || [], marcas);
    return marcas.map(m => {
      const a = metricasMarca(rows, m.id, marcas), b = metricasMarca(previas || [], m.id, marcas);
      return {
        brand: m, coverage: a.coverage, position: a.position, sentiment: a.sentiment, sov: sov[m.id],
        purchaseProbability: a.purchaseProbability, responsesMentioning: a.responsesMentioning, totalMentions: a.totalMentions,
        delta: { coverage: delta(a.coverage, b.coverage), position: delta(a.position, b.position), sentiment: delta(a.sentiment, b.sentiment), sov: delta(sov[m.id], sovP[m.id]), purchaseProbability: delta(a.purchaseProbability, b.purchaseProbability) }
      };
    }).sort((x, y) => (y.coverage ?? -1) - (x.coverage ?? -1) || (x.position ?? 99) - (y.position ?? 99));
  }

  // ─── Periodos ─────────────────────────────────────────────────────────────
  const PRESETS = { last7: 7, last14: 14, last30: 30, last90: 90, last180: 180 };
  const sumarDias = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const diasEntre = (a, b) => Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5);
  // {start, end} inclusivos, y el periodo anterior de igual longitud.
  function periodo(preset, referencia, start, end) {
    let s, e;
    if (preset === 'custom' && /^\d{4}-\d{2}-\d{2}$/.test(start || '') && /^\d{4}-\d{2}-\d{2}$/.test(end || '') && start <= end) { s = start; e = end; }
    else { const n = PRESETS[preset] || 14; e = referencia; s = sumarDias(referencia, -(n - 1)); }
    const largo = diasEntre(s, e) + 1;
    return { start: s, end: e, days: largo, previous: { start: sumarDias(s, -largo), end: sumarDias(s, -1) } };
  }
  const enPeriodo = (o, p) => o.date >= p.start && o.date <= p.end;

  // Lunes de la semana ISO de una fecha.
  const semana = iso => { const d = new Date(iso + 'T12:00:00Z'); const dia = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - dia); return d.toISOString().slice(0, 10); };

  // Serie temporal de una métrica por marca. metric: coverage|position|sentiment|sov.
  function serie(rows, marcas, metric, granularidad) {
    const grupos = new Map();
    for (const o of rows || []) {
      const k = granularidad === 'week' ? semana(o.date) : o.date;
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k).push(o);
    }
    const fechas = [...grupos.keys()].sort();
    return {
      dates: fechas,
      series: marcas.map(m => ({
        brand: m,
        values: fechas.map(f => {
          const g = grupos.get(f);
          if (!validas(g).length) return null;
          if (metric === 'sov') return sovMenciones(g, marcas)[m.id];
          return metricasMarca(g, m.id, marcas)[metric];
        })
      }))
    };
  }

  // ─── Citas y dominios (V3) ────────────────────────────────────────────────
  const dominioDe = u => { const m = String(u || '').toLowerCase().match(/^(?:[a-z]+:\/\/)?(?:www\.)?([^/?#:]+)/); return m ? m[1] : ''; };
  const esDe = (d, lista) => (lista || []).some(x => d === x || d.endsWith('.' + x));
  const limpiarUrl = u => String(u || '').replace(/#.*$/, '').replace(/[?&]utm_[^&]+/g, '').replace(/\/$/, '');

  // Una fila por URL: veces citada, respuestas, dominio, ¿menciona a la marca?
  // (en las respuestas que la citan), competidores presentes en esas respuestas.
  function urls(rows, marcas, categorias) {
    const propia = marcas.find(m => m.isOwn) || marcas[0];
    const mapa = new Map();
    for (const o of validas(rows)) {
      const presentes = menciones(o, marcas).map(x => x.brandId);
      for (const s of o.sources || []) {
        const url = limpiarUrl(s.url || ('https://' + s.domain));
        const dominio = s.domain || dominioDe(url);
        if (!mapa.has(url)) mapa.set(url, { url, title: s.title || '', domain: dominio, citations: 0, responses: new Set(), withBrand: 0, prompts: new Set(), competitors: new Set() });
        const r = mapa.get(url);
        r.citations++; r.responses.add(o.id); r.prompts.add(o.promptId);
        if (!r.title && s.title) r.title = s.title;
        if (presentes.includes(propia.id)) r.withBrand++;
        presentes.filter(id => id !== propia.id).forEach(id => r.competitors.add(id));
      }
    }
    return [...mapa.values()].map(r => {
      const own = esDe(r.domain, propia.domains);
      return {
        url: r.url, title: r.title, domain: r.domain, citations: r.citations, responses: r.responses.size, prompts: [...r.prompts],
        category: (categorias && categorias[r.domain]) || categoriaPorReglas(r.domain, marcas),
        mentionsOwnBrand: own ? 'na' : r.withBrand > 0 ? 'yes' : 'no',
        competitorsMentioned: [...r.competitors]
      };
    }).sort((a, b) => b.citations - a.citations);
  }

  function categoriaPorReglas(d, marcas) {
    if (esDe(d, (marcas.find(m => m.isOwn) || {}).domains)) return 'brand';
    if (marcas.some(m => !m.isOwn && esDe(d, m.domains))) return 'competitor';
    if (/(^|\.)(gob|gov)(\.|$)/.test(d)) return 'government_ngo';
    if (/wikipedia/.test(d)) return 'encyclopedia';
    if (/youtube|tiktok/.test(d)) return 'video';
    if (/facebook|instagram|linkedin|twitter|(^|\.)x\.com$/.test(d)) return 'social';
    if (/reddit|quora|rankia|foro/.test(d)) return 'community_forum';
    if (/compara|ranking|mejores|finguia/.test(d)) return 'comparator';
    return 'unclassified';
  }

  // Estado de una URL vs el periodo anterior.
  function estadoCita(actual, anterior) {
    if (actual > 0 && !anterior) return 'new';
    if (!actual && anterior > 0) return 'lost';
    if (actual > anterior) return 'increased';
    if (actual < anterior) return 'decreased';
    return 'stable';
  }
  function cambiosCitas(rows, previas, marcas, categorias) {
    const ahora = urls(rows, marcas, categorias), antes = new Map(urls(previas || [], marcas, categorias).map(u => [u.url, u]));
    const lista = ahora.map(u => Object.assign({}, u, { previous: antes.has(u.url) ? antes.get(u.url).citations : 0 }));
    for (const [url, u] of antes) if (!ahora.some(x => x.url === url)) lista.push(Object.assign({}, u, { citations: 0, previous: u.citations }));
    return lista.map(u => Object.assign(u, { status: estadoCita(u.citations, u.previous), change: u.citations - u.previous }));
  }

  // % de citas por categoría de dominio.
  function mixCategorias(rows, marcas, categorias) {
    const conteo = {};
    let total = 0;
    for (const u of urls(rows, marcas, categorias)) { conteo[u.category] = (conteo[u.category] || 0) + u.citations; total += u.citations; }
    return Object.entries(conteo).map(([category, citations]) => ({ category, citations, share: pct(citations, total) })).sort((a, b) => b.citations - a.citations);
  }

  // Cobertura de dominio: respuestas válidas que citan el dominio ÷ respuestas válidas.
  function coberturaDominio(rows, dominio) {
    const ok = validas(rows);
    return pct(ok.filter(o => (o.sources || []).some(s => { const d = s.domain || dominioDe(s.url); return d === dominio || d.endsWith('.' + dominio); })).length, ok.length);
  }
  function dominios(rows, marcas, categorias) {
    const vistos = new Map();
    for (const u of urls(rows, marcas, categorias)) {
      const v = vistos.get(u.domain) || { domain: u.domain, category: u.category, citations: 0, urls: 0 };
      v.citations += u.citations; v.urls++; vistos.set(u.domain, v);
    }
    return [...vistos.values()].map(d => Object.assign(d, { coverage: coberturaDominio(rows, d.domain) })).sort((a, b) => (b.coverage || 0) - (a.coverage || 0) || b.citations - a.citations);
  }

  // Citas a dominios propios y totales.
  function citasMarca(rows, marcas) {
    const propia = marcas.find(m => m.isOwn) || marcas[0];
    let propias = 0, total = 0;
    for (const o of validas(rows)) for (const s of o.sources || []) { total++; if (esDe(s.domain || dominioDe(s.url), propia.domains)) propias++; }
    return { own: propias, total };
  }

  // ─── Índice de visibilidad (V4) ───────────────────────────────────────────
  const CUADRANTES = { leaders: 'Líderes', niche: 'Nicho', low_conversion: 'Baja conversión', underperformers: 'Bajo desempeño' };
  function cuadrante(cobertura, probabilidad, umbrales) {
    const u = Object.assign({ coverage: 30, probability: 50 }, umbrales || {});
    if (!finito(cobertura) || !finito(probabilidad)) return null;
    const c = cobertura >= u.coverage, p = probabilidad >= u.probability;
    return c && p ? 'leaders' : !c && p ? 'niche' : c && !p ? 'low_conversion' : 'underperformers';
  }

  // ─── Por prompt ───────────────────────────────────────────────────────────
  function porPrompt(rows, previas, marcas) {
    const propia = marcas.find(m => m.isOwn) || marcas[0];
    const grupos = new Map();
    for (const o of rows || []) { if (!grupos.has(o.promptId)) grupos.set(o.promptId, []); grupos.get(o.promptId).push(o); }
    const antes = new Map();
    for (const o of previas || []) { if (!antes.has(o.promptId)) antes.set(o.promptId, []); antes.get(o.promptId).push(o); }
    return [...grupos.entries()].map(([promptId, g]) => {
      const a = metricasMarca(g, propia.id, marcas), b = antes.has(promptId) ? metricasMarca(antes.get(promptId), propia.id, marcas) : null;
      const comp = new Set();
      for (const o of validas(g)) for (const x of menciones(o, marcas)) if (x.brandId !== propia.id) comp.add(x.brandId);
      const c = citasMarca(g, marcas);
      return {
        promptId, responses: g.length, valid: a.valid, errors: g.filter(o => !esValida(o)).length,
        coverage: a.coverage, position: a.position, sentiment: a.sentiment, responsesMentioning: a.responsesMentioning, totalMentions: a.totalMentions,
        ownCitations: c.own, totalCitations: c.total, competitors: [...comp], sovWeighted: sovPonderado(g),
        coverageDelta: b ? delta(a.coverage, b.coverage) : null
      };
    });
  }

  // ─── Recomendaciones por reglas (V5.6) ────────────────────────────────────
  // ctx: {rows, prompts, marcas, categorias, audits, estados}
  function recomendaciones(ctx) {
    const marcas = ctx.marcas, propia = marcas.find(m => m.isOwn) || marcas[0];
    const prompts = new Map((ctx.prompts || []).map(p => [p.id, p]));
    const filas = porPrompt(ctx.rows, [], marcas);
    const lista = [];
    const impactoDe = v => (v >= 2.5 ? 'high' : v >= 1 ? 'medium' : 'low');
    const lider = f => {
      let mejor = 0;
      for (const m of marcas) if (!m.isOwn) mejor = Math.max(mejor, metricasMarca((ctx.rows || []).filter(o => o.promptId === f.promptId), m.id, marcas).coverage || 0);
      return mejor;
    };
    // new_page: competidores con cobertura y 0 citas a dominio propio.
    for (const f of filas) {
      if (!f.valid || f.ownCitations > 0 || !f.competitors.length) continue;
      const p = prompts.get(f.promptId) || { text: f.promptId, intentVolume: 0 };
      const brecha = Math.max(0, lider(f) - (f.coverage || 0)) / 100;
      const volumen = Math.max(1, Number(p.intentVolume) || 1);
      const refs = urls((ctx.rows || []).filter(o => o.promptId === f.promptId), marcas, ctx.categorias)
        .filter(u => u.category === 'competitor' || u.category === 'comparator').slice(0, 3).map(u => u.url);
      const score = volumen * Math.max(brecha, 0.1);
      lista.push({
        id: 'new_page:' + f.promptId, type: 'new_page', category: 'content', scope: 'on_page', impact: impactoDe(score), score,
        title: 'Publicar página: ' + titular(p.text), engine: null,
        reasoning: `En «${p.text}» los motores citan ${f.totalCitations} fuente(s) y ninguna es de ${propia.name}. Competidores presentes: ${f.competitors.map(id => (marcas.find(m => m.id === id) || {}).name).join(', ')}. Cobertura de ${propia.name}: ${redondear(f.coverage, 0) ?? 0}% vs líder ${redondear(lider(f), 0)}%.`,
        suggestions: ['Crear una página que responda directo a la pregunta, con H1 igual al titular sugerido.', 'Incluir tabla comparativa, requisitos y tasas vigentes con fecha.', 'Añadir FAQ con datos estructurados FAQPage.', 'Enlazarla desde la página del producto y pedir su indexación.'],
        evidence: { promptId: f.promptId, suggestedHeadline: titular(p.text), competitorUrls: refs }
      });
    }
    // prompt_mix: más de 25% TOFU.
    const activos = (ctx.prompts || []).filter(p => p.active !== false);
    if (activos.length) {
      const tofu = activos.filter(p => p.funnelStage === 'tofu').length / activos.length * 100;
      if (tofu > 25) lista.push({ id: 'prompt_mix:tofu', type: 'prompt_mix', category: 'prompts', scope: 'general', impact: tofu > 50 ? 'high' : 'medium', score: tofu / 25,
        title: `Rebalancear el mix: ${Math.round(tofu)}% de prompts son TOFU`, engine: null,
        reasoning: `${activos.filter(p => p.funnelStage === 'tofu').length} de ${activos.length} prompts activos son de descubrimiento (TOFU). Con más de 25% el KPI sobrerrepresenta preguntas genéricas y subrepresenta la decisión de compra.`,
        suggestions: ['Agregar prompts MOFU (comparación) y BOFU (requisitos, solicitar).', 'Usar Investigación de prompts para generar candidatos por etapa.'], evidence: {} });
      // branded_prompts: prompts que nombran a la marca.
      const branded = activos.filter(p => p.isBranded);
      if (branded.length) lista.push({ id: 'branded_prompts', type: 'branded_prompts', category: 'prompts', scope: 'general', impact: 'medium', score: branded.length,
        title: `Hay ${branded.length} prompt(s) branded; retirarlos del KPI principal`, engine: null,
        reasoning: `Estos prompts nombran a ${propia.name} y sesgan la cobertura hacia arriba: ${branded.slice(0, 5).map(p => '«' + p.text + '»').join(', ')}${branded.length > 5 ? '…' : ''}.`,
        suggestions: ['Etiquetarlos con el tag «branded».', 'Excluir ese tag del Resumen con el filtro de tags.'], evidence: { promptId: branded[0].id } });
    }
    // offpage: URLs de terceros muy citadas donde la marca no aparece.
    for (const u of urls(ctx.rows, marcas, ctx.categorias).filter(u => u.mentionsOwnBrand === 'no' && u.category !== 'competitor' && u.citations >= 2).slice(0, 8)) {
      lista.push({ id: 'offpage:' + u.url, type: 'authority', category: 'offpage', scope: 'off_page', impact: u.citations >= 5 ? 'high' : 'medium', score: u.citations / 2,
        title: `Lograr presencia en ${u.domain}`, engine: null,
        reasoning: `${u.url} fue citada ${u.citations} veces en respuestas donde ${propia.name} no aparece${u.competitorsMentioned.length ? '; sí aparecen ' + u.competitorsMentioned.map(id => (marcas.find(m => m.id === id) || {}).name).join(', ') : ''}.`,
        suggestions: ['Contactar al medio/comparador para actualizar la ficha o el ranking.', 'Proveer datos oficiales (tasas, requisitos) con fuente.'], evidence: { competitorUrls: [u.url], promptId: u.prompts[0] } });
    }
    // technical: hallazgos de la auditoría de crawlability más reciente por URL.
    const vistos = new Set();
    for (const a of ctx.audits || []) {
      if (a.type !== 'crawl' || !a.result || vistos.has(a.url)) continue;
      vistos.add(a.url);
      const r = a.result.resumen || {};
      const fuera = (a.result.bots || []).filter(b => b.serverAccess !== 'ok').length;
      if (fuera >= 5 || a.result.critico || r.robotsTxt === 'na') lista.push({ id: 'technical:crawl:' + dominioDe(a.url), type: 'technical', category: 'technical', scope: 'on_page', impact: fuera >= 15 || a.result.critico ? 'high' : 'medium', score: fuera,
        title: `${fuera} de ${(a.result.bots || []).length} bots de IA no pueden leer ${dominioDe(a.url)}`, engine: null,
        reasoning: `Auditoría del ${a.executedAt}: ${r.blocked || 0} bloqueados, ${r.unreachable || 0} inalcanzables, robots.txt ${r.robotsTxt === 'found' ? 'publicado' : 'no encontrado'}. Sin acceso, los motores no pueden citar páginas propias.`,
        suggestions: ['Revisar el WAF/CDN y crear una allowlist de bots verificados (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended).', 'Publicar robots.txt y llms.txt.', 'Volver a auditar desde Auditoría GEO.'], evidence: { ownUrl: a.url } });
    }
    const estados = ctx.estados || {};
    const orden = { high: 0, medium: 1, low: 2 };
    return lista.map(r => Object.assign(r, { status: (estados[r.id] || {}).status || 'suggested', owner: (estados[r.id] || {}).owner || '', dueDate: (estados[r.id] || {}).dueDate || '', doneAt: (estados[r.id] || {}).doneAt || '' }))
      .sort((a, b) => orden[a.impact] - orden[b.impact] || b.score - a.score);
  }
  // «¿cuáles son los plazos fijos más rentables?» → «Plazos fijos más rentables»
  function titular(texto) {
    let t = String(texto || '').replace(/[¿?¡!]/g, '').trim();
    t = t.replace(/^(cu[aá]l(es)? (es|son)|qu[eé]|c[oó]mo|d[oó]nde|me recomiendas?|recomi[eé]ndame)\s+/i, '');
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Nueva página';
  }

  // ─── Salud de datos (V11) ─────────────────────────────────────────────────
  // Última corrida por motor y nivel: ok ≤8 días · amber >8 · red >14.
  function salud(observaciones, hoy, motores) {
    const porMotor = (motores || []).map(m => {
      const propias = (observaciones || []).filter(o => o.modelId === m.id);
      const validasM = propias.filter(esValida);
      const ultima = validasM.reduce((a, o) => (o.date > a ? o.date : a), '');
      const dias = ultima ? diasEntre(ultima, hoy) : null;
      const ultimoDia = propias.filter(o => o.date === propias.reduce((a, x) => (x.date > a ? x.date : a), ''));
      return { engine: m.id, lastRun: ultima || null, daysAgo: dias, level: dias === null ? 'none' : dias > 14 ? 'red' : dias > 8 ? 'amber' : 'ok',
        errorsLastRun: ultimoDia.filter(o => !esValida(o)).length, responsesLastRun: ultimoDia.length };
    });
    const conDatos = porMotor.filter(m => m.lastRun);
    const peor = conDatos.some(m => m.level === 'red') ? 'red' : conDatos.some(m => m.level === 'amber') ? 'amber' : conDatos.length ? 'ok' : 'none';
    const errores = (observaciones || []).filter(o => !esValida(o)).length;
    return { engines: porMotor, level: peor, errors: errores };
  }

  const API = {
    MARCAS_BASE, CUADRANTES, PRESETS, norm, promedio, redondear, esValida, validas, marcaDe, menciones, metricasMarca, sovMenciones, sovPonderado,
    delta, ranking, periodo, enPeriodo, sumarDias, diasEntre, semana, serie, dominioDe, urls, estadoCita, cambiosCitas, mixCategorias,
    coberturaDominio, dominios, citasMarca, cuadrante, porPrompt, recomendaciones, titular, salud
  };
  if (typeof module === 'object' && module.exports) module.exports = API;
  else raiz.GeoMetrics = API;
})(typeof window !== 'undefined' ? window : globalThis);
