import TEXTOS from '../../content/industrias-hub.json' with { type: 'json' };
import React from 'react';
import SiteHeader from '../SiteHeader.jsx';
import SiteFooter from '../SiteFooter.jsx';
import Reveal from '../Reveal.jsx';
import KineticGrid from '../KineticGrid.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, IndexRow, Cols, Card } from '../ui.jsx';
import { VendorNeutral } from '../tecnologia.jsx';
import { INDUSTRIAS, LENTES, urlIndustria } from '../../content/industrias.js';

/**
 * El índice de industrias, en los dos idiomas.
 *
 * ---- Por qué no es «los sectores en los que trabajamos» ----
 *
 * Esa es la página que tiene cualquier consultora tradicional, y dice lo mismo
 * que las demás: una lista de sectores con una foto. Aquí la pregunta que
 * ordena la página es otra —qué necesita cambiar DENTRO de esta industria para
 * competir en una era AI-native— y por eso lo primero que se lee después del
 * titular no son los seis sectores, sino las seis lentes con las que se mira
 * cualquiera de ellos.
 *
 * Las lentes van antes que la lista a propósito: quien llega buscando su sector
 * lo va a encontrar igual —está justo debajo, numerado—, pero de camino se
 * entera de que aquí no se empieza por la herramienta.
 */

const T = TEXTOS;

export default function HubIndustrias({ lang = 'es' }) {
  const t = T[lang] || T.es;
  const contacto = lang === 'en' ? '/en/contact' : '/es/contacto';

  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-13)" backdrop={<KineticGrid />} scrim="soft">
        <Kicker dark>{t.kicker}</Kicker>
        <Headline as="h1" dark>{t.h1}</Headline>
        <Lead dark>{t.lead}</Lead>
      </Section>

      <Section band="light">
        <Kicker>{t.lentesKicker}</Kicker>
        <Headline>{t.lentes}</Headline>
        <Lead>{t.lentesLead}</Lead>
        <Cols min="240px" style={{ marginTop: 'var(--space-10)' }}>
          {(LENTES[lang] || LENTES.es).map(([nombre, linea]) => (
            <Reveal as="div" key={nombre} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-accent)' }}>
                {nombre}
              </h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="darker">
        <Kicker dark>{t.listaKicker}</Kicker>
        <Headline dark>{t.lista}</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {INDUSTRIAS.map((ind, i) => (
            <IndexRow
              key={ind.slug[lang]}
              to={urlIndustria(ind, lang)}
              index={i}
              icon={ind.icon}
              dark
              num={String(i + 1).padStart(2, '0')}
              term={ind[lang].nombre}
              def={ind[lang].menu}
            />
          ))}
        </div>
        <Body dark style={{ marginTop: 'var(--space-8)' }}>{t.aviso}</Body>
      </Section>

      {/* La garantía de neutralidad, con el mismo texto que en el resto del
          sitio. Va aquí porque una página de industrias es exactamente donde
          alguien espera encontrar logotipos de partners, y donde importa
          explicar por qué no los hay. */}
      <VendorNeutral lang={lang} />

      <Section band="light" pad="var(--space-13)">
        <Reveal as="div">
          <Kicker>{t.ctaKicker}</Kicker>
          <Headline>{t.cta}</Headline>
          <Lead>{t.ctaTexto}</Lead>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <PrimaryCTA to={contacto}>{t.ctaBoton}</PrimaryCTA>
          </div>
        </Reveal>
      </Section>

      <SiteFooter />
    </main>
  );
}
