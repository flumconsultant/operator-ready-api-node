import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body } from '../components/ui.jsx';

/**
 * Contáctanos (§14 del documento).
 *
 * El objetivo es abrir y calificar una conversación ejecutiva, no montar un
 * formulario de procurement. De ahí las ausencias, que son decisiones: no se
 * pide teléfono, no se obliga a elegir presupuesto y la newsletter no viene
 * premarcada. Cada campo de más es una razón más para no enviarlo.
 *
 * El envío hoy no llega a ningún sitio: no hay backend. La confirmación lo dice
 * en vez de fingir que se ha enviado — ver la nota bajo el formulario.
 */

const STAGES = [
  'Definiendo la estrategia',
  'Priorizando oportunidades',
  'Diseñando el operating model',
  'Construyendo una capability',
  'Escalando una solución existente',
];

export default function Contacto() {
  const [sent, setSent] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {sent ? (
          <div role="status" aria-live="polite" style={{ maxWidth: 'var(--maxw-prose)' }}>
            <Kicker>Recibido</Kicker>
            <Headline>Gracias.</Headline>
            <Body style={{ marginTop: 'var(--space-6)', font: 'var(--type-lead)', color: 'var(--text-body)' }}>
              Revisaremos el contexto y responderemos con la conversación adecuada,
              no con una secuencia comercial automatizada.
            </Body>
            <Body>
              Nota honesta mientras el sitio está en construcción: este formulario
              todavía no está conectado a ningún destino, así que tu mensaje no ha
              salido de tu navegador. Escríbenos a{' '}
              <a href="mailto:hello@become.company" style={{ color: 'var(--text-accent)' }}>hello@become.company</a>{' '}
              y lo leemos hoy.
            </Body>
          </div>
        ) : (
          <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 'var(--space-10)' }}>
            <Reveal as="form" onSubmit={submit} noValidate={false}>
              <div data-cols style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                <div>
                  <label htmlFor="nombre">Nombre</label>
                  <input id="nombre" name="nombre" type="text" required autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="email">Email corporativo</label>
                  <input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="empresa">Empresa</label>
                  <input id="empresa" name="empresa" type="text" required autoComplete="organization" />
                </div>
                <div>
                  <label htmlFor="rol">Rol</label>
                  <input id="rol" name="rol" type="text" required autoComplete="organization-title" />
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <label htmlFor="cambio">¿Qué necesita cambiar?</label>
                <textarea id="cambio" name="cambio" rows={5} required style={{ minHeight: 140, resize: 'vertical' }} />
              </div>

              <div data-cols style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                <div>
                  <label htmlFor="etapa">Etapa actual</label>
                  <select id="etapa" name="etapa" defaultValue={STAGES[0]}>
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline">Timeline (opcional)</label>
                  <input id="timeline" name="timeline" type="text" placeholder="Por ejemplo: este trimestre" />
                </div>
              </div>

              <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)', maxWidth: '58ch' }}>
                Usaremos estos datos únicamente para responder a tu consulta y valorar
                el punto de partida adecuado. No te suscribimos a nada ni compartimos
                la información con terceros.
              </p>

              <button
                type="submit"
                style={{
                  marginTop: 'var(--space-7)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: 52, padding: '0 var(--space-7)', borderRadius: 'var(--radius-pill)', border: 0,
                  background: 'var(--electric-green)', color: 'var(--deep-navy)', cursor: 'pointer',
                  font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
                  width: 'auto',
                }}
                className="cta-primary"
              >
                Iniciemos la conversación
              </button>
            </Reveal>

            <Reveal as="aside">
              <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                  Qué ocurre después
                </h2>
                <ol style={{ margin: 'var(--space-6) 0 0', padding: '0 0 0 1.2em', display: 'grid', gap: 'var(--space-4)', color: 'var(--text-muted)' }}>
                  <li>Leemos tu contexto y lo mapeamos a las etapas BECOME.</li>
                  <li>Proponemos una conversación de 30 minutos centrada en el business outcome y las restricciones actuales.</li>
                  <li>Definimos juntos si Discovery o Build &amp; Embed es el primer paso adecuado.</li>
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
        )}
      </Section>

      <SiteFooter />
    </div>
  );
}
