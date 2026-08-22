/**
 * BECOME NOW™: el contenido PROPIO de cada uno de los catorce programas.
 *
 * ---- Por qué existe este archivo ----
 *
 * Las veintiocho páginas de programa —catorce por dos idiomas— compartían
 * plantilla. Medido: de los 163 bloques de texto de cada una, más de cien eran
 * idénticos entre ellas, y solo un 15-29% era propio. Para un buscador eso son
 * catorce versiones parametrizadas de la misma landing, y cuando decide que lo
 * son, muestra una y esconde trece.
 *
 * El problema no estaba en la malla de seis sesiones, que ya diferenciaba
 * bastante. Estaba en todo lo que la rodeaba: el mismo problema habitual, la
 * misma Sesión 0, la misma explicación de cómo funciona una sesión, los mismos
 * entregables genéricos y las mismas preguntas frecuentes.
 *
 * Aquí cada programa trae su propia versión de esos bloques: la tensión de su
 * área, los documentos que revisa su Sesión 0, con qué se valida un output en
 * ese oficio, qué activos concretos quedan y qué preguntan de verdad quienes lo
 * contratan.
 *
 * ---- Por qué no es una traducción ----
 *
 * El inglés no es la versión palabra por palabra del español. Son dos
 * adaptaciones del mismo programa para dos audiencias, y por eso viven las dos
 * aquí en vez de generarse una a partir de la otra.
 *
 * ---- Qué se quedó fuera a propósito ----
 *
 * La explicación larga de personalización, seguridad y neutralidad de
 * proveedor sigue en la página madre, /es/servicios/become-now. Repetirla en
 * catorce páginas era buena parte del problema; cada programa dice ahora solo
 * la implicancia que le toca —con qué sistemas de su área convive la IA— y
 * enlaza la madre para lo demás.
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
import datos from './become-now-programas.json' with { type: 'json' };

export const COPY_PROGRAMAS = datos.COPY_PROGRAMAS;

