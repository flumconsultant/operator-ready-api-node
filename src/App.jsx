import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './routes.jsx';
import AiNodeStage from './components/ai-node/AiNodeStage.jsx';
import RouteLoader from './components/RouteLoader.jsx';

/* Cada navegación empieza arriba; los anclas (#propuesta) van a su sección. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
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
