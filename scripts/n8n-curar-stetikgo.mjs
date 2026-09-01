/**
 * Curar el «Flujo 1 · Atención al Cliente por WhatsApp — StetikGO».
 *
 * El flujo estaba entregado como maqueta: 26 nodos bien pensados y ni uno solo
 * que pudiera ejecutarse. No fallaba por un error, fallaba por ocho, y casi
 * todos del mismo tipo —un hueco donde tenía que haber un dato—, así que la
 * cura consiste sobre todo en cerrar huecos y en darle al flujo una segunda
 * puerta de entrada para poder mirarlo funcionar sin depender de WhatsApp.
 *
 * ---- Lo que impedía que arrancara ----
 *
 * 1. La única entrada era el disparador de WhatsApp. Sin credencial de
 *    WhatsApp en la instancia (no hay ninguna, lo comprobé en las 44 flujos)
 *    no hay forma de lanzarlo, ni siquiera a mano.
 * 2. Los tres nodos de modelo estaban sin credencial y llamados «[pendiente]».
 * 3. Google Sheets apuntaba a un documento vacío (`value: ""`) y buscaba en la
 *    columna literal `<__PLACEHOLDER_VALUE__…__>`.
 * 4. La búsqueda del catálogo usaba el mensaje entero como valor a buscar:
 *    «¿cuánto cuesta la limpieza facial?» jamás va a coincidir con una celda
 *    que dice «Limpieza facial profunda». Ese es el error de fondo, y no se
 *    arregla poniendo el ID de la hoja.
 * 5. Peor aún: cuando la búsqueda no encuentra nada, el nodo no emite ítem, y
 *    los cinco nodos que hacen `$('P04 …').item` mueren con «no item found».
 *    O sea que el camino más probable —cliente que pregunta por algo que no
 *    está en el catálogo— era justo el que reventaba el flujo entero.
 * 6. El envío por WhatsApp tenía el mismo literal de relleno en phoneNumberId.
 * 7. El nodo de espera resume por webhook: en una prueba se queda colgado para
 *    siempre esperando a que Recepción conteste.
 * 8. El salto al Flujo 2 apunta a un workflowId vacío, y el Flujo 2 no existe.
 *
 * ---- Cómo queda ----
 *
 * Se conserva el diseño entero: mismas etapas, mismos nombres, misma lógica de
 * escalamiento. Lo que se añade es un interruptor, `es_prueba`, que nace en la
 * puerta de entrada y decide tres cosas: de dónde sale el catálogo, si se
 * espera a Recepción, y si se envía por WhatsApp o se simula el envío.
 *
 * En producción el flujo se comporta exactamente como se diseñó. En prueba
 * recorre las mismas ramas sin tocar WhatsApp ni la hoja de cálculo.
 *
 * La búsqueda del catálogo se rehace: en vez de pedirle a Google Sheets que
 * filtre por una columna, se lee el catálogo y se busca el servicio dentro del
 * mensaje comparando sin tildes ni mayúsculas. Y siempre emite un ítem, con
 * `encontrado: false` cuando no hay coincidencia, que es precisamente lo que
 * P07 necesita para mandar el caso a un humano en vez de morirse.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const ORIGEN = process.argv[2];
const DESTINO = process.argv[3] || 'automatizacion/n8n/stetikgo-flujo-1.json';

/* Las credenciales que ya existen en la instancia y están probadas en otros
   flujos. OpenAI: PoC_Alese es la más usada (23 nodos) y es la única con la
   que se ha visto correr un gpt-5, así que el gpt-5-mini que pedía el diseño
   se queda. De WhatsApp no hay ninguna: ese hueco no lo puedo cerrar yo. */
const CRED_OPENAI = { openAiApi: { id: 'gtyOmS5Jc7CP0skJ', name: 'PoC_Alese' } };
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'MbVZU1NmU2CvAAhz', name: 'Google Sheets account' } };
const CRED_GEMINI = { googlePalmApi: { id: 'cztoZbbD539lrqEm', name: 'Google Gemini(PaLM) Api account 2' } };

/* Los dos clasificadores no se quedan en OpenAI, y no es por gusto.

   Con gpt-5-mini —lo que pedía el diseño— el nodo falla siempre con «Model
   output doesn't fit required format»: el clasificador exige una respuesta con
   forma exacta y el modelo no la entrega. Con gpt-4.1-mini el fallo se vuelve
   intermitente, que es peor: en un banco de pruebas con seis combinaciones la
   misma configuración pasó, y en el flujo real falló dos de dos veces. Además,
   ante «quiero reservar una limpieza facial para el viernes», OpenAI respondió
   «consulta» y los otros tres proveedores «reserva».

   Gemini 2.5 Flash Lite acertó las cuatro veces que se probó el flujo entero y
   no falló ninguna. La redacción, en cambio, se queda en OpenAI: ahí no hay
   formato que cumplir, solo texto, y gpt-5-mini responde bien. */
const MODELO_CLASIFICADOR = {
  type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
  typeVersion: 1,
  parameters: { modelName: 'models/gemini-2.5-flash-lite', options: {} },
  credentials: CRED_GEMINI,
};

const flujo = JSON.parse(readFileSync(ORIGEN, 'utf8'));
const nodos = new Map(flujo.nodes.map((n) => [n.name, n]));
const pedir = (nombre) => {
  const n = nodos.get(nombre);
  if (!n) throw new Error(`Falta el nodo «${nombre}»; el flujo no es el esperado.`);
  return n;
};

const CONTEXTO = 'P02 · Recuperar contexto del cliente';
const CATALOGO = 'P04b · Buscar el servicio del mensaje';
const SENTIMIENTO = 'Intención y sentimiento';

/* ------------------------------------------------------------------ */
/* 1. Segunda puerta de entrada: poder ejecutarlo a mano.              */
/* ------------------------------------------------------------------ */

const disparadorPrueba = {
  id: 'p00-trigger',
  name: 'P00 · Probar con datos de ejemplo',
  type: 'n8n-nodes-base.manualTrigger',
  typeVersion: 1,
  position: [-1056, 288],
  parameters: {},
};

/* Un nodo de código y no un Set, porque el payload de WhatsApp es anidado y en
   un Set habría que declararlo campo a campo con expresiones. Aquí se cambia
   el texto de una línea y se prueba otro camino del flujo. */
const mensajePrueba = {
  id: 'p00-datos',
  name: 'P00 · Mensaje de prueba',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [-832, 288],
  parameters: {
    jsCode: `/* Cambia estas tres líneas para probar otros caminos del flujo.

   · "¿cuánto cuesta la limpieza facial profunda?"  -> consulta, responde precio
   · "quiero reservar depilación láser axilas"      -> reserva, salta al Flujo 2
   · "llevo tres días esperando, es una vergüenza"  -> queja + molestia, escala
   · "¿hacen trasplante capilar?"                   -> fuera de catálogo, escala */

const MENSAJE  = '¿Cuánto cuesta la limpieza facial profunda y cuánto dura?';
const TELEFONO = '51987654321';
const NOMBRE   = 'Cliente de prueba';

/* Se imita la forma exacta con la que el disparador de WhatsApp entrega los
   datos, para que P02 lea lo mismo venga de donde venga. */
return [{
  json: {
    es_prueba: true,
    contacts: [{ profile: { name: NOMBRE }, wa_id: TELEFONO }],
    messages: [{
      from: TELEFONO,
      id: 'wamid.PRUEBA',
      timestamp: String(Math.floor(Date.now() / 1000)),
      type: 'text',
      text: { body: MENSAJE },
    }],
  },
  pairedItem: { item: 0 },
}];`,
  },
};

/* ------------------------------------------------------------------ */
/* 2. P02 deja de explotar si el mensaje no trae lo que se espera.     */
/* ------------------------------------------------------------------ */

const p02 = pedir(CONTEXTO);
p02.parameters.assignments.assignments = [
  { id: 'a1', name: 'telefono', value: "={{ $json.messages?.[0]?.from ?? '' }}", type: 'string' },
  { id: 'a2', name: 'mensaje_texto', value: "={{ $json.messages?.[0]?.text?.body ?? '' }}", type: 'string' },
  { id: 'a3', name: 'nombre_contacto', value: "={{ $json.contacts?.[0]?.profile?.name ?? 'Cliente' }}", type: 'string' },
  { id: 'a4', name: 'estado_cliente', value: 'Cliente identificado', type: 'string' },
  { id: 'a5', name: 'contexto_cliente', value: '[pendiente: sistema/ubicación del listado de clientes y nodo de integración correspondiente]', type: 'string' },
  /* El interruptor. Se guarda como texto y no como booleano porque los nodos IF
     de este flujo ya comparan textos, y así no se mezclan dos formas de
     preguntar lo mismo. */
  { id: 'a6', name: 'es_prueba', value: "={{ $json.es_prueba === true ? 'si' : 'no' }}", type: 'string' },
];

/* ------------------------------------------------------------------ */
/* 3. Los modelos, con credencial y sin «[pendiente]» en el nombre.    */
/* ------------------------------------------------------------------ */

for (const [viejo, nuevo, clasificador] of [
  ['Modelo LLM · Intención [pendiente]', 'Modelo LLM · Intención', true],
  ['Modelo LLM · Molestia [pendiente]', 'Modelo LLM · Molestia', true],
  ['Modelo LLM · Redacción [pendiente]', 'Modelo LLM · Redacción', false],
]) {
  const n = pedir(viejo);
  n.name = nuevo;
  if (clasificador) Object.assign(n, MODELO_CLASIFICADOR);
  else n.credentials = CRED_OPENAI;
}

/* ------------------------------------------------------------------ */
/* 4. El catálogo: la parte que de verdad estaba rota.                 */
/* ------------------------------------------------------------------ */

const bifurcacionCatalogo = {
  id: 'p04-if',
  name: 'P04 · ¿Modo prueba?',
  type: 'n8n-nodes-base.if',
  typeVersion: 2.2,
  position: [1248, 288],
  parameters: {
    conditions: {
      options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
      combinator: 'and',
      conditions: [{
        id: 'pr1',
        leftValue: `={{ $('${CONTEXTO}').first().json.es_prueba }}`,
        rightValue: 'si',
        operator: { type: 'string', operation: 'equals' },
      }],
    },
    options: {},
  },
};

const catalogoPrueba = {
  id: 'p04-prueba',
  name: 'P04a · Catálogo de prueba',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [1472, 176],
  parameters: {
    jsCode: `/* Cuatro servicios inventados con la misma forma que tendrá la hoja real:
   una fila por servicio, con nombre, duración y precio. Sirven para recorrer
   el flujo entero sin tocar Google Sheets. Cuando exista el catálogo 2026 de
   verdad, esta rama se queda igual: solo se usa en modo prueba. */

return [
  { servicio: 'Limpieza facial profunda',   duracion: '60 min', precio: 'S/ 120' },
  { servicio: 'Depilación láser axilas',    duracion: '20 min', precio: 'S/ 90'  },
  { servicio: 'Masaje descontracturante',   duracion: '50 min', precio: 'S/ 110' },
  { servicio: 'Peeling químico',            duracion: '45 min', precio: 'S/ 180' },
].map((fila) => ({ json: fila, pairedItem: { item: 0 } }));`,
  },
};

/* Se lee el catálogo entero en vez de pedirle a Sheets que filtre. Filtrar allí
   era el error: obligaba a acertar la columna y el valor exacto, y dejaba al
   flujo sin ítem cuando no había coincidencia. Leyendo y comparando después,
   el resultado es siempre un ítem, encuentre o no. */
const catalogoReal = {
  id: 'p04-sheets',
  name: 'P04a · Leer catálogo 2026',
  type: 'n8n-nodes-base.googleSheets',
  typeVersion: 4.7,
  position: [1472, 400],
  parameters: {
    documentId: { __rl: true, mode: 'url', value: '', cachedResultName: 'PENDIENTE: pega aquí la URL del Google Sheet del catálogo 2026' },
    sheetName: { __rl: true, mode: 'list', value: 'gid=0', cachedResultName: 'Hoja 1' },
    options: {},
  },
  credentials: CRED_SHEETS,
};

const buscarServicio = {
  id: 'p04-buscar',
  name: CATALOGO,
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [1696, 288],
  parameters: {
    jsCode: `/* Busca cuál de los servicios del catálogo aparece en el mensaje.

   Antes esto lo hacía Google Sheets filtrando por el mensaje completo, que no
   coincide nunca. Aquí se compara al revés y con tolerancia: sin tildes, sin
   mayúsculas, y si el nombre completo no aparece, basta con que aparezcan sus
   palabras significativas ("depilación láser" encuentra "Depilación láser
   axilas").

   Emite SIEMPRE un ítem. Cuando no encuentra nada devuelve los campos vacíos y
   encontrado:false, que es lo que P07 mira para escalar a un humano. Ese era el
   fallo que mataba el flujo: sin ítem, los cinco nodos siguientes reventaban. */

const contexto = $('${CONTEXTO}').first().json;

const normalizar = (t) => String(t ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\\u0300-\\u036f]/g, '')
  .replace(/\\s+/g, ' ')
  .trim();

const mensaje = normalizar(contexto.mensaje_texto);

/* La hoja real puede llamar a sus columnas como quiera; se aceptan los nombres
   más probables y se comparan sin tildes ni mayúsculas. */
const columna = (fila, candidatos) => {
  const claves = Object.keys(fila);
  for (const candidato of candidatos) {
    const clave = claves.find((k) => normalizar(k) === normalizar(candidato));
    if (clave && String(fila[clave] ?? '').trim() !== '') return String(fila[clave]).trim();
  }
  return '';
};

const filas = $input.all().map((i) => i.json);

let encontrada = null;
let mejorPuntaje = 0;

for (const fila of filas) {
  const nombre = columna(fila, ['servicio', 'nombre', 'nombre del servicio', 'tratamiento']);
  if (!nombre) continue;

  const nombreNorm = normalizar(nombre);
  let puntaje = 0;

  if (mensaje.includes(nombreNorm)) {
    puntaje = 100;
  } else {
    /* Palabras de 4 letras o más: "de", "la", "con" no distinguen nada. */
    const palabras = nombreNorm.split(' ').filter((p) => p.length >= 4);
    const aciertos = palabras.filter((p) => mensaje.includes(p)).length;
    if (palabras.length && aciertos === palabras.length) puntaje = 80;
    else if (aciertos >= 2) puntaje = 50 + aciertos;
  }

  if (puntaje > mejorPuntaje) {
    mejorPuntaje = puntaje;
    encontrada = { fila, nombre };
  }
}

const salida = {
  ...contexto,
  servicio: encontrada ? encontrada.nombre : '',
  duracion: encontrada ? columna(encontrada.fila, ['duracion', 'duración', 'tiempo']) : '',
  precio: encontrada ? columna(encontrada.fila, ['precio', 'costo', 'tarifa', 'valor']) : '',
  encontrado: Boolean(encontrada),
  catalogo_filas: filas.length,
};

return [{ json: salida, pairedItem: { item: 0 } }];`,
  },
};

/* ------------------------------------------------------------------ */
/* 5. El freno humano y el envío, salteables en prueba.                */
/* ------------------------------------------------------------------ */

const bifurcacionFreno = {
  id: 'p08-if',
  name: 'P08b · ¿Esperar a Recepción?',
  type: 'n8n-nodes-base.if',
  typeVersion: 2.2,
  position: [2816, 96],
  parameters: {
    conditions: {
      options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
      combinator: 'and',
      conditions: [{
        id: 'pr2',
        leftValue: `={{ $('${CONTEXTO}').first().json.es_prueba }}`,
        rightValue: 'si',
        operator: { type: 'string', operation: 'equals' },
      }],
    },
    options: {},
  },
};

const bifurcacionEnvio = {
  id: 'p09-if',
  name: 'P09 · ¿Modo prueba?',
  type: 'n8n-nodes-base.if',
  typeVersion: 2.2,
  position: [2592, 400],
  parameters: {
    conditions: {
      options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
      combinator: 'and',
      conditions: [{
        id: 'pr3',
        leftValue: `={{ $('${CONTEXTO}').first().json.es_prueba }}`,
        rightValue: 'si',
        operator: { type: 'string', operation: 'equals' },
      }],
    },
    options: {},
  },
};

const envioSimulado = {
  id: 'p09-sim',
  name: 'P09t · Respuesta simulada (no se envía)',
  type: 'n8n-nodes-base.set',
  typeVersion: 3.5,
  position: [2816, 496],
  parameters: {
    assignments: {
      assignments: [
        { id: 's1', name: 'canal', value: 'simulado · modo prueba', type: 'string' },
        { id: 's2', name: 'destinatario', value: `={{ $('${CONTEXTO}').first().json.telefono }}`, type: 'string' },
        { id: 's3', name: 'mensaje_enviado', value: '={{ $json.text }}', type: 'string' },
      ],
    },
    includeOtherFields: true,
    options: {},
  },
};

/* ------------------------------------------------------------------ */
/* 6. Los literales de relleno que n8n deja y rompen la ejecución.     */
/* ------------------------------------------------------------------ */

const p09 = pedir('P09 · Enviar la respuesta');
p09.parameters.phoneNumberId = '';
p09.position = [2816, 304];

/* El Flujo 2 no existe todavía en la instancia. Un executeWorkflow con id vacío
   aborta la ejecución; desactivado, n8n lo atraviesa dejando pasar los datos, y
   el nodo sigue a la vista para cuando exista a qué apuntar. */
const p10exec = pedir('P10 · Pasar a Flujo 2 (reserva)');
p10exec.disabled = true;
p10exec.name = 'P10 · Pasar a Flujo 2 (reserva) [desactivado: el Flujo 2 aún no existe]';
p10exec.position = [3264, 400];

/* ------------------------------------------------------------------ */
/* 7. Repuntar las referencias al viejo nodo de catálogo.              */
/* ------------------------------------------------------------------ */

/* `.item` obliga a n8n a rastrear de qué ítem de entrada viene cada salida, y
   ese rastreo se pierde al pasar por una cadena LLM o un nodo de código. Como
   aquí se atiende un mensaje cada vez, `.first()` dice lo mismo sin poder
   fallar. */
const sustituciones = [
  [/\$\('P04 · Consultar catálogo 2026'\)\.item/g, `$('${CATALOGO}').first()`],
  [/\$\('P04 · Consultar catálogo 2026'\)\.first\(\)/g, `$('${CATALOGO}').first()`],
  [new RegExp(`\\$\\('${SENTIMIENTO}'\\)\\.item`, 'g'), `$('${SENTIMIENTO}').first()`],
  [new RegExp(`\\$\\('${CONTEXTO}'\\)\\.item`, 'g'), `$('${CONTEXTO}').first()`],
];

const repuntar = (valor) => {
  if (typeof valor === 'string') {
    let s = valor;
    for (const [de, a] of sustituciones) s = s.replace(de, a);
    return s;
  }
  if (Array.isArray(valor)) return valor.map(repuntar);
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, repuntar(v)]));
  }
  return valor;
};

/* El viejo nodo de Sheets desaparece: lo reemplaza la pareja leer + buscar. */
flujo.nodes = flujo.nodes.filter((n) => n.name !== 'P04 · Consultar catálogo 2026');
for (const n of flujo.nodes) n.parameters = repuntar(n.parameters);

flujo.nodes.push(
  disparadorPrueba, mensajePrueba,
  bifurcacionCatalogo, catalogoPrueba, catalogoReal, buscarServicio,
  bifurcacionFreno, bifurcacionEnvio, envioSimulado,
);

/* ------------------------------------------------------------------ */
/* 8. Posiciones y cableado completo.                                  */
/* ------------------------------------------------------------------ */

const POSICIONES = {
  'P01 · Recibir mensaje de WhatsApp': [-1056, 96],
  [CONTEXTO]: [-576, 192],
  'P05 · Redactar la respuesta': [1920, 288],
  'Modelo LLM · Redacción': [1920, 512],
  'P06 · Validar contra el catálogo': [2144, 288],
  'P07 · ¿Necesita a un humano?': [2368, 176],
  'P08 · Resumen para Recepción': [2592, 96],
  'P08 · Freno humano (Recepción)': [3040, 176],
  'P10 · ¿El cliente quiere reservar?': [3040, 400],
  'P11 · Registrar la interacción': [3488, 288],
};
for (const [nombre, pos] of Object.entries(POSICIONES)) {
  const n = flujo.nodes.find((x) => x.name === nombre);
  if (n) n.position = pos;
}

const M = (nombre) => [{ node: nombre, type: 'main', index: 0 }];
const IA = (nombre) => [{ node: nombre, type: 'ai_languageModel', index: 0 }];

flujo.connections = {
  'P01 · Recibir mensaje de WhatsApp': { main: [M(CONTEXTO)] },
  'P00 · Probar con datos de ejemplo': { main: [M('P00 · Mensaje de prueba')] },
  'P00 · Mensaje de prueba': { main: [M(CONTEXTO)] },

  [CONTEXTO]: { main: [M('P03 · Interpretar la intención')] },

  'P03 · Interpretar la intención': {
    main: [M('Intención = consulta'), M('Intención = reserva'), M('Intención = queja'), M('Intención = otra')],
  },
  'Modelo LLM · Intención': { ai_languageModel: [IA('P03 · Interpretar la intención')] },
  'Intención = consulta': { main: [M('Intención interpretada')] },
  'Intención = reserva': { main: [M('Intención interpretada')] },
  'Intención = queja': { main: [M('Intención interpretada')] },
  'Intención = otra': { main: [M('Intención interpretada')] },

  'Intención interpretada': { main: [M('P03b · ¿Existe molestia?')] },
  'P03b · ¿Existe molestia?': {
    main: [M('Molestia = true'), M('Molestia = false'), M('Molestia = false (fallback)')],
  },
  'Modelo LLM · Molestia': { ai_languageModel: [IA('P03b · ¿Existe molestia?')] },
  'Molestia = true': { main: [M(SENTIMIENTO)] },
  'Molestia = false': { main: [M(SENTIMIENTO)] },
  'Molestia = false (fallback)': { main: [M(SENTIMIENTO)] },

  [SENTIMIENTO]: { main: [M('P04 · ¿Modo prueba?')] },
  'P04 · ¿Modo prueba?': { main: [M('P04a · Catálogo de prueba'), M('P04a · Leer catálogo 2026')] },
  'P04a · Catálogo de prueba': { main: [M(CATALOGO)] },
  'P04a · Leer catálogo 2026': { main: [M(CATALOGO)] },
  [CATALOGO]: { main: [M('P05 · Redactar la respuesta')] },

  'P05 · Redactar la respuesta': { main: [M('P06 · Validar contra el catálogo')] },
  'Modelo LLM · Redacción': { ai_languageModel: [IA('P05 · Redactar la respuesta')] },

  'P06 · Validar contra el catálogo': {
    main: [M('P07 · ¿Necesita a un humano?'), M('P08 · Resumen para Recepción')],
  },
  'P07 · ¿Necesita a un humano?': {
    main: [M('P08 · Resumen para Recepción'), M('P09 · ¿Modo prueba?')],
  },

  'P08 · Resumen para Recepción': { main: [M('P08b · ¿Esperar a Recepción?')] },
  /* En prueba se salta el freno; en producción se espera a que Recepción
     resuelva por el webhook, como se diseñó. */
  'P08b · ¿Esperar a Recepción?': {
    main: [M('P11 · Registrar la interacción'), M('P08 · Freno humano (Recepción)')],
  },
  'P08 · Freno humano (Recepción)': { main: [M('P11 · Registrar la interacción')] },

  'P09 · ¿Modo prueba?': {
    main: [M('P09t · Respuesta simulada (no se envía)'), M('P09 · Enviar la respuesta')],
  },
  'P09t · Respuesta simulada (no se envía)': { main: [M('P10 · ¿El cliente quiere reservar?')] },
  'P09 · Enviar la respuesta': { main: [M('P10 · ¿El cliente quiere reservar?')] },

  'P10 · ¿El cliente quiere reservar?': {
    main: [M(p10exec.name), M('P11 · Registrar la interacción')],
  },
  [p10exec.name]: { main: [M('P11 · Registrar la interacción')] },
};

/* ------------------------------------------------------------------ */

const nombresFinales = new Set(flujo.nodes.map((n) => n.name));
const rotas = [];
for (const [de, tipos] of Object.entries(flujo.connections)) {
  if (!nombresFinales.has(de)) rotas.push(`origen inexistente: ${de}`);
  for (const salidas of Object.values(tipos)) {
    for (const salida of salidas || []) {
      for (const destino of salida || []) {
        if (!nombresFinales.has(destino.node)) rotas.push(`destino inexistente: ${de} -> ${destino.node}`);
      }
    }
  }
}
const sueltos = [...nombresFinales].filter(
  (n) => !Object.keys(flujo.connections).includes(n)
    && !Object.values(flujo.connections).some((t) => Object.values(t).some((s) => (s || []).some((l) => (l || []).some((d) => d.node === n)))),
);
const restos = JSON.stringify(flujo).match(/__PLACEHOLDER_VALUE__|\[pendiente:/g) || [];

writeFileSync(DESTINO, JSON.stringify(flujo, null, 2));

console.log(`Nodos: ${flujo.nodes.length} (antes 26)`);
console.log(`Conexiones rotas: ${rotas.length ? '\n  ' + rotas.join('\n  ') : 'ninguna'}`);
console.log(`Nodos sueltos: ${sueltos.length ? sueltos.join(', ') : 'ninguno'}`);
console.log(`Restos de relleno: ${restos.length} (${[...new Set(restos)].join(', ') || '—'})`);
console.log(`Escrito en ${DESTINO}`);
