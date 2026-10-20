// Genera los dos workflows a partir de src/:
//   geo-corrida.n8n.json  prompts → 5 motores en paralelo → Analista IA → hoja resultados
//   geo-api.n8n.json      los endpoints que usa el front
// No se editan a mano: se cambia src/ y se corre `node automatizacion/geo-monitor/build.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const dir = new URL('.', import.meta.url);
const src = f => readFileSync(new URL('src/' + f, dir), 'utf8');
const SHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';
const { CONFIG } = new Function(src('config.js') + '\nreturn { CONFIG };')();

// IDs estables: el mismo nombre de nodo da el mismo id en cada build.
const uuid = s => {
  const h = createHash('sha1').update('geo-monitor:' + s).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};

function workflow(nombre) {
  const nodes = [];
  const connections = {};
  const w = {
    node(name, type, typeVersion, position, parameters, extra = {}) {
      nodes.push({ id: uuid(nombre + ':' + name), name, type, typeVersion, position, parameters, ...extra });
      return name;
    },
    // Encadena nodos: w.chain('A', 'B', 'C') conecta A→B→C por la salida 0.
    chain(...nombres) {
      for (let i = 0; i < nombres.length - 1; i++) w.link(nombres[i], nombres[i + 1]);
    },
    link(from, to, output = 0, tipo = 'main', entrada = 0) {
      connections[from] ??= {};
      connections[from][tipo] ??= [];
      while (connections[from][tipo].length <= output) connections[from][tipo].push([]);
      connections[from][tipo][output].push({ node: to, type: tipo, index: entrada });
    },
    json: () => ({
      name: nombre,
      nodes,
      connections,
      settings: { executionOrder: 'v1', timezone: 'America/Lima', saveManualExecutions: true }
    })
  };
  return w;
}

const code = (w, name, position, jsCode, mode) =>
  w.node(name, 'n8n-nodes-base.code', 2, position, mode ? { mode, jsCode } : { jsCode });

const sheet = (w, name, position, operation, hoja, extra = {}, nodo = {}) =>
  w.node(name, 'n8n-nodes-base.googleSheets', 4.5, position, {
    operation,
    documentId: { __rl: true, value: SHEET_ID, mode: 'id' },
    sheetName: { __rl: true, value: hoja, mode: 'name' },
    ...extra,
    options: operation === 'read' ? {} : { cellFormat: 'RAW' }
  }, { ...(operation === 'read' ? { alwaysOutputData: true } : {}), ...nodo });

const webhook = (w, name, method, path, position, responseMode = 'responseNode') =>
  w.node(name, 'n8n-nodes-base.webhook', 2, position,
    { httpMethod: method, path, responseMode, options: { allowedOrigins: '*' } },
    { webhookId: uuid('webhook:' + path) });

const responderJson = (w, name, position, body, status = 200) =>
  w.node(name, 'n8n-nodes-base.respondToWebhook', 1.1, position,
    { respondWith: 'json', responseBody: body, options: { responseCode: status } });

// ═══ GEO · Corrida ═════════════════════════════════════════════════════════
const corrida = workflow('GEO TRACKER BCP · Corrida');

corrida.node('Cada día 7:00 (Lima)', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 0], {
  rule: { interval: [{ field: 'cronExpression', expression: '0 7 * * *' }] }
});
// Responde al instante («Workflow was started») y la corrida sigue sola.
webhook(corrida, 'Webhook geo-run', 'POST', 'geo-run', [0, 200], 'onReceived');
sheet(corrida, 'Leer prompts', [240, 100], 'read', 'prompts');
code(corrida, 'Elegir prompts', [460, 100], src('prompts.js') + `
// Del front llega {prompt_ids?, proyecto?}; la corrida diaria toma todos los activos.
let peticion = {};
try { if ($('Webhook geo-run').isExecuted) peticion = $('Webhook geo-run').first().json.body || {}; } catch (e) {}
if (typeof peticion === 'string') { try { peticion = JSON.parse(peticion); } catch (e) { peticion = {}; } }
const ahora = new Date();
const runId = 'r_' + ahora.toISOString().replace(/\\D/g, '').slice(0, 14);
const fecha = ahora.toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
return elegirPrompts($input.all().map(i => i.json), peticion).map(p => ({
  json: Object.assign(p, { run_id: runId, fecha, timestamp: ahora.toISOString() })
}));
`);

// Cada prompt sale en paralelo a los 5 motores. Cada motor recibe solo el
// prompt, tal cual, sin la respuesta de ningún otro.
const PROMPT = `$json.prompt`;

// AI Overview (SerpAPI) apagado el 20/10 a pedido: se vuelve a encender
// poniendo true, y corriendo build.mjs y publicar.mjs. Apagado, la corrida no
// llama a SerpAPI y no escribe filas de ai_overview (no cuentan como error).
const SERPAPI_ACTIVO = process.env.GEO_SERPAPI ? process.env.GEO_SERPAPI === '1' : false;
const http = (name, position, params) =>
  corrida.node(name, 'n8n-nodes-base.httpRequest', 4.2, position, {
    ...params,
    options: { timeout: 180000, batching: { batch: { batchSize: 1, batchInterval: 1000 } } }
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2, waitBetweenTries: 5000 });
const body = obj => ({ sendBody: true, specifyBody: 'json', jsonBody: `={{ JSON.stringify(${obj}) }}` });
const headerAuth = { authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth' };
const serpApi = { authentication: 'predefinedCredentialType', nodeCredentialType: 'serpApi' };

http('ChatGPT', [700, -200], {
  method: 'POST', url: 'https://api.openai.com/v1/chat/completions', ...headerAuth,
  ...body(`{ model: 'gpt-4o-mini-search-preview', web_search_options: { search_context_size: 'low', user_location: { type: 'approximate', approximate: { country: 'PE', city: 'Lima', timezone: 'America/Lima' } } }, messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
// La búsqueda web de Claude no acepta country: 'PE' (400 «Country code PE is not
// supported»): la ubicación va por zona horaria y una línea de sistema.
http('Claude', [700, 0], {
  method: 'POST', url: 'https://api.anthropic.com/v1/messages',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'anthropicApi',
  sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
  ...body(`{ model: 'claude-sonnet-5-5', max_tokens: 4000, output_config: { effort: 'low' }, system: 'El usuario está en Lima, Perú.', tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3, user_location: { type: 'approximate', timezone: 'America/Lima' } }], messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
http('Gemini', [700, 200], {
  method: 'POST', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'googlePalmApi',
  ...body(`{ contents: [{ role: 'user', parts: [{ text: ${PROMPT} }] }], tools: [{ google_search: {} }] }`)
});
http('Perplexity', [700, 400], {
  method: 'POST', url: 'https://api.perplexity.ai/chat/completions', ...headerAuth,
  ...body(`{ model: 'sonar', web_search_options: { search_context_size: 'low', user_location: { country: 'PE' } }, messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
if (SERPAPI_ACTIVO) {
  http('Google (SerpAPI)', [700, 600], {
    method: 'GET', url: 'https://serpapi.com/search.json', ...serpApi,
    sendQuery: true, queryParameters: { parameters: [
      { name: 'engine', value: 'google' },
      { name: 'q', value: `={{ ${PROMPT} }}` },
      { name: 'google_domain', value: 'google.com.pe' },
      { name: 'gl', value: 'pe' },
      { name: 'hl', value: 'es' }
    ] }
  });
  // A veces Google carga el AI Overview aparte y SerpAPI devuelve un page_token.
  // Si no hay token, se consulta locations.json: es gratis, no gasta búsquedas y,
  // a diferencia de account.json, no devuelve la API key ni el email de la cuenta.
  const PIDE_PAGINA = `($json.ai_overview && $json.ai_overview.page_token && !($json.ai_overview.text_blocks || []).length)`;
  http('AI Overview (página)', [920, 600], {
    method: 'GET', url: `={{ ${PIDE_PAGINA} ? 'https://serpapi.com/search.json' : 'https://serpapi.com/locations.json?q=Lima&limit=1' }}`, ...serpApi,
    sendQuery: true, queryParameters: { parameters: [
      { name: 'engine', value: 'google_ai_overview' },
      { name: 'page_token', value: `={{ ($json.ai_overview || {}).page_token || '' }}` }
    ] }
  });
}

// Espera a que terminen todas las ramas.
const RAMAS = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].concat(SERPAPI_ACTIVO ? ['AI Overview (página)'] : []);
corrida.node('Esperar a los motores', 'n8n-nodes-base.merge', 3, [1160, 100], { numberInputs: RAMAS.length });

code(corrida, 'Juntar respuestas', [1380, 100], src('analisis.js') + `
// Un item por prompt y motor encendido. Cada nodo HTTP devuelve una
// respuesta por prompt y en el mismo orden, así que el índice los empareja.
const prompts = $('Elegir prompts').all();
const salida = [];
prompts.forEach((p, i) => {
  const de = n => { const r = $(n).all()[i]; return r ? r.json : { error: 'Sin respuesta de ' + n }; };
  const apis = {
    chatgpt: de('ChatGPT'), claude: de('Claude'), gemini: de('Gemini'), perplexity: de('Perplexity')${SERPAPI_ACTIVO ? `,
    google: de('Google (SerpAPI)'), ai_overview_pagina: de('AI Overview (página)')` : ''}
  };
  for (const r of juntarRespuestas(p.json, apis)) salida.push({ json: r });
});
return salida;
`);

const marcas = [CONFIG.marca].concat(CONFIG.competidores);
const listaMarcas = marcas.map(m => `${m.nombre} (${m.alias.filter(a => a !== m.nombre).join(', ') || 'sin alias'})`).join('; ');
corrida.node('Analista IA', '@n8n/n8n-nodes-langchain.informationExtractor', 1.2, [1600, 100], {
  text: `={{ 'Pregunta que se le hizo a ' + $json.motor + ':\\n' + $json.prompt + '\\n\\nRespuesta de ' + $json.motor + ':\\n' + ($json.texto || '(sin respuesta)') }}`,
  attributes: { attributes: [
    { name: 'menciona_bcp', type: 'boolean', required: true,
      description: `true si la respuesta nombra a ${CONFIG.marca.nombre} (o ${CONFIG.marca.alias.slice(1).join(', ')}).` },
    { name: 'posicion_bcp', type: 'number', required: true,
      description: `Lugar de ${CONFIG.marca.nombre} entre los bancos nombrados, por orden de aparición (1 = el primero). 0 si no aparece.` },
    { name: 'sentimiento', type: 'number', required: true,
      description: `Tono de la respuesta hacia ${CONFIG.marca.nombre}, de -1 (muy negativo) a 1 (muy positivo). 0 si es neutral o no aparece. Solo lo que dice de ${CONFIG.marca.nombre}, no de otros bancos.` },
    { name: 'n_menciones_bcp', type: 'number', required: true,
      description: `Cuántas veces se nombra a ${CONFIG.marca.nombre} (con cualquiera de sus nombres) en la respuesta. 0 si no aparece.` },
    { name: 'n_menciones_bancos', type: 'number', required: true,
      description: `Cuántas veces se nombra a cualquier banco en total, ${CONFIG.marca.nombre} incluido. Cada aparición cuenta. 0 si no se nombra ninguno.` },
    { name: 'detalle_marcas', type: 'string', required: true,
      description: 'Lista JSON con un objeto por banco nombrado, en orden de aparición: [{"marca": "BCP", "posicion": 1, "menciones": 2, "sentimiento": 0.6}]. posicion = orden de aparición (1 = primero); menciones = veces que se nombra ese banco; sentimiento de -1 a 1 sobre lo que la respuesta dice de ese banco (0 si es neutral). Usa los nombres canónicos de la lista de bancos. [] si no nombra ninguno. Solo el JSON, sin texto alrededor.' },
    { name: 'marcas_mencionadas', type: 'string', required: true,
      description: 'Bancos nombrados en la respuesta, en orden de aparición y separados por coma. Usa el nombre canónico de esta lista: ' + listaMarcas + '. Otros bancos, con su nombre tal cual. Vacío si no nombra ninguno.' }
  ] },
  options: {
    systemPromptTemplate: 'Analizas respuestas de asistentes de IA a preguntas sobre bancos en Perú, para medir la visibilidad de ' + CONFIG.marca.nombre + '. Te basas solo en el texto de la respuesta: no supongas ni completes nada que no esté escrito. Si la respuesta está vacía, ningún banco aparece.'
  }
}, { onError: 'continueRegularOutput' });
// Claude Haiku 5.5: el más barato (US$ 0,10 / 0,50 por millón de tokens).
// Sin temperature: Haiku 5.5 rechaza valores de muestreo distintos al de fábrica.
corrida.node('Claude · analista', '@n8n/n8n-nodes-langchain.lmChatAnthropic', 1.3, [1600, 320], {
  model: { __rl: true, mode: 'id', value: 'claude-haiku-5-5' },
  options: {}
});
corrida.link('Claude · analista', 'Analista IA', 0, 'ai_languageModel');

code(corrida, 'Armar fila', [1820, 100], src('config.js') + '\n' + src('sov.js') + '\n' + src('analisis.js') + `
// El Analista devuelve un item por respuesta y en el mismo orden.
const r = $('Juntar respuestas').all()[$itemIndex].json;
return { json: armarFila(r, $json.output, CONFIG) };
`, 'runOnceForEachItem');
sheet(corrida, 'Guardar resultados', [2040, 100], 'append', 'resultados', {
  columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: [], schema: [] }
});

corrida.link('Cada día 7:00 (Lima)', 'Leer prompts');
corrida.link('Webhook geo-run', 'Leer prompts');
corrida.chain('Leer prompts', 'Elegir prompts');
for (const m of ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].concat(SERPAPI_ACTIVO ? ['Google (SerpAPI)'] : [])) corrida.link('Elegir prompts', m);
if (SERPAPI_ACTIVO) corrida.link('Google (SerpAPI)', 'AI Overview (página)');
RAMAS.forEach((m, i) => corrida.link(m, 'Esperar a los motores', 0, 'main', i));
corrida.chain('Esperar a los motores', 'Juntar respuestas', 'Analista IA', 'Armar fila', 'Guardar resultados');

// ═══ GEO · API ═════════════════════════════════════════════════════════════
const api = workflow('GEO TRACKER BCP · API');

// GET /geo-dashboard
webhook(api, 'Webhook geo-dashboard', 'GET', 'geo-dashboard', [0, 0]);
sheet(api, 'Leer resultados', [240, 0], 'read', 'resultados');
code(api, 'Dashboard', [460, 0], src('config.js') + '\n' + src('dashboard.js') + `
const q = $('Webhook geo-dashboard').first().json.query || {};
const filtros = {};
for (const k of ['proyecto', 'motor', 'desde', 'hasta', 'prompt_id']) if (q[k]) filtros[k] = String(q[k]);
return [{ json: construirDashboard($input.all().map(i => i.json), filtros, Object.assign({ motores: MOTORES }, CONFIG)) }];
`);
api.node('Responder dashboard', 'n8n-nodes-base.respondToWebhook', 1.1, [680, 0], { respondWith: 'firstIncomingItem', options: {} });
api.chain('Webhook geo-dashboard', 'Leer resultados', 'Dashboard', 'Responder dashboard');

// GET /geo-prompts
webhook(api, 'Webhook geo-prompts', 'GET', 'geo-prompts', [0, 220]);
sheet(api, 'Leer prompts', [240, 220], 'read', 'prompts');
code(api, 'Listar prompts', [460, 220], src('prompts.js') + `
return [{ json: listarPrompts($input.all().map(i => i.json)) }];
`);
api.node('Responder prompts', 'n8n-nodes-base.respondToWebhook', 1.1, [680, 220], { respondWith: 'firstIncomingItem', options: {} });
api.chain('Webhook geo-prompts', 'Leer prompts', 'Listar prompts', 'Responder prompts');

// POST /geo-prompts-save
webhook(api, 'Webhook geo-prompts-save', 'POST', 'geo-prompts-save', [0, 440]);
code(api, 'Validar prompt', [240, 440], src('prompts.js') + `
let body = $('Webhook geo-prompts-save').first().json.body || {};
if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
const idNuevo = 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const r = prepararGuardado(body, hoy, idNuevo);
// Sale solo la fila a escribir, o {_borrar: id}, o {_error}.
if (!r.ok) return [{ json: { _error: r.error } }];
return [{ json: r.accion === 'eliminar' ? { _borrar: r.fila.id } : r.fila }];
`);
const regla = (clave, expr) => ({
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ id: uuid('accion:' + clave), leftValue: expr, rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  },
  renameOutput: true,
  outputKey: clave
});
api.node('¿Qué hacer?', 'n8n-nodes-base.switch', 3, [460, 440], {
  rules: { values: [
    regla('guardar', '={{ !$json._error && !$json._borrar }}'),
    regla('borrar', '={{ !!$json._borrar }}'),
    regla('error', '={{ !!$json._error }}')
  ] },
  options: {}
});
sheet(api, 'Guardar prompt', [680, 380], 'appendOrUpdate', 'prompts', {
  columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: ['id'], schema: [] }
});
responderJson(api, 'Responder guardado', [900, 380], `={{ JSON.stringify({ ok: true, prompt: $('Validar prompt').first().json }) }}`);
responderJson(api, 'Responder error', [680, 800], `={{ JSON.stringify({ ok: false, error: $json._error }) }}`, 400);
api.chain('Webhook geo-prompts-save', 'Validar prompt', '¿Qué hacer?', 'Guardar prompt', 'Responder guardado');
api.link('¿Qué hacer?', 'Responder error', 2);

// Eliminar borra la fila de la hoja prompts. Sus resultados se quedan en la
// hoja resultados y el monitor los sigue mostrando.
sheet(api, 'Leer prompts (borrar)', [680, 620], 'read', 'prompts', {}, { executeOnce: true });
code(api, 'Fila a borrar', [900, 620], `
const id = $('Validar prompt').first().json._borrar;
const fila = $input.all().map(i => i.json).find(f => String(f.id || '').trim() === id);
return [{ json: fila ? { id, row_number: fila.row_number } : { id, _error: 'No existe el prompt ' + id } }];
`);
api.node('¿Existe?', 'n8n-nodes-base.if', 2, [1120, 620], {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ id: uuid('existe'), leftValue: '={{ !$json._error && $json.row_number > 1 }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  },
  options: {}
});
api.node('Borrar fila', 'n8n-nodes-base.googleSheets', 4.5, [1340, 560], {
  operation: 'delete',
  documentId: { __rl: true, value: SHEET_ID, mode: 'id' },
  sheetName: { __rl: true, value: 'prompts', mode: 'name' },
  toDelete: 'rows',
  startIndex: '={{ $json.row_number }}',
  numberToDelete: 1
});
responderJson(api, 'Responder borrado', [1560, 560], `={{ JSON.stringify({ ok: true, accion: 'eliminar', id: $('Fila a borrar').first().json.id }) }}`);
responderJson(api, 'Responder no existe', [1340, 700], `={{ JSON.stringify({ ok: false, error: $json._error || 'No se encontró la fila' }) }}`, 404);
api.link('¿Qué hacer?', 'Leer prompts (borrar)', 1);
api.chain('Leer prompts (borrar)', 'Fila a borrar', '¿Existe?', 'Borrar fila', 'Responder borrado');
api.link('¿Existe?', 'Responder no existe', 1);

// GET /geo-monitor-data: lo que lee el front «BCP · Monitor de Visibilidad en IA»
webhook(api, 'Webhook geo-monitor-data', 'GET', 'geo-monitor-data', [0, 700]);
sheet(api, 'Leer resultados (monitor)', [240, 700], 'read', 'resultados');
// executeOnce: llegan tantos items como filas de resultados, pero la hoja se lee una vez.
sheet(api, 'Leer prompts (monitor)', [460, 700], 'read', 'prompts', {}, { executeOnce: true });
code(api, 'Datos del monitor', [680, 700], src('config.js') + '\n' + src('sov.js') + '\n' + src('dashboard.js') + '\n' + src('prompts.js') + '\n' + src('monitor.js') + `
const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
const resultados = $('Leer resultados (monitor)').all().map(i => i.json);
const prompts = $('Leer prompts (monitor)').all().map(i => i.json);
return [{ json: construirMonitor(resultados, prompts, CONFIG, hoy) }];
`);
api.node('Responder monitor', 'n8n-nodes-base.respondToWebhook', 1.1, [900, 700], { respondWith: 'firstIncomingItem', options: {} });
api.chain('Webhook geo-monitor-data', 'Leer resultados (monitor)', 'Leer prompts (monitor)', 'Datos del monitor', 'Responder monitor');

// GEO_BUILD_OUT: carpeta de salida alternativa (test.mjs arma ahí la versión con SerpAPI).
const salida = process.env.GEO_BUILD_OUT ? new URL('file://' + process.env.GEO_BUILD_OUT.replace(/\/?$/, '/')) : dir;
for (const [archivo, w] of [['geo-corrida.n8n.json', corrida], ['geo-api.n8n.json', api]]) {
  const j = w.json();
  writeFileSync(new URL(archivo, salida), JSON.stringify(j, null, 2) + '\n');
  if (!process.env.GEO_BUILD_OUT) console.log(`${archivo}: ${j.nodes.length} nodos`);
}
