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

/**
 * ---- Por qué cada página tiene ahora su propio titular en cada bloque ----
 *
 * Las seis compartían el andamiaje: el mismo titular para las señales, el mismo
 * para «qué cambia dentro», el mismo párrafo de las cinco capas y el mismo
 * cierre. Medido sobre el HTML publicado, eso era el 46 % del texto de cada
 * página, y dejaba el grupo con un 52-59 % de texto propio y hasta un 43 % de
 * solapamiento entre dos de ellas: el punto más débil del sitio.
 *
 * No faltaba contenido —las señales, el problema, el valor y el resultado ya
 * eran propios— sino un titular verificable en cada bloque. Es lo mismo que
 * llevó a las páginas de programa del 20 % al 90 % de texto propio.
 *
 * `dentroTexto` es el que más importa: antes las seis decían que el trabajo
 * cruza las cinco capas, que es verdad y es la misma verdad seis veces. Ahora
 * cada una dice cuál pesa en SU situación y por qué.
 */
export const SOLUCION_CONTENIDO = {
  'escalar-ia': {
    seoTitulo: 'Escalar pilotos de IA a producción | BECOME',
    seoDesc: 'Si tus prototipos funcionan en una demostración pero no en la operación, hay que identificar qué falta alrededor de la tecnología antes de escalar.',
    q: '¿Tienes pilotos que no escalan?',
    answer: 'Si tus prototipos funcionan en una demostración pero no en la operación, hay que identificar qué falta alrededor de la tecnología antes de escalar.',
    senalesTitular: 'El piloto funciona. El sistema alrededor todavía no.',
    signals: [
      'Nadie se queda a cargo del piloto cuando termina.',
      'El proceso real no cambió.',
      'Los datos, las integraciones o los controles dependen de trabajo manual.',
      'Los usuarios prueban la solución, pero no la incorporan.',
      'No hay una línea base ni un criterio para decidir si está listo para escalar.',
    ],
    problemaTitular: 'El piloto no está preparado para sobrevivir a la demo.',
    problem: 'El piloto no falla por el modelo. Falla porque se construyó al lado del trabajo real en vez de dentro: nadie es dueño del resultado, el proceso siguió igual y no hay medida contra la que decidir.',
    valorTitular: 'Escalar empieza por decidir qué debe cambiar alrededor del modelo.',
    value: 'Evaluamos el piloto como parte de un sistema de Personas, Datos, Agentes, Productos y Operaciones; decidimos si debe detenerse, rediseñarse o convertirse en capacidad; luego construimos las condiciones de adopción y escala.',
    tools: [
      'Inside Readiness Index™',
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
      'Scale Readiness Gate™',
    ],
    result: 'Una decisión informada y, cuando corresponde, una capacidad preparada para operar.',
    engagement: 'BECOME DISCOVER™ → BECOME EMBED™',
    engagementWhy: 'El diagnóstico es estratégico y la solución es operativa. Saltarse el primero suele producir un segundo piloto igual de aislado.',
    dentroTitular: 'De iniciativa aislada a capacidad con dueño.',
    dentroTexto: 'Operations incorpora la solución al flujo real y asigna un responsable. Data deja de depender de preparaciones manuales. Agents opera con límites y criterios de evaluación. People adopta una nueva forma de trabajar y Products convierte el piloto en una capacidad que puede evolucionar.',
    cierreTitular: 'No todo piloto merece escalar. Todos merecen una decisión.',
    cierreTexto: 'Tráenos el piloto, su caso de negocio y lo que ocurrió después de la demostración. Identificaremos si falta adopción, datos, integración, control o una razón suficiente para seguir invirtiendo.',
    cta: 'Convierte el piloto en capacidad',
  },

  'preparar-equipos-para-ia': {
    seoTitulo: 'Capacitación en IA para equipos | BECOME',
    seoDesc: 'Si tus equipos ya usan herramientas de IA sin un método común, hace falta convertir ese uso suelto en una forma de trabajar compartida.',
    q: '¿Necesitas preparar a tus equipos para trabajar con IA?',
    answer: 'Si tus equipos ya usan herramientas de IA sin un método común, hace falta convertir ese uso suelto en una forma de trabajar compartida, con criterios y controles.',
    senalesTitular: 'El uso crece más rápido que el método.',
    signals: [
      'Cada persona usa la IA a su manera y con resultados desiguales.',
      'Se han hecho formaciones generales que no cambiaron el trabajo del día a día.',
      'Nadie sabe qué se puede pedir a una herramienta y qué no.',
      'Lo que funciona en un equipo no llega a los demás.',
      'Falta un criterio común sobre qué es un resultado aceptable.',
    ],
    problemaTitular: 'La brecha no es de acceso. Es de aplicación.',
    problem: 'Un curso genérico enseña una herramienta; el trabajo no cambia porque nadie ha mirado el proceso real del área. La capacidad aparece cuando cada equipo trabaja sobre sus propios documentos, sus casos y sus restricciones, y se lleva algo reutilizable.',
    valorTitular: 'Convertimos aprendizaje individual en capacidad compartida.',
    value: 'Partimos del trabajo que hace hoy cada área: mapeamos su proceso, elegimos los casos prioritarios, trabajamos sobre sus documentos reales y dejamos asistentes, plantillas y criterios de validación que quedan en la empresa.',
    tools: [
      'Applied Workflow Canvas',
      'Adoption Scorecard',
      'Inside Readiness Index™',
    ],
    result: 'Equipos que trabajan con IA sobre sus propios procesos, con una biblioteca reutilizable y criterios comunes de calidad.',
    engagement: 'BECOME NOW™',
    engagementWhy: 'Es el servicio diseñado para esto. Si además falta decidir dónde invertir como empresa, Discover ordena esa decisión antes o en paralelo.',
    dentroTitular: 'El cambio empieza en People y se sostiene en Operations.',
    dentroTexto: 'People desarrolla criterio y confianza para usar IA. Operations convierte los casos aprendidos en procesos repetibles. Data define qué información puede utilizarse y Agents deja de ser una herramienta aislada para participar dentro de tareas concretas, con revisión y estándares comunes.',
    cierreTitular: 'La capacitación debe verse en el trabajo del día siguiente.',
    cierreTexto: 'Cuéntanos qué áreas participarán, qué tareas quieren mejorar y qué herramientas tienen autorizadas. Diseñaremos el programa sobre ese trabajo, no sobre ejemplos que desaparecen al terminar la sesión.',
    cta: 'Diseña el programa de tu área',
  },

  'redisenar-procesos-criticos': {
    seoTitulo: 'Rediseño de procesos con IA | BECOME',
    seoDesc: 'Si buscas mejorar una operación crítica, hay que rediseñar el proceso de principio a fin, no automatizar tareas aisladas.',
    q: '¿Necesitas rediseñar un proceso crítico?',
    answer: 'Si buscas mejorar una operación crítica, hay que rediseñar el proceso de principio a fin, no automatizar tareas aisladas.',
    senalesTitular: 'El cuello de botella cambia de lugar, pero no desaparece.',
    signals: [
      'Hay muchas entregas entre equipos y trabajo que se rehace.',
      'Las decisiones dependen de información fragmentada.',
      'Los especialistas dedican tiempo a tareas repetitivas.',
      'Las excepciones no tienen responsable ni un criterio común.',
      'El proceso es lento, variable o difícil de auditar.',
    ],
    problemaTitular: 'Una tarea más rápida no convierte al proceso en mejor.',
    problem: 'Automatizar una tarea dentro de un proceso que no cambia mueve el cuello de botella de sitio. El tiempo se recupera en un paso y se pierde en el siguiente, porque las decisiones, los datos y las excepciones siguen donde estaban.',
    valorTitular: 'Rediseñamos la decisión antes de automatizar la tarea.',
    value: 'Rediseñamos como un solo proceso los eventos, las decisiones, los roles, las tareas del agente, los datos, las excepciones, la supervisión humana, los controles y las métricas. Después construimos y validamos la capacidad prioritaria.',
    tools: [
      'Inside Target State Canvas™',
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
    ],
    result: 'Un proceso más rápido, consistente, controlado y capaz de aprender.',
    engagement: 'BECOME DISCOVER™ + BECOME EMBED™',
    engagementWhy: 'El rediseño necesita una mirada de sistema, y la mejora solo es real cuando el nuevo proceso funciona en producción.',
    dentroTitular: 'Operations lleva el peso. Data y Agents eliminan la fricción.',
    dentroTexto: 'Operations redefine el flujo completo, los handoffs y las excepciones. Data llega al punto donde se necesita para decidir. Agents asume tareas delimitadas y escala lo que no puede resolver. People conserva el criterio y el ownership; Products hace visible la experiencia de quienes usan o reciben el proceso.',
    cierreTitular: 'Empieza por el proceso que más costo oculta.',
    cierreTexto: 'Muéstranos dónde se acumulan las esperas, el retrabajo y las excepciones. Reconstruiremos el proceso real y definiremos qué debe eliminarse, qué puede asistir la IA y qué decisión debe seguir en manos de una persona.',
    cta: 'Rediseña el proceso',
  },

  'agentes-de-ia-con-control': {
    seoTitulo: 'Agentes de IA con control | BECOME',
    seoDesc: 'Diseñamos el proceso antes de elegir el modelo: qué hace el agente, a qué datos accede, cuándo pide aprobación y quién responde por el resultado.',
    q: '¿Quieres construir un agente o un copiloto?',
    answer: 'Diseñamos el trabajo antes de elegir la tecnología: qué puede hacer el agente, qué decisiones conserva la persona, a qué información accede y qué ocurre cuando no sabe cómo continuar.',
    senalesTitular: 'El prototipo responde. La operación todavía no sabe cómo gobernarlo.',
    signals: [
      'El equipo conoce la tarea, pero no el modelo operativo.',
      'No está claro qué decide el agente y qué conserva la persona.',
      'Faltan rutas para las excepciones, permisos o criterios de calidad.',
      'El prototipo no está integrado al proceso real.',
      'No existen evaluaciones ni alertas para saber cuándo deja de comportarse como se espera.',
    ],
    problemaTitular: 'El reto no es darle autonomía. Es diseñar sus límites.',
    problem: 'Un agente sin modelo operativo es una demostración con permisos. Lo que decide su destino no es la calidad de las respuestas, sino quién responde cuando se equivoca y qué pasa con los casos que no encajan.',
    valorTitular: 'Construimos el sistema de trabajo alrededor del agente.',
    value: 'Validamos el diseño, definimos la supervisión humana y los controles, construimos e integramos el agente o copiloto, acompañamos la adopción y medimos confianza, desempeño, control y valor.',
    tools: [
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
      'Scale Readiness Gate™',
    ],
    result: 'Un agente o copiloto que participa en trabajo real, con un responsable explícito.',
    engagement: 'BECOME EMBED™',
    engagementWhy: 'Depende de la preparación: si la oportunidad todavía no tiene un diseño que se pueda validar, empezamos por una revisión corta.',
    dentroTitular: 'Agents no opera solo: Operations define cuándo actúa y quién responde.',
    dentroTexto: 'Agents ejecuta dentro de límites explícitos. Operations define el proceso, las excepciones y el responsable. Data controla fuentes, accesos y trazabilidad. People supervisa y aprende a intervenir. Products convierte esa interacción en una experiencia comprensible para quien la utiliza.',
    cierreTitular: 'Antes de construir, haz visible qué puede decidir.',
    cierreTexto: 'Cuéntanos qué tarea asumiría el agente, qué sistemas tendría que consultar y qué error no puedes permitirte. Con eso podremos definir autonomía, controles y el punto correcto de revisión humana.',
    cta: 'Construye la capacidad',
  },

  'productos-y-servicios-con-ia': {
    seoTitulo: 'Productos y servicios con IA | BECOME',
    seoDesc: 'Si buscas una nueva experiencia para clientes o colaboradores, necesitas diseñar el valor, el comportamiento inteligente y la operación que lo sostiene.',
    q: '¿Quieres crear un producto o servicio AI-native?',
    answer: 'Si buscas una nueva experiencia para clientes o colaboradores, necesitas diseñar al mismo tiempo su valor, su comportamiento inteligente y la operación que la sostiene.',
    senalesTitular: 'La idea tiene IA. El producto todavía necesita una razón para existir.',
    signals: [
      'La idea depende de la IA, pero el valor para quien la usa todavía es genérico.',
      'La experiencia de producto no define confianza, explicación ni escalamiento.',
      'No está claro qué datos y qué conocimiento hacen posible la experiencia.',
      'El equipo necesita validar si se desea, si es posible y si es viable.',
      'No existe una métrica que demuestre que la inteligencia mejora la experiencia.',
    ],
    problemaTitular: 'Un modelo dentro de la experiencia no la convierte en AI-native.',
    problem: 'Una experiencia AI-native no se diseña como una pantalla con un modelo detrás. El comportamiento inteligente es parte del producto: qué sabe, qué explica, cuándo cede el control y quién lo opera cuando está en producción.',
    valorTitular: 'Diseñamos valor, comportamiento y operación como un solo producto.',
    value: 'Conectamos la tesis de producto, el recorrido de quien lo usa, la inteligencia, los datos, el comportamiento del agente, los controles y la responsabilidad operativa. Prototipamos, validamos y construimos el alcance que pueda demostrar valor real.',
    tools: [
      'AI-Native Value Map™',
      'Inside Target State Canvas™',
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
    ],
    result: 'Un producto o servicio AI-native validado, con una ruta explícita para llevarlo a operación.',
    engagement: 'BECOME EMBED™ o BECOME DISCOVER™ → BECOME EMBED™',
    engagementWhy: 'Si la tesis de producto todavía está abierta, BECOME DISCOVER™ la cierra antes de construir.',
    dentroTitular: 'Products define la promesa. Las otras capas hacen que pueda cumplirse.',
    dentroTexto: 'Products define el valor y la experiencia. Agents aporta el comportamiento inteligente. Data determina qué puede conocer y explicar. Operations sostiene el servicio cuando aparecen errores y excepciones. People mantiene la confianza, la supervisión y la capacidad de evolucionarlo.',
    cierreTitular: 'La pregunta no es dónde poner IA. Es qué experiencia ahora puede existir.',
    cierreTexto: 'Cuéntanos quién usaría el producto, qué resultado no puede obtener hoy y por qué la inteligencia sería esencial. Validaremos la propuesta antes de convertir una capacidad técnica en una promesa al mercado.',
    cta: 'Diseña la nueva experiencia',
  },

  'medir-y-gobernar-valor': {
    seoTitulo: 'Gobierno y valor de la IA | BECOME',
    seoDesc: 'Para demostrar resultados y aclarar quién responde por cada decisión, hace falta medir contra una línea base y gobernar lo que ya funciona.',
    q: '¿Necesitas medir y gobernar el valor de la IA?',
    answer: 'Si tienes que demostrar resultados, reducir riesgos y aclarar quién responde por cada decisión, hace falta medir contra una línea base y gobernar lo que ya está funcionando.',
    senalesTitular: 'La actividad es visible. El valor todavía no.',
    signals: [
      'Se reportan actividades —usuarios, pilotos, licencias— pero no resultados.',
      'No hay línea base, así que cualquier mejora es discutible.',
      'Nadie sabe quién responde cuando un sistema se equivoca.',
      'La dirección necesita decidir la inversión con evidencia, no con demostraciones.',
      'Faltan criterios para decidir qué se escala y qué se detiene.',
    ],
    problemaTitular: 'Sin baseline, cada resultado es una interpretación.',
    problem: 'Sin línea base no hay mejora que probar, solo opiniones sobre una demostración. Y sin responsables asignados, el control se convierte en un documento que nadie aplica. Medir y gobernar no son dos tareas administrativas al final: son lo que separa una capacidad de un experimento caro.',
    valorTitular: 'Convertimos valor y control en decisiones recurrentes.',
    value: 'Definimos qué significa valor en tu caso, medimos el punto de partida, asignamos responsables y frecuencia de revisión, y establecemos los controles —supervisión humana, trazabilidad, calidad y escalamiento— que hacen que el resultado se sostenga.',
    tools: ['Embed Scorecard™', 'Scale Readiness Gate™', 'Inside Readiness Index™'],
    result: 'Una medición que resiste una pregunta difícil y un modelo de gobierno con nombres, no con buenas intenciones.',
    engagement: 'BECOME DISCOVER™ o BECOME EMBED™',
    engagementWhy: 'Si lo que falta es el criterio, empieza en Discover. Si ya hay algo funcionando y lo que falta es medirlo y gobernarlo, va dentro de Embed.',
    dentroTitular: 'La gobernanza no es una sexta capa. Es cómo responden las cinco.',
    dentroTexto: 'People asigna responsabilidades. Data conserva evidencia y trazabilidad. Agents opera dentro de límites medibles. Products responde por el resultado que promete y Operations incorpora controles, revisión y escalamiento al trabajo habitual. Así, gobernar deja de ser revisar documentos y se convierte en tomar decisiones.',
    cierreTitular: 'Lo que no puede explicarse tampoco puede escalarse.',
    cierreTexto: 'Muéstranos qué iniciativas existen, qué se reporta hoy y qué pregunta sigue sin respuesta en el comité. Definiremos una línea base, responsables y criterios para invertir, corregir, escalar o detener.',
    cta: 'Define el sistema de valor',
  },
};

export const ORIENTATION = [
  { q: '¿Tienes pilotos que no escalan?', happens: 'Prototipos aislados, sin responsable, integración ni adopción.', need: 'Diagnóstico de sistema, estado objetivo y decisión sobre qué escalar.', rec: 'BECOME DISCOVER™ → BECOME EMBED™' },
  { q: '¿Necesitas preparar a tus equipos para trabajar con IA?', happens: 'Cada persona usa la IA a su manera y con resultados desiguales.', need: 'Un método común sobre los procesos reales del área, con criterios y controles.', rec: 'BECOME NOW™' },
  { q: '¿Necesitas rediseñar un proceso crítico?', happens: 'Un proceso lento, fragmentado o intensivo en decisiones.', need: 'Rediseño de principio a fin, con roles, agentes, datos y controles.', rec: 'BECOME DISCOVER™ + BECOME EMBED™' },
  { q: '¿Quieres incorporar agentes de IA sin perder el control?', happens: 'Hay una idea o una necesidad concreta, pero falta el diseño operativo.', need: 'Diseño, límites de autonomía, supervisión humana, construcción y adopción.', rec: 'BECOME EMBED™' },
  { q: '¿Quieres que la IA forme parte de tu propuesta de valor?', happens: 'Se busca valor nuevo para clientes o colaboradores.', need: 'Tesis de producto, diseño de la experiencia, arquitectura de datos y agentes, y validación.', rec: 'BECOME EMBED™ o la secuencia completa' },
  { q: '¿Necesitas medir y gobernar el valor de la IA?', happens: 'Se reportan actividades, pero no resultados, y nadie responde por las decisiones.', need: 'Línea base, responsables, frecuencia de revisión y controles.', rec: 'BECOME DISCOVER™ o BECOME EMBED™' },
];
