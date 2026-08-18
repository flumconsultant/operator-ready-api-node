import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Ico } from '../../components/icons.jsx';
import { Banner } from '../../components/Media.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../../components/ui.jsx';

/** AI-Native Transformation Discovery — English mirror of src/pages/Discovery.jsx. */

const STAGES = [
  ['B', 'Business Ambition', 'Defines what the company must become and which outcomes matter.', 'AI-native ambition and strategic thesis.'],
  ['E', 'Enterprise Discovery', 'Understands how it works today and what limits change.', 'Enterprise diagnostic and readiness.'],
  ['C', 'Capability Choices', 'Prioritizes where AI can create differential value.', 'Value pools and prioritized portfolio.'],
  ['O', 'Operating Model Design', 'Designs the future system of People, Data, Agents, Products and Operations.', 'Target operating model and blueprint.'],
];

const DELIVERABLES = [
  'AI-native ambition and strategic thesis.',
  'Enterprise diagnostic and Inside Readiness Index.',
  'Value pools and a prioritized capability portfolio.',
  'Target operating model.',
  'Transformation blueprint, business case and roadmap.',
];

const TOOLS = [
  ['Business Ambition Canvas™', 'Align the executive team around outcomes and strategic choices.'],
  ['Inside Readiness Index™', 'Assess maturity across People, Data, Agents, Products and Operations.'],
  ['AI-Native Value Map™', 'Prioritize opportunities by value, feasibility, speed and risk.'],
  ['Inside Target State Canvas™', 'Define the target operating model and transformation blueprint.'],
];

const FIT = [
  'Executive sponsorship exists.',
  'There are AI initiatives with no enterprise-wide coherence.',
  'A business domain needs reinvention.',
  'Leadership needs a portfolio, target state or roadmap.',
  'The company will involve leaders from business, technology, data and People.',
];

const DECISIONS = [
  'Where AI can create differential business value.',
  'What needs to change inside for that value to be possible.',
  'Which capability to build first, and with what criteria.',
  'What investment, sequence and governance sustain the plan.',
];

export default function Discovery() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME Discover™</Kicker>
        <Headline as="h1" dark>Define what your company should become next.</Headline>
        <Lead dark>
          An 8–12 week corporate engagement connecting AI-native strategy, enterprise
          diagnosis, value prioritization and operating-model design.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/contact">Talk to us about Discovery</PrimaryCTA>
          <GhostCTA to="/en/services" dark>See both services</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>The problem</Kicker>
        <Headline>AI activity with no enterprise direction.</Headline>
        <Lead>
          It isn’t a technology problem: it’s many initiatives and no thesis. Without
          a shared ambition, every area proposes its own cases and nobody has a
          single criterion for value.
        </Lead>
        <Body>
          The outcome is predictable: more pilots, more spend, and the same
          unanswered question about where the value actually is.
        </Body>
      </Section>

      <Section band="dark">
        <Kicker dark>Who it’s for</Kicker>
        <Headline dark>Five conditions that make Discovery the right next step.</Headline>
        <Cols min="240px">
          {FIT.map((f, i) => (
            <Reveal as="div" key={f} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Ico name="yes" size={22} style={{ color: 'var(--electric-green)' }} />
                <span style={{ font: 'var(--type-mono)', color: 'var(--electric-green)' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{f}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Banner variant="corridor" seed={53} height="clamp(280px, 36vw, 440px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '24ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          Direction first. Investment after.
        </Reveal>
      </Banner>

      <Section band="light">
        <Kicker>The journey</Kicker>
        <Headline>Discovery covers B–E–C–O of the framework.</Headline>
        <Body>
          The last two stages — Make &amp; Embed and Expand &amp; Evolve — are Build
          &amp; Embed territory. Operating Model Design is the visible transition
          point between the two services.
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

      <Section band="sunken">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>Working model</Kicker>
            <Headline>Done with your team, not to your team.</Headline>
            <Body>
              One accountable lead per engagement and a client team embedded from
              week one. Decisions and risks are made visible as they come up, not
              in the final presentation.
            </Body>
            <Body>
              Executive participation isn’t optional: without the people who decide
              in the room, the output is a document, not a direction.
            </Body>
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
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker dark>Deliverables</Kicker>
            <Headline dark>What’s left when it’s done.</Headline>
            <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
              {DELIVERABLES.map((d) => (
                <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
                  <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>—</span>
                  <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal as="div">
            <Kicker dark>Decisions you can make</Kicker>
            <Headline dark>Four questions, answered with explicit criteria.</Headline>
            <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
              {DECISIONS.map((d) => (
                <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
                  <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>?</span>
                  <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section band="light">
        <Reveal as="p" style={{ margin: 0, font: 'var(--type-lead)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)', maxWidth: '52ch' }}>
          By the end of Discovery, leadership knows where AI can create value, what
          needs to change inside the company, and which capability to build first.
        </Reveal>
        <Cols min="260px">
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>Duration</p>
            <Body style={{ marginTop: 'var(--space-4)' }}>8–12 weeks, depending on scope and executive availability.</Body>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>Next step</p>
            <Body style={{ marginTop: 'var(--space-4)' }}>Build &amp; Embed for the first prioritized case.</Body>
            <TextCTA to="/en/services/build-and-embed">Explore Build &amp; Embed</TextCTA>
          </Card>
        </Cols>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Find the right point to start</Kicker>
        <Headline dark>Tell us what needs to change in the business.</Headline>
        <Lead dark>
          We’ll determine whether Discovery is the right first step. If it isn’t,
          we’ll tell you.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/contact">Start your Discovery</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
