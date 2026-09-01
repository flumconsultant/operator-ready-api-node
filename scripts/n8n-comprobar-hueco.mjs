/**
 * «Flujo 1b · Comprobar hueco» — un sub-flujo de cuatro nodos que existe por
 * una razón concreta: el agente comparaba horas y se equivocaba.
 *
 * Con una cita de 16:00 a 17:00 ya reservada, un cliente pidió las 16:30 y el
 * agente contestó «está disponible». Otra vez lo había comprobado bien, y esa
 * inconsistencia es exactamente el problema: no se puede prometer un hueco a
 * un cliente con un método que acierta casi siempre.
 *
 * Solapar dos intervalos es una comparación de números, igual que sumar días a
 * una fecha. Un modelo de lenguaje puede hacerlo y suele acertar; el código lo
 * hace siempre. Así que la pregunta que el agente hace deja de ser «¿qué citas
 * hay ese día?» —que le obliga a razonar— y pasa a ser «¿está libre este
 * hueco?», que se responde sola.
 *
 * De paso devuelve alternativas ya calculadas, que es lo que el agente
 * necesita decir cuando la respuesta es que no.
 */

import { writeFileSync } from 'node:fs';

const DESTINO = process.argv[2] || 'automatizacion/n8n/stetikgo-comprobar-hueco.json';

const CATALOGO_ID = '18_DVDoAOecq08zBDrZPVSm_wEtsr-uN5ijDbIATlsXs';
const CATALOGO_URL = `https://docs.google.com/spreadsheets/d/${CATALOGO_ID}/edit`;
const CRED_SHEETS = { googleSheetsOAuth2Api: { id: 'MbVZU1NmU2CvAAhz', name: 'Google Sheets account' } };

const nodos = [
  {
    id: 'entrada',
    name: 'Lo llama el asesor',
    type: 'n8n-nodes-base.executeWorkflowTrigger',
    typeVersion: 1.1,
    position: [0, 300],
    parameters: { workflowInputs: { values: [{ name: 'dia' }, { name: 'hora_inicio' }, { name: 'hora_fin' }] } },
  },
  {
    id: 'leer',
    name: 'Citas de ese día',
    type: 'n8n-nodes-base.googleSheets',
    typeVersion: 4.7,
    position: [224, 300],
    /* Si no hay ninguna cita ese día, Sheets no devuelve ítem y el nodo
       siguiente no llegaría a ejecutarse: el día entero libre se leería como
       un error. Con esto siempre sale un ítem, aunque venga vacío. */
    alwaysOutputData: true,
    parameters: {
      documentId: { __rl: true, mode: 'list', value: CATALOGO_ID, cachedResultUrl: CATALOGO_URL, cachedResultName: 'StetikGO · Catálogo 2026' },
      sheetName: { __rl: true, mode: 'name', value: 'Citas' },
      filtersUI: { values: [{ lookupColumn: 'dia', lookupValue: '={{ $json.dia }}' }] },
      options: {},
    },
    credentials: CRED_SHEETS,
  },
  {
    id: 'comprobar',
    name: 'Comprobar solape',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [448, 300],
    parameters: {
      jsCode: [
        "const peticion = $('Lo llama el asesor').first().json;",
        "const dia = String(peticion.dia ?? '').trim();",
        '',
        '/* "16:30" -> 990. Comparar minutos es comparar números, y dos intervalos',
        '   se solapan si cada uno empieza antes de que acabe el otro. */',
        'const minutos = (t) => {',
        "  const m = String(t ?? '').match(/(\\d{1,2})\\D(\\d{2})/);",
        '  return m ? Number(m[1]) * 60 + Number(m[2]) : null;',
        '};',
        "const reloj = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');",
        '',
        'const inicio = minutos(peticion.hora_inicio);',
        'const fin = minutos(peticion.hora_fin);',
        '',
        'const ABRE = 9 * 60;',
        'const CIERRA = 20 * 60;',
        '',
        'if (inicio === null || fin === null || fin <= inicio) {',
        "  return [{ json: { libre: false, motivo: 'La hora recibida no es válida.', ocupadas: [], alternativas: [] } }];",
        '}',
        'if (inicio < ABRE || fin > CIERRA) {',
        "  return [{ json: { libre: false, motivo: 'Fuera del horario de atención, que es de 9:00 a 20:00.', ocupadas: [], alternativas: [] } }];",
        '}',
        '',
        'const citas = $input.all()',
        '  .map((i) => i.json)',
        '  .filter((c) => c && String(c.dia).trim() === dia && minutos(c.hora_inicio) !== null)',
        '  .map((c) => ({ desde: minutos(c.hora_inicio), hasta: minutos(c.hora_fin), servicio: c.servicio }))',
        '  .sort((a, b) => a.desde - b.desde);',
        '',
        'const choca = (a1, a2) => citas.some((c) => a1 < c.hasta && c.desde < a2);',
        '',
        'if (!choca(inicio, fin)) {',
        '  return [{ json: { libre: true, motivo: "El hueco está libre.", ocupadas: [], alternativas: [] } }];',
        '}',
        '',
        '/* Cuando está ocupado, el agente necesita qué ofrecer. Y ofrecer las 9:00',
        '   a quien pidió las 16:30 es no haberlo escuchado: se buscan los huecos',
        '   más cercanos a la hora que pidió, alejándose en pasos de media hora',
        '   hacia los dos lados a la vez. */',
        'const dura = fin - inicio;',
        'const alternativas = [];',
        'for (let paso = 30; paso <= 11 * 60 && alternativas.length < 2; paso += 30) {',
        '  for (const t of [inicio - paso, inicio + paso]) {',
        '    if (alternativas.length >= 2) break;',
        '    if (t < ABRE || t + dura > CIERRA) continue;',
        '    if (!choca(t, t + dura)) alternativas.push(reloj(t));',
        '  }',
        '}',
        'alternativas.sort();',
        '',
        'return [{',
        '  json: {',
        '    libre: false,',
        "    motivo: 'Esa hora se solapa con una cita ya reservada.',",
        '    ocupadas: citas.map((c) => reloj(c.desde) + " a " + reloj(c.hasta) + " (" + (c.servicio || "reservada") + ")"),',
        '    alternativas,',
        '  },',
        '}];',
      ].join('\n'),
    },
  },
];

writeFileSync(DESTINO, JSON.stringify({
  name: 'Flujo 1b · Comprobar hueco',
  nodes: nodos,
  connections: {
    'Lo llama el asesor': { main: [[{ node: 'Citas de ese día', type: 'main', index: 0 }]] },
    'Citas de ese día': { main: [[{ node: 'Comprobar solape', type: 'main', index: 0 }]] },
  },
  settings: { executionOrder: 'v1' },
}, null, 2));

console.log(`Escrito en ${DESTINO}`);
