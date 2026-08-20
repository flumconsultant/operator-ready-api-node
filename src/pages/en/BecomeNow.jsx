import React from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../../components/ui.jsx';
import BecomeNowForm from '../../components/BecomeNowForm.jsx';
import { Ico } from '../../components/icons.jsx';
import { Banner } from '../../components/Media.jsx';
import {
  TAGLINE, SITUATIONS, EXISTING_MATERIAL, SESSION_ZERO,
  SESSION_FLOW, FORMATS, IS_IS_NOT, INDICATORS, GENERAL_DELIVERABLES, FAQ, PROGRAM_GROUPS, PROGRAMS,
} from '../../content/become-now.en.js';

export default function BecomeNow() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME NOW™ — Applied AI Enablement</Kicker>
        <Headline as="h1" dark>Get your company working better with AI, today.</Headline>
        <Lead dark>
          In-company programs on ChatGPT, Claude and Gemini, designed around each
          area’s real processes, documents and challenges.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA href="#design-your-program">Design your program</PrimaryCTA>
          <GhostCTA to="#programs" dark>Explore programs by area</GhostCTA>
        </div>
        <p style={{ margin: 'var(--space-10) 0 0', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline-dark)', font: 'var(--type-body)', color: 'var(--slate-300)', maxWidth: '54ch' }}>
          No generic examples: the training is built on your company’s reality.
        </p>
        <p style={{ margin: 'var(--space-8) 0 0', font: 'var(--type-mono)', letterSpacing: 'var(--track-mono)', color: 'var(--electric-green)', textTransform: 'uppercase' }}>
          {TAGLINE}
        </p>
      </Section>

      <Section band="light">
        <Kicker>The adoption gap</Kicker>
        <Headline>Having access to AI doesn’t mean knowing how to work with it.</Headline>
        <Lead>
          The problem isn’t the tools. It’s that no one has turned them into a
          shared way of working.
        </Lead>

        <Cols min="260px">
          {SITUATIONS.map((s) => (
            <Reveal as="div" key={s} className="row-hit" style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-5)' }}>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{s}</p>
            </Reveal>
          ))}
        </Cols>

        <Reveal as="p" style={{ margin: 'var(--space-10) 0 0', font: 'var(--type-lead)', color: 'var(--text-heading)', maxWidth: '46ch' }}>
          Adoption changes when the training enters the real process.
        </Reveal>
      </Section>

      <Section band="dark">
        <Kicker dark>Built around your work</Kicker>
        <Headline dark>We understand how your team works first. Then we design the training.</Headline>
        <Lead dark>
          Before defining the curriculum we learn the area, its processes, its
          bottlenecks and the tools it uses today. That’s where the cases,
          assistants and workflows worked in the sessions come from.
        </Lead>

        <div style={{ marginTop: 'var(--space-11)' }}>
          <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--electric-green)' }}>
            We don’t start from zero. We work with what already exists:
          </p>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {EXISTING_MATERIAL.map((m) => (
              <span key={m} style={{
                padding: '8px 14px', border: '1px solid var(--border-hairline-dark)',
                borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                fontSize: 'var(--text-body-sm)', color: 'var(--slate-200)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <Ico name="doc" size={16} style={{ color: 'var(--electric-green)' }} />{m}
              </span>
            ))}
          </div>
          <Body dark style={{ marginTop: 'var(--space-6)' }}>
            The information can be used in real, anonymized or simulated form,
            depending on the company’s security criteria.
          </Body>
        </div>
      </Section>

      <Banner variant="circuit" seed={23} height="clamp(260px, 34vw, 400px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '24ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          The training enters the real process.
        </Reveal>
      </Banner>

      <Section band="sunken" id="session-0">
        <Kicker>Business process understanding session</Kicker>
        <Headline>No program starts before we understand the work it needs to improve.</Headline>
        <Lead>
          It’s not a sales meeting: it’s where we decide what gets taught.
        </Lead>

        <div style={{ marginTop: 'var(--space-10)' }}>
          {SESSION_ZERO.map(([t, d], i) => (
            <IndexRow key={t} index={i} num={String(i + 1).padStart(2, '0')} term={t} def={d} />
          ))}
        </div>
      </Section>

      <Section band="darker">
        <Kicker dark>How each session works</Kicker>
        <Headline dark>Six steps. The last one is the one that almost never happens.</Headline>
        <Lead dark>
          Every session ends with transfer: the asset gets documented and gets
          used the next day without us in the room.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {SESSION_FLOW.map(([t, d], i) => (
            <Reveal as="div" key={t} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1.6fr)',
                gap: 'var(--space-6)', padding: 'var(--space-5) 0',
                borderTop: '1px solid var(--border-hairline-dark)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--electric-green)' }}>
                {i + 1}
              </span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{t}</h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)', maxWidth: '62ch' }}>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>Adaptable formats</Kicker>
        <Headline>Three starting points, none of them fixed.</Headline>
        <Body>
          Everything adapts to the company. The one thing that never changes is
          the prior understanding session.
        </Body>
        <Cols min="280px">
          {FORMATS.map((f) => (
            <Card key={f.name}>
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>{f.hours}</p>
              <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>{f.name}</h3>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)' }}>{f.sessions}</p>
              <ul style={{ listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
                {f.items.map((it) => (
                  <li key={it} style={{ display: 'flex', gap: 'var(--space-4)', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-body)' }}>
                    <Ico name="yes" size={18} style={{ color: 'var(--text-accent)', marginTop: 2 }} />{it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </Cols>
        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA href="#design-your-program">Design yours</PrimaryCTA>
          <GhostCTA to="#programs">View programs by area</GhostCTA>
        </div>
      </Section>

      <Section band="dark" id="programs">
        <Kicker dark>Programs by area</Kicker>
        <Headline dark>Fourteen reference tracks. None of them is the final program.</Headline>
        <Lead dark>
          Reference journeys. The real program gets built after Session 0, and it
          can be for an area that isn’t listed here.
        </Lead>

        <div style={{ marginTop: 'var(--space-11)', display: 'grid', gap: 'var(--space-9)' }}>
          {PROGRAM_GROUPS.map((g) => (
            <div key={g.title}>
              <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--electric-green)' }}>{g.title}</p>
              <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--space-3)' }}>
                {g.slugs.map((slug) => (
                  <li key={slug}>
                    <Link
                      to={`/en/services/become-now/${slug}`}
                      className="row-hit"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
                        minHeight: 56, padding: 'var(--space-4) var(--space-5)',
                        border: '1px solid var(--border-hairline-dark)', textDecoration: 'none',
                        font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--white)',
                      }}
                    >
                      {PROGRAMS[slug].menu.replace('AI applied to ', '')}
                      <Ico name="route" size={18} style={{ color: 'var(--electric-green)' }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA href="#design-your-program">Don’t see your area? Tell us</PrimaryCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>What it is and what it isn’t</Kicker>
        <Headline>The difference matters more than the curriculum.</Headline>
        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th scope="col" style={{ ...th, color: 'var(--text-accent)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Ico name="yes" size={18} /> It is
                  </span>
                </th>
                <th scope="col" style={{ ...th, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Ico name="no" size={18} /> It isn’t
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {IS_IS_NOT.map(([yes, no]) => (
                <tr key={yes}>
                  <td style={{ ...td, color: 'var(--text-heading)' }}>
                    <span style={{ display: 'flex', gap: 10 }}>
                      <Ico name="yes" size={18} style={{ color: 'var(--text-accent)', marginTop: 3 }} />{yes}
                    </span>
                  </td>
                  <td style={{ ...td, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', gap: 10 }}>
                      <Ico name="no" size={18} style={{ color: 'var(--text-faint)', marginTop: 3 }} />{no}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section band="sunken">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>Indicators</Kicker>
            <Headline>How we measure that it worked.</Headline>
            <div style={{ marginTop: 'var(--space-8)' }}>
              {INDICATORS.map(([t, d], i) => <IndexRow key={t} index={i} term={t} def={d} />)}
            </div>
            <Body style={{ marginTop: 'var(--space-6)' }}>
              We don’t publish productivity percentages without a baseline.
              Measuring beforehand is part of the program, not an extra.
            </Body>
          </Reveal>
          <Reveal as="div">
            <Kicker>General deliverables</Kicker>
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {GENERAL_DELIVERABLES.map((d) => (
                <span key={d} style={{
                  padding: '8px 14px', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                  fontSize: 'var(--text-body-sm)', color: 'var(--text-body)',
                }}>{d}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section band="light">
        <Kicker>Frequently asked questions</Kicker>
        <Headline>What people usually ask before starting.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {FAQ.map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '68ch' }}>{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section band="dark" id="design-your-program" pad="var(--space-13)">
        <Kicker dark>Built around your work</Kicker>
        <div style={{ marginTop: 'var(--space-7)' }}>
          <BecomeNowForm lang="en" />
        </div>

        <div style={{ marginTop: 'var(--space-11)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline-dark)' }}>
          <Body dark style={{ marginTop: 0 }}>
            NOW™ trains for today’s work. BECOME DISCOVER™ defines what the company needs
            to become. BECOME EMBED™ builds what makes that future possible. It
            can be engaged alone or combined with the other two.
          </Body>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-7)', flexWrap: 'wrap' }}>
            <TextCTA to="/en/services/become-discover" dark>Explore BECOME DISCOVER™</TextCTA>
            <TextCTA to="/en/services/become-embed" dark>Explore BECOME EMBED™</TextCTA>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}

const th = {
  padding: 'var(--space-4) var(--space-6) var(--space-4) 0',
  borderBottom: '1px solid var(--border-strong)',
  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase', textAlign: 'left',
};
const td = {
  padding: 'var(--space-5) var(--space-6) var(--space-5) 0',
  borderBottom: '1px solid var(--border-hairline)',
  font: 'var(--type-body)', fontSize: 'var(--text-body-md)',
  verticalAlign: 'top', textAlign: 'left',
};
