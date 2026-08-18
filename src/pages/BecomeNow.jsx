import React from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../components/ui.jsx';
import BecomeNowForm from '../components/BecomeNowForm.jsx';
import {
  TAGLINE, PROMISE, SITUATIONS, EXISTING_MATERIAL, SESSION_ZERO, SESSION_ZERO_OUTPUTS,
  SESSION_FLOW, FORMATS, IS_IS_NOT, INDICATORS, GENERAL_DELIVERABLES, FAQ, PROGRAM_GROUPS, PROGRAMS,
} from '../content/become-now.js';

/**
 * BECOME NOW™ — Applied AI Enablement.
 *
 * El riesgo de esta página es parecer un catálogo de cursos, que es justo lo
 * contrario de lo que el servicio promete. Se evita con el orden: la Sesión 0
 * —el entendimiento previo— aparece antes que cualquier malla, y el catálogo
 * llega al final, presentado como rutas de referencia y no como temario.
 *
 * Si alguien solo lee los titulares en orden, la idea que se lleva es
 * "primero entienden cómo trabajamos", no "tienen catorce cursos".
 */
export default function BecomeNow() {
  return (
    <div data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME NOW™ — Applied AI Enablement</Kicker>
        <Headline as="h1" dark>Capacita a tu empresa para trabajar mejor con IA, hoy.</Headline>
        <Lead dark>
          Programas in company en ChatGPT, Claude y Gemini, diseñados alrededor de
          los procesos, documentos y desafíos reales de cada área.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA href="#disena-tu-programa">Diseña tu programa</PrimaryCTA>
          <GhostCTA to="#programas" dark>Explora los programas por área</GhostCTA>
        </div>
        <p style={{ margin: 'var(--space-10) 0 0', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline-dark)', font: 'var(--type-body)', color: 'var(--slate-300)', maxWidth: '54ch' }}>
          No enseñamos IA sobre ejemplos genéricos. Construimos la capacitación
          sobre la realidad de tu empresa.
        </p>
        <p style={{ margin: 'var(--space-8) 0 0', font: 'var(--type-mono)', letterSpacing: 'var(--track-mono)', color: 'var(--electric-green)', textTransform: 'uppercase' }}>
          {TAGLINE}
        </p>
      </Section>

      {/* La tensión */}
      <Section band="light">
        <Kicker>The adoption gap</Kicker>
        <Headline>Tener acceso a la IA no significa saber trabajar con ella.</Headline>
        <Lead>
          Muchas empresas ya cuentan con ChatGPT, Claude o Gemini, pero su uso sigue
          siendo individual, superficial y difícil de medir. Cada persona experimenta
          por su cuenta, los aprendizajes no se comparten y los resultados dependen
          de prompts improvisados.
        </Lead>
        <Body>
          El problema no es la falta de herramientas. Es la falta de un método para
          convertirlas en una forma común de trabajar.
        </Body>

        <Cols min="260px">
          {SITUATIONS.map((s) => (
            <Reveal as="div" key={s} className="row-hit" style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-5)' }}>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{s}</p>
            </Reveal>
          ))}
        </Cols>

        <Reveal as="p" style={{ margin: 'var(--space-10) 0 0', font: 'var(--type-lead)', color: 'var(--text-heading)', maxWidth: '46ch' }}>
          La adopción cambia cuando la capacitación entra al proceso real.
        </Reveal>
      </Section>

      {/* La diferencia */}
      <Section band="dark">
        <Kicker dark>Built around your work</Kicker>
        <Headline dark>Primero entendemos cómo trabajan. Después diseñamos la capacitación.</Headline>
        <Lead dark>
          Todo programa comienza con una sesión de entendimiento. Antes de definir la
          malla conocemos el área, revisamos sus procesos, identificamos sus cuellos
          de botella y entendemos qué documentos, datos, reportes y herramientas
          utiliza hoy.
        </Lead>
        <Body dark>
          A partir de ese entendimiento construimos los casos, ejercicios, asistentes,
          agents y workflows que se trabajarán durante las sesiones.
        </Body>

        <div style={{ marginTop: 'var(--space-11)' }}>
          <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--electric-green)' }}>
            No partimos de cero. Trabajamos con lo que ya existe:
          </p>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {EXISTING_MATERIAL.map((m) => (
              <span key={m} style={{
                padding: '8px 14px', border: '1px solid var(--border-hairline-dark)',
                borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                fontSize: 'var(--text-body-sm)', color: 'var(--slate-200)',
              }}>{m}</span>
            ))}
          </div>
          <Body dark style={{ marginTop: 'var(--space-6)' }}>
            La información puede usarse en formato real, anonimizado o simulado, según
            los criterios de seguridad de la empresa.
          </Body>
        </div>
      </Section>

      {/* Sesión 0 — antes que cualquier malla */}
      <Section band="sunken" id="sesion-0">
        <Kicker>Business process understanding session</Kicker>
        <Headline>Ningún programa comienza antes de entender el trabajo que debe mejorar.</Headline>
        <Lead>
          La Sesión 0 no es una reunión comercial: es donde se decide qué se va a
          enseñar. Participan el sponsor, el líder del área, representantes de los
          roles y, cuando hace falta, Tecnología, Data, Security o Compliance.
        </Lead>

        <div style={{ marginTop: 'var(--space-10)' }}>
          {SESSION_ZERO.map(([t, d], i) => (
            <IndexRow key={t} num={String(i + 1).padStart(2, '0')} term={t} def={d} />
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-10)' }}>
          <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Entregables de la sesión
          </p>
          <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {SESSION_ZERO_OUTPUTS.map((o) => (
              <span key={o} style={{
                padding: '8px 14px', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                fontSize: 'var(--text-body-sm)', color: 'var(--text-body)',
              }}>{o}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* Cómo funciona cada sesión */}
      <Section band="darker">
        <Kicker dark>Cómo funciona cada sesión</Kicker>
        <Headline dark>Seis pasos. El último es el que casi nunca ocurre.</Headline>
        <Lead dark>
          Cada sesión debe dejar algo funcionando, no solamente algo aprendido. Por
          eso termina en transferencia: el activo queda documentado para poder usarse
          al día siguiente sin nosotros delante.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {SESSION_FLOW.map(([t, d], i) => (
            <Reveal as="div" key={t} data-cols className="row-hit"
              style={{
                display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1.6fr)',
                gap: 'var(--space-6)', padding: 'var(--space-5) 0',
                borderTop: '1px solid var(--border-hairline-dark)', alignItems: 'baseline',
              }}
            >
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--electric-green)' }}>
                {i + 1}
              </span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{t}</h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Formatos */}
      <Section band="light">
        <Kicker>Formatos adaptables</Kicker>
        <Headline>Tres puntos de partida, ninguno cerrado.</Headline>
        <Body>
          Sesiones, duración, modalidad, herramientas y casos se modifican según la
          necesidad de la empresa. Lo que no cambia es la sesión previa de
          entendimiento.
        </Body>
        <Cols min="280px">
          {FORMATS.map((f) => (
            <Card key={f.name}>
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>{f.hours}</p>
              <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>{f.name}</h3>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)' }}>{f.sessions}</p>
              <ul style={{ listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
                {f.items.map((it) => (
                  <li key={it} style={{ display: 'flex', gap: 'var(--space-4)', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-body)' }}>
                    <span aria-hidden="true" style={{ color: 'var(--text-accent)' }}>—</span>{it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </Cols>
      </Section>

      {/* Catálogo — al final, y como rutas de referencia */}
      <Section band="dark" id="programas">
        <Kicker dark>Programas por área</Kicker>
        <Headline dark>Catorce rutas de referencia. Ninguna es el programa final.</Headline>
        <Lead dark>
          Estas mallas muestran los recorridos más frecuentes por área. El programa
          que recibe tu empresa se construye después de la Sesión 0 — y puede ser
          para un área que no esté en esta lista.
        </Lead>

        <div style={{ marginTop: 'var(--space-11)', display: 'grid', gap: 'var(--space-10)' }}>
          {PROGRAM_GROUPS.map((g) => (
            <div key={g.title}>
              <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--electric-green)' }}>{g.title}</p>
              <div style={{ marginTop: 'var(--space-5)' }}>
                {g.slugs.map((slug) => (
                  <IndexRow
                    key={slug}
                    dark
                    to={`/es/servicios/become-now/${slug}`}
                    term={PROGRAMS[slug].menu.replace('IA aplicada a ', '')}
                    def={PROGRAMS[slug].body}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Qué es y qué no es */}
      <Section band="light">
        <Kicker>Qué es y qué no es</Kicker>
        <Headline>La diferencia importa más que el temario.</Headline>
        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th scope="col" style={{ ...th, color: 'var(--text-accent)' }}>Sí es</th>
                <th scope="col" style={{ ...th, color: 'var(--text-faint)' }}>No es</th>
              </tr>
            </thead>
            <tbody>
              {IS_IS_NOT.map(([yes, no]) => (
                <tr key={yes}>
                  <td style={{ ...td, color: 'var(--text-heading)' }}>{yes}</td>
                  <td style={{ ...td, color: 'var(--text-muted)' }}>{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Indicadores y entregables */}
      <Section band="sunken">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>Indicadores</Kicker>
            <Headline>Cómo se mide que sirvió.</Headline>
            <div style={{ marginTop: 'var(--space-8)' }}>
              {INDICATORS.map(([t, d]) => <IndexRow key={t} term={t} def={d} />)}
            </div>
            <Body style={{ marginTop: 'var(--space-6)' }}>
              No publicamos porcentajes de productividad sin haber establecido un
              baseline. Medir antes es parte del programa, no un extra.
            </Body>
          </Reveal>
          <Reveal as="div">
            <Kicker>Entregables generales</Kicker>
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {GENERAL_DELIVERABLES.map((d) => (
                <span key={d} style={{
                  padding: '8px 14px', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
                  fontSize: 'var(--text-body-sm)', color: 'var(--text-body)',
                }}>{d}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Relación con los otros dos servicios */}
      <Section band="darker">
        <Kicker dark>Cómo encaja</Kicker>
        <Headline dark>Capacita el presente. Diseña lo que sigue. Construye desde dentro.</Headline>
        <Lead dark>
          BECOME NOW™ desarrolla las capacidades para el trabajo de hoy. Discovery
          define en qué debe convertirse la empresa. Build &amp; Embed construye las
          capabilities que harán posible ese futuro.
        </Lead>
        <Body dark>
          Puede contratarse de forma independiente o integrarse como capa de adoption
          y capability building dentro de los otros dos.
        </Body>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-7)', flexWrap: 'wrap' }}>
          <TextCTA to="/es/servicios/transformation-discovery" dark>Explora Discovery</TextCTA>
          <TextCTA to="/es/servicios/build-and-embed" dark>Explora Build &amp; Embed</TextCTA>
        </div>
      </Section>

      {/* FAQ */}
      <Section band="light">
        <Kicker>Preguntas frecuentes</Kicker>
        <Headline>Lo que suelen preguntarnos antes de empezar.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {FAQ.map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '68ch' }}>{a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Formulario propio */}
      <Section band="dark" id="disena-tu-programa" pad="var(--space-13)">
        <Kicker dark>Built around your work</Kicker>
        <Headline dark>Cuéntanos cómo trabaja tu equipo hoy.</Headline>
        <Lead dark>
          Primero entenderemos sus procesos, herramientas y desafíos. Después
          construiremos un programa de IA aplicada completamente adaptado a su
          realidad.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          <BecomeNowForm />
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}

const th = {
  padding: 'var(--space-4) var(--space-6) var(--space-4) 0',
  borderBottom: '1px solid var(--border-strong)',
  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase', textAlign: 'left',
};
const td = {
  padding: 'var(--space-5) var(--space-6) var(--space-5) 0',
  borderBottom: '1px solid var(--border-hairline)',
  font: 'var(--type-body)', fontSize: 'var(--text-body-md)',
  verticalAlign: 'top', textAlign: 'left',
};
