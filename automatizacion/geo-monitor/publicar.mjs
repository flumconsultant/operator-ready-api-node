// Sube los dos workflows a n8n por la API, con el Sheet y las credenciales que
// ya existen en la instancia asignadas por nombre.
//   N8N_API_KEY=… [GEO_SHEET_ID=…] node automatizacion/geo-monitor/publicar.mjs
// La Corrida reemplaza el workflow «GEO TRACKER BCP» (dS2FTRZuU8eNPTL5); la API
// se busca por nombre y se crea si no existe. Los dos quedan como estaban de
// activos. Sin GEO_SHEET_ID se conserva el ID ya publicado.
import { readFileSync } from 'node:fs';

const BASE = process.env.N8N_URL || 'https://n8n.srv836595.hstgr.cloud';
const KEY = process.env.N8N_API_KEY;
if (!KEY) throw new Error('Falta N8N_API_KEY');

const WORKFLOWS = [
  { archivo: 'geo-corrida.n8n.json', id: process.env.N8N_CORRIDA_ID || 'dS2FTRZuU8eNPTL5' },
  { archivo: 'geo-api.n8n.json' }
];

// Nodo → credencial de la instancia.
const SHEETS = { googleSheetsOAuth2Api: process.env.GEO_SHEETS_CREDENCIAL || 'Google Sheets account' };
const GEMINI = { googlePalmApi: 'GEMINI BCP' };
const SERPAPI = { serpApi: 'SerpAPI account' };
const CREDENCIALES = {
  Claude: { anthropicApi: 'LLM BCP' },
  Gemini: GEMINI,
  'Gemini · analista': GEMINI,
  'Google (SerpAPI)': SERPAPI,
  'AI Overview (página)': SERPAPI
  // ChatGPT y Perplexity: sin credencial BCP en la instancia; se asignan a mano
  // en n8n y se conservan al volver a publicar.
};

const api = async (ruta, opciones = {}) => {
  const r = await fetch(BASE + '/api/v1' + ruta, {
    ...opciones,
    headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json' }
  });
  const cuerpo = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${opciones.method || 'GET'} ${ruta}: ${r.status} ${cuerpo.message || ''}`);
  return cuerpo;
};

const credenciales = (await api('/credentials?limit=250')).data;
const credencial = mapa => {
  const [tipo, nombre] = Object.entries(mapa)[0];
  const c = credenciales.find(x => x.type === tipo && x.name === nombre);
  if (!c) throw new Error(`No existe la credencial ${tipo} «${nombre}»`);
  return { [tipo]: { id: c.id, name: c.name } };
};
const todos = (await api('/workflows?limit=250')).data;

let sheetId = process.env.GEO_SHEET_ID;
for (const w of WORKFLOWS) {
  const wf = JSON.parse(readFileSync(new URL(w.archivo, import.meta.url), 'utf8'));
  const existente = w.id ? await api('/workflows/' + w.id) : todos.find(x => x.name === wf.name);
  const previos = existente?.nodes || [];
  sheetId ||= previos.find(n => n.type === 'n8n-nodes-base.googleSheets')?.parameters?.documentId?.value;

  for (const n of wf.nodes) {
    if (n.type === 'n8n-nodes-base.googleSheets') {
      if (sheetId) n.parameters.documentId.value = sheetId;
      n.credentials = credencial(SHEETS);
    } else if (CREDENCIALES[n.name]) {
      n.credentials = credencial(CREDENCIALES[n.name]);
    } else {
      const previo = previos.find(x => x.name === n.name);
      if (previo?.credentials) n.credentials = previo.credentials;
    }
  }

  const cuerpo = JSON.stringify({ name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings });
  const r = existente
    ? await api('/workflows/' + existente.id, { method: 'PUT', body: cuerpo })
    : await api('/workflows', { method: 'POST', body: cuerpo });
  const sinCredencial = r.nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest' && !n.credentials).map(n => n.name);
  console.log(`«${r.name}» ${existente ? 'actualizado' : 'creado'}: ${r.nodes.length} nodos, activo=${r.active}`);
  console.log(`  ${BASE}/workflow/${r.id}`);
  if (sinCredencial.length) console.log('  Sin credencial:', sinCredencial.join(', '));
}
console.log('Sheet:', sheetId && sheetId !== 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET' ? sheetId : 'PENDIENTE');
