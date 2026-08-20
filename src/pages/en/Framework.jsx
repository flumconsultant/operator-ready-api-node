import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, TextCTA, Cols, Card, IndexRow } from '../../components/ui.jsx';

/** BECOME™ Transformation Framework — English mirror of src/pages/Framework.jsx. */

const STAGES = [
  ['B', 'Business Ambition', 'Defines what the company must become and which outcomes matter.', 'AI-native ambition and strategic thesis.', 'Discovery'],
  ['E', 'Enterprise Discovery', 'Understands how it works today and what limits change.', 'Enterprise diagnostic and readiness.', 'Discovery'],
  ['C', 'Capability Choices', 'Prioritizes where AI can create differential value.', 'Value pools and prioritized portfolio.', 'Discovery'],
  ['O', 'Operating Model Design', 'Designs the future system.', 'Target operating model and blueprint.', 'Transition point'],
  ['M', 'Make & Embed', 'Builds and embeds the capability.', 'A capability working with controls.', 'Build & Embed'],
  ['E', 'Expand & Evolve', 'Measures, governs, transfers and scales.', 'Scorecard and scale decision.', 'Build & Embed'],
];

const DOMAINS = [
  ['People, inside.', 'Leadership, roles, skills and adoption designed for people working alongside AI.', '/icons/people-inside-white.webp'],
  ['Data, inside.', 'Context and knowledge turned into decisions and action.', '/icons/data-inside-white.webp'],
  ['Agents, inside.', 'Copilots and agents embedded in real workflows, with defined human oversight.', '/icons/agents-inside-white.webp'],
  ['Products, inside.', 'Propositions, experiences and differentiation built on what AI makes possible.', '/icons/products-inside-white.webp'],
  ['Operations, inside.', 'Processes, governance and performance redesigned to create value at scale.', '/icons/operations-inside-white.webp'],
];

const TOOLS = [
  ['Business Ambition Canvas™', 'Align the executive team around outcomes and strategic choices.'],
  ['Inside Readiness Index™', 'Assess maturity across People, Data, Agents, Products and Operations.'],
  ['AI-Native Value Map™', 'Prioritize opportunities by value, feasibility, speed and risk.'],
  ['Inside Target State Canvas™', 'Define the target operating model and transformation blueprint.'],
  ['Agentic Workflow Blueprint™', 'Design roles, agents, data, decisions, exceptions and controls.'],
  ['Embed Scorecard™', 'Measure usage, trust, performance, control and value.'],
  ['Scale Readiness Gate™', 'Decide whether to iterate, integrate, scale or stop.'],
];

const GOVERNANCE = [
  ['Human accountability', 'AI extends capacity; people keep direction, oversight and responsibility.'],
  ['Visible decisions', 'Limits, risks, assumptions and controls are made explicit, not assumed.'],
  ['Measure the change', 'We measure what changes in the business, not how much AI has been deployed.'],
  ['Gates, not inertia', 'Scaling is a decision made with evidence, with a real option to stop.'],
];

export default function Framework() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME™ Transformation Framework</Kicker>
        <Headline as="h1" dark>A system for becoming an AI-native company.</Headline>
        <Lead dark>
          Six stages connect ambition, discovery, capability choices,
          operating-model design, building and scale.
        </Lead>
      </Section>

      <Section band="light">
        <Kicker>The thesis</Kicker>
        <Headline>Transformation isn’t installed. It’s built from within.</Headline>
        <Lead>
          Isolated pilots don’t change a company. Change happens when workflows,
          roles, decision rights, data, controls, skills and measures get redesigned
          as a single operating system.
        </Lead>
        <Body>
          The framework exists to give that redesign a sequence. It isn’t a
          consulting method built to justify phases: it’s the order in which the
          decisions depend on each other.
        </Body>
      </Section>

      <Section band="dark">
        <Kicker dark>The sequence</Kicker>
        <Headline dark>B — E — C — O — M — E</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {STAGES.map(([letter, name, work, out, service], i) => (
            <Reveal
              as="div" key={name + i} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1.2fr) minmax(0,0.9fr) minmax(0,0.7fr)',
                gap: 'var(--space-6)', padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline-dark)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--electric-green)' }}>{letter}</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>
                <span className="sr-only">{`Stage ${i + 1}: `}</span>{name}
              </h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>{work}</p>
              <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-300)' }}>
                <span style={{ color: 'var(--electric-green)' }}>Output: </span>{out}
              </p>
              <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-400)' }}>{service}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section band="darker">
        <Kicker dark>At every stage</Kicker>
        <Headline dark>Five systems transformed at once.</Headline>
        <Lead dark>
          They aren’t five parallel workstreams. At every stage, decisions get made
          about all five — because leaving one out is what makes change not survive
          the first quarter.
        </Lead>
        <Cols min="230px">
          {DOMAINS.map(([name, line, icon]) => (
            <Reveal as="div" key={name} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <img src={icon} alt="" loading="lazy" decoding="async" style={{ width: 34, height: 34, display: 'block' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="light">
        <Kicker>Relationship to the services</Kicker>
        <Headline>Two engagements running through the same axis.</Headline>
        <Cols min="300px">
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>B–E–C–O</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              AI-Native Transformation Discovery
            </h3>
            <Body>Defines, diagnoses, prioritizes and designs the future model.</Body>
            <TextCTA to="/en/services/transformation-discovery">Explore Discovery</TextCTA>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>O–M–E</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              Build &amp; Embed Sprint
            </h3>
            <Body>Validates the design, builds, embeds and prepares for scale.</Body>
            <TextCTA to="/en/services/build-and-embed">Explore Build &amp; Embed</TextCTA>
          </Card>
        </Cols>
        <Body style={{ marginTop: 'var(--space-8)' }}>
          Operating Model Design shows up in both: it’s the visible transition point
          between defining and building.
        </Body>
      </Section>

      <Section band="sunken">
        <Kicker>Proprietary tools</Kicker>
        <Headline>Seven tools, seven decisions.</Headline>
        <Body>
          We don’t publish scoring formulas or weightings. What matters about a tool
          isn’t its formula — it’s which decision it lets you make.
        </Body>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {TOOLS.map(([t, d], i) => <IndexRow key={t} index={i} term={t} def={d} />)}
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>Governance and measurement</Kicker>
        <Headline dark>Four principles that don’t get traded for speed.</Headline>
        <Cols min="250px">
          {GOVERNANCE.map(([name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Apply the framework to your company</Kicker>
        <Headline dark>What should your company become next?</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/contact">Start your Discovery</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
