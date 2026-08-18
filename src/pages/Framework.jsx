import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, TextCTA, Cols, Card, IndexRow } from '../components/ui.jsx';

/**
 * BECOME™ Transformation Framework (§10 del documento).
 *
 * El riesgo de esta página es convertir el framework en seis letras decorativas.
 * Se evita de dos maneras: cada etapa dice qué trabajo hace y qué output
 * produce, y los cuatro dominios aparecen atravesando las seis etapas en lugar
 * de como una lista aparte.
 */

const STAGES = [
  ['B', 'Business Ambition', 'Define en qué debe convertirse la empresa y qué outcomes importan.', 'AI-native ambition y tesis estratégica.', 'Discovery'],
  ['E', 'Enterprise Discovery', 'Comprende cómo funciona hoy y qué limita el cambio.', 'Enterprise diagnostic y readiness.', 'Discovery'],
  ['C', 'Capability Choices', 'Prioriza dónde la IA puede crear valor diferencial.', 'Value pools y portafolio priorizado.', 'Discovery'],
  ['O', 'Operating Model Design', 'Diseña el sistema futuro.', 'Target operating model y blueprint.', 'Punto de transición'],
  ['M', 'Make & Embed', 'Construye e incorpora la capability.', 'Capability funcionando con controles.', 'Build & Embed'],
  ['E', 'Expand & Evolve', 'Mide, gobierna, transfiere y escala.', 'Scorecard y scale decision.', 'Build & Embed'],
];

const DOMAINS = [
  ['People, inside.', 'Liderazgo, roles, skills y adopción diseñados para el trabajo entre personas e IA.', '/icons/people-inside-white.webp'],
  ['Data, inside.', 'Contexto y conocimiento convertidos en decisiones y acción.', '/icons/data-inside-white.webp'],
  ['Agents, inside.', 'Copilots y agents incorporados en workflows reales, con supervisión humana definida.', '/icons/agents-inside-white.webp'],
  ['Operations, inside.', 'Procesos, governance y performance rediseñados para crear valor a escala.', '/icons/operations-inside-white.webp'],
];

const TOOLS = [
  ['Business Ambition Canvas™', 'Alinear al equipo ejecutivo alrededor de outcomes y strategic choices.'],
  ['Inside Readiness Index™', 'Evaluar madurez en People, Data, Agents y Operations.'],
  ['AI-Native Value Map™', 'Priorizar oportunidades por valor, feasibility, velocidad y riesgo.'],
  ['Inside Target State Canvas™', 'Definir el target operating model y transformation blueprint.'],
  ['Agentic Workflow Blueprint™', 'Diseñar roles, agents, datos, decisiones, excepciones y controles.'],
  ['Embed Scorecard™', 'Medir uso, confianza, performance, control y valor.'],
  ['Scale Readiness Gate™', 'Decidir si iterar, integrar, escalar o detener.'],
];

const GOVERNANCE = [
  ['Human accountability', 'La IA amplía la capacidad; las personas mantienen dirección, supervisión y responsabilidad.'],
  ['Decisiones visibles', 'Límites, riesgos, assumptions y controles se hacen explícitos, no se asumen.'],
  ['Medir el cambio', 'Se mide lo que cambia en el negocio, no cuánta IA se ha implementado.'],
  ['Puertas, no inercia', 'Escalar es una decisión que se toma con evidencia, con la opción real de detener.'],
];

export default function Framework() {
  return (
    <div data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME™ Transformation Framework</Kicker>
        <Headline as="h1" dark>Un sistema para convertirse en una empresa AI-native.</Headline>
        <Lead dark>
          Seis etapas conectan ambition, discovery, capability choices,
          operating-model design, construcción y escala.
        </Lead>
      </Section>

      <Section band="light">
        <Kicker>La tesis</Kicker>
        <Headline>La transformación no se instala. Se construye dentro.</Headline>
        <Lead>
          Los pilotos aislados no cambian una empresa. El cambio ocurre cuando se
          rediseñan workflows, roles, decision rights, data, controls, skills y
          measures como un solo operating system.
        </Lead>
        <Body>
          El framework existe para que ese rediseño tenga una secuencia. No es un
          método de consultoría para justificar fases: es el orden en el que las
          decisiones dependen unas de otras.
        </Body>
      </Section>

      <Section band="dark">
        <Kicker dark>La secuencia</Kicker>
        <Headline dark>B — E — C — O — M — E</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {STAGES.map(([letter, name, work, out, service], i) => (
            <Reveal
              as="div" key={name + i} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1.2fr) minmax(0,0.9fr) minmax(0,0.7fr)',
                gap: 'var(--space-6)', padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline-dark)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--electric-green)' }}>{letter}</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>
                <span className="sr-only">{`Etapa ${i + 1}: `}</span>{name}
              </h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>{work}</p>
              <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-300)' }}>
                <span style={{ color: 'var(--electric-green)' }}>Output: </span>{out}
              </p>
              <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-400)' }}>{service}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Los cuatro dominios atraviesan las seis etapas: esa es la tesis */}
      <Section band="darker">
        <Kicker dark>En todas las etapas</Kicker>
        <Headline dark>Cuatro sistemas que se transforman a la vez.</Headline>
        <Lead dark>
          No son cuatro workstreams paralelos. En cada etapa se toman decisiones
          sobre los cuatro, porque dejar uno fuera es lo que hace que el cambio no
          sobreviva al primer trimestre.
        </Lead>
        <Cols min="230px">
          {DOMAINS.map(([name, line, icon]) => (
            <Reveal as="div" key={name} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <img src={icon} alt="" loading="lazy" decoding="async" style={{ width: 34, height: 34, display: 'block' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="light">
        <Kicker>Relación con los servicios</Kicker>
        <Headline>Dos engagements recorren el mismo eje.</Headline>
        <Cols min="300px">
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>B–E–C–O</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              AI-Native Transformation Discovery
            </h3>
            <Body>Define, diagnostica, prioriza y diseña el modelo futuro.</Body>
            <TextCTA to="/es/servicios/transformation-discovery">Explora Discovery</TextCTA>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>O–M–E</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              Build &amp; Embed Sprint
            </h3>
            <Body>Valida el diseño, construye, incorpora y prepara la escala.</Body>
            <TextCTA to="/es/servicios/build-and-embed">Explora Build &amp; Embed</TextCTA>
          </Card>
        </Cols>
        <Body style={{ marginTop: 'var(--space-8)' }}>
          Operating Model Design aparece en los dos: es el punto de transición
          visible entre definir y construir.
        </Body>
      </Section>

      <Section band="sunken">
        <Kicker>Proprietary tools</Kicker>
        <Headline>Siete herramientas, siete decisiones.</Headline>
        <Body>
          No publicamos scoring formulas ni ponderaciones. Lo que importa de una
          herramienta no es su fórmula: es qué decisión permite tomar.
        </Body>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {TOOLS.map(([t, d]) => <IndexRow key={t} term={t} def={d} />)}
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>Governance y medición</Kicker>
        <Headline dark>Cuatro principios que no se negocian por velocidad.</Headline>
        <Cols min="250px">
          {GOVERNANCE.map(([name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Aplica el framework a tu empresa</Kicker>
        <Headline dark>¿En qué debe convertirse tu empresa después?</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Inicia tu Discovery</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
