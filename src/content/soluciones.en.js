/**
 * English content for the six solution pages. Mirrors soluciones.js field for
 * field — see that file for why the structure and block order are fixed.
 */

/**
 * ---- Por qué cada página tiene ahora su propio titular en cada bloque ----
 *
 * Las seis compartían el andamiaje: el mismo titular para las señales, el mismo
 * para «qué cambia dentro», el mismo párrafo de las cinco capas y el mismo
 * cierre. Medido sobre el HTML publicado, eso era el 46 % del texto de cada
 * página, y dejaba el grupo con un 52-59 % de texto propio y hasta un 43 % de
 * solapamiento entre dos de ellas: el punto más débil del sitio.
 *
 * No faltaba contenido —las señales, el problema, el valor y el resultado ya
 * eran propios— sino un titular verificable en cada bloque. Es lo mismo que
 * llevó a las páginas de programa del 20 % al 90 % de texto propio.
 *
 * `dentroTexto` es el que más importa: antes las seis decían que el trabajo
 * cruza las cinco capas, que es verdad y es la misma verdad seis veces. Ahora
 * cada una dice cuál pesa en SU situación y por qué.
 */
/* Los datos viven en el .json de al lado y este archivo es la puerta.
 *
 * El motivo no es de formato sino de quién puede escribirlo: un .js contiene
 * código que se ejecuta, y un formulario web no puede escribir código dentro
 * del sitio. Un .json es inerte, y por eso el panel sí puede tocarlo.
 *
 * Lo derivado se queda aquí: no es texto editorial, es lógica.
 *
 * Para quien importa desde fuera no cambia nada. */
import datos from './soluciones.en.json' with { type: 'json' };

export const SOLUCION_CONTENIDO = datos.SOLUCION_CONTENIDO;
export const ORIENTATION = datos.ORIENTATION;

