/**
 * Índice de artículos de Insights.
 *
 * Cada artículo es un JSON en src/content/insights/. Uno por archivo, y no una
 * lista dentro de un módulo, por una razón muy concreta: el panel de /admin
 * publica escribiendo ese archivo por la API de GitHub, y el trabajo automático
 * que redacta borradores escribe en el mismo sitio. Un archivo por artículo
 * significa que dos ediciones simultáneas no se pisan y que el historial de git
 * dice qué cambió en qué artículo, no «se tocó el módulo de contenido».
 *
 * El contenido no es texto plano ni markdown: es una lista de bloques que
 * corresponden uno a uno con los componentes reales del sitio. Markdown habría
 * sido más rápido de escribir y habría producido artículos que no se parecen al
 * resto de la web — párrafos y nada más. Con bloques, lo que se compone en el
 * panel es exactamente lo que se publica, y el constructor no puede generar
 * algo que se salga del sistema visual.
 */

/* eager: los artículos son datos pequeños y el listado los necesita todos para
   ordenar por fecha. Cargarlos bajo demanda serviría una página de índice vacía
   que se rellena después, que es justo el salto de contenido que penaliza. */
const ARCHIVOS = import.meta.glob('./insights/*.json', { eager: true, import: 'default' });

/* Un artículo a medio escribir existe en el repositorio pero no en el sitio.
   Es lo que permite que el trabajo automático deje borradores sin publicarlos y
   que el panel tenga algo que enseñar antes de que esté listo. */
export const PUBLICADO = 'publicado';

const normaliza = (a) => ({
  ...a,
  fecha: a.fecha || '1970-01-01',
  es: a.es ? { ...a.es, bloques: a.es.bloques || [] } : null,
  en: a.en ? { ...a.en, bloques: a.en.bloques || [] } : null,
});

export const TODOS = Object.values(ARCHIVOS)
  .map(normaliza)
  .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

export const ARTICULOS = TODOS.filter((a) => a.estado === PUBLICADO);

/* Cada idioma tiene su propia dirección: /es/insights/pilotos-que-no-escalan y
   /en/insights/pilots-that-dont-scale son el mismo artículo. Sin estos mapas,
   el hreflang apuntaría a una URL que no existe y el selector de idioma
   devolvería a la persona al índice en vez de al artículo que estaba leyendo. */
export const porSlug = (lang, slug) =>
  ARTICULOS.find((a) => a[lang]?.slug === slug) || null;

export const SLUG_ES_A_EN = Object.fromEntries(
  ARTICULOS.filter((a) => a.es?.slug && a.en?.slug).map((a) => [a.es.slug, a.en.slug]));
export const SLUG_EN_A_ES = Object.fromEntries(
  ARTICULOS.filter((a) => a.es?.slug && a.en?.slug).map((a) => [a.en.slug, a.es.slug]));

/* Los cinco pilares de la página de Insights, con su etiqueta en cada idioma.
   Un artículo declara su pilar por clave, no por su nombre escrito: así se
   puede corregir la redacción de un pilar sin recorrer todos los artículos. */
export const PILARES = {
  'ai-native': { es: 'The AI-native enterprise', en: 'The AI-native enterprise' },
  'agentic-work': { es: 'Agentic work', en: 'Agentic work' },
  'operating-model': { es: 'Operating-model reinvention', en: 'Operating-model reinvention' },
  'value-adoption': { es: 'Value and adoption', en: 'Value and adoption' },
  'responsible-scale': { es: 'Responsible scale', en: 'Responsible scale' },
};

export const FORMATOS = {
  perspective: { es: 'Perspective', en: 'Perspective' },
  'field-note': { es: 'Field Note', en: 'Field Note' },
  framework: { es: 'Framework', en: 'Framework' },
  'executive-brief': { es: 'Executive Brief', en: 'Executive Brief' },
  'case-evidence': { es: 'Case Evidence', en: 'Case Evidence' },
};

/* Una fecha en un artículo es una señal de vigencia: quien la lee decide si
   sigue siendo válida. Por eso se muestra siempre, y en el idioma de la página. */
export const fechaLegible = (iso, lang) => {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

/* Estimación de lectura a 200 palabras por minuto, contando solo lo que se lee.
   Se calcula y no se escribe a mano porque un número escrito a mano deja de ser
   verdad en cuanto alguien edita el artículo. */
export const minutosDeLectura = (bloques = []) => {
  const texto = JSON.stringify(bloques).replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return Math.max(1, Math.round(texto.split(/\s+/).filter(Boolean).length / 200));
};
