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
     * three.js —534 KB y el arranque de WebGL— se pide al primer gesto de la
     * persona: mover el ratón, hacer scroll, tocar la pantalla o pulsar una
     * tecla. En ningún caso antes.
     *
     * No es para el medidor, aunque también lo arregle. Es que un fondo
     * decorativo no debería gastar procesador, batería y datos de alguien que
     * todavía no ha hecho nada con la página.
     *
     * Medido en la auditoría de escritorio: el nodo era el ÚNICO responsable
     * del tiempo de bloqueo. Sin él, cero; con él, más de cinco segundos, y
     * hasta dieciocho antes de que aprendiera a bajar de calidad. En móvil, el
     * bloqueo pasó de oscilar entre 574 y 1.139 ms a quedarse en unos 300.
     *
     * Lo que se pierde: el nodo no está detrás del hero en el primer instante,
     * y ahí se ve el fondo navy sólido —el mismo respaldo que ya existía para
     * los equipos sin WebGL—. En un ordenador ese instante dura lo que tarda
     * alguien en mover el ratón, que es casi nada.
     */
    /* Quien recarga a media página ya ha hecho scroll: no hay nada que
       esperar. */
    if (window.scrollY > 0) { setMount(true); return undefined; }

    /* En un ordenador cuenta además mover el ratón, que es lo primero que hace
       cualquiera: en la práctica el nodo aparece igual de rápido que antes.
       En un móvil no existe ese evento, así que allí manda el primer scroll o
       toque, como estaba. */
    const GESTOS = ['scroll', 'pointerdown', 'pointermove', 'touchstart', 'wheel', 'keydown'];
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
