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

const T = {
  es: {
    kicker: 'Industrias',
    h1: 'La IA cambia la tecnología. La industria define dónde está el valor.',
    lead: 'Las capacidades son transversales. El valor no. Lo que decide el resultado es qué decisiones, qué procesos y qué riesgos definen tu industria.',
    lentesKicker: 'Dónde está el valor',
    lentes: 'No empezamos por la herramienta.',
    lentesLead: 'Antes de hablar de modelos, miramos una industria por seis lentes. Son las mismas seis en todos los sectores: lo que cambia entre uno y otro es la respuesta, no la pregunta.',
    listaKicker: 'Seis industrias',
    lista: 'Encuentra la tuya y empieza por su problema, no por su tecnología.',
    aviso: 'Si tu industria no está aquí, el método no cambia. Las lentes son las mismas y la conversación empieza igual.',
    ctaKicker: 'Empieza por dentro',
    cta: 'Empieza por el problema que vale la pena transformar.',
    ctaTexto: 'Cuéntanos qué decisión, qué proceso o qué experiencia tiene que cambiar en tu industria. Respondemos con el punto de partida adecuado, no con una secuencia comercial.',
    ctaBoton: 'Hablemos de tu iniciativa',
    banner: 'La tecnología puede ser la misma. El valor no.',
  },
  en: {
    kicker: 'Industries',
    h1: 'AI changes the technology. The industry defines where the value is.',
    lead: 'Capabilities are horizontal. Value is not. What decides the outcome is which decisions, which processes and which risks define your industry.',
    lentesKicker: 'Where the value is',
    lentes: 'We do not start with the tool.',
    lentesLead: 'Before talking about models, we look at an industry through six lenses. They are the same six in every sector: what changes between one and another is the answer, not the question.',
    listaKicker: 'Six industries',
    lista: 'Find yours and start with its problem, not with its technology.',
    aviso: 'If your industry is not listed, the method does not change. The lenses are the same and the conversation starts the same way.',
    ctaKicker: 'Start inside',
    cta: 'Start with the problem worth transforming.',
    ctaTexto: 'Tell us which decision, which process or which experience has to change in your industry. We reply with the right starting point, not with a sales sequence.',
    ctaBoton: 'Let’s talk about your initiative',
    banner: 'The technology can be the same. The value is not.',
  },
};

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
