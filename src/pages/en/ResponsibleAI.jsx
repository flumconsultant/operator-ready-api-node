import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA } from '../../components/ui.jsx';

/**
 * IA responsable.
 *
 * Tiene dirección propia y no es una sección más de Nosotros por una razón
 * práctica: es la página que alguien reenvía dentro de su empresa cuando le
 * preguntan «¿y esto quién lo controla?». Un ancla no se comparte igual.
 *
 * Lo que NO hay aquí, a propósito: certificaciones, sellos ni cumplimiento
 * declarado de normas concretas. Eso se acredita, no se escribe.
 */

const CONTROLES = [
  ['Data use and access',
   'What information goes in, where it comes from, who can see it and what for. Defined before building, not once it’s already running.'],
  ['Privacy and security',
   'Handling of personal and sensitive data, encryption, retention and isolation to fit each company’s environment.'],
  ['Output evaluation',
   'What counts as an acceptable answer and how that gets checked. Without a threshold, “it works well” is an opinion.'],
  ['Human validation',
   'Where a person reviews, approves or corrects before anything takes effect. The higher the risk, the closer that point sits to the end.'],
  ['Escalation and exceptions',
   'What happens to the cases that don’t fit: who they reach, how fast, and with what context.'],
  ['Traceability',
   'What gets recorded about each assisted decision, so it’s possible to reconstruct afterwards why what happened happened.'],
  ['Named owners',
   'Who answers for the operation and who for the business result. A control with no owner is a document.'],
  ['Continuous monitoring',
   'How often behavior gets reviewed, who reviews it, and what triggers a change.'],
];

export default function ResponsibleAI() {
  return (
    <>
      <SiteHeader />
      <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
        <Section band="dark" pad="var(--space-12)" data-node-state="0">
          <Kicker dark>Responsible AI</Kicker>
          <Headline as="h1" dark>Controls get designed with the solution, not bolted on at the end.</Headline>
          <Lead dark>
            Responsible AI is designed into the work. We define appropriate data use,
            access, human oversight, evaluation, escalation, traceability and
            ownership according to the use case and its risk profile.
          </Lead>
        </Section>

        <Section band="light">
          <Kicker>Why up front</Kicker>
          <Headline>A control added afterwards doesn’t change how decisions get made.</Headline>
          <Lead>
            When boundaries get written after the solution already works, they become a
            review layer that slows the work down and that people learn to route around.
            Defined up front, they’re part of how it’s built: the system can’t do what it
            has no permission to do.
          </Lead>
          <Body style={{ marginTop: 'var(--space-7)' }}>
            Not every case needs the same thing. An assistant drafting an internal memo
            and an agent acting on a production system carry different risk profiles, and
            therefore different controls. What doesn’t change is that they’re decided and
            written down before anything gets built.
          </Body>
        </Section>

        <Section band="sunken">
          <Kicker>What gets defined in every case</Kicker>
          <Headline>Eight decisions, always the same ones.</Headline>
          <div data-cols style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)', marginTop: 'var(--space-10)' }}>
            {CONTROLES.map(([nombre, linea], i) => (
              <Reveal as="div" key={nombre} style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-5)' }}>
                <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', color: 'var(--text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--navy-950)' }}>
                  {nombre}
                </h2>
                <Body style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section band="darker" pad="var(--space-13)">
          <Kicker dark>Accountability isn’t delegated to the system</Kicker>
          <Headline dark>AI extends capability; people keep direction and accountability.</Headline>
          <Lead dark>
            Tell us the case and its risk profile. We’ll tell you which controls it needs
            before a line of code gets written.
          </Lead>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <PrimaryCTA to="/en/contact">Talk to us about your case</PrimaryCTA>
            <GhostCTA to="/en/about" dark>About BECOME</GhostCTA>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
