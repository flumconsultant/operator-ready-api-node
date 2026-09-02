/**
 * «TRAMMY · API de configuración» — un webhook que devuelve la configuración
 * del diagnóstico en JSON.
 *
 * Existe por un motivo muy concreto, medido y nada evidente: en esta instancia,
 * **usar una credencial de Google en cualquier punto de una ejecución que luego
 * tiene que pintar una página de formulario cuelga esa página**, de forma
 * intermitente. Un GET a la URL de espera a veces tarda 0,2 s y a veces no
 * devuelve un byte en más de veinte segundos. En un navegador eso es un
 * spinner eterno.
 *
 * Medido con formularios mínimos de dos páginas, cinco intentos cada uno:
 *
 *   sin nada delante ................................ 5 de 5 en ~0,2 s
 *   HTTP Request SIN credencial ..................... 5 de 5 en ~0,2 s
 *   HTTP Request CON credencial de Google ........... 1 ok, 2 colgados, 1 ok
 *   el nodo de Google Sheets ........................ siempre colgado
 *   la credencial movida a un sub-flujo ............. 1 de 5
 *
 * El sub-flujo no sirve porque su ejecución forma parte del mismo árbol. Una
 * llamada HTTP a otro flujo sí: la credencial se queda de este lado y el flujo
 * del formulario no tiene ninguna que resolver.
 *
 * La alternativa era publicar la hoja para leerla sin credencial, y eso habría
 * dejado a la vista la metodología de interpretación. Esto no expone nada: el
 * endpoint es interno, pide un token y no devuelve la clave del panel, que es
 * el único secreto que la hoja tiene y que el diagnóstico no necesita.
 */

import { writeFileSync } from 'node:fs';

const DESTINO = process.argv[2] || 'automatizacion/n8n/trammy-config-api.json';
const TOKEN = process.argv[3];
if (!TOKEN) {
  console.error('Falta el token: node scripts/n8n-config-api-trammy.mjs <destino> <token>');
  process.exit(1);
}

const CONFIG_ID = '1OwVs_MVP8IbZSXcjKhUScHyVEXDTx1RIYeJuWucrRgk';
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'MbVZU1NmU2CvAAhz', name: 'Google Sheets account' } };
const rango = (hoja, hasta) => `ranges=${encodeURIComponent(hoja)}!A1:${hasta}`;

const nodos = [
  {
    id: 'nota',
    name: 'Por qué existe este flujo',
    type: 'n8n-nodes-base.stickyNote',
    typeVersion: 1,
    position: [-420, 80],
    parameters: {
      color: 3,
      width: 400,
      height: 300,
      content: [
        '## La credencial vive aquí, no en el formulario',
        '',
        'En esta instancia, usar una credencial de Google en una ejecución que',
        'luego pinta una página de formulario **cuelga esa página**, a veces sí y',
        'a veces no. Medido: con credencial, 1 de 4 intentos responde; sin',
        'credencial, 5 de 5 en 0,2 s.',
        '',
        'Por eso el diagnóstico no lee la hoja: **llama a este webhook por HTTP',
        'normal, sin credencial ninguna**. La credencial se queda de este lado,',
        'donde no hay ningún formulario que pintar.',
        '',
        'Mover la lectura a un sub-flujo no sirve: su ejecución forma parte del',
        'mismo árbol y el cuelgue vuelve.',
      ].join('\n'),
    },
  },
  {
    id: 'wh',
    name: 'Pedir la configuración',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2.1,
    position: [0, 300],
    webhookId: 'trammy-config',
    parameters: { httpMethod: 'GET', path: 'trammy-config', responseMode: 'responseNode', options: {} },
  },
  {
    id: 'leer',
    name: 'Leer la hoja',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [232, 300],
    parameters: {
      url: `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG_ID}/values:batchGet?${rango('Preguntas', 'F500')}&${rango('Perfiles', 'D100')}&${rango('Textos', 'B200')}&${rango('Escalas', 'D500')}`,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleSheetsOAuth2Api',
      options: {},
    },
    credentials: CRED_SHEETS,
  },
  {
    id: 'armar',
    name: 'Armar la respuesta',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [464, 300],
    parameters: {
      jsCode: [
        `const TOKEN = ${JSON.stringify(TOKEN)};`,
        "const pedido = ($('Pedir la configuración').first().json.query || {}).token;",
        'if (pedido !== TOKEN) {',
        '  return [{ json: { ok: false, error: "token invalido" } }];',
        '}',
        '',
        "const limpia = (t) => String(t ?? '').trim();",
        "const esNo = (t) => ['no', 'false', '0'].includes(limpia(t).toLowerCase());",
        'const bloques = $json.valueRanges || [];',
        'const aObjetos = (bloque) => {',
        '  const filas = (bloque && bloque.values) || [];',
        '  const cabecera = (filas[0] || []).map(limpia);',
        '  return filas.slice(1)',
        '    .filter((f) => (f || []).some((c) => limpia(c) !== ""))',
        '    .map((f) => Object.fromEntries(cabecera.map((c, i) => [c, f[i] === undefined ? "" : f[i]])));',
        '};',
        '',
        '/* --- escalas: etiqueta es lo que se lee, valor es lo que puntúa --- */',
        'const escalas = {};',
        'for (const f of aObjetos(bloques[3])) {',
        '  const nombre = limpia(f.escala);',
        '  const etiqueta = limpia(f.etiqueta);',
        '  if (!nombre || !etiqueta) continue;',
        '  const valor = Number(f.valor);',
        '  (escalas[nombre] = escalas[nombre] || []).push({',
        '    orden: Number(f.orden) || 0,',
        '    etiqueta,',
        '    valor: Number.isFinite(valor) ? valor : null,',
        '  });',
        '}',
        'for (const n of Object.keys(escalas)) escalas[n].sort((a, b) => a.orden - b.orden);',
        '',
        '/* --- preguntas --- */',
        'const preguntas = aObjetos(bloques[0])',
        '  .filter((f) => !esNo(f.activa) && limpia(f.id))',
        '  .map((f) => {',
        '    const tipo = (limpia(f.tipo) || "escala").toLowerCase();',
        '    const opciones = escalas[limpia(f.escala)] || [];',
        '    return {',
        '      id: limpia(f.id),',
        '      texto: limpia(f.pregunta) || limpia(f.id),',
        '      tipo,',
        '      escala: limpia(f.escala),',
        '      valores: Object.fromEntries(opciones.map((o) => [o.etiqueta, o.valor])),',
        '      obligatoria: !esNo(f.obligatoria),',
        '    };',
        '  });',
        '',
        '/* Los campos con la forma exacta que el nodo Form espera cuando se le',
        '   definen desde JSON. Se arman aquí para que el flujo del diagnóstico no',
        '   tenga que saber nada de escalas: recibe la lista y la pinta. */',
        'const campos = aObjetos(bloques[0])',
        '  .filter((f) => !esNo(f.activa) && limpia(f.id))',
        '  .map((f) => {',
        '    const tipo = (limpia(f.tipo) || "escala").toLowerCase();',
        '    const opciones = escalas[limpia(f.escala)] || [];',
        '    const campo = {',
        '      fieldLabel: limpia(f.pregunta) || limpia(f.id),',
        '      fieldName: limpia(f.id),',
        '      requiredField: !esNo(f.obligatoria),',
        '    };',
        '    if (tipo === "escala" && opciones.length) {',
        '      campo.fieldType = "dropdown";',
        '      campo.fieldOptions = { values: opciones.map((o) => ({ option: o.etiqueta })) };',
        '    } else if (tipo === "numero") {',
        '      campo.fieldType = "number";',
        '    } else {',
        '      campo.fieldType = "text";',
        '    }',
        '    return campo;',
        '  });',
        '',
        '/* --- perfiles --- */',
        'const perfiles = aObjetos(bloques[1])',
        '  .map((f) => ({',
        '    perfil: limpia(f.perfil),',
        '    min: Number(f.min),',
        '    max: Number(f.max),',
        '    descripcion: limpia(f.descripcion),',
        '  }))',
        '  .filter((p) => p.perfil && Number.isFinite(p.min) && Number.isFinite(p.max))',
        '  .sort((a, b) => a.min - b.min);',
        '',
        '/* --- textos, menos la clave del panel: el diagnóstico no la necesita y',
        '   lo que no se entrega no se puede filtrar --- */',
        'const textos = {};',
        'for (const f of aObjetos(bloques[2])) {',
        '  const clave = limpia(f.clave);',
        '  if (clave && clave !== "clave_editor") textos[clave] = String(f.valor ?? "");',
        '}',
        '',
        'return [{ json: { ok: true, preguntas, campos, perfiles, textos, preguntas_json: JSON.stringify(campos) } }];',
      ].join('\n'),
    },
  },
  {
    id: 'resp',
    name: 'Devolver',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.5,
    position: [696, 300],
    parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify($json) }}', options: {} },
  },
];

for (const n of nodos.filter((x) => x.type === 'n8n-nodes-base.code')) {
  try {
    new Function('$input', '$json', '$', n.parameters.jsCode);
  } catch (error) {
    console.error(`El nodo «${n.name}» no compila: ${error.message}`);
    process.exit(1);
  }
}

writeFileSync(DESTINO, JSON.stringify({
  name: 'TRAMMY · API de configuración',
  nodes: nodos,
  connections: {
    'Pedir la configuración': { main: [[{ node: 'Leer la hoja', type: 'main', index: 0 }]] },
    'Leer la hoja': { main: [[{ node: 'Armar la respuesta', type: 'main', index: 0 }]] },
    'Armar la respuesta': { main: [[{ node: 'Devolver', type: 'main', index: 0 }]] },
  },
  settings: { executionOrder: 'v1' },
}, null, 2));

console.log(`Escrito en ${DESTINO}`);
