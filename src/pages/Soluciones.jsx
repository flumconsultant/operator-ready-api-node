import { campo } from '../content/paginas/index.js';
import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, IndexRow } from '../components/ui.jsx';
import { Banner } from '../components/Media.jsx';
import KineticGrid from '../components/KineticGrid.jsx';
import { SOLUCIONES_MENU } from '../site.js';
import { ORIENTATION } from '../content/soluciones.js';

/**
 * Hub de casos de uso.
 *
 * No es una galería de tecnologías ni un archivo de case studies: es una capa
 * de orientación que empieza por la pregunta del visitante. De ahí que las seis
 * entradas sean preguntas y no nombres de solución — nadie busca "agentic
 * workflow redesign", busca que su proceso deje de ir lento.
 */
export default function Soluciones() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      {/* La retícula reacciona al puntero, así que va en la página donde hay
          que elegir entre seis opciones: el fondo confirma que esto responde a
          ti. Debajo de un párrafo largo sería ruido moviéndose. */}
      <Section band="dark" pad="var(--space-13)" backdrop={<KineticGrid />} scrim="soft">
        <Kicker dark>{campo('soluciones', 's1kicker')}</Kicker>
        <Headline as="h1" dark>{campo('soluciones', 's1headline')}</Headline>
        <Lead dark>{campo('soluciones', 's1lead')}</Lead>
      </Section>

      <Section band="light">
        <Kicker>{campo('soluciones', 's2kicker')}</Kicker>
        <Headline>{campo('soluciones', 's2headline')}</Headline>
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
          Del síntoma a la decisión.
        </Reveal>
      </Banner>

      {/* El mapa de orientación: síntoma → necesidad real → engagement. Es lo
          que evita que la elección dependa de intuición comercial. */}
      <Section band="darker">
        <Kicker dark>{campo('soluciones', 's3kicker')}</Kicker>
        <Headline dark>{campo('soluciones', 's3headline')}</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>{campo('soluciones', 's3body')}</Body>

        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                {['Pregunta', 'Lo que suele ocurrir', 'Lo que se necesita', 'Servicio'].map((h) => (
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
          <Kicker>{campo('soluciones', 's4kicker')}</Kicker>
          <Headline>{campo('soluciones', 's4headline')}</Headline>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <PrimaryCTA to="/es/contacto">Cuéntanos qué debe cambiar</PrimaryCTA>
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
