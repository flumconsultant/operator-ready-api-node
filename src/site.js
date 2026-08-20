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
].map((c) => ({ ...c, to: `/es/soluciones/${c.slug}` }));

/* ---- menú principal ----
   Orden canónico del documento. Nada de Home, Framework, Metodología ni Blog:
   el framework se descubre desde la home, los servicios y el pie. */
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
  { label: 'Nosotros', to: '/es/nosotros' },
  {
    label: 'Soluciones',
    to: '/es/soluciones',
    heading: '¿Qué necesita cambiar en tu empresa?',
    items: SOLUCIONES_MENU.map((c) => ({ to: c.to, label: c.label, line: c.line })),
    more: { to: '/es/soluciones', label: 'Ver todas las soluciones' },
    wide: true,
  },
  { label: 'Insights', to: '/es/insights' },
];

export const CONTACT = { to: '/es/contacto', label: 'Contáctanos' };

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
  { title: 'Soluciones', links: SOLUCIONES_MENU.map((c) => ({ to: c.to, label: c.label })) },
  {
    title: 'BECOME',
    links: [
      { to: '/es/nosotros', label: 'Nosotros' },
      { to: '/es/framework', label: 'BECOME Framework' },
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
    ],
  },
];

/* ---- redirecciones desde las rutas de la primera maqueta ----
   Los enlaces viejos siguen funcionando en vez de dar 404. */
export const LEGACY_REDIRECTS = {
  '/': HOME,
  '/como-trabajamos': '/es/framework',
  '/discovery': '/es/servicios/become-discover',
  '/build-embed': '/es/servicios/become-embed',
  '/casos': '/es/soluciones',
  '/insights': '/es/insights',
  '/nosotros': '/es/nosotros',
  '/contacto': '/es/contacto',
};
