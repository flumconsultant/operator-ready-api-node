/**
 * Cuánto de un elemento está escrito, y en qué idioma.
 *
 * ---- Por qué esto vive aparte y no dentro de una pantalla ----
 *
 * La misma cuenta hace falta en cuatro sitios: el anillo de cada fila de la
 * lista, la barra de la cabecera del editor, los puntos de estado del índice y
 * las dos cifras de deuda de la pantalla de inicio. Escrita cuatro veces serían
 * cuatro definiciones de «escrito» que se separan al primer cambio, y entonces
 * la lista diría 17 de 20 mientras el editor dice 18.
 *
 * ---- Qué cuenta como escrito ----
 *
 * Un texto con algo que no sea espacios. Una lista con al menos una fila que
 * tenga contenido. Un bloque con al menos una de sus partes escrita.
 *
 * Lo que NO cuenta: un campo marcado `opcional`. Ninguna de estas cifras es una
 * nota; son una lista de lo que falta. Contar como deuda un campo que el propio
 * esquema declara prescindible es inventar trabajo, y una barra que nunca llega
 * al final deja de mirarse.
 */

export const escrito = (valor) => {
  if (valor == null) return false;
  if (typeof valor === 'string') return valor.trim() !== '';
  if (Array.isArray(valor)) return valor.some((v) => escrito(v));
  if (typeof valor === 'object') return Object.values(valor).some((v) => escrito(v));
  return true;
};

/** Escritos, exigibles y porcentaje redondeado, para un grupo de campos. */
export function avance(campos, valores = {}) {
  const cuentan = (campos || []).filter((c) => !c.opcional);
  const escritos = cuentan.filter((c) => escrito(valores?.[c.id])).length;
  const total = cuentan.length;
  return { escritos, total, pct: total ? Math.round((escritos / total) * 100) : 100 };
}

/**
 * El estado de una sección, en tres palabras y no en un porcentaje.
 *
 *   escrita   — no falta nada
 *   a revisar — hay algo y falta algo
 *   vacía     — no hay nada
 *
 * Tres estados y no cinco porque el punto mide seis píxeles: lo que no se
 * distingue a ese tamaño no debería existir como estado.
 */
export function estadoSeccion(campos, valores) {
  const { escritos, total } = avance(campos, valores);
  if (!total || escritos === total) return 'escrita';
  return escritos ? 'revisar' : 'vacia';
}

export const ROTULO_ESTADO = {
  escrita: 'escrita',
  revisar: 'a medio escribir',
  vacia: 'vacía',
};
