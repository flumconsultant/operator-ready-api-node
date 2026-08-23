import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import {
  Section, Kicker, Headline, Lead, Body,
  PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow,
} from '../../components/ui.jsx';
import { MasIaNoEsTransformacion, VendorNeutral } from '../../components/tecnologia.jsx';
import { Ico, IcoBadge } from '../../components/icons.jsx';
import { Figure, Split } from '../../components/Media.jsx';
import ScrollStage from '../../components/ScrollStage.jsx';
import GradientField from '../../components/GradientField.jsx';
import { SOLUCIONES_MENU, INDUSTRIAS_MENU } from '../../site.en.js';

/**
 * Home — English.
 *
 * Mirrors src/pages/Home.jsx section by section: same order, same components,
 * same tokens. Kept as a separate file rather than a `lang` prop on the
 * Spanish page because that page is already finished and verified — branching
 * it internally would mean re-testing content that already works. This file
 * carries its own English copy and its own /en links; nothing here is
 * generated from the Spanish strings.
 */

const WHAT = [
  {
    icon: 'capability',
    label: 'We train',
    line: 'Every area learns to work with AI on its own processes and documents.',
    to: '/en/services/become-now',
    cta: 'BECOME NOW™',
  },
  {
    icon: 'decision',
    label: 'We define',
    line: 'Where the value is, what needs to change, and how the company should operate next.',
    to: '/en/services/become-discover',
    cta: 'BECOME DISCOVER™',
  },
  {
    icon: 'build',
    label: 'We build',
    line: 'The workflow, the agent, or the product — inside the operation, with the people who will use it.',
    to: '/en/services/become-embed',
    cta: 'BECOME EMBED™',
  },
];

const STAGES = [
  ['B', 'Business Ambition', 'Defines what the company must become and which outcomes matter.'],
  ['E', 'Enterprise Discovery', 'Understands how it works today and what limits change.'],
  ['C', 'Capability Choices', 'Prioritizes where AI can create differential value.'],
  ['O', 'Operating Model Design', 'Designs the future system.'],
  ['M', 'Make & Embed', 'Builds and embeds the capability.'],
  ['E', 'Expand & Evolve', 'Measures, governs, transfers and scales.'],
];

const DOMAINS = [
  ['People, inside.', 'People able to work, decide and collaborate with AI.', '/icons/people-inside-white.webp'],
  ['Data, inside.', 'Structured and unstructured data prepared to support models, RAG, enterprise search and decisions.', '/icons/data-inside-white.webp'],
  ['Agents, inside.', 'LLMs, copilots and AI agents able to reason, use tools and execute parts of a workflow within defined boundaries.', '/icons/agents-inside-white.webp'],
  ['Products, inside.', 'AI-native products and experiences that embed models, data and agents directly into the value proposition.', '/icons/products-inside-white.webp'],
  ['Operations, inside.', 'Redesigned workflows combining automation, AI agents, human decisions, exceptions and controls.', '/icons/operations-inside-white.webp'],
];

const OUTCOMES = [
  ['speed', 'Speed', 'Shorter decision and execution cycles.'],
  ['quality', 'Quality', 'Consistent work, fewer errors and better outcomes.'],
  ['growth', 'Growth', 'New products, experiences and sources of value.'],
  ['risk', 'Risk', 'Clear controls, accountability and human oversight.'],
  ['capability', 'Capability', 'Teams able to operate and improve the system.'],
];

const SCENARIOS = [
  ['decision', 'Decision intelligence', 'Redesigning a high-value decision and its information flow.', 'Shared context, exception paths and explicit decision rights.', '/images/46-strategy-session.webp', 'Leadership team working through a decision'],
  ['flow', 'Agentic operations', 'Embedding agents into a controlled end-to-end workflow.', 'Orchestration, a human-in-the-loop model and operational controls.', '/images/19-tech-workspace.webp', 'Workstation with AI-assisted operations'],
  ['product', 'AI-native product', 'Creating a new intelligent capability for customers or employees.', 'Data layer, product ownership and value measurement.', '/images/50-next-gen.webp', 'Team building an AI-native product'],
];

const PRINCIPLES = [
  ['target', 'Business first', 'We start from the enterprise outcome, not the tool.'],
  ['together', 'Build with, not for', 'We work with client teams to build ownership and operational confidence.'],
  ['fit', 'Adoption by design', 'Roles, controls, skills and measurement are part of the solution from day one.'],
];

/* What the company keeps once BECOME leaves. It sits right after what BECOME
   can build, and the order is deliberate: first what gets built, then what
   remains when we are gone. That is the difference between selling a project
   and selling a capability, and it was the one question this page never
   answered. Mirrors the Spanish home, so both sides have the same shape. */
const STAYS_INSIDE = [
  ['Process', 'A redesigned process with clear decisions, exceptions and owners.'],
  ['Intelligence', 'The agent, copilot, product or decision system that embeds AI into the work.'],
  ['Control', 'Permissions, traceability, validation, autonomy boundaries and escalation paths.'],
  ['People', 'A team capable of using, supervising and improving the capability.'],
  ['Ownership', 'Documentation, runbooks and accountability inside the organization.'],
  ['Measurement', 'A baseline and scorecard to know whether anything actually changed.'],
];

const CAPABILITIES = [
  ['decision', 'Prioritise', 'Where the value sits, which use cases, on what business case and in which order.'],
  ['flow', 'Redesign', 'Decisions, processes, roles, exceptions and controls.'],
  ['build', 'Build', 'Copilots, agents, retrieval over your own knowledge, integrations and AI-native products.'],
  ['capability', 'Enable', 'Teams able to work and decide with AI on their own work.'],
  ['scale', 'Measure', 'Baseline, performance, risk, adoption and value.'],
];

const INSIGHTS = [
  ['agents', 'The AI-native enterprise', 'What sets an AI-native company apart from a company that just uses AI.'],
  ['flow', 'Agentic work', 'Workflows, roles, agents and human accountability.'],
  ['operations', 'Operating-model reinvention', 'The design decisions that determine where value accumulates.'],
];

export default function Home() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" nodeState={0} pad="var(--space-14)">
        <Kicker dark>AI-native transformation company</Kicker>
        <h1
          style={{
            margin: 'var(--space-6) 0 0',
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-display)',
            fontSize: 'var(--text-hero)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--track-hero)',
            color: 'var(--white)',
            maxWidth: '14ch',
          }}
        >
          BECOME WHAT COMES NEXT.
        </h1>
        <Lead dark>
          BECOME is an enterprise AI consulting and transformation company. We
          turn AI opportunities, tools and pilots into capabilities the business
          can operate, govern and improve.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/contact">Find your starting point</PrimaryCTA>
          <a href="#what-we-do" style={ghostAnchor}>Explore our services</a>
        </div>
        <p
          style={{
            margin: 'var(--space-10) 0 0', paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-hairline-dark)',
            font: 'var(--type-body)', color: 'var(--slate-300)', maxWidth: '52ch',
          }}
        >
          A pilot shows that something can work. Value appears when the capability
          is integrated into the business, governed, adopted and measured.
        </p>
      </Section>

      <MasIaNoEsTransformacion lang="en" />

      <Section band="light" id="what-we-do">
        <Kicker>What we do</Kicker>
        <Headline>We train teams, define the change and build the capability.</Headline>
        <Cols min="260px">
          {WHAT.map((w) => (
            <Reveal as="div" key={w.label} className="row-hit" style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <IcoBadge name={w.icon} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {w.label}
              </h3>
              <Body>{w.line}</Body>
              <TextCTA to={w.to}>{w.cta}</TextCTA>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <ScrollStage
        variant="corridor"
        seed={13}
        steps={[
          { kicker: 'Today', title: 'The company you already have.', line: 'Scattered AI initiatives, pilots that never scale, and decisions that still take just as long.' },
          { kicker: 'Inside', title: 'The system that moves it.', line: 'People, data, agents, products and operations. Changing the company means changing all five at once.' },
          { kicker: 'After', title: 'The company it becomes.', line: 'A capability of its own, governed and measured, that keeps evolving without us in the room.' },
        ]}
      />

      <Section band="light">
        <Kicker>Our services</Kicker>
        <Headline>Enable the present. Design what’s next. Build from within.</Headline>

        <Reveal as="p" style={{ margin: 'var(--space-9) 0 0', font: 'var(--type-mono)', letterSpacing: 'var(--track-mono)', color: 'var(--text-accent)' }}>
          ENABLE → DEFINE → DESIGN → BUILD → EMBED → SCALE
        </Reveal>

        <Cols min="280px">
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="capability" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>Apply it starting tomorrow</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              BECOME NOW™
            </h3>
            <Body>
              In-company training so every area can use ChatGPT, Claude and Gemini on
              its own processes, documents and challenges.
            </Body>
            <TextCTA to="/en/services/become-now">Explore BECOME NOW™</TextCTA>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="decision" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 weeks</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              BECOME DISCOVER™
            </h3>
            <Body>
              Defines the ambition, identifies where the value is, and designs the
              operating model and roadmap.
            </Body>
            <TextCTA to="/en/services/become-discover">Explore BECOME DISCOVER™</TextCTA>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="build" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 weeks per capability</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              BECOME EMBED™
            </h3>
            <Body>
              Builds and embeds an AI-native capability with adoption, controls and
              measurement.
            </Body>
            <TextCTA to="/en/services/become-embed">Explore BECOME EMBED™</TextCTA>
          </Card>
        </Cols>

        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <GhostCTA to="/en/services#comparison">Compare all three</GhostCTA>
          <PrimaryCTA to="/en/contact">Tell us what needs to change</PrimaryCTA>
        </div>
      </Section>

      <Section band="sunken">
        <Kicker>What BECOME can build</Kicker>
        <Headline>Strategy when direction is missing. Capability when execution is missing.</Headline>
        <Lead>
          We work from the decision about where to invest through to the
          capability that keeps running inside the company.
        </Lead>
        <Cols min="200px" style={{ marginTop: 'var(--space-10)' }}>
          {CAPABILITIES.map(([icon, name, line]) => (
            <Reveal as="div" key={name} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={26} style={{ color: 'var(--text-accent)' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {name}
              </h3>
              <Body>{line}</Body>
            </Reveal>
          ))}
        </Cols>
        <TextCTA to="/en/how-we-transform">See how we transform</TextCTA>
      </Section>

      <Section band="light">
        <Kicker>What stays inside</Kicker>
        <Headline>What remains after BECOME is more than a solution.</Headline>
        <Lead>An enterprise capability needs more than a working model.</Lead>
        <Cols min="240px" style={{ marginTop: 'var(--space-10)' }}>
          {STAYS_INSIDE.map(([name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {name}
              </h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="dark" nodeState={1}>
        <Kicker dark>How we become</Kicker>
        <Headline dark>We don’t bolt AI on from outside. We redesign the enterprise from within.</Headline>
        <Lead dark>
          At every stage we transform the five systems that decide whether AI stays
          an experiment or becomes a capability of the enterprise.
        </Lead>

        <Cols min="230px" style={{ marginTop: 'var(--space-11)' }}>
          {DOMAINS.map(([name, line, icon]) => (
            <Reveal as="div" key={name} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <img src={icon} alt="" loading="lazy" decoding="async" width="34" height="34" style={{ width: 34, height: 34, display: 'block' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>
                {name}
              </h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>

        <TextCTA to="/en/how-we-transform" dark>How we transform</TextCTA>
      </Section>

      {/* Industries: the question that follows the three services is whether
          any of it applies to the reader's own context. */}
      <Section band="light">
        <Kicker>Industries</Kicker>
        <Headline>The technology can be the same. The value is not.</Headline>
        <Lead>
          AI capabilities are horizontal; value is not. What decides the outcome
          is which decisions, which processes and which risks define your
          industry.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {INDUSTRIAS_MENU.map((i, n) => (
            <IndexRow key={i.slug} index={n} icon={i.icon} to={i.to} num={String(n + 1).padStart(2, '0')} term={i.label} def={i.line} />
          ))}
        </div>
        <TextCTA to="/en/industries">Explore your industry</TextCTA>
      </Section>

      <Section band="sunken">
        <Kicker>Start with the problem</Kicker>
        <Headline>What do you need to transform right now?</Headline>
        <Lead>Start with the situation, not the name of the solution.</Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {SOLUCIONES_MENU.map((c, i) => (
            <IndexRow key={c.slug} index={i} icon={c.icon} to={c.to} num={String(i + 1).padStart(2, '0')} term={c.label} def={c.q} />
          ))}
        </div>
        <TextCTA to="/en/use-cases">See all use cases</TextCTA>
      </Section>

      <Section band="darker" nodeState={2}>
        <Kicker dark>How we transform</Kicker>
        <Headline dark>Six stages. One path from ambition to value.</Headline>
        <ol style={{ listStyle: 'none', margin: 'var(--space-10) 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-6)' }}>
          {STAGES.map(([letter, name], i) => (
            <Reveal as="li" key={name} className="row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 1, color: 'var(--electric-green)' }}>
                {letter}
              </span>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--white)' }}>
                <span className="sr-only">{`Stage ${i + 1}: `}</span>{name}
              </p>
            </Reveal>
          ))}
        </ol>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>
          Each stage is backed by a proprietary tool that unlocks a specific
          decision: readiness, value, design, adoption and scale.
        </Body>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <GhostCTA to="/en/how-we-transform" dark>How we transform</GhostCTA>
          <PrimaryCTA to="/en/contact">Start with your stage</PrimaryCTA>
        </div>
      </Section>


      <VendorNeutral lang="en" />

      <Section band="dark" nodeState={3}>
        <Kicker dark>Value, made visible</Kicker>
        <Headline dark>Measure what changes, not how much AI you deploy.</Headline>
        <Cols min="190px">
          {OUTCOMES.map(([icon, dim, line]) => (
            <Reveal as="div" key={dim} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{dim}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>
          Every engagement starts from a baseline and metrics agreed before we
          intervene. We measure change against that starting point.
        </Body>
      </Section>

      <Section band="light">
        <Kicker>Why BECOME</Kicker>
        <Headline>Strategy that builds. Technology that embeds. Capability that stays.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          <Split src="/images/45-executive.webp" alt="Executive conversation about the operating model" ratio="1 / 1">
            <div style={{ display: 'grid', gap: 'var(--space-7)' }}>
              {PRINCIPLES.map(([icon, name, line]) => (
                <Reveal as="div" key={name} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: 'var(--space-5)', alignItems: 'start', borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
                  <IcoBadge name={icon} />
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{name}</h3>
                    <Body>{line}</Body>
                  </div>
                </Reveal>
              ))}
              <Reveal as="p" style={{ margin: 0, font: 'var(--type-lead)', color: 'var(--text-heading)', maxWidth: '42ch' }}>
                The work is done when the capability belongs to the company.
              </Reveal>
              <div><GhostCTA to="/en/about">See how we work</GhostCTA></div>
            </div>
          </Split>
        </div>
      </Section>

      <Section band="darker" nodeState={4}>
        <Kicker dark>The work we are built to do</Kicker>
        <Headline dark>Three transformations we know how to lead.</Headline>
        <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--slate-300)' }}>
          Illustrative scenarios
        </p>
        <Cols min="260px">
          {SCENARIOS.map(([icon, name, tension, inside, img, alt]) => (
            <Reveal as="article" key={name} data-lift="" style={{ background: 'var(--navy-850)', border: '1px solid var(--border-hairline-dark)' }}>
              <Figure src={img} alt={alt} ratio="16 / 10" />
              <div style={{ padding: 'var(--space-7)' }}>
                <Ico name={icon} size={26} style={{ color: 'var(--electric-green)' }} />
                <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
                <Body dark style={{ marginTop: 'var(--space-4)' }}>{tension}</Body>
                <p style={{ margin: 'var(--space-5) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-300)' }}>
                  <span style={{ color: 'var(--electric-green)' }}>What changes inside: </span>{inside}
                </p>
              </div>
            </Reveal>
          ))}
        </Cols>
        <TextCTA to="/en/use-cases" dark>Find the scenario closest to yours</TextCTA>
      </Section>

      <Section band="light">
        <Kicker>Become insights</Kicker>
        <Headline>Ideas for the company that comes next.</Headline>
        <div style={{ marginTop: 'var(--space-9)' }}>
          {INSIGHTS.map(([icon, title, line], i) => (
            <IndexRow key={title} index={i} icon={icon} term={title} def={line} />
          ))}
        </div>
        <TextCTA to="/en/insights">Explore Insights</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-14)" backdrop={<GradientField speed={1.6} />}>
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>What should your company become next?</Headline>
        <Lead dark>
          Start with a conversation about the outcome, capability or workflow you
          need to transform. Under two minutes to tell us about it.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/contact">Find your starting point</PrimaryCTA>
          <GhostCTA to="/en/services/become-now" dark>Or train your team now</GhostCTA>
        </div>
        <p style={{ margin: 'var(--space-7) 0 0', display: 'inline-flex', alignItems: 'center', gap: 10, font: 'var(--type-body)', color: 'var(--slate-200)' }}>
          <Ico name="chat" size={20} style={{ color: 'var(--electric-green)' }} />
          Or email us at{' '}
          <a href="mailto:hello@meetbecome.com" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 24, color: 'var(--electric-green)' }}>hello@meetbecome.com</a>
        </p>
      </Section>

      <SiteFooter />
    </main>
  );
}

const ghostAnchor = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minHeight: 48, padding: '0 var(--space-7)', borderRadius: 'var(--radius-pill)',
  border: '1px solid var(--border-strong-dark)', color: 'var(--white)',
  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap',
};
