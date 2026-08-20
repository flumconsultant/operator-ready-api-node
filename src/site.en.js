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
 * Los slugs de los programas NO se traducen — siguen en
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
    to: '/en/services/become-discover',
    name: 'BECOME DISCOVER™ — AI-Native Transformation Discovery',
    line: 'Define the strategy, prioritize the value and design the operating model.',
  },
  {
    to: '/en/services/become-embed',
    name: 'BECOME EMBED™ — Build & Embed Sprint',
    line: 'Build and embed an AI-native capability into the operation.',
  },
];

export const SOLUCIONES_MENU = [
  {
    slug: 'scale-ai-beyond-pilots',
    icon: 'scale',
    label: 'Scale AI beyond pilots',
    q: 'Do your pilots never scale?',
    line: 'Identify what’s missing around the technology: the process, the data, the controls, the operating model and who answers for it.',
  },
  {
    slug: 'prepare-teams-for-ai',
    icon: 'capability',
    label: 'Prepare teams to work with AI',
    q: 'Need to prepare your teams to work with AI?',
    line: 'Turn scattered tool use into a shared way of working, with criteria and controls.',
  },
  {
    slug: 'redesign-critical-workflows',
    icon: 'flow',
    label: 'Redesign critical workflows',
    q: 'Need to redesign a critical workflow?',
    line: 'Rethink people, agents, decisions, data, exceptions and metrics from end to end.',
  },
  {
    slug: 'deploy-governed-ai-agents',
    icon: 'agents',
    label: 'Deploy governed AI agents',
    q: 'Want to introduce agents without losing control?',
    line: 'Turn a prioritized opportunity into a secure, adopted and measurable capability.',
  },
  {
    slug: 'build-ai-enabled-products',
    icon: 'product',
    label: 'Build AI-enabled products and services',
    q: 'Want AI to become part of your value proposition?',
    line: 'Design and build a product or experience that creates new value for customers or teams.',
  },
  {
    slug: 'measure-and-govern-ai-value',
    icon: 'decision',
    label: 'Measure and govern AI value',
    q: 'Need to measure and govern AI value?',
    line: 'Define the baseline, the owners and the controls that make the result hold.',
  },
].map((c) => ({ ...c, to: `/en/solutions/${c.slug}` }));

export const NAV = [
  {
    label: 'Services',
    to: '/en/services',
    items: SERVICES.map((s) => ({
      to: s.to, label: s.name, line: s.line,
      groups: s.groups, heading: s.heading, more: s.more,
    })),
  },
  {
    label: 'About',
    to: '/en/about',
    heading: 'Who we are and how we work',
    items: [
      { to: '/en/about#about-become',   label: 'About BECOME',    line: 'What the company is, the category it plays in and what makes it different.' },
      { to: '/en/about#purpose',        label: 'Our purpose',     line: 'Why BECOME exists and what it sets out to leave installed.' },
      { to: '/en/about#vision-mission', label: 'Vision & mission', line: 'The future we want and the part we take in building it.' },
      { to: '/en/about#culture-dna',    label: 'Culture & DNA',   line: 'Six traits and six behaviors, and how they show up in the work.' },
      { to: '/en/about#team',           label: 'Team',            line: 'The disciplines that sit at the same table.' },
      { to: '/en/about#how-we-work',    label: 'How we work',     line: 'How we start, how we adapt and what we hand over.' },
      { to: '/en/about/responsible-ai', label: 'Responsible AI',  line: 'Controls, human oversight and named owners.' },
    ],
    more: { to: '/en/about', label: 'See everything about BECOME' },
    wide: true,
  },
  {
    label: 'Solutions',
    to: '/en/solutions',
    heading: 'What needs to change in your company?',
    items: SOLUCIONES_MENU.map((c) => ({ to: c.to, label: c.label, line: c.line })),
    more: { to: '/en/solutions', label: 'View all solutions' },
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
  { title: 'Solutions', links: SOLUCIONES_MENU.map((c) => ({ to: c.to, label: c.label })) },
  {
    title: 'BECOME',
    links: [
      { to: '/en/about', label: 'About' },
      { to: '/en/about/responsible-ai', label: 'Responsible AI' },
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
