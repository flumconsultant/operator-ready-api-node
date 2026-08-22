import React from 'react';
import { Link } from 'react-router-dom';
import StateTransition from './StateTransition.jsx';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import Reveal from './Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, TextCTA, Cols, Card, IndexRow } from './ui.jsx';
import { CT } from '../content/como-transformamos.js';
import { INDUSTRIAS, RAIZ, urlIndustria } from '../content/industrias.js';

/**
 * Cómo transformamos — la página del método, en los dos idiomas.
 *
 * Sustituye a la antigua página de Framework. Lo que cambia no es solo el
 * nombre: las seis etapas ya no son seis letras con una descripción, sino seis
 * bloques con las preguntas que se responden en cada uno y lo que queda por
 * escrito al terminar. La diferencia es verificable — quien lee puede
 * comprobar si esas son las preguntas que su empresa tiene abiertas — y eso es
 * exactamente lo que una página de metodología suele no ofrecer.
 *
 * Las herramientas propietarias siguen aquí, más abajo: seguían siendo
 * contenido válido y quitarlas por rehacer la página habría sido perder algo
 * que ya funcionaba.
 */

const TOOLS = {
  es: [
    ['Business Ambition Canvas™', 'Alinear al equipo ejecutivo alrededor de los resultados y las decisiones estratégicas.'],
    ['Inside Readiness Index™', 'Evaluar la madurez en Personas, Datos, Agentes, Productos y Operaciones.'],
    ['AI-Native Value Map™', 'Priorizar oportunidades por valor, viabilidad, velocidad y riesgo.'],
    ['Inside Target State Canvas™', 'Definir el modelo operativo objetivo y el diseño de la transformación.'],
    ['Agentic Workflow Blueprint™', 'Diseñar roles, agentes, datos, decisiones, excepciones y controles.'],
    ['Embed Scorecard™', 'Medir uso, confianza, desempeño, control y valor.'],
    ['Scale Readiness Gate™', 'Decidir si iterar, integrar, escalar o detener.'],
  ],
  en: [
    ['Business Ambition Canvas™', 'Align the executive team around outcomes and strategic decisions.'],
    ['Inside Readiness Index™', 'Assess maturity across People, Data, Agents, Products and Operations.'],
    ['AI-Native Value Map™', 'Prioritise opportunities by value, feasibility, speed and risk.'],
    ['Inside Target State Canvas™', 'Define the target operating model and the transformation design.'],
    ['Agentic Workflow Blueprint™', 'Design roles, agents, data, decisions, exceptions and controls.'],
    ['Embed Scorecard™', 'Measure usage, trust, performance, control and value.'],
    ['Scale Readiness Gate™', 'Decide whether to iterate, integrate, scale or stop.'],
  ],
};

const TOOLS_HEAD = {
  es: ['Herramientas propias', 'Siete herramientas, siete decisiones.', 'No publicamos fórmulas ni ponderaciones. Lo que importa de una herramienta no es su fórmula: es qué decisión permite tomar.'],
  en: ['Proprietary tools', 'Seven tools, seven decisions.', 'We do not publish formulas or weightings. What matters about a tool is not its formula: it is which decision it lets you take.'],
};

const IND_HEAD = {
  es: ['El mismo método, tu industria', 'Dónde aterriza todo esto.', 'El método no cambia entre sectores. Lo que cambia es dónde está el valor, qué se mide y qué riesgo hay que acotar.', 'Ver todas las industrias'],
  en: ['The same method, your industry', 'Where all of this lands.', 'The method does not change between sectors. What changes is where the value sits, what gets measured and which risk has to be bounded.', 'View all industries'],
};

export default function ComoTransformamos({ lang = 'es' }) {
  const t = CT[lang] || CT.es;
  const contacto = lang === 'en' ? '/en/contact' : '/es/contacto';
  const [tk, tt, tl] = TOOLS_HEAD[lang] || TOOLS_HEAD.es;
  const [ik, it, il, iv] = IND_HEAD[lang] || IND_HEAD.es;

  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>{t.kicker}</Kicker>
        <Headline as="h1" dark>{t.h1}</Headline>
        <Lead dark>{t.lead}</Lead>
      </Section>

      <Section band="light">
        <Kicker>{t.tesisKicker}</Kicker>
        <Headline>{t.tesis}</Headline>
        <div style={{ marginTop: 'var(--space-6)', display: 'grid', gap: 'var(--space-5)', maxWidth: 'var(--maxw-prose)' }}>
          {t.tesisTexto.map((p, i) => (
            <Reveal as="p" key={i} index={i} style={{ margin: 0, font: i === 0 ? 'var(--type-lead)' : 'var(--type-body)', color: i === 0 ? 'var(--text-body)' : 'var(--text-muted)' }}>
              {p}
            </Reveal>
          ))}
        </div>

        {/* La C y la O de BECOME como los dos estados de la misma empresa. En la
            home aparecía sin explicación y se leía como lenguaje interno; aquí
            está donde el método la explica. */}
        <figure style={{ margin: 'var(--space-12) 0 0', display: 'grid', justifyItems: 'center', gap: 'var(--space-6)' }}>
          <StateTransition dark={false} />
          <figcaption style={{ margin: 0, maxWidth: 'var(--maxw-prose)', font: 'var(--type-body)', color: 'var(--text-muted)', textAlign: 'center' }}>
            {t.estados}
          </figcaption>
        </figure>
      </Section>

      <Section band="darker">
        <Kicker dark>{t.sistemasKicker}</Kicker>
        <Headline dark>{t.sistemas}</Headline>
        <Lead dark>{t.sistemasLead}</Lead>
        <Cols min="230px" style={{ marginTop: 'var(--space-10)' }}>
          {t.SISTEMAS.map(([nombre, linea, icono]) => (
            <Reveal as="div" key={nombre} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <img src={icono} alt="" loading="lazy" decoding="async" style={{ width: 34, height: 34, display: 'block' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{nombre}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* Las seis etapas. Cada una con sus preguntas y su Output: es lo que
          separa un método de una promesa. */}
      <Section band="light">
        <Kicker>{t.etapasKicker}</Kicker>
        <Headline>{t.etapas}</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {t.ETAPAS.map(([num, nombre, titulo, preguntas, salida], i) => (
            <Reveal
              as="div" key={num} index={i} data-cols
              style={{
                display: 'grid', gridTemplateColumns: 'minmax(0,0.8fr) minmax(0,1.2fr)',
                gap: 'var(--space-8)', padding: 'var(--space-8) 0',
                borderTop: '1px solid var(--border-strong)',
              }}
            >
              <div>
                <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>{num}</p>
                <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', lineHeight: 1.18, color: 'var(--text-heading)' }}>
                  {titulo}
                </h3>
                {/* En español el nombre canónico de la etapa está en inglés y se
                    conserva: es como se nombra dentro de los entregables. */}
                {nombre !== titulo && (
                  <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--text-faint)' }}>{nombre}</p>
                )}
              </div>
              <div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
                  {preguntas.map((q) => (
                    <li key={q} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                      <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
                      <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{q}</span>
                    </li>
                  ))}
                </ul>
                <p style={{ margin: 'var(--space-6) 0 0', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-hairline)', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--text-accent)' }}>Output: </span>{salida}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>{t.principiosKicker}</Kicker>
        <Headline dark>{t.principios}</Headline>
        <Cols min="250px" style={{ marginTop: 'var(--space-10)' }}>
          {t.PRINCIPIOS.map(([nombre, linea]) => (
            <Reveal as="div" key={nombre} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--white)' }}>{nombre}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="light">
        <Kicker>{t.entradasKicker}</Kicker>
        <Headline>{t.entradas}</Headline>
        <Lead>{t.entradasLead}</Lead>
        <Cols min="270px" style={{ marginTop: 'var(--space-9)' }}>
          {t.ENTRADAS.map(([nombre, que, cuando, etapas, url]) => (
            <Card key={nombre}>
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>{etapas}</p>
              <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', lineHeight: 1.18, color: 'var(--text-heading)' }}>
                {nombre}
              </h3>
              <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{que}</p>
              <Body style={{ marginTop: 'var(--space-4)' }}>{cuando}</Body>
              <TextCTA to={url}>{nombre}</TextCTA>
            </Card>
          ))}
        </Cols>
      </Section>

      <Section band="sunken">
        <Kicker>{tk}</Kicker>
        <Headline>{tt}</Headline>
        <Body>{tl}</Body>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {(TOOLS[lang] || TOOLS.es).map(([n, d], i) => <IndexRow key={n} index={i} term={n} def={d} />)}
        </div>
      </Section>

      {/* El puente a industrias: el método es el mismo, el terreno no. Sin este
          bloque, las dos páginas nuevas existirían sin conocerse. */}
      <Section band="light">
        <Kicker>{ik}</Kicker>
        <Headline>{it}</Headline>
        <Body>{il}</Body>
        <Cols min="220px" style={{ marginTop: 'var(--space-9)' }}>
          {INDUSTRIAS.map((ind, i) => (
            <Reveal as="div" key={ind.slug[lang]} index={i} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26 }}>
                <Link to={urlIndustria(ind, lang)} style={{ color: 'var(--text-heading)', textDecoration: 'none' }} className="hv-link">
                  {ind[lang].nombre}
                </Link>
              </h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>{ind[lang].menu}</Body>
            </Reveal>
          ))}
        </Cols>
        <TextCTA to={RAIZ[lang]}>{iv}</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>{t.ctaKicker}</Kicker>
        <Headline dark>{t.cta}</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to={contacto}>{t.ctaBoton}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
