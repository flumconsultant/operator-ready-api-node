import { campo, listasDe } from '../content/paginas/index.js';
import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, Cols } from '../components/ui.jsx';

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

const LISTAS = listasDe('ia-responsable');

const CONTROLES = LISTAS.CONTROLES;

export default function IaResponsable() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
        <Section band="dark" pad="var(--space-12)" data-node-state="0">
          <Kicker dark>{campo('ia-responsable', 's1kicker')}</Kicker>
          <Headline as="h1" dark>{campo('ia-responsable', 's1headline')}</Headline>
          <Lead dark>{campo('ia-responsable', 's1lead')}</Lead>
        </Section>

        <Section band="light">
          <Kicker>{campo('ia-responsable', 's2kicker')}</Kicker>
          <Headline>{campo('ia-responsable', 's2headline')}</Headline>
          <Lead>{campo('ia-responsable', 's2lead')}</Lead>
          <Body style={{ marginTop: 'var(--space-7)' }}>{campo('ia-responsable', 's2body')}</Body>
        </Section>

        <Section band="sunken">
          <Kicker>{campo('ia-responsable', 's3kicker')}</Kicker>
          <Headline>{campo('ia-responsable', 's3headline')}</Headline>
          {/* Rejilla a mano no: ocho controles en tres columnas dejaban la
              última fila con dos y un hueco. <Cols> reparte 3, 3 y 2 estirando
              las tres filas hasta el borde. */}
          <Cols min="280px">
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
          </Cols>
        </Section>

        <Section band="darker" pad="var(--space-13)">
          <Kicker dark>{campo('ia-responsable', 's4kicker')}</Kicker>
          <Headline dark>{campo('ia-responsable', 's4headline')}</Headline>
          <Lead dark>{campo('ia-responsable', 's4lead')}</Lead>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <PrimaryCTA to="/es/contacto">Hablemos de tu caso</PrimaryCTA>
            <GhostCTA to="/es/nosotros" dark>Conoce BECOME</GhostCTA>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
