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
