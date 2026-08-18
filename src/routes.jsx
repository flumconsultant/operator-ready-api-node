import React, { lazy } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { LEGACY_REDIRECTS } from './site.js';

/**
 * Rutas del sitio. Escritas a mano: la arquitectura del documento (§5) tiene
 * subrutas, un parámetro y redirecciones desde la maqueta anterior, y eso no se
 * deja describir con la tabla de un artboard por página.
 *
 * Cada ruta en su propio chunk: la home no descarga las otras páginas.

 */

const Home = lazy(() => import('./pages/Home.jsx'));
const HomeEN = lazy(() => import('./pages/en/Home.jsx'));
const Framework = lazy(() => import('./pages/Framework.jsx'));
const Discovery = lazy(() => import('./pages/Discovery.jsx'));
const BuildEmbed = lazy(() => import('./pages/BuildEmbed.jsx'));
const Nosotros = lazy(() => import('./pages/Nosotros.jsx'));
const Insights = lazy(() => import('./pages/Insights.jsx'));
const Contacto = lazy(() => import('./pages/Contacto.jsx'));
const Servicios = lazy(() => import('./pages/Servicios.jsx'));
const BecomeNow = lazy(() => import('./pages/BecomeNow.jsx'));
const Program = lazy(() => import('./pages/Program.jsx'));
const CasosDeUso = lazy(() => import('./pages/CasosDeUso.jsx'));
const UseCase = lazy(() => import('./pages/UseCase.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));

/* Comodín consciente del idioma: una ruta /en/lo-que-sea que no existe todavía
   vuelve a la home en inglés, no a la española. El comodín plano de antes
   mandaba cualquier ruta no reconocida a /es sin mirar el prefijo — correcto
   mientras solo existía español, pero en cuanto hay una segunda home eso
   significa que alguien que elige inglés y cae en una página aún no traducida
   se encuentra de vuelta en español sin explicación. */
function NotFound() {
  const { pathname } = useLocation();
  return <Navigate to={pathname.startsWith('/en') ? '/en' : '/es'} replace />;
}

export const routes = [
  { path: '/es', element: <Home /> },
  { path: '/en', element: <HomeEN /> },

  { path: '/es/servicios', element: <Servicios /> },
  { path: '/es/servicios/become-now', element: <BecomeNow /> },
  { path: '/es/servicios/become-now/:slug', element: <Program /> },
  { path: '/es/servicios/transformation-discovery', element: <Discovery /> },
  { path: '/es/servicios/build-and-embed', element: <BuildEmbed /> },

  { path: '/es/framework', element: <Framework /> },
  { path: '/es/nosotros', element: <Nosotros /> },

  { path: '/es/casos-de-uso', element: <CasosDeUso /> },
  { path: '/es/casos-de-uso/:slug', element: <UseCase /> },

  { path: '/es/insights', element: <Insights /> },
  { path: '/es/contacto', element: <Contacto /> },

  { path: '/es/privacidad', element: <Legal page="privacidad" /> },
  { path: '/es/terminos', element: <Legal page="terminos" /> },

  /* Las rutas de la primera maqueta siguen resolviendo en vez de dar 404 */
  ...Object.entries(LEGACY_REDIRECTS).map(([from, to]) => ({
    path: from,
    element: <Navigate to={to} replace />,
  })),

  /* Cualquier otra cosa vuelve a la home del idioma que corresponda */
  { path: '*', element: <NotFound /> },
];
