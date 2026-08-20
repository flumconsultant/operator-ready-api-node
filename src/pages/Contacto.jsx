import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import ConversationalForm from '../components/ConversationalForm.jsx';
import { Section, Kicker, Headline, Lead, Body, GhostCTA } from '../components/ui.jsx';
import { Ico, IcoBadge } from '../components/icons.jsx';

/**
 * Contáctanos (§14 del documento).
 *
 * El objetivo es abrir y calificar una conversación ejecutiva, no montar un
 * formulario de procurement. De ahí las ausencias, que son decisiones: no se
 * pide teléfono, no se obliga a elegir presupuesto y la newsletter no viene
 * premarcada. Cada campo de más es una razón más para no enviarlo.
 *
 * Va de una pregunta en una pregunta porque la página promete una conversación
 * y no una secuencia comercial; el formulario debería comportarse igual que la
 * promesa. El recorrido completo queda a la vista en el carril de la izquierda,
 * que es lo que evita el efecto de embudo sin fondo, y quien prefiera verlo todo
 * de golpe tiene el interruptor arriba.
 *
 * "Qué ocurre después" ya no es una columna al lado del formulario: cuando el
 * formulario ocupa dos columnas por sí solo, un aside lo estrecha hasta hacerlo
 * incómodo. Está debajo, con su propio aire.
 */

const FIELDS = [
  { name: 'nombre', short: 'Nombre', label: '¿Cómo te llamas?', required: true, autoComplete: 'name' },
  { name: 'email', short: 'Email', label: 'Tu email corporativo', type: 'email', required: true, autoComplete: 'email' },
  { name: 'empresa', short: 'Empresa', label: '¿En qué empresa trabajas?', required: true, autoComplete: 'organization' },
  { name: 'rol', short: 'Rol', label: '¿Cuál es tu rol?', required: true, autoComplete: 'organization-title' },
  {
    name: 'cambio', short: 'Qué debe cambiar', label: '¿Qué necesita cambiar?', type: 'textarea', required: true, wide: true,
    help: 'El resultado de negocio, la capacidad o el proceso que necesitas transformar. Sin formalidades.',
  },
  {
    name: 'etapa', short: 'Etapa actual', label: '¿En qué etapa estáis hoy?', type: 'select',
    options: [
      'Definiendo la estrategia',
      'Priorizando oportunidades',
      'Diseñando el operating model',
      'Construyendo una capacidad',
      'Escalando una solución existente',
    ],
    default: 'Definiendo la estrategia',
  },
  { name: 'timeline', short: 'Plazo', label: '¿Para cuándo?', placeholder: 'Por ejemplo: este trimestre' },
];

const NEXT = [
  ['signpost', 'Leemos tu contexto', 'Lo mapeamos a las etapas del framework BECOME para saber por dónde entra.'],
  ['calendar', 'Conversación de 30 minutos', 'Centrada en el resultado de negocio y en las restricciones que tienes hoy.'],
  ['target', 'Definimos el primer paso', 'BECOME NOW™, BECOME DISCOVER™ o BECOME EMBED™. El que corresponda, no el más grande.'],
];

export default function Contacto() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Start a conversation</Kicker>
        <Headline as="h1" dark>¿Qué necesita cambiar dentro de tu empresa?</Headline>
        <Lead dark>
          El resultado de negocio, la capacidad o el proceso. Respondemos con el
          punto de partida adecuado, no con una secuencia comercial.
        </Lead>
      </Section>

      <Section band="light">
        <ConversationalForm
          formName="Inicia una conversación con BECOME"
          title="Cuéntanoslo en una conversación, no en un formulario."
          lead="Siete preguntas, una cada vez, a pantalla completa. Sin campos de procurement ni casillas premarcadas."
          launchLabel="Empezar la conversación"
          fields={FIELDS}
          submitLabel="Iniciemos la conversación"
          confirmation="Gracias. Revisaremos el contexto y responderemos con la conversación adecuada, no con una secuencia comercial automatizada."
          dark={false}
          formId="contacto"
        />
      </Section>

      <Section band="sunken">
        <Kicker>Qué ocurre después</Kicker>
        <Headline>Tres pasos, y ninguno es una secuencia comercial.</Headline>
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-8)', marginTop: 'var(--space-10)' }}>
          {NEXT.map(([icon, title, line], i) => (
            <Reveal as="div" key={title} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <IcoBadge name={icon} />
              <p style={{ margin: 'var(--space-5) 0 0', font: 'var(--type-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-accent)' }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {title}
              </h3>
              <Body>{line}</Body>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline)', display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
          <GhostCTA to="/es/casos-de-uso">Mira antes por dónde empezar</GhostCTA>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, font: 'var(--type-body)', color: 'var(--text-muted)' }}>
            <Ico name="chat" size={20} style={{ color: 'var(--text-accent)' }} />
            O escríbenos a{' '}
            <a href="mailto:hello@meetbecome.com" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 24, color: 'var(--text-accent)' }}>hello@meetbecome.com</a>
          </span>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
