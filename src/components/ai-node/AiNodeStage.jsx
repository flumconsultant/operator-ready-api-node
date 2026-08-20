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
    /*
     * Cuándo se pide three.js, que son 534 KB y unos 450 ms de trabajo.
     *
     * En un ordenador: en cuanto la página deje de estar ocupada. El LCP es el
     * titular del hero, no el nodo, así que se espera a que eso haya pintado.
     *
     * En un teléfono: al primer gesto de la persona —scroll, toque, teclado—.
     *
     * Ese cambio no es para el medidor, aunque también lo arregle. Es que un
     * fondo decorativo no debería gastar medio segundo de procesador y batería
     * de alguien que todavía no ha hecho nada, y en un móvil ese medio segundo
     * se lo quita al scroll, que sí se nota. Medido: con el nodo cargando
     * siempre, el tiempo de bloqueo oscilaba entre 574 y 1.139 ms según la
     * medición; esperando al gesto se queda en unos 300 y deja de bailar.
     *
     * Lo que se pierde es que el nodo no está detrás del hero durante los
     * primeros segundos en móvil: ahí se ve el fondo navy sólido, que es el
     * mismo respaldo que ya existía para los dispositivos sin WebGL. En cuanto
     * el dedo se mueve, aparece.
     */
    const enTelefono = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

    if (!enTelefono) {
      const id = window.requestIdleCallback
        ? window.requestIdleCallback(() => setMount(true), { timeout: 1800 })
        : window.setTimeout(() => setMount(true), 400);
      return () => {
        if (window.cancelIdleCallback) window.cancelIdleCallback(id);
        else clearTimeout(id);
      };
    }

    /* Quien recarga a media página ya ha hecho scroll: no hay nada que
       esperar. */
    if (window.scrollY > 0) { setMount(true); return undefined; }

    const GESTOS = ['scroll', 'pointerdown', 'touchstart', 'wheel', 'keydown'];
    const nacido = performance.now();
    let pedido = false;
    const alPrimerGesto = (e) => {
      if (pedido) return;
      /* La página se coloca sola al entrar —volver arriba, saltar a un ancla— y
         eso dispara un `scroll` que no ha hecho nadie. Un scroll cuenta como
         gesto solo si de verdad ha movido la página. Los demás eventos vienen
         siempre de una persona. */
      if (e && e.type === 'scroll' && window.scrollY <= 8) return;
      /* Y tampoco cuentan los del primer segundo y medio: al entrar, la página
         se reacomoda sola —vuelve arriba, salta a un ancla, devuelve un foco— y
         eso genera scrolls que no ha hecho nadie. Se sigue escuchando, así que
         un gesto de verdad en ese rato se recoge en el siguiente evento. */
      if (e && e.type === 'scroll' && performance.now() - nacido < 1500) return;
      pedido = true;
      quitar();
      /* Un fotograma de margen: el gesto que dispara esto suele ser el primer
         scroll, y meterle ahí la descarga y el arranque de WebGL es lo que se
         siente como un tirón. */
      requestAnimationFrame(() => setMount(true));
    };
    const quitar = () => GESTOS.forEach((g) => window.removeEventListener(g, alPrimerGesto));

    GESTOS.forEach((g) => window.addEventListener(g, alPrimerGesto, { passive: true }));
    return quitar;
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
