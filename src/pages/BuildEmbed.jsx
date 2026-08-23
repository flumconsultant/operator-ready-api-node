import { campo, listasDe } from '../content/paginas/index.js';
import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Ico } from '../components/icons.jsx';
import { Banner } from '../components/Media.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../components/ui.jsx';
import { BajoElCapo } from '../components/tecnologia.jsx';

/**
 * BECOME EMBED™ (§9 del documento).
 *
 * La página entera gira alrededor de una distinción: prototype no es capacidad.
 * Por eso adopción, controles y medición aparecen antes que la construcción —
 * son lo que separa una demo de algo que sigue funcionando en marzo.
 */

const LISTAS = listasDe('embed');

const BUILDABLE = LISTAS.BUILDABLE;

const STAGES = LISTAS.STAGES;

const DELIVERABLES = LISTAS.DELIVERABLES;

const CONTROLS = LISTAS.CONTROLS;

const TOOLS = LISTAS.TOOLS;

export default function BuildEmbed() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>{campo('embed', 's1kicker')}</Kicker>
        <Headline as="h1" dark>{campo('embed', 's1headline')}</Headline>
        <Lead dark>{campo('embed', 's1lead')}</Lead>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>{campo('embed', 's1body')}</Body>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Conversemos sobre BECOME EMBED™</PrimaryCTA>
          <GhostCTA to="/es/servicios" dark>Ver los dos servicios</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>{campo('embed', 's2kicker')}</Kicker>
        <Headline>{campo('embed', 's2headline')}</Headline>
        <Lead>{campo('embed', 's2lead')}</Lead>
        <Body>{campo('embed', 's2body')}</Body>
      </Section>

      <Section band="dark">
        <Kicker dark>{campo('embed', 's3kicker')}</Kicker>
        <Headline dark>{campo('embed', 's3headline')}</Headline>
        <Cols min="250px">
          {BUILDABLE.map(([icon, name, line]) => (
            <Card dark key={name}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)', marginBottom: 'var(--space-5)' }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Card>
          ))}
        </Cols>
      </Section>

      <Banner variant="streams" seed={31} height="clamp(260px, 32vw, 380px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '26ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          Del diseño a la operación.
        </Reveal>
      </Banner>

      <Section band="light">
        <Kicker>{campo('embed', 's4kicker')}</Kicker>
        <Headline>{campo('embed', 's4headline')}</Headline>
        <Body>{campo('embed', 's4body')}</Body>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {STAGES.map(([letter, name, work, out]) => (
            <Reveal
              as="div" key={name} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1.2fr) minmax(0,1fr)',
                gap: 'var(--space-6)', padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-accent)' }}>{letter}</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{name}</h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{work}</p>
              <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--text-accent)' }}>Resultado: </span>{out}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <BajoElCapo lang="es" />

      {/* Human-in-the-loop antes que la construcción: es lo que decide el destino */}

      <Section band="darker">
        <Kicker dark>{campo('embed', 's5kicker')}</Kicker>
        <Headline dark>{campo('embed', 's5headline')}</Headline>
        <Lead dark>{campo('embed', 's5lead')}</Lead>
        <Cols min="250px">
          {CONTROLS.map(([icon, name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)', marginBottom: 'var(--space-5)' }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="sunken">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>{campo('embed', 's6kicker')}</Kicker>
            <Headline>{campo('embed', 's6headline')}</Headline>
            <Body>{campo('embed', 's6body')}</Body>
            <TextCTA to="/es/nosotros">Cómo trabajamos</TextCTA>
          </Reveal>
          <Reveal as="div">
            <Kicker>{campo('embed', 's7kicker')}</Kicker>
            <div style={{ marginTop: 'var(--space-6)' }}>
              {TOOLS.map(([t, d], i) => <IndexRow key={t} index={i} term={t} def={d} />)}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>{campo('embed', 's8kicker')}</Kicker>
        <Headline dark>{campo('embed', 's8headline')}</Headline>
        <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)', maxWidth: '62ch' }}>
          {DELIVERABLES.map((d) => (
            <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
              <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>—</span>
              <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{d}</span>
            </li>
          ))}
        </ul>
        <Reveal as="p" style={{ margin: 'var(--space-10) 0 0', font: 'var(--type-lead)', color: 'var(--white)', maxWidth: '54ch' }}>
          El sprint termina con una capacidad funcionando en un entorno real, con
          un responsable claro, controles y medición frente a resultados de negocio.
        </Reveal>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>{campo('embed', 's9kicker')}</Kicker>
        <Headline dark>{campo('embed', 's9headline')}</Headline>
        <Lead dark>{campo('embed', 's9lead')}</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Inicia una conversación de Build</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
