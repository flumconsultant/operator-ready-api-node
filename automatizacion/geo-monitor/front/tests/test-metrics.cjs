// Pruebas de las fórmulas del SPEC v2 §4: node test-metrics.cjs
const assert = require('node:assert/strict');
const G = require('../dist/geo-metrics.js');

let ok = 0;
const prueba = (nombre, f) => { f(); ok++; console.log('✓ ' + nombre); };
const M = G.MARCAS_BASE;
const cerca = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg || ''} ${a} ≠ ${b}`);

// Cuatro respuestas válidas + una con error.
const det = (...xs) => xs.map(([marca, posicion, menciones, sentimiento, recomendada]) => ({ marca, posicion, menciones, sentimiento, recomendada }));
const filas = [
  { id: 'a', promptId: 'p1', modelId: 'chatgpt', date: '2026-10-10', status: 'ok', brandMentioned: true, position: 1, mentions: 3, sentiment: 0.6,
    brandDetail: det(['BCP', 1, 3, 0.6, true], ['BBVA Perú', 2, 1, 0.2, false]), sources: [{ domain: 'viabcp.com', url: 'https://www.viabcp.com/ahorro' }, { domain: 'sbs.gob.pe', url: 'https://sbs.gob.pe/x' }], sov: 70 },
  { id: 'b', promptId: 'p1', modelId: 'claude', date: '2026-10-10', status: 'not_mentioned', brandMentioned: false, position: null, mentions: 0, sentiment: null,
    brandDetail: det(['Interbank', 1, 2, 0.5, true], ['BBVA', 2, 2, 0, false]), sources: [{ domain: 'mifinguia.com', url: 'https://mifinguia.com/mejores' }], sov: 0 },
  { id: 'c', promptId: 'p2', modelId: 'chatgpt', date: '2026-10-12', status: 'ok', brandMentioned: true, position: 2, mentions: 1, sentiment: -0.4,
    brandDetail: det(['Interbank', 1, 1, 0.3, true], ['BCP', 2, 1, -0.4, false]), sources: [{ domain: 'mifinguia.com', url: 'https://mifinguia.com/mejores' }], sov: 40 },
  { id: 'd', promptId: 'p2', modelId: 'claude', date: '2026-10-12', status: 'not_mentioned', brandMentioned: false, brandDetail: [], sources: [], sov: 0 },
  { id: 'e', promptId: 'p2', modelId: 'gemini', date: '2026-10-12', status: 'error', brandMentioned: false, brandDetail: det(['BCP', 1, 9, 1, true]), sources: [{ domain: 'viabcp.com' }], sov: 100 }
];

prueba('Cobertura excluye errores del denominador', () => {
  const m = G.metricasMarca(filas, 'bcp', M);
  assert.equal(m.valid, 4);
  assert.equal(m.coverage, 50, '2 de 4 válidas; la de error no cuenta');
  assert.equal(G.metricasMarca(filas.filter(f => f.status === 'error'), 'bcp', M).coverage, null, 'sin válidas: sin dato, no 0%');
});

prueba('Posición ignora respuestas sin mención', () => {
  assert.equal(G.metricasMarca(filas, 'bcp', M).position, 1.5);
  assert.equal(G.metricasMarca(filas, 'interbank', M).position, 1);
  assert.equal(G.metricasMarca(filas, 'bbva', M).position, 2);
});

prueba('Sentimiento en −100…+100, solo donde aparece', () => {
  cerca(G.metricasMarca(filas, 'bcp', M).sentiment, 10, '(60 − 40) / 2');
  assert.equal(G.metricasMarca(filas, 'scotiabank', M).sentiment, null);
});

prueba('SOV de menciones: suma 100% entre marcas y excluye errores', () => {
  const sov = G.sovMenciones(filas, M);
  const suma = Object.values(sov).filter(v => v !== null).reduce((a, b) => a + b, 0);
  cerca(suma, 100, 'suma');
  cerca(sov.bcp, 4 / 10 * 100, 'BCP 3 + 1 de 10 menciones');
  cerca(sov.interbank, 30);
  cerca(sov.bbva, 30, 'BBVA Perú y BBVA son la misma marca');
  assert.equal(sov.scotiabank, 0);
  const vacio = G.sovMenciones([filas[4]], M);
  assert.equal(vacio.bcp, null, 'solo errores: sin dato');
});

prueba('Menciones de marca, totales y probabilidad de compra', () => {
  const m = G.metricasMarca(filas, 'bcp', M);
  assert.deepEqual([m.responsesMentioning, m.totalMentions], [2, 4]);
  assert.equal(m.purchaseProbability, 50, 'recomendada en 1 de las 2 donde aparece');
  assert.equal(G.metricasMarca(filas, 'interbank', M).purchaseProbability, 100);
});

prueba('SOV ponderado (legado): promedio del SoV de n8n en respuestas válidas', () => {
  cerca(G.sovPonderado(filas), (70 + 0 + 40 + 0) / 4);
});

prueba('Delta = periodo actual − periodo anterior; sin anterior, null', () => {
  assert.equal(G.delta(50, 30), 20);
  assert.equal(G.delta(50, null), null);
  const prev = [Object.assign({}, filas[0], { id: 'z', date: '2026-09-30' }), Object.assign({}, filas[1], { id: 'y', date: '2026-09-30' })];
  const r = G.ranking(filas, prev, M).find(x => x.brand.id === 'bcp');
  assert.equal(r.delta.coverage, 0, '50% vs 50%');
  assert.equal(r.delta.position, 0.5, '1,5 vs 1: subir es peor');
});

prueba('Periodos: presets inclusivos y anterior de igual longitud', () => {
  const p = G.periodo('last14', '2026-10-19');
  assert.deepEqual([p.start, p.end, p.days], ['2026-10-06', '2026-10-19', 14]);
  assert.deepEqual(p.previous, { start: '2026-09-22', end: '2026-10-05' });
  const c = G.periodo('custom', '2026-10-19', '2026-10-01', '2026-10-10');
  assert.deepEqual([c.days, c.previous.start, c.previous.end], [10, '2026-09-21', '2026-09-30']);
  assert.equal(G.periodo('custom', '2026-10-19', '2026-10-10', '2026-10-01').days, 14, 'rango invertido: vuelve al default');
});

prueba('Sin brandDetail se usa el orden del ranking (datos antiguos o demo)', () => {
  const o = { id: 'x', status: 'ok', brandMentioned: true, position: 2, mentions: 2, sentiment: 0.5, ranking: ['Interbank', 'BCP', 'Banco XYZ', 'BBVA Perú'], sources: [] };
  const men = G.menciones(o, M);
  assert.deepEqual(men.map(m => [m.brandId, m.rank]), [['interbank', 1], ['bcp', 2], ['bbva', 3]], 'marcas no seguidas fuera');
  assert.equal(men.find(m => m.brandId === 'bcp').sentiment, 50);
  assert.equal(men.find(m => m.brandId === 'bcp').count, 2);
});

prueba('Citas: URLs, ¿menciona a BCP?, competidores y categoría', () => {
  const u = G.urls(filas, M, { 'sbs.gob.pe': 'government_ngo' });
  const mif = u.find(x => x.domain === 'mifinguia.com');
  assert.deepEqual([mif.citations, mif.mentionsOwnBrand, mif.category], [2, 'yes', 'comparator']);
  assert.deepEqual(mif.competitorsMentioned.sort(), ['bbva', 'interbank']);
  assert.equal(u.find(x => x.domain === 'viabcp.com').mentionsOwnBrand, 'na', 'dominio propio');
  assert.equal(u.find(x => x.domain === 'sbs.gob.pe').category, 'government_ngo');
  assert.equal(u.some(x => x.citations > 2), false, 'la respuesta con error no suma citas');
  assert.deepEqual(G.citasMarca(filas, M), { own: 1, total: 4 });
});

prueba('Estados de citas vs periodo anterior', () => {
  assert.deepEqual([G.estadoCita(3, 0), G.estadoCita(0, 2), G.estadoCita(4, 2), G.estadoCita(1, 2), G.estadoCita(2, 2)], ['new', 'lost', 'increased', 'decreased', 'stable']);
  const prev = [{ id: 'q', promptId: 'p9', status: 'ok', brandMentioned: false, sources: [{ domain: 'rankia.pe', url: 'https://rankia.pe/a' }, { domain: 'mifinguia.com', url: 'https://mifinguia.com/mejores' }] }];
  const c = G.cambiosCitas(filas, prev, M, {});
  assert.equal(c.find(x => x.domain === 'rankia.pe').status, 'lost');
  assert.equal(c.find(x => x.domain === 'mifinguia.com').status, 'increased');
  assert.equal(c.find(x => x.domain === 'viabcp.com').status, 'new');
});

prueba('Mix por categoría y cobertura de dominio', () => {
  const mix = G.mixCategorias(filas, M, { 'sbs.gob.pe': 'government_ngo' });
  cerca(mix.reduce((a, b) => a + b.share, 0), 100);
  assert.equal(mix[0].category, 'comparator');
  assert.equal(G.coberturaDominio(filas, 'mifinguia.com'), 50, '2 de 4 respuestas válidas');
  assert.equal(G.coberturaDominio(filas, 'viabcp.com'), 25, 'la de error no cuenta');
});

prueba('Cuadrantes del índice de visibilidad (umbrales 30 / 50)', () => {
  assert.deepEqual([G.cuadrante(69, 93), G.cuadrante(15, 60), G.cuadrante(40, 20), G.cuadrante(8.6, 39), G.cuadrante(null, 50)],
    ['leaders', 'niche', 'low_conversion', 'underperformers', null]);
  assert.equal(G.cuadrante(25, 40, { coverage: 20, probability: 40 }), 'leaders', 'umbrales configurables');
});

prueba('Índice de visibilidad: muestra mínima y umbrales del promedio del mercado', () => {
  const m = G.metricasMarca(filas, 'bcp', M);
  assert.equal(m.probabilitySample, 2, 'respuestas con dato de «recomendada»');
  const rk = [
    { coverage: 60, purchaseProbability: 50, probabilitySample: 30 },
    { coverage: 40, purchaseProbability: 30, probabilitySample: 20 },
    { coverage: 2, purchaseProbability: 0, probabilitySample: 1 }
  ];
  assert.deepEqual(G.umbralesMercado(rk), { coverage: 50, probability: 42 }, 'probabilidad ponderada: (50×30 + 30×20) / 50; la marca con n=1 no cuenta');
  assert.equal(G.umbralesMercado([{ coverage: 5, purchaseProbability: 100, probabilitySample: 2 }]), null);
  assert.equal(G.cuadrante(60, 50, G.umbralesMercado(rk)), 'leaders');
});

prueba('Recomendaciones por reglas, con evidencia e impacto calculado', () => {
  const prompts = [
    { id: 'p1', text: '¿Cuál es la mejor cuenta de ahorros?', funnelStage: 'tofu', intentVolume: 4, active: true },
    { id: 'p2', text: '¿Qué banco es mejor que BCP en Perú?', funnelStage: 'mofu', intentVolume: 2, active: true, isBranded: true }
  ];
  const audits = [{ type: 'crawl', url: 'https://www.viabcp.com/', executedAt: '2026-10-20', result: { critico: true, resumen: { blocked: 0, unreachable: 21, robotsTxt: 'na' }, bots: Array(21).fill({ serverAccess: 'unreachable' }) } }];
  const r = G.recomendaciones({ rows: filas, prompts, marcas: M, categorias: {}, audits, estados: { branded_prompts: { status: 'todo' } } });
  const tipo = t => r.filter(x => x.type === t);
  assert.equal(tipo('new_page').length, 1, 'p2: BCP sin cita propia y con competidores');
  assert.equal(tipo('new_page')[0].evidence.promptId, 'p2');
  assert.deepEqual(tipo('new_page')[0].evidence.competitorUrls, ['https://mifinguia.com/mejores']);
  assert.match(tipo('prompt_mix')[0].title, /50% de prompts son TOFU/);
  assert.equal(tipo('branded_prompts')[0].status, 'todo', 'estado guardado en el Sheet');
  assert.equal(tipo('technical')[0].impact, 'high');
  assert.equal(r[0].impact, 'high', 'orden por impacto');
  assert.equal(G.titular('¿Cuáles son los plazos fijos más rentables?'), 'Los plazos fijos más rentables');
  assert.ok(!r.some(x => /2 horas/.test(JSON.stringify(x))), 'sin esfuerzo fijo');
});

prueba('Salud de datos: última corrida por motor, ámbar >8 días, rojo >14', () => {
  const obs = [
    { modelId: 'chatgpt', date: '2026-10-01', status: 'ok' }, { modelId: 'chatgpt', date: '2026-10-19', status: 'error' },
    { modelId: 'claude', date: '2026-10-18', status: 'ok' }, { modelId: 'gemini', date: '2026-10-10', status: 'not_mentioned' }
  ];
  const s = G.salud(obs, '2026-10-20', [{ id: 'chatgpt' }, { id: 'claude' }, { id: 'gemini' }, { id: 'perplexity' }]);
  const e = id => s.engines.find(x => x.engine === id);
  assert.deepEqual([e('chatgpt').lastRun, e('chatgpt').level, e('chatgpt').errorsLastRun], ['2026-10-01', 'red', 1], 'la corrida con error no cuenta como última');
  assert.deepEqual([e('claude').level, e('gemini').level, e('perplexity').level], ['ok', 'amber', 'none']);
  assert.equal(s.level, 'red');
  assert.equal(s.errors, 1);
});

prueba('Series por día y por semana', () => {
  const s = G.serie(filas, M, 'coverage', 'day');
  assert.deepEqual(s.dates, ['2026-10-10', '2026-10-12']);
  assert.deepEqual(s.series.find(x => x.brand.id === 'bcp').values, [50, 50]);
  const w = G.serie(filas, M, 'sov', 'week');
  assert.deepEqual(w.dates, ['2026-10-05', '2026-10-12']);
});

console.log(`\n${ok} pruebas de métricas pasan`);
