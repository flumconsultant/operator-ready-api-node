/**
 * BECOME NOW™ — Applied AI Enablement.
 *
 * Catorce programas por área, más el material común de la página principal.
 * Va aparte de los componentes por la misma razón que los casos de uso: un
 * programa nuevo debe ser una entrada más en este fichero, no un componente
 * más. Cuando haya CMS, esto es lo que se migra.
 *
 * Regla de contenido que atraviesa todo el servicio: las mallas que se publican
 * son rutas de referencia, no un temario cerrado. Cada página lo dice de forma
 * explícita, porque la promesa del servicio es justo la contraria a la de un
 * catálogo de cursos.
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
import datos from './become-now.json' with { type: 'json' };

export const TAGLINE = datos.TAGLINE;
export const PROMISE = datos.PROMISE;
export const PERSONALIZATION_NOTE = datos.PERSONALIZATION_NOTE;
export const PROGRAM_GROUPS = datos.PROGRAM_GROUPS;
export const PROGRAMS = datos.PROGRAMS;
export const SITUATIONS = datos.SITUATIONS;
export const EXISTING_MATERIAL = datos.EXISTING_MATERIAL;
export const SESSION_ZERO = datos.SESSION_ZERO;
export const SESSION_ZERO_OUTPUTS = datos.SESSION_ZERO_OUTPUTS;
export const SESSION_FLOW = datos.SESSION_FLOW;
export const FORMATS = datos.FORMATS;
export const IS_IS_NOT = datos.IS_IS_NOT;
export const INDICATORS = datos.INDICATORS;
export const GENERAL_DELIVERABLES = datos.GENERAL_DELIVERABLES;
export const FAQ = datos.FAQ;

export const PROGRAM_LIST = PROGRAM_GROUPS.flatMap((g) =>
  g.slugs.map((slug) => ({
    slug,
    group: g.title,
    ...PROGRAMS[slug],
    to: `/es/servicios/become-now/${slug}`,
  }))
);
