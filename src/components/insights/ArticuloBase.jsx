import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SiteHeader from '../SiteHeader.jsx';
import SiteFooter from '../SiteFooter.jsx';
import Reveal from '../Reveal.jsx';
import { Section, Kicker, Headline, Lead, PrimaryCTA, TextCTA } from '../ui.jsx';
import Bloques from './Bloques.jsx';
import Compartir from './Compartir.jsx';
import { SITE } from '../../seo-meta.js';
import { ARTICULOS, PILARES, FORMATOS, fechaLegible, minutosDeLectura } from '../../content/insights.js';

/**
 * Plantilla de artículo, compartida por los dos idiomas.
 *
 * Dos componentes idénticos —uno por idioma— se habrían desincronizado a la
 * tercera edición, que es exactamente lo que ya se decidió para las páginas de
 * solución. Aquí lo único que cambia entre idiomas es el puñado de rótulos de
 * COPIA y el contenido del artículo, así que eso es lo que se parametriza.
 *
 * El artículo abre en banda oscura y cierra en banda oscura, con el cuerpo en
 * claro entre las dos. No es una elección estética suelta: es el ritmo que ya
 * tiene el resto del sitio, y significa que un artículo publicado desde el
 * panel no puede aterrizar pareciendo de otra web.
 */

const COPIA = {
  es: {
    volver: 'Todos los insights',
    indice: '/es/insights',
    contacto: '/es/contacto',
    lectura: (n) => `${n} min de lectura`,
    cierreKicker: 'Become insights',
    cierre: '¿Qué idea necesita convertirse en capacidad?',
    cta: 'Contáctanos',
    siguiente: 'Sigue leyendo',
  },
  en: {
    volver: 'All insights',
    indice: '/en/insights',
    contacto: '/en/contact',
    lectura: (n) => `${n} min read`,
    cierreKicker: 'Become insights',
    cierre: 'Which idea needs to become a capability?',
    cta: 'Get in touch',
    siguiente: 'Keep reading',
  },
};

const COLUMNA = { maxWidth: 'var(--maxw-articulo)', marginInline: 'auto' };

export default function ArticuloBase({ lang }) {
  const { slug } = useParams();
  const t = COPIA[lang];
  const art = ARTICULOS.find((a) => a[lang]?.slug === slug);

  /* Un artículo que existe en un idioma y todavía no en el otro no debe dar la
     home: devuelve al índice de Insights del idioma pedido, que es donde la
     persona puede encontrar algo equivalente. */
  if (!art || !art[lang]) return <Navigate to={t.indice} replace />;

  const a = art[lang];
  const pilar = PILARES[art.pilar]?.[lang];
  const formato = FORMATOS[art.formato]?.[lang];
  const minutos = minutosDeLectura(a.bloques);

  /* Dos artículos más del mismo idioma, priorizando el mismo pilar: una
     recomendación por tema es más útil que las dos últimas por fecha, y es lo
     que sostiene la sesión de lectura en vez de devolver la persona al índice. */
  const otros = ARTICULOS
    .filter((o) => o !== art && o[lang]?.slug)
    .sort((x, y) => (y.pilar === art.pilar) - (x.pilar === art.pilar))
    .slice(0, 2);

  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      {/* Una página de artículo se lee en una sola columna centrada, y no en el
          ancho de contenido del resto del sitio. En las páginas de aterrizaje el
          texto alineado a la izquierda lo equilibra lo que hay a su derecha
          —tarjetas, parrillas, el nodo—; en un artículo no hay nada a la
          derecha, así que veinte párrafos pegados al margen izquierdo dejan
          setecientos píxeles de vacío y parecen un fallo de maquetación.

          La columna envuelve también la cabecera: centrar solo el cuerpo
          descuadraba la costura entre la banda oscura y la clara. */}
      <Section band="dark" pad="var(--space-12)">
        <div style={COLUMNA}>
          <Kicker dark>{[pilar, formato].filter(Boolean).join(' · ')}</Kicker>
          <Headline as="h1" dark style={{ maxWidth: 'none' }}>{a.titulo}</Headline>
          {a.entradilla && <Lead dark>{a.entradilla}</Lead>}
          <p style={{ margin: 'var(--space-8) 0 0', font: 'var(--type-mono)', color: 'var(--slate-400)' }}>
            <time dateTime={art.fecha}>{fechaLegible(art.fecha, lang)}</time>
            {' · '}{t.lectura(minutos)}
            {art.autor ? ` · ${art.autor}` : ''}
          </p>
        </div>
      </Section>

      <Section band="light">
        <div style={COLUMNA}>
          <Bloques bloques={a.bloques} lang={lang} />
          {/* Al final y no al principio: se comparte lo que se ha terminado de
              leer, y una fila de botones antes del primer párrafo compite con
              el propio artículo por la atención. */}
          <Compartir
            url={`${SITE}/${lang}/insights/${a.slug}`}
            titulo={a.titulo}
            lang={lang}
          />
          <div style={{ marginTop: 'var(--space-9)' }}>
            <TextCTA to={t.indice}>{t.volver}</TextCTA>
          </div>
        </div>
      </Section>

      {otros.length > 0 && (
        <Section band="darker">
          <Kicker dark>{t.siguiente}</Kicker>
          <div style={{ marginTop: 'var(--space-8)', display: 'grid', gap: 'var(--space-6)' }}>
            {otros.map((o, i) => (
              <Reveal key={o[lang].slug} as="div" index={i}>
                <Link
                  to={`${t.indice}/${o[lang].slug}`}
                  style={{ display: 'block', textDecoration: 'none', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline-dark)' }}
                >
                  <span style={{ font: 'var(--type-mono)', color: 'var(--slate-400)' }}>
                    {PILARES[o.pilar]?.[lang] || ''}
                  </span>
                  <span style={{ display: 'block', marginTop: 'var(--space-3)', font: 'var(--type-h3)', color: 'var(--white)' }}>
                    {o[lang].titulo}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section band="dark" pad="var(--space-13)">
        <Kicker dark>{t.cierreKicker}</Kicker>
        <Headline dark>{t.cierre}</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to={t.contacto}>{t.cta}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
