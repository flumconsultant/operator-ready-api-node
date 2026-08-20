/**
 * Fichas de autor.
 *
 * Una por archivo, igual que los artículos, y por el mismo motivo: el panel las
 * escribe por la API de GitHub, y un archivo por persona evita que dos ediciones
 * simultáneas se pisen.
 *
 * ---- Para qué sirve esto además de para poner una foto ----
 *
 * Un artículo firmado por alguien de quien no se sabe nada no acumula
 * autoridad. Ni Google ni un asistente pueden reconocer experiencia en un
 * nombre suelto: necesitan que ese nombre esté conectado a una identidad
 * verificable en otro sitio. Eso es lo que hace `linkedin`, que se declara como
 * `sameAs` en los datos estructurados, y es la diferencia entre firmar y que
 * la firma signifique algo.
 */

const ARCHIVOS = import.meta.glob('./autores/*.json', { eager: true, import: 'default' });

export const AUTORES = Object.fromEntries(
  Object.values(ARCHIVOS).map((a) => [a.nombre, a]),
);

/* Los artículos guardan el nombre escrito, no un identificador. Es a propósito:
   un artículo tiene que seguir diciendo quién lo firmó aunque la ficha se borre,
   y un identificador huérfano no dice nada. */
export const autorDe = (nombre) => AUTORES[nombre] || null;
