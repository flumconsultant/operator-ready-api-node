/**
 * El léxico compartido: qué palabras no van en el cuerpo español.
 *
 * ---- Por qué está en su propio archivo ----
 *
 * Esta lista la usaban dos guardianes distintos y solo uno la tenía. El
 * redactor valida su artículo con `validar-articulo.mjs` antes de publicarlo;
 * el despliegue lo vuelve a revisar con `qa-lenguaje.mjs`, que además busca
 * anglicismos. El 24 de agosto de 2026 eso se cobró un día: el artículo pasó la
 * validación del redactor, se publicó en el repositorio, y el despliegue lo
 * rechazó por la palabra «output». El artículo quedó escrito y sin salir, y el
 * aviso llegó cuando ya no había nadie escribiendo.
 *
 * Dos guardianes con distinta idea de lo que está bien no son dos guardianes:
 * son uno que funciona y otro que da una falsa tranquilidad. Ahora leen la
 * misma lista.
 */

/* Anglicismos que en el cuerpo español deben ir traducidos. Se buscan como
   palabra suelta para no marcar «AI agents» dentro de un nombre propio ni
   «workflow» dentro de una URL. */
export const ANGLICISMOS = [
  [/\bworkflows?\b/gi, 'procesos / flujos de trabajo'],
  /* En minúscula es un anglicismo; en mayúscula es el nombre de uno de los
     cinco sistemas —Agents, inside— y eso es naming de marca. */
  [/\bagents\b/g, 'agentes de IA'],
  [/\bcopilots\b/gi, 'copilotos'],
  [/\bspreadsheets\b/gi, 'hojas de cálculo'],
  [/\bdata sources\b/gi, 'fuentes de datos'],
  [/\bresponsible use\b/gi, 'uso responsable'],
  [/\bhuman review\b/gi, 'revisión humana'],
  [/\bprototypes\b/gi, 'prototipos'],
  [/\bdecision system\b/gi, 'sistema de decisión asistida'],
  [/\bexception paths\b/gi, 'rutas de excepción'],
  [/\bautonomy boundaries\b/gi, 'límites de autonomía'],
  [/\bquality criteria\b/gi, 'criterios de calidad'],
  [/\bengagements?\b/gi, 'proyecto / intervención'],
  [/\baccountable lead\b/gi, 'responsable principal'],
  [/\bclient team\b/gi, 'equipo del cliente'],
  [/\boutputs?\b/gi, 'entregable / resultado'],
  [/\bfeasibility\b/gi, 'viabilidad'],
  [/\bexperiences\b/gi, 'experiencias'],
  [/\bproducts\b/g, 'productos'],
  [/\badoption\b/gi, 'adopción'],
  [/\bgovernance\b/gi, 'gobierno / gobernanza'],
  [/\baccountability\b/gi, 'responsabilidad'],
  [/\bskills\b/g, 'capacidades'],
  [/\benterprise search\b/gi, 'búsqueda empresarial'],
  [/\bfoundation models\b/gi, 'modelos fundacionales'],
  [/\bguardrails\b/gi, 'controles'],
  [/\brunbooks?\b/gi, 'manual de operación'],
];

/* Generic AI language. Each entry carries what to do instead, because a
   warning that only says «don't» leaves the writer inventing the replacement,
   and that is where a voice gets lost. */
export const GENERICO = [
  [/unlock(ing)? the power of/gi, 'say what the capability actually does'],
  [/\bleverage\b/gi, 'use / apply'],
  [/\bharness(ing)?\b/gi, 'use / apply'],
  [/\bcutting[- ]edge\b/gi, 'name the technology instead'],
  [/\brevolutionary\b/gi, 'describe the change concretely'],
  [/\brevolutioni[sz]e\b/gi, 'describe the change concretely'],
  [/\bgame[- ]changing\b/gi, 'describe the change concretely'],
  [/\bseamless(ly)?\b/gi, 'say what does not break'],
  [/\bnext[- ]generation\b/gi, 'name the technology instead'],
  [/\bfuture[- ]proof\b/gi, 'say what keeps working and why'],
  [/\bsupercharge\b/gi, 'say what gets faster and by what measure'],
  [/transform your business with ai/gi, 'name the business outcome'],
  [/\bintelligent solutions?\b/gi, 'name the capability'],
  [/ai[- ]powered innovation/gi, 'name the capability'],
  [/digital transformation journey/gi, 'name the change'],
];

/* Spanish inside an English page. Only words that cannot be anything else in
   English: no false friends, no proper nouns, no brand names. «Discover» and
   «Embed» are English words and BECOME service names, so they are not here. */
export const CASTELLANO = [
  [/\bcapacitaci[oó]n\b/gi, 'training'],
  [/\boperaciones\b/gi, 'operations'],
  [/\bfinanzas\b/gi, 'finance'],
  [/\brecursos humanos\b/gi, 'human resources'],
  [/\bindustrias\b/gi, 'industries'],
  [/\bservicios\b/gi, 'services'],
  [/\bnosotros\b/gi, 'about'],
  [/\bempresas?\b/gi, 'enterprise / company'],
  [/\bconocimiento\b/gi, 'knowledge'],
  [/\bestrategia\b/gi, 'strategy'],
  [/\bc[oó]mo\b/gi, 'how'],
  [/\bqu[eé]\b/gi, 'what'],
  [/\bdesarrollo\b/gi, 'development'],
  [/\bcasos de uso\b/gi, 'use cases'],
];
