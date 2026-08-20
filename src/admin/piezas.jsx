import React from 'react';

/**
 * Controles del panel.
 *
 * Usan los tokens del sitio para que el panel no parezca una herramienta
 * ajena pegada a la web, pero con una densidad muy distinta: el sitio está
 * hecho para leerse despacio y esto para trabajar deprisa. De ahí que aquí
 * haya bordes, fondos y tamaños que no existen en ninguna página pública.
 */

export const marco = {
  fondo: 'var(--off-white)',
  papel: 'var(--white)',
  linea: '1px solid var(--border-hairline)',
};

const baseCampo = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  font: 'var(--type-body)',
  fontSize: 15,
  lineHeight: 1.5,
  color: 'var(--text-heading)',
  background: 'var(--white)',
  border: '1px solid var(--border-hairline)',
  borderRadius: 2,
};

export const Etiqueta = ({ children, pista }) => (
  <span style={{ display: 'block', marginBottom: 6, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
    {children}
    {pista && <span style={{ textTransform: 'none', letterSpacing: 0, marginLeft: 8, color: 'var(--text-muted)' }}>{pista}</span>}
  </span>
);

export const Texto = ({ valor, alCambiar, ...rest }) => (
  <input value={valor ?? ''} onChange={(e) => alCambiar(e.target.value)} style={baseCampo} {...rest} />
);

/* La altura crece con el contenido: un área fija obliga a desplazarse dentro
   de una caja de cuatro líneas para releer un párrafo que ya está escrito. */
export const Area = ({ valor, alCambiar, filas = 3, ...rest }) => {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [valor]);
  return (
    <textarea
      ref={ref}
      rows={filas}
      value={valor ?? ''}
      onChange={(e) => alCambiar(e.target.value)}
      style={{ ...baseCampo, resize: 'vertical', minHeight: filas * 24 + 20 }}
      {...rest}
    />
  );
};

export const Selector = ({ valor, alCambiar, opciones }) => (
  <select value={valor ?? ''} onChange={(e) => alCambiar(e.target.value)} style={{ ...baseCampo, cursor: 'pointer' }}>
    {opciones.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
  </select>
);

/* Un contador que solo avisa cuando importa. Pasarse del límite no penaliza en
   los buscadores: lo que pasa es que la frase que se lleva el clic aparece
   cortada, y eso solo se ve cuando ya está publicado. */
export const Contador = ({ valor = '', limite }) => {
  const n = String(valor).length;
  const pasado = n > limite;
  return (
    <span style={{ font: 'var(--type-mono)', fontSize: 12, color: pasado ? '#b4531f' : 'var(--text-faint)' }}>
      {n}/{limite}{pasado ? ' — se cortará en los resultados' : ''}
    </span>
  );
};

export const Boton = ({ children, variante = 'normal', ...rest }) => {
  const estilos = {
    normal: { background: 'var(--white)', color: 'var(--text-heading)', border: '1px solid var(--border-hairline)' },
    fuerte: { background: 'var(--electric-green)', color: 'var(--navy-900)', border: '1px solid var(--electric-green)' },
    quieto: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent' },
    peligro: { background: 'transparent', color: '#b4531f', border: '1px solid var(--border-hairline)' },
  }[variante];
  return (
    <button
      type="button"
      style={{
        padding: '9px 16px', borderRadius: 2, cursor: 'pointer',
        font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
        ...estilos,
        ...(rest.disabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export const Aviso = ({ tono = 'info', children }) => children ? (
  <div style={{
    padding: '12px 14px', marginTop: 12, border: marco.linea, borderRadius: 2,
    font: 'var(--type-body)', fontSize: 14,
    background: tono === 'mal' ? '#fdf1ea' : tono === 'bien' ? '#eefaf3' : 'var(--white)',
    color: tono === 'mal' ? '#8c3f16' : 'var(--text-body)',
  }}>
    {children}
  </div>
) : null;

export const Fila = ({ children, gap = 12, style }) => (
  <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap', ...style }}>{children}</div>
);
