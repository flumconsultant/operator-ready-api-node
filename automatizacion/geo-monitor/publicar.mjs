// Sube geo-monitor.n8n.json al workflow «GEO TRACKER BCP» de n8n, con las
// credenciales que ya existen en la instancia asignadas por nombre.
//   N8N_API_KEY=… [GEO_SHEET_ID=…] node automatizacion/geo-monitor/publicar.mjs
// Sin GEO_SHEET_ID conserva el ID que ya tenga el workflow publicado.
import { readFileSync } from 'node:fs';

const BASE = process.env.N8N_URL || 'https://n8n.srv836595.hstgr.cloud';
const WORKFLOW_ID = process.env.N8N_WORKFLOW_ID || 'dS2FTRZuU8eNPTL5';
const KEY = process.env.N8N_API_KEY;
if (!KEY) throw new Error('Falta N8N_API_KEY');

// Nodo → credencial de la instancia. Las de tipo predefinido sustituyen al
// Header/Query Auth genérico: la credencial ya sabe en qué cabecera va la key.
const CREDENCIALES = {
  Claude: { tipo: 'anthropicApi', nombre: 'LLM BCP' },
  Gemini: { tipo: 'googlePalmApi', nombre: 'GEMINI BCP' },
  'AI Overview (búsqueda)': { tipo: 'serpApi', nombre: 'SerpAPI account' },
  'AI Overview (página)': { tipo: 'serpApi', nombre: 'SerpAPI account' }
  // ChatGPT y Perplexity: sin credencial BCP en la instancia; se asignan a mano.
};
const CREDENCIAL_SHEETS = 'BCP Google Sheet';

const api = async (ruta, opciones = {}) => {
  const r = await fetch(BASE + '/api/v1' + ruta, {
    ...opciones,
    headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json', ...(opciones.headers || {}) }
  });
  const cuerpo = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${opciones.method || 'GET'} ${ruta}: ${r.status} ${cuerpo.message || ''}`);
  return cuerpo;
};

const wf = JSON.parse(readFileSync(new URL('geo-monitor.n8n.json', import.meta.url), 'utf8'));
const actual = await api('/workflows/' + WORKFLOW_ID);
const credenciales = (await api('/credentials?limit=250')).data;
const buscar = (tipo, nombre) => {
  const c = credenciales.find(x => x.type === tipo && x.name === nombre);
  if (!c) throw new Error(`No existe la credencial ${tipo} «${nombre}»`);
  return { id: c.id, name: c.name };
};

const sheetActual = (actual.nodes || []).find(n => n.type === 'n8n-nodes-base.googleSheets')?.parameters?.documentId?.value;
const sheetId = process.env.GEO_SHEET_ID || sheetActual;

for (const n of wf.nodes) {
  // Lo que ya se asignó a mano en n8n se conserva.
  const previo = (actual.nodes || []).find(x => x.name === n.name);
  if (n.type === 'n8n-nodes-base.googleSheets') {
    if (sheetId) n.parameters.documentId.value = sheetId;
    n.credentials = previo?.credentials || { googleSheetsOAuth2Api: buscar('googleSheetsOAuth2Api', CREDENCIAL_SHEETS) };
  }
  const c = CREDENCIALES[n.name];
  if (c) {
    delete n.parameters.genericAuthType;
    n.parameters.authentication = 'predefinedCredentialType';
    n.parameters.nodeCredentialType = c.tipo;
    n.credentials = { [c.tipo]: buscar(c.tipo, c.nombre) };
  } else if (previo?.credentials && n.type === 'n8n-nodes-base.httpRequest') {
    n.credentials = previo.credentials;
  }
}

const r = await api('/workflows/' + WORKFLOW_ID, {
  method: 'PUT',
  body: JSON.stringify({ name: actual.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings })
});
const sinCredencial = r.nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest' && !n.credentials).map(n => n.name);
console.log(`«${r.name}» actualizado: ${r.nodes.length} nodos, activo=${r.active}`);
console.log('Sheet:', sheetId && sheetId !== 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET' ? sheetId : 'PENDIENTE');
if (sinCredencial.length) console.log('Sin credencial:', sinCredencial.join(', '));
