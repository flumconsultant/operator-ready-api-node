import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Ico } from '../components/icons.jsx';
import { Banner } from '../components/Media.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../components/ui.jsx';

/**
 * BECOME EMBED™ (§9 del documento).
 *
 * La página entera gira alrededor de una distinción: prototype no es capacidad.
 * Por eso adopción, controles y medición aparecen antes que la construcción —
 * son lo que separa una demo de algo que sigue funcionando en marzo.
 */

const BUILDABLE = [
  ['flow', 'Proceso AI-native', 'Un proceso rediseñado de principio a fin, con personas y agentes trabajando juntos.'],
  ['agents', 'Agent o copilot', 'Una capacidad con límites de autonomía, integración y accountability explícitos.'],
  ['decision', 'Decision system', 'El flujo de información y la decisión de alto valor que lo consume.'],
  ['product', 'AI-native product', 'Una experiencia nueva para clientes o colaboradores, con su operación detrás.'],
];

const STAGES = [
  ['O', 'Operating Model Design', 'Valida el diseño: roles, agentes, datos, decisiones, excepciones y controles.', 'Agentic Workflow Blueprint™ validado.'],
  ['M', 'Make & Embed', 'Construye, integra y lleva a un entorno real con adopción acompañada.', 'Capacidad funcionando, con un responsable claro.'],
  ['E', 'Expand & Evolve', 'Mide, gobierna, transfiere y decide si iterar, integrar, escalar o detener.', 'Scorecard y scale decision.'],
];

const DELIVERABLES = [
  'Proceso y diseño de la capacidad validados.',
  'Agente, producto o sistema de decisión funcionando.',
  'Modelo de supervisión humana y controles operativos.',
  'Plan de adopción y transferencia de capacidades.',
  'Cuadro de mando de desempeño, riesgo y valor.',
];

const CONTROLS = [
  ['risk', 'Autonomy boundaries', 'Qué decide el sistema y qué conserva siempre una persona.'],
  ['flow', 'Exception paths', 'Qué ocurre con lo que no encaja, y quién es responsable de resolverlo.'],
  ['quality', 'Quality criteria', 'Cómo se sabe que una salida es aceptable antes de que llegue al cliente.'],
  ['balance', 'Permissions y trazabilidad', 'Quién puede hacer qué, y cómo se reconstruye una decisión después.'],
];

const TOOLS = [
  ['Agentic Workflow Blueprint™', 'Diseñar roles, agentes, datos, decisiones, excepciones y controles.'],
  ['Embed Scorecard™', 'Medir uso, confianza, desempeño, control y valor.'],
  ['Scale Readiness Gate™', 'Decidir si iterar, integrar, escalar o detener.'],
];

export default function BuildEmbed() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME Embed™</Kicker>
        <Headline as="h1" dark>Construye la solución. Incorpora el cambio.</Headline>
        <Lead dark>
          De ocho a doce semanas para construir una solución de IA priorizada y
          dejarla funcionando dentro de la operación, con el equipo que va a
          usarla todos los días.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Conversemos sobre BECOME EMBED™</PrimaryCTA>
          <GhostCTA to="/es/servicios" dark>Ver los dos servicios</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>El problema</Kicker>
        <Headline>Prototypes que nunca se convierten en capacidad operativa.</Headline>
        <Lead>
          El piloto funciona en la demo y desaparece en la operación. No falla el
          modelo: falla que se construyó al lado del trabajo real en vez de dentro.
        </Lead>
        <Body>
          Al terminar el proyecto nadie es dueño del resultado, el proceso sigue
          igual y no hay una medida contra la que decidir si merece escalarse.
        </Body>
      </Section>

      <Section band="dark">
        <Kicker dark>Qué puede construirse</Kicker>
        <Headline dark>Cuatro formas de capacidad, un mismo estándar.</Headline>
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
        <Kicker>El recorrido</Kicker>
        <Headline>BECOME EMBED™ cubre O–M–E del framework.</Headline>
        <Body>
          Puede empezar desde un diseño que ya exista, si cumple los criterios
          mínimos; no exige haber hecho BECOME DISCOVER™ con nosotros.
        </Body>
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
                <span style={{ color: 'var(--text-accent)' }}>Output: </span>{out}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Human-in-the-loop antes que la construcción: es lo que decide el destino */}
      <Section band="darker">
        <Kicker dark>Supervisión humana y controles</Kicker>
        <Headline dark>Lo que decide el destino de un agent no es la calidad de sus respuestas.</Headline>
        <Lead dark>
          Es quién responde cuando se equivoca y qué pasa con los casos que no
          encajan. Esas cuatro decisiones se toman antes de escribir la primera línea.
        </Lead>
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
            <Kicker>Adopción y transferencia de capacidades</Kicker>
            <Headline>El trabajo termina cuando la capacidad pertenece a la empresa.</Headline>
            <Body>
              La transferencia no es una sesión de formación al final: el equipo que
              va a operar la capacidad participa en su diseño y en su construcción.
              Es la diferencia entre heredar algo y recibirlo.
            </Body>
            <TextCTA to="/es/nosotros">Cómo trabajamos</TextCTA>
          </Reveal>
          <Reveal as="div">
            <Kicker>Proprietary tools</Kicker>
            <div style={{ marginTop: 'var(--space-6)' }}>
              {TOOLS.map(([t, d], i) => <IndexRow key={t} index={i} term={t} def={d} />)}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>Entregables</Kicker>
        <Headline dark>Qué queda al terminar el sprint.</Headline>
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
        <Kicker dark>Pasa del diseño a una capacidad incorporada</Kicker>
        <Headline dark>Trae un proceso, una decisión o una oportunidad de producto prioritaria.</Headline>
        <Lead dark>Definiremos el camino de construcción correcto — o si todavía falta un paso antes.</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Inicia una conversación de Build</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
