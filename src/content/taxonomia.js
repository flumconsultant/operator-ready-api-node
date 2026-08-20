/**
 * Pilares y formatos editoriales.
 *
 * Viven aquí y no en insights.js porque ese módulo usa `import.meta.glob`, que
 * solo existe dentro de Vite: importarlo desde un script de Node revienta. Y
 * hay dos scripts que necesitan estas etiquetas —el generador de tarjetas y el
 * de SEO—, así que o salían de aquí o acababan copiadas en tres sitios y
 * desincronizadas a la primera corrección.
 */

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
