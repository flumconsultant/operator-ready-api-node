import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import Reveal from './Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card } from './ui.jsx';
import { COPY_PROGRAMAS } from '../content/become-now-programas.js';
import { PROGRAMS as ES_PROGRAMS, PROGRAM_GROUPS } from '../content/become-now.js';
import { PROGRAMS as EN_PROGRAMS } from '../content/become-now.en.js';

/**
 * La plantilla de las catorce páginas de programa, para los dos idiomas.
 *
 * ---- Por qué se rehízo ----
 *
 * Las veintiocho páginas compartían casi todo el texto que rodeaba a la malla:
 * el mismo problema habitual, la misma Sesión 0, la misma explicación de cómo
 * funciona una sesión, los mismos entregables y las mismas preguntas
 * frecuentes. Medido: de 163 bloques por página, más de cien eran idénticos, y
 * solo el 15-29% era propio. Para un buscador eso es una landing repetida
 * catorce veces, y cuando lo decide muestra una y esconde trece.
 *
 * La estructura visual no cambia —son las mismas trece secciones en el mismo
 * orden— pero cada bloque toma ahora su texto de src/content/become-now-programas.js,
 * donde cada programa tiene el suyo.
 *
 * ---- Por qué un componente y no dos páginas ----
 *
 * Había dos archivos casi idénticos, uno por idioma. Con trece secciones que
 * ahora dependen de datos, mantener los dos en paralelo garantizaba que se
 * desincronizaran a la tercera edición. Aquí la estructura se escribe una vez y
 * lo que cambia es de qué idioma se leen los textos.
 *
 * ---- Y por qué la neutralidad de proveedor ya no está aquí ----
 *
 * La explicación larga vive en la página madre. Repetirla catorce veces era
 * buena parte del problema. Cada programa dice ahora solo con qué sistemas de
 * su área convive la IA, y enlaza la madre para lo demás.
 */

const T = {
  es: {
    raiz: '/es/servicios/become-now',
    contenido: 'contenido',
    problema: 'El problema habitual',
    paraQuien: 'Para quién es',
    antesMalla: 'Antes de la malla',
    quéSeTrabaja: 'Qué se trabaja en la Sesión 0',
    procesos: 'Procesos adaptables',
    procesosTitular: 'Sobre qué se construye el programa.',
    ruta: 'Ruta recomendada',
    queda: 'Queda instalado: ',
    sesion: 'Cómo es cada sesión',
    tecnologia: 'Tecnología adaptada a tu entorno',
    tecnologiaMas: 'Cómo elegimos herramientas y modelos',
    entregables: 'Entregables posibles',
    entregablesTitular: 'Qué se lleva el área.',
    medicion: 'Antes de decidir',
    faq: 'Preguntas frecuentes',
    faqTitular: 'Lo que preguntan los equipos de esta área.',
    faqTodas: 'Ver todas las preguntas',
    otros: 'Otros programas',
    otrosTitular: '¿Es otra el área que necesita empezar?',
    verTodos: 'Ver todos los programas',
    comoFunciona: 'Cómo funciona BECOME NOW™',
    sesionN: (n) => `Sesión ${n}: `,
  },
  en: {
    raiz: '/en/services/become-now',
    contenido: 'content',
    problema: 'The usual problem',
    paraQuien: 'Who it is for',
    antesMalla: 'Before the curriculum',
    quéSeTrabaja: 'What Session 0 covers',
    procesos: 'Adaptable processes',
    procesosTitular: 'What the program is built on.',
    ruta: 'Recommended journey',
    queda: 'What stays installed: ',
    sesion: 'How each session works',
    tecnologia: 'Technology in your environment',
    tecnologiaMas: 'How we choose tools and models',
    entregables: 'Possible deliverables',
    entregablesTitular: 'What the team takes away.',
    medicion: 'Before you decide',
    faq: 'Frequently asked questions',
    faqTitular: 'What teams in this area actually ask.',
    faqTodas: 'See all questions',
    otros: 'Other programs',
    otrosTitular: 'Is another area the one that needs to start?',
    verTodos: 'View all programs',
    comoFunciona: 'How BECOME NOW™ works',
    sesionN: (n) => `Session ${n}: `,
  },
};

const Parrafos = ({ textos, dark, lead }) => (
  <div style={{ marginTop: 'var(--space-6)', display: 'grid', gap: 'var(--space-5)', maxWidth: 'var(--maxw-prose)' }}>
    {(textos || []).map((t, i) => (
      <Reveal
        as="p" key={i} index={i}
        style={{
          margin: 0,
          font: lead && i === 0 ? 'var(--type-lead)' : 'var(--type-body)',
          color: dark
            ? (lead && i === 0 ? 'var(--slate-100)' : 'var(--slate-200)')
            : (lead && i === 0 ? 'var(--text-body)' : 'var(--text-muted)'),
        }}
      >
        {t}
      </Reveal>
    ))}
  </div>
);

const Pildoras = ({ items, fuerte }) => (
  <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
    {(items || []).map((x) => (
      <span key={x} style={{
        padding: fuerte ? '10px 16px' : '8px 14px',
        border: `1px solid ${fuerte ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
        borderRadius: 'var(--radius-pill)', font: 'var(--type-body)',
        fontSize: 'var(--text-body-sm)', color: fuerte ? 'var(--text-heading)' : 'var(--text-body)',
      }}>{x}</span>
    ))}
  </div>
);

export default function ProgramaBase({ lang = 'es' }) {
  const { slug } = useParams();
  const t = T[lang] || T.es;
  const base = (lang === 'en' ? EN_PROGRAMS : ES_PROGRAMS)[slug];
  const c = COPY_PROGRAMAS[slug]?.[lang];
  if (!base || !c) return <Navigate to={t.raiz} replace />;

  const catalogo = lang === 'en' ? EN_PROGRAMS : ES_PROGRAMS;
  const grupoDe = (s) => (PROGRAM_GROUPS.find((g) => g.slugs.includes(s)) || {}).title || '';
  const otros = (c.otros?.programas || [])
    .map((s) => ({ slug: s, p: catalogo[s], grupo: grupoDe(s) }))
    .filter((x) => x.p);

  return (
    <main id={t.contenido} data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>{c.eyebrow}</Kicker>
        <Headline as="h1" dark>{c.h1}</Headline>
        <Lead dark>{c.lead}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to={`${t.raiz}#disena-tu-programa`}>{base.cta}</PrimaryCTA>
          <GhostCTA to={t.raiz} dark>{t.comoFunciona}</GhostCTA>
        </div>
      </Section>

      {/* 4 · El problema habitual, y para quién es */}
      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>{t.problema}</Kicker>
            <Headline>{c.problema.titular}</Headline>
            <Parrafos textos={c.problema.parrafos} />
          </Reveal>
          <Reveal as="div">
            <Kicker>{t.paraQuien}</Kicker>
            <Pildoras items={base.who} />
          </Reveal>
        </div>
      </Section>

      {/* 5 · Sesión 0 */}
      <Section band="darker">
        <Kicker dark>{t.antesMalla}</Kicker>
        <Headline dark>{c.sesion0.titular}</Headline>
        <Parrafos textos={c.sesion0.parrafos} dark lead />
        <TextCTA to={`${t.raiz}#sesion-0`} dark>{t.quéSeTrabaja}</TextCTA>
      </Section>

      {base.processes && (
        <Section band="light">
          <Kicker>{t.procesos}</Kicker>
          <Headline>{t.procesosTitular}</Headline>
          <Pildoras items={base.processes} />
        </Section>
      )}

      {/* 6 · La ruta de seis sesiones */}
      <Section band={base.processes ? 'sunken' : 'light'}>
        <Kicker>{t.ruta}</Kicker>
        <Headline>{c.ruta.bajada || base.h1}</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {c.ruta.pasos.map(([titulo, queda], i) => (
            <Reveal as="div" key={titulo} data-cols className="row-hit"
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
                <span className="sr-only">{t.sesionN(i + 1)}</span>{titulo}
              </h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '62ch' }}>
                <span style={{ color: 'var(--text-accent)' }}>{t.queda}</span>{queda}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 7 · Con qué se valida un output en esta área */}
      <Section band="dark">
        <Kicker dark>{t.sesion}</Kicker>
        <Headline dark>{c.sesion.titular}</Headline>
        <Parrafos textos={c.sesion.parrafos} dark lead />
      </Section>

      {/* 8 · La tecnología del área. Lo demás, en la página madre. */}
      <Section band="darker">
        <Kicker dark>{t.tecnologia}</Kicker>
        <Parrafos textos={c.tecnologia} dark lead />
        <TextCTA to={`${t.raiz}#tecnologia`} dark>{t.tecnologiaMas}</TextCTA>
      </Section>

      {/* 9 · Entregables propios del área */}
      <Section band="light">
        <Kicker>{t.entregables}</Kicker>
        <Headline>{t.entregablesTitular}</Headline>
        <Pildoras items={c.entregables} fuerte />
      </Section>

      {/* 10 · Qué se mediría, y desde qué línea base */}
      <Section band="sunken">
        <Kicker>{t.medicion}</Kicker>
        {c.medicion.titular && <Headline>{c.medicion.titular}</Headline>}
        <Parrafos textos={c.medicion.parrafos} lead />
      </Section>

      {/* 11 · Las preguntas de esta área, no las genéricas */}
      <Section band="light">
        <Kicker>{t.faq}</Kicker>
        <Headline>{t.faqTitular}</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {c.faq.map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '68ch' }}>{a}</p>
            </details>
          ))}
        </div>
        <TextCTA to={t.raiz}>{t.faqTodas}</TextCTA>
      </Section>

      {/* 12 · Los programas vecinos, distintos en cada página */}
      <Section band="sunken">
        <Kicker>{t.otros}</Kicker>
        <Headline>{t.otrosTitular}</Headline>
        {c.otros?.texto && <Body style={{ marginTop: 'var(--space-6)' }}>{c.otros.texto}</Body>}
        <Cols min="240px" style={{ marginTop: 'var(--space-9)' }}>
          {otros.map(({ slug: s, p, grupo }) => (
            <Card key={s}>
              {/* La tarjeta no repite la descripción del otro programa. Esa
                  descripción es un párrafo largo, y aparecía idéntica en las
                  dos o tres páginas que enlazan a ese programa: seis veces la
                  misma, en el caso de Data & Analytics. Lo que explica por qué
                  van estos tres y no otros es el párrafo de arriba, que sí es
                  propio de esta página. */}
              <Link to={`${t.raiz}/${s}`} style={{ textDecoration: 'none' }}>
                <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-accent)' }}>{grupo}</p>
                <p style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                  {p.area}
                </p>
              </Link>
            </Card>
          ))}
        </Cols>
        <TextCTA to={`${t.raiz}#programas`}>{t.verTodos}</TextCTA>
      </Section>

      {/* 13 · El cierre, con la pregunta propia del área */}
      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>{c.eyebrow}</Kicker>
        <Headline dark>{c.cta}</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to={`${t.raiz}#disena-tu-programa`}>{base.cta}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
