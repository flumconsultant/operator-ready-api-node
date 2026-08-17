import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './routes.generated.jsx';
import AiNodeStage from './components/ai-node/AiNodeStage.jsx';

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
      {/* El nodo solo vive en la home: es su narrativa la que coreografía los
          cinco estados. En el resto de rutas ni se descarga. */}
      {pathname === '/' && <AiNodeStage />}
      {/* El fallback pinta el fondo de página, no un spinner: los chunks de ruta
          son pequeños y un spinner parpadeando molesta más de lo que informa. */}
      <React.Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-page)' }} />}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </React.Suspense>
    </>
  );
}
