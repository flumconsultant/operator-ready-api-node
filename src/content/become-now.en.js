/**
 * BECOME NOW™ — Applied AI Enablement. English content.
 *
 * Mirrors content/become-now.js field by field. Kept separate rather than
 * parameterizing the Spanish file because the Spanish version is the working
 * source of truth and this avoids re-verifying it. Slugs stay identical to
 * the Spanish version — only the copy inside each entry is translated — so
 * the /en/services/become-now/:slug route can reuse the same param.
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
import datos from './become-now.en.json' with { type: 'json' };

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
    to: `/en/services/become-now/${slug}`,
  }))
);
