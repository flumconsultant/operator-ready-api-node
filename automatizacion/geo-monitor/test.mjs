// Prueba los dos workflows sin n8n ni APIs: ejecuta el código real de cada nodo
// Code de los JSON generados con un `$` simulado y respuestas de ejemplo de
// cada motor. El Analista IA se simula con lo que devolvería el Information
// Extractor ({output: {...}}).
//   node automatizacion/geo-monitor/test.mjs
import { readFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// Lo publicado (SerpAPI apagado) y una versión con SerpAPI encendido, armada
// aparte, para seguir probando AI Overview.
const cargar = f => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));
const publicado = cargar('geo-corrida.n8n.json');
const api = cargar('geo-api.n8n.json');
const tmp = mkdtempSync(join(tmpdir(), 'geo-'));
execFileSync(process.execPath, [fileURLToPath(new URL('build.mjs', import.meta.url))], { env: { ...process.env, GEO_SERPAPI: '1', GEO_BUILD_OUT: tmp } });
const corrida = JSON.parse(readFileSync(join(tmp, 'geo-corrida.n8n.json'), 'utf8'));

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
  // URL va como undefined: el sandbox de los nodos Code de n8n no lo trae.
  const fn = new Function('$', '$input', '$json', '$itemIndex', 'URL', n.parameters.jsCode);
  if (n.parameters.mode === 'runOnceForEachItem') {
    return entrada.map((json, i) => { actual = i; return fn($, { item: { json } }, json, i, undefined).json; });
  }
  return fn($, { all: () => entrada.map(json => ({ json })), first: () => ({ json: entrada[0] }) }, entrada[0], 0, undefined).map(i => i.json);
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
  'menciona_bcp', 'posicion_bcp', 'sentimiento', 'marcas_mencionadas', 'fuentes', 'citado_bcp', 'error', 'respuesta',
  'n_menciones_bcp', 'n_menciones_bancos', 'detalle_marcas', 'sov_bcp'];

const armar = (respuestas, analisis) => correr(corrida, 'Armar fila',
  analisis.map(a => (a === null ? { error: 'falló' } : { output: a })), { 'Juntar respuestas': respuestas });

prueba('Armar fila: columnas de la plantilla, análisis de la IA y citado por dominio', () => {
  const r = juntar().slice(0, 5);
  const filas = armar(r, [
    { menciona_bcp: true, posicion_bcp: 1, sentimiento: 0.8, marcas_mencionadas: 'BCP, Interbank, BBVA', n_menciones_bcp: 2, n_menciones_bancos: 4 },
    { menciona_bcp: false, posicion_bcp: 0, sentimiento: 0, marcas_mencionadas: 'Interbank, BBVA', n_menciones_bcp: 3, n_menciones_bancos: 2 },
    { menciona_bcp: 'false', posicion_bcp: 0, sentimiento: 0, marcas_mencionadas: 'Scotiabank' },
    { menciona_bcp: 'true', posicion_bcp: 1, sentimiento: 3, marcas_mencionadas: 'Banco de Crédito del Perú, banco pichincha, BCP, Banco Falabella' },
    null
  ]);
  for (const f of filas) assert.deepEqual(Object.keys(f).sort(), COLUMNAS.slice().sort());
  assert.deepEqual([filas[0].menciona_bcp, filas[0].posicion_bcp, filas[0].sentimiento, filas[0].citado_bcp], [true, 1, 0.8, true]);
  assert.deepEqual([filas[1].menciona_bcp, filas[1].posicion_bcp, filas[1].sentimiento], [false, '', '']);
  assert.equal(filas[2].menciona_bcp, false, '«false» como texto');
  assert.equal(filas[3].sentimiento, 1, 'sentimiento acotado a [-1, 1]');
  assert.equal(filas[3].citado_bcp, true, 'bcp.com.pe cuenta como propio');
  assert.equal(filas[3].marcas_mencionadas, 'BCP, Pichincha, Banco Falabella', 'nombres canónicos y sin repetir');
  assert.match(filas[4].error, /Analista IA/, 'si el Analista falla, la fila lo dice');
  assert.deepEqual([filas[4].estado, filas[4].menciona_bcp], ['error', false], 'y no cuenta como «no menciona»');
  assert.ok(filas[4].respuesta, 'pero conserva la respuesta del motor');
  assert.equal(filas[0].fuentes, 'viabcp.com, comparabien.com.pe');
  assert.deepEqual([filas[0].n_menciones_bcp, filas[0].n_menciones_bancos], [2, 4]);
  assert.deepEqual([filas[1].n_menciones_bcp, filas[1].n_menciones_bancos], [0, 2], 'sin mención, BCP cuenta 0 aunque la IA diga otra cosa');
});

prueba('Share of Voice: posición, prominencia y contexto, como en la estrategia', () => {
  const r = juntar().slice(0, 1);
  const [f] = armar(r, [{
    menciona_bcp: true, posicion_bcp: 1, sentimiento: 0.8, marcas_mencionadas: 'BCP, Interbank, BBVA',
    n_menciones_bcp: 2, n_menciones_bancos: 4,
    detalle_marcas: '```json\n[{"marca":"Banco de Crédito del Perú","posicion":1,"menciones":2,"sentimiento":0.8},' +
      '{"marca":"Interbank","posicion":2,"menciones":1,"sentimiento":0},{"marca":"BBVA Perú","posicion":3,"menciones":1,"sentimiento":-0.5}]\n```'
  }]);
  // BCP: (1 + 2/4)/2 × 1 = 0,75 · Interbank: (1/2 + 1/4)/2 × 0,75 = 0,28125 · BBVA: (1/3 + 1/4)/2 × 0,25 = 0,0729
  // SoV BCP = 0,75 / 1,1042 = 67,9 %
  assert.equal(f.sov_bcp, 67.9);
  const d = JSON.parse(f.detalle_marcas);
  assert.deepEqual(d.map(x => x.marca), ['BCP', 'Interbank', 'BBVA'], 'nombres canónicos');
  // Sin mención de BCP, su SoV es 0 aunque haya detalle; con error, vacío.
  const [sin] = armar(r, [{ menciona_bcp: false, detalle_marcas: '[{"marca":"Interbank","posicion":1,"menciones":1,"sentimiento":0}]' }]);
  assert.deepEqual([sin.sov_bcp, JSON.parse(sin.detalle_marcas)[0].marca], [0, 'Interbank']);
  const [err] = armar(r, [null]);
  assert.deepEqual([err.sov_bcp, err.detalle_marcas], ['', '']);
  // JSON roto del Analista: no rompe la fila.
  const [roto] = armar(r, [{ menciona_bcp: true, posicion_bcp: 1, detalle_marcas: 'no es json' }]);
  assert.deepEqual([roto.detalle_marcas, roto.sov_bcp], ['', 0]);
});

prueba('Claude con búsqueda web: une el texto citado y toma las fuentes de las citas', () => {
  const claudeWeb = { content: [
    { type: 'server_tool_use', name: 'web_search' },
    { type: 'web_search_tool_result', content: [{ url: 'https://www.sbs.gob.pe/x' }, { url: 'https://www.viabcp.com/y' }] },
    { type: 'text', text: 'El BCP es el banco más grande ' },
    { type: 'text', text: 'del Perú', citations: [{ type: 'web_search_result_location', url: 'https://www.viabcp.com/y' }] },
    { type: 'text', text: '.' }
  ] };
  const [f] = juntar({ claude: claudeWeb }).filter(x => x.motor === 'claude');
  assert.equal(f.texto, 'El BCP es el banco más grande del Perú.');
  assert.deepEqual(f.fuentes, ['viabcp.com'], 'cuentan las citadas');
  const sinCitas = { content: [claudeWeb.content[1], { type: 'text', text: 'BCP' }] };
  assert.deepEqual(juntar({ claude: sinCitas }).find(x => x.motor === 'claude').fuentes, ['sbs.gob.pe', 'viabcp.com'], 'si no citó, las consultadas');
  const body = publicado.nodes.find(n => n.name === 'Claude').parameters.jsonBody;
  assert.match(body, /web_search_20260209/);
  assert.match(body, /Lima, Perú/);
  assert.doesNotMatch(body, /country/, 'la búsqueda web de Claude rechaza country PE');
});

prueba('Armar fila: si el motor no respondió, no cuenta lo que diga la IA', () => {
  const r = juntar({ claude: { error: { message: 'x' } } }).slice(0, 5);
  const fila = armar([r[1]], [{ menciona_bcp: true, posicion_bcp: 1, sentimiento: 1, marcas_mencionadas: 'BCP' }])[0];
  assert.deepEqual([fila.estado, fila.menciona_bcp, fila.marcas_mencionadas], ['error', false, '']);
});

prueba('Corrida con SerpAPI: los 5 motores en paralelo, un Merge y luego en línea hasta el Sheet', () => {
  const sale = n => corrida.connections[n].main[0].map(l => l.node);
  assert.deepEqual(sale('Leer prompts'), ['Elegir prompts']);
  assert.deepEqual(sale('Elegir prompts').sort(), ['ChatGPT', 'Claude', 'Gemini', 'Google (SerpAPI)', 'Perplexity']);
  assert.deepEqual(sale('Google (SerpAPI)'), ['AI Overview (página)']);
  const merge = 'Esperar a los motores';
  const entradas = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'AI Overview (página)']
    .map(m => corrida.connections[m].main[0].find(l => l.node === merge).index);
  assert.deepEqual(entradas, [0, 1, 2, 3, 4], 'cada motor entra por su propia entrada del Merge');
  assert.equal(corrida.nodes.find(n => n.name === merge).parameters.numberInputs, 5);
  const resto = [merge, 'Juntar respuestas', 'Analista IA', 'Armar fila', 'Guardar resultados'];
  for (let i = 0; i < resto.length - 1; i++) assert.deepEqual(sale(resto[i]), [resto[i + 1]], resto[i]);
  assert.equal(corrida.connections['Claude · analista'].ai_languageModel[0][0].node, 'Analista IA');
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

prueba('Corrida publicada: SerpAPI apagado, 4 motores y sin filas de AI Overview', () => {
  const nombres = publicado.nodes.map(n => n.name);
  assert.ok(!nombres.includes('Google (SerpAPI)') && !nombres.includes('AI Overview (página)'), 'no llama a SerpAPI');
  assert.equal(publicado.nodes.find(n => n.name === 'Esperar a los motores').parameters.numberInputs, 4);
  assert.deepEqual(publicado.connections['Elegir prompts'].main[0].map(l => l.node).sort(), ['ChatGPT', 'Claude', 'Gemini', 'Perplexity']);
  const r = correr(publicado, 'Juntar respuestas', prompts.map(() => ({})), {
    'Elegir prompts': prompts, ChatGPT: repetir(apis.chatgpt), Claude: repetir(apis.claude),
    Gemini: repetir(apis.gemini), Perplexity: repetir(apis.perplexity)
  });
  assert.equal(r.length, prompts.length * 4);
  assert.ok(!r.some(x => x.motor === 'ai_overview'), 'apagado no es error: simplemente no hay fila');
  const cuerpo = n => publicado.nodes.find(x => x.name === n).parameters;
  assert.match(cuerpo('ChatGPT').jsonBody, /gpt-4o-mini-search-preview/);
  assert.match(cuerpo('Claude').jsonBody, /claude-sonnet-5-5/);
  assert.match(cuerpo('Gemini').url, /gemini-2\.5-flash-lite/);
  const analista = publicado.nodes.find(n => n.name === 'Claude · analista').parameters;
  assert.equal(analista.model.value, 'claude-haiku-5-5');
  assert.deepEqual(analista.options, {}, 'sin temperature: Haiku 5.5 la rechaza');
});

// ─── GEO · API ─────────────────────────────────────────────────────────────
prueba('/geo-prompts lista, cuenta activos y saca proyectos', () => {
  const r = correr(api, 'Listar prompts', hojaPrompts)[0];
  assert.deepEqual([r.total, r.activos], [3, 2]);
  assert.deepEqual(r.proyectos, ['Reputación', 'Tarjetas']);
  assert.ok(r.intenciones.includes('Comparativa'));
  const conCat = correr(api, 'Listar prompts', [{ ...hojaPrompts[0], categoria: 'Requisitos y apertura', intencion: 'Transaccional' }])[0];
  assert.ok(conCat.categorias.includes('Requisitos y apertura'), 'las categorías de la hoja aparecen en la lista');
  assert.equal(conCat.prompts[0].intencion, 'Transaccional');
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
  const editar = guardar({ id: 'p001', prompt: 'nuevo', categoria: 'Requisitos y apertura', intencion: 'Transaccional' });
  assert.deepEqual([editar.categoria, editar.intencion, editar.fecha_creacion], ['Requisitos y apertura', 'Transaccional', undefined]);
  assert.equal(guardar({ id: 'p001', categoria: '  ' }).categoria, 'Otra');
  assert.deepEqual(guardar({ id: 'p001', accion: 'eliminar' }), { _borrar: 'p001' }, 'eliminar borra la fila');
  // Fila a borrar: busca el row_number que devuelve Google Sheets.
  const fila = (id, hoja) => correr(api, 'Fila a borrar', hoja, { 'Validar prompt': [{ _borrar: id }] })[0];
  const hoja = hojaPrompts.map((p, i) => ({ ...p, row_number: i + 2 }));
  assert.deepEqual(fila('p002', hoja), { id: 'p002', row_number: 3 });
  assert.match(fila('nada', hoja)._error, /No existe/);
  const ruta = api.connections['¿Qué hacer?'].main.map(o => o.map(l => l.node));
  assert.deepEqual(ruta, [['Guardar prompt'], ['Leer prompts (borrar)'], ['Responder error']]);
  const borrar = api.nodes.find(n => n.name === 'Borrar fila').parameters;
  assert.deepEqual([borrar.operation, borrar.toDelete, borrar.startIndex, borrar.numberToDelete], ['delete', 'rows', '={{ $json.row_number }}', 1]);
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

// ─── /geo-monitor-data (lo que lee el front) ───────────────────────────────
const monitor = (resultados, hojaP = hojaPrompts) => correr(api, 'Datos del monitor', resultados,
  { 'Leer resultados (monitor)': resultados, 'Leer prompts (monitor)': hojaP })[0];

prueba('/geo-monitor-data: observaciones con la forma de DATA.monitor del front', () => {
  const r = juntar();
  const filas = armar(r, r.map((_, i) => ({ ...analisisDia[i % 5], n_menciones_bcp: 2, n_menciones_bancos: 5 })))
    .map(f => aHoja({ ...f, timestamp: '2026-10-20T12:00:00Z' }, '2026-10-20'));
  const d = monitor(filas);
  const o = d.monitor.observations;
  assert.equal(o.length, 10, '2 prompts × 5 motores');
  const campos = ['id', 'projectId', 'modelId', 'promptId', 'date', 'status', 'som', 'position', 'linkPosition', 'mentions',
    'citations', 'sentiment', 'sentimentLabel', 'blockAppeared', 'brandMentioned', 'brandCited', 'sources', 'ranking', 'isExample', 'source'];
  for (const k of campos) assert.ok(k in o[0], 'falta ' + k);
  assert.deepEqual([...new Set(o.map(x => x.modelId))].sort(), ['chatgpt', 'claude', 'gemini', 'overview', 'perplexity']);
  const gpt = o.find(x => x.modelId === 'chatgpt' && x.promptId === 'p001');
  assert.equal(gpt.id, 'tarjetas:chatgpt:p001:2026-10-20');
  // Sin detalle por banco, el SoV se aproxima con el orden de marcas: BCP 1.º de 3,
  // 2 de 5 menciones, positivo → (1 + 2/4)/2 = 0,75 frente a 0,28 y 0,19 = 61,6 %.
  assert.deepEqual([gpt.status, gpt.position, gpt.mentions, gpt.linkPosition, gpt.citations], ['ok', 1, 2, 1, 1]);
  assert.equal(gpt.som, gpt.sov, 'el KPI principal del front lleva el Share of Voice');
  assert.ok(gpt.sov > 50 && gpt.sov < 70, 'sov ' + gpt.sov);
  assert.ok(gpt.sovByBrand.Interbank > 0 && gpt.sovByBrand.BBVA > 0);
  assert.equal(gpt.mentionShare, 40, 'la proporción de menciones anterior sigue disponible');
  assert.equal(gpt.category, 'Producto');
  assert.deepEqual([gpt.sentiment, gpt.sentimentLabel, gpt.brandCited, gpt.isExample], [0.6, 'positivo', true, false]);
  assert.deepEqual(gpt.sources[0], { domain: 'viabcp.com', url: 'https://viabcp.com/' });
  assert.deepEqual(gpt.ranking, ['BCP', 'Interbank', 'BBVA']);
  assert.ok(gpt.response.includes('El BCP destaca'), 'la respuesta va en la observación');
  const claude = o.find(x => x.modelId === 'claude' && x.promptId === 'p001');
  assert.deepEqual([claude.status, claude.som, claude.sov, claude.position, claude.sentiment, claude.mentions], ['not_mentioned', 0, 0, null, null, 0]);
  const aio = o.find(x => x.modelId === 'overview' && x.promptId === 'p001');
  assert.equal(aio.blockAppeared, true);
  assert.equal(o.find(x => x.modelId === 'gemini').blockAppeared, null);
  assert.deepEqual(d.monitor.dates, ['2026-10-20']);
  assert.match(d.monitor.referenceDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(d.monitor.domains.some(([dom]) => dom === 'viabcp.com'));
});

prueba('/geo-monitor-data: proyectos y prompts desde la hoja, errores y corridas repetidas', () => {
  const r = juntar({ claude: { error: { message: 'saldo' } }, google: { organic_results: [] }, pagina: { account_id: 'x' } });
  const base = armar(r, r.map((_, i) => analisisDia[i % 5]));
  const temprano = base.map(f => aHoja({ ...f, timestamp: '2026-10-20T08:00:00Z' }, '2026-10-20'));
  const tarde = base.map(f => aHoja({ ...f, timestamp: '2026-10-20T15:00:00Z', posicion_bcp: f.posicion_bcp === '' ? '' : 3 }, '2026-10-20'));
  const d = monitor([...temprano, ...tarde, {}]);
  const o = d.monitor.observations;
  assert.equal(o.length, 10, 'la corrida repetida del mismo día no duplica');
  assert.equal(o.find(x => x.modelId === 'chatgpt' && x.promptId === 'p001').position, 3, 'gana la última corrida del día');
  const c = o.find(x => x.modelId === 'claude');
  assert.deepEqual([c.status, c.som, c.brandMentioned], ['error', null, false]);
  const aio = o.find(x => x.modelId === 'overview');
  assert.deepEqual([aio.status, aio.blockAppeared], ['not_mentioned', false], 'sin AI Overview no es error');
  // Un solo banco nombrado: todo el SoV es suyo.
  assert.equal(o.find(x => x.modelId === 'perplexity').som, 100);
  assert.deepEqual(d.monitor.projects.map(p => [p.id, p.name, p.promptIds]), [['tarjetas', 'Tarjetas', ['p001']], ['reputacion', 'Reputación', ['p003']]],
    'el prompt inactivo sin datos no entra');
  assert.deepEqual(d.prompts.map(p => [p.id, p.text.slice(0, 10), p.project]).slice(0, 1), [['p001', '¿Cuál es l', 'tarjetas']]);
  // Un prompt que ya no está en la hoja, o que cambió de proyecto, sigue apareciendo.
  const huerfano = monitor(temprano, hojaPrompts.filter(p => p.id !== 'p003').map(p => (p.id === 'p001' ? { ...p, proyecto: 'Nuevo' } : p)));
  const ids = huerfano.monitor.projects.map(p => p.id);
  for (const o of huerfano.monitor.observations) assert.ok(ids.includes(o.projectId), 'falta el proyecto ' + o.projectId);
  assert.ok(huerfano.prompts.some(p => p.id === 'p003' && p.text.startsWith('¿Qué banco')), 'el prompt borrado se rescata de resultados');
  // Solo los últimos ~6 meses, y la respuesta recortada.
  const viejo = monitor([{ ...temprano[0], fecha: '2025-01-01' }, { ...temprano[1], respuesta: 'x'.repeat(9000) }]);
  assert.equal(viejo.monitor.observations.length, 1, 'lo de hace más de 6 meses no se manda');
  assert.ok(viejo.monitor.observations[0].response.length <= 4001);
  const vacio = monitor([{}]);
  assert.deepEqual([vacio.monitor.observations.length, vacio.monitor.dates.length], [0, 0]);
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
  assert.deepEqual(rutas(api).sort(), ['geo-dashboard', 'geo-monitor-data', 'geo-prompts', 'geo-prompts-save']);
});

console.log(`\n${ok} pruebas pasan`);
