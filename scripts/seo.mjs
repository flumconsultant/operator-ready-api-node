/**
 * Genera sitemap.xml y robots.txt dentro de dist/, después de compilar.
 *
 * Se generan y no se escriben a mano por un motivo concreto: un sitemap escrito
 * a mano deja de ser cierto en cuanto alguien añade una página, y un sitemap que
 * miente es peor que no tenerlo — le da a Google URLs que no existen y le
 * esconde las que sí. Aquí las rutas salen del mismo sitio del que salen los
 * enlaces del menú, así que las dos cosas no pueden separarse.
 *
 * Las rutas con parámetro (:slug) se expanden con los slugs reales del
 * contenido. Lo que no aparece: las redirecciones heredadas —no son páginas— y
 * el comodín.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://meetbecome.com';

const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/* Las rutas estáticas salen de routes.jsx leyéndolo como texto: importarlo
   exigiría un runtime capaz de resolver JSX, y el archivo es una lista plana. */
const routesSrc = read('src/routes.jsx');
const staticPaths = [...routesSrc.matchAll(/\{\s*path:\s*'([^']+)'/g)]
  .map((m) => m[1])
  .filter((p) => p !== '*' && !p.includes(':'));

/* Los dos parámetros del sitio, con sus slugs */
const programSlugs = [...read('src/content/become-now.js').matchAll(/^\s{2}'([a-z0-9-]+)':\s*\{/gm)].map((m) => m[1]);
const useCaseSlugs = [...read('src/site.js').matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]);

const paths = [
  ...staticPaths,
  ...programSlugs.map((s) => `/es/servicios/become-now/${s}`),
  ...useCaseSlugs.map((s) => `/es/casos-de-uso/${s}`),
];

/* Prioridad por profundidad: la home manda, las páginas de servicio van
   después, y las fichas de programa al final. No es una métrica exacta —Google
   la trata como una pista— pero comunica la estructura. */
const priority = (p) => {
  if (p === '/es') return '1.0';
  const depth = p.split('/').filter(Boolean).length;
  return depth <= 2 ? '0.8' : depth === 3 ? '0.6' : '0.5';
};

const today = new Date().toISOString().slice(0, 10);

const urls = [...new Set(paths)].sort().map((p) => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority(p)}</priority>
  </url>`).join('\n');

writeFileSync(join(ROOT, 'dist/sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

writeFileSync(join(ROOT, 'dist/robots.txt'),
`User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`seo: ${[...new Set(paths)].length} URLs en el sitemap`);
