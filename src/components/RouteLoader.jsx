import React from 'react';

/**
 * Lo que se ve mientras se descarga el chunk de una ruta.
 *
 * Aparece con 180 ms de retraso a propósito. Los chunks de página pesan entre
 * 2 y 8 KB gzip: en una conexión normal llegan antes de eso y el spinner no
 * llega a aparecer nunca, que es lo correcto — un destello de medio fotograma
 * se percibe como un parpadeo, no como "está cargando". Solo se ve cuando la
 * espera es real.
 *
 * La marca es el isotipo de Become. La barra verde —el mismo elemento que
 * cruza el logo— es lo que se anima: barre de izquierda a derecha. No es un
 * spinner genérico con el logo encima, es el logo funcionando como spinner.
 */
export default function RouteLoader() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => setShow(true), 180);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--navy-950)',
        opacity: show ? 1 : 0,
        transition: 'opacity .25s ease',
      }}
    >
      <div style={{ display: 'grid', placeItems: 'center', gap: 'var(--space-6)' }}>
        <svg
          width="46"
          height="56"
          viewBox="0 0 100 121"
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          {/* El isotipo, en trazo tenue: la marca está, pero en reposo */}
          <g fill="var(--slate-300)" opacity=".38">
            <path
              fillRule="evenodd"
              d="M0 0H65.15A27.65 27.65 0 0 1 92.8 27.65V36.95A27.65 27.65 0 0 1 65.15 64.6H0Z M15.7 13.4H64.15A14.25 14.25 0 0 1 78.4 27.65V36.95A14.25 14.25 0 0 1 64.15 51.2H15.7Z"
            />
            <path
              fillRule="evenodd"
              d="M0 50.9H66.35A31.95 31.95 0 0 1 98.3 82.85V89.05A31.95 31.95 0 0 1 66.35 121H0Z M15.7 64.6H64.80A17.5 17.5 0 0 1 82.3 82.10V89.10A17.5 17.5 0 0 1 64.80 106.6H15.7Z"
            />
            <path d="M0 0h15.7v49.9H0z" />
            <path d="M0 66.2h15.7V121H0z" />
          </g>

          {/* La barra verde de la marca, barriendo */}
          <g style={{ clipPath: 'inset(0 0 0 0)' }}>
            <rect x="0" y="51.7" width="42.6" height="12.7" fill="var(--electric-green)">
              <animate
                attributeName="x"
                values="-42.6; 0; 0; 100"
                keyTimes="0; 0.32; 0.62; 1"
                dur="1.5s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.2 0.7 0.2 1; 0 0 1 1; 0.65 0 0.35 1"
              />
              <animate
                attributeName="opacity"
                values="0; 1; 1; 0"
                keyTimes="0; 0.28; 0.66; 1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </svg>

        <span
          style={{
            font: 'var(--type-label)',
            letterSpacing: 'var(--track-label)',
            textTransform: 'uppercase',
            color: 'var(--slate-400)',
          }}
        >
          Cargando
        </span>
      </div>
    </div>
  );
}
