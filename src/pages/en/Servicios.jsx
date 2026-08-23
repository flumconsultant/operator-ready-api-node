import React from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRIAS_MENU } from '../../site.en.js';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Card, Cols } from '../../components/ui.jsx';
import { Ico, IcoBadge } from '../../components/icons.jsx';
import { Banner } from '../../components/Media.jsx';

/** Services landing — English mirror of src/pages/Servicios.jsx. */

const JOURNEY = [
  { n: '00', icon: 'capability', step: 'Enable', who: 'BECOME NOW™', q: 'Does the team know how to work with AI today?', out: 'Applied capabilities, workflows and reusable assets.' },
  { n: '01', icon: 'decision', step: 'Define', who: 'BECOME DISCOVER™', q: 'Where is the value, and what needs to change?', out: 'Ambition, diagnostic and priority choices.' },
  { n: '02', icon: 'layers', step: 'Design', who: 'Connection point', q: 'How should the future model operate?', out: 'Target operating model and transformation blueprint.' },
  { n: '03', icon: 'build', step: 'Build', who: 'BECOME EMBED™', q: 'What capability should exist, and how will it work?', out: 'Workflow, agent, copilot, product or decision system.' },
  { n: '04', icon: 'embed', step: 'Embed', who: 'BECOME EMBED™', q: 'How is it embedded with adoption and control?', out: 'Ownership, human-in-the-loop, controls and scorecard.' },
  { n: '05', icon: 'scale', step: 'Scale', who: 'What comes after', q: 'Is it ready to expand?', out: 'Scale decision and evolution backlog.' },
];

const COMPARE = [
  ['Use it when', 'Strategic clarity, prioritization or target-model design is missing.', 'A prioritized opportunity exists and conditions to build are in place.'],
  ['Duration', '8–12 weeks.', '8–12 weeks per capability.'],
  ['Starts with', 'Ambition, a business tension, or a domain to transform.', 'A validatable blueprint, workflow or prioritized opportunity.'],
  ['Ends with', 'Strategy, portfolio, target state, business case and roadmap.', 'A working capability — adopted, controlled and measured.'],
  ['Framework', 'B–E–C–O.', 'O–M–E.'],
  ['Technology focus', 'AI landscape, model strategy, use cases, data readiness, governance and architecture implications.', 'LLMs, agents, APIs, data, integrations, orchestration, evaluation and observability.'],
  ['Next step', 'BECOME EMBED™ for the first prioritized case.', 'Iterate, integrate, scale or stop.'],
];

export default function Servicios() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Our services</Kicker>
        <Headline as="h1" dark>Three ways to turn AI into real capability.</Headline>
        <Lead dark>
          Three engagements connect applied AI enablement, AI-native strategy,
          operating-model design, building, adoption and scale.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/use-cases">Find your starting point</PrimaryCTA>
          <GhostCTA to="/en/contact" dark>Let’s talk</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>The journey</Kicker>
        <Headline>One axis. Three engagements that run through it.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {JOURNEY.map((j) => (
            <Reveal
              as="div"
              key={j.n}
              data-cols
              style={{
                display: 'grid',
                gridTemplateColumns: '34px 52px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.1fr)',
                gap: 'var(--space-6)',
                padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)',
                alignItems: 'start',
              }}
            >
              <Ico name={j.icon} size={26} style={{ color: 'var(--text-accent)', marginTop: 2 }} />
              <span style={{ font: 'var(--type-mono)', color: 'var(--text-faint)' }}>{j.n}</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                  {j.step}
                </h3>
                <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-faint)' }}>{j.who}</p>
              </div>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{j.q}</p>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)' }}>{j.out}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Banner variant="corridor" seed={67} height="clamp(280px, 36vw, 440px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '26ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          One axis. Three ways in.
        </Reveal>
      </Banner>

      <Section band="dark">
        <Kicker dark>Our offer</Kicker>
        <Headline dark>Enable the present. Design what’s next. Build from within.</Headline>
        <Cols min="280px">
          <Card dark>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="capability" size={24} style={{ color: 'var(--electric-green)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>Apply it starting tomorrow</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              BECOME NOW™
            </h3>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              In-company training in ChatGPT, Claude and Gemini, built around each
              area’s real processes, documents and challenges.
            </Body>
            <TextCTA to="/en/services/become-now" dark>Explore BECOME NOW™</TextCTA>
          </Card>
          <Card dark>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="decision" size={24} style={{ color: 'var(--electric-green)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>8–12 weeks</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              BECOME DISCOVER™
            </h3>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Aligns the ambition. Diagnoses the company. Identifies the value.
              Designs the operating model and roadmap needed to move forward.
            </Body>
            <TextCTA to="/en/services/become-discover" dark>Explore BECOME DISCOVER™</TextCTA>
          </Card>
          <Card dark>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="build" size={24} style={{ color: 'var(--electric-green)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>8–12 weeks per capability</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              BECOME EMBED™
            </h3>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Designs, builds and embeds an AI-native workflow, agent or product
              inside the operation, with adoption, controls and measurement from
              day one.
            </Body>
            <TextCTA to="/en/services/become-embed" dark>Explore BECOME EMBED™</TextCTA>
          </Card>
        </Cols>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>
          BECOME NOW™ can be hired on its own or integrated as an adoption and
          capability-building layer inside the other two.
        </Body>
      </Section>

      <Section band="light" id="comparison">
        <Kicker>Comparison</Kicker>
        <Headline>Which one you need, and why.</Headline>
        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th scope="col" style={{ ...th, width: '18%' }} />
                <th scope="col" style={th}>BECOME DISCOVER™</th>
                <th scope="col" style={th}>BECOME EMBED™</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, a, b]) => (
                <tr key={label}>
                  <th scope="row" style={{ ...td, color: 'var(--text-muted)', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase' }}>{label}</th>
                  <td style={td}>{a}</td>
                  <td style={td}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section band="sunken" id="which-one">
        <Kicker>Fit selector</Kicker>
        <Headline>In one sentence.</Headline>
        <Cols min="260px">
          <Card>
            <IcoBadge name="decision" />
            <Body style={{ color: 'var(--text-body)' }}>
              If you’re looking to <strong>define direction, prioritize investments
              or design the operating model</strong>, you need AI-Native
              BECOME DISCOVER™.
            </Body>
            <TextCTA to="/en/services/become-discover">Go to BECOME DISCOVER™</TextCTA>
          </Card>
          <Card>
            <IcoBadge name="build" />
            <Body style={{ color: 'var(--text-body)' }}>
              If you already know <strong>which capability to build</strong> and need
              to bring it into operation, you need BECOME EMBED™.
            </Body>
            <TextCTA to="/en/services/become-embed">Go to BECOME EMBED™</TextCTA>
          </Card>
          <Card>
            <IcoBadge name="signpost" />
            <Body style={{ color: 'var(--text-body)' }}>
              If you have an opportunity but <strong>no validated blueprint</strong>,
              we run a short readiness gate before recommending BECOME EMBED™.
            </Body>
            <TextCTA to="/en/contact">Talk about the gate</TextCTA>
          </Card>
        </Cols>
      </Section>

      {/* The bridge to industries: the three services describe HOW we work, and the
          next question is whether it applies to the reader’s own sector. */}
      <Section band="light">
        <Kicker>Your industry</Kicker>
        <Headline>The services are the same. Where the value sits is not.</Headline>
        <Body>
          The method does not change between sectors. What changes is which
          decisions carry weight, which workflows concentrate the problem and
          which risk has to be bounded before anything is built.
        </Body>
        <Cols min="220px" style={{ marginTop: 'var(--space-9)' }}>
          {INDUSTRIAS_MENU.map((i, n) => (
            <Reveal as="div" key={i.slug} index={n} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26 }}>
                <Link to={i.to} style={{ color: 'var(--text-heading)', textDecoration: 'none' }} className="hv-link">{i.label}</Link>
              </h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>{i.line}</Body>
            </Reveal>
          ))}
        </Cols>
        <TextCTA to="/en/industries">View all industries</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>Don’t start with the service. Start with the decision you need to make.</Headline>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/contact">Tell us what needs to change</PrimaryCTA>
          <GhostCTA to="/en/use-cases" dark>Start with your question</GhostCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}

const th = {
  padding: 'var(--space-4) var(--space-5) var(--space-4) 0',
  borderBottom: '1px solid var(--border-strong)',
  fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
  fontSize: 'var(--text-h3)', color: 'var(--text-heading)', textAlign: 'left',
};
const td = {
  padding: 'var(--space-5) var(--space-5) var(--space-5) 0',
  borderBottom: '1px solid var(--border-hairline)',
  font: 'var(--type-body)', fontSize: 'var(--text-body-md)',
  color: 'var(--text-body)', verticalAlign: 'top', textAlign: 'left',
};
