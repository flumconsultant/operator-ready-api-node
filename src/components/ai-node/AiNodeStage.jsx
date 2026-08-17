import React from 'react';

/* three.js sale del bundle principal: solo lo descarga quien llega a la home,
   y solo después del primer render. */
const AiNode = React.lazy(() => import('./AiNode.jsx'));

/**
 * La capa donde vive el nodo: fija detrás de toda la home.
 *
 * Nada de la página cambia hasta que el canvas confirma que existe. Solo
 * entonces se marca data-ai-node="on" en <html>, y es esa marca la que abre
 * las secciones oscuras para dejarlo ver (ver global.css). Si el dispositivo
 * no tiene WebGL, si el chunk no llega o si el usuario pide menos movimiento,
 * la marca nunca aparece y la home se ve exactamente igual que antes de todo
 * esto — con sus fondos navy sólidos y su foto de hero.
 */
export default function AiNodeStage() {
  const [mount, setMount] = React.useState(false);

  React.useEffect(() => {
    /* Esperar a que la home haya pintado antes de pedir 170 KB de three.js:
       el LCP es el titular del hero, no el nodo. */
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMount(true), { timeout: 1800 })
      : window.setTimeout(() => setMount(true), 400);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  const onReady = React.useCallback(() => {
    document.documentElement.setAttribute('data-ai-node', 'on');
  }, []);

  React.useEffect(() => () => document.documentElement.removeAttribute('data-ai-node'), []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: 'var(--navy-950)',
        pointerEvents: 'none',
      }}
    >
      {mount && (
        <React.Suspense fallback={null}>
          <AiNode onReady={onReady} />
        </React.Suspense>
      )}
    </div>
  );
}
