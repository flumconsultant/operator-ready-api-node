import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import Reveal from '../../components/Reveal.jsx';
import ConversationalForm from '../../components/ConversationalForm.jsx';
import { Section, Kicker, Headline, Lead, Body, GhostCTA } from '../../components/ui.jsx';
import { Ico, IcoBadge } from '../../components/icons.jsx';

const FIELDS = [
  { name: 'name', short: 'Name', label: 'What’s your name?', required: true, autoComplete: 'name' },
  { name: 'email', short: 'Email', label: 'Your work email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'company', short: 'Company', label: 'Where do you work?', required: true, autoComplete: 'organization' },
  { name: 'role', short: 'Role', label: 'What’s your role?', required: true, autoComplete: 'organization-title' },
  {
    name: 'change', short: 'What must change', label: 'What needs to change?', type: 'textarea', required: true, wide: true,
    help: 'The business outcome, the capability or the workflow you need to transform. No formalities needed.',
  },
  {
    name: 'stage', short: 'Current stage', label: 'What stage are you at today?', type: 'select',
    options: [
      'Defining strategy',
      'Prioritizing opportunities',
      'Designing the operating model',
      'Building a capability',
      'Scaling an existing solution',
    ],
    default: 'Defining strategy',
  },
  { name: 'timeline', short: 'Timeline', label: 'By when?', placeholder: 'For example: this quarter' },
];

const NEXT = [
  ['signpost', 'We read your context', 'We map it to the stages of the BECOME framework to know where it comes in.'],
  ['calendar', '30-minute conversation', 'Focused on the business outcome and the constraints you have today.'],
  ['target', 'We define the first step', 'BECOME NOW™, Discovery or Build & Embed. Whichever fits, not the biggest one.'],
];

export default function Contacto() {
  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Start a conversation</Kicker>
        <Headline as="h1" dark>What needs to change inside your company?</Headline>
        <Lead dark>
          The business outcome, the capability or the workflow. We respond with
          the right starting point, not a sales sequence.
        </Lead>
      </Section>

      <Section band="light">
        <ConversationalForm
          formName="Start a conversation with BECOME"
          title="Tell us in a conversation, not a form."
          lead="Seven questions, one at a time, full screen. No procurement fields, no pre-checked boxes."
          launchLabel="Start the conversation"
          fields={FIELDS}
          submitLabel="Start the conversation"
          confirmation="Thanks. We’ll review the context and respond with the right conversation, not an automated sales sequence."
          dark={false}
          lang="en"
        />
      </Section>

      <Section band="sunken">
        <Kicker>What happens next</Kicker>
        <Headline>Three steps, and none of them is a sales sequence.</Headline>
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-8)', marginTop: 'var(--space-10)' }}>
          {NEXT.map(([icon, title, line], i) => (
            <Reveal as="div" key={title} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <IcoBadge name={icon} />
              <p style={{ margin: 'var(--space-5) 0 0', font: 'var(--type-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-accent)' }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {title}
              </h3>
              <Body>{line}</Body>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline)', display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
          <GhostCTA to="/en/use-cases">See where to start first</GhostCTA>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, font: 'var(--type-body)', color: 'var(--text-muted)' }}>
            <Ico name="chat" size={20} style={{ color: 'var(--text-accent)' }} />
            Or write to us at{' '}
            <a href="mailto:hello@meetbecome.com" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 24, color: 'var(--text-accent)' }}>hello@meetbecome.com</a>
          </span>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
