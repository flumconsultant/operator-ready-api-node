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

const sheet = (w, name, position, operation, hoja, extra = {}) =>
  w.node(name, 'n8n-nodes-base.googleSheets', 4.5, position, {
    operation,
    documentId: { __rl: true, value: SHEET_ID, mode: 'id' },
    sheetName: { __rl: true, value: hoja, mode: 'name' },
    ...extra,
    options: operation === 'read' ? {} : { cellFormat: 'RAW' }
  }, operation === 'read' ? { alwaysOutputData: true } : {});

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
  ...body(`{ model: 'gpt-4o-search-preview', web_search_options: { user_location: { type: 'approximate', approximate: { country: 'PE', city: 'Lima', timezone: 'America/Lima' } } }, messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
http('Claude', [700, 0], {
  method: 'POST', url: 'https://api.anthropic.com/v1/messages',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'anthropicApi',
  sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
  ...body(`{ model: 'claude-sonnet-4-5', max_tokens: 2000, messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
http('Gemini', [700, 200], {
  method: 'POST', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'googlePalmApi',
  ...body(`{ contents: [{ role: 'user', parts: [{ text: ${PROMPT} }] }], tools: [{ google_search: {} }] }`)
});
http('Perplexity', [700, 400], {
  method: 'POST', url: 'https://api.perplexity.ai/chat/completions', ...headerAuth,
  ...body(`{ model: 'sonar', web_search_options: { user_location: { country: 'PE' } }, messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
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
// Si no hay token, se consulta account.json, que es gratis y no gasta búsquedas.
const PIDE_PAGINA = `($json.ai_overview && $json.ai_overview.page_token && !($json.ai_overview.text_blocks || []).length)`;
http('AI Overview (página)', [920, 600], {
  method: 'GET', url: `={{ ${PIDE_PAGINA} ? 'https://serpapi.com/search.json' : 'https://serpapi.com/account.json' }}`, ...serpApi,
  sendQuery: true, queryParameters: { parameters: [
    { name: 'engine', value: 'google_ai_overview' },
    { name: 'page_token', value: `={{ ($json.ai_overview || {}).page_token || '' }}` }
  ] }
});

// Espera a que terminen las 5 ramas.
corrida.node('Esperar a los 5 motores', 'n8n-nodes-base.merge', 3, [1160, 100], { numberInputs: 5 });

code(corrida, 'Juntar respuestas', [1380, 100], src('analisis.js') + `
// Un item por prompt y motor (5 por prompt). Cada nodo HTTP devuelve una
// respuesta por prompt y en el mismo orden, así que el índice los empareja.
const prompts = $('Elegir prompts').all();
const salida = [];
prompts.forEach((p, i) => {
  const de = n => { const r = $(n).all()[i]; return r ? r.json : { error: 'Sin respuesta de ' + n }; };
  const apis = {
    chatgpt: de('ChatGPT'), claude: de('Claude'), gemini: de('Gemini'), perplexity: de('Perplexity'),
    google: de('Google (SerpAPI)'), ai_overview_pagina: de('AI Overview (página)')
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
    { name: 'marcas_mencionadas', type: 'string', required: true,
      description: 'Bancos nombrados en la respuesta, en orden de aparición y separados por coma. Usa el nombre canónico de esta lista: ' + listaMarcas + '. Otros bancos, con su nombre tal cual. Vacío si no nombra ninguno.' }
  ] },
  options: {
    systemPromptTemplate: 'Analizas respuestas de asistentes de IA a preguntas sobre bancos en Perú, para medir la visibilidad de ' + CONFIG.marca.nombre + '. Te basas solo en el texto de la respuesta: no supongas ni completes nada que no esté escrito. Si la respuesta está vacía, ningún banco aparece.'
  }
}, { onError: 'continueRegularOutput' });
corrida.node('Gemini · analista', '@n8n/n8n-nodes-langchain.lmChatGoogleGemini', 1, [1600, 320], {
  modelName: 'models/gemini-2.5-flash', options: { temperature: 0 }
});
corrida.link('Gemini · analista', 'Analista IA', 0, 'ai_languageModel');

code(corrida, 'Armar fila', [1820, 100], src('config.js') + '\n' + src('analisis.js') + `
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
for (const m of ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Google (SerpAPI)']) corrida.link('Elegir prompts', m);
corrida.link('Google (SerpAPI)', 'AI Overview (página)');
['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'AI Overview (página)']
  .forEach((m, i) => corrida.link(m, 'Esperar a los 5 motores', 0, 'main', i));
corrida.chain('Esperar a los 5 motores', 'Juntar respuestas', 'Analista IA', 'Armar fila', 'Guardar resultados');

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
// Si es válido sale solo la fila a escribir; si no, el error.
return [{ json: r.ok ? r.fila : { _error: r.error } }];
`);
api.node('¿Válido?', 'n8n-nodes-base.if', 2, [460, 440], {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ id: uuid('valido'), leftValue: '={{ !$json._error }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  },
  options: {}
});
sheet(api, 'Guardar prompt', [680, 380], 'appendOrUpdate', 'prompts', {
  columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: ['id'], schema: [] }
});
responderJson(api, 'Responder guardado', [900, 380], `={{ JSON.stringify({ ok: true, prompt: $('Validar prompt').first().json }) }}`);
responderJson(api, 'Responder error', [680, 520], `={{ JSON.stringify({ ok: false, error: $json._error }) }}`, 400);
api.chain('Webhook geo-prompts-save', 'Validar prompt', '¿Válido?', 'Guardar prompt', 'Responder guardado');
api.link('¿Válido?', 'Responder error', 1);

for (const [archivo, w] of [['geo-corrida.n8n.json', corrida], ['geo-api.n8n.json', api]]) {
  const j = w.json();
  writeFileSync(new URL(archivo, dir), JSON.stringify(j, null, 2) + '\n');
  console.log(`${archivo}: ${j.nodes.length} nodos`);
}
