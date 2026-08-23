import { campo, listasDe } from '../content/paginas/index.js';
import React from 'react';
import { BloqueAgenda } from '../components/Agendar.jsx';
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

const LISTAS = listasDe('contacto');

const FIELDS = LISTAS.FIELDS;

const NEXT = LISTAS.NEXT;

export default function Contacto() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>{campo('contacto', 's1kicker')}</Kicker>
        <Headline as="h1" dark>{campo('contacto', 's1headline')}</Headline>
        <Lead dark>{campo('contacto', 's1lead')}</Lead>
      </Section>

      <Section band="light">
        <ConversationalForm
          formName="Diagnóstico inicial BECOME"
          title="Cuéntanos el contexto esencial."
          lead="No necesitas tener la solución definida. Queremos entender qué necesita cambiar, qué prioridad tiene y qué restricciones debemos considerar."
          launchLabel="Empezar"
          fields={FIELDS}
          submitLabel="Enviar contexto"
          confirmation="Gracias. Ya tenemos el contexto inicial. Revisaremos lo que compartiste para identificar el punto de partida más adecuado y te propondremos una conversación centrada en el resultado, las restricciones y el siguiente paso."
          dark={false}
          formId="contacto"
        />
      </Section>

      {/* La alternativa al formulario, para quien ya viene decidido. Va
          después del formulario y no antes: quien llega aquí ya eligió
          escribir, y ofrecerle una llamada primero es cambiarle el paso que
          estaba dando. */}
      <Section band="light" pad="var(--space-10)">
        <BloqueAgenda lang="es" origen="contacto" />
      </Section>

      <Section band="sunken">
        <Kicker>{campo('contacto', 's2kicker')}</Kicker>
        <Headline>{campo('contacto', 's2headline')}</Headline>
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
          <GhostCTA to="/es/casos-de-uso">Ver los casos de uso de IA</GhostCTA>
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
