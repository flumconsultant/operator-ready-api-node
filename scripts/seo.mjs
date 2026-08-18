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
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
const escapa = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Sustituye la cabecera entera de la plantilla por la de esta ruta. */
function documentoPara(path, meta) {
  const url = SITE + path;
  const lang = meta.lang;
  const altPath = meta.alt;
  const esEs = lang === 'es';

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
        .filter((l) => /<script|<link rel="stylesheet"|<link rel="modulepreload"/.test(l))
        .join('\n')
    }\n  </head>`);
}

let escritos = 0;
const sinMeta = [];
for (const path of paths) {
  const fija = PAGES[path];
  const meta = fija
    ? { title: fija[0], description: fija[1], alt: fija[2], lang: langOf(path) }
    : dinamicas[path] && { ...dinamicas[path], lang: langOf(path) };

  if (!meta) { sinMeta.push(path); continue; }

  const destino = join(ROOT, 'dist/_pages', `${path}.html`);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, documentoPara(path, meta));
  escritos += 1;
}

/* Una ruta sin metadatos se serviría con el título de otra página. Es un fallo
   de mantenimiento —alguien añadió una ruta y no su título— y tiene que
   detener la compilación, no colarse en producción en silencio. */
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

writeFileSync(join(ROOT, 'dist/robots.txt'),
`User-agent: *
Allow: /

# Las cabeceras por ruta. El servidor las sirve bajo la URL real, así que no
# hay nada que rastrear aquí dentro; cada una lleva su canonical de todos modos.
Disallow: /_pages/

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`seo: ${escritos} páginas con cabecera propia · ${paths.length} URLs en el sitemap`);
