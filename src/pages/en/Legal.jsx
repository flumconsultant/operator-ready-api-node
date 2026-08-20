import React from 'react';
import Legal from '../Legal.jsx';

/**
 * Las páginas legales en inglés son la misma plantilla con otro idioma. Un
 * componente propio habría duplicado la maqueta, y una maqueta duplicada se
 * desincroniza a la primera corrección — que en un documento legal significa
 * que las dos versiones dicen cosas distintas.
 */
export default function LegalEN({ page }) {
  return <Legal page={page} lang="en" />;
}
