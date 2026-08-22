/**
 * Las seis industrias: contenido completo en los dos idiomas.
 *
 * ---- Por qué industria NO es lo mismo que área funcional ----
 *
 * En este sitio ya existe `/es/servicios/become-now/finanzas`: un programa de
 * capacitación para el ÁREA de finanzas, sea cual sea la empresa. Y ahora
 * existe `/es/industrias/servicios-financieros`: cómo se transforma una empresa
 * cuyo NEGOCIO es financiero. Son dos cosas distintas y confundirlas produce
 * dos páginas compitiendo por lo mismo, que es de los pocos errores de SEO que
 * se castigan de verdad.
 *
 * La regla que las separa: un programa habla de una función dentro de
 * cualquier empresa; una industria habla del negocio entero de un sector. Por
 * eso ninguna página de industria repite el contenido de un programa: lo
 * enlaza.
 *
 * ---- Por qué el contenido vive aquí y no en los componentes ----
 *
 * Doce páginas —seis industrias por dos idiomas— con la misma estructura. Como
 * componentes serían doce archivos que se desincronizan a la tercera edición.
 * Aquí la estructura se define una vez y lo que cambia es el texto.
 *
 * ---- Y por qué los enlaces se guardan como slug y no como URL ----
 *
 * Los slugs de las soluciones NO son iguales en los dos idiomas
 * (`escalar-ia` / `scale-ai-beyond-pilots`). Guardando la URL completa habría
 * que escribir cada enlace dos veces y acordarse de las dos al renombrar. Se
 * guarda el slug español, que es el canónico del repositorio, y cada idioma
 * resuelve el suyo con el mapa que ya existe.
 *
 * ---- Lo que este archivo NO puede contener ----
 *
 * Ni un cliente, ni un resultado, ni una cifra, ni una alianza, ni una
 * afirmación regulatoria. Nada de eso se ha verificado, y una industria se lee
 * precisamente como la página donde una consultora demuestra experiencia: es
 * donde más tienta inventar y donde más caro sale. Lo que sí hay es criterio,
 * que es lo que se puede sostener.
 */

export const INDUSTRIAS = [

  /* ------------------------------------------------ servicios financieros */
  {
    slug: { es: 'banca-seguros-fintech', en: 'banking-insurance-fintech' },
    icon: 'decision',
    servicio: 'become-discover',
    soluciones: ['redisenar-procesos-criticos', 'agentes-de-ia-con-control', 'medir-y-gobernar-valor'],
    programas: ['finanzas', 'legal-compliance-risk'],

    es: {
      nombre: 'Banca, seguros y fintech',
      menu: 'Crédito, fraude, operaciones, siniestros, cumplimiento, cobranza y canales digitales.',
      h1: 'La ventaja no está en tener más datos. Está en decidir mejor con ellos.',
      lead: 'Banca, seguros, fintech y gestión de activos operan sobre datos, reglas y decisiones. La IA no cambia el producto: cambia el tiempo, el criterio y la trazabilidad con que se decide.',
      contexto: [
        'Pocas industrias reúnen tanta información y tienen tan poco tiempo para usarla. Un expediente de crédito, una reclamación, un caso de cumplimiento o una revisión de cartera juntan documentos, sistemas y criterios que hoy conectan personas, no procesos. La IA encaja bien aquí porque el trabajo ya es leer, comparar y decidir.',
        'Y encaja mal cuando se instala sin control. En un sector supervisado, una capacidad que no puede explicarse ni auditarse no es una ventaja: es una exposición. Por eso el trabajo empieza por dónde se decide y quién responde, no por qué herramienta se compra.',
      ],
      oportunidadesTitular: "La oportunidad está entre el documento que entra y la decisión que debe poder explicarse.",
      oportunidades: [
        ['Originación y evaluación crediticia', 'Preparar expedientes, validar completitud, contrastar documentos, detectar inconsistencias y presentar al analista un caso mejor estructurado.'],
        ['Operaciones alrededor del core bancario', 'Asistir excepciones, incidencias, conciliaciones, ajustes y consultas que hoy obligan a navegar varios sistemas y procedimientos.'],
        ['Fraude', 'Consolidar antecedentes, priorizar alertas y preparar el contexto que acelera la investigación.'],
        ['KYC, AML y cumplimiento', 'Revisar documentación, recuperar políticas y normativa, preparar evidencias y dejar trazabilidad de lo consultado.'],
        ['Cobranza', 'Priorizar casos, resumir el historial y preparar la siguiente gestión dentro de las políticas definidas.'],
        ['Seguros', 'Ordenar expedientes, contrastar coberturas e identificar faltantes en suscripción, renovación o siniestros.'],
        ['Reclamos y consumos no reconocidos', 'Recuperar movimientos, canal, historial y documentación para preparar la atención.'],
        ['Conciliaciones', 'Comparar fuentes, identificar diferencias y preparar las regularizaciones.'],
      ],
      workflowsTitular: "Crédito, siniestros y cumplimiento cambian cuando el expediente llega leído, no decidido.",
      workflows: [
        'Originación y evaluación de crédito',
        'Suscripción y renovación de pólizas',
        'Gestión de siniestros y reclamaciones',
        'KYC, AML y monitoreo continuo',
        'Reporte regulatorio y auditoría interna',
        'Servicio al cliente, cobranza y retención',
      ],
      tecnologiaTitular: "Si el sistema no puede citar qué leyó, no debe influir en la decisión.",
      tecnologia: 'Extracción sobre documentos no estructurados, búsqueda sobre normativa y política interna con la fuente citada, agentes acotados a un paso del proceso, y registro de qué consultó el sistema antes de proponer. La supervisión humana no es una capa que se añade después: es parte del diseño del workflow.',
      metricasTitular: "Un expediente que tarda menos no sirve si nadie puede explicar por qué se aprobó.",
      metricas: [
        ['Tiempo de ciclo', 'Cuánto tarda un expediente desde que entra hasta que hay decisión.'],
        ['Completitud a la primera', 'Qué proporción de casos llega a revisión sin faltantes.'],
        ['Retrabajo', 'Cuántas veces vuelve un caso al paso anterior.'],
        ['Excepciones', 'Cuántas hay, quién las resuelve y en cuánto tiempo.'],
        ['Trazabilidad', 'Qué proporción de decisiones tiene registrado en qué se basó.'],
      ],
      empezarTitular: "Empieza donde el volumen es alto y la excepción todavía tiene dueño.",
      empezar: [
        'Un programa BECOME NOW™ con el equipo de riesgo, finanzas o legal, sobre sus propios expedientes.',
        'Un BECOME DISCOVER™ acotado a un proceso concreto —originación o siniestros— para decidir dónde está el valor y qué controles hacen falta.',
        'Un BECOME EMBED™ sobre el workflow ya priorizado, con supervisión y trazabilidad definidas desde el diseño.',
      ],
      cierre: 'Empieza por la decisión que hoy tarda demasiado.',
      cierreTexto: "Tráenos un expediente, la decisión que habilita y los controles que hoy deben revisarse a mano. Identificaremos qué puede prepararse con IA, qué debe seguir bajo criterio profesional y cómo conservar la evidencia de principio a fin.",
    },

    en: {
      nombre: 'Banking, Insurance & Fintech',
      menu: 'Credit, fraud, operations, claims, compliance, collections and digital channels.',
      h1: 'The advantage is not having more data. It is deciding better with it.',
      lead: 'Banking, insurance, fintech and asset management run on data, rules and decisions. AI does not change the product — it changes the speed, the consistency and the traceability of every decision.',
      contexto: [
        'Few industries hold this much information and have this little time to use it. A credit file, a claim, a compliance case or a portfolio review pulls together documents, systems and judgment that today are connected by people, not by process. AI fits here because the work already is reading, comparing and deciding.',
        'And it fits badly when it is installed without control. In a supervised sector, a capability that cannot be explained or audited is not an advantage — it is exposure. So the work starts with where decisions are made and who answers for them, not with which tool to buy.',
      ],
      oportunidadesTitular: "The opportunity sits between the document that arrives and the decision that must be explained.",
      oportunidades: [
        ['Loan origination and credit assessment', 'Prepare files, check completeness, cross-read documents, flag inconsistencies and hand the analyst a better structured case.'],
        ['Operations around the core banking system', 'Assist with exceptions, incidents, reconciliation, adjustments and queries that today mean navigating several systems and procedures.'],
        ['Fraud', 'Consolidate history, prioritise alerts and prepare the context that speeds up an investigation.'],
        ['KYC, AML and compliance', 'Review documentation, retrieve internal policy and regulation, prepare evidence and leave a record of what was consulted.'],
        ['Collections', 'Prioritise cases, summarise history and prepare the next action within defined policy.'],
        ['Insurance', 'Order files, cross-check coverage and identify what is missing in underwriting, renewal or claims.'],
        ['Claims and unrecognised charges', 'Retrieve transactions, channel, history and documentation to prepare the response.'],
        ['Reconciliation', 'Compare sources, identify differences and prepare the corrections.'],
      ],
      workflowsTitular: "Credit, claims and compliance change when the file arrives read—not decided.",
      workflows: [
        'Credit origination and assessment',
        'Underwriting and policy renewal',
        'Claims management',
        'KYC, AML and ongoing monitoring',
        'Regulatory reporting and internal audit',
        'Customer service, collections and retention',
      ],
      tecnologiaTitular: "If the system cannot cite what it read, it should not influence the decision.",
      tecnologia: 'Extraction over unstructured documents, retrieval over regulation and internal policy with the source cited, agents scoped to one step of the process, and a record of what the system consulted before it proposed anything. Human oversight is not a layer added afterwards: it is part of the workflow design.',
      metricasTitular: "A faster file means little if nobody can explain why it was approved.",
      metricas: [
        ['Cycle time', 'How long a file takes from intake to decision.'],
        ['First-pass completeness', 'What share of cases reaches review with nothing missing.'],
        ['Rework', 'How often a case goes back a step.'],
        ['Exceptions', 'How many there are, who resolves them and how fast.'],
        ['Traceability', 'What share of decisions has a record of what they were based on.'],
      ],
      empezarTitular: "Start where volume is high and every exception still has an owner.",
      empezar: [
        'A BECOME NOW™ program with the risk, finance or legal team, on their own files.',
        'A BECOME DISCOVER™ scoped to one process — origination or claims — to decide where the value is and which controls are required.',
        'A BECOME EMBED™ on the prioritised workflow, with oversight and traceability designed in from the start.',
      ],
      cierre: 'Start with the decision that takes too long today.',
      cierreTexto: "Bring us one file, the decision it enables and the controls still checked by hand. We will identify what AI may prepare, what must remain under professional judgment and how evidence stays traceable from intake to decision.",
    },
  },

  /* ------------------------------------------------------ minería y energía */
  {
    slug: { es: 'mineria-energia', en: 'mining-energy' },
    icon: 'flow',
    servicio: 'become-discover',
    soluciones: ['redisenar-procesos-criticos', 'escalar-ia', 'preparar-equipos-para-ia'],
    programas: ['operaciones', 'supply-chain-compras'],

    es: {
      nombre: 'Minería y energía',
      menu: 'Planeamiento, mina, concentradora, mantenimiento, seguridad, logística y operaciones intensivas en activos.',
      h1: 'La operación ya genera la señal. El reto es convertirla en acción a tiempo.',
      lead: 'Una operación intensiva en activos genera más información de la que alcanza a usar. La oportunidad vive en el intervalo entre lo que la operación ya sabe y el momento en que alguien actúa.',
      contexto: [
        'Una faena o una planta produce señales continuas: sensores, mantenimiento, turnos, permisos, incidentes, proveedores. Casi todo se registra y muy poco llega a tiempo a quien decide. El cuello de botella pocas veces es el modelo: es que el conocimiento vive en informes, correos y personas con veinte años de oficio.',
        'Es además un entorno donde la seguridad y la licencia para operar no son un apartado del proyecto: son la condición. Cualquier capacidad que se instale tiene que dejar claro qué decide una persona, qué no decide un sistema y cómo queda registrado.',
      ],
      oportunidadesTitular: "La operación ya produce la señal. El valor aparece cuando llega antes que la desviación.",
      oportunidades: [
        ['Geología y planeamiento mina', 'Consolidar antecedentes, restricciones, planes, desviaciones y supuestos antes de una decisión de planeamiento.'],
        ['Perforación y voladura', 'Ordenar diseños, cumplimiento, resultados y lecciones aprendidas de disparos anteriores.'],
        ['Carguío y acarreo', 'Preparar el análisis de demoras, disponibilidad, tiempos de ciclo y eventos de flota.'],
        ['Chancado', 'Recuperar historial, procedimientos y eventos para preparar el análisis de restricciones y detenciones.'],
        ['Molienda y flotación', 'Consolidar información operacional y antecedentes para apoyar el análisis de variabilidad.'],
        ['Planta concentradora', 'Dar acceso rápido a procedimientos, bitácoras, reportes, manuales y precedentes.'],
        ['Mantenimiento y confiabilidad', 'Reunir órdenes de trabajo, historial, manuales, fallas anteriores, repuestos y backlog antes de una intervención.'],
        ['Paradas de planta', 'Preparar alcance, ruta crítica, permisos, contratistas, riesgos, materiales y pendientes.'],
        ['Reportes de guardia', 'Convertir registros dispersos en reportes consistentes y comparables entre turnos.'],
        ['Relaves, agua y cumplimiento', 'Recuperar documentación, inspecciones y compromisos con trazabilidad.'],
        ['Logística y transporte de concentrado', 'Consolidar incidencias, programación y restricciones.'],
        ['Contratos y servicios', 'Comparar propuestas, hitos, valorizaciones y cumplimiento.'],
      ],
      workflowsTitular: "El turno, la parada y el permiso son donde el conocimiento se vuelve acción.",
      casos: ['Copiloto de guardia.', 'Asistente de mantenimiento.', 'Agente de preparación de parada.', 'Asistente de conocimiento de concentradora.', 'Analista asistido de demoras de carguío y acarreo.'],
      workflows: [
        'Planificación y ejecución de mantenimiento',
        'Gestión de turnos y reportabilidad operativa',
        'Permisos, HSE y gestión de incidentes',
        'Compras, contratos y gestión de proveedores',
        'Estudios de ingeniería y gestión de precedentes',
        'Relacionamiento comunitario y reporte de sostenibilidad',
      ],
      tecnologiaTitular: "En seguridad, la IA prepara evidencia; la decisión nunca sale de la persona.",
      tecnologia: 'Búsqueda sobre documentación técnica extensa con la fuente citada, extracción sobre informes y órdenes de trabajo, y asistentes acotados a un procedimiento concreto. Donde una recomendación puede afectar la seguridad, el sistema prepara la evidencia y la decisión queda íntegramente en la persona responsable.',
      metricasTitular: "La mejora se mide entre la señal registrada y la acción en terreno.",
      metricas: [
        ['Señal a decisión', 'Cuánto pasa entre que algo se registra y alguien actúa.'],
        ['Consistencia de reporte', 'Qué proporción de informes se produce con el mismo criterio.'],
        ['Horas recuperadas', 'Cuánto tiempo de ingeniería dejaba de dedicarse a buscar información.'],
        ['Preparación de parada', 'Cuánto tarda alistar una intervención programada.'],
        ['Observaciones documentales', 'Cuántas incidencias de documentación aparecen en permisos y auditorías.'],
      ],
      empezarTitular: "Empieza por el punto donde el conocimiento llega después de la decisión.",
      empezar: [
        'Un programa BECOME NOW™ con operaciones, mantenimiento o compras, sobre sus propios procedimientos.',
        'Un BECOME DISCOVER™ sobre un proceso donde el retraso de decisión sea medible.',
        'Un BECOME EMBED™ para dejar funcionando la capacidad priorizada, con supervisión explícita donde toca seguridad.',
      ],
      cierre: 'Empieza por la información que ya tienes y no llega a tiempo.',
      cierreTexto: "Muéstranos un proceso donde manuales, órdenes, informes o permisos ya existen, pero no llegan a tiempo al turno que debe actuar. Diseñaremos el punto de acceso, la trazabilidad y el límite humano antes de hablar de automatización.",
    },

    en: {
      nombre: 'Mining & Energy',
      menu: 'Mine planning, operations, concentrator, maintenance, safety, logistics and asset-intensive work.',
      h1: 'The operation already produces the signal. The challenge is acting on it in time.',
      lead: 'An asset-intensive operation generates more information than it can use. The opportunity lives in the gap between what the operation already knows and the moment someone acts on it.',
      contexto: [
        'A site or a plant produces continuous signals: sensors, maintenance, shifts, permits, incidents, suppliers. Almost all of it is recorded and very little reaches the decision-maker in time. The bottleneck is rarely the model — it is that the knowledge lives in reports, emails and people with twenty years on the job.',
        'It is also an environment where safety and licence to operate are not a section of the project: they are the condition. Any capability installed here has to make clear what a person decides, what a system does not decide, and how it is all recorded.',
      ],
      oportunidadesTitular: "The operation already produces the signal. Value appears when it arrives before the deviation.",
      oportunidades: [
        ['Geology and mine planning', 'Consolidate history, constraints, plans, deviations and assumptions ahead of a planning decision.'],
        ['Drill and blast', 'Order designs, compliance, results and lessons learned from previous blasts.'],
        ['Loading and haulage', 'Prepare the analysis of delays, availability, cycle times and fleet events.'],
        ['Crushing', 'Retrieve history, procedures and events to prepare constraint and downtime analysis.'],
        ['Grinding and flotation', 'Consolidate operational information and history to support variability analysis.'],
        ['Concentrator plant', 'Give fast access to procedures, logs, reports, manuals and precedent.'],
        ['Maintenance and reliability', 'Gather work orders, history, manuals, past failures, spares and backlog before an intervention.'],
        ['Plant shutdowns', 'Prepare scope, critical path, permits, contractors, risks, materials and open items.'],
        ['Shift reports', 'Turn scattered records into consistent reports that can be compared across shifts.'],
        ['Tailings, water and compliance', 'Retrieve documentation, inspections and commitments with traceability.'],
        ['Concentrate logistics and haulage', 'Consolidate incidents, scheduling and constraints.'],
        ['Contracts and services', 'Compare bids, milestones, progress valuations and compliance.'],
      ],
      workflowsTitular: "The shift, the shutdown and the permit are where knowledge becomes action.",
      casos: ['Shift copilot.', 'Maintenance assistant.', 'Shutdown preparation agent.', 'Concentrator knowledge assistant.', 'Assisted analyst for loading and haulage delays.'],
      workflows: [
        'Maintenance planning and execution',
        'Shift management and operational reporting',
        'Permits, HSE and incident management',
        'Procurement, contracts and supplier management',
        'Engineering studies and precedent management',
        'Community relations and sustainability reporting',
      ],
      tecnologiaTitular: "Where safety is involved, AI prepares the evidence. A person makes the decision.",
      tecnologia: 'Retrieval over large technical corpora with the source cited, extraction over reports and work orders, and assistants scoped to a single procedure. Where a recommendation could affect safety, the system prepares the evidence and the decision stays entirely with the accountable person.',
      metricasTitular: "Improvement is measured between the recorded signal and action in the field.",
      metricas: [
        ['Signal to decision', 'How long between something being recorded and someone acting.'],
        ['Reporting consistency', 'What share of reports is produced to the same standard.'],
        ['Hours recovered', 'How much engineering time was going into looking for information.'],
        ['Shutdown readiness', 'How long it takes to prepare a planned intervention.'],
        ['Documentation findings', 'How many documentation issues appear in permits and audits.'],
      ],
      empezarTitular: "Start where knowledge arrives after the decision that needed it.",
      empezar: [
        'A BECOME NOW™ program with operations, maintenance or procurement, on their own procedures.',
        'A BECOME DISCOVER™ on a process where decision delay is measurable.',
        'A BECOME EMBED™ to leave the prioritised capability running, with explicit oversight wherever safety is involved.',
      ],
      cierre: 'Start with the information you already have that arrives too late.',
      cierreTexto: "Show us a process where manuals, work orders, reports or permits already exist but do not reach the shift in time. We will design access, traceability and human boundaries before discussing automation.",
    },
  },

  /* -------------------------------------------------------- retail y consumo */
  {
    slug: { es: 'retail-consumo-masivo', en: 'retail-consumer-goods' },
    icon: 'product',
    servicio: 'become-embed',
    soluciones: ['productos-y-servicios-con-ia', 'redisenar-procesos-criticos', 'preparar-equipos-para-ia'],
    programas: ['marketing-comunicaciones', 'customer-service-cx'],

    es: {
      nombre: 'Retail y consumo masivo',
      menu: 'Surtido, inventario, precios, promociones, e-commerce, tiendas, distribución y postventa.',
      h1: 'Cuando el mercado cambia cada semana, decidir tarde cuesta venta.',
      lead: 'Surtido, precio, contenido y servicio se deciden semana a semana. La IA aporta cuando acorta ese ciclo sin perder el criterio comercial.',
      contexto: [
        'En retail y consumo el problema casi nunca es la falta de datos: es que decidir surtido, precio o contenido exige reunir cinco fuentes distintas y a alguien con criterio para leerlas. Ese alguien es el cuello de botella, y no se resuelve contratando más gente.',
        'La otra mitad es el volumen de contenido. Fichas, campañas, respuestas, adaptaciones por canal y por mercado: trabajo repetitivo con un estándar de marca que hoy solo existe en la cabeza de un equipo pequeño. Escribirlo, y hacerlo aplicable, es la mitad de la transformación.',
      ],
      oportunidadesTitular: "La ventaja vive en decidir y publicar al ritmo al que cambia el mercado.",
      oportunidades: [
        ['Contenido de producto a escala', 'Fichas, descripciones y adaptaciones por canal con el mismo tono y las mismas reglas de marca.'],
        ['Preparación de decisiones comerciales', 'Reunir venta, stock, precio y contexto de mercado en un mismo resumen para la reunión semanal.'],
        ['Atención al cliente', 'Resolver sobre la documentación real de producto, pedidos y políticas, con derivación clara a una persona.'],
        ['Campañas y comunicación', 'Producir variantes por segmento y canal a partir de un mismo mensaje aprobado.'],
        ['Surtido y proveedores', 'Comparar propuestas, condiciones y desempeño histórico sin rehacer el análisis cada vez.'],
        ['Conocimiento de tienda', 'Procedimientos, promociones y excepciones consultables por el equipo en el punto de venta.'],
      ],
      workflowsTitular: "Surtido, contenido y servicio comparten el mismo reto: escala con criterio.",
      workflows: [
        'Alta y publicación de producto',
        'Planificación comercial semanal',
        'Producción y adaptación de campañas',
        'Atención al cliente y postventa',
        'Negociación y evaluación de proveedores',
        'Operación de tienda y comunicación interna',
      ],
      tecnologiaTitular: "La IA puede multiplicar piezas. Las reglas de marca deciden si puede publicarlas.",
      tecnologia: 'Generación con reglas de marca explícitas y revisión humana antes de publicar, búsqueda sobre catálogo y políticas, y agentes de atención con un alcance definido y una salida clara hacia una persona. El estándar de marca deja de ser criterio tácito y pasa a ser una instrucción verificable.',
      metricasTitular: "Velocidad sin consistencia solo crea retrabajo a escala.",
      metricas: [
        ['Tiempo de publicación', 'Cuánto tarda una ficha o una campaña desde el encargo hasta el aire.'],
        ['Aprobación a la primera', 'Qué proporción del contenido pasa revisión sin correcciones.'],
        ['Preparación de la reunión', 'Cuánto tiempo cuesta llegar con el análisis listo.'],
        ['Resolución sin escalar', 'Qué proporción de consultas se cierra sin pasar a una persona.'],
        ['Consistencia de marca', 'Cuántas desviaciones detecta la revisión.'],
      ],
      empezarTitular: "Empieza por el ciclo semanal que siempre llega tarde.",
      empezar: [
        'Un programa BECOME NOW™ con marketing, comercial o atención, sobre sus propios materiales.',
        'Un BECOME DISCOVER™ si lo que falta es decidir dónde invertir primero entre contenido, decisión comercial y servicio.',
        'Un BECOME EMBED™ para dejar funcionando el flujo de contenido o el agente de atención dentro de la operación.',
      ],
      cierre: 'Empieza por el ciclo que hoy no alcanza a cerrar.',
      cierreTexto: "Cuéntanos qué se repite cada semana: fichas que no llegan, análisis comerciales que empiezan tarde o consultas que escalan por falta de información. Elegiremos un ciclo donde velocidad, consistencia y resultado puedan medirse juntos.",
    },

    en: {
      nombre: 'Retail & Consumer Goods',
      menu: 'Assortment, inventory, pricing, promotions, e-commerce, stores, distribution and after-sales.',
      h1: 'When the market moves every week, deciding late costs sales.',
      lead: 'Assortment, pricing, content and service are decided week by week. AI contributes when it shortens that cycle without losing commercial judgment.',
      contexto: [
        'In retail and consumer the problem is almost never a lack of data: it is that deciding assortment, price or content means pulling together five different sources and finding someone with the judgment to read them. That someone is the bottleneck, and hiring more people does not fix it.',
        'The other half is content volume. Product pages, campaigns, replies, adaptations per channel and per market: repetitive work against a brand standard that today only exists in a small team’s heads. Writing that standard down, and making it applicable, is half the transformation.',
      ],
      oportunidadesTitular: "Advantage comes from deciding and publishing at the speed of the market.",
      oportunidades: [
        ['Product content at scale', 'Product pages, descriptions and channel adaptations with the same voice and the same brand rules.'],
        ['Commercial decision prep', 'Bring sales, stock, price and market context into one brief for the weekly meeting.'],
        ['Customer service', 'Resolve from real product, order and policy documentation, with a clear handover to a person.'],
        ['Campaigns and communication', 'Produce segment and channel variants from one approved message.'],
        ['Assortment and suppliers', 'Compare proposals, terms and track record without rebuilding the analysis each time.'],
        ['Store knowledge', 'Procedures, promotions and exceptions searchable by the team at the point of sale.'],
      ],
      workflowsTitular: "Assortment, content and service share the same challenge: scale with judgment.",
      workflows: [
        'Product setup and publication',
        'Weekly commercial planning',
        'Campaign production and adaptation',
        'Customer service and after-sales',
        'Supplier negotiation and evaluation',
        'Store operations and internal communication',
      ],
      tecnologiaTitular: "AI can multiply assets. Brand rules decide whether they can be published.",
      tecnologia: 'Generation against explicit brand rules with human review before publishing, retrieval over catalogue and policy, and service agents with a defined scope and a clear exit to a person. The brand standard stops being tacit judgment and becomes a verifiable instruction.',
      metricasTitular: "Speed without consistency only creates rework at scale.",
      metricas: [
        ['Time to publish', 'How long a product page or campaign takes from brief to live.'],
        ['First-pass approval', 'What share of content clears review without corrections.'],
        ['Meeting preparation', 'How long it takes to arrive with the analysis ready.'],
        ['Resolved without escalation', 'What share of queries closes without reaching a person.'],
        ['Brand consistency', 'How many deviations review catches.'],
      ],
      empezarTitular: "Start with the weekly cycle that is always running late.",
      empezar: [
        'A BECOME NOW™ program with marketing, commercial or service, on their own materials.',
        'A BECOME DISCOVER™ if what is missing is deciding where to invest first across content, commercial decisions and service.',
        'A BECOME EMBED™ to leave the content flow or the service agent running inside the operation.',
      ],
      cierre: 'Start with the cycle you cannot close today.',
      cierreTexto: "Tell us what repeats every week: product pages that miss the window, commercial reviews that start too late or questions escalated for lack of information. We will choose a cycle where speed, consistency and outcome can be measured together.",
    },
  },

  /* ------------------------------------------------------ travel y hotelería */
  {
    slug: { es: 'turismo-hoteleria', en: 'travel-hospitality' },
    icon: 'capability',
    servicio: 'become-embed',
    soluciones: ['agentes-de-ia-con-control', 'productos-y-servicios-con-ia', 'preparar-equipos-para-ia'],
    programas: ['customer-service-cx', 'operaciones'],

    es: {
      nombre: 'Turismo y hotelería',
      menu: 'Reservas, revenue, atención al huésped, operación hotelera, eventos, reputación y fidelización.',
      h1: 'La experiencia se gana o se pierde en cientos de momentos pequeños.',
      lead: 'Reservas, cambios, incidencias y postventa ocurren en picos. La IA sirve cuando sostiene el criterio del servicio justo donde hoy se pierde por volumen.',
      contexto: [
        'Un hotel, una aerolínea o un operador vive de momentos: la consulta antes de reservar, el cambio de última hora, la incidencia durante el viaje, el reclamo después. Cada uno es corto, específico y depende de información repartida entre reservas, políticas, tarifas y proveedores.',
        'El servicio se degrada por volumen, no por falta de criterio. Y el criterio existe: está en las personas con más años. Convertirlo en algo consultable y aplicable en el momento es la transformación; cambiar el canal de atención, no.',
      ],
      oportunidadesTitular: "Cada minuto importa cuando la experiencia ya está ocurriendo.",
      oportunidades: [
        ['Atención previa a la reserva', 'Responder sobre disponibilidad, condiciones y políticas con la información vigente.'],
        ['Cambios e incidencias', 'Reunir el caso completo —reserva, política, historial— antes de que una persona decida.'],
        ['Postventa y reclamaciones', 'Clasificar, contrastar contra la política y preparar la respuesta con la excepción marcada.'],
        ['Contenido y distribución', 'Descripciones, condiciones y adaptaciones por canal y por mercado, con reglas propias.'],
        ['Conocimiento operativo', 'Procedimientos, estándares y escalamientos consultables por el equipo en turno.'],
        ['Voz del huésped', 'Convertir reseñas y encuestas en temas accionables por propiedad, ruta o temporada.'],
      ],
      workflowsTitular: "La reserva, la incidencia y el cambio de turno no pueden perder el contexto.",
      workflows: [
        'Consulta previa y conversión de reserva',
        'Gestión de cambios y cancelaciones',
        'Atención de incidencias en viaje o en estadía',
        'Reclamaciones y compensaciones',
        'Distribución de contenido y tarifas por canal',
        'Operación de turno y traspaso entre equipos',
      ],
      tecnologiaTitular: "Una política puede consultarse; una excepción siempre debe escalarse.",
      tecnologia: 'Agentes con alcance acotado y salida explícita a una persona, búsqueda sobre políticas y condiciones vigentes, y clasificación de casos con la excepción señalada. Nada que comprometa una compensación o una excepción de política se resuelve sin decisión humana.',
      metricasTitular: "La experiencia mejora cuando el primer contacto ya llega con el caso completo.",
      metricas: [
        ['Primera respuesta', 'Cuánto tarda el primer contacto útil.'],
        ['Resolución sin escalar', 'Qué proporción de casos se cierra en el primer nivel.'],
        ['Tiempo de resolución', 'Cuánto dura una incidencia de principio a fin.'],
        ['Consistencia entre turnos', 'Cuánto varía el criterio según quién atiende.'],
        ['Temas recurrentes', 'Cuántos motivos repetidos se cierran por período.'],
      ],
      empezarTitular: "Empieza por el momento que concentra volumen y deteriora el servicio.",
      empezar: [
        'Un programa BECOME NOW™ con atención, operaciones o revenue, sobre sus propios casos.',
        'Un BECOME DISCOVER™ si hay que decidir qué momento de la experiencia se transforma primero.',
        'Un BECOME EMBED™ para dejar el agente o el flujo de incidencias operando con sus límites definidos.',
      ],
      cierre: 'Empieza por el momento en que hoy se pierde el servicio.',
      cierreTexto: "Tráenos el momento que más presión concentra —antes de reservar, durante una incidencia o después de la experiencia— y los sistemas que hoy fragmentan el caso. Diseñaremos una respuesta más rápida sin automatizar excepciones ni compromisos que requieren a una persona.",
    },

    en: {
      nombre: 'Travel & Hospitality',
      menu: 'Bookings, revenue, guest service, hotel operations, events, reputation and loyalty.',
      h1: 'Experience is won or lost across hundreds of small moments.',
      lead: 'Bookings, changes, disruptions and after-sales arrive in peaks. AI helps when it holds the standard of service exactly where volume erodes it today.',
      contexto: [
        'A hotel, an airline or a tour operator lives on moments: the question before booking, the last-minute change, the disruption during the trip, the complaint afterwards. Each one is short, specific and depends on information spread across reservations, policies, fares and suppliers.',
        'Service degrades because of volume, not because judgment is missing. And the judgment exists: it sits with the most experienced people. Turning it into something searchable and applicable in the moment is the transformation; changing the service channel is not.',
      ],
      oportunidadesTitular: "Every minute matters once the guest or passenger experience is underway.",
      oportunidades: [
        ['Pre-booking service', 'Answer on availability, terms and policy from current information.'],
        ['Changes and disruption', 'Assemble the whole case — booking, policy, history — before a person decides.'],
        ['After-sales and complaints', 'Classify, check against policy and draft the response with the exception flagged.'],
        ['Content and distribution', 'Descriptions, terms and channel or market adaptations, against your own rules.'],
        ['Operational knowledge', 'Procedures, standards and escalations searchable by the team on shift.'],
        ['Voice of the guest', 'Turn reviews and surveys into actionable themes by property, route or season.'],
      ],
      workflowsTitular: "The booking, the disruption and the shift handover cannot lose context.",
      workflows: [
        'Pre-booking enquiry and conversion',
        'Change and cancellation handling',
        'In-trip and in-stay disruption',
        'Complaints and compensation',
        'Content and fare distribution by channel',
        'Shift operations and team handover',
      ],
      tecnologiaTitular: "A policy can be retrieved. An exception must always be escalated.",
      tecnologia: 'Agents with a bounded scope and an explicit exit to a person, retrieval over current policy and terms, and case classification with the exception flagged. Nothing that commits a compensation or a policy exception is resolved without a human decision.',
      metricasTitular: "Experience improves when the first response already has the complete case.",
      metricas: [
        ['First response', 'How long the first useful contact takes.'],
        ['Resolved without escalation', 'What share of cases closes at first level.'],
        ['Resolution time', 'How long a case runs end to end.'],
        ['Consistency across shifts', 'How much the standard varies with who is on duty.'],
        ['Recurring themes', 'How many repeat causes are closed each period.'],
      ],
      empezarTitular: "Start with the moment where volume begins to erode service.",
      empezar: [
        'A BECOME NOW™ program with service, operations or revenue, on their own cases.',
        'A BECOME DISCOVER™ if the decision is which moment of the experience to transform first.',
        'A BECOME EMBED™ to leave the agent or the disruption flow running within defined limits.',
      ],
      cierre: 'Start with the moment where service breaks today.',
      cierreTexto: "Bring us the moment under the most pressure—before booking, during disruption or after the experience—and the systems that fragment the case. We will design a faster response without automating exceptions or commitments that require a person.",
    },
  },

  /* --------------------------------------------- real estate y construcción */
  {
    slug: { es: 'inmobiliario-construccion', en: 'real-estate-construction' },
    icon: 'scale',
    servicio: 'become-discover',
    soluciones: ['redisenar-procesos-criticos', 'agentes-de-ia-con-control', 'escalar-ia'],
    programas: ['legal-compliance-risk', 'project-management-pmo'],

    es: {
      nombre: 'Inmobiliario y construcción',
      menu: 'Terrenos, proyectos, ventas, contratos, obra, valorizaciones, entrega y postventa.',
      h1: 'Un proyecto cambia todos los días. La información también.',
      lead: 'Contratos, expedientes técnicos, permisos y valorizaciones concentran el riesgo del proyecto. La IA aporta justo donde hoy se lee por muestreo.',
      contexto: [
        'Un proyecto inmobiliario o de construcción avanza sobre documentos: contratos, adendas, expedientes técnicos, permisos, valorizaciones, órdenes de cambio. El riesgo aparece cuando algo estaba escrito y nadie llegó a leerlo a tiempo.',
        'Es además una industria de coordinación: propietario, constructora, supervisión, proveedores y autoridad trabajan sobre versiones distintas de la misma verdad. La IA no reemplaza esa coordinación; hace que quien coordina llegue con el caso ya leído.',
      ],
      oportunidadesTitular: "El valor aparece cuando una obligación escrita se detecta antes de convertirse en demora.",
      oportunidades: [
        ['Terrenos y factibilidad', 'Ordenar antecedentes, parámetros, documentos, restricciones y supuestos de un terreno antes de decidir.'],
        ['Desarrollo y expedientes', 'Controlar completitud, observaciones, versiones y pendientes del expediente.'],
        ['Inventario comercial', 'Consultar unidades, precios, disponibilidad, características, estacionamientos y promociones vigentes.'],
        ['Leads', 'Resumir las interacciones de un interesado y preparar la siguiente acción comercial.'],
        ['Separación y cierre', 'Dar visibilidad al paso entre separación, cuota inicial, carta de aprobación, minuta y banco.'],
        ['Entrega', 'Ordenar citas, documentación y pendientes de entrega.'],
        ['Postventa', 'Clasificar observaciones, recuperar antecedentes y dar seguimiento al responsable.'],
        ['Planeamiento y producción de obra', 'Preparar avance, restricciones, frentes, compromisos y desviaciones.'],
        ['BIM', 'Facilitar la consulta y la trazabilidad entre modelos, planos, documentos y cambios.'],
        ['RFIs y consultas técnicas', 'Recuperar especificaciones, planos y antecedentes antes de preparar la respuesta.'],
        ['Metrados', 'Organizar el sustento, las versiones y su trazabilidad.'],
        ['Valorizaciones', 'Preparar avance, metrados, sustento y observaciones.'],
        ['Administración contractual', 'Encontrar obligaciones, comunicaciones, hitos y plazos dentro del contrato.'],
        ['Cambios y adicionales', 'Comparar versiones y preparar el expediente de sustento.'],
        ['Subcontratos, compras y procura', 'Comparar propuestas, entregables, obligaciones, cumplimiento y comparativos técnicos y comerciales.'],
        ['Cierre de obra', 'Ordenar punch lists, dossiers, as-built, manuales, garantías y pendientes.'],
      ],
      workflowsTitular: "Contratos, permisos y cambios necesitan una misma lectura del proyecto.",
      casos: ['Copiloto comercial inmobiliario.', 'Agente de expediente de venta.', 'Asistente de RFI.', 'Asistente de valorización.', 'Agente de postventa.', 'Asistente de conocimiento de proyecto.'],
      workflows: [
        'Evaluación y cierre de contratos',
        'Preparación y seguimiento de permisos',
        'Gestión de órdenes de cambio',
        'Valorizaciones y control de avance',
        'Licitación y homologación de proveedores',
        'Venta y postventa inmobiliaria',
      ],
      tecnologiaTitular: "Comparar versiones ayuda; la conclusión legal o técnica sigue teniendo firma.",
      tecnologia: 'Extracción y comparación entre versiones de documentos extensos, búsqueda sobre normativa aplicable y expedientes previos con la fuente citada, y revisión asistida que señala hallazgos para que una persona los valide. La conclusión legal o técnica sigue siendo de un profesional.',
      metricasTitular: "Una revisión más rápida importa si evita una observación, un cambio o una disputa.",
      metricas: [
        ['Tiempo de revisión', 'Cuánto tarda revisar un contrato o un expediente completo.'],
        ['Hallazgos antes de firma', 'Cuántos se detectan a tiempo y no después.'],
        ['Observaciones de permiso', 'Cuántas se evitan por documentación completa.'],
        ['Cierre de órdenes de cambio', 'Cuánto tarda una desde que se levanta hasta que se aprueba.'],
        ['Respuesta comercial', 'Cuánto tarda una consulta de cliente en tener respuesta con sustento.'],
      ],
      empezarTitular: "Empieza donde una versión equivocada cuesta más.",
      empezar: [
        'Un programa BECOME NOW™ con legal, control de proyectos o comercial, sobre sus propios documentos.',
        'Un BECOME DISCOVER™ sobre el punto del proyecto donde el riesgo documental es mayor.',
        'Un BECOME EMBED™ para dejar operando la revisión asistida dentro del flujo real de aprobación.',
      ],
      cierre: 'Empieza por el documento que hoy nadie alcanza a leer entero.',
      cierreTexto: "Muéstranos el documento que más riesgo concentra y el flujo que lo revisa, observa y aprueba. Identificaremos dónde la IA puede comparar, recuperar precedentes o señalar faltantes sin sustituir la conclusión del profesional responsable.",
    },

    en: {
      nombre: 'Real Estate & Construction',
      menu: 'Land, projects, sales, contracts, site work, progress valuations, handover and after-sales.',
      h1: 'A project changes every day. So does the information about it.',
      lead: 'Contracts, technical files, permits and progress claims carry the project’s risk. AI contributes exactly where reading is done by sampling today.',
      contexto: [
        'A real estate or construction project advances on documents: contracts, amendments, technical files, permits, progress claims, change orders. Risk shows up when something was written down and nobody got to it in time.',
        'It is also an industry of coordination: owner, contractor, supervision, suppliers and authority all work on different versions of the same truth. AI does not replace that coordination; it means whoever coordinates arrives with the case already read.',
      ],
      oportunidadesTitular: "Value appears when a written obligation is found before it becomes a delay.",
      oportunidades: [
        ['Land and feasibility', 'Order history, planning parameters, documents, constraints and assumptions before a land decision.'],
        ['Development and permit files', 'Track completeness, comments, versions and open items in the file.'],
        ['Sales inventory', 'Look up units, prices, availability, features, parking and current promotions.'],
        ['Leads', 'Summarise a prospect’s interactions and prepare the next commercial action.'],
        ['Reservation and closing', 'Give visibility to the path from reservation to down payment, mortgage approval, sale documentation and bank.'],
        ['Handover', 'Order appointments, documentation and outstanding items.'],
        ['After-sales service', 'Classify defects, retrieve history and follow up with the responsible party.'],
        ['Site planning and production', 'Prepare progress, constraints, work fronts, commitments and deviations.'],
        ['BIM', 'Make models, drawings, documents and changes searchable and traceable against each other.'],
        ['RFIs and technical queries', 'Retrieve specifications, drawings and precedent before drafting the answer.'],
        ['Quantity take-off', 'Organise the supporting evidence, the versions and their traceability.'],
        ['Progress valuations', 'Prepare progress, quantities, supporting evidence and comments.'],
        ['Contract administration', 'Find obligations, correspondence, milestones and deadlines inside the contract.'],
        ['Changes and variations', 'Compare versions and prepare the supporting file.'],
        ['Subcontracts and procurement', 'Compare bids, deliverables, obligations, compliance and technical and commercial comparisons.'],
        ['Project close-out', 'Order punch lists, dossiers, as-built, manuals, warranties and open items.'],
      ],
      workflowsTitular: "Contracts, permits and changes need one shared reading of the project.",
      casos: ['Real estate sales copilot.', 'Sale file agent.', 'RFI assistant.', 'Progress valuation assistant.', 'After-sales agent.', 'Project knowledge assistant.'],
      workflows: [
        'Contract assessment and close',
        'Permit preparation and follow-up',
        'Change order management',
        'Progress claims and control',
        'Tendering and supplier qualification',
        'Property sales and after-sales',
      ],
      tecnologiaTitular: "Comparing versions helps. Legal and technical conclusions still require a signature.",
      tecnologia: 'Extraction and version comparison across long documents, retrieval over applicable regulation and prior files with the source cited, and assisted review that surfaces findings for a person to validate. The legal or technical conclusion still belongs to a professional.',
      metricasTitular: "Faster review matters when it prevents a comment, change or dispute.",
      metricas: [
        ['Review time', 'How long a full contract or file review takes.'],
        ['Findings before signature', 'How many are caught in time rather than afterwards.'],
        ['Permit observations', 'How many are avoided through complete documentation.'],
        ['Change order closure', 'How long one takes from raised to approved.'],
        ['Commercial response', 'How long a client question takes to get a substantiated answer.'],
      ],
      empezarTitular: "Start where the wrong version carries the highest cost.",
      empezar: [
        'A BECOME NOW™ program with legal, project control or sales, on their own documents.',
        'A BECOME DISCOVER™ on the point of the project where documentary risk is highest.',
        'A BECOME EMBED™ to leave assisted review running inside the real approval flow.',
      ],
      cierre: 'Start with the document nobody gets to read in full today.',
      cierreTexto: "Show us the document carrying the most risk and the workflow that reviews, comments on and approves it. We will identify where AI can compare versions, recover precedent or flag missing information without replacing the responsible professional's conclusion.",
    },
  },

  /* ------------------------------------------- healthcare y life sciences */
  {
    slug: { es: 'salud-farmaceutica', en: 'healthcare-pharma' },
    icon: 'agents',
    servicio: 'become-now',
    soluciones: ['preparar-equipos-para-ia', 'redisenar-procesos-criticos', 'medir-y-gobernar-valor'],
    programas: ['operaciones', 'recursos-humanos'],

    es: {
      nombre: 'Salud y farmacéutica',
      menu: 'Citas, admisión, autorizaciones, facturación, abastecimiento, documentación y operaciones no clínicas.',
      h1: 'Antes y alrededor de la atención hay una operación enorme que también puede mejorar.',
      lead: 'Trabajamos sobre los procesos administrativos, documentales y operativos que rodean la atención. No sobre el diagnóstico ni sobre el tratamiento.',
      /* El límite se declara arriba y se repite en su propio bloque. En esta
         industria, lo que NO se hace es información tan relevante como lo que
         sí, y dejarlo implícito sería dejar que se asuma lo contrario. */
      limite: {
        titulo: 'Dónde está el límite, dicho antes que nada',
        texto: 'BECOME no desarrolla ni valida capacidades de diagnóstico, tratamiento, triaje clínico o interpretación de estudios, y no asesora sobre la conformidad regulatoria de dispositivos médicos. Cuando un proceso roza una decisión clínica, ese límite se define en el diseño y la decisión permanece íntegramente en el profesional de salud.',
      },
      contexto: [
        'Una institución de salud o una empresa de life sciences dedica una parte enorme de su esfuerzo a trabajo que no es clínico: admisión, autorizaciones, facturación, documentación interna, compras, formación del personal, atención administrativa al usuario. Ahí la IA aplicada tiene un efecto directo y verificable.',
        'Y es también donde el riesgo se puede acotar con honestidad. Un proceso administrativo se puede medir, auditar y corregir sin tocar una decisión clínica. Empezar por ahí no es empezar por lo fácil: es empezar por donde se puede sostener lo que se promete.',
      ],
      oportunidadesTitular: "La primera oportunidad está alrededor de la atención, no dentro de la decisión clínica.",
      oportunidades: [
        ['Admisión y autorizaciones', 'Reunir y verificar la documentación administrativa de un caso antes de la revisión.'],
        ['Facturación y conciliación', 'Comparar prestaciones, cobertura y condiciones, y marcar las diferencias.'],
        ['Documentación y procedimientos internos', 'Procedimientos, políticas y normativa consultables con la fuente citada.'],
        ['Compras y cadena de suministro', 'Comparar propuestas, condiciones y antecedentes de proveedores.'],
        ['Atención administrativa', 'Resolver consultas de horarios, requisitos y coberturas, con límites explícitos y derivación a una persona.'],
        ['Formación del personal', 'Programas sobre los procesos y documentos reales de cada área, con criterios de validación.'],
      ],
      workflowsTitular: "Admisión, autorización y facturación pueden avanzar sin invadir el acto clínico.",
      workflows: [
        'Admisión y gestión de autorizaciones',
        'Facturación, cobertura y conciliación',
        'Gestión documental y de procedimientos internos',
        'Compras y cadena de suministro',
        'Atención administrativa al usuario',
        'Formación y habilitación del personal',
      ],
      tecnologiaTitular: "El sistema debe saber cuándo una consulta deja de ser administrativa.",
      tecnologia: 'Extracción sobre documentación administrativa, búsqueda sobre procedimientos internos con la fuente citada, y asistentes con alcance declarado y derivación obligatoria cuando la consulta deja de ser administrativa. El tratamiento de datos personales de salud se define antes de construir, no después.',
      metricasTitular: "Recuperar tiempo asistencial empieza por medir el trabajo documental que lo consume.",
      metricas: [
        ['Tiempo de tramitación', 'Cuánto tarda un trámite administrativo de principio a fin.'],
        ['Expedientes completos', 'Qué proporción llega a revisión sin faltantes.'],
        ['Retrabajo en facturación', 'Cuántas correcciones se hacen después de emitir.'],
        ['Respuesta administrativa', 'Cuánto tarda una consulta de usuario en resolverse.'],
        ['Horas recuperadas', 'Cuánto tiempo del personal dejaba de dedicarse a tareas documentales.'],
      ],
      empezarTitular: "Empieza donde el trámite retrasa la atención sin formar parte de ella.",
      empezar: [
        'Un programa BECOME NOW™ con administración, compras o recursos humanos, sobre sus propios procesos.',
        'Un BECOME DISCOVER™ para priorizar entre trámite, facturación y atención administrativa.',
        'Un BECOME EMBED™ sobre el proceso administrativo priorizado, con el tratamiento de datos definido desde el diseño.',
      ],
      cierre: 'Empieza por el trámite que hoy consume el tiempo de quien atiende.',
      cierreTexto: "Cuéntanos qué trámite administrativo consume hoy tiempo del personal, retrasa al usuario o genera correcciones. Trabajaremos sobre ese proceso y sus datos, dejando fuera desde el inicio cualquier decisión de diagnóstico, tratamiento o triaje.",
    },

    en: {
      nombre: 'Healthcare & Pharma',
      menu: 'Scheduling, admissions, authorisations, billing, supply, documentation and non-clinical operations.',
      h1: 'Around care there is a large operation that can improve too.',
      lead: 'We work on the administrative, documentary and operational processes that surround care. Not on diagnosis and not on treatment.',
      limite: {
        titulo: 'Where the line is, stated first',
        texto: 'BECOME does not develop or validate diagnostic, treatment, clinical triage or study-interpretation capabilities, and does not advise on the regulatory conformity of medical devices. Where a process borders a clinical decision, that boundary is set in the design and the decision remains entirely with the health professional.',
      },
      contexto: [
        'A health institution or a life sciences company spends an enormous share of its effort on work that is not clinical: admissions, authorisations, billing, internal documentation, procurement, staff training, administrative support. That is where applied AI has a direct and verifiable effect.',
        'It is also where risk can be bounded honestly. An administrative process can be measured, audited and corrected without touching a clinical decision. Starting there is not starting with the easy part: it is starting where what you promise can be sustained.',
      ],
      oportunidadesTitular: "The first opportunity sits around care—not inside the clinical decision.",
      oportunidades: [
        ['Admissions and authorisations', 'Assemble and check a case’s administrative documentation before review.'],
        ['Billing and reconciliation', 'Compare services, coverage and terms, and flag the differences.'],
        ['Internal documentation and procedures', 'Procedures, policies and regulation searchable with the source cited.'],
        ['Procurement and supply chain', 'Compare proposals, terms and supplier track record.'],
        ['Administrative support', 'Resolve questions on schedules, requirements and coverage, with explicit limits and handover to a person.'],
        ['Staff enablement', 'Programs built on each area’s real processes and documents, with validation criteria.'],
      ],
      workflowsTitular: "Admissions, authorisations and billing can improve without entering clinical practice.",
      workflows: [
        'Admissions and authorisation management',
        'Billing, coverage and reconciliation',
        'Document and procedure management',
        'Procurement and supply chain',
        'Administrative user support',
        'Staff training and enablement',
      ],
      tecnologiaTitular: "The system must know when a question is no longer administrative.",
      tecnologia: 'Extraction over administrative documentation, retrieval over internal procedures with the source cited, and assistants with a declared scope and mandatory handover the moment a question stops being administrative. How personal health data is handled is defined before anything is built, not after.',
      metricasTitular: "Recovering time for care starts by measuring the paperwork that consumes it.",
      metricas: [
        ['Processing time', 'How long an administrative procedure takes end to end.'],
        ['Complete files', 'What share reaches review with nothing missing.'],
        ['Billing rework', 'How many corrections happen after issuing.'],
        ['Administrative response', 'How long a user question takes to resolve.'],
        ['Hours recovered', 'How much staff time was going into documentary tasks.'],
      ],
      empezarTitular: "Start where administration delays care without being part of it.",
      empezar: [
        'A BECOME NOW™ program with administration, procurement or HR, on their own processes.',
        'A BECOME DISCOVER™ to prioritise across processing, billing and administrative support.',
        'A BECOME EMBED™ on the prioritised administrative process, with data handling designed in from the start.',
      ],
      cierre: 'Start with the procedure that consumes the time of the people who care for patients.',
      cierreTexto: "Tell us which administrative process consumes staff time, delays the user or creates repeated correction. We will work on that process and its data, excluding diagnosis, treatment and clinical triage from the outset.",
    },
  },
];

/** Índice por slug en cada idioma, para resolver una ruta en un paso. */
export const POR_SLUG = {
  es: Object.fromEntries(INDUSTRIAS.map((i) => [i.slug.es, i])),
  en: Object.fromEntries(INDUSTRIAS.map((i) => [i.slug.en, i])),
};

export const RAIZ = { es: '/es/industrias', en: '/en/industries' };

export const urlIndustria = (ind, lang) => `${RAIZ[lang]}/${ind.slug[lang]}`;

/**
 * Las seis lentes del hub: por dónde se mira una industria antes de mirar una
 * herramienta. Son las mismas seis en todas las industrias a propósito: lo que
 * cambia entre sectores es la respuesta, no la pregunta.
 */
export const LENTES = {
  es: [
    ['Decisiones', 'Qué decisiones se toman tarde, con información incompleta o con criterio distinto según quién las tome.'],
    ['Workflows', 'Qué procesos concentran esperas, entregas entre equipos y trabajo que se rehace.'],
    ['Conocimiento', 'Qué sabe la organización que hoy no está disponible en el momento en que hace falta.'],
    ['Experiencia', 'Qué momentos del cliente o del usuario se degradan por volumen y no por falta de criterio.'],
    ['Crecimiento', 'Qué parte de la propuesta de valor cambiaría si la IA formara parte del producto y no solo del proceso.'],
    ['Riesgo', 'Qué exposición aparece —o se reduce— cuando una capacidad empieza a operar dentro del proceso.'],
  ],
  en: [
    ['Decisions', 'Which decisions are made late, on incomplete information, or to a different standard depending on who makes them.'],
    ['Workflows', 'Which processes concentrate waiting, handovers between teams and rework.'],
    ['Knowledge', 'What the organisation knows that is not available at the moment it is needed.'],
    ['Experience', 'Which customer or user moments degrade because of volume rather than a lack of judgment.'],
    ['Growth', 'Which part of the value proposition would change if AI were part of the product and not only of the process.'],
    ['Risk', 'What exposure appears — or reduces — once a capability starts operating inside the process.'],
  ],
};
