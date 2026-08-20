import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import { Section, Kicker, Headline, Lead, PrimaryCTA, IndexRow } from '../../components/ui.jsx';
import Listado from '../../components/insights/Listado.jsx';

const PILLARS = [
  ['The AI-native enterprise', 'Strategy, ambition and enterprise design. What sets an AI-native company apart from a company that just uses AI.'],
  ['Agentic work', 'Workflows, roles, agents and human accountability. How work changes when part of it is done by a system.'],
  ['Operating-model reinvention', 'People, Data, Agents, Products and Operations. The design decisions that determine where value accumulates.'],
  ['Value and adoption', 'Measurement, trust, change and capability transfer. Why adoption is a design problem, not a communication one.'],
  ['Responsible scale', 'Governance, controls, risk and scale readiness. When to scale and, above all, when not to.'],
];

const FORMATS = [
  ['Perspective', 'An argued thesis on where something is headed.'],
  ['Field Note', 'What we learned inside a specific problem.'],
  ['Framework', 'A reusable way to structure a decision.'],
  ['Executive Brief', 'What a committee needs to know, in its format.'],
  ['Case Evidence', 'Real work, only when the client approves it.'],
];

export default function Insights() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME Insights</Kicker>
        <Headline as="h1" dark>Ideas for the company that comes next.</Headline>
        <Lead dark>
          Perspectives on AI-native operating models, agentic work, decision
          intelligence, adoption and responsible scale.
        </Lead>
      </Section>

      <Section band="light">
        <Listado lang="en" />
      </Section>

      <Section band="darker">
        <Kicker dark>Editorial pillars</Kicker>
        <Headline dark>What we’re going to write about, and what we won’t.</Headline>
        <Lead dark>
          Five lines. No model news, no tool comparisons, no summaries of what
          someone else already said.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {PILLARS.map(([name, line], i) => (
            <IndexRow key={name} index={i} dark num={String(i + 1).padStart(2, '0')} term={name} def={line} />
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>Formats</Kicker>
        <Headline>Every idea has its own shape.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {FORMATS.map(([name, line], i) => <IndexRow key={name} index={i} term={name} def={line} />)}
        </div>
      </Section>

      <Section band="dark" pad="var(--space-13)">
        <Kicker dark>Become insights</Kicker>
        <Headline dark>Which idea needs to become a capability?</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/contact">Contact us</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
