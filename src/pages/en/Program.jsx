import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../../components/ui.jsx';
import { PROGRAMS, PROGRAM_LIST, PERSONALIZATION_NOTE, SESSION_FLOW, FAQ } from '../../content/become-now.en.js';

export default function Program() {
  const { slug } = useParams();
  const p = PROGRAMS[slug];
  if (!p) return <Navigate to="/en/services/become-now" replace />;

  const others = PROGRAM_LIST.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME NOW™ · {p.area}</Kicker>
        <Headline as="h1" dark>{p.h1}</Headline>
        <Lead dark>{p.body}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/services/become-now#design-your-program">{p.cta}</PrimaryCTA>
          <GhostCTA to="/en/services/become-now" dark>How BECOME NOW™ works</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>The usual problem</Kicker>
            <Headline>The team already uses AI. Everyone their own way.</Headline>
            <Body>
              In {p.area} the tool usually enters through individual initiative:
              someone discovers it saves them time on a task and figures it out on
              their own. That learning isn’t shared, isn’t validated against any
              team criteria, and disappears when that person changes roles.
            </Body>
            <Body>
              The program turns those loose findings into team workflows, with
              shared validation criteria and documented assets.
            </Body>
          </Reveal>
          <Reveal as="div">
            <Kicker>Who it’s for</Kicker>
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {p.who.map((w) => (
                <span key={w} style={{
                  padding: '8px 14px', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                  fontSize: 'var(--text-body-sm)', color: 'var(--text-body)',
                }}>{w}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section band="darker">
        <Kicker dark>Before the curriculum</Kicker>
        <Headline dark>Session 0 decides what gets taught.</Headline>
        <Lead dark>
          We review {p.area}’s processes, its documents, its tools and its
          bottlenecks. That’s where the cases worked in each session come from.
        </Lead>
        <TextCTA to="/en/services/become-now#session-0" dark>What Session 0 covers</TextCTA>
      </Section>

      {p.processes && (
        <Section band="light">
          <Kicker>Adaptable processes</Kicker>
          <Headline>What the program is built on.</Headline>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {p.processes.map((x) => (
              <span key={x} style={{
                padding: '8px 14px', border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                fontSize: 'var(--text-body-sm)', color: 'var(--text-body)',
              }}>{x}</span>
            ))}
          </div>
        </Section>
      )}

      <Section band={p.processes ? 'sunken' : 'light'}>
        <Kicker>Recommended route</Kicker>
        <Headline>Six sessions. Six capabilities left installed.</Headline>
        <Body style={{ marginTop: 'var(--space-6)', color: 'var(--text-body)' }}>
          <strong>{PERSONALIZATION_NOTE}</strong>
        </Body>

        <div style={{ marginTop: 'var(--space-10)' }}>
          {p.route.map(([topic, capability], i) => (
            <Reveal as="div" key={topic} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) minmax(0,1.2fr)',
                gap: 'var(--space-6)', padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ font: 'var(--type-mono)', fontSize: 'var(--text-h3)', color: 'var(--text-accent)' }}>
                0{i + 1}
              </span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                <span className="sr-only">{`Session ${i + 1}: `}</span>{topic}
              </h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '62ch' }}>
                <span style={{ color: 'var(--text-accent)' }}>Installed: </span>{capability}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>What each session looks like</Kicker>
        <Headline dark>Every session leaves something working, not just something learned.</Headline>
        <Cols min="220px">
          {SESSION_FLOW.map(([t, d], i) => (
            <Reveal as="div" key={t} className="row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <span style={{ font: 'var(--type-mono)', color: 'var(--electric-green)' }}>{String(i + 1).padStart(2, '0')}</span>
              <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{t}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{d}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {p.guardrails && (
        <Section band="darker">
          <Kicker dark>Responsible use</Kicker>
          <Headline dark>The limits get defined before the cases.</Headline>
          <Lead dark>
            In {p.area}, professional judgment isn’t delegated. These rules are
            agreed in Session 0 and applied in every exercise of the program.
          </Lead>
          <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)', maxWidth: '62ch' }}>
            {p.guardrails.map((g) => (
              <li key={g} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
                <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>!</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{g}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section band="light">
        <Kicker>Possible deliverables</Kicker>
        <Headline>What the area takes away.</Headline>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {p.deliverables.map((d) => (
            <span key={d} style={{
              padding: '10px 16px', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
              fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)',
            }}>{d}</span>
          ))}
        </div>
        <Body style={{ marginTop: 'var(--space-8)' }}>
          The program can run on ChatGPT, Claude or Gemini, depending on the
          company’s licenses and policies. The tools are a means: what changes is
          how the team works.
        </Body>
      </Section>

      <Section band="sunken">
        <Kicker>Frequently asked questions</Kicker>
        <Headline>Before you decide.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {FAQ.slice(0, 5).map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '68ch' }}>{a}</p>
            </details>
          ))}
        </div>
        <TextCTA to="/en/services/become-now">See all questions</TextCTA>
      </Section>

      <Section band="light">
        <Kicker>Other programs</Kicker>
        <Headline>Is a different area the one that needs to start?</Headline>
        <Cols min="240px">
          {others.map((o) => (
            <Card key={o.slug}>
              <Link to={o.to} style={{ textDecoration: 'none' }}>
                <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-accent)' }}>{o.group}</p>
                <p style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                  {o.menu.replace('AI applied to ', '')}
                </p>
                <Body style={{ marginTop: 'var(--space-4)' }}>{o.body}</Body>
              </Link>
            </Card>
          ))}
        </Cols>
        <TextCTA to="/en/services/become-now#programs">View all programs</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Built around your work</Kicker>
        <Headline dark>Tell us how {p.area} works today.</Headline>
        <Lead dark>{PERSONALIZATION_NOTE}</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/services/become-now#design-your-program">{p.cta}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
