import { campo, listasDe } from '../content/paginas/index.js';
import React from 'react';
import Resultado from '../components/suscripcion/Resultado.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, PrimaryCTA, IndexRow } from '../components/ui.jsx';
import Listado from '../components/insights/Listado.jsx';

/**
 * Insights (§13 del documento).
 *
 * Autoridad mediante ideas propias, no un repositorio de SEO. El listado de
 * artículos lo pone Listado, que sigue diciendo que no hay nada publicado
 * mientras sea verdad en vez de mostrar tarjetas con fechas inventadas. Los
 * cinco pilares editoriales son el compromiso de qué se va a publicar, y son
 * también las claves con las que cada artículo declara a cuál pertenece.
 */

const LISTAS = listasDe('insights');

const PILLARS = LISTAS.PILLARS;

const FORMATS = LISTAS.FORMATS;

export default function Insights() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>{campo('insights', 's1kicker')}</Kicker>
        <Headline as="h1" dark>{campo('insights', 's1headline')}</Headline>
        <Lead dark>{campo('insights', 's1lead')}</Lead>
      </Section>

      <Section band="light">
        {/* Lo que se ve al volver de un enlace del correo: alta confirmada, o
            la baja. Va aquí porque es donde llevan esos enlaces. */}
        <Resultado />
        <Listado lang="es" />
      </Section>

      <Section band="darker">
        <Kicker dark>{campo('insights', 's2kicker')}</Kicker>
        <Headline dark>{campo('insights', 's2headline')}</Headline>
        <Lead dark>{campo('insights', 's2lead')}</Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {PILLARS.map(([name, line], i) => (
            <IndexRow key={name} index={i} dark num={String(i + 1).padStart(2, '0')} term={name} def={line} />
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>{campo('insights', 's3kicker')}</Kicker>
        <Headline>{campo('insights', 's3headline')}</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {FORMATS.map(([name, line], i) => <IndexRow key={name} index={i} term={name} def={line} />)}
        </div>
      </Section>

      <Section band="dark" pad="var(--space-13)">
        <Kicker dark>{campo('insights', 's4kicker')}</Kicker>
        <Headline dark>{campo('insights', 's4headline')}</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Contáctanos</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
