/**
 * BECOME NOW™ — Applied AI Enablement.
 *
 * Catorce programas por área, más el material común de la página principal.
 * Va aparte de los componentes por la misma razón que los casos de uso: un
 * programa nuevo debe ser una entrada más en este fichero, no un componente
 * más. Cuando haya CMS, esto es lo que se migra.
 *
 * Regla de contenido que atraviesa todo el servicio: las mallas que se publican
 * son rutas de referencia, no un temario cerrado. Cada página lo dice de forma
 * explícita, porque la promesa del servicio es justo la contraria a la de un
 * catálogo de cursos.
 */

export const TAGLINE = 'Learn today. Apply tomorrow. Build capability that stays.';

export const PROMISE =
  'Tu empresa no aprende IA con ejemplos genéricos. Aprende aplicándola a lo que necesita resolver hoy.';

/* Aviso obligatorio en cada página de programa */
export const PERSONALIZATION_NOTE =
  'Esta malla es una referencia. El programa final se diseña después de entender los procesos, documentos, herramientas, roles y objetivos de tu empresa.';

/* ---- grupos del sub-submenú ---- */
export const PROGRAM_GROUPS = [
  { title: 'Business & Growth', slugs: ['finanzas', 'finanzas-inmobiliarias', 'ventas', 'marketing-comunicaciones', 'customer-service-cx', 'strategy-liderazgo'] },
  { title: 'Operations & People', slugs: ['supply-chain-compras', 'operaciones', 'recursos-humanos', 'legal-compliance-risk', 'project-management-pmo'] },
  { title: 'Product, Data & Technology', slugs: ['product-innovacion', 'data-analytics', 'technology-engineering'] },
];

/* ---- los catorce programas ---- */
export const PROGRAMS = {
  'finanzas': {
    menu: 'IA aplicada a Finanzas',
    area: 'Finanzas',
    h1: 'Convierte la IA en una nueva capacidad del equipo financiero.',
    body: 'Programa adaptado a los procesos de reporting, presupuesto, forecast, cash management, análisis y comunicación financiera de la empresa.',
    who: ['Finanzas', 'FP&A', 'Contabilidad', 'Tesorería', 'Control de gestión', 'Controllers', 'CFO Office'],
    route: [
      ['Fundamentos de IA y financial prompting', 'Asistente financiero con instrucciones, límites y formatos definidos.'],
      ['Reporting, cierre y conciliación', 'Revisor de información financiera y detector de inconsistencias.'],
      ['Presupuesto y forecast', 'Copilot para analizar supuestos y actualizar proyecciones.'],
      ['Cash flow y escenarios', 'Simulador de escenarios sobre ingresos, costos, tasa, plazo y caja.'],
      ['Análisis de desviaciones', 'Radar de variaciones entre presupuesto, forecast y ejecutado.'],
      ['Comunicación a Gerencia', 'Relator ejecutivo que convierte el análisis en hallazgos, riesgos y recomendaciones.'],
    ],
    deliverables: ['Financial Prompt Library', 'Plantilla de revisión de información', 'Simulador de escenarios', 'Reporte de desviaciones', 'Executive Finance Brief', 'Protocolo de validación'],
    cta: 'Adapta este programa a Finanzas',
  },

  'finanzas-inmobiliarias': {
    menu: 'IA aplicada a Finanzas Inmobiliarias',
    area: 'Finanzas Inmobiliarias',
    h1: 'Reduce el tiempo de reunir información. Aumenta el tiempo para decidir.',
    body: 'Capacitación aplicada a contratos, ventas, cobranzas, costos, avance de obra, financiamiento y flujo de caja de proyectos inmobiliarios.',
    who: ['Finanzas inmobiliarias', 'Control de proyectos', 'Tesorería', 'Contabilidad', 'Project Finance', 'Gerencias de proyectos inmobiliarios'],
    route: [
      ['IA generativa e instrucción financiera', 'Asistente Financiero de Proyecto.'],
      ['Contratos y condiciones de financiamiento', 'Revisor de Contratos y Financiamiento.'],
      ['Conciliación y calidad de datos', 'Consolidador de Datos del Proyecto.'],
      ['Flujo de caja y escenarios de inversión', 'Simulador de Escenarios de Inversión.'],
      ['Presupuesto, ejecutado y alertas', 'Radar de Desviaciones.'],
      ['Síntesis de la decisión', 'Relator Ejecutivo de Gerencia.'],
    ],
    processes: ['Contratos de compraventa', 'Contratos de obra', 'Condiciones de financiamiento', 'Covenants', 'Ventas y cobranzas', 'Costos', 'Avance de obra', 'Flujo de caja', 'Rentabilidad', 'Reportes a bancos e inversionistas'],
    deliverables: ['Matriz contractual con evidencia', 'Diagnóstico de calidad de datos', 'Comparativo de escenarios', 'Reporte de desviaciones', 'Biblioteca de agentes financieros', 'Protocolo de trazabilidad'],
    cta: 'Diseña el programa para tu proyecto',
  },

  'ventas': {
    menu: 'IA aplicada a Ventas',
    area: 'Ventas',
    h1: 'Ayuda a tu equipo comercial a investigar mejor, responder más rápido y vender con mayor contexto.',
    body: 'Programa aplicado a prospección, preparación de reuniones, calificación, propuestas, seguimiento y gestión del pipeline.',
    who: ['Ventas B2B y B2C', 'Key Account Managers', 'Business Development', 'Inside Sales', 'Sales Operations', 'Customer Success'],
    route: [
      ['IA para el proceso comercial', 'Sales Copilot adaptado al producto, cliente y metodología comercial.'],
      ['Investigación de cuentas y oportunidades', 'Account Research Assistant.'],
      ['Calificación y priorización', 'Lead Qualification Assistant con criterios comerciales.'],
      ['Preparación de reuniones', 'Meeting Preparation Copilot.'],
      ['Propuestas y manejo de objeciones', 'Proposal and Objection Assistant.'],
      ['Seguimiento y pipeline', 'Pipeline Narrative y Next-Best-Action Assistant.'],
    ],
    deliverables: ['Account brief', 'Lead scoring guide', 'Biblioteca de mensajes', 'Plantilla de reunión', 'Proposal assistant', 'Proceso de seguimiento', 'Pipeline summary'],
    cta: 'Adapta este programa a Ventas',
  },

  'marketing-comunicaciones': {
    menu: 'IA aplicada a Marketing y Comunicaciones',
    area: 'Marketing y Comunicaciones',
    h1: 'Convierte la IA en una capacidad de investigación, creación y optimización.',
    body: 'Programa aplicado a insights, estrategia de contenidos, campañas, comunicación corporativa, reputación y medición.',
    who: ['Marketing', 'Brand', 'Communications', 'Content', 'Growth', 'Public Relations', 'Social Media', 'Employee Advocacy'],
    route: [
      ['IA para Marketing y Communications', 'Marketing and Communications Copilot.'],
      ['Investigación y consumer insights', 'Research and Insight Synthesizer.'],
      ['Estrategia de contenidos', 'Content Strategy Assistant.'],
      ['Campañas y adaptación multicanal', 'Campaign Content System.'],
      ['Reputación y comunicación corporativa', 'Reputation and Corporate Messaging Assistant.'],
      ['Performance y optimización', 'Campaign Analysis and Learning Assistant.'],
    ],
    deliverables: ['Insight brief', 'Message house', 'Content system', 'Campaign assistant', 'Reputation Q&A', 'Executive communication brief', 'Performance narrative'],
    cta: 'Diseña el programa para Marketing',
  },

  'supply-chain-compras': {
    menu: 'IA aplicada a Supply Chain y Compras',
    area: 'Supply Chain y Compras',
    h1: 'Convierte datos, excepciones y proveedores en decisiones más rápidas.',
    body: 'Programa aplicado a demanda, inventarios, compras, proveedores, contratos, riesgos y seguimiento de la cadena de suministro.',
    who: ['Supply Chain', 'Procurement', 'Planning', 'Logistics', 'Inventory Management', 'Supplier Management', 'Sourcing'],
    route: [
      ['IA para Supply Chain', 'Supply Chain Copilot.'],
      ['Demanda e inventarios', 'Demand and Inventory Insight Assistant.'],
      ['Evaluación de proveedores', 'Supplier Evaluation Assistant.'],
      ['Compras y contratos', 'Procurement and Contract Review Assistant.'],
      ['Riesgos y excepciones', 'Supply Chain Risk Radar.'],
      ['Control tower y comunicación', 'Executive Supply Chain Brief.'],
    ],
    deliverables: ['Supplier scorecard', 'Demand summary', 'Inventory exception report', 'Contract review matrix', 'Risk radar', 'Procurement brief', 'Supply Chain executive report'],
    cta: 'Adapta este programa a Supply Chain',
  },

  'operaciones': {
    menu: 'IA aplicada a Operaciones',
    area: 'Operaciones',
    h1: 'Rediseña el trabajo operativo antes de automatizarlo.',
    body: 'Programa aplicado a procesos, SOPs, excepciones, análisis de causa, seguimiento y mejora continua.',
    who: ['Operations', 'Process Excellence', 'Shared Services', 'Quality', 'Back Office', 'Continuous Improvement'],
    route: [
      ['IA para operaciones', 'Operations Copilot.'],
      ['Entendimiento y documentación de procesos', 'Process Documentation Assistant.'],
      ['SOPs y conocimiento operativo', 'SOP and Knowledge Assistant.'],
      ['Excepciones e incidentes', 'Exception Management Assistant.'],
      ['Root cause y mejora continua', 'Root-Cause Analysis Copilot.'],
      ['Performance operativo', 'Operations Performance Brief.'],
    ],
    deliverables: ['Process map', 'SOP library', 'Exception register', 'Root-cause template', 'Improvement backlog', 'Operations report'],
    cta: 'Diseña el programa para Operaciones',
  },

  'recursos-humanos': {
    menu: 'IA aplicada a Recursos Humanos',
    area: 'Recursos Humanos',
    h1: 'Ayuda a Recursos Humanos a trabajar con más contexto y mantener el criterio humano.',
    body: 'Programa aplicado a recruitment, onboarding, learning, employee experience, performance y people analytics.',
    who: ['Human Resources', 'Talent Acquisition', 'Learning and Development', 'People Analytics', 'Employee Experience', 'HR Business Partners'],
    route: [
      ['IA responsable para Recursos Humanos', 'HR Copilot con límites de uso y human review.'],
      ['Recruitment y perfiles', 'Job Profile and Interview Assistant.'],
      ['Onboarding', 'Onboarding Journey Assistant.'],
      ['Learning y desarrollo', 'Learning Path Designer.'],
      ['Performance y feedback', 'Feedback Preparation Assistant.'],
      ['People insights y comunicación', 'People Insight and Communication Assistant.'],
    ],
    guardrails: [
      'No delegar decisiones de contratación a un LLM.',
      'Evitar el uso de datos personales no autorizados.',
      'Revisar bias y criterios discriminatorios.',
      'Mantener human accountability.',
      'Documentar fuentes y decisiones.',
    ],
    deliverables: ['Biblioteca de perfiles', 'Interview guide', 'Onboarding assistant', 'Learning plan', 'Feedback templates', 'People insight brief', 'Responsible AI guide para HR'],
    cta: 'Adapta este programa a Recursos Humanos',
  },

  'customer-service-cx': {
    menu: 'IA aplicada a Customer Service y CX',
    area: 'Customer Service y CX',
    h1: 'Convierte conversaciones de clientes en respuestas, insights y mejoras.',
    body: 'Programa aplicado a atención, knowledge management, calidad, reclamos, Voice of Customer y customer journeys.',
    who: ['Customer Service', 'Contact Center', 'Customer Experience', 'Service Design', 'Quality', 'Customer Operations'],
    route: [
      ['IA para servicio y experiencia', 'Customer Service Copilot.'],
      ['Voice of Customer', 'Customer Feedback Synthesizer.'],
      ['Knowledge management', 'Knowledge Base Assistant.'],
      ['Respuestas y casos complejos', 'Response and Escalation Assistant.'],
      ['Calidad y análisis de conversaciones', 'Conversation Quality Reviewer.'],
      ['Customer journey y mejora', 'CX Improvement Assistant.'],
    ],
    deliverables: ['VOC report', 'Knowledge assistant', 'Response library', 'Escalation matrix', 'Quality rubric', 'CX improvement backlog'],
    cta: 'Diseña el programa para Customer Experience',
  },

  'legal-compliance-risk': {
    menu: 'IA aplicada a Legal, Compliance y Risk',
    area: 'Legal, Compliance y Risk',
    h1: 'Aumenta la capacidad de revisar, comparar y monitorear sin delegar el criterio profesional.',
    body: 'Programa aplicado a contratos, obligaciones, políticas, regulación, riesgos y comunicación ejecutiva.',
    who: ['Legal', 'Compliance', 'Risk', 'Internal Control', 'Corporate Affairs', 'Audit'],
    route: [
      ['IA responsable en Legal y Risk', 'Legal and Risk Copilot con límites definidos.'],
      ['Revisión contractual', 'Contract Review Assistant.'],
      ['Obligaciones y regulación', 'Regulatory Obligation Mapper.'],
      ['Políticas y controles', 'Policy and Control Assistant.'],
      ['Incidentes y riesgos', 'Risk and Incident Synthesizer.'],
      ['Reporting ejecutivo', 'Legal and Risk Executive Brief.'],
    ],
    guardrails: [
      'El output no reemplaza asesoría legal.',
      'Toda interpretación requiere revisión profesional.',
      'Las fuentes deben mantenerse trazables.',
      'La información confidencial solo se utiliza en entornos autorizados.',
      'Los riesgos deben distinguir hechos, supuestos e interpretación.',
    ],
    deliverables: ['Contract matrix', 'Obligations register', 'Policy assistant', 'Control mapping', 'Risk brief', 'Executive legal report'],
    cta: 'Adapta este programa a Legal y Risk',
  },

  'product-innovacion': {
    menu: 'IA aplicada a Product e Innovación',
    area: 'Product e Innovación',
    h1: 'Acelera el aprendizaje de producto sin acelerar decisiones equivocadas.',
    body: 'Programa aplicado a discovery, customer insights, product definition, priorización, experimentación y comunicación.',
    who: ['Product Management', 'Product Owners', 'Innovation', 'UX Research', 'Service Design', 'Digital Business'],
    route: [
      ['IA para Product e Innovación', 'Product Copilot.'],
      ['Discovery y customer insights', 'Research Synthesis Assistant.'],
      ['Problem framing y oportunidades', 'Opportunity Definition Assistant.'],
      ['Product requirements y backlog', 'PRD and Backlog Assistant.'],
      ['Prototyping y experimentación', 'Experiment Design Copilot.'],
      ['Roadmap y comunicación', 'Product Decision Brief.'],
    ],
    deliverables: ['Research synthesis', 'Opportunity map', 'Product brief', 'PRD assistant', 'Experiment backlog', 'Product decision memo'],
    cta: 'Diseña el programa para Product',
  },

  'strategy-liderazgo': {
    menu: 'IA aplicada a Strategy y Liderazgo',
    area: 'Strategy y Liderazgo',
    h1: 'Utiliza la IA para ampliar el análisis, no para delegar la decisión.',
    body: 'Programa para líderes que necesitan investigar, comparar escenarios, preparar decisiones y comunicar con mayor claridad.',
    who: ['C-Level', 'Directors', 'Business Unit Leaders', 'Strategy', 'Transformation', 'Corporate Development'],
    route: [
      ['IA para el trabajo ejecutivo', 'Executive AI Copilot.'],
      ['Research y market intelligence', 'Executive Research Assistant.'],
      ['Escenarios y strategic choices', 'Scenario Planning Copilot.'],
      ['Decision memos', 'Executive Decision Memo Assistant.'],
      ['Reuniones y seguimiento', 'Meeting and Commitment Assistant.'],
      ['Portfolio y comunicación', 'Strategy Portfolio Brief.'],
    ],
    deliverables: ['Executive prompt system', 'Market brief', 'Scenario matrix', 'Decision memo', 'Proceso de reuniones', 'Portfolio narrative'],
    cta: 'Diseña el programa para líderes',
  },

  'project-management-pmo': {
    menu: 'IA aplicada a Project Management y PMO',
    area: 'Project Management y PMO',
    h1: 'Reduce la carga de seguimiento. Aumenta la visibilidad para decidir.',
    body: 'Programa aplicado a planificación, status reporting, riesgos, dependencias, reuniones y portfolio management.',
    who: ['Project Managers', 'Program Managers', 'PMO', 'Transformation Offices', 'Delivery Leads', 'Scrum Masters'],
    route: [
      ['IA para Project Management', 'Project Management Copilot.'],
      ['Charter y planificación', 'Project Planning Assistant.'],
      ['Reuniones y decisiones', 'Meeting and Decision Tracker.'],
      ['Status y seguimiento', 'Status Report Assistant.'],
      ['Riesgos y dependencias', 'Risk and Dependency Radar.'],
      ['Portfolio y comunicación', 'PMO Executive Brief.'],
    ],
    deliverables: ['Project charter', 'Planning assistant', 'Decision log', 'Status report', 'Risk register', 'Portfolio summary'],
    cta: 'Adapta este programa a tu PMO',
  },

  'data-analytics': {
    menu: 'IA aplicada a Data & Analytics',
    area: 'Data & Analytics',
    h1: 'Utiliza los LLMs para acelerar el análisis sin perder control sobre los datos.',
    body: 'Programa aplicado a calidad de datos, análisis exploratorio, interpretación, escenarios, reporting y decision support.',
    who: ['Data Analysts', 'Business Intelligence', 'Business Analysts', 'Analytics', 'Controllers', 'Decision Support Teams'],
    route: [
      ['LLMs para análisis de datos', 'Data Analysis Copilot.'],
      ['Calidad y preparación', 'Data Quality Assistant.'],
      ['Análisis exploratorio', 'Exploratory Analysis Assistant.'],
      ['Variaciones y escenarios', 'Variance and Scenario Copilot.'],
      ['Visualización y narrativa', 'Data Storytelling Assistant.'],
      ['Decision support', 'Executive Decision Pack.'],
    ],
    deliverables: ['Data quality checklist', 'Proceso de análisis', 'Scenario templates', 'Visualization brief', 'Data narrative', 'Decision pack'],
    cta: 'Diseña el programa para Data',
  },

  'technology-engineering': {
    menu: 'IA aplicada a Technology & Engineering',
    area: 'Technology & Engineering',
    h1: 'Construye criterio para trabajar con LLMs, agents y sistemas de IA.',
    body: 'El programa conecta el uso práctico de ChatGPT, Claude, Gemini y otros foundation models con los conceptos necesarios para diseñar soluciones empresariales: APIs, context engineering, RAG, tool calling, MCP, evaluaciones, guardrails y observabilidad. No buscamos convertir a todos en AI engineers: buscamos que los equipos técnicos puedan tomar mejores decisiones sobre cómo construir, integrar y gobernar IA. Se aplica a requirements, architecture, coding, testing, documentation, incidents y engineering knowledge.',
    who: ['Software Engineering', 'Architecture', 'QA', 'DevOps', 'IT Operations', 'Technology Leadership'],
    route: [
      ['LLMs, foundation models y prompt engineering', 'Engineering Copilot con reglas de uso, límites y criterios de revisión.'],
      ['Context engineering, RAG y embeddings', 'Asistente conectado al conocimiento técnico del equipo mediante vector search y grounding.'],
      ['APIs, tool calling y MCP', 'Requirements assistant que consulta sistemas reales en vez de responder de memoria.'],
      ['Agentic workflows y model routing', 'Workflow de coding y code review con pasos automáticos y puntos de revisión humana.'],
      ['Evaluaciones, guardrails y testing', 'Test design assistant y batería de evals para medir el comportamiento antes de confiar en él.'],
      ['Observabilidad, incidentes y cost governance', 'Sistema de conocimiento técnico con tracing, monitoreo y runbooks.'],
    ],
    deliverables: ['Engineering prompt library', 'Context and RAG design', 'Requirement templates', 'Code-review checklist', 'Evaluation set (evals)', 'Guardrails y human-in-the-loop', 'Incident runbook', 'Documentation assistant'],
    cta: 'Adapta este programa a Technology',
  },
};

/* ---- material común de la página principal ---- */

export const SITUATIONS = [
  'La empresa entrega licencias, pero la adopción sigue siendo baja.',
  'Los equipos utilizan IA para tareas aisladas.',
  'Nadie reutiliza lo que funciona.',
  'Los resultados no tienen criterios comunes de validación.',
  'Existen dudas sobre privacidad y manejo de información.',
  'Las capacitaciones anteriores fueron demasiado genéricas.',
  'Los equipos conocen la herramienta, pero no saben aplicarla a sus procesos.',
  'La empresa no puede demostrar productividad o valor.',
];

export const EXISTING_MATERIAL = [
  'Procesos actuales', 'Documentos', 'Contratos', 'Reportes', 'Presentaciones',
  'Bases de datos', 'Hojas de cálculo', 'Correos', 'Políticas', 'Guías operativas',
  'Indicadores', 'Formatos de seguimiento', 'Herramientas y licencias disponibles',
];

/* Sesión 0 — lo que se trabaja antes de que exista malla */
export const SESSION_ZERO = [
  ['Objetivos empresariales', 'Qué espera mejorar el área, qué indicadores importan, qué presión originó la capacitación y qué resultados debe producir.'],
  ['Procesos actuales', 'Actividades recurrentes, decisiones importantes, cuellos de botella, handoffs, retrabajos, excepciones y dependencias entre áreas.'],
  ['Información y herramientas', 'Documentos, data sources, spreadsheets, sistemas, reportes, licencias disponibles de ChatGPT, Claude o Gemini y restricciones de acceso.'],
  ['Usuarios y nivel de adopción', 'Roles participantes, experiencia previa, frecuencia de uso, confianza y diferencias entre perfiles.'],
  ['Seguridad y responsible use', 'Información sensible, datos personales, propiedad intelectual, reglas internas, herramientas autorizadas y criterios de human review.'],
  ['Selección de casos', 'Qué procesos se trabajan, qué agentes se construyen, qué entregables se esperan y con qué criterios se validan.'],
];

export const SESSION_ZERO_OUTPUTS = [
  'Understanding Brief', 'Mapa del proceso actual', 'AI Fluency Baseline',
  'Priorización de casos', 'Malla adaptada', 'Lista de información requerida',
  'Definición de herramientas', 'Criterios de seguridad', 'Métricas del programa',
];

/* Cómo funciona cada sesión */
export const SESSION_FLOW = [
  ['Business challenge', 'Se presenta el problema real que el área necesita resolver.'],
  ['AI concept', 'Se enseña únicamente el concepto de IA necesario para abordar ese problema.'],
  ['Applied demonstration', 'Se demuestra con ChatGPT, Claude o Gemini sobre un caso cercano a la realidad del equipo.'],
  ['Build', 'Cada participante configura un asistente, un agente, un flujo de trabajo o una plantilla reutilizable.'],
  ['Validate', 'El resultado se compara con criterios definidos por el área.'],
  ['Transfer', 'El activo queda documentado para poder usarse después de la capacitación.'],
];

export const FORMATS = [
  { name: 'Programa Esencial', hours: '12 horas lectivas', sessions: '4 sesiones de 3 horas', items: ['Sesión previa de entendimiento', 'Cuatro casos o capacidades', 'Biblioteca inicial de instrucciones', 'Informe final'] },
  { name: 'Programa Completo', hours: '18 horas lectivas', sessions: '6 sesiones de 3 horas', items: ['Sesión previa de entendimiento', 'Seis casos o capacidades', 'Biblioteca de flujos de trabajo', 'Protocolos de validación', 'Medición posterior'] },
  { name: 'Programa Integral', hours: '24 horas lectivas', sessions: '8 sesiones de 3 horas', items: ['Sesión previa de entendimiento', 'Seis sesiones formativas', 'Laboratorio sobre casos reales', 'Consultoría de implementación', 'Plan de adopción para el área'] },
];

export const IS_IS_NOT = [
  ['IA aplicada al trabajo real de cada área.', 'Un curso genérico sobre ChatGPT.'],
  ['Un programa construido sobre los procesos de la empresa.', 'Una lista de prompts mágicos.'],
  ['Trabajo con documentos, datos y formatos existentes.', 'Una demostración desconectada de la operación.'],
  ['Construcción de asistentes, agentes y flujos de trabajo reutilizables.', 'Una automatización completa de sistemas.'],
  ['Criterios de validación y human review.', 'Un reemplazo del criterio profesional.'],
  ['Capacidades que pueden utilizarse desde el día siguiente.', 'Teoría sin aplicación.'],
  ['Un programa adaptable a ChatGPT, Claude o Gemini.', 'Una capacitación atada a una sola plataforma.'],
];

export const INDICATORS = [
  ['Adopción', 'Participantes activos, frecuencia de uso, flujos de trabajo reutilizados y casos incorporados al trabajo habitual.'],
  ['Productividad', 'Tiempo de preparación y de respuesta, reducción de tareas manuales y velocidad para producir un primer output útil.'],
  ['Calidad', 'Consistencia, errores detectados, cumplimiento del formato, retrabajo y nivel de trazabilidad.'],
  ['Confianza', 'Capacidad para verificar resultados, claridad sobre los límites y uso adecuado de la información.'],
  ['Valor', 'Procesos mejorados, decisiones habilitadas, capacidades instaladas y casos preparados para BECOME EMBED™.'],
];

export const GENERAL_DELIVERABLES = [
  'AI Fluency Baseline', 'Understanding Brief', 'Mapa de procesos y oportunidades',
  'Malla personalizada', 'Biblioteca de instrucciones', 'Asistentes o agentes configurados',
  'Prompt systems', 'Applied Workflow Canvas', 'Plantillas del área',
  'Protocolos de validación', 'Responsible Use Guide', 'AI Champions Kit',
  'Adoption Scorecard', 'Informe final para la Gerencia', 'Recomendaciones para los siguientes 90 días',
];

export const FAQ = [
  ['¿La capacitación es igual para todas las empresas?', 'No. Cada programa comienza con una sesión de entendimiento. La malla, los casos, los documentos y los ejercicios se adaptan a los procesos reales de la empresa.'],
  ['¿El programa se enfoca en ChatGPT?', 'No. BECOME NOW™ es vendor-neutral. El programa puede trabajar con ChatGPT, Claude, Gemini, Microsoft Copilot u otros modelos y herramientas aprobados por la organización. La elección depende del stack, los casos de uso y las políticas internas.'],
  ['¿Trabajamos con cuentas y documentos de la empresa?', 'La Sesión 0 define qué información, herramientas y entornos pueden utilizarse durante el programa. Los ejercicios deben respetar las políticas de seguridad, privacidad y uso de IA de cada organización.'],
  ['¿BECOME trabaja solo con un modelo o proveedor de IA?', 'No. Nuestro enfoque es vendor-neutral. La selección depende del caso de uso, tus datos, las políticas internas, el nivel de autonomía requerido, la arquitectura y el costo total de operación. Según el contexto evaluamos ecosistemas como OpenAI/ChatGPT, Anthropic/Claude, Google/Gemini, Microsoft Copilot y otras alternativas disponibles en el stack de la organización.'],
  ['¿Necesitamos compartir información confidencial?', 'No necesariamente. La empresa puede trabajar con información real, anonimizada o simulada. El tratamiento se define durante la sesión de entendimiento.'],
  ['¿Es un curso de prompts?', 'No. Escribir buenas instrucciones es solo el punto de partida. El objetivo es construir asistentes, agentes, flujos de trabajo y entregables que mejoren el trabajo del área.'],
  ['¿Los participantes necesitan conocimientos técnicos?', 'No. La malla se adapta al nivel de los participantes. Los programas funcionales están diseñados para equipos de negocio.'],
  ['¿BECOME automatiza los procesos durante la capacitación?', 'El programa estándar se concentra en construcción de capacidades y configuración dentro de las herramientas autorizadas. Integraciones y desarrollos pueden abordarse después mediante BECOME EMBED™.'],
  ['¿Cuántas personas pueden participar?', 'El tamaño del grupo se define según el nivel de acompañamiento necesario. Se recomiendan grupos pequeños cuando cada participante debe construir y validar sus propios flujos de trabajo.'],
  ['¿Puede crearse un programa para un área que no aparece en el menú?', 'Sí. El catálogo muestra las rutas más frecuentes, pero BECOME puede diseñar programas para cualquier área, rol, industria o proceso específico.'],
  ['¿Qué queda después de la capacitación?', 'Capacidades aplicables, una biblioteca reutilizable, flujos de trabajo documentados, criterios de validación y recomendaciones de adopción.'],
];

/* Lista plana en el orden del sub-submenú */
export const PROGRAM_LIST = PROGRAM_GROUPS.flatMap((g) =>
  g.slugs.map((slug) => ({
    slug,
    group: g.title,
    ...PROGRAMS[slug],
    to: `/es/servicios/become-now/${slug}`,
  }))
);
