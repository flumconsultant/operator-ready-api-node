import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Ico } from '../../components/icons.jsx';
import { Banner } from '../../components/Media.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../../components/ui.jsx';
import { BajoElCapo } from '../../components/tecnologia.jsx';

/** BECOME EMBED™ — English mirror of src/pages/BuildEmbed.jsx. */

const BUILDABLE = [
  ['flow', 'AI-native workflow', 'An end-to-end process redesigned with people and agents working together.'],
  ['agents', 'Agent or copilot', 'A capability with explicit limits on autonomy, integration and accountability.'],
  ['decision', 'Assisted decision system', 'An information flow that prepares a high-value decision and keeps it traceable.'],
  ['product', 'AI-native product', 'A new experience for customers or employees, with its operation behind it.'],
];

const STAGES = [
  ['O', 'Operating Model Design', 'Validates the blueprint: roles, agents, data, decisions, exceptions and controls.', 'Validated Agentic Workflow Blueprint.'],
  ['M', 'Make & Embed', 'Builds, integrates and takes it into a real environment with hands-on adoption.', 'A working capability, with ownership.'],
  ['E', 'Expand & Evolve', 'Measures, governs, transfers and decides whether to iterate, integrate, scale or stop.', 'Scorecard and scale decision.'],
];

const DELIVERABLES = [
  'Validated workflow and capability blueprint.',
  'Working agent, product or decision system.',
  'Human-in-the-loop model and operational controls.',
  'Adoption plan and capability transfer.',
  'Performance, risk and value scorecard.',
];

const CONTROLS = [
  ['risk', 'Autonomy boundaries', 'What the system decides, and what a person always keeps.'],
  ['flow', 'Exception paths', 'What happens with what doesn’t fit, and who’s responsible for resolving it.'],
  ['quality', 'Quality criteria', 'How you know an output is acceptable before it reaches the customer.'],
  ['balance', 'Permissions and traceability', 'Who can do what, and how a decision gets reconstructed afterward.'],
];

const TOOLS = [
  ['Agentic Workflow Blueprint™', 'Design roles, agents, data, decisions, exceptions and controls.'],
  ['Embed Scorecard™', 'Measure usage, trust, performance, control and value.'],
  ['Scale Readiness Gate™', 'Decide whether to iterate, integrate, scale or stop.'],
];

export default function BuildEmbed() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME Embed™</Kicker>
        <Headline as="h1" dark>Turn an AI priority into a capability ready to operate.</Headline>
        <Lead dark>
          We design and build copilots, AI agents and LLM-powered workflows
          connected to your organization’s data, tools and systems.
        </Lead>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          We work from model selection and architecture through APIs, integrations,
          controls, evaluation, observability and the human-in-the-loop mechanisms
          required to operate with confidence. An 8–12 week sprint, with the team
          that will use it every day.
        </Body>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/contact">Talk to us about BECOME EMBED™</PrimaryCTA>
          <GhostCTA to="/en/services" dark>See both services</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>The problem</Kicker>
        <Headline>Prototypes that never become operating capability.</Headline>
        <Lead>
          The pilot works in the demo and disappears in operation. The model isn’t
          what fails: what fails is building it next to the real work instead of
          inside it.
        </Lead>
        <Body>
          At the end of the project nobody owns the result, the process is
          unchanged, and there’s no measure to decide whether it deserves to scale.
        </Body>
      </Section>

      <Section band="dark">
        <Kicker dark>What can be built</Kicker>
        <Headline dark>Four forms of capability, one standard.</Headline>
        <Cols min="250px">
          {BUILDABLE.map(([icon, name, line]) => (
            <Card dark key={name}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)', marginBottom: 'var(--space-5)' }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Card>
          ))}
        </Cols>
      </Section>

      <Banner variant="streams" seed={31} height="clamp(260px, 32vw, 380px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '26ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          From blueprint to operation.
        </Reveal>
      </Banner>

      <Section band="light">
        <Kicker>The journey</Kicker>
        <Headline>BECOME EMBED™ covers O–M–E of the framework.</Headline>
        <Body>
          It can start from an existing blueprint that meets the readiness criteria;
          it doesn’t require having done BECOME DISCOVER™ with us.
        </Body>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {STAGES.map(([letter, name, work, out]) => (
            <Reveal
              as="div" key={name} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1.2fr) minmax(0,1fr)',
                gap: 'var(--space-6)', padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-accent)' }}>{letter}</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{name}</h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{work}</p>
              <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--text-accent)' }}>Output: </span>{out}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <BajoElCapo lang="en" />

      <Section band="darker">
        <Kicker dark>Human-in-the-loop and controls</Kicker>
        <Headline dark>What determines whether an agent can operate is not only the quality of its answers.</Headline>
        <Lead dark>
          It’s who answers for it when it gets something wrong, and what happens
          with the cases that don’t fit. Those four decisions get made before the
          first line of code.
        </Lead>
        <Cols min="250px">
          {CONTROLS.map(([icon, name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)', marginBottom: 'var(--space-5)' }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="sunken">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>Adoption and capability transfer</Kicker>
            <Headline>The work is done when the capability belongs to the company.</Headline>
            <Body>
              Transfer isn’t a training session at the end: the team that will
              operate the capability takes part in designing and building it. That’s
              the difference between inheriting something and receiving it.
            </Body>
            <TextCTA to="/en/about">How we work</TextCTA>
          </Reveal>
          <Reveal as="div">
            <Kicker>Proprietary tools</Kicker>
            <div style={{ marginTop: 'var(--space-6)' }}>
              {TOOLS.map(([t, d], i) => <IndexRow key={t} index={i} term={t} def={d} />)}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>Deliverables</Kicker>
        <Headline dark>What’s left when the sprint is done.</Headline>
        <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)', maxWidth: '62ch' }}>
          {DELIVERABLES.map((d) => (
            <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
              <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>—</span>
              <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{d}</span>
            </li>
          ))}
        </ul>
        <Reveal as="p" style={{ margin: 'var(--space-10) 0 0', font: 'var(--type-lead)', color: 'var(--white)', maxWidth: '54ch' }}>
          The sprint ends with a capability working in a real environment, with
          ownership, controls and measurement against business outcomes.
        </Reveal>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Move from blueprint to an embedded capability</Kicker>
        <Headline dark>Bring a prioritized workflow, decision or product opportunity.</Headline>
        <Lead dark>We’ll define the right build path — or tell you if a step is still missing before it.</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/contact">Start a Build conversation</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
