import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import ConversationalForm from '../components/ConversationalForm.jsx';
import { Section, Kicker, Headline, Lead } from '../components/ui.jsx';

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
 * promesa. Quien prefiera verlo entero tiene el interruptor arriba.
 */

const FIELDS = [
  { name: 'nombre', label: '¿Cómo te llamas?', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Tu email corporativo', type: 'email', required: true, autoComplete: 'email' },
  { name: 'empresa', label: '¿En qué empresa trabajas?', required: true, autoComplete: 'organization' },
  { name: 'rol', label: '¿Cuál es tu rol?', required: true, autoComplete: 'organization-title' },
  {
    name: 'cambio', label: '¿Qué necesita cambiar?', type: 'textarea', required: true, wide: true,
    help: 'El business outcome, la capability o el workflow que necesitas transformar. Sin formalidades.',
  },
  {
    name: 'etapa', label: '¿En qué etapa estáis hoy?', type: 'select',
    options: [
      'Definiendo la estrategia',
      'Priorizando oportunidades',
      'Diseñando el operating model',
      'Construyendo una capability',
      'Escalando una solución existente',
    ],
    default: 'Definiendo la estrategia',
  },
  { name: 'timeline', label: '¿Para cuándo?', placeholder: 'Por ejemplo: este trimestre' },
];

export default function Contacto() {
  return (
    <div data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Start a conversation</Kicker>
        <Headline as="h1" dark>¿Qué necesita cambiar dentro de tu empresa?</Headline>
        <Lead dark>
          Cuéntanos el business outcome, la capability o el workflow que necesitas
          transformar. Te responderemos con el punto de partida adecuado.
        </Lead>
      </Section>

      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 'var(--space-10)' }}>
          <ConversationalForm
            formName="Inicia una conversación con BECOME"
            fields={FIELDS}
            submitLabel="Iniciemos la conversación"
            confirmation="Gracias. Revisaremos el contexto y responderemos con la conversación adecuada, no con una secuencia comercial automatizada."
            dark={false}
          />

          <Reveal as="aside">
            <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                Qué ocurre después
              </h2>
              <ol style={{ margin: 'var(--space-6) 0 0', padding: '0 0 0 1.2em', display: 'grid', gap: 'var(--space-4)', color: 'var(--text-muted)' }}>
                <li>Leemos tu contexto y lo mapeamos a las etapas BECOME.</li>
                <li>Proponemos una conversación de 30 minutos centrada en el business outcome y las restricciones actuales.</li>
                <li>Definimos juntos si BECOME NOW™, Discovery o Build &amp; Embed es el primer paso adecuado.</li>
              </ol>
            </div>

            <div style={{ marginTop: 'var(--space-9)', borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-5)' }}>
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                También puedes escribirnos
              </p>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)' }}>
                <a href="mailto:hello@become.company" style={{ color: 'var(--text-accent)' }}>hello@become.company</a>
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
