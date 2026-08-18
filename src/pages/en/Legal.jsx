import React from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA } from '../../components/ui.jsx';

const PAGES = {
  privacy: {
    kicker: 'Legal',
    title: 'Privacy policy',
    lead: 'How BECOME handles the personal data it receives through this site.',
  },
  terms: {
    kicker: 'Legal',
    title: 'Terms of use',
    lead: 'The conditions under which this site’s content is offered.',
  },
};

export default function Legal({ page }) {
  const p = PAGES[page] || PAGES.privacy;

  return (
    <main id="content" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-11)">
        <Kicker dark>{p.kicker}</Kicker>
        <Headline as="h1" dark>{p.title}</Headline>
        <Lead dark>{p.lead}</Lead>
      </Section>

      <Section band="light">
        <div style={{ maxWidth: 'var(--maxw-prose)' }}>
          <Body style={{ marginTop: 0, font: 'var(--type-lead)', color: 'var(--text-heading)' }}>
            This text is pending legal drafting.
          </Body>
          <Body>
            We won’t publish a generic template here. A privacy policy and terms
            of use bind the company toward whoever reads them and toward
            applicable data-protection law, so the final content is drafted by
            legal counsel with the real detail of what data is collected, on what
            legal basis, where it’s stored, for how long, and who processes it.
          </Body>
          <Body>
            In the meantime, if you need to know how we handle the information
            you send us through the contact form, write to us and we’ll explain
            it in writing.
          </Body>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <PrimaryCTA href="mailto:hello@meetbecome.com">Write to us</PrimaryCTA>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
