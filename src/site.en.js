/**
 * El mapa del sitio en inglés: mismo formato que site.js, mismas rutas
 * mecánicamente (el mismo slug bajo /en/ en vez de /es/), traducido.
 *
 * Va en un archivo aparte y no como un segundo idioma dentro de site.js
 * porque las páginas españolas ya están terminadas y verificadas: tocar
 * site.js para parametrizarlo por idioma habría significado volver a probar
 * cada página que lo usa. Duplicar es más código, pero cero riesgo sobre lo
 * que ya funciona.
 *
 * Los slugs de los programas y los casos de uso NO se traducen — siguen en
 * español bajo /en/. Traducir el slug exigiría un mapa slug↔slug para el
 * conmutador de idioma y para las redirecciones, y esta primera versión en
 * inglés no lo necesita todavía.
 */

import { PROGRAM_GROUPS, PROGRAMS } from './content/become-now.js';

export const HOME = '/en';

const PROGRAM_MENU_EN = {
  'finanzas': 'AI applied to Finance',
  'finanzas-inmobiliarias': 'AI applied to Real Estate Finance',
  'ventas': 'AI applied to Sales',
  'marketing-comunicaciones': 'AI applied to Marketing & Communications',
  'supply-chain-compras': 'AI applied to Supply Chain & Procurement',
  'operaciones': 'AI applied to Operations',
  'recursos-humanos': 'AI applied to Human Resources',
  'customer-service-cx': 'AI applied to Customer Service & CX',
  'legal-compliance-risk': 'AI applied to Legal, Compliance & Risk',
  'product-innovacion': 'AI applied to Product & Innovation',
  'strategy-liderazgo': 'AI applied to Strategy & Leadership',
  'project-management-pmo': 'AI applied to Project Management & PMO',
  'data-analytics': 'AI applied to Data & Analytics',
  'technology-engineering': 'AI applied to Technology & Engineering',
};

export const SERVICES = [
  {
    to: '/en/services/become-now',
    name: 'BECOME NOW™ — Applied AI Enablement',
    line: 'ChatGPT, Claude and Gemini training applied to your company’s real processes.',
    heading: 'Programs by area',
    groups: PROGRAM_GROUPS.map((g) => ({
      title: g.title,
      items: g.slugs.map((slug) => ({
        to: `/en/services/become-now/${slug}`,
        label: PROGRAM_MENU_EN[slug] || PROGRAMS[slug].menu,
      })),
    })),
    more: { to: '/en/services/become-now', label: 'View all programs' },
  },
  {
    to: '/en/services/transformation-discovery',
    name: 'AI-Native Transformation Discovery',
    line: 'Define the strategy, prioritize the value and design the operating model.',
  },
  {
    to: '/en/services/build-and-embed',
    name: 'Build & Embed Sprint',
    line: 'Build and embed an AI-native capability into the operation.',
  },
];

export const USE_CASES = [
  {
    slug: 'por-donde-empezar-con-ia',
    icon: 'signpost',
    q: 'Not sure where to start with AI?',
    line: 'Define the ambition, find the value pools and prioritize the first move.',
  },
  {
    slug: 'pilotos-que-no-escalan',
    icon: 'scale',
    q: 'Do your pilots never scale?',
    line: 'Identify what’s missing in workflow, ownership, data, controls and operating model.',
  },
  {
    slug: 'redisenar-workflow-critico',
    icon: 'flow',
    q: 'Need to redesign a critical workflow?',
    line: 'Rethink people, agents, decisions, data, exceptions and end-to-end metrics.',
  },
  {
    slug: 'construir-agent-o-copilot',
    icon: 'agents',
    q: 'Want to build an agent or copilot?',
    line: 'Turn a prioritized opportunity into a secure, adopted and measurable capability.',
  },
  {
    slug: 'experiencia-ai-native',
    icon: 'product',
    q: 'Want to create an AI-native experience?',
    line: 'Design and build a product or experience that creates new value for customers or teams.',
  },
  {
    slug: 'demostrar-valor-en-90-dias',
    icon: 'time',
    q: 'Need to prove value in 90 days?',
    line: 'Scope a viable capability, ship it in a real environment and measure outcomes.',
  },
].map((c) => ({ ...c, to: `/en/use-cases/${c.slug}` }));

export const NAV = [
  {
    label: 'Services',
    to: '/en/services',
    items: SERVICES.map((s) => ({
      to: s.to, label: s.name, line: s.line,
      groups: s.groups, heading: s.heading, more: s.more,
    })),
  },
  { label: 'About', to: '/en/about' },
  {
    label: 'Use cases',
    to: '/en/use-cases',
    heading: 'What do you need to transform?',
    items: USE_CASES.map((c) => ({ to: c.to, label: c.q, line: c.line })),
    more: { to: '/en/use-cases', label: 'View all use cases' },
    wide: true,
  },
  { label: 'Insights', to: '/en/insights' },
];

export const CONTACT = { to: '/en/contact', label: 'Contact us' };

export const FOOTER = [
  { title: 'Services', links: SERVICES.map((s) => ({ to: s.to, label: s.name })) },
  {
    title: 'BECOME NOW™',
    links: PROGRAM_GROUPS.flatMap((g) => g.slugs).slice(0, 7).map((slug) => ({
      to: `/en/services/become-now/${slug}`,
      label: (PROGRAM_MENU_EN[slug] || PROGRAMS[slug].menu).replace('AI applied to ', ''),
    })).concat([{ to: '/en/services/become-now', label: 'View all programs' }]),
  },
  { title: 'Use cases', links: USE_CASES.map((c) => ({ to: c.to, label: c.q })) },
  {
    title: 'BECOME',
    links: [
      { to: '/en/about', label: 'About' },
      { to: '/en/framework', label: 'BECOME Framework' },
      { to: '/en/insights', label: 'Insights' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { to: '/en/contact', label: 'Contact us' },
      { href: 'mailto:hello@meetbecome.com', label: 'hello@meetbecome.com' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/en/privacy', label: 'Privacy' },
      { to: '/en/terms', label: 'Terms' },
    ],
  },
];
