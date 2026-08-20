import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body } from '../components/ui.jsx';
import { LEGALES } from '../content/legal-textos.js';
import { IDENTIDAD, PENDIENTE, faltantes } from '../content/legal.js';

/**
 * Las tres páginas legales: términos, privacidad y cookies.
 *
 * Una sola plantilla para las seis (tres documentos por dos idiomas). El texto
 * vive en src/content/legal-textos.js, para que corregir una coma de la
 * política de privacidad no sea un cambio de código.
 *
 * ---- Sobre el aviso de datos pendientes ----
 *
 * Cuando falta un dato obligatorio —el código del banco de datos, el país del
 * centro de datos— la página lo dice arriba, en voz alta.
 *
 * La alternativa habitual es esconder el campo y publicar igual. Es la peor de
 * las tres opciones posibles: el documento parece completo, nadie vuelve a
 * mirarlo, y el hueco aparece el día que alguien lo reclama. Decirlo tiene un
 * coste pequeño hoy y evita ese día.
 */

/* min(..., 100%) y no la anchura de prosa a secas: en una pantalla estrecha el
   ancho de prosa es mayor que el hueco disponible, así que la columna se salía
   por la derecha y arrastraba la página entera con ella. El 100% la ata a lo
   que de verdad hay. */
const COLUMNA = { maxWidth: 'min(var(--maxw-prose), 100%)', marginInline: 'auto' };

function Bloque({ b, i }) {
  if (b.tipo === 'h') {
    return (
      <Reveal as="h2" index={i} style={{
        ...COLUMNA, margin: 'var(--space-10) auto 0',
        fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
        fontSize: 'var(--text-h3)', lineHeight: 1.26, letterSpacing: 'var(--track-heading)',
        color: 'var(--text-heading)',
      }}>
        {b.texto}
      </Reveal>
    );
  }

  if (b.tipo === 'p') {
    return (
      <Reveal as="div" index={i} style={COLUMNA}>
        <Body style={{ maxWidth: 'none' }}>{b.texto}</Body>
      </Reveal>
    );
  }

  if (b.tipo === 'ul') {
    return (
      <Reveal as="ul" index={i} style={{
        ...COLUMNA, listStyle: 'none', margin: 'var(--space-5) auto 0', padding: 0,
        display: 'grid', gap: 'var(--space-3)',
      }}>
        {b.items.map((it, k) => (
          <li key={k} style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
            <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{it}</span>
          </li>
        ))}
      </Reveal>
    );
  }

  if (b.tipo === 'tabla') {
    return (
      /* overflow-x en su propio contenedor, y minWidth: 0 encima.
         Sin lo segundo lo primero no sirve: este div es hijo de una rejilla, y
         un hijo de rejilla se niega a encogerse por debajo de su contenido a
         menos que se le diga. Con la tabla dentro, eso significa que el
         contenedor crece hasta 588 px en una pantalla de 375 y el
         desbordamiento lo hereda la página entera en vez de quedarse dentro. */
      <Reveal as="div" index={i} style={{ ...COLUMNA, margin: 'var(--space-6) auto 0', overflowX: 'auto', minWidth: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', font: 'var(--type-body)', fontSize: 15 }}>
          <thead>
            <tr>
              {b.cabecera.map((c) => (
                <th key={c} style={{
                  textAlign: 'left', padding: '10px 14px 10px 0', verticalAlign: 'bottom',
                  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
                  textTransform: 'uppercase', fontSize: 11, color: 'var(--text-faint)',
                  borderBottom: '1px solid var(--border-hairline)', whiteSpace: 'nowrap',
                }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.filas.map((fila, k) => (
              <tr key={k}>
                {fila.map((celda, j) => (
                  <td key={j} style={{
                    padding: '12px 14px 12px 0', verticalAlign: 'top',
                    borderBottom: '1px solid var(--border-hairline)',
                    color: celda === PENDIENTE ? '#c2410c' : 'var(--text-body)',
                    minWidth: 120,
                  }}>
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    );
  }

  return null;
}

export default function Legal({ page, lang = 'es' }) {
  const docs = LEGALES[lang] || LEGALES.es;
  const clave = docs[page] ? page : Object.keys(docs)[0];
  const doc = docs[clave];
  const pendientes = faltantes();
  const es = lang === 'es';

  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-11)">
        <div style={COLUMNA}>
          <Kicker dark>Legal</Kicker>
          <Headline as="h1" dark style={{ maxWidth: 'none' }}>{doc.titulo}</Headline>
          <Lead dark>{doc.lead}</Lead>
          <p style={{ margin: 'var(--space-7) 0 0', font: 'var(--type-mono)', fontSize: 13, color: 'var(--slate-400)' }}>
            {es ? 'Última actualización' : 'Last updated'}: {IDENTIDAD.ultimaActualizacion}
            {' · '}{IDENTIDAD.razonSocial} · RUC {IDENTIDAD.ruc}
          </p>
        </div>
      </Section>

      <Section band="light">
        {pendientes.length > 0 && (
          <div style={{
            ...COLUMNA, marginBottom: 'var(--space-9)', padding: 'var(--space-6)',
            border: '1px solid #c2410c', borderRadius: 2, background: 'var(--white)',
          }}>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: '#c2410c' }}>
              {es ? 'Pendiente de completar' : 'Pending completion'}
            </p>
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', color: 'var(--text-body)' }}>
              {es
                ? 'Este documento está publicado con datos verificados, salvo los que se indican abajo. Preferimos decirlo a rellenarlos con algo plausible:'
                : 'This document is published with verified data, except for the items below. We prefer to say so rather than fill them with something plausible:'}
            </p>
            <ul style={{ margin: 'var(--space-3) 0 0', paddingLeft: '1.2em', font: 'var(--type-body)', color: 'var(--text-body)' }}>
              {pendientes.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        )}

        {/* minmax(0, 1fr) y no el 'auto' implícito. Con auto, la columna de la
            rejilla se dimensiona según su contenido más ancho —la tabla— y
            crece hasta 639 px en una pantalla de 375. Poner minWidth: 0 en el
            hijo no lo evita: lo que hay que limitar es la pista, no el hijo. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--space-2)' }}>
          {doc.bloques.map((b, i) => <Bloque key={i} b={b} i={i} />)}
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
