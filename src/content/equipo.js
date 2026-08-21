/**
 * Quién sale en la página de Nosotros, y en qué orden.
 *
 * No hay una lista de equipo aparte: son las mismas fichas de autor que firman
 * los artículos, filtradas por `equipo` y ordenadas por `orden`. Dos listas con
 * los mismos nombres se desincronizan a la primera corrección de un cargo, y en
 * una página que existe para dar confianza, dos versiones del mismo cargo hacen
 * más daño que no tener página.
 *
 * Ambos campos se editan desde el panel, así que añadir a alguien al equipo no
 * es un cambio de código.
 */

import { AUTORES } from './autores.js';

export const EQUIPO = Object.values(AUTORES)
  .filter((a) => a.equipo)
  /* Sin `orden` la ficha va al final, no al principio: quien la acaba de crear
     desde el panel no debería colarse por delante de nadie por descuido. */
  .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || a.nombre.localeCompare(b.nombre));
