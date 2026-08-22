import { campo } from '../content/paginas/index.js';
import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Ico } from '../components/icons.jsx';
import { Banner } from '../components/Media.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../components/ui.jsx';
import { EstrategiaDeModelos } from '../components/tecnologia.jsx';

/**
 * BECOME DISCOVER™ (§8 del documento).
 *
 * La secuencia de la página es la del documento y empieza por el problema, no
 * por el servicio: quien llega aquí ya sabe que quiere hablar con alguien, lo
 * que necesita es reconocer que su situación es la que este engagement resuelve.
 */

const STAGES = [
  ['B', 'Business Ambition', 'Define en qué debe convertirse la empresa y qué resultados importan.', 'AI-native ambition y tesis estratégica.'],
  ['E', 'Enterprise Discovery', 'Comprende cómo funciona hoy y qué limita el cambio.', 'Diagnóstico de la empresa y su preparación.'],
  ['C', 'Elección de capacidades', 'Prioriza dónde la IA puede crear valor diferencial.', 'Dónde está el valor y un portafolio priorizado.'],
  ['O', 'Operating Model Design', 'Diseña el sistema futuro de Personas, Datos, Agentes, Productos y Operaciones.', 'Modelo operativo objetivo y diseño de la solución.'],
];

const DELIVERABLES = [
  'AI-native ambition y tesis estratégica.',
  'Diagnóstico de la empresa e Inside Readiness Index™.',
  'Value pools y portafolio priorizado de capacidades.',
  'Target operating model.',
  'Diseño de la transformación, caso de negocio y hoja de ruta.',
];

const TOOLS = [
  ['Business Ambition Canvas™', 'Alinear al equipo ejecutivo alrededor de los resultados y las decisiones estratégicas.'],
  ['Inside Readiness Index™', 'Evaluar la madurez en Personas, Datos, Agentes, Productos y Operaciones.'],
  ['AI-Native Value Map™', 'Priorizar oportunidades por valor, viabilidad, velocidad y riesgo.'],
  ['Inside Target State Canvas™', 'Definir el modelo operativo objetivo y el diseño de la transformación.'],
];

const FIT = [
  'Existe executive sponsorship.',
  'Hay iniciativas de IA sin coherencia empresarial.',
  'Un dominio de negocio necesita reinvención.',
  'El liderazgo necesita un portafolio, un estado objetivo o una hoja de ruta.',
  'La empresa involucrará a líderes de negocio, tecnología, datos y People.',
];

const DECISIONS = [
  'Dónde la IA puede crear valor empresarial diferencial.',
  'Qué debe cambiar dentro para que ese valor sea posible.',
  'Qué capacidad construir primero y con qué criterios.',
  'Qué inversión, qué secuencia y qué gobernanza sostienen el plan.',
];

export default function Discovery() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>{campo('discover', 's1kicker')}</Kicker>
        <Headline as="h1" dark>{campo('discover', 's1headline')}</Headline>
        {/* La frase de marca baja a subtítulo: como H1 era memorable y
            abstracta, y esta página tiene intención comercial. */}
        <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-lead)', color: 'var(--electric-green)' }}>
          Define en qué debe convertirse tu empresa después.
        </p>
        <Lead dark>{campo('discover', 's1lead')}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Conversemos sobre BECOME DISCOVER™</PrimaryCTA>
          <GhostCTA to="/es/servicios" dark>Ver los dos servicios</GhostCTA>
        </div>
      </Section>

      {/* 1 — El problema, antes que el servicio */}
      <Section band="light">
        <Kicker>{campo('discover', 's2kicker')}</Kicker>
        <Headline>{campo('discover', 's2headline')}</Headline>
        <Lead>{campo('discover', 's2lead')}</Lead>
        <Body>{campo('discover', 's2body')}</Body>
      </Section>

      {/* 2 — Para quién */}
      <Section band="dark">
        <Kicker dark>{campo('discover', 's3kicker')}</Kicker>
        <Headline dark>{campo('discover', 's3headline')}</Headline>
        <Cols min="240px">
          {FIT.map((f, i) => (
            <Reveal as="div" key={f} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Ico name="yes" size={22} style={{ color: 'var(--electric-green)' }} />
                <span style={{ font: 'var(--type-mono)', color: 'var(--electric-green)' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{f}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Banner variant="corridor" seed={53} height="clamp(280px, 36vw, 440px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '24ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          Primero la dirección. Después la inversión.
        </Reveal>
      </Banner>

      {/* 3 — Etapas B–E–C–O */}
      <Section band="light">
        <Kicker>{campo('discover', 's4kicker')}</Kicker>
        <Headline>{campo('discover', 's4headline')}</Headline>
        <Body>{campo('discover', 's4body')}</Body>
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

      <EstrategiaDeModelos lang="es" />

      {/* 4 y 5 — participación ejecutiva y herramientas */}

      <Section band="sunken">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>{campo('discover', 's5kicker')}</Kicker>
            <Headline>{campo('discover', 's5headline')}</Headline>
            <Body>{campo('discover', 's5body')}</Body>
            <Body>{campo('discover', 's5body2')}</Body>
          </Reveal>
          <Reveal as="div">
            <Kicker>{campo('discover', 's6kicker')}</Kicker>
            <div style={{ marginTop: 'var(--space-6)' }}>
              {TOOLS.map(([t, d], i) => <IndexRow key={t} index={i} term={t} def={d} />)}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 6 y 7 — entregables y decisiones */}
      <Section band="dark">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker dark>{campo('discover', 's7kicker')}</Kicker>
            <Headline dark>{campo('discover', 's7headline')}</Headline>
            <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
              {DELIVERABLES.map((d) => (
                <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
                  <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>—</span>
                  <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal as="div">
            <Kicker dark>{campo('discover', 's8kicker')}</Kicker>
            <Headline dark>{campo('discover', 's8headline')}</Headline>
            <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
              {DECISIONS.map((d) => (
                <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
                  <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>?</span>
                  <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* 8 — promesa final */}
      <Section band="light">
        <Reveal as="p" style={{ margin: 0, font: 'var(--type-lead)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)', maxWidth: '52ch' }}>
          Al terminar BECOME DISCOVER™, el liderazgo sabe dónde la IA puede crear valor, qué
          debe cambiar dentro de la empresa y qué capacidad debe construir primero.
        </Reveal>
        <Cols min="260px">
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>Duración</p>
            <Body style={{ marginTop: 'var(--space-4)' }}>{campo('discover', 's8body')}</Body>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>Siguiente paso</p>
            <Body style={{ marginTop: 'var(--space-4)' }}>{campo('discover', 's8body2')}</Body>
            <TextCTA to="/es/servicios/become-embed">Explora BECOME EMBED™</TextCTA>
          </Card>
        </Cols>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>{campo('discover', 's9kicker')}</Kicker>
        <Headline dark>{campo('discover', 's9headline')}</Headline>
        <Lead dark>{campo('discover', 's9lead')}</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Hablemos de BECOME DISCOVER™</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
