import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Card, Cols } from '../components/ui.jsx';

/**
 * Landing de servicios.
 *
 * Su función no es listar dos engagements —eso ya lo hace el desplegable— sino
 * explicar el journey completo antes de pedirle a nadie que elija. Por eso el
 * eje de la página es la secuencia DEFINE → DESIGN → BUILD → EMBED → SCALE, y
 * los dos servicios aparecen como tramos de ese eje, no como dos tarjetas
 * intercambiables.
 */

const JOURNEY = [
  { n: '01', step: 'Define', who: 'AI-Native Transformation Discovery', q: '¿Dónde está el valor y qué debe cambiar?', out: 'Ambition, diagnostic y priority choices.' },
  { n: '02', step: 'Design', who: 'Punto de conexión', q: '¿Cómo debe operar el modelo futuro?', out: 'Target operating model y transformation blueprint.' },
  { n: '03', step: 'Build', who: 'Build & Embed Sprint', q: '¿Qué capability debe existir y cómo funcionará?', out: 'Workflow, agent, copilot, product o decision system.' },
  { n: '04', step: 'Embed', who: 'Build & Embed Sprint', q: '¿Cómo se incorpora con adopción y control?', out: 'Ownership, human-in-the-loop, controls y scorecard.' },
  { n: '05', step: 'Scale', who: 'Evolución posterior', q: '¿Está lista para expandirse?', out: 'Scale decision y evolution backlog.' },
];

const COMPARE = [
  ['Úsalo cuando', 'Falta claridad estratégica, priorización o diseño del modelo futuro.', 'Existe una oportunidad priorizada y condiciones para construir.'],
  ['Duración', '8–12 semanas.', '8–12 semanas por capability.'],
  ['Comienza con', 'Ambición, tensión empresarial o dominio a transformar.', 'Blueprint validable, workflow o opportunity priorizada.'],
  ['Termina con', 'Strategy, portfolio, target state, business case y roadmap.', 'Capability funcionando, adoptada, controlada y medida.'],
  ['Framework', 'B–E–C–O.', 'O–M–E.'],
  ['Siguiente paso', 'Build & Embed del primer caso priorizado.', 'Iterar, integrar, escalar o detener.'],
];

export default function Servicios() {
  return (
    <div data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Our services</Kicker>
        <Headline as="h1" dark>De la ambición a una capability que funciona.</Headline>
        <Lead dark>
          Dos engagements conectan AI-native strategy, operating-model design,
          building, adoption y scale.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/casos-de-uso">Encuentra tu punto de partida</PrimaryCTA>
          <GhostCTA to="/es/contacto" dark>Conversemos</GhostCTA>
        </div>
      </Section>

      {/* El journey primero: los servicios se entienden como tramos de un eje */}
      <Section band="light">
        <Kicker>El journey</Kicker>
        <Headline>Un solo eje. Dos engagements que lo recorren.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {JOURNEY.map((j) => (
            <Reveal
              as="div"
              key={j.n}
              data-cols
              style={{
                display: 'grid',
                gridTemplateColumns: '72px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.1fr)',
                gap: 'var(--space-6)',
                padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)',
                alignItems: 'start',
              }}
            >
              <span style={{ font: 'var(--type-mono)', color: 'var(--text-accent)' }}>{j.n}</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                  {j.step}
                </h3>
                <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-faint)' }}>{j.who}</p>
              </div>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{j.q}</p>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)' }}>{j.out}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>Our offer</Kicker>
        <Headline dark>Dos servicios. Un journey de transformación.</Headline>
        <Cols min="300px">
          <Card dark>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>8–12 semanas</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              AI-Native Transformation Discovery
            </h3>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Alinea la ambición. Diagnostica la empresa. Identifica el valor. Diseña
              el operating model y el roadmap necesarios para avanzar.
            </Body>
            <TextCTA to="/es/servicios/transformation-discovery" dark>Explora Discovery</TextCTA>
          </Card>
          <Card dark>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>8–12 semanas por capability</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              Build &amp; Embed Sprint
            </h3>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Diseña, construye e incorpora un AI-native workflow, agent o product
              dentro de la operación, con adopción, controles y medición desde el inicio.
            </Body>
            <TextCTA to="/es/servicios/build-and-embed" dark>Explora Build &amp; Embed</TextCTA>
          </Card>
        </Cols>
      </Section>

      <Section band="light">
        <Kicker>Comparación</Kicker>
        <Headline>Cuál necesitas y por qué.</Headline>
        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th scope="col" style={{ ...th, width: '18%' }} />
                <th scope="col" style={th}>AI-Native Transformation Discovery</th>
                <th scope="col" style={th}>Build &amp; Embed Sprint</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, a, b]) => (
                <tr key={label}>
                  <th scope="row" style={{ ...td, color: 'var(--text-muted)', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase' }}>{label}</th>
                  <td style={td}>{a}</td>
                  <td style={td}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section band="sunken">
        <Kicker>Selector de fit</Kicker>
        <Headline>En una frase.</Headline>
        <Cols min="260px">
          <Card>
            <Body style={{ marginTop: 0, color: 'var(--text-body)' }}>
              Si buscas <strong>definir dirección, priorizar inversiones o diseñar el
              operating model</strong>, necesitas AI-Native Transformation Discovery.
            </Body>
          </Card>
          <Card>
            <Body style={{ marginTop: 0, color: 'var(--text-body)' }}>
              Si ya sabes <strong>qué capability construir</strong> y necesitas llevarla
              a la operación, necesitas Build &amp; Embed Sprint.
            </Body>
          </Card>
          <Card>
            <Body style={{ marginTop: 0, color: 'var(--text-body)' }}>
              Si tienes una oportunidad pero <strong>no un blueprint validado</strong>,
              evaluamos un short readiness gate antes de recomendar Build &amp; Embed.
            </Body>
          </Card>
        </Cols>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>No empieces por el servicio. Empieza por la decisión que necesitas tomar.</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Cuéntanos qué debe cambiar</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}

const th = {
  padding: 'var(--space-4) var(--space-5) var(--space-4) 0',
  borderBottom: '1px solid var(--border-strong)',
  fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
  fontSize: 'var(--text-h3)', color: 'var(--text-heading)', textAlign: 'left',
};
const td = {
  padding: 'var(--space-5) var(--space-5) var(--space-5) 0',
  borderBottom: '1px solid var(--border-hairline)',
  font: 'var(--type-body)', fontSize: 'var(--text-body-md)',
  color: 'var(--text-body)', verticalAlign: 'top', textAlign: 'left',
};
