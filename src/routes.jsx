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
const ServiciosEN = lazy(() => import('./pages/en/Servicios.jsx'));
const DiscoveryEN = lazy(() => import('./pages/en/Discovery.jsx'));
const BuildEmbedEN = lazy(() => import('./pages/en/BuildEmbed.jsx'));
const HowWeTransform = lazy(() => import('./pages/en/HowWeTransform.jsx'));
const Industries = lazy(() => import('./pages/en/Industries.jsx'));
const Industry = lazy(() => import('./pages/en/Industry.jsx'));
const BecomeNowEN = lazy(() => import('./pages/en/BecomeNow.jsx'));
const ProgramEN = lazy(() => import('./pages/en/Program.jsx'));
const NosotrosEN = lazy(() => import('./pages/en/Nosotros.jsx'));
const InsightsEN = lazy(() => import('./pages/en/Insights.jsx'));
const ArticuloEN = lazy(() => import('./pages/en/Articulo.jsx'));
const ContactoEN = lazy(() => import('./pages/en/Contacto.jsx'));
const SolucionesEN = lazy(() => import('./pages/en/Soluciones.jsx'));
const SolucionEN = lazy(() => import('./pages/en/Solucion.jsx'));
const LegalEN = lazy(() => import('./pages/en/Legal.jsx'));
const ComoTransformamos = lazy(() => import('./pages/ComoTransformamos.jsx'));
const Industrias = lazy(() => import('./pages/Industrias.jsx'));
const Industria = lazy(() => import('./pages/Industria.jsx'));
const Discovery = lazy(() => import('./pages/Discovery.jsx'));
const BuildEmbed = lazy(() => import('./pages/BuildEmbed.jsx'));
const Nosotros = lazy(() => import('./pages/Nosotros.jsx'));
const Insights = lazy(() => import('./pages/Insights.jsx'));
const Articulo = lazy(() => import('./pages/Articulo.jsx'));
const Contacto = lazy(() => import('./pages/Contacto.jsx'));
const Servicios = lazy(() => import('./pages/Servicios.jsx'));
const BecomeNow = lazy(() => import('./pages/BecomeNow.jsx'));
const Program = lazy(() => import('./pages/Program.jsx'));
const Soluciones = lazy(() => import('./pages/Soluciones.jsx'));
const Solucion = lazy(() => import('./pages/Solucion.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));
const IaResponsable = lazy(() => import('./pages/IaResponsable.jsx'));
const ResponsibleAI = lazy(() => import('./pages/en/ResponsibleAI.jsx'));
/* El panel de artículos. Va en su propio trozo y solo se descarga al abrir
   /admin: quien visita la web nunca llega a pedirlo. */
const Panel = lazy(() => import('./admin/Panel.jsx'));

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

  { path: '/en/services', element: <ServiciosEN /> },
  { path: '/en/services/become-now', element: <BecomeNowEN /> },
  { path: '/en/services/become-now/:slug', element: <ProgramEN /> },
  { path: '/en/services/become-discover', element: <DiscoveryEN /> },
  { path: '/en/services/become-embed', element: <BuildEmbedEN /> },

  { path: '/en/how-we-transform', element: <HowWeTransform /> },

  /* Industrias: una ruta declarada por industria, no una con :slug.
     Con parámetro serían una sola entrada y el generador de SEO tendría que
     saber expandirla; declaradas, cada industria trae su título, su
     descripción y su hreflang desde seo-meta.js como cualquier otra página. */
  { path: '/en/industries', element: <Industries /> },
  { path: '/en/industries/financial-services', element: <Industry slug="financial-services" /> },
  { path: '/en/industries/mining-energy', element: <Industry slug="mining-energy" /> },
  { path: '/en/industries/retail-consumer', element: <Industry slug="retail-consumer" /> },
  { path: '/en/industries/travel-hospitality', element: <Industry slug="travel-hospitality" /> },
  { path: '/en/industries/real-estate-construction', element: <Industry slug="real-estate-construction" /> },
  { path: '/en/industries/healthcare-life-sciences', element: <Industry slug="healthcare-life-sciences" /> },
  { path: '/en/about', element: <NosotrosEN /> },
  { path: '/en/about/responsible-ai', element: <ResponsibleAI /> },

  { path: '/en/solutions', element: <SolucionesEN /> },
  { path: '/en/solutions/:slug', element: <SolucionEN /> },

  { path: '/en/insights', element: <InsightsEN /> },
  { path: '/en/insights/:slug', element: <ArticuloEN /> },
  { path: '/en/contact', element: <ContactoEN /> },

  { path: '/en/privacy', element: <LegalEN page="privacy" /> },
  { path: '/en/terms', element: <LegalEN page="terms" /> },
  { path: '/en/cookies', element: <LegalEN page="cookies" /> },

  { path: '/es/servicios', element: <Servicios /> },
  { path: '/es/servicios/become-now', element: <BecomeNow /> },
  { path: '/es/servicios/become-now/:slug', element: <Program /> },
  { path: '/es/servicios/become-discover', element: <Discovery /> },
  { path: '/es/servicios/become-embed', element: <BuildEmbed /> },

  { path: '/es/como-transformamos', element: <ComoTransformamos /> },

  { path: '/es/industrias', element: <Industrias /> },
  { path: '/es/industrias/servicios-financieros', element: <Industria slug="servicios-financieros" /> },
  { path: '/es/industrias/mineria-energia', element: <Industria slug="mineria-energia" /> },
  { path: '/es/industrias/retail-consumo', element: <Industria slug="retail-consumo" /> },
  { path: '/es/industrias/travel-hospitality', element: <Industria slug="travel-hospitality" /> },
  { path: '/es/industrias/real-estate-construction', element: <Industria slug="real-estate-construction" /> },
  { path: '/es/industrias/healthcare-life-sciences', element: <Industria slug="healthcare-life-sciences" /> },
  { path: '/es/nosotros', element: <Nosotros /> },
  { path: '/es/nosotros/ia-responsable', element: <IaResponsable /> },

  { path: '/es/soluciones', element: <Soluciones /> },
  { path: '/es/soluciones/:slug', element: <Solucion /> },

  { path: '/es/insights', element: <Insights /> },
  { path: '/es/insights/:slug', element: <Articulo /> },
  { path: '/es/contacto', element: <Contacto /> },

  { path: '/es/privacidad', element: <Legal page="privacidad" /> },
  { path: '/es/terminos', element: <Legal page="terminos" /> },
  { path: '/es/cookies', element: <Legal page="cookies" /> },

  /* Herramienta interna, sin prefijo de idioma y fuera del sitemap: no es una
     página del sitio, es por donde se publican las que sí lo son. */
  { path: '/admin', element: <Panel /> },

  /* Las rutas de la primera maqueta siguen resolviendo en vez de dar 404 */
  ...Object.entries(LEGACY_REDIRECTS).map(([from, to]) => ({
    path: from,
    element: <Navigate to={to} replace />,
  })),

  /* Cualquier otra cosa vuelve a la home del idioma que corresponda */
  { path: '*', element: <NotFound /> },
];
