import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../Reveal.jsx';
import { Kicker, Headline, Body, PrimaryCTA } from '../ui.jsx';
import { ARTICULOS, PILARES, FORMATOS, fechaLegible, minutosDeLectura } from '../../content/insights.js';

/**
 * El bloque de artículos de la página de Insights.
 *
 * Sustituye al estado «todavía no hay nada publicado», pero no lo borra: si no
 * hay artículos publicados en este idioma, se sigue diciendo. Esa decisión ya
 * estaba tomada y sigue siendo correcta —preferimos decirlo a llenar la página
 * de tarjetas que no llevan a ninguna parte—; lo único que cambia es que ahora
 * hay un camino para que deje de ser verdad.
 *
 * Filas y no tarjetas: es el mismo índice editorial que usan los pilares justo
 * debajo, y con dos o tres artículos una parrilla de tarjetas deja huecos que
 * parecen un error de maquetación.
 */

const VACIO = {
  es: {
    kicker: 'Estado editorial',
    titular: 'Todavía no hay nada publicado.',
    p1: 'Preferimos decirlo a llenar esta página con tarjetas de artículos que no existen. Tres piezas sólidas van a construir más autoridad que un centro de recursos saturado, y la primera está en preparación.',
    p2: 'Si quieres recibirla cuando salga, escríbenos. No hay newsletter todavía porque no hay cadencia real que sostenerla, y una lista que no se usa es peor que ninguna.',
    cta: 'Avísame cuando publiquéis',
  },
  en: {
    kicker: 'Editorial status',
    titular: 'Nothing published yet.',
    p1: 'We’d rather say so than fill this page with cards for articles that don’t exist. Three solid pieces will build more authority than a crowded resource centre, and the first one is in preparation.',
    p2: 'If you’d like to hear when it’s out, write to us. There’s no newsletter yet because there’s no real cadence to sustain it, and a list that goes unused is worse than none.',
    cta: 'Let me know when you publish',
  },
};

const LLENO = {
  es: { kicker: 'Publicado', titular: 'Lo último que hemos escrito.', lectura: (n) => `${n} min` },
  en: { kicker: 'Published', titular: 'The latest we’ve written.', lectura: (n) => `${n} min` },
};

export default function Listado({ lang }) {
  const items = ARTICULOS.filter((a) => a[lang]?.slug && a[lang]?.titulo);

  if (items.length === 0) {
    const t = VACIO[lang];
    return (
      <div style={{ maxWidth: 'var(--maxw-prose)' }}>
        <Kicker>{t.kicker}</Kicker>
        <Headline>{t.titular}</Headline>
        <Body style={{ marginTop: 'var(--space-6)' }}>{t.p1}</Body>
        <Body>{t.p2}</Body>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA href="mailto:hello@meetbecome.com">{t.cta}</PrimaryCTA>
        </div>
      </div>
    );
  }

  const t = LLENO[lang];
  const base = lang === 'en' ? '/en/insights' : '/es/insights';

  return (
    <>
      <Kicker>{t.kicker}</Kicker>
      <Headline>{t.titular}</Headline>
      <div style={{ marginTop: 'var(--space-10)' }}>
        {items.map((a, i) => (
          <Reveal key={a[lang].slug} as="article" index={i}>
            <Link
              to={`${base}/${a[lang].slug}`}
              data-lift=""
              style={{
                display: 'grid', gap: 'var(--space-4)', textDecoration: 'none',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                alignItems: 'start',
                padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)',
              }}
              data-cols
            >
              <div>
                <span style={{ font: 'var(--type-mono)', color: 'var(--text-faint)' }}>
                  {[PILARES[a.pilar]?.[lang], FORMATOS[a.formato]?.[lang]].filter(Boolean).join(' · ')}
                </span>
                <h3 style={{
                  margin: 'var(--space-3) 0 0', fontFamily: 'var(--font-display)',
                  fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)',
                  lineHeight: 1.26, letterSpacing: 'var(--track-heading)', color: 'var(--text-heading)',
                }}>
                  {a[lang].titulo}
                </h3>
              </div>
              <div>
                <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '46ch' }}>
                  {a[lang].entradilla}
                </p>
                <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-mono)', color: 'var(--text-faint)' }}>
                  <time dateTime={a.fecha}>{fechaLegible(a.fecha, lang)}</time>
                  {' · '}{t.lectura(minutosDeLectura(a[lang].bloques))}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
