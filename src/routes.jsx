import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { LEGACY_REDIRECTS } from './site.js';

/**
 * Rutas del sitio. Escritas a mano: la arquitectura del documento (§5) tiene
 * subrutas, un parámetro y redirecciones desde la maqueta anterior, y eso no se
 * deja describir con la tabla de un artboard por página.
 *
 * Cada ruta en su propio chunk: la home no descarga las otras páginas.
 *
 * Las páginas marcadas «pendiente fase 4» siguen siendo los artboards migrados
 * de la primera maqueta. Funcionan y están en su URL definitiva, pero su copy
 * todavía no es el del documento.
 */

const Home = lazy(() => import('./pages/Home.jsx'));
const Servicios = lazy(() => import('./pages/Servicios.jsx'));
const CasosDeUso = lazy(() => import('./pages/CasosDeUso.jsx'));
const UseCase = lazy(() => import('./pages/UseCase.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));

/* pendiente fase 4 — artboards migrados, en su URL definitiva */
const Framework = lazy(() => import('./pages/Framework.jsx'));
const Discovery = lazy(() => import('./pages/Discovery.jsx'));
const BuildEmbed = lazy(() => import('./pages/BuildEmbed.jsx'));
const Nosotros = lazy(() => import('./pages/Nosotros.jsx'));
const Thinking = lazy(() => import('./pages/Thinking.jsx'));
const Contacto = lazy(() => import('./pages/Contacto.jsx'));

export const routes = [
  { path: '/es', element: <Home /> },

  { path: '/es/servicios', element: <Servicios /> },
  { path: '/es/servicios/transformation-discovery', element: <Discovery /> },
  { path: '/es/servicios/build-and-embed', element: <BuildEmbed /> },

  { path: '/es/framework', element: <Framework /> },
  { path: '/es/nosotros', element: <Nosotros /> },

  { path: '/es/casos-de-uso', element: <CasosDeUso /> },
  { path: '/es/casos-de-uso/:slug', element: <UseCase /> },

  { path: '/es/insights', element: <Thinking /> },
  { path: '/es/contacto', element: <Contacto /> },

  { path: '/es/privacidad', element: <Legal page="privacidad" /> },
  { path: '/es/terminos', element: <Legal page="terminos" /> },

  /* Las rutas de la primera maqueta siguen resolviendo en vez de dar 404 */
  ...Object.entries(LEGACY_REDIRECTS).map(([from, to]) => ({
    path: from,
    element: <Navigate to={to} replace />,
  })),

  /* Cualquier otra cosa vuelve a la home del idioma */
  { path: '*', element: <Navigate to="/es" replace /> },
];
