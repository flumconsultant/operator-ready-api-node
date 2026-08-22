/**
 * QA de lenguaje del castellano: palabras raras, anglicismos e híbridos.
 *
 * La versión en español tiene que sonar natural para un ejecutivo de Perú o
 * LATAM. Este guardián no persigue el inglés —hay términos que traducidos
 * pierden precisión— sino tres cosas concretas:
 *
 *   · Palabras que suenan de otro país. «Faena» es lenguaje minero chileno;
 *     en Perú se dice operación, mina o planta. «Acción en terreno», igual.
 *   · Anglicismos accidentales en el cuerpo: workflows, agents, spreadsheets,
 *     engagement. No son decisiones de marca, son restos de traducción.
 *   · Nombres híbridos: «Travel y Hospitality», «Healthcare y Life Sciences».
 *     Media lengua en el nombre de una industria es lo que más barato delata
 *     que el texto se tradujo en vez de escribirse.
 *
 * ---- Por qué mira el HTML servido y no el código ----
 *
 * Porque lo que importa es lo que lee una persona. Un comentario de código
 * puede decir «healthcare y life sciences» sin que nadie lo vea nunca, y una
 * búsqueda sobre el repositorio marcaría ese falso positivo como si fuera un
 * fallo. Se revisa dist/_pages/es, que es exactamente lo que se publica.
 *
 * Cada regla lleva su reemplazo, para que el aviso diga qué hacer y no solo
 * que algo está mal.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'dist/_pages/es';
const HOME = 'dist/_pages/es.html';

/* P0: cero tolerancia. Cada entrada es [expresión, con qué se sustituye]. */
const P0 = [
  [/\bfaenas?\b/gi, 'operación minera / mina / planta'],
  [/acci[oó]n en terreno/gi, 'acción operativa'],
  [/\breclamaciones\b/gi, 'reclamos'],
  [/\bimplantaci[oó]n\b/gi, 'implementación'],
  [/Travel y Hospitality/gi, 'Turismo y hotelería'],
  [/Real Estate y Construcci[oó]n/gi, 'Inmobiliario y construcción'],
  [/Healthcare y Life Sciences/gi, 'Salud y farmacéutica'],
  [/empresa de life sciences/gi, 'empresa de salud o farmacéutica'],
  [/\d+\s+preguntas\b/gi, 'quitar el conteo de preguntas'],
  [/sin presentaci[oó]n comercial/gi, 'quitar la frase defensiva'],
  [/Treinta minutos con Carlos/gi, '30 minutos con el equipo BECOME'],
];

/* Anglicismos que en el cuerpo español deben ir traducidos. Se buscan como
   palabra suelta para no marcar «AI agents» dentro de un nombre propio ni
   «workflow» dentro de una URL. */
const ANGLICISMOS = [
  [/\bworkflows?\b/gi, 'procesos / flujos de trabajo'],
  /* En minúscula es un anglicismo; en mayúscula es el nombre de uno de los
     cinco sistemas —Agents, inside— y eso es naming de marca. */
  [/\bagents\b/g, 'agentes de IA'],
  [/\bcopilots\b/gi, 'copilotos'],
  [/\bspreadsheets\b/gi, 'hojas de cálculo'],
  [/\bdata sources\b/gi, 'fuentes de datos'],
  [/\bresponsible use\b/gi, 'uso responsable'],
  [/\bhuman review\b/gi, 'revisión humana'],
  [/\bprototypes\b/gi, 'prototipos'],
  [/\bdecision system\b/gi, 'sistema de decisión asistida'],
  [/\bexception paths\b/gi, 'rutas de excepción'],
  [/\bautonomy boundaries\b/gi, 'límites de autonomía'],
  [/\bquality criteria\b/gi, 'criterios de calidad'],
  [/\bengagements?\b/gi, 'proyecto / intervención'],
  [/\baccountable lead\b/gi, 'responsable principal'],
  [/\bclient team\b/gi, 'equipo del cliente'],
  [/\boutputs?\b/gi, 'entregable / resultado'],
  [/\bfeasibility\b/gi, 'viabilidad'],
  [/\bexperiences\b/gi, 'experiencias'],
  [/\bproducts\b/g, 'productos'],
  [/\badoption\b/gi, 'adopción'],
  [/\bgovernance\b/gi, 'gobierno / gobernanza'],
  [/\baccountability\b/gi, 'responsabilidad'],
  [/\bskills\b/g, 'capacidades'],
  [/\benterprise search\b/gi, 'búsqueda empresarial'],
  [/\bfoundation models\b/gi, 'modelos fundacionales'],
  [/\bguardrails\b/gi, 'controles'],
  [/\brunbooks?\b/gi, 'manual de operación'],
];

/* Lo que se queda en inglés a propósito: naming de marca y terminología que
   traducida pierde precisión o directamente no se usa traducida. Si una de
   estas aparece dentro de una coincidencia, la coincidencia no cuenta. */
const DELIBERADOS = [
  'AI-native', 'BECOME NOW', 'BECOME DISCOVER', 'BECOME EMBED',
  'LLM', 'RAG', 'API', 'MCP', 'KYC', 'AML', 'BIM', 'RFI',
  'human-in-the-loop', 'revenue management', 'marketplace',
  'sell-in', 'sell-out', 'e-commerce', 'business first',
  'Learn today', 'Build capability', 'Strategy that builds',
  'Value, made visible', 'Build with, not for', 'Business first',
  'Adoption by design', 'Governance from the start', 'Ownership stays inside',
  'inside.', 'Decision intelligence', 'Knowledge intelligence',
  'AI Governance',
  'Governance Blueprint',
  'Workflow Redesign',
  'Inside Readiness Index',
  'Scale Readiness Gate',
  'Embed Scorecard',
  'Adoption Scorecard',
  'Applied Workflow Canvas',
  'Agentic Workflow Blueprint',
  /* La pila técnica de «Bajo el capó». Son las capas de una arquitectura, y
     estos nombres no tienen equivalente asentado en castellano de ingeniería:
     quien decide sobre esto los lee así en su propia documentación. */
  'model routing', 'tool calling', 'workflow orchestration',
  'Guardrails', 'Enterprise data', 'vector search', 'knowledge sources',
];

/* ---- El texto visible de una página, sin etiquetas ---------------------- */
const visible = (archivo) => {
  const s = readFileSync(archivo, 'utf8');
  const i = s.indexOf('<div id="root">');
  if (i < 0) return '';
  const cuerpo = s.slice(i, s.indexOf('</div></body>', i));
  return cuerpo
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
};

const paginas = [];
const recorrer = (dir) => {
  for (const f of readdirSync(dir)) {
    const ruta = join(dir, f);
    if (statSync(ruta).isDirectory()) recorrer(ruta);
    else if (f.endsWith('.html')) paginas.push(ruta);
  }
};
if (existsSync(RAIZ)) recorrer(RAIZ);
if (existsSync(HOME)) paginas.push(HOME);

if (!paginas.length) {
  console.error('::error::No hay páginas en español que revisar. ¿Se compiló el sitio antes de este paso?');
  process.exit(1);
}

/* ---- La revisión -------------------------------------------------------- */
const hallazgos = [];

/* Dónde empieza y acaba cada término deliberado dentro de este texto.
 *
 * Antes esto miraba si un término deliberado aparecía CERCA —sesenta caracteres
 * a cada lado— y en ese caso callaba. Parecía razonable y era un colador: en la
 * portada, «BECOME conecta estrategia, personas, datos, LLMs, agents, productos
 * y workflows» tenía «LLM» pegado delante, así que «agents» y «workflows»
 * quedaban perdonados por vecindad. Dos anglicismos de verdad, en la frase más
 * visible del sitio, y el QA daba cero.
 *
 * Ahora la única razón para perdonar una coincidencia es que ELLA MISMA forme
 * parte del término deliberado. «Agents» dentro de «Agentic Workflow Blueprint»
 * se calla; «agents» suelto, no, tenga al lado lo que tenga. */
const zonasDeliberadas = (texto) => {
  const zonas = [];
  const bajo = texto.toLowerCase();
  for (const d of DELIBERADOS) {
    const dd = d.toLowerCase();
    let i = bajo.indexOf(dd);
    while (i !== -1) { zonas.push([i, i + dd.length]); i = bajo.indexOf(dd, i + 1); }
  }
  return zonas;
};

const revisar = (texto, ruta, reglas, nivel) => {
  const zonas = zonasDeliberadas(texto);
  for (const [expresion, arreglo] of reglas) {
    for (const m of texto.matchAll(expresion)) {
      const [ini, fin] = [m.index, m.index + m[0].length];
      if (zonas.some(([a, b]) => ini >= a && fin <= b)) continue;
      hallazgos.push({
        nivel, ruta, palabra: m[0], arreglo,
        alrededor: texto.slice(Math.max(0, ini - 60), fin + 70).trim(),
      });
    }
  }
};

let vacias = 0;
for (const p of paginas) {
  const texto = visible(p);
  if (texto.length < 200) { vacias++; continue; }
  revisar(texto, p, P0, 'P0');
  revisar(texto, p, ANGLICISMOS, 'anglicismo');
}

/* El fallo que este guardián puede tener contra sí mismo.
 *
 * El texto de cada página lo escribe el prerenderizado dentro de #root. Si esto
 * corre antes de ese paso, casi todas las páginas están vacías, no hay nada que
 * revisar y el QA pasa en verde diciendo que el español está impecable. Ocurrió
 * al construirlo: de 112 anglicismos pasó a 1 sin haber corregido nada, y el
 * número engañaba porque bajar es justo lo que uno espera ver.
 *
 * Un guardián que no puede distinguir «no hay errores» de «no he mirado» es
 * peor que no tenerlo. */
if (vacias > paginas.length / 3) {
  console.error(`::error::${vacias} de ${paginas.length} páginas en español llegan sin texto. Falta ejecutar scripts/prerender.mjs antes de este QA: sin él no hay nada que revisar y el resultado sería un verde falso.`);
  process.exit(1);
}

/* ---- El veredicto ------------------------------------------------------- */
const url = (ruta) => ruta.replace('dist/_pages', '').replace(/\.html$/, '');
const p0 = hallazgos.filter((h) => h.nivel === 'P0');
const ang = hallazgos.filter((h) => h.nivel === 'anglicismo');

console.log(`Páginas en español revisadas: ${paginas.length}`);
console.log(`Palabras P0: ${p0.length} · anglicismos en el cuerpo: ${ang.length}`);

const contar = (lista) => {
  const por = new Map();
  for (const h of lista) {
    const clave = h.palabra.toLowerCase();
    if (!por.has(clave)) por.set(clave, { ...h, rutas: new Set() });
    por.get(clave).rutas.add(url(h.ruta));
  }
  return por;
};

for (const [titulo, lista] of [['P0 — cero tolerancia', p0], ['Anglicismos en el cuerpo', ang]]) {
  if (!lista.length) continue;
  console.log(`\n── ${titulo}`);
  for (const [palabra, h] of contar(lista)) {
    console.log(`  «${palabra}» → ${h.arreglo}`);
    console.log(`     en ${[...h.rutas].slice(0, 6).join(', ')}${h.rutas.size > 6 ? ` y ${h.rutas.size - 6} más` : ''}`);
    console.log(`     …${h.alrededor}…`);
  }
}

if (hallazgos.length) {
  console.log('');
  console.error(`::error::El QA de lenguaje encuentra ${hallazgos.length} coincidencias en el español publicado. Cada una se traduce, se reescribe, o se añade a la lista de términos deliberados con un motivo.`);
  process.exit(1);
}

console.log('\nEl español publicado no tiene palabras importadas ni anglicismos accidentales.');
