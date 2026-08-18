import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './routes.jsx';
import AiNodeStage from './components/ai-node/AiNodeStage.jsx';
import RouteLoader from './components/RouteLoader.jsx';

/**
 * Cada navegación empieza arriba; los anclas (#comparacion) van a su sección.
 *
 * El ancla se busca durante medio segundo en vez de una sola vez. Las rutas van
 * en chunks aparte, así que al llegar desde otra página el destino todavía no
 * está en el DOM cuando corre este efecto: la búsqueda fallaba, se caía al
 * scroll al inicio, y el enlace parecía llevar "al mismo sitio de siempre".
 * Es el motivo por el que "Compara los tres" no llevaba a la comparación.
 */
function ScrollToAnchor() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0 }); return undefined; }

    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deadline = performance.now() + 1500;
    let raf = 0;

    const hunt = () => {
      let el = null;
      try { el = document.querySelector(hash); } catch { /* hash no válido como selector */ }
      if (el) {
        el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
        /* El foco acompaña al scroll: si no, quien navega con teclado sigue
           tabulando desde la cabecera aunque la vista esté abajo. */
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
        return;
      }
      if (performance.now() < deadline) raf = requestAnimationFrame(hunt);
      else window.scrollTo({ top: 0 });
    };
    raf = requestAnimationFrame(hunt);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToAnchor />
      {/* El nodo vive en todo el sitio. En la home las formas van ancladas a
          secciones concretas; en el resto de páginas el mismo journey se
          reparte sobre el documento. Lo que no cambia es la historia. */}
      <AiNodeStage key={pathname} />
      {/* La clave por ruta es lo que hace visible el fallback. React 19 trata
          la navegación como una transición y, por defecto, mantiene la pantalla
          anterior en vez de mostrar el Suspense: sin remontar el límite, el
          loader no aparecería nunca. */}
      <React.Suspense key={pathname} fallback={<RouteLoader />}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </React.Suspense>
    </>
  );
}
