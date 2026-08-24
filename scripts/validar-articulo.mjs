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
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
import { IMAGENES as CATALOGO } from '../src/content/imagenes.js';
import { ANGLICISMOS } from './lexico.mjs';

/**
 * Quién firma no está escrito aquí: sale de las fichas de autor, que se editan
 * desde el panel.
 *
 * Antes era una constante con un nombre dentro, y eso significaba que cambiar
 * de firma —o añadir una segunda— exigía tocar código. La firma es una
 * decisión editorial y tiene que poder tomarla quien opera el sitio.
 *
 * La ficha marcada como `predeterminado` es con la que firma el trabajo
 * automático. Las demás valen igual para un artículo escrito a mano: lo que se
 * comprueba es que quien firma EXISTA, no que sea uno en concreto. Un nombre
 * sin ficha no tiene foto, ni cargo, ni LinkedIn, así que aparece en la web
 * como una cadena de texto que no se puede contrastar con nada.
 */
export function autores(dir = join(RAIZ, 'src/content/autores')) {
  let archivos = [];
  try { archivos = readdirSync(dir).filter((f) => f.endsWith('.json')); } catch { return []; }
  return archivos.map((f) => {
    try { return JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch { return null; }
  }).filter(Boolean);
}

export const autorPorDefecto = (lista = autores()) =>
  (lista.find((a) => a.predeterminado) || lista[0])?.nombre || '';

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

/* Frases que el encargo del copy prohíbe por su nombre. Son literales, así que
   se pueden buscar: no es criterio, es una lista. */
const COPY_PROHIBIDO = [
  'la ia está revolucionando', 'en un mundo cada vez más digital', 'descubre cómo',
  '¿estás listo para el futuro?', 'no te lo puedes perder', 'nuevo artículo',
];

/**
 * El post de LinkedIn, revisado con las mismas reglas que el artículo.
 *
 * Se revisa aquí y no al publicar por una razón de horario: al publicar no hay
 * nadie mirando, el artículo ya está en la web y rechazar el post solo consigue
 * que el artículo salga sin anuncio. Aquí todavía hay quien lo escribió.
 *
 * Es opcional: un artículo sin copy se publica igual, con un texto de respaldo
 * peor. Lo que no se admite es un copy escrito mal.
 */
function revisarCopyLinkedIn(art, di) {
  const copy = art.es?.linkedin;
  if (!copy) return;
  const d = (m) => di(`[linkedin] ${m}`);

  if (typeof copy !== 'object' || Array.isArray(copy)) { d('«linkedin» tiene que ser un objeto con «texto» y «hashtags»'); return; }
  const texto = String(copy.texto || '').trim();
  if (!texto) { d('está el campo pero el texto está vacío'); return; }

  /* 60–100 palabras es el encargo. El margen es de una palabra por lado y no
     más: el rango existe porque un post largo se corta con «…ver más» y uno
     corto no da razón para pulsar. */
  const n = texto.split(/\s+/).filter(Boolean).length;
  if (n < 60) d(`el copy tiene ${n} palabras; por debajo de 60 no plantea nada, solo anuncia`);
  if (n > 100) d(`el copy tiene ${n} palabras; por encima de 100 el lector ya no necesita abrir el artículo`);

  /* El enlace lo pone el publicador. Uno escrito a mano dentro del texto sale
     duplicado en el post, y si además está mal, mal. */
  if (/https?:\/\/|meetbecome\.com/i.test(texto)) d('el texto lleva un enlace escrito a mano; el enlace lo añade el publicador desde el slug');
  if (texto.includes('#')) d('los hashtags van en «hashtags», no dentro del texto');

  /* Una sola pregunta. Dos seguidas diluyen la primera, y tres son un anuncio. */
  const preguntas = (texto.match(/\?/g) || []).length;
  if (preguntas > 1) d(`lleva ${preguntas} signos de interrogación de cierre; el encargo permite uno`);

  if (texto.includes('—')) d('lleva rayas largas (—); aquí tampoco');

  const bajo = texto.toLowerCase();
  for (const m of COPY_PROHIBIDO) if (bajo.includes(m)) d(`frase prohibida en el copy: "${m}"`);
  for (const m of MULETILLAS) if (bajo.includes(m)) d(`muletilla de texto generado en el copy: "${m}"`);

  /* Repetir el título es el atajo por defecto y es justo lo que convierte el
     post en un titular con enlace. */
  const titulo = String(art.es.titulo || '').trim().toLowerCase();
  if (titulo && bajo.includes(titulo)) d('el copy repite el título literalmente; el post tiene que aportar el ángulo, no el titular');

  /* Que no sea el artículo otra vez. Si el gancho es la entradilla copiada,
     nadie ha escrito un post: se ha movido un campo de sitio. */
  const entradilla = String(art.es.entradilla || '').trim().toLowerCase();
  if (entradilla.length > 40 && bajo.includes(entradilla.slice(0, 60))) {
    d('el copy empieza copiando la entradilla del artículo; el post necesita su propio gancho');
  }

  const etiquetas = copy.hashtags;
  if (etiquetas !== undefined) {
    if (!Array.isArray(etiquetas)) d('«hashtags» tiene que ser una lista');
    else {
      if (etiquetas.length > 3) d(`lleva ${etiquetas.length} hashtags; el máximo es 3`);
      for (const h of etiquetas) {
        if (typeof h !== 'string' || !h.trim()) d('hay un hashtag vacío');
        else if (h.startsWith('#')) d(`el hashtag "${h}" lleva almohadilla; la pone el publicador`);
        else if (/\s/.test(h)) d(`el hashtag "${h}" lleva espacios y LinkedIn los parte en dos`);
      }
    }
  }
}

export function validar(art, { archivo = '', slugsAjenos = new Set() } = {}) {
  const mal = [];
  const di = (m) => mal.push(m);

  if (!['borrador', 'publicado'].includes(art.estado)) di(`estado tiene que ser "borrador" o "publicado", no "${art.estado}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(art.fecha || '')) di('fecha tiene que ser AAAA-MM-DD');
  const fichas = autores();
  if (!fichas.length) {
    di('no hay ninguna ficha de autor en src/content/autores: créala en el panel antes de publicar');
  } else if (!fichas.some((a) => a.nombre === art.autor)) {
    di(`autor "${art.autor}" no tiene ficha. Los que sí la tienen: ${fichas.map((a) => `"${a.nombre}"`).join(', ')}`);
  }
  if (!PILARES.includes(art.pilar)) di(`pilar "${art.pilar}" no existe. Son: ${PILARES.join(', ')}`);
  if (!FORMATOS.includes(art.formato)) di(`formato "${art.formato}" no existe. Son: ${FORMATOS.join(', ')}`);

  for (const lang of ['es', 'en']) {
    const t = art[lang];
    const d = (m) => di(`[${lang}] ${m}`);
    if (!t) { di(`falta la versión en ${lang}: los artículos van en los dos idiomas`); continue; }

    if (!t.titulo) d('falta el título');
    /* 51 y no 60: al título se le añade « | BECOME» —nueve caracteres— para el
       resultado de búsqueda. Con 51 caben los dos; por encima, o se corta el
       titular o se publica sin marca. Avisar a 60 dejaba pasar justo los
       titulares que luego había que sacrificar. */
    else if (t.titulo.length > 51) d(`el título tiene ${t.titulo.length} caracteres; con « | BECOME» detrás, Google corta a partir de 51`);

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
      if (b.tipo === 'imagen') {
        /* Antes esto era un rechazo seco: no había catálogo, así que cualquier
           ruta era una ruta inventada. Ahora hay lista cerrada, y lo que se
           comprueba es la pertenencia. */
        const c = CATALOGO.find((x) => x.src === b.src);
        if (!c) d(`la imagen "${b.src}" no está en el catálogo (src/content/imagenes.js)`);
        else if (!c.usable) d(`la imagen "${b.src}" está marcada como no usable: ${c.motivo}`);
      }
    }

    const faq = bloques.find((b) => b.tipo === 'faq');
    if (!faq || (faq.items || []).length < 3) {
      d('falta el bloque de preguntas frecuentes con al menos 3 preguntas: es la pieza que hace que un asistente pueda citarte');
    } else {
      for (const it of faq.items) {
        if (palabras(it.respuesta || '') < 25) d(`la respuesta a "${it.pregunta}" es demasiado corta para citarse fuera del artículo`);
      }
    }

    /* Una sola imagen por artículo. Dos ya no ilustran: parten la lectura, y
       en un texto de mil palabras la segunda siempre acaba siendo de relleno. */
    const imagenes = bloques.filter((b) => b.tipo === 'imagen');
    if (imagenes.length > 1) d(`lleva ${imagenes.length} imágenes; una basta`);

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

    /* Anglicismos, y solo en el lado español. Es la MISMA lista que revisa el
       despliegue: hasta hoy este guardián no la miraba, así que un artículo
       podía pasar aquí, publicarse en el repositorio y morir en el despliegue
       por una palabra. Cuando eso ocurre, el día se queda sin artículo y quien
       lo escribió ya no está delante para arreglarlo. */
    if (lang === 'es') {
      for (const [expresion, arreglo] of ANGLICISMOS) {
        const vistos = new Set();
        for (const m of texto.matchAll(expresion)) vistos.add(m[0]);
        for (const v of vistos) d(`anglicismo en el cuerpo español: "${v}" — usa ${arreglo}`);
      }
    }

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

  revisarCopyLinkedIn(art, di);

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
