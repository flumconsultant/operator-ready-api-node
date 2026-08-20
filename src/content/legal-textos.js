import { IDENTIDAD as I, AUTORIDAD, PROVEEDORES, ALMACENAMIENTO } from './legal.js';

/**
 * El texto de las tres páginas legales, en los dos idiomas.
 *
 * Va como datos y no como JSX por el mismo motivo que los artículos: el
 * contenido legal se revisa, se corrige y se versiona, y hacerlo dentro de un
 * componente convierte cada corrección de una coma en un cambio de código.
 *
 * Los datos de identidad se interpolan desde legal.js. Escribir «FLUM E.I.R.L.»
 * a mano en cuarenta sitios garantiza que el día que cambie uno se quede sin
 * cambiar, y en un documento legal eso es una contradicción entre páginas.
 *
 * Vocabulario de bloques: h (subtítulo), p (párrafo), ul (lista), tabla.
 */

const p = (...t) => t.map((texto) => ({ tipo: 'p', texto }));
const h = (texto) => ({ tipo: 'h', texto });
const ul = (...items) => ({ tipo: 'ul', items });

const filaAlmacenamiento = (lang) => ({
  tipo: 'tabla',
  cabecera: lang === 'es'
    ? ['Nombre', 'Tipo', 'Categoría', 'Para qué', 'Duración']
    : ['Name', 'Type', 'Category', 'Purpose', 'Duration'],
  filas: ALMACENAMIENTO.map((a) => [a.nombre, a.tipo[lang], a.categoria[lang], a.finalidad[lang], a.duracion[lang]]),
});

const filaProveedores = (lang) => ({
  tipo: 'tabla',
  cabecera: lang === 'es'
    ? ['Proveedor', 'Para qué', 'Qué datos', 'País']
    : ['Provider', 'Purpose', 'What data', 'Country'],
  /* El nombre legal completo y no la marca: en un contrato de encargo de
     tratamiento, «Hostinger» no identifica a nadie ante la autoridad. */
  filas: PROVEEDORES.map((x) => [x.razonSocial || x.nombre, x.funcion[lang], x.datos[lang], x.pais[lang]]),
});

/* ------------------------------------------------------------- español */

const TERMINOS_ES = [
  h('Quién opera este sitio'),
  ...p(
    `El sitio ${I.dominio} se opera bajo la marca ${I.marca} por ${I.razonSocial}, con RUC ${I.ruc} y domicilio en ${I.domicilio}.`,
    `Para consultas sobre estos Términos: ${I.correoLegal}.`,
  ),

  h('Qué regulan estos Términos'),
  ...p(
    'Regulan el acceso y uso de este sitio: sus páginas, contenidos, formularios, artículos y materiales descargables.',
    'El sitio está dirigido a profesionales y responsables de empresa interesados en transformación AI-native, desarrollo de capacidades, estrategia, operaciones, datos y agentes de IA.',
    'Usar el sitio supone conocer estos Términos. Si no estás de acuerdo, no lo uses. Las normas imperativas que correspondan prevalecen sobre cualquier disposición incompatible.',
  ),

  h('El contenido es informativo'),
  ...p('Lo que se publica aquí tiene fines informativos, educativos y comerciales generales. Por sí solo no es:'),
  ul(
    'Una oferta contractual vinculante.',
    'Una cotización definitiva.',
    'Una garantía de resultados.',
    'Asesoría legal, tributaria, contable, financiera, de inversión o de ciberseguridad.',
    'Una recomendación para tomar decisiones críticas sin revisión profesional.',
  ),
  ...p('Los servicios se rigen por la propuesta, contrato u orden de servicio aceptada por las partes. Si hay contradicción, manda el documento contractual, no el sitio.'),

  h('Qué puedes hacer'),
  ul(
    'Navegar por el sitio.',
    'Consultar y compartir enlaces a contenidos públicos.',
    'Descargar materiales cuando esa opción esté habilitada.',
    'Escribirnos para pedir información o explorar una posible relación comercial.',
  ),

  h('Qué no está permitido'),
  ul(
    'Acceder o intentar acceder sin autorización a sistemas, cuentas, bases de datos o infraestructura.',
    'Interferir con la seguridad, disponibilidad o funcionamiento del sitio.',
    'Introducir código malicioso o mecanismos automatizados abusivos.',
    'Extraer contenidos a escala mediante scraping cuando infrinja la ley, estos Términos o derechos de terceros.',
    'Suplantar identidades o dar información deliberadamente falsa.',
    'Usar el sitio para comunicaciones ilícitas, engañosas o no solicitadas.',
    'Copiar, modificar, vender o explotar los contenidos fuera de los usos permitidos.',
    `Usar las marcas o materiales de ${I.marca} para aparentar una relación, certificación o autorización que no existe.`,
  ),

  h('Propiedad intelectual'),
  ...p(
    `Salvo indicación contraria, el diseño, los textos, los diagramas, las metodologías, los frameworks, las marcas y los demás contenidos del sitio pertenecen a ${I.razonSocial} o se usan con autorización.`,
    'BECOME NOW™, BECOME DISCOVER™, BECOME EMBED™, el framework BECOME y sus elementos distintivos no pueden reproducirse, adaptarse, comercializarse ni presentarse como propios sin autorización previa y escrita.',
    'Consultar o descargar un material no transfiere derechos de propiedad intelectual: concede un uso personal o interno, no exclusivo, no transferible y revocable, salvo que el material indique otra licencia.',
  ),

  h('Marcas y plataformas de terceros'),
  ...p('ChatGPT, Claude, Gemini y las demás plataformas mencionadas pertenecen a sus titulares. Mencionarlas no implica afiliación, patrocinio ni certificación, no nos convierte en sus representantes y no modifica sus términos. Su disponibilidad, funciones, precios y políticas cambian sin que intervengamos.'),

  h('Contenido sobre inteligencia artificial'),
  ...p('Los sistemas de IA pueden producir resultados incompletos, incorrectos, desactualizados o inadecuados para un contexto concreto. Antes de usar IA en una decisión, un proceso o un producto, conviene evaluar:'),
  ul(
    'Calidad y autorización de los datos.',
    'Seguridad y privacidad.',
    'Propiedad intelectual.',
    'Evaluación de resultados.',
    'Supervisión humana.',
    'Trazabilidad.',
    'Cumplimiento regulatorio.',
    'Responsabilidad operativa.',
  ),
  ...p('Ningún contenido de este sitio sustituye el análisis del caso concreto y su perfil de riesgo.'),

  h('Lo que nos envías'),
  ...p('Al usar el formulario declaras que la información es exacta en lo sustancial, que puede usarse para responderte y evaluar una posible relación comercial, y que no vulnera derechos de terceros.'),
  ...p('El formulario público no debe usarse para enviar:'),
  ul(
    'Datos personales sensibles.',
    'Credenciales o contraseñas.',
    'Secretos empresariales.',
    'Información protegida por acuerdos de confidencialidad.',
    'Datos de clientes, trabajadores o terceros sin autorización.',
    'Información regulada que exija un canal seguro específico.',
  ),
  ...p('Si hace falta compartir información confidencial, acordamos antes el canal, los controles y, cuando corresponda, un acuerdo de confidencialidad.'),

  h('Enlaces externos'),
  ...p('El sitio puede enlazar a páginas de terceros. No controlamos sus contenidos, disponibilidad, seguridad ni prácticas de privacidad. Un enlace no es una recomendación ni una garantía, salvo que se diga expresamente.'),

  h('Disponibilidad'),
  ...p('Procuramos mantener el sitio disponible y razonablemente seguro, pero no garantizamos un funcionamiento permanente, ininterrumpido o libre de errores. Puede suspenderse por mantenimiento, actualización, seguridad, fallas de proveedores o fuerza mayor.'),

  h('Responsabilidad'),
  ...p('Dentro de los límites que permite la ley, no respondemos por decisiones tomadas exclusivamente a partir de información general del sitio, ni por daños derivados de un uso contrario a estos Términos, de confiar en contenidos sin validación profesional, de fallas de servicios de terceros, de eventos fuera de nuestro control razonable o de información incorrecta que nos hayas dado.'),
  ...p('Nada de lo anterior excluye responsabilidades que no puedan limitarse legalmente ni derechos obligatorios que te correspondan.'),

  h('Privacidad y cookies'),
  ...p('El tratamiento de datos personales se rige por la Política de privacidad y la Política de cookies publicadas en este sitio.'),

  h('Modificaciones'),
  ...p('Podemos actualizar estos Términos por cambios legales, operativos o de servicio. La versión vigente indica su fecha de última actualización, y cuando un cambio sea material procuraremos comunicarlo en el sitio.'),

  h('Ley aplicable y jurisdicción'),
  ...p(
    'Estos Términos se interpretan conforme a la legislación peruana, sin limitar derechos obligatorios que puedan corresponder bajo otra normativa aplicable.',
    'Procuraremos resolver de buena fe cualquier controversia. Si no fuera posible, las partes se someten a los jueces y tribunales de Lima, Perú, salvo que una norma imperativa disponga otra competencia.',
  ),

  h('Contacto'),
  ul(`Correo: ${I.correoLegal}`, `Domicilio: ${I.domicilio}`),
];

const PRIVACIDAD_ES = [
  h('Quién es responsable'),
  ...p(
    `${I.razonSocial}, con RUC ${I.ruc} y domicilio en ${I.domicilio}, titular de la marca ${I.marca}, es responsable del tratamiento de los datos personales descritos aquí.`,
    `Contacto para privacidad y derechos ARCO: ${I.correoPrivacidad}.`,
    `Banco de datos personales: «${I.bancoDatos}», inscrito ante el Registro Nacional de Protección de Datos Personales con código ${I.bancoDatosCodigo}, según constancia ${I.bancoDatosConstancia} de fecha ${I.bancoDatosFecha}.`,
  ),

  h('A qué se aplica'),
  ...p('A los datos personales que recibimos a través de:'),
  ul(
    `${I.dominio} y sus páginas.`,
    'El formulario de contacto.',
    'La suscripción a los artículos.',
    'Reuniones y comunicaciones comerciales.',
    'Interacciones profesionales relacionadas con BECOME.',
  ),

  h('Qué datos recogemos'),
  ...p('Según la interacción:'),
  ul(
    'Identificación y contacto: nombre, correo corporativo, teléfono si lo das, país o ciudad.',
    'Datos profesionales: empresa, cargo, área, industria.',
    'La consulta: objetivo o necesidad, etapa de la iniciativa, horizonte de tiempo, preferencia de servicio y lo que incluyas voluntariamente en tu mensaje.',
    'Datos técnicos: dirección IP y momento del envío, registrados por el servidor para limitar abuso del formulario.',
    'Comunicaciones: correos, respuestas y preferencias de suscripción.',
  ),
  ...p('No pedimos datos sensibles a través del formulario público. Este sitio no usa analítica ni herramientas de seguimiento, así que no construimos perfiles de navegación.'),

  h('De dónde vienen'),
  ...p('Directamente de ti o de un representante autorizado de tu empresa. No usamos bases de datos compradas, extraídas ni cedidas.'),

  h('Para qué los usamos y cuánto los guardamos'),
  {
    tipo: 'tabla',
    cabecera: ['Finalidad', 'Base', 'Conservación'],
    filas: [
      ['Responder tu consulta y recomendarte un punto de partida', 'Tu consentimiento y las actuaciones previas al contrato que tú pides', 'Hasta 24 meses desde la última interacción, salvo relación contractual o solicitud de supresión'],
      ['Preparar reuniones, propuestas y el seguimiento que pides', 'Tu consentimiento y las actuaciones previas al contrato', 'Hasta 24 meses desde la última interacción o mientras dure la negociación'],
      ['Prestar los servicios contratados', 'Ejecución del contrato y obligaciones legales', 'Durante la relación y los plazos legales aplicables'],
      ['Enviarte los artículos que pediste recibir', 'Tu consentimiento, confirmado por correo', 'Hasta que te des de baja o tras 24 meses de inactividad, lo que ocurra primero'],
      ['Evitar abuso del formulario y de la suscripción', 'Protección de los sistemas', 'Hasta 12 meses'],
      ['Atender derechos, reclamos y obligaciones regulatorias', 'Obligación legal', 'Durante el procedimiento y el plazo necesario para acreditar cumplimiento'],
    ],
  },
  ...p('Cumplida la finalidad, los datos se eliminan, se anonimizan o se bloquean cuando exista obligación de conservarlos.'),

  h('Los correos que enviamos'),
  ...p(
    'Solo enviamos los artículos a quien lo pidió y además confirmó su dirección pulsando un enlace. Ese doble paso existe para que nadie pueda suscribir el correo de otra persona.',
    'El consentimiento es libre, previo, expreso e informado, se pide por separado de la atención de tu consulta, nunca va premarcado y puedes retirarlo cuando quieras desde el enlace de baja que lleva cada correo.',
    'Retirar ese consentimiento no afecta la respuesta a una consulta ni una relación contractual.',
  ),

  h('Con quién compartimos'),
  ...p('Usamos estos proveedores, y solo estos:'),
  filaProveedores('es'),
  ...p('Deben tratar los datos únicamente según nuestras instrucciones, con medidas de seguridad y confidencialidad adecuadas.'),
  ...p('Los datos también podrían comunicarse a autoridades competentes ante un requerimiento válido, o en una reorganización societaria bajo obligaciones de confidencialidad y continuidad de protección.'),
  ...p('No vendemos datos personales.'),

  h('Transferencias internacionales'),
  ...p(
    `Sí hay transferencia internacional, y conviene decirlo con claridad. Los datos que envías por el formulario y tu dirección de suscripción se alojan en la infraestructura de Hostinger International, Ltd., en servidores ubicados principalmente en Estados Unidos, incluido el estado de Arizona, así como en otros países donde Hostinger o sus proveedores de infraestructura operen.`,
    `Hostinger actúa como encargado del tratamiento: aloja los datos y los trata únicamente conforme a nuestras instrucciones. ${I.razonSocial} sigue siendo el responsable, es decir, quien determina para qué y cómo se tratan.`,
    'La transferencia se ampara en que es necesaria para ejecutar la relación que has iniciado —responder a tu consulta o enviarte los artículos— y el proveedor mantiene obligaciones contractuales de seguridad y confidencialidad. Puedes oponerte, y en ese caso dejaremos de tratar tus datos por completo, porque sin alojamiento no hay forma de conservarlos.',
    'GitHub, Inc., en Estados Unidos, aloja el código y los contenidos publicados del sitio. No recibe datos personales de visitantes.',
  ),

  h('Decisiones automatizadas'),
  ...p('No tomamos decisiones con efectos jurídicos o equivalentes sobre una persona basándonos únicamente en un tratamiento automatizado. Usamos herramientas de IA para preparar contenido, pero la recomendación comercial y las decisiones relevantes las toma una persona.'),

  h('Seguridad'),
  ...p('Aplicamos medidas proporcionales al riesgo:'),
  ul(
    'Cifrado en tránsito (HTTPS) en todo el sitio.',
    'Control de accesos y privilegios mínimos en el panel de administración.',
    'Contraseñas guardadas como hash, nunca en texto legible.',
    'Límite de intentos en los formularios y en el acceso al panel.',
    'Registro de envíos y de fallos para poder investigar un incidente.',
    'Copias de seguridad de los contenidos.',
  ),
  ...p('Ningún sistema es infalible. Ante un incidente que deba notificarse, aplicaremos nuestro procedimiento de respuesta, haremos las comunicaciones regulatorias en el plazo exigible y avisaremos a las personas afectadas cuando corresponda.'),

  h('Tus derechos'),
  ...p('Puedes pedir información sobre el tratamiento, acceso a tus datos, rectificación o actualización, cancelación o supresión, oposición al tratamiento y retiro del consentimiento.'),
  ...p(`Escribe a ${I.correoPrivacidad} con el asunto «Derechos de datos personales» e indica:`),
  ul(
    'Nombre completo.',
    'Qué derecho ejerces.',
    'Descripción clara de tu solicitud.',
    'Cómo quieres recibir la respuesta.',
    'Información razonable para verificar tu identidad.',
    'Poder de representación, si actúas por otra persona.',
  ),
  ...p('Plazos de referencia: hasta 20 días hábiles para el acceso; hasta 10 días hábiles para rectificación, cancelación u oposición.'),
  ...p(`Si consideras que tu solicitud no fue atendida, puedes acudir a la ${AUTORIDAD.es}.`),

  h('Menores y datos sensibles'),
  ...p('Este sitio no está dirigido a menores de edad y no recogemos sus datos intencionadamente. Tampoco pedimos datos sensibles; si los envías sin que se te pidan, evaluaremos su eliminación.'),

  h('Cambios'),
  ...p('Podemos actualizar esta Política por cambios regulatorios, tecnológicos u operativos. La versión vigente muestra su fecha. Si el cambio afecta materialmente las finalidades o tus derechos, lo comunicaremos y, cuando corresponda, pediremos un nuevo consentimiento.'),

  h('Contacto'),
  ul(
    `Responsable: ${I.razonSocial}`,
    `Privacidad y derechos ARCO: ${I.correoPrivacidad}`,
    `Domicilio: ${I.domicilio}`,
    `Autoridad de control: ${AUTORIDAD.es}`,
  ),
];

const COOKIES_ES = [
  h('La versión corta'),
  ...p(
    'Este sitio no usa analítica, ni píxeles publicitarios, ni scripts de terceros. No hay cookies de marketing, no medimos tu navegación y no compartimos tu comportamiento con nadie.',
    'Por eso no verás un aviso pidiéndote permiso: no hay nada opcional que activar. Un banner que pide permiso para cookies que no existen no protege a nadie, solo entrena a la gente a aceptar sin leer.',
  ),

  h('Qué guardamos y por qué'),
  ...p('Lo único que este sitio guarda en tu navegador es lo que hace falta para que funcione lo que has pedido:'),
  filaAlmacenamiento('es'),

  h('Cómo borrarlo'),
  ...p('Todo lo anterior se borra desde los ajustes de tu navegador, en la opción de eliminar datos de sitios. No hace falta pedírnoslo ni esperar respuesta. Borrarlo no rompe nada: como mucho perderás un borrador del formulario a medio escribir.'),

  h('Si esto cambia'),
  ...p('Si algún día añadimos analítica o cualquier tecnología no esencial, esta página lo dirá antes de activarla y aparecerá un panel para aceptarla, rechazarla o configurarla por categorías, con las opciones igual de visibles. Hasta entonces, no hay nada que configurar.'),
];

/* -------------------------------------------------------------- english */

const TERMINOS_EN = [
  h('Who operates this website'),
  ...p(
    `${I.dominio} is operated under the ${I.marca} brand by ${I.razonSocial}, tax ID (RUC) ${I.ruc}, registered at ${I.domicilio}.`,
    `Questions about these Terms: ${I.correoLegal}.`,
  ),

  h('What these Terms cover'),
  ...p(
    'They govern access to and use of this website: its pages, content, forms, articles and downloadable materials.',
    'The site is intended for business professionals interested in AI-native transformation, capability building, strategy, operations, data and AI agents.',
    'Using the site means you are aware of these Terms. If you disagree, do not use it. Mandatory legal rules prevail over any incompatible provision.',
  ),

  h('The content is informational'),
  ...p('What we publish here is for general informational, educational and commercial purposes. On its own it is not:'),
  ul(
    'A binding offer.',
    'A final quotation.',
    'A guarantee of results.',
    'Legal, tax, accounting, financial, investment or cybersecurity advice.',
    'A recommendation to make a critical decision without professional review.',
  ),
  ...p('Services are governed by the proposal, contract or statement of work accepted by both parties. In case of conflict, that document prevails over the website.'),

  h('What you may do'),
  ul(
    'Browse the site.',
    'Read and share links to public content.',
    'Download materials where that option is enabled.',
    'Contact us for information or to explore a possible business relationship.',
  ),

  h('What is not allowed'),
  ul(
    'Attempting unauthorized access to systems, accounts, databases or infrastructure.',
    "Interfering with the site's security, availability or operation.",
    'Introducing malicious code or abusive automated mechanisms.',
    'Scraping content at scale in violation of law, these Terms or third-party rights.',
    'Impersonating others or submitting deliberately false information.',
    'Using the site for unlawful, deceptive or unsolicited communications.',
    'Copying, modifying, selling or exploiting content outside permitted uses.',
    `Using ${I.marca} marks or materials to imply a relationship, certification or authorization that does not exist.`,
  ),

  h('Intellectual property'),
  ...p(
    `Unless stated otherwise, the design, copy, diagrams, methods, frameworks, trademarks and other website content belong to ${I.razonSocial} or are used under authorization.`,
    "BECOME NOW™, BECOME DISCOVER™, BECOME EMBED™, the BECOME framework and its distinctive elements may not be reproduced, adapted, sold or presented as another party's work without prior written authorization.",
    'Reading or downloading material transfers no intellectual-property rights: it grants a personal or internal, non-exclusive, non-transferable and revocable right of use, unless the material states another licence.',
  ),

  h('Third-party brands and platforms'),
  ...p('ChatGPT, Claude, Gemini and other platforms mentioned belong to their respective owners. Mentioning them implies no affiliation, sponsorship or certification, does not make us their representative and does not modify their terms. Their availability, features, pricing and policies change without our involvement.'),

  h('AI-related content'),
  ...p('AI systems can produce incomplete, inaccurate, outdated or contextually inappropriate output. Before using AI in a decision, a process or a product, consider:'),
  ul(
    'Data quality and authorization.',
    'Security and privacy.',
    'Intellectual property.',
    'Evaluation of outputs.',
    'Human oversight.',
    'Traceability.',
    'Regulatory compliance.',
    'Operational ownership.',
  ),
  ...p('No content on this site replaces assessment of the specific use case and its risk profile.'),

  h('What you send us'),
  ...p('By using the form you confirm that the information is materially accurate, that it may be used to respond to you and evaluate a possible business relationship, and that it does not infringe third-party rights.'),
  ...p('The public form must not be used to send:'),
  ul(
    'Sensitive personal data.',
    'Credentials or passwords.',
    'Trade secrets.',
    'Information covered by confidentiality obligations.',
    'Client, employee or third-party data without authorization.',
    'Regulated information requiring a specific secure channel.',
  ),
  ...p('If confidential information needs to be shared, we agree beforehand on the channel, the controls and, where appropriate, a confidentiality agreement.'),

  h('External links'),
  ...p('The site may link to third-party pages. We do not control their content, availability, security or privacy practices. A link is not an endorsement or a guarantee unless expressly stated.'),

  h('Availability'),
  ...p('We aim to keep the site available and reasonably secure, but do not guarantee permanent, uninterrupted or error-free operation. It may be suspended for maintenance, updates, security, provider failures or force majeure.'),

  h('Liability'),
  ...p('To the extent permitted by law, we are not responsible for decisions made solely from general website information, nor for harm arising from use contrary to these Terms, from relying on content without professional validation, from third-party service failures, from events outside our reasonable control, or from incorrect information you provided.'),
  ...p('Nothing above excludes liability that cannot lawfully be limited, or mandatory rights that apply to you.'),

  h('Privacy and cookies'),
  ...p('Personal data is handled according to the Privacy Policy and the Cookie Policy published on this site.'),

  h('Changes'),
  ...p('We may update these Terms for legal, operational or service reasons. The current version shows its last-updated date, and material changes will be communicated reasonably on the site.'),

  h('Governing law'),
  ...p(
    'These Terms are governed by Peruvian law, without limiting mandatory rights that may apply under other legislation.',
    'We will seek to resolve any dispute in good faith. Failing that, the parties submit to the courts of Lima, Peru, unless mandatory law requires another venue.',
  ),

  h('Contact'),
  ul(`Email: ${I.correoLegal}`, `Address: ${I.domicilio}`),
];

const PRIVACIDAD_EN = [
  h('Who is responsible'),
  ...p(
    `${I.razonSocial}, tax ID (RUC) ${I.ruc}, registered at ${I.domicilio}, owner of the ${I.marca} brand, controls the personal data described here.`,
    `Privacy and data-rights contact: ${I.correoPrivacidad}.`,
    `Personal-data bank: “${I.bancoDatos}”, entered in Peru's National Register of Personal Data Protection under code ${I.bancoDatosCodigo}, per certificate ${I.bancoDatosConstancia} dated ${I.bancoDatosFecha}.`,
  ),

  h('What this covers'),
  ...p('Personal data we receive through:'),
  ul(
    `${I.dominio} and its pages.`,
    'The contact form.',
    'The article subscription.',
    'Meetings and business communications.',
    'Professional interactions related to BECOME.',
  ),

  h('What we collect'),
  ...p('Depending on the interaction:'),
  ul(
    'Identification and contact: name, business email, phone if you give it, country or city.',
    'Professional data: company, role, area, industry.',
    'Your enquiry: objective or need, stage, timing, service preference and anything you include voluntarily.',
    'Technical data: IP address and time of submission, logged by the server to limit form abuse.',
    'Communications: emails, replies and subscription preferences.',
  ),
  ...p('We do not request sensitive data through the public form. This site uses no analytics and no tracking tools, so we build no browsing profiles.'),

  h('Where it comes from'),
  ...p('Directly from you or an authorized representative of your company. We do not use purchased, scraped or transferred databases.'),

  h('Why we use it and how long we keep it'),
  {
    tipo: 'tabla',
    cabecera: ['Purpose', 'Basis', 'Retention'],
    filas: [
      ['Answer your enquiry and recommend a starting point', 'Your consent and the pre-contractual steps you requested', 'Up to 24 months after the last interaction, unless a contract or a deletion request applies'],
      ['Prepare meetings, proposals and the follow-up you asked for', 'Your consent and pre-contractual steps', 'Up to 24 months after the last interaction, or while negotiations continue'],
      ['Deliver contracted services', 'Contract performance and legal obligations', 'For the relationship and applicable legal periods'],
      ['Send you the articles you asked to receive', 'Your consent, confirmed by email', 'Until you unsubscribe or after 24 months of inactivity, whichever comes first'],
      ['Prevent abuse of the form and the subscription', 'System protection', 'Up to 12 months'],
      ['Handle rights, complaints and regulatory duties', 'Legal obligation', 'For the procedure and the period needed to evidence compliance'],
    ],
  },
  ...p('Once the purpose ends, data is deleted, anonymized or restricted where retention is legally required.'),

  h('The emails we send'),
  ...p(
    'We send articles only to people who asked for them and then confirmed their address by clicking a link. That second step exists so nobody can subscribe someone else.',
    'Consent is freely given, prior, explicit and informed, requested separately from answering your enquiry, never pre-ticked, and you can withdraw it at any time through the unsubscribe link in every email.',
    'Withdrawing it does not affect a reply to an enquiry or a contractual relationship.',
  ),

  h('Who we share it with'),
  ...p('We use these providers, and only these:'),
  filaProveedores('en'),
  ...p('They must process data only on our instructions, with appropriate security and confidentiality obligations.'),
  ...p('Data may also be disclosed to competent authorities under a valid requirement, or in a corporate reorganization subject to confidentiality and continued protection.'),
  ...p('We do not sell personal data.'),

  h('International transfers'),
  ...p(
    "There is an international transfer, and it is worth stating plainly. Data you send through the form and your subscription address are hosted on the infrastructure of Hostinger International, Ltd., on servers located mainly in the United States, including the state of Arizona, as well as in other countries where Hostinger or its infrastructure providers operate.",
    `Hostinger acts as processor: it hosts the data and processes it only on our instructions. ${I.razonSocial} remains the controller, that is, the party deciding why and how the data is processed.`,
    'The transfer relies on being necessary to carry out the relationship you started — answering your enquiry or sending you the articles — and the provider is under contractual security and confidentiality obligations. You may object, and if you do we will stop processing your data entirely, because without hosting there is no way to keep it.',
    'GitHub, Inc., in the United States, hosts the site code and published content. It receives no visitor personal data.',
  ),

  h('Automated decisions'),
  ...p('We do not make decisions with legal or similarly significant effects on a person based solely on automated processing. We use AI tools to prepare content, but business recommendations and relevant decisions are made by a person.'),

  h('Security'),
  ...p('We apply measures proportionate to the risk:'),
  ul(
    'Encryption in transit (HTTPS) across the site.',
    'Access control and least privilege in the administration panel.',
    'Passwords stored as hashes, never in readable form.',
    'Rate limiting on forms and on panel sign-in.',
    'Logging of sends and failures so an incident can be investigated.',
    'Backups of published content.',
  ),
  ...p('No system is infallible. If an incident requires notification, we will follow our response procedure, make regulatory notifications within the applicable period and inform affected individuals where appropriate.'),

  h('Your rights'),
  ...p('You may request information about the processing, access to your data, rectification or updating, cancellation or deletion, objection, and withdrawal of consent.'),
  ...p(`Write to ${I.correoPrivacidad} with the subject “Personal Data Rights” and include:`),
  ul(
    'Full name.',
    'Which right you are exercising.',
    'A clear description of your request.',
    'How you want to receive the response.',
    'Reasonable information to verify your identity.',
    'Proof of representation, if acting for someone else.',
  ),
  ...p('Reference periods: up to 20 business days for access; up to 10 business days for rectification, cancellation or objection.'),
  ...p(`If you believe your request was not properly handled, you may contact the ${AUTORIDAD.en}.`),

  h('Children and sensitive data'),
  ...p('This site is not directed to children and we do not intentionally collect their data. We do not request sensitive data either; if you send it unprompted, we will assess deleting it.'),

  h('Changes'),
  ...p('We may update this Policy for regulatory, technological or operational reasons. The current version shows its date. If a change materially affects purposes or your rights, we will communicate it and, where appropriate, request new consent.'),

  h('Contact'),
  ul(
    `Controller: ${I.razonSocial}`,
    `Privacy and data rights: ${I.correoPrivacidad}`,
    `Address: ${I.domicilio}`,
    `Supervisory authority: ${AUTORIDAD.en}`,
  ),
];

const COOKIES_EN = [
  h('The short version'),
  ...p(
    'This site uses no analytics, no advertising pixels and no third-party scripts. There are no marketing cookies, we do not measure your browsing and we share your behaviour with nobody.',
    'That is why you will not see a consent banner: there is nothing optional to switch on. A banner asking permission for cookies that do not exist protects nobody; it just trains people to accept without reading.',
  ),

  h('What we store and why'),
  ...p('The only things this site stores in your browser are what is needed for what you asked it to do:'),
  filaAlmacenamiento('en'),

  h('How to delete it'),
  ...p('All of the above can be cleared from your browser settings, under site data. You do not need to ask us or wait for a reply. Clearing it breaks nothing: at most you lose a half-written form draft.'),

  h('If this changes'),
  ...p('If we ever add analytics or any non-essential technology, this page will say so before it is switched on, and a panel will appear to accept, reject or configure it by category, with the options equally visible. Until then, there is nothing to configure.'),
];

export const LEGALES = {
  es: {
    terminos: { titulo: 'Términos de uso', lead: 'Condiciones bajo las que se ofrece el contenido de este sitio.', bloques: TERMINOS_ES },
    privacidad: { titulo: 'Política de privacidad', lead: `Cómo ${I.razonSocial} trata los datos personales que recibe a través de este sitio.`, bloques: PRIVACIDAD_ES },
    cookies: { titulo: 'Política de cookies', lead: 'Qué guarda este sitio en tu navegador. Es menos de lo que esperas.', bloques: COOKIES_ES },
  },
  en: {
    terms: { titulo: 'Terms of Use', lead: 'The conditions under which this site offers its content.', bloques: TERMINOS_EN },
    privacy: { titulo: 'Privacy Policy', lead: `How ${I.razonSocial} handles the personal data it receives through this site.`, bloques: PRIVACIDAD_EN },
    cookies: { titulo: 'Cookie Policy', lead: 'What this site stores in your browser. It is less than you expect.', bloques: COOKIES_EN },
  },
};
