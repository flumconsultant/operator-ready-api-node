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

export const USE_CASE_CONTENT = {
  'por-donde-empezar-con-ia': {
    q: '¿No sabes por dónde empezar con IA?',
    answer:
      'Si estás buscando una dirección común para invertir, priorizar y gobernar la IA, necesitas un BECOME DISCOVER™.',
    signals: [
      'Cada área propone sus propios casos de uso.',
      'El comité ejecutivo no comparte una ambición común sobre la IA.',
      'Tecnología recibe demandas sin un criterio único de valor.',
      'Hay pilotos, pero no un portafolio ni un caso de negocio que los una.',
    ],
    problem:
      'El síntoma es dispersión, pero la causa es que no hay una tesis de empresa que ordene las decisiones. Sin ambición compartida, cada iniciativa compite por presupuesto con el argumento de su propia área y ninguna se mide contra el mismo resultado.',
    value:
      'Alineamos la ambición y los resultados esperados, evaluamos la preparación de la empresa, identificamos dónde está el valor, priorizamos capacidades y diseñamos el modelo operativo objetivo y la hoja de ruta.',
    tools: ['Business Ambition Canvas™', 'Inside Readiness Index™', 'AI-Native Value Map™', 'Inside Target State Canvas™'],
    result: 'Una estrategia ejecutable y una primera capacidad elegida con criterios explícitos.',
    engagement: 'BECOME DISCOVER™',
    engagementWhy:
      'Falta la capa estratégica: dirección, prioridad y diseño del modelo futuro. Construir antes de eso multiplica el número de pilotos, no el valor.',
    cta: 'Define dónde empezar',
  },

  'pilotos-que-no-escalan': {
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

  'redisenar-workflow-critico': {
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

  'construir-agent-o-copilot': {
    q: '¿Quieres construir un agente o un copiloto?',
    answer:
      'Si ya tienes una oportunidad priorizada, hay que convertirla en una capacidad con límites de autonomía, integración, adopción y responsabilidades definidas.',
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

  'experiencia-ai-native': {
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

  'demostrar-valor-en-90-dias': {
    q: '¿Necesitas demostrar valor en 90 días?',
    answer:
      'Si necesitas evidencia rápida, hay que reducir el alcance sin bajar la exigencia: una capacidad viable, un entorno real y resultados medibles.',
    signals: [
      'Hay un responsable que lo impulsa y urgencia en la dirección.',
      'La oportunidad parece clara, pero todavía no tiene una línea base.',
      'Hay riesgo de producir otra demostración sin adopción.',
      'El equipo necesita una decisión de inversión basada en evidencia.',
    ],
    problem:
      'La presión de plazo empuja a enseñar algo, y enseñar algo es exactamente lo que no genera evidencia. Sin línea base y sin uso real, a los 90 días hay una demostración mejor y la misma duda.',
    value:
      'Revisamos si están las condiciones, delimitamos el proceso y los resultados, construimos el alcance mínimo que sirva en la operación, lo implantamos de forma controlada y medimos uso, confianza, desempeño, control y valor.',
    tools: ['Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'Evidencia suficiente para decidir si iterar, integrar, escalar o detener.',
    engagement: 'BECOME EMBED™',
    engagementWhy:
      'Sujeto a priorización. Si el caso todavía no está suficientemente definido, no forzamos el plazo: un sprint mal delimitado gasta los 90 días sin producir la decisión.',
    cta: 'Define un sprint de valor',
  },
};

/* Mapa de orientación del hub (§11). Es la tabla que traduce síntoma en
   decisión, y la razón por la que este hub no es una galería de tecnologías. */
export const ORIENTATION = [
  { q: '¿No sabes por dónde empezar con IA?', happens: 'Muchas ideas, presión ejecutiva y prioridades dispersas.', need: 'Ambición, dónde está el valor, qué se elige y una hoja de ruta.', rec: 'BECOME DISCOVER™' },
  { q: '¿Tienes pilotos que no escalan?', happens: 'Prototipos aislados, sin responsable, integración ni adopción.', need: 'Diagnóstico de sistema, estado objetivo y decisión sobre qué escalar.', rec: 'BECOME DISCOVER™ → BECOME EMBED™' },
  { q: '¿Necesitas rediseñar un proceso crítico?', happens: 'Un proceso lento, fragmentado o intensivo en decisiones.', need: 'Rediseño de principio a fin, con roles, agentes, datos y controles.', rec: 'BECOME DISCOVER™ + BECOME EMBED™' },
  { q: '¿Quieres construir un agente o un copiloto?', happens: 'Hay una idea o una necesidad concreta, pero falta el diseño operativo.', need: 'Diseño, límites de autonomía, supervisión humana, construcción y adopción.', rec: 'BECOME EMBED™' },
  { q: '¿Quieres crear una experiencia AI-native?', happens: 'Se busca nuevo valor para clientes o colaboradores.', need: 'Tesis de producto, diseño de la experiencia, arquitectura de datos y agentes, y validación.', rec: 'BECOME EMBED™ o secuencia completa' },
  { q: '¿Necesitas demostrar valor en 90 días?', happens: 'Hay presión por mostrar resultados sin caer en otra demostración.', need: 'Un alcance viable, una línea base, una capacidad que funcione, adopción y medición.', rec: 'BECOME EMBED™' },
];
