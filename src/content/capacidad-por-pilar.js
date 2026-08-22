/**
 * De la idea a la operación: qué capacidad de BECOME toca cada artículo.
 *
 * Un artículo que argumenta bien y no dice qué se hace con eso deja al lector
 * de acuerdo y sin siguiente paso. Y al revés: un artículo que termina en una
 * oferta deja de ser un artículo. Este bloque es la línea intermedia — nombra
 * la capacidad, no vende el servicio.
 *
 * ---- Por qué va por pilar y no por artículo ----
 *
 * Porque los artículos los escribe una rutina, sola, cada mañana. Un campo por
 * artículo tendría que rellenarlo esa rutina, y el día que se le olvidara el
 * bloque desaparecería sin que nadie lo notara. El pilar ya lo elige, es
 * obligatorio y está validado: colgando de él, todo artículo futuro trae su
 * bloque sin que nadie se acuerde de nada.
 *
 * Lo lee la página del artículo y también el generador del HTML servido, que
 * es el que ven los rastreadores y los asistentes de IA. Por eso vive aquí, en
 * un módulo plano sin dependencias, y no dentro de un componente.
 */

export const CAPACIDAD_POR_PILAR = {
  'ai-native': {
    es: {
      texto: 'Convertir esta tesis en algo operable empieza por decidir dónde está el valor en tu empresa y qué debe cambiar para capturarlo.',
      enlaces: [['BECOME DISCOVER™', '/es/servicios/become-discover'], ['Cómo transformamos', '/es/como-transformamos']],
    },
    en: {
      texto: 'Turning this thesis into something operable starts by deciding where the value sits in your company and what must change to capture it.',
      enlaces: [['BECOME DISCOVER™', '/en/services/become-discover'], ['How we transform', '/en/how-we-transform']],
    },
  },
  'agentic-work': {
    es: {
      texto: 'Un agente llega a operar cuando alguien define sus límites, sus excepciones y quién responde por el resultado. Eso se diseña y se construye.',
      enlaces: [['BECOME EMBED™', '/es/servicios/become-embed'], ['Agentes de IA con control', '/es/casos-de-uso/agentes-de-ia-con-control']],
    },
    en: {
      texto: 'An agent reaches operation once someone defines its limits, its exceptions and who owns the outcome. That gets designed and built.',
      enlaces: [['BECOME EMBED™', '/en/services/become-embed'], ['Governed AI agents', '/en/use-cases/deploy-governed-ai-agents']],
    },
  },
  'operating-model': {
    es: {
      texto: 'Rediseñar el proceso antes de automatizarlo es trabajo de dirección y de diseño operativo, no de herramienta.',
      enlaces: [['BECOME DISCOVER™', '/es/servicios/become-discover'], ['Rediseñar procesos críticos', '/es/casos-de-uso/redisenar-procesos-criticos']],
    },
    en: {
      texto: 'Redesigning the process before automating it is direction and operating design work, not a tooling decision.',
      enlaces: [['BECOME DISCOVER™', '/en/services/become-discover'], ['Redesign critical workflows', '/en/use-cases/redesign-critical-workflows']],
    },
  },
  'value-adoption': {
    es: {
      texto: 'La adopción no se comunica: se diseña con los equipos que van a operar la capacidad, y se mide contra una línea base.',
      enlaces: [['BECOME NOW™', '/es/servicios/become-now'], ['Medir y gobernar el valor', '/es/casos-de-uso/medir-y-gobernar-valor']],
    },
    en: {
      texto: 'Adoption is not communicated: it is designed with the teams who will operate the capability, and measured against a baseline.',
      enlaces: [['BECOME NOW™', '/en/services/become-now'], ['Measure and govern AI value', '/en/use-cases/measure-and-govern-ai-value']],
    },
  },
  'responsible-scale': {
    es: {
      texto: 'Escalar con control exige decidir antes los límites, la supervisión y la trazabilidad. Añadirlos después es reconstruir.',
      enlaces: [['BECOME EMBED™', '/es/servicios/become-embed'], ['IA responsable', '/es/nosotros/ia-responsable']],
    },
    en: {
      texto: 'Scaling under control means deciding limits, oversight and traceability first. Adding them later means rebuilding.',
      enlaces: [['BECOME EMBED™', '/en/services/become-embed'], ['Responsible AI', '/en/about/responsible-ai']],
    },
  },
};

export const ROTULO_CAPACIDAD = {
  es: 'De la idea a la operación',
  en: 'From the idea to the operation',
};
