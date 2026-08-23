import React from 'react';

/**
 * Controles del panel.
 *
 * Usan los tokens del sitio para que el panel no parezca una herramienta
 * ajena pegada a la web, pero con una densidad muy distinta: el sitio está
 * hecho para leerse despacio y esto para trabajar deprisa. De ahí que aquí
 * haya bordes, fondos y tamaños que no existen en ninguna página pública.
 */

/* Se conserva por compatibilidad con los módulos que aún lo usan; los colores
   de verdad están en panel.css. */
export const marco = { fondo: 'transparent', papel: 'transparent', linea: 'none' };

/* Los controles ya no llevan sus estilos encima: viven en panel.css. Con
   estilos en línea cada botón decidía su propio relleno y su propio borde, y
   con seis módulos el resultado era que nada se parecía a nada. */

export const Etiqueta = ({ children, pista }) => (
  <span className="pnl-columna-rotulo" style={{ display: 'block', marginBottom: 6 }}>
    {children}
    {pista && <span style={{ textTransform: 'none', letterSpacing: 0, marginLeft: 8 }}>{pista}</span>}
  </span>
);

export const Texto = ({ valor, alCambiar, ...rest }) => (
  <input value={valor ?? ''} onChange={(e) => alCambiar(e.target.value)} className="pnl-entrada" {...rest} />
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
      className="pnl-entrada"
      {...rest}
    />
  );
};

export const Selector = ({ valor, alCambiar, opciones }) => (
  <select value={valor ?? ''} onChange={(e) => alCambiar(e.target.value)} className="pnl-entrada">
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
    <span className={`pnl-cuenta${pasado ? ' pnl-cuenta--pasa' : ''}`}>
      {n}/{limite}{pasado ? ' — se cortará en los resultados' : ''}
    </span>
  );
};

export const Boton = ({ children, variante = 'normal', menudo = false, ...rest }) => (
  <button
    type="button"
    className={`pnl-btn${variante !== 'normal' ? ` pnl-btn--${variante}` : ''}${menudo ? ' pnl-btn--menudo' : ''}`}
    {...rest}
  >
    {children}
  </button>
);

/* Un aviso dice qué pasó y qué hacer. El color acompaña, no informa solo: el
   borde a la izquierda y el texto son lo que se entiende sin distinguir tonos. */
export const Aviso = ({ tono = 'info', children }) => children ? (
  <div className={`pnl-aviso pnl-aviso--${tono === 'mal' ? 'mal' : tono === 'bien' ? 'bien' : 'ojo'}`} role={tono === 'mal' ? 'alert' : 'status'}>
    {children}
  </div>
) : null;

export const Fila = ({ children, gap = 12, style }) => (
  <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap', ...style }}>{children}</div>
);
