/**
 * Las seis soluciones: su dirección en cada idioma y el orden en que se
 * muestran.
 *
 * ---- Por qué un mapa y no el mismo slug en los dos idiomas ----
 *
 * Hasta ahora la versión inglesa reutilizaba el slug español
 * —/en/solutions/experiencia-ai-native—, lo que deja una URL a medio traducir
 * a la vista de cualquiera que la comparta. Cada idioma lleva ahora su propia
 * dirección, y este archivo es lo que las mantiene emparejadas: el selector
 * ES/EN lo usa para llevarte a la misma solución, no a la portada.
 *
 * ---- Soluciones, no casos de uso ----
 *
 * Una solución es una necesidad de negocio: lo que la empresa necesita que
 * cambie. Un caso de uso es una aplicación concreta —quién, qué tarea, qué
 * hace la IA, dónde valida una persona— y vive DENTRO de la página de la
 * solución, no en el menú. Distinguirlos es lo que evita que el menú acabe
 * siendo un catálogo de tecnologías.
 */

export const SOLUCIONES = [
  { es: 'escalar-ia',                    en: 'scale-ai-beyond-pilots' },
  { es: 'preparar-equipos-para-ia',      en: 'prepare-teams-for-ai' },
  { es: 'redisenar-procesos-criticos',   en: 'redesign-critical-workflows' },
  { es: 'agentes-de-ia-con-control',     en: 'deploy-governed-ai-agents' },
  { es: 'productos-y-servicios-con-ia',  en: 'build-ai-enabled-products' },
  { es: 'medir-y-gobernar-valor',        en: 'measure-and-govern-ai-value' },
];

export const SLUG_ES_A_EN = Object.fromEntries(SOLUCIONES.map((s) => [s.es, s.en]));
export const SLUG_EN_A_ES = Object.fromEntries(SOLUCIONES.map((s) => [s.en, s.es]));

/**
 * Las direcciones anteriores, cuando el apartado se llamaba «casos de uso».
 * Dos de ellas ya no tienen solución equivalente y van al índice: es preferible
 * a un 404, y a inventar una correspondencia que no existe.
 */
export const SOLUCIONES_ANTERIORES = {
  'pilotos-que-no-escalan':    'escalar-ia',
  'redisenar-workflow-critico':'redisenar-procesos-criticos',
  'construir-agent-o-copilot': 'agentes-de-ia-con-control',
  'experiencia-ai-native':     'productos-y-servicios-con-ia',
  'demostrar-valor-en-90-dias':'medir-y-gobernar-valor',
  'por-donde-empezar-con-ia':  null,
};
