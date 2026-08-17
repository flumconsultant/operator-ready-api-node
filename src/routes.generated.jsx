/* Generado por scripts/dc-to-jsx.mjs. No editar a mano. */
import { lazy } from 'react';

const Home = lazy(() => import('./pages/Home.jsx'));
const Framework = lazy(() => import('./pages/Framework.jsx'));
const Discovery = lazy(() => import('./pages/Discovery.jsx'));
const BuildEmbed = lazy(() => import('./pages/BuildEmbed.jsx'));
const Trabajo = lazy(() => import('./pages/Trabajo.jsx'));
const Thinking = lazy(() => import('./pages/Thinking.jsx'));
const Nosotros = lazy(() => import('./pages/Nosotros.jsx'));
const Contacto = lazy(() => import('./pages/Contacto.jsx'));

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/como-trabajamos', element: <Framework /> },
  { path: '/discovery', element: <Discovery /> },
  { path: '/build-embed', element: <BuildEmbed /> },
  { path: '/casos', element: <Trabajo /> },
  { path: '/insights', element: <Thinking /> },
  { path: '/nosotros', element: <Nosotros /> },
  { path: '/contacto', element: <Contacto /> },
];
