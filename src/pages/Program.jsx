import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../components/ui.jsx';
import { TecnologiaAdaptada } from '../components/tecnologia.jsx';
import { PROGRAMS, PROGRAM_LIST, PERSONALIZATION_NOTE, SESSION_FLOW, FAQ } from '../content/become-now.js';

/**
 * Plantilla común de las catorce páginas de programa (§13 del documento).
 *
 * El aviso de personalización aparece dos veces —al principio de la malla y al
 * final— y no es redundancia: es la única defensa contra que alguien lea la
 * tabla como un temario cerrado, que es exactamente lo que el servicio no es.
 */
export default function Program() {
  const { slug } = useParams();
  const p = PROGRAMS[slug];
  if (!p) return <Navigate to="/es/servicios/become-now" replace />;

  const others = PROGRAM_LIST.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME NOW™ · {p.area}</Kicker>
        <Headline as="h1" dark>{p.h1}</Headline>
        <Lead dark>{p.body}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/servicios/become-now#disena-tu-programa">{p.cta}</PrimaryCTA>
          <GhostCTA to="/es/servicios/become-now" dark>Cómo funciona BECOME NOW™</GhostCTA>
        </div>
      </Section>

      {/* Problema y para quién */}
      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>El problema habitual</Kicker>
            <Headline>El equipo ya usa IA. Cada persona a su manera.</Headline>
            <Body>
              En {p.area} la herramienta suele entrar por iniciativa individual: alguien
              descubre que le ahorra tiempo en una tarea y lo resuelve por su cuenta.
              Ese aprendizaje no se comparte, no se valida contra ningún criterio del
              área y desaparece cuando esa persona cambia de rol.
            </Body>
            <Body>
              El programa convierte esos hallazgos sueltos en procesos del equipo, con
              criterios de validación comunes y activos que quedan documentados.
            </Body>
          </Reveal>
          <Reveal as="div">
            <Kicker>Para quién es</Kicker>
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {p.who.map((w) => (
                <span key={w} style={{
                  padding: '8px 14px', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                  fontSize: 'var(--text-body-sm)', color: 'var(--text-body)',
                }}>{w}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Sesión 0 */}
      <Section band="darker">
        <Kicker dark>Antes de la malla</Kicker>
        <Headline dark>La Sesión 0 decide qué se enseña.</Headline>
        <Lead dark>
          Revisamos los procesos de {p.area}, sus documentos, sus herramientas y sus
          cuellos de botella. De ahí salen los casos que se trabajan en cada sesión.
        </Lead>
        <TextCTA to="/es/servicios/become-now#sesion-0" dark>Qué se trabaja en la Sesión 0</TextCTA>
      </Section>

      {/* Procesos que pueden intervenirse — solo donde el documento los detalla */}
      {p.processes && (
        <Section band="light">
          <Kicker>Procesos adaptables</Kicker>
          <Headline>Sobre qué se construye el programa.</Headline>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {p.processes.map((x) => (
              <span key={x} style={{
                padding: '8px 14px', border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                fontSize: 'var(--text-body-sm)', color: 'var(--text-body)',
              }}>{x}</span>
            ))}
          </div>
        </Section>
      )}

      {/* La ruta */}
      <Section band={p.processes ? 'sunken' : 'light'}>
        <Kicker>Ruta recomendada</Kicker>
        <Headline>Seis sesiones. Seis capacidades que quedan instaladas.</Headline>
        <Body style={{ marginTop: 'var(--space-6)', color: 'var(--text-body)' }}>
          <strong>{PERSONALIZATION_NOTE}</strong>
        </Body>

        <div style={{ marginTop: 'var(--space-10)' }}>
          {p.route.map(([topic, capacidad], i) => (
            <Reveal as="div" key={topic} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) minmax(0,1.2fr)',
                gap: 'var(--space-6)', padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ font: 'var(--type-mono)', fontSize: 'var(--text-h3)', color: 'var(--text-accent)' }}>
                0{i + 1}
              </span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                <span className="sr-only">{`Sesión ${i + 1}: `}</span>{topic}
              </h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '62ch' }}>
                <span style={{ color: 'var(--text-accent)' }}>Queda instalado: </span>{capacidad}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Cómo es cada sesión */}
      <Section band="dark">
        <Kicker dark>Cómo es cada sesión</Kicker>
        <Headline dark>Cada sesión deja algo funcionando, no solo algo aprendido.</Headline>
        <Cols min="220px">
          {SESSION_FLOW.map(([t, d], i) => (
            <Reveal as="div" key={t} className="row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <span style={{ font: 'var(--type-mono)', color: 'var(--electric-green)' }}>{String(i + 1).padStart(2, '0')}</span>
              <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{t}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{d}</Body>
            </Reveal>
          ))}
        </Cols>
        <TecnologiaAdaptada lang="es" dark />
      </Section>

      {/* Guardrails, donde el documento los exige */}
      {p.guardrails && (
        <Section band="darker">
          <Kicker dark>Responsible use</Kicker>
          <Headline dark>Los límites se definen antes que los casos.</Headline>
          <Lead dark>
            En {p.area} el criterio profesional no se delega. Estas reglas se acuerdan
            en la Sesión 0 y se aplican en cada ejercicio del programa.
          </Lead>
          <ul style={{ listStyle: 'none', margin: 'var(--space-8) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)', maxWidth: '62ch' }}>
            {p.guardrails.map((g) => (
              <li key={g} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline-dark)' }}>
                <span aria-hidden="true" style={{ color: 'var(--electric-green)', font: 'var(--type-mono)' }}>!</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--slate-100)' }}>{g}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Entregables */}
      <Section band="light">
        <Kicker>Entregables posibles</Kicker>
        <Headline>Qué se lleva el área.</Headline>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {p.deliverables.map((d) => (
            <span key={d} style={{
              padding: '10px 16px', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
              fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)',
            }}>{d}</span>
          ))}
        </div>
        <Body style={{ marginTop: 'var(--space-8)' }}>
          El programa puede trabajarse con ChatGPT, Claude o Gemini, según las
          licencias y políticas de la empresa. Las herramientas son un medio: lo que
          cambia es cómo trabaja el equipo.
        </Body>
      </Section>

      {/* FAQ recortada */}
      <Section band="sunken">
        <Kicker>Preguntas frecuentes</Kicker>
        <Headline>Antes de decidir.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {FAQ.slice(0, 5).map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '68ch' }}>{a}</p>
            </details>
          ))}
        </div>
        <TextCTA to="/es/servicios/become-now">Ver todas las preguntas</TextCTA>
      </Section>

      {/* Otros programas */}
      <Section band="light">
        <Kicker>Otros programas</Kicker>
        <Headline>¿Es otra el área que necesita empezar?</Headline>
        <Cols min="240px">
          {others.map((o) => (
            <Card key={o.slug}>
              <Link to={o.to} style={{ textDecoration: 'none' }}>
                <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-accent)' }}>{o.group}</p>
                <p style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                  {o.menu.replace('IA aplicada a ', '')}
                </p>
                <Body style={{ marginTop: 'var(--space-4)' }}>{o.body}</Body>
              </Link>
            </Card>
          ))}
        </Cols>
        <TextCTA to="/es/servicios/become-now#programas">Ver todos los programas</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Built around your work</Kicker>
        <Headline dark>Cuéntanos cómo trabaja {p.area} hoy.</Headline>
        <Lead dark>{PERSONALIZATION_NOTE}</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/servicios/become-now#disena-tu-programa">{p.cta}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
