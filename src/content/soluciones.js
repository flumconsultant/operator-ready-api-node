/**
 * Contenido de las seis páginas de casos de uso.
 *
 * Va aparte de los componentes a propósito: el documento (§21) pide que casos,
 * servicios e insights sean administrables sin tocar código. Mientras no haya
 * CMS, este fichero hace de fuente única — una página nueva es una entrada
 * más, no un componente más.
 *
 * La plantilla de campos es la del documento (§11) y el orden importa: la
 * persona reconoce su situación, entiende el problema sistémico detrás,
 * ve qué cambiaría dentro y solo entonces se le nombra un engagement.
 */

export const SOLUCION_CONTENIDO = {

  'escalar-ia': {
    q: '¿Tienes pilotos que no escalan?',
    answer:
      'Si tus prototipos funcionan en una demostración pero no en la operación, hay que identificar qué falta alrededor de la tecnología antes de escalar.',
    signals: [
      'Nadie se queda a cargo del piloto cuando termina.',
      'El proceso real no cambió.',
      'Los datos, las integraciones o los controles dependen de trabajo manual.',
      'Los usuarios prueban la solución, pero no la incorporan.',
      'No hay una línea base ni un criterio para decidir si está listo para escalar.',
    ],
    problem:
      'El piloto no falla por el modelo. Falla porque se construyó al lado del trabajo real en vez de dentro: nadie es dueño del resultado, el proceso siguió igual y no hay medida contra la que decidir.',
    value:
      'Evaluamos el piloto como parte de un sistema de Personas, Datos, Agentes, Productos y Operaciones; decidimos si debe detenerse, rediseñarse o convertirse en capacidad; luego construimos las condiciones de adopción y escala.',
    tools: ['Inside Readiness Index™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'Una decisión informada y, cuando corresponde, una capacidad preparada para operar.',
    engagement: 'BECOME DISCOVER™ → BECOME EMBED™',
    engagementWhy:
      'El diagnóstico es estratégico y la solución es operativa. Saltarse el primero suele producir un segundo piloto igual de aislado.',
    cta: 'Convierte el piloto en capacidad',
  },

  'preparar-equipos-para-ia': {
    q: '¿Necesitas preparar a tus equipos para trabajar con IA?',
    answer:
      'Si tus equipos ya usan herramientas de IA sin un método común, hace falta convertir ese uso suelto en una forma de trabajar compartida, con criterios y controles.',
    signals: [
      'Cada persona usa la IA a su manera y con resultados desiguales.',
      'Se han hecho formaciones generales que no cambiaron el trabajo del día a día.',
      'Nadie sabe qué se puede pedir a una herramienta y qué no.',
      'Lo que funciona en un equipo no llega a los demás.',
      'Falta un criterio común sobre qué es un resultado aceptable.',
    ],
    problem:
      'Un curso genérico enseña una herramienta; el trabajo no cambia porque nadie ha mirado el proceso real del área. La capacidad aparece cuando cada equipo trabaja sobre sus propios documentos, sus casos y sus restricciones, y se lleva algo reutilizable.',
    value:
      'Partimos del trabajo que hace hoy cada área: mapeamos su proceso, elegimos los casos prioritarios, trabajamos sobre sus documentos reales y dejamos asistentes, plantillas y criterios de validación que quedan en la empresa.',
    tools: ['Applied Workflow Canvas', 'Adoption Scorecard', 'Inside Readiness Index™'],
    result: 'Equipos que trabajan con IA sobre sus propios procesos, con una biblioteca reutilizable y criterios comunes de calidad.',
    engagement: 'BECOME NOW™',
    engagementWhy:
      'Es el servicio diseñado para esto. Si además falta decidir dónde invertir como empresa, Discover ordena esa decisión antes o en paralelo.',
    cta: 'Diseña el programa de tu área',
  },

  'redisenar-procesos-criticos': {
    q: '¿Necesitas rediseñar un proceso crítico?',
    answer:
      'Si buscas mejorar una operación crítica, hay que rediseñar el proceso de principio a fin, no automatizar tareas aisladas.',
    signals: [
      'Hay muchas entregas entre equipos y trabajo que se rehace.',
      'Las decisiones dependen de información fragmentada.',
      'Los especialistas dedican tiempo a tareas repetitivas.',
      'Las excepciones no tienen responsable ni un criterio común.',
      'El proceso es lento, variable o difícil de auditar.',
    ],
    problem:
      'Automatizar una tarea dentro de un proceso que no cambia mueve el cuello de botella de sitio. El tiempo se recupera en un paso y se pierde en el siguiente, porque las decisiones, los datos y las excepciones siguen donde estaban.',
    value:
      'Rediseñamos como un solo proceso los eventos, las decisiones, los roles, las tareas del agente, los datos, las excepciones, la supervisión humana, los controles y las métricas. Después construimos y validamos la capacidad prioritaria.',
    tools: ['Inside Target State Canvas™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™'],
    result: 'Un proceso más rápido, consistente, controlado y capaz de aprender.',
    engagement: 'BECOME DISCOVER™ + BECOME EMBED™',
    engagementWhy:
      'El rediseño necesita una mirada de sistema, y la mejora solo es real cuando el nuevo proceso funciona en producción.',
    cta: 'Rediseña el proceso',
  },

  'agentes-de-ia-con-control': {
    q: '¿Quieres construir un agente o un copiloto?',
    answer:
      'Diseñamos el workflow antes de elegir el modelo. Definimos qué debe hacer el agent, a qué datos y herramientas puede acceder, qué LLM necesita, cuándo debe pedir aprobación humana y cómo se evaluará antes y después del go-live. Una solución puede combinar ChatGPT/OpenAI, Claude/Anthropic, Gemini/Google u otros modelos, junto con APIs, RAG, tool calling, MCP e integraciones empresariales.',
    signals: [
      'El equipo conoce la tarea, pero no el modelo operativo.',
      'No está claro qué decide el agente y qué conserva la persona.',
      'Faltan rutas para las excepciones, permisos o criterios de calidad.',
      'El prototipo no está integrado al proceso real.',
    ],
    problem:
      'Un agente sin modelo operativo es una demostración con permisos. Lo que decide su destino no es la calidad de las respuestas, sino quién responde cuando se equivoca y qué pasa con los casos que no encajan.',
    value:
      'Validamos el diseño, definimos la supervisión humana y los controles, construimos e integramos el agente o copiloto, acompañamos la adopción y medimos confianza, desempeño, control y valor.',
    tools: ['Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'Un agente o copiloto que participa en trabajo real, con un responsable explícito.',
    engagement: 'BECOME EMBED™',
    engagementWhy:
      'Depende de la preparación: si la oportunidad todavía no tiene un diseño que se pueda validar, empezamos por una revisión corta.',
    cta: 'Construye la capacidad',
  },

  'productos-y-servicios-con-ia': {
    q: '¿Quieres crear una experiencia AI-native?',
    answer:
      'Si buscas una nueva experiencia para clientes o colaboradores, necesitas diseñar el valor, el comportamiento inteligente y la operación que lo sostiene.',
    signals: [
      'La idea depende de la IA, pero el valor para quien la usa todavía es genérico.',
      'La experiencia de producto no define confianza, explicación ni escalamiento.',
      'No está claro qué datos y qué conocimiento hacen posible la experiencia.',
      'El equipo necesita validar si se desea, si es posible y si es viable.',
    ],
    problem:
      'Una experiencia AI-native no se diseña como una pantalla con un modelo detrás. El comportamiento inteligente es parte del producto: qué sabe, qué explica, cuándo cede el control y quién lo opera cuando está en producción.',
    value:
      'Conectamos la tesis de producto, el recorrido de quien lo usa, la inteligencia, los datos, el comportamiento del agente, los controles y la responsabilidad operativa. Prototipamos, validamos y construimos el alcance que pueda demostrar valor real.',
    tools: ['AI-Native Value Map™', 'Inside Target State Canvas™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™'],
    result: 'Un producto o servicio AI-native validado y listo para incorporarse.',
    engagement: 'BECOME EMBED™ o secuencia completa',
    engagementWhy:
      'Si la tesis de producto todavía está abierta, BECOME DISCOVER™ la cierra antes de construir.',
    cta: 'Diseña la nueva experiencia',
  },

  'medir-y-gobernar-valor': {
    q: '¿Necesitas medir y gobernar el valor de la IA?',
    answer:
      'Si tienes que demostrar resultados, reducir riesgos y aclarar quién responde por cada decisión, hace falta medir contra una línea base y gobernar lo que ya está funcionando.',
    signals: [
      'Se reportan actividades —usuarios, pilotos, licencias— pero no resultados.',
      'No hay línea base, así que cualquier mejora es discutible.',
      'Nadie sabe quién responde cuando un sistema se equivoca.',
      'La dirección necesita decidir la inversión con evidencia, no con demostraciones.',
      'Faltan criterios para decidir qué se escala y qué se detiene.',
    ],
    problem:
      'Sin línea base no hay mejora que probar, solo opiniones sobre una demostración. Y sin responsables asignados, el control se convierte en un documento que nadie aplica. Medir y gobernar no son dos tareas administrativas al final: son lo que separa una capacidad de un experimento caro.',
    value:
      'Definimos qué significa valor en tu caso, medimos el punto de partida, asignamos responsables y frecuencia de revisión, y establecemos los controles —supervisión humana, trazabilidad, calidad y escalamiento— que hacen que el resultado se sostenga.',
    tools: ['Embed Scorecard™', 'Scale Readiness Gate™', 'Inside Readiness Index™'],
    result: 'Una medición que resiste una pregunta difícil y un modelo de gobierno con nombres, no con buenas intenciones.',
    engagement: 'BECOME DISCOVER™ o BECOME EMBED™',
    engagementWhy:
      'Si lo que falta es el criterio, empieza en Discover. Si ya hay algo funcionando y lo que falta es medirlo y gobernarlo, va dentro de Embed.',
    cta: 'Define cómo se mide',
  },
};

/* Mapa de orientación del hub (§11). Es la tabla que traduce síntoma en
   decisión, y la razón por la que este hub no es una galería de tecnologías. */
export const ORIENTATION = [
  { q: '¿Tienes pilotos que no escalan?', happens: 'Prototipos aislados, sin responsable, integración ni adopción.', need: 'Diagnóstico de sistema, estado objetivo y decisión sobre qué escalar.', rec: 'BECOME DISCOVER™ → BECOME EMBED™' },
  { q: '¿Necesitas preparar a tus equipos para trabajar con IA?', happens: 'Cada persona usa la IA a su manera y con resultados desiguales.', need: 'Un método común sobre los procesos reales del área, con criterios y controles.', rec: 'BECOME NOW™' },
  { q: '¿Necesitas rediseñar un proceso crítico?', happens: 'Un proceso lento, fragmentado o intensivo en decisiones.', need: 'Rediseño de principio a fin, con roles, agentes, datos y controles.', rec: 'BECOME DISCOVER™ + BECOME EMBED™' },
  { q: '¿Quieres incorporar agentes de IA sin perder el control?', happens: 'Hay una idea o una necesidad concreta, pero falta el diseño operativo.', need: 'Diseño, límites de autonomía, supervisión humana, construcción y adopción.', rec: 'BECOME EMBED™' },
  { q: '¿Quieres que la IA forme parte de tu propuesta de valor?', happens: 'Se busca valor nuevo para clientes o colaboradores.', need: 'Tesis de producto, diseño de la experiencia, arquitectura de datos y agentes, y validación.', rec: 'BECOME EMBED™ o la secuencia completa' },
  { q: '¿Necesitas medir y gobernar el valor de la IA?', happens: 'Se reportan actividades, pero no resultados, y nadie responde por las decisiones.', need: 'Línea base, responsables, frecuencia de revisión y controles.', rec: 'BECOME DISCOVER™ o BECOME EMBED™' },
];
