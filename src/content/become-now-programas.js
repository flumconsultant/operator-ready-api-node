/**
 * BECOME NOW™: el contenido PROPIO de cada uno de los catorce programas.
 *
 * ---- Por qué existe este archivo ----
 *
 * Las veintiocho páginas de programa —catorce por dos idiomas— compartían
 * plantilla. Medido: de los 163 bloques de texto de cada una, más de cien eran
 * idénticos entre ellas, y solo un 15-29% era propio. Para un buscador eso son
 * catorce versiones parametrizadas de la misma landing, y cuando decide que lo
 * son, muestra una y esconde trece.
 *
 * El problema no estaba en la malla de seis sesiones, que ya diferenciaba
 * bastante. Estaba en todo lo que la rodeaba: el mismo problema habitual, la
 * misma Sesión 0, la misma explicación de cómo funciona una sesión, los mismos
 * entregables genéricos y las mismas preguntas frecuentes.
 *
 * Aquí cada programa trae su propia versión de esos bloques: la tensión de su
 * área, los documentos que revisa su Sesión 0, con qué se valida un output en
 * ese oficio, qué activos concretos quedan y qué preguntan de verdad quienes lo
 * contratan.
 *
 * ---- Por qué no es una traducción ----
 *
 * El inglés no es la versión palabra por palabra del español. Son dos
 * adaptaciones del mismo programa para dos audiencias, y por eso viven las dos
 * aquí en vez de generarse una a partir de la otra.
 *
 * ---- Qué se quedó fuera a propósito ----
 *
 * La explicación larga de personalización, seguridad y neutralidad de
 * proveedor sigue en la página madre, /es/servicios/become-now. Repetirla en
 * catorce páginas era buena parte del problema; cada programa dice ahora solo
 * la implicancia que le toca —con qué sistemas de su área convive la IA— y
 * enlaza la madre para lo demás.
 */

export const COPY_PROGRAMAS = {
  'customer-service-cx': {
    es: {
      seoTitulo: 'IA para Customer Service y CX | BECOME NOW™',
      seoDesc: 'Programa aplicado a atención, reclamos, Voice of Customer, conocimiento y calidad para convertir conversaciones en mejoras del servicio.',
      eyebrow: 'BECOME NOW™ · CUSTOMER SERVICE Y CX',
      h1: 'Convierte conversaciones de clientes en respuestas, insights y mejoras.',
      lead: 'Programa para equipos de atención y experiencia que necesitan responder con más contexto, aprender de cada contacto y mejorar el servicio sin perder empatía ni criterio.',
      problema: {
        titular: 'El cliente habla todos los días. La organización aprende demasiado lento.',
        parrafos: [
          'Chats, llamadas, correos, encuestas y reclamos contienen señales valiosas, pero suelen quedar repartidos entre plataformas, reportes y criterios distintos. El equipo resuelve el caso inmediato; después cuesta reconocer patrones, actualizar el conocimiento o convertirlos en una mejora del journey.',
          'BECOME NOW™ ayuda a organizar ese trabajo: no para automatizar toda conversación, sino para que cada respuesta tenga contexto, cada escalamiento tenga una razón y cada hallazgo pueda volver al proceso.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 define dónde la IA puede asistir y dónde debe intervenir una persona.',
        parrafos: [
          'Revisamos motivos de contacto, taxonomías, guiones, base de conocimiento, criterios de calidad, niveles de servicio, reglas de escalamiento y ejemplos anonimizados. Acordamos qué tono preservar, qué respuestas requieren aprobación y cómo se reconocerá una recomendación útil.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para convertir interacciones en una capacidad de servicio.',
        pasos: [
          [
            'IA para servicio y experiencia',
            'Queda instalado un Customer Service Copilot con contexto, tono y límites.',
          ],
          [
            'Voice of Customer',
            'Queda un sintetizador que agrupa señales, temas, fricciones y evidencia.',
          ],
          [
            'Knowledge management',
            'Queda un asistente para encontrar, resumir y mantener respuestas autorizadas.',
          ],
          [
            'Respuestas y casos complejos',
            'Queda un flujo de borrador, revisión y escalamiento.',
          ],
          [
            'Calidad de conversaciones',
            'Queda una pauta para evaluar claridad, resolución, cumplimiento y empatía.',
          ],
          [
            'Customer journey y mejora',
            'Queda un brief que convierte patrones de contacto en oportunidades priorizadas.',
          ],
        ],
      },
      sesion: {
        titular: 'Se prueba sobre contactos reales o anonimizados y contra criterios del servicio.',
        parrafos: [
          'Una respuesta no se valida porque “suena bien”. Se revisa por exactitud, tono, uso de fuentes, cumplimiento, resolución y necesidad de escalamiento. El activo se documenta con ejemplos y límites para que el equipo pueda reutilizarlo.',
        ],
      },
      tecnologia: [
        'El programa puede trabajar con el LLM autorizado y materiales provenientes de CRM, contact center, help desk, encuestas o repositorios de conocimiento. La capacitación configura formas de trabajo reutilizables; una integración productiva con esos sistemas se diseña por separado.',
      ],
      entregables: [
        'Customer Service Copilot y guía de uso.',
        'Taxonomía inicial de motivos, fricciones y escalamiento.',
        'Plantillas de respuesta por tipo de caso.',
        'Pauta de calidad con criterios de revisión humana.',
        'Proceso de síntesis de la voz del cliente.',
        'Backlog de mejoras del journey sustentado en evidencia.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Medimos dónde tiene sentido intervenir: tiempo de preparación de respuesta, consistencia, retrabajo, escalamiento correcto, cobertura de la base de conocimiento y velocidad para convertir feedback en acciones. El baseline se acuerda antes del programa.',
        ],
      },
      faq: [
        [
          '¿La IA responderá directamente al cliente?',
          'No necesariamente. El programa puede empezar como copiloto de agentes, con revisión humana antes de cualquier envío.',
        ],
        [
          '¿Se pueden usar conversaciones reales?',
          'Sí, si el entorno y la política lo permiten. También podemos trabajar con casos anonimizados o simulados.',
        ],
        [
          '¿Sirve si la base de conocimiento está desordenada?',
          'Sí. El programa puede identificar vacíos y criterios de mantenimiento, pero no promete resolver una migración completa de conocimiento.',
        ],
        [
          '¿Cómo se protege el tono de marca?',
          'Se convierte en criterios observables y ejemplos, no en una indicación genérica de “sonar como la marca”.',
        ],
      ],
      otros: {
        texto: 'Si la prioridad está en campañas y reputación, revisa Marketing y Comunicaciones. Si está en procesos y excepciones, Operaciones. Si requiere integración con el stack de atención, BECOME EMBED™.',
        programas: ['marketing-comunicaciones', 'operaciones'],
        servicios: ['become-embed'],
      },
      cta: 'Cuéntanos qué conversaciones concentran hoy el trabajo de Customer Service y CX.',
    },
    en: {
      seoTitulo: 'AI for Customer Service & CX | BECOME NOW™',
      seoDesc: 'Applied AI program for service, complaints, Voice of Customer, knowledge and quality—turning conversations into better experiences.',
      eyebrow: 'BECOME NOW™ · CUSTOMER SERVICE & CX',
      h1: 'Turn customer conversations into better answers, insight and service improvements.',
      lead: 'A program for service and experience teams that need to respond with more context, learn from every interaction and preserve empathy and judgment.',
      problema: {
        titular: 'Customers speak every day. The organization learns too slowly.',
        parrafos: [
          'Calls, chats, emails, surveys and complaints hold valuable signals, but they remain scattered across platforms, reports and individual judgment. The case gets resolved; the learning rarely makes its way back into knowledge, quality or journey design.',
          'BECOME NOW™ turns that work into a shared capability—without assuming every conversation should be automated.',
        ],
      },
      sesion0: {
        titular: 'Session 0 defines where AI may assist and where a person must step in.',
        parrafos: [
          'We review contact reasons, taxonomies, scripts, knowledge, quality standards, service levels, escalation rules and anonymized cases. We agree on tone, approval requirements and what makes a recommendation usable.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          [
            'AI for service and experience',
            'Customer Service Copilot with context and boundaries.',
          ],
          [
            'Voice of Customer',
            'Synthesizer for themes, friction and supporting evidence.',
          ],
          [
            'Knowledge management',
            'Assistant for retrieving and maintaining approved answers.',
          ],
          ['Complex cases', 'Draft, review and escalation workflow.'],
          [
            'Conversation quality',
            'Reviewer for accuracy, resolution, compliance and empathy.',
          ],
          [
            'Journey improvement',
            'Brief that turns contact patterns into prioritized changes.',
          ],
        ],
      },
      sesion: {
        titular: 'Outputs are tested against service standards, not fluency.',
        parrafos: [
          'The team checks accuracy, tone, sources, compliance, resolution and escalation. Each asset is documented with examples, limits and review steps.',
        ],
      },
      tecnologia: [
        'The program can use the approved LLM and controlled material from CRM, contact center, help desk, surveys or knowledge repositories. Production integrations are scoped separately.',
      ],
      entregables: [
        'Customer Service Copilot and usage guide.',
        'Contact, friction and escalation taxonomy.',
        'Response templates by case type.',
        'Human-review quality rubric.',
        'Voice of Customer synthesis workflow.',
        'Evidence-based journey improvement backlog.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Potential baselines include response preparation time, consistency, rework, correct escalation, knowledge coverage and time from feedback to action.',
        ],
      },
      faq: [
        [
          'Will AI reply directly to customers?',
          'Not necessarily. Most teams begin with an agent copilot and human approval.',
        ],
        [
          'Can we use real conversations?',
          'Yes, when policy and environment allow it; otherwise we anonymize or simulate cases.',
        ],
        [
          'What if our knowledge base is incomplete?',
          'The program can expose gaps and maintenance rules, but it is not a full knowledge migration.',
        ],
        [
          'How is brand tone protected?',
          'By turning tone into observable criteria, examples and exclusions.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['marketing-comunicaciones', 'operaciones'],
        servicios: ['become-embed'],
      },
      cta: 'Tell us which customer conversations carry the most work today.',
    },
  },
  'data-analytics': {
    es: {
      seoTitulo: 'IA para Data & Analytics | BECOME NOW™',
      seoDesc: 'Programa para usar LLMs en preparación, análisis, escenarios y comunicación de datos con trazabilidad y criterios de validación.',
      eyebrow: 'BECOME NOW™ · DATA & ANALYTICS',
      h1: 'Utiliza los LLMs para acelerar el análisis sin perder control sobre los datos.',
      lead: 'Programa para analistas y equipos de negocio que necesitan explorar información, explicar variaciones y comunicar hallazgos sin confundir una respuesta plausible con evidencia.',
      problema: {
        titular: 'El análisis se acelera. La verificación sigue siendo manual.',
        parrafos: [
          'Los LLMs pueden escribir consultas, proponer hipótesis y resumir resultados, pero también pueden ocultar supuestos, inventar relaciones o interpretar una tabla sin comprender su definición. El riesgo no es solo un número incorrecto: es una decisión basada en un análisis que nadie puede reproducir.',
          'El programa enseña a separar preparación, cálculo, interpretación y narrativa; a mantener la fuente visible; y a decidir qué parte puede asistir un modelo y cuál debe permanecer en herramientas analíticas determinísticas.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 alinea fuentes, definiciones y preguntas antes de abrir el modelo.',
        parrafos: [
          'Revisamos datasets permitidos, diccionario de métricas, consultas frecuentes, reportes, herramientas de BI, reglas de calidad y decisiones que consumen el análisis. Definimos muestras de prueba y criterios de reproducibilidad, precisión y trazabilidad.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para pasar de datos disponibles a decisiones explicables.',
        pasos: [
          [
            'LLMs para análisis',
            'Data Analysis Copilot con preguntas, límites y formato de evidencia.',
          ],
          [
            'Calidad y preparación',
            'Asistente para perfilar campos, detectar vacíos y documentar transformaciones.',
          ],
          [
            'Análisis exploratorio',
            'Flujo para hipótesis, segmentaciones y pruebas sin saltar a conclusiones.',
          ],
          [
            'Variaciones y escenarios',
            'Copilot que explicita drivers, supuestos y sensibilidad.',
          ],
          [
            'Visualización y narrativa',
            'Asistente que elige la historia después del análisis, no antes.',
          ],
          [
            'Decision support',
            'Pack ejecutivo con hallazgo, evidencia, incertidumbre y siguiente decisión.',
          ],
        ],
      },
      sesion: {
        titular: 'Cada entregable debe poder rastrearse hasta una fuente, una transformación y un criterio.',
        parrafos: [
          'El equipo compara resultados con cálculos conocidos, documenta consultas y revisa si la narrativa distingue correlación, causalidad, dato y supuesto. Lo reutilizable no es una respuesta: es el procedimiento que permite volver a producirla.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con archivos controlados, notebooks, SQL, hojas de cálculo y salidas de herramientas BI, usando el LLM autorizado. El programa no sustituye el gobierno de datos ni conecta por defecto el modelo a ambientes productivos.',
      ],
      entregables: [
        'Data Analysis Copilot con protocolo de uso.',
        'Checklist de calidad y preparación de datasets.',
        'Biblioteca de preguntas analíticas y consultas validadas.',
        'Plantilla de análisis de variaciones y escenarios.',
        'Estándar de narrativa con evidencia e incertidumbre.',
        'Executive Decision Pack reproducible.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Los indicadores pueden incluir tiempo hasta el primer análisis útil, errores detectados antes de publicar, reproducibilidad, retrabajo, cobertura de fuentes y claridad de supuestos. No se mide “cantidad de entregables” como sustituto de calidad.',
        ],
      },
      faq: [
        [
          '¿El programa es solo para data scientists?',
          'No. Se adapta a analistas y usuarios avanzados de negocio; el nivel técnico se define en la Sesión 0.',
        ],
        [
          '¿La IA reemplaza SQL, Python o BI?',
          'No. Los LLMs asisten partes del trabajo; los cálculos críticos deben permanecer verificables.',
        ],
        [
          '¿Podemos trabajar con datos sensibles?',
          'Solo en entornos y condiciones autorizadas. También se usan datos enmascarados o simulados.',
        ],
        [
          '¿Cómo evitamos análisis inventados?',
          'Exigiendo fuentes, pasos reproducibles, controles determinísticos y revisión del analista.',
        ],
      ],
      otros: {
        texto: 'Para decisiones financieras, revisa Finanzas. Para prioridades ejecutivas, Strategy y Liderazgo. Para construir una solución conectada a fuentes empresariales, BECOME EMBED™.',
        programas: ['strategy-liderazgo', 'finanzas'],
        servicios: ['become-embed'],
      },
      cta: 'Cuéntanos qué decisiones dependen hoy del trabajo de Data & Analytics.',
    },
    en: {
      seoTitulo: 'AI for Data & Analytics | BECOME NOW™',
      seoDesc: 'Use LLMs across data preparation, exploration, scenarios and storytelling with reproducibility, validation and traceability.',
      eyebrow: 'BECOME NOW™ · DATA & ANALYTICS',
      h1: 'Accelerate analysis with LLMs without losing control of the data.',
      lead: 'A program for analysts and advanced business users who need faster exploration and clearer communication without mistaking a plausible answer for evidence.',
      problema: {
        titular: 'Analysis gets faster. Verification stays manual.',
        parrafos: [
          'LLMs can draft queries, suggest hypotheses and explain results. They can also hide assumptions, infer relationships or misread a metric definition. The real risk is an analysis nobody can reproduce.',
          'The program separates preparation, calculation, interpretation and narrative—and defines where deterministic analytical tools must remain in control.',
        ],
      },
      sesion0: {
        titular: 'Session 0 aligns sources, metric definitions and questions first.',
        parrafos: [
          'We review approved datasets, metric dictionaries, recurring analyses, BI tools, quality rules and the decisions that consume the output. We define test samples and standards for precision, reproducibility and traceability.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['LLMs for analysis', 'Data Analysis Copilot with evidence rules.'],
          [
            'Quality and preparation',
            'Assistant for profiling fields and documenting transformations.',
          ],
          [
            'Exploratory analysis',
            'Workflow for hypotheses and segmentation without premature conclusions.',
          ],
          [
            'Variance and scenarios',
            'Copilot that exposes drivers, assumptions and sensitivity.',
          ],
          [
            'Visualization and narrative',
            'Assistant that chooses the story after the analysis.',
          ],
          [
            'Decision support',
            'Executive pack with finding, evidence, uncertainty and next decision.',
          ],
        ],
      },
      sesion: {
        titular: 'Every output must trace back to a source, transformation and criterion.',
        parrafos: [
          'Results are compared with known calculations. The team documents queries and distinguishes correlation, causation, data and assumptions.',
        ],
      },
      tecnologia: [
        'The program may use controlled files, notebooks, SQL, spreadsheets and BI outputs with the approved model. It does not replace data governance or connect models to production by default.',
      ],
      entregables: [
        'Data Analysis Copilot.',
        'Dataset quality checklist.',
        'Validated analytical question library.',
        'Variance and scenario template.',
        'Evidence-based storytelling standard.',
        'Reproducible Executive Decision Pack.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include time to first useful analysis, errors caught before publication, reproducibility, rework, source coverage and assumption clarity.',
        ],
      },
      faq: [
        [
          'Is this only for data scientists?',
          'No. Depth is adapted to analysts and business users in Session 0.',
        ],
        [
          'Does AI replace SQL, Python or BI?',
          'No. It assists parts of the work; critical calculations remain verifiable.',
        ],
        [
          'Can sensitive data be used?',
          'Only under approved conditions; masked or simulated data are valid alternatives.',
        ],
        [
          'How do we prevent fabricated analysis?',
          'With visible sources, reproducible steps, deterministic checks and analyst review.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['strategy-liderazgo', 'finanzas'],
        servicios: ['become-embed'],
      },
      cta: 'Tell us which decisions rely on Data & Analytics today.',
    },
  },
  'finanzas': {
    es: {
      seoTitulo: 'Capacitación en IA para Finanzas | BECOME NOW™',
      seoDesc: 'IA aplicada a reporting, cierre, forecast, cash flow, desviaciones y comunicación financiera con supuestos y controles explícitos.',
      eyebrow: 'BECOME NOW™ · FINANZAS',
      h1: 'Convierte la IA en una nueva capacidad del equipo financiero.',
      lead: 'Programa aplicado a reporting, cierre, conciliación, presupuesto, forecast, cash management, análisis de desviaciones y comunicación a Gerencia.',
      problema: {
        titular: 'Demasiado tiempo reuniendo el número. Muy poco explicando qué significa.',
        parrafos: [
          'Finanzas trabaja entre hojas, reportes, correos y versiones que no siempre llegan al mismo tiempo. La IA puede acelerar la revisión y la narrativa, pero un entregable convincente no reemplaza una cifra conciliada ni un supuesto aprobado.',
          'El programa separa con claridad lo que el modelo puede organizar, comparar o explicar de lo que debe calcularse, conciliarse y aprobarse en los sistemas financieros.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 identifica qué decisión financiera debe mejorar y qué controles no se negocian.',
        parrafos: [
          'Revisamos calendario de cierre, reportes, plan de cuentas, fuentes, modelos de presupuesto, drivers del forecast, niveles de aprobación y ejemplos de comunicación ejecutiva. Acordamos tolerancias, reglas de cálculo, trazabilidad y tratamiento de información confidencial.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para pasar del procesamiento financiero a una lectura accionable.',
        pasos: [
          [
            'IA y financial prompting',
            'Asistente financiero con alcance, fuentes y formatos definidos.',
          ],
          [
            'Reporting, cierre y conciliación',
            'Revisor de consistencia y diferencias pendientes.',
          ],
          [
            'Presupuesto y forecast',
            'Copilot para contrastar drivers, supuestos y nuevas proyecciones.',
          ],
          [
            'Cash flow y escenarios',
            'Simulador documentado de ingresos, costos, tasa, plazo y caja.',
          ],
          [
            'Análisis de desviaciones',
            'Radar que separa variación, causa probable, evidencia y responsable.',
          ],
          [
            'Comunicación a Gerencia',
            'Relator que convierte el análisis validado en decisiones y riesgos.',
          ],
        ],
      },
      sesion: {
        titular: 'El modelo explica; las reglas financieras verifican.',
        parrafos: [
          'Cada ejercicio conserva la fuente, explicita el periodo y distingue dato, cálculo, supuesto e interpretación. El activo queda acompañado por un checklist de revisión y por casos en los que no debe utilizarse.',
        ],
      },
      tecnologia: [
        'Se puede trabajar con archivos controlados, reportes de ERP, modelos de Excel, salidas de BI y documentos financieros dentro del entorno autorizado. La capacitación no reemplaza el ERP ni automatiza aprobaciones o contabilizaciones productivas.',
      ],
      entregables: [
        'Asistente financiero con protocolo de fuentes.',
        'Checklist de reporting, cierre y conciliación.',
        'Plantilla de drivers para presupuesto y forecast.',
        'Simulador de escenarios con supuestos visibles.',
        'Radar de desviaciones y causas.',
        'Formato de comunicación ejecutiva para Gerencia.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'El baseline puede considerar horas de preparación, iteraciones de conciliación, variaciones explicadas, errores detectados, tiempo de actualización de escenarios y retrabajo en reportes. La velocidad solo cuenta si la cifra sigue siendo confiable.',
        ],
      },
      faq: [
        [
          '¿La IA hará cálculos financieros?',
          'Puede asistir, pero los cálculos críticos deben ejecutarse o verificarse con fórmulas y sistemas determinísticos.',
        ],
        [
          '¿Se adapta a nuestro ERP y plan de cuentas?',
          'La capacitación usa entregables y estructuras autorizadas; una integración directa se evalúa aparte.',
        ],
        [
          '¿Podemos incluir FP&A, Tesorería o Contabilidad?',
          'Sí. La malla final prioriza los roles y ciclos con mayor valor.',
        ],
        [
          '¿Qué información se puede usar?',
          'Datos reales, anonimizados o simulados, según seguridad y confidencialidad.',
        ],
      ],
      otros: {
        texto: 'Para proyectos inmobiliarios, revisa Finanzas Inmobiliarias. Para análisis transversal, Data & Analytics. Para decisiones de portafolio, Strategy y Liderazgo.',
        programas: ['finanzas-inmobiliarias', 'strategy-liderazgo', 'data-analytics'],
        servicios: [],
      },
      cta: 'Cuéntanos dónde pierde hoy más tiempo el equipo de Finanzas.',
    },
    en: {
      seoTitulo: 'Applied AI for Finance Teams | BECOME NOW™',
      seoDesc: 'Applied AI for reporting, close, forecast, cash flow, variance analysis and executive finance communication with explicit controls.',
      eyebrow: 'BECOME NOW™ · FINANCE',
      h1: 'Turn AI into a working capability for Finance.',
      lead: 'A program built around reporting, close, reconciliation, planning, forecasting, cash management, variance analysis and executive communication.',
      problema: {
        titular: 'Too much time gathering the number. Too little time explaining it.',
        parrafos: [
          'Finance works across models, reports, emails and versions that do not arrive together. AI can accelerate review and narrative, but a confident output is not a reconciled figure or an approved assumption.',
          'The program separates what a model may organize, compare and explain from what must be calculated, reconciled and approved in financial systems.',
        ],
      },
      sesion0: {
        titular: 'Session 0 identifies the finance decision to improve and the controls that cannot move.',
        parrafos: [
          'We review close cycles, reports, chart of accounts, sources, planning models, forecast drivers, approvals and executive formats. We set tolerances, calculation rules, traceability and confidentiality boundaries.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          [
            'AI and financial prompting',
            'Finance Assistant with defined scope and sources.',
          ],
          [
            'Reporting, close and reconciliation',
            'Consistency and exception reviewer.',
          ],
          [
            'Budget and forecast',
            'Copilot for drivers, assumptions and revised projections.',
          ],
          [
            'Cash flow and scenarios',
            'Documented simulator for cash, rates, timing and costs.',
          ],
          [
            'Variance analysis',
            'Radar that separates variance, cause, evidence and owner.',
          ],
          [
            'Executive communication',
            'Narrator that turns validated analysis into decisions and risks.',
          ],
        ],
      },
      sesion: {
        titular: 'The model explains. Financial rules verify.',
        parrafos: [
          'Every exercise records the source and period and separates data, calculation, assumption and interpretation. Each asset includes a review checklist and exclusions.',
        ],
      },
      tecnologia: [
        'Controlled files, ERP reports, Excel models and BI outputs may be used inside the approved environment. The program does not post entries, approve transactions or replace the ERP.',
      ],
      entregables: [
        'Finance Assistant and source protocol.',
        'Close and reconciliation checklist.',
        'Budget and forecast driver template.',
        'Scenario model with visible assumptions.',
        'Variance and cause radar.',
        'Executive finance brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Baselines may cover preparation hours, reconciliation rounds, explained variances, detected errors, scenario refresh time and report rework.',
        ],
      },
      faq: [
        [
          'Will AI perform financial calculations?',
          'It may assist, but critical calculations require deterministic formulas and controls.',
        ],
        [
          'Can it adapt to our ERP and chart of accounts?',
          'Yes through authorized structures and outputs; direct integration is separate.',
        ],
        [
          'Can FP&A, Treasury and Accounting join?',
          'Yes. Session 0 prioritizes the most valuable cycles and roles.',
        ],
        [
          'What information can be used?',
          'Real, anonymized or simulated data, according to policy.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['finanzas-inmobiliarias', 'strategy-liderazgo', 'data-analytics'],
        servicios: [],
      },
      cta: 'Tell us where Finance loses the most time today.',
    },
  },
  'finanzas-inmobiliarias': {
    es: {
      seoTitulo: 'IA para Finanzas Inmobiliarias | BECOME NOW™',
      seoDesc: 'Programa aplicado a contratos, cobranzas, costos, avance de obra, financiamiento y flujo de caja de proyectos inmobiliarios.',
      eyebrow: 'BECOME NOW™ · FINANZAS INMOBILIARIAS',
      h1: 'Reduce el tiempo de reunir información. Aumenta el tiempo para decidir.',
      lead: 'Capacitación aplicada al trabajo financiero de proyectos inmobiliarios: contratos, ventas, cobranzas, costos, avance de obra, deuda, flujo de caja y escenarios de inversión.',
      problema: {
        titular: 'La decisión del proyecto vive entre documentos y números que cambian a ritmos distintos.',
        parrafos: [
          'Una condición contractual puede alterar el flujo; un retraso de obra puede mover desembolsos; una venta no cobrada puede cambiar la necesidad de financiamiento. El análisis pierde tiempo cuando contratos, cronogramas, valorizaciones y modelos financieros se revisan como mundos separados.',
          'El programa enseña a usar IA para reunir contexto y detectar preguntas, sin confundir extracción documental con validación contractual ni simulación con aprobación de inversión.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 selecciona un proyecto, sus fuentes y las decisiones que debe soportar.',
        parrafos: [
          'Revisamos modelo de flujo, presupuesto, ejecutado, cronograma, contratos, condiciones de deuda, reportes de ventas y cobranza, valorizaciones y criterios del comité. Definimos versiones oficiales, supuestos controlados y responsables de validar cada salida.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones alrededor del ciclo financiero del proyecto.',
        pasos: [
          [
            'Instrucción financiera',
            'Asistente Financiero de Proyecto con estructura y límites.',
          ],
          [
            'Contratos y financiamiento',
            'Revisor que extrae condiciones, hitos y obligaciones para validación profesional.',
          ],
          [
            'Conciliación y calidad',
            'Consolidador que identifica diferencias entre fuentes y periodos.',
          ],
          [
            'Flujo y escenarios de inversión',
            'Simulador con drivers y sensibilidad visibles.',
          ],
          [
            'Presupuesto, ejecutado y alertas',
            'Radar de desviaciones por componente y causa.',
          ],
          [
            'Síntesis de la decisión',
            'Relator Ejecutivo con evidencia, riesgos y preguntas abiertas.',
          ],
        ],
      },
      sesion: {
        titular: 'Cada caso conecta al menos un documento con una consecuencia financiera.',
        parrafos: [
          'Los participantes trabajan sobre extractos controlados y validan fechas, montos, unidades, condiciones y versión de la fuente. El resultado debe indicar qué sabe, qué supone y qué requiere confirmación.',
        ],
      },
      tecnologia: [
        'El programa puede usar hojas financieras, PDFs, reportes de ventas, cronogramas y salidas de ERP o software de proyectos dentro del ecosistema autorizado. No crea una fuente única de verdad ni ejecuta movimientos financieros.',
      ],
      entregables: [
        'Asistente Financiero de Proyecto.',
        'Matriz de condiciones contractuales y de financiamiento.',
        'Protocolo de conciliación entre fuentes.',
        'Modelo de escenarios con drivers documentados.',
        'Radar de presupuesto, ejecutado y alertas.',
        'Memo para comité de inversión o Gerencia.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Se puede medir tiempo de consolidación, diferencias detectadas, actualización de escenarios, trazabilidad de supuestos, preparación de comités y retrabajo por versiones. El resultado no reemplaza la revisión legal, contable ni de inversión.',
        ],
      },
      faq: [
        [
          '¿Es un curso genérico de finanzas?',
          'No. Se construye sobre decisiones y documentos propios de proyectos inmobiliarios.',
        ],
        [
          '¿Puede revisar contratos?',
          'Puede extraer y comparar condiciones; la interpretación y aprobación siguen en manos profesionales.',
        ],
        [
          '¿Construye el modelo financiero?',
          'Puede asistir su revisión y escenarios. El modelo oficial, sus fórmulas y aprobaciones permanecen bajo control del equipo.',
        ],
        [
          '¿Se puede trabajar con un proyecto real?',
          'Sí, si seguridad y confidencialidad lo permiten; de lo contrario, se anonimiza o simula.',
        ],
      ],
      otros: {
        texto: 'Para procesos financieros corporativos, revisa Finanzas. Para contratos y obligaciones, Legal, Compliance y Risk. Para planificación de obra y dependencias, Project Management y PMO.',
        programas: ['legal-compliance-risk', 'project-management-pmo', 'finanzas'],
        servicios: [],
      },
      cta: 'Cuéntanos qué decisión de proyecto necesita hoy una mejor lectura financiera.',
    },
    en: {
      seoTitulo: 'AI for Real Estate Finance | BECOME NOW™',
      seoDesc: 'Applied AI for contracts, sales, collections, construction costs, financing, project cash flow and investment scenarios.',
      eyebrow: 'BECOME NOW™ · REAL ESTATE FINANCE',
      h1: 'Spend less time assembling project information—and more time deciding.',
      lead: 'A program built around the financial work of real estate projects: contracts, sales, collections, costs, construction progress, debt, cash flow and investment scenarios.',
      problema: {
        titular: 'Project decisions live between documents and numbers that change at different speeds.',
        parrafos: [
          'A contract term may alter cash flow; a construction delay may shift drawdowns; a late collection may change funding needs. Analysis slows down when contracts, schedules, valuations and financial models are treated separately.',
          'The program uses AI to assemble context and surface questions without confusing extraction with legal validation or simulation with investment approval.',
        ],
      },
      sesion0: {
        titular: 'Session 0 selects one project, its sources and the decisions it must support.',
        parrafos: [
          'We review cash-flow models, budget, actuals, schedule, contracts, debt terms, sales and collections reports, valuations and committee criteria. Official versions and validation ownership are made explicit.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['Financial instruction', 'Project Finance Assistant.'],
          [
            'Contracts and financing',
            'Reviewer for terms, milestones and obligations.',
          ],
          [
            'Reconciliation and data quality',
            'Consolidator for differences across sources.',
          ],
          ['Cash flow and investment scenarios', 'Simulator with visible drivers.'],
          ['Budget, actuals and alerts', 'Variance radar by component and cause.'],
          [
            'Decision synthesis',
            'Executive memo with evidence, risk and open questions.',
          ],
        ],
      },
      sesion: {
        titular: 'Every case connects at least one document to a financial consequence.',
        parrafos: [
          'Participants validate dates, amounts, units, conditions and source versions. Every output states what is known, assumed and still awaiting confirmation.',
        ],
      },
      tecnologia: [
        'The program can use models, PDFs, sales reports, schedules and controlled ERP or project-system outputs. It does not create a production single source of truth or execute financial actions.',
      ],
      entregables: [
        'Project Finance Assistant.',
        'Contract and financing terms matrix.',
        'Cross-source reconciliation protocol.',
        'Scenario model with documented drivers.',
        'Budget and actuals alert radar.',
        'Investment committee memo.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Potential measures include consolidation time, differences found, scenario refresh time, assumption traceability and committee preparation rework.',
        ],
      },
      faq: [
        [
          'Is this a generic finance course?',
          'No. It is built around real estate project documents and decisions.',
        ],
        [
          'Can it review contracts?',
          'It can extract and compare terms; professional interpretation remains mandatory.',
        ],
        [
          'Will it build the official model?',
          'It may assist review and scenarios; ownership of formulas and approval stays with the team.',
        ],
        [
          'Can we use a live project?',
          'Yes when confidentiality and security requirements are met.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['legal-compliance-risk', 'project-management-pmo', 'finanzas'],
        servicios: [],
      },
      cta: 'Tell us which project decision needs a better financial view.',
    },
  },
  'legal-compliance-risk': {
    es: {
      seoTitulo: 'IA para Legal, Compliance y Risk | BECOME NOW™',
      seoDesc: 'IA aplicada a contratos, obligaciones, políticas, regulación e incidentes con trazabilidad, confidencialidad y revisión profesional.',
      eyebrow: 'BECOME NOW™ · LEGAL, COMPLIANCE Y RISK',
      h1: 'Aumenta la capacidad de revisar, comparar y monitorear sin delegar el criterio profesional.',
      lead: 'Programa para equipos que necesitan trabajar sobre grandes volúmenes documentales y mantener visibles la fuente, la interpretación y la responsabilidad humana.',
      problema: {
        titular: 'Revisar más rápido no sirve si se pierde el fundamento.',
        parrafos: [
          'Un resumen puede omitir una excepción; una comparación puede tratar cláusulas parecidas como equivalentes; una respuesta segura puede citar una obligación inexistente. En Legal, Compliance y Risk, la calidad depende de poder volver al texto fuente y distinguir hechos, supuestos e interpretación.',
          'BECOME NOW™ desarrolla capacidad para usar IA como apoyo de revisión, clasificación y síntesis, con límites claros antes de cada caso.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 define fuentes autorizadas, niveles de riesgo y revisión obligatoria.',
        parrafos: [
          'Revisamos tipos de contrato, matrices de obligaciones, políticas, fuentes regulatorias, taxonomías de riesgo, reportes e incidentes. Acordamos confidencialidad, jurisdicción, vigencia, trazabilidad, disclaimers y situaciones donde el modelo no debe utilizarse.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para aumentar cobertura sin diluir responsabilidad.',
        pasos: [
          ['IA responsable en Legal y Risk', 'Copilot con alcance, fuentes y límites.'],
          [
            'Revisión contractual',
            'Asistente que compara cláusulas contra un playbook.',
          ],
          [
            'Obligaciones y regulación',
            'Mapper con fuente, vigencia, responsable y evidencia.',
          ],
          [
            'Políticas y controles',
            'Asistente para contrastar requisitos, controles y vacíos.',
          ],
          [
            'Incidentes y riesgos',
            'Sintetizador que separa cronología, hecho, impacto y acción.',
          ],
          [
            'Reporting ejecutivo',
            'Brief con exposición, evidencia, decisión y seguimiento.',
          ],
        ],
      },
      sesion: {
        titular: 'Ninguna conclusión queda separada de su fuente.',
        parrafos: [
          'Los entregables se revisan por cobertura, precisión, vigencia, trazabilidad y tratamiento de excepciones. Toda interpretación requiere validación profesional; el activo documenta también cuándo escalar y cuándo abstenerse.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con documentos controlados, repositorios autorizados y herramientas empresariales aprobadas. El programa no ofrece asesoría legal, no monitorea regulación en tiempo real ni conecta automáticamente información confidencial a un modelo público.',
      ],
      entregables: [
        'Legal and Risk Copilot con límites de uso.',
        'Playbook de revisión contractual.',
        'Matriz de obligaciones con trazabilidad.',
        'Checklist de políticas y controles.',
        'Protocolo de síntesis de incidentes.',
        'Formato de Legal and Risk Executive Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'El baseline puede observar tiempo de primera revisión, cobertura de cláusulas, referencias verificables, inconsistencias detectadas, retrabajo y escalamiento correcto. Nunca medimos velocidad aislada de precisión y riesgo.',
        ],
      },
      faq: [
        [
          '¿El entregable reemplaza asesoría legal?',
          'No. Es apoyo para revisión y preparación; el criterio profesional no se delega.',
        ],
        [
          '¿Cómo se controla la vigencia de una fuente?',
          'Cada caso debe registrar fuente, fecha, jurisdicción y responsable de validación.',
        ],
        [
          '¿Se usan contratos confidenciales?',
          'Solo en entornos autorizados; también se puede anonimizar o trabajar con muestras.',
        ],
        [
          '¿Puede decidir el nivel de riesgo?',
          'Puede organizar evidencia y aplicar criterios acordados, pero la decisión y responsabilidad permanecen en el equipo.',
        ],
      ],
      otros: {
        texto: 'Para obligaciones de proveedores, revisa Supply Chain y Compras. Para contratos de proyectos, Finanzas Inmobiliarias. Para gobernanza técnico, Technology & Engineering.',
        programas: ['finanzas-inmobiliarias', 'supply-chain-compras', 'technology-engineering'],
        servicios: [],
      },
      cta: 'Cuéntanos qué revisión concentra hoy el trabajo de Legal, Compliance y Risk.',
    },
    en: {
      seoTitulo: 'AI for Legal, Compliance & Risk | BECOME NOW™',
      seoDesc: 'Applied AI for contracts, obligations, policies, regulation and incidents with confidentiality, traceability and professional review.',
      eyebrow: 'BECOME NOW™ · LEGAL, COMPLIANCE & RISK',
      h1: 'Increase review and monitoring capacity without outsourcing professional judgment.',
      lead: 'A program for teams managing high document volumes where source, interpretation and human accountability must remain visible.',
      problema: {
        titular: 'Faster review has no value when the basis disappears.',
        parrafos: [
          'A summary may omit an exception. Similar clauses may be treated as equivalent. A confident answer may cite an obligation that does not exist. Quality depends on returning to the source and separating fact, assumption and interpretation.',
        ],
      },
      sesion0: {
        titular: 'Session 0 defines approved sources, risk levels and mandatory review.',
        parrafos: [
          'We review contract types, obligation matrices, policies, regulatory sources, risk taxonomies, reports and incidents. Confidentiality, jurisdiction, validity, traceability and prohibited uses are agreed first.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['Responsible AI for Legal and Risk', 'Copilot with scope and limits.'],
          ['Contract review', 'Clause comparison against an approved playbook.'],
          ['Obligations and regulation', 'Mapper with source, validity and owner.'],
          ['Policies and controls', 'Assistant for requirements, controls and gaps.'],
          [
            'Incidents and risks',
            'Synthesizer for chronology, fact, impact and action.',
          ],
          ['Executive reporting', 'Brief with exposure, evidence and decision.'],
        ],
      },
      sesion: {
        titular: 'No conclusion is detached from its source.',
        parrafos: [
          'Outputs are reviewed for coverage, accuracy, validity, traceability and exceptions. Interpretation always requires professional validation.',
        ],
      },
      tecnologia: [
        'Controlled documents, approved repositories and enterprise tools may be used. The program is not legal advice, real-time regulatory monitoring or an automatic connection of confidential content to public models.',
      ],
      entregables: [
        'Legal and Risk Copilot.',
        'Contract review playbook.',
        'Traceable obligation matrix.',
        'Policy and control checklist.',
        'Incident synthesis protocol.',
        'Legal and Risk Executive Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include first-review time, clause coverage, verified citations, inconsistencies found, rework and correct escalation.',
        ],
      },
      faq: [
        [
          'Does the output replace legal advice?',
          'No. It supports preparation and review; professional judgment remains accountable.',
        ],
        [
          'How is source validity controlled?',
          'By recording source, date, jurisdiction and validation owner.',
        ],
        [
          'Can confidential contracts be used?',
          'Only in approved environments; anonymized samples are also valid.',
        ],
        [
          'Can AI assign risk?',
          'It may organize evidence against criteria; the decision remains with the team.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['finanzas-inmobiliarias', 'supply-chain-compras', 'technology-engineering'],
        servicios: [],
      },
      cta: 'Tell us which review consumes the most capacity today.',
    },
  },
  'marketing-comunicaciones': {
    es: {
      seoTitulo: 'IA para Marketing y Comunicaciones | BECOME NOW™',
      seoDesc: 'Programa aplicado a research, insights, contenidos, campañas, reputación y performance con voz de marca y criterios compartidos.',
      eyebrow: 'BECOME NOW™ · MARKETING Y COMUNICACIONES',
      h1: 'Convierte la IA en una capacidad de investigación, creación y optimización.',
      lead: 'Programa para equipos que necesitan producir a mayor velocidad sin fragmentar la estrategia, la voz de marca ni los criterios con los que aprenden de cada campaña.',
      problema: {
        titular: 'Más contenido no significa más sistema.',
        parrafos: [
          'La IA reduce el tiempo del primer borrador, pero también multiplica piezas parecidas, insights sin fuente y adaptaciones que pierden la intención. Cuando cada persona usa su propio prompt, la velocidad individual crece y la coherencia del equipo disminuye.',
          'El programa convierte research, creación, revisión y aprendizaje en procesos compartidos. El objetivo no es publicar automáticamente; es aumentar la capacidad del equipo para pensar, producir y decidir con contexto.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 conecta objetivos, audiencias, canales y reglas de marca.',
        parrafos: [
          'Revisamos estrategia, briefs, research, brand voice, campañas, matrices de mensajes, calendarios, protocolos de reputación y reportes de performance. Seleccionamos casos que permitan validar relevancia, diferenciación, fidelidad de marca, evidencia y cumplimiento.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para crear mejor y aprender más rápido.',
        pasos: [
          [
            'IA para Marketing y Comunicaciones',
            'Copilot con contexto de negocio y marca.',
          ],
          [
            'Research y consumer insights',
            'Sintetizador que mantiene fuentes y tensiones visibles.',
          ],
          [
            'Estrategia de contenidos',
            'Asistente que conecta objetivo, audiencia, mensaje y formato.',
          ],
          [
            'Campañas multicanal',
            'Sistema de adaptación que preserva una idea central.',
          ],
          [
            'Reputación y comunicación corporativa',
            'Asistente con escenarios, stakeholders y revisión.',
          ],
          [
            'Performance y optimización',
            'Flujo que convierte resultados en hipótesis y siguientes pruebas.',
          ],
        ],
      },
      sesion: {
        titular: 'El entregable se evalúa con el brief, no con el gusto del modelo.',
        parrafos: [
          'Cada pieza o análisis se compara con objetivo, audiencia, evidencia, voz, canal y restricciones. Los prompts aislados se convierten en plantillas y criterios que el equipo puede reutilizar y mejorar.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con LLMs, herramientas multimodales y materiales exportados de plataformas de research, social, analytics o gestión de contenidos. Publicación, conexión de datos y automatización de campañas requieren un alcance de implementación distinto.',
      ],
      entregables: [
        'Marketing and Communications Copilot.',
        'Protocolo de research y síntesis con fuentes.',
        'Sistema de estrategia y planificación de contenidos.',
        'Matriz de adaptación multicanal.',
        'Guía de revisión de voz, reputación y compliance.',
        'Campaign Learning Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Se puede medir tiempo de research y primera versión, consistencia de marca, iteraciones de revisión, reutilización de procesos, hallazgos sustentados y velocidad para convertir performance en una nueva prueba.',
        ],
      },
      faq: [
        [
          '¿El programa se limita a crear contenido?',
          'No. Incluye research, estrategia, reputación, medición y aprendizaje.',
        ],
        [
          '¿Puede respetar nuestra voz de marca?',
          'Sí, si se traduce en criterios, ejemplos y exclusiones concretas.',
        ],
        [
          '¿Publicará automáticamente?',
          'No dentro del programa estándar. Primero se construyen y validan los procesos.',
        ],
        [
          '¿Incluye generación de imágenes?',
          'Puede incluirla si es relevante y está autorizada, siempre con revisión de marca, derechos y uso responsable.',
        ],
      ],
      otros: {
        texto: 'Para conversaciones y Voice of Customer, revisa Customer Service y CX. Para prospección y propuestas, Ventas. Para priorización de oportunidades, Product e Innovación.',
        programas: ['customer-service-cx', 'product-innovacion', 'ventas'],
        servicios: [],
      },
      cta: 'Cuéntanos qué parte del trabajo de Marketing y Comunicaciones necesita hoy más sistema.',
    },
    en: {
      seoTitulo: 'AI for Marketing & Communications | BECOME NOW™',
      seoDesc: 'Applied AI for research, insight, content, campaigns, reputation and performance with shared brand and quality standards.',
      eyebrow: 'BECOME NOW™ · MARKETING & COMMUNICATIONS',
      h1: 'Turn AI into a research, creation and optimization capability.',
      lead: 'A program for teams that need greater production speed without fragmenting strategy, brand voice or campaign learning.',
      problema: {
        titular: 'More content is not the same as a better system.',
        parrafos: [
          'AI shortens the first draft. It can also multiply generic assets, unsupported insight and channel adaptations that lose the central idea. Individual speed grows while team coherence falls.',
          'The program turns research, creation, review and learning into shared workflows—not automatic publishing.',
        ],
      },
      sesion0: {
        titular: 'Session 0 connects objectives, audiences, channels and brand rules.',
        parrafos: [
          'We review strategy, briefs, research, voice, campaigns, message frameworks, reputation protocols and performance reports. Cases are validated for relevance, differentiation, evidence, brand fidelity and compliance.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          [
            'AI for Marketing and Communications',
            'Copilot with business and brand context.',
          ],
          ['Research and consumer insight', 'Source-aware insight synthesizer.'],
          [
            'Content strategy',
            'Assistant connecting objective, audience, message and format.',
          ],
          ['Multichannel campaigns', 'Adaptation system preserving one central idea.'],
          [
            'Reputation and corporate communications',
            'Stakeholder and scenario assistant.',
          ],
          [
            'Performance and optimization',
            'Workflow from results to hypotheses and tests.',
          ],
        ],
      },
      sesion: {
        titular: 'The brief—not the model\'s taste—evaluates the output.',
        parrafos: [
          'Every asset is checked against objective, audience, evidence, voice, channel and constraints. One-off prompts become reusable templates and review standards.',
        ],
      },
      tecnologia: [
        'Approved LLMs, multimodal tools and controlled exports from research, social, analytics or content platforms may be used. Publishing and campaign automation are separate implementation scopes.',
      ],
      entregables: [
        'Marketing and Communications Copilot.',
        'Source-aware research protocol.',
        'Content strategy system.',
        'Multichannel adaptation matrix.',
        'Brand, reputation and compliance review guide.',
        'Campaign Learning Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include research time, first-version time, brand consistency, review rounds, workflow reuse and speed from performance to next test.',
        ],
      },
      faq: [
        [
          'Is the program only about content generation?',
          'No. It covers research, strategy, reputation, measurement and learning.',
        ],
        [
          'Can it preserve our brand voice?',
          'Yes, when voice is expressed through criteria, examples and exclusions.',
        ],
        [
          'Will it publish automatically?',
          'Not in the standard program. Workflows are validated first.',
        ],
        [
          'Can image generation be included?',
          'Yes when relevant, with brand, rights and responsible-use review.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['customer-service-cx', 'product-innovacion', 'ventas'],
        servicios: [],
      },
      cta: 'Tell us which part of Marketing and Communications needs more system today.',
    },
  },
  'operaciones': {
    es: {
      seoTitulo: 'IA para Operaciones y Procesos | BECOME NOW™',
      seoDesc: 'Programa aplicado a procesos, SOPs, incidentes, excepciones, causa raíz y performance operativo antes de automatizar.',
      eyebrow: 'BECOME NOW™ · OPERACIONES',
      h1: 'Rediseña el trabajo operativo antes de automatizarlo.',
      lead: 'Programa para equipos que necesitan hacer visible cómo ocurre el trabajo, reducir variabilidad y tratar excepciones con mayor consistencia.',
      problema: {
        titular: 'El proceso documentado y el proceso real no siempre son el mismo.',
        parrafos: [
          'Los SOPs explican el camino esperado; la operación vive también en handoffs, correos, conocimiento tácito e incidentes. Si la IA entra antes de comprender esas diferencias, automatiza la versión ideal del proceso y deja fuera aquello que más tiempo consume.',
          'BECOME NOW™ utiliza casos operativos para documentar, asistir y mejorar el trabajo antes de decidir qué merece automatización.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 elige un proceso con volumen, fricción y evidencia suficiente.',
        parrafos: [
          'Revisamos SOPs, roles, entradas, salidas, tiempos, colas, handoffs, incidentes, excepciones, controles y métricas. Identificamos dónde se requiere juicio humano, qué errores son tolerables y qué evento debe detener o escalar el flujo.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones desde el proceso visible hasta la mejora medible.',
        pasos: [
          ['IA para operaciones', 'Operations Copilot con contexto y límites.'],
          [
            'Entendimiento de procesos',
            'Asistente que convierte evidencia en un mapa verificable.',
          ],
          [
            'SOPs y conocimiento',
            'Flujo para crear, consultar y actualizar instrucciones.',
          ],
          [
            'Excepciones e incidentes',
            'Asistente que clasifica, pide contexto y escala.',
          ],
          [
            'Root cause y mejora continua',
            'Copilot que separa síntoma, causa, evidencia y contramedida.',
          ],
          [
            'Performance operativo',
            'Brief con variación, impacto, decisión y seguimiento.',
          ],
        ],
      },
      sesion: {
        titular: 'El activo se prueba también contra la excepción, no solo contra el caso feliz.',
        parrafos: [
          'La validación considera exactitud del procedimiento, cobertura, tiempo, cumplimiento, escalamiento y capacidad para explicar por qué recomienda una acción. Lo no resuelto queda visible como backlog, no escondido dentro de un prompt.',
        ],
      },
      tecnologia: [
        'Podemos usar documentos, tickets, registros y salidas controladas de ERP, BPM, service management o herramientas operativas. La capacitación no modifica sistemas productivos ni ejecuta decisiones sin aprobación.',
      ],
      entregables: [
        'Operations Copilot.',
        'Mapa del proceso con handoffs y excepciones.',
        'Plantilla de creación y revisión de SOPs.',
        'Taxonomía de incidentes y escalamiento.',
        'Protocolo de análisis de causa raíz.',
        'Operations Performance Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'El baseline puede incluir tiempo de ciclo, retrabajo, cumplimiento del SOP, frecuencia de excepciones, tiempo de resolución y calidad del escalamiento. Solo después se decide si el caso requiere formación, rediseño o automatización.',
        ],
      },
      faq: [
        [
          '¿El programa automatiza procesos?',
          'No por defecto. Primero desarrolla capacidad y valida el proceso; una automatización productiva corresponde a BECOME EMBED™.',
        ],
        [
          '¿Sirve si los procesos no están bien documentados?',
          'Sí. Esa brecha puede ser el punto de partida.',
        ],
        [
          '¿Puede trabajar con personal de primera línea?',
          'Sí, y su conocimiento es clave para capturar excepciones reales.',
        ],
        [
          '¿Cómo se evita recomendar una acción incorrecta?',
          'Con fuentes autorizadas, reglas, pruebas de excepción y puntos explícitos de revisión humana.',
        ],
      ],
      otros: {
        texto: 'Para proveedores e inventarios, revisa Supply Chain y Compras. Para portafolios de iniciativas, Project Management y PMO. Para construir el proceso productivo, BECOME EMBED™.',
        programas: ['project-management-pmo', 'supply-chain-compras'],
        servicios: ['become-embed'],
      },
      cta: 'Cuéntanos qué proceso operativo no funciona igual que en el papel.',
    },
    en: {
      seoTitulo: 'AI for Operations and Processes | BECOME NOW™',
      seoDesc: 'Applied AI for processes, SOPs, incidents, exceptions, root cause and operational performance—before automation.',
      eyebrow: 'BECOME NOW™ · OPERATIONS',
      h1: 'Redesign operational work before automating it.',
      lead: 'A program for teams that need to make work visible, reduce variation and handle exceptions more consistently.',
      problema: {
        titular: 'The documented process and the real process are rarely identical.',
        parrafos: [
          'SOPs describe the expected path. Operations also live in handoffs, messages, tacit knowledge and incidents. When AI enters too early, it automates the ideal process and misses the work that consumes the most time.',
        ],
      },
      sesion0: {
        titular: 'Session 0 selects a process with volume, friction and usable evidence.',
        parrafos: [
          'We review SOPs, roles, inputs, outputs, timing, queues, handoffs, incidents, exceptions, controls and metrics. Human judgment, tolerable errors and stop conditions are made explicit.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['AI for Operations', 'Operations Copilot with context and boundaries.'],
          [
            'Process understanding',
            'Assistant turning evidence into a verifiable map.',
          ],
          [
            'SOPs and knowledge',
            'Workflow for creating, finding and updating instructions.',
          ],
          [
            'Exceptions and incidents',
            'Assistant for classification, context and escalation.',
          ],
          [
            'Root cause and improvement',
            'Copilot separating symptom, cause and evidence.',
          ],
          ['Operational performance', 'Brief connecting variance to action and owner.'],
        ],
      },
      sesion: {
        titular: 'The asset is tested against exceptions, not just the happy path.',
        parrafos: [
          'Validation covers procedural accuracy, coverage, time, compliance, escalation and explainability. Unresolved issues remain visible as backlog.',
        ],
      },
      tecnologia: [
        'Controlled documents, tickets, logs and outputs from ERP, BPM or service management may be used. Production systems are not modified during the program.',
      ],
      entregables: [
        'Operations Copilot.',
        'Process map with handoffs and exceptions.',
        'SOP creation and review template.',
        'Incident and escalation taxonomy.',
        'Root-cause analysis protocol.',
        'Operations Performance Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Potential baselines include cycle time, rework, SOP adherence, exception frequency, resolution time and escalation quality.',
        ],
      },
      faq: [
        [
          'Does the program automate processes?',
          'Not by default. It builds and validates the workflow first.',
        ],
        [
          'What if our processes are poorly documented?',
          'That gap can become the starting point.',
        ],
        [
          'Can frontline teams participate?',
          'Yes. Their knowledge is critical to capturing real exceptions.',
        ],
        [
          'How are wrong recommendations controlled?',
          'Through approved sources, rules, exception tests and human review.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['project-management-pmo', 'supply-chain-compras'],
        servicios: ['become-embed'],
      },
      cta: 'Tell us which operational process works differently from the documentation.',
    },
  },
  'product-innovacion': {
    es: {
      seoTitulo: 'IA para Product e Innovación | BECOME NOW™',
      seoDesc: 'Programa para aplicar IA en discovery, insights, definición de problemas, PRDs, priorización, experimentos y decisiones de producto.',
      eyebrow: 'BECOME NOW™ · PRODUCT E INNOVACIÓN',
      h1: 'Acelera el aprendizaje de producto sin acelerar decisiones equivocadas.',
      lead: 'Programa para equipos que necesitan sintetizar evidencia, formular mejores oportunidades y reducir el tiempo entre una pregunta de producto y una prueba útil.',
      problema: {
        titular: 'La IA produce respuestas antes de que el equipo haya definido bien la pregunta.',
        parrafos: [
          'Puede resumir entrevistas, escribir un PRD o proponer features en segundos. Si la evidencia es débil o el problema está mal formulado, también acelera soluciones que nadie necesita.',
          'El programa usa IA para ampliar y organizar el razonamiento de producto, manteniendo separados evidencia, hipótesis, decisión y experimento.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 selecciona una decisión de producto y reconstruye su evidencia.',
        parrafos: [
          'Revisamos research, entrevistas, analytics, feedback, estrategia, oportunidades, backlog, PRDs, experimentos y criterios de priorización. Acordamos qué evidencia cuenta, qué incertidumbre permanece y quién decide cada transición.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones desde la señal del cliente hasta una decisión comunicable.',
        pasos: [
          [
            'IA para Product e Innovación',
            'Product Copilot con contexto y principios.',
          ],
          [
            'Discovery y customer insights',
            'Sintetizador que conserva citas, patrones y contradicciones.',
          ],
          [
            'Problem framing',
            'Asistente para formular oportunidad, usuario, contexto y outcome.',
          ],
          [
            'PRDs y backlog',
            'Flujo que conecta evidencia, requirements, criterios y dependencias.',
          ],
          [
            'Prototyping y experimentación',
            'Copilot para hipótesis, prototipo y diseño de prueba.',
          ],
          [
            'Roadmap y comunicación',
            'Decision Brief con trade-offs y preguntas abiertas.',
          ],
        ],
      },
      sesion: {
        titular: 'Cada recomendación debe declarar qué evidencia la sostiene.',
        parrafos: [
          'Los entregables se revisan por trazabilidad, claridad del problema, calidad de hipótesis, viabilidad de prueba y coherencia con la estrategia. El modelo puede proponer; el equipo conserva la decisión.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con exports y documentos de research, analytics, backlog, diseño y roadmapping dentro del entorno autorizado. El programa no sustituye las herramientas de producto ni crea integraciones productivas.',
      ],
      entregables: [
        'Product Copilot.',
        'Protocolo de síntesis de research.',
        'Opportunity Definition Canvas.',
        'Plantilla de PRD y criterios de aceptación.',
        'Experiment Design Kit.',
        'Product Decision Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Se puede observar tiempo de síntesis, evidencia recuperable, retrabajo de PRDs, velocidad de diseño experimental, decisiones reabiertas y reutilización de activos. Más ideas no es una métrica de aprendizaje.',
        ],
      },
      faq: [
        [
          '¿La IA decidirá qué construir?',
          'No. Ayuda a organizar evidencia y alternativas; la priorización sigue siendo una decisión del equipo.',
        ],
        [
          '¿Sirve para discovery cualitativo y cuantitativo?',
          'Sí, si cada fuente conserva su método y sus límites.',
        ],
        [
          '¿Puede generar prototipos?',
          'Puede acelerar primeras versiones, pero su valor se determina mediante una prueba diseñada.',
        ],
        [
          '¿Se adapta a nuestro framework de producto?',
          'Sí. Los activos se construyen sobre los rituales y criterios existentes.',
        ],
      ],
      otros: {
        texto: 'Para análisis de datos, revisa Data & Analytics. Para objetivos y portafolio, Strategy y Liderazgo. Para desarrollo e integración, Technology & Engineering.',
        programas: ['technology-engineering', 'strategy-liderazgo', 'data-analytics'],
        servicios: [],
      },
      cta: 'Cuéntanos qué decisión de producto necesita hoy mejor evidencia.',
    },
    en: {
      seoTitulo: 'AI for Product & Innovation | BECOME NOW™',
      seoDesc: 'Applied AI for discovery, insight, problem framing, PRDs, prioritization, experiments and product decisions.',
      eyebrow: 'BECOME NOW™ · PRODUCT & INNOVATION',
      h1: 'Accelerate product learning without accelerating the wrong decisions.',
      lead: 'A program for teams that need to synthesize evidence, frame stronger opportunities and shorten the distance between a product question and a useful test.',
      problema: {
        titular: 'AI produces answers before the team has framed the question.',
        parrafos: [
          'It can summarize interviews, draft a PRD or suggest features in seconds. When evidence is weak or the problem is poorly framed, it also accelerates solutions nobody needs.',
          'The program uses AI to extend product reasoning while keeping evidence, hypothesis, decision and experiment distinct.',
        ],
      },
      sesion0: {
        titular: 'Session 0 selects a product decision and reconstructs its evidence.',
        parrafos: [
          'We review research, interviews, analytics, feedback, strategy, opportunities, backlog, PRDs, experiments and prioritization rules. Evidence standards and decision ownership are agreed first.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          [
            'AI for Product and Innovation',
            'Product Copilot with context and principles.',
          ],
          [
            'Discovery and customer insight',
            'Synthesis preserving quotes and contradictions.',
          ],
          ['Problem framing', 'Assistant for opportunity, user, context and outcome.'],
          [
            'PRDs and backlog',
            'Workflow connecting evidence, requirements and dependencies.',
          ],
          [
            'Prototyping and experimentation',
            'Copilot for hypotheses, prototypes and test design.',
          ],
          ['Roadmap and communication', 'Product Decision Brief with trade-offs.'],
        ],
      },
      sesion: {
        titular: 'Every recommendation declares the evidence behind it.',
        parrafos: [
          'Outputs are reviewed for traceability, problem clarity, hypothesis quality, testability and strategic coherence. The model proposes; the team decides.',
        ],
      },
      tecnologia: [
        'Controlled exports and documents from research, analytics, backlog, design and roadmapping may be used. The program does not replace product tools or create production integrations.',
      ],
      entregables: [
        'Product Copilot.',
        'Research synthesis protocol.',
        'Opportunity Definition Canvas.',
        'PRD and acceptance-criteria template.',
        'Experiment Design Kit.',
        'Product Decision Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include synthesis time, retrievable evidence, PRD rework, experiment-design speed, reopened decisions and asset reuse. Idea volume is not a learning metric.',
        ],
      },
      faq: [
        [
          'Will AI decide what to build?',
          'No. It organizes evidence and alternatives; prioritization stays with the team.',
        ],
        [
          'Does it work for qualitative and quantitative discovery?',
          'Yes, while preserving each method\'s limits.',
        ],
        [
          'Can it generate prototypes?',
          'It may accelerate first versions, whose value still requires a designed test.',
        ],
        [
          'Can it fit our product framework?',
          'Yes. Assets are built around existing rituals and criteria.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['technology-engineering', 'strategy-liderazgo', 'data-analytics'],
        servicios: [],
      },
      cta: 'Tell us which product decision needs better evidence today.',
    },
  },
  'project-management-pmo': {
    es: {
      seoTitulo: 'IA para Project Management y PMO | BECOME NOW™',
      seoDesc: 'IA aplicada a planificación, reuniones, status, riesgos, dependencias y portafolio para aumentar visibilidad y decisión.',
      eyebrow: 'BECOME NOW™ · PROJECT MANAGEMENT Y PMO',
      h1: 'Reduce la carga de seguimiento. Aumenta la visibilidad para decidir.',
      lead: 'Programa para equipos que coordinan iniciativas y necesitan convertir actualizaciones dispersas en compromisos, riesgos y decisiones visibles.',
      problema: {
        titular: 'El status ocupa más tiempo que la decisión que debería habilitar.',
        parrafos: [
          'La información del proyecto vive entre reuniones, planes, tickets, correos y presentaciones. Consolidarla manualmente produce reportes extensos que llegan tarde y no siempre distinguen avance, actividad, bloqueo y decisión pendiente.',
          'El programa usa IA para reducir trabajo de coordinación y elevar la calidad de la señal, sin inventar progreso ni reemplazar la responsabilidad de cada owner.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 define una única lectura del avance.',
        parrafos: [
          'Revisamos charter, plan, hitos, RAID log, minutas, reportes, gobernanza, herramientas y criterios de salud. Acordamos definiciones de avance, semáforos, escalamiento, materialidad y evidencia mínima para actualizar un compromiso.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para convertir seguimiento en control útil.',
        pasos: [
          ['IA para Project Management', 'Copilot alineado al método y gobernanza.'],
          [
            'Charter y planificación',
            'Asistente para alcance, hitos, supuestos y criterios de éxito.',
          ],
          ['Reuniones y decisiones', 'Tracker de acuerdos, owner, fecha y evidencia.'],
          [
            'Status y seguimiento',
            'Asistente que sintetiza cambios, no actividades repetidas.',
          ],
          ['Riesgos y dependencias', 'Radar con causa, impacto, trigger y acción.'],
          [
            'Portfolio y comunicación',
            'Brief que permite comparar iniciativas con criterios comunes.',
          ],
        ],
      },
      sesion: {
        titular: 'Un buen entregable permite saber quién debe hacer qué y por qué.',
        parrafos: [
          'Se valida contra fuentes del proyecto, reglas de status, ownership y fechas. Los activos no actualizan el plan por sí solos: preparan una actualización verificable y muestran las contradicciones que requieren decisión.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con documentos y exports de herramientas de proyectos, colaboración y portafolio. Las conexiones con Jira, Asana, Monday, Planner u otras plataformas corresponden a un alcance técnico posterior.',
      ],
      entregables: [
        'Project Management Copilot.',
        'Plantilla de charter y planificación asistida.',
        'Meeting and Decision Tracker.',
        'Estándar de status report.',
        'Risk and Dependency Radar.',
        'PMO Executive Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'El baseline puede incluir horas de consolidación, acciones sin owner, riesgos identificados tarde, reportes devueltos, decisiones pendientes y tiempo de preparación de comité.',
        ],
      },
      faq: [
        [
          '¿Actualiza automáticamente la herramienta de proyectos?',
          'No dentro del programa estándar. Primero se valida el proceso y la calidad de sus inputs.',
        ],
        [
          '¿Funciona con agile y waterfall?',
          'Sí. La malla se adapta al método, gobernanza y lenguaje existentes.',
        ],
        [
          '¿Puede generar minutas?',
          'Sí, con revisión de acuerdos, owners, fechas y decisiones antes de distribuir.',
        ],
        [
          '¿Sirve para portafolio?',
          'Sí, si existen criterios comparables y fuentes mínimas por iniciativa.',
        ],
      ],
      otros: {
        texto: 'Para ejecución operativa, revisa Operaciones. Para decisiones de portafolio, Strategy y Liderazgo. Para proyectos tecnológicos, Technology & Engineering.',
        programas: ['technology-engineering', 'strategy-liderazgo', 'operaciones'],
        servicios: [],
      },
      cta: 'Cuéntanos qué información de proyectos cuesta hoy convertir en decisión.',
    },
    en: {
      seoTitulo: 'AI for Project Management & PMO | BECOME NOW™',
      seoDesc: 'Applied AI for planning, meetings, status, risks, dependencies and portfolio visibility—built around project governance.',
      eyebrow: 'BECOME NOW™ · PROJECT MANAGEMENT & PMO',
      h1: 'Reduce follow-up work. Increase visibility for decisions.',
      lead: 'A program for teams coordinating initiatives and turning scattered updates into visible commitments, risks and decisions.',
      problema: {
        titular: 'Status reporting takes more time than the decision it should enable.',
        parrafos: [
          'Project information sits across meetings, plans, tickets, email and decks. Manual consolidation creates long reports that arrive late and blur activity, progress, blockers and pending decisions.',
        ],
      },
      sesion0: {
        titular: 'Session 0 establishes one shared reading of progress.',
        parrafos: [
          'We review charter, plans, milestones, RAID logs, minutes, governance, tools and health criteria. Progress, traffic lights, materiality and minimum evidence are defined.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['AI for Project Management', 'Copilot aligned with method and governance.'],
          ['Charter and planning', 'Assistant for scope, milestones and assumptions.'],
          ['Meetings and decisions', 'Tracker for decision, owner, date and evidence.'],
          [
            'Status and follow-up',
            'Assistant summarizing change rather than repeated activity.',
          ],
          ['Risks and dependencies', 'Radar with cause, impact, trigger and action.'],
          ['Portfolio communication', 'Brief for comparing initiatives consistently.'],
        ],
      },
      sesion: {
        titular: 'A useful output makes ownership and next action unmistakable.',
        parrafos: [
          'Results are checked against project sources, status rules, ownership and dates. Contradictions requiring a decision remain visible.',
        ],
      },
      tecnologia: [
        'Documents and exports from project, collaboration and portfolio tools may be used. Direct integrations with Jira, Asana, Monday, Planner or others are separate.',
      ],
      entregables: [
        'Project Management Copilot.',
        'Charter and planning template.',
        'Meeting and Decision Tracker.',
        'Status-report standard.',
        'Risk and Dependency Radar.',
        'PMO Executive Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include consolidation hours, ownerless actions, late risks, returned reports, pending decisions and committee preparation time.',
        ],
      },
      faq: [
        [
          'Will it update the project tool automatically?',
          'Not in the standard program. Inputs and workflow quality are validated first.',
        ],
        [
          'Does it work with agile and waterfall?',
          'Yes. The journey adapts to current language and governance.',
        ],
        [
          'Can it produce meeting minutes?',
          'Yes, with review of decisions, owners and dates.',
        ],
        [
          'Can it support portfolio management?',
          'Yes, when initiatives have comparable criteria and minimum evidence.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['technology-engineering', 'strategy-liderazgo', 'operaciones'],
        servicios: [],
      },
      cta: 'Tell us which project information is hardest to turn into a decision.',
    },
  },
  'recursos-humanos': {
    es: {
      seoTitulo: 'IA para Recursos Humanos | BECOME NOW™',
      seoDesc: 'IA aplicada a recruitment, onboarding, learning, performance, employee experience y people insights con revisión humana.',
      eyebrow: 'BECOME NOW™ · RECURSOS HUMANOS',
      h1: 'Ayuda a Recursos Humanos a trabajar con más contexto y mantener el criterio humano.',
      lead: 'Programa para equipos de People que necesitan reducir trabajo documental, personalizar experiencias y preparar mejores decisiones sin delegarlas a un modelo.',
      problema: {
        titular: 'La eficiencia puede crecer mientras también crece el riesgo de tratar personas como patrones.',
        parrafos: [
          'La IA puede redactar perfiles, resumir feedback y proponer rutas de aprendizaje. También puede reproducir sesgos, inferir información que no corresponde o convertir una recomendación en una decisión opaca.',
          'BECOME NOW™ enseña a utilizarla como apoyo de preparación, organización y comunicación, manteniendo datos personales, fairness y responsabilidad dentro del diseño del proceso.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 clasifica casos por sensibilidad antes de enseñar herramientas.',
        parrafos: [
          'Revisamos políticas, perfiles, competencias, journeys, contenidos, formatos de feedback, encuestas y métricas. Definimos datos permitidos, revisión humana, criterios de equidad, explicabilidad y casos excluidos.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para asistir el trabajo de People sin automatizar el juicio.',
        pasos: [
          [
            'IA responsable para Recursos Humanos',
            'HR Copilot con usos permitidos y límites.',
          ],
          [
            'Recruitment y perfiles',
            'Asistente para perfiles e interview guides basados en competencias.',
          ],
          ['Onboarding', 'Diseñador de journeys por rol, momento y necesidad.'],
          [
            'Learning y desarrollo',
            'Asistente para rutas con objetivos y evidencia de aprendizaje.',
          ],
          [
            'Performance y feedback',
            'Copilot para preparar conversaciones, no evaluaciones automáticas.',
          ],
          [
            'People insights y comunicación',
            'Síntesis de señales agregadas con privacidad y contexto.',
          ],
        ],
      },
      sesion: {
        titular: 'Cada activo debe preservar dignidad, privacidad y una persona accountable.',
        parrafos: [
          'Los ejercicios se validan por pertinencia, lenguaje inclusivo, base factual, minimización de datos y posibilidad de explicación. No se delegan contratación, evaluación, promoción ni desvinculación.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con plantillas y exports controlados de ATS, HRIS, LMS, encuestas o repositorios de políticas. El programa no conecta datos personales ni toma decisiones dentro de esos sistemas.',
      ],
      entregables: [
        'HR Copilot y mapa de usos permitidos.',
        'Kit de perfil e entrevista por competencias.',
        'Onboarding Journey Assistant.',
        'Learning Path Designer.',
        'Guía de preparación de feedback.',
        'Protocolo de people insights agregados.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Los indicadores pueden incluir tiempo de preparación, consistencia, retrabajo, reutilización, comprensión del colaborador y cumplimiento del revisión humana. Ninguna métrica de eficiencia justifica delegar una decisión sobre personas.',
        ],
      },
      faq: [
        [
          '¿Puede filtrar o elegir candidatos?',
          'No. Puede apoyar perfiles, preguntas y organización; la decisión no se delega.',
        ],
        [
          '¿Se pueden usar datos personales?',
          'Solo si la política y el entorno lo autorizan, aplicando minimización y propósito explícito.',
        ],
        [
          '¿Cómo se aborda el bias?',
          'Con criterios previos, pruebas de lenguaje y resultados, revisión humana y documentación.',
        ],
        [
          '¿Puede personalizar aprendizaje?',
          'Sí, a partir de información autorizada y sin inferir atributos sensibles.',
        ],
      ],
      otros: {
        texto: 'Para adopción ejecutiva, revisa Strategy y Liderazgo. Para comunicación interna, Marketing y Comunicaciones. Para riesgos y políticas, Legal, Compliance y Risk.',
        programas: ['legal-compliance-risk', 'marketing-comunicaciones', 'strategy-liderazgo'],
        servicios: [],
      },
      cta: 'Cuéntanos qué parte del trabajo de Recursos Humanos necesita más capacidad y más cuidado.',
    },
    en: {
      seoTitulo: 'AI for Human Resources | BECOME NOW™',
      seoDesc: 'Applied AI for recruitment, onboarding, learning, performance, employee experience and people insight with human review.',
      eyebrow: 'BECOME NOW™ · HUMAN RESOURCES',
      h1: 'Help HR work with more context while keeping judgment human.',
      lead: 'A program for People teams reducing document work, personalizing experiences and preparing stronger decisions without handing those decisions to a model.',
      problema: {
        titular: 'Efficiency can rise at the same time as the risk of treating people as patterns.',
        parrafos: [
          'AI can draft profiles, summarize feedback and suggest learning paths. It can also reproduce bias, infer inappropriate information or turn a suggestion into an opaque decision.',
          'The program keeps personal data, fairness and accountability inside the workflow design.',
        ],
      },
      sesion0: {
        titular: 'Session 0 classifies use cases by sensitivity before tools are taught.',
        parrafos: [
          'We review policies, profiles, competencies, journeys, learning material, feedback formats, surveys and metrics. Permitted data, human review, fairness and excluded cases are agreed.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['Responsible AI for HR', 'HR Copilot with permitted uses and limits.'],
          [
            'Recruitment and profiles',
            'Competency-based profile and interview assistant.',
          ],
          ['Onboarding', 'Journey designer by role, moment and need.'],
          ['Learning and development', 'Assistant for paths and learning evidence.'],
          [
            'Performance and feedback',
            'Copilot for preparing conversations—not ratings.',
          ],
          [
            'People insight and communication',
            'Aggregated synthesis with privacy and context.',
          ],
        ],
      },
      sesion: {
        titular: 'Every asset must preserve dignity, privacy and accountable ownership.',
        parrafos: [
          'Exercises are validated for relevance, inclusive language, factual basis, data minimization and explainability. Hiring, ratings, promotion and termination are not delegated.',
        ],
      },
      tecnologia: [
        'Controlled templates and exports from ATS, HRIS, LMS, surveys or policy repositories may be used. The program does not connect personal data or act inside those systems.',
      ],
      entregables: [
        'HR Copilot and permitted-use map.',
        'Competency profile and interview kit.',
        'Onboarding Journey Assistant.',
        'Learning Path Designer.',
        'Feedback preparation guide.',
        'Aggregated people-insight protocol.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include preparation time, consistency, rework, reuse, employee comprehension and human-review compliance.',
        ],
      },
      faq: [
        [
          'Can AI screen or select candidates?',
          'No. It may support profiles and questions; the decision is not delegated.',
        ],
        [
          'Can personal data be used?',
          'Only with approved purpose, environment and minimization.',
        ],
        [
          'How is bias addressed?',
          'Through prior criteria, testing, human review and documentation.',
        ],
        [
          'Can learning be personalized?',
          'Yes, from authorized information without inferring sensitive traits.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['legal-compliance-risk', 'marketing-comunicaciones', 'strategy-liderazgo'],
        servicios: [],
      },
      cta: 'Tell us where HR needs more capability—and more care.',
    },
  },
  'strategy-liderazgo': {
    es: {
      seoTitulo: 'IA para Estrategia y Liderazgo | BECOME NOW™',
      seoDesc: 'Programa para líderes que usan IA en research, escenarios, decision memos, reuniones, portafolio y comunicación ejecutiva.',
      eyebrow: 'BECOME NOW™ · STRATEGY Y LIDERAZGO',
      h1: 'Utiliza la IA para ampliar el análisis, no para delegar la decisión.',
      lead: 'Programa para líderes que necesitan investigar, comparar escenarios, preparar decisiones y comunicar con mayor claridad en contextos de información incompleta.',
      problema: {
        titular: 'La IA puede producir una recomendación antes de revelar sus supuestos.',
        parrafos: [
          'Un memo bien escrito puede ocultar una fuente débil. Un escenario completo puede omitir la variable que más importa. Para el liderazgo, el valor no está en obtener una respuesta más rápido, sino en ampliar opciones, hacer visibles los trade-offs y preparar una mejor conversación de decisión.',
          'El programa construye una disciplina ejecutiva para preguntar, contrastar y comunicar con IA sin externalizar responsabilidad.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 parte de decisiones reales, no de una lista de herramientas.',
        parrafos: [
          'Revisamos agenda estratégica, fuentes, formatos de comité, decisiones recurrentes, riesgos, stakeholders y criterios de inversión. Elegimos casos donde sea posible distinguir evidencia, inferencia, supuesto, escenario y elección.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones para convertir información dispersa en decisiones explícitas.',
        pasos: [
          [
            'IA para el trabajo ejecutivo',
            'Executive Copilot con principios y límites.',
          ],
          [
            'Research y market intelligence',
            'Asistente que contrasta fuentes y vacíos.',
          ],
          [
            'Escenarios y strategic choices',
            'Copilot con drivers, señales y trade-offs.',
          ],
          [
            'Decision memos',
            'Asistente con recomendación, alternativas y evidencia contraria.',
          ],
          [
            'Reuniones y seguimiento',
            'Tracker de decisiones, compromisos y condiciones.',
          ],
          [
            'Portfolio y comunicación',
            'Brief que conecta prioridades, capacidad, riesgo y resultados.',
          ],
        ],
      },
      sesion: {
        titular: 'El modelo debe mejorar la calidad de la pregunta antes que la elegancia de la respuesta.',
        parrafos: [
          'Cada entregable se somete a fuentes contradictorias, supuestos alternativos y criterios de decisión. El equipo documenta qué cambió en su juicio y qué información aún necesita.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con documentos estratégicos, research, reportes y materiales de comité dentro del entorno autorizado. La información interna se usa según sus reglas de confidencialidad; el programa no sustituye fuentes especializadas ni due diligence.',
      ],
      entregables: [
        'Executive AI Copilot.',
        'Protocolo de research con jerarquía de fuentes.',
        'Scenario Planning Canvas.',
        'Plantilla de decision memo.',
        'Meeting and Commitment Tracker.',
        'Strategy Portfolio Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'El valor puede observarse en tiempo de preparación, fuentes contrastadas, supuestos visibles, alternativas consideradas, decisiones reabiertas y compromisos con seguimiento. Una respuesta más rápida no es una mejor decisión por sí sola.',
        ],
      },
      faq: [
        [
          '¿Es una capacitación técnica?',
          'No. Está diseñada para decisiones ejecutivas y trabajo de liderazgo.',
        ],
        [
          '¿La IA recomienda qué estrategia seguir?',
          'Puede estructurar alternativas; la elección permanece en los líderes.',
        ],
        [
          '¿Cómo se evita depender de información desactualizada?',
          'Registrando fuente y fecha, y contrastando con fuentes autorizadas.',
        ],
        [
          '¿Puede adaptarse a un comité específico?',
          'Sí. Los casos pueden construirse sobre su agenda, formatos y decisiones recurrentes.',
        ],
      ],
      otros: {
        texto: 'Para análisis profundo, revisa Data & Analytics. Para portafolio de iniciativas, Project Management y PMO. Para descubrir dónde crear valor empresarial, BECOME DISCOVER™.',
        programas: ['project-management-pmo', 'data-analytics'],
        servicios: ['become-discover'],
      },
      cta: 'Cuéntanos qué decisión necesita hoy más contexto y mejores preguntas.',
    },
    en: {
      seoTitulo: 'AI for Strategy & Leadership | BECOME NOW™',
      seoDesc: 'Applied AI for executive research, scenarios, decision memos, meetings, portfolios and leadership communication.',
      eyebrow: 'BECOME NOW™ · STRATEGY & LEADERSHIP',
      h1: 'Use AI to expand analysis—not outsource the decision.',
      lead: 'A program for leaders researching markets, comparing scenarios, preparing decisions and communicating through incomplete information.',
      problema: {
        titular: 'AI can recommend before revealing what the recommendation assumes.',
        parrafos: [
          'A polished memo may hide a weak source. A complete scenario may omit the variable that matters most. Executive value comes from expanding options, exposing trade-offs and improving the decision conversation.',
        ],
      },
      sesion0: {
        titular: 'Session 0 starts with live decisions, not a tool list.',
        parrafos: [
          'We review the strategic agenda, sources, committee formats, recurring decisions, risks, stakeholders and investment criteria. Cases must separate evidence, inference, assumption, scenario and choice.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['AI for executive work', 'Executive Copilot with principles and limits.'],
          [
            'Research and market intelligence',
            'Assistant contrasting sources and gaps.',
          ],
          [
            'Scenarios and strategic choices',
            'Copilot for drivers, signals and trade-offs.',
          ],
          ['Decision memos', 'Assistant including alternatives and counterevidence.'],
          ['Meetings and follow-through', 'Decision and commitment tracker.'],
          [
            'Portfolio communication',
            'Brief connecting priorities, capacity, risk and outcomes.',
          ],
        ],
      },
      sesion: {
        titular: 'The model should improve the question before polishing the answer.',
        parrafos: [
          'Outputs are challenged with contradictory sources, alternative assumptions and explicit criteria. Leaders document what changed in their judgment.',
        ],
      },
      tecnologia: [
        'Strategic documents, research, reports and committee material may be used under approved confidentiality rules. The program does not replace specialist sources or due diligence.',
      ],
      entregables: [
        'Executive AI Copilot.',
        'Research protocol and source hierarchy.',
        'Scenario Planning Canvas.',
        'Decision-memo template.',
        'Meeting and Commitment Tracker.',
        'Strategy Portfolio Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include preparation time, sources contrasted, visible assumptions, alternatives considered, reopened decisions and tracked commitments.',
        ],
      },
      faq: [
        [
          'Is this technical training?',
          'No. It is designed around executive decisions.',
        ],
        [
          'Will AI choose the strategy?',
          'It structures alternatives; leaders retain the choice.',
        ],
        [
          'How is stale information controlled?',
          'Every source carries a date and is checked against approved references.',
        ],
        [
          'Can it be built around one committee?',
          'Yes. Cases can use its agenda, formats and recurring decisions.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['project-management-pmo', 'data-analytics'],
        servicios: ['become-discover'],
      },
      cta: 'Tell us which decision needs more context and better questions.',
    },
  },
  'supply-chain-compras': {
    es: {
      seoTitulo: 'IA para Supply Chain y Compras | BECOME NOW™',
      seoDesc: 'IA aplicada a demanda, inventarios, proveedores, compras, contratos, riesgos y seguimiento de supply chain.',
      eyebrow: 'BECOME NOW™ · SUPPLY CHAIN Y COMPRAS',
      h1: 'Convierte datos, excepciones y proveedores en decisiones más rápidas.',
      lead: 'Programa para equipos que necesitan reunir señales de demanda, inventario, abastecimiento y riesgo sin perder control contractual ni trazabilidad.',
      problema: {
        titular: 'La cadena cambia antes de que el reporte termine de explicarla.',
        parrafos: [
          'Una ruptura, un atraso o una variación de demanda aparece en sistemas distintos y se interpreta desde funciones diferentes. La IA puede ayudar a conectar señales y preparar escenarios, pero no debe inventar disponibilidad, condiciones ni desempeño de un proveedor.',
          'El programa convierte información dispersa en procesos de análisis y comunicación con criterios comunes para Compras, Planeamiento y Operaciones.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 selecciona decisiones, fuentes y excepciones críticas.',
        parrafos: [
          'Revisamos pronósticos, inventarios, órdenes, contratos, scorecards, incidencias, lead times, políticas de compra y reportes. Definimos qué dato es oficial, qué tolerancias importan y qué evento exige revisión o escalamiento.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones desde la señal hasta la acción coordinada.',
        pasos: [
          ['IA para Supply Chain', 'Copilot con contexto, categorías y reglas.'],
          ['Demanda e inventarios', 'Asistente para variaciones, drivers y cobertura.'],
          [
            'Evaluación de proveedores',
            'Flujo que compara evidencia contra criterios aprobados.',
          ],
          ['Compras y contratos', 'Revisor de requerimientos, ofertas y condiciones.'],
          ['Riesgos y excepciones', 'Radar con trigger, impacto, alternativa y owner.'],
          [
            'Control tower y comunicación',
            'Brief para alinear decisiones entre áreas.',
          ],
        ],
      },
      sesion: {
        titular: 'Una recomendación debe conservar la fecha, la fuente y la restricción operativa.',
        parrafos: [
          'Los entregables se validan por precisión, cobertura, vigencia, cumplimiento de políticas y tratamiento de excepciones. El activo muestra cuándo necesita información adicional y cuándo debe escalar.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con exports y documentos de ERP, procurement, planning, WMS o supplier management. La capacitación no ejecuta órdenes, adjudica proveedores ni modifica inventarios.',
      ],
      entregables: [
        'Supply Chain Copilot.',
        'Plantilla de demand and inventory insight.',
        'Supplier Evaluation Assistant.',
        'Checklist de compras y contratos.',
        'Supply Chain Risk Radar.',
        'Executive Supply Chain Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'El baseline puede incluir tiempo de consolidación, excepciones detectadas, cobertura de riesgo, consistencia de evaluación, retrabajo y velocidad de escalamiento. Las decisiones de compra permanecen bajo gobernanza del cliente.',
        ],
      },
      faq: [
        [
          '¿La IA pronostica demanda?',
          'Puede asistir análisis y escenarios; el forecast oficial se valida con los modelos y responsables definidos.',
        ],
        [
          '¿Puede elegir proveedores?',
          'No. Organiza evidencia y aplica criterios; la decisión sigue el proceso de compras.',
        ],
        [
          '¿Revisa contratos?',
          'Puede extraer y comparar condiciones para revisión profesional.',
        ],
        [
          '¿Necesitamos integrar el ERP?',
          'No para empezar. La capacitación puede usar exports controlados; una integración se evalúa después.',
        ],
      ],
      otros: {
        texto: 'Para ejecución y SOPs, revisa Operaciones. Para contratos y riesgo, Legal, Compliance y Risk. Para análisis cuantitativo, Data & Analytics.',
        programas: ['legal-compliance-risk', 'data-analytics', 'operaciones'],
        servicios: [],
      },
      cta: 'Cuéntanos qué excepción de Supply Chain consume hoy más coordinación.',
    },
    en: {
      seoTitulo: 'AI for Supply Chain & Procurement | BECOME NOW™',
      seoDesc: 'Applied AI for demand, inventory, suppliers, procurement, contracts, risk and supply-chain coordination.',
      eyebrow: 'BECOME NOW™ · SUPPLY CHAIN & PROCUREMENT',
      h1: 'Turn data, exceptions and supplier signals into faster decisions.',
      lead: 'A program for teams bringing demand, inventory, supply and risk signals together without losing contractual control or traceability.',
      problema: {
        titular: 'The chain changes before the report finishes explaining it.',
        parrafos: [
          'A disruption, delay or demand shift appears in different systems and is interpreted by different teams. AI can connect signals and prepare scenarios, but it must not invent availability, terms or supplier performance.',
        ],
      },
      sesion0: {
        titular: 'Session 0 selects the decisions, sources and exceptions that matter most.',
        parrafos: [
          'We review forecasts, inventory, purchase orders, contracts, scorecards, incidents, lead times, policies and reports. Official data, tolerances and escalation triggers are agreed.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['AI for Supply Chain', 'Copilot with categories and operating rules.'],
          ['Demand and inventory', 'Assistant for variation, drivers and coverage.'],
          ['Supplier evaluation', 'Evidence compared with approved criteria.'],
          ['Procurement and contracts', 'Reviewer for requirements, bids and terms.'],
          ['Risk and exceptions', 'Radar with trigger, impact, alternative and owner.'],
          ['Control-tower communication', 'Brief aligning decisions across teams.'],
        ],
      },
      sesion: {
        titular: 'Every recommendation keeps its source, date and operating constraint.',
        parrafos: [
          'Outputs are validated for accuracy, coverage, currency, policy compliance and exceptions. Each asset knows when to request more information or escalate.',
        ],
      },
      tecnologia: [
        'Controlled exports and documents from ERP, procurement, planning, WMS or supplier platforms may be used. The program does not place orders or award suppliers.',
      ],
      entregables: [
        'Supply Chain Copilot.',
        'Demand and Inventory Insight template.',
        'Supplier Evaluation Assistant.',
        'Procurement and contract checklist.',
        'Supply Chain Risk Radar.',
        'Executive Supply Chain Brief.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Baselines may include consolidation time, exceptions detected, risk coverage, evaluation consistency, rework and escalation speed.',
        ],
      },
      faq: [
        [
          'Will AI forecast demand?',
          'It may assist analysis; the official forecast follows approved models and owners.',
        ],
        [
          'Can it choose suppliers?',
          'No. It organizes evidence; the decision remains governed.',
        ],
        [
          'Can it review contracts?',
          'It can extract and compare terms for professional review.',
        ],
        [
          'Do we need ERP integration?',
          'No. Controlled exports are enough to begin.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['legal-compliance-risk', 'data-analytics', 'operaciones'],
        servicios: [],
      },
      cta: 'Tell us which supply-chain exception consumes the most coordination.',
    },
  },
  'technology-engineering': {
    es: {
      seoTitulo: 'IA para Technology & Engineering | BECOME NOW™',
      seoDesc: 'Programa para diseñar, evaluar y gobernar soluciones con LLMs, RAG, tool calling, agentes, controles y observabilidad.',
      eyebrow: 'BECOME NOW™ · TECHNOLOGY & ENGINEERING',
      h1: 'Construye criterio para trabajar con LLMs, agentes y sistemas de IA.',
      lead: 'Programa para equipos técnicos que necesitan tomar mejores decisiones sobre arquitectura, desarrollo, evaluación, integración y operación de capacidades basadas en IA.',
      problema: {
        titular: 'Una demo puede funcionar mucho antes de que exista un sistema confiable.',
        parrafos: [
          'El prompt responde, el agent ejecuta y el prototipo impresiona. Después aparecen contexto insuficiente, evaluaciones frágiles, permisos, latencia, costo, observabilidad y ownership. El reto no es llamar a un modelo: es diseñar una capacidad que pueda fallar de forma visible y controlada.',
          'BECOME NOW™ conecta práctica con criterio de ingeniería para que el equipo sepa qué construir, cómo probarlo y cuándo no usar un LLM.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 define un caso técnico y sus restricciones operativas.',
        parrafos: [
          'Revisamos arquitectura, repositorios, APIs, fuentes de conocimiento, entornos, seguridad, SLAs, costos, stack y estándares. Acordamos dataset de evaluación, comportamientos esperados, amenazas, observabilidad y puntos de revisión humana.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones desde el modelo hasta la operación.',
        pasos: [
          [
            'Modelos fundacionales y prompting',
            'Engineering Copilot con criterios de revisión.',
          ],
          [
            'Context engineering, RAG y embeddings',
            'Asistente grounded sobre conocimiento técnico.',
          ],
          [
            'APIs, tool calling y MCP',
            'Flujo que consulta sistemas en vez de responder de memoria.',
          ],
          [
            'Agentic procesos y model routing',
            'Orquestación con límites y aprobación humana.',
          ],
          [
            'Evaluaciones, controles y testing',
            'Suite de evals y criterios de release.',
          ],
          [
            'Observabilidad, incidentes y costos',
            'Manual de operación con trazas, monitoreo y responsable asignado.',
          ],
        ],
      },
      sesion: {
        titular: 'Cada capacidad se prueba contra comportamiento esperado, fallo y abuso.',
        parrafos: [
          'El equipo documenta arquitectura, dependencias, amenazas, dataset de evaluación y umbrales. No basta una respuesta correcta: importa consistencia, seguridad, latencia, costo y recuperabilidad.',
        ],
      },
      tecnologia: [
        'La ruta puede adaptarse a los modelos, clouds, frameworks y estándares autorizados. Los laboratorios usan entornos controlados; un deployment productivo requiere alcance, seguridad y operación definidos.',
      ],
      entregables: [
        'Engineering Copilot y policy de uso.',
        'Diseño de context engineering o RAG.',
        'Blueprint de tool calling / MCP.',
        'Agentic Workflow Blueprint™.',
        'Dataset y suite inicial de evaluaciones.',
        'Manual de operación de observabilidad, incidentes y control de costos.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Se pueden medir pass rate de evals, groundedness, defectos detectados, latencia, costo por tarea, intervención humana e incidentes. La métrica depende del riesgo y del comportamiento que la capacidad debe sostener.',
        ],
      },
      faq: [
        [
          '¿Es un bootcamp de programación?',
          'No. Combina práctica y criterio para diseñar soluciones empresariales con IA.',
        ],
        [
          '¿Trabaja con un proveedor específico?',
          'No. La ruta se adapta al stack y puede comparar alternativas.',
        ],
        [
          '¿Incluye agentes?',
          'Sí, cuando el caso justifica autonomía, herramientas y controles.',
        ],
        [
          '¿El resultado queda en producción?',
          'No necesariamente. El programa instala capacidad y prototipos controlados; producción corresponde a un proyecto de implementación.',
        ],
      ],
      otros: {
        texto: 'Para casos y decisiones de producto, revisa Product e Innovación. Para datos, Data & Analytics. Para construir y operar una capacidad priorizada, BECOME EMBED™.',
        programas: ['product-innovacion', 'data-analytics'],
        servicios: ['become-embed'],
      },
      cta: 'Cuéntanos qué capacidad de IA necesita hoy más criterio de ingeniería.',
    },
    en: {
      seoTitulo: 'AI for Technology & Engineering | BECOME NOW™',
      seoDesc: 'Design, evaluate and govern LLM, RAG, tool-calling and agent systems with guardrails, observability and cost control.',
      eyebrow: 'BECOME NOW™ · TECHNOLOGY & ENGINEERING',
      h1: 'Build the judgment required to work with LLMs, agents and AI systems.',
      lead: 'A program for technical teams making stronger architecture, development, evaluation, integration and operating decisions for AI capabilities.',
      problema: {
        titular: 'A demo works long before a dependable system exists.',
        parrafos: [
          'The prompt responds and the agent acts. Then context, evals, permissions, latency, cost, observability and ownership appear. The challenge is not calling a model; it is designing a capability that fails visibly and safely.',
        ],
      },
      sesion0: {
        titular: 'Session 0 defines one technical case and its operating constraints.',
        parrafos: [
          'We review architecture, repositories, APIs, knowledge, environments, security, SLAs, costs and standards. Evaluation data, expected behavior, threats, observability and human review are agreed.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          [
            'Foundation models and prompting',
            'Engineering Copilot with review criteria.',
          ],
          ['Context engineering, RAG and embeddings', 'Grounded technical assistant.'],
          [
            'APIs, tool calling and MCP',
            'Workflow that consults systems instead of guessing.',
          ],
          ['Agentic workflows and routing', 'Orchestration with limits and approval.'],
          ['Evaluations, guardrails and testing', 'Eval suite and release criteria.'],
          ['Observability, incidents and cost', 'Runbook with tracing and ownership.'],
        ],
      },
      sesion: {
        titular: 'Every capability is tested for expected behavior, failure and misuse.',
        parrafos: [
          'The team documents architecture, dependencies, threats, evaluation data and thresholds. Correctness, consistency, security, latency, cost and recoverability all matter.',
        ],
      },
      tecnologia: [
        'The journey adapts to approved models, clouds, frameworks and standards. Labs use controlled environments; production deployment requires an implementation scope.',
      ],
      entregables: [
        'Engineering Copilot and usage policy.',
        'Context engineering or RAG design.',
        'Tool calling / MCP blueprint.',
        'Agentic Workflow Blueprint™.',
        'Evaluation dataset and initial suite.',
        'Observability, incident and cost runbook.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include eval pass rate, groundedness, defects caught, latency, cost per task, human intervention and incidents.',
        ],
      },
      faq: [
        [
          'Is this a coding bootcamp?',
          'No. It combines practice and engineering judgment for enterprise AI.',
        ],
        [
          'Is it tied to one provider?',
          'No. It adapts to and can compare the approved stack.',
        ],
        [
          'Are agents included?',
          'Yes, when the use case justifies tools, autonomy and controls.',
        ],
        [
          'Does the result go to production?',
          'Not necessarily. Production belongs to an implementation engagement.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['product-innovacion', 'data-analytics'],
        servicios: ['become-embed'],
      },
      cta: 'Tell us which AI capability needs stronger engineering judgment.',
    },
  },
  'ventas': {
    es: {
      seoTitulo: 'IA para Ventas y Equipos Comerciales | BECOME NOW™',
      seoDesc: 'IA aplicada a investigación de cuentas, calificación, reuniones, propuestas, objeciones, seguimiento y pipeline comercial.',
      eyebrow: 'BECOME NOW™ · VENTAS',
      h1: 'Ayuda a tu equipo comercial a investigar mejor, responder más rápido y vender con mayor contexto.',
      lead: 'Programa para equipos B2B que necesitan convertir información de cuentas, reuniones y pipeline en preparación y siguientes acciones consistentes.',
      problema: {
        titular: 'El vendedor conoce al cliente. El sistema no siempre conserva ese contexto.',
        parrafos: [
          'Notas, correos, CRM, propuestas y conversaciones contienen señales sobre necesidad, timing y objeciones. Cuando están fragmentadas, cada reunión empieza reconstruyendo la historia y cada propuesta depende demasiado de quién la prepara.',
          'BECOME NOW™ transforma ese conocimiento en procesos comerciales reutilizables sin inventar datos, automatizar relaciones ni convertir personalización en texto genérico.',
        ],
      },
      sesion0: {
        titular: 'La Sesión 0 reconstruye el proceso comercial y sus criterios de avance.',
        parrafos: [
          'Revisamos ICP, ofertas, playbook, etapas, campos de CRM, casos ganados y perdidos, propuestas, objeciones, reuniones y gobernanza. Acordamos fuentes autorizadas, señales de calificación, tono, claims permitidos y revisión antes de contactar al cliente.',
        ],
      },
      ruta: {
        bajada: 'Seis sesiones desde la investigación hasta el siguiente movimiento comercial.',
        pasos: [
          [
            'IA para el proceso comercial',
            'Sales Copilot adaptado a oferta, cliente y método.',
          ],
          [
            'Cuentas y oportunidades',
            'Research Assistant con fuente, fecha e hipótesis.',
          ],
          [
            'Calificación y priorización',
            'Asistente que aplica criterios y muestra información faltante.',
          ],
          [
            'Preparación de reuniones',
            'Copilot con contexto, preguntas y outcome buscado.',
          ],
          [
            'Propuestas y objeciones',
            'Asistente que conecta necesidad, evidencia y diferenciadores.',
          ],
          [
            'Seguimiento y pipeline',
            'Narrative y Next-Best-Action con owner y fundamento.',
          ],
        ],
      },
      sesion: {
        titular: 'El entregable debe sonar informado, no automatizado.',
        parrafos: [
          'Se valida contra datos de la cuenta, playbook, claims autorizados, etapa y objetivo. El equipo revisa qué información es un hecho, qué es una hipótesis y qué debe confirmarse con el cliente.',
        ],
      },
      tecnologia: [
        'Podemos trabajar con exports y documentos de CRM, sales enablement, correo, reuniones y propuestas. El programa no envía mensajes, actualiza oportunidades ni toma acciones sobre clientes sin aprobación.',
      ],
      entregables: [
        'Sales Copilot.',
        'Account Research Brief.',
        'Matriz de calificación y priorización.',
        'Meeting Preparation Copilot.',
        'Proposal and Objection Assistant.',
        'Pipeline Narrative y Next-Best-Action template.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Se puede medir tiempo de preparación, campos completos, consistencia de calificación, iteraciones de propuesta, seguimiento oportuno y adopción del proceso. Revenue y conversión dependen de múltiples factores y no se atribuyen al programa sin diseño de medición.',
        ],
      },
      faq: [
        [
          '¿La IA contactará prospectos automáticamente?',
          'No dentro del programa. Los mensajes se preparan y revisan antes de cualquier envío.',
        ],
        [
          '¿Puede usar información del CRM?',
          'Sí mediante datos o exports autorizados; una integración directa se diseña aparte.',
        ],
        [
          '¿Sirve para ventas consultivas?',
          'Sí. La ruta prioriza investigación, preguntas, evidencia y avance de la decisión.',
        ],
        [
          '¿Puede calificar leads?',
          'Puede aplicar criterios acordados y señalar vacíos; la decisión permanece en el proceso comercial.',
        ],
      ],
      otros: {
        texto: 'Para generación de demanda y mensajes, revisa Marketing y Comunicaciones. Para experiencia postventa, Customer Service y CX. Para análisis de pipeline, Data & Analytics.',
        programas: ['marketing-comunicaciones', 'customer-service-cx', 'data-analytics'],
        servicios: [],
      },
      cta: 'Cuéntanos en qué momento del proceso comercial se pierde hoy más contexto.',
    },
    en: {
      seoTitulo: 'AI for Sales Teams | BECOME NOW™',
      seoDesc: 'Applied AI for account research, qualification, meeting preparation, proposals, objections, follow-up and pipeline management.',
      eyebrow: 'BECOME NOW™ · SALES',
      h1: 'Help sales teams research better, respond faster and sell with more context.',
      lead: 'A program for B2B teams turning account, meeting and pipeline information into consistent preparation and next actions.',
      problema: {
        titular: 'The seller knows the customer. The system rarely retains the full context.',
        parrafos: [
          'Notes, email, CRM, proposals and conversations hold signals about need, timing and objections. When fragmented, every meeting rebuilds the story and every proposal depends too heavily on who prepares it.',
          'The program turns commercial knowledge into reusable workflows without inventing data or automating relationships.',
        ],
      },
      sesion0: {
        titular: 'Session 0 reconstructs the sales process and its progression criteria.',
        parrafos: [
          'We review ICP, offers, playbook, stages, CRM fields, wins and losses, proposals, objections and meetings. Sources, qualification signals, tone, permitted claims and pre-contact review are agreed.',
        ],
      },
      ruta: {
        bajada: '',
        pasos: [
          ['AI for the sales process', 'Sales Copilot adapted to offer and method.'],
          ['Accounts and opportunities', 'Research Assistant with source and date.'],
          [
            'Qualification and priority',
            'Assistant applying criteria and exposing missing data.',
          ],
          [
            'Meeting preparation',
            'Copilot with context, questions and intended outcome.',
          ],
          [
            'Proposals and objections',
            'Assistant connecting need, evidence and differentiation.',
          ],
          ['Follow-up and pipeline', 'Narrative and Next-Best-Action with rationale.'],
        ],
      },
      sesion: {
        titular: 'The output should sound informed—not automated.',
        parrafos: [
          'It is checked against account data, playbook, approved claims, stage and objective. Facts, hypotheses and open questions remain distinct.',
        ],
      },
      tecnologia: [
        'Controlled exports and documents from CRM, enablement, email, meeting and proposal tools may be used. The program does not send messages or act on customer records without approval.',
      ],
      entregables: [
        'Sales Copilot.',
        'Account Research Brief.',
        'Qualification and prioritization matrix.',
        'Meeting Preparation Copilot.',
        'Proposal and Objection Assistant.',
        'Pipeline Narrative and Next-Best-Action template.',
      ],
      medicion: {
        titular: '',
        parrafos: [
          'Measures may include preparation time, complete fields, qualification consistency, proposal rounds, timely follow-up and workflow adoption. Revenue attribution requires a separate measurement design.',
        ],
      },
      faq: [
        [
          'Will AI contact prospects automatically?',
          'No. Messages are prepared and reviewed before sending.',
        ],
        [
          'Can it use CRM data?',
          'Yes through approved data or exports; direct integration is separate.',
        ],
        [
          'Does it fit consultative sales?',
          'Yes. It prioritizes research, questions, evidence and decision progression.',
        ],
        [
          'Can it qualify leads?',
          'It may apply agreed criteria and flag gaps; ownership remains in the sales process.',
        ],
      ],
      otros: {
        texto: '',
        programas: ['marketing-comunicaciones', 'customer-service-cx', 'data-analytics'],
        servicios: [],
      },
      cta: 'Tell us where the sales process loses the most context today.',
    },
  },
};
