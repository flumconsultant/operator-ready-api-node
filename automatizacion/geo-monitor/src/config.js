// ═══════════════════════════════════════════════════════════════════════════
//  CONFIGURACIÓN — lo único que deberías tocar en este nodo es este bloque.
// ═══════════════════════════════════════════════════════════════════════════
const CONFIG = {
  marca: {
    nombre: 'BCP',
    alias: ['BCP', 'Banco de Crédito del Perú', 'Banco de Crédito', 'Banco de Credito', 'ViaBCP', 'Via BCP'],
    dominios: ['viabcp.com', 'bcp.com.pe']
  },
  competidores: [
    { nombre: 'Interbank', alias: ['Interbank'], dominios: ['interbank.pe'] },
    { nombre: 'BBVA', alias: ['BBVA', 'BBVA Perú', 'BBVA Continental', 'Banco Continental'], dominios: ['bbva.pe'] },
    { nombre: 'Scotiabank', alias: ['Scotiabank', 'Scotia'], dominios: ['scotiabank.com.pe'] },
    { nombre: 'BanBif', alias: ['BanBif', 'Banbif', 'Banco Interamericano de Finanzas'], dominios: ['banbif.com.pe'] },
    { nombre: 'Pichincha', alias: ['Pichincha', 'Banco Pichincha'], dominios: ['pichincha.pe'] },
    { nombre: 'Banco de la Nación', alias: ['Banco de la Nación', 'Banco de la Nacion', 'BN'], dominios: ['bn.com.pe'] }
  ],
  // Si un motor da error de modelo, cambia el nombre aquí.
  modelos: {
    chatgpt: 'gpt-4o-search-preview',
    claude: 'claude-sonnet-4-5',
    gemini: 'gemini-2.5-flash',
    perplexity: 'sonar'
  },
  // Palabras a cada lado de una mención de la marca que cuentan para el sentimiento.
  ventana_sentimiento: 12,
  zona_horaria: 'America/Lima'
};
// ═══════════════════════════════════════════════════════════════════════════

const MOTORES = [
  { key: 'chatgpt', label: 'ChatGPT', color: '#10A37F' },
  { key: 'claude', label: 'Claude', color: '#D97757' },
  { key: 'gemini', label: 'Gemini', color: '#4285F4' },
  { key: 'perplexity', label: 'Perplexity', color: '#20808D' },
  { key: 'ai_overview', label: 'AI Overview', color: '#FBBC04' }
];

// Qué disparador arrancó esta ejecución decide la ruta del nodo «Ruta».
function rutaDeEjecucion(ejecutado, leer) {
  if (ejecutado('Webhook geo-dashboard')) return { ruta: 'dashboard', peticion: leer('Webhook geo-dashboard').query || {} };
  if (ejecutado('Webhook geo-prompts')) return { ruta: 'prompts', peticion: leer('Webhook geo-prompts').query || {} };
  if (ejecutado('Webhook geo-prompts-save')) return { ruta: 'guardar', peticion: leer('Webhook geo-prompts-save').body || {} };
  if (ejecutado('Webhook geo-run')) return { ruta: 'ejecutar_webhook', peticion: leer('Webhook geo-run').body || {} };
  return { ruta: 'ejecutar_diario', peticion: {} };
}

function fechaLocal(d, zona) {
  // en-CA da AAAA-MM-DD.
  return d.toLocaleDateString('en-CA', { timeZone: zona });
}
