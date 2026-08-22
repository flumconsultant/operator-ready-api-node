/**
 * Cómo transformamos: el contenido de la página del método, en los dos idiomas.
 *
 * ---- Por qué el apartado ya no se llama «Framework» ----
 *
 * «Framework» dice qué ES la cosa, no qué HACE por quien la lee. En un menú,
 * quien entra por primera vez no está buscando un framework: está intentando
 * entender cómo trabajamos. «Cómo transformamos» responde a eso en tres
 * palabras, y dentro de la página el concepto sigue llamándose por su nombre
 * —BECOME Transformation Framework—, que es donde ese nombre sí aporta.
 *
 * ---- Por qué las etapas llevan preguntas y no descripciones ----
 *
 * Una etapa descrita («comprendemos el sistema») no se puede verificar: suena
 * bien y no compromete a nada. Una etapa con las preguntas que se responden en
 * ella sí, porque quien lee puede comprobar si esas son las preguntas que su
 * empresa tiene sin responder. Y el Output declara qué queda por escrito al
 * terminar, que es la otra mitad de lo mismo.
 */

export const CT = {

  es: {
    kicker: 'BECOME Transformation Framework',
    h1: 'La transformación sucede dentro.',
    lead: 'No añadimos IA por encima de la empresa. Rediseñamos desde dentro los cinco sistemas que deciden si el cambio queda instalado o se apaga con el piloto.',

    estados: 'La C de BECOME es la empresa de hoy: el círculo no cierra, y ese hueco es lo que hoy no funciona. La O es la empresa en la que se convierte, con el círculo completo. Entre las dos, el recorrido: eso es el trabajo de estas seis etapas.',
    tesisKicker: 'La tesis',
    tesis: 'Seis etapas y cinco sistemas.',
    tesisTexto: [
      'La mayoría de las iniciativas de IA no fracasan por el modelo. Fracasan porque se construyeron al lado del trabajo real: el proceso siguió igual, nadie quedó a cargo del resultado y no había una medida contra la que decidir si aquello servía.',
      'Este método existe para que ese rediseño tenga un orden. No son fases de consultoría para justificar un calendario: es la secuencia en que las decisiones dependen unas de otras. No se puede elegir una capacidad antes de saber dónde está el valor, ni medir lo que no se definió al principio.',
    ],

    sistemasKicker: 'Los cinco sistemas',
    sistemas: 'Lo que se transforma a la vez, no en paralelo.',
    sistemasLead: 'No son cinco proyectos simultáneos. En cada etapa se toman decisiones sobre los cinco, porque dejar uno fuera es exactamente lo que hace que el cambio no sobreviva al primer trimestre.',
    SISTEMAS: [
      ['People', 'Personas capaces de trabajar, decidir y colaborar con IA: con criterio propio sobre qué se le puede pedir a un modelo y qué no, y con la responsabilidad del resultado.', '/icons/people-inside-white.webp'],
      ['Data', 'Datos estructurados y no estructurados preparados para alimentar modelos, búsqueda y decisiones, con permisos y trazabilidad definidos antes de usarlos.', '/icons/data-inside-white.webp'],
      ['Agents', 'Modelos, copilots y agentes capaces de razonar, usar herramientas y ejecutar partes de un workflow dentro de límites explícitos.', '/icons/agents-inside-white.webp'],
      ['Products', 'Productos y experiencias que incorporan modelos, datos y agentes en la propuesta de valor, no solo en el proceso interno.', '/icons/products-inside-white.webp'],
      ['Operations', 'Workflows rediseñados para combinar automatización, agentes, decisiones humanas, excepciones y controles en un solo proceso.', '/icons/operations-inside-white.webp'],
    ],

    etapasKicker: 'Las seis etapas',
    etapas: 'De la ambición al valor, en el orden en que se puede.',
    ETAPAS: [
      ['01', 'Frame the outcome', 'Enmarcar el resultado', [
        '¿Qué resultado de negocio tiene que cambiar, y para cuándo?',
        '¿Quién responde por ese resultado hoy?',
        '¿Cómo sabremos que cambió, sin discutirlo?',
      ], 'Un resultado declarado, con responsable y con la medida acordada antes de empezar.'],
      ['02', 'Understand the system', 'Entender el sistema', [
        '¿Cómo funciona hoy el proceso, incluidas sus excepciones?',
        '¿Dónde están el conocimiento, los datos y las decisiones?',
        '¿Qué limita el cambio: la tecnología, el dato, el permiso o la costumbre?',
      ], 'Un diagnóstico del proceso real y de la preparación de los cinco sistemas.'],
      ['03', 'Find the value', 'Encontrar el valor', [
        '¿Dónde crea valor la IA de forma diferencial y no solo visible?',
        '¿Qué se hace primero y qué se deja para después, y por qué?',
        '¿Cuál es el coste de no hacerlo?',
      ], 'Un portafolio priorizado por valor, viabilidad, velocidad y riesgo.'],
      ['04', 'Choose the capability', 'Elegir la capacidad', [
        '¿Qué capacidad concreta resuelve el problema priorizado?',
        '¿Qué decide una persona y qué no decide un sistema?',
        '¿Qué controles y qué evidencia hacen falta para operarla?',
      ], 'El diseño del modelo operativo objetivo y de la solución, con sus límites.'],
      ['05', 'Build & embed', 'Construir e incorporar', [
        '¿Cómo se construye dentro del trabajo real y no al lado?',
        '¿Quién la usa cada día y qué necesita para confiar en ella?',
        '¿Qué pasa cuando falla, y quién lo resuelve?',
      ], 'La capacidad funcionando dentro de la operación, con supervisión y excepciones definidas.'],
      ['06', 'Measure & evolve', 'Medir y evolucionar', [
        '¿Qué cambió en el negocio, contra la línea base acordada?',
        '¿Se está usando, y con qué nivel de confianza?',
        '¿Se itera, se integra, se escala o se detiene?',
      ], 'Un scorecard y una decisión de escala tomada con evidencia, con la opción real de parar.'],
    ],

    principiosKicker: 'Cómo trabajamos',
    principios: 'Cinco principios que no se negocian por velocidad.',
    PRINCIPIOS: [
      ['El valor antes que la tecnología', 'La conversación no empieza por qué modelo se usa. Empieza por qué decisión, qué proceso o qué experiencia tiene que cambiar. La tecnología se elige después, y por eso se puede cambiar sin rehacer la estrategia.'],
      ['Construir con, no para', 'El equipo que va a operar la capacidad participa en diseñarla. No por consenso: porque quien conoce las excepciones del proceso es quien lo ejecuta, y esas excepciones son las que deciden si algo funciona en la vida real.'],
      ['Adopción por diseño', 'La adopción no es un plan de comunicación al final. Es una decisión de diseño desde el principio: qué se integra en la herramienta que ya se usa, qué se simplifica y qué se deja de pedir a las personas.'],
      ['Gobernanza desde el inicio', 'Los límites, la supervisión humana, la trazabilidad y quién responde se definen antes de construir. Añadirlos después obliga a rehacer, y en un entorno supervisado obliga a rehacer con auditoría delante.'],
      ['La propiedad se queda dentro', 'Al terminar, la empresa tiene el criterio, la documentación y las personas capaces de operar y evolucionar lo construido. Si para seguir hace falta volver a llamarnos, el trabajo no está terminado.'],
    ],

    entradasKicker: 'Por dónde se entra',
    entradas: 'Tres puntos de entrada al mismo método.',
    entradasLead: 'No hay una única puerta. Lo que decide cuál es la adecuada no es el presupuesto: es qué está resuelto y qué no.',
    ENTRADAS: [
      ['BECOME NOW™', 'Capacitación aplicada', 'Cuando el equipo ya usa herramientas de IA sin método común. Entra por People y Operations, sobre los procesos y documentos reales del área.', 'Etapas 01–02', '/es/servicios/become-now'],
      ['BECOME DISCOVER™', 'Estrategia y modelo operativo', 'Cuando falta decidir dónde está el valor y cómo debe operar la empresa para conseguirlo. Recorre de enmarcar el resultado a elegir la capacidad.', 'Etapas 01–04', '/es/servicios/become-discover'],
      ['BECOME EMBED™', 'Construcción e incorporación', 'Cuando ya hay una capacidad priorizada y condiciones para construir. Diseña, construye, incorpora y prepara la decisión de escala.', 'Etapas 04–06', '/es/servicios/become-embed'],
    ],

    ctaKicker: 'Aplica el método a tu empresa',
    cta: '¿En qué debe convertirse tu empresa después?',
    ctaBoton: 'Hablemos de tu iniciativa',
  },

  en: {
    kicker: 'BECOME Transformation Framework',
    h1: 'Transformation happens inside.',
    lead: 'We do not add AI on top of the company. We redesign, from the inside, the five systems that decide whether the change stays installed or dies with the pilot.',

    estados: 'The C in BECOME is the company as it is today: the circle does not close, and that gap is what is not working. The O is the company it becomes, with the circle complete. The path between them is the work these six stages do.',
    tesisKicker: 'The thesis',
    tesis: 'Six stages and five systems.',
    tesisTexto: [
      'Most AI initiatives do not fail because of the model. They fail because they were built next to the real work: the process stayed the same, nobody owned the outcome, and there was no measure against which to decide whether it was worth keeping.',
      'This method exists to give that redesign an order. These are not consulting phases invented to justify a calendar: it is the sequence in which the decisions depend on each other. You cannot choose a capability before you know where the value is, and you cannot measure what was never defined.',
    ],

    sistemasKicker: 'The five systems',
    sistemas: 'What changes together, not in parallel.',
    sistemasLead: 'These are not five simultaneous projects. Every stage takes decisions across all five, because leaving one out is precisely what makes the change fail to survive its first quarter.',
    SISTEMAS: [
      ['People', 'People able to work, decide and collaborate with AI: with their own judgment about what a model can and cannot be asked for, and with ownership of the outcome.', '/icons/people-inside-white.webp'],
      ['Data', 'Structured and unstructured data prepared to feed models, retrieval and decisions, with permissions and traceability defined before it is used.', '/icons/data-inside-white.webp'],
      ['Agents', 'Models, copilots and agents able to reason, use tools and execute parts of a workflow within explicit limits.', '/icons/agents-inside-white.webp'],
      ['Products', 'Products and experiences that embed models, data and agents in the value proposition, not only in the internal process.', '/icons/products-inside-white.webp'],
      ['Operations', 'Workflows redesigned to combine automation, agents, human decisions, exceptions and controls in a single process.', '/icons/operations-inside-white.webp'],
    ],

    etapasKicker: 'The six stages',
    etapas: 'From ambition to value, in the only order that works.',
    ETAPAS: [
      ['01', 'Frame the outcome', 'Frame the outcome', [
        'Which business outcome has to change, and by when?',
        'Who answers for that outcome today?',
        'How will we know it changed, without arguing about it?',
      ], 'A declared outcome, with an owner and an agreed measure set before anything starts.'],
      ['02', 'Understand the system', 'Understand the system', [
        'How does the process actually work today, exceptions included?',
        'Where do the knowledge, the data and the decisions live?',
        'What limits the change: the technology, the data, the permission or the habit?',
      ], 'A diagnosis of the real process and of readiness across the five systems.'],
      ['03', 'Find the value', 'Find the value', [
        'Where does AI create differential value rather than merely visible value?',
        'What comes first, what waits, and why?',
        'What does it cost not to do it?',
      ], 'A portfolio prioritised by value, feasibility, speed and risk.'],
      ['04', 'Choose the capability', 'Choose the capability', [
        'Which specific capability solves the prioritised problem?',
        'What does a person decide, and what does a system not decide?',
        'Which controls and which evidence are required to operate it?',
      ], 'The target operating model and the solution design, with its limits written down.'],
      ['05', 'Build & embed', 'Build & embed', [
        'How is it built inside the real work rather than beside it?',
        'Who uses it every day, and what do they need in order to trust it?',
        'What happens when it fails, and who resolves it?',
      ], 'The capability running inside the operation, with oversight and exceptions defined.'],
      ['06', 'Measure & evolve', 'Measure & evolve', [
        'What changed in the business, against the agreed baseline?',
        'Is it being used, and with what level of confidence?',
        'Do we iterate, integrate, scale or stop?',
      ], 'A scorecard and a scale decision taken on evidence, with a real option to stop.'],
    ],

    principiosKicker: 'How we work',
    principios: 'Five principles we do not trade for speed.',
    PRINCIPIOS: [
      ['Value before technology', 'The conversation does not start with which model to use. It starts with which decision, which process or which experience has to change. The technology is chosen afterwards — which is why it can be changed without redoing the strategy.'],
      ['Build with, not for', 'The team that will operate the capability helps design it. Not for consensus: because the people who run a process are the ones who know its exceptions, and those exceptions decide whether something works in real life.'],
      ['Adoption by design', 'Adoption is not a communication plan at the end. It is a design decision from the start: what gets embedded in the tool people already use, what gets simplified, and what stops being asked of people at all.'],
      ['Governance from the start', 'Limits, human oversight, traceability and accountability are defined before anything is built. Adding them later means rebuilding — and in a supervised environment, rebuilding with an auditor watching.'],
      ['Ownership stays inside', 'When the work ends, the company holds the judgment, the documentation and the people able to operate and evolve what was built. If continuing requires calling us again, the work is not finished.'],
    ],

    entradasKicker: 'Where you enter',
    entradas: 'Three entry points into the same method.',
    entradasLead: 'There is no single door. What decides which one fits is not the budget: it is what is already resolved and what is not.',
    ENTRADAS: [
      ['BECOME NOW™', 'Applied AI enablement', 'When the team already uses AI tools without a shared method. It enters through People and Operations, on the area’s real processes and documents.', 'Stages 01–02', '/en/services/become-now'],
      ['BECOME DISCOVER™', 'Strategy and operating model', 'When what is missing is deciding where the value sits and how the company must operate to capture it. It runs from framing the outcome to choosing the capability.', 'Stages 01–04', '/en/services/become-discover'],
      ['BECOME EMBED™', 'Build & embed', 'When a capability is already prioritised and the conditions to build exist. It designs, builds, embeds and prepares the scale decision.', 'Stages 04–06', '/en/services/become-embed'],
    ],

    ctaKicker: 'Apply the method to your company',
    cta: 'What does your company need to become next?',
    ctaBoton: 'Let’s talk about your initiative',
  },
};
