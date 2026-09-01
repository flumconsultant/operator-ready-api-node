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
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'MbVZU1NmU2CvAAhz', name: 'Google Sheets account' } };

/* Todo lo que alguien va a querer cambiar sin abrir n8n vive aquí: las
   preguntas, los rangos de cada perfil y los textos de las pantallas. El flujo
   lo lee en cada ejecución, así que editar la hoja basta: no hay que volver a
   publicar nada. */
/* Atajo: media docena de nodos leen la configuración desde este mismo sitio. */
const CFG = "$('Preparar configuración').first().json";

const CONFIG_ID = '1OwVs_MVP8IbZSXcjKhUScHyVEXDTx1RIYeJuWucrRgk';
const CONFIG_URL = `https://docs.google.com/spreadsheets/d/${CONFIG_ID}/edit`;
const documentoConfig = { __rl: true, mode: 'list', value: CONFIG_ID, cachedResultUrl: CONFIG_URL, cachedResultName: 'TRAMMY · Configuración' };
const pestana = (nombre) => ({ __rl: true, mode: 'name', value: nombre });

/* Se lee por HTTP y no con el nodo de Google Sheets, y esto costó encontrarlo.

   Con un nodo de Google Sheets en el camino previo a una página de formulario,
   la página de espera NO SE PINTA: un GET a su URL se queda colgado
   indefinidamente y quien rellena el formulario vería un spinner eterno. Se
   acotó por bisección contra el servidor: sin la cadena de configuración la
   página tarda 0,37 s; con un solo nodo de Sheets delante, más de 20 s sin
   devolver un byte; y con un Code que devuelve los mismos diecisiete ítems,
   0,43 s. No es el volumen de datos ni el executeOnce: es ese nodo.

   La misma lectura con un HTTP Request contra la API de Sheets, con la misma
   credencial, tarda 0,38 s y la página sale con las preguntas de la hoja
   dentro. De paso, batchGet trae las tres pestañas en una sola llamada. */
const rango = (hoja, hasta) => `ranges=${encodeURIComponent(hoja)}!A1:${hasta}`;
const leerConfig = {
  id: 'cfg-leer',
  name: 'Config · Leer la hoja',
  type: 'n8n-nodes-base.httpRequest',
  typeVersion: 4.2,
  position: [-224, 300],
  parameters: {
    url: `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG_ID}/values:batchGet?${rango('Preguntas', 'F500')}&${rango('Perfiles', 'D100')}&${rango('Textos', 'B200')}`,
    authentication: 'predefinedCredentialType',
    nodeCredentialType: 'googleSheetsOAuth2Api',
    options: {},
  },
  credentials: CRED_SHEETS,
};

const flujo = JSON.parse(readFileSync(ORIGEN, 'utf8'));
const indice = new Map(flujo.nodes.map((n) => [n.name, n]));
const pedir = (nombre) => {
  const n = indice.get(nombre);
  if (!n) throw new Error(`Falta el nodo «${nombre}»; el origen no es la maqueta esperada.`);
  return n;
};

/* ------------------------------------------------------------------ */
/* 1. El formulario: dos páginas y cuatro finales.                     */
/* ------------------------------------------------------------------ */

const disparadorFormulario = {
  id: 'form-trigger',
  name: 'Form Trigger · Credenciales',
  type: 'n8n-nodes-base.formTrigger',
  typeVersion: 2.6,
  position: [-560, 300],
  webhookId: 'trammy-diagnostico',
  parameters: {
    path: 'trammy-diagnostico',
    formTitle: 'Diagnóstico TRAMMY',
    formDescription: 'Accede con tus credenciales para empezar el diagnóstico.',
    formFields: {
      values: [
        { fieldLabel: 'Usuario', fieldName: 'usuario', requiredField: true },
        { fieldLabel: 'Contraseña', fieldName: 'password', fieldType: 'password', requiredField: true },
      ],
    },
    options: {},
  },
};

/* Una sola página de cierre, y cada final le entrega su texto.

   El primer intento fueron cuatro nodos de cierre, uno por final. Se cayó al
   probar la ruta de datos de ejemplo: un nodo Form falla con «Form Trigger node
   must be set before this node» cuando la ejecución no vino de un formulario, y
   marcarlo como tolerante a errores no lo evita —el fallo ocurre antes de que
   eso cuente—. La ejecución entera salía en rojo aunque todo lo demás hubiera
   ido bien.

   Consolidar arregla las dos cosas a la vez. Cada final se convierte en un Set
   que lleva su título y su mensaje, todos desembocan en un único IF, y ese IF
   decide: si la ejecución vino del formulario, se pinta la página; si vino del
   disparador manual, termina en un nodo mudo. Un solo sitio que dibuja la
   pantalla final, y ningún andamio repetido cuatro veces. */

const mensaje = (id, nombre, posicion, titulo, texto) => ({
  id,
  name: nombre,
  type: 'n8n-nodes-base.set',
  typeVersion: 3.5,
  position: posicion,
  parameters: {
    assignments: {
      assignments: [
        { id: `${id}-t`, name: 'pantalla_titulo', value: titulo, type: 'string' },
        { id: `${id}-m`, name: 'pantalla_mensaje', value: texto, type: 'string' },
      ],
    },
    includeOtherFields: true,
    options: {},
  },
});

const mensajeCredenciales = mensaje('msj-cred', 'Mensaje · Credenciales inválidas', [-336, 540],
  `={{ $('Preparar configuración').first().json.textos.pantalla_credenciales_titulo }}`,
  `={{ $('Preparar configuración').first().json.textos.pantalla_credenciales_mensaje }}`);

const mensajeIncompleto = mensaje('msj-incompleto', 'Mensaje · Faltan respuestas', [560, 620],
  `={{ $('Preparar configuración').first().json.textos.pantalla_incompleto_titulo }}`,
  `={{ $('Preparar configuración').first().json.textos.pantalla_incompleto_mensaje }}`);

const mensajeError = mensaje('msj-error', 'Mensaje · No se pudo completar', [2400, 720],
  `={{ $('Preparar configuración').first().json.textos.pantalla_error_titulo }}`,
  `={{ $('Preparar configuración').first().json.textos.pantalla_error_mensaje }}`);

const mensajeDiagnostico = mensaje('msj-ok', 'Mensaje · Diagnóstico listo', [2400, 300],
  `={{ $('Preparar configuración').first().json.textos.pantalla_ok_titulo }}`,
  "=Perfil: {{ $('Asignar perfil').first().json.perfil }} · TRAMA Index: {{ $('Preparar Interpretación').first().json.trama_index }}{{ $('Preparar Interpretación').first().json.trama_index_provisional ? ' (PROVISIONAL — pendiente de la fórmula real)' : '' }}\n\n{{ $('Evaluar Coherencia').first().json.recomendaciones }}");

/* El desvío. En una ejecución con datos de ejemplo no hay formulario al que
   responder, así que se termina en un nodo mudo en vez de en una página. */
const desvioPantalla = {
  id: 'if-pantalla',
  name: '¿Vino del formulario?',
  type: 'n8n-nodes-base.if',
  typeVersion: 2.2,
  position: [2624, 460],
  parameters: {
    conditions: {
      options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
      combinator: 'and',
      conditions: [{
        id: 'del-formulario',
        leftValue: "={{ $json.es_prueba ? 'no' : 'si' }}",
        rightValue: 'si',
        operator: { type: 'string', operation: 'equals' },
      }],
    },
    options: {},
  },
};

const paginaFinal = {
  id: 'form-final',
  name: 'Form · Página final',
  type: 'n8n-nodes-base.form',
  typeVersion: 2.5,
  position: [2848, 380],
  parameters: {
    operation: 'completion',
    respondWith: 'text',
    completionTitle: '={{ $json.pantalla_titulo }}',
    completionMessage: '={{ $json.pantalla_mensaje }}',
    options: {},
  },
};

const finPrueba = {
  id: 'fin-prueba',
  name: 'Fin de la prueba',
  type: 'n8n-nodes-base.noOp',
  typeVersion: 1,
  position: [2848, 560],
  parameters: {},
};

/* 1b. La configuración, leída en cada ejecución.                      */
/* ------------------------------------------------------------------ */

/* Las tres pestañas llegan como listas de filas y por caminos distintos: la de
   preguntas trae diecisiete ítems, y sin executeOnce en las dos siguientes cada
   una se ejecutaría diecisiete veces. Aquí se juntan en un único ítem con la
   forma que necesita el resto del flujo.

   Este nodo es además el que sabe por dónde entró la ejecución. Referenciar un
   nodo que no se ejecutó lanza una excepción, y eso mismo sirve de respuesta:
   si «Datos de prueba» existe, esto es una prueba; si no, vino del formulario. */
const prepararConfig = {
  id: 'cfg-prep',
  name: 'Preparar configuración',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [336, 300],
  parameters: {
    jsCode: [
      "const normaliza = (t) => String(t ?? '').trim();",
      "const esNo = (t) => ['no', 'false', '0'].includes(normaliza(t).toLowerCase());",
      '',
      '/* batchGet devuelve un bloque por pestaña, en el mismo orden en que se',
      '   pidieron, y cada uno como matriz de filas con la cabecera primero. Se',
      '   convierte a objetos para no depender del orden de las columnas: quien',
      '   edite la hoja puede moverlas. */',
      "const bloques = $('Config · Leer la hoja').first().json.valueRanges || [];",
      'const aObjetos = (bloque) => {',
      '  const filas = (bloque && bloque.values) || [];',
      '  const cabecera = (filas[0] || []).map((c) => normaliza(c));',
      '  return filas.slice(1).map((f) => Object.fromEntries(cabecera.map((c, i) => [c, f[i]])));',
      '};',
      '',
      'const filasPreguntas = aObjetos(bloques[0]);',
      'const filasPerfiles = aObjetos(bloques[1]);',
      'const filasTextos = aObjetos(bloques[2]);',
      '',
      'const preguntas = filasPreguntas',
      '  .filter((f) => !esNo(f.activa) && normaliza(f.id))',
      '  .map((f) => ({',
      '    id: normaliza(f.id),',
      '    texto: normaliza(f.pregunta) || normaliza(f.id),',
      "    tipo: normaliza(f.tipo) || 'dropdown',",
      "    opciones: normaliza(f.opciones).split('|').map((o) => o.trim()).filter(Boolean),",
      '    obligatoria: !esNo(f.obligatoria),',
      '  }));',
      '',
      '/* La forma exacta que el nodo Form espera cuando se le definen los campos',
      '   desde JSON. Un desplegable sin opciones no se puede pintar, así que si la',
      '   hoja no las trae, ese campo pasa a texto libre. */',
      'const camposFormulario = preguntas.map((p) => {',
      '  const campo = { fieldLabel: p.texto, fieldName: p.id, requiredField: p.obligatoria };',
      "  if (p.tipo === 'dropdown' && p.opciones.length) {",
      "    campo.fieldType = 'dropdown';",
      '    campo.fieldOptions = { values: p.opciones.map((o) => ({ option: o })) };',
      '  } else {',
      "    campo.fieldType = p.tipo === 'dropdown' ? 'text' : p.tipo;",
      '  }',
      '  return campo;',
      '});',
      '',
      'const perfiles = filasPerfiles',
      '  .map((f) => ({',
      '    perfil: normaliza(f.perfil),',
      '    min: Number(f.min),',
      '    max: Number(f.max),',
      '    descripcion: normaliza(f.descripcion),',
      '  }))',
      '  .filter((p) => p.perfil && Number.isFinite(p.min) && Number.isFinite(p.max))',
      '  .sort((a, b) => a.min - b.min);',
      '',
      'const textos = {};',
      'for (const f of filasTextos) {',
      '  const clave = normaliza(f.clave);',
      "  if (clave) textos[clave] = String(f.valor ?? '');",
      '}',
      '',
      '/* Referenciar un nodo que no se ejecutó lanza una excepción, y eso mismo',
      '   sirve de respuesta: si «Datos de prueba» existe, esto es una prueba. */',
      'let entrada = {};',
      'let esPrueba = false;',
      'try {',
      "  entrada = { ...$('Datos de prueba').first().json };",
      '  esPrueba = true;',
      '} catch (e) {',
      "  entrada = { ...$('Form Trigger · Credenciales').first().json };",
      '}',
      '',
      '/* En una prueba las respuestas se fabrican aquí, que es el único sitio que',
      '   sabe cuántas preguntas hay configuradas y cómo se llaman: si mañana son',
      '   veinte, la prueba sigue estando completa sin tocar nada. */',
      'if (esPrueba) {',
      '  const patron = [4, 3, 5, 2, 4, 3, 3, 4, 2, 5, 3, 4, 3, 2, 4, 3, 4];',
      '  preguntas.forEach((p, i) => {',
      '    entrada[p.id] = String(patron[i % patron.length]);',
      '  });',
      '  if (entrada.omitir_una && preguntas.length) entrada[preguntas[0].id] = "";',
      '}',
      '',
      'return [{',
      '  json: {',
      '    ...entrada,',
      '    es_prueba: esPrueba,',
      '    preguntas,',
      '    perfiles,',
      '    textos,',
      '    preguntas_json: JSON.stringify(camposFormulario),',
      '  },',
      '  pairedItem: { item: 0 },',
      '}];',
    ].join('\n'),
  },
};

/* Un IF para separar las dos entradas después de la configuración: por el
   formulario hay credenciales que validar y preguntas que pintar; por la prueba
   las respuestas ya vienen puestas. */
const desvioEntrada = {
  id: 'if-entrada',
  name: '¿Entró por el formulario?',
  type: 'n8n-nodes-base.if',
  typeVersion: 2.2,
  position: [560, 300],
  parameters: {
    conditions: {
      options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
      combinator: 'and',
      conditions: [{
        id: 'por-formulario',
        leftValue: "={{ $json.es_prueba ? 'no' : 'si' }}",
        rightValue: 'si',
        operator: { type: 'string', operation: 'equals' },
      }],
    },
    options: {},
  },
};

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* 2. La puerta de prueba.                                             */
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
  name: 'Datos de prueba',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [-560, 520],
  parameters: {
    jsCode: `/* Aquí solo se elige el escenario. Las respuestas las rellena «Preparar
   configuración», que es el único que sabe cuántas preguntas hay en la hoja y
   cómo se llaman: si mañana son veinte, la prueba sigue completa sola.

   TRAMA_INDEX recorre los perfiles definidos en la pestaña Perfiles:

     null -> sin índice; con el cálculo provisional activo se calcula solo,
             y con él apagado se va al error de validación.

   OMITIR_UNA a true deja una respuesta en blanco para probar el camino de
   «faltan respuestas». */

const TRAMA_INDEX = 65;
const OMITIR_UNA = false;
const CORREO = 'prueba@ejemplo.com';

return [{
  json: {
    trama_index: TRAMA_INDEX,
    omitir_una: OMITIR_UNA,
    usuario: 'usuario.prueba',
    email: CORREO,
  },
  pairedItem: { item: 0 },
}];`,
  },
};

/* ------------------------------------------------------------------ */
/* 3. Los dos nodos HTTP que estaban literalmente vacíos.              */
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
/* 4. Los sistemas que aún no existen: desactivados, no borrados.      */
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
/* 4a. El perfil sale de la hoja, no de un Switch con rangos escritos. */
/* ------------------------------------------------------------------ */

/* El Switch tenía los cuatro rangos escritos dentro, uno por salida, y cada
   salida colgaba de un Set con el nombre del perfil: cinco nodos para algo que
   es mirar en qué tramo cae un número. Cambiar un rango obligaba a abrir el
   editor, y añadir un quinto perfil, a rehacer el cableado.

   Ahora los tramos viven en la pestaña Perfiles y esto solo los consulta. Un
   perfil nuevo es una fila nueva. */
const asignarPerfil = {
  id: 'asignar-perfil',
  name: 'Asignar perfil',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [1240, 300],
  parameters: {
    jsCode: [
      'const j = $input.first().json || {};',
      "const perfiles = $('Preparar configuración').first().json.perfiles || [];",
      '',
      'const indice = j.trama_index;',
      'const valido = typeof indice === "number" && Number.isFinite(indice);',
      '',
      'const encontrado = valido',
      '  ? perfiles.find((p) => indice >= p.min && indice <= p.max)',
      '  : null;',
      '',
      'return [{',
      '  json: {',
      '    ...j,',
      '    perfil: encontrado ? encontrado.perfil : null,',
      '    perfil_descripcion: encontrado ? encontrado.descripcion : "",',
      '    motivo_sin_perfil: valido',
      '      ? (encontrado ? "" : "El índice " + indice + " no cae en ningún tramo de la pestaña Perfiles.")',
      '      : "No hay un TRAMA Index numérico que clasificar.",',
      '  },',
      '  pairedItem: { item: 0 },',
      '}];',
    ].join('\n'),
  },
};

const perfilAsignado = {
  id: 'if-perfil',
  name: '¿Perfil asignado?',
  type: 'n8n-nodes-base.if',
  typeVersion: 2.2,
  position: [1464, 300],
  parameters: {
    conditions: {
      options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
      combinator: 'and',
      conditions: [{
        id: 'hay-perfil',
        leftValue: "={{ $json.perfil ? 'si' : 'no' }}",
        rightValue: 'si',
        operator: { type: 'string', operation: 'equals' },
      }],
    },
    options: {},
  },
};

/* ------------------------------------------------------------------ */
/* 4b. Un índice provisional para poder probar el formulario.          */
/* ------------------------------------------------------------------ */

/* El índice lo calcula el backend, que todavía no existe. Por el formulario
   real, entonces, no llega ninguno y toda ejecución acaba en el error de
   validación: correcto, y también inservible para probar nada. Comprobado
   contra el servidor: rellenando el formulario entero, la ejecución terminó en
   «Error Validación · Score inválido».

   Así que el nodo calcula uno provisional cuando no le llega ninguno: la media
   de las diecisiete respuestas llevada a una escala de 0 a 100. NO es la
   metodología TRAMA, es una regla de tres para que el Switch tenga algo que
   clasificar. Por eso viaja marcado, y la marca aparece en el prompt de la
   interpretación y en la pantalla final, donde alguien podría creerse el
   número.

   Lo que venga del backend manda siempre sobre esto. Y poniendo
   CALCULO_PROVISIONAL en false, el nodo vuelve a comportarse como se diseñó. */
const codigoIndice = pedir('Code TRAMA Index');
codigoIndice.parameters.jsCode = [
  '/* Ponlo en false cuando el backend entregue el TRAMA Index real: el flujo',
  '   volverá a mandar al error de validación cualquier diagnóstico sin índice. */',
  'const CALCULO_PROVISIONAL = true;',
  '',
  'const j = $input.first().json || {};',
  '',
  '/* Lo que venga del backend (o de los datos de prueba) manda siempre. */',
  'let indice = typeof j.trama_index === "number" ? j.trama_index',
  '  : (typeof j.score === "number" ? j.score : null);',
  'if (indice !== null && !Number.isFinite(indice)) indice = null;',
  '',
  'let provisional = false;',
  '',
  'if (indice === null && CALCULO_PROVISIONAL) {',
  '  const notas = Object.keys(j)',
  '    .filter((k) => /^pregunta_\\d+$/.test(k))',
  '    .map((k) => Number(j[k]))',
  '    .filter((n) => Number.isFinite(n));',
  '',
  '  if (notas.length) {',
  '    const media = notas.reduce((a, b) => a + b, 0) / notas.length;',
  '    indice = Math.round(((media - 1) / 4) * 100);',
  '    provisional = true;',
  '  }',
  '}',
  '',
  'return [{',
  '  json: {',
  '    ...j,',
  '    trama_index: indice,',
  '    trama_index_provisional: provisional,',
  '    calculo_pendiente: indice === null,',
  '    nota_calculo: provisional',
  '      ? "PROVISIONAL: media de las respuestas en escala 0-100. No es la formula TRAMA. [pendiente: formula, dimensiones y ponderaciones reales]"',
  '      : "[pendiente: formula, dimensiones y ponderaciones del TRAMA Index]",',
  '  },',
  '  pairedItem: { item: 0 },',
  '}];',
].join('\n');

const AVISO_PROVISIONAL = "{{ $('Preparar Interpretación').first().json.trama_index_provisional ? 'AVISO: el TRAMA Index es provisional (media de las respuestas), no el calculado por la metodología. Dilo explícitamente en tu respuesta.' : '' }}";

/* «Evaluar Coherencia» construye un objeto nuevo y tira el resto del ítem, así
   que la marca de ejecución de prueba se perdía justo antes de llegar al IF que
   la necesita. Se arrastra explícitamente. */
const coherencia = pedir('Evaluar Coherencia');
coherencia.parameters.jsCode = coherencia.parameters.jsCode.replace(
  'out.push({ json: {',
  'out.push({ json: {\n    es_prueba: j.es_prueba === true || $(\'Preparar Interpretación\').first().json.es_prueba === true,',
);

/* ------------------------------------------------------------------ */
/* 5. Anthropic sí puede funcionar: se conecta de verdad.              */
/* ------------------------------------------------------------------ */

const anthropic = pedir('Anthropic · Claude API');
anthropic.credentials = CRED_ANTHROPIC;
anthropic.parameters.modelId = {
  __rl: true,
  mode: 'list',
  value: 'claude-haiku-4-5-20251001',
  cachedResultName: 'Claude Haiku 4.5',
};
anthropic.parameters.messages.values[0].content += ` ${AVISO_PROVISIONAL}`;
/* El prompt vive en la pestaña Textos, clave prompt_sistema: es lo que más se
   va a reescribir mientras se afina la metodología, y no debería hacer falta
   abrir n8n para tocarlo. */
anthropic.parameters.options.system = `={{ $('Preparar configuración').first().json.textos.prompt_sistema }}`;

/* ------------------------------------------------------------------ */
/* 6. Dependencias de nodos que en la prueba no se ejecutan.           */
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
  { id: 'pi-desc', name: 'perfil_descripcion', value: '={{ $json.perfil_descripcion }}', type: 'string' },
  { id: 'pi-prov', name: 'trama_index_provisional', value: '={{ $("Code TRAMA Index").first().json.trama_index_provisional }}', type: 'boolean' },
  {
    id: 'pi-resp',
    name: 'respuestas',
    value: '={{ Object.fromEntries(Object.entries($json).filter(([clave]) => clave.startsWith("pregunta_"))) }}',
    type: 'object',
  },
];

/* ------------------------------------------------------------------ */
/* 7. El bug que solo se ve ejecutando: null se convertía en cero.     */
/* ------------------------------------------------------------------ */

/* Merece quedar escrito porque la cura vino por otro lado. El Switch original
   comparaba el índice contra «mayor o igual que 0», y cuando «Code TRAMA Index»
   dejaba el índice en null —que es lo correcto: no fabrica el dato— null se
   convertía en cero. Un diagnóstico que no se pudo calcular salía clasificado
   como Supervivencia, el perfil más bajo, y llegaba hasta el informe final como
   un resultado legítimo. Comprobado en el servidor.

   «Asignar perfil» no puede repetirlo: exige un número finito antes de buscar
   tramo, y si no lo hay devuelve perfil null con el motivo escrito. El nodo de
   error de validación, que estaba puesto para esto y era inalcanzable, ahora se
   alcanza. */

/* ------------------------------------------------------------------ */
/* 8. El formulario de diecisiete preguntas, ya rellenable.          */
/* ------------------------------------------------------------------ */

const formulario = pedir('Formulario');
formulario.parameters = {
  /* Los campos ya no viven en el nodo: se los da la hoja. Comprobado contra el
     servidor antes de montarlo — un nodo Form con defineForm en json acepta una
     expresión y devuelve las respuestas con el fieldName y el tipo que se le
     pidieron. */
  defineForm: 'json',
  /* $json y no $('Preparar configuración'): al pintar la página de espera, n8n
     no resuelve las referencias a otros nodos y la petición se queda colgada
     —el navegador de quien rellena el formulario vería un spinner eterno—.
     Comprobado: con la referencia cruzada, un GET a la página de espera no
     devolvía nada en treinta segundos; con $json, se pinta en menos de medio.
     El dato ya viaja en el ítem, así que no hace falta ir a buscarlo. */
  jsonOutput: '={{ $json.preguntas_json }}',
  options: {},
};

/* El IF leía $json.body.usuario, que era lo correcto para un webhook. Un Form
   Trigger entrega los campos en la raíz, con el fieldName que se les dio. */
/* Comprobaba diecisiete campos con diecisiete condiciones escritas a mano. Si
   la hoja pasa a tener dieciocho preguntas, esa comprobación se queda corta sin
   avisar. Ahora recorre las que haya configuradas. */
const ifCompletas = pedir('IF 17 Respuestas Completas');
ifCompletas.name = 'IF · ¿Respuestas completas?';
ifCompletas.parameters.conditions.conditions = [{
  id: 'todas-contestadas',
  leftValue: `={{ ${CFG}.preguntas.filter((p) => p.obligatoria).every((p) => String($json[p.id] ?? '').trim() !== '') ? 'si' : 'no' }}`,
  rightValue: 'si',
  operator: { type: 'string', operation: 'equals' },
}];

const ifCredenciales = pedir('IF Credenciales Válidas');
ifCredenciales.parameters.conditions.conditions[0].leftValue = '={{ $json.usuario }}';
ifCredenciales.parameters.conditions.conditions[1].leftValue = '={{ $json.password }}';

/* ------------------------------------------------------------------ */
/* 9. Un final explícito.                                              */
/* ------------------------------------------------------------------ */

const entregado = {
  id: 'fin-ok',
  name: 'Diagnóstico entregado',
  type: 'n8n-nodes-base.noOp',
  typeVersion: 1,
  position: [2400, 300],
  parameters: {},
};

/* Fuera el webhook y su respuesta: en un flujo de formulario no tienen a quién
   responder. */
flujo.nodes = flujo.nodes.filter((n) => ![
  'Webhook Credenciales',
  'Respond · Credenciales Inválidas',
  /* El Switch y sus cuatro Set los reemplaza «Asignar perfil», que lee los
     tramos de la hoja en vez de tenerlos escritos dentro. */
  'Switch Perfil de Madurez',
  'Perfil · Supervivencia',
  'Perfil · En tránsito',
  'Perfil · En consolidación',
  'Perfil · En expansión',
].includes(n.name));

flujo.nodes.push(
  disparadorFormulario, disparadorPrueba, datosPrueba, entregado,
  leerConfig, prepararConfig, desvioEntrada,
  asignarPerfil, perfilAsignado,
  mensajeCredenciales, mensajeIncompleto, mensajeError, mensajeDiagnostico,
  desvioPantalla, paginaFinal, finPrueba,
);

/* ------------------------------------------------------------------ */
/* 10. El cableado, con los tres cortes reparados.                      */
/* ------------------------------------------------------------------ */

const M = (n) => [{ node: n, type: 'main', index: 0 }];

flujo.connections = {
  /* Las dos puertas entran por el mismo sitio: primero se lee la configuración
     y solo después se separan los caminos. Así la prueba usa exactamente la
     misma configuración que el formulario. */
  'Form Trigger · Credenciales': { main: [M('Config · Leer la hoja')] },
  'Probar con datos de ejemplo': { main: [M('Datos de prueba')] },
  'Datos de prueba': { main: [M('Config · Leer la hoja')] },

  'Config · Leer la hoja': { main: [M('Preparar configuración')] },
  'Preparar configuración': { main: [M('¿Entró por el formulario?')] },
  '¿Entró por el formulario?': { main: [M('IF Credenciales Válidas'), M('IF · ¿Respuestas completas?')] },

  'IF Credenciales Válidas': { main: [M('Formulario'), M('Mensaje · Credenciales inválidas')] },
  Formulario: { main: [M('IF · ¿Respuestas completas?')] },

  'IF · ¿Respuestas completas?': {
    main: [M(backend.name), M('Formulario Incompleto · Completar respuestas')],
  },
  [backend.name]: { main: [M('Code TRAMA Index'), M('Error Backend · Sin calcular diagnóstico')] },

  'Code TRAMA Index': { main: [M('Asignar perfil')] },
  'Asignar perfil': { main: [M('¿Perfil asignado?')] },
  '¿Perfil asignado?': {
    main: [M('Preparar Interpretación'), M('Error Validación · Score inválido (sin perfil)')],
  },

  'Preparar Interpretación': { main: [M(supabase.name)] },
  [supabase.name]: { main: [M('Anthropic · Claude API'), M('Error Persistencia · Supabase')] },

  'Anthropic · Claude API': { main: [M('Evaluar Coherencia'), M('Anthropic Error · Marcar Malformado')] },
  'Anthropic Error · Marcar Malformado': { main: [M('Evaluar Coherencia')] },
  'Evaluar Coherencia': { main: [M('IF Coherencia')] },
  'IF Coherencia': { main: [M(mostrar.name), M('IF Quedan Intentos')] },

  'IF Quedan Intentos': { main: [M('Incrementar Contador Reinterpretación'), M(espera.name)] },
  'Incrementar Contador Reinterpretación': { main: [M('Anthropic · Claude API')] },
  [espera.name]: { main: [M(mostrar.name)] },

  [mostrar.name]: { main: [M(correo.name), M('Error Render/Entrega · Resultado no mostrado')] },
  [correo.name]: { main: [M('Diagnóstico entregado'), M('Error Envío / Usuario no agenda sesión [pendiente]')] },
  'Diagnóstico entregado': { main: [M('Mensaje · Diagnóstico listo')] },
  'Error Envío / Usuario no agenda sesión [pendiente]': { main: [M('Mensaje · Diagnóstico listo')] },

  'Formulario Incompleto · Completar respuestas': { main: [M('Mensaje · Faltan respuestas')] },
  'Error Validación · Score inválido (sin perfil)': { main: [M('Mensaje · No se pudo completar')] },
  'Error Backend · Sin calcular diagnóstico': { main: [M('Mensaje · No se pudo completar')] },
  'Error Persistencia · Supabase': { main: [M('Mensaje · No se pudo completar')] },
  'Error Render/Entrega · Resultado no mostrado': { main: [M('Mensaje · No se pudo completar')] },

  'Mensaje · Credenciales inválidas': { main: [M('¿Vino del formulario?')] },
  'Mensaje · Faltan respuestas': { main: [M('¿Vino del formulario?')] },
  'Mensaje · No se pudo completar': { main: [M('¿Vino del formulario?')] },
  'Mensaje · Diagnóstico listo': { main: [M('¿Vino del formulario?')] },
  '¿Vino del formulario?': { main: [M('Form · Página final'), M('Fin de la prueba')] },
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
const disparadores = ['Form Trigger · Credenciales', 'Probar con datos de ejemplo'];
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
