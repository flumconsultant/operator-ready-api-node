import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, IndexRow } from '../../components/ui.jsx';
import { Banner } from '../../components/Media.jsx';
import KineticGrid from '../../components/KineticGrid.jsx';
import { SOLUCIONES_MENU } from '../../site.en.js';
import { ORIENTATION } from '../../content/soluciones.en.js';

export default function Soluciones() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-13)" backdrop={<KineticGrid />} scrim="soft">
        <Kicker dark>Start with your question</Kicker>
        <Headline as="h1" dark>Start from the work that needs to change.</Headline>
        <Lead dark>
          Pick the situation closest to yours. We’ll show you what capability you
          need, what has to change inside, and the best place to start.
        </Lead>
      </Section>

      <Section band="light">
        <Kicker>What do you need to transform?</Kicker>
        <Headline>Six questions you’ll recognize before any technical name.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {SOLUCIONES_MENU.map((c, i) => (
            <IndexRow
              key={c.slug}
              to={c.to}
              index={i}
              icon={c.icon}
              num={String(i + 1).padStart(2, '0')}
              term={c.label}
              def={c.line}
            />
          ))}
        </div>
      </Section>

      <Banner variant="dust" seed={47} height="clamp(260px, 32vw, 380px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '24ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          From symptom to decision.
        </Reveal>
      </Banner>

      <Section band="darker">
        <Kicker dark>Orientation map</Kicker>
        <Headline dark>From symptom to decision.</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          BECOME DISCOVER™ when strategy or target state is missing. BECOME EMBED™
          when a capability is already prioritized and conditions are ready to
          build.
        </Body>

        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                {['Question', 'What usually happens', 'What’s needed', 'Engagement'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    style={{
                      padding: 'var(--space-4) var(--space-5) var(--space-4) 0',
                      borderBottom: '1px solid var(--border-strong-dark)',
                      font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
                      textTransform: 'uppercase', color: 'var(--slate-300)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORIENTATION.map((r) => (
                <tr key={r.q}>
                  <th scope="row" style={{ ...cell, color: 'var(--white)', fontWeight: 'var(--weight-body-medium)' }}>{r.q}</th>
                  <td style={cell}>{r.happens}</td>
                  <td style={cell}>{r.need}</td>
                  <td style={{ ...cell, color: 'var(--electric-green)', whiteSpace: 'nowrap' }}>{r.rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section band="light" pad="var(--space-12)">
        <Reveal as="div">
          <Kicker>Find your starting point</Kicker>
          <Headline>Don’t start with the service. Start with the decision you need to make.</Headline>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <PrimaryCTA to="/en/contact">Tell us what needs to change</PrimaryCTA>
          </div>
        </Reveal>
      </Section>

      <SiteFooter />
    </main>
  );
}

const cell = {
  padding: 'var(--space-5) var(--space-5) var(--space-5) 0',
  borderBottom: '1px solid var(--border-hairline-dark)',
  font: 'var(--type-body)',
  fontSize: 'var(--text-body-md)',
  color: 'var(--slate-200)',
  verticalAlign: 'top',
  textAlign: 'left',
};
