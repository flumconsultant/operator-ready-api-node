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
   puerta de entrada. Lleva un tercer nivel — los programas por área. */
export const SERVICES = [
  {
    to: '/es/servicios/become-now',
    name: 'BECOME NOW™ — Applied AI Enablement',
    line: 'Capacitación en ChatGPT, Claude y Gemini aplicada a los procesos reales de tu empresa.',
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
    to: '/es/servicios/transformation-discovery',
    name: 'AI-Native Transformation Discovery',
    line: 'Define la estrategia, prioriza el valor y diseña el operating model.',
  },
  {
    to: '/es/servicios/build-and-embed',
    name: 'Build & Embed Sprint',
    line: 'Construye e incorpora una capability AI-native en la operación.',
  },
];

/* ---- casos de uso: preguntas, no tecnologías ---- */
export const USE_CASES = [
  {
    slug: 'por-donde-empezar-con-ia',
    icon: 'signpost',
    q: '¿No sabes por dónde empezar con IA?',
    line: 'Define la ambición, encuentra los value pools y prioriza el primer movimiento.',
  },
  {
    slug: 'pilotos-que-no-escalan',
    icon: 'scale',
    q: '¿Tienes pilotos que no escalan?',
    line: 'Identifica qué falta en workflow, ownership, data, controls y operating model.',
  },
  {
    slug: 'redisenar-workflow-critico',
    icon: 'flow',
    q: '¿Necesitas rediseñar un workflow crítico?',
    line: 'Replantea personas, agents, decisiones, datos, excepciones y métricas end-to-end.',
  },
  {
    slug: 'construir-agent-o-copilot',
    icon: 'agents',
    q: '¿Quieres construir un agent o copilot?',
    line: 'Convierte una oportunidad priorizada en una capability segura, adoptada y medible.',
  },
  {
    slug: 'experiencia-ai-native',
    icon: 'product',
    q: '¿Quieres crear una experiencia AI-native?',
    line: 'Diseña y construye un product o experience que cree nuevo valor para clientes o equipos.',
  },
  {
    slug: 'demostrar-valor-en-90-dias',
    icon: 'time',
    q: '¿Necesitas demostrar valor en 90 días?',
    line: 'Delimita una capability viable, implementa en entorno real y mide outcomes.',
  },
].map((c) => ({ ...c, to: `/es/casos-de-uso/${c.slug}` }));

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
    label: 'Casos de uso',
    to: '/es/casos-de-uso',
    heading: '¿Qué necesitas transformar?',
    items: USE_CASES.map((c) => ({ to: c.to, label: c.q, line: c.line })),
    more: { to: '/es/casos-de-uso', label: 'Ver todos los casos de uso' },
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
  { title: 'Casos de uso', links: USE_CASES.map((c) => ({ to: c.to, label: c.q })) },
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
      { href: 'mailto:hello@become.company', label: 'hello@become.company' },
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
  '/discovery': '/es/servicios/transformation-discovery',
  '/build-embed': '/es/servicios/build-and-embed',
  '/casos': '/es/casos-de-uso',
  '/insights': '/es/insights',
  '/nosotros': '/es/nosotros',
  '/contacto': '/es/contacto',
};
