// Genera los tres workflows a partir de src/:
//   geo-corrida.n8n.json  prompts → 5 motores en paralelo → Analista IA → hoja resultados
//   geo-api.n8n.json      los endpoints que usa el front
//   geo-herramientas.n8n.json  auditoría GEO, fan-out e investigación de prompts
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

const webhook = (w, name, method, path, position, responseMode = 'responseNode') =>
  w.node(name, 'n8n-nodes-base.webhook', 2, position,
    { httpMethod: method, path, responseMode, options: { allowedOrigins: '*' } },
    { webhookId: uuid('webhook:' + path) });

// ─── Google Sheets por la API (pestañas por proyecto y por día) ─────────────
// hoja.js con el ID del Sheet (publicar.mjs reemplaza el marcador por el real).
const HOJA = () => `const SHEET_ID = '${SHEET_ID}';\n` + src('hoja.js');
const SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
const sheetsHttp = (w, name, position, params, extra = {}, opciones = {}) =>
  w.node(name, 'n8n-nodes-base.httpRequest', 4.2, position, {
    authentication: 'predefinedCredentialType', nodeCredentialType: 'googleSheetsOAuth2Api',
    ...params, options: { timeout: 120000, ...opciones }
  }, extra);
// Lista de pestañas (nombre, id, orden).
const leerPestanas = (w, name, position) => sheetsHttp(w, name, position, {
  method: 'GET', url: SHEETS,
  sendQuery: true, queryParameters: { parameters: [{ name: 'fields', value: 'sheets.properties(sheetId,title,index)' }] }
}, { executeOnce: true });
// Lee varias pestañas en una sola llamada; el cuerpo lo arma el nodo anterior.
const leerRangos = (w, name, position) => sheetsHttp(w, name, position, {
  method: 'POST', url: SHEETS + '/values:batchGetByDataFilter',
  sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.cuerpo) }}'
}, { executeOnce: true });
// Ejecuta, en orden, las peticiones que arma hoja.js (crear pestaña, escribir, agregar, borrar fila).
const ejecutarPeticiones = (w, name, position) => sheetsHttp(w, name, position, {
  method: '={{ $json.method }}', url: '={{ $json.url }}',
  sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.body) }}'
}, {}, { batching: { batch: { batchSize: 1, batchInterval: 300 } } });
// Pestañas → qué leer → lectura: los tres nodos con los que empieza cada flujo.
const lecturaHoja = (w, sufijo, y, opciones) => {
  const nombres = ['Pestañas del Sheet', 'Qué leer', 'Leer el Sheet'].map(n => sufijo ? `${n} (${sufijo})` : n);
  leerPestanas(w, nombres[0], [240, y]);
  code(w, nombres[1], [460, y], HOJA() + `
return [{ json: { cuerpo: cuerpoLectura($input.first().json, ${opciones}) } }];
`);
  leerRangos(w, nombres[2], [680, y]);
  w.chain(...nombres);
  return nombres;
};
const hace = dias => `new Date(Date.now() - ${dias} * 864e5).toLocaleDateString('en-CA', { timeZone: 'America/Lima' })`;

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
const [pestanasCorrida, , leerCorrida] = lecturaHoja(corrida, '', 100, '{ prompts: true }');
code(corrida, 'Elegir prompts', [900, 100], HOJA() + '\n' + src('prompts.js') + `
// Del front llega {prompt_ids?, proyecto?}; la corrida diaria toma todos los activos.
let peticion = {};
try { if ($('Webhook geo-run').isExecuted) peticion = $('Webhook geo-run').first().json.body || {}; } catch (e) {}
if (typeof peticion === 'string') { try { peticion = JSON.parse(peticion); } catch (e) { peticion = {}; } }
const ahora = new Date();
const runId = 'r_' + ahora.toISOString().replace(/\\D/g, '').slice(0, 14);
const fecha = ahora.toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
return elegirPrompts(leerHojas($input.first().json).prompts, peticion).map(p => ({
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

http('ChatGPT', [1140, -200], {
  method: 'POST', url: 'https://api.openai.com/v1/chat/completions', ...headerAuth,
  ...body(`{ model: 'gpt-4o-mini-search-preview', web_search_options: { search_context_size: 'low', user_location: { type: 'approximate', approximate: { country: 'PE', city: 'Lima', timezone: 'America/Lima' } } }, messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
// La búsqueda web de Claude no acepta country: 'PE' (400 «Country code PE is not
// supported»): la ubicación va por zona horaria y una línea de sistema.
http('Claude', [1140, 0], {
  method: 'POST', url: 'https://api.anthropic.com/v1/messages',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'anthropicApi',
  sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
  ...body(`{ model: 'claude-sonnet-5-5', max_tokens: 4000, output_config: { effort: 'low' }, system: 'El usuario está en Lima, Perú.', tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3, user_location: { type: 'approximate', timezone: 'America/Lima' } }], messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
http('Gemini', [1140, 200], {
  method: 'POST', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'googlePalmApi',
  ...body(`{ contents: [{ role: 'user', parts: [{ text: ${PROMPT} }] }], tools: [{ google_search: {} }] }`)
});
http('Perplexity', [1140, 400], {
  method: 'POST', url: 'https://api.perplexity.ai/chat/completions', ...headerAuth,
  ...body(`{ model: 'sonar', web_search_options: { search_context_size: 'low', user_location: { country: 'PE' } }, messages: [{ role: 'user', content: ${PROMPT} }] }`)
});
if (SERPAPI_ACTIVO) {
  http('Google (SerpAPI)', [1140, 600], {
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
  http('AI Overview (página)', [1360, 600], {
    method: 'GET', url: `={{ ${PIDE_PAGINA} ? 'https://serpapi.com/search.json' : 'https://serpapi.com/locations.json?q=Lima&limit=1' }}`, ...serpApi,
    sendQuery: true, queryParameters: { parameters: [
      { name: 'engine', value: 'google_ai_overview' },
      { name: 'page_token', value: `={{ ($json.ai_overview || {}).page_token || '' }}` }
    ] }
  });
}

// Espera a que terminen todas las ramas.
const RAMAS = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].concat(SERPAPI_ACTIVO ? ['AI Overview (página)'] : []);
corrida.node('Esperar a los motores', 'n8n-nodes-base.merge', 3, [1600, 100], { numberInputs: RAMAS.length });

code(corrida, 'Juntar respuestas', [1820, 100], src('analisis.js') + `
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
corrida.node('Analista IA', '@n8n/n8n-nodes-langchain.informationExtractor', 1.2, [2040, 100], {
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
      description: 'Lista JSON con un objeto por banco nombrado, en orden de aparición: [{"marca": "BCP", "posicion": 1, "menciones": 2, "sentimiento": 0.6, "recomendada": true, "atributos": ["seguridad", "tasas"]}]. posicion = orden de aparición (1 = primero); menciones = veces que se nombra ese banco; sentimiento de -1 a 1 sobre lo que la respuesta dice de ese banco (0 si es neutral); recomendada = true si la respuesta lo propone como una opción a elegir o contratar, false si solo lo menciona; atributos = cuáles de estos se le asocian en la respuesta: ' + CONFIG.atributos.join(', ') + ' ([] si ninguno). Usa los nombres canónicos de la lista de bancos. [] si no nombra ninguno. Solo el JSON, sin texto alrededor.' },
    { name: 'marcas_mencionadas', type: 'string', required: true,
      description: 'Bancos nombrados en la respuesta, en orden de aparición y separados por coma. Usa el nombre canónico de esta lista: ' + listaMarcas + '. Otros bancos, con su nombre tal cual. Vacío si no nombra ninguno.' }
  ] },
  options: {
    systemPromptTemplate: 'Analizas respuestas de asistentes de IA a preguntas sobre bancos en Perú, para medir la visibilidad de ' + CONFIG.marca.nombre + '. Te basas solo en el texto de la respuesta: no supongas ni completes nada que no esté escrito. Si la respuesta está vacía, ningún banco aparece.'
  }
}, { onError: 'continueRegularOutput' });
// Claude Haiku 5.5: el más barato (US$ 0,10 / 0,50 por millón de tokens).
// Sin temperature: Haiku 5.5 rechaza valores de muestreo distintos al de fábrica.
corrida.node('Claude · analista', '@n8n/n8n-nodes-langchain.lmChatAnthropic', 1.3, [2040, 320], {
  model: { __rl: true, mode: 'id', value: 'claude-haiku-5-5' },
  options: {}
});
corrida.link('Claude · analista', 'Analista IA', 0, 'ai_languageModel');

code(corrida, 'Armar fila', [2260, 100], src('config.js') + '\n' + src('sov.js') + '\n' + src('analisis.js') + `
// El Analista devuelve un item por respuesta y en el mismo orden.
const r = $('Juntar respuestas').all()[$itemIndex].json;
return { json: armarFila(r, $json.output, CONFIG) };
`, 'runOnceForEachItem');
// Los resultados van a la pestaña del día (se crea en la primera corrida del día).
code(corrida, 'Plan de guardado', [2480, 100], HOJA() + `
const meta = $('Pestañas del Sheet').first().json;
return planGuardarResultados($input.all().map(i => i.json), meta).map(p => ({ json: p }));
`);
ejecutarPeticiones(corrida, 'Guardar en la pestaña del día', [2700, 100]);

corrida.link('Cada día 7:00 (Lima)', pestanasCorrida);
corrida.link('Webhook geo-run', pestanasCorrida);
corrida.chain(leerCorrida, 'Elegir prompts');
for (const m of ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].concat(SERPAPI_ACTIVO ? ['Google (SerpAPI)'] : [])) corrida.link('Elegir prompts', m);
if (SERPAPI_ACTIVO) corrida.link('Google (SerpAPI)', 'AI Overview (página)');
RAMAS.forEach((m, i) => corrida.link(m, 'Esperar a los motores', 0, 'main', i));
corrida.chain('Esperar a los motores', 'Juntar respuestas', 'Analista IA', 'Armar fila', 'Plan de guardado', 'Guardar en la pestaña del día');

// ═══ GEO · API ═════════════════════════════════════════════════════════════
const api = workflow('GEO TRACKER BCP · API');
const respuesta = (name, position) =>
  api.node(name, 'n8n-nodes-base.respondToWebhook', 1.1, position, { respondWith: 'firstIncomingItem', options: {} });

// GET /geo-dashboard (lee las pestañas de días del último año)
webhook(api, 'Webhook geo-dashboard', 'GET', 'geo-dashboard', [0, 0]);
const lectDash = lecturaHoja(api, 'dashboard', 0, `{ resultadosDesde: ${hace(400)} }`);
code(api, 'Dashboard', [900, 0], HOJA() + '\n' + src('config.js') + '\n' + src('dashboard.js') + `
const q = $('Webhook geo-dashboard').first().json.query || {};
const filtros = {};
for (const k of ['proyecto', 'motor', 'desde', 'hasta', 'prompt_id']) if (q[k]) filtros[k] = String(q[k]);
return [{ json: construirDashboard(leerHojas($input.first().json).resultados, filtros, Object.assign({ motores: MOTORES }, CONFIG)) }];
`);
respuesta('Responder dashboard', [1120, 0]);
api.link('Webhook geo-dashboard', lectDash[0]);
api.chain(lectDash[2], 'Dashboard', 'Responder dashboard');

// GET /geo-prompts (todas las pestañas de proyecto)
webhook(api, 'Webhook geo-prompts', 'GET', 'geo-prompts', [0, 220]);
const lectPrompts = lecturaHoja(api, 'prompts', 220, '{ prompts: true }');
code(api, 'Listar prompts', [900, 220], HOJA() + '\n' + src('prompts.js') + `
return [{ json: listarPrompts(leerHojas($input.first().json).prompts) }];
`);
respuesta('Responder prompts', [1120, 220]);
api.link('Webhook geo-prompts', lectPrompts[0]);
api.chain(lectPrompts[2], 'Listar prompts', 'Responder prompts');

// POST /geo-prompts-save: crear, editar, activar/desactivar, mover de proyecto
// o eliminar. Un proyecto nuevo crea su pestaña.
webhook(api, 'Webhook geo-prompts-save', 'POST', 'geo-prompts-save', [0, 440]);
const lectSave = lecturaHoja(api, 'guardar', 440, '{ prompts: true }');
code(api, 'Planear cambio', [900, 440], HOJA() + '\n' + src('prompts.js') + `
let body = $('Webhook geo-prompts-save').first().json.body || {};
if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
const idNuevo = 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const plan = planGuardarPrompt(prepararGuardado(body, hoy, idNuevo), leerHojas($input.first().json).prompts, $('Pestañas del Sheet (guardar)').first().json);
// Un item por petición a la API de Sheets; si no hay nada que hacer, un item con el error.
if (!plan.ok) return [{ json: { _status: plan.status, _respuesta: plan.respuesta } }];
return plan.peticiones.map(p => ({ json: Object.assign(p, { _respuesta: plan.respuesta }) }));
`);
api.node('¿Hay cambios?', 'n8n-nodes-base.if', 2, [1120, 440], {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ id: uuid('hay-cambios'), leftValue: '={{ !!$json.method }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  },
  options: {}
});
ejecutarPeticiones(api, 'Escribir en el Sheet', [1340, 380]);
responderJson(api, 'Responder guardado', [1560, 380], `={{ JSON.stringify($('Planear cambio').first().json._respuesta) }}`);
api.node('Responder error', 'n8n-nodes-base.respondToWebhook', 1.1, [1340, 540], {
  respondWith: 'json', responseBody: '={{ JSON.stringify($json._respuesta) }}', options: { responseCode: '={{ $json._status }}' }
});
api.link('Webhook geo-prompts-save', lectSave[0]);
api.chain(lectSave[2], 'Planear cambio', '¿Hay cambios?', 'Escribir en el Sheet', 'Responder guardado');
api.link('¿Hay cambios?', 'Responder error', 1);

// GET /geo-monitor-data: lo que lee el front «BCP · Monitor de Visibilidad en IA»
webhook(api, 'Webhook geo-monitor-data', 'GET', 'geo-monitor-data', [0, 700]);
const lectMon = lecturaHoja(api, 'monitor', 700, `{ prompts: true, sistema: true, resultadosDesde: ${hace(190)} }`);
code(api, 'Datos del monitor', [900, 700], HOJA() + '\n' + src('config.js') + '\n' + src('sov.js') + '\n' + src('dashboard.js') + '\n' + src('prompts.js') + '\n' + src('monitor.js') + `
const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
const { prompts, resultados, sistema } = leerHojas($input.first().json);
const datos = construirMonitor(resultados, prompts, CONFIG, hoy, sistema);
// Los proyectos, en el orden de sus pestañas en el Sheet.
const orden = pestanas($('Pestañas del Sheet (monitor)').first().json).map(p => p.titulo);
const lugar = n => { const i = orden.indexOf(n); return i < 0 ? 999 : i; };
datos.monitor.projects.sort((a, b) => lugar(a.name) - lugar(b.name));
return [{ json: datos }];
`);
respuesta('Responder monitor', [1120, 700]);
api.link('Webhook geo-monitor-data', lectMon[0]);
api.chain(lectMon[2], 'Datos del monitor', 'Responder monitor');

// POST /geo-recs-save y /geo-domain-save: estado de una recomendación y
// categoría de un dominio, en las pestañas de sistema (se crean si faltan).
const bodyDe = nodo => `let body = $('${nodo}').first().json.body || {};
if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
const ahora = new Date().toLocaleString('sv-SE', { timeZone: 'America/Lima' }).slice(0, 16);`;
const siHayPeticiones = (w, name, position) => w.node(name, 'n8n-nodes-base.if', 2, position, {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ id: uuid(name), leftValue: '={{ !!$json.method }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  },
  options: {}
});
const PLAN_A_ITEMS = `if (!plan.ok) return [{ json: { _status: plan.status, _respuesta: plan.respuesta } }];
return plan.peticiones.map(p => ({ json: Object.assign(p, { _respuesta: plan.respuesta }) }));`;
function endpointSistema(w, { ruta, sufijo, y, planear }) {
  const hook = `Webhook ${ruta}`;
  webhook(w, hook, 'POST', ruta, [0, y]);
  const lect = lecturaHoja(w, sufijo, y, '{ sistema: true }');
  const plan = `Planear (${sufijo})`, si = `¿Hay cambios? (${sufijo})`, escr = `Escribir (${sufijo})`;
  code(w, plan, [900, y], HOJA() + '\n' + src('monitor.js') + '\n' + bodyDe(hook) + `
const sistema = leerHojas($input.first().json).sistema;
const meta = $('${lect[0]}').first().json;
const plan = ${planear};
${PLAN_A_ITEMS}
`);
  siHayPeticiones(w, si, [1120, y]);
  ejecutarPeticiones(w, escr, [1340, y - 60]);
  responderJson(w, `Responder (${sufijo})`, [1560, y - 60], `={{ JSON.stringify($('${plan}').first().json._respuesta) }}`);
  w.node(`Responder error (${sufijo})`, 'n8n-nodes-base.respondToWebhook', 1.1, [1340, y + 100], {
    respondWith: 'json', responseBody: '={{ JSON.stringify($json._respuesta) }}', options: { responseCode: '={{ $json._status }}' }
  });
  w.link(hook, lect[0]);
  w.chain(lect[2], plan, si, escr, `Responder (${sufijo})`);
  w.link(si, `Responder error (${sufijo})`, 1);
}
endpointSistema(api, { ruta: 'geo-recs-save', sufijo: 'recomendación', y: 960,
  planear: `planGuardarRecomendacion(body, sistema._recomendaciones, meta, ahora)` });
endpointSistema(api, { ruta: 'geo-domain-save', sufijo: 'dominio', y: 1220,
  planear: `planGuardarDominio(body, sistema._dominios, meta, ahora, CATEGORIAS_DOMINIO)` });

// ═══ GEO · Herramientas ════════════════════════════════════════════════════
// Auditoría GEO (crawlability y contenido), query fan-out e investigación de
// prompts. Se llaman a demanda desde el front; no tocan la corrida diaria.
const her = workflow('GEO TRACKER BCP · Herramientas');
const HER = () => src('config.js') + '\n' + src('herramientas.js');
const claudeHttp = (name, position) => her.node(name, 'n8n-nodes-base.httpRequest', 4.2, position, {
  method: 'POST', url: 'https://api.anthropic.com/v1/messages',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'anthropicApi',
  sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
  sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.cuerpo) }}',
  options: { timeout: 240000 }
}, { onError: 'continueRegularOutput' });
// Valida el pedido: si hay error responde 400; si no, sigue por la salida 0.
const siValido = (name, position) => her.node(name, 'n8n-nodes-base.if', 2, position, {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ id: uuid(name), leftValue: '={{ !$json.error }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  },
  options: {}
});
const responder400 = (name, position) => responderJson(her, name, position, '={{ JSON.stringify({ ok: false, error: $json.error }) }}', 400);

// POST /geo-audit {tipo: 'crawl'|'contenido', url, agente?, cabecera?}
webhook(her, 'Webhook geo-audit', 'POST', 'geo-audit', [0, 0]);
code(her, 'Armar auditoría', [220, 0], HER() + '\n' + bodyDe('Webhook geo-audit') + `
const a = pedidosAuditoria(body);
if (a.error) return [{ json: { error: a.error } }];
return a.pedidos.map(p => ({ json: Object.assign({ _tipo: a.tipo, _url: a.url }, p) }));
`);
siValido('¿URL válida?', [440, 0]);
her.node('Pedir la página', 'n8n-nodes-base.httpRequest', 4.2, [660, -60], {
  method: 'GET', url: '={{ $json.url }}',
  sendHeaders: true, specifyHeaders: 'json', jsonHeaders: '={{ JSON.stringify($json.headers) }}',
  options: { timeout: 20000, response: { response: { fullResponse: true, neverError: true, responseFormat: 'text' } } }
}, { onError: 'continueRegularOutput' });
code(her, 'Resultado de la auditoría', [880, -60], HER() + `
const pedidos = $('Armar auditoría').all().map(i => i.json);
const respuestas = $input.all().map(i => i.json);
const p0 = pedidos[0];
const resultado = p0._tipo === 'contenido'
  ? resultadoContenido(p0._url, p0.agente, respuestas[0])
  : resultadoCrawl(p0._url, pedidos, respuestas);
const fecha = new Date().toLocaleString('sv-SE', { timeZone: 'America/Lima' }).slice(0, 16);
const id = 'a_' + Date.now().toString(36);
return [{ json: { ok: true, auditoria: { id, type: p0._tipo === 'contenido' ? 'content' : 'crawl', url: p0._url, executedAt: fecha, result: resultado } } }];
`);
leerPestanas(her, 'Pestañas del Sheet', [1100, -60]);
code(her, 'Guardar auditoría', [1320, -60], HOJA() + `
const a = $('Resultado de la auditoría').first().json.auditoria;
const registro = { id: a.id, tipo: a.type, url: a.url, fecha: a.executedAt, resultado: JSON.stringify(a.result).slice(0, 45000) };
return planUpsertSistema('_auditorias', registro, 'id', [], $input.first().json).map(p => ({ json: p }));
`);
ejecutarPeticiones(her, 'Escribir en _auditorias', [1540, -60]);
responderJson(her, 'Responder auditoría', [1760, -60], `={{ JSON.stringify($('Resultado de la auditoría').first().json) }}`);
responder400('Responder URL no válida', [660, 120]);
her.chain('Webhook geo-audit', 'Armar auditoría', '¿URL válida?', 'Pedir la página', 'Resultado de la auditoría', 'Pestañas del Sheet', 'Guardar auditoría', 'Escribir en _auditorias', 'Responder auditoría');
her.link('¿URL válida?', 'Responder URL no válida', 1);

// POST /geo-fanout {query}: las búsquedas que Claude despliega para un prompt.
webhook(her, 'Webhook geo-fanout', 'POST', 'geo-fanout', [0, 320]);
code(her, 'Armar fan-out', [220, 320], HER() + '\n' + bodyDe('Webhook geo-fanout') + `
return [{ json: cuerpoFanout(body) }];
`);
siValido('¿Hay prompt?', [440, 320]);
claudeHttp('Claude · fan-out', [660, 260]);
code(her, 'Leer fan-out', [880, 260], HER() + `
const r = leerFanout($input.first().json);
return [{ json: Object.assign({ ok: !r.error, query: $('Armar fan-out').first().json.cuerpo.messages[0].content }, r) }];
`);
const responderTal = (name, position) =>
  her.node(name, 'n8n-nodes-base.respondToWebhook', 1.1, position, { respondWith: 'firstIncomingItem', options: {} });
responderTal('Responder fan-out', [1100, 260]);
responder400('Responder sin prompt', [660, 420]);
her.chain('Webhook geo-fanout', 'Armar fan-out', '¿Hay prompt?', 'Claude · fan-out', 'Leer fan-out', 'Responder fan-out');
her.link('¿Hay prompt?', 'Responder sin prompt', 1);

// POST /geo-prompt-research {modo: 'keywords'|'url'|'marca', keywords?, url?, idioma?, pais?}
webhook(her, 'Webhook geo-prompt-research', 'POST', 'geo-prompt-research', [0, 600]);
code(her, 'Armar investigación', [220, 600], HER() + '\n' + bodyDe('Webhook geo-prompt-research') + `
return [{ json: cuerpoInvestigacion(body, CONFIG) }];
`);
siValido('¿Pedido válido?', [440, 600]);
claudeHttp('Claude · investigación', [660, 540]);
code(her, 'Leer candidatos', [880, 540], HER() + `
const r = leerCandidatos($input.first().json);
return [{ json: Object.assign({ ok: !r.error, modo: $('Armar investigación').first().json.modo }, r) }];
`);
responderTal('Responder investigación', [1100, 540]);
responder400('Responder pedido no válido', [660, 700]);
her.chain('Webhook geo-prompt-research', 'Armar investigación', '¿Pedido válido?', 'Claude · investigación', 'Leer candidatos', 'Responder investigación');
her.link('¿Pedido válido?', 'Responder pedido no válido', 1);

// GEO_BUILD_OUT: carpeta de salida alternativa (test.mjs arma ahí la versión con SerpAPI).
const salida = process.env.GEO_BUILD_OUT ? new URL('file://' + process.env.GEO_BUILD_OUT.replace(/\/?$/, '/')) : dir;
for (const [archivo, w] of [['geo-corrida.n8n.json', corrida], ['geo-api.n8n.json', api], ['geo-herramientas.n8n.json', her]]) {
  const j = w.json();
  writeFileSync(new URL(archivo, salida), JSON.stringify(j, null, 2) + '\n');
  if (!process.env.GEO_BUILD_OUT) console.log(`${archivo}: ${j.nodes.length} nodos`);
}
