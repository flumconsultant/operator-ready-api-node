// ═══════════════════════════════════════════════════════════════════════════
//  MARCA Y COMPETIDORES. Lo usan «Armar fila» (dominios propios → citado_bcp),
//  «Dashboard» y «Datos del monitor» (ranking, fuentes, categorías). Los
//  modelos de cada motor están en el body de su nodo HTTP.
// ═══════════════════════════════════════════════════════════════════════════
const CONFIG = {
  marca: {
    nombre: 'BCP',
    alias: ['BCP', 'Banco de Crédito del Perú', 'Banco de Crédito', 'Banco de Credito', 'ViaBCP', 'Via BCP'],
    dominios: ['viabcp.com', 'bcp.com.pe'],
    color: '#1a1a4e'
  },
  competidores: [
    { nombre: 'Interbank', alias: ['Interbank'], dominios: ['interbank.pe'], color: '#8b5cf6' },
    { nombre: 'BBVA', alias: ['BBVA', 'BBVA Perú', 'BBVA Continental', 'Banco Continental'], dominios: ['bbva.pe', 'bbva.com'], color: '#f59e0b' },
    { nombre: 'Scotiabank', alias: ['Scotiabank', 'Scotia'], dominios: ['scotiabank.com.pe'], color: '#10b981' },
    { nombre: 'BanBif', alias: ['BanBif', 'Banbif', 'Banco Interamericano de Finanzas'], dominios: ['banbif.com.pe'], color: '#0ea5e9' },
    { nombre: 'Pichincha', alias: ['Pichincha', 'Banco Pichincha'], dominios: ['pichincha.pe'], color: '#eab308' },
    { nombre: 'Banco de la Nación', alias: ['Banco de la Nación', 'Banco de la Nacion', 'BN'], dominios: ['bn.com.pe'], color: '#64748b' },
    { nombre: 'Mibanco', alias: ['Mibanco', 'Mi Banco'], dominios: ['mibanco.com.pe'], color: '#22c55e' },
    { nombre: 'Falabella', alias: ['Falabella', 'Banco Falabella'], dominios: ['bancofalabella.pe'], color: '#84cc16' },
    { nombre: 'Ripley', alias: ['Ripley', 'Banco Ripley'], dominios: ['bancoripley.com.pe'], color: '#a855f7' },
    { nombre: 'Comercio', alias: ['Banco de Comercio'], dominios: ['bancomercio.com'], color: '#94a3b8' }
  ],
  // Clasificación semilla de dominios (SPEC v2, anexo A). Se corrige o amplía
  // en la pestaña «_dominios» del Sheet; lo que no está aquí ni allí se
  // clasifica por reglas (gob.pe → gobierno, wikipedia → enciclopedia…).
  dominios: {
    'sbs.gob.pe': 'government_ngo', 'gob.pe': 'government_ngo', 'bcrp.gob.pe': 'government_ngo', 'indecopi.gob.pe': 'government_ngo',
    'rankia.pe': 'community_forum', 'reddit.com': 'community_forum',
    'es.wikipedia.org': 'encyclopedia', 'en.wikipedia.org': 'encyclopedia',
    'youtube.com': 'video', 'tiktok.com': 'video',
    'facebook.com': 'social', 'instagram.com': 'social', 'linkedin.com': 'social', 'x.com': 'social', 'twitter.com': 'social',
    'elcomercio.pe': 'news_media', 'gestion.pe': 'news_media', 'larepublica.pe': 'news_media', 'infobae.com': 'news_media',
    'rpp.pe': 'news_media', 'andina.pe': 'news_media', 'cincodias.elpais.com': 'news_media', 'as.com': 'news_media',
    'peru-retail.com': 'news_media', 'semanaeconomica.com': 'news_media',
    'mifinguia.com': 'comparator', 'comparabanca.com': 'comparator', 'comparabancaperu.com': 'comparator',
    'comparabien.com.pe': 'comparator', 'rankingslatam.com': 'comparator', 'merco.info': 'comparator'
  },
  // Atributos que el Analista puede asociar a cada banco (perfil de marca).
  atributos: ['seguridad', 'tamaño y liderazgo', 'app y canales digitales', 'tasas', 'comisiones', 'atención al cliente',
    'cobertura y agencias', 'empleador', 'innovación', 'solidez financiera', 'beneficios y promociones', 'requisitos y facilidad']
};
// ═══════════════════════════════════════════════════════════════════════════

const MOTORES = [
  { key: 'chatgpt', label: 'ChatGPT', color: '#10A37F' },
  { key: 'claude', label: 'Claude', color: '#D97757' },
  { key: 'gemini', label: 'Gemini', color: '#4285F4' },
  { key: 'perplexity', label: 'Perplexity', color: '#20808D' },
  { key: 'ai_overview', label: 'AI Overview', color: '#FBBC04' }
];
