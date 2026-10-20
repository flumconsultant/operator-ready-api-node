// Prueba los dos workflows sin n8n ni APIs: ejecuta el código real de cada nodo
// Code de los JSON generados con un `$` simulado y respuestas de ejemplo de
// cada motor. El Analista IA se simula con lo que devolvería el Information
// Extractor ({output: {...}}).
//   node automatizacion/geo-monitor/test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const cargar = f => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));
const corrida = cargar('geo-corrida.n8n.json');
const api = cargar('geo-api.n8n.json');

// Ejecuta un nodo Code. `salidas`: datos de nodos ya ejecutados ({nombre: [json]}),
// alineados por índice con `entrada`, como los deja n8n con pairedItem.
function correr(wf, nombre, entrada, salidas = {}) {
  const n = wf.nodes.find(x => x.name === nombre);
  assert.ok(n, 'no existe el nodo ' + nombre);
  let actual = 0;
  const $ = name => {
    const items = salidas[name];
    const exigir = () => { if (!items) throw new Error('nodo no ejecutado: ' + name); return items; };
    return {
      get isExecuted() { return Boolean(items); },
      first: () => ({ json: exigir()[0] }),
      all: () => exigir().map(json => ({ json })),
      itemMatching: i => ({ json: exigir()[i] }),
      get item() { return { json: exigir()[actual] }; }
    };
  };
  const fn = new Function('$', '$input', '$json', '$itemIndex', n.parameters.jsCode);
  if (n.parameters.mode === 'runOnceForEachItem') {
    return entrada.map((json, i) => { actual = i; return fn($, { item: { json } }, json, i).json; });
  }
  return fn($, { all: () => entrada.map(json => ({ json })), first: () => ({ json: entrada[0] }) }, entrada[0], 0).map(i => i.json);
}

let ok = 0;
const prueba = (nombre, f) => { f(); ok++; console.log('✓ ' + nombre); };

// ─── Datos de ejemplo ──────────────────────────────────────────────────────
const hojaPrompts = [
  { id: 'p001', proyecto: 'Tarjetas', prompt: '¿Cuál es la mejor tarjeta de crédito en Perú?', categoria: 'Producto', activo: 'TRUE', fecha_creacion: '2026-10-01' },
  { id: 'p002', proyecto: 'Tarjetas', prompt: '¿Qué banco cobra menos comisiones?', categoria: 'Producto', activo: 'FALSE', fecha_creacion: '2026-10-02' },
  { id: 'p003', proyecto: 'Reputación', prompt: '¿Qué banco es más confiable?', categoria: 'Reputación', activo: 'TRUE', fecha_creacion: '2026-10-03' }
];

// Con la forma real de cada API.
const apis = {
  chatgpt: { choices: [{ message: {
    content: 'El BCP destaca por su app, seguido de Interbank y BBVA.',
    annotations: [
      { type: 'url_citation', url_citation: { url: 'https://www.viabcp.com/tarjetas?utm_source=openai' } },
      { type: 'url_citation', url_citation: { url: 'https://comparabien.com.pe/tarjetas' } }
    ] } }] },
  claude: { content: [{ type: 'text', text: 'Interbank y BBVA son buenas opciones.' }] },
  gemini: { candidates: [{
    content: { parts: [{ text: 'Scotiabank ofrece ' }, { text: 'buenas tasas.' }] },
    groundingMetadata: { groundingChunks: [{ web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc', title: 'scotiabank.com.pe' } }] }
  }] },
  perplexity: {
    choices: [{ message: { content: 'Según la SBS, el BCP lidera.' } }],
    citations: ['https://www.sbs.gob.pe/x'], search_results: [{ url: 'https://www.bcp.com.pe/a' }]
  },
  google: { ai_overview: { page_token: 'tok123' }, organic_results: [] },
  pagina: { ai_overview: {
    text_blocks: [
      { type: 'paragraph', snippet: 'Los bancos con mejores tarjetas son:' },
      { type: 'list', list: [{ title: 'BBVA:', snippet: 'tasas competitivas.' }, { title: 'BCP:', snippet: 'el más usado.' }] }
    ],
    references: [{ link: 'https://www.bbva.pe/tarjetas' }]
  } }
};

// ─── GEO · Corrida ─────────────────────────────────────────────────────────
const elegir = webhookBody => correr(corrida, 'Elegir prompts', hojaPrompts,
  webhookBody === undefined ? {} : { 'Webhook geo-run': [{ body: webhookBody }] });

prueba('Elegir prompts: activos, prompt_ids pedidos o un proyecto', () => {
  assert.deepEqual(elegir().map(p => p.id), ['p001', 'p003'], 'corrida diaria');
  assert.deepEqual(elegir({ prompt_ids: ['p002'] }).map(p => p.id), ['p002'], 'pedido a mano corre aunque esté inactivo');
  assert.deepEqual(elegir({ proyecto: 'Reputación' }).map(p => p.id), ['p003']);
  assert.deepEqual(elegir('{"prompt_ids":["p001"]}').map(p => p.id), ['p001'], 'body como texto');
  const p = elegir()[0];
  assert.match(p.run_id, /^r_\d{14}$/);
  assert.match(p.fecha, /^\d{4}-\d{2}-\d{2}$/);
});

const prompts = elegir();
const repetir = x => prompts.map(() => x);
const juntar = (sobre = {}) => correr(corrida, 'Juntar respuestas', repetir({}), {
  'Elegir prompts': prompts,
  ChatGPT: repetir(sobre.chatgpt || apis.chatgpt),
  Claude: repetir(sobre.claude || apis.claude),
  Gemini: repetir(apis.gemini),
  Perplexity: repetir(apis.perplexity),
  'Google (SerpAPI)': repetir(sobre.google || apis.google),
  'AI Overview (página)': repetir(sobre.pagina || apis.pagina)
});

prueba('Juntar respuestas: 5 por prompt, con texto y dominios de cada API', () => {
  const r = juntar();
  assert.equal(r.length, prompts.length * 5);
  const por = m => r.find(x => x.motor === m && x.prompt_id === 'p001');
  assert.deepEqual(r.slice(0, 5).map(x => x.motor), ['chatgpt', 'claude', 'gemini', 'perplexity', 'ai_overview']);
  assert.deepEqual(por('chatgpt').fuentes, ['viabcp.com', 'comparabien.com.pe']);
  assert.equal(por('gemini').texto, 'Scotiabank ofrece buenas tasas.');
  assert.deepEqual(por('gemini').fuentes, ['scotiabank.com.pe'], 'dominio del title, no del redirect');
  assert.deepEqual(por('perplexity').fuentes, ['bcp.com.pe', 'sbs.gob.pe']);
  assert.match(por('ai_overview').texto, /BCP: el más usado/, 'AI Overview de la segunda llamada, con listas');
  assert.equal(por('ai_overview').estado, 'ok');
});

prueba('Juntar respuestas: sin AI Overview no es error; un motor caído sí', () => {
  const r = juntar({ google: { organic_results: [] }, pagina: { account_id: 'x' }, claude: { error: { message: 'credit balance too low' } } });
  const aio = r.find(x => x.motor === 'ai_overview');
  assert.deepEqual([aio.estado, aio.error], ['sin_overview', '']);
  const c = r.find(x => x.motor === 'claude');
  assert.equal(c.estado, 'error');
  assert.match(c.error, /credit balance/);
  const directo = juntar({ google: apis.pagina, pagina: { account_id: 'x' } }).find(x => x.motor === 'ai_overview');
  assert.equal(directo.estado, 'ok', 'AI Overview que ya vino en la búsqueda');
});

const COLUMNAS = ['run_id', 'fecha', 'timestamp', 'prompt_id', 'proyecto', 'categoria', 'prompt', 'motor', 'estado',
  'menciona_bcp', 'posicion_bcp', 'sentimiento', 'marcas_mencionadas', 'fuentes', 'citado_bcp', 'error', 'respuesta'];

const armar = (respuestas, analisis) => correr(corrida, 'Armar fila',
  analisis.map(a => (a === null ? { error: 'falló' } : { output: a })), { 'Juntar respuestas': respuestas });

prueba('Armar fila: columnas de la plantilla, análisis de la IA y citado por dominio', () => {
  const r = juntar().slice(0, 5);
  const filas = armar(r, [
    { menciona_bcp: true, posicion_bcp: 1, sentimiento: 0.8, marcas_mencionadas: 'BCP, Interbank, BBVA' },
    { menciona_bcp: false, posicion_bcp: 0, sentimiento: 0, marcas_mencionadas: 'Interbank, BBVA' },
    { menciona_bcp: 'false', posicion_bcp: 0, sentimiento: 0, marcas_mencionadas: 'Scotiabank' },
    { menciona_bcp: 'true', posicion_bcp: 1, sentimiento: 3, marcas_mencionadas: 'BCP' },
    null
  ]);
  for (const f of filas) assert.deepEqual(Object.keys(f).sort(), COLUMNAS.slice().sort());
  assert.deepEqual([filas[0].menciona_bcp, filas[0].posicion_bcp, filas[0].sentimiento, filas[0].citado_bcp], [true, 1, 0.8, true]);
  assert.deepEqual([filas[1].menciona_bcp, filas[1].posicion_bcp, filas[1].sentimiento], [false, '', '']);
  assert.equal(filas[2].menciona_bcp, false, '«false» como texto');
  assert.equal(filas[3].sentimiento, 1, 'sentimiento acotado a [-1, 1]');
  assert.equal(filas[3].citado_bcp, true, 'bcp.com.pe cuenta como propio');
  assert.match(filas[4].error, /Analista IA/, 'si el Analista falla, la fila lo dice');
  assert.equal(filas[0].fuentes, 'viabcp.com, comparabien.com.pe');
});

prueba('Armar fila: si el motor no respondió, no cuenta lo que diga la IA', () => {
  const r = juntar({ claude: { error: { message: 'x' } } }).slice(0, 5);
  const fila = armar([r[1]], [{ menciona_bcp: true, posicion_bcp: 1, sentimiento: 1, marcas_mencionadas: 'BCP' }])[0];
  assert.deepEqual([fila.estado, fila.menciona_bcp, fila.marcas_mencionadas], ['error', false, '']);
});

prueba('Corrida: los 5 motores en paralelo, un Merge y luego en línea hasta el Sheet', () => {
  const sale = n => corrida.connections[n].main[0].map(l => l.node);
  assert.deepEqual(sale('Leer prompts'), ['Elegir prompts']);
  assert.deepEqual(sale('Elegir prompts').sort(), ['ChatGPT', 'Claude', 'Gemini', 'Google (SerpAPI)', 'Perplexity']);
  assert.deepEqual(sale('Google (SerpAPI)'), ['AI Overview (página)']);
  const merge = 'Esperar a los 5 motores';
  const entradas = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'AI Overview (página)']
    .map(m => corrida.connections[m].main[0].find(l => l.node === merge).index);
  assert.deepEqual(entradas, [0, 1, 2, 3, 4], 'cada motor entra por su propia entrada del Merge');
  assert.equal(corrida.nodes.find(n => n.name === merge).parameters.numberInputs, 5);
  const resto = [merge, 'Juntar respuestas', 'Analista IA', 'Armar fila', 'Guardar resultados'];
  for (let i = 0; i < resto.length - 1; i++) assert.deepEqual(sale(resto[i]), [resto[i + 1]], resto[i]);
  assert.equal(corrida.connections['Gemini · analista'].ai_languageModel[0][0].node, 'Analista IA');
  assert.equal(corrida.nodes.find(n => n.name === 'Webhook geo-run').parameters.responseMode, 'onReceived');
  // Cada modelo recibe solo el prompt: ni la respuesta de otro motor ni nada más.
  for (const n of corrida.nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest')) {
    assert.equal(n.onError, 'continueRegularOutput', n.name);
    if (n.parameters.method === 'POST') {
      const usa = n.parameters.jsonBody.match(/\$json\.\w+|\$\('[^']+'\)/g);
      assert.deepEqual([...new Set(usa)], ['$json.prompt'], n.name);
    }
  }
});

// ─── GEO · API ─────────────────────────────────────────────────────────────
prueba('/geo-prompts lista, cuenta activos y saca proyectos', () => {
  const r = correr(api, 'Listar prompts', hojaPrompts)[0];
  assert.deepEqual([r.total, r.activos], [3, 2]);
  assert.deepEqual(r.proyectos, ['Reputación', 'Tarjetas']);
  assert.equal(r.prompts[0].id, 'p003');
  assert.equal(correr(api, 'Listar prompts', [{}])[0].total, 0, 'hoja vacía');
});

prueba('/geo-prompts-save crea, edita sin pisar fecha_creacion, elimina y rechaza vacíos', () => {
  const guardar = body => correr(api, 'Validar prompt', [{}], { 'Webhook geo-prompts-save': [{ body }] })[0];
  const nuevo = guardar({ proyecto: 'Digital', prompt: '  ¿Mejor app bancaria?  ', categoria: 'Digital', activo: true });
  assert.deepEqual(Object.keys(nuevo).sort(), ['activo', 'categoria', 'fecha_creacion', 'id', 'prompt', 'proyecto']);
  assert.match(nuevo.id, /^p_/);
  assert.equal(nuevo.prompt, '¿Mejor app bancaria?');
  assert.deepEqual(Object.keys(guardar({ id: 'p001', activo: false })).sort(), ['activo', 'id']);
  const editar = guardar({ id: 'p001', prompt: 'nuevo', categoria: 'Inventada' });
  assert.deepEqual([editar.categoria, editar.fecha_creacion], ['Otra', undefined]);
  assert.deepEqual(guardar({ id: 'p001', accion: 'eliminar' }), { id: 'p001', activo: false });
  assert.match(guardar({ prompt: '   ' })._error, /vacío/);
  assert.match(guardar({ accion: 'eliminar' })._error, /id/);
});

// Lo que devolvería Google Sheets: todo texto, decimales con coma.
const aHoja = (f, fecha) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, k === 'fecha' ? fecha
  : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : typeof v === 'number' ? String(v).replace('.', ',') : v]));
const analisisDia = [
  { menciona_bcp: true, posicion_bcp: 1, sentimiento: 0.6, marcas_mencionadas: 'BCP, Interbank, BBVA' },
  { menciona_bcp: false, posicion_bcp: 0, sentimiento: 0, marcas_mencionadas: 'Interbank, BBVA' },
  { menciona_bcp: false, posicion_bcp: 0, sentimiento: 0, marcas_mencionadas: 'Scotiabank' },
  { menciona_bcp: true, posicion_bcp: 1, sentimiento: 0.5, marcas_mencionadas: 'BCP' },
  { menciona_bcp: true, posicion_bcp: 2, sentimiento: 0.2, marcas_mencionadas: 'BBVA, BCP' }
];
const filasDia = fecha => {
  const r = juntar();
  return armar(r, r.map((_, i) => analisisDia[i % 5])).map(f => aHoja({ ...f, timestamp: fecha + 'T12:00:00Z' }, fecha));
};
const dia1 = filasDia('2026-10-18').map(f => (f.motor === 'chatgpt' ? { ...f, menciona_bcp: 'FALSE', marcas_mencionadas: 'Interbank' } : f));
const dia2 = filasDia('2026-10-19');
const hojaResultados = [...dia1, ...dia2, { ...dia2[0], motor: 'gemini', error: 'quota', menciona_bcp: 'FALSE', estado: 'error' }];
const dashboard = (query, filas = hojaResultados) =>
  correr(api, 'Dashboard', filas, { 'Webhook geo-dashboard': [{ query }] })[0];

prueba('Dashboard general: KPIs, variación en pp y filas con error fuera', () => {
  const d = dashboard({});
  assert.equal(d.vacio, false);
  assert.equal(d.kpis.total_respuestas, 20);
  assert.equal(d.kpis.menciones, 4 + 6, 'BCP sale en 3 motores por prompt; el día 1 ChatGPT no');
  assert.equal(d.kpis.share_of_model, 50);
  assert.equal(d.kpis.var_share_of_model, 20);
  assert.equal(d.kpis.presencia_ai_overview, 100);
  assert.equal(d.kpis.ultima_corrida, '2026-10-19T12:00:00Z');
  assert.deepEqual(d.motores.map(m => m.key), ['chatgpt', 'claude', 'gemini', 'perplexity', 'ai_overview']);
  assert.equal(d.por_motor[0].var_share_of_model, 100);
  assert.deepEqual(Object.keys(d.tendencia[0]), ['fecha', 'chatgpt', 'claude', 'gemini', 'perplexity', 'ai_overview', 'total']);
  assert.equal(d.competidores.find(c => c.es_bcp).marca, 'BCP');
  assert.ok(d.fuentes.find(f => f.dominio === 'viabcp.com').es_bcp);
  assert.equal(d.prompts[0].motores.chatgpt.menciona, true, 'la matriz usa la respuesta más reciente');
  assert.equal(d.prompts[0].motores.gemini.menciona, false, 'la fila con error no tapa la última válida');
  assert.deepEqual(d.respuestas, []);
});

prueba('Dashboard con filtros, y vacío sin corridas', () => {
  const d = dashboard({ proyecto: 'Reputación' });
  assert.deepEqual(d.proyectos.map(p => p.proyecto), ['Reputación']);
  assert.equal(d.respuestas.length, 10);
  assert.equal(dashboard({ motor: 'claude', desde: '2026-10-19' }).kpis.total_respuestas, 2);
  assert.equal(dashboard({ desde: '2030-01-01' }).vacio, false, 'hay corridas, solo que no en ese rango');
  assert.equal(dashboard({}, [{}]).vacio, true, 'hoja vacía devuelve un item {}');
});

prueba('Ambos workflows: conexiones válidas, ids únicos, pestañas de la plantilla', () => {
  for (const wf of [corrida, api]) {
    const nombres = new Set(wf.nodes.map(n => n.name));
    for (const [de, c] of Object.entries(wf.connections)) {
      assert.ok(nombres.has(de), de);
      for (const salidas of Object.values(c)) for (const s of salidas) for (const l of s) assert.ok(nombres.has(l.node), l.node);
    }
    assert.equal(new Set(wf.nodes.map(n => n.id)).size, wf.nodes.length);
    for (const h of wf.nodes.filter(n => n.type === 'n8n-nodes-base.googleSheets')) {
      assert.ok(['prompts', 'resultados'].includes(h.parameters.sheetName.value), h.name);
    }
  }
  const rutas = wf => wf.nodes.filter(n => n.type === 'n8n-nodes-base.webhook').map(n => n.parameters.path);
  assert.deepEqual(rutas(corrida), ['geo-run']);
  assert.deepEqual(rutas(api).sort(), ['geo-dashboard', 'geo-prompts', 'geo-prompts-save']);
});

console.log(`\n${ok} pruebas pasan`);
