/* GEO Tracker BCP v2 (SPEC v2). Se carga después de monitor.js y prompts-admin.js
   y los extiende como ellos: envolviendo renderShell, renderRoute, readRoute,
   refresh, observations y showResponse. La vista de proyecto (R1–R10) no cambia;
   solo pasa a respetar los filtros globales nuevos (rango, tags, país). */
(function () {
  'use strict';
  const G = window.GeoMetrics;
  const API_BASE = 'https://n8n.srv836595.hstgr.cloud/webhook';
  const LIMITE_PROMPTS = 150;
  const byId = id => document.getElementById(id);

  // ─── Catálogos ────────────────────────────────────────────────────────────
  const BRANDS = () => (Array.isArray(MON.brands) && MON.brands.length ? MON.brands : G.MARCAS_BASE).filter(b => isPeruvianBank(b.name));
  const AUDIT_ROUTES = new Set(['audit-crawl', 'audit-content', 'audit-fanout']);
  const GEO_AUDIT_ENABLED = false;
  let profile = { displayName: 'Carlos Andrés Ramírez', photoUrl: 'assets/carlos-andres-ramirez.jpg?v=ux-11' };
  try { const session = JSON.parse(document.getElementById('bcp-session')?.textContent || 'null'); if (session?.displayName) profile = session; } catch (_) {}
  const OWN = () => BRANDS().find(b => b.isOwn) || BRANDS()[0];
  const brandById = id => BRANDS().find(b => b.id === id) || { id, name: id, color: '#94a3b8' };
  const CATEGORIAS = {
    brand: ['Marca propia', '#002A8D'], competitor: ['Competidor', '#8b5cf6'], comparator: ['Comparador', '#FF7800'],
    government_ngo: ['Gobierno / ONG', '#0f766e'], news_media: ['Medios', '#2563eb'], social: ['Redes sociales', '#db2777'],
    community_forum: ['Comunidad / foro', '#ea580c'], education: ['Educación', '#16a34a'], video: ['Video', '#dc2626'],
    encyclopedia: ['Enciclopedia', '#475569'], blog_personal: ['Blog', '#a16207'], other: ['Otros', '#94a3b8'], unclassified: ['Sin clasificar', '#7b8aa6']
  };
  // Título legible de una cita: el título, o la URL sin esquema, sin %C3%A9.
  const decodificar = t => { try { return decodeURIComponent(String(t)); } catch (e) { return String(t); } };
  const tituloUrl = u => decodificar(u.title || String(u.url || '').replace(/^https?:\/\/(www\.)?/, '')).replace(/_/g, ' ');
  const catChip = c => { const [n, col] = CATEGORIAS[c] || CATEGORIAS.unclassified; return `<span class="v2-chip" style="--chip:${col}">${esc(n)}</span>`; };
  const ETAPA_POR_INTENCION = { informacional: 'tofu', navegacional: 'mofu', comparativa: 'mofu', comercial: 'mofu', transaccional: 'bofu' };
  const ETAPAS = { tofu: 'TOFU · descubrimiento', mofu: 'MOFU · comparación', bofu: 'BOFU · decisión' };
  const PAISES = { PE: '🇵🇪 Perú', all: '🌎 Todos los países' };
  const ROUTES = {
    resumen: ['Resumen', 'report'], prompts: ['Prompts', 'report'], projects: ['Proyectos', 'report'], competitors: ['Análisis competitivo', 'report'],
    citas: ['Citas y fuentes', 'report'], visibilidad: ['Índice de visibilidad', 'report'], recomendaciones: ['Recomendaciones', 'report'],
    bots: ['Tráfico de bots IA', 'report'], perfil: ['Perfil de marca', 'report'], dashboard: ['Dashboard clásico', 'report'], sources: ['Fuentes (clásico)', 'report'],
    'gestion-prompts': ['Gestión de prompts', 'config'], tags: ['Prompts y tags', 'config'], investigacion: ['Investigación de prompts', 'config'], settings: ['Configuración', 'config'],
    'audit-crawl': ['Crawlability', 'audit'], 'audit-content': ['Contenido', 'audit'], 'audit-fanout': ['Query fan-out', 'audit']
  };
  const MIAS = new Set(['settings', 'resumen', 'prompts', 'citas', 'visibilidad', 'recomendaciones', 'bots', 'perfil', 'tags', 'investigacion', 'audit-crawl', 'audit-content', 'audit-fanout']);
  const SIN_FILTROS = new Set(['gestion-prompts', 'tags', 'investigacion', 'settings', 'audit-crawl', 'audit-content', 'audit-fanout', 'bots']);

  function promptMeta(id) {
    const p = DATA.prompts.find(x => x.id === id) || { id, text: id };
    if (!p._v2) {
      const proyecto = PROJECT.get(p.project) || MON.projects.find(pr => pr.promptIds.includes(id));
      p.tags = Array.isArray(p.tags) && p.tags.length ? p.tags : proyecto ? [proyecto.name] : [];
      p.funnelStage = ['tofu', 'mofu', 'bofu'].includes(p.funnelStage) ? p.funnelStage : ETAPA_POR_INTENCION[G.norm(p.intent)] || 'tofu';
      p.intentVolume = Number(p.intentVolume) || 0;
      p.country = p.country || 'PE';
      if (typeof p.isBranded !== 'boolean') p.isBranded = /\b(bcp|banco de credito)\b/.test(G.norm(p.text));
      p._v2 = true;
    }
    return p;
  }
  // En vivo, DATA.prompts trae también los de la demo: cuentan solo los de los proyectos reales.
  const promptsReales = () => { const ids = new Set(MON.projects.flatMap(pr => pr.promptIds)); return DATA.prompts.filter(p => ids.has(p.id)).map(p => promptMeta(p.id)); };
  const tagsDe = o => (Array.isArray(o.tags) && o.tags.length ? o.tags : promptMeta(o.promptId).tags);
  const engineActivo = id => MON.observations.some(o => o.modelId === id && G.esValida(o));

  // ─── Filtros globales (estado en la URL) ──────────────────────────────────
  const V = { preset: 'last14', start: '', end: '', tags: new Set(), country: 'PE', exportar: null, period: null,
    chartMetric: 'coverage', gran: 'day', hidden: new Set(), rankSort: ['coverage', -1], promptTab: 'top', citeTab: 'top',
    pq: '', psort: ['coverage', -1], ppage: 1, psize: 20, pcols: new Set(), uq: '', utab: 'top', upage: 1, dpage: 1,
    thr: { coverage: 30, probability: 50 }, thrMode: 'market', lapse: null, lapseIdx: null, recTab: 'suggested', recF: { category: '', scope: '', impact: '' }, recQ: '', recSort: 'impact',
    sel: new Set(), research: { modo: 'keywords', loading: false, error: '', items: [], pick: new Set() }, audit: { loading: false, error: '', last: null }, fan: { loading: false, error: '', last: null },
    bots: null, tagColors: leerLocal('v2TagColors', {}), favs: new Set(leerLocal('v2Favs', [])) };
  function leerLocal(k, def) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? def : v; } catch (e) { return def; } }
  function guardarLocal(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }

  function leerQuery() {
    const q = new URLSearchParams(location.search), preset = q.get('preset');
    V.preset = preset && (G.PRESETS[preset] || ['custom', 'all'].includes(preset)) ? preset : 'last14';
    V.start = q.get('start') || ''; V.end = q.get('end') || '';
    V.tags = new Set((q.get('tags') || '').split(',').filter(Boolean));
    V.country = String(q.get('country') || 'PE').toUpperCase() === 'ALL' ? 'all' : 'PE';
    M.models = q.has('engine') ? new Set(q.get('engine').split(',').map(x => x === 'google_aio' ? 'overview' : x).filter(x => MODEL.has(x))) : new Set(MON.models.map(m => m.id));
    M.project = q.get('project') && PROJECT.has(q.get('project')) ? q.get('project') : 'all';
  }
  function escribirQuery() {
    const q = new URLSearchParams();
    q.set('country', V.country.toLowerCase());
    if (M.models.size !== MON.models.length) q.set('engine', [...M.models].join(','));
    if (V.tags.size) q.set('tags', [...V.tags].join(','));
    if (M.project !== 'all' && M.route !== 'detail') q.set('project', M.project);
    q.set('preset', V.preset);
    if (V.preset === 'custom') { q.set('start', V.start); q.set('end', V.end); }
    const url = location.pathname + '?' + q.toString().replace(/%2C/g, ',') + location.hash;
    if (url !== location.pathname + location.search + location.hash) history.replaceState(null, '', url);
  }
  function periodoActual() {
    if (V.preset === 'all') return { start: '0000-01-01', end: '9999-12-31', days: null, previous: null };
    return G.periodo(V.preset, MON.referenceDate, V.start, V.end);
  }
  function sincronizarPeriodoClasico() {
    const p = periodoActual();
    M.period = V.preset === 'all' ? 'source' : String(p.days);
    V.period = M.period;
  }
  const pasaTags = o => !V.tags.size || tagsDe(o).some(t => V.tags.has(t));
  const pasaPais = o => V.country === 'all' || String(o.country || 'PE').toUpperCase() === V.country;

  // observations() y bounds() de monitor.js, con rango, tags y país.
  observations = function ({ previous = false, project = M.project, prompt = M.prompt } = {}) {
    const p = periodoActual();
    const r = previous ? p.previous : p;
    if (!r) return [];
    return MON.observations.filter(o => M.models.has(o.modelId) && (project === 'all' || o.projectId === project) && (prompt === 'all' || o.promptId === prompt) &&
      o.date >= r.start && o.date <= r.end && pasaTags(o) && pasaPais(o));
  };
  bounds = function (previous = false) {
    const p = periodoActual();
    const r = previous ? p.previous || { start: '0000-01-01', end: '0000-01-01' } : p;
    return [r.start, G.sumarDias(r.end === '9999-12-31' ? '9999-12-30' : r.end, 1)];
  };
  const filas = () => observations();
  const previas = () => observations({ previous: true });
  // ¿El periodo anterior tiene respuestas válidas? Si no, no hay contra qué comparar.
  const hayPrevio = pr => (pr || previas()).some(G.esValida);

  // ─── Pequeños componentes ─────────────────────────────────────────────────
  const n1 = v => (v === null || v === undefined ? '—' : fmt(v, Math.abs(v) < 10 && v % 1 !== 0 ? 1 : 0));
  const pctTxt = v => (v === null || v === undefined ? '—' : fmt(v, v < 10 && v > 0 ? 1 : 0) + '%');
  const posTxt = v => (v === null || v === undefined ? '—' : fmt(v, 2));
  const sentTxt = v => (v === null || v === undefined ? '—' : (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), 0));
  function dlt(v, unit = 'pp', lowerIsBetter = false, d = 1) {
    if (v === null || v === undefined || !Number.isFinite(v)) return '<span class="v2-delta na" title="Sin periodo anterior comparable">N/A</span>';
    const bueno = lowerIsBetter ? v < 0 : v > 0, flecha = v > 0 ? '↑' : v < 0 ? '↓' : '→';
    return `<span class="v2-delta ${v === 0 ? 'flat' : bueno ? 'up' : 'down'}">${flecha} ${v > 0 ? '+' : v < 0 ? '−' : ''}${fmt(Math.abs(v), d)}${unit ? ' ' + unit : ''}</span>`;
  }
  function sentBar(v) {
    if (v === null || v === undefined) return '<span class="muted">—</span>';
    // −100…−10 negativo (rojo) · −10…+10 neutral (gris) · +10…+100 positivo (verde).
    // Una mención neutral no es mala: antes salía en ámbar y todo parecía «regular».
    const tono = v <= -10 ? 'negativo' : v < 10 ? 'neutral' : 'positivo';
    const col = { negativo: '#c0392b', neutral: '#5f6f8f', positivo: '#1d8b3d' }[tono];
    const seg = Math.round((v + 100) / 40);
    return `<span class="v2-sent" title="Sentimiento ${tono}: ${sentTxt(v)} (escala −100 a +100)" aria-label="Sentimiento ${tono} ${sentTxt(v)}"><span class="v2-sent-bar">${[0, 1, 2, 3, 4].map(i => `<i style="${i < Math.max(1, seg) ? 'background:' + col : ''}"></i>`).join('')}</span><b style="color:${col}">${sentTxt(v)}</b></span>`;
  }
  const logo = b => `<span class="v2-logo" style="background:${b.color || '#94a3b8'}" aria-hidden="true">${esc((b.name || '?').charAt(0))}</span>`;
  const brandCell = b => `<span class="v2-brand ${b.isOwn ? 'own' : ''}">${logo(b)}${esc(b.name)}</span>`;
  const volBar = v => `<span class="v2-vol" title="Volumen de intención ${v || 0}/5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= (v || 0) ? 'on' : ''}"></i>`).join('')}</span>`;
  const tip = t => `<button type="button" class="info" data-tip="${esc(t)}" aria-label="${esc(t)}"></button>`;
  const vacio = (titulo, texto, accion = '') => `<div class="v2-empty"><h3>${esc(titulo)}</h3><p>${texto}</p>${accion}</div>`;
  const tagColor = t => V.tagColors[t] || ['#002A8D', '#FF7800', '#0f766e', '#8b5cf6', '#db2777', '#2563eb', '#16a34a', '#a16207', '#475569'][[...t].reduce((a, c) => a + c.charCodeAt(0), 0) % 9];
  const tagChip = t => `<span class="v2-tag" style="--chip:${tagColor(t)}">${esc(t)}</span>`;
  const seg = (grupo, actual, opciones) => `<div class="segment light v2-seg">${opciones.map(([k, v]) => `<button type="button" data-${grupo}="${k}" class="${actual === k ? 'active' : ''}" aria-pressed="${actual === k}">${v}</button>`).join('')}</div>`;
  const FORMULAS = {
    coverage: 'Cobertura de marca = respuestas donde la marca aparece ÷ respuestas válidas. Las respuestas con error no cuentan.',
    position: 'Posición = promedio del rank de la marca entre las marcas mencionadas, solo donde aparece (1 = primera). Menor es mejor.',
    sentiment: 'Sentimiento = promedio del score por respuesta en escala −100…+100, solo donde la marca aparece. Entre −10 y +10 es neutral: la marca se menciona sin juicio.',
    sov: 'Share of Voice = respuestas que mencionan la marca ÷ suma de las respuestas que mencionan a cada banco seguido (1 por respuesta, como OtterlyAI). La suma de todos es 100%.',
    sovWeighted: 'SoV ponderado = promedio por respuesta del score de n8n: posición, prominencia y contexto.',
    probability: 'Probabilidad de compra = respuestas donde el motor recomienda la marca como opción ÷ respuestas donde aparece.',
    domainCoverage: 'Cobertura de dominio = respuestas que citan el dominio ÷ respuestas válidas.'
  };
  function csv(rows) {
    const cel = v => { const raw = v === null || v === undefined ? '' : String(v), s = /^[=+@\-]/.test(raw) ? "'" + raw : raw; return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    return new Blob(['﻿' + rows.map(r => r.map(cel).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
  }
  function exportarVista() {
    if (typeof V.exportar !== 'function') { toast('Esta vista no tiene tabla para exportar'); return; }
    const [nombre, filasCsv] = V.exportar();
    download(`BCP_GEO_${nombre}_${new Date().toISOString().slice(0, 10)}.csv`, csv(filasCsv));
    toast('CSV exportado · respeta los filtros');
  }
  async function api(path, body, ms = 60000) {
    const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), ms);
    try {
      const r = await fetch(API_BASE + path, { method: 'POST', cache: 'no-store', credentials: 'omit', signal: ctrl.signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
      let d; try { d = await r.json(); } catch (e) { throw new Error('El servidor no devolvió JSON.'); }
      if (!r.ok || d.ok === false) throw new Error(d.error || 'HTTP ' + r.status);
      return d;
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('n8n no respondió a tiempo.');
      if (e instanceof TypeError) throw new Error('No se pudo conectar con n8n.');
      throw e;
    } finally { clearTimeout(t); }
  }

  // ─── Gráficos SVG ─────────────────────────────────────────────────────────
  function lineChart({ dates, series, unit = '%', invert = false, height = 240, max }) {
    const vis = series.filter(s => !s.hidden);
    const vals = vis.flatMap(s => s.values).filter(v => v !== null && Number.isFinite(v));
    if (!dates.length || !vals.length) return vacio('Sin datos para graficar', 'No hay respuestas válidas con estos filtros.');
    // En pantallas angostas el SVG se dibuja más chico para que el texto no quede en 4 px.
    const angosto = window.innerWidth < 640;
    const W = angosto ? 360 : 760, H = angosto ? Math.round(height * 0.9) : height, L = angosto ? 36 : 44, R = 12, T = 12, B = 28;
    let lo = Math.min(0, ...vals), hi = max !== undefined ? max : Math.max(...vals);
    if (unit === 'pos') { lo = 1; hi = Math.max(2, Math.ceil(Math.max(...vals))); }
    if (unit === 'sent') { lo = -100; hi = 100; }
    if (hi === lo) hi = lo + 1;
    const x = i => L + (dates.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (dates.length - 1));
    const y = v => { const r = (v - lo) / (hi - lo); return invert ? T + r * (H - T - B) : H - B - r * (H - T - B); };
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => lo + f * (hi - lo));
    const etiqueta = v => (unit === 'pos' ? fmt(v, 1) : unit === 'sent' ? sentTxt(v) : fmt(v, 0) + '%');
    const marcasX = angosto && dates.length > 2 ? [0, dates.length - 1] : dates.length <= 8 ? dates.map((d, i) => i) : [0, Math.floor(dates.length / 2), dates.length - 1];
    return `<svg class="v2-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de líneas">
      ${ticks.map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${etiqueta(v)}</text>`).join('')}
      ${marcasX.map(i => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(dateLabel(dates[i]))}</text>`).join('')}
      ${vis.map(s => {
        const pts = s.values.map((v, i) => (v === null || !Number.isFinite(v) ? null : [x(i), y(v), v, dates[i]]));
        const tramos = []; let actual = [];
        pts.forEach(p => { if (p) actual.push(p); else if (actual.length) { tramos.push(actual); actual = []; } });
        if (actual.length) tramos.push(actual);
        return `<g style="--c:${s.color}" class="${s.own ? 'own' : ''}">${tramos.map(t => `<polyline points="${t.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}"/>`).join('')}${pts.filter(Boolean).map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${s.own ? 4 : 3}"><title>${esc(s.name)} · ${esc(dateLabel(p[3], true))}: ${etiqueta(p[2])}</title></circle>`).join('')}</g>`;
      }).join('')}
    </svg>`;
  }
  function leyenda(series, grupo) {
    return `<div class="v2-legend">${series.map(s => `<button type="button" data-${grupo}="${esc(s.key)}" class="${s.hidden ? 'off' : ''}" aria-pressed="${!s.hidden}"><i style="background:${s.color}"></i>${esc(s.name)}</button>`).join('')}</div>`;
  }
  function barras(items, { valor, etiqueta, color, formato = pctTxt, max }) {
    const tope = max || Math.max(1, ...items.map(valor).filter(Number.isFinite));
    return `<div class="v2-bars">${items.map(it => { const v = valor(it); return `<div class="v2-bar-row"><span class="v2-bar-label">${etiqueta(it)}</span><span class="v2-bar"><i style="width:${Math.max(1, ((v || 0) / tope) * 100)}%;background:${color(it)}"></i></span><b>${formato(v)}</b></div>`; }).join('')}</div>`;
  }

  // ─── Cabecera: salud de datos (V11) y navegación ──────────────────────────
  function saludBadge() {
    const s = G.salud(MON.observations, MON.referenceDate, MON.models);
    const conDatos = s.engines.filter(e => e.lastRun);
    const masReciente = conDatos.reduce((a, e) => (!a || e.daysAgo < a.daysAgo ? e : a), null);
    const hace = d => (d === 0 ? 'hoy' : d === 1 ? 'hace 1 día' : 'hace ' + d + ' días');
    const titulo = masReciente ? 'Última corrida: ' + hace(masReciente.daysAgo) : 'Sin corridas';
    return `<details class="v2-health ${s.level}"><summary><i class="status-dot"></i>${esc(titulo)}</summary><div class="v2-health-pop"><b>Última corrida válida por motor</b>${s.engines.map(e => `<div class="v2-health-row ${e.level}">${engineBadge(e.engine, true)}<span>${e.lastRun ? esc(dateLabel(e.lastRun, true)) + ' · ' + hace(e.daysAgo) : 'No activo'}</span>${e.errorsLastRun ? `<small>${e.errorsLastRun} con error</small>` : ''}</div>`).join('')}<p class="muted">Ámbar: más de 8 días · rojo: más de 14. Las respuestas con error no cuentan en ninguna métrica.</p></div></details>`;
  }
  const menuIcon = name => {
    const paths = { chart:'<path d="M4 19V5m0 14h16M8 15l4-5 4 3 4-7"/>', search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>', people:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3m2-15a3 3 0 0 1 0 6m3 9v-3a5 5 0 0 0-2-4"/>', link:'<path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 4 1-1a4 4 0 0 0-6-6" transform="translate(4 2)"/>', spark:'<path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3Z"/>', tag:'<path d="M3 3h8l10 10-8 8L3 11Z"/><circle cx="7.5" cy="7.5" r="1"/>', settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>', list:'<path d="M8 5h12M8 12h12M8 19h12M3 5h.1M3 12h.1M3 19h.1"/>', grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.chart}</svg>`;
  };
  function nav() {
    const labels={resumen:'Resumen',prompts:'Consultas',competitors:'Competencia',citas:'Citas y fuentes',recomendaciones:'Recomendaciones',visibilidad:'Índice de visibilidad',perfil:'Perfil de marca',bots:'Tráfico de bots IA',investigacion:'Investigar consultas','gestion-prompts':'Catálogo de prompts',tags:'Etiquetas',settings:'Configuración'};
    const item=(key,ic)=>`<button type="button" class="side-link ${M.route===key?'active':''}" data-nav="${key}" ${M.route===key?'aria-current="page"':''}>${menuIcon(ic)}<span>${labels[key]}</span>${key==='recomendaciones'?'<small class="ux-ai-pill">IA</small>':''}</button>`;
    const advanced=['visibilidad','perfil','bots'].includes(M.route);
    return `<div class="ux-nav-caption">Análisis</div>${item('resumen','grid')}${item('prompts','search')}${item('competitors','people')}${item('citas','link')}<div class="ux-nav-caption">Acciones</div>${item('recomendaciones','spark')}${item('investigacion','search')}<details class="ux-nav-advanced" ${advanced?'open':''}><summary>${menuIcon('chart')}<span>Análisis avanzado</span><span class="ux-chevron">⌄</span></summary><div>${item('visibilidad','chart')}${item('perfil','people')}${item('bots','clock')}</div></details><div class="ux-nav-caption">Gestión</div>${item('gestion-prompts','list')}${item('tags','tag')}${item('settings','settings')}`;
  }
  const prev = { shell: renderShell, route: renderRoute, read: readRoute, refresh, filters: renderFilters, showResponse: typeof showResponse === 'function' ? showResponse : null };
  renderShell = function () {
    prev.shell();
    const side = document.getElementById('sidebar');
    side.innerHTML = `<div class="side-brand"><button class="bcp-brand-home" type="button" data-nav="resumen" aria-label="BCP · Ir al resumen"><img class="bcp-wordmark" src="assets/logo-bcp.svg?v=ux-11" width="138" height="36" alt="BCP"></button><span class="ux-brand-product">GEO Monitor</span><p>Marketing y Comunicaciones</p></div><nav class="side-nav" aria-label="Navegación principal">${nav()}</nav><div class="side-footer"><span class="ux-workspace-dot"></span><span>BCP · Perú<small>Monitor de Visibilidad en IA</small></span></div>`;
    const label=M.route==='detail'?PROJECT.get(M.project)?.name||'Proyecto':({projects:'Proyectos',dashboard:'Resumen',sources:'Citas y fuentes'}[M.route]||(ROUTES[M.route]||['Resumen'])[0]);
    const avatar=profile.photoUrl?`<span class="ux-profile-photo"><img src="${esc(profile.photoUrl)}" width="36" height="36" alt="${esc(profile.displayName)}"></span>`:`<span class="ux-profile-initials">${esc(profile.displayName.charAt(0))}</span>`;
    document.getElementById('appHeader').innerHTML=`<div class="ux-header-left"><button class="ux-menu-button" type="button" id="uxMenuToggle" aria-label="Abrir menú" aria-controls="sidebar" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><div class="ux-header-context"><span class="ux-product-title">Monitor de Visibilidad en IA</span><nav class="breadcrumb" aria-label="Ubicación"><button type="button" data-nav="resumen">BCP</button><span>›</span>${M.route==='detail'?'<button type="button" data-nav="projects">Proyectos</button><span>›</span>':''}<span>${esc(label)}</span></nav></div></div><div class="header-right">${saludBadge()}<details class="ux-account"><summary>${avatar}<span class="ux-account-name">${esc(profile.displayName)}<small>Cuenta ChatGPT</small></span><span class="ux-chevron">⌄</span></summary><div class="ux-account-pop"><span class="ux-account-heading">Sesión conectada</span><b>${esc(profile.displayName)}</b><button class="text-button" type="button" data-nav="settings">Configuración</button><a href="/signout-with-chatgpt?return_to=%2Flogin" target="_top">Cerrar sesión</a></div></details></div>`;
    document.body.classList.remove('ux-menu-open');
    const gf=byId('globalFilters');if(gf)gf.hidden=SIN_FILTROS.has(M.route);
  };

  renderFilters = function () {
    sincronizarPeriodoClasico();
    const tags = [...new Set(promptsReales().flatMap(p => p.tags))].sort((a, b) => a.localeCompare(b, 'es'));
    const p = periodoActual();
    const presets = [['last7', 'Últimos 7 días'], ['last14', 'Últimos 14 días'], ['last30', 'Últimos 30 días'], ['last90', 'Últimos 90 días'], ['last180', 'Últimos 6 meses'], ['all', 'Todo el historial'], ['custom', 'Personalizado']];
    const motorLabel = M.models.size === MON.models.length ? 'Todos los motores' : M.models.size ? [...M.models].map(id => MODEL.get(id).short || MODEL.get(id).name).join(', ') : 'Ningún motor';
    $('#globalFilters').innerHTML = `<div class="filter-bar v2-filter-bar">
      <div class="filter-control">${icon('calendar')}<label for="v2Preset">Rango</label><select id="v2Preset">${presets.map(([k, v]) => `<option value="${k}" ${V.preset === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
        ${V.preset === 'custom' ? `<input type="date" id="v2Start" value="${esc(V.start || p.start)}" aria-label="Desde"><input type="date" id="v2End" value="${esc(V.end || p.end)}" aria-label="Hasta">` : ''}</div>
      <div class="filter-control v2-tags-filter"><span class="filter-caption">Tags</span><button type="button" id="v2TagsTrigger" class="engine-trigger" aria-expanded="false">${V.tags.size ? esc([...V.tags].join(', ')) : 'Todos los tags'} <span>⌄</span></button>
        <div class="engine-menu" id="v2TagsMenu" hidden><button type="button" class="text-button" id="v2TagsAll">Todos los tags</button>${tags.map(t => `<label><input type="checkbox" data-v2tag="${esc(t)}" ${V.tags.has(t) ? 'checked' : ''}>${tagChip(t)}</label>`).join('')}</div></div>
      <div class="filter-control engine-filter"><span class="filter-caption">Motor</span><button type="button" id="engineTrigger" class="engine-trigger" aria-expanded="false">${esc(motorLabel)} <span>⌄</span></button>
        <div class="engine-menu" id="engineMenu" hidden><button type="button" class="text-button" id="engineAll">${M.models.size === MON.models.length ? 'Deseleccionar todos' : 'Todos los motores'}</button>${MON.models.map(m => `<label class="${engineActivo(m.id) ? '' : 'v2-inactive'}"><input type="checkbox" data-engine="${m.id}" ${M.models.has(m.id) ? 'checked' : ''}>${engineBadge(m.id)}<small>${engineActivo(m.id) ? esc(m.vendor) : 'No activo'}</small></label>`).join('')}</div></div>
      <div class="filter-control"><label for="v2Country">País</label><select id="v2Country">${Object.entries(PAISES).map(([k, v]) => `<option value="${k}" ${V.country === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="filter-control"><label for="globalProject">Proyecto</label><select id="globalProject"><option value="all">Todos los proyectos</option>${MON.projects.map(pr => `<option value="${pr.id}" ${M.project === pr.id ? 'selected' : ''}>${esc(pr.name)}</option>`).join('')}</select></div>
      <button type="button" class="button" id="v2Export">${icon('download')}Exportar</button>
      <span class="filter-asof">${V.preset === 'all' ? 'Todo el historial' : esc(dateLabel(p.start, true)) + ' – ' + esc(dateLabel(p.end, true))}${p.previous ? ' · vs ' + esc(dateLabel(p.previous.start)) + ' – ' + esc(dateLabel(p.previous.end)) : ''}</span>
    </div>${LIVE ? '' : '<div class="demo-notice"><span class="dot"></span><span>Datos de demostración: no hay conexión con n8n o aún no hay corridas.</span></div>'}`;
  };
  refresh = function () {
    if (V.period !== null && M.period !== V.period) V.preset = { 30: 'last30', 90: 'last90', 180: 'last180', source: 'all' }[M.period] || V.preset;
    prev.refresh();
    escribirQuery();
  };
  renderRoute = function () {
    if (!GEO_AUDIT_ENABLED && AUDIT_ROUTES.has(M.route)) { M.route='resumen'; history.replaceState(null,'',location.pathname+location.search+'#resumen'); renderShell(); }
    cerrarDrawer(true);
    V.exportar = null;
    if (MIAS.has(M.route)) {
      byId('detailView').hidden = true; byId('generalView').hidden = false;
      ({ settings: renderAjustes, resumen: renderResumen, prompts: renderPromptsV2, citas: renderCitas, visibilidad: renderVisibilidad, recomendaciones: renderRecsV2, bots: renderBots, perfil: renderPerfil,
        tags: renderTags, investigacion: renderInvestigacion, 'audit-crawl': renderAuditCrawl, 'audit-content': renderAuditContent, 'audit-fanout': renderFanout })[M.route]();
    } else prev.route();
    if(M.route==='settings')document.getElementById('generalView').insertAdjacentHTML('beforeend','<section class="card dashboard-card ux-project-settings"><div><h2>Organización de proyectos</h2><p>Agrupa las consultas según los productos y temas del banco.</p></div><button class="button" type="button" data-nav="projects">Ver proyectos</button></section>');
    escribirQuery();
  };
  readRoute = function () {
    leerQuery();
    const project = M.project, raw = location.hash.slice(1);
    if (MIAS.has(raw)) { M.route = raw; renderShell(); renderRoute(); }
    else if (!raw) { M.route = 'resumen'; renderShell(); renderRoute(); }
    else {
      prev.read();
      if (M.route !== 'detail' && M.project !== project) { M.project = project; renderShell(); renderRoute(); }
    }
  };
  window.removeEventListener('popstate', prev.read);
  window.addEventListener('popstate', readRoute);

  // La vista Competencia (monitor.js) unifica nombres con los alias de las marcas
  // seguidas: «Banco Falabella» y «Falabella» son el mismo banco.
  canonicalBrand = function (valor) {
    const id = G.marcaDe(valor, BRANDS());
    return id ? brandById(id).name : String(valor || '').trim();
  };

  // ─── V1 · Resumen ─────────────────────────────────────────────────────────
  function alertas(r) {
    const s = G.salud(MON.observations, MON.referenceDate, MON.models);
    const out = [];
    if (s.level === 'red') out.push(['red', 'La última corrida válida tiene más de 14 días. Revisa la corrida diaria en n8n.']);
    else if (s.level === 'amber') out.push(['amber', 'La última corrida válida tiene más de 8 días.']);
    const errores = r.filter(o => !G.esValida(o)).length;
    if (errores) out.push(['amber', `${errores} respuesta(s) con error en el periodo: se excluyen de todas las métricas. <button type="button" class="text-button" data-nav="prompts">Ver prompts</button>`]);
    const porDia = new Map();
    for (const o of r.filter(G.esValida)) { if (!porDia.has(o.date)) porDia.set(o.date, []); porDia.get(o.date).push(o); }
    for (const [d, g] of porDia) if (g.length >= 10 && g.every(o => !(o.ranking || []).length && !(o.brandDetail || []).length)) out.push(['red', `La corrida del ${esc(dateLabel(d, true))} no encontró ninguna marca en ${g.length} respuestas: posible corrida fallida.`]);
    const crawl = GEO_AUDIT_ENABLED && (MON.audits || []).find(a => a.type === 'crawl' && a.result && (a.result.critico || (a.result.resumen && a.result.resumen.ok <= 3)));
    if (crawl) out.push(['red', `Auditoría GEO: ${crawl.result.resumen.ok} de ${crawl.result.bots.length} bots de IA acceden a ${esc(G.dominioDe(crawl.url))}. <button type="button" class="text-button" data-nav="audit-crawl">Ver auditoría</button>`]);
    return out.map(([n, t]) => `<div class="v2-alert ${n}" role="status">${t}</div>`).join('');
  }
  function kpis(r, pr) {
    const own = OWN(), a = G.metricasMarca(r, own.id, BRANDS()), b = G.metricasMarca(pr, own.id, BRANDS());
    const sov = G.sovMenciones(r, BRANDS())[own.id], sovP = G.sovMenciones(pr, BRANDS())[own.id];
    const w = G.sovPonderado(r), wP = G.sovPonderado(pr);
    const defs = [
      ['Cobertura de marca', pctTxt(a.coverage), dlt(G.delta(a.coverage, b.coverage)), 'coverage'],
      ['Posición de marca', posTxt(a.position), dlt(G.delta(a.position, b.position), '', true, 2), 'position'],
      ['Sentimiento', sentBar(a.sentiment), dlt(G.delta(a.sentiment, b.sentiment), 'pts', false, 0), 'sentiment'],
      ['Share of Voice', pctTxt(sov), dlt(G.delta(sov, sovP)), 'sov'],
      ['SoV ponderado', pctTxt(w), dlt(G.delta(w, wP)), 'sovWeighted']
    ];
    return `<div class="home-kpis v2-kpis">${defs.map(([l, v, d, k]) => `<article class="card home-kpi"><div class="metric-title">${l}${infoKpi(k)}</div><div class="metric-number">${v}</div><div class="metric-change">${d} <span class="muted">vs. periodo anterior</span></div></article>`).join('')}</div>`;
  }
  function topMarcas(r, n = 6) {
    const rk = G.ranking(r, [], BRANDS());
    const own = rk.find(x => x.brand.isOwn);
    return [own].concat(rk.filter(x => !x.brand.isOwn && x.responsesMentioning > 0).slice(0, n - 1)).filter(Boolean).map(x => x.brand);
  }
  function graficoDesempeno(r) {
    const s = G.serie(r, topMarcas(r), V.chartMetric, V.gran);
    const series = s.series.map(x => ({ key: x.brand.id, name: x.brand.name, color: x.brand.color, own: x.brand.isOwn, values: x.values, hidden: V.hidden.has(x.brand.id) }));
    const unit = V.chartMetric === 'position' ? 'pos' : V.chartMetric === 'sentiment' ? 'sent' : '%';
    return `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>Desempeño de marca en el tiempo</h2><p class="sub">${esc(OWN().name)} y sus 5 competidores con más presencia</p></div><div class="v2-row">${seg('v2metric', V.chartMetric, [['coverage', 'Cobertura'], ['position', 'Posición'], ['sentiment', 'Sentimiento'], ['sov', 'SOV']])}${seg('v2gran', V.gran, [['day', 'Día'], ['week', 'Semana']])}</div></div>
      ${lineChart({ dates: s.dates, series, unit, invert: V.chartMetric === 'position' })}${leyenda(series, 'v2serie')}${s.dates.length === 1 ? '<p class="v2-help">Hay una sola corrida en el periodo: la tendencia se dibuja desde la siguiente.</p>' : ''}</section>`;
  }
  function tablaRanking(r, pr, id = 'v2Ranking') {
    const rk = G.ranking(r, pr, BRANDS()).filter(x => x.responsesMentioning > 0 || x.brand.isOwn);
    const [k, dir] = V.rankSort;
    const val = x => (k === 'name' ? x.brand.name : x[k]);
    rk.sort((a, b) => { const va = val(a), vb = val(b); if (va === null || va === undefined) return 1; if (vb === null || vb === undefined) return -1; return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * dir; });
    const th = (key, label, t) => `<th><button type="button" class="v2-sort ${k === key ? 'on' : ''}" data-v2rank="${key}">${label}${k === key ? (dir > 0 ? ' ↑' : ' ↓') : ''}</button>${t ? tip(t) : ''}</th>`;
    if (!rk.length) return vacio('Sin marcas en el periodo', 'No hay respuestas válidas con estos filtros.');
    return `<div class="table-scroll"><table class="v2-table" id="${id}"><thead><tr><th>#</th>${th('name', 'Marca')}${th('coverage', 'Cobertura', FORMULAS.coverage)}${th('position', 'Posición', FORMULAS.position)}${th('sentiment', 'Sentimiento', FORMULAS.sentiment)}${th('sov', 'SOV', FORMULAS.sov)}</tr></thead><tbody>
      ${rk.map((x, i) => `<tr class="${x.brand.isOwn ? 'v2-own' : ''}"><td>${i + 1}</td><td>${brandCell(x.brand)}</td><td>${pctTxt(x.coverage)} ${dlt(x.delta.coverage)}</td><td>${posTxt(x.position)} ${dlt(x.delta.position, '', true, 2)}</td><td>${sentBar(x.sentiment)} ${dlt(x.delta.sentiment, '', false, 0)}</td><td>${pctTxt(x.sov)} ${dlt(x.delta.sov)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function rankingCsv(r, pr) {
    return [['Marca', 'Cobertura %', 'Δ cobertura pp', 'Posición', 'Δ posición', 'Sentimiento', 'Δ sentimiento', 'SOV %', 'Δ SOV pp', 'Probabilidad de compra %', 'Respuestas con mención', 'Menciones totales']]
      .concat(G.ranking(r, pr, BRANDS()).map(x => [x.brand.name, G.redondear(x.coverage), G.redondear(x.delta.coverage), G.redondear(x.position, 2), G.redondear(x.delta.position, 2), G.redondear(x.sentiment, 0), G.redondear(x.delta.sentiment, 0), G.redondear(x.sov), G.redondear(x.delta.sov), G.redondear(x.purchaseProbability), x.responsesMentioning, x.totalMentions]));
  }
  function promptsResumen(r, pr) {
    const lista = G.porPrompt(r, pr, BRANDS()).filter(x => x.valid);
    const tabs = { top: ['Top', (a, b) => (b.coverage || 0) - (a.coverage || 0)], up: ['Subiendo', (a, b) => (b.coverageDelta ?? -1e9) - (a.coverageDelta ?? -1e9)], down: ['Bajando', (a, b) => (a.coverageDelta ?? 1e9) - (b.coverageDelta ?? 1e9)] };
    let items = lista.slice().sort(tabs[V.promptTab][1]);
    if (V.promptTab !== 'top') items = items.filter(x => x.coverageDelta !== null && (V.promptTab === 'up' ? x.coverageDelta > 0 : x.coverageDelta < 0));
    return `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>Desempeño por prompt</h2><p class="sub">Cobertura de ${esc(OWN().name)} vs periodo anterior</p></div>${seg('v2ptab', V.promptTab, Object.entries(tabs).map(([k, v]) => [k, v[0]]))}</div>
      ${items.length ? `<ul class="v2-list">${items.slice(0, 6).map(x => `<li><button type="button" class="v2-link" data-v2prompt="${esc(x.promptId)}">${esc(promptMeta(x.promptId).text)}</button><span>${pctTxt(x.coverage)} ${dlt(x.coverageDelta)}</span></li>`).join('')}</ul>` : vacio('Sin cambios que mostrar', V.promptTab === 'top' ? 'No hay prompts con respuestas válidas.' : 'Hace falta un periodo anterior con datos para comparar.')}
      <button type="button" class="text-button" data-nav="prompts">Ver todos los prompts →</button></section>`;
  }
  function citasResumen(r, pr) {
    const tabs = [['top', 'Top'], ['new', 'Nuevas'], ['increased', 'Subiendo'], ['stable', 'Estables'], ['decreased', 'Bajando'], ['lost', 'Perdidas']];
    const previo = hayPrevio(pr);
    if (!previo) V.citeTab = 'top';
    const c = G.cambiosCitas(r, previo ? pr : [], BRANDS(), MON.domainCategories || {});
    const items = (V.citeTab === 'top' ? c.filter(x => x.citations > 0) : c.filter(x => x.status === V.citeTab)).sort((a, b) => b.citations - a.citations || Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);
    return `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>Cambios en citas</h2><p class="sub">URLs citadas vs periodo anterior</p></div><button type="button" class="text-button" data-nav="citas">Ver citas →</button></div>${previo ? seg('v2ctab', V.citeTab, tabs) : '<p class="v2-help">Sin datos en el periodo anterior: se muestran las más citadas, sin comparación.</p>'}
      ${items.length ? `<ul class="v2-list">${items.map(u => `<li><a href="${esc(u.url)}" target="_blank" rel="noopener" class="v2-url" title="${esc(u.url)}">${esc(tituloUrl(u))}</a><span>${catChip(u.category)} <b>${u.citations}</b> ${previo ? dlt(u.change, '', false, 0) : ''}</span></li>`).join('')}</ul>` : vacio('Sin URLs en este estado', 'Prueba otra pestaña o amplía el rango.')}</section>`;
  }
  function fuentesResumen(r) {
    const mix = G.mixCategorias(r, BRANDS(), MON.domainCategories || {});
    return `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>Fuentes por categoría</h2><p class="sub">% de citas según el tipo de dominio</p></div></div>
      ${mix.length ? barras(mix, { valor: x => x.share, etiqueta: x => catChip(x.category), color: x => (CATEGORIAS[x.category] || CATEGORIAS.unclassified)[1] }) : vacio('Sin citas', 'Las respuestas del periodo no citan fuentes.')}</section>`;
  }
  function pie(r) {
    const s = G.salud(MON.observations, MON.referenceDate, MON.models);
    const n = new Set(r.map(o => o.promptId)).size;
    return `<p class="coverage-note">Reporte basado en ${n} prompt${n === 1 ? '' : 's'} · ${r.filter(G.esValida).length} respuestas válidas y ${r.filter(o => !G.esValida(o)).length} con error (fuera de los denominadores) · última corrida: ${s.engines.filter(e => e.lastRun).map(e => esc((MODEL.get(e.engine) || {}).short || (MODEL.get(e.engine) || {}).name) + ' ' + esc(dateLabel(e.lastRun, true))).join(' · ') || 'sin corridas'}.</p>`;
  }
  function renderResumen() {
    const r = filas(), pr = previas();
    V.exportar = () => ['ranking_marcas', rankingCsv(r, pr)];
    $('#generalView').innerHTML = pageIntro('Resumen', `Cómo aparece ${esc(OWN().name)} en las respuestas de los motores de IA.`, 'Reporte de marca') + alertas(r) + kpis(r, pr) +
      graficoDesempeno(r) +
      `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>Ranking de marcas</h2><p class="sub">Ordena por cualquier columna · deltas vs periodo anterior</p></div></div>${tablaRanking(r, pr)}</section>` +
      `<div class="dashboard-grid">${promptsResumen(r, pr)}${miniIndice(r)}</div><div class="dashboard-grid">${citasResumen(r, pr)}${fuentesResumen(r)}</div>` + pie(r);
  }

  // ─── V2 · Prompts (tabla + drawer) ────────────────────────────────────────
  const COLS = [
    ['coverage', 'Cobertura', true], ['sentiment', 'Sentimiento', true], ['volume', 'Volumen', true], ['responsesMentioning', 'Menciones de marca', true],
    ['totalMentions', 'Menciones totales', true], ['ownCitations', 'Citas de dominio', true], ['totalCitations', 'Citas totales', true], ['competitors', 'Competidores', true], ['tags', 'Tags', true],
    ['position', 'Posición', false], ['sovWeighted', 'SOV ponderado', false], ['project', 'Proyecto', false], ['stage', 'Etapa', false], ['errors', 'Con error', false]
  ];
  if (!V.pcols.size) COLS.filter(c => c[2]).forEach(c => V.pcols.add(c[0]));
  function filasPrompts() {
    const r = filas(), pr = previas();
    return G.porPrompt(r, pr, BRANDS()).map(x => Object.assign(x, { meta: promptMeta(x.promptId) }));
  }
  function valorCol(x, k) {
    return { text: x.meta.text, volume: x.meta.intentVolume, tags: x.meta.tags.join(', '), project: (PROJECT.get(x.meta.project) || {}).name || '', stage: x.meta.funnelStage, competitors: x.competitors.length }[k] ?? x[k];
  }
  function celda(x, k) {
    switch (k) {
      case 'coverage': return pctTxt(x.coverage);
      case 'sentiment': return sentBar(x.sentiment);
      case 'volume': return volBar(x.meta.intentVolume);
      case 'competitors': return x.competitors.length ? `<span class="v2-logos">${x.competitors.slice(0, 4).map(id => logo(brandById(id))).join('')}${x.competitors.length > 4 ? `<small>+${x.competitors.length - 4}</small>` : ''}</span>` : '—';
      case 'tags': return x.meta.tags.map(tagChip).join(' ');
      case 'position': return posTxt(x.position);
      case 'sovWeighted': return pctTxt(x.sovWeighted);
      case 'project': return esc((PROJECT.get(x.meta.project) || {}).name || '—');
      case 'stage': return esc((x.meta.funnelStage || '').toUpperCase());
      default: return n1(x[k]);
    }
  }
  function renderPromptsV2() {
    const todos = filasPrompts();
    const q = G.norm(V.pq);
    let lista = todos.filter(x => !q || G.norm(x.meta.text).includes(q) || x.meta.tags.some(t => G.norm(t).includes(q)));
    const [k, dir] = V.psort;
    lista.sort((a, b) => { const va = valorCol(a, k), vb = valorCol(b, k); if (va === null || va === undefined) return 1; if (vb === null || vb === undefined) return -1; return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * dir; });
    const pages = Math.max(1, Math.ceil(lista.length / V.psize));
    V.ppage = Math.min(V.ppage, pages);
    const pagina = lista.slice((V.ppage - 1) * V.psize, V.ppage * V.psize);
    const cols = COLS.filter(c => V.pcols.has(c[0]));
    V.exportar = () => ['prompts', [['Prompt'].concat(cols.map(c => c[1]))].concat(lista.map(x => [x.meta.text].concat(cols.map(c => { const v = valorCol(x, c[0]); return typeof v === 'number' ? G.redondear(v, 2) : v; }))))];
    $('#generalView').innerHTML = pageIntro('Prompts', 'Desempeño de cada prompt en el periodo. Haz clic en uno para ver respuestas y citas.', 'Reporte de marca') +
      `<div class="card v2-toolbar"><label class="v2-search">${icon('search')}<input type="search" id="v2PromptQ" placeholder="Buscar prompt o tag…" value="${esc(V.pq)}"></label>
        <details class="v2-cols"><summary>Columnas</summary><div>${COLS.map(c => `<label><input type="checkbox" data-v2col="${c[0]}" ${V.pcols.has(c[0]) ? 'checked' : ''}>${esc(c[1])}</label>`).join('')}</div></details>
        <label>Por página <select id="v2PSize">${[20, 50, 100].map(n => `<option ${V.psize === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label><span class="muted">${lista.length} prompts</span></div>` +
      (lista.length ? `<div class="card"><div class="table-scroll"><table class="v2-table v2-prompts"><thead><tr><th><button type="button" class="v2-sort ${k === 'text' ? 'on' : ''}" data-v2psort="text">Prompt</button></th>${cols.map(c => `<th><button type="button" class="v2-sort ${k === c[0] ? 'on' : ''}" data-v2psort="${c[0]}">${esc(c[1])}${k === c[0] ? (dir > 0 ? ' ↑' : ' ↓') : ''}</button></th>`).join('')}</tr></thead>
        <tbody>${pagina.map(x => `<tr class="v2-click" data-v2prompt="${esc(x.promptId)}" tabindex="0"><td class="v2-ptext">${esc(x.meta.text)}${x.meta.isBranded ? ' <span class="v2-chip" style="--chip:#cc7800">branded</span>' : ''}${x.errors ? ` <small class="v2-err">${x.errors} con error</small>` : ''}</td>${cols.map(c => `<td>${celda(x, c[0])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <div class="pagination"><span>Página ${V.ppage} de ${pages}</span><div class="pages"><button type="button" class="page-btn" data-v2ppage="-1" ${V.ppage === 1 ? 'disabled' : ''} aria-label="Anterior">‹</button><button type="button" class="page-btn" data-v2ppage="1" ${V.ppage === pages ? 'disabled' : ''} aria-label="Siguiente">›</button></div></div></div>`
        : `<div class="card">${vacio('No hay prompts con respuestas en este periodo', 'Amplía el rango, cambia los motores o quita filtros de tags.')}</div>`);
  }

  // Drawer
  const drawer = document.createElement('aside');
  drawer.tabIndex=-1; drawer.setAttribute('aria-label','Detalle del monitor');
  drawer.className = 'v2-drawer'; drawer.id = 'v2Drawer'; drawer.hidden = true; drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true');
  const velo = document.createElement('div');
  velo.className = 'v2-veil'; velo.hidden = true;
  document.body.append(velo, drawer);
  let foco = null;
  function abrirDrawer(html) {
    if (drawer.hidden) foco = document.activeElement;
    drawer.innerHTML = html; drawer.hidden = false; velo.hidden = false; document.body.classList.add('v2-locked');
    drawer.scrollTop = 0; (drawer.querySelector('[data-v2close]') || drawer).focus();
  }
  function cerrarDrawer(silencio) {
    if (drawer.hidden) return;
    drawer.hidden = true; velo.hidden = true; document.body.classList.remove('v2-locked'); V.drawer = null;
    if (!silencio && foco) foco.focus();
  }
  velo.addEventListener('click', () => cerrarDrawer());
  document.addEventListener('keydown', e => {
    if(drawer.hidden)return;
    if(e.key==='Escape'){e.preventDefault();cerrarDrawer();return;}
    if(e.key==='Tab'){
      const controls=[...drawer.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(n=>!n.hidden&&n.getClientRects().length);
      const first=controls[0],last=controls[controls.length-1];
      if(!first){e.preventDefault();drawer.focus();return;}
      if(e.shiftKey&&(document.activeElement===first||document.activeElement===drawer)){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  const cabDrawer = titulo => `<div class="v2-drawer-head"><div><div class="orange-label">${esc(V.preset === 'all' ? 'Todo el historial' : dateLabel(periodoActual().start, true) + ' – ' + dateLabel(periodoActual().end, true))} · ${M.models.size === MON.models.length ? 'todos los motores' : [...M.models].map(id => MODEL.get(id).short || MODEL.get(id).name).join(', ')}${V.tags.size ? ' · ' + esc([...V.tags].join(', ')) : ''}</div><h2>${titulo}</h2></div><button type="button" class="close-x" data-v2close aria-label="Cerrar">×</button></div>`;

  function abrirPrompt(promptId, tab = 'resumen', respuestaId = null) {
    V.drawer = { promptId, tab, respuestaId };
    const p = promptMeta(promptId);
    const r = filas().filter(o => o.promptId === promptId);
    const marcas = BRANDS(), own = OWN();
    if (respuestaId) { abrirDrawer(cabDrawer(esc(p.text)) + vistaRespuesta(MON.observations.find(o => o.id === respuestaId), promptId)); return; }
    const x = G.porPrompt(r, [], marcas)[0] || { valid: 0, responsesMentioning: 0, totalMentions: 0, ownCitations: 0, totalCitations: 0, competitors: [], sentiment: null };
    let cuerpo = '';
    if (tab === 'resumen') {
      const rk = G.ranking(r, [], marcas).filter(b => b.responsesMentioning > 0);
      const c = G.urls(r, marcas, MON.domainCategories || {});
      const s = G.serie(r, rk.slice(0, 6).map(b => b.brand), 'coverage', 'day');
      cuerpo = `<div class="v2-cards">${[['Volumen de intención', volBar(p.intentVolume)], ['Menciones de marca', n1(x.responsesMentioning)], ['Sentimiento', sentBar(x.sentiment)], ['Citas de dominio propio', n1(x.ownCitations)], ['Citas totales', n1(x.totalCitations)], ['Competidores', n1(x.competitors.length)]].map(([l, v]) => `<div class="v2-mini"><span>${l}</span><b>${v}</b></div>`).join('')}</div>
        <h3>Ranking de marcas en este prompt</h3>${rk.length ? `<div class="table-scroll"><table class="v2-table"><thead><tr><th>Marca</th><th>Cobertura</th><th>Sentimiento</th><th>Menciones</th><th>Citas</th></tr></thead><tbody>${rk.map(b => `<tr class="${b.brand.isOwn ? 'v2-own' : ''}"><td>${brandCell(b.brand)}</td><td>${pctTxt(b.coverage)}</td><td>${sentBar(b.sentiment)}</td><td>${b.totalMentions}</td><td>${c.filter(u => (b.brand.domains || []).some(d => u.domain === d || u.domain.endsWith('.' + d))).reduce((a, u) => a + u.citations, 0)}</td></tr>`).join('')}</tbody></table></div>` : vacio('Ninguna marca seguida aparece', 'Las respuestas válidas de este prompt no mencionan bancos seguidos.')}
        <h3>Cobertura por marca en el tiempo</h3>${lineChart({ dates: s.dates, series: s.series.map(z => ({ key: z.brand.id, name: z.brand.name, color: z.brand.color, own: z.brand.isOwn, values: z.values })), height: 200 })}`;
    } else if (tab === 'respuestas') {
      const orden = r.slice().sort((a, b) => b.date.localeCompare(a.date) || a.modelId.localeCompare(b.modelId));
      cuerpo = orden.length ? `<div class="table-scroll"><table class="v2-table"><thead><tr><th>Respuesta</th><th>Sentimiento</th><th>${esc(own.name)}</th><th>Dominio citado</th><th>Competidores</th><th>Corrida</th></tr></thead><tbody>${orden.map(o => {
        const men = G.menciones(o, marcas);
        const comp = men.filter(m => m.brandId !== own.id);
        const ex = String(o.response || o.error || '').replace(/[#*_`>|]/g, '').slice(0, 140);
        return `<tr class="v2-click" data-v2resp="${esc(o.id)}" tabindex="0"><td>${engineBadge(o.modelId, true)} <span class="v2-excerpt">${G.esValida(o) ? esc(ex) || '<i>Sin texto guardado</i>' : '<span class="v2-err">Error: ' + esc(o.error || 'sin respuesta') + '</span>'}</span></td><td>${sentBar(men.find(m => m.brandId === own.id)?.sentiment ?? null)}</td><td>${!G.esValida(o) ? '—' : o.brandMentioned ? '✓ Sí' : '✕ No'}</td><td>${!G.esValida(o) ? '—' : o.brandCited ? '✓ Sí' : '✕ No'}</td><td><span class="v2-logos">${comp.slice(0, 4).map(m => logo(brandById(m.brandId))).join('')}</span></td><td>${esc(dateLabel(o.date, true))}</td></tr>`;
      }).join('')}</tbody></table></div>` : vacio('Sin respuestas en el periodo', 'Amplía el rango o activa más motores.');
    } else {
      const c = G.urls(r, marcas, MON.domainCategories || {});
      cuerpo = c.length ? `<div class="table-scroll"><table class="v2-table"><thead><tr><th>URL</th><th>¿Menciona a ${esc(own.name)}?</th><th>Veces citada</th><th>Categoría</th><th>Dominio</th><th>Competidores</th></tr></thead><tbody>${c.map(u => `<tr><td><a href="${esc(u.url)}" target="_blank" rel="noopener" class="v2-url">${esc(tituloUrl(u))}</a></td><td>${{ yes: 'Sí', no: 'No', na: 'N/A (propia)' }[u.mentionsOwnBrand]}</td><td>${u.citations}</td><td>${catChip(u.category)}</td><td>${esc(u.domain)}</td><td><span class="v2-logos">${u.competitorsMentioned.map(id => logo(brandById(id))).join('')}</span></td></tr>`).join('')}</tbody></table></div>` : vacio('Sin citas', 'Ninguna respuesta del periodo citó fuentes para este prompt.');
    }
    abrirDrawer(cabDrawer(esc(p.text)) + `<div class="v2-tabs" role="tablist">${[['resumen', 'Resumen'], ['respuestas', `Respuestas (${r.length})`], ['citas', 'Citas']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${tab === k}" class="${tab === k ? 'active' : ''}" data-v2dtab="${k}">${l}</button>`).join('')}</div><div class="v2-drawer-body">${cuerpo}</div>`);
  }
  // Markdown mínimo: títulos, negritas, listas, tablas con |, enlaces y [n].
  function markdown(texto) {
    // Copias de las apps (Trinity) traen marcadores de imagen sin URL («![Banco BBVA]») y escapes de markdown («1\\.»).
    const lineas = String(texto || '').replace(/!\[[^\]]*\](\([^)]*\))?/g, '').replace(/\\([.\-:*_#!()[\]>])/g, '$1').split(/\r?\n/);
    const inline = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\[(\d{1,2})\]/g, '<sup>[$1]</sup>');
    let html = '', lista = null, tabla = [];
    const cerrar = () => {
      if (lista) { html += `</${lista}>`; lista = null; }
      if (tabla.length) {
        const filasT = tabla.filter(f => !/^\s*\|?\s*:?-{2,}/.test(f)).map(f => f.replace(/^\s*\||\|\s*$/g, '').split('|').map(c => inline(c.trim())));
        html += `<div class="table-scroll"><table class="v2-table"><thead><tr>${filasT[0].map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${filasT.slice(1).map(f => `<tr>${f.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
        tabla = [];
      }
    };
    for (const l of lineas) {
      if (/^\s*\|.*\|\s*$/.test(l)) { if (lista) { html += `</${lista}>`; lista = null; } tabla.push(l); continue; }
      if (tabla.length) cerrar();
      const h = l.match(/^(#{1,4})\s+(.*)$/), ul = l.match(/^\s*[-*•]\s+(.*)$/), ol = l.match(/^\s*\d+[.)]\s+(.*)$/);
      if (h) { cerrar(); html += `<h${Math.min(6, h[1].length + 2)}>${inline(h[2])}</h${Math.min(6, h[1].length + 2)}>`; }
      else if (ul || ol) { const t = ul ? 'ul' : 'ol'; if (lista !== t) { cerrar(); html += `<${t}>`; lista = t; } html += `<li>${inline((ul || ol)[1])}</li>`; }
      else if (!l.trim()) cerrar();
      else { cerrar(); html += `<p>${inline(l)}</p>`; }
    }
    cerrar();
    return html;
  }
  function vistaRespuesta(o, promptId) {
    if (!o) return vacio('Respuesta no disponible', 'No se encontró la corrida.');
    const marcas = BRANDS(), men = G.menciones(o, marcas);
    const presentes = new Set(men.map(m => m.brandId));
    return `<div class="v2-drawer-body"><button type="button" class="text-button" data-v2back="${esc(promptId)}">← Volver a las respuestas</button>
      <div class="v2-resp-meta">${engineBadge(o.modelId)} <span>${esc(dateLabel(o.date, true))}</span>${/Trinity/.test(o.source || '') ? '<span class="v2-chip" style="--chip:#7c3aed">Histórico Trinity</span>' : ''}${o.timestamp ? `<span class="muted">${esc(String(o.timestamp).slice(11, 16))} UTC</span>` : ''}${o.isExample ? '<span class="v2-chip" style="--chip:#cc7800">Ejemplo</span>' : ''}</div>
      <div class="v2-resp-grid"><article class="v2-resp-text">${G.esValida(o) ? (o.response ? markdown(o.response) : /Trinity/.test(o.source || '') ? '<p class="muted">Respuesta importada del histórico de Trinity (Pymes): el PDF trae las métricas, las marcas en orden y si citó viabcp.com, pero no el texto. Se completa al cargar el export de respuestas de Trinity.</p>' : '<p class="muted">El texto completo está en el Google Sheet (pestaña del día).</p>') : `<div class="v2-alert red">La corrida falló: ${esc(o.error || 'sin respuesta')}. No cuenta en las métricas.</div>`}
        ${o.screenshotUrl ? `<img src="${esc(o.screenshotUrl)}" alt="Captura de la respuesta" class="v2-shot">` : ''}</article>
      <aside><h3>Presencia y sentimiento de marca</h3><ul class="v2-presence">${marcas.filter(b => presentes.has(b.id) || b.isOwn).map(b => { const m = men.find(x => x.brandId === b.id); return `<li>${brandCell(b)}<span>${m ? '✓' : '✕'}</span>${m ? `<small>#${m.rank}</small>${sentBar(m.sentiment)}${m.recommended ? '<span class="v2-chip" style="--chip:#1d8b3d">recomendada</span>' : ''}` : ''}</li>`; }).join('')}</ul>
      <h3>Fuentes (${(o.sources || []).length})</h3><ol class="v2-sources">${(o.sources || []).slice(0, 12).map(s => `<li><a href="${esc(s.url || 'https://' + s.domain)}" target="_blank" rel="noopener">${esc(s.title || s.domain)}</a><small>${esc(s.domain)}</small></li>`).join('')}</ol>${(o.sources || []).length > 12 ? `<details><summary>Ver todas</summary><ol start="13" class="v2-sources">${o.sources.slice(12).map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.domain)}</a></li>`).join('')}</ol></details>` : ''}
      ${(o.searchQueries || []).length ? `<h3>Búsquedas del motor</h3><ul class="v2-queries">${o.searchQueries.map(q => `<li>${esc(q)}</li>`).join('')}</ul>` : ''}</aside></div></div>`;
  }
  // El modal «Ver detalle» de la vista de proyecto abre el drawer.
  if (prev.showResponse) {
    showResponse = function (id, date = null) {
      const obs = MON.observations.filter(o => o.promptId === id);
      if (!obs.length) return prev.showResponse(id, date);
      if (date) {
        const o = obs.find(x => x.date === date && M.models.has(x.modelId)) || obs.find(x => x.date === date);
        if (o) return abrirPrompt(id, 'respuestas', o.id);
      }
      abrirPrompt(id, 'respuestas');
    };
  }

  // ─── V3 · Citas y fuentes ─────────────────────────────────────────────────
  function renderCitas() {
    const r = filas(), pr = previas(), cats = MON.domainCategories || {};
    const previo = hayPrevio(pr);
    if (!previo && V.utab !== 'fav') V.utab = 'top';
    const c = G.cambiosCitas(r, previo ? pr : [], BRANDS(), cats);
    const gan = c.filter(u => u.change > 0).sort((a, b) => b.change - a.change).slice(0, 5);
    const per = c.filter(u => u.change < 0).sort((a, b) => a.change - b.change).slice(0, 5);
    const sinAnterior = !previo;
    const msgPrevio = periodoActual().previous ? 'No hay corridas en el periodo anterior: los cambios aparecerán cuando haya dos periodos con datos.' : 'Elige un rango con periodo anterior para comparar.';
    const tarjeta = (titulo, xs, vacioTxt) => `<section class="card dashboard-card"><h2>${titulo}</h2>${xs.length ? `<ul class="v2-list">${xs.map(u => `<li><a class="v2-url" href="${esc(u.url)}" target="_blank" rel="noopener">${esc(tituloUrl(u))}</a><span>${u.previous} → <b>${u.citations}</b> ${dlt(u.change, '', false, 0)}</span></li>`).join('')}</ul>` : vacio('Sin datos', vacioTxt)}</section>`;
    const tabs = [['top', 'Top'], ['new', 'Nuevas'], ['increased', 'Subiendo'], ['stable', 'Estables'], ['decreased', 'Bajando'], ['lost', 'Perdidas'], ['fav', '★ Favoritas']];
    const q = G.norm(V.uq);
    let lista = (V.utab === 'top' ? c.filter(u => u.citations > 0) : V.utab === 'fav' ? c.filter(u => V.favs.has(u.url)) : c.filter(u => u.status === V.utab)).filter(u => !q || G.norm(u.url).includes(q) || G.norm(u.title).includes(q));
    lista.sort((a, b) => b.citations - a.citations || b.previous - a.previous);
    const pages = Math.max(1, Math.ceil(lista.length / 20)); V.upage = Math.min(V.upage, pages);
    const own = OWN();
    const doms = G.dominios(r, BRANDS(), cats);
    const dpages = Math.max(1, Math.ceil(doms.length / 10)); V.dpage = Math.min(V.dpage, dpages);
    const mix = G.mixCategorias(r, BRANDS(), cats);
    // Cobertura de dominio en el tiempo: propio vs dominios de competidores.
    const fechas = [...new Set(r.map(o => o.date))].sort();
    const seguidos = [own].concat(BRANDS().filter(b => !b.isOwn && doms.some(d => (b.domains || []).some(x => d.domain === x || d.domain.endsWith('.' + x)))).slice(0, 4));
    const serieDom = seguidos.map(b => ({ key: b.id, name: (b.domains || [])[0] || b.name, color: b.color, own: b.isOwn, values: fechas.map(f => { const g = r.filter(o => o.date === f); return G.promedio([...(b.domains || [])].map(d => G.coberturaDominio(g, d))) === null ? null : Math.max(...(b.domains || []).map(d => G.coberturaDominio(g, d) || 0)); }) }));
    V.exportar = () => ['citas', [['URL', 'Título', 'Veces citada', 'Periodo anterior', 'Estado', `¿Menciona a ${own.name}?`, 'Dominio', 'Categoría', 'Competidores']].concat(lista.map(u => [u.url, u.title, u.citations, u.previous, u.status, u.mentionsOwnBrand, u.domain, (CATEGORIAS[u.category] || [u.category])[0], u.competitorsMentioned.map(id => brandById(id).name).join(' ')]))];
    $('#generalView').innerHTML = pageIntro('Citas y fuentes', 'Qué URLs y dominios usan los motores, de qué tipo son y cómo cambian.', 'Reporte de marca') +
      `<div class="dashboard-grid">${tarjeta('Ganadores', sinAnterior ? [] : gan, sinAnterior ? msgPrevio : 'Ninguna URL sube vs el periodo anterior.')}${tarjeta('Perdedores', sinAnterior ? [] : per, sinAnterior ? msgPrevio : 'Ninguna URL baja vs el periodo anterior.')}</div>
      <section class="card dashboard-card"><div class="dash-card-header"><div><h2>Explorador de URLs</h2><p class="sub">${lista.length} URLs${previo ? ' · estado vs periodo anterior' : ' · sin periodo anterior para comparar'}</p></div><label class="v2-search">${icon('search')}<input type="search" id="v2UrlQ" placeholder="Buscar dominio o URL…" value="${esc(V.uq)}"></label></div>${seg('v2utab', V.utab, previo ? tabs : tabs.filter(t => t[0] === 'top' || t[0] === 'fav'))}
        ${lista.length ? `<div class="table-scroll"><table class="v2-table"><thead><tr><th>★</th><th>URL</th><th>Veces citada</th><th>¿Menciona a ${esc(own.name)}?</th><th>Dominio</th><th>Categoría</th><th>Competidores en la página</th></tr></thead><tbody>${lista.slice((V.upage - 1) * 20, V.upage * 20).map(u => `<tr><td><button type="button" class="v2-star ${V.favs.has(u.url) ? 'on' : ''}" data-v2fav="${esc(u.url)}" aria-label="Favorita">★</button></td><td><a class="v2-url" href="${esc(u.url)}" target="_blank" rel="noopener" title="${esc(u.url)}">${esc(tituloUrl(u))}</a></td><td>${u.citations} ${previo && u.status !== 'stable' ? dlt(u.change, '', false, 0) : ''}</td><td>${{ yes: 'Sí', no: '<b class="v2-err">No</b>', na: 'N/A' }[u.mentionsOwnBrand]}</td><td>${esc(u.domain)}</td><td>${catChip(u.category)}</td><td><span class="v2-logos">${u.competitorsMentioned.slice(0, 5).map(id => logo(brandById(id))).join('')}</span></td></tr>`).join('')}</tbody></table></div>
        <div class="pagination"><span>Página ${V.upage} de ${pages}</span><div class="pages"><button type="button" class="page-btn" data-v2upage="-1" ${V.upage === 1 ? 'disabled' : ''}>‹</button><button type="button" class="page-btn" data-v2upage="1" ${V.upage === pages ? 'disabled' : ''}>›</button></div></div>` : vacio('Sin URLs', 'No hay URLs en este estado con los filtros actuales.')}</section>
      <div class="dashboard-grid"><section class="card dashboard-card"><h2>Fuentes por categoría</h2>${mix.length ? barras(mix, { valor: x => x.share, etiqueta: x => catChip(x.category), color: x => (CATEGORIAS[x.category] || CATEGORIAS.unclassified)[1] }) : vacio('Sin citas', 'No hay citas en el periodo.')}</section>
        <section class="card dashboard-card"><h2>Cobertura de dominio en el tiempo ${tip(FORMULAS.domainCoverage)}</h2>${lineChart({ dates: fechas, series: serieDom, height: 200 })}${leyenda(serieDom, 'v2noop')}</section></div>
      <section class="card dashboard-card"><div class="dash-card-header"><div><h2>Dominios</h2><p class="sub">Corrige la categoría: se guarda en la pestaña _dominios del Sheet</p></div></div>
        ${doms.length ? `<div class="table-scroll"><table class="v2-table"><thead><tr><th>Dominio</th><th>Categoría</th><th>Cobertura ${tip(FORMULAS.domainCoverage)}</th><th>Citas</th><th>URLs</th></tr></thead><tbody>${doms.slice((V.dpage - 1) * 10, V.dpage * 10).map(d => `<tr><td>${esc(d.domain)}</td><td><select class="v2-catsel" data-v2dom="${esc(d.domain)}" aria-label="Categoría de ${esc(d.domain)}">${Object.entries(CATEGORIAS).map(([k, v]) => `<option value="${k}" ${d.category === k ? 'selected' : ''}>${v[0]}</option>`).join('')}</select></td><td>${pctTxt(d.coverage)}</td><td>${d.citations}</td><td>${d.urls}</td></tr>`).join('')}</tbody></table></div>
        <div class="pagination"><span>Página ${V.dpage} de ${dpages}</span><div class="pages"><button type="button" class="page-btn" data-v2dpage="-1" ${V.dpage === 1 ? 'disabled' : ''}>‹</button><button type="button" class="page-btn" data-v2dpage="1" ${V.dpage === dpages ? 'disabled' : ''}>›</button></div></div>` : vacio('Sin dominios', 'No hay citas en el periodo.')}</section>`;
  }
  async function guardarDominio(dominio, categoria, sel) {
    sel.disabled = true;
    try {
      if (LIVE) await api('/geo-domain-save', { dominio, categoria });
      MON.domainCategories = Object.assign({}, MON.domainCategories, { [dominio]: categoria });
      toast(LIVE ? `${dominio} → ${CATEGORIAS[categoria][0]} · guardado en el Sheet` : 'Demo: el cambio no se guarda en el Sheet');
      renderCitas();
    } catch (e) { toast('No se guardó: ' + e.message); sel.disabled = false; }
  }

  // ─── V4 · Índice de visibilidad ───────────────────────────────────────────
  const COLOR_CUADRANTE = { leaders: '#1d8b3d', niche: '#2563eb', low_conversion: '#cc7800', underperformers: '#94a3b8' };
  // Umbrales: «mercado» (media de las marcas con muestra suficiente) o fijos (30 % / 50 %).
  function umbrales(rk) {
    if (V.thrMode === 'fixed') return V.thr;
    const u = G.umbralesMercado(rk);
    return u ? { coverage: Math.round(u.coverage), probability: Math.round(u.probability) } : V.thr;
  }
  const conMuestra = x => x.responsesMentioning > 0 && x.purchaseProbability !== null && (x.probabilitySample || 0) >= G.MUESTRA_MINIMA;
  function puntos(r, thr) {
    const rk = G.ranking(r, [], BRANDS());
    thr = thr || umbrales(rk);
    return rk.filter(conMuestra).map(x => ({ brand: x.brand, x: x.coverage, y: x.purchaseProbability, q: G.cuadrante(x.coverage, x.purchaseProbability, thr), thr }));
  }
  function scatter(pts, { small = false } = {}) {
    const W = small ? 360 : 640, H = small ? 240 : 400, L = 40, B = 30, T = 12, R = 12;
    const x = v => L + (v / 100) * (W - L - R), y = v => H - B - (v / 100) * (H - T - B);
    const thr = (pts[0] && pts[0].thr) || V.thr;
    const tx = x(thr.coverage), ty = y(thr.probability);
    const zonas = [['Líderes', 'leaders', tx, T, W - R - tx, ty - T, 'end', 'top'], ['Nicho', 'niche', L, T, tx - L, ty - T, 'start', 'top'], ['Baja conversión', 'low_conversion', tx, ty, W - R - tx, H - B - ty, 'end', 'bottom'], ['Bajo desempeño', 'underperformers', L, ty, tx - L, H - B - ty, 'start', 'bottom']];
    return `<svg class="v2-scatter" viewBox="0 0 ${W} ${H}" role="img" aria-label="Índice de visibilidad">${zonas.map(([n, k, zx, zy, w, h, al, va]) => `<rect x="${zx}" y="${zy}" width="${Math.max(0, w)}" height="${Math.max(0, h)}" fill="${COLOR_CUADRANTE[k]}" opacity=".07"/>${w > 60 && h > 22 ? `<text x="${al === 'end' ? zx + w - 6 : zx + 6}" y="${va === 'top' ? zy + 14 : zy + h - 6}" text-anchor="${al}" class="q" fill="${COLOR_CUADRANTE[k]}">${n}</text>` : ''}`).join('')}
      <line x1="${tx}" x2="${tx}" y1="${T}" y2="${H - B}" class="thr"/><line x1="${L}" x2="${W - R}" y1="${ty}" y2="${ty}" class="thr"/>
      ${[0, 25, 50, 75, 100].map(v => `<text x="${x(v)}" y="${H - 10}" text-anchor="middle">${v}%</text><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}%</text>`).join('')}
      ${pts.map(p => `<g class="v2-dot" style="transform:translate(${x(p.x).toFixed(1)}px,${y(p.y).toFixed(1)}px)"><circle r="${p.brand.isOwn ? 13 : 10}" fill="${p.brand.color}"/><text text-anchor="middle" y="4" fill="#fff">${esc(p.brand.name.charAt(0))}</text><title>${esc(p.brand.name)}: cobertura ${pctTxt(p.x)}, probabilidad ${pctTxt(p.y)}</title></g>`).join('')}</svg><p class="v2-scatter-cap">Eje X: cobertura de marca · eje Y: probabilidad de compra · ${pts.map(p => esc(p.brand.name.charAt(0)) + ' = ' + esc(p.brand.name)).join(' · ')}</p>`;
  }
  const sinProbabilidad = 'El Analista marca si cada respuesta <b>recomienda</b> la marca desde la versión v2. Aparecerá con las próximas corridas.';
  function miniIndice(r) {
    const pts = puntos(r);
    return `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>Índice de visibilidad</h2><p class="sub">Cobertura × probabilidad de compra</p></div><button type="button" class="text-button" data-nav="visibilidad">Ver índice →</button></div>${pts.length ? scatter(pts, { small: true }) : vacio('Aún sin probabilidad de compra', sinProbabilidad)}</section>`;
  }
  function renderVisibilidad() {
    const r = filas(), pr = previas();
    const fechas = [...new Set(r.map(o => o.date))].sort();
    const idx = V.lapseIdx === null ? fechas.length - 1 : Math.min(V.lapseIdx, fechas.length - 1);
    // Time-lapse: a cada fecha, lo acumulado del periodo hasta ese día.
    const hasta = fechas[idx];
    const rk = G.ranking(r, pr, BRANDS()).filter(x => x.responsesMentioning > 0);
    const thr = umbrales(rk);
    const pts = puntos(hasta ? r.filter(o => o.date <= hasta) : r, thr);
    const cuad = x => (conMuestra(x) ? G.cuadrante(x.coverage, x.purchaseProbability, thr) : null);
    V.exportar = () => ['indice_visibilidad', [['Marca', 'Cuadrante', 'Cobertura %', 'Δ cobertura', 'Probabilidad de compra %', 'Δ probabilidad']].concat(rk.map(x => [x.brand.name, G.CUADRANTES[cuad(x)] || 'Muestra insuficiente', G.redondear(x.coverage), G.redondear(x.delta.coverage), G.redondear(x.purchaseProbability), G.redondear(x.delta.purchaseProbability)]))];
    $('#generalView').innerHTML = pageIntro('Índice de visibilidad', 'Cada marca según su cobertura y la probabilidad de que el motor la recomiende.', 'Reporte de marca') +
      `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>Cuadrante</h2><p class="sub">${tip(FORMULAS.coverage + ' ' + FORMULAS.probability)} Umbrales configurables</p></div>
        <div class="v2-row v2-thr">${seg('v2thr', V.thrMode, [['market', 'Promedio del mercado'], ['fixed', 'Umbral fijo']])}${V.thrMode === 'fixed' ? `<label for="v2ThrC">Cobertura ≥ <span class="v2-num"><input type="number" min="0" max="100" id="v2ThrC" value="${V.thr.coverage}"><span>%</span></span></label><label for="v2ThrP">Probabilidad ≥ <span class="v2-num"><input type="number" min="0" max="100" id="v2ThrP" value="${V.thr.probability}"><span>%</span></span></label>` : `<span class="v2-thr-note">Cortes: cobertura ${fmt(thr.coverage, 0)}% · probabilidad ${fmt(thr.probability, 0)}%</span>`}</div></div>
        <p class="v2-help">${V.thrMode === 'fixed' ? 'Umbrales absolutos del benchmark (30% / 50%).' : 'Los cortes son el promedio del mercado: cobertura media de los bancos con muestra suficiente y probabilidad de compra de todas sus respuestas. El cuadrante muestra quién está por encima o por debajo.'} Solo se ubican marcas con al menos ${G.MUESTRA_MINIMA} respuestas que permitan medir si el motor las recomienda.</p>
        ${pts.length ? scatter(pts) : vacio('Aún sin probabilidad de compra', sinProbabilidad)}
        ${fechas.length > 1 ? `<div class="v2-lapse"><button type="button" class="button" id="v2Play">${V.lapse ? '❚❚ Pausar' : '▶ Reproducir time-lapse'}</button><input type="range" id="v2Lapse" min="0" max="${fechas.length - 1}" value="${idx}" aria-label="Fecha"><span>Hasta ${esc(dateLabel(hasta, true))}</span></div>` : ''}</section>
      <section class="card dashboard-card"><h2>Marcas por cuadrante</h2>${rk.length ? `<div class="table-scroll"><table class="v2-table"><thead><tr><th>Marca</th><th>Cuadrante</th><th>Cobertura</th><th>Probabilidad de compra</th></tr></thead><tbody>${rk.map(x => { const q = cuad(x); return `<tr class="${x.brand.isOwn ? 'v2-own' : ''}"><td>${brandCell(x.brand)}</td><td>${q ? `<span class="v2-chip" style="--chip:${COLOR_CUADRANTE[q]}">${G.CUADRANTES[q]}</span>` : `<span class="muted" title="Menos de ${G.MUESTRA_MINIMA} respuestas con dato de recomendación">Muestra insuficiente (n=${x.probabilitySample || 0})</span>`}</td><td>${pctTxt(x.coverage)} ${dlt(x.delta.coverage)}</td><td>${conMuestra(x) ? pctTxt(x.purchaseProbability) + ' ' + dlt(x.delta.purchaseProbability) : '<span class="muted">—</span>'}</td></tr>`; }).join('')}</tbody></table></div>` : vacio('Sin marcas', 'No hay respuestas válidas con estos filtros.')}</section>`;
  }
  function timeLapse() {
    if (V.lapse) { clearInterval(V.lapse); V.lapse = null; renderVisibilidad(); return; }
    const total = new Set(filas().map(o => o.date)).size;
    V.lapseIdx = 0;
    V.lapse = setInterval(() => {
      if (M.route !== 'visibilidad' || V.lapseIdx >= total - 1) { clearInterval(V.lapse); V.lapse = null; if (M.route === 'visibilidad') renderVisibilidad(); return; }
      V.lapseIdx++; renderVisibilidad();
    }, 900);
    renderVisibilidad();
  }

  // ─── V5 · Recomendaciones ─────────────────────────────────────────────────
  const IMPACTO = { high: ['Alto', '#d02c2a'], medium: ['Medio', '#cc7800'], low: ['Bajo', '#64748b'] };
  const ESTADOS = [['suggested', 'Sugeridas'], ['todo', 'Por hacer'], ['in_progress', 'En progreso'], ['done', 'Hechas'], ['archived', 'Archivo']];
  const CAT_REC = { content: 'Contenido', prompts: 'Prompts', technical: 'Técnica', offpage: 'Off-page' };
  const ALCANCE = { on_page: 'On-page', off_page: 'Off-page', general: 'General' };
  function recs() {
    return G.recomendaciones({ rows: filas(), prompts: promptsReales(), marcas: BRANDS(), categorias: MON.domainCategories || {}, audits: GEO_AUDIT_ENABLED ? MON.audits || [] : [], estados: MON.recStates || {} });
  }
  function renderRecsV2() {
    const todas = recs();
    const q = G.norm(V.recQ), f = V.recF;
    let lista = todas.filter(r => r.status === V.recTab && (!f.category || r.category === f.category) && (!f.scope || r.scope === f.scope) && (!f.impact || r.impact === f.impact) && (!q || G.norm(r.title + ' ' + r.reasoning).includes(q)));
    if (V.recSort === 'date') lista.sort((a, b) => String(b.doneAt || '').localeCompare(String(a.doneAt || '')));
    const sel = (id, actual, opciones, todasTxt) => `<select id="${id}"><option value="">${todasTxt}</option>${Object.entries(opciones).map(([k, v]) => `<option value="${k}" ${actual === k ? 'selected' : ''}>${Array.isArray(v) ? v[0] : v}</option>`).join('')}</select>`;
    V.exportar = () => ['recomendaciones', [['Título', 'Tipo', 'Categoría', 'Alcance', 'Impacto', 'Estado', 'Responsable', 'Fecha objetivo', 'Razonamiento', 'Prompt origen', 'URLs de referencia']].concat(lista.map(r => [r.title, r.type, CAT_REC[r.category], ALCANCE[r.scope], IMPACTO[r.impact][0], r.status, r.owner, r.dueDate, r.reasoning, r.evidence.promptId ? promptMeta(r.evidence.promptId).text : '', (r.evidence.competitorUrls || []).join(' ')]))];
    $('#generalView').innerHTML = pageIntro('Recomendaciones', 'Recomendaciones para mejorar la visibilidad, a partir de los datos del periodo.', 'Reporte de marca') +
      `<div class="ux-ai-notice">${menuIcon('spark')}<span><b>Redactado por IA</b> · Plantillas asistidas por IA, completadas con reglas y evidencias del monitor. Revisa cada propuesta antes de ejecutarla.</span></div>
      <div class="v2-tabs" role="tablist">${ESTADOS.map(([k, l]) => `<button type="button" role="tab" aria-selected="${V.recTab === k}" class="${V.recTab === k ? 'active' : ''}" data-v2rtab="${k}">${l} (${todas.filter(r => r.status === k).length})</button>`).join('')}</div>
      <div class="card v2-toolbar"><label class="v2-search">${icon('search')}<input type="search" id="v2RecQ" placeholder="Buscar…" value="${esc(V.recQ)}"></label>${sel('v2RecCat', f.category, CAT_REC, 'Todas las categorías')}${sel('v2RecScope', f.scope, ALCANCE, 'Todo alcance')}${sel('v2RecImp', f.impact, IMPACTO, 'Todo impacto')}<select id="v2RecSort"><option value="impact" ${V.recSort === 'impact' ? 'selected' : ''}>Orden: impacto</option><option value="date" ${V.recSort === 'date' ? 'selected' : ''}>Orden: fecha</option></select></div>
      <div class="card">${lista.length ? `<ul class="v2-recs">${lista.map(r => `<li><span class="v2-impact" style="--chip:${IMPACTO[r.impact][1]}" title="Impacto ${IMPACTO[r.impact][0]}">●</span><button type="button" class="v2-link" data-v2rec="${esc(r.id)}">${esc(r.title)}</button><span class="v2-chip" style="--chip:#475569">${CAT_REC[r.category]}</span><span class="v2-chip" style="--chip:#64748b">${ALCANCE[r.scope]}</span><span class="muted">${r.engine ? esc((MODEL.get(r.engine) || {}).name) : 'Todos los motores'}</span>
        <span class="v2-quick">${r.status !== 'todo' ? `<button type="button" class="text-button" data-v2recmove="${esc(r.id)}" data-to="todo">→ Por hacer</button>` : ''}${r.status !== 'archived' ? `<button type="button" class="text-button" data-v2recmove="${esc(r.id)}" data-to="archived" aria-label="Descartar">✕</button>` : ''}</span></li>`).join('')}</ul>` : vacio('No hay recomendaciones en este estado', V.recTab === 'suggested' ? 'Con los datos del periodo ninguna regla se activa.' : 'Mueve recomendaciones desde Sugeridas.')}</div>`;
  }
  function abrirRec(id) {
    const r = recs().find(x => x.id === id);
    if (!r) return;
    V.drawer = { rec: id };
    const p = r.evidence.promptId ? promptMeta(r.evidence.promptId) : null;
    abrirDrawer(`<div class="v2-drawer-head"><div><div class="orange-label">Recomendación · Redactado por IA</div><h2>${esc(r.title)}</h2></div><button type="button" class="close-x" data-v2close aria-label="Cerrar">×</button></div><div class="v2-drawer-body">
      <div class="v2-row"><span class="v2-chip" style="--chip:${IMPACTO[r.impact][1]}">Impacto ${IMPACTO[r.impact][0]}</span><span class="v2-chip" style="--chip:#475569">${CAT_REC[r.category]}</span><span class="v2-chip" style="--chip:#64748b">${ALCANCE[r.scope]}</span><span class="v2-chip" style="--chip:#64748b">${r.engine ? esc(MODEL.get(r.engine).name) : 'Todos los motores'}</span></div>
      <p class="ux-ai-byline">Redactado por IA · Validación humana requerida</p><h3>Razonamiento</h3><p>${esc(r.reasoning)}</p><h3>Sugerencias</h3><ol>${r.suggestions.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${p || r.evidence.suggestedHeadline || (r.evidence.competitorUrls || []).length || r.evidence.ownUrl ? `<h3>Contenido a crear</h3><dl class="v2-dl">${p ? `<dt>Prompt origen</dt><dd><button type="button" class="v2-link" data-v2prompt="${esc(p.id)}">${esc(p.text)}</button></dd>` : ''}${r.evidence.suggestedHeadline ? `<dt>Titular sugerido</dt><dd><b>${esc(r.evidence.suggestedHeadline)}</b></dd>` : ''}${(r.evidence.competitorUrls || []).length ? `<dt>URLs citadas de referencia</dt><dd><ul>${r.evidence.competitorUrls.map(u => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a></li>`).join('')}</ul></dd>` : ''}${r.evidence.ownUrl ? `<dt>URL propia</dt><dd>${esc(r.evidence.ownUrl)}</dd>` : ''}</dl>` : ''}
      <h3>Flujo de trabajo</h3><form class="v2-form" id="v2RecForm" data-id="${esc(r.id)}"><label>Estado<select name="estado">${ESTADOS.map(([k, l]) => `<option value="${k}" ${r.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label><label>Responsable<input name="responsable" value="${esc(r.owner)}" maxlength="80"></label><label>Fecha objetivo<input type="date" name="fecha_objetivo" value="${esc(r.dueDate)}"></label>${r.doneAt ? `<p class="muted">Hecha el ${esc(dateLabel(r.doneAt, true))}: compara la cobertura del prompt 14 y 30 días después.</p>` : ''}
        <div class="v2-row"><button type="submit" class="button primary">Guardar</button><button type="button" class="button" data-v2recmove="${esc(r.id)}" data-to="todo">Agregar a Por hacer</button><button type="button" class="button" data-v2recmove="${esc(r.id)}" data-to="archived">Descartar</button></div></form>
      <p class="muted small">Las recomendaciones pueden no ser exactas; valídalas antes de ejecutar.</p></div>`);
  }
  async function guardarRec(id, cambios) {
    try {
      if (LIVE) await api('/geo-recs-save', Object.assign({ id }, cambios));
      const prevE = (MON.recStates || {})[id] || {};
      const e = Object.assign({}, prevE, { status: cambios.estado || prevE.status || 'suggested' });
      if (cambios.responsable !== undefined) e.owner = cambios.responsable;
      if (cambios.fecha_objetivo !== undefined) e.dueDate = cambios.fecha_objetivo;
      if (cambios.estado === 'done' && !e.doneAt) e.doneAt = new Date().toISOString().slice(0, 10);
      MON.recStates = Object.assign({}, MON.recStates, { [id]: e });
      toast(LIVE ? 'Recomendación guardada en el Sheet' : 'Demo: el cambio no se guarda en el Sheet');
      return true;
    } catch (err) { toast('No se guardó: ' + err.message); return false; }
  }

  // ─── V6 · Prompts y tags ──────────────────────────────────────────────────
  const conPais = t => /\b(peru|peruano|peruana|lima|arequipa|trujillo|cusco|soles|sbs)\b/.test(G.norm(t));
  function renderTags() {
    const ps = promptsReales();
    const activos = ps.filter(p => p.active !== false);
    const tags = new Map();
    ps.forEach(p => p.tags.forEach(t => tags.set(t, (tags.get(t) || 0) + 1)));
    const sugeridos = ['Marca', 'Seguridad', 'Digital/App', 'Comparativos', 'Empleo/Marca empleadora', 'Productos-Ahorro', 'Productos-Plazo fijo', 'Productos-Tarjetas'].filter(t => !tags.has(t));
    const mix = ['tofu', 'mofu', 'bofu'].map(e => ({ e, n: activos.filter(p => p.funnelStage === e).length }));
    const sinPais = activos.filter(p => !conPais(p.text));
    const q = G.norm(V.pq);
    const lista = ps.filter(p => !q || G.norm(p.text).includes(q) || p.tags.some(t => G.norm(t).includes(q)));
    V.exportar = () => ['prompts_tags', [['id', 'Prompt', 'Tags', 'Proyecto', 'País', 'Volumen', 'Etapa', 'Branded', 'Activo', 'Alta']].concat(lista.map(p => [p.id, p.text, p.tags.join(' | '), (PROJECT.get(p.project) || {}).name || '', p.country, p.intentVolume, p.funnelStage, p.isBranded ? 'sí' : 'no', p.active !== false ? 'sí' : 'no', p.createdAt || '']))];
    $('#generalView').innerHTML = pageIntro('Prompts y tags', `<b>${activos.length}/${LIMITE_PROMPTS}</b> prompts activos contra el límite configurado. Crear, editar o borrar prompts: <button type="button" class="text-button" data-nav="gestion-prompts">Gestión de prompts</button>.`, 'Configuración') +
      `<div class="dashboard-grid"><section class="card dashboard-card"><h2>Tags</h2><div class="table-scroll"><table class="v2-table"><thead><tr><th>Tag</th><th>Color</th><th>Prompts</th></tr></thead><tbody>${[...tags.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `<tr><td>${tagChip(t)}</td><td><input type="color" value="${tagColor(t)}" data-v2tagcolor="${esc(t)}" aria-label="Color de ${esc(t)}"></td><td><button type="button" class="text-button" data-v2tagfilter="${esc(t)}">${n} →</button></td></tr>`).join('')}</tbody></table></div>${sugeridos.length ? `<p class="muted">Sugeridos para empezar: ${sugeridos.map(tagChip).join(' ')}</p>` : ''}</section>
        <section class="card dashboard-card"><h2>Mix por etapa del funnel</h2>${barras(mix, { valor: x => (activos.length ? (x.n / activos.length) * 100 : 0), etiqueta: x => esc(ETAPAS[x.e]), color: x => ({ tofu: '#2563eb', mofu: '#FF7800', bofu: '#1d8b3d' })[x.e], max: 100 })}
        <p class="muted">${activos.filter(p => p.isBranded).length} prompt(s) branded (nombran a ${esc(OWN().name)}). ${sinPais.length ? `<b class="v2-err">${sinPais.length} sin contexto país</b>: los motores pueden responder con bancos de otros países.` : 'Todos tienen contexto país.'}</p></section></div>
      <div class="card v2-toolbar"><label class="v2-search">${icon('search')}<input type="search" id="v2TagQ" placeholder="Buscar prompt o tag…" value="${esc(V.pq)}"></label><input id="v2TagNew" placeholder="Tag a asignar" list="v2TagList" maxlength="40"><datalist id="v2TagList">${[...tags.keys(), ...sugeridos].map(t => `<option value="${esc(t)}">`).join('')}</datalist><button type="button" class="button primary" id="v2TagAssign" ${V.sel.size ? '' : 'disabled'}>Asignar a ${V.sel.size} seleccionado(s)</button><button type="button" class="button" id="v2TagRemove" ${V.sel.size ? '' : 'disabled'}>Quitar de seleccionados</button></div>
      <div class="card"><div class="table-scroll"><table class="v2-table"><thead><tr><th><input type="checkbox" id="v2SelAll" aria-label="Seleccionar todos" ${lista.length && lista.every(p => V.sel.has(p.id)) ? 'checked' : ''}></th><th>Prompt</th><th>Tags</th><th>Proyecto</th><th>País</th><th>Volumen</th><th>Etapa</th><th>Branded</th><th>Alta</th></tr></thead><tbody>${lista.map(p => `<tr><td><input type="checkbox" data-v2sel="${esc(p.id)}" ${V.sel.has(p.id) ? 'checked' : ''} aria-label="Seleccionar"></td><td class="v2-ptext">${esc(p.text)}${p.active === false ? ' <small class="muted">(pausado)</small>' : ''}${conPais(p.text) ? '' : ' <span class="v2-chip" style="--chip:#cc7800" title="Sin contexto país">sin país</span>'}</td><td>${p.tags.map(tagChip).join(' ')}</td><td>${esc((PROJECT.get(p.project) || {}).name || '—')}</td><td>${esc(p.country)}</td><td>${volBar(p.intentVolume)}</td><td>${esc(p.funnelStage.toUpperCase())}</td><td>${p.isBranded ? 'Sí' : 'No'}</td><td>${esc(p.createdAt ? dateLabel(String(p.createdAt).slice(0, 10), true) : '—')}</td></tr>`).join('')}</tbody></table></div></div>`;
  }
  async function asignarTags(quitar) {
    const tag = (byId('v2TagNew').value || '').trim();
    if (!tag) { toast('Escribe el tag'); return; }
    if (!LIVE) { toast('Demo: los tags no se guardan en el Sheet'); return; }
    const ids = [...V.sel];
    let ok = 0;
    for (const id of ids) {
      const p = promptMeta(id);
      const nuevos = quitar ? p.tags.filter(t => t !== tag) : [...new Set(p.tags.concat(tag))];
      try { await api('/geo-prompts-save', { id, tags: nuevos }); p.tags = nuevos; ok++; toast(`Guardando ${ok}/${ids.length}…`); } catch (e) { toast(`Se guardaron ${ok}; falló ${id}: ${e.message}`); break; }
    }
    if (ok === ids.length) toast(`Tag «${tag}» ${quitar ? 'quitado de' : 'asignado a'} ${ok} prompt(s) en el Sheet`);
    renderTags();
  }

  // ─── V7 · Investigación de prompts ────────────────────────────────────────
  function renderInvestigacion() {
    const R = V.research;
    const activos = promptsReales().filter(p => p.active !== false).length;
    const cupo = Math.max(0, LIMITE_PROMPTS - activos);
    const caminos = [['keywords', 'Desde keywords SEO'], ['url', 'Desde una URL'], ['marca', 'Brainstorm de marca']];
    $('#generalView').innerHTML = pageIntro('Investigación de prompts', `Genera prompts candidatos con IA. Cupo disponible: <b>${cupo}</b> de ${LIMITE_PROMPTS}.`, 'Configuración') +
      `<div class="v2-tabs" role="tablist">${caminos.map(([k, l]) => `<button type="button" role="tab" aria-selected="${R.modo === k}" class="${R.modo === k ? 'active' : ''}" data-v2rmodo="${k}">${l}</button>`).join('')}</div>
      <form class="card v2-form" id="v2ResearchForm">${R.modo === 'keywords' ? '<label>Keywords (hasta 20, una por línea)<textarea name="keywords" rows="6" placeholder="tarjeta de crédito sin membresía&#10;cuenta sueldo"></textarea></label>' : R.modo === 'url' ? '<label>URL a analizar<input name="url" type="url" placeholder="https://www.viabcp.com/tarjetas-de-credito" required></label>' : `<p>Usa la ficha de ${esc(OWN().name)} y sus competidores (${esc(BRANDS().filter(b => !b.isOwn).map(b => b.name).join(', '))}).</p>`}
        <div class="v2-row"><label>Idioma<select name="idioma"><option value="es">Español</option><option value="en">Inglés</option></select></label><label>País<select name="pais"><option value="PE">Perú</option></select></label><button type="submit" class="button primary" ${R.loading ? 'disabled' : ''}>${R.loading ? 'Generando…' : 'Generar prompts'}</button></div></form>
      ${R.error ? `<div class="v2-alert red">${esc(R.error)}</div>` : ''}
      ${R.items.length ? `<div class="card"><div class="dash-card-header"><div><h2>Candidatos</h2><p class="sub">Selecciona y agrega a seguimiento</p></div><div class="v2-row"><label>Proyecto<select id="v2ResProj">${MON.projects.map(pr => `<option value="${esc(pr.name)}">${esc(pr.name)}</option>`).join('')}<option value="Investigación">Investigación (nuevo)</option></select></label><button type="button" class="button primary" id="v2ResAdd" ${R.pick.size && R.pick.size <= cupo ? '' : 'disabled'}>Agregar ${R.pick.size} a seguimiento</button></div></div>${R.pick.size > cupo ? `<div class="v2-alert amber">Superas el límite: quedan ${cupo} lugares.</div>` : ''}
        <div class="table-scroll"><table class="v2-table"><thead><tr><th></th><th>Prompt</th><th>Etapa</th><th>Tag sugerido</th><th>Volumen</th><th>Por qué</th></tr></thead><tbody>${R.items.map((c, i) => `<tr><td><input type="checkbox" data-v2pick="${i}" ${R.pick.has(i) ? 'checked' : ''} aria-label="Elegir"></td><td class="v2-ptext">${esc(c.prompt)}${conPais(c.prompt) ? '' : ' <span class="v2-chip" style="--chip:#cc7800">sin país</span>'}</td><td>${esc(c.etapa.toUpperCase())}</td><td>${c.tag ? tagChip(c.tag) : '—'}</td><td>${volBar(c.volumen)}</td><td class="muted">${esc(c.razon)}</td></tr>`).join('')}</tbody></table></div></div>` : ''}`;
  }
  async function investigar(form) {
    const R = V.research, fd = new FormData(form);
    R.loading = true; R.error = ''; renderInvestigacion();
    try {
      const d = await api('/geo-prompt-research', { modo: R.modo, keywords: fd.get('keywords') || '', url: fd.get('url') || '', idioma: fd.get('idioma'), pais: fd.get('pais') }, 180000);
      R.items = d.candidatos || []; R.pick = new Set(R.items.map((_, i) => i));
      if (!R.items.length) R.error = 'La IA no devolvió candidatos. Intenta con otras keywords.';
    } catch (e) { R.error = e.message; }
    R.loading = false; renderInvestigacion();
  }
  async function crearPrompts(items, proyecto) {
    if (!LIVE) { toast('Demo: los prompts no se guardan en el Sheet'); return 0; }
    let ok = 0;
    for (const c of items) {
      try {
        const d = await api('/geo-prompts-save', { prompt: c.prompt, proyecto, categoria: 'Investigación de prompts', tags: c.tag ? [c.tag] : [proyecto], etapa: c.etapa || 'tofu', volumen: c.volumen || 0, pais: 'PE', activo: true });
        const pr = d.prompt || {};
        DATA.prompts.push({ id: pr.id || 'nuevo-' + ok, text: c.prompt, project: (MON.projects.find(x => x.name === proyecto) || {}).id || '', tags: pr.tags || [c.tag], funnelStage: c.etapa, intentVolume: c.volumen, country: 'PE', active: true, createdAt: pr.fecha_creacion || '' });
        ok++; toast(`Agregando ${ok}/${items.length}…`);
      } catch (e) { toast(`Se agregaron ${ok}; falló: ${e.message}`); break; }
    }
    if (ok === items.length) toast(`${ok} prompt(s) agregados a «${proyecto}» · se medirán en la próxima corrida`);
    return ok;
  }

  // ─── V8 · Auditoría GEO ───────────────────────────────────────────────────
  const ACCESO = { ok: ['OK', '#1d8b3d'], blocked: ['Bloqueado', '#d02c2a'], unreachable: ['Inalcanzable', '#cc7800'] };
  const ROBOTS = { allowed: ['Permitido', '#1d8b3d'], disallowed: ['Bloqueado', '#d02c2a'], na: ['N/A', '#94a3b8'] };
  const auditorias = tipo => (MON.audits || []).filter(a => a.type === tipo);
  function formAudit(tipo) {
    const A = V.audit;
    return `<form class="card v2-form" id="v2AuditForm" data-tipo="${tipo}"><div class="v2-row"><label class="v2-grow">URL<input name="url" type="text" required placeholder="https://www.viabcp.com/" value="${esc((A.last && A.last.url) || 'https://www.viabcp.com/')}"></label>
      ${tipo === 'contenido' ? `<label>Identidad del crawler<select name="agente">${['ChatGPT-User', 'GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'GrokBot'].map(a => `<option>${a}</option>`).join('')}</select></label><label>Header identificador (opcional)<input name="cabecera" maxlength="80" placeholder="X-Crawler-Identity"></label>` : ''}
      <button type="submit" class="button primary" ${A.loading ? 'disabled' : ''}>${A.loading ? 'Auditando…' : 'Ejecutar auditoría'}</button></div></form>${A.error ? `<div class="v2-alert red">${esc(A.error)}</div>` : ''}`;
  }
  function renderAuditCrawl() {
    const hist = auditorias('crawl');
    const a = V.audit.last && V.audit.last.type === 'crawl' ? V.audit.last : hist[0];
    V.exportar = a ? () => ['crawlability', [['Bot', 'Acceso al servidor', 'HTTP', 'robots.txt']].concat(a.result.bots.map(b => [b.agent, ACCESO[b.serverAccess][0], b.httpStatus || '', ROBOTS[b.robots][0]]))] : null;
    $('#generalView').innerHTML = pageIntro('Crawlability', 'Si los 21 bots de IA pueden leer una página: acceso del servidor y regla de robots.txt.', 'Auditoría GEO') + formAudit('crawl') +
      `<div class="v2-alert amber">La auditoría sale desde la IP del servidor de n8n, no desde la de cada empresa. Un bloqueo puede ser protección anti-suplantación del WAF/CDN y no una política contra el bot verificado.</div>` +
      (a ? `<section class="card dashboard-card"><div class="dash-card-header"><div><h2>${esc(a.url)}</h2><p class="sub">${esc(a.executedAt)} · ${a.result.resumen.ok} OK · ${a.result.resumen.blocked} bloqueados · ${a.result.resumen.unreachable} inalcanzables · robots.txt ${a.result.resumen.robotsTxt === 'found' ? 'encontrado' : 'N/A'}</p></div><button type="button" class="button" data-v2rerun="${esc(a.url)}">↻ Re-ejecutar</button></div>
        ${a.result.critico ? '<div class="v2-alert red">Ningún bot de IA accede: los motores no pueden leer ni citar esta página.</div>' : ''}
        <div class="table-scroll"><table class="v2-table"><thead><tr><th>User-agent</th><th>Acceso al servidor</th><th>robots.txt</th></tr></thead><tbody>${a.result.bots.map(b => `<tr><td><code>${esc(b.agent)}</code></td><td><span class="v2-chip" style="--chip:${ACCESO[b.serverAccess][1]}">${ACCESO[b.serverAccess][0]}</span> ${b.httpStatus ? `<small>HTTP ${b.httpStatus}</small>` : b.error ? `<small>${esc(b.error)}</small>` : ''}</td><td><span class="v2-chip" style="--chip:${ROBOTS[b.robots][1]}">${ROBOTS[b.robots][0]}</span></td></tr>`).join('')}</tbody></table></div></section>` : `<div class="card">${vacio('Sin auditorías', 'Ejecuta la primera con la URL de viabcp.com.')}</div>`) +
      (hist.length ? `<section class="card dashboard-card"><h2>Historial</h2><div class="table-scroll"><table class="v2-table"><thead><tr><th>Fecha</th><th>URL</th><th>OK</th><th>Bloqueados</th><th>Inalcanzables</th><th>robots.txt</th><th></th></tr></thead><tbody>${hist.map(h => `<tr><td>${esc(h.executedAt)}</td><td>${esc(h.url)}</td><td>${h.result.resumen.ok}</td><td>${h.result.resumen.blocked}</td><td>${h.result.resumen.unreachable}</td><td>${h.result.resumen.robotsTxt === 'found' ? 'Sí' : 'N/A'}</td><td><button type="button" class="text-button" data-v2auditver="${esc(h.id)}">Ver</button> <button type="button" class="text-button" data-v2auditjson="${esc(h.id)}">Descargar</button></td></tr>`).join('')}</tbody></table></div></section>` : '');
  }
  function renderAuditContent() {
    const hist = auditorias('content');
    const a = V.audit.last && V.audit.last.type === 'content' ? V.audit.last : hist[0];
    const VERED = { ok: ['Bien', '#1d8b3d'], warning: ['Revisar', '#cc7800'], fail: ['Falla', '#d02c2a'] };
    const ver = c => { const x = c >= 75 ? 'ok' : c >= 50 ? 'warning' : 'fail'; return `<span class="v2-chip" style="--chip:${VERED[x][1]}">${c}/100</span>`; };
    $('#generalView').innerHTML = pageIntro('Contenido', 'Qué ve un crawler de IA sin ejecutar JavaScript: texto, estructura y datos estructurados.', 'Auditoría GEO') + formAudit('contenido') +
      (a ? `<div class="v2-cards v2-cards-3"><section class="card"><h3>Estático vs dinámico</h3><p class="metric-number"><span class="v2-chip" style="--chip:${VERED[a.result.staticVsDynamic.verdict][1]}">${VERED[a.result.staticVsDynamic.verdict][0]}</span></p><p>${a.result.staticVsDynamic.words} palabras visibles sin JS · ${fmt(a.result.staticVsDynamic.staticTextRatio * 100, 1)}% del HTML es texto</p></section>
        <section class="card"><h3>Análisis de contenido</h3><p class="metric-number">${ver(a.result.contentAnalysis.score)}</p><p>H1 ${a.result.contentAnalysis.headings.h1} · H2 ${a.result.contentAnalysis.headings.h2} · H3 ${a.result.contentAnalysis.headings.h3} · FAQ ${a.result.contentAnalysis.faq ? 'sí' : 'no'}</p>${a.result.contentAnalysis.issues.length ? `<ul>${a.result.contentAnalysis.issues.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '<p>Sin problemas detectados.</p>'}</section>
        <section class="card"><h3>Datos estructurados</h3><p>${a.result.structuredData.types.length ? a.result.structuredData.types.map(t => `<span class="v2-chip" style="--chip:#2563eb">${esc(t)}</span>`).join(' ') : '<b class="v2-err">No hay schema.org</b>'}</p>${a.result.structuredData.errors.map(e => `<p class="v2-err">${esc(e)}</p>`).join('')}</section></div>
        <p class="muted">${esc(a.url)} · como ${esc(a.result.crawlerIdentity)} · HTTP ${a.result.httpStatus ?? '—'} · ${esc(a.executedAt)}</p>` : `<div class="card">${vacio('Sin auditorías de contenido', 'Ejecuta la primera.')}</div>`) +
      (hist.length ? `<section class="card dashboard-card"><h2>Historial</h2><div class="table-scroll"><table class="v2-table"><thead><tr><th>Fecha</th><th>URL</th><th>Crawler</th><th>Estático</th><th>Contenido</th><th>Schema</th></tr></thead><tbody>${hist.map(h => `<tr><td>${esc(h.executedAt)}</td><td>${esc(h.url)}</td><td>${esc(h.result.crawlerIdentity)}</td><td>${VERED[h.result.staticVsDynamic.verdict][0]}</td><td>${h.result.contentAnalysis.score}/100</td><td>${h.result.structuredData.types.length ? esc(h.result.structuredData.types.join(', ')) : 'No'}</td></tr>`).join('')}</tbody></table></div></section>` : '');
  }
  async function auditar(form) {
    if (!GEO_AUDIT_ENABLED) return;
    const fd = new FormData(form), A = V.audit;
    A.loading = true; A.error = ''; (form.dataset.tipo === 'crawl' ? renderAuditCrawl : renderAuditContent)();
    try {
      const d = await api('/geo-audit', { tipo: form.dataset.tipo, url: fd.get('url'), agente: fd.get('agente') || undefined, cabecera: fd.get('cabecera') || undefined }, 90000);
      A.last = d.auditoria; MON.audits = [d.auditoria].concat(MON.audits || []);
    } catch (e) { A.error = e.message; }
    A.loading = false; (form.dataset.tipo === 'crawl' ? renderAuditCrawl : renderAuditContent)();
  }
  function renderFanout() {
    const F = V.fan;
    const prompt = F.last ? F.last.query : '';
    // Lo que ya registró la corrida diaria para ese prompt: búsquedas por motor.
    const registro = prompt ? MON.observations.filter(o => G.norm(promptMeta(o.promptId).text) === G.norm(prompt) && (o.searchQueries || []).length) : [];
    const porMotor = new Map();
    if (F.last) for (const c of F.last.consultas) { if (!porMotor.has(c.engine)) porMotor.set(c.engine, new Set()); porMotor.get(c.engine).add(c.subQuery); }
    for (const o of registro) { if (!porMotor.has(o.modelId)) porMotor.set(o.modelId, new Set()); o.searchQueries.forEach(q => porMotor.get(o.modelId).add(q)); }
    $('#generalView').innerHTML = pageIntro('Query fan-out', 'Las sub-consultas que un motor despliega en la web para responder un prompt.', 'Auditoría GEO') +
      `<form class="card v2-form" id="v2FanForm"><div class="v2-row"><label class="v2-grow">Prompt<input name="query" required maxlength="500" placeholder="¿Cuál es la mejor cuenta de ahorros en Perú?" value="${esc(prompt)}"></label><button type="submit" class="button primary" ${F.loading ? 'disabled' : ''}>${F.loading ? 'Consultando…' : 'Ver fan-out'}</button></div><p class="muted">Ahora consulta Claude con búsqueda web. ChatGPT, Gemini y Perplexity se suman desde las búsquedas que guarda la corrida diaria.</p></form>${F.error ? `<div class="v2-alert red">${esc(F.error)}</div>` : ''}
      ${porMotor.size ? [...porMotor.entries()].map(([m, qs]) => `<section class="card dashboard-card"><h2>${MODEL.has(m) ? engineBadge(m) : esc(m)}</h2><ul class="v2-list">${[...qs].map(q => `<li><span>${esc(q)}</span><button type="button" class="text-button" data-v2fanprompt="${esc(q)}">＋ Convertir en prompt a seguir</button></li>`).join('')}</ul></section>`).join('') : F.last ? `<div class="card">${vacio('El motor respondió sin buscar', 'Para este prompt no desplegó búsquedas web.')}</div>` : ''}`;
  }
  async function fanout(form) {
    if (!GEO_AUDIT_ENABLED) return;
    const F = V.fan;
    F.loading = true; F.error = ''; renderFanout();
    try { const d = await api('/geo-fanout', { query: new FormData(form).get('query') }, 120000); F.last = d; } catch (e) { F.error = e.message; }
    F.loading = false; renderFanout();
  }

  // ─── V9 · Tráfico de bots IA ──────────────────────────────────────────────
  const BOT_TIPO = { GPTBot: 'entrenamiento', ClaudeBot: 'entrenamiento', 'anthropic-ai': 'entrenamiento', 'Google-Extended': 'entrenamiento', CCBot: 'entrenamiento', Bytespider: 'entrenamiento', 'cohere-ai': 'entrenamiento', 'Applebot-Extended': 'entrenamiento', 'Meta-ExternalAgent': 'entrenamiento',
    'OAI-SearchBot': 'búsqueda', 'Claude-SearchBot': 'búsqueda', PerplexityBot: 'búsqueda', GoogleOther: 'búsqueda', Diffbot: 'búsqueda', GrokBot: 'búsqueda', 'ChatGPT-User': 'usuario', 'Claude-User': 'usuario', 'Perplexity-User': 'usuario', 'Meta-ExternalFetcher': 'usuario' };
  function leerLogs(texto) {
    const visitas = [];
    for (const l of texto.split(/\r?\n/)) {
      const bot = Object.keys(BOT_TIPO).find(b => l.toLowerCase().includes(b.toLowerCase()));
      if (!bot) continue;
      const m = l.match(/\[([^\]]+)\]\s+"(?:GET|POST|HEAD) ([^ ]+)[^"]*" (\d{3})/) || l.match(/(\d{4}-\d{2}-\d{2}T[^ ,]+)[ ,]+[^ ]*?(\/[^ ,"]*)[ ,"]+(\d{3})/);
      if (!m) continue;
      let fecha = m[1];
      const apache = fecha.match(/^(\d{2})\/(\w{3})\/(\d{4})/);
      if (apache) fecha = `${apache[3]}-${String(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(apache[2]) + 1).padStart(2, '0')}-${apache[1]}`;
      visitas.push({ ts: fecha.slice(0, 10), agent: bot, path: m[2], status: Number(m[3]) });
    }
    return visitas;
  }
  function renderBots() {
    const vs = V.bots;
    const citadas = new Set(MON.observations.flatMap(o => (o.sources || []).filter(s => (OWN().domains || []).some(d => s.domain === d || s.domain.endsWith('.' + d))).map(s => { try { return new URL(s.url).pathname.replace(/\/$/, '') || '/'; } catch (e) { return '/'; } })));
    let cuerpo;
    if (!vs) {
      cuerpo = `<div class="card">${vacio('Conecta una fuente de datos de viabcp.com', 'Para ver qué bots de IA leen el sitio y cuáles de esas páginas terminan citadas. Fuentes: <b>Cloudflare</b> (Logpush), <b>webhook</b> desde el CDN, <b>WordPress</b> (plugin de logs) o <b>archivo de logs</b>.', '<label class="button primary v2-file">Cargar archivo de logs<input type="file" id="v2LogFile" accept=".log,.txt,.csv,.gz" hidden></label><p class="muted small">El archivo se procesa en tu navegador; no se sube a ningún servidor.</p>')}</div>`;
    } else if (!vs.length) {
      cuerpo = `<div class="card">${vacio('El archivo no tiene visitas de bots de IA', 'Se buscan los 21 user-agents de la auditoría. Prueba con otro archivo.', '<label class="button v2-file">Cargar otro archivo<input type="file" id="v2LogFile" hidden></label>')}</div>`;
    } else {
      const fechas = [...new Set(vs.map(v => v.ts))].sort();
      const agentes = [...new Set(vs.map(v => v.agent))];
      const colores = ['#002A8D', '#FF7800', '#0f766e', '#8b5cf6', '#db2777', '#2563eb', '#16a34a', '#a16207'];
      const serie = agentes.slice(0, 8).map((a, i) => ({ key: a, name: a, color: colores[i], values: fechas.map(f => vs.filter(v => v.ts === f && v.agent === a).length) }));
      const paginas = new Map();
      vs.forEach(v => { const k = v.path.split('?')[0].replace(/\/$/, '') || '/'; const p = paginas.get(k) || { path: k, n: 0, bots: new Set(), dias: new Set() }; p.n++; p.bots.add(v.agent); p.dias.add(v.ts); paginas.set(k, p); });
      const top = [...paginas.values()].sort((a, b) => b.n - a.n).slice(0, 20);
      const tipos = ['entrenamiento', 'búsqueda', 'usuario'].map(t => ({ t, n: vs.filter(v => BOT_TIPO[v.agent] === t).length }));
      cuerpo = `<div class="dashboard-grid"><section class="card dashboard-card"><h2>Visitas por agente</h2>${lineChart({ dates: fechas, series: serie, max: Math.max(...serie.flatMap(s => s.values)) })}${leyenda(serie, 'v2noop')}</section>
        <section class="card dashboard-card"><h2>Tipos de agente</h2>${barras(tipos, { valor: x => x.n, etiqueta: x => esc(x.t), color: () => '#002A8D', formato: v => fmt(v, 0) })}<p class="muted">${vs.length} visitas · ${fechas.length} días · ${agentes.length} bots</p></section></div>
        <section class="card dashboard-card"><h2>Páginas más leídas · cruce visita → cita</h2><div class="table-scroll"><table class="v2-table"><thead><tr><th>Página</th><th>Visitas</th><th>Bots</th><th>Días con visita</th><th>¿Citada por un motor?</th></tr></thead><tbody>${top.map(p => `<tr><td><code>${esc(p.path)}</code></td><td>${p.n}</td><td>${esc([...p.bots].join(', '))}</td><td>${p.dias.size}</td><td>${citadas.has(p.path) ? '<b style="color:#1d8b3d">✓ Sí</b>' : 'No'}</td></tr>`).join('')}</tbody></table></div></section>`;
    }
    $('#generalView').innerHTML = pageIntro('Tráfico de bots IA', 'Visitas de bots de IA a viabcp.com, a partir de los logs del servidor.', 'Reporte de marca') + cuerpo;
  }

  // ─── V10 · Perfil de marca ────────────────────────────────────────────────
  function renderPerfil() {
    const r = filas().filter(G.esValida), marcas = BRANDS();
    const attrs = (MON.attributes && MON.attributes.length ? MON.attributes : []);
    const conteo = {}, base = {}, sent = {};
    for (const o of r) for (const m of G.menciones(o, marcas)) {
      base[m.brandId] = (base[m.brandId] || 0) + 1;
      for (const a of m.attributes || []) { const k = m.brandId + '|' + a; conteo[k] = (conteo[k] || 0) + 1; (sent[k] = sent[k] || []).push(m.sentiment); }
    }
    const conDatos = Object.keys(conteo).length;
    const visibles = marcas.filter(b => base[b.id]).slice(0, 8);
    V.exportar = conDatos ? () => ['perfil_marca', [['Atributo'].concat(visibles.map(b => b.name + ' %'))].concat(attrs.map(a => [a].concat(visibles.map(b => G.redondear(((conteo[b.id + '|' + a] || 0) / base[b.id]) * 100)))))] : null;
    $('#generalView').innerHTML = pageIntro('Perfil de marca', 'Atributos que los motores asocian a cada banco: % de las respuestas donde aparece la marca que mencionan el atributo.', 'Reporte de marca') +
      (!r.length ? `<div class="card">${vacio('Sin respuestas válidas', 'Cambia los filtros para ver el perfil.')}</div>` : !conDatos ? `<div class="card">${vacio('Aún sin atributos', 'El Analista asocia atributos (seguridad, app, tasas, atención…) desde la versión v2. Aparecerán con las próximas corridas.')}</div>` :
      `<section class="card dashboard-card"><div class="table-scroll"><table class="v2-table v2-heat"><thead><tr><th>Atributo</th>${visibles.map(b => `<th>${brandCell(b)}</th>`).join('')}</tr></thead><tbody>${attrs.map(a => `<tr><th scope="row">${esc(a)}</th>${visibles.map(b => {
        const k = b.id + '|' + a, v = ((conteo[k] || 0) / base[b.id]) * 100, s = G.promedio(sent[k] || []);
        return `<td><button type="button" class="v2-heatcell" style="--h:${Math.min(1, v / 60).toFixed(2)}" data-v2heat="${esc(k)}" title="${esc(b.name)} · ${esc(a)}: ${fmt(v, 0)}% · sentimiento ${sentTxt(s)}" ${conteo[k] ? '' : 'disabled'}>${conteo[k] ? fmt(v, 0) + '%' : '—'}</button></td>`;
      }).join('')}</tr>`).join('')}</tbody></table></div><p class="muted">Haz clic en una celda para ver las respuestas que la sustentan.</p></section>`);
  }
  function abrirHeat(k) {
    const [brandId, attr] = k.split('|');
    const marcas = BRANDS(), b = brandById(brandId);
    const rs = filas().filter(o => G.menciones(o, marcas).some(m => m.brandId === brandId && (m.attributes || []).includes(attr)));
    abrirDrawer(`<div class="v2-drawer-head"><div><div class="orange-label">Perfil de marca</div><h2>${esc(b.name)} · ${esc(attr)}</h2></div><button type="button" class="close-x" data-v2close aria-label="Cerrar">×</button></div><div class="v2-drawer-body"><ul class="v2-list">${rs.map(o => `<li><button type="button" class="v2-link" data-v2openresp="${esc(o.id)}">${engineBadge(o.modelId, true)} ${esc(promptMeta(o.promptId).text)}</button><span>${esc(dateLabel(o.date, true))}</span></li>`).join('')}</ul></div>`);
  }


  // ─── Glosario de KPIs (Configuración y botón ⓘ de cada tarjeta) ───────────
  const GLOSARIO = {
    coverage: { nombre: 'Cobertura de marca', que: 'En cuántas respuestas aparece la marca.', formula: 'Respuestas donde la marca aparece ÷ respuestas válidas × 100.', lectura: 'Más alto es mejor. Las respuestas con error no cuentan.', otterly: 'Brand coverage' },
    position: { nombre: 'Posición de marca', que: 'En qué lugar aparece la marca entre los bancos que nombra la respuesta.', formula: 'Promedio del lugar de la marca (1 = la primera nombrada), solo en las respuestas donde aparece.', lectura: 'Más bajo es mejor: 1,0 es aparecer siempre primero.', otterly: 'Brand position' },
    sentiment: { nombre: 'Sentimiento', que: 'Cómo habla la respuesta de la marca.', formula: 'Promedio del score por respuesta, de −100 (muy negativo) a +100 (muy positivo), solo donde la marca aparece.', lectura: 'Entre −10 y +10 es neutral: la marca se nombra sin juicio. Más de +10, positivo.', otterly: 'Net sentiment score (NSS)' },
    sov: { nombre: 'Share of Voice', que: 'Qué parte de la conversación sobre bancos se lleva la marca.', formula: 'Respuestas que mencionan la marca ÷ suma de las respuestas que mencionan a cada banco seguido × 100. Una respuesta cuenta una vez por banco, aunque lo nombre varias veces.', lectura: 'Entre todos los bancos suma 100%. Es la misma definición de OtterlyAI.', otterly: 'Share of voice' },
    sovWeighted: { nombre: 'SoV ponderado', que: 'La métrica de la estrategia SEO/GEO de BCP: además de aparecer, pesa dónde y cómo.', formula: 'Por respuesta: (1/posición + menciones/total de menciones) ÷ 2 × contexto (positivo 1 · neutral 0,75 · negativo 0,25), repartido entre los bancos. Luego, promedio de todas las respuestas válidas (si la marca no aparece, aporta 0).', lectura: 'Sale más bajo que el Share of Voice porque las respuestas sin la marca cuentan como 0.', otterly: '— (propia de BCP)' },
    probability: { nombre: 'Probabilidad de compra', que: 'Si el motor propone la marca como opción a elegir, no solo la nombra.', formula: 'Respuestas donde la marca sale recomendada ÷ respuestas donde aparece × 100.', lectura: 'Más alto es mejor. Lo marca el Analista IA en cada respuesta.', otterly: 'Likelihood to buy' },
    mentions: { nombre: 'Menciones de marca', que: 'Cuántas respuestas nombran a la marca.', formula: 'Conteo de respuestas válidas con la marca.', lectura: 'Es el numerador de la cobertura.', otterly: 'Brand mentions' },
    ownCitations: { nombre: 'Citas de dominio propio', que: 'Cuántas veces los motores usan una página de la marca como fuente.', formula: 'Conteo de URLs citadas de viabcp.com y sus subdominios (abretucuenta.viabcp.com incluido).', lectura: 'Más alto es mejor: el motor confía en el sitio.', otterly: 'Domain citations' },
    domainCoverage: { nombre: 'Cobertura de dominio', que: 'En cuántas respuestas aparece un dominio como fuente.', formula: 'Respuestas que citan el dominio ÷ respuestas válidas × 100.', lectura: 'Sirve para ver qué fuentes (SBS, comparadores, medios) pesan en cada tema.', otterly: 'Domain coverage' },
    intentVolume: { nombre: 'Volumen de intención', que: 'Demanda estimada del prompt.', formula: 'Escala de 1 a 5 según la búsqueda de las keywords asociadas.', lectura: 'Prioriza los prompts con más volumen.', otterly: 'Intent volume' }
  };
  const infoKpi = clave => `<button type="button" class="info" data-kpi="${clave}" aria-label="Cómo se mide: ${esc(GLOSARIO[clave].nombre)}"></button>`;
  const pop = document.createElement('div');
  pop.className = 'v2-pop'; pop.hidden = true; pop.setAttribute('role', 'dialog');
  document.body.appendChild(pop);
  function abrirPop(btn) {
    const g = GLOSARIO[btn.dataset.kpi];
    pop.innerHTML = g
      ? `<b>${esc(g.nombre)}</b><p>${esc(g.que)}</p><dl><dt>Cómo se calcula</dt><dd>${esc(g.formula)}</dd><dt>Cómo se lee</dt><dd>${esc(g.lectura)}</dd><dt>En OtterlyAI</dt><dd>${esc(g.otterly)}</dd></dl><button type="button" class="text-button" data-nav="settings" data-v2glosario>Ver glosario completo →</button>`
      : `<p>${esc(btn.dataset.tip || btn.getAttribute('aria-label') || '')}</p>`;
    pop.hidden = false;
    const r = btn.getBoundingClientRect(), w = Math.min(320, window.innerWidth - 24);
    pop.style.width = w + 'px';
    pop.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + window.scrollX + 'px';
    const abajo = r.bottom + 8 + pop.offsetHeight < window.innerHeight;
    pop.style.top = (abajo ? r.bottom + 8 : r.top - pop.offsetHeight - 8) + window.scrollY + 'px';
    pop.dataset.para = btn.dataset.kpi || btn.dataset.tip || '';
    btn.setAttribute('aria-expanded', 'true');
  }
  const cerrarPop = () => { pop.hidden = true; document.querySelectorAll('.info[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false')); };
  document.addEventListener('click', e => {
    const b = e.target.closest('.info');
    if (b) {
      e.preventDefault(); e.stopPropagation();
      if (!pop.hidden && pop.dataset.para === (b.dataset.kpi || b.dataset.tip || '')) return cerrarPop();
      return abrirPop(b);
    }
    if (!e.target.closest('.v2-pop')) cerrarPop();
    else if (e.target.closest('[data-v2glosario]')) { cerrarPop(); setTimeout(() => byId('v2Glosario')?.scrollIntoView({ behavior: 'smooth' }), 120); }
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) cerrarPop(); });
  window.addEventListener('resize', cerrarPop);

  // ─── Configuración editable (pestaña _config del Sheet) ───────────────────
  const DIAS = [['lun', 'Lun'], ['mar', 'Mar'], ['mie', 'Mié'], ['jue', 'Jue'], ['vie', 'Vie'], ['sab', 'Sáb'], ['dom', 'Dom']];
  function ajustes() {
    const a = (DATA.meta && DATA.meta.ajustes) || {};
    const own = OWN();
    return {
      monitor: a.monitor || { nombre: 'BCP · Monitor de Visibilidad en IA', organizacion: 'BCP · Marketing y Comunicaciones', pais: 'PE' },
      automatizacion: a.automatizacion || { activa: true, hora: 7, dias: DIAS.map(d => d[0]) },
      captura: a.captura || { buscar_siempre: true },
      marca: a.marca || { nombre: own.name, alias: own.aliases || [own.name], dominios: own.domains || [] },
      competidores: a.competidores || BRANDS().filter(b => !b.isOwn).map(b => ({ nombre: b.name, alias: b.aliases || [b.name], dominios: b.domains || [], color: b.color }))
    };
  }
  function proximaCorrida(auto) {
    if (!auto.activa || !auto.dias.length) return 'Corrida automática apagada';
    const ahora = new Date();
    for (let i = 0; i < 8 * 24; i++) {
      const t = new Date(ahora.getTime() + i * 3600e3);
      const p = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: 'numeric', hourCycle: 'h23', weekday: 'short', day: 'numeric', month: 'short' }).formatToParts(t);
      const h = Number(p.find(x => x.type === 'hour').value);
      const dia = { lun: 'lun', mar: 'mar', mié: 'mie', jue: 'jue', vie: 'vie', sáb: 'sab', dom: 'dom' }[p.find(x => x.type === 'weekday').value.replace('.', '')];
      if (h === Number(auto.hora) && auto.dias.includes(dia) && (i > 0 || ahora.getMinutes() === 0)) {
        return 'Próxima corrida: ' + p.find(x => x.type === 'weekday').value + ' ' + p.find(x => x.type === 'day').value + ' ' + p.find(x => x.type === 'month').value + ', ' + String(h).padStart(2, '0') + ':00 (Lima)';
      }
    }
    return 'Sin próxima corrida';
  }
  const hora2 = h => String(h).padStart(2, '0') + ':00';
  function renderAjustes() {
    const A = ajustes();
    if (!V.comp) V.comp = A.competidores.map(c => Object.assign({}, c));
    const ro = LIVE ? '' : 'disabled';
    const activos = promptsReales().filter(p => p.active !== false).length;
    $('#generalView').innerHTML = pageIntro('Configuración', 'Datos del monitor, programación de la corrida, marca y competidores, y cómo se mide cada KPI.', 'Gestión') +
      (LIVE ? '' : '<div class="v2-alert amber">Modo demostración: los cambios no se pueden guardar sin conexión con n8n.</div>') +
      `<div class="v2-settings">
      <section class="card dashboard-card"><h2>Corrida automática</h2><p class="v2-help">n8n revisa la programación cada hora y corre todos los prompts activos (${activos}) cuando coincide la hora y el día.</p>
        <form class="v2-form" data-v2cfg="automatizacion">
          <label class="v2-switch"><input type="checkbox" name="activa" ${A.automatizacion.activa ? 'checked' : ''} ${ro}><span aria-hidden="true"></span><b>${A.automatizacion.activa ? 'Encendida' : 'Apagada'}</b></label>
          <div class="v2-row"><label>Hora (Lima)<select name="hora" ${ro}>${Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${Number(A.automatizacion.hora) === h ? 'selected' : ''}>${hora2(h)}</option>`).join('')}</select></label></div>
          <fieldset class="v2-days"><legend>Días</legend>${DIAS.map(([k, l]) => `<label><input type="checkbox" name="dias" value="${k}" ${A.automatizacion.dias.includes(k) ? 'checked' : ''} ${ro}><span>${l}</span></label>`).join('')}</fieldset>
          <p class="v2-next">${esc(proximaCorrida(A.automatizacion))}</p>
          <div class="v2-row"><button type="submit" class="button primary" ${ro}>Guardar programación</button><button type="button" class="button" id="v2RunNow" ${ro}>Ejecutar ahora</button></div>
        </form></section>
      <section class="card dashboard-card"><h2>Captura de respuestas</h2>
        <form class="v2-form" data-v2cfg="captura">
          <label class="v2-switch"><input type="checkbox" name="buscar_siempre" ${A.captura.buscar_siempre ? 'checked' : ''} ${ro}><span aria-hidden="true"></span><b>Claude busca en la web antes de responder</b></label>
          <p class="v2-help">Así responden las apps que mide OtterlyAI (ChatGPT, AI Overview, Perplexity, Copilot): con fuentes actuales. Sin búsqueda, Claude contesta de memoria y casi no cita páginas. Cuesta más: unos 20.000 tokens de entrada por respuesta en vez de ~2.000.</p>
          <p class="v2-help"><b>País:</b> cada motor recibe, como línea de sistema, «El usuario está en Lima, Perú». El prompt se envía tal cual, sin agregarle «Perú».</p>
          <button type="submit" class="button primary" ${ro}>Guardar</button>
        </form></section>
      <section class="card dashboard-card"><h2>Información del monitor</h2>
        <form class="v2-form" data-v2cfg="monitor">
          <label>Nombre<input name="nombre" maxlength="80" required value="${esc(A.monitor.nombre)}" ${ro}></label>
          <label>Organización<input name="organizacion" maxlength="80" value="${esc(A.monitor.organizacion)}" ${ro}></label>
          <label>País<select name="pais" ${ro}><option value="PE">Perú</option></select></label>
          <button type="submit" class="button primary" ${ro}>Guardar</button>
        </form></section>
      <section class="card dashboard-card"><h2>Marca: ${esc(A.marca.nombre)}</h2>
        <form class="v2-form" data-v2cfg="marca">
          <label>Otros nombres (separados por coma)<textarea name="alias" rows="2" ${ro}>${esc(A.marca.alias.filter(a => a !== A.marca.nombre).join(', '))}</textarea></label>
          <label>Dominios propios (cuentan sus subdominios)<textarea name="dominios" rows="2" ${ro}>${esc(A.marca.dominios.join(', '))}</textarea></label>
          <p class="v2-help">¿Sumar marcas del grupo, como Yape? Agrégalas aquí como otro nombre si quieres que cuenten como BCP, o como competidor para verlas aparte.</p>
          <button type="submit" class="button primary" ${ro}>Guardar</button>
        </form></section>
      <section class="card dashboard-card v2-wide"><h2>Competidores</h2><p class="v2-help">Cada banco con sus nombres alternativos (unifican «Banco Falabella» y «Falabella») y sus dominios (cuentan como citas del competidor). Se aplica desde la próxima corrida.</p>
        <form class="v2-form" data-v2cfg="competidores"><div class="table-scroll"><table class="v2-table v2-comp"><thead><tr><th>Color</th><th>Banco</th><th>Otros nombres</th><th>Dominios</th><th></th></tr></thead><tbody>
          ${V.comp.map((c, i) => `<tr><td><input type="color" data-ci="${i}" data-cf="color" value="${esc(c.color || '#94a3b8')}" aria-label="Color" ${ro}></td><td><input data-ci="${i}" data-cf="nombre" value="${esc(c.nombre)}" aria-label="Banco" ${ro}></td><td><input data-ci="${i}" data-cf="alias" value="${esc((c.alias || []).filter(a => a !== c.nombre).join(', '))}" aria-label="Otros nombres" ${ro}></td><td><input data-ci="${i}" data-cf="dominios" value="${esc((c.dominios || []).join(', '))}" aria-label="Dominios" ${ro}></td><td><button type="button" class="text-button v2-danger" data-v2comprm="${i}" ${ro}>Quitar</button></td></tr>`).join('')}
        </tbody></table></div><div class="v2-row"><button type="button" class="button" data-v2compadd ${ro}>＋ Agregar competidor</button><button type="submit" class="button primary" ${ro}>Guardar competidores</button></div></form></section>
      <section class="card dashboard-card v2-wide" id="v2Glosario"><h2>Glosario de KPIs</h2><p class="v2-help">Cómo se mide cada indicador. El botón ⓘ de cada tarjeta muestra lo mismo.</p>
        <div class="v2-glossary">${Object.values(GLOSARIO).map(g => `<article><h3>${esc(g.nombre)}</h3><p>${esc(g.que)}</p><dl><dt>Cómo se calcula</dt><dd>${esc(g.formula)}</dd><dt>Cómo se lee</dt><dd>${esc(g.lectura)}</dd><dt>En OtterlyAI</dt><dd>${esc(g.otterly)}</dd></dl></article>`).join('')}</div></section>
      <section class="card dashboard-card"><h2>Motores</h2>${MON.models.map(m => `<div class="settings-line">${engineBadge(m.id)}<b>${esc(m.vendor)}<br><small class="muted">${MON.observations.some(o => o.modelId === m.id && G.esValida(o)) ? 'Respuestas recibidas' : MON.observations.some(o => o.modelId === m.id) ? 'Con error: falta credencial o saldo' : 'Sin corridas'}</small></b></div>`).join('')}</section>
      </div>`;
  }
  function valorAjuste(form) {
    const fd = new FormData(form), clave = form.dataset.v2cfg;
    if (clave === 'automatizacion') return { activa: fd.get('activa') === 'on', hora: Number(fd.get('hora')), dias: fd.getAll('dias') };
    if (clave === 'captura') return { buscar_siempre: fd.get('buscar_siempre') === 'on' };
    if (clave === 'monitor') return { nombre: fd.get('nombre'), organizacion: fd.get('organizacion'), pais: fd.get('pais') };
    if (clave === 'marca') return { alias: fd.get('alias'), dominios: fd.get('dominios') };
    return V.comp.filter(c => String(c.nombre || '').trim());
  }
  async function guardarAjuste(form) {
    const btn = form.querySelector('[type="submit"]');
    const clave = form.dataset.v2cfg;
    btn.disabled = true; const txt = btn.textContent; btn.textContent = 'Guardando…';
    try {
      const d = await api('/geo-config-save', { clave, valor: valorAjuste(form) });
      DATA.meta.ajustes = Object.assign({}, ajustes(), { [clave]: d.valor });
      if (clave === 'competidores') V.comp = d.valor.map(c => Object.assign({}, c));
      toast(clave === 'automatizacion' ? 'Programación guardada · ' + proximaCorrida(d.valor) : clave === 'marca' || clave === 'competidores' ? 'Guardado · se aplica desde la próxima corrida' : 'Guardado en el Sheet');
      renderAjustes();
    } catch (e) { toast('No se guardó: ' + e.message); btn.disabled = false; btn.textContent = txt; }
  }
  async function ejecutarAhora(btn) {
    const n = promptsReales().filter(p => p.active !== false).length;
    if (!window.confirm(`Se medirán ahora los ${n} prompts activos en todos los motores. Tarda entre ${Math.ceil(n * 3 / 60)} y ${Math.ceil(n * 6 / 60)} minutos y consume créditos de las APIs. ¿Continuar?`)) return;
    btn.disabled = true;
    try { await api('/geo-run', {}); toast('Corrida iniciada en n8n · los resultados aparecen al recargar cuando termine'); }
    catch (e) { toast('No se pudo iniciar: ' + e.message); }
    btn.disabled = false;
  }
  document.addEventListener('submit', e => { const f = e.target.closest('[data-v2cfg]'); if (f) { e.preventDefault(); void guardarAjuste(f); } });
  document.addEventListener('input', e => { const t = e.target; if (t.dataset.ci !== undefined && V.comp) { const c = V.comp[Number(t.dataset.ci)]; const f = t.dataset.cf; c[f] = f === 'alias' || f === 'dominios' ? t.value.split(',').map(x => x.trim()).filter(Boolean) : t.value; } });
  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.id === 'v2RunNow') return void ejecutarAhora(b);
    if (b.dataset.v2compadd !== undefined) { V.comp.push({ nombre: '', alias: [], dominios: [], color: '#64748b' }); renderAjustes(); return; }
    if (b.dataset.v2comprm !== undefined) { V.comp.splice(Number(b.dataset.v2comprm), 1); renderAjustes(); }
  });

  // ─── Eventos ──────────────────────────────────────────────────────────────
  document.addEventListener('click', e => {
    const el = e.target.closest('button, [data-v2prompt], [data-v2resp], [data-v2tag]');
    if (!el) { if (!e.target.closest('.v2-tags-filter') && byId('v2TagsMenu')) byId('v2TagsMenu').hidden = true; return; }
    const d = el.dataset;
    if (!e.target.closest('.v2-tags-filter') && byId('v2TagsMenu')) byId('v2TagsMenu').hidden = true;
    if (el.id === 'v2Export') return exportarVista();
    if (el.id === 'v2TagsTrigger') { const m = byId('v2TagsMenu'); m.hidden = !m.hidden; el.setAttribute('aria-expanded', String(!m.hidden)); return; }
    if (el.id === 'v2TagsAll') { V.tags.clear(); return refresh(); }
    if (d.v2close !== undefined) return cerrarDrawer();
    if (d.v2prompt) { e.preventDefault(); return abrirPrompt(d.v2prompt); }
    if (d.v2dtab && V.drawer) return abrirPrompt(V.drawer.promptId, d.v2dtab);
    if (d.v2resp && V.drawer) return abrirPrompt(V.drawer.promptId, 'respuestas', d.v2resp);
    if (d.v2back) return abrirPrompt(d.v2back, 'respuestas');
    if (d.v2openresp) { const o = MON.observations.find(x => x.id === d.v2openresp); if (o) abrirPrompt(o.promptId, 'respuestas', o.id); return; }
    if (d.v2metric) { V.chartMetric = d.v2metric; return renderResumen(); }
    if (d.v2gran) { V.gran = d.v2gran; return renderResumen(); }
    if (d.v2serie) { V.hidden.has(d.v2serie) ? V.hidden.delete(d.v2serie) : V.hidden.add(d.v2serie); return renderResumen(); }
    if (d.v2rank) { V.rankSort = [d.v2rank, V.rankSort[0] === d.v2rank ? -V.rankSort[1] : d.v2rank === 'position' || d.v2rank === 'name' ? 1 : -1]; return renderResumen(); }
    if (d.v2ptab) { V.promptTab = d.v2ptab; return renderResumen(); }
    if (d.v2ctab) { V.citeTab = d.v2ctab; return renderResumen(); }
    if (d.v2psort) { V.psort = [d.v2psort, V.psort[0] === d.v2psort ? -V.psort[1] : d.v2psort === 'text' || d.v2psort === 'position' ? 1 : -1]; return renderPromptsV2(); }
    if (d.v2ppage) { V.ppage += Number(d.v2ppage); return renderPromptsV2(); }
    if (d.v2utab) { V.utab = d.v2utab; V.upage = 1; return renderCitas(); }
    if (d.v2upage) { V.upage += Number(d.v2upage); return renderCitas(); }
    if (d.v2dpage) { V.dpage += Number(d.v2dpage); return renderCitas(); }
    if (d.v2fav) { V.favs.has(d.v2fav) ? V.favs.delete(d.v2fav) : V.favs.add(d.v2fav); guardarLocal('v2Favs', [...V.favs]); return renderCitas(); }
    if (el.id === 'v2Play') return timeLapse();
    if (d.v2thr) { V.thrMode = d.v2thr; return M.route === 'visibilidad' ? renderVisibilidad() : renderResumen(); }
    if (d.v2rtab) { V.recTab = d.v2rtab; return renderRecsV2(); }
    if (d.v2rec) return abrirRec(d.v2rec);
    if (d.v2recmove) {
      el.disabled = true;
      return void guardarRec(d.v2recmove, { estado: d.to }).then(ok => { if (ok) { if (!drawer.hidden) cerrarDrawer(true); if (M.route === 'recomendaciones') renderRecsV2(); } else el.disabled = false; });
    }
    if (d.v2tagfilter) { V.tags = new Set([d.v2tagfilter]); return go('prompts'); }
    if (el.id === 'v2TagAssign') return void asignarTags(false);
    if (el.id === 'v2TagRemove') return void asignarTags(true);
    if (d.v2rmodo) { V.research.modo = d.v2rmodo; V.research.error = ''; return renderInvestigacion(); }
    if (el.id === 'v2ResAdd') {
      const items = [...V.research.pick].map(i => V.research.items[i]);
      el.disabled = true;
      return void crearPrompts(items, byId('v2ResProj').value).then(n => { if (n) { V.research.items = V.research.items.filter((_, i) => !V.research.pick.has(i)); V.research.pick.clear(); } renderInvestigacion(); });
    }
    if (d.v2rerun) { V.audit.last = { url: d.v2rerun }; const f = byId('v2AuditForm'); if (f) f.requestSubmit(); return; }
    if (d.v2auditver) { V.audit.last = (MON.audits || []).find(a => a.id === d.v2auditver); return renderAuditCrawl(); }
    if (d.v2auditjson) { const a = (MON.audits || []).find(x => x.id === d.v2auditjson); if (a) download(`auditoria_${G.dominioDe(a.url)}_${a.executedAt.slice(0, 10)}.json`, new Blob([JSON.stringify(a, null, 2)], { type: 'application/json' })); return; }
    if (d.v2fanprompt) {
      el.disabled = true;
      return void crearPrompts([{ prompt: d.v2fanprompt, etapa: 'tofu', tag: 'Fan-out', volumen: 0 }], (MON.projects[0] || { name: 'Marca' }).name).then(n => { el.textContent = n ? '✓ Agregado' : '＋ Convertir en prompt a seguir'; el.disabled = !!n; });
    }
    if (d.v2heat) return abrirHeat(d.v2heat);
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tr.v2-click')) { e.preventDefault(); e.target.click(); }
  });
  document.addEventListener('change', e => {
    const t = e.target, d = t.dataset;
    if (t.id === 'v2Preset') { V.preset = t.value; if (t.value === 'custom' && !V.start) { const p = G.periodo('last14', MON.referenceDate); V.start = p.start; V.end = p.end; } return refresh(); }
    if (t.id === 'v2Start' || t.id === 'v2End') { V[t.id === 'v2Start' ? 'start' : 'end'] = t.value; return refresh(); }
    if (d.v2tag !== undefined) { t.checked ? V.tags.add(d.v2tag) : V.tags.delete(d.v2tag); refresh(); const m = byId('v2TagsMenu'); if (m) m.hidden = false; return; }
    if (t.id === 'v2Country') { V.country = t.value; return refresh(); }
    if (t.id === 'globalProject') return setTimeout(escribirQuery, 0);
    if (d.v2col) { t.checked ? V.pcols.add(d.v2col) : V.pcols.delete(d.v2col); return renderPromptsV2(); }
    if (t.id === 'v2PSize') { V.psize = Number(t.value); V.ppage = 1; return renderPromptsV2(); }
    if (d.v2dom) return void guardarDominio(d.v2dom, t.value, t);
    if (t.id === 'v2ThrC' || t.id === 'v2ThrP') { V.thr[t.id === 'v2ThrC' ? 'coverage' : 'probability'] = Math.max(0, Math.min(100, Number(t.value) || 0)); return renderVisibilidad(); }
    if (t.id === 'v2Lapse') { V.lapseIdx = Number(t.value); return renderVisibilidad(); }
    if (['v2RecCat', 'v2RecScope', 'v2RecImp'].includes(t.id)) { V.recF[{ v2RecCat: 'category', v2RecScope: 'scope', v2RecImp: 'impact' }[t.id]] = t.value; return renderRecsV2(); }
    if (t.id === 'v2RecSort') { V.recSort = t.value; return renderRecsV2(); }
    if (d.v2sel) { t.checked ? V.sel.add(d.v2sel) : V.sel.delete(d.v2sel); return renderTags(); }
    if (t.id === 'v2SelAll') { const q = G.norm(V.pq); promptsReales().filter(p => !q || G.norm(p.text).includes(q) || p.tags.some(x => G.norm(x).includes(q))).forEach(p => (t.checked ? V.sel.add(p.id) : V.sel.delete(p.id))); return renderTags(); }
    if (d.v2tagcolor) { V.tagColors[d.v2tagcolor] = t.value; guardarLocal('v2TagColors', V.tagColors); return renderTags(); }
    if (d.v2pick !== undefined) { const i = Number(d.v2pick); t.checked ? V.research.pick.add(i) : V.research.pick.delete(i); return renderInvestigacion(); }
    if (t.id === 'v2LogFile' && t.files[0]) {
      const f = t.files[0];
      f.text().then(txt => { V.bots = leerLogs(txt); renderBots(); toast(`${V.bots.length} visitas de bots de IA en ${f.name}`); });
    }
  });
  let reloj = null;
  document.addEventListener('input', e => {
    const t = e.target;
    const con = (k, fn) => { V[k] = t.value; clearTimeout(reloj); reloj = setTimeout(() => { fn(); const n = byId(t.id); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 250); };
    if (t.id === 'v2PromptQ') { V.ppage = 1; con('pq', renderPromptsV2); }
    if (t.id === 'v2UrlQ') { V.upage = 1; con('uq', renderCitas); }
    if (t.id === 'v2TagQ') con('pq', renderTags);
    if (t.id === 'v2RecQ') con('recQ', renderRecsV2);
  });
  document.addEventListener('submit', e => {
    const f = e.target;
    if (f.id === 'v2RecForm') {
      e.preventDefault();
      const fd = new FormData(f);
      return void guardarRec(f.dataset.id, { estado: fd.get('estado'), responsable: fd.get('responsable'), fecha_objetivo: fd.get('fecha_objetivo') }).then(ok => { if (ok) { cerrarDrawer(true); renderRecsV2(); } });
    }
    if (f.id === 'v2ResearchForm') { e.preventDefault(); return void investigar(f); }
    if (f.id === 'v2AuditForm') { e.preventDefault(); return void auditar(f); }
    if (f.id === 'v2FanForm') { e.preventDefault(); return void fanout(f); }
  });

  // ─── Arranque ─────────────────────────────────────────────────────────────
  leerQuery();
  sincronizarPeriodoClasico();
  if (!location.hash || location.hash === '#') history.replaceState(null, '', location.pathname + location.search + '#resumen');
  readRoute();
})();
