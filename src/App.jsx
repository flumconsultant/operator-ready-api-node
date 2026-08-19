import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { routes } from './routes.jsx';
import AiNodeStage from './components/ai-node/AiNodeStage.jsx';
import RouteLoader from './components/RouteLoader.jsx';
import { PAGES, SITE } from './seo-meta.js';

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

/**
 * Mantiene título, descripción y canonical al día al navegar.
 *
 * El servidor entrega la cabecera correcta de cada ruta (la genera
 * scripts/seo.mjs), pero eso solo ocurre al cargar la página desde cero. Al
 * moverse por el sitio no hay recarga: sin esto, la pestaña del navegador se
 * queda con el título de la primera página que se abrió, y el historial se
 * llena de entradas que se llaman todas igual.
 *
 * Solo conoce las rutas fijas. En las de programa y caso de uso el titular lo
 * pone la propia página, así que se lee del h1 ya renderizado en vez de
 * duplicar aquí cuarenta títulos que envejecerían por su cuenta.
 */
function DocumentHead() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    const fija = PAGES[pathname];
    const lang = pathname.startsWith('/en') ? 'en' : 'es';
    document.documentElement.lang = lang;

    const meta = (sel, attr, valor) => {
      const el = document.head.querySelector(sel);
      if (el && valor) el.setAttribute(attr, valor);
    };
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', SITE + pathname);

    if (fija) {
      document.title = fija[0];
      meta('meta[name="description"]', 'content', fija[1]);
      meta('meta[property="og:title"]', 'content', fija[0]);
      meta('meta[property="og:description"]', 'content', fija[1]);
      meta('meta[property="og:url"]', 'content', SITE + pathname);
      return undefined;
    }

    /* Ruta con parámetro: el h1 llega con el chunk de la página, que puede
       tardar. Se busca durante un segundo y se deja de buscar en cuanto
       aparece, igual que hace el salto al ancla. */
    let raf;
    const limite = performance.now() + 1000;
    const buscar = () => {
      const h1 = document.querySelector('main h1');
      if (h1 && h1.textContent.trim()) {
        document.title = `${h1.textContent.trim()} | BECOME`;
        return;
      }
      if (performance.now() < limite) raf = requestAnimationFrame(buscar);
    };
    raf = requestAnimationFrame(buscar);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    /*
     * LazyMotion + el componente `m` en vez de `motion`.
     *
     * `motion.div` arrastra consigo TODAS las capacidades de la librería
     * —arrastrar, animaciones de layout, proyección— aunque la página solo
     * desvanezca y desplace cosas. `m` es el mismo componente sin nada dentro,
     * y `domAnimation` es el paquete de capacidades que este sitio sí usa:
     * animar, `whileInView` y las entradas y salidas de AnimatePresence.
     *
     * No cambia una sola animación. Cambia lo que hay que descargar en un
     * móvil antes de ver la página.
     */
    <LazyMotion features={domAnimation} strict>
      <ScrollToAnchor />
      <DocumentHead />
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
    </LazyMotion>
  );
}
