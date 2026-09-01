/**
 * Curar el «Flujo 1 · Atención al Cliente por WhatsApp — StetikGO».
 *
 * Toma la maqueta original (automatizacion/n8n/stetikgo-flujo-1.original.json,
 * 26 nodos) y produce el flujo que se ejecuta. Es una transformación y no un
 * pegote: se puede volver a correr sobre el original y sale lo mismo.
 *
 * ---- Por qué no se podía ejecutar ----
 *
 * 1. La única entrada era el disparador de WhatsApp, y en la instancia no hay
 *    ni una credencial de WhatsApp. Sin ella n8n ni siquiera deja publicar el
 *    flujo: al activarlo contesta "Missing required credential: whatsAppApi".
 * 2. Los tres nodos de modelo estaban sin credencial y llamados «[pendiente]».
 * 3. Google Sheets apuntaba a un documento vacío y filtraba por la columna
 *    literal `<__PLACEHOLDER_VALUE__…__>`.
 * 4. La búsqueda usaba el mensaje entero como valor a buscar. «¿Cuánto cuesta
 *    la limpieza facial?» no coincide jamás con una celda que dice «Limpieza
 *    facial profunda». Ese era el error de fondo.
 * 5. Y cuando no coincidía, el nodo no emitía ítem: los cinco nodos que hacen
 *    `$('P04 …').item` morían con "no item found". O sea que preguntar por algo
 *    fuera de catálogo —el caso más probable— tumbaba la ejecución entera, que
 *    era justo lo que P07 estaba diseñado para escalar a un humano.
 * 6. El envío por WhatsApp tenía el mismo literal de relleno en phoneNumberId.
 * 7. El freno humano resume por webhook: se queda esperando para siempre.
 * 8. El salto al Flujo 2 apunta a un workflowId vacío y el Flujo 2 no existe.
 *
 * ---- El canal ahora es el chat nativo de n8n ----
 *
 * WhatsApp exige una credencial de WhatsApp Business que no existe, así que el
 * flujo no podía ni publicarse. Con el Chat Trigger nativo el mismo cerebro
 * —intención, sentimiento, catálogo, validación, escalamiento— funciona hoy,
 * y responde en la ventana de chat en vez de por WhatsApp. El día que haya
 * credencial de WhatsApp se vuelve a poner el nodo de envío al final: nada más
 * del flujo cambia.
 *
 * Eso simplifica la cura. La versión anterior necesitaba un interruptor de
 * modo prueba para saltarse WhatsApp y la hoja de cálculo; con el chat como
 * canal y el catálogo ya creado, ese andamiaje sobra y se retira.
 *
 * ---- El freno humano ----
 *
 * Queda en el flujo pero desactivado. Resume por webhook, y en una
 * conversación de chat eso significa dejar al cliente esperando una respuesta
 * que no llega hasta que Recepción conteste. n8n atraviesa los nodos
 * desactivados dejando pasar los datos, así que el nodo sigue a la vista para
 * cuando exista el canal por el que Recepción recibirá el caso —hoy es una de
 * las notas [pendiente] del propio diseño—. A cambio, el caso escalado ahora
 * sí le dice algo al cliente en vez de dejarlo sin respuesta.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const ORIGEN = process.argv[2] || 'automatizacion/n8n/stetikgo-flujo-1.original.json';
const DESTINO = process.argv[3] || 'automatizacion/n8n/stetikgo-flujo-1.json';

/* Credenciales que ya existen en la instancia. Se eligieron probándolas contra
   el servidor, no por su nombre. */
const CRED_OPENAI = { openAiApi: { id: 'gtyOmS5Jc7CP0skJ', name: 'PoC_Alese' } };
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'MbVZU1NmU2CvAAhz', name: 'Google Sheets account' } };
const CRED_ANTHROPIC = { anthropicApi: { id: '3Uqa61GjBjzOduFo', name: 'LLM BCP' } };

/* Los dos clasificadores no van en OpenAI, y la elección se hizo probando
   contra la instancia, no leyendo nombres de credenciales.

   Con el gpt-5-mini que pedía el diseño el nodo falla siempre con "Model output
   doesn't fit required format": el clasificador exige una respuesta con forma
   exacta y el modelo no la entrega. Con gpt-4.1-mini el fallo se vuelve
   intermitente, que es peor, y ante «quiero reservar una limpieza facial para
   el viernes» respondió «consulta» mientras Gemini y Anthropic respondían
   «reserva».

   Gemini acertó las cuatro primeras pasadas y luego se acabó: la clave devuelve
   429 con "You exceeded your current quota, please check your plan and
   billing details". Eso no es un pico que se absorba reintentando, es una
   cuota agotada, así que tampoco sirve.

   Queda Anthropic, que en el banco de pruebas respondió y clasificó bien.
   Haiku 4.5 es el tamaño adecuado para decidir entre cuatro categorías. Si
   algún día se recarga la clave de Gemini, era la opción más barata: cambiar
   este bloque es todo lo que hace falta.

   La redacción se queda en OpenAI: ahí no hay formato que cumplir, solo texto,
   y no ha fallado ni una vez en las pruebas. */

/* El catálogo, creado en el Drive de la cuenta del proyecto. Las doce filas son
   de ejemplo y el propio título del documento lo dice: hay que reemplazarlas
   por los precios reales antes de que esto atienda a nadie. */
const CATALOGO_ID = '18_DVDoAOecq08zBDrZPVSm_wEtsr-uN5ijDbIATlsXs';
const CATALOGO_URL = `https://docs.google.com/spreadsheets/d/${CATALOGO_ID}/edit`;

/* Los dos clasificadores no van en OpenAI, y no es por gusto.

   Con el gpt-5-mini que pedía el diseño el nodo falla siempre con "Model output
   doesn't fit required format": el clasificador exige una respuesta con forma
   exacta y el modelo no la entrega. Con gpt-4.1-mini el fallo se vuelve
   intermitente, que es peor. En un banco de pruebas con seis combinaciones
   contra la instancia real, ante «quiero reservar una limpieza facial para el
   viernes» OpenAI respondió «consulta» y Gemini y Anthropic «reserva».

   Gemini 2.5 Flash Lite acertó las cuatro pasadas del flujo completo y no falló
   ninguna. La redacción se queda en OpenAI: ahí no hay formato que cumplir. */
const MODELO_CLASIFICADOR = {
  type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
  typeVersion: 1.3,
  parameters: { model: { __rl: true, mode: 'list', value: 'claude-haiku-4-5-20251001', cachedResultName: 'Claude Haiku 4.5' }, options: {} },
  credentials: CRED_ANTHROPIC,
};

const flujo = JSON.parse(readFileSync(ORIGEN, 'utf8'));
const indice = new Map(flujo.nodes.map((n) => [n.name, n]));
const pedir = (nombre) => {
  const n = indice.get(nombre);
  if (!n) throw new Error(`Falta el nodo «${nombre}»; el origen no es la maqueta esperada.`);
  return n;
};

/* El canal dejó de ser WhatsApp, y un nombre que miente sobre el canal se
   cobra su precio la primera vez que alguien busca «el de WhatsApp» y abre
   este. Si prefieres el nombre anterior, es esta línea. */
flujo.name = 'Flujo 1 · Atención al Cliente por Chat — StetikGO';

const CONTEXTO = 'P02 · Recuperar contexto del cliente';
const CATALOGO = 'P04b · Buscar el servicio del mensaje';
const SENTIMIENTO = 'Intención y sentimiento';
const FRENO = 'P08 · Freno humano (Recepción)';
const FLUJO2 = 'P10 · Pasar a Flujo 2 (reserva) [desactivado: el Flujo 2 aún no existe]';

/* ------------------------------------------------------------------ */
/* 1. La entrada: chat nativo en lugar del disparador de WhatsApp.     */
/* ------------------------------------------------------------------ */

/* public + webhook es la misma configuración que ya usan «LucIA Comercial UPC»
   y «LIDIA - Chatbot CRM» en esta instancia: da una URL de chat que se puede
   abrir o incrustar, y un endpoint al que se le puede hablar por HTTP. */
const entradaChat = {
  id: 'p01-chat',
  name: 'P01 · Chat',
  type: '@n8n/n8n-nodes-langchain.chatTrigger',
  typeVersion: 1.4,
  position: [-1056, 192],
  webhookId: 'stetikgo-chat',
  parameters: {
    /* hostedChat en vez de webhook: n8n sirve una página de chat en la propia
       URL, que se puede abrir y usar sin montar nada. El endpoint POST sigue
       siendo el mismo, así que embeber el widget más adelante no obliga a
       cambiar el nodo. Es público: cualquiera con la URL puede escribirle. */
    public: true,
    mode: 'hostedChat',
    options: {
      responseMode: 'lastNode',
      title: 'StetikGO',
      subtitle: 'Atención al cliente',
      initialMessages: 'Hola 👋 Soy el asistente de StetikGO.\n¿En qué te puedo ayudar?',
      inputPlaceholder: 'Escribe tu consulta…',
    },
  },
};

/* ------------------------------------------------------------------ */
/* 2. P02 lee del chat, y sin explotar si viene vacío.                 */
/* ------------------------------------------------------------------ */

const p02 = pedir(CONTEXTO);
p02.position = [-768, 192];
p02.parameters.assignments.assignments = [
  { id: 'a1', name: 'mensaje_texto', value: "={{ $json.chatInput ?? '' }}", type: 'string' },
  /* En chat no hay número de teléfono. El identificador de la conversación es
     lo que permite a Recepción retomar el caso, así que ocupa su lugar. */
  { id: 'a2', name: 'sesion_chat', value: "={{ $json.sessionId ?? '' }}", type: 'string' },
  { id: 'a3', name: 'nombre_contacto', value: 'Visitante del chat', type: 'string' },
  { id: 'a4', name: 'estado_cliente', value: 'Cliente identificado', type: 'string' },
  /* Este texto entra en el prompt de P05 y acaba en boca del bot, así que no
     puede ser una nota interna. Probándolo, a un simple «hola» el bot
     contestaba «Hay información pendiente: sistema/ubicación del listado de
     clientes y nodo de integración». La nota del diseño sigue viajando, en su
     propio campo, donde nadie la va a leer en voz alta. */
  { id: 'a5', name: 'contexto_cliente', value: 'Sin historial: el cliente todavía no está identificado en ningún sistema.', type: 'string' },
  { id: 'a6', name: 'nota_contexto_pendiente', value: '[pendiente: sistema/ubicación del listado de clientes y nodo de integración correspondiente]', type: 'string' },
];

/* ------------------------------------------------------------------ */
/* 3. Los modelos, con credencial y sin «[pendiente]» en el nombre.    */
/* ------------------------------------------------------------------ */

for (const [viejo, nuevo, esClasificador] of [
  ['Modelo LLM · Intención [pendiente]', 'Modelo LLM · Intención', true],
  ['Modelo LLM · Molestia [pendiente]', 'Modelo LLM · Molestia', true],
  ['Modelo LLM · Redacción [pendiente]', 'Modelo LLM · Redacción', false],
]) {
  const n = pedir(viejo);
  n.name = nuevo;
  if (esClasificador) Object.assign(n, MODELO_CLASIFICADOR);
  else n.credentials = CRED_OPENAI;
}

/* Un 429 no puede costar una conversación.

   Probando cinco mensajes seguidos, los dos últimos murieron con "The service
   is receiving too many requests from you": el límite por minuto de la clave de
   Gemini. Sin reintento, ese cliente se queda sin respuesta y la ejecución
   queda en rojo. Con tres intentos separados por dos segundos, el pico se
   absorbe solo. Se aplica a los tres nodos que llaman a un modelo. */
for (const nombre of ['P03 · Interpretar la intención', 'P03b · ¿Existe molestia?', 'P05 · Redactar la respuesta']) {
  Object.assign(pedir(nombre), { retryOnFail: true, maxTries: 3, waitBetweenTries: 2000 });
}

/* ------------------------------------------------------------------ */
/* 4. El catálogo: leer entero y buscar después.                       */
/* ------------------------------------------------------------------ */

/* Se lee el catálogo completo en vez de pedirle a Sheets que filtre. Filtrar
   allí era el error: obligaba a acertar la columna y el valor exacto, y dejaba
   al flujo sin ítem cuando no había coincidencia. */
const leerCatalogo = {
  id: 'p04-sheets',
  name: 'P04 · Leer catálogo 2026',
  type: 'n8n-nodes-base.googleSheets',
  typeVersion: 4.7,
  position: [1248, 288],
  parameters: {
    documentId: { __rl: true, mode: 'list', value: CATALOGO_ID, cachedResultUrl: CATALOGO_URL, cachedResultName: 'StetikGO · Catálogo 2026' },
    /* Se referencia por nombre y no por gid. La importación de un CSV no crea
       la pestaña con gid=0 —esta nació como «Untitled» con gid 313419459— y un
       número no dice nada al abrir el nodo. La pestaña se renombró a «Catálogo
       2026» con la API de Sheets; si alguien la vuelve a renombrar, el nodo
       falla con un mensaje que nombra la pestaña que busca, que es lo que uno
       quiere leer cuando algo se rompe. */
    sheetName: { __rl: true, mode: 'name', value: 'Catálogo 2026' },
    options: {},
  },
  credentials: CRED_SHEETS,
};

const buscarServicio = {
  id: 'p04-buscar',
  name: CATALOGO,
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [1472, 288],
  parameters: {
    jsCode: `/* Busca cuál de los servicios del catálogo aparece en el mensaje.

   Antes esto lo hacía Google Sheets filtrando por el mensaje completo, que no
   coincide nunca. Aquí se compara al revés y con tolerancia: sin tildes, sin
   mayúsculas, y si el nombre completo no aparece, basta con que aparezcan sus
   palabras significativas ("depilacion laser" encuentra "Depilación láser
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

/* La hoja puede llamar a sus columnas como quiera; se aceptan los nombres más
   probables y se comparan sin tildes ni mayúsculas. */
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
  /* Una fila marcada como no activa no se ofrece, aunque siga en la hoja. */
  const activo = columna(fila, ['activo', 'disponible', 'vigente']);
  if (activo && ['no', 'false', '0'].includes(normalizar(activo))) continue;

  const nombre = columna(fila, ['servicio', 'nombre', 'nombre del servicio', 'tratamiento']);
  if (!nombre) continue;

  const nombreNorm = normalizar(nombre);
  let puntaje = 0;

  if (mensaje.includes(nombreNorm)) {
    /* El nombre más largo gana: "limpieza facial profunda" debe pesar más que
       "limpieza facial express" cuando el mensaje trae el nombre completo. */
    puntaje = 100 + nombreNorm.length;
  } else {
    /* Palabras de 4 letras o más: "de", "la", "con" no distinguen nada. */
    const palabras = nombreNorm.split(' ').filter((p) => p.length >= 4);
    const aciertos = palabras.filter((p) => mensaje.includes(p)).length;
    if (palabras.length && aciertos === palabras.length) puntaje = 80 + aciertos;
    else if (aciertos >= 2) puntaje = 50 + aciertos;
  }

  if (puntaje > mejorPuntaje) {
    mejorPuntaje = puntaje;
    encontrada = { fila, nombre };
  }
}

return [{
  json: {
    ...contexto,
    servicio: encontrada ? encontrada.nombre : '',
    duracion: encontrada ? columna(encontrada.fila, ['duracion', 'duración', 'tiempo']) : '',
    precio: encontrada ? columna(encontrada.fila, ['precio', 'costo', 'tarifa', 'valor']) : '',
    encontrado: Boolean(encontrada),
    catalogo_filas: filas.length,
  },
  pairedItem: { item: 0 },
}];`,
  },
};

/* El prompt de la redacción, con el catálogo vacío contemplado.

   Pasaba los campos del catálogo tal cual, y cuando no había servicio el modelo
   se ponía a enumerar lo que faltaba. Ahora recibe una frase en vez de un hueco
   y una instrucción para no recitar campos vacíos ni notas internas. */
const p05 = pedir('P05 · Redactar la respuesta');
/* El «=» inicial no es decorativo: sin él n8n guarda el campo como texto
   literal y el modelo recibe los {{ }} sin evaluar. Al perderlo, el bot le
   contestó a un cliente «Servicio: {{ $('P04b · Buscar el servicio del
   mensaje')... }}». Lo cazó la comprobación de P06a, que es exactamente para
   lo que está. */
p05.parameters.text = [
  '=Eres el asistente de atención al cliente de StetikGO. Responde SOLO con la información entregada.',
  '',
  `Mensaje del cliente: {{ $('${CONTEXTO}').first().json.mensaje_texto }}`,
  `Contexto del cliente: {{ $('${CONTEXTO}').first().json.contexto_cliente }}`,
  `Servicio (catálogo 2026): {{ $('${CATALOGO}').first().json.encontrado ? $('${CATALOGO}').first().json.servicio : 'ninguno identificado en el mensaje' }}`,
  `Duración (catálogo 2026): {{ $('${CATALOGO}').first().json.duracion || 'no aplica' }}`,
  `Precio (catálogo 2026): {{ $('${CATALOGO}').first().json.precio || 'no aplica' }}`,
].join('\n');
p05.parameters.messages.messageValues[0].message = [
  'Usa el tono de marca StetikGO: cercano, profesional y claro. Máximo 4 líneas.',
  'PROHIBIDO inventar servicios, precios, duraciones o cualquier dato que no esté en las entradas.',
  'Si no hay servicio identificado, saluda y pregunta en qué puedes ayudar o qué tratamiento le interesa.',
  'Nunca enumeres los campos que faltan, ni menciones sistemas, integraciones, catálogos ni nada escrito entre corchetes: son notas internas y el cliente no debe verlas.',
  'Si falta información, di simplemente que un asesor lo confirmará. Nunca ofrezcas descuentos ni diagnósticos.',
].join(' ');

/* ------------------------------------------------------------------ */
/* 5. La validación, que rechazaba las respuestas correctas.           */
/* ------------------------------------------------------------------ */

/* P06 comprobaba con dos «contiene» literales que el texto redactado incluyera
   el nombre del servicio y el precio del catálogo. Suena razonable y en la
   práctica rechaza casi todo: el catálogo dice «Depilación láser piernas
   completas» y el modelo escribe «la depilación láser DE piernas completas».
   Un «de» de más, y el caso se deriva a una persona justo cuando el bot había
   acertado. Comprobado en el servidor: respuesta correcta, precio correcto,
   derivada igual.

   Lo que de verdad hay que impedir es que el bot invente un precio. Eso se
   comprueba con los dígitos, que no admiten paráfrasis. Y que hable del
   servicio que se buscó, que se comprueba por palabras y no por la frase
   entera. */
const comprobarRespuesta = {
  id: 'p06-comprobar',
  name: 'P06a · Comprobar que la respuesta se ciñe al catálogo',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [1920, 288],
  parameters: {
    jsCode: `const catalogo = $('${CATALOGO}').first().json;
const texto = String($json.text ?? '');

const normalizar = (t) => String(t ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\\u0300-\\u036f]/g, '')
  .replace(/\\s+/g, ' ')
  .trim();

const textoNorm = normalizar(texto);

let validada = true;
let motivo = '';

if (!catalogo.encontrado) {
  /* No había servicio contra el que contrastar. No es una respuesta inválida:
     es un caso que P07 va a derivar por su cuenta si corresponde. */
  motivo = 'sin servicio en el catálogo que contrastar';
} else {
  /* El precio, por sus dígitos: "S/ 250" y "250 soles" son el mismo número, y
     un precio inventado no coincide de casualidad. */
  const digitos = String(catalogo.precio ?? '').replace(/\\D/g, '');
  const precioCitado = digitos.length > 0 && textoNorm.replace(/\\D/g, '').includes(digitos);

  /* El servicio, por sus palabras significativas: así "depilacion laser de
     piernas completas" sigue siendo "Depilación láser piernas completas". */
  const palabras = normalizar(catalogo.servicio).split(' ').filter((p) => p.length >= 4);
  const servicioCitado = palabras.length > 0 && palabras.every((p) => textoNorm.includes(p));

  validada = precioCitado && servicioCitado;
  if (!precioCitado) motivo = 'la respuesta no cita el precio del catálogo';
  else if (!servicioCitado) motivo = 'la respuesta no habla del servicio que se encontró';
}

return [{ json: { ...$json, validada: validada ? 'si' : 'no', motivo_validacion: motivo }, pairedItem: { item: 0 } }];`,
  },
};

const p06 = pedir('P06 · Validar contra el catálogo');
p06.parameters.conditions.conditions = [{
  id: 'v1',
  leftValue: '={{ $json.validada }}',
  rightValue: 'si',
  operator: { type: 'string', operation: 'equals' },
}];

/* Y P07 deja de mandar a un humano cualquier mensaje sin servicio.

   Su tercera condición era «servicio vacío -> persona». Con eso un «hola» acaba
   en la bandeja de Recepción, porque un saludo no nombra ningún servicio.
   Ahora solo se deriva cuando el cliente preguntaba o quería reservar algo y no
   se encontró: «¿hacen trasplante capilar?» sigue yendo a una persona, que es
   lo correcto, y el saludo lo atiende el bot. */
const p07 = pedir('P07 · ¿Necesita a un humano?');
p07.parameters.conditions.conditions[2] = {
  id: 'h3',
  leftValue: `={{ ['consulta', 'reserva'].includes($('${SENTIMIENTO}').first().json.intencion) && !$('${CATALOGO}').first().json.encontrado ? 'si' : 'no' }}`,
  rightValue: 'si',
  operator: { type: 'string', operation: 'equals' },
};

/* ------------------------------------------------------------------ */
/* 6. Un caso escalado ya no deja al cliente sin respuesta.            */
/* ------------------------------------------------------------------ */

const avisoCliente = {
  id: 'p08-aviso',
  name: 'P08c · Aviso al cliente',
  type: 'n8n-nodes-base.set',
  typeVersion: 3.5,
  position: [3040, 96],
  parameters: {
    assignments: {
      assignments: [
        /* Se sobrescribe `text` a propósito: es el campo que viaja hasta P11 y
           acaba siendo lo que el cliente lee. En una derivación, la redacción
           de P05 no se le muestra, porque es justo la que no se validó. */
        { id: 'e1', name: 'text', value: 'Gracias por escribir a StetikGO. Voy a derivar tu caso a una persona del equipo de Recepción para que lo revise con calma y te responda dentro del horario de atención: lunes a sábado de 9:00 a 20:00.', type: 'string' },
        { id: 'e2', name: 'derivado_a_humano', value: 'true', type: 'string' },
      ],
    },
    includeOtherFields: true,
    options: {},
  },
};

/* ------------------------------------------------------------------ */
/* 7. Los nodos que no pueden funcionar todavía, desactivados.         */
/* ------------------------------------------------------------------ */

/* Resume por webhook: en una conversación de chat deja al cliente esperando
   indefinidamente. Se conserva desactivado —n8n lo atraviesa— para cuando
   exista el canal por el que Recepción recibirá el caso. */
const freno = pedir(FRENO);
freno.disabled = true;
freno.position = [2816, 96];

const flujo2 = pedir('P10 · Pasar a Flujo 2 (reserva)');
flujo2.disabled = true;
flujo2.name = FLUJO2;
flujo2.position = [3040, 400];

/* ------------------------------------------------------------------ */
/* 8. Fuera lo que era de WhatsApp.                                    */
/* ------------------------------------------------------------------ */

const RETIRADOS = [
  'P01 · Recibir mensaje de WhatsApp',
  'P09 · Enviar la respuesta',
  'P04 · Consultar catálogo 2026',
];
flujo.nodes = flujo.nodes.filter((n) => !RETIRADOS.includes(n.name));

/* ------------------------------------------------------------------ */
/* 9. Repuntar referencias.                                            */
/* ------------------------------------------------------------------ */

/* `.item` obliga a n8n a rastrear de qué ítem de entrada viene cada salida, y
   ese rastreo se pierde al pasar por una cadena LLM o un nodo de código. Como
   se atiende un mensaje cada vez, `.first()` dice lo mismo sin poder fallar. */
const sustituciones = [
  [/\$\('P04 · Consultar catálogo 2026'\)\.(item|first\(\))/g, `$('${CATALOGO}').first()`],
  [new RegExp(`\\$\\('${SENTIMIENTO}'\\)\\.item`, 'g'), `$('${SENTIMIENTO}').first()`],
  [new RegExp(`\\$\\('${CONTEXTO}'\\)\\.item`, 'g'), `$('${CONTEXTO}').first()`],
  /* En chat no hay teléfono; el identificador del caso es la sesión. */
  [new RegExp(`\\$\\('${SENTIMIENTO}'\\)\\.first\\(\\)\\.json\\.telefono`, 'g'), `$('${SENTIMIENTO}').first().json.sesion_chat`],
];

const repuntar = (v) => {
  if (typeof v === 'string') return sustituciones.reduce((s, [de, a]) => s.replace(de, a), v);
  if (Array.isArray(v)) return v.map(repuntar);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, repuntar(x)]));
  return v;
};
for (const n of flujo.nodes) n.parameters = repuntar(n.parameters);

/* P11 cierra: es el último nodo, y con responseMode lastNode su salida es lo
   que el chat le muestra al cliente. El campo que la ventana de chat lee es
   `output`. */
const p11 = pedir('P11 · Registrar la interacción');
p11.position = [3264, 288];
p11.parameters.assignments.assignments.push(
  { id: 'l6', name: 'log_sesion', value: `={{ $('${CONTEXTO}').first().json.sesion_chat }}`, type: 'string' },
  { id: 'l7', name: 'output', value: '={{ $json.text }}', type: 'string' },
);

flujo.nodes.push(entradaChat, leerCatalogo, buscarServicio, comprobarRespuesta, avisoCliente);

/* ------------------------------------------------------------------ */
/* 10. Posiciones y cableado.                                           */
/* ------------------------------------------------------------------ */

const POSICIONES = {
  'P05 · Redactar la respuesta': [1696, 288],
  'Modelo LLM · Redacción': [1696, 512],
  'P06 · Validar contra el catálogo': [2144, 288],
  'P07 · ¿Necesita a un humano?': [2368, 176],
  'P08 · Resumen para Recepción': [2592, 96],
  'P10 · ¿El cliente quiere reservar?': [2816, 400],
};
for (const [nombre, pos] of Object.entries(POSICIONES)) {
  const n = flujo.nodes.find((x) => x.name === nombre);
  if (n) n.position = pos;
}

const M = (n) => [{ node: n, type: 'main', index: 0 }];
const IA = (n) => [{ node: n, type: 'ai_languageModel', index: 0 }];

flujo.connections = {
  'P01 · Chat': { main: [M(CONTEXTO)] },
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

  [SENTIMIENTO]: { main: [M('P04 · Leer catálogo 2026')] },
  'P04 · Leer catálogo 2026': { main: [M(CATALOGO)] },
  [CATALOGO]: { main: [M('P05 · Redactar la respuesta')] },

  'P05 · Redactar la respuesta': { main: [M('P06a · Comprobar que la respuesta se ciñe al catálogo')] },
  'P06a · Comprobar que la respuesta se ciñe al catálogo': { main: [M('P06 · Validar contra el catálogo')] },
  'Modelo LLM · Redacción': { ai_languageModel: [IA('P05 · Redactar la respuesta')] },

  'P06 · Validar contra el catálogo': {
    main: [M('P07 · ¿Necesita a un humano?'), M('P08 · Resumen para Recepción')],
  },
  'P07 · ¿Necesita a un humano?': {
    main: [M('P08 · Resumen para Recepción'), M('P10 · ¿El cliente quiere reservar?')],
  },

  'P08 · Resumen para Recepción': { main: [M(FRENO)] },
  [FRENO]: { main: [M('P08c · Aviso al cliente')] },
  'P08c · Aviso al cliente': { main: [M('P11 · Registrar la interacción')] },

  'P10 · ¿El cliente quiere reservar?': { main: [M(FLUJO2), M('P11 · Registrar la interacción')] },
  [FLUJO2]: { main: [M('P11 · Registrar la interacción')] },
};

/* ------------------------------------------------------------------ */

const nombres = new Set(flujo.nodes.map((n) => n.name));
const rotas = [];
for (const [de, tipos] of Object.entries(flujo.connections)) {
  if (!nombres.has(de)) rotas.push(`origen inexistente: ${de}`);
  for (const salidas of Object.values(tipos)) {
    for (const salida of salidas || []) {
      for (const d of salida || []) if (!nombres.has(d.node)) rotas.push(`destino inexistente: ${de} -> ${d.node}`);
    }
  }
}
const alcanzados = new Set(
  Object.values(flujo.connections).flatMap((t) => Object.values(t).flatMap((s) => (s || []).flatMap((l) => (l || []).map((d) => d.node)))),
);
const sueltos = [...nombres].filter((n) => !alcanzados.has(n) && !flujo.connections[n]);
const relleno = (JSON.stringify(flujo).match(/__PLACEHOLDER_VALUE__/g) || []).length;
const pendientes = (JSON.stringify(flujo).match(/\[pendiente:/g) || []).length;

writeFileSync(DESTINO, JSON.stringify(flujo, null, 2));

console.log(`Nodos: ${flujo.nodes.length} (la maqueta tenía 26)`);
console.log(`Conexiones rotas: ${rotas.length ? '\n  ' + rotas.join('\n  ') : 'ninguna'}`);
console.log(`Nodos sueltos: ${sueltos.length ? sueltos.join(', ') : 'ninguno'}`);
console.log(`Desactivados: ${flujo.nodes.filter((n) => n.disabled).map((n) => n.name).join(' · ') || 'ninguno'}`);
console.log(`Literales de relleno: ${relleno} · notas [pendiente] del diseño: ${pendientes}`);
console.log(`Escrito en ${DESTINO}`);
