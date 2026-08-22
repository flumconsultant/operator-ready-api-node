/**
 * Las páginas del sitio, como dato editable.
 *
 * Cada página es un JSON con campos que llevan su rótulo, su ayuda y su límite
 * de caracteres. Eso es lo que permite que el panel dibuje un formulario que se
 * entiende sin haber visto nunca el código: quien edita ve «La promesa · es el
 * h1 de la página · 224 de 280», no una llave llamada `promesa`.
 *
 * ---- Por qué los textos salen del componente ----
 *
 * Un texto dentro de un JSX solo lo puede tocar quien sepa programar, no se
 * puede editar desde el móvil, y sobre todo no se puede recomponer: el día que
 * la página se arme sola para cada industria, lo que esté escrito a mano dentro
 * de un componente será exactamente lo que no se pueda armar.
 *
 * Se migran de una en una y no de golpe. Cada página que pasa por aquí gana
 * edición desde el panel; las que aún no han pasado siguen funcionando igual.
 */

import home from './home.json' with { type: 'json' };

export const PAGINAS = { home };

/** El valor de un campo, o el de reserva si esa página aún no se migró. */
export const campo = (pagina, id, reserva = '') =>
  PAGINAS[pagina]?.campos?.find((c) => c.id === id)?.valor ?? reserva;
