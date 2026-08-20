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
    'Convertimos la IA en una capacidad propia de tu empresa: capacitación aplicada, estrategia y construcción de soluciones que quedan funcionando.',
    '/en',
  ],
  '/es/servicios': [
    'Servicios de IA para empresas | BECOME',
    'Tres formas de empezar: capacitar a tu equipo en IA, definir la estrategia o construir la solución. Por separado o en secuencia.',
    '/en/services',
  ],
  '/es/servicios/become-now': [
    'Capacitación en IA aplicada para empresas | BECOME NOW™',
    'Programas in company de ChatGPT, Claude y Gemini diseñados sobre los procesos, documentos y casos reales de cada área.',
    '/en/services/become-now',
  ],
  '/es/servicios/become-discover': [
    'Estrategia de IA y modelo operativo | BECOME DISCOVER™',
    'Ocho a doce semanas para saber dónde está el valor de la IA en tu negocio, qué se hace primero y cómo debe operar la empresa.',
    '/en/services/become-discover',
  ],
  '/es/servicios/become-embed': [
    'Construcción de soluciones de IA | BECOME EMBED™',
    'Construimos la solución de IA con tu equipo y la dejamos funcionando dentro de la operación, con adopción y control medidos.',
    '/en/services/become-embed',
  ],
  '/es/framework': [
    'BECOME Framework — Cómo trabajamos | BECOME',
    'Seis etapas de la ambición al valor, atravesando los cinco sistemas que deciden si la IA queda instalada: personas, datos, agents, productos y operaciones.',
    '/en/framework',
  ],
  '/es/nosotros': [
    'Nosotros — Consultora AI-native | BECOME',
    'BECOME conecta estrategia, diseño del modelo operativo, construcción y adopción en un solo sistema. Qué creemos y cómo trabajamos.',
    '/en/about',
  ],
  '/es/soluciones': [
    'Soluciones de IA para empresas | BECOME',
    'Seis necesidades de negocio y qué necesita cada una: escalar más allá de los pilotos, preparar equipos, rediseñar procesos, agentes con control, productos con IA y medir el valor.',
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
    'Contacto | BECOME',
    'Cuéntanos qué necesita cambiar en tu empresa. Respondemos con el punto de partida adecuado, no con una secuencia comercial.',
    '/en/contact',
  ],
  '/es/privacidad': [
    'Política de privacidad | BECOME',
    'Cómo BECOME trata los datos personales que recibe a través de este sitio.',
    '/en/privacy',
  ],
  '/es/terminos': [
    'Términos de uso | BECOME',
    'Condiciones bajo las que se ofrece el contenido de este sitio.',
    '/en/terms',
  ],

  /* ---------------------------------------------------------------- inglés */
  '/en': [
    'BECOME — AI-native transformation company',
    'We turn AI into a capability your company owns: applied training, strategy and solutions built to keep running inside the operation.',
    '/es',
  ],
  '/en/services': [
    'AI services for companies | BECOME',
    'Three ways to start: train your team on AI, define the strategy, or build the capability. Separately or in sequence.',
    '/es/servicios',
  ],
  '/en/services/become-now': [
    'Applied AI training for teams | BECOME NOW™',
    'In-company programs on ChatGPT, Claude and Gemini, designed around each area’s real processes, documents and cases.',
    '/es/servicios/become-now',
  ],
  '/en/services/become-discover': [
    'AI strategy and operating model | BECOME DISCOVER™',
    'Eight to twelve weeks to know where AI value sits in your business, what to do first, and how the company must operate to sustain it.',
    '/es/servicios/become-discover',
  ],
  '/en/services/become-embed': [
    'Build AI capabilities that stay | BECOME EMBED™',
    'We build the AI capability with your team and leave it running inside the operation, with adoption and control measured.',
    '/es/servicios/become-embed',
  ],
  '/en/framework': [
    'BECOME Framework — How we work | BECOME',
    'Six stages from ambition to value, crossing the five systems that decide whether AI stays installed: people, data, agents, products and operations.',
    '/es/framework',
  ],
  '/en/about': [
    'About — AI-native transformation company | BECOME',
    'BECOME connects strategy, operating-model design, building and adoption in one system. What we believe and how we work.',
    '/es/nosotros',
  ],
  '/en/solutions': [
    'AI solutions for companies | BECOME',
    'Six business needs and what each one takes: scaling beyond pilots, preparing teams, redesigning workflows, governed agents, AI-enabled products and measuring value.',
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
    'Contact | BECOME',
    'Tell us what needs to change in your company. We respond with the right starting point, not a sales sequence.',
    '/es/contacto',
  ],
  '/en/privacy': [
    'Privacy policy | BECOME',
    'How BECOME handles the personal data it receives through this site.',
    '/es/privacidad',
  ],
  '/en/terms': [
    'Terms of use | BECOME',
    'The conditions under which this site’s content is offered.',
    '/es/terminos',
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
