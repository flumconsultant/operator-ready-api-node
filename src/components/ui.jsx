import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';

/**
 * Las piezas con las que se arman las páginas nuevas.
 *
 * Los artboards Durable llevaban el estilo en atributos inline, uno por
 * elemento. Eso servía para maquetar, pero no para mantener veinte páginas: un
 * cambio de ritmo vertical obligaba a tocar cientos de líneas. Aquí las
 * decisiones viven en un sitio, y siempre salen de tokens/ — ningún valor
 * suelto.
 *
 * `Section` marca sola su `data-band`, que es lo que el nodo 3D lee para pintar
 * el fondo. Si una página nueva se olvida de esa marca, el nodo la ve como un
 * hueco; por eso la pone el componente y no cada página.
 */

/* ---------- superficies ---------- */

const BANDS = {
  dark: { token: '--navy-900', color: 'var(--navy-900)', deep: true },
  darker: { token: '--navy-950', color: 'var(--navy-950)', deep: true },
  light: { token: '--off-white', color: 'var(--off-white)', deep: false },
  sunken: { token: '--pale-100', color: 'var(--pale-100)', deep: false },
};

export function Section({
  band = 'light',
  id,
  nodeState,
  pad = 'var(--space-13)',
  children,
  ...rest
}) {
  const b = BANDS[band] || BANDS.light;
  return (
    <section
      id={id}
      data-band={b.token}
      data-deep={b.deep ? '' : undefined}
      data-node-state={nodeState}
      style={{
        position: 'relative',
        background: b.color,
        padding: `${pad} var(--gutter-page)`,
      }}
      {...rest}
    >
      <div style={{ maxWidth: 'var(--maxw-content)', margin: '0 auto' }}>{children}</div>
    </section>
  );
}

/* ---------- texto ---------- */

export const Kicker = ({ children, dark }) => (
  <p
    style={{
      margin: 0,
      font: 'var(--type-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: dark ? 'var(--electric-green)' : 'var(--text-accent)',
    }}
  >
    {children}
  </p>
);

export const Headline = ({ children, dark, as = 'h2', size = 'var(--text-h1)' }) => {
  const Tag = as;
  return (
    <Tag
      style={{
        margin: 'var(--space-5) 0 0',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-display)',
        fontSize: size,
        lineHeight: 'var(--leading-heading)',
        letterSpacing: 'var(--track-display)',
        color: dark ? 'var(--white)' : 'var(--text-heading)',
        maxWidth: '18ch',
      }}
    >
      {children}
    </Tag>
  );
};

export const Lead = ({ children, dark }) => (
  <p
    style={{
      margin: 'var(--space-6) 0 0',
      font: 'var(--type-lead)',
      color: dark ? 'var(--slate-100)' : 'var(--text-body)',
      maxWidth: '58ch',
    }}
  >
    {children}
  </p>
);

export const Body = ({ children, dark, style }) => (
  <p
    style={{
      margin: 'var(--space-4) 0 0',
      font: 'var(--type-body)',
      color: dark ? 'var(--slate-200)' : 'var(--text-muted)',
      maxWidth: '62ch',
      ...style,
    }}
  >
    {children}
  </p>
);

/* ---------- llamadas a la acción ---------- */

const ctaBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  padding: '0 var(--space-7)',
  borderRadius: 'var(--radius-pill)',
  font: 'var(--type-label)',
  letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export const PrimaryCTA = ({ to, href, children, ...rest }) => {
  const style = { ...ctaBase, background: 'var(--electric-green)', color: 'var(--deep-navy)' };
  return href
    ? <a href={href} style={style} className="cta-primary" {...rest}>{children}</a>
    : <Link to={to} style={style} className="cta-primary" {...rest}>{children}</Link>;
};

export const GhostCTA = ({ to, children, dark, ...rest }) => (
  <Link
    to={to}
    style={{
      ...ctaBase,
      background: 'transparent',
      border: `1px solid ${dark ? 'var(--border-strong-dark)' : 'var(--border-strong)'}`,
      color: dark ? 'var(--white)' : 'var(--text-heading)',
    }}
    className="cta-ghost"
    {...rest}
  >
    {children}
  </Link>
);

/* Enlace de texto con la regla verde: la salida de sección por defecto */
export const TextCTA = ({ to, children, dark }) => (
  <Link
    to={to}
    style={{
      display: 'inline-block',
      marginTop: 'var(--space-7)',
      paddingBottom: 'var(--space-3)',
      borderBottom: `1px solid ${dark ? 'var(--green-line)' : 'var(--border-strong)'}`,
      font: 'var(--type-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: dark ? 'var(--electric-green)' : 'var(--text-accent)',
    }}
    className="cta-text"
  >
    {children} →
  </Link>
);

/* ---------- rejillas ---------- */

export const Cols = ({ children, min = '260px', gap = 'var(--space-8)', style }) => (
  <div
    data-cols
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))`,
      gap,
      marginTop: 'var(--space-10)',
      ...style,
    }}
  >
    {children}
  </div>
);

/* Encabezado de dos columnas: titular a la izquierda, entrada a la derecha.
   Es el ritmo que el documento pide para las secciones de la home. */
export const SectionHead = ({ kicker, headline, lead, dark, id }) => (
  <div
    data-cols
    style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
      gap: 'var(--space-9)',
      alignItems: 'end',
    }}
    id={id}
  >
    <Reveal as="div">
      {kicker && <Kicker dark={dark}>{kicker}</Kicker>}
      <Headline dark={dark}>{headline}</Headline>
    </Reveal>
    {lead && <Reveal as="div"><Lead dark={dark}>{lead}</Lead></Reveal>}
  </div>
);

/* ---------- tarjeta ---------- */

export const Card = ({ children, dark, style, ...rest }) => (
  <Reveal
    as="article"
    data-lift=""
    style={{
      padding: 'var(--space-7)',
      background: dark ? 'var(--navy-850)' : 'var(--white)',
      border: `1px solid ${dark ? 'var(--border-hairline-dark)' : 'var(--border-hairline)'}`,
      ...style,
    }}
    {...rest}
  >
    {children}
  </Reveal>
);

/* Índice editorial: filas con regla, no una parrilla de tarjetas iguales.
   El documento lo pide explícitamente para las herramientas y las preguntas. */
export const IndexRow = ({ to, term, def, dark, num }) => {
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
        {num && (
          <span style={{ font: 'var(--type-mono)', color: dark ? 'var(--slate-400)' : 'var(--text-faint)' }}>
            {num}
          </span>
        )}
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-display-strong)',
            fontSize: 'var(--text-h3)',
            lineHeight: 1.26,
            letterSpacing: 'var(--track-heading)',
            color: dark ? 'var(--white)' : 'var(--text-heading)',
          }}
        >
          {term}
        </h3>
      </div>
      <p
        style={{
          margin: 0,
          font: 'var(--type-body)',
          color: dark ? 'var(--slate-200)' : 'var(--text-muted)',
          maxWidth: '46ch',
        }}
      >
        {def}
      </p>
    </>
  );

  const style = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: 'var(--space-7)',
    alignItems: 'start',
    padding: 'var(--space-6) 0',
    borderTop: `1px solid ${dark ? 'var(--border-hairline-dark)' : 'var(--border-hairline)'}`,
    textDecoration: 'none',
  };

  return to
    ? <Reveal as={Link} to={to} data-cols style={style} className="index-row row-hit">{inner}</Reveal>
    : <Reveal as="div" data-cols style={style} className="row-hit">{inner}</Reveal>;
};
