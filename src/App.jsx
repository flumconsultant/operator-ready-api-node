import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { routes } from './routes.jsx';
import AiNodeStage from './components/ai-node/AiNodeStage.jsx';
import RouteLoader from './components/RouteLoader.jsx';
import Invitacion from './components/suscripcion/Invitacion.jsx';
import Cookies from './components/privacidad/Cookies.jsx';
import Agendar from './components/Agendar.jsx';
import { PAGES, SITE } from './seo-meta.js';
import { arrancarAnalitica, paginaVista } from './analitica.js';

/**
 * Cada navegación empieza arriba; los anclas (#comparacion) van a su sección.
 *
 * El ancla se busca durante medio segundo en vez de una sola vez. Las rutas van
 * en chunks aparte, así que al llegar desde otra página el destino todavía no
 * está en el DOM cuando corre este efecto: la búsqueda fallaba, se caía al
 * scroll al inicio, y el enlace parecía llevar "al mismo sitio de siempre".
 * Es el motivo por el que "Compara los tres" no llevaba a la comparación.
 */
/**
 * La medición: arranca una vez y manda una vista por cada cambio de ruta.
 *
 * En una SPA no hay recarga al navegar, así que la etiqueta de Google solo
 * vería la primera página de cada visita. Sin esto, en el informe todo el
 * tráfico entraría por donde entró y parecería irse sin ver nada más.
 *
 * Va después del efecto que actualiza el título, y por eso mira `pathname`
 * igual que aquel: el título tiene que estar ya cambiado cuando se manda la
 * vista, o cada página se registraría con el nombre de la anterior.
 */
function Medicion() {
  const { pathname, search } = useLocation();
  const primera = React.useRef(true);

  React.useEffect(() => { arrancarAnalitica(); }, []);

  React.useEffect(() => {
    /* La primera vista la manda el arranque, con la página ya montada. */
    if (primera.current) { primera.current = false; return undefined; }
    /* Un fotograma de margen para que el título ya sea el de la página nueva. */
    const id = requestAnimationFrame(() => paginaVista(pathname + search));
    return () => cancelAnimationFrame(id);
  }, [pathname, search]);

  return null;
}

function ScrollToAnchor() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      /* Al navegar sin ancla, el foco se queda donde estaba: quien usa teclado
         sigue tabulando por la página anterior aunque ya se esté viendo otra, y
         quien usa lector de pantalla no se entera de que hubo un cambio. Se
         manda el foco al contenido de la página nueva.

         Y hay que ESPERAR a que exista. Las páginas se cargan bajo demanda, así
         que en el fotograma siguiente al cambio de dirección el <main> que hay
         en el documento todavía es el de la página anterior: enfocarlo ahí no
         solo no sirve, es peor —cuando React lo desmonta, el foco cae al
         <body>, que es exactamente donde estaba—. Se comprobó: enfocando en el
         primer fotograma, el foco terminaba en BODY.

         Por eso se guarda el <main> actual y se busca hasta que aparezca uno
         DISTINTO, con un plazo de un segundo y medio para no quedarse mirando
         indefinidamente si algo falla.

         `preventScroll` porque el scroll ya lo acabamos de poner arriba, y sin
         él el navegador lo movería otra vez para «enseñar» el elemento. */
      const anterior = document.getElementById('contenido');
      const limite = performance.now() + 1500;
      let id = 0;
      const buscar = () => {
        const principal = document.getElementById('contenido');
        if (principal && principal !== anterior) {
          principal.setAttribute('tabindex', '-1');
          principal.focus({ preventScroll: true });
          return;
        }
        if (performance.now() < limite) id = requestAnimationFrame(buscar);
      };
      id = requestAnimationFrame(buscar);
      return () => cancelAnimationFrame(id);
    }

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
      <Medicion />
      <DocumentHead />
      {/* El nodo vive en todo el sitio. En la home las formas van ancladas a
          secciones concretas; en el resto de páginas el mismo journey se
          reparte sobre el documento. Lo que no cambia es la historia. */}
      {/* En el panel no: es una herramienta de trabajo, y un campo de
          partículas girando detrás de un formulario cuesta batería y no
          significa nada ahí. */}
      {!pathname.startsWith('/admin') && <AiNodeStage key={`nodo:${pathname}`} />}
      <Invitacion />
      <Agendar />
      <Cookies />
      {/* La clave por ruta es lo que hace visible el fallback. React 19 trata
          la navegación como una transición y, por defecto, mantiene la pantalla
          anterior en vez de mostrar el Suspense: sin remontar el límite, el
          loader no aparecería nunca.

          Va prefijada porque el nodo, que es su hermano, se remonta por la
          misma razón y con la misma clave: dos hermanos con la clave `/es` son
          dos claves repetidas, y React avisa de que puede omitir uno de los
          dos. Con prefijo, cada uno se remonta al cambiar de ruta sin colisión. */}
      <React.Suspense key={`ruta:${pathname}`} fallback={<RouteLoader />}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </React.Suspense>
    </LazyMotion>
  );
}
