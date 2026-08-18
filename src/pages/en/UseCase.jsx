import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, TextCTA, Cols, Card } from '../../components/ui.jsx';
import { USE_CASE_CONTENT } from '../../content/use-cases.en.js';
import { USE_CASES } from '../../site.en.js';

export default function UseCase() {
  const { slug } = useParams();
  const c = USE_CASE_CONTENT[slug];
  if (!c) return <Navigate to="/en/use-cases" replace />;

  const others = USE_CASES.filter((u) => u.slug !== slug).slice(0, 3);

  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Start with your question</Kicker>
        <Headline as="h1" dark size="var(--text-h1)">{c.q}</Headline>
        <Lead dark>{c.answer}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/en/contact">{c.cta}</PrimaryCTA>
        </div>
      </Section>

      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>This is probably happening to you</Kicker>
            <Headline>Signals that read as familiar from the inside.</Headline>
          </Reveal>
          <Reveal as="ul" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            {c.signals.map((s) => (
              <li key={s} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline)' }}>
                <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{s}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>The problem behind the symptom</Kicker>
        <Reveal as="p" style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-lead)', color: 'var(--slate-100)', maxWidth: '62ch' }}>
          {c.problem}
        </Reveal>
      </Section>

      <Section band="light">
        <Kicker>How BECOME adds value</Kicker>
        <Lead>{c.value}</Lead>

        <Cols min="220px">
          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Tools
            </p>
            <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
              {c.tools.map((t) => (
                <li key={t} style={{ font: 'var(--type-mono)', color: 'var(--text-heading)' }}>{t}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              What gets installed
            </p>
            <Body style={{ marginTop: 'var(--space-5)' }}>{c.result}</Body>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Recommended engagement
            </p>
            <p style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
              {c.engagement}
            </p>
            <Body style={{ marginTop: 'var(--space-4)' }}>{c.engagementWhy}</Body>
          </Card>
        </Cols>
      </Section>

      <Section band="darker">
        <Kicker dark>What changes inside</Kicker>
        <Headline dark>People, Data, Agents, Products and Operations.</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          None of these situations gets solved in just one of the five layers.
          That’s why the work crosses all five: if one is left out, the change
          doesn’t survive the first quarter.
        </Body>
        <TextCTA to="/en/framework" dark>Explore the BECOME Framework</TextCTA>
      </Section>

      <Section band="light">
        <Kicker>Other questions</Kicker>
        <Headline>Does this look more like one of these?</Headline>
        <Cols min="240px">
          {others.map((o) => (
            <Card key={o.slug}>
              <Link to={o.to} style={{ textDecoration: 'none' }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--text-heading)' }}>
                  {o.q}
                </p>
                <Body style={{ marginTop: 'var(--space-4)' }}>{o.line}</Body>
              </Link>
            </Card>
          ))}
        </Cols>
        <TextCTA to="/en/use-cases">View all use cases</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>{c.q}</Headline>
        <Lead dark>
          Tell us the context. We’ll respond with the right starting point, not a
          sales sequence.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/contact">{c.cta}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
