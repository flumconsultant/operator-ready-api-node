/**
 * Curar el «Flujo 1 · Diagnóstico TRAMMY» para que se pueda ejecutar.
 *
 * Toma la maqueta original (29 nodos) y produce un flujo que corre de punta a
 * punta con datos de prueba. Es una transformación reproducible: se vuelve a
 * correr sobre el original y sale lo mismo.
 *
 * ---- Lo que estaba roto ----
 *
 * No es que faltaran datos: es que el camino feliz estaba cortado en tres
 * sitios y siete nodos no estaban conectados a nada.
 *
 *   · «IF 17 Respuestas Completas» solo tenía cableada la salida falsa. Cuando
 *     las respuestas estaban completas —el caso normal— el flujo se paraba ahí.
 *   · «IF Coherencia» igual: la interpretación coherente no iba a ninguna parte.
 *   · «Send Email» tenía cableada la rama de error y no la de éxito.
 *   · «HTTP · Enviar Respuestas al Backend», «Code TRAMA Index», «HTTP · Mostrar
 *     Resultado» y «Send Email» no tenían entrada. Los dos nodos de error que
 *     los acompañan tampoco.
 *   · «Wait · Revisión Humana» no tenía salida: el caso que llegaba a revisión
 *     se quedaba ahí para siempre aunque el humano contestara.
 *
 * Los dos nodos HTTP, además, tenían los parámetros literalmente vacíos: `{}`.
 * Ni URL ni método.
 *
 * ---- Por qué el flujo no podía arrancar de ninguna manera ----
 *
 * El disparador es un Webhook y el paso siguiente es un nodo Form. En n8n un
 * nodo Form solo funciona dentro de un flujo que empieza con un Form Trigger:
 * detrás de un webhook no tiene dónde dibujarse. Esa pareja no puede funcionar
 * tal cual, y es una decisión de diseño que no me corresponde tomar a mí.
 *
 * ---- Cómo corre ahora ----
 *
 * Se añade una segunda puerta: un disparador manual con las 17 respuestas de
 * ejemplo, que entra directamente en la validación de completitud. Así se
 * recorre toda la lógica propia del flujo —completitud, índice, perfil,
 * interpretación, coherencia, reintentos— sin depender del formulario.
 *
 * Los cuatro sistemas externos que todavía no existen quedan DESACTIVADOS, no
 * borrados. n8n atraviesa un nodo desactivado dejando pasar los datos, así que
 * el flujo corre entero y los nodos siguen a la vista con el motivo escrito en
 * su nombre. El día que existan, se reactivan uno a uno.
 *
 * El único que sí se conecta de verdad es Anthropic, porque su credencial
 * existe y funciona: la interpretación que se prueba es real, no simulada.
 *
 * ---- Lo que no invento ----
 *
 * El TRAMA Index. La fórmula está marcada como pendiente en el propio nodo, y
 * fabricar una sería peor que no tenerla: parecería que el diagnóstico ya está
 * calibrado. El nodo sigue leyendo el índice de su entrada, como haría con la
 * respuesta del backend, y los datos de prueba lo traen igual que lo traería
 * el backend. Cambiando un número en el nodo de prueba se recorre cada uno de
 * los cuatro perfiles.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const ORIGEN = process.argv[2] || 'automatizacion/n8n/trammy-flujo-1.original.json';
const DESTINO = process.argv[3] || 'automatizacion/n8n/trammy-flujo-1.json';

/* La única credencial de Anthropic de la instancia, probada contra el servidor
   en las pruebas del flujo de StetikGO. */
const CRED_ANTHROPIC = { anthropicApi: { id: '3Uqa61GjBjzOduFo', name: 'LLM BCP' } };

const flujo = JSON.parse(readFileSync(ORIGEN, 'utf8'));
const indice = new Map(flujo.nodes.map((n) => [n.name, n]));
const pedir = (nombre) => {
  const n = indice.get(nombre);
  if (!n) throw new Error(`Falta el nodo «${nombre}»; el origen no es la maqueta esperada.`);
  return n;
};

/* ------------------------------------------------------------------ */
/* 1. La puerta de prueba.                                             */
/* ------------------------------------------------------------------ */

const disparadorPrueba = {
  id: 'p00-trigger',
  name: 'Probar con datos de ejemplo',
  type: 'n8n-nodes-base.manualTrigger',
  typeVersion: 1,
  position: [-560, 700],
  parameters: {},
};

const datosPrueba = {
  id: 'p00-datos',
  name: 'Datos de prueba · 17 respuestas',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [-336, 700],
  parameters: {
    jsCode: `/* Cambia TRAMA_INDEX para recorrer cada perfil del Switch:

     0 a 39  -> Supervivencia
    40 a 59  -> En tránsito
    60 a 79  -> En consolidación
    80 a 100 -> En expansión
    null     -> Error Validación · Score inválido

   El índice viene de fuera a propósito. La fórmula del TRAMA Index está
   marcada como pendiente en el propio flujo, así que aquí se entrega igual que
   lo entregaría el backend: como un dato ya calculado. Inventar una fórmula
   daría la falsa impresión de que el diagnóstico está calibrado. */

const TRAMA_INDEX = 65;

const CORREO = 'prueba@ejemplo.com';

/* Diecisiete respuestas en escala 1 a 5. Los textos de las preguntas siguen
   pendientes en el formulario, así que aquí solo importa que estén las
   diecisiete y que no vengan vacías: es exactamente lo que comprueba el nodo
   siguiente. */
const respuestas = {};
const escala = [4, 3, 5, 2, 4, 3, 3, 4, 2, 5, 3, 4, 3, 2, 4, 3, 4];
escala.forEach((valor, i) => {
  respuestas['pregunta_' + (i + 1)] = String(valor);
});

return [{
  json: {
    ...respuestas,
    trama_index: TRAMA_INDEX,
    usuario: 'usuario.prueba',
    email: CORREO,
    es_prueba: true,
  },
  pairedItem: { item: 0 },
}];`,
  },
};

/* ------------------------------------------------------------------ */
/* 2. Los dos nodos HTTP que estaban literalmente vacíos.              */
/* ------------------------------------------------------------------ */

/* Un httpRequest con parámetros {} no tiene ni URL ni método: no es que
   apunte mal, es que no apunta. Se les da una forma válida y un sitio donde
   escribir la URL cuando exista, y se dejan desactivados hasta entonces.

   Y se les baja la versión. Los dos venían como typeVersion 4.5, que esta
   instancia no tiene: al intentar publicar contestaba «Cannot read properties
   of undefined (reading 'execute')», un error que no nombra el nodo ni la
   versión y que se puede perseguir mucho rato. Se localizó publicando cada
   tipo por separado en un flujo mínimo: 4.5 falla, 4.2 pasa, y 4.2 es la que
   usan los otros 55 nodos HTTP de la instancia. */
const VERSION_HTTP = 4.2;
const backend = pedir('HTTP · Enviar Respuestas al Backend');
backend.name = 'HTTP · Enviar Respuestas al Backend [desactivado: falta el endpoint]';
backend.disabled = true;
backend.typeVersion = VERSION_HTTP;
backend.parameters = {
  method: 'POST',
  url: '',
  sendBody: true,
  specifyBody: 'json',
  jsonBody: '={{ JSON.stringify($json) }}',
  options: {},
};

const mostrar = pedir('HTTP · Mostrar Resultado (React)');
mostrar.name = 'HTTP · Mostrar Resultado (React) [desactivado: falta el endpoint]';
mostrar.disabled = true;
mostrar.typeVersion = VERSION_HTTP;
mostrar.parameters = {
  method: 'POST',
  url: '',
  sendBody: true,
  specifyBody: 'json',
  jsonBody: '={{ JSON.stringify($json) }}',
  options: {},
};

/* ------------------------------------------------------------------ */
/* 3. Los sistemas que aún no existen: desactivados, no borrados.      */
/* ------------------------------------------------------------------ */

const supabase = pedir('Supabase · Guardar Diagnóstico');
supabase.name = 'Supabase · Guardar Diagnóstico [desactivado: sin credencial ni tabla]';
supabase.disabled = true;
/* Fuera el literal de relleno que n8n deja y que rompe la ejecución. */
supabase.parameters.tableId = '';
supabase.parameters.fieldsUi.fieldValues = supabase.parameters.fieldsUi.fieldValues.map((f) => ({
  ...f,
  fieldId: f.fieldId.replace(/^\[pendiente: columna (.+)\]$/, '$1'),
}));

const correo = pedir('Send Email · Informe Final');
correo.name = 'Send Email · Informe Final [desactivado: sin credencial SMTP]';
correo.disabled = true;
correo.parameters.fromEmail = '';
correo.parameters.toEmail = '={{ $json.email }}';
correo.parameters.subject = 'Tu diagnóstico TRAMMY';
correo.parameters.html = '[pendiente: plantilla/cuerpo del email con el informe final]';

/* Resume por webhook: en una ejecución de prueba se queda esperando para
   siempre a que alguien revise. Desactivado, n8n lo atraviesa y el caso
   revisado sigue su camino, que es lo que se quiere comprobar. */
const espera = pedir('Wait · Revisión Humana (HITL)');
espera.name = 'Wait · Revisión Humana (HITL) [desactivado: bloquea la prueba]';
espera.disabled = true;

/* ------------------------------------------------------------------ */
/* 4. Anthropic sí puede funcionar: se conecta de verdad.              */
/* ------------------------------------------------------------------ */

const anthropic = pedir('Anthropic · Claude API');
anthropic.credentials = CRED_ANTHROPIC;
anthropic.parameters.modelId = {
  __rl: true,
  mode: 'list',
  value: 'claude-haiku-4-5-20251001',
  cachedResultName: 'Claude Haiku 4.5',
};
anthropic.parameters.options.system = [
  'Eres el motor de interpretación del diagnóstico TRAMMY.',
  'Interpreta únicamente con los datos que recibes. No completes por inferencia nada que no esté.',
  'Si un dato falta, dilo explícitamente en vez de suponerlo.',
  'Responde en español, en menos de 250 palabras, con tres recomendaciones concretas y accionables.',
  '[pendiente: metodología determinística y cognitiva propia de TRAMMY]',
].join(' ');

/* ------------------------------------------------------------------ */
/* 5. Dependencias de nodos que en la prueba no se ejecutan.           */
/* ------------------------------------------------------------------ */

/* «Preparar Interpretación» leía las respuestas con $("Formulario").item.json.
   El formulario no corre en la ruta de prueba —y de hecho no puede correr
   detrás de un webhook—, así que esa expresión reventaba. Las respuestas ya
   viajan en el ítem: se recogen de ahí y el nodo deja de depender de por dónde
   entró la ejecución. */
const preparar = pedir('Preparar Interpretación');
preparar.parameters.assignments.assignments = [
  { id: 'pi-index', name: 'trama_index', value: '={{ $("Code TRAMA Index").first().json.trama_index }}', type: 'number' },
  { id: 'pi-perfil', name: 'perfil', value: '={{ $json.perfil }}', type: 'string' },
  {
    id: 'pi-resp',
    name: 'respuestas',
    value: '={{ Object.fromEntries(Object.entries($json).filter(([clave]) => clave.startsWith("pregunta_"))) }}',
    type: 'object',
  },
];

/* ------------------------------------------------------------------ */
/* 6. El bug que solo se ve ejecutando: null se convertía en cero.     */
/* ------------------------------------------------------------------ */

/* «Code TRAMA Index» deja el índice en null cuando no hay una puntuación
   válida, y hace bien: no fabrica el dato. Pero el Switch compara ese null
   contra «mayor o igual que 0», y null se convierte en 0. Resultado: un
   diagnóstico que no se pudo calcular salía clasificado como Supervivencia,
   el perfil más bajo, y seguía su camino hasta el informe final como si fuera
   un resultado legítimo.
   Comprobado en el servidor: con trama_index null la ejecución terminó en
   «Diagnóstico entregado» pasando por «Perfil · Supervivencia».
   El nodo «Error Validación · Score inválido» estaba puesto para exactamente
   esto y era inalcanzable.

   Cada una de las cuatro reglas exige ahora, además de su rango, que el índice
   sea un número de verdad. Si no lo es, ninguna regla casa y el Switch usa su
   salida de reserva, que es la del error. */
const switchPerfil = pedir('Switch Perfil de Madurez');
const ES_NUMERO = "={{ typeof $json.trama_index === 'number' && Number.isFinite($json.trama_index) ? 'si' : 'no' }}";
switchPerfil.parameters.rules.values = switchPerfil.parameters.rules.values.map((regla, i) => ({
  ...regla,
  conditions: {
    ...regla.conditions,
    conditions: [
      { id: `valido-${i}`, leftValue: ES_NUMERO, rightValue: 'si', operator: { type: 'string', operation: 'equals' } },
      ...regla.conditions.conditions,
    ],
  },
}));

/* ------------------------------------------------------------------ */
/* 7. Un webhook con una ruta de verdad.                               */
/* ------------------------------------------------------------------ */

const webhook = pedir('Webhook Credenciales');
webhook.parameters.path = 'trammy-diagnostico';

/* ------------------------------------------------------------------ */
/* 7. Un final explícito.                                              */
/* ------------------------------------------------------------------ */

const entregado = {
  id: 'fin-ok',
  name: 'Diagnóstico entregado',
  type: 'n8n-nodes-base.noOp',
  typeVersion: 1,
  position: [2400, 300],
  parameters: {},
};

flujo.nodes.push(disparadorPrueba, datosPrueba, entregado);

/* ------------------------------------------------------------------ */
/* 9. El cableado, con los tres cortes reparados.                      */
/* ------------------------------------------------------------------ */

const M = (n) => [{ node: n, type: 'main', index: 0 }];

flujo.connections = {
  'Webhook Credenciales': { main: [M('IF Credenciales Válidas')] },
  'IF Credenciales Válidas': { main: [M('Formulario'), M('Respond · Credenciales Inválidas')] },
  Formulario: { main: [M('IF 17 Respuestas Completas')] },

  'Probar con datos de ejemplo': { main: [M('Datos de prueba · 17 respuestas')] },
  'Datos de prueba · 17 respuestas': { main: [M('IF 17 Respuestas Completas')] },

  /* El corte número uno: la salida verdadera no iba a ninguna parte. */
  'IF 17 Respuestas Completas': {
    main: [M(backend.name), M('Formulario Incompleto · Completar respuestas')],
  },
  [backend.name]: { main: [M('Code TRAMA Index'), M('Error Backend · Sin calcular diagnóstico')] },

  'Code TRAMA Index': { main: [M('Switch Perfil de Madurez')] },
  'Switch Perfil de Madurez': {
    main: [
      M('Perfil · Supervivencia'),
      M('Perfil · En tránsito'),
      M('Perfil · En consolidación'),
      M('Perfil · En expansión'),
      M('Error Validación · Score inválido (sin perfil)'),
    ],
  },
  'Perfil · Supervivencia': { main: [M('Preparar Interpretación')] },
  'Perfil · En tránsito': { main: [M('Preparar Interpretación')] },
  'Perfil · En consolidación': { main: [M('Preparar Interpretación')] },
  'Perfil · En expansión': { main: [M('Preparar Interpretación')] },

  'Preparar Interpretación': { main: [M(supabase.name)] },
  [supabase.name]: { main: [M('Anthropic · Claude API'), M('Error Persistencia · Supabase')] },

  'Anthropic · Claude API': { main: [M('Evaluar Coherencia'), M('Anthropic Error · Marcar Malformado')] },
  'Anthropic Error · Marcar Malformado': { main: [M('Evaluar Coherencia')] },
  'Evaluar Coherencia': { main: [M('IF Coherencia')] },

  /* El corte número dos: una interpretación coherente se perdía. */
  'IF Coherencia': { main: [M(mostrar.name), M('IF Quedan Intentos')] },

  'IF Quedan Intentos': { main: [M('Incrementar Contador Reinterpretación'), M(espera.name)] },
  'Incrementar Contador Reinterpretación': { main: [M('Anthropic · Claude API')] },
  /* El corte número tres: tras la revisión humana no había salida. Vuelve al
     mismo punto que la interpretación aceptada, que es lo que tiene sentido:
     se revisó, se entrega. */
  [espera.name]: { main: [M(mostrar.name)] },

  [mostrar.name]: { main: [M(correo.name), M('Error Render/Entrega · Resultado no mostrado')] },
  [correo.name]: { main: [M('Diagnóstico entregado'), M('Error Envío / Usuario no agenda sesión [pendiente]')] },
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
const disparadores = ['Webhook Credenciales', 'Probar con datos de ejemplo'];
const huerfanos = [...nombres].filter((n) => !alcanzados.has(n) && !disparadores.includes(n));
const sinSalida = [...nombres].filter((n) => !flujo.connections[n]);
const huecos = [];
for (const [de, t] of Object.entries(flujo.connections)) {
  (t.main || []).forEach((s, i) => { if (!s || !s.length) huecos.push(`${de} salida[${i}]`); });
}

for (const n of flujo.nodes.filter((x) => x.type === 'n8n-nodes-base.code')) {
  try {
    new Function('$input', '$json', '$runIndex', '$', n.parameters.jsCode);
  } catch (error) {
    console.error(`El nodo «${n.name}» no compila: ${error.message}`);
    process.exit(1);
  }
  const control = [...n.parameters.jsCode].find((c) => c.charCodeAt(0) < 32 && !'\n\t'.includes(c));
  if (control) {
    console.error(`El nodo «${n.name}» tiene un carácter de control (${control.charCodeAt(0)}).`);
    process.exit(1);
  }
}

writeFileSync(DESTINO, JSON.stringify(flujo, null, 2));

console.log(`Nodos: ${flujo.nodes.length} (la maqueta tenía 29)`);
console.log(`Conexiones rotas: ${rotas.length ? '\n  ' + rotas.join('\n  ') : 'ninguna'}`);
console.log(`Nodos huérfanos: ${huerfanos.length ? huerfanos.join(', ') : 'ninguno'}`);
console.log(`Salidas de IF/Switch sin conectar: ${huecos.length ? huecos.join(', ') : 'ninguna'}`);
console.log(`Sin salida (finales): ${sinSalida.join(' · ')}`);
console.log(`Desactivados: ${flujo.nodes.filter((n) => n.disabled).map((n) => n.name.replace(/ \[.*/, '')).join(' · ')}`);
console.log(`Literales de relleno: ${(JSON.stringify(flujo).match(/__PLACEHOLDER_VALUE__/g) || []).length}`);
console.log(`Escrito en ${DESTINO}`);
