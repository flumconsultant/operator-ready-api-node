/**
 * Guardián editorial de los artículos que escribe el trabajo automático.
 *
 * Existe porque el sistema publica sin que nadie lea antes. Esa decisión es
 * legítima —la tomó quien firma los artículos— pero cambia dónde está el
 * control: si no hay un lector humano entre la redacción y la web, el control
 * tiene que estar aquí, y tiene que ser mecánico.
 *
 * Todo lo que se comprueba abajo se eligió por el mismo criterio: que sea
 * verificable sin criterio propio. «¿Está bien escrito?» no se puede
 * comprobar; «¿lleva una cifra sin fuente?» sí. Lo segundo es lo que impide
 * los fallos que no tienen vuelta atrás: un dato inventado publicado bajo el
 * nombre de una persona real.
 *
 *   node scripts/validar-articulo.mjs <archivo.json> [...]
 *
 * Sale con código 1 y explica qué falla. No arregla nada: un artículo que no
 * pasa no se publica, y alguien lo mira.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

export const AUTOR = 'Carlos Andrés Ramírez';

const PILARES = ['ai-native', 'agentic-work', 'operating-model', 'value-adoption', 'responsible-scale'];
const FORMATOS = ['perspective', 'field-note', 'framework', 'executive-brief', 'case-evidence'];
const TIPOS = ['entradilla', 'parrafo', 'subtitulo', 'lista', 'indice', 'tarjetas', 'cita', 'destacado', 'imagen', 'faq', 'cta'];

/* Del perfil de voz de Carlos. Cada una es una muletilla que él marca como
   delatora de texto generado, y todas son literales: se pueden buscar. */
const MULETILLAS = [
  'en un mundo cada vez más', 'en el vertiginoso mundo', 'es importante destacar',
  'cabe resaltar', 'en la era digital', 'game changer', 'sin lugar a dudas',
  'la clave del éxito', 'no es casualidad', 'en resumen,', 'traducción:',
  'lo que nadie dice en voz alta', 'la pregunta incómoda es:',
  'y ahí está el problema real', 'rompamos paradigmas',
];

/** Todo el texto del artículo en un idioma, para las comprobaciones de estilo. */
function textoDe(t) {
  const partes = [t.titulo, t.entradilla, t.descripcion];
  for (const b of t.bloques || []) {
    partes.push(b.texto, b.antetitulo, b.fuente, b.pie);
    for (const it of b.items || []) {
      if (typeof it === 'string') partes.push(it);
      else partes.push(it.termino, it.definicion, it.titulo, it.texto, it.pregunta, it.respuesta);
    }
  }
  return partes.filter(Boolean).join('\n');
}

const palabras = (s) => s.split(/\s+/).filter(Boolean).length;

export function validar(art, { archivo = '', slugsAjenos = new Set() } = {}) {
  const mal = [];
  const di = (m) => mal.push(m);

  if (!['borrador', 'publicado'].includes(art.estado)) di(`estado tiene que ser "borrador" o "publicado", no "${art.estado}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(art.fecha || '')) di('fecha tiene que ser AAAA-MM-DD');
  if (art.autor !== AUTOR) di(`autor tiene que ser exactamente "${AUTOR}", no "${art.autor}"`);
  if (!PILARES.includes(art.pilar)) di(`pilar "${art.pilar}" no existe. Son: ${PILARES.join(', ')}`);
  if (!FORMATOS.includes(art.formato)) di(`formato "${art.formato}" no existe. Son: ${FORMATOS.join(', ')}`);

  for (const lang of ['es', 'en']) {
    const t = art[lang];
    const d = (m) => di(`[${lang}] ${m}`);
    if (!t) { di(`falta la versión en ${lang}: los artículos van en los dos idiomas`); continue; }

    if (!t.titulo) d('falta el título');
    else if (t.titulo.length > 60) d(`el título tiene ${t.titulo.length} caracteres; Google corta en 60`);

    if (!t.slug) d('falta la dirección (slug)');
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug)) d(`la dirección "${t.slug}" solo puede llevar minúsculas, números y guiones`);
    else if (slugsAjenos.has(t.slug)) d(`la dirección "${t.slug}" ya la usa otro artículo`);

    if (!t.descripcion) d('falta la descripción, que es lo que sale en Google');
    else if (t.descripcion.length > 155) d(`la descripción tiene ${t.descripcion.length} caracteres; Google corta en 155`);

    const bloques = t.bloques || [];
    if (!bloques.length) { d('el cuerpo está vacío'); continue; }

    for (const b of bloques) {
      if (!TIPOS.includes(b.tipo)) d(`bloque de tipo "${b.tipo}", que la web no sabe pintar`);
      /* Una imagen apunta a un archivo que el trabajo automático no ha subido:
         la página se publica con un hueco roto. */
      if (b.tipo === 'imagen') d('lleva un bloque de imagen, y no hay ninguna imagen que referenciar');
    }

    const faq = bloques.find((b) => b.tipo === 'faq');
    if (!faq || (faq.items || []).length < 3) {
      d('falta el bloque de preguntas frecuentes con al menos 3 preguntas: es la pieza que hace que un asistente pueda citarte');
    } else {
      for (const it of faq.items) {
        if (palabras(it.respuesta || '') < 25) d(`la respuesta a "${it.pregunta}" es demasiado corta para citarse fuera del artículo`);
      }
    }

    const cta = bloques.find((b) => b.tipo === 'cta');
    const destino = lang === 'es' ? '/es/contacto' : '/en/contact';
    if (!cta) d('falta la llamada a la acción del final');
    else if (cta.destino !== destino) d(`la llamada a la acción apunta a "${cta.destino}" en vez de "${destino}"`);

    const texto = textoDe(t);
    const n = palabras(texto);
    if (n < 700) d(`son ${n} palabras; por debajo de 700 no hay artículo, hay una nota`);
    if (n > 1800) d(`son ${n} palabras; por encima de 1800 no se lee`);

    /* Carlos los prohíbe expresamente en su perfil de voz. Es una regla de
       estilo, pero es literal, y una regla literal se puede comprobar. */
    if (texto.includes('—')) d('lleva rayas largas (—). Punto y aparte, o línea nueva');

    const bajo = texto.toLowerCase();
    for (const m of MULETILLAS) if (bajo.includes(m)) d(`muletilla de texto generado: "${m}"`);

    /* La comprobación que más importa. Un artículo firmado por una persona real
       que publica una cifra inventada no se arregla borrándolo después: ya lo
       leyó alguien, y puede que ya lo cite un asistente. Si hay cifra, hay
       fuente, y la fuente se nombra en el propio artículo. */
    const cifras = texto.match(/\d+(?:[.,]\d+)?\s?%|\b\d+\s?(?:de cada|out of)\s?\d+\b/g) || [];
    if (cifras.length) {
      /* Solo cuenta el marcador explícito «Fuente: …». El pie de una cita
         destacada NO vale: dice a quién se atribuye la frase, no de dónde sale
         el dato, y aceptarlo dejaba pasar cualquier cifra en un artículo que
         llevara una cita firmada. */
      if (!/(fuente|source)\s*:/i.test(texto)) {
        d(`usa cifras (${[...new Set(cifras)].join(', ')}) sin escribir «Fuente: …» en ninguna parte`);
      }
    }
  }

  if (art.es?.slug && art.es.slug === art.en?.slug) {
    di('la dirección en español y en inglés son la misma; cada idioma lleva la suya');
  }

  return mal.map((m) => (archivo ? `${basename(archivo)}: ${m}` : m));
}

/* ------------------------------------------------------------------ cli */

if (import.meta.url === `file://${process.argv[1]}`) {
  const archivos = process.argv.slice(2);
  if (!archivos.length) { console.error('uso: node scripts/validar-articulo.mjs <archivo.json> [...]'); process.exit(2); }

  let fallos = 0;
  for (const archivo of archivos) {
    /* Las direcciones tienen que ser únicas en todo el sitio, así que hay que
       mirar los artículos que ya existen, no solo el que llega. */
    const otros = new Set();
    const dir = dirname(archivo);
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.json') || join(dir, f) === archivo) continue;
      try {
        const a = JSON.parse(readFileSync(join(dir, f), 'utf8'));
        for (const l of ['es', 'en']) if (a[l]?.slug) otros.add(a[l].slug);
      } catch { /* un archivo ilegible ya lo denunciará su propia validación */ }
    }

    let art;
    try { art = JSON.parse(readFileSync(archivo, 'utf8')); }
    catch (e) { console.error(`${basename(archivo)}: no es un JSON válido — ${e.message}`); fallos++; continue; }

    const mal = validar(art, { archivo, slugsAjenos: otros });
    if (mal.length) { mal.forEach((m) => console.error(m)); fallos++; }
    else console.log(`${basename(archivo)}: correcto — «${art.es.titulo}»`);
  }
  process.exit(fallos ? 1 : 0);
}
