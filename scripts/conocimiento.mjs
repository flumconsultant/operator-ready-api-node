/**
 * Compila lo que un agente necesita saber para hablar por BECOME.
 *
 * ---- Por qué se compila y no se escribe ----
 *
 * La tentación es escribir un documento grande con todo dentro. Duraría un mes:
 * el día que cambie el titular de minería habría que acordarse de cambiarlo
 * también ahí, y nadie se acuerda. A partir de ese día el agente diría una cosa
 * y la web otra, y nadie lo notaría hasta que un cliente pregunta.
 *
 * Así que hay una sola fuente por hecho. Lo que ya vive en el repositorio
 * —industrias, servicios, método, programas, páginas— se lee de donde está. Lo
 * que solo puede escribir una persona —quién es BECOME, qué no hace, qué
 * responde ante una objeción— vive en conocimiento/ y no está en ningún otro
 * sitio. Este script junta las dos mitades y produce el corpus.
 *
 * ---- Y por qué también es un guardián ----
 *
 * El conocimiento se rellena poco a poco, así que sus huecos son normales. Lo
 * que no es normal es olvidarlos. Cada ejecución dice cuántos campos siguen
 * vacíos y cuáles, igual que el catálogo dice qué conector no tiene centinela:
 * deuda conocida en vez de deuda olvidada.
 *
 * No falla por estar incompleto —eso pararía el despliegue por algo que solo
 * puede arreglar una persona escribiendo— pero sí falla si un documento
 * declarado desaparece o deja de ser legible.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PROPIO = 'src/content/conocimiento';
const SALIDA = 'dist/conocimiento.json';

const leer = (f) => JSON.parse(readFileSync(f, 'utf8'));
const vacio = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

/* ---- La mitad que escribe una persona ------------------------------------ */
if (!existsSync(PROPIO)) {
  console.error(`::error::No existe ${PROPIO}. El conocimiento propio es la mitad que ningún script puede generar.`);
  process.exit(1);
}

const documentos = [];
const huecos = [];
for (const f of readdirSync(PROPIO).filter((x) => x.endsWith('.json')).sort()) {
  let d;
  try { d = leer(join(PROPIO, f)); }
  catch (e) {
    console.error(`::error::${f} no es JSON válido: ${e.message}`);
    process.exit(1);
  }
  if (!d.id || !Array.isArray(d.campos)) {
    console.error(`::error::${f} no declara id o campos.`);
    process.exit(1);
  }
  const relleno = {};
  for (const c of d.campos) {
    if (vacio(c.valor)) huecos.push(`${d.titulo} · ${c.rotulo}`);
    else relleno[c.id] = c.valor;
  }
  documentos.push({ id: d.id, titulo: d.titulo, pregunta: d.pregunta, contenido: relleno });
}

/* ---- La mitad que ya vive en el repositorio ------------------------------ */
const desde = (ruta, transformar) => {
  if (!existsSync(ruta)) return null;
  try { return transformar(leer(ruta)); } catch { return null; }
};

const industrias = desde('src/content/industrias.json', (d) =>
  d.map((i) => ({
    slug: i.slug, servicio: i.servicio,
    es: { nombre: i.es.nombre, resumen: i.es.lead, oportunidades: i.es.oportunidades, metricas: i.es.metricas },
    en: { nombre: i.en.nombre, resumen: i.en.lead, oportunidades: i.en.oportunidades, metricas: i.en.metricas },
  })));

const casos = desde('src/content/soluciones.json', (d) =>
  Object.entries(d.SOLUCION_CONTENIDO).map(([slug, s]) => ({
    slug, pregunta: s.q, respuesta: s.answer, resultado: s.result, servicios: s.engagement,
  })));

const metodo = desde('src/content/como-transformamos.json', (d) => ({
  tesis: d.CT.es.tesis, sistemas: d.CT.es.SISTEMAS, principios: d.CT.es.PRINCIPIOS,
}));

const programas = desde('src/content/become-now-programas.json', (d) =>
  Object.entries(d.COPY_PROGRAMAS).map(([slug, p]) => ({
    slug, titulo: p.es?.h1, resumen: p.es?.lead, entregables: p.es?.entregables,
  })));

const articulos = existsSync('src/content/insights')
  ? readdirSync('src/content/insights').filter((f) => f.endsWith('.json'))
      .map((f) => leer(join('src/content/insights', f)))
      .filter((a) => a.estado === 'publicado')
      .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
      .map((a) => ({ fecha: a.fecha, pilar: a.pilar, titulo: a.es?.titulo, tesis: a.es?.descripcion,
                     url: `https://meetbecome.com/es/insights/${a.es?.slug}` }))
  : [];

const corpus = {
  generado: 'scripts/conocimiento.mjs',
  aviso: 'No se edita a mano. El conocimiento propio se edita en /admin; el resto vive en su archivo de siempre.',
  propio: documentos,
  sitio: { industrias, casos, metodo, programas, articulos },
};

mkdirSync('dist', { recursive: true });
writeFileSync(SALIDA, `${JSON.stringify(corpus, null, 2)}\n`);

/* ---- Veredicto ----------------------------------------------------------- */
const palabras = JSON.stringify(corpus).split(/\s+/).length;
const declarados = documentos.reduce((a, d) => a + Object.keys(d.contenido).length, 0) + huecos.length;

console.log(`Corpus escrito en ${SALIDA} · ~${palabras.toLocaleString('es')} palabras`);
console.log(`  propio: ${documentos.length} documentos · ${declarados - huecos.length}/${declarados} campos escritos`);
console.log(`  del sitio: ${industrias?.length ?? 0} industrias · ${casos?.length ?? 0} casos · ${programas?.length ?? 0} programas · ${articulos.length} artículos`);

if (huecos.length) {
  console.log('');
  console.log(`::warning::Quedan ${huecos.length} campos de conocimiento sin escribir. Un agente que no los tenga improvisará justo ahí.`);
  for (const h of huecos) console.log(`   · ${h}`);
}
