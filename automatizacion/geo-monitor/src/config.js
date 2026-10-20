// ═══════════════════════════════════════════════════════════════════════════
//  MARCA Y COMPETIDORES. Lo usan «Armar fila» (dominios propios → citado_bcp)
//  y «Dashboard» (ranking y fuentes). Los modelos de cada motor están en el body
//  de su nodo HTTP.
// ═══════════════════════════════════════════════════════════════════════════
const CONFIG = {
  marca: {
    nombre: 'BCP',
    alias: ['BCP', 'Banco de Crédito del Perú', 'Banco de Crédito', 'Banco de Credito', 'ViaBCP', 'Via BCP'],
    dominios: ['viabcp.com', 'bcp.com.pe']
  },
  competidores: [
    { nombre: 'Interbank', alias: ['Interbank'] },
    { nombre: 'BBVA', alias: ['BBVA', 'BBVA Perú', 'BBVA Continental', 'Banco Continental'] },
    { nombre: 'Scotiabank', alias: ['Scotiabank', 'Scotia'] },
    { nombre: 'BanBif', alias: ['BanBif', 'Banbif', 'Banco Interamericano de Finanzas'] },
    { nombre: 'Pichincha', alias: ['Pichincha', 'Banco Pichincha'] },
    { nombre: 'Banco de la Nación', alias: ['Banco de la Nación', 'Banco de la Nacion', 'BN'] }
  ]
};
// ═══════════════════════════════════════════════════════════════════════════

const MOTORES = [
  { key: 'chatgpt', label: 'ChatGPT', color: '#10A37F' },
  { key: 'claude', label: 'Claude', color: '#D97757' },
  { key: 'gemini', label: 'Gemini', color: '#4285F4' },
  { key: 'perplexity', label: 'Perplexity', color: '#20808D' },
  { key: 'ai_overview', label: 'AI Overview', color: '#FBBC04' }
];

