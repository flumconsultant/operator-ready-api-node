import React from 'react';
import HubIndustrias from '../components/industrias/Hub.jsx';

/* La página solo elige idioma: todo lo demás vive en el componente compartido,
   para que la versión inglesa no se quede atrás en la próxima edición. */
export default function Industrias() {
  return <HubIndustrias lang="es" />;
}
