/**
 * Título y descripción de cada página, y su equivalente en el otro idioma.
 *
 * Vive en su propio archivo porque lo leen dos cosas que no se hablan entre
 * sí: el script que genera el HTML de cada ruta al compilar (scripts/seo.mjs)
 * y la aplicación, que actualiza el título al navegar sin recargar. Escritos
 * dos veces, se habrían separado a la primera corrección — y el síntoma sería
 * que la pestaña del navegador dice una cosa y Google indexa otra.
 *
 * Solo están aquí las rutas fijas. Las de programa y caso de uso salen de su
 * contenido, que ya tiene un titular y un resumen por slug: repetirlos aquí
 * sería mantener el mismo texto en dos sitios.
 *
 * Sobre la longitud: los títulos van por debajo de ~60 caracteres y las
 * descripciones por debajo de ~155, que es donde los buscadores cortan. Pasarse
 * no penaliza, pero la frase que se lleva el clic queda a medias.
 */

import { SLUG_ES_A_EN, SLUG_EN_A_ES } from './content/soluciones-slugs.js';

export const SITE = 'https://meetbecome.com';
export const BRAND = 'BECOME';

/* La imagen que acompaña al enlace cuando se comparte en redes o mensajería. */
/* La imagen que se ve al compartir cualquier página que no sea un artículo.
 *
 * En JPEG y no en WebP. WhatsApp no dibuja una vista previa en WebP y LinkedIn
 * la dibuja unas veces sí y otras no: el enlace aparece desnudo, y un enlace
 * desnudo se pulsa mucho menos. Daba igual lo bien que estuviera la imagen si
 * el sitio donde se comparte no la enseña.
 *
 * Es la misma tarjeta que llevan los artículos —misma retícula, misma
 * tipografía, mismo pie— generada con `scripts/tarjeta-social.mjs`, para que
 * compartir cualquier página se reconozca como BECOME antes de leer el
 * nombre. */
export const OG_IMAGE = `${SITE}/images/tarjetas/become.jpg`;

/**
 * Cada entrada: [título, descripción, ruta equivalente en el otro idioma].
 *
 * El tercer campo es lo que permite declarar hreflang, que es lo que le dice a
 * un buscador que /es/nosotros y /en/about no son dos páginas compitiendo por
 * lo mismo, sino la misma página en dos idiomas. Sin eso, las versiones se
 * canibalizan en los resultados.
 */
export const PAGES = {
  /* ---------------------------------------------------------------- español */
  '/es': [
    'Consultoría de transformación con IA para empresas | BECOME',
    'BECOME convierte la IA en capacidad empresarial: estrategia, capacitación, agentes, procesos y adopción para cambiar cómo una empresa decide y opera.',
    '/en',
  ],
  '/es/servicios': [
    'Servicios de IA para empresas: NOW, DISCOVER y EMBED | BECOME',
    'Tres formas de avanzar con IA: capacitar equipos, definir la estrategia y el modelo operativo, o construir una capacidad dentro de la operación.',
    '/en/services',
  ],
  '/es/servicios/become-now': [
    'Capacitación en IA aplicada para empresas | BECOME NOW™',
    'Programas de IA aplicada para empresas sobre procesos reales con ChatGPT, Claude, Gemini, Microsoft Copilot y otros LLMs autorizados.',
    '/en/services/become-now',
  ],
  '/es/servicios/become-discover': [
    'Estrategia de IA y modelo operativo | BECOME DISCOVER™',
    'Define dónde está el valor de la IA, qué capacidades priorizar y qué modelo operativo, gobernanza y hoja de ruta necesita tu empresa.',
    '/en/services/become-discover',
  ],
  '/es/servicios/become-embed': [
    'Implementación de agentes y soluciones de IA | BECOME EMBED™',
    'Diseñamos e implementamos agentes, copilotos y procesos basados en LLMs con datos, APIs, integraciones, controles, observabilidad y transferencia.',
    '/en/services/become-embed',
  ],
  '/es/como-transformamos': [
    'Metodología de transformación con IA | BECOME',
    'El método BECOME para pasar de una ambición de IA a una capacidad operativa: cinco sistemas, seis etapas, controles y medición.',
    '/en/how-we-transform',
  ],
  '/es/nosotros': [
    'BECOME | Transformación AI-native para empresas',
    'BECOME conecta negocio, transformación, tecnología y adopción para convertir la IA en capacidades que las empresas puedan operar y evolucionar.',
    '/en/about',
  ],
  '/es/casos-de-uso': [
    'Casos de uso de IA para empresas | BECOME',
    'Cómo escalar pilotos, preparar equipos, rediseñar procesos, implementar agentes con control, crear productos con IA y medir su valor.',
    '/en/use-cases',
  ],
  '/es/nosotros/ia-responsable': [
    'IA responsable: cómo la controlamos | BECOME',
    'Uso de datos, supervisión humana, evaluación, escalamiento, trazabilidad y responsables con nombre. Ocho decisiones que se toman antes de construir.',
    '/en/about/responsible-ai',
  ],
  '/es/insights': [
    'Insights de IA para empresas | BECOME',
    'Análisis de BECOME sobre agentes de IA, procesos, modelos operativos, adopción, gobernanza y creación de valor empresarial.',
    '/en/insights',
  ],
  '/es/contacto': [
    'Contacto: consultoría de IA para empresas | BECOME',
    'Comparte el reto, el resultado que buscas y el contexto de tu organización. Lo revisamos y orientamos la primera conversación.',
    '/en/contact',
  ],
  '/es/privacidad': [
    'Política de privacidad | BECOME',
    'Cómo BECOME (FLUM E.I.R.L.) recoge, usa, conserva y comparte los datos personales que recibe en meetbecome.com, y cómo ejercer tus derechos ARCO en Perú.',
    '/en/privacy',
  ],
  '/es/terminos': [
    'Términos de uso | BECOME',
    'Condiciones bajo las que BECOME (FLUM E.I.R.L.) ofrece el contenido, los servicios y los formularios de meetbecome.com: propiedad intelectual y responsabilidad.',
    '/en/terms',
  ],
  '/es/cookies': [
    'Política de cookies | BECOME',
    'Qué guarda este sitio en tu navegador, cuánto dura cada cosa y cómo aceptar o rechazar la medición con Google Analytics en un clic.',
    '/en/cookies',
  ],

  '/es/industrias': [
    'IA por industria: banca, minería, retail y más | BECOME',
    'IA aplicada a banca, minería, retail, hotelería, inmobiliario, construcción y salud. Casos, procesos, controles y métricas específicos por industria.',
    '/en/industries',
  ],
  '/es/industrias/banca-seguros-fintech': [
    'IA para banca, seguros y fintech | BECOME',
    'IA aplicada a crédito, fraude, operaciones, KYC, LA/FT, siniestros, cobranza, conciliaciones, reclamos y canales digitales.',
    '/en/industries/banking-insurance-fintech',
  ],
  '/es/industrias/mineria-energia': [
    'IA para minería y operaciones mineras | BECOME',
    'IA aplicada a planeamiento mina, perforación y voladura, carguío y acarreo, chancado, molienda, flotación, mantenimiento, paradas y conocimiento operativo.',
    '/en/industries/mining-energy',
  ],
  '/es/industrias/retail-consumo-masivo': [
    'IA para retail y consumo masivo | BECOME',
    'IA aplicada a surtido, inventario, precios, promociones, catálogo, e-commerce, pedidos, delivery, retiro en tienda, devoluciones y atención.',
    '/en/industries/retail-consumer-goods',
  ],
  '/es/industrias/turismo-hoteleria': [
    'IA para turismo y hotelería | BECOME',
    'IA para reservas, revenue, atención al huésped, check-in, housekeeping, eventos, reputación, fidelización y operación hotelera.',
    '/en/industries/travel-hospitality',
  ],
  '/es/industrias/inmobiliario-construccion': [
    'IA para inmobiliarias y construcción | BECOME',
    'IA aplicada a terrenos, factibilidad, leads, separaciones, minutas, BIM, RFIs, metrados, valorizaciones, contratos, entrega y postventa.',
    '/en/industries/real-estate-construction',
  ],
  '/es/industrias/salud-farmaceutica': [
    'IA para salud y farmacéutica | BECOME',
    'IA aplicada a citas, admisión, autorizaciones, cartas de garantía, facturación, reembolsos, abastecimiento, documentación y operaciones no clínicas.',
    '/en/industries/healthcare-pharma',
  ],

  /* ---------------------------------------------------------------- inglés */
  '/en': [
    'Enterprise AI Consulting & Transformation | BECOME',
    'BECOME helps enterprises turn AI strategy, tools and pilots into capabilities that teams can operate, govern and improve.',
    '/es',
  ],
  '/en/services': [
    'Enterprise AI Services: NOW, DISCOVER & EMBED | BECOME',
    'Build AI capability, define AI strategy and move priority use cases into operation with BECOME NOW™, DISCOVER™ and EMBED™.',
    '/es/servicios',
  ],
  '/en/services/become-now': [
    'Enterprise AI Training & Capability Building | BECOME NOW™',
    'Applied enterprise AI training built around real work, processes and decisions using tools such as ChatGPT, Claude, Gemini and Copilot.',
    '/es/servicios/become-now',
  ],
  '/en/services/become-discover': [
    'Enterprise AI Strategy & Roadmap | BECOME DISCOVER™',
    'Identify AI value pools, prioritize use cases, define the target operating model and build a roadmap for enterprise AI transformation.',
    '/es/servicios/become-discover',
  ],
  '/en/services/become-embed': [
    'Enterprise AI Agents & Automation | BECOME EMBED™',
    'Design and implement enterprise AI agents, copilots, RAG, integrations and AI-enabled workflows with controls and human oversight.',
    '/es/servicios/become-embed',
  ],
  '/en/how-we-transform': [
    'AI Transformation Methodology | BECOME',
    'A six-stage method for turning AI opportunities into governed, measurable capabilities embedded in real enterprise work.',
    '/es/como-transformamos',
  ],
  '/en/about': [
    'BECOME | AI-Native Enterprise Transformation',
    'BECOME is an AI-native transformation company connecting business, people, data and technology to build enterprise capability from the inside.',
    '/es/nosotros',
  ],
  '/en/use-cases': [
    'Enterprise AI Use Cases | BECOME',
    'Explore enterprise AI use cases across agents, critical workflows, products, team capability, governance and measurable value.',
    '/es/casos-de-uso',
  ],
  '/en/about/responsible-ai': [
    'Responsible AI: how we control it | BECOME',
    'Data use, human oversight, evaluation, escalation, traceability and named owners. Eight decisions made before anything gets built.',
    '/es/nosotros/ia-responsable',
  ],
  '/en/insights': [
    'Insights on applied enterprise AI | BECOME',
    'Perspectives on AI-native operating models, agentic work, adoption and responsible scale.',
    '/es/insights',
  ],
  '/en/contact': [
    'Contact BECOME | Enterprise AI Consulting',
    'Talk with BECOME about AI strategy, capability building, enterprise agents, process redesign or AI transformation.',
    '/es/contacto',
  ],
  '/en/privacy': [
    'Privacy policy | BECOME',
    'How BECOME (FLUM E.I.R.L.) collects, uses, stores and shares the personal data received through meetbecome.com, and how to exercise your data rights.',
    '/es/privacidad',
  ],
  '/en/cookies': [
    'Cookie Policy | BECOME',
    'What this site stores in your browser, how long each item lasts, and how to accept or reject Google Analytics measurement in one click.',
    '/es/cookies',
  ],
  '/en/terms': [
    'Terms of use | BECOME',
    'The conditions under which BECOME (FLUM E.I.R.L.) offers the content, services and forms on meetbecome.com: intellectual property, liability and law.',
    '/es/terminos',
  ],
  '/en/industries': [
    'Enterprise AI by Industry: Banking, Mining, Retail & More | BECOME',
    'Explore how BECOME applies AI transformation to banking, mining, retail, hospitality, real estate, construction, healthcare and pharma.',
    '/es/industrias',
  ],
  '/en/industries/banking-insurance-fintech': [
    'AI for Banking, Insurance & Fintech | BECOME',
    'Apply enterprise AI to credit, fraud, claims, KYC/AML, collections, reconciliation and customer operations with controls and traceability.',
    '/es/industrias/banca-seguros-fintech',
  ],
  '/en/industries/mining-energy': [
    'AI for Mining & Mining Operations | BECOME',
    'Apply AI to mine planning, maintenance, concentrator operations, shutdowns, logistics and operational knowledge with human oversight.',
    '/es/industrias/mineria-energia',
  ],
  '/en/industries/retail-consumer-goods': [
    'AI for Retail & Consumer Goods | BECOME',
    'Apply AI to inventory, category management, e-commerce, marketplace, fulfillment, returns, trade marketing and commercial operations.',
    '/es/industrias/retail-consumo-masivo',
  ],
  '/en/industries/travel-hospitality': [
    'AI for Hotels, Travel & Hospitality | BECOME',
    'Apply AI to reservations, revenue operations, pre-arrival, guest service, housekeeping, no-shows, groups, events and loyalty.',
    '/es/industrias/turismo-hoteleria',
  ],
  '/en/industries/real-estate-construction': [
    'AI for Real Estate & Construction | BECOME',
    'Apply AI across real estate sales, post-sale, project controls, BIM, RFIs, quantities, valuations, contracts and construction operations.',
    '/es/industrias/inmobiliario-construccion',
  ],
  '/en/industries/healthcare-pharma': [
    'AI for Healthcare Operations & Pharma | BECOME',
    'Apply AI to appointments, admission, authorizations, billing, reimbursements, supply, knowledge and administrative healthcare operations.',
    '/es/industrias/salud-farmaceutica',
  ],
};

/** El idioma de una ruta sale de su prefijo; no hay más idiomas que dos. */
export const langOf = (path) => (path.startsWith('/en') ? 'en' : 'es');

/**
 * Metadatos de cualquier ruta, incluidas las de programa y caso de uso.
 * Devuelve null si la ruta no se reconoce, para que quien llame decida.
 */
export function metaFor(path, dinamicas = {}) {
  const fija = PAGES[path];
  if (fija) return { title: fija[0], description: fija[1], alt: fija[2], lang: langOf(path) };
  const din = dinamicas[path];
  return din ? { ...din, lang: langOf(path) } : null;
}

/**
 * La misma página en el otro idioma.
 *
 * El selector ES/EN llevaba a la home del idioma contrario. Tenía sentido
 * cuando el árbol en inglés estaba a medias; hoy las 32 páginas existen en los
 * dos idiomas, y mandar a alguien a la portada por cambiar de idioma le hace
 * perder dónde estaba.
 *
 * Las rutas fijas salen de PAGES, que ya guarda su equivalente. Las de programa
 * comparten el slug en los dos idiomas —finanzas, ventas—, así que basta
 * traducir el tramo del medio. Las de solución NO lo comparten, y para esas hay
 * un mapa. Si algo no encaja, se cae a la home del otro idioma: nunca deja a
 * nadie en una URL que no existe.
 */
const TRAMOS = [
  ['/es/servicios/become-now/', '/en/services/become-now/'],
];

export function equivalenteEnElOtroIdioma(path) {
  const fija = PAGES[path];
  if (fija) return fija[2];

  for (const [es, en] of TRAMOS) {
    if (path.startsWith(es)) return en + path.slice(es.length);
    if (path.startsWith(en)) return es + path.slice(en.length);
  }

  /* Las soluciones son el caso que NO comparte slug: cada idioma tiene el suyo
     —escalar-ia / scale-ai-beyond-pilots— y hace falta el mapa para emparejarlas. */
  if (path.startsWith('/es/casos-de-uso/')) {
    const en = SLUG_ES_A_EN[path.slice('/es/casos-de-uso/'.length)];
    if (en) return `/en/use-cases/${en}`;
  }
  if (path.startsWith('/en/use-cases/')) {
    const es = SLUG_EN_A_ES[path.slice('/en/use-cases/'.length)];
    if (es) return `/es/casos-de-uso/${es}`;
  }

  return langOf(path) === 'en' ? '/es' : '/en';
}
