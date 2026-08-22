import React from 'react';
import FichaIndustria from '../components/industrias/Ficha.jsx';

/* El slug llega como propiedad desde routes.jsx, no como parámetro de ruta.
   Con :slug la ruta sería una sola y el generador de SEO tendría que aprender a
   expandirla; declaradas una por una, cada industria es una ruta con su título,
   su descripción y su hreflang, que es justo lo que pide una página que existe
   para posicionar. */
export default function Industria({ slug }) {
  return <FichaIndustria lang="es" slug={slug} />;
}
