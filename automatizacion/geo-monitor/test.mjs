// Prueba el workflow sin n8n ni APIs: ejecuta el código real de cada nodo Code
// del JSON generado con un `$` simulado y respuestas de ejemplo de cada motor.
//   node automatizacion/geo-monitor/test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const wf = JSON.parse(readFileSync(new URL('geo-monitor.n8n.json', import.meta.url), 'utf8'));
const nodo = nombre => {
  const n = wf.nodes.find(x => x.name === nombre);
  assert.ok(n, 'no existe el nodo ' + nombre);
  return n;
};

// Ejecuta un nodo Code. `salidas` son los datos de nodos ya ejecutados
// ({nombre: [json, ...]}); `entrada` son los items que recibe el nodo.
function correr(nombre, entrada, salidas, ejecutados = Object.keys(salidas)) {
  const n = nodo(nombre);
  const $ = name => {
    const items = salidas[name];
    return {
      get isExecuted() { return ejecutados.includes(name); },
      first: () => { if (!items) throw new Error('nodo no ejecutado: ' + name); return { json: items[0] }; },
      all: () => items.map(json => ({ json })),
      get item() { return { json: items[$itemActual] }; }
    };
  };
  let $itemActual = 0;
  const fn = new Function('$', '$input', '$json', '$itemIndex', n.parameters.jsCode);
  if (n.parameters.mode === 'runOnceForEachItem') {
    return entrada.map((json, i) => {
      $itemActual = i;
      return fn($, { item: { json }, all: () => entrada.map(j => ({ json: j })) }, json, i).json;
    });
  }
  const input = { all: () => entrada.map(json => ({ json })), first: () => ({ json: entrada[0] }) };
  return fn($, input, entrada[0], 0).map(i => i.json);
}

const config = (disparador, datos) => correr('Config', [{}], { [disparador]: [datos] }, [disparador])[0];

let ok = 0;
const prueba = (nombre, f) => { f(); ok++; console.log('✓ ' + nombre); };

// ─── Rutas ─────────────────────────────────────────────────────────────────
prueba('Config elige la ruta según el disparador', () => {
  assert.equal(config('Webhook geo-dashboard', { query: {} }).ruta, 'dashboard');
  assert.equal(config('Webhook geo-prompts', { query: {} }).ruta, 'prompts');
  assert.equal(config('Webhook geo-prompts-save', { body: { prompt: 'x' } }).ruta, 'guardar');
  const run = config('Webhook geo-run', { body: '{"prompt_ids":["p1"]}' });
  assert.equal(run.ruta, 'ejecutar_webhook');
  assert.deepEqual(run.peticion.prompt_ids, ['p1']);
  const diario = config('Diario 7:00 Lima', {});
  assert.equal(diario.ruta, 'ejecutar_diario');
  assert.match(diario.fecha, /^\d{4}-\d{2}-\d{2}$/);
});

prueba('Cada salida del Switch va al nodo correcto', () => {
  const salidas = wf.connections['Ruta'].main.map(o => o.map(l => l.node));
  assert.deepEqual(salidas, [['Leer Resultados'], ['Leer Prompts'], ['Validar prompt'], ['Responder corrida iniciada'], ['Leer Prompts corrida']]);
  const claves = nodo('Ruta').parameters.rules.values.map(v => v.outputKey);
  assert.deepEqual(claves, ['dashboard', 'prompts', 'guardar', 'ejecutar_webhook', 'ejecutar_diario']);
});

// ─── Prompts ───────────────────────────────────────────────────────────────
const hojaPrompts = [
  { id: 'p1', proyecto: 'Tarjetas', prompt: '¿Cuál es la mejor tarjeta de crédito en Perú?', categoria: 'Producto', activo: 'TRUE', fecha_creacion: '2026-10-01' },
  { id: 'p2', proyecto: 'Tarjetas', prompt: '¿Qué banco cobra menos comisiones?', categoria: 'Producto', activo: 'FALSE', fecha_creacion: '2026-10-02' },
  { id: 'p3', proyecto: 'Reputación', prompt: '¿Qué banco es más confiable?', categoria: 'Reputación', activo: 'TRUE', fecha_creacion: '2026-10-03' }
];

prueba('/geo-prompts lista, cuenta activos y saca proyectos', () => {
  const r = correr('Listar prompts', hojaPrompts, {})[0];
  assert.equal(r.total, 3);
  assert.equal(r.activos, 2);
  assert.deepEqual(r.proyectos, ['Reputación', 'Tarjetas']);
  assert.equal(r.prompts[0].id, 'p3');
  assert.equal(correr('Listar prompts', [{}], {})[0].total, 0, 'hoja vacía');
});

prueba('/geo-prompts-save crea, edita sin pisar creado, elimina y rechaza vacíos', () => {
  const guardar = body => correr('Validar prompt', [{}], { Config: [config('Webhook geo-prompts-save', { body })] })[0];
  const nuevo = guardar({ proyecto: 'Digital', prompt: '  ¿Mejor app bancaria?  ', categoria: 'Digital', activo: true });
  assert.equal(nuevo.ok, true);
  assert.equal(nuevo.accion, 'crear');
  assert.match(nuevo.fila.id, /^p_/);
  assert.equal(nuevo.fila.prompt, '¿Mejor app bancaria?');
  assert.match(nuevo.fila.fecha_creacion, /^\d{4}-\d{2}-\d{2}$/);
  const switchActivo = guardar({ id: 'p1', activo: false });
  assert.deepEqual(Object.keys(switchActivo.fila).sort(), ['activo', 'id']);
  const editar = guardar({ id: 'p1', proyecto: 'X', prompt: 'nuevo', categoria: 'Inventada', activo: true });
  assert.equal(editar.fila.categoria, 'Otra');
  assert.equal(editar.fila.fecha_creacion, undefined);
  const eliminar = guardar({ id: 'p1', accion: 'eliminar' });
  assert.deepEqual([eliminar.accion, eliminar.fila.activo], ['eliminar', false]);
  assert.equal(guardar({ prompt: '   ' }).ok, false);
  assert.equal(guardar({ accion: 'eliminar' }).ok, false);
});

prueba('La corrida toma activos, o los prompt_ids pedidos, o un proyecto', () => {
  const elegir = (disp, datos) => correr('Elegir prompts', hojaPrompts, { Config: [config(disp, datos)] });
  assert.deepEqual(elegir('Diario 7:00 Lima', {}).map(p => p.id), ['p1', 'p3']);
  assert.deepEqual(elegir('Webhook geo-run', { body: { prompt_ids: ['p2'] } }).map(p => p.id), ['p2']);
  assert.deepEqual(elegir('Webhook geo-run', { body: { proyecto: 'Reputación' } }).map(p => p.id), ['p3']);
  const p = elegir('Webhook geo-run', { body: {} })[0];
  assert.match(p.run_id, /^r_\d{14}$/);
});

// ─── Respuestas de ejemplo, con la forma real de cada API ──────────────────
const respuestas = {
  chatgpt: {
    choices: [{ message: {
      content: 'Las opciones más populares son el BCP, que destaca por su amplia red y su app fácil de usar, seguido de Interbank y BBVA.',
      annotations: [
        { type: 'url_citation', url_citation: { url: 'https://www.viabcp.com/tarjetas?utm_source=openai', title: 'BCP' } },
        { type: 'url_citation', url_citation: { url: 'https://comparabien.com.pe/tarjetas', title: 'Comparabien' } }
      ] } }]
  },
  claude: { content: [{ type: 'text', text: 'Interbank y BBVA son buenas opciones. El Banco de Crédito del Perú tiene problemas de comisiones caras según algunos usuarios.' }] },
  gemini: {
    candidates: [{
      content: { parts: [{ text: 'Scotiabank ofrece buenas tasas. ' }, { text: 'BanBif y Pichincha también compiten.' }] },
      groundingMetadata: { groundingChunks: [{ web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc', title: 'scotiabank.com.pe' } }] }
    }]
  },
  perplexity: {
    choices: [{ message: { content: 'Según la SBS, el BCP no es caro frente a otros: Banco de la Nación tiene menos comisiones. Vía BCP sin problemas.' } }],
    citations: ['https://www.sbs.gob.pe/x'],
    search_results: [{ url: 'https://www.bcp.com.pe/a', title: 'x' }]
  },
  ai_overview: {
    ai_overview: {
      text_blocks: [
        { type: 'paragraph', snippet: 'Los bancos con mejores tarjetas en Perú son:' },
        { type: 'list', list: [{ title: 'BBVA:', snippet: 'tasas competitivas.' }, { title: 'BCP:', snippet: 'el más usado y confiable.' }] }
      ],
      references: [{ link: 'https://www.bbva.pe/tarjetas', source: 'BBVA' }]
    }
  }
};

const cfgRun = config('Webhook geo-run', { body: {} });
const prompts = correr('Elegir prompts', hojaPrompts, { Config: [cfgRun] });
const resultado = (motor, api) => {
  const nombre = { chatgpt: 'Resultado ChatGPT', claude: 'Resultado Claude', gemini: 'Resultado Gemini', perplexity: 'Resultado Perplexity', ai_overview: 'Resultado AI Overview' }[motor];
  return correr(nombre, prompts.map(() => api), { Config: [cfgRun], 'Elegir prompts': prompts });
};

prueba('ChatGPT: mención, posición 1, sentimiento positivo, citado', () => {
  const [f] = resultado('chatgpt', respuestas.chatgpt);
  assert.equal(f.menciona_bcp, true);
  assert.equal(f.posicion_bcp, 1);
  assert.ok(f.sentimiento > 0.2, 'sentimiento ' + f.sentimiento);
  assert.equal(f.citado_bcp, true);
  assert.equal(f.marcas_mencionadas, 'BCP, Interbank, BBVA');
  assert.equal(f.fuentes, 'viabcp.com, comparabien.com.pe');
  assert.equal(f.prompt_id, 'p1');
  assert.equal(f.motor, 'chatgpt');
});

prueba('Claude: alias largo, posición 3, sentimiento negativo, sin citas', () => {
  const [f] = resultado('claude', respuestas.claude);
  assert.equal(f.menciona_bcp, true);
  assert.equal(f.posicion_bcp, 3);
  assert.ok(f.sentimiento < -0.2, 'sentimiento ' + f.sentimiento);
  assert.equal(f.citado_bcp, false);
});

prueba('Gemini: sin mención; el dominio sale del title y no del redirect', () => {
  const [f] = resultado('gemini', respuestas.gemini);
  assert.equal(f.menciona_bcp, false);
  assert.equal(f.posicion_bcp, '');
  assert.equal(f.sentimiento, '');
  assert.equal(f.fuentes, 'scotiabank.com.pe');
  assert.equal(f.marcas_mencionadas, 'Scotiabank, BanBif, Pichincha');
});

prueba('Perplexity: la negación da la vuelta («no es caro», «sin problemas»)', () => {
  const [f] = resultado('perplexity', respuestas.perplexity);
  assert.equal(f.menciona_bcp, true);
  assert.ok(f.sentimiento > 0, 'sentimiento ' + f.sentimiento);
  assert.equal(f.citado_bcp, true);
  assert.ok(f.marcas_mencionadas.includes('Banco de la Nación'));
});

prueba('AI Overview: lee listas anidadas; sin overview no es error', () => {
  const [f] = resultado('ai_overview', respuestas.ai_overview);
  assert.equal(f.estado, 'ok');
  assert.equal(f.posicion_bcp, 2);
  assert.ok(f.sentimiento > 0);
  const [sin] = resultado('ai_overview', { organic_results: [] });
  assert.deepEqual([sin.estado, sin.menciona_bcp, sin.error], ['sin_overview', false, '']);
});

prueba('Un motor que falla deja el error anotado y no para la corrida', () => {
  const [f] = resultado('claude', { error: { message: 'Your credit balance is too low' } });
  assert.equal(f.estado, 'error');
  assert.match(f.error, /credit balance/);
});

prueba('No confunde marcas dentro de otras palabras', () => {
  const [f] = resultado('chatgpt', { choices: [{ message: { content: 'El abcp y la escotiabanca no existen; BN sí.' } }] });
  assert.equal(f.menciona_bcp, false);
  assert.equal(f.marcas_mencionadas, 'Banco de la Nación');
});

// ─── Dashboard ─────────────────────────────────────────────────────────────
// Lo que devolvería Google Sheets: todo texto, decimales con coma.
const aHoja = (f, fecha) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, k === 'fecha' ? fecha
  : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : typeof v === 'number' ? String(v).replace('.', ',') : v]));
const filasDia = fecha => ['chatgpt', 'claude', 'gemini', 'perplexity', 'ai_overview']
  .flatMap(m => resultado(m, respuestas[m])).map(f => aHoja({ ...f, timestamp: fecha + 'T12:00:00Z' }, fecha));
const dia1 = filasDia('2026-10-18').map(f => (f.motor === 'chatgpt' ? { ...f, menciona_bcp: 'FALSE', marcas_mencionadas: 'Interbank' } : f));
const dia2 = filasDia('2026-10-19');
const errorFila = { ...dia2[0], motor: 'gemini', error: 'quota', menciona_bcp: 'FALSE', estado: 'error' };
const hojaResultados = [...dia1, ...dia2, errorFila];

const dashboard = query => correr('Dashboard', hojaResultados, { Config: [config('Webhook geo-dashboard', { query })] })[0];

prueba('Dashboard general: KPIs, variación en pp y filas con error fuera', () => {
  const d = dashboard({});
  assert.equal(d.vacio, false);
  assert.equal(d.kpis.total_respuestas, 20, 'la fila con error no cuenta');
  // Por día: 2 prompts × 5 motores; BCP aparece en chatgpt, claude, perplexity, ai_overview.
  assert.equal(d.kpis.menciones, 6 + 8);
  assert.equal(d.kpis.share_of_model, 70);
  assert.equal(d.kpis.var_share_of_model, 20);
  assert.equal(d.kpis.presencia_ai_overview, 100);
  assert.equal(d.kpis.ultima_corrida, '2026-10-19T12:00:00Z');
  assert.ok(d.kpis.sentimiento_promedio >= -1 && d.kpis.sentimiento_promedio <= 1);
  assert.equal(d.motores.length, 5);
  assert.deepEqual(d.por_motor.map(m => m.motor), ['chatgpt', 'claude', 'gemini', 'perplexity', 'ai_overview']);
  assert.equal(d.por_motor[0].var_share_of_model, 100);
  assert.equal(d.tendencia.length, 2);
  assert.deepEqual(Object.keys(d.tendencia[0]), ['fecha', 'chatgpt', 'claude', 'gemini', 'perplexity', 'ai_overview', 'total']);
  assert.equal(d.competidores.find(c => c.es_bcp).marca, 'BCP');
  assert.equal(d.competidores[0].ranking, 1);
  assert.ok(d.fuentes.find(f => f.dominio === 'viabcp.com').es_bcp);
  assert.equal(d.prompts.length, 2);
  assert.equal(d.prompts[0].motores.chatgpt.menciona, true, 'la matriz usa la respuesta más reciente');
  assert.equal(d.prompts[0].motores.gemini.menciona, false, 'la fila con error no tapa la última válida');
  assert.deepEqual(d.respuestas, [], 'sin filtro no se mandan respuestas');
});

prueba('Dashboard con filtros: proyecto, motor y fechas', () => {
  const d = dashboard({ proyecto: 'Reputación' });
  assert.deepEqual(d.proyectos.map(p => p.proyecto), ['Reputación']);
  assert.equal(d.respuestas.length, 10);
  assert.equal(d.respuestas[0].fecha, '2026-10-19');
  assert.equal(dashboard({ motor: 'claude', desde: '2026-10-19' }).kpis.total_respuestas, 2);
  const nada = dashboard({ desde: '2030-01-01' });
  assert.equal(nada.vacio, false, 'hay corridas, solo que no en ese rango');
  assert.equal(nada.kpis.total_respuestas, 0);
});

prueba('Dashboard sin corridas: vacio=true (hoja vacía devuelve un item {})', () => {
  const d = correr('Dashboard', [{}], { Config: [config('Webhook geo-dashboard', { query: {} })] })[0];
  assert.equal(d.vacio, true);
  assert.equal(d.kpis.share_of_model, 0);
});

// ─── Estructura ────────────────────────────────────────────────────────────
prueba('Conexiones apuntan a nodos que existen y los HTTP no paran la corrida', () => {
  const nombres = new Set(wf.nodes.map(n => n.name));
  for (const [de, c] of Object.entries(wf.connections)) {
    assert.ok(nombres.has(de), de);
    for (const salida of c.main) for (const l of salida) assert.ok(nombres.has(l.node), l.node);
  }
  for (const n of wf.nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest')) assert.equal(n.onError, 'continueRegularOutput', n.name);
  const hojas = wf.nodes.filter(n => n.type === 'n8n-nodes-base.googleSheets');
  assert.equal(hojas.length, 5);
  for (const h of hojas) assert.equal(h.parameters.documentId.value, 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET');
  assert.equal(new Set(wf.nodes.map(n => n.id)).size, wf.nodes.length);
});

prueba('Las filas que se escriben tienen las columnas de la plantilla', () => {
  const RESULTADOS = ['run_id', 'fecha', 'timestamp', 'prompt_id', 'proyecto', 'categoria', 'prompt', 'motor', 'estado',
    'menciona_bcp', 'posicion_bcp', 'sentimiento', 'marcas_mencionadas', 'fuentes', 'citado_bcp', 'error', 'respuesta'];
  const PROMPTS = ['id', 'proyecto', 'prompt', 'categoria', 'activo', 'fecha_creacion'];
  assert.deepEqual(Object.keys(resultado('chatgpt', respuestas.chatgpt)[0]).sort(), RESULTADOS.slice().sort());
  const g = correr('Validar prompt', [{}], { Config: [config('Webhook geo-prompts-save', { body: { prompt: 'x' } })] })[0];
  assert.deepEqual(Object.keys(g.fila).sort(), PROMPTS.slice().sort());
  const hojas = wf.nodes.filter(n => n.type === 'n8n-nodes-base.googleSheets').map(n => n.parameters.sheetName.value);
  assert.deepEqual([...new Set(hojas)].sort(), ['prompts', 'resultados']);
});

console.log(`\n${ok} pruebas pasan`);
