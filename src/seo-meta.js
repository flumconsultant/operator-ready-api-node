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
export const OG_IMAGE = `${SITE}/images/01-neural-network.webp`;

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
    'BECOME — Consultoría de transformación con IA',
    'BECOME transforma IA, LLMs y AI agents en capacidades empresariales: estrategia, adopción, workflows, tecnología y governance para organizaciones AI-native.',
    '/en',
  ],
  '/es/servicios': [
    'Servicios de IA para empresas | BECOME',
    'Tres formas de empezar: capacitar a tu equipo en IA, definir la estrategia o construir la solución. Por separado o en secuencia.',
    '/en/services',
  ],
  '/es/servicios/become-now': [
    'Capacitación en IA aplicada para empresas | BECOME NOW™',
    'Programas de IA aplicada para empresas sobre workflows reales con ChatGPT, Claude, Gemini, Microsoft Copilot y otros LLMs autorizados.',
    '/en/services/become-now',
  ],
  '/es/servicios/become-discover': [
    'Estrategia de IA y modelo operativo | BECOME DISCOVER™',
    'Ocho a doce semanas para saber dónde está el valor de la IA en tu negocio, qué se hace primero y cómo debe operar la empresa.',
    '/en/services/become-discover',
  ],
  '/es/servicios/become-embed': [
    'Construcción de soluciones de IA | BECOME EMBED™',
    'Diseñamos y construimos AI agents, copilots y workflows basados en LLMs con datos, APIs, integraciones, evaluación, governance y observabilidad.',
    '/en/services/become-embed',
  ],
  '/es/como-transformamos': [
    'Cómo transformamos con IA — El método | BECOME',
    'Seis etapas de la ambición al valor, atravesando los cinco sistemas que deciden si la IA queda instalada: personas, datos, agents, productos y operaciones.',
    '/en/how-we-transform',
  ],
  '/es/nosotros': [
    'Nosotros — Consultora AI-native | BECOME',
    'BECOME conecta estrategia, diseño del modelo operativo, construcción y adopción en un solo sistema. Qué creemos y cómo trabajamos.',
    '/en/about',
  ],
  '/es/soluciones': [
    'Soluciones de IA para empresas | BECOME',
    'Seis necesidades de negocio y qué exige cada una: escalar más allá de los pilotos, preparar equipos, rediseñar procesos, AI agents con control y medir el valor.',
    '/en/solutions',
  ],
  '/es/nosotros/ia-responsable': [
    'IA responsable: cómo la controlamos | BECOME',
    'Uso de datos, supervisión humana, evaluación, escalamiento, trazabilidad y responsables con nombre. Ocho decisiones que se toman antes de construir.',
    '/en/about/responsible-ai',
  ],
  '/es/insights': [
    'Insights sobre IA aplicada a la empresa | BECOME',
    'Perspectivas sobre modelos operativos AI-native, trabajo con agents, adopción y escalado responsable.',
    '/en/insights',
  ],
  '/es/contacto': [
    'Contacto — Empecemos por lo que quieres cambiar | BECOME',
    'Comparte el reto, el outcome que buscas y el contexto de tu organización. Lo revisamos y te proponemos el siguiente paso de tu transformación con IA.',
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
    'IA y transformación por industria | BECOME',
    'Cómo se aplica la IA en servicios financieros, minería y energía, retail, travel, real estate y salud: dónde está el valor, qué workflows cambian y qué se mide.',
    '/en/industries',
  ],
  '/es/industrias/servicios-financieros': [
    'IA para banca y seguros | BECOME',
    'IA aplicada en servicios financieros: expedientes, crédito y riesgo, KYC, siniestros y cumplimiento, con supervisión humana y trazabilidad desde el diseño.',
    '/en/industries/financial-services',
  ],
  '/es/industrias/mineria-energia': [
    'IA para minería y energía | BECOME',
    'IA aplicada en operaciones intensivas en activos: conocimiento técnico, mantenimiento, informes de turno, permisos y HSE, con la decisión siempre en la persona.',
    '/en/industries/mining-energy',
  ],
  '/es/industrias/retail-consumo': [
    'IA para retail y consumo | BECOME',
    'IA aplicada en retail: contenido de producto a escala, decisiones comerciales semanales, atención al cliente y campañas, con reglas de marca verificables.',
    '/en/industries/retail-consumer',
  ],
  '/es/industrias/travel-hospitality': [
    'IA para travel y hospitality | BECOME',
    'IA aplicada en hotelería, aerolíneas y turismo: atención previa a la reserva, cambios e incidencias, postventa y conocimiento operativo entre turnos.',
    '/en/industries/travel-hospitality',
  ],
  '/es/industrias/real-estate-construction': [
    'IA para real estate y construcción | BECOME',
    'IA aplicada en proyectos inmobiliarios y de construcción: contratos y adendas, expedientes técnicos y permisos, órdenes de cambio, licitaciones y postventa.',
    '/en/industries/real-estate-construction',
  ],
  '/es/industrias/healthcare-life-sciences': [
    'IA para salud y life sciences | BECOME',
    'IA aplicada a los procesos administrativos que rodean la atención: admisión, autorizaciones, facturación, compras y formación. Sin diagnóstico ni tratamiento.',
    '/en/industries/healthcare-life-sciences',
  ],

  /* ---------------------------------------------------------------- inglés */
  '/en': [
    'BECOME — AI-native transformation company',
    'BECOME turns AI, LLMs and AI agents into enterprise capabilities through strategy, adoption, workflows, technology and governance.',
    '/es',
  ],
  '/en/services': [
    'AI services for companies | BECOME',
    'Three ways to start: train your team on AI, define the strategy, or build the capability. Separately or in sequence.',
    '/es/servicios',
  ],
  '/en/services/become-now': [
    'Applied AI training for teams | BECOME NOW™',
    'Applied enterprise AI programs built around real workflows using ChatGPT, Claude, Gemini, Microsoft Copilot and other approved LLMs.',
    '/es/servicios/become-now',
  ],
  '/en/services/become-discover': [
    'AI strategy and operating model | BECOME DISCOVER™',
    'Eight to twelve weeks to know where AI value sits in your business, what to do first, and how the company must operate to sustain it.',
    '/es/servicios/become-discover',
  ],
  '/en/services/become-embed': [
    'Build AI capabilities that stay | BECOME EMBED™',
    'We design and build AI agents, copilots and LLM-powered workflows with enterprise data, APIs, integrations, evaluation, governance and observability.',
    '/es/servicios/become-embed',
  ],
  '/en/how-we-transform': [
    'How we transform with AI — The method | BECOME',
    'Six stages from ambition to value, crossing the five systems that decide whether AI stays installed: people, data, agents, products and operations.',
    '/es/como-transformamos',
  ],
  '/en/about': [
    'About — AI-native transformation company | BECOME',
    'BECOME connects strategy, operating-model design, building and adoption in one system. What we believe and how we work.',
    '/es/nosotros',
  ],
  '/en/solutions': [
    'AI solutions for companies | BECOME',
    'Six business needs and what each takes: scaling beyond pilots, preparing teams, redesigning workflows, governed AI agents and measuring value.',
    '/es/soluciones',
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
    'Contact — Start with what you want to change | BECOME',
    'Share the challenge, the outcome you are aiming for and your organization’s context. We review it and recommend the next step for your AI transformation.',
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
    'AI and transformation by industry | BECOME',
    'How AI applies across financial services, mining and energy, retail, travel, real estate and healthcare: where the value sits and which workflows change.',
    '/es/industrias',
  ],
  '/en/industries/financial-services': [
    'AI for banking and insurance | BECOME',
    'Applied AI in financial services: file analysis, credit and risk, KYC, claims and compliance, with human oversight and traceability designed in from the start.',
    '/es/industrias/servicios-financieros',
  ],
  '/en/industries/mining-energy': [
    'AI for mining and energy | BECOME',
    'Applied AI in asset-intensive operations: technical knowledge, maintenance, shift reporting, permits and HSE, with the decision always left to the person.',
    '/es/industrias/mineria-energia',
  ],
  '/en/industries/retail-consumer': [
    'AI for retail and consumer | BECOME',
    'Applied AI in retail: product content at scale, weekly commercial decisions, customer service and campaigns, against verifiable brand rules.',
    '/es/industrias/retail-consumo',
  ],
  '/en/industries/travel-hospitality': [
    'AI for travel and hospitality | BECOME',
    'Applied AI in hotels, airlines and tour operators: pre-booking service, changes and disruption, after-sales and operational knowledge across shifts.',
    '/es/industrias/travel-hospitality',
  ],
  '/en/industries/real-estate-construction': [
    'AI for real estate and construction | BECOME',
    'Applied AI in property and construction projects: contracts and amendments, technical files and permits, change orders, tenders and after-sales.',
    '/es/industrias/real-estate-construction',
  ],
  '/en/industries/healthcare-life-sciences': [
    'AI for healthcare and life sciences | BECOME',
    'Applied AI for the administrative work around care: admissions, authorisations, billing, procurement and enablement. No diagnosis and no treatment.',
    '/es/industrias/healthcare-life-sciences',
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
  if (path.startsWith('/es/soluciones/')) {
    const en = SLUG_ES_A_EN[path.slice('/es/soluciones/'.length)];
    if (en) return `/en/solutions/${en}`;
  }
  if (path.startsWith('/en/solutions/')) {
    const es = SLUG_EN_A_ES[path.slice('/en/solutions/'.length)];
    if (es) return `/es/soluciones/${es}`;
  }

  return langOf(path) === 'en' ? '/es' : '/en';
}
