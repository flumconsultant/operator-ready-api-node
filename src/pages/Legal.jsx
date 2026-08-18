import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA } from '../components/ui.jsx';

/**
 * Privacidad y Términos.
 *
 * A propósito NO llevan texto legal. Redactar una política de privacidad
 * plausible es fácil y es exactamente el tipo de contenido que no debe
 * inventarse: obliga a la empresa ante RGPD y ante quien la lea. Estas páginas
 * existen para que los enlaces del pie no den 404 y dicen la verdad — que el
 * texto está pendiente de asesoría — en lugar de rellenar con plantilla.
 *
 * Cuando llegue el texto definitivo, sustituye el cuerpo. La estructura, el
 * head y el enlace desde el pie ya están.
 */

const PAGES = {
  privacidad: {
    kicker: 'Legal',
    title: 'Política de privacidad',
    lead: 'Cómo BECOME trata los datos personales que recibe a través de este sitio.',
  },
  terminos: {
    kicker: 'Legal',
    title: 'Términos de uso',
    lead: 'Condiciones bajo las que se ofrece el contenido de este sitio.',
  },
};

export default function Legal({ page }) {
  const p = PAGES[page] || PAGES.privacidad;

  return (
    <div data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-11)">
        <Kicker dark>{p.kicker}</Kicker>
        <Headline as="h1" dark>{p.title}</Headline>
        <Lead dark>{p.lead}</Lead>
      </Section>

      <Section band="light">
        <div style={{ maxWidth: 'var(--maxw-prose)' }}>
          <Body style={{ marginTop: 0, font: 'var(--type-lead)', color: 'var(--text-heading)' }}>
            Este texto está pendiente de redacción legal.
          </Body>
          <Body>
            No publicamos aquí una plantilla genérica. Una política de privacidad
            y unos términos de uso obligan a la empresa ante quien los lee y ante
            el RGPD, así que el contenido definitivo lo redacta asesoría legal con
            el detalle real de qué datos se recogen, con qué base jurídica, dónde
            se guardan, cuánto tiempo y quién los trata.
          </Body>
          <Body>
            Mientras tanto, si necesitas saber cómo tratamos la información que nos
            envías por el formulario de contacto, escríbenos y te lo explicamos por
            escrito.
          </Body>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <PrimaryCTA href="mailto:hello@become.company">Escríbenos</PrimaryCTA>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
