import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { Ico } from './icons.jsx';

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

/* Dos intensidades de velo, y la elección importa. `strong` es para un fondo
   que puede iluminarse mucho en cualquier punto —el gradiente— y ahí el velo es
   lo único que garantiza el contraste. `soft` es para un fondo que ya es oscuro
   y cuyo interés está en verse: con el velo fuerte encima, la retícula
   desaparecía justo en la mitad donde está el texto, que es donde uno mira. */
const SCRIMS = {
  strong: 'linear-gradient(100deg, rgba(5,7,15,.92) 0%, rgba(5,7,15,.72) 38%, rgba(5,7,15,.28) 72%, rgba(5,7,15,.12) 100%)',
  soft: 'linear-gradient(100deg, rgba(5,7,15,.72) 0%, rgba(5,7,15,.34) 46%, rgba(5,7,15,0) 78%)',
};

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
  backdrop,
  scrim = 'strong',
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
      {/* Fondo vivo opcional. Va detrás y pinta su propio navy, así que sustituye
          al nodo 3D en esa banda en vez de superponerse: dos capas de partículas
          a la vez no leen como profundidad, leen como suciedad. */}
      {backdrop}
      {/* Velo sobre el fondo vivo. No es estética: el fondo se mueve, y sin un
          suelo garantizado el contraste del texto dependería de dónde caiga la
          mancha clara en ese instante. Con el velo, el peor caso sigue pasando
          AA. */}
      {backdrop && scrim && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: SCRIMS[scrim] || SCRIMS.strong,
          }}
        />
      )}
      <div style={{ position: 'relative', maxWidth: 'var(--maxw-content)', margin: '0 auto' }}>
        {children}
      </div>
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

/* Sin `white-space: nowrap`, y con tope de ancho.
 *
 * Con nowrap, una etiqueta larga —"Ver el framework y sus herramientas"— no
 * podía partirse: se salía de su contenedor, y con ella de la pantalla. En un
 * móvil de 375 px eso dejaba la página entera arrastrable de lado, que es de
 * los fallos que más ensucian la sensación de un sitio.
 *
 * El relleno vertical no cambia nada en una línea (48 px de alto mínimo mandan
 * sobre 14 de texto más 32 de relleno); solo entra en juego cuando la etiqueta
 * pasa a dos líneas, para que el texto no toque el borde de la píldora. */
const ctaBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  padding: 'var(--space-4) var(--space-7)',
  borderRadius: 'var(--radius-pill)',
  font: 'var(--type-label)',
  letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase',
  textDecoration: 'none',
  textAlign: 'center',
  maxWidth: '100%',
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

/* La rejilla numera a sus hijos para que entren escalonados. Se inyecta aquí y
   no en cada página porque el índice es una propiedad de la posición en la
   rejilla, no del contenido: pedirlo a mano en veinte sitios garantiza que
   alguno se olvide y esa tarjeta entre a destiempo. */
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
    {React.Children.map(children, (child, i) =>
      React.isValidElement(child) && typeof child.type !== 'string'
        ? React.cloneElement(child, { index: child.props.index ?? i })
        : child)}
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

export const Card = ({ children, dark, style, index = 0, ...rest }) => (
  <Reveal
    as="article"
    index={index}
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
export const IndexRow = ({ to, term, def, dark, num, icon, index = 0 }) => {
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
        {icon && (
          <span style={{ alignSelf: 'start', color: dark ? 'var(--electric-green)' : 'var(--text-accent)' }}>
            <Ico name={icon} size={26} />
          </span>
        )}
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
    ? <Reveal as={Link} index={index} to={to} data-cols style={style} className="index-row row-hit">{inner}</Reveal>
    : <Reveal as="div" index={index} data-cols style={style} className="row-hit">{inner}</Reveal>;
};
