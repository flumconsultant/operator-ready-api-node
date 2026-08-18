import React from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from '../components/ui.jsx';
import BecomeNowForm from '../components/BecomeNowForm.jsx';
import { Ico } from '../components/icons.jsx';
import { Banner } from '../components/Media.jsx';
import {
  TAGLINE, SITUATIONS, EXISTING_MATERIAL, SESSION_ZERO,
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
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
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
          Nada de ejemplos genéricos: la capacitación se construye sobre la realidad
          de tu empresa.
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
          El problema no son las herramientas. Es que nadie las ha convertido en
          una forma común de trabajar.
        </Lead>

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
          Antes de definir la malla conocemos el área, sus procesos, sus cuellos de
          botella y las herramientas que usa hoy. De ahí salen los casos, asistentes
          y workflows que se trabajan en las sesiones.
        </Lead>

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
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <Ico name="doc" size={16} style={{ color: 'var(--electric-green)' }} />{m}
              </span>
            ))}
          </div>
          <Body dark style={{ marginTop: 'var(--space-6)' }}>
            La información puede usarse en formato real, anonimizado o simulado, según
            los criterios de seguridad de la empresa.
          </Body>
        </div>
      </Section>

      {/* Respiro visual antes del bloque más largo de la página */}
      <Banner variant="circuit" seed={23} height="clamp(260px, 34vw, 400px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '24ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          La capacitación entra al proceso real.
        </Reveal>
      </Banner>

      {/* Sesión 0 — antes que cualquier malla */}
      <Section band="sunken" id="sesion-0">
        <Kicker>Business process understanding session</Kicker>
        <Headline>Ningún programa comienza antes de entender el trabajo que debe mejorar.</Headline>
        <Lead>
          No es una reunión comercial: es donde se decide qué se va a enseñar.
        </Lead>

        <div style={{ marginTop: 'var(--space-10)' }}>
          {SESSION_ZERO.map(([t, d], i) => (
            <IndexRow key={t} index={i} num={String(i + 1).padStart(2, '0')} term={t} def={d} />
          ))}
        </div>

        {/* Los entregables de la Sesión 0 estaban aquí y otra vez abajo como
            "entregables generales". Se quedan en un sitio. */}
      </Section>

      {/* Cómo funciona cada sesión */}
      <Section band="darker">
        <Kicker dark>Cómo funciona cada sesión</Kicker>
        <Headline dark>Seis pasos. El último es el que casi nunca ocurre.</Headline>
        <Lead dark>
          Cada sesión termina en transferencia: el activo queda documentado y se usa
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
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)', maxWidth: '62ch' }}>{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Formatos */}
      <Section band="light">
        <Kicker>Formatos adaptables</Kicker>
        <Headline>Tres puntos de partida, ninguno cerrado.</Headline>
        <Body>
          Todo se ajusta a la empresa. Lo único que no cambia es la sesión previa de
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
                    <Ico name="yes" size={18} style={{ color: 'var(--text-accent)', marginTop: 2 }} />{it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </Cols>
        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA href="#disena-tu-programa">Diseña el tuyo</PrimaryCTA>
          <GhostCTA to="#programas">Ver los programas por área</GhostCTA>
        </div>
      </Section>

      {/* Catálogo — al final, y como rutas de referencia */}
      <Section band="dark" id="programas">
        <Kicker dark>Programas por área</Kicker>
        <Headline dark>Catorce rutas de referencia. Ninguna es el programa final.</Headline>
        <Lead dark>
          Recorridos de referencia. El programa real se construye después de la
          Sesión 0, y puede ser para un área que no esté aquí.
        </Lead>

        {/* Rejilla de nombres, no fichas: la descripción de cada programa está
            en su propia página. Aquí ocupaba cuatro pantallas para decir catorce
            veces lo mismo con otras palabras. */}
        <div style={{ marginTop: 'var(--space-11)', display: 'grid', gap: 'var(--space-9)' }}>
          {PROGRAM_GROUPS.map((g) => (
            <div key={g.title}>
              <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--electric-green)' }}>{g.title}</p>
              <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--space-3)' }}>
                {g.slugs.map((slug) => (
                  <li key={slug}>
                    <Link
                      to={`/es/servicios/become-now/${slug}`}
                      className="row-hit"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
                        minHeight: 56, padding: 'var(--space-4) var(--space-5)',
                        border: '1px solid var(--border-hairline-dark)', textDecoration: 'none',
                        font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--white)',
                      }}
                    >
                      {PROGRAMS[slug].menu.replace('IA aplicada a ', '')}
                      <Ico name="route" size={18} style={{ color: 'var(--electric-green)' }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA href="#disena-tu-programa">¿No ves tu área? Cuéntanosla</PrimaryCTA>
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
                <th scope="col" style={{ ...th, color: 'var(--text-accent)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Ico name="yes" size={18} /> Sí es
                  </span>
                </th>
                <th scope="col" style={{ ...th, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Ico name="no" size={18} /> No es
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {IS_IS_NOT.map(([yes, no]) => (
                <tr key={yes}>
                  <td style={{ ...td, color: 'var(--text-heading)' }}>
                    <span style={{ display: 'flex', gap: 10 }}>
                      <Ico name="yes" size={18} style={{ color: 'var(--text-accent)', marginTop: 3 }} />{yes}
                    </span>
                  </td>
                  <td style={{ ...td, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', gap: 10 }}>
                      <Ico name="no" size={18} style={{ color: 'var(--text-faint)', marginTop: 3 }} />{no}
                    </span>
                  </td>
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
              {INDICATORS.map(([t, d], i) => <IndexRow key={t} index={i} term={t} def={d} />)}
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
        {/* El titular lo pone la propia invitación del formulario: repetirlo
            aquí era decir dos veces lo mismo con dos tamaños distintos. */}
        <Kicker dark>Built around your work</Kicker>
        <div style={{ marginTop: 'var(--space-7)' }}>
          <BecomeNowForm />
        </div>

        {/* Cómo encaja con los otros dos: era una sección propia justo antes de
            esta, y las dos terminaban en lo mismo. */}
        <div style={{ marginTop: 'var(--space-11)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline-dark)' }}>
          <Body dark style={{ marginTop: 0 }}>
            NOW™ capacita para el trabajo de hoy. Discovery define en qué debe
            convertirse la empresa. Build &amp; Embed construye lo que hará posible ese
            futuro. Puede contratarse solo o integrarse en los otros dos.
          </Body>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-7)', flexWrap: 'wrap' }}>
            <TextCTA to="/es/servicios/transformation-discovery" dark>Explora Discovery</TextCTA>
            <TextCTA to="/es/servicios/build-and-embed" dark>Explora Build &amp; Embed</TextCTA>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </main>
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
