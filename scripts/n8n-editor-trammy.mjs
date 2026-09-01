/**
 * «TRAMMY · Editor de configuración» — la pantalla para cambiar el diagnóstico
 * sin abrir una hoja de cálculo ni entrar a n8n.
 *
 * La configuración vive en un Google Sheet porque el flujo la lee de ahí en
 * cada ejecución. Eso resolvía el problema técnico y no el humano: a quien
 * tiene que redactar diecisiete preguntas no se le pide que entienda columnas,
 * pestañas ni un desplegable de escalas. Esto es la misma configuración con
 * una pantalla delante: campos de texto, desplegables y un botón de guardar.
 *
 * Son dos webhooks en el mismo flujo:
 *
 *   GET  /webhook/trammy-editor?clave=…            pinta la pantalla
 *   POST /webhook/trammy-editor-guardar            escribe en la hoja
 *
 * ---- Sobre la clave ----
 *
 * Un webhook de n8n es público: cualquiera con la URL entra. La clave vive en
 * la propia hoja (pestaña Textos, fila `clave_editor`) y se comprueba en las
 * dos puntas: sin ella la pantalla no se pinta, y sin ella el guardado se
 * rechaza aunque alguien llame al endpoint a mano. No es un sistema de
 * usuarios: es una cerradura sencilla para una pantalla interna, y conviene
 * saberlo. Para cambiarla, se cambia esa celda.
 *
 * ---- Por qué el HTML se arma sin saltos de línea ----
 *
 * El código de un nodo Code viaja como texto dentro de este guion, y ahí un
 * \n mal escapado se convierte en un salto de línea real dentro de una cadena
 * y rompe el nodo sin avisar hasta que n8n lo ejecuta. Ya pasó dos veces en
 * este proyecto. El HTML no necesita saltos de línea, así que no los lleva: se
 * concatena y se acabó el problema.
 */

import { writeFileSync } from 'node:fs';

const DESTINO = process.argv[2] || 'automatizacion/n8n/trammy-editor.json';

const CONFIG_ID = '1OwVs_MVP8IbZSXcjKhUScHyVEXDTx1RIYeJuWucrRgk';
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'MbVZU1NmU2CvAAhz', name: 'Google Sheets account' } };

const rango = (hoja, hasta) => `ranges=${encodeURIComponent(hoja)}!A1:${hasta}`;
const URL_LEER = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG_ID}/values:batchGet?${rango('Preguntas', 'F500')}&${rango('Perfiles', 'D100')}&${rango('Textos', 'B200')}&${rango('Escalas', 'D500')}`;

const leer = (id, nombre, posicion) => ({
  id,
  name: nombre,
  type: 'n8n-nodes-base.httpRequest',
  typeVersion: 4.2,
  position: posicion,
  parameters: {
    url: URL_LEER,
    authentication: 'predefinedCredentialType',
    nodeCredentialType: 'googleSheetsOAuth2Api',
    options: {},
  },
  credentials: CRED_SHEETS,
});

/* Común a los dos caminos: convertir los bloques de batchGet en objetos. */
const PARSEO = [
  "const bloques = $json.valueRanges || [];",
  "const limpia = (t) => String(t ?? '').trim();",
  'const aObjetos = (bloque) => {',
  '  const filas = (bloque && bloque.values) || [];',
  '  const cabecera = (filas[0] || []).map(limpia);',
  '  return filas.slice(1)',
  '    .filter((f) => (f || []).some((c) => limpia(c) !== ""))',
  '    .map((f) => Object.fromEntries(cabecera.map((c, i) => [c, f[i] === undefined ? "" : f[i]])));',
  '};',
  'const preguntas = aObjetos(bloques[0]);',
  'const perfiles = aObjetos(bloques[1]);',
  'const textos = aObjetos(bloques[2]);',
  'const escalas = aObjetos(bloques[3]);',
];

const pintar = {
  id: 'pintar',
  name: 'Pintar la pantalla',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [464, 180],
  parameters: {
    jsCode: [
      ...PARSEO,
      '',
      "const clave = limpia(($('Abrir el editor').first().json.query || {}).clave);",
      "const claveBuena = limpia((textos.find((t) => limpia(t.clave) === 'clave_editor') || {}).valor);",
      '',
      '/* Escapar antes de meter nada en el HTML: los textos vienen de la hoja y',
      '   una comilla suelta partiría el atributo en dos. */',
      'const esc = (t) => String(t === undefined || t === null ? "" : t)',
      '  .split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;")',
      '  .split(\'"\').join("&quot;");',
      '',
      'const p = [];',
      'p.push("<!doctype html><html lang=es><head><meta charset=utf-8>");',
      'p.push("<meta name=viewport content=\'width=device-width,initial-scale=1\'>");',
      'p.push("<title>TRAMMY · Configuración</title><style>");',
      'p.push("*{box-sizing:border-box}body{margin:0;background:#f6f7f9;color:#14181f;font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}");',
      'p.push(".env{max-width:1080px;margin:0 auto;padding:32px 20px 96px}");',
      'p.push("h1{font-size:24px;margin:0 0 4px}h2{font-size:17px;margin:36px 0 6px}");',
      'p.push(".sub{color:#5b6472;margin:0 0 8px}");',
      'p.push("table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #dfe3e8;border-radius:10px;overflow:hidden}");',
      'p.push("th{background:#eef1f4;text-align:left;font-size:12px;letter-spacing:.03em;text-transform:uppercase;color:#5b6472;padding:9px 10px}");',
      'p.push("td{border-top:1px solid #eceff2;padding:7px 10px;vertical-align:middle}");',
      'p.push("input,select,textarea{width:100%;font:inherit;color:inherit;padding:7px 9px;border:1px solid #cfd5dc;border-radius:7px;background:#fff}");',
      'p.push("textarea{min-height:80px;resize:vertical}");',
      'p.push("input:focus,select:focus,textarea:focus{outline:2px solid #2f6feb;outline-offset:-1px;border-color:#2f6feb}");',
      'p.push(".mini{width:78px}.id{color:#8a939f;font:12px ui-monospace,SFMono-Regular,Menlo,monospace}");',
      'p.push("button{font:inherit;padding:9px 15px;border-radius:8px;border:1px solid #cfd5dc;background:#fff;cursor:pointer}");',
      'p.push("button:hover{background:#f0f2f5}");',
      'p.push(".barra{position:sticky;bottom:0;margin-top:28px;padding:14px 0;background:linear-gradient(to top,#f6f7f9 70%,rgba(246,247,249,0));display:flex;gap:12px;align-items:center}");',
      'p.push("#guardar{background:#14181f;color:#fff;border-color:#14181f;font-weight:600;padding:11px 22px}");',
      'p.push("#estado{color:#5b6472}");',
      'p.push(".aviso{background:#fff8e6;border:1px solid #f0dca8;border-radius:10px;padding:12px 14px;margin:14px 0}");',
      'p.push("</style></head><body><div class=env>");',
      '',
      'if (!claveBuena || clave !== claveBuena) {',
      '  p.push("<h1>Configuración de TRAMMY</h1>");',
      '  p.push("<div class=aviso>Para entrar necesitas la clave. Añádela al final de la dirección, así: <code>?clave=TU_CLAVE</code>. Está en la pestaña <b>Textos</b> de la hoja, fila <code>clave_editor</code>.</div>");',
      '  p.push("</div></body></html>");',
      '  return [{ json: { html: p.join("") } }];',
      '}',
      '',
      'const nombresEscala = [];',
      'for (const e of escalas) { const n = limpia(e.escala); if (n && nombresEscala.indexOf(n) === -1) nombresEscala.push(n); }',
      '',
      'p.push("<h1>Configuración del diagnóstico TRAMMY</h1>");',
      'p.push("<p class=sub>Cambia lo que necesites y pulsa Guardar. El formulario usa esto en la siguiente respuesta: no hay que publicar nada.</p>");',
      '',
      '/* --- preguntas --- */',
      'p.push("<h2>Preguntas</h2><p class=sub>El orden de la tabla es el orden en que se ven. Desmarca <b>Activa</b> para retirar una sin borrarla.</p>");',
      'p.push("<table id=tPreguntas><thead><tr><th style=width:120px>Identificador</th><th>Pregunta</th><th style=width:110px>Tipo</th><th style=width:150px>Escala</th><th style=width:80px>Obliga.</th><th style=width:70px>Activa</th></tr></thead><tbody>");',
      'for (const q of preguntas) {',
      '  const tipo = limpia(q.tipo) || "escala";',
      '  p.push("<tr><td><span class=id>" + esc(q.id) + "</span><input type=hidden data-c=id value=\\"" + esc(q.id) + "\\"></td>");',
      '  p.push("<td><input data-c=pregunta value=\\"" + esc(q.pregunta) + "\\"></td>");',
      '  p.push("<td><select data-c=tipo>");',
      '  for (const t of ["escala", "texto", "numero"]) p.push("<option" + (t === tipo ? " selected" : "") + ">" + t + "</option>");',
      '  p.push("</select></td><td><select data-c=escala>");',
      '  for (const n of nombresEscala) p.push("<option" + (n === limpia(q.escala) ? " selected" : "") + ">" + esc(n) + "</option>");',
      '  p.push("</select></td>");',
      '  p.push("<td style=text-align:center><input type=checkbox data-c=obligatoria" + (limpia(q.obligatoria).toLowerCase() === "no" ? "" : " checked") + "></td>");',
      '  p.push("<td style=text-align:center><input type=checkbox data-c=activa" + (limpia(q.activa).toLowerCase() === "no" ? "" : " checked") + "></td></tr>");',
      '}',
      'p.push("</tbody></table><p><button type=button id=masPregunta>+ Añadir pregunta</button></p>");',
      '',
      '/* --- escalas --- */',
      'p.push("<h2>Opciones de respuesta</h2><p class=sub>La <b>etiqueta</b> es lo que lee quien responde. El <b>valor</b> es lo que puntúa esa opción.</p>");',
      'p.push("<table id=tEscalas><thead><tr><th style=width:180px>Escala</th><th style=width:90px>Orden</th><th>Etiqueta</th><th style=width:100px>Valor</th></tr></thead><tbody>");',
      'for (const e of escalas) {',
      '  p.push("<tr><td><input data-c=escala value=\\"" + esc(e.escala) + "\\"></td>");',
      '  p.push("<td><input class=mini data-c=orden value=\\"" + esc(e.orden) + "\\"></td>");',
      '  p.push("<td><input data-c=etiqueta value=\\"" + esc(e.etiqueta) + "\\"></td>");',
      '  p.push("<td><input class=mini data-c=valor value=\\"" + esc(e.valor) + "\\"></td></tr>");',
      '}',
      'p.push("</tbody></table><p><button type=button id=masEscala>+ Añadir opción</button></p>");',
      '',
      '/* --- perfiles --- */',
      'p.push("<h2>Perfiles</h2><p class=sub>En qué tramo de puntuación (0 a 100) cae cada perfil.</p>");',
      'p.push("<table id=tPerfiles><thead><tr><th style=width:200px>Perfil</th><th style=width:90px>Desde</th><th style=width:90px>Hasta</th><th>Descripción</th></tr></thead><tbody>");',
      'for (const f of perfiles) {',
      '  p.push("<tr><td><input data-c=perfil value=\\"" + esc(f.perfil) + "\\"></td>");',
      '  p.push("<td><input class=mini data-c=min value=\\"" + esc(f.min) + "\\"></td>");',
      '  p.push("<td><input class=mini data-c=max value=\\"" + esc(f.max) + "\\"></td>");',
      '  p.push("<td><input data-c=descripcion value=\\"" + esc(f.descripcion) + "\\"></td></tr>");',
      '}',
      'p.push("</tbody></table><p><button type=button id=masPerfil>+ Añadir perfil</button></p>");',
      '',
      '/* --- textos --- */',
      'const ETIQUETAS = {',
      '  form_titulo_pagina2: "Título de la página de preguntas",',
      '  form_descripcion_pagina2: "Texto bajo ese título",',
      '  pantalla_credenciales_titulo: "Acceso incorrecto · título",',
      '  pantalla_credenciales_mensaje: "Acceso incorrecto · mensaje",',
      '  pantalla_incompleto_titulo: "Faltan respuestas · título",',
      '  pantalla_incompleto_mensaje: "Faltan respuestas · mensaje",',
      '  pantalla_error_titulo: "Error · título",',
      '  pantalla_error_mensaje: "Error · mensaje",',
      '  pantalla_ok_titulo: "Diagnóstico listo · título",',
      '  prompt_sistema: "Instrucciones para la IA que interpreta el diagnóstico",',
      '  clave_editor: "Clave de esta pantalla",',
      '};',
      'p.push("<h2>Textos y mensajes</h2><p class=sub>Lo que lee la persona en cada pantalla. El último campo es lo que se le dice a la IA: ahí va tu metodología.</p>");',
      'p.push("<div id=tTextos>");',
      'for (const t of textos) {',
      '  const clv = limpia(t.clave);',
      '  if (!clv) continue;',
      '  const grande = clv === "prompt_sistema";',
      '  p.push("<div style=margin:12px_0><label><b>" + esc(ETIQUETAS[clv] || clv) + "</b> <span class=id>" + esc(clv) + "</span></label>");',
      '  p.push("<input type=hidden data-c=clave value=\\"" + esc(clv) + "\\">");',
      '  if (grande) p.push("<textarea data-c=valor style=min-height:190px>" + esc(t.valor) + "</textarea>");',
      '  else p.push("<input data-c=valor value=\\"" + esc(t.valor) + "\\">");',
      '  p.push("</div>");',
      '}',
      'p.push("</div>");',
      '',
      'p.push("<div class=barra><button id=guardar>Guardar cambios</button><span id=estado></span></div>");',
      'p.push("</div><script>");',
      'p.push("var CLAVE=" + JSON.stringify(clave) + ";");',
      'p.push("function filas(t){var r=[];var f=document.querySelectorAll(\'#\'+t+\' tbody tr\');for(var i=0;i<f.length;i++){var o={};var c=f[i].querySelectorAll(\'[data-c]\');for(var j=0;j<c.length;j++){var k=c[j].getAttribute(\'data-c\');o[k]=c[j].type===\'checkbox\'?(c[j].checked?\'si\':\'no\'):c[j].value;}r.push(o);}return r;}");',
      'p.push("function textos(){var r=[];var d=document.querySelectorAll(\'#tTextos > div\');for(var i=0;i<d.length;i++){var c=d[i].querySelector(\'[data-c=clave]\');var v=d[i].querySelector(\'[data-c=valor]\');if(c)r.push({clave:c.value,valor:v?v.value:\'\'});}return r;}");',
      'p.push("function nuevaFila(t,html){var b=document.querySelector(\'#\'+t+\' tbody\');var tr=document.createElement(\'tr\');tr.innerHTML=html;b.appendChild(tr);}");',
      'p.push("document.getElementById(\'masPregunta\').onclick=function(){var n=document.querySelectorAll(\'#tPreguntas tbody tr\').length+1;var id=\'pregunta_\'+Date.now().toString().slice(-6);var op=" + JSON.stringify(nombresEscala) + ".map(function(e){return \'<option>\'+e+\'</option>\'}).join(\'\');nuevaFila(\'tPreguntas\',\'<td><span class=id>\'+id+\'</span><input type=hidden data-c=id value=\\"\'+id+\'\\"></td><td><input data-c=pregunta value=\\"\\"></td><td><select data-c=tipo><option>escala</option><option>texto</option><option>numero</option></select></td><td><select data-c=escala>\'+op+\'</select></td><td style=text-align:center><input type=checkbox data-c=obligatoria checked></td><td style=text-align:center><input type=checkbox data-c=activa checked></td>\');};");',
      'p.push("document.getElementById(\'masEscala\').onclick=function(){nuevaFila(\'tEscalas\',\'<td><input data-c=escala value=\\"\\"></td><td><input class=mini data-c=orden value=\\"\\"></td><td><input data-c=etiqueta value=\\"\\"></td><td><input class=mini data-c=valor value=\\"\\"></td>\');};");',
      'p.push("document.getElementById(\'masPerfil\').onclick=function(){nuevaFila(\'tPerfiles\',\'<td><input data-c=perfil value=\\"\\"></td><td><input class=mini data-c=min value=\\"\\"></td><td><input class=mini data-c=max value=\\"\\"></td><td><input data-c=descripcion value=\\"\\"></td>\');};");',
      'p.push("document.getElementById(\'guardar\').onclick=function(){var e=document.getElementById(\'estado\');e.textContent=\'Guardando…\';fetch(\'/webhook/trammy-editor-guardar\',{method:\'POST\',headers:{\'content-type\':\'application/json\'},body:JSON.stringify({clave:CLAVE,preguntas:filas(\'tPreguntas\'),escalas:filas(\'tEscalas\'),perfiles:filas(\'tPerfiles\'),textos:textos()})}).then(function(r){return r.json()}).then(function(d){e.textContent=d.ok?\'Guardado. El formulario ya usa estos cambios.\':(\'No se pudo guardar: \'+(d.error||\'\'));}).catch(function(){e.textContent=\'No se pudo guardar: fallo de red.\';});};");',
      'p.push("<\\/script></body></html>");',
      '',
      'return [{ json: { html: p.join("") } }];',
    ].join('\n'),
  },
};

const guardar = {
  id: 'armar-guardado',
  name: 'Comprobar clave y armar',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [464, 460],
  parameters: {
    jsCode: [
      ...PARSEO,
      '',
      "const enviado = $('Guardar cambios').first().json.body || {};",
      "const claveBuena = limpia((textos.find((t) => limpia(t.clave) === 'clave_editor') || {}).valor);",
      '',
      '/* La clave se comprueba también aquí y no solo al pintar: el endpoint de',
      '   guardado es una URL como cualquier otra y alguien podría llamarlo a mano',
      '   sin haber pasado por la pantalla. */',
      'if (!claveBuena || limpia(enviado.clave) !== claveBuena) {',
      '  return [{ json: { permitido: false, respuesta: { ok: false, error: "clave incorrecta" } } }];',
      '}',
      '',
      '/* Se reescribe cada pestaña entera y se rellena con filas vacías hasta el',
      '   final del rango. Sin eso, borrar una pregunta la quitaría de la pantalla',
      '   pero la dejaría viva en la hoja, y el formulario la seguiría mostrando. */',
      'const rellenar = (filas, ancho, alto) => {',
      '  const salida = filas.map((f) => {',
      '    const fila = f.slice(0, ancho);',
      '    while (fila.length < ancho) fila.push("");',
      '    return fila;',
      '  });',
      '  while (salida.length < alto) salida.push(new Array(ancho).fill(""));',
      '  return salida;',
      '};',
      '',
      'const filasPreguntas = (enviado.preguntas || [])',
      '  .filter((q) => limpia(q.id))',
      '  .map((q) => [limpia(q.id), String(q.pregunta ?? ""), limpia(q.tipo) || "escala", limpia(q.escala), limpia(q.obligatoria) || "si", limpia(q.activa) || "si"]);',
      '',
      'const filasEscalas = (enviado.escalas || [])',
      '  .filter((e) => limpia(e.escala) && limpia(e.etiqueta))',
      '  .map((e) => [limpia(e.escala), limpia(e.orden), String(e.etiqueta ?? ""), limpia(e.valor)]);',
      '',
      'const filasPerfiles = (enviado.perfiles || [])',
      '  .filter((f) => limpia(f.perfil))',
      '  .map((f) => [limpia(f.perfil), limpia(f.min), limpia(f.max), String(f.descripcion ?? "")]);',
      '',
      'const filasTextos = (enviado.textos || [])',
      '  .filter((t) => limpia(t.clave))',
      '  .map((t) => [limpia(t.clave), String(t.valor ?? "")]);',
      '',
      'return [{ json: {',
      '  permitido: true,',
      '  respuesta: { ok: true, guardado: { preguntas: filasPreguntas.length, escalas: filasEscalas.length, perfiles: filasPerfiles.length, textos: filasTextos.length } },',
      '  cuerpo: {',
      '    valueInputOption: "RAW",',
      '    data: [',
      '      { range: "Preguntas!A2:F200", values: rellenar(filasPreguntas, 6, 199) },',
      '      { range: "Escalas!A2:D200", values: rellenar(filasEscalas, 4, 199) },',
      '      { range: "Perfiles!A2:D60", values: rellenar(filasPerfiles, 4, 59) },',
      '      { range: "Textos!A2:B100", values: rellenar(filasTextos, 2, 99) },',
      '    ],',
      '  },',
      '} }];',
    ].join('\n'),
  },
};

const nodos = [
  {
    id: 'wh-get',
    name: 'Abrir el editor',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2.1,
    position: [0, 180],
    webhookId: 'trammy-editor',
    parameters: { httpMethod: 'GET', path: 'trammy-editor', responseMode: 'responseNode', options: {} },
  },
  leer('leer-get', 'Leer la configuración', [232, 180]),
  pintar,
  {
    id: 'resp-html',
    name: 'Devolver la pantalla',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.5,
    position: [696, 180],
    parameters: {
      respondWith: 'text',
      responseBody: '={{ $json.html }}',
      options: { responseHeaders: { entries: [{ name: 'content-type', value: 'text/html; charset=utf-8' }] } },
    },
  },
  {
    id: 'wh-post',
    name: 'Guardar cambios',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2.1,
    position: [0, 460],
    webhookId: 'trammy-editor-guardar',
    parameters: { httpMethod: 'POST', path: 'trammy-editor-guardar', responseMode: 'responseNode', options: {} },
  },
  leer('leer-post', 'Releer la configuración', [232, 460]),
  guardar,
  {
    id: 'if-permitido',
    name: '¿Clave correcta?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [696, 460],
    parameters: {
      conditions: {
        options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
        combinator: 'and',
        conditions: [{
          id: 'ok',
          leftValue: "={{ $json.permitido ? 'si' : 'no' }}",
          rightValue: 'si',
          operator: { type: 'string', operation: 'equals' },
        }],
      },
      options: {},
    },
  },
  {
    id: 'escribir',
    name: 'Escribir en la hoja',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [928, 380],
    onError: 'continueRegularOutput',
    parameters: {
      method: 'POST',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG_ID}/values:batchUpdate`,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleSheetsOAuth2Api',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: "={{ JSON.stringify($('Comprobar clave y armar').first().json.cuerpo) }}",
      options: {},
    },
    credentials: CRED_SHEETS,
  },
  {
    id: 'resp-ok',
    name: 'Responder guardado',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.5,
    position: [1160, 380],
    parameters: {
      respondWith: 'json',
      responseBody: "={{ JSON.stringify($('Comprobar clave y armar').first().json.respuesta) }}",
      options: {},
    },
  },
  {
    id: 'resp-no',
    name: 'Responder rechazo',
    type: 'n8n-nodes-base.respondToWebhook',
    typeVersion: 1.5,
    position: [928, 560],
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify($json.respuesta) }}',
      options: { responseCode: 403 },
    },
  },
];

const M = (n) => [{ node: n, type: 'main', index: 0 }];

for (const n of nodos.filter((x) => x.type === 'n8n-nodes-base.code')) {
  try {
    new Function('$input', '$json', '$', n.parameters.jsCode);
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

writeFileSync(DESTINO, JSON.stringify({
  name: 'TRAMMY · Editor de configuración',
  nodes: nodos,
  connections: {
    'Abrir el editor': { main: [M('Leer la configuración')] },
    'Leer la configuración': { main: [M('Pintar la pantalla')] },
    'Pintar la pantalla': { main: [M('Devolver la pantalla')] },
    'Guardar cambios': { main: [M('Releer la configuración')] },
    'Releer la configuración': { main: [M('Comprobar clave y armar')] },
    'Comprobar clave y armar': { main: [M('¿Clave correcta?')] },
    '¿Clave correcta?': { main: [M('Escribir en la hoja'), M('Responder rechazo')] },
    'Escribir en la hoja': { main: [M('Responder guardado')] },
  },
  settings: { executionOrder: 'v1' },
}, null, 2));

console.log(`Nodos: ${nodos.length}`);
console.log(`Escrito en ${DESTINO}`);
