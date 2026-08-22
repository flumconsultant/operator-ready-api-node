import TEXTOS from '../content/tecnologia.json' with { type: 'json' };
import React from 'react';
import Reveal from './Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, Cols } from './ui.jsx';

/**
 * Los dos bloques de tecnología de la home, en un solo sitio y en dos idiomas.
 *
 * ---- La regla que gobierna estos textos ----
 *
 * Nombrar modelos y proveedores sirve para demostrar que aquí se conoce el
 * ecosistema real, no para posicionarse como implementador de una herramienta.
 * Por eso las marcas nunca aparecen en un titular ni en el hero: aparecen en el
 * cuerpo, en plural y siempre seguidas de «u otros», que es la verdad —la
 * elección depende del caso, no del proveedor.
 *
 * Y por eso son texto y no logotipos. Una fila de logotipos se lee como
 * alianza comercial, y BECOME no es partner oficial de ninguno de ellos.
 * Insinuarlo con una imagen es una afirmación que no se puede sostener.
 */

const T = TEXTOS;

export function MasIaNoEsTransformacion({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    <Section band="sunken">
      <Kicker>{t.problemaKicker}</Kicker>
      <Headline>{t.problemaTitulo}</Headline>
      <Lead>{t.problemaLead}</Lead>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.problemaCuerpo}</Body>
    </Section>
  );
}

export function VendorNeutral({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    /* Compacto a propósito: es una garantía, no un argumento de venta. Una
       sección larga aquí competiría con los tres servicios que acaba de leer
       quien llega hasta aquí. */
    <Section band="dark" pad="var(--space-11)">
      <Kicker dark>{t.neutralKicker}</Kicker>
      <Headline dark>{t.neutralTitulo}</Headline>
      <Lead dark>{t.neutralLead}</Lead>
      <div style={{ marginTop: 'var(--space-7)', display: 'grid', gap: 'var(--space-5)', maxWidth: 'var(--maxw-prose)' }}>
        <Reveal as="p" index={0} style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>
          {t.neutralCuerpo}
        </Reveal>
        <Reveal as="p" index={1} style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>
          {t.neutralEcosistema}
        </Reveal>
        <Reveal
          as="p"
          index={2}
          style={{
            margin: 'var(--space-4) 0 0', paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--green-line)',
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
            fontSize: 'var(--text-h3)', lineHeight: 1.3, color: 'var(--white)',
          }}
        >
          {t.neutralCierre}
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * El bloque de la página de BECOME NOW™, justo después de la Sesión 0.
 *
 * Va ahí y no antes porque solo tiene sentido cuando ya se ha explicado que el
 * programa se diseña sobre el entorno de la empresa: la lista de herramientas
 * es la consecuencia de eso, no una oferta de catálogo.
 */
export function HerramientasCambian({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    <Section band="light">
      <Kicker>{t.herramientasKicker}</Kicker>
      <Headline>{t.herramientasTitulo}</Headline>
      <Lead>{t.herramientasLead}</Lead>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.herramientasCuerpo}</Body>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.herramientasIntro}</Body>
      <ul style={{
        listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0,
        display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)',
      }}>
        {t.herramientasLista.map((x, i) => (
          /* Etiquetas y no logotipos: una fila de logotipos se lee como alianza
             comercial, y aquí no la hay. */
          <Reveal as="li" index={i} key={x} style={{
            padding: '8px 14px', border: '1px solid var(--border-strong)', borderRadius: 2,
            font: 'var(--type-mono)', fontSize: 13, color: 'var(--text-body)',
          }}>
            {x}
          </Reveal>
        ))}
      </ul>
      <Body style={{ marginTop: 'var(--space-8)' }}>{t.herramientasCierre}</Body>
    </Section>
  );
}

/**
 * La nota que cierra «Cómo trabajamos» en las catorce páginas funcionales.
 *
 * Un componente y no el texto repetido catorce veces: la lista de herramientas
 * cambiará, y catorce copias garantizan que alguna se quede contando otra cosa.
 * Es una nota, no una sección: en una página de programa funcional lo que
 * importa es el trabajo del área, y la tecnología es una condición de contorno.
 */
export function TecnologiaAdaptada({ lang = 'es', dark = false }) {
  const t = T[lang] || T.es;
  return (
    <Reveal as="div" style={{
      marginTop: 'var(--space-9)', paddingTop: 'var(--space-6)',
      borderTop: '1px solid var(--green-line)', maxWidth: 'var(--maxw-prose)',
    }}>
      <p style={{
        margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
        textTransform: 'uppercase', fontSize: 11,
        color: dark ? 'var(--electric-green)' : 'var(--text-accent)',
      }}>
        {t.adaptadaTitulo}
      </p>
      <Body dark={dark} style={{ marginTop: 'var(--space-4)' }}>{t.adaptadaCuerpo}</Body>
      <Body dark={dark} style={{ marginTop: 'var(--space-4)' }}>{t.adaptadaCierre}</Body>
    </Reveal>
  );
}

/**
 * Las seis capas de una capacidad AI-native, en la página de BECOME EMBED™.
 *
 * Es la sección más técnica del sitio a propósito: EMBED es donde se construye,
 * y quien evalúa esa compra necesita ver los nombres propios de lo que hay
 * debajo —RAG, tool calling, evaluaciones, observabilidad— antes de creer que
 * aquí se sabe operar y no solo prototipar.
 *
 * Las seis capas van en este orden y no en otro: es el recorrido de una
 * petición dentro del sistema, del modelo a la operación. Ordenadas por
 * importancia se leerían como una lista de tecnologías; ordenadas así se leen
 * como una arquitectura.
 */
export function BajoElCapo({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    <Section band="darker">
      <Kicker dark>{t.capoKicker}</Kicker>
      <Headline dark>{t.capoTitulo}</Headline>
      <Cols min="260px">
        {t.capoCapas.map(([nombre, linea]) => (
          <Reveal as="div" key={nombre} className="row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
            <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 13, letterSpacing: 'var(--track-mono)', textTransform: 'uppercase', color: 'var(--electric-green)' }}>
              {nombre}
            </p>
            <Body dark style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
          </Reveal>
        ))}
      </Cols>
    </Section>
  );
}

/** El bloque de landscape tecnológico de BECOME DISCOVER™. */
export function EstrategiaDeModelos({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    /* DISCOVER sigue siendo estratégico: esto no es arquitectura técnica, es
       la lista de opciones que hay sobre la mesa cuando se decide el roadmap.
       Por eso son etiquetas y una frase de criterio, y no diagramas. */
    <Section band="light">
      <Kicker>{t.modelosKicker}</Kicker>
      <Headline>{t.modelosTitulo}</Headline>
      <Lead>{t.modelosLead}</Lead>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.modelosIntro}</Body>
      <ul style={{ listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        {t.modelosLista.map((x, i) => (
          <Reveal as="li" index={i} key={x} style={{
            padding: '8px 14px', border: '1px solid var(--border-strong)', borderRadius: 2,
            font: 'var(--type-mono)', fontSize: 13, color: 'var(--text-body)',
          }}>
            {x}
          </Reveal>
        ))}
      </ul>
      <Body style={{ marginTop: 'var(--space-8)' }}>{t.modelosCierre}</Body>
    </Section>
  );
}
