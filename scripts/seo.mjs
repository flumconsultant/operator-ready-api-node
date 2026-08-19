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
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const { SITE, BRAND, OG_IMAGE, PAGES, langOf } = await import('../src/seo-meta.js');
const esNow = await import('../src/content/become-now.js');
const enNow = await import('../src/content/become-now.en.js');
const esCasos = await import('../src/content/use-cases.js');
const enCasos = await import('../src/content/use-cases.en.js');

/* Las rutas fijas salen de routes.jsx leído como texto: importarlo exigiría un
   runtime capaz de resolver JSX, y el archivo es una lista plana. */
const staticPaths = [...read('src/routes.jsx').matchAll(/\{\s*path:\s*'([^']+)'/g)]
  .map((m) => m[1])
  .filter((p) => p !== '*' && !p.includes(':'));

/* ------------------------------------------------- rutas con parámetro */

const recorta = (s, max) => {
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).replace(/[\s,;:.]+$/, '')}…`;
};

const dinamicas = {};

for (const [slug, p] of Object.entries(esNow.PROGRAMS)) {
  dinamicas[`/es/servicios/become-now/${slug}`] = {
    title: recorta(`${p.menu} — BECOME NOW™`, 60),
    description: recorta(p.body, 155),
    alt: `/en/services/become-now/${slug}`,
  };
}
for (const [slug, p] of Object.entries(enNow.PROGRAMS)) {
  dinamicas[`/en/services/become-now/${slug}`] = {
    title: recorta(`${p.menu} — BECOME NOW™`, 60),
    description: recorta(p.body, 155),
    alt: `/es/servicios/become-now/${slug}`,
  };
}
for (const [slug, c] of Object.entries(esCasos.USE_CASE_CONTENT)) {
  dinamicas[`/es/casos-de-uso/${slug}`] = {
    title: recorta(`${c.q.replace(/^¿|\?$/g, '')} | ${BRAND}`, 60),
    description: recorta(c.answer, 155),
    alt: `/en/use-cases/${slug}`,
  };
}
for (const [slug, c] of Object.entries(enCasos.USE_CASE_CONTENT)) {
  dinamicas[`/en/use-cases/${slug}`] = {
    title: recorta(`${c.q.replace(/\?$/, '')} | ${BRAND}`, 60),
    description: recorta(c.answer, 155),
    alt: `/es/casos-de-uso/${slug}`,
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

function datosEstructurados(path, meta) {
  const url = SITE + path;
  if (path === '/es' || path === '/en') {
    return [ORG, { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE }];
  }
  if (path === '/es/servicios/become-now') return [faqPage(esNow.FAQ)];
  if (path === '/en/services/become-now') return [faqPage(enNow.FAQ)];
  if (/^\/(es\/servicios|en\/services)\/(transformation-discovery|build-and-embed)$/.test(path)) {
    return [servicio(meta.title.split('|')[0].trim(), meta.description, url)];
  }
  return [];
}

/* --------------------------------------------------------- el HTML por ruta */

const plantilla = read('dist/index.html');

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
    tiene parámetro. `/es/casos-de-uso/x` lo sirve `/es/casos-de-uso/:slug`. */
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

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${BRAND}" />
    <meta property="og:locale" content="${esEs ? 'es_ES' : 'en_US'}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapa(meta.title)}" />
    <meta property="og:description" content="${escapa(meta.description)}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="900" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapa(meta.title)}" />
    <meta name="twitter:description" content="${escapa(meta.description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <meta name="theme-color" content="#05070f" />
${jsonLd}
`;

  return plantilla
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<head>[\s\S]*?<\/head>/, `<head>${cabeza}${
      /* Lo que Vite inyectó (css y js con hash) se conserva tal cual */
      (plantilla.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '')
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
    <lastmod>${today}</lastmod>
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
const resto = (rutas) => rutas.filter((p) => p.split('/').filter(Boolean).length > 2);

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

## Detalle

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

Sitemap: ${SITE}/sitemap.xml
`);

/* ------------------------------------------- caché de lo que lleva hash */
/*
 * Todo lo que Vite emite en assets/ lleva un hash del contenido en el nombre:
 * bundles, hoja de estilos, tipografías y el logotipo. Cambiar cualquiera de
 * esos archivos cambia su nombre, así que la versión vieja nunca se sirve por
 * error y la nueva no espera a que caduque nada.
 *
 * Eso es justo lo que faltaba. El logotipo vivía en una ruta fija con una
 * semana de caché: al reducirlo de 57 KB a 25, el archivo nuevo estaba en el
 * servidor pero durante días se siguió sirviendo el viejo, y la auditoría lo
 * seguía viendo de 1920 px. Con hash, el problema no puede repetirse.
 *
 * Un .htaccess dentro de la carpeta se aplica solo a ella, que es la forma de
 * decir «un año» por ubicación y no por extensión: fuera de assets/ hay
 * archivos con el mismo tipo que sí conservan su nombre entre versiones.
 */
writeFileSync(join(ROOT, 'dist/assets/.htaccess'),
`# Generado por scripts/seo.mjs. Todo lo de esta carpeta lleva un hash del
# contenido en el nombre, así que puede cachearse un año sin revalidar: si el
# archivo cambia, cambia su nombre y el navegador pide una URL distinta.
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 year"
</IfModule>
<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`);

/* El manifiesto era para esto y ya cumplió: describe la estructura interna del
   proyecto y no tiene por qué acabar publicado en el servidor. */
rmSync(join(ROOT, 'dist/.vite'), { recursive: true, force: true });

console.log(`seo: ${escritos} páginas con cabecera propia · ${paths.length} URLs en el sitemap`);
