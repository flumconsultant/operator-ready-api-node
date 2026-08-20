import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, TextCTA, Cols, Card } from '../components/ui.jsx';
import { SOLUCION_CONTENIDO } from '../content/soluciones.js';
import { SOLUCIONES_MENU } from '../site.js';

/**
 * Las seis páginas de caso de uso comparten plantilla y se diferencian solo
 * por contenido (src/content/soluciones.js). Seis componentes idénticos habrían
 * garantizado que se desincronizaran a la tercera edición.
 *
 * El orden de bloques es el del documento (§11) y no es decorativo: la persona
 * reconoce su situación, entiende el problema sistémico que hay detrás, ve qué
 * cambia dentro y solo al final se le nombra un engagement. Nombrar el servicio
 * antes convierte la página en un folleto.
 */
export default function Solucion() {
  const { slug } = useParams();
  const c = SOLUCION_CONTENIDO[slug];
  if (!c) return <Navigate to="/es/soluciones" replace />;

  const others = SOLUCIONES_MENU.filter((u) => u.slug !== slug).slice(0, 3);

  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Start with your question</Kicker>
        <Headline as="h1" dark size="var(--text-h1)">{c.q}</Headline>
        <Lead dark>{c.answer}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">{c.cta}</PrimaryCTA>
        </div>
      </Section>

      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>Esto probablemente te está pasando</Kicker>
            <Headline>Señales que se reconocen desde dentro.</Headline>
          </Reveal>
          <Reveal as="ul" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            {c.signals.map((s) => (
              <li key={s} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline)' }}>
                <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{s}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>El problema detrás del síntoma</Kicker>
        <Reveal as="p" style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-lead)', color: 'var(--slate-100)', maxWidth: '62ch' }}>
          {c.problem}
        </Reveal>
      </Section>

      <Section band="light">
        <Kicker>Cómo agrega valor BECOME</Kicker>
        <Lead>{c.value}</Lead>

        <Cols min="220px">
          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Herramientas
            </p>
            <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
              {c.tools.map((t) => (
                <li key={t} style={{ font: 'var(--type-mono)', color: 'var(--text-heading)' }}>{t}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Qué queda instalado
            </p>
            <Body style={{ marginTop: 'var(--space-5)' }}>{c.result}</Body>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Engagement recomendado
            </p>
            <p style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
              {c.engagement}
            </p>
            <Body style={{ marginTop: 'var(--space-4)' }}>{c.engagementWhy}</Body>
          </Card>
        </Cols>
      </Section>

      {/* Qué cambia dentro: los cinco sistemas, que son la tesis de la casa */}
      <Section band="darker">
        <Kicker dark>Qué cambia dentro</Kicker>
        <Headline dark>People, Data, Agents, Products y Operations.</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          Ninguna de estas situaciones se resuelve en una sola de las cinco capas.
          Por eso el trabajo cruza las cinco: si una queda fuera, el cambio no
          sobrevive al primer trimestre.
        </Body>
        <TextCTA to="/es/framework" dark>Explora el BECOME Framework</TextCTA>
      </Section>

      <Section band="light">
        <Kicker>Otras preguntas</Kicker>
        <Headline>¿Se parece más a alguna de estas?</Headline>
        <Cols min="240px">
          {others.map((o) => (
            <Card key={o.slug}>
              <Link to={o.to} style={{ textDecoration: 'none' }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--text-heading)' }}>
                  {o.q}
                </p>
                <Body style={{ marginTop: 'var(--space-4)' }}>{o.line}</Body>
              </Link>
            </Card>
          ))}
        </Cols>
        <TextCTA to="/es/soluciones">Ver todos los casos de uso</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>{c.q}</Headline>
        <Lead dark>
          Cuéntanos el contexto. Te responderemos con el punto de partida adecuado,
          no con una secuencia comercial.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">{c.cta}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
