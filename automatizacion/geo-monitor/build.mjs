// Genera geo-monitor.n8n.json a partir de src/. El workflow no se edita a mano:
// se cambia src/ y se vuelve a correr `node automatizacion/geo-monitor/build.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const dir = new URL('.', import.meta.url);
const src = f => readFileSync(new URL('src/' + f, dir), 'utf8');
const SHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';

// IDs estables: el mismo nombre de nodo da el mismo id en cada build.
const uuid = s => {
  const h = createHash('sha1').update('geo-monitor:' + s).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};

const nodes = [];
const connections = {};
const node = (name, type, typeVersion, position, parameters, extra = {}) => {
  nodes.push({ id: uuid(name), name, type, typeVersion, position, parameters, ...extra });
  return name;
};
const link = (from, to, output = 0) => {
  connections[from] ??= { main: [] };
  while (connections[from].main.length <= output) connections[from].main.push([]);
  connections[from].main[output].push({ node: to, type: 'main', index: 0 });
};

const code = (name, position, jsCode, mode) =>
  node(name, 'n8n-nodes-base.code', 2, position, mode ? { mode, jsCode } : { jsCode });

const webhook = (name, method, path, position) =>
  node(name, 'n8n-nodes-base.webhook', 2, position,
    { httpMethod: method, path, responseMode: 'responseNode', options: { allowedOrigins: '*' } },
    { webhookId: uuid('webhook:' + path) });

const responder = (name, position, options) =>
  node(name, 'n8n-nodes-base.respondToWebhook', 1.1, position, options);

const responderJson = (name, position, body, status = 200) =>
  responder(name, position, {
    respondWith: 'json',
    responseBody: body,
    options: { responseCode: status }
  });

const sheet = (name, position, operation, hoja, extra = {}) =>
  node(name, 'n8n-nodes-base.googleSheets', 4.5, position, {
    operation,
    documentId: { __rl: true, value: SHEET_ID, mode: 'id' },
    sheetName: { __rl: true, value: hoja, mode: 'name' },
    ...extra
  }, operation === 'read' ? { alwaysOutputData: true } : {});

const http = (name, position, params) =>
  node(name, 'n8n-nodes-base.httpRequest', 4.2, position, {
    ...params,
    options: { timeout: 180000, batching: { batch: { batchSize: 1, batchInterval: 1500 } } }
  }, { onError: 'continueRegularOutput', retryOnFail: true, maxTries: 2, waitBetweenTries: 5000 });

const cond = (left, op, right) => ({
  id: uuid('cond:' + left + op + right),
  leftValue: left,
  rightValue: right,
  operator: op
});

// ─── Disparadores ──────────────────────────────────────────────────────────
webhook('Webhook geo-dashboard', 'GET', 'geo-dashboard', [0, 0]);
webhook('Webhook geo-prompts', 'GET', 'geo-prompts', [0, 200]);
webhook('Webhook geo-prompts-save', 'POST', 'geo-prompts-save', [0, 400]);
webhook('Webhook geo-run', 'POST', 'geo-run', [0, 600]);
node('Diario 7:00 Lima', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 800], {
  rule: { interval: [{ field: 'cronExpression', expression: '0 7 * * *' }] }
});

code('Config', [260, 400], src('config.js') + `
const ejecutado = n => { try { return $(n).isExecuted; } catch (e) { return false; } };
const leer = n => $(n).first().json;
const r = rutaDeEjecucion(ejecutado, leer);
let peticion = r.peticion;
if (typeof peticion === 'string') { try { peticion = JSON.parse(peticion); } catch (e) { peticion = {}; } }
const ahora = new Date();
return [{ json: Object.assign({}, CONFIG, {
  motores: MOTORES,
  ruta: r.ruta,
  peticion: peticion || {},
  ahora: ahora.toISOString(),
  fecha: fechaLocal(ahora, CONFIG.zona_horaria)
}) }];
`);
for (const t of ['Webhook geo-dashboard', 'Webhook geo-prompts', 'Webhook geo-prompts-save', 'Webhook geo-run', 'Diario 7:00 Lima']) link(t, 'Config');

const rutas = ['dashboard', 'prompts', 'guardar', 'ejecutar_webhook', 'ejecutar_diario'];
node('Ruta', 'n8n-nodes-base.switch', 3, [480, 400], {
  rules: {
    values: rutas.map(r => ({
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [cond('={{ $json.ruta }}', { type: 'string', operation: 'equals' }, r)],
        combinator: 'and'
      },
      renameOutput: true,
      outputKey: r
    }))
  },
  options: {}
});
link('Config', 'Ruta');

// ─── GET /geo-dashboard ────────────────────────────────────────────────────
sheet('Leer Resultados', [740, 0], 'read', 'resultados', { options: {} });
code('Dashboard', [960, 0], src('dashboard.js') + `
const cfg = $('Config').first().json;
const q = cfg.peticion || {};
const filtros = {};
for (const k of ['proyecto', 'motor', 'desde', 'hasta', 'prompt_id']) if (q[k]) filtros[k] = String(q[k]);
return [{ json: construirDashboard($input.all().map(i => i.json), filtros, cfg) }];
`);
responder('Responder dashboard', [1180, 0], { respondWith: 'firstIncomingItem', options: {} });
link('Ruta', 'Leer Resultados', 0);
link('Leer Resultados', 'Dashboard');
link('Dashboard', 'Responder dashboard');

// ─── GET /geo-prompts ──────────────────────────────────────────────────────
sheet('Leer Prompts', [740, 200], 'read', 'prompts', { options: {} });
code('Listar prompts', [960, 200], src('prompts.js') + `
return [{ json: listarPrompts($input.all().map(i => i.json)) }];
`);
responder('Responder prompts', [1180, 200], { respondWith: 'firstIncomingItem', options: {} });
link('Ruta', 'Leer Prompts', 1);
link('Leer Prompts', 'Listar prompts');
link('Listar prompts', 'Responder prompts');

// ─── POST /geo-prompts-save ────────────────────────────────────────────────
code('Validar prompt', [740, 400], src('prompts.js') + `
const cfg = $('Config').first().json;
const idNuevo = 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
return [{ json: prepararGuardado(cfg.peticion, cfg.fecha, idNuevo) }];
`);
node('¿Válido?', 'n8n-nodes-base.if', 2, [960, 400], {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [cond('={{ $json.ok }}', { type: 'boolean', operation: 'true', singleValue: true }, '')],
    combinator: 'and'
  },
  options: {}
});
code('Fila a guardar', [1180, 340], `return [{ json: $input.first().json.fila }];`);
sheet('Guardar prompt', [1400, 340], 'appendOrUpdate', 'prompts', {
  columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: ['id'], schema: [] },
  options: { cellFormat: 'RAW' }
});
responderJson('Responder guardado', [1620, 340],
  `={{ JSON.stringify({ ok: true, accion: $('Validar prompt').first().json.accion, prompt: $('Validar prompt').first().json.fila }) }}`);
responderJson('Responder error', [1180, 480], `={{ JSON.stringify({ ok: false, error: $json.error }) }}`, 400);
link('Ruta', 'Validar prompt', 2);
link('Validar prompt', '¿Válido?');
link('¿Válido?', 'Fila a guardar', 0);
link('¿Válido?', 'Responder error', 1);
link('Fila a guardar', 'Guardar prompt');
link('Guardar prompt', 'Responder guardado');

// ─── POST /geo-run y corrida diaria ────────────────────────────────────────
responderJson('Responder corrida iniciada', [740, 620],
  `={{ JSON.stringify({ ok: true, mensaje: 'Corrida iniciada; los resultados aparecerán en unos minutos', iniciada: $json.ahora }) }}`);
sheet('Leer Prompts corrida', [960, 760], 'read', 'prompts', { options: {} });
code('Elegir prompts', [1180, 760], src('prompts.js') + `
const cfg = $('Config').first().json;
const runId = 'r_' + cfg.ahora.replace(/\\D/g, '').slice(0, 14);
return elegirPrompts($input.all().map(i => i.json), cfg.peticion).map(p => ({
  json: Object.assign(p, { run_id: runId, fecha: cfg.fecha, timestamp: cfg.ahora })
}));
`);
link('Ruta', 'Responder corrida iniciada', 3);
link('Responder corrida iniciada', 'Leer Prompts corrida');
link('Ruta', 'Leer Prompts corrida', 4);
link('Leer Prompts corrida', 'Elegir prompts');

const modelo = m => `$('Config').first().json.modelos.${m}`;
const headerAuth = { authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth' };

http('ChatGPT', [1440, 560], {
  method: 'POST', url: 'https://api.openai.com/v1/chat/completions', ...headerAuth,
  sendBody: true, specifyBody: 'json',
  jsonBody: `={{ JSON.stringify({ model: ${modelo('chatgpt')}, web_search_options: { user_location: { type: 'approximate', approximate: { country: 'PE', city: 'Lima', timezone: 'America/Lima' } } }, messages: [{ role: 'user', content: $json.prompt }] }) }}`
});
http('Claude', [1440, 700], {
  method: 'POST', url: 'https://api.anthropic.com/v1/messages', ...headerAuth,
  sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
  sendBody: true, specifyBody: 'json',
  jsonBody: `={{ JSON.stringify({ model: ${modelo('claude')}, max_tokens: 2000, messages: [{ role: 'user', content: $json.prompt }] }) }}`
});
http('Gemini', [1440, 840], {
  method: 'POST',
  url: `=https://generativelanguage.googleapis.com/v1beta/models/{{ ${modelo('gemini')} }}:generateContent`,
  ...headerAuth, sendBody: true, specifyBody: 'json',
  jsonBody: `={{ JSON.stringify({ contents: [{ role: 'user', parts: [{ text: $json.prompt }] }], tools: [{ google_search: {} }] }) }}`
});
http('Perplexity', [1440, 980], {
  method: 'POST', url: 'https://api.perplexity.ai/chat/completions', ...headerAuth,
  sendBody: true, specifyBody: 'json',
  jsonBody: `={{ JSON.stringify({ model: ${modelo('perplexity')}, web_search_options: { user_location: { country: 'PE' } }, messages: [{ role: 'user', content: $json.prompt }] }) }}`
});
const serpQuery = extra => ({
  method: 'GET', url: 'https://serpapi.com/search.json',
  authentication: 'genericCredentialType', genericAuthType: 'httpQueryAuth',
  sendQuery: true, queryParameters: { parameters: extra }
});
http('AI Overview (búsqueda)', [1440, 1120], serpQuery([
  { name: 'engine', value: 'google' },
  { name: 'q', value: '={{ $json.prompt }}' },
  { name: 'google_domain', value: 'google.com.pe' },
  { name: 'gl', value: 'pe' },
  { name: 'hl', value: 'es' }
]));
node('¿Pide segunda llamada?', 'n8n-nodes-base.if', 2, [1660, 1120], {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [cond(
      `={{ !!($json.ai_overview && $json.ai_overview.page_token && !($json.ai_overview.text_blocks || []).length) }}`,
      { type: 'boolean', operation: 'true', singleValue: true }, '')],
    combinator: 'and'
  },
  options: {}
});
http('AI Overview (página)', [1880, 1060], serpQuery([
  { name: 'engine', value: 'google_ai_overview' },
  { name: 'page_token', value: '={{ $json.ai_overview.page_token }}' }
]));

const motoresHttp = [
  ['chatgpt', 'ChatGPT', 'Resultado ChatGPT', [1660, 560]],
  ['claude', 'Claude', 'Resultado Claude', [1660, 700]],
  ['gemini', 'Gemini', 'Resultado Gemini', [1660, 840]],
  ['perplexity', 'Perplexity', 'Resultado Perplexity', [1660, 980]],
  ['ai_overview', null, 'Resultado AI Overview', [2100, 1120]]
];
sheet('Guardar resultados', [2340, 840], 'append', 'resultados', {
  columns: { mappingMode: 'autoMapInputData', value: {}, matchingColumns: [], schema: [] },
  options: { cellFormat: 'RAW' }
});
for (const [motor, httpNode, nombre, pos] of motoresHttp) {
  code(nombre, pos, src('analisis.js') + `
const cfg = $('Config').first().json;
return { json: filaResultado('${motor}', $json, $('Elegir prompts').item.json, cfg) };
`, 'runOnceForEachItem');
  if (httpNode) {
    link('Elegir prompts', httpNode);
    link(httpNode, nombre);
  }
  link(nombre, 'Guardar resultados');
}
link('Elegir prompts', 'AI Overview (búsqueda)');
link('AI Overview (búsqueda)', '¿Pide segunda llamada?');
link('¿Pide segunda llamada?', 'AI Overview (página)', 0);
link('¿Pide segunda llamada?', 'Resultado AI Overview', 1);
link('AI Overview (página)', 'Resultado AI Overview');

const workflow = {
  name: 'GEO Monitor — Share of Model BCP',
  nodes,
  connections,
  settings: { executionOrder: 'v1', timezone: 'America/Lima', saveManualExecutions: true },
  pinData: {},
  meta: { templateCredsSetupCompleted: false }
};
writeFileSync(new URL('geo-monitor.n8n.json', dir), JSON.stringify(workflow, null, 2) + '\n');
console.log(`geo-monitor.n8n.json: ${nodes.length} nodos`);
