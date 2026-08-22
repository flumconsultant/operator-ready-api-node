import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Ico } from '../../components/icons.jsx';
import { Split } from '../../components/Media.jsx';
import Equipo from '../../components/Equipo.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, Cols } from '../../components/ui.jsx';


const CULTURE = [
  ['outcome', 'Think in outcomes', 'We ask what decision, behavior or business result must change before we talk technology.'],
  ['inspect', 'Go inside the system', 'We look for the cause inside the operating model, not a surface fix for the symptom.'],
  ['together', 'Build with, not for', 'We design and build together with the people who will operate the capability.'],
  ['idea', 'Stay curious, stay precise', 'We explore possibilities without mistaking exploration for evidence.'],
  ['trust', 'Earn trust', 'We make limits, risks, assumptions, controls and decisions visible.'],
  ['capability', 'Leave capability behind', 'The work must increase the client’s autonomy, not their dependence on BECOME.'],
];

const DELIVERY = [
  'One accountable lead per engagement.',
  'Client team integrated from the start.',
  'Decisions and risks kept visible.',
  'Working software or usable artifacts, not just presentations.',
  'Capability transfer included in scope.',
  'Governance and responsible AI built into delivery.',
];

export default function Nosotros() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>About BECOME</Kicker>
        <Headline as="h1" dark>The next company already exists inside yours.</Headline>
        <Lead dark>
          BECOME is an AI-native transformation company built to connect
          strategy, operating-model design, building and adoption in one system.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/how-we-transform">See how we work</PrimaryCTA>
        </div>
      </Section>

      <Section id="about-become" band="light">
        <Kicker>What BECOME is</Kicker>
        <Headline>We don’t show up to add another tool.</Headline>
        <Lead>
          We help companies redesign how they operate, decide and create value
          around AI. We work inside the business to turn an ambition into a
          capability of its own — governable and able to evolve.
        </Lead>
        <Cols min="240px">
          {[
            ['work', 'Category', 'AI-native transformation company.'],
            ['target', 'Promise', 'Become what comes next.'],
            ['idea', 'Philosophy', 'The transformation happens inside.'],
          ].map(([icon, label, value]) => (
            <Reveal as="div" key={label} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={26} style={{ color: 'var(--text-accent)', marginBottom: 'var(--space-5)' }} />
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
              <p style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{value}</p>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="light">
        <Split
          src="/images/17-team-collab.webp"
          alt="Client team working alongside the BECOME team"
          ratio="1 / 1"
          media="0.78fr"
        >
          <Kicker>What we believe</Kicker>
          <Headline>Transformation doesn’t get installed. It gets built inside.</Headline>
          <Lead>
            Isolated pilots don’t change a company. Change happens when workflows,
            roles, decision rights, data, controls, skills and measures are
            redesigned as a single operating system.
          </Lead>
          <Body>
            That’s why we build with the client’s teams and transfer ownership
            from the start.
          </Body>
        </Split>
      </Section>

      <Section band="darker">
        <Kicker dark>How we work</Kicker>
        <Headline dark>Observable behaviors, not aspirational adjectives.</Headline>
        <Cols min="300px">
          {CULTURE.map(([icon, name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)', marginBottom: 'var(--space-5)' }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section id="how-we-work" band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>The delivery team</Kicker>
            <Headline>A senior, multidisciplinary team around the outcome.</Headline>
            <Body>
              The mix combines business, transformation, product, adoption, data and
              AI according to what the challenge needs. Every engagement keeps one
              clear owner.
            </Body>
          </Reveal>
          <Reveal as="ul" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            {DELIVERY.map((d) => (
              <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline)' }}>
                <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{d}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      <Equipo lang="en" id="team" />

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>The next capability is built from the inside</Kicker>
        <Headline dark>Tell us what needs to change in your company.</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/en/contact">Contact us</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
