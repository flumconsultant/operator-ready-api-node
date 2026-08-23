/**
 * Las seis industrias: contenido completo en los dos idiomas.
 *
 * ---- Por qué industria NO es lo mismo que área funcional ----
 *
 * En este sitio ya existe `/es/servicios/become-now/finanzas`: un programa de
 * capacitación para el ÁREA de finanzas, sea cual sea la empresa. Y ahora
 * existe `/es/industrias/banca-seguros-fintech`: cómo se transforma una empresa
 * cuyo NEGOCIO es financiero. Son dos cosas distintas y confundirlas produce
 * dos páginas compitiendo por lo mismo, que es de los pocos errores de SEO que
 * se castigan de verdad.
 *
 * La regla que las separa: un programa habla de una función dentro de
 * cualquier empresa; una industria habla del negocio entero de un sector. Por
 * eso ninguna página de industria repite el contenido de un programa: lo
 * enlaza.
 *
 * ---- Por qué el contenido vive aquí y no en los componentes ----
 *
 * Doce páginas —seis industrias por dos idiomas— con la misma estructura. Como
 * componentes serían doce archivos que se desincronizan a la tercera edición.
 * Aquí la estructura se define una vez y lo que cambia es el texto.
 *
 * ---- Y por qué los enlaces se guardan como slug y no como URL ----
 *
 * Los slugs de las soluciones NO son iguales en los dos idiomas
 * (`escalar-ia` / `scale-ai-beyond-pilots`). Guardando la URL completa habría
 * que escribir cada enlace dos veces y acordarse de las dos al renombrar. Se
 * guarda el slug español, que es el canónico del repositorio, y cada idioma
 * resuelve el suyo con el mapa que ya existe.
 *
 * ---- Lo que este archivo NO puede contener ----
 *
 * Ni un cliente, ni un resultado, ni una cifra, ni una alianza, ni una
 * afirmación regulatoria. Nada de eso se ha verificado, y una industria se lee
 * precisamente como la página donde una consultora demuestra experiencia: es
 * donde más tienta inventar y donde más caro sale. Lo que sí hay es criterio,
 * que es lo que se puede sostener.
 */

/* Los datos viven en industrias.json y este archivo es la puerta.
 *
 * El texto de las seis industrias se edita desde el panel, y un formulario web
 * no puede escribir un archivo .js: un .js contiene código que se ejecuta, y
 * dejar que un navegador escriba código dentro del sitio es exactamente lo que
 * no se puede permitir. Un .json es inerte —solo datos— y por eso sí.
 *
 * Lo que se queda aquí es lo derivado: los índices por slug, las direcciones y
 * los rótulos de las lentes. Eso no es texto editorial, es lógica, y en el
 * código tiene validación que en un JSON no tendría.
 *
 * Para quien importa desde fuera no cambia nada: se sigue pidiendo INDUSTRIAS
 * a este archivo y se recibe lo mismo. */
import datos from './industrias.json' with { type: 'json' };

export const INDUSTRIAS = datos;

export const POR_SLUG = {
  es: Object.fromEntries(INDUSTRIAS.map((i) => [i.slug.es, i])),
  en: Object.fromEntries(INDUSTRIAS.map((i) => [i.slug.en, i])),
};

export const RAIZ = { es: '/es/industrias', en: '/en/industries' };

export const urlIndustria = (ind, lang) => `${RAIZ[lang]}/${ind.slug[lang]}`;

/**
 * Las seis lentes del hub: por dónde se mira una industria antes de mirar una
 * herramienta. Son las mismas seis en todas las industrias a propósito: lo que
 * cambia entre sectores es la respuesta, no la pregunta.
 */
export const LENTES = {
  es: [
    ['Decisiones', 'Qué decisiones se toman tarde, con información incompleta o con criterio distinto según quién las tome.'],
    ['Procesos', 'Qué procesos concentran esperas, entregas entre equipos y trabajo que se rehace.'],
    ['Conocimiento', 'Qué sabe la organización que hoy no está disponible en el momento en que hace falta.'],
    ['Experiencia', 'Qué momentos del cliente o del usuario se degradan por volumen y no por falta de criterio.'],
    ['Crecimiento', 'Qué parte de la propuesta de valor cambiaría si la IA formara parte del producto y no solo del proceso.'],
    ['Riesgo', 'Qué exposición aparece —o se reduce— cuando una capacidad empieza a operar dentro del proceso.'],
  ],
  en: [
    ['Decisions', 'Which decisions are made late, on incomplete information, or to a different standard depending on who makes them.'],
    ['Workflows', 'Which processes concentrate waiting, handovers between teams and rework.'],
    ['Knowledge', 'What the organisation knows that is not available at the moment it is needed.'],
    ['Experience', 'Which customer or user moments degrade because of volume rather than a lack of judgment.'],
    ['Growth', 'Which part of the value proposition would change if AI were part of the product and not only of the process.'],
    ['Risk', 'What exposure appears — or reduces — once a capability starts operating inside the process.'],
  ],
};
