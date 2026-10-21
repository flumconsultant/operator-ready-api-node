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
const her = cargar('geo-herramientas.n8n.json');
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

// ─── El Sheet, como lo devuelve la API de Google Sheets ───────────────────
// Pestañas por proyecto (encabezados del Excel de BCP) y por día de resultados.
const COLS_PROMPTS = ['id', 'Categoría', 'Intención de Búsqueda', 'Prompt', 'Activo', 'Fecha de creación', 'Tags', 'Etapa', 'Volumen', 'País'];
const CAMPOS_PROMPTS = ['id', 'categoria', 'intencion', 'prompt', 'activo', 'fecha_creacion', 'tags', 'etapa', 'volumen', 'pais'];
const COLS_RESULTADOS = ['run_id', 'fecha', 'timestamp', 'prompt_id', 'proyecto', 'categoria', 'prompt', 'motor', 'estado',
  'menciona_bcp', 'posicion_bcp', 'sentimiento', 'marcas_mencionadas', 'fuentes', 'citado_bcp', 'error', 'respuesta',
  'n_menciones_bcp', 'n_menciones_bancos', 'detalle_marcas', 'sov_bcp', 'fuentes_detalle', 'consultas_busqueda'];
const agrupar = (filas, clave) => filas.reduce((m, f) => m.set(f[clave], (m.get(f[clave]) || []).concat([f])), new Map());
function comoSheets({ prompts = [], resultados = [] } = {}) {
  const valueRanges = [];
  for (const [tab, fs] of agrupar(prompts, 'proyecto')) {
    valueRanges.push({ valueRange: { range: `'${tab}'!A1:F${fs.length + 1}`, values: [COLS_PROMPTS].concat(fs.map(f => CAMPOS_PROMPTS.map(c => f[c] ?? ''))) } });
  }
  for (const [tab, fs] of agrupar(resultados.filter(f => f.fecha), 'fecha')) {
    valueRanges.push({ valueRange: { range: `'${tab}'!A1:U${fs.length + 1}`, values: [COLS_RESULTADOS].concat(fs.map(f => COLS_RESULTADOS.map(c => f[c] ?? ''))) } });
  }
  return { valueRanges };
}
function metaSheets(titulos) {
  return { sheets: titulos.map((title, i) => ({ properties: { sheetId: 1000 + i, title, index: i } })) };
}

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
const elegir = webhookBody => correr(corrida, 'Elegir prompts', [comoSheets({ prompts: hojaPrompts })],
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
  'n_menciones_bcp', 'n_menciones_bancos', 'detalle_marcas', 'sov_bcp', 'fuentes_detalle', 'consultas_busqueda'];

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
  assert.equal(filas[3].marcas_mencionadas, 'BCP, Pichincha, Falabella', 'nombres canónicos (Falabella es competidor) y sin repetir');
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
  const [sin] = armar([{ ...r[0], texto: 'Interbank es una opción.' }], [{ menciona_bcp: false, detalle_marcas: '[{"marca":"Interbank","posicion":1,"menciones":1,"sentimiento":0}]' }]);
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

prueba('Citas con URL y título, y consultas de búsqueda (fan-out) por motor', () => {
  const claudeWeb = { content: [
    { type: 'server_tool_use', name: 'web_search', input: { query: 'mejor banco Perú 2026' } },
    { type: 'server_tool_use', name: 'web_search', input: { query: 'ranking bancos SBS' } },
    { type: 'text', text: 'BCP', citations: [{ url: 'https://www.viabcp.com/a', title: 'BCP oficial' }, { url: 'https://www.viabcp.com/a', title: 'BCP oficial' }] }
  ] };
  const gem = { candidates: [{ content: { parts: [{ text: 'x' }] }, groundingMetadata: {
    webSearchQueries: ['bancos peru'], groundingChunks: [{ web: { uri: 'https://vertexaisearch.cloud.google.com/r/1', title: 'sbs.gob.pe' } }] } }] };
  const r = juntar({ claude: claudeWeb, chatgpt: { choices: [{ message: { content: 'x', annotations: [{ type: 'url_citation', url_citation: { url: 'https://comparabien.com.pe/x', title: 'Comparabien' } }] } }] } });
  const cl = r.find(x => x.motor === 'claude' && x.prompt_id === 'p001');
  assert.deepEqual(cl.consultas, ['mejor banco Perú 2026', 'ranking bancos SBS']);
  assert.deepEqual(cl.citas, [{ url: 'https://www.viabcp.com/a', title: 'BCP oficial', domain: 'viabcp.com', position: 1 }], 'una vez cada URL');
  assert.equal(r.find(x => x.motor === 'chatgpt').citas[0].title, 'Comparabien');
  const g = correr(publicado, 'Juntar respuestas', prompts.map(() => ({})), {
    'Elegir prompts': prompts, ChatGPT: repetir(apis.chatgpt), Claude: repetir(apis.claude), Gemini: repetir(gem), Perplexity: repetir(apis.perplexity)
  }).find(x => x.motor === 'gemini');
  assert.deepEqual([g.consultas, g.citas[0].url], [['bancos peru'], 'https://sbs.gob.pe/'], 'Gemini: el dominio real, no el redirect');
  const [fila] = armar([cl], [{ menciona_bcp: true, posicion_bcp: 1, detalle_marcas: '[{"marca":"BCP","posicion":1,"menciones":1,"sentimiento":0.5,"recomendada":true,"atributos":["seguridad","inventado","Tasas"]}]' }]);
  assert.deepEqual(JSON.parse(fila.consultas_busqueda), ['mejor banco Perú 2026', 'ranking bancos SBS']);
  assert.equal(JSON.parse(fila.fuentes_detalle)[0].title, 'BCP oficial');
  const d = JSON.parse(fila.detalle_marcas)[0];
  assert.deepEqual([d.recomendada, d.atributos], [true, ['seguridad', 'tasas']], 'atributos solo del vocabulario');
});

prueba('Armar fila: si el texto nombra a BCP y el Analista dijo que no, cuenta en su lugar del texto', () => {
  const [r] = juntar().slice(1, 2);
  const texto = 'Te recomiendo Interbank o BBVA. Si me dices con qué banco (BCP, Scotiabank) quieres, te ayudo. Banco de Crédito del Perú también.';
  const [f] = armar([{ ...r, texto }], [{ menciona_bcp: false, posicion_bcp: 0, sentimiento: 0, marcas_mencionadas: 'Interbank, BBVA, Scotiabank',
    detalle_marcas: '[{"marca":"Interbank","posicion":1,"menciones":1,"sentimiento":0.4},{"marca":"BBVA","posicion":2,"menciones":1,"sentimiento":0.3},{"marca":"Scotiabank","posicion":3,"menciones":1,"sentimiento":0}]' }]);
  assert.equal(f.menciona_bcp, true);
  assert.equal(f.posicion_bcp, 3, 'después de Interbank y BBVA, antes de Scotiabank');
  assert.equal(f.n_menciones_bcp, 2, '«BCP» y «Banco de Crédito del Perú»; «Banco de Crédito» no se cuenta dos veces');
  assert.deepEqual(JSON.parse(f.detalle_marcas).map(d => [d.marca, d.posicion]), [['Interbank', 1], ['BBVA', 2], ['BCP', 3], ['Scotiabank', 4]]);
  assert.equal(f.marcas_mencionadas, 'Interbank, BBVA, BCP, Scotiabank');
  const [g] = armar([{ ...r, texto: 'Interbank es buena. El BCPX no existe.' }], [{ menciona_bcp: false, marcas_mencionadas: 'Interbank' }]);
  assert.equal(g.menciona_bcp, false, 'BCPX no es BCP');
});

prueba('Armar fila: si el motor no respondió, no cuenta lo que diga la IA', () => {
  const r = juntar({ claude: { error: { message: 'x' } } }).slice(0, 5);
  const fila = armar([r[1]], [{ menciona_bcp: true, posicion_bcp: 1, sentimiento: 1, marcas_mencionadas: 'BCP' }])[0];
  assert.deepEqual([fila.estado, fila.menciona_bcp, fila.marcas_mencionadas], ['error', false, '']);
});

prueba('Corrida con SerpAPI: los 5 motores en paralelo, un Merge y luego en línea hasta el Sheet', () => {
  const sale = n => corrida.connections[n].main[0].map(l => l.node);
  assert.deepEqual(sale('Pestañas del Sheet'), ['Qué leer']);
  assert.deepEqual(sale('Leer el Sheet'), ['Elegir prompts']);
  assert.deepEqual(sale('Elegir prompts').sort(), ['ChatGPT', 'Claude', 'Gemini', 'Google (SerpAPI)', 'Perplexity']);
  assert.deepEqual(sale('Google (SerpAPI)'), ['AI Overview (página)']);
  const merge = 'Esperar a los motores';
  const entradas = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'AI Overview (página)']
    .map(m => corrida.connections[m].main[0].find(l => l.node === merge).index);
  assert.deepEqual(entradas, [0, 1, 2, 3, 4], 'cada motor entra por su propia entrada del Merge');
  assert.equal(corrida.nodes.find(n => n.name === merge).parameters.numberInputs, 5);
  const resto = [merge, 'Juntar respuestas', 'Analista IA', 'Armar fila', 'Plan de guardado', 'Guardar en la pestaña del día'];
  for (let i = 0; i < resto.length - 1; i++) assert.deepEqual(sale(resto[i]), [resto[i + 1]], resto[i]);
  assert.equal(corrida.connections['Claude · analista'].ai_languageModel[0][0].node, 'Analista IA');
  assert.equal(corrida.nodes.find(n => n.name === 'Webhook geo-run').parameters.responseMode, 'onReceived');
  // Cada modelo recibe solo el prompt y, como línea de sistema, el país del
  // usuario: ni la respuesta de otro motor ni nada más.
  const motores = corrida.nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest' && n.parameters.nodeCredentialType !== 'googleSheetsOAuth2Api');
  assert.equal(motores.length, 6);
  for (const n of motores) {
    assert.equal(n.onError, 'continueRegularOutput', n.name);
    if (n.parameters.method === 'POST') {
      const usa = n.parameters.jsonBody.match(/\$json\.\w+|\$\('[^']+'\)/g);
      const permitidos = ['$json.buscar_siempre', '$json.contexto', '$json.prompt'];
      assert.ok([...new Set(usa)].every(x => permitidos.includes(x)) && usa.includes('$json.prompt'), n.name + ': ' + usa);
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
prueba('/geo-prompts lee todas las pestañas de proyecto: cada pestaña es un proyecto', () => {
  const listar = prompts => correr(api, 'Listar prompts', [comoSheets({ prompts })])[0];
  const r = listar(hojaPrompts);
  assert.deepEqual([r.total, r.activos], [3, 2]);
  assert.deepEqual(r.proyectos, ['Reputación', 'Tarjetas']);
  assert.ok(r.intenciones.includes('Comparativa'));
  const conCat = listar([{ ...hojaPrompts[0], categoria: 'Requisitos y apertura', intencion: 'Transaccional' }]);
  assert.ok(conCat.categorias.includes('Requisitos y apertura'), 'las categorías de la hoja aparecen en la lista');
  assert.equal(conCat.prompts[0].intencion, 'Transaccional');
  assert.equal(r.prompts[0].id, 'p003');
  assert.ok(!('_fila' in r.prompts[0]), 'el número de fila no sale al front');
  // Pestañas de sistema (_respaldo) y de días no son proyectos; las vacías no rompen nada.
  const conOtras = correr(api, 'Listar prompts', [{ valueRanges: comoSheets({ prompts: hojaPrompts }).valueRanges.concat([
    { valueRange: { range: "'_respaldo prompts'!A1:F2", values: [COLS_PROMPTS, ['x1', 'a', 'b', 'no cuenta', 'TRUE', '']] } },
    { valueRange: { range: "'Vacía'!A1:F1", values: [COLS_PROMPTS] } }
  ]) }])[0];
  assert.equal(conOtras.total, 3);
  assert.equal(correr(api, 'Listar prompts', [{ valueRanges: [] }])[0].total, 0, 'Sheet sin prompts');
});

prueba('Qué leer: pestañas de proyecto, de días (desde una fecha) y nunca las de sistema', () => {
  const meta = metaSheets(['Marca', 'Ahorros', '2026-10-21', '2026-10-20', '2025-01-01', '_respaldo resultados']);
  const rangos = (nodo, sufijo) => correr(api, nodo, [meta])[0].cuerpo.dataFilters.map(f => f.a1Range);
  assert.deepEqual(rangos('Qué leer (prompts)'), ["'Marca'!A:J", "'Ahorros'!A:J"]);
  const mon = rangos('Qué leer (monitor)');
  assert.ok(mon.includes("'2026-10-21'!A:W") && mon.includes("'Marca'!A:J"));
  assert.ok(!mon.includes("'2025-01-01'!A:W"), 'más de 6 meses atrás no se lee');
  assert.ok(!mon.some(r => r.includes('_respaldo')));
  const vacio = correr(api, 'Qué leer (prompts)', [metaSheets(['2026-10-21'])])[0].cuerpo.dataFilters;
  assert.equal(vacio.length, 1, 'la API no acepta una lista vacía');
});

const META = metaSheets(['Tarjetas', 'Reputación', '2026-10-20', '_respaldo prompts']);
// Fila de cada prompt en su pestaña: p001 → Tarjetas!2, p002 → Tarjetas!3, p003 → Reputación!2.
const planear = body => correr(api, 'Planear cambio', [comoSheets({ prompts: hojaPrompts })],
  { 'Webhook geo-prompts-save': [{ body }], 'Pestañas del Sheet (guardar)': [META] });
const ruta = u => decodeURIComponent(u.replace(/^https:\/\/sheets\.googleapis\.com\/v4\/spreadsheets\/[^/:]+/, ''));

prueba('/geo-prompts-save: crear en su pestaña; un proyecto nuevo crea la pestaña', () => {
  const [p] = planear({ proyecto: 'Tarjetas', prompt: '  ¿Mejor tarjeta sin membresía?  ', categoria: 'Comparación de opciones', intencion: 'Comparativa' });
  assert.equal(p.method, 'POST');
  assert.equal(ruta(p.url), "/values/'Tarjetas'!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS");
  const [fila] = p.body.values;
  assert.match(fila[0], /^p_/);
  assert.deepEqual(fila.slice(1, 5), ['Comparación de opciones', 'Comparativa', '¿Mejor tarjeta sin membresía?', 'TRUE']);
  assert.match(fila[5], /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(p._respuesta.accion, 'crear');
  assert.equal(p._respuesta.prompt.proyecto, 'Tarjetas');

  const nuevo = planear({ proyecto: 'Hipotecario', prompt: '¿Qué banco da el mejor crédito hipotecario?' });
  // Una sola petición: crear la pestaña y escribir encabezados + fila (sin carrera entre las dos).
  assert.deepEqual(nuevo.map(x => x.method), ['POST']);
  const [crear, celdas] = nuevo[0].body.requests;
  assert.equal(crear.addSheet.properties.title, 'Hipotecario');
  assert.equal(crear.addSheet.properties.index, 2, 'va después de las pestañas de proyecto');
  assert.equal(celdas.appendCells.sheetId, crear.addSheet.properties.sheetId, 'escribe en la pestaña que crea');
  assert.deepEqual(celdas.appendCells.rows[0].values.map(c => c.userEnteredValue.stringValue), COLS_PROMPTS, 'con los encabezados del Excel');
  assert.equal(celdas.appendCells.rows[1].values[3].userEnteredValue.stringValue, '¿Qué banco da el mejor crédito hipotecario?');
});

prueba('/geo-prompts-save: editar, activar/desactivar, mover de proyecto y eliminar', () => {
  const [editar] = planear({ id: 'p002', prompt: 'texto nuevo', intencion: 'Transaccional' });
  assert.equal(editar.method, 'PUT');
  assert.equal(ruta(editar.url), "/values/'Tarjetas'!A3:J3?valueInputOption=RAW");
  assert.deepEqual(editar.body.values[0], ['p002', 'Producto', 'Transaccional', 'texto nuevo', 'FALSE', '2026-10-02', 'Tarjetas', 'bofu', '', 'PE'],
    'conserva lo que no cambia; sin tags, el proyecto; etapa según la intención');
  const [tags] = planear({ id: 'p001', tags: 'Productos-Tarjetas, Comparativos', etapa: 'mofu', volumen: 4 });
  assert.deepEqual(tags.body.values[0].slice(6), ['Productos-Tarjetas, Comparativos', 'mofu', 4, 'PE']);
  assert.match(planear({ id: 'p001', etapa: 'medio' })[0]._respuesta.error, /tofu, mofu o bofu/);

  const [apagar] = planear({ id: 'p001', activo: false });
  assert.deepEqual(apagar.body.values[0].slice(3, 6), ['¿Cuál es la mejor tarjeta de crédito en Perú?', 'FALSE', '2026-10-01']);

  const mover = planear({ id: 'p003', proyecto: 'Tarjetas' });
  assert.deepEqual(mover.map(x => x.method), ['POST', 'POST']);
  assert.match(ruta(mover[0].url), /'Tarjetas'!A1:append/);
  assert.deepEqual(mover[1].body.requests[0].deleteDimension.range, { sheetId: 1001, dimension: 'ROWS', startIndex: 1, endIndex: 2 }, 'sale de Reputación, fila 2');

  const [borrar] = planear({ id: 'p002', accion: 'eliminar' });
  assert.deepEqual(borrar.body.requests[0].deleteDimension.range, { sheetId: 1000, dimension: 'ROWS', startIndex: 2, endIndex: 3 });
  assert.deepEqual(borrar._respuesta, { ok: true, accion: 'eliminar', id: 'p002' });
});

prueba('/geo-prompts-save: errores con su código', () => {
  const [vacio] = planear({ prompt: '   ' });
  assert.deepEqual([vacio._status, vacio._respuesta.ok, !!vacio.method], [400, false, false]);
  assert.match(vacio._respuesta.error, /vacío/);
  const [noExiste] = planear({ id: 'nada', accion: 'eliminar' });
  assert.equal(noExiste._status, 404);
  assert.equal(planear({ id: 'nada', prompt: 'x' })[0]._status, 404);
  const sale = n => api.connections[n].main.map(o => o.map(l => l.node));
  assert.deepEqual(sale('¿Hay cambios?'), [['Escribir en el Sheet'], ['Responder error']]);
  const esc = api.nodes.find(n => n.name === 'Escribir en el Sheet').parameters;
  assert.deepEqual([esc.method, esc.url, esc.options.batching.batch.batchSize], ['={{ $json.method }}', '={{ $json.url }}', 1], 'una petición tras otra, en orden');
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
  correr(api, 'Dashboard', [comoSheets({ resultados: filas })], { 'Webhook geo-dashboard': [{ query }] })[0];

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
const monitor = (resultados, hojaP = hojaPrompts) =>
  correr(api, 'Datos del monitor', [comoSheets({ prompts: hojaP, resultados })],
    { 'Pestañas del Sheet (monitor)': [metaSheets(['Tarjetas', 'Reputación', 'Nuevo'])] })[0];

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
  assert.deepEqual(gpt.sources[0], { domain: 'viabcp.com', url: 'https://www.viabcp.com/tarjetas?utm_source=openai', title: '', position: 1 }, 'la URL real citada');
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

prueba('/geo-monitor-data: marcas, categorías de dominio, metadatos de prompts y pestañas de sistema', () => {
  const r = juntar();
  const filas = armar(r, r.map((_, i) => analisisDia[i % 5])).map(f => aHoja({ ...f, timestamp: '2026-10-20T12:00:00Z' }, '2026-10-20'));
  const hojaP = hojaPrompts.map(p => (p.id === 'p001' ? { ...p, tags: 'Productos-Tarjetas, Comparativos', etapa: 'bofu', volumen: 4, prompt: '¿Es mejor el BCP o Interbank?' } : p));
  const sistema = { valueRanges: [
    { valueRange: { range: "'_dominios'!A1:B2", values: [['dominio', 'categoria'], ['comparabien.com.pe', 'news_media']] } },
    { valueRange: { range: "'_recomendaciones'!A1:F2", values: [['id', 'estado', 'responsable', 'fecha_objetivo', 'fecha_hecha', 'actualizado'], ['new_page:p003', 'todo', 'Ana', '2026-11-01', '', '2026-10-21T10:00:00Z']] } },
    { valueRange: { range: "'_auditorias'!A1:E2", values: [['id', 'tipo', 'url', 'fecha', 'resultado'], ['a1', 'crawl', 'https://www.viabcp.com', '2026-10-16T10:00:00Z', '{"bots":[]}']] } }
  ] };
  const base = comoSheets({ prompts: hojaP, resultados: filas });
  const d = correr(api, 'Datos del monitor', [{ valueRanges: base.valueRanges.concat(sistema.valueRanges) }],
    { 'Pestañas del Sheet (monitor)': [metaSheets(['Tarjetas', 'Reputación'])] })[0];
  const M = d.monitor;
  assert.deepEqual(M.brands.slice(0, 2).map(b => [b.id, b.isOwn, b.color]), [['bcp', true, '#1a1a4e'], ['interbank', false, '#8b5cf6']]);
  assert.equal(M.domainCategories['viabcp.com'], 'brand');
  assert.equal(M.domainCategories['comparabien.com.pe'], 'news_media', 'la corrección de _dominios gana');
  assert.equal(M.domainCategories['sbs.gob.pe'], 'government_ngo');
  assert.equal(M.domainCategories['bbva.pe'], 'competitor');
  assert.deepEqual(M.recStates['new_page:p003'], { status: 'todo', owner: 'Ana', dueDate: '2026-11-01', doneAt: '', updatedAt: '2026-10-21T10:00:00Z' });
  assert.equal(M.audits[0].type, 'crawl');
  assert.ok(M.attributes.includes('seguridad'));
  const p1 = d.prompts.find(p => p.id === 'p001');
  assert.deepEqual([p1.tags, p1.funnelStage, p1.intentVolume, p1.country, p1.isBranded], [['Productos-Tarjetas', 'Comparativos'], 'bofu', 4, 'PE', true]);
  const p3 = d.prompts.find(p => p.id === 'p003');
  assert.deepEqual([p3.tags, p3.funnelStage, p3.isBranded], [['Reputación'], 'tofu', false], 'sin tags: el proyecto; sin etapa: por intención');
  const o = M.observations.find(x => x.promptId === 'p001' && x.modelId === 'chatgpt');
  assert.deepEqual([o.country, o.tags], ['PE', ['Productos-Tarjetas', 'Comparativos']]);
});

prueba('Plan de guardado: los resultados van a la pestaña del día', () => {
  const r = juntar().slice(0, 2);
  const filas = armar(r, [analisisDia[0], analisisDia[1]]);
  const plan = meta => correr(corrida, 'Plan de guardado', filas, { 'Pestañas del Sheet': [meta] });
  const fecha = filas[0].fecha;
  const nueva = plan(metaSheets(['Marca', 'Ahorros', '2026-10-01']));
  assert.deepEqual(nueva.map(p => p.method), ['POST'], 'pestaña y filas en una sola petición');
  const [crear, celdas] = nueva[0].body.requests;
  assert.equal(crear.addSheet.properties.title, fecha);
  assert.equal(crear.addSheet.properties.index, 2, 'la más reciente, primera después de los proyectos');
  assert.ok(![1000, 1001, 1002].includes(crear.addSheet.properties.sheetId), 'un sheetId que no está en uso');
  assert.equal(celdas.appendCells.sheetId, crear.addSheet.properties.sheetId);
  const valores = celdas.appendCells.rows.map(r => r.values.map(c => Object.values(c.userEnteredValue)[0]));
  assert.deepEqual(valores[0], COLS_RESULTADOS);
  assert.equal(valores.length, 3);
  const fila = Object.fromEntries(COLS_RESULTADOS.map((c, i) => [c, valores[1][i]]));
  assert.deepEqual([fila.motor, fila.menciona_bcp, fila.prompt_id], [filas[0].motor, filas[0].menciona_bcp ? 'TRUE' : 'FALSE', filas[0].prompt_id]);
  const existe = plan(metaSheets(['Marca', fecha]));
  assert.deepEqual(existe.map(p => p.method), ['POST']);
  assert.match(ruta(existe[0].url), new RegExp("'" + fecha + "'!A1:append"));
});

prueba('Los tres workflows: conexiones válidas, ids únicos, pestañas de la plantilla', () => {
  for (const wf of [corrida, api, her]) {
    const nombres = new Set(wf.nodes.map(n => n.name));
    for (const [de, c] of Object.entries(wf.connections)) {
      assert.ok(nombres.has(de), de);
      for (const salidas of Object.values(c)) for (const s of salidas) for (const l of s) assert.ok(nombres.has(l.node), l.node);
    }
    assert.equal(new Set(wf.nodes.map(n => n.id)).size, wf.nodes.length);
    assert.equal(wf.nodes.filter(n => n.type === 'n8n-nodes-base.googleSheets').length, 0, 'todo va por la API de Sheets');
    for (const h of wf.nodes.filter(n => n.parameters.nodeCredentialType === 'googleSheetsOAuth2Api')) {
      assert.match(h.parameters.url, /PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET|\$json\.url/, h.name);
    }
  }
  const rutas = wf => wf.nodes.filter(n => n.type === 'n8n-nodes-base.webhook').map(n => n.parameters.path);
  assert.deepEqual(rutas(corrida), ['geo-run']);
  assert.deepEqual(rutas(api).sort(), ['geo-config-save', 'geo-dashboard', 'geo-domain-save', 'geo-monitor-data', 'geo-prompts', 'geo-prompts-save', 'geo-recs-save']);
  assert.deepEqual(rutas(her).sort(), ['geo-audit', 'geo-fanout', 'geo-prompt-research']);
});

// ─── Pestañas de sistema: recomendaciones y dominios ──────────────────────
const sistemaSheets = tabs => ({ valueRanges: Object.entries(tabs).map(([t, filas]) => ({ valueRange: { range: `'${t}'!A1:F9`, values: filas } })) });
// Filas que escribe un addSheet + appendCells.
const celdasDe = pet => pet.body.requests[1].appendCells.rows.map(r => r.values.map(c => Object.values(c.userEnteredValue)[0]));
const CAB_RECS = ['id', 'estado', 'responsable', 'fecha_objetivo', 'fecha_hecha', 'actualizado'];
const guardarSistema = (nodo, hook, lect, body, hoja, titulos) =>
  correr(api, nodo, [sistemaSheets(hoja)], { [hook]: [{ body }], [lect]: [metaSheets(titulos)] });
const guardarRec = (body, hoja = {}, titulos = ['Marca']) =>
  guardarSistema('Planear (recomendación)', 'Webhook geo-recs-save', 'Pestañas del Sheet (recomendación)', body, hoja, titulos);

prueba('/geo-recs-save: crea la pestaña, agrega, actualiza y marca la fecha de hecha', () => {
  const nueva = guardarRec({ id: 'r1', estado: 'todo', responsable: 'Ana' });
  assert.deepEqual(nueva.map(p => p.method), ['POST']);
  assert.equal(nueva[0].body.requests[0].addSheet.properties.title, '_recomendaciones');
  assert.deepEqual(celdasDe(nueva[0])[0], CAB_RECS);
  assert.deepEqual(celdasDe(nueva[0])[1].slice(0, 3), ['r1', 'todo', 'Ana']);
  const hoja = { _recomendaciones: [CAB_RECS, ['r0', 'todo', '', '', '', ''], [], ['r1', 'in_progress', 'Ana', '2026-11-01', '', '']] };
  const otra = guardarRec({ id: 'r2', estado: 'todo' }, hoja, ['Marca', '_recomendaciones']);
  assert.deepEqual(otra.map(p => p.method), ['POST']);
  assert.match(ruta(otra[0].url), /'_recomendaciones'!A1:append/);
  const hecha = guardarRec({ id: 'r1', estado: 'done' }, hoja, ['Marca', '_recomendaciones']);
  assert.match(ruta(hecha[0].url), /'_recomendaciones'!A4:F4/, 'la fila real, aunque haya una vacía antes');
  const v = hecha[0].body.values[0];
  assert.deepEqual(v.slice(0, 4), ['r1', 'done', 'Ana', '2026-11-01'], 'conserva lo que no se cambia');
  assert.match(v[4], /^\d{4}-\d{2}-\d{2}$/);
  const mal = guardarRec({ id: 'r1', estado: 'quizás' });
  assert.deepEqual([mal[0]._status, mal[0]._respuesta.ok], [400, false]);
  assert.equal(guardarRec({ estado: 'todo' })[0]._status, 400);
});

prueba('/geo-domain-save: corrige la categoría de un dominio', () => {
  const g = (body, hoja = {}, titulos = ['Marca']) =>
    guardarSistema('Planear (dominio)', 'Webhook geo-domain-save', 'Pestañas del Sheet (dominio)', body, hoja, titulos);
  const nueva = g({ dominio: 'https://www.Rankia.pe/foros', categoria: 'community_forum' });
  assert.deepEqual(celdasDe(nueva[0]).slice(0, 2).map(f => f.slice(0, 2)), [['dominio', 'categoria'], ['rankia.pe', 'community_forum']]);
  const hoja = { _dominios: [['dominio', 'categoria', 'actualizado'], ['rankia.pe', 'news_media', '']] };
  const cambio = g({ dominio: 'rankia.pe', categoria: 'community_forum' }, hoja, ['_dominios']);
  assert.match(ruta(cambio[0].url), /'_dominios'!A2:C2/);
  assert.equal(g({ dominio: 'x.pe', categoria: 'inventada' })[0]._status, 400);
});

// ─── Herramientas: auditoría GEO, fan-out e investigación de prompts ──────
const armarAuditoria = body => correr(her, 'Armar auditoría', [{}], { 'Webhook geo-audit': [{ body }] });
const auditar = (body, respuestas) => {
  const pedidos = armarAuditoria(body);
  return correr(her, 'Resultado de la auditoría', respuestas(pedidos), { 'Armar auditoría': pedidos })[0];
};
const ROBOTS = 'User-agent: *\nDisallow: /privado/\n\nUser-agent: GPTBot\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\nAllow: /personas\n';

prueba('/geo-audit crawl: 21 bots + robots.txt, acceso del servidor y reglas por bot', () => {
  const pedidos = armarAuditoria({ url: 'www.viabcp.com/personas' });
  assert.equal(pedidos.length, 22);
  assert.equal(pedidos[21].url, 'https://www.viabcp.com/robots.txt');
  assert.match(pedidos.find(p => p.agente === 'GPTBot').headers['User-Agent'], /GPTBot/);
  const a = auditar({ url: 'www.viabcp.com/personas' }, ps => ps.map(p =>
    p.rol === 'robots' ? { statusCode: 200, body: ROBOTS }
    : p.agente === 'Bytespider' ? { statusCode: 403, body: 'Forbidden' }
    : p.agente === 'CCBot' ? { error: { code: 'ECONNRESET' } }
    : { statusCode: 200, body: '<html>ok</html>' }));
  assert.equal(a.ok, true);
  const r = a.auditoria.result;
  const bot = n => r.bots.find(b => b.agent === n);
  assert.deepEqual([bot('GPTBot').serverAccess, bot('GPTBot').robots], ['ok', 'disallowed']);
  assert.deepEqual([bot('ClaudeBot').robots, bot('OAI-SearchBot').robots], ['allowed', 'allowed'], 'Allow más largo gana; el resto cae en *');
  assert.deepEqual([bot('Bytespider').serverAccess, bot('Bytespider').httpStatus], ['blocked', 403]);
  assert.equal(bot('CCBot').serverAccess, 'unreachable');
  assert.deepEqual(r.resumen, { ok: 19, blocked: 1, unreachable: 1, robotsTxt: 'found' });
  assert.equal(r.critico, false);
  const privado = auditar({ url: 'https://viabcp.com/privado/x' }, ps => ps.map(p => (p.rol === 'robots' ? { statusCode: 200, body: ROBOTS } : { statusCode: 403 })));
  assert.equal(privado.auditoria.result.bots.find(b => b.agent === 'OAI-SearchBot').robots, 'disallowed');
  assert.equal(privado.auditoria.result.critico, true, 'ningún bot entra: crítico');
  assert.deepEqual(armarAuditoria({ url: 'no es una url' }), [{ error: 'URL no válida.' }]);
});

prueba('/geo-audit contenido: texto sin JavaScript, encabezados, FAQ y datos estructurados', () => {
  const pedidos = armarAuditoria({ tipo: 'contenido', url: 'https://www.viabcp.com/tarjetas', agente: 'GPTBot' });
  assert.deepEqual([pedidos.length, pedidos[0].agente], [1, 'GPTBot']);
  const texto = Array(320).fill('palabra').join(' ');
  const html = `<html><head><script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"FAQPage"},{"@type":"Organization"}]}</script><script>var x=1;</script></head>
    <body><h1>Tarjetas</h1><h2>Beneficios</h2><p>${texto}</p></body></html>`;
  const c = auditar({ tipo: 'contenido', url: 'https://www.viabcp.com/tarjetas', agente: 'GPTBot' }, () => [{ statusCode: 200, body: html }]).auditoria;
  assert.equal(c.type, 'content');
  assert.deepEqual(c.result.contentAnalysis.headings, { h1: 1, h2: 1, h3: 0 });
  assert.deepEqual(c.result.structuredData.types, ['FAQPage', 'Organization']);
  assert.equal(c.result.staticVsDynamic.verdict, 'ok');
  assert.deepEqual(c.result.contentAnalysis.issues, []);
  const spa = auditar({ tipo: 'contenido', url: 'https://app.example.com' }, () => [{ statusCode: 200, body: '<html><body><div id="root"></div><script>' + 'x'.repeat(5000) + '</script></body></html>' }]).auditoria.result;
  assert.equal(spa.staticVsDynamic.verdict, 'fail');
  assert.ok(spa.contentAnalysis.issues.includes('No tiene H1.'));
  assert.ok(spa.contentAnalysis.score < 50);
});

prueba('Auditoría guardada en _auditorias y fan-out con las búsquedas de Claude', () => {
  const a = { ok: true, auditoria: { id: 'a_1', type: 'crawl', url: 'https://x.pe/', executedAt: '2026-10-20 10:00', result: { resumen: {} } } };
  const pet = correr(her, 'Guardar auditoría', [metaSheets(['Marca'])], { 'Resultado de la auditoría': [a] });
  assert.deepEqual(pet.map(p => p.method), ['POST']);
  assert.deepEqual(celdasDe(pet[0])[1].slice(0, 3), ['a_1', 'crawl', 'https://x.pe/']);
  const armado = correr(her, 'Armar fan-out', [{}], { 'Webhook geo-fanout': [{ body: { query: '¿Mejor cuenta de ahorros?' } }] })[0];
  assert.equal(armado.cuerpo.tools[0].type, 'web_search_20260209');
  assert.deepEqual(correr(her, 'Armar fan-out', [{}], { 'Webhook geo-fanout': [{ body: {} }] })[0], { error: 'Escribe un prompt.' });
  const f = correr(her, 'Leer fan-out', [{ content: [
    { type: 'server_tool_use', name: 'web_search', input: { query: 'mejor cuenta de ahorros Perú 2026' } },
    { type: 'web_search_tool_result', content: [] },
    { type: 'server_tool_use', name: 'web_search', input: { query: 'tasas cuentas ahorro SBS' } },
    { type: 'text', text: '...' }
  ] }], { 'Armar fan-out': [armado] })[0];
  assert.deepEqual(f.consultas.map(c => c.subQuery), ['mejor cuenta de ahorros Perú 2026', 'tasas cuentas ahorro SBS']);
  assert.equal(f.query, '¿Mejor cuenta de ahorros?');
});

prueba('/geo-prompt-research: pedido por modo y candidatos normalizados', () => {
  const armar = body => correr(her, 'Armar investigación', [{}], { 'Webhook geo-prompt-research': [{ body }] })[0];
  const k = armar({ modo: 'keywords', keywords: 'tarjeta de crédito\ncuenta sueldo\n' });
  assert.equal(k.cuerpo.model, 'claude-haiku-5-5');
  assert.match(k.cuerpo.messages[0].content, /tarjeta de crédito\ncuenta sueldo$/);
  assert.match(k.cuerpo.system, /NO deben nombrar a BCP/);
  const u = armar({ modo: 'url', url: 'viabcp.com/tarjetas' });
  assert.equal(u.cuerpo.tools[0].name, 'web_fetch');
  assert.deepEqual(armar({ modo: 'keywords' }), { error: 'Escribe al menos una keyword.' });
  const texto = 'Aquí van:\n[{"prompt":"¿Qué tarjeta conviene para viajar?","etapa":"MOFU","tag":"Productos-Tarjetas","volumen":7,"razon":"comparativo"},{"etapa":"tofu"},{"prompt":"¿Cómo abrir una cuenta?","etapa":"x"}]';
  const r = correr(her, 'Leer candidatos', [{ content: [{ type: 'text', text: texto }] }], { 'Armar investigación': [k] })[0];
  assert.equal(r.ok, true);
  assert.deepEqual(r.candidatos.map(c => [c.etapa, c.volumen]), [['mofu', 5], ['tofu', 1]]);
  const e = correr(her, 'Leer candidatos', [{ error: { message: 'overloaded' } }], { 'Armar investigación': [k] })[0];
  assert.deepEqual([e.ok, e.error], [false, 'overloaded']);
});

// ─── Configuración editable (_config) y programación de la corrida ────────
const conConfig = (clave, valor) => ({ valueRanges: [{ valueRange: { range: "'_config'!A1:C9", values: [['clave', 'valor', 'actualizado']].concat(Object.entries(clave).map(([k, v]) => [k, JSON.stringify(v), ''])) } }] });

prueba('Corrida programada: solo corre a la hora y en los días de Configuración', () => {
  const hojas = (aj) => ({ valueRanges: comoSheets({ prompts: hojaPrompts }).valueRanges.concat(conConfig(aj).valueRanges) });
  const elegir = (aj, programada) => correr(publicado, 'Elegir prompts', [hojas(aj)], programada ? { 'Cada hora (revisa la programación)': [{}] } : {});
  const horaLima = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Lima', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));
  const todos = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
  assert.equal(elegir({ automatizacion: { activa: true, hora: horaLima, dias: todos } }, true).length, 2, 'es la hora: corre los activos');
  assert.equal(elegir({ automatizacion: { activa: true, hora: (horaLima + 1) % 24, dias: todos } }, true).length, 0, 'otra hora: no corre');
  assert.equal(elegir({ automatizacion: { activa: false, hora: horaLima, dias: todos } }, true).length, 0, 'apagada: no corre');
  assert.equal(elegir({ automatizacion: { activa: false, hora: horaLima, dias: todos } }, false).length, 2, '«Ejecutar ahora» corre aunque esté apagada');
  const [p] = elegir({ competidores: [{ nombre: 'Yape', alias: 'Yape, Yape BCP', dominios: 'yape.com.pe' }] }, false);
  assert.equal(p.contexto, 'El usuario está en Lima, Perú.');
  assert.match(p.marcas_lista, /^BCP \(.*\); Yape \(Yape BCP\)$/);
  assert.deepEqual(p._cfg.competidores.map(c => c.nombre), ['Yape']);
});

prueba('/geo-config-save: valida y guarda cada ajuste en _config', () => {
  const g = (body, hoja = {}, titulos = ['Marca']) =>
    guardarSistema('Planear (ajuste)', 'Webhook geo-config-save', 'Pestañas del Sheet (ajuste)', body, hoja, titulos);
  const nueva = g({ clave: 'automatizacion', valor: { activa: false, hora: 9, dias: ['lun', 'vie', 'xx'] } });
  assert.equal(nueva[0].body.requests[0].addSheet.properties.title, '_config');
  const fila = celdasDe(nueva[0])[1];
  assert.equal(fila[0], 'automatizacion');
  assert.deepEqual(JSON.parse(fila[1]), { activa: false, hora: 9, dias: ['lun', 'vie'] });
  assert.equal(g({ clave: 'automatizacion', valor: { hora: 25 } })[0]._status, 400);
  const marca = g({ clave: 'marca', valor: { alias: 'Banco de Crédito, ViaBCP', dominios: 'https://www.viabcp.com/, bcp.com.pe' } }, { _config: [['clave', 'valor', 'actualizado'], ['marca', '{}', '']] }, ['_config']);
  assert.match(ruta(marca[0].url), /'_config'!A2:C2/);
  assert.deepEqual(JSON.parse(marca[0].body.values[0][1]), { alias: ['BCP', 'Banco de Crédito', 'ViaBCP'], dominios: ['viabcp.com', 'bcp.com.pe'] });
  assert.equal(g({ clave: 'competidores', valor: [] })[0]._status, 400);
  assert.equal(g({ clave: 'otra', valor: 1 })[0]._status, 400);
});

prueba('/geo-monitor-data: marca y competidores editados y ajustes vigentes', () => {
  const base = comoSheets({ prompts: hojaPrompts, resultados: hojaResultados });
  const aj = conConfig({ competidores: [{ nombre: 'Interbank', alias: 'Interbank', dominios: 'interbank.pe' }, { nombre: 'Yape', dominios: 'yape.com.pe' }], automatizacion: { activa: false, hora: 8, dias: ['lun'] } });
  const d = correr(api, 'Datos del monitor', [{ valueRanges: base.valueRanges.concat(aj.valueRanges) }], { 'Pestañas del Sheet (monitor)': [metaSheets(['Tarjetas', 'Reputación', '_config'])] })[0];
  assert.deepEqual(d.monitor.brands.map(b => b.name), ['BCP', 'Interbank', 'Yape']);
  assert.deepEqual(d.ajustes.automatizacion, { activa: false, hora: 8, dias: ['lun'] });
  assert.equal(d.ajustes.monitor.nombre, 'BCP · Monitor de Visibilidad en IA', 'sin ajuste: el valor por defecto');
});

console.log(`\n${ok} pruebas pasan`);
