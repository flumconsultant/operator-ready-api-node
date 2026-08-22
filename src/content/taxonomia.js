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
  'ai-native': { es: 'La empresa AI-native', en: 'The AI-native enterprise' },
  'agentic-work': { es: 'Trabajo con agentes', en: 'Agentic work' },
  'operating-model': { es: 'Reinvención del modelo operativo', en: 'Operating-model reinvention' },
  'value-adoption': { es: 'Valor y adopción', en: 'Value and adoption' },
  'responsible-scale': { es: 'Escalado responsable', en: 'Responsible scale' },
};

export const FORMATOS = {
  perspective: { es: 'Perspectiva', en: 'Perspective' },
  'field-note': { es: 'Nota de campo', en: 'Field Note' },
  framework: { es: 'Framework', en: 'Framework' },
  'executive-brief': { es: 'Informe ejecutivo', en: 'Executive Brief' },
  'case-evidence': { es: 'Evidencia de caso', en: 'Case Evidence' },
};

/* Una fecha en un artículo es una señal de vigencia: quien la lee decide si
   sigue siendo válida. Por eso se muestra siempre, y en el idioma de la página. */
