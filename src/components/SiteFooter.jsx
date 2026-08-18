import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER, HOME } from '../site.js';

/**
 * Pie del sitio en español.
 *
 * Hace de mapa completo para que la cabecera no tenga que serlo: cinco
 * columnas con todo lo que existe, incluidas las seis preguntas de casos de uso
 * y el framework, que a propósito no están en el menú principal.
 *
 * El logotipo también lleva a la Home. No hay un enlace de texto "Inicio": el
 * documento lo prohíbe explícitamente y duplicarlo solo añade ruido para quien
 * navega con lector de pantalla.
 */
export default function SiteFooter() {
  return (
    <footer
      data-band="--navy-950"
      style={{ background: 'var(--navy-950)', padding: 'var(--space-12) var(--gutter-page) var(--space-8)' }}
    >
      <div style={{ maxWidth: 'var(--maxw-content)', margin: '0 auto' }}>
        <div
          data-cols
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) repeat(4, minmax(0, 1fr))',
            gap: 'var(--space-9)',
          }}
        >
          <div>
            <Link to={HOME} aria-label="BECOME — Inicio" style={{ display: 'inline-flex', minHeight: 44, alignItems: 'center' }}>
              <img src="/logo/wordmark-white.webp" alt="" style={{ height: 26, width: 'auto', display: 'block' }} />
            </Link>
            <p style={{ margin: 'var(--space-5) 0 0', font: 'var(--type-body)', color: 'var(--slate-300)', maxWidth: '30ch' }}>
              AI-native transformation company. Rediseñamos cómo las empresas operan,
              deciden y crean valor alrededor de la IA.
            </p>
          </div>

          {FOOTER.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p
                style={{
                  margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
                  textTransform: 'uppercase', color: 'var(--slate-400)',
                }}
              >
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
                {col.links.map((l) => (
                  <li key={l.to || l.href}>
                    {l.href ? (
                      <a href={l.href} style={linkStyle} className="hv-foot">{l.label}</a>
                    ) : (
                      <Link to={l.to} style={linkStyle} className="hv-foot">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          style={{
            marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-hairline-dark)',
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)',
            alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', color: 'var(--slate-400)' }}>
            © {new Date().getFullYear()} BECOME
          </span>
          <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', color: 'var(--slate-300)' }}>
            <span style={{ ...langItem, color: 'var(--white)' }}>ES</span>
            {' / '}
            <a href="/en" style={{ ...langItem, color: 'var(--slate-300)', textDecoration: 'none' }} className="hv-lang">EN</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* `inline-flex` con alto mínimo: como enlaces de línea medían 19 px de alto,
   por debajo del mínimo de 24×24 que pide WCAG 2.2 para un objetivo de puntero.
   La columna del pie es navegación, no una frase con enlaces dentro, así que la
   excepción para enlaces en línea no aplica. */
/* El conmutador de idioma es un control, no texto corrido: necesita su área. */
const langItem = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 24, minHeight: 24,
};

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 24,
  font: 'var(--type-body)',
  fontSize: 'var(--text-body-md)',
  color: 'var(--slate-200)',
  textDecoration: 'none',
};
