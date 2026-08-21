/**
 * Después de compilar, genera dentro de dist/:
 *
 *   · _pages/<ruta>.html — una copia de index.html por ruta, con SU título, SU
 *     descripción, SU canonical, sus hreflang y sus datos estructurados.
 *   · sitemap.xml con las dos versiones de idioma declaradas como alternativas.
 *   · robots.txt
 *
 * ---- Por qué un archivo por ruta ----
 *
 * El sitio es una SPA: el servidor devolvía el mismo index.html para las 44
 * URLs, así que las 44 compartían título y descripción. Para un buscador eso
 * significa 44 páginas que dicen llamarse igual, y en los resultados aparece el
 * mismo texto sin relación con lo que la persona buscó.
 *
 * La solución completa es prerenderizar el HTML entero, lo que exige un
 * navegador en el despliegue. Esto es el 80% del beneficio sin ese coste: el
 * cuerpo lo sigue montando React, pero la cabecera —que es lo que leen los
 * buscadores y lo que se ve al compartir un enlace— ya es correcta y estática,
 * sin depender de que nadie ejecute JavaScript.
 *
 * Los archivos van a _pages/ y no a carpetas que imiten la ruta a propósito:
 * con carpetas, Apache redirige /es/servicios a /es/servicios/ para añadir la
 * barra final, y aparecería un salto extra y dos URLs para la misma página.
 * Con un archivo plano, la regla de .htaccess lo sirve sin redirigir, y si el
 * archivo no existiera la petición cae en la regla de la SPA como antes: esto
 * añade, no sustituye.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const { SITE, BRAND, OG_IMAGE, PAGES, langOf } = await import('../src/seo-meta.js');
const esNow = await import('../src/content/become-now.js');
const enNow = await import('../src/content/become-now.en.js');
const esCasos = await import('../src/content/soluciones.js');
const enCasos = await import('../src/content/soluciones.en.js');
/* Cada solución tiene una dirección distinta en cada idioma; sin este mapa, el
   hreflang apuntaría a /en/solutions/escalar-ia, que no existe. */
const { SLUG_ES_A_EN, SLUG_EN_A_ES } = await import('../src/content/soluciones-slugs.js');
const { IMAGENES: CATALOGO } = await import('../src/content/imagenes.js');
/* Las fichas de autor se leen del directorio y no por import.meta.glob, que
   solo existe dentro de Vite. */
const FICHAS = Object.fromEntries(
  readdirSync(join(ROOT, 'src/content/autores'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(read(`src/content/autores/${f}`)))
    .map((a) => [a.nombre, a]),
);

/* ------------------------------------------------------------- artículos */
/*
 * Los artículos de Insights se leen del directorio, no de un módulo con la
 * lista: es lo que permite que el panel de /admin y el trabajo automático
 * publiquen escribiendo un archivo, sin tener que editar además un índice —que
 * es exactamente el paso que se olvida y deja un artículo invisible.
 *
 * Solo entran los publicados. Un borrador existe en el repositorio y no en el
 * sitemap; si entrara, se estaría ofreciendo a los buscadores una URL que la
 * aplicación no sirve.
 */
const DIR_INSIGHTS = join(ROOT, 'src/content/insights');
const articulos = (existsSync(DIR_INSIGHTS) ? readdirSync(DIR_INSIGHTS) : [])
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(DIR_INSIGHTS, f), 'utf8')))
  .filter((a) => a.estado === 'publicado')
  .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

/* URL → artículo e idioma, para no volver a buscarlo en cada uno de los tres
   sitios que necesitan sus datos (cabecera, datos estructurados y sitemap). */
const porUrl = {};
for (const a of articulos) {
  if (a.es?.slug) porUrl[`/es/insights/${a.es.slug}`] = { a, lang: 'es' };
  if (a.en?.slug) porUrl[`/en/insights/${a.en.slug}`] = { a, lang: 'en' };
}

/* Las rutas fijas salen de routes.jsx leído como texto: importarlo exigiría un
   runtime capaz de resolver JSX, y el archivo es una lista plana. */
const staticPaths = [...read('src/routes.jsx').matchAll(/\{\s*path:\s*'([^']+)'/g)]
  .map((m) => m[1])
  /* /admin es una herramienta interna: no lleva contenido, exige un token para
     hacer nada y no debe aparecer ni en el sitemap ni en llms.txt. Se excluye
     aquí, en el origen, y no con una excepción en cada consumidor. */
  .filter((p) => p !== '*' && !p.includes(':') && !p.startsWith('/admin'));

/* ------------------------------------------------- rutas con parámetro */

const recorta = (s, max) => {
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).replace(/[\s,;:.]+$/, '')}…`;
};

/**
 * El título con la marca SIEMPRE, aunque haya que recortar el resto.
 *
 * Antes se recortaba la cadena entera a 60, y con una pregunta larga lo que
 * quedaba fuera era precisamente el « | BECOME» del final: en un resultado de
 * búsqueda, la única palabra que dice de quién es la página. Ahora se recorta
 * la parte variable y la marca se pega después.
 */
const tituloConMarca = (texto, marca = ` | ${BRAND}`, max = 60) =>
  recorta(texto, Math.max(12, max - marca.length)) + marca;

const dinamicas = {};

for (const [slug, p] of Object.entries(esNow.PROGRAMS)) {
  dinamicas[`/es/servicios/become-now/${slug}`] = {
    title: tituloConMarca(p.menu, ' — BECOME NOW™'),
    description: recorta(p.body, 155),
    alt: `/en/services/become-now/${slug}`,
  };
}
for (const [slug, p] of Object.entries(enNow.PROGRAMS)) {
  dinamicas[`/en/services/become-now/${slug}`] = {
    title: tituloConMarca(p.menu, ' — BECOME NOW™'),
    description: recorta(p.body, 155),
    alt: `/es/servicios/become-now/${slug}`,
  };
}
for (const [slug, c] of Object.entries(esCasos.SOLUCION_CONTENIDO)) {
  dinamicas[`/es/soluciones/${slug}`] = {
    title: tituloConMarca(c.q.replace(/^¿|\?$/g, '')),
    description: recorta(c.answer, 155),
    alt: `/en/solutions/${SLUG_ES_A_EN[slug]}`,
  };
}
for (const [slug, c] of Object.entries(enCasos.SOLUCION_CONTENIDO)) {
  dinamicas[`/en/solutions/${slug}`] = {
    title: tituloConMarca(c.q.replace(/\?$/, '')),
    description: recorta(c.answer, 155),
    alt: `/es/soluciones/${SLUG_EN_A_ES[slug]}`,
  };
}

/* Título y descripción del artículo salen del propio artículo. La descripción
   tiene campo propio en vez de reaprovechar la entradilla: lo que engancha a
   quien ya está leyendo y lo que gana un clic en un resultado de búsqueda rara
   vez son la misma frase. Si falta, cae a la entradilla antes que quedarse en
   blanco. */
for (const [url, { a, lang }] of Object.entries(porUrl)) {
  const t = a[lang];
  const otro = lang === 'es' ? 'en' : 'es';
  dinamicas[url] = {
    title: recorta(`${t.titulo} | ${BRAND}`, 60),
    description: recorta(t.descripcion || t.entradilla || '', 155),
    alt: a[otro]?.slug
      ? `/${otro}/insights/${a[otro].slug}`
      : (lang === 'es' ? '/en/insights' : '/es/insights'),
    tipoOg: 'article',
    lastmod: a.actualizado || a.fecha,
  };
}

const paths = [...new Set([...staticPaths, ...Object.keys(dinamicas)])].sort();

/* ------------------------------------------------------ datos estructurados */

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND,
  url: SITE,
  logo: `${SITE}/logo/icon-white.svg`,
  email: 'hello@meetbecome.com',
  /* `sameAs` es lo que conecta el nombre «BECOME» de este sitio con una entidad
     que existe fuera de él. Sin esta línea, para un buscador o un asistente el
     nombre es una cadena de texto más; con ella, es una empresa que se puede
     contrastar. Es la señal de entidad más barata que hay. */
  sameAs: ['https://www.linkedin.com/company/meetbecome/'],
  description: 'Consultora de transformación AI-native: capacitación en IA aplicada, estrategia y construcción de capacidades.',
};

/* Una FAQPage solo es válida si esas preguntas están de verdad en la página;
   si no, es contenido estructurado que no existe y se penaliza. Estas son las
   mismas que renderiza la página de BECOME NOW™. */
const faqPage = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

const servicio = (nombre, descripcion, url) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: nombre,
  description: descripcion,
  provider: { '@type': 'Organization', name: BRAND, url: SITE },
  areaServed: 'Worldwide',
  url,
});

/* BlogPosting con autor y fechas: es lo que permite que un resultado muestre
   la fecha, y lo que le da a un asistente algo que citar con atribución en vez
   de un texto suelto sin procedencia. */
/**
 * La imagen que representa a un artículo.
 *
 * Primero su tarjeta, que lleva el titular escrito y por tanto dice algo; luego
 * una imagen del cuerpo si la lleva; y solo si no hay ninguna, la genérica del
 * sitio. El orden importa: que las setenta páginas declaren la misma imagen no
 * ayuda a quien tiene que decidir cuál enseñar.
 */
const imagenDe = (a, lang) => {
  const slug = a[lang]?.slug;
  if (slug && existsSync(join(ROOT, 'assets/images/tarjetas', `${slug}.jpg`))) {
    return `${SITE}/images/tarjetas/${slug}.jpg`;
  }
  const img = (a[lang]?.bloques || []).find((b) => b.tipo === 'imagen');
  const c = img && CATALOGO.find((x) => x.src === img.src);
  return c ? SITE + c.src : OG_IMAGE;
};

const blogPosting = (a, lang, url) => {
  const t = a[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: t.titulo,
    description: t.descripcion || t.entradilla || '',
    inLanguage: lang,
    datePublished: a.fecha,
    dateModified: a.actualizado || a.fecha,
    /* Persona, no organización, cuando firma alguien. Un artículo de opinión
       atribuido a una empresa no acumula autoridad de autor: ni Google ni un
       asistente pueden reconocer experiencia en un nombre comercial. Si algún
       día firma la marca, se vuelve a declarar como organización. */
    author: a.autor && a.autor !== BRAND
      ? (() => {
        const f = FICHAS[a.autor];
        return {
          '@type': 'Person',
          name: a.autor,
          url: `${SITE}/${lang}/${lang === 'es' ? 'nosotros' : 'about'}`,
          ...(f?.[lang]?.rol ? { jobTitle: f[lang].rol } : {}),
          ...(f?.[lang]?.bio ? { description: f[lang].bio } : {}),
          ...(f?.foto ? { image: SITE + f.foto } : {}),
          /* sameAs es la pieza que convierte un nombre en una identidad. Sin
             ella, «Carlos Andrés Ramírez» es una cadena de texto que no se
             puede contrastar con nada; con ella, un buscador o un asistente
             puede unir el artículo con una trayectoria pública. */
          ...(f?.linkedin ? { sameAs: [f.linkedin] } : {}),
        };
      })()
      : { '@type': 'Organization', name: BRAND, url: SITE },
    publisher: { '@type': 'Organization', name: BRAND, url: SITE, logo: `${SITE}/logo/icon-white.svg` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    /* La imagen del propio artículo si la lleva, y solo si no, la genérica: un
       BlogPosting que declara la misma imagen que los otros sesenta y nueve no
       aporta nada a quien tiene que decidir cuál enseñar. */
    image: imagenDe(a, lang),
  };
};

/* Migas de pan. No son decoración del resultado de búsqueda: son la única
   declaración explícita de dónde cuelga esta página. Un asistente que decide si
   citar un artículo suelto o la sección entera necesita saber que existe una
   sección, y sin esto tiene que deducirlo de la forma de la URL. */
const migas = (lang, t) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: BRAND, item: `${SITE}/${lang}` },
    { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE}/${lang}/insights` },
    { '@type': 'ListItem', position: 3, name: t.titulo },
  ],
});

/**
 * Las migas de cualquier página, deducidas de su propia URL.
 *
 * El nombre de cada escalón sale del `title` de esa ruta si existe, y solo si
 * no existe se cae al tramo de la URL con guiones cambiados por espacios.
 * Inventar el nombre de un nivel intermedio sería declarar una jerarquía que
 * el sitio no tiene, y eso se penaliza igual que inventar una FAQ.
 */
function migasDeRuta(path, meta, titulos) {
  const [, lang, ...tramos] = path.split('/');
  if (!tramos.length) return null;
  const items = [{ '@type': 'ListItem', position: 1, name: BRAND, item: `${SITE}/${lang}` }];
  let acumulada = `/${lang}`;
  tramos.forEach((tramo, i) => {
    acumulada += `/${tramo}`;
    const propio = titulos[acumulada];
    const nombre = propio
      ? propio.split('|')[0].split('—')[0].trim()
      : tramo.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    const ultimo = i === tramos.length - 1;
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: ultimo ? (meta.title || nombre).split('|')[0].split('—')[0].trim() : nombre,
      /* El último escalón va sin `item`: es la página en la que ya estás, y
         enlazarla a sí misma es lo que marca como error un validador. */
      ...(ultimo ? {} : { item: SITE + acumulada }),
    });
  });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}

function datosEstructurados(path, meta) {
  const url = SITE + path;

  /* Las preguntas del JSON-LD son literalmente las del bloque «faq» que
     renderiza la página. Declarar preguntas que no están visibles es contenido
     estructurado inventado, y se penaliza. */
  const art = porUrl[path];
  if (art) {
    const salida = [blogPosting(art.a, art.lang, url), migas(art.lang, art.a[art.lang])];
    const faq = (art.a[art.lang]?.bloques || [])
      .filter((b) => b.tipo === 'faq')
      .flatMap((b) => b.items || [])
      .filter((it) => it.pregunta && it.respuesta);
    if (faq.length) salida.push(faqPage(faq.map((it) => [it.pregunta, it.respuesta])));
    return salida;
  }

  if (path === '/es' || path === '/en') {
    return [ORG, { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE }];
  }
  /* La página de equipo: las personas también en datos estructurados.
     No es decoración. Un asistente que resume «quién es BECOME» no ejecuta
     JavaScript, así que sin esto lo único que sabe de las tres personas es que
     no las hay. Con `sameAs` apuntando a su LinkedIn, además, el nombre deja de
     ser texto suelto y pasa a ser una identidad que se puede contrastar, que es
     de lo que depende que una firma signifique algo. */
  if (path === '/es/nosotros' || path === '/en/about') {
    const lang = path.startsWith('/en') ? 'en' : 'es';
    const gente = Object.values(FICHAS)
      .filter((a) => a.equipo)
      .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || a.nombre.localeCompare(b.nombre))
      .map((a) => {
        const t = a[lang] || a.es || {};
        const persona = {
          '@type': 'Person',
          name: a.nombre,
          worksFor: { '@type': 'Organization', name: BRAND, url: SITE },
        };
        if (t.rol) persona.jobTitle = t.rol;
        if (t.bio) persona.description = t.bio;
        if (a.linkedin) persona.sameAs = [a.linkedin];
        /* Solo si hay foto de verdad. Declarar una imagen que no existe es
           peor que no declarar ninguna. */
        if (a.foto) persona.image = SITE + a.foto.split('?')[0];
        return persona;
      });
    if (!gente.length) return [ORG];
    return [
      ORG,
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url,
        name: meta.title,
        about: { '@type': 'Organization', name: BRAND, url: SITE },
        mainEntity: gente,
      },
    ];
  }

  if (path === '/es/servicios/become-now') return [faqPage(esNow.FAQ)];
  if (path === '/en/services/become-now') return [faqPage(enNow.FAQ)];
  /* Todas las demás páginas: WebPage y migas. Sin esto, 58 de las 72 rutas se
     publicaban sin un solo dato estructurado, y el único modo que tenía un
     asistente de saber que /es/servicios/become-now cuelga de /es/servicios
     era deducirlo de la forma de la URL. */
  const titulos = Object.fromEntries(
    Object.entries(PAGES).map(([r, v]) => [r, v[0]]).concat(
      Object.entries(dinamicas).map(([r, v]) => [r, v.title]),
    ),
  );
  const migasAqui = migasDeRuta(path, meta, titulos);
  const base = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url,
      name: meta.title,
      description: meta.description,
      inLanguage: langOf(path),
      isPartOf: { '@type': 'WebSite', name: BRAND, url: SITE },
      publisher: { '@type': 'Organization', name: BRAND, url: SITE },
    },
    ...(migasAqui ? [migasAqui] : []),
  ];

  if (/^\/(es\/servicios|en\/services)\/(become-discover|become-embed)$/.test(path)) {
    return [servicio(meta.title.split('|')[0].trim(), meta.description, url), ...base];
  }
  return base;
}

/* --------------------------------------------------------- el HTML por ruta */

const plantilla = read('dist/index.html');

/**
 * La etiqueta de Google, tal cual está en la plantilla.
 *
 * Se saca entera y se vuelve a poner entera en cada una de las 72 páginas. No
 * se puede dejar que caiga en el filtro por líneas de más abajo: ese filtro
 * conserva las líneas que contienen «<script», así que de un script en línea
 * de treinta líneas solo sobreviviría la primera y el resto acabaría suelto en
 * medio del HTML.
 */
const analitica = (plantilla.match(/<!-- ga -->[\s\S]*?<!-- \/ga -->/) || [''])[0];
if (!analitica) console.warn('seo: no se encontró el bloque <!-- ga --> en la plantilla');

/* --------------------------------------------- qué código pide cada ruta */
/*
 * El navegador descubre el código de una SPA en fila india: lee el HTML, pide
 * index.js, y solo cuando termina de leerlo se entera de que necesita el trozo
 * de la página; al leer ese, del trozo común. Con la red de un móvil eso son
 * tres esperas seguidas antes de pintar nada, y es justo lo que PageSpeed
 * llama «árbol de dependencia de red».
 *
 * Aquí se rompe esa fila: como cada ruta ya tiene su propio HTML, se declara
 * en su cabecera —con modulepreload— exactamente qué trozos va a pedir. El
 * navegador los descarga los tres a la vez, desde la primera línea del
 * documento. No cambia nada de lo que se ejecuta: solo cuándo se pide.
 *
 * La lista sale del manifiesto que escribe Vite al compilar, no de una tabla a
 * mano: los nombres llevan hash y cambian en cada compilación.
 */
const manifiesto = JSON.parse(read('dist/.vite/manifest.json'));

/*
 * La hoja de estilos, incrustada en vez de enlazada.
 *
 * Un <link rel="stylesheet"> bloquea el pintado: el navegador no dibuja nada
 * hasta que ese archivo llega, y no puede ni pedirlo hasta haber leído el HTML.
 * Es un viaje de ida y vuelta entero antes del primer píxel, y es lo que
 * PageSpeed cuenta como «solicitudes que bloquean el renderizado».
 *
 * Son 20 KB, unos 5 comprimidos: cabe dentro del propio documento sin
 * engordarlo de forma apreciable, y así llega con él. El archivo sigue
 * existiendo en dist/ porque index.html —el que se sirve cuando una ruta no
 * tiene cabecera propia— lo sigue enlazando.
 */
const cssEntrada = manifiesto['index.html'].css?.[0];
const cssEnLinea = cssEntrada ? read(`dist/${cssEntrada}`) : '';

/* nombre del componente → archivo fuente, leído de las líneas
   `const Home = lazy(() => import('./pages/Home.jsx'))` de routes.jsx */
const fuentePorComponente = Object.fromEntries(
  [...read('src/routes.jsx').matchAll(/const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\('\.\/([^']+)'\)/g)]
    .map((m) => [m[1], `src/${m[2]}`]),
);

/* patrón de ruta → archivo fuente de su página */
const fuentePorPatron = Object.fromEntries(
  [...read('src/routes.jsx').matchAll(/\{\s*path:\s*'([^']+)',\s*element:\s*<(\w+)[^>]*\/>/g)]
    .map(([, ruta, comp]) => [ruta, fuentePorComponente[comp]])
    .filter(([, fuente]) => fuente),
);

/** El patrón que atiende una URL concreta: primero el literal, luego el que
    tiene parámetro. `/es/soluciones/x` lo sirve `/es/soluciones/:slug`. */
function patronDe(path) {
  if (fuentePorPatron[path]) return path;
  const partes = path.split('/');
  return Object.keys(fuentePorPatron).find((patron) => {
    const suyas = patron.split('/');
    return suyas.length === partes.length
      && suyas.every((p, i) => p.startsWith(':') || p === partes[i]);
  });
}

/** Todos los trozos que hacen falta para pintar esa ruta, sin repetir. */
function trozosDe(path) {
  const fuente = fuentePorPatron[patronDe(path) ?? ''];
  const vistos = new Set();
  const salida = [];
  const recorrer = (clave) => {
    /* index.html es el punto de entrada: ya va como <script> en la cabecera. */
    if (!clave || clave === 'index.html' || vistos.has(clave)) return;
    vistos.add(clave);
    const entrada = manifiesto[clave];
    if (!entrada) return;
    salida.push(entrada.file);
    (entrada.imports || []).forEach(recorrer);
  };
  recorrer(fuente);
  return salida;
}
const escapa = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');


/* ---------------------------------------- cuerpo prerenderizado del artículo */

/**
 * Convierte los bloques de un artículo en HTML estático.
 *
 * ---- Por qué esto es lo que más importa de todo el archivo ----
 *
 * El sitio es una SPA: hasta ahora, el HTML que salía por cada URL llevaba la
 * cabecera correcta y el cuerpo VACÍO. El texto lo montaba React en el
 * navegador.
 *
 * Para Google eso es tolerable, porque ejecuta JavaScript. Para los
 * rastreadores de los asistentes —GPTBot, ClaudeBot, PerplexityBot,
 * OAI-SearchBot— no lo es: no ejecutan JavaScript. Leían el título y la
 * descripción de un artículo y ni una línea del argumento. Es decir: el sitio
 * estaba optimizado para que lo citaran, y lo único que un asistente no podía
 * hacer era leerlo.
 *
 * Prerenderizar el sitio entero exigiría un navegador en el despliegue. Los
 * artículos no: sus bloques ya son datos con un vocabulario cerrado, así que
 * se convierten a HTML aquí, sin dependencias y sin navegador.
 *
 * Va dentro de #root. React lo sustituye al montar, y el contenido que sirve el
 * servidor es exactamente el mismo que acaba viendo la persona: no hay dos
 * versiones, que es lo que un buscador penaliza.
 */
function cuerpoDeArticulo(a, lang) {
  const t = a[lang];
  if (!t) return '';
  const e = escapa;
  const p = [];

  p.push(`<h1>${e(t.titulo)}</h1>`);
  if (t.entradilla) p.push(`<p>${e(t.entradilla)}</p>`);
  p.push(`<p>${e(a.autor)} · <time datetime="${e(a.fecha)}">${e(a.fecha)}</time></p>`);

  for (const b of t.bloques || []) {
    const items = b.items || [];
    switch (b.tipo) {
      case 'entradilla':
      case 'parrafo':
      case 'destacado':
        p.push(`<p>${e(b.texto)}</p>`); break;
      case 'subtitulo':
        if (b.antetitulo) p.push(`<p>${e(b.antetitulo)}</p>`);
        p.push(`<h2>${e(b.texto)}</h2>`); break;
      case 'cita':
        p.push(`<blockquote><p>${e(b.texto)}</p>${b.fuente ? `<cite>${e(b.fuente)}</cite>` : ''}</blockquote>`); break;
      case 'lista':
        p.push(`<ul>${items.map((i) => `<li>${e(i)}</li>`).join('')}</ul>`); break;
      case 'indice':
        p.push(`<dl>${items.map((i) => `<dt>${e(i.termino)}</dt><dd>${e(i.definicion)}</dd>`).join('')}</dl>`); break;
      case 'tarjetas':
        p.push(items.map((i) => `<section><h3>${e(i.titulo)}</h3><p>${e(i.texto)}</p></section>`).join('')); break;
      case 'imagen': {
        const c = CATALOGO.find((x) => x.src === b.src);
        if (!c) break;
        /* Sin lazy: el rastreador no hace scroll, y el atributo no le estorba.
           Lo que sí necesita es el alt, que es lo único que le dice qué hay. */
        p.push(`<figure><img src="${e(c.src)}" alt="${e(c.alt[lang] || c.alt.es)}" />${
          b.pie ? `<figcaption>${e(b.pie)}</figcaption>` : ''}</figure>`);
        break;
      }
      case 'faq':
        p.push(`<section><h2>${e(b.antetitulo || (lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'))}</h2>${
          items.map((i) => `<h3>${e(i.pregunta)}</h3><p>${e(i.respuesta)}</p>`).join('')}</section>`);
        break;
      case 'cta':
        p.push(`<p><a href="${e(b.destino)}">${e(b.texto || '')}</a></p>`); break;
      default: break;
    }
  }
  return `<article>${p.join('')}</article>`;
}

/** Sustituye la cabecera entera de la plantilla por la de esta ruta. */
function documentoPara(path, meta) {
  const url = SITE + path;
  const lang = meta.lang;
  const altPath = meta.alt;
  const esEs = lang === 'es';

  /* Los trozos de código de esta ruta, pedidos desde la cabecera en paralelo
     en vez de descubiertos uno tras otro. */
  const precarga = trozosDe(path)
    .map((f) => `    <link rel="modulepreload" crossorigin fetchpriority="low" href="/${f}" />`)
    .join('\n');

  /* Un artículo enseña su tarjeta al compartirse; el resto del sitio, la
     imagen general. */
  const art0 = porUrl[path];
  const imagenOg = art0 ? imagenDe(art0.a, art0.lang) : OG_IMAGE;

  const jsonLd = datosEstructurados(path, meta)
    .map((d) => `    <script type="application/ld+json">${JSON.stringify(d)}</script>`)
    .join('\n');

  const cabeza = `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/logo/favicon.svg" />

    <title>${escapa(meta.title)}</title>
    <meta name="description" content="${escapa(meta.description)}" />
    <link rel="canonical" href="${url}" />

    <!-- Las dos versiones de idioma son la misma página, no dos que compiten -->
    <link rel="alternate" hreflang="${esEs ? 'es' : 'en'}" href="${url}" />
    <link rel="alternate" hreflang="${esEs ? 'en' : 'es'}" href="${SITE}${altPath}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${esEs ? path : altPath}" />

    <meta property="og:type" content="${meta.tipoOg || 'website'}" />
    <meta property="og:site_name" content="${BRAND}" />
    <meta property="og:locale" content="${esEs ? 'es_ES' : 'en_US'}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapa(meta.title)}" />
    <meta property="og:description" content="${escapa(meta.description)}" />
    <meta property="og:image" content="${imagenOg}" />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapa(meta.title)}" />
    <meta name="twitter:description" content="${escapa(meta.description)}" />
    <meta name="twitter:image" content="${imagenOg}" />

    <meta name="theme-color" content="#05070f" />
${jsonLd}
`;

  /* Solo los artículos. El resto de páginas necesitarían un navegador para
     prerenderizarse, y su contenido no es lo que se busca que citen. */
  const art = porUrl[path];
  const cuerpo = art ? cuerpoDeArticulo(art.a, art.lang) : '';

  return plantilla
    .replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`)
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<head>[\s\S]*?<\/head>/, `<head>${cabeza}${analitica}${
      /* Lo que Vite inyectó (css y js con hash) se conserva tal cual.
         Se filtra por líneas, así que un <script> en línea de varias líneas
         llegaría partido: por eso la etiqueta de Google se extrae aparte, en
         bloque, y no depende de este filtro. */
      (plantilla.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '')
        /* El bloque de Google se quita ENTERO antes de filtrar, no línea a
           línea. Filtrando por «<script», de sus treinta líneas sobrevivía la
           que dice exactamente `<script>`: una etiqueta abierta y sin cerrar
           que se tragaba el resto de la cabecera. La página quedaba rota y en
           silencio —el build no falla, y solo se notó porque el prerenderizado
           empezó a sacar 0 caracteres de las 68—. */
        .replace(/<!-- ga -->[\s\S]*?<!-- \/ga -->/, '')
        .split('\n')
        .filter((l) => /<script|<link rel="modulepreload"/.test(l))
        .join('\n')
    }\n${precarga}\n    <style>${cssEnLinea}</style>\n  </head>`);
}

let escritos = 0;
const sinMeta = [];
const sinTrozos = [];
for (const path of paths) {
  const fija = PAGES[path];
  const meta = fija
    ? { title: fija[0], description: fija[1], alt: fija[2], lang: langOf(path) }
    : dinamicas[path] && { ...dinamicas[path], lang: langOf(path) };

  if (!meta) { sinMeta.push(path); continue; }
  if (!trozosDe(path).length) sinTrozos.push(path);

  const destino = join(ROOT, 'dist/_pages', `${path}.html`);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, documentoPara(path, meta));
  escritos += 1;
}

/* Una ruta sin metadatos se serviría con el título de otra página. Es un fallo
   de mantenimiento —alguien añadió una ruta y no su título— y tiene que
   detener la compilación, no colarse en producción en silencio. */
/* Una ruta sin trozos declarados sigue funcionando —el navegador los descubre
   sola, como antes— pero pierde la mejora y nadie se entera. Casi siempre
   significa que routes.jsx cambió de forma y el patrón dejó de reconocerse. */
if (sinTrozos.length) {
  console.error(`seo: no se pudo resolver qué código carga estas rutas; revisa el formato de src/routes.jsx:\n  ${sinTrozos.join('\n  ')}`);
  process.exit(1);
}

if (sinMeta.length) {
  console.error(`seo: faltan título y descripción para estas rutas en src/seo-meta.js:\n  ${sinMeta.join('\n  ')}`);
  process.exit(1);
}

/* ------------------------------------------------------------- sitemap */

const priority = (p) => {
  if (p === '/es' || p === '/en') return '1.0';
  const depth = p.split('/').filter(Boolean).length;
  return depth <= 2 ? '0.8' : depth === 3 ? '0.6' : '0.5';
};

const today = new Date().toISOString().slice(0, 10);

const urls = paths.map((p) => {
  const meta = PAGES[p] ? { alt: PAGES[p][2] } : dinamicas[p];
  const lang = langOf(p);
  const alternos = [
    `      <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}${p}"/>`,
    `      <xhtml:link rel="alternate" hreflang="${lang === 'es' ? 'en' : 'es'}" href="${SITE}${meta.alt}"/>`,
  ].join('\n');
  return `  <url>
    <loc>${SITE}${p}</loc>
${alternos}
    <lastmod>${meta.lastmod || today}</lastmod>
    <priority>${priority(p)}</priority>
  </url>`;
}).join('\n');

writeFileSync(join(ROOT, 'dist/sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`);

/* ------------------------------------------------------------- llms.txt */
/*
 * El equivalente de robots.txt para los asistentes de IA: un índice en texto
 * plano de qué es el sitio y dónde está cada cosa, para que un modelo que
 * responde por alguien no tenga que deducirlo del HTML. Es la convención que
 * PageSpeed audita bajo «navegación agéntica».
 *
 * Se genera de la misma tabla que el sitemap: escrito a mano, se quedaría
 * desfasado en cuanto alguien añadiera una página.
 */
const titulo = (p) => (PAGES[p] ? PAGES[p][0] : dinamicas[p]?.title || p);
const resumen = (p) => (PAGES[p] ? PAGES[p][1] : dinamicas[p]?.description || '');

const enlaces = (rutas) => rutas
  .map((p) => `- [${titulo(p)}](${SITE}${p}): ${resumen(p)}`)
  .join('\n');

const es = paths.filter((p) => langOf(p) === 'es');
const en = paths.filter((p) => langOf(p) === 'en');
const principales = (rutas) => rutas.filter((p) => p.split('/').filter(Boolean).length <= 2);
const resto = (rutas) => rutas.filter((p) => p.split('/').filter(Boolean).length > 2 && !porUrl[p]);

/* Los artículos van en su propia sección y no mezclados en «Detalle». Un
   asistente que busca una opinión sobre un tema necesita distinguir entre una
   página de servicio y un artículo con una tesis; en una lista plana no puede.
   Si todavía no hay ninguno publicado, la sección no aparece: un encabezado
   vacío es peor que ninguno. */
const seccionArticulos = () => {
  const rutas = Object.keys(porUrl).sort();
  if (!rutas.length) return '';
  return `## Insights

Artículos con una tesis propia. Cada uno existe en español e inglés bajo su
propia dirección; la fecha indica cuándo se publicó.

${rutas.map((p) => `- [${titulo(p)}](${SITE}${p}) — ${porUrl[p].a.fecha}: ${resumen(p)}`).join('\n')}

`;
};

writeFileSync(join(ROOT, 'dist/llms.txt'),
`# ${BRAND}

> ${ORG.description}

El sitio está en español e inglés. Cada página tiene su equivalente en el otro
idioma bajo el prefijo /es o /en; son la misma página, no dos contenidos
distintos. Contacto: hello@meetbecome.com

## Español

${enlaces(principales(es))}

## English

${enlaces(principales(en))}

${seccionArticulos()}## Detalle

${enlaces(resto(es))}
${enlaces(resto(en))}

## Optional

La sección se llama «Optional» en inglés a propósito: es un nombre con
significado dentro de la convención —marca lo que se puede omitir cuando hay
poco espacio de contexto—, no una traducción olvidada.

- [Mapa del sitio](${SITE}/sitemap.xml): las ${paths.length} URLs del sitio con sus equivalencias de idioma.
- [robots.txt](${SITE}/robots.txt): qué se puede rastrear.
`);

/* La auditoría pide dos cosas concretas: un encabezado H1 y al menos un
   enlace. Comprobarlo aquí cuesta tres líneas y evita publicar un archivo que
   no cumple sin que nadie se entere hasta la siguiente auditoría. */
const llms = read('dist/llms.txt');
if (!/^# \S/m.test(llms) || !/\]\(https?:\/\//.test(llms)) {
  console.error('seo: llms.txt tiene que empezar por un título «# …» y contener enlaces.');
  process.exit(1);
}

writeFileSync(join(ROOT, 'dist/robots.txt'),
`User-agent: *
Allow: /

# Las cabeceras por ruta. El servidor las sirve bajo la URL real, así que no
# hay nada que rastrear aquí dentro; cada una lleva su canonical de todos modos.
Disallow: /_pages/

# El panel de artículos. No lleva contenido y exige un token para hacer nada,
# pero tampoco tiene por qué aparecer en un buscador.
Disallow: /admin

Sitemap: ${SITE}/sitemap.xml
`);

/* El manifiesto era para esto y ya cumplió: describe la estructura interna del
   proyecto y no tiene por qué acabar publicado en el servidor. */
rmSync(join(ROOT, 'dist/.vite'), { recursive: true, force: true });

console.log(`seo: ${escritos} páginas con cabecera propia · ${paths.length} URLs en el sitemap`);
