/**
 * El mapa del sitio en español: rutas, menú y pie.
 *
 * Una sola fuente para las tres cosas. Antes las rutas vivían en el router, los
 * enlaces del menú en el artboard de la cabecera y los del pie en el suyo, así
 * que renombrar una sección obligaba a acordarse de tres sitios. Aquí no.
 *
 * La estructura sale del documento de estrategia (§5). Dos reglas suyas que no
 * son obvias mirando el código:
 *
 *   · La Home NO es un ítem del menú. El único acceso global es el logotipo,
 *     con nombre accesible "BECOME — Inicio".
 *   · Los dos desplegables tienen contenido fijo: exactamente dos servicios y
 *     exactamente seis preguntas. No es una lista que crezca sola.
 */

import { PROGRAM_GROUPS, PROGRAMS } from './content/become-now.js';
import { INDUSTRIAS, RAIZ, urlIndustria } from './content/industrias.js';

export const HOME = '/es';

/* ---- servicios ----
   BECOME NOW™ va primero: es el que puede contratarse solo y el que sirve de
   puerta de entrada. Lleva un tercer nivel — los programas por área.

   Cada nombre lleva detrás, tras un guion, qué es en castellano llano. Los
   nombres solos —"Applied AI Enablement", "BECOME EMBED™"— no dicen a
   nadie de qué se trata: quien llegaba al menú no sabía que el primero es
   capacitación, y la explicación estaba debajo en letra pequeña, que es
   justo lo que no se lee. La marca se conserva; el descriptor la traduce. */
export const SERVICES = [
  {
    to: '/es/servicios/become-now',
    name: 'BECOME NOW™ — Capacitación aplicada en IA',
    line: 'Programas de ChatGPT, Claude y Gemini sobre los procesos, documentos y casos reales de cada área.',
    heading: 'Programas por área',
    groups: PROGRAM_GROUPS.map((g) => ({
      title: g.title,
      items: g.slugs.map((slug) => ({
        to: `/es/servicios/become-now/${slug}`,
        label: PROGRAMS[slug].menu,
      })),
    })),
    more: { to: '/es/servicios/become-now', label: 'Ver todos los programas' },
  },
  {
    to: '/es/servicios/become-discover',
    name: 'BECOME DISCOVER™ — Discovery de transformación AI-native',
    line: 'Dónde está el valor de la IA en tu empresa, qué se hace primero y cómo hay que operar para conseguirlo.',
  },
  {
    to: '/es/servicios/become-embed',
    name: 'BECOME EMBED™ — Sprint de construcción e incorporación',
    line: 'Construimos la solución de IA con tu equipo y la dejamos funcionando dentro de la operación diaria.',
  },
];

/* ---- las seis soluciones ----
   Cada una con tres textos distintos, y no es redundancia:

     label — la etiqueta del menú. Corta y orientada al resultado, porque en un
             desplegable una pregunta larga no se lee, se salta.
     q     — la pregunta de diagnóstico. Abre la página de la solución, donde
             hay sitio para plantear la situación de quien llega.
     line  — qué hace BECOME con eso, en una línea. */
export const SOLUCIONES_MENU = [
  {
    slug: 'escalar-ia',
    icon: 'scale',
    label: 'Escalar la IA más allá de los pilotos',
    q: '¿Tienes pilotos que no escalan?',
    line: 'Identifica qué falta en el proceso, los datos, los controles, el modelo operativo y quién responde.',
  },
  {
    slug: 'preparar-equipos-para-ia',
    icon: 'capability',
    label: 'Preparar equipos para trabajar con IA',
    q: '¿Necesitas preparar a tus equipos para trabajar con IA?',
    line: 'Convierte el uso suelto de herramientas en una forma de trabajar compartida, con criterios y controles.',
  },
  {
    slug: 'redisenar-procesos-criticos',
    icon: 'flow',
    label: 'Rediseñar procesos críticos',
    q: '¿Necesitas rediseñar un proceso crítico?',
    line: 'Replantea de principio a fin las personas, los agentes, las decisiones, los datos, las excepciones y las métricas.',
  },
  {
    slug: 'agentes-de-ia-con-control',
    icon: 'agents',
    label: 'Implementar agentes de IA con control',
    q: '¿Quieres incorporar agentes de IA sin perder el control?',
    line: 'Convierte una oportunidad priorizada en una capacidad segura, adoptada y medible.',
  },
  {
    slug: 'productos-y-servicios-con-ia',
    icon: 'product',
    label: 'Crear productos y servicios con IA',
    q: '¿Quieres que la IA forme parte de tu propuesta de valor?',
    line: 'Diseña y construye un producto o una experiencia que cree valor nuevo para clientes o equipos.',
  },
  {
    slug: 'medir-y-gobernar-valor',
    icon: 'decision',
    label: 'Medir y gobernar el valor de la IA',
    q: '¿Necesitas medir y gobernar el valor de la IA?',
    line: 'Define la línea base, los responsables y los controles que hacen que el resultado se sostenga.',
  },
].map((c) => ({ ...c, to: `/es/casos-de-uso/${c.slug}` }));

/* ---- industrias ----
   El menú las lista con un descriptor de una línea, igual que las soluciones.
   Sin él, «Real Estate y Construcción» en un desplegable no dice nada que la
   palabra no dijera ya, y quien duda de si su empresa encaja se va sin abrir.

   La lista sale del contenido y no se escribe aquí: una industria nueva es una
   entrada más en src/content/industrias.js, no una edición en cuatro sitios. */
export const INDUSTRIAS_MENU = INDUSTRIAS.map((i) => ({
  slug: i.slug.es,
  icon: i.icon,
  to: urlIndustria(i, 'es'),
  label: i.es.nombre,
  line: i.es.menu,
}));

/* ---- menú principal ----
   Seis ángulos, y cada uno responde a una pregunta distinta de quien llega:
   Servicios («cómo trabajo con vosotros»), Industrias («cómo aplica a mi
   contexto»), Casos de uso («qué problema resolvéis»), Cómo transformamos
   («con qué método»), Insights y Nosotros.

   Nosotros va al final y no en tercer lugar: es la pregunta que se hace
   después de las otras cuatro, no antes. La Home sigue sin ser un ítem: el
   acceso global es el logotipo. */
export const NAV = [
  {
    label: 'Servicios',
    to: '/es/servicios',
    items: SERVICES.map((s) => ({
      to: s.to, label: s.name, line: s.line,
      /* Solo BECOME NOW™ trae un nivel más; el indicador visual sale de aquí. */
      groups: s.groups, heading: s.heading, more: s.more,
    })),
  },
  {
    label: 'Industrias',
    to: '/es/industrias',
    heading: 'La tecnología puede ser la misma. El valor no.',
    items: INDUSTRIAS_MENU.map((i) => ({ to: i.to, label: i.label, line: i.line })),
    more: { to: '/es/industrias', label: 'Ver todas las industrias' },
    wide: true,
  },
  {
    label: 'Casos de uso',
    to: '/es/casos-de-uso',
    heading: '¿Qué necesita cambiar en tu empresa?',
    items: SOLUCIONES_MENU.map((c) => ({ to: c.to, label: c.label, line: c.line })),
    more: { to: '/es/casos-de-uso', label: 'Ver todos los casos de uso' },
    wide: true,
  },
  /* «Cómo transformamos» y no «Framework»: en un menú, quien entra por primera
     vez no busca un framework, busca entender cómo se trabaja. El nombre propio
     del método vive dentro de la página, que es donde sí aporta. */
  { label: 'Cómo transformamos', to: '/es/como-transformamos' },
  { label: 'Insights', to: '/es/insights' },
  {
    label: 'Nosotros',
    to: '/es/nosotros',
    heading: 'Quiénes somos y cómo trabajamos',
    /* Cinco de los siete destinos son secciones de la propia página de
       Nosotros, no páginas aparte. Es lo que recomienda el documento cuando el
       contenido no da para una página entera: un ancla se lee igual y evita
       siete páginas cortas que se repiten entre sí.
       IA responsable sí tiene dirección propia, porque es la página que alguien
       reenvía dentro de su empresa cuando le preguntan quién controla esto. */
    items: [
      { to: '/es/nosotros#sobre-become',   label: 'Sobre BECOME',     line: 'Qué es la empresa, en qué categoría juega y en qué se diferencia.' },
      { to: '/es/nosotros#proposito',      label: 'Nuestro propósito', line: 'Por qué existe BECOME y qué se propone dejar instalado.' },
      { to: '/es/nosotros#vision-mision',  label: 'Visión y misión',   line: 'El futuro que queremos y el papel que tomamos para construirlo.' },
      { to: '/es/nosotros#cultura-adn',    label: 'Cultura y ADN',     line: 'Seis rasgos y seis comportamientos, y cómo se notan en el trabajo.' },
      { to: '/es/nosotros#equipo',         label: 'Equipo',            line: 'Las disciplinas que se sientan en la misma mesa.' },
      { to: '/es/nosotros#como-trabajamos',label: 'Cómo trabajamos',   line: 'Cómo empezamos, cómo nos adaptamos y qué transferimos.' },
      { to: '/es/nosotros/ia-responsable', label: 'IA responsable',    line: 'Controles, supervisión humana y responsables con nombre.' },
    ],
    more: { to: '/es/nosotros', label: 'Ver todo sobre BECOME' },
    wide: true,
  },
];

/* La llamada a la acción de la cabecera. «Contáctanos» pide un trámite;
   «Hablemos de tu iniciativa» nombra lo que la persona trae y por qué querría
   escribir. Es el mismo enlace y la misma página: cambia qué promete. */
export const CONTACT = { to: '/es/contacto', label: 'Hablemos de tu iniciativa' };

/* ---- pie: el mapa completo, para que la cabecera no tenga que serlo ---- */
export const FOOTER = [
  { title: 'Servicios', links: SERVICES.map((s) => ({ to: s.to, label: s.name })) },
  {
    title: 'BECOME NOW™',
    links: PROGRAM_GROUPS.flatMap((g) => g.slugs).slice(0, 7).map((slug) => ({
      to: `/es/servicios/become-now/${slug}`,
      label: PROGRAMS[slug].menu.replace('IA aplicada a ', ''),
    })).concat([{ to: '/es/servicios/become-now', label: 'Ver todos los programas' }]),
  },
  { title: 'Casos de uso', links: SOLUCIONES_MENU.map((c) => ({ to: c.to, label: c.label })) },
  {
    title: 'Industrias',
    links: INDUSTRIAS_MENU.map((i) => ({ to: i.to, label: i.label }))
      .concat([{ to: RAIZ.es, label: 'Ver todas las industrias' }]),
  },
  {
    title: 'BECOME',
    links: [
      { to: '/es/nosotros', label: 'Nosotros' },
      { to: '/es/nosotros/ia-responsable', label: 'IA responsable' },
      { to: '/es/como-transformamos', label: 'Cómo transformamos' },
      { to: '/es/insights', label: 'Insights' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { to: '/es/contacto', label: 'Contáctanos' },
      { href: 'mailto:hello@meetbecome.com', label: 'hello@meetbecome.com' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/es/privacidad', label: 'Privacidad' },
      { to: '/es/terminos', label: 'Términos' },
      { to: '/es/cookies', label: 'Cookies' },
      { accion: 'cookies', label: 'Configurar cookies' },
    ],
  },
];

/* ---- redirecciones desde las rutas de la primera maqueta ----
   Los enlaces viejos siguen funcionando en vez de dar 404. */
export const LEGACY_REDIRECTS = {
  '/': HOME,
  '/como-trabajamos': '/es/como-transformamos',
  '/discovery': '/es/servicios/become-discover',
  '/build-embed': '/es/servicios/become-embed',
  '/casos': '/es/casos-de-uso',
  '/insights': '/es/insights',
  '/nosotros': '/es/nosotros',
  '/contacto': '/es/contacto',
  /* El apartado se llamaba «Framework» hasta que el nombre pasó a ser lo que
     hace y no lo que es. Las dos direcciones antiguas siguen resolviendo: se
     habían compartido y enlazado, y un 404 por un cambio de nombre es una
     pérdida que no hace falta asumir. */
  '/es/framework': '/es/como-transformamos',
  '/en/framework': '/en/how-we-transform',
};
