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
      'Si estás buscando una dirección común para invertir, priorizar y gobernar la IA, necesitas un AI-Native Transformation Discovery.',
    signals: [
      'Cada área propone sus propios use cases.',
      'El comité ejecutivo no comparte una AI-native ambition.',
      'Tecnología recibe demandas sin un criterio único de valor.',
      'Existen pilotos, pero no un portfolio ni un business case integrado.',
    ],
    problem:
      'El síntoma es dispersión, pero la causa es que no hay una tesis de empresa que ordene las decisiones. Sin ambición compartida, cada iniciativa compite por presupuesto con el argumento de su propia área y ninguna se mide contra el mismo outcome.',
    value:
      'Alineamos ambition y outcomes, evaluamos readiness, identificamos value pools, priorizamos capacidades y diseñamos el target operating model y roadmap.',
    tools: ['Business Ambition Canvas™', 'Inside Readiness Index™', 'AI-Native Value Map™', 'Inside Target State Canvas™'],
    result: 'Una estrategia ejecutable y una primera capacidad elegida con criterios explícitos.',
    engagement: 'Discovery',
    engagementWhy:
      'Falta la capa estratégica: dirección, prioridad y diseño del modelo futuro. Construir antes de eso multiplica el número de pilotos, no el valor.',
    cta: 'Define dónde empezar',
  },

  'pilotos-que-no-escalan': {
    q: '¿Tienes pilotos que no escalan?',
    answer:
      'Si tus prototypes funcionan en demo, pero no en la operación, necesitas identificar qué falta alrededor de la tecnología antes de escalar.',
    signals: [
      'No existe owner operativo después del piloto.',
      'El workflow real no cambió.',
      'Data, integrations o controls dependen de trabajo manual.',
      'Los usuarios prueban la solución, pero no la incorporan.',
      'No hay baseline ni criterio de scale readiness.',
    ],
    problem:
      'El piloto no falla por el modelo. Falla porque se construyó al lado del trabajo real en vez de dentro: nadie es dueño del resultado, el proceso siguió igual y no hay medida contra la que decidir.',
    value:
      'Evaluamos el piloto como parte de un sistema de People, Data, Agents, Products y Operations; decidimos si debe detenerse, rediseñarse o convertirse en capacidad; luego construimos las condiciones de adopción y escala.',
    tools: ['Inside Readiness Index™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'Una decisión informada y, cuando corresponde, una capacidad preparada para operar.',
    engagement: 'Discovery → Build & Embed',
    engagementWhy:
      'El diagnóstico es estratégico y la solución es operativa. Saltarse el primero suele producir un segundo piloto igual de aislado.',
    cta: 'Convierte el piloto en capacidad',
  },

  'redisenar-workflow-critico': {
    q: '¿Necesitas rediseñar un workflow crítico?',
    answer:
      'Si buscas mejorar una operación crítica, necesitas rediseñar el workflow end-to-end; no automatizar tareas aisladas.',
    signals: [
      'Existen múltiples handoffs y retrabajos.',
      'Las decisiones dependen de información fragmentada.',
      'Los especialistas dedican tiempo a tareas repetitivas.',
      'Las excepciones no tienen owner o criterio uniforme.',
      'El proceso es lento, variable o difícil de auditar.',
    ],
    problem:
      'Automatizar una tarea dentro de un proceso que no cambia mueve el cuello de botella de sitio. El tiempo se recupera en un paso y se pierde en el siguiente, porque las decisiones, los datos y las excepciones siguen donde estaban.',
    value:
      'Rediseñamos eventos, decisiones, roles, agent tasks, data, exceptions, human oversight, controls y metrics como un solo workflow; después construimos y validamos la capacidad prioritaria.',
    tools: ['Inside Target State Canvas™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™'],
    result: 'Un workflow más rápido, consistente, controlado y capaz de aprender.',
    engagement: 'Discovery + Build & Embed',
    engagementWhy:
      'El rediseño necesita una vista de sistema y la mejora solo es real cuando el nuevo workflow funciona en producción.',
    cta: 'Rediseña el workflow',
  },

  'construir-agent-o-copilot': {
    q: '¿Quieres construir un agent o copilot?',
    answer:
      'Si ya tienes una oportunidad priorizada, necesitas convertirla en una capacidad con límites de autonomía, integración, adoption y accountability definidos.',
    signals: [
      'El equipo conoce la tarea, pero no el operating model.',
      'No está claro qué decide el agent y qué conserva la persona.',
      'Faltan exception paths, permissions o quality criteria.',
      'El prototype no está integrado al workflow real.',
    ],
    problem:
      'Un agent sin operating model es una demo con permisos. Lo que decide su destino no es la calidad de las respuestas, sino quién responde cuando se equivoca y qué pasa con los casos que no encajan.',
    value:
      'Validamos el blueprint, diseñamos human-in-the-loop y controls, construimos e integramos el agent o copilot, acompañamos la adopción y medimos trust, performance, control y value.',
    tools: ['Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'Un agent o copilot que participa en trabajo real con ownership explícito.',
    engagement: 'Build & Embed',
    engagementWhy:
      'Sujeto a readiness: si la oportunidad aún no tiene blueprint validable, primero pasamos un short readiness gate.',
    cta: 'Construye la capacidad',
  },

  'experiencia-ai-native': {
    q: '¿Quieres crear una experiencia AI-native?',
    answer:
      'Si buscas una nueva experiencia para clientes o colaboradores, necesitas diseñar el valor, el comportamiento inteligente y la operación que lo sostiene.',
    signals: [
      'La idea depende de IA, pero su user value aún es genérico.',
      'El product experience no define trust, explanation o escalation.',
      'No está claro qué data y knowledge hacen posible la experiencia.',
      'El equipo necesita validar desirability, feasibility y viability.',
    ],
    problem:
      'Una experiencia AI-native no se diseña como una pantalla con un modelo detrás. El comportamiento inteligente es parte del producto: qué sabe, qué explica, cuándo cede el control y quién lo opera cuando está en producción.',
    value:
      'Conectamos product thesis, user journey, intelligence, data, agent behavior, controls y operational ownership; prototipamos, validamos y construimos el scope que pueda demostrar valor real.',
    tools: ['AI-Native Value Map™', 'Inside Target State Canvas™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™'],
    result: 'Una product o service capacidad AI-native validada e incorporable.',
    engagement: 'Build & Embed o secuencia completa',
    engagementWhy:
      'Si la tesis de producto todavía está abierta, Discovery la cierra antes de construir.',
    cta: 'Diseña la nueva experiencia',
  },

  'demostrar-valor-en-90-dias': {
    q: '¿Necesitas demostrar valor en 90 días?',
    answer:
      'Si necesitas evidencia rápida, necesitas reducir el scope sin reducir la exigencia: una capacidad viable, un entorno real y outcomes medibles.',
    signals: [
      'Existe sponsor y urgencia ejecutiva.',
      'La oportunidad parece clara, pero aún no tiene baseline.',
      'Hay riesgo de producir otro demo sin adopción.',
      'El equipo necesita una decisión de inversión basada en evidencia.',
    ],
    problem:
      'La presión de plazo empuja a enseñar algo, y enseñar algo es exactamente lo que no genera evidencia. Sin baseline y sin uso real, a los 90 días hay una demo mejor y la misma duda.',
    value:
      'Aplicamos un readiness gate, delimitamos el workflow y los outcomes, construimos el mínimo scope operativo, implementamos de forma controlada y medimos uso, trust, performance, control y value.',
    tools: ['Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'Evidencia suficiente para decidir si iterar, integrar, escalar o detener.',
    engagement: 'Build & Embed',
    engagementWhy:
      'Sujeto a priorización. Si el caso todavía no está suficientemente definido, no forzamos el plazo: un sprint mal delimitado gasta los 90 días sin producir la decisión.',
    cta: 'Define un sprint de valor',
  },
};

/* Mapa de orientación del hub (§11). Es la tabla que traduce síntoma en
   decisión, y la razón por la que este hub no es una galería de tecnologías. */
export const ORIENTATION = [
  { q: '¿No sabes por dónde empezar con IA?', happens: 'Muchas ideas, presión ejecutiva y prioridades dispersas.', need: 'Ambición, value pools, choices y roadmap.', rec: 'Discovery' },
  { q: '¿Tienes pilotos que no escalan?', happens: 'Prototypes aislados sin ownership, integración o adopción.', need: 'Diagnóstico sistémico, target state y decisión sobre qué escalar.', rec: 'Discovery → Build & Embed' },
  { q: '¿Necesitas rediseñar un workflow crítico?', happens: 'Un proceso lento, fragmentado o intensivo en decisiones.', need: 'End-to-end workflow redesign con roles, agents, data y controls.', rec: 'Discovery + Build & Embed' },
  { q: '¿Quieres construir un agent o copilot?', happens: 'Existe una idea o necesidad funcional, pero falta diseño operativo.', need: 'Blueprint, autonomy boundaries, human-in-the-loop, build y adoption.', rec: 'Build & Embed' },
  { q: '¿Quieres crear una experiencia AI-native?', happens: 'Se busca nuevo valor para clientes o colaboradores.', need: 'Product thesis, experience design, data/agent architecture y validation.', rec: 'Build & Embed o secuencia completa' },
  { q: '¿Necesitas demostrar valor en 90 días?', happens: 'Hay presión por mostrar outcomes sin caer en otro demo.', need: 'Scope viable, baseline, working capacidad, adoption y scorecard.', rec: 'Build & Embed' },
];
