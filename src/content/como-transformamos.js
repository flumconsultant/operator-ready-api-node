/**
 * Cómo transformamos: el contenido de la página del método, en los dos idiomas.
 *
 * ---- Por qué el apartado ya no se llama «Framework» ----
 *
 * «Framework» dice qué ES la cosa, no qué HACE por quien la lee. En un menú,
 * quien entra por primera vez no está buscando un framework: está intentando
 * entender cómo trabajamos. «Cómo transformamos» responde a eso en tres
 * palabras, y dentro de la página el concepto sigue llamándose por su nombre
 * —BECOME Transformation Framework—, que es donde ese nombre sí aporta.
 *
 * ---- Por qué las etapas llevan preguntas y no descripciones ----
 *
 * Una etapa descrita («comprendemos el sistema») no se puede verificar: suena
 * bien y no compromete a nada. Una etapa con las preguntas que se responden en
 * ella sí, porque quien lee puede comprobar si esas son las preguntas que su
 * empresa tiene sin responder. Y el Output declara qué queda por escrito al
 * terminar, que es la otra mitad de lo mismo.
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
import datos from './como-transformamos.json' with { type: 'json' };

export const CT = datos.CT;

