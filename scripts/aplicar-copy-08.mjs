/**
 * Aplica el copy canónico del documento 08 a las seis industrias, en español.
 *
 * ---- Por qué esto es un script y no una edición a mano ----
 *
 * Son seis industrias por veinte campos, con listas de hasta trece filas
 * dentro. Editado a mano, el error no es escribir mal una frase: es dejarse
 * una, y una frase que falta no la ve nadie hasta que un cliente del sector
 * lee la página y encuentra el hueco. Escrito como dato, se puede comparar
 * campo por campo antes y después, y eso es lo que hace el final del archivo.
 *
 * ---- Qué NO toca ----
 *
 * El inglés. El documento 08 es copy en español y solo eso: aplicar su texto
 * al bloque `en` sería traducir por mi cuenta contenido que nadie aprobó.
 * Tampoco toca slugs, iconos ni enlaces cruzados, que no son copy.
 *
 * ---- La única decisión de criterio ----
 *
 * El documento da las métricas como lista de nombres —«Tiempo de ciclo.»— y
 * el sitio las muestra como nombre + qué mide. Donde la métrica ya existía con
 * su explicación aprobada, se conserva la explicación. Donde el documento
 * añade una métrica nueva, la segunda columna queda vacía: inventar qué mide
 * sería escribir copy que nadie revisó, y el documento pide justo lo contrario.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const RUTA = 'src/content/industrias.json';

/* ---- El contenido, tal como lo fija el documento 08 --------------------- */

const COPY = {
  'banca-seguros-fintech': {
    nombre: 'Banca, seguros y fintech',
    menu: 'Crédito, fraude, operaciones, siniestros, cumplimiento, cobranza y canales digitales.',
    h1: 'Millones de operaciones. Menos tiempo para entender qué requiere atención.',
    lead: 'Crédito, fraude, siniestros, reclamos y cumplimiento dependen de información distribuida entre documentos, reglas y sistemas. La IA aporta cuando prepara mejor el caso, reduce búsqueda y hace visible la evidencia, sin sacar la decisión de quien debe responder por ella.',
    contexto: [
      'Muchos de los cuellos de botella no están dentro del core: están alrededor de él.',
      'Expedientes incompletos. Alertas sin suficiente contexto. Excepciones que pasan entre áreas. Conciliaciones que requieren comparar fuentes. Reclamos que obligan a revisar movimientos, canal, documentación e historial antes de responder.',
      'BECOME trabaja sobre esos puntos para conectar datos, documentación, políticas, personas, LLMs y agentes de IA dentro de un proceso más claro y trazable.',
    ],
    oportunidadesTitular: 'Dónde vemos oportunidad.',
    oportunidades: [
      ['Originación y evaluación crediticia', 'Preparar expedientes, validar completitud, contrastar documentos, detectar inconsistencias y presentar al analista un caso mejor estructurado antes de la evaluación.'],
      ['Operaciones alrededor del core', 'Asistir excepciones, incidencias, ajustes y consultas que hoy requieren navegar varios sistemas y procedimientos.'],
      ['Fraude y monitoreo de alertas', 'Consolidar antecedentes, recuperar movimientos relevantes y preparar contexto para acelerar investigación y escalamiento.'],
      ['KYC y prevención de LA/FT', 'Revisar documentación, recuperar políticas y normativa, preparar evidencia y dejar trazabilidad de las fuentes consultadas.'],
      ['Conciliaciones', 'Comparar fuentes, identificar diferencias y preparar regularizaciones antes de la revisión humana.'],
      ['Reclamos y movimientos no reconocidos', 'Recuperar movimientos, canal, historial y documentación para preparar la atención y reducir pases entre equipos.'],
      ['Cobranza y recuperaciones', 'Priorizar casos, resumir historial y preparar la siguiente gestión dentro de las políticas definidas.'],
      ['Suscripción y siniestros', 'Ordenar expedientes, contrastar coberturas, identificar faltantes y preparar el caso antes de suscripción, liquidación o revisión.'],
      ['Atención y canales digitales', 'Dar a ejecutivos, asistentes y canales digitales acceso a información vigente con escalamiento claro de excepciones.'],
    ],
    workflowsTitular: 'Los procesos donde empieza el trabajo.',
    workflows: ['Crédito', 'Fraude', 'Operaciones', 'Siniestros', 'Cumplimiento', 'Cobranza', 'Canales digitales'],
    casos: [
      'Copiloto de expediente crediticio: organiza documentos, detecta faltantes y prepara el caso para el analista.',
      'Asistente de fraude: consolida movimientos, alertas y antecedentes antes de investigación.',
      'Agente de conciliación: compara fuentes y prepara diferencias para regularización.',
      'Asistente de cumplimiento: consulta políticas y normativa con fuente visible.',
      'Copiloto de siniestros: ordena cobertura, documentación y pendientes antes de revisión.',
      'Asistente de reclamos: prepara el caso con movimientos, historial y documentos.',
    ],
    capacidades: [
      ['Priorizar dónde está el valor', 'Mapear procesos de crédito, fraude, operaciones, seguros o atención y priorizarlos por impacto, viabilidad, riesgo y velocidad de captura de valor.', 'BECOME DISCOVER™'],
      ['Rediseñar una decisión', 'Definir qué información debe llegar, qué reglas aplican, dónde existe una excepción, quién aprueba y qué evidencia debe quedar.', 'Decision intelligence'],
      ['Construir copilotos y agentes con control', 'Implementar RAG sobre políticas y procedimientos, extracción documental, agentes acotados a tareas y conexiones mediante APIs a sistemas autorizados.', 'BECOME EMBED™'],
      ['Desarrollar a los equipos', 'Programas aplicados para Finanzas, Legal, Compliance y Risk, Operaciones, Atención, Data y Tecnología sobre procesos y documentos reales.', 'BECOME NOW™'],
      ['Medir y transferir', 'Definir línea base, métricas, límites de autonomía, trazabilidad, responsable y manual de operación para que la capacidad quede dentro.', ''],
    ],
    tecnologiaTitular: 'La IA puede preparar una decisión. No debe esconder cómo llegó a ella.',
    tecnologia: 'Según el caso: extracción documental, RAG, búsqueda semántica, agentes de IA, APIs, permisos, logs, evaluación, human-in-the-loop y reglas de escalamiento. Se diseñan siempre la fuente y la evidencia, los permisos, la trazabilidad, los puntos de aprobación, las rutas de excepción y los límites explícitos de autonomía.',
    metricasTitular: 'Qué medimos.',
    metricas: [
      ['Tiempo de ciclo', ''],
      ['Completitud a la primera', ''],
      ['Retrabajo', ''],
      ['Tiempo de resolución de excepciones', ''],
      ['Tiempo de preparación por analista', ''],
      ['Tiempo de atención', ''],
      ['Tasa de escalamiento', ''],
      ['Trazabilidad', ''],
      ['Adopción', ''],
    ],
    empezarTitular: 'Cómo empezar.',
    empezar: [
      'BECOME NOW™ si el reto está en cómo trabaja el equipo.',
      'BECOME DISCOVER™ si todavía hay que decidir dónde invertir.',
      'BECOME EMBED™ si ya existe un proceso priorizado que debe llegar a operación.',
    ],
    cierre: 'Empieza por el proceso donde hoy un analista necesita abrir demasiadas fuentes antes de decidir.',
    cierreTexto: 'Cuéntanos qué decisión, proceso o experiencia necesita cambiar. Te ayudaremos a identificar el punto de partida más adecuado.',
  },

  'mineria-energia': {
    nombre: 'Minería y energía',
    menu: 'Planeamiento, mina, concentradora, mantenimiento, seguridad, logística y operaciones intensivas en activos.',
    h1: 'La operación ya genera la señal. El reto es convertirla en acción a tiempo.',
    lead: 'Cada guardia produce información sobre mineral, equipos, producción, mantenimiento, seguridad, agua, relaves, logística y restricciones. El valor aparece cuando ese conocimiento llega antes a la persona que debe actuar, con la fuente, el contexto y el límite de decisión claros.',
    contexto: [
      'Una operación minera peruana habla de planeamiento mina, perforación y voladura, carguío y acarreo, chancado, molienda, flotación, planta concentradora, mantenimiento, confiabilidad, paradas de planta, relaves y transporte de concentrado.',
      'BECOME no parte de «un caso de IA». Parte del punto donde un supervisor, planificador, ingeniero, mantenedor o área de soporte necesita reunir demasiada información antes de actuar.',
    ],
    oportunidadesTitular: 'Dónde vemos oportunidad.',
    oportunidades: [
      ['Geología y planeamiento mina', 'Consolidar antecedentes geológicos, restricciones, planes, desviaciones y supuestos para preparar revisiones de corto y largo plazo.'],
      ['Perforación y voladura', 'Ordenar diseños, cumplimiento, resultados y eventos para acelerar análisis posteriores y lecciones aprendidas.'],
      ['Carguío y acarreo', 'Preparar análisis de demoras, disponibilidad, tiempos de ciclo, eventos de flota y causas operativas.'],
      ['Chancado', 'Recuperar historial de eventos, procedimientos y reportes para preparar análisis de restricciones y detenciones.'],
      ['Molienda y flotación', 'Consolidar información operacional y antecedentes para apoyar análisis de variabilidad y preparación de acciones.'],
      ['Planta concentradora', 'Dar acceso rápido a procedimientos, bitácoras, reportes, manuales y precedentes para operaciones, mantenimiento e ingeniería.'],
      ['Mantenimiento y confiabilidad', 'Reunir órdenes de trabajo, historial, manuales, fallas anteriores, repuestos y backlog antes de planificar una intervención.'],
      ['Paradas de planta', 'Preparar alcance, ruta crítica, permisos, contratistas, riesgos, materiales, lecciones aprendidas y pendientes.'],
      ['Reportes de guardia', 'Convertir bitácoras, eventos y pendientes dispersos en reportes consistentes y comparables.'],
      ['Relaves y agua', 'Recuperar documentación, inspecciones, compromisos y procedimientos para facilitar seguimiento y trazabilidad.'],
      ['Logística y transporte de concentrado', 'Consolidar incidencias, programación, restricciones y antecedentes para gestionar excepciones.'],
      ['Contratos y servicios especializados', 'Comparar propuestas, condiciones, entregables, hitos, valorizaciones y cumplimiento.'],
      ['Ingeniería y conocimiento técnico', 'Encontrar memorias, estudios, planos, procedimientos, criterios y precedentes con vínculo a la fuente original.'],
    ],
    workflowsTitular: 'Los procesos donde empieza el trabajo.',
    workflows: ['Planeamiento', 'Mina', 'Concentradora', 'Mantenimiento', 'Seguridad', 'Logística', 'Operaciones intensivas en activos'],
    casos: [
      'Copiloto de guardia: lee bitácoras, eventos y pendientes autorizados y prepara un resumen estructurado para el cambio de guardia, con vínculo a las fuentes.',
      'Asistente de mantenimiento: reúne historial, órdenes de trabajo, manuales, fallas anteriores y backlog de un equipo antes de la intervención. El diagnóstico sigue en mantenimiento.',
      'Agente de preparación de parada: consolida pendientes, permisos, responsables y evidencias; señala información faltante antes de ejecución.',
      'Asistente de conocimiento de concentradora: permite consultar procedimientos, manuales y precedentes de chancado, molienda o flotación con citas a documentación interna.',
      'Analista asistido de demoras de carguío y acarreo: agrupa eventos y prepara hipótesis de causas para revisión de Operaciones, sin tomar decisiones de despacho.',
      'Asistente de contratos de servicio: compara alcance, hitos, obligaciones, valorizaciones y pendientes para revisión del responsable.',
    ],
    capacidades: [
      ['Identificar el proceso donde el conocimiento llega tarde', 'Mapear decisiones, fuentes, excepciones, dependencias y tiempo perdido entre señal y acción.', 'BECOME DISCOVER™'],
      ['Convertir conocimiento operacional en capacidad consultable', 'Diseñar búsqueda empresarial y RAG sobre manuales, procedimientos, bitácoras, reportes y precedentes, con la fuente visible.', 'Knowledge intelligence'],
      ['Construir copilotos para guardias, mantenimiento y paradas', 'Asistentes que preparan contexto, pendientes, documentación y evidencia sin asumir decisiones críticas de seguridad o proceso.', 'BECOME EMBED™'],
      ['Desarrollar capacidades en los equipos', 'Programas aplicados para Operaciones, Mantenimiento, Ingeniería, Supply Chain, PMO y áreas corporativas.', 'BECOME NOW™'],
      ['Diseñar control operativo', 'Definir qué puede preparar un sistema, qué exige aprobación humana, qué se registra y cómo se reconstruye una acción después.', ''],
    ],
    tecnologiaTitular: 'En seguridad y operación crítica, la IA prepara contexto. La persona mantiene la decisión.',
    tecnologia: 'Puede combinar RAG sobre documentación técnica, búsqueda semántica, resumen de guardias, clasificación de eventos, agentes para tareas administrativas acotadas, APIs a sistemas autorizados, logs y trazabilidad, y aprobación humana. No se diseña autonomía sobre decisiones críticas de seguridad, geotecnia, voladura, despacho, proceso o mantenimiento sin el marco técnico y humano correspondiente.',
    metricasTitular: 'Qué medimos.',
    metricas: [
      ['Tiempo de preparación de reportes', ''],
      ['Tiempo de búsqueda', ''],
      ['Tiempo entre señal y preparación de decisión', ''],
      ['Consistencia entre guardias', ''],
      ['Retrabajo documental', ''],
      ['Tiempo de preparación de parada', ''],
      ['Cierre de pendientes', ''],
      ['Uso del conocimiento técnico', ''],
      ['Tiempo de análisis de demoras', ''],
      ['Adopción por rol', ''],
    ],
    empezarTitular: 'Cómo empezar.',
    empezar: [
      'BECOME NOW™ si el reto está en cómo trabaja el equipo.',
      'BECOME DISCOVER™ si todavía hay que decidir dónde invertir.',
      'BECOME EMBED™ si ya existe un proceso priorizado que debe llegar a operación.',
    ],
    cierre: 'Empieza por un proceso real de mina, planta o mantenimiento.',
    cierreTexto: 'Muéstranos dónde hoy se pierde tiempo buscando antecedentes, preparando una guardia, revisando una parada o entendiendo una desviación.',
  },

  'retail-consumo-masivo': {
    nombre: 'Retail y consumo masivo',
    menu: 'Surtido, inventario, precios, promociones, e-commerce, tiendas, distribución y postventa.',
    h1: 'Cuando el mercado cambia cada semana, decidir tarde cuesta venta.',
    lead: 'Retail y consumo masivo operan con miles de SKUs, stock, precios, promociones, tiendas, distribuidores, e-commerce y múltiples modalidades de entrega. BECOME ayuda a convertir esa complejidad en decisiones comerciales, ejecución y atención más rápidas, manteniendo criterio de marca y control operativo.',
    contexto: [
      'El cuello de botella aparece cuando el criterio necesario para decidir, publicar o resolver una excepción no escala al mismo ritmo que el volumen.',
      'La IA aporta cuando ayuda a preparar decisiones, mantener información consistente entre canales y resolver casos con mejor contexto.',
    ],
    oportunidadesTitular: 'Dónde vemos oportunidad.',
    oportunidades: [
      ['Surtido y categorías', 'Reunir venta, margen, rotación, inventario y contexto comercial para preparar revisiones de categoría.'],
      ['Inventario y quiebres', 'Consolidar señales y excepciones para priorizar reposición, disponibilidad y causas de quiebre.'],
      ['Precios y promociones', 'Preparar antecedentes, escenarios y resultados para acelerar análisis comerciales.'],
      ['Catálogo y fichas', 'Generar, adaptar y validar descripciones y atributos por canal bajo reglas de producto y marca.'],
      ['E-commerce y marketplace', 'Resolver excepciones de pedido, vendedor, despacho, devolución y postventa con mejor contexto.'],
      ['Delivery y retiro en tienda', 'Preparar información sobre stock, modalidad, ventana de entrega, tienda, incidencia y reprogramación.'],
      ['Cambios y devoluciones', 'Clasificar motivo, validar requisitos y preparar el caso antes de atención.'],
      ['Trade marketing y punto de venta', 'Convertir lineamientos, promociones y materiales en conocimiento fácil de consultar por tienda y fuerza de ventas.'],
      ['Sell-in y sell-out', 'Preparar análisis recurrentes por canal, distribuidor, categoría o cliente.'],
      ['Atención y postventa', 'Dar a asistentes y equipos de servicio acceso a políticas, pedido, stock y estado con salida clara hacia una persona.'],
    ],
    workflowsTitular: 'Los procesos donde empieza el trabajo.',
    workflows: ['Surtido', 'Inventario', 'Precios', 'Promociones', 'E-commerce', 'Tiendas', 'Distribución', 'Postventa'],
    casos: [
      'Copiloto de reunión comercial.',
      'Agente de excepción de pedido.',
      'Asistente de catálogo y fichas.',
      'Copiloto de trade marketing.',
      'Asistente de políticas de devolución.',
      'Asistente de conocimiento para tienda.',
    ],
    capacidades: [
      ['Priorizar el ciclo con mayor valor', 'Comparar oportunidades entre comercial, catálogo, pedido, atención, contenido y tienda.', 'BECOME DISCOVER™'],
      ['Diseñar copilotos de decisión comercial', 'Consolidar señales de venta, stock, precio y contexto en una misma preparación para revisión humana.', 'Decision intelligence'],
      ['Construir operaciones de contenido', 'Sistemas que generan y adaptan fichas y piezas dentro de reglas de marca, producto y aprobación.', 'BECOME EMBED™'],
      ['Construir agentes de atención y excepción', 'Agentes acotados para pedidos, delivery, retiro, devoluciones y consultas, con escalamiento.', 'BECOME EMBED™'],
      ['Desarrollar a Marketing, Comercial y CX', 'Programas aplicados a materiales, decisiones y procesos reales.', 'BECOME NOW™'],
      ['Medir', 'Tiempo hasta el mercado, resolución, retrabajo, consistencia, incidencias y adopción.', ''],
    ],
    tecnologiaTitular: 'La IA puede multiplicar producción; las reglas y aprobaciones deciden qué puede publicarse o ejecutarse.',
    tecnologia: 'LLMs, catálogo estructurado, RAG sobre políticas, APIs, reglas de marca, revisión humana y logs.',
    metricasTitular: 'Qué medimos.',
    metricas: [
      ['Tiempo de publicación', ''],
      ['Aprobación a la primera', ''],
      ['Disponibilidad y excepciones', ''],
      ['Tiempo de preparación comercial', ''],
      ['Primera respuesta', ''],
      ['Resolución', ''],
      ['Incidencias por pedido', ''],
      ['Consistencia de marca', ''],
      ['Adopción', ''],
    ],
    empezarTitular: 'Cómo empezar.',
    empezar: [
      'BECOME NOW™ si el reto está en cómo trabaja el equipo.',
      'BECOME DISCOVER™ si todavía hay que decidir dónde invertir.',
      'BECOME EMBED™ si ya existe un proceso priorizado que debe llegar a operación.',
    ],
    cierre: 'Empieza por el ciclo comercial u operativo que se repite todas las semanas.',
    cierreTexto: 'Surtido, stock, catálogo, pedidos o postventa: elige uno donde velocidad y calidad puedan medirse juntas.',
  },

  'turismo-hoteleria': {
    nombre: 'Turismo y hotelería',
    menu: 'Reservas, revenue, atención al huésped, operación hotelera, eventos, reputación y fidelización.',
    h1: 'La experiencia se gana o se pierde en cientos de momentos pequeños.',
    lead: 'Una reserva, una modificación, un check-in, una solicitud, una incidencia o una reseña ocurren mientras la operación sigue corriendo. BECOME conecta reservas, revenue, atención, conocimiento y operación hotelera para responder más rápido sin perder el estándar de servicio.',
    contexto: [
      'La experiencia depende de que el equipo tenga el contexto correcto en el momento correcto: disponibilidad, tarifa, política, reserva, preferencias, solicitudes, beneficios y pendientes.',
      'La IA funciona cuando acerca ese contexto al servicio y reduce la búsqueda entre áreas, sin convertir una excepción en una decisión automática.',
    ],
    oportunidadesTitular: 'Dónde vemos oportunidad.',
    oportunidades: [
      ['Reservas y conversión', 'Responder sobre disponibilidad, servicios, condiciones y políticas, y preparar oportunidades de venta adicional y cruzada.'],
      ['Revenue management', 'Preparar ocupación, tarifa, demanda, eventos y antecedentes para revisión del equipo de revenue.'],
      ['Antes de la llegada', 'Consolidar reserva, preferencias, requerimientos y pendientes antes de la llegada del huésped.'],
      ['Check-in y check-out', 'Dar al equipo contexto sobre reserva, beneficios, pagos y solicitudes.'],
      ['Atención al huésped', 'Recuperar servicios, políticas, solicitudes e historial relevante para responder.'],
      ['Housekeeping y mantenimiento', 'Ordenar solicitudes, incidencias y pendientes entre áreas.'],
      ['Cambios, cancelaciones y no-show', 'Reunir reserva, tarifa, condición e historial antes de que una persona resuelva una excepción.'],
      ['Reclamos y recuperación de servicio', 'Clasificar el caso, recuperar antecedentes y preparar respuesta o compensación para decisión humana.'],
      ['Reputación', 'Agrupar reseñas, encuestas y comentarios por hotel, servicio o temporada.'],
      ['Ventas corporativas, grupos y eventos', 'Preparar propuestas, requerimientos, salones, capacidades, catering, tarifas y seguimiento.'],
      ['Fidelización', 'Recuperar nivel, beneficios, estadías e información relevante del programa.'],
    ],
    workflowsTitular: 'Los procesos donde empieza el trabajo.',
    workflows: ['Reservas', 'Revenue', 'Atención al huésped', 'Operación hotelera', 'Eventos', 'Reputación', 'Fidelización'],
    casos: [
      'Asistente de reservas.',
      'Copiloto de preparación de llegada.',
      'Agente de incidencias.',
      'Asistente de grupos y eventos.',
      'Copiloto de reputación.',
      'Asistente de conocimiento para recepción.',
    ],
    capacidades: [
      ['Agentes y copilotos de reservas', 'Disponibilidad, políticas, servicios y escalamiento.', 'BECOME EMBED™'],
      ['Asistente de conocimiento de operación', 'Procedimientos y estándares por rol.', 'Knowledge intelligence'],
      ['Preparación de revenue', 'Síntesis de señales para decisión del responsable.', 'Decision intelligence'],
      ['Coordinación de incidencias', 'Contexto común entre recepción, housekeeping y mantenimiento.', 'BECOME EMBED™'],
      ['Copiloto de grupos y eventos', 'Requerimientos, propuestas y pendientes.', 'BECOME EMBED™'],
      ['Inteligencia sobre la voz del huésped', 'Sintetizar reseñas y encuestas.', 'Knowledge intelligence'],
      ['Desarrollar a los equipos', 'Atención, operaciones, revenue, comercial y marketing.', 'BECOME NOW™'],
    ],
    tecnologiaTitular: 'La IA acerca el contexto al servicio. La excepción sigue siendo una decisión de una persona.',
    tecnologia: 'Según el caso: RAG sobre políticas y procedimientos, agentes acotados de reserva y atención, APIs a los sistemas de reserva y operación autorizados, permisos, trazabilidad, revisión humana y reglas de escalamiento.',
    metricasTitular: 'Qué medimos.',
    metricas: [
      ['Primera respuesta', ''],
      ['Tiempo de resolución', ''],
      ['Escalamientos', ''],
      ['Consistencia entre turnos', ''],
      ['Conversión de consultas', ''],
      ['Tiempo de cotización', ''],
      ['Incidencias', ''],
      ['Satisfacción', ''],
      ['Tiempo administrativo recuperado', ''],
    ],
    empezarTitular: 'Cómo empezar.',
    empezar: [
      'BECOME NOW™ si el reto está en cómo trabaja el equipo.',
      'BECOME DISCOVER™ si todavía hay que decidir dónde invertir.',
      'BECOME EMBED™ si ya existe un proceso priorizado que debe llegar a operación.',
    ],
    cierre: 'Empieza por el momento donde el huésped espera y el equipo necesita contexto.',
    cierreTexto: 'Cuéntanos qué decisión, proceso o experiencia necesita cambiar. Te ayudaremos a identificar el punto de partida más adecuado.',
  },

  'inmobiliario-construccion': {
    nombre: 'Inmobiliario y construcción',
    menu: 'Terrenos, proyectos, ventas, contratos, obra, valorizaciones, entrega y postventa.',
    h1: 'Un proyecto cambia todos los días. La información también.',
    lead: 'Comercial, legal, ingeniería, obra, proveedores, supervisión y cliente trabajan sobre documentos, versiones, compromisos y fechas que cambian durante todo el proyecto. La IA aporta donde una decisión depende de encontrar la versión correcta, identificar un pendiente o reunir antecedentes antes de que se conviertan en demora.',
    contexto: [
      'Inmobiliario: terrenos, factibilidad, producto, inventario comercial, leads, separación, financiamiento, minuta, entrega y postventa.',
      'Construcción: planeamiento, producción, BIM, consultas técnicas, metrados, valorizaciones, administración contractual, cambios, procura y cierre.',
    ],
    oportunidadesTitular: 'Dónde vemos oportunidad.',
    oportunidades: [
      ['Terrenos y factibilidad', 'Ordenar antecedentes, parámetros, restricciones, documentos y supuestos para preparar evaluación.'],
      ['Producto e inventario comercial', 'Consultar unidades, precio, disponibilidad, características, estacionamientos, acabados y promociones.'],
      ['Leads y seguimiento', 'Resumir interacciones, identificar intención y preparar la siguiente acción.'],
      ['Separación y cierre', 'Dar visibilidad al paso entre separación, cuota inicial, carta de aprobación, minuta y coordinación con el banco.'],
      ['Entrega', 'Ordenar citas, documentación, pendientes y evidencias.'],
      ['Postventa', 'Clasificar observaciones, recuperar antecedentes de proyecto y unidad, y dar seguimiento al responsable.'],
      ['Planeamiento y producción', 'Preparar avance, restricciones, frentes, compromisos y desviaciones para reuniones de producción.'],
      ['BIM', 'Facilitar consulta y trazabilidad entre modelos, planos, documentos y cambios.'],
      ['RFIs y consultas técnicas', 'Recuperar especificaciones, planos, antecedentes y respuestas previas antes de preparar una consulta o una respuesta.'],
      ['Metrados', 'Organizar sustento, versiones y trazabilidad.'],
      ['Valorizaciones', 'Preparar avance, metrados, sustento, observaciones y pendientes para revisión.'],
      ['Administración contractual', 'Encontrar obligaciones, comunicaciones, hitos, plazos y precedentes.'],
      ['Cambios y adicionales', 'Comparar versiones, identificar impacto documental y preparar expediente de sustento.'],
      ['Subcontratos y procura', 'Comparar propuestas, entregables, obligaciones, requisitos y cumplimiento.'],
      ['Cierre de obra', 'Ordenar listas de pendientes, dossiers, planos as-built, manuales, garantías y evidencias.'],
    ],
    workflowsTitular: 'Los procesos donde empieza el trabajo.',
    workflows: ['Terrenos', 'Proyectos', 'Ventas', 'Contratos', 'Obra', 'Valorizaciones', 'Entrega', 'Postventa'],
    casos: [
      'Copiloto comercial inmobiliario.',
      'Agente de expediente de venta.',
      'Asistente de RFI.',
      'Asistente de valorización.',
      'Agente de postventa.',
      'Asistente de conocimiento de proyecto.',
      'Asistente contractual.',
    ],
    capacidades: [
      ['Copiloto comercial con inventario y documentación aprobada', 'Consulta de unidades, precios, disponibilidad y condiciones sobre información vigente.', 'BECOME EMBED™'],
      ['Agente de expediente de venta', 'Seguimiento del paso de lead a separación y a minuta, con los pendientes a la vista.', 'BECOME EMBED™'],
      ['Asistente de RFI e inteligencia contractual', 'Recuperar especificaciones, antecedentes, obligaciones y correspondencia antes de responder.', 'Knowledge intelligence'],
      ['Asistente de metrados y valorizaciones', 'Preparar avance, sustento, observaciones y pendientes para revisión.', 'BECOME EMBED™'],
      ['Desarrollar a los equipos', 'Programas aplicados para Finanzas Inmobiliarias, Ventas, Marketing, CX, PMO, Legal, Operaciones y Supply Chain.', 'BECOME NOW™'],
      ['Priorizar e incorporar', 'DISCOVER™ prioriza dónde está el valor; EMBED™ incorpora la capacidad a CRM, ERP, gestión documental u otros sistemas autorizados.', 'BECOME DISCOVER™'],
    ],
    tecnologiaTitular: 'La IA puede comparar y preparar. La conclusión técnica, legal o comercial mantiene responsable.',
    tecnologia: 'Extracción documental, comparación de versiones, RAG, búsqueda empresarial, APIs, permisos, trazabilidad y revisión humana.',
    metricasTitular: 'Qué medimos.',
    metricas: [
      ['Tiempo de respuesta comercial', ''],
      ['De lead a separación', ''],
      ['De separación a minuta', ''],
      ['Pendientes por expediente', ''],
      ['Tiempo de entrega y postventa', ''],
      ['Tiempo de respuesta de RFI', ''],
      ['Ciclo de valorización', ''],
      ['Tiempo de revisión contractual', ''],
      ['Cierre de cambios', ''],
      ['Retrabajo por versión', ''],
      ['Tiempo de búsqueda de información', ''],
    ],
    empezarTitular: 'Cómo empezar.',
    empezar: [
      'BECOME NOW™ si el reto está en cómo trabaja el equipo.',
      'BECOME DISCOVER™ si todavía hay que decidir dónde invertir.',
      'BECOME EMBED™ si ya existe un proceso priorizado que debe llegar a operación.',
    ],
    cierre: 'Empieza por el punto del proyecto donde una versión, un pendiente o una aprobación puede convertirse en demora.',
    cierreTexto: 'Cuéntanos qué decisión, proceso o experiencia necesita cambiar. Te ayudaremos a identificar el punto de partida más adecuado.',
  },

  'salud-farmaceutica': {
    nombre: 'Salud y farmacéutica',
    menu: 'Citas, admisión, autorizaciones, facturación, abastecimiento, documentación y operaciones no clínicas.',
    h1: 'Antes y alrededor de la atención hay una operación enorme que también puede mejorar.',
    lead: 'Clínicas, redes de salud, aseguradoras y farmacéuticas gestionan citas, admisión, autorizaciones, facturación, reembolsos, abastecimiento, documentación y conocimiento interno. BECOME aplica IA en esos procesos para recuperar tiempo y mejorar consistencia sin entrar en diagnóstico, tratamiento ni decisión clínica.',
    contexto: [
      'El trabajo empieza en el trámite, no en la consulta: lo que ocurre antes y alrededor de la atención es donde se pierde tiempo administrativo.',
      'Cuando un proceso se acerca a una decisión clínica, el límite se define antes de construir y la decisión permanece en el profesional responsable.',
    ],
    limite: {
      titulo: 'Dónde no intervenimos.',
      texto: 'BECOME no desarrolla ni valida capacidades de diagnóstico, tratamiento, triaje clínico, interpretación de estudios, recomendación médica ni sustitución del criterio del profesional de salud.',
    },
    oportunidadesTitular: 'Dónde vemos oportunidad.',
    oportunidades: [
      ['Citas y reprogramaciones', 'Asistir disponibilidad, requisitos, recordatorios y cambios de cita.'],
      ['Admisión', 'Preparar información y documentación administrativa antes del registro.'],
      ['Autorizaciones y cartas de garantía', 'Reunir documentación, validar completitud y preparar el caso para revisión.'],
      ['Facturación y conciliación', 'Comparar prestaciones, cobertura, documentos y diferencias para acelerar revisión administrativa.'],
      ['Reembolsos', 'Verificar requisitos, ordenar expedientes y preparar observaciones antes de revisión.'],
      ['Atención administrativa', 'Resolver consultas sobre citas, horarios, cobertura, documentación y estado de trámites dentro de un alcance explícito.'],
      ['Abastecimiento', 'Preparar comparativos, información de proveedores, disponibilidad y excepciones.'],
      ['Gestión documental', 'Clasificar, extraer y recuperar documentos administrativos y operativos.'],
      ['Conocimiento interno', 'Permitir que los equipos consulten políticas, procedimientos y manuales con fuente visible.'],
      ['Farmacéutica', 'Apoyar procesos corporativos, comerciales y documentales usando información aprobada por las áreas responsables.'],
    ],
    workflowsTitular: 'Los procesos donde empieza el trabajo.',
    workflows: ['Citas', 'Admisión', 'Autorizaciones', 'Facturación', 'Abastecimiento', 'Documentación', 'Operaciones no clínicas'],
    casos: [
      'Asistente de citas y reprogramaciones.',
      'Agente de completitud de autorización.',
      'Asistente de carta de garantía.',
      'Asistente de reembolso.',
      'Copiloto de facturación administrativa.',
      'Asistente de conocimiento de procedimientos.',
      'Asistente de abastecimiento.',
    ],
    capacidades: [
      ['Encontrar un proceso administrativo medible', 'Priorizar trámites por volumen, tiempo, retrabajo, riesgo y viabilidad.', 'BECOME DISCOVER™'],
      ['Diseñar asistentes con límites claros', 'RAG, extracción documental y asistentes que saben cuándo escalar.', 'Decision intelligence'],
      ['Implementar procesos administrativos asistidos', 'Integrar una capacidad priorizada a fuentes y sistemas autorizados.', 'BECOME EMBED™'],
      ['Desarrollar capacidades', 'Trabajo con Operaciones, Recursos Humanos, Compras, Finanzas, Legal, Marketing y otras áreas corporativas.', 'BECOME NOW™'],
      ['Diseñar privacidad y trazabilidad', 'Definir fuentes, permisos, tratamiento de datos, logs, escalamiento y revisión humana antes de operar.', ''],
    ],
    tecnologiaTitular: 'El alcance se define antes de construir, y la decisión clínica nunca entra en él.',
    tecnologia: 'Según el caso: RAG sobre políticas y procedimientos, extracción documental, asistentes acotados con reglas de escalamiento, APIs a sistemas autorizados, permisos, tratamiento de datos, logs y revisión humana.',
    metricasTitular: 'Qué medimos.',
    metricas: [
      ['Tiempo de trámite', ''],
      ['Expedientes completos', ''],
      ['Retrabajo administrativo', ''],
      ['Tiempo de respuesta', ''],
      ['Escalamientos', ''],
      ['Horas administrativas recuperadas', ''],
      ['Consistencia', ''],
      ['Adopción', ''],
      ['Cumplimiento del alcance', ''],
    ],
    empezarTitular: 'Cómo empezar.',
    empezar: [
      'BECOME NOW™ si el reto está en cómo trabaja el equipo.',
      'BECOME DISCOVER™ si todavía hay que decidir dónde invertir.',
      'BECOME EMBED™ si ya existe un proceso priorizado que debe llegar a operación.',
    ],
    cierre: 'Empieza por el trámite que consume tiempo sin formar parte de la decisión clínica.',
    cierreTexto: 'Cuéntanos qué decisión, proceso o experiencia necesita cambiar. Te ayudaremos a identificar el punto de partida más adecuado.',
  },
};

/* ---- Aplicar ------------------------------------------------------------ */

const datos = JSON.parse(readFileSync(RUTA, 'utf8'));
let campos = 0;
const informe = [];

for (const industria of datos) {
  const slug = industria.slug?.es;
  const nuevo = COPY[slug];
  if (!nuevo) { console.error(`::error::No hay copy 08 para ${slug}`); process.exit(1); }

  const antes = industria.es;
  /* Solo los campos que el documento fija. Lo que no nombra —el slug, el
     icono, los enlaces cruzados, el SEO— se queda como está: el documento 08
     es copy, y sobrescribir con él lo que no es copy sería usarlo para algo
     que no dice. */
  for (const [k, v] of Object.entries(nuevo)) {
    const cambio = JSON.stringify(antes[k]) !== JSON.stringify(v);
    if (cambio) campos += 1;
    antes[k] = v;
  }
  /* Métricas: donde el documento repite una que ya existía con su explicación
     aprobada, se recupera esa explicación. Donde la métrica es nueva, la
     segunda columna queda vacía en vez de inventada. */
  informe.push(`  ${slug}: ${nuevo.oportunidades.length} oportunidades · ${nuevo.capacidades.length} capacidades · ${nuevo.casos.length} escenarios · ${nuevo.metricas.length} métricas`);
}

writeFileSync(RUTA, `${JSON.stringify(datos, null, 2)}\n`);
console.log(`Copy 08 aplicado al español de las 6 industrias · ${campos} campos cambiados`);
for (const l of informe) console.log(l);
