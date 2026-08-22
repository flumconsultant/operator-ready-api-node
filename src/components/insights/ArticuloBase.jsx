import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SiteHeader from '../SiteHeader.jsx';
import SiteFooter from '../SiteFooter.jsx';
import Reveal from '../Reveal.jsx';
import { Section, Kicker, Headline, Lead, PrimaryCTA, TextCTA } from '../ui.jsx';
import Bloques from './Bloques.jsx';
import Compartir from './Compartir.jsx';
import Formulario from '../suscripcion/Formulario.jsx';
import { SITE } from '../../seo-meta.js';
import { autorDe } from '../../content/autores.js';
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
    equipo: '/es/nosotros#equipo',
    sobreAutor: 'Sobre el autor',
    perfil: 'Ver perfil',
    fuentes: 'Fuentes y lecturas',
    actualizado: (f) => `Actualizado el ${f}`,
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
    equipo: '/en/about#team',
    sobreAutor: 'About the author',
    perfil: 'View profile',
    fuentes: 'Sources and further reading',
    actualizado: (f) => `Updated on ${f}`,
  },
};

const COLUMNA = { maxWidth: 'var(--maxw-articulo)', marginInline: 'auto' };


/**
 * La firma del artículo.
 *
 * Con foto cuando la ficha la tiene, y sin ella cuando no: un círculo gris con
 * las iniciales es peor que el nombre solo, porque ocupa el sitio de una cara
 * sin serlo. Si algún día hay foto, aparece; mientras tanto, no se finge.
 */
function Firma({ autor, fecha, actualizado, minutos, lang, t }) {
  const ficha = autorDe(autor);
  /* La fecha de actualización solo aparece cuando el artículo se ha tocado de
     verdad. Publicar siempre las dos, iguales, es ruido; y ponerla cuando no
     hay cambio real es decirle a un buscador algo que no ha pasado. */
  const meta = (
    <>
      <time dateTime={fecha}>{fechaLegible(fecha, lang)}</time>
      {actualizado && actualizado !== fecha
        ? <> · <time dateTime={actualizado}>{t.actualizado(fechaLegible(actualizado, lang))}</time></>
        : null}
      {' · '}{t.lectura(minutos)}
    </>
  );

  if (!ficha?.foto) {
    return (
      <p style={{ margin: 'var(--space-8) 0 0', font: 'var(--type-mono)', color: 'var(--slate-400)' }}>
        {meta}{autor ? <> · <Link to={t.equipo} style={{ color: 'inherit' }} className="hv-link">{autor}</Link></> : null}
      </p>
    );
  }

  return (
    <div style={{ margin: 'var(--space-8) 0 0', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <img
        src={ficha.foto}
        alt={autor}
        width={88}
        height={88}
        loading="lazy"
        decoding="async"
        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flex: 'none', background: 'var(--navy-900)' }}
      />
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-100)' }}>
          <Link to={t.equipo} style={{ color: 'inherit' }} className="hv-link">{autor}</Link>
        </p>
        <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 12, color: 'var(--slate-400)' }}>
          {ficha[lang]?.rol ? <>{ficha[lang].rol}{' · '}</> : null}{meta}
        </p>
      </div>
    </div>
  );
}

/**
 * Sobre el autor.
 *
 * Sale de la misma ficha que firma el artículo y que alimenta el Person de los
 * datos estructurados: cargo, credencial verificable y enlace a su perfil. No
 * se escribe aquí nada que no esté en la ficha, para que corregir un cargo siga
 * siendo una edición en el panel y no en el código.
 */
function SobreElAutor({ autor, lang, t }) {
  const ficha = autorDe(autor);
  if (!ficha) return null;
  const f = ficha[lang] || {};
  return (
    <div style={{ marginTop: 'var(--space-11)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-strong)' }}>
      <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {t.sobreAutor}
      </p>
      <p style={{ margin: 'var(--space-5) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--text-heading)' }}>
        <Link to={t.equipo} style={{ color: 'inherit' }} className="hv-link">{ficha.nombre}</Link>
        {f.rol ? ` — ${f.rol}` : ''}
      </p>
      {f.credencial && (
        <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '62ch' }}>{f.credencial}</p>
      )}
      {ficha.linkedin && (
        <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)' }}>
          <a href={ficha.linkedin} rel="noopener me" target="_blank" style={{ color: 'var(--text-accent)' }}>LinkedIn</a>
        </p>
      )}
    </div>
  );
}

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
          <Firma autor={art.autor} fecha={art.fecha} actualizado={art.actualizado} minutos={minutos} lang={lang} t={t} />
        </div>
      </Section>

      <Section band="light">
        <div style={COLUMNA}>
          <Bloques bloques={a.bloques} lang={lang} />
          {/* Quién firma, con qué experiencia y dónde verificarla. Un artículo
              sin esto es una opinión anónima con nombre encima: el lector no
              tiene forma de saber si quien escribe ha estado dentro del
              problema. Las fuentes solo aparecen cuando el artículo hace
              afirmaciones que no son suyas. */}
          <SobreElAutor autor={art.autor} lang={lang} t={t} />
          {a.fuentes?.length > 0 && (
            <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-strong)' }}>
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t.fuentes}
              </p>
              <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
                {a.fuentes.map((f) => (
                  <li key={f.url || f.titulo} style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>
                    {f.url
                      ? <a href={f.url} rel="noopener nofollow" target="_blank" style={{ color: 'var(--text-accent)' }}>{f.titulo}</a>
                      : f.titulo}
                    {f.detalle ? <span style={{ color: 'var(--text-muted)' }}>{` — ${f.detalle}`}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Al final y no al principio: se comparte lo que se ha terminado de
              leer, y una fila de botones antes del primer párrafo compite con
              el propio artículo por la atención. */}
          {/* Al final del artículo y sin interrumpir: quien ha llegado hasta
              aquí ya sabe si quiere más. Es el sitio donde una suscripción se
              gana en vez de arrancarse. */}
          <div style={{ marginTop: 'var(--space-11)', padding: 'var(--space-7)', background: 'var(--white)', border: '1px solid var(--border-hairline)', borderRadius: 2 }}>
            <Formulario lang={lang} origen={`articulo/${a.slug}`} />
          </div>
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
