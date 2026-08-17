/**
 * Los cinco estados por los que pasa el nodo al recorrer la home.
 *
 * No son formas decorativas elegidas por bonitas: cada una es la sección que
 * tiene detrás. El nodo argumenta lo mismo que el texto.
 *
 *   0  Hero — "Become what comes next"          núcleo único y denso
 *   1  "La IA está en todas partes.
 *       La reinvención, no."                    disperso, sin estructura
 *   2  "The transformation happens inside"      cuatro clústeres: people,
 *                                               data, agents, operations
 *   3  "El framework BECOME™ — seis etapas"     espina de seis nodos
 *   4  "¿En qué debe convertirse tu empresa?"   vuelve a converger: la
 *                                               pregunta del hero, respondida
 *
 * Los estados van anclados a secciones concretas (data-node-state en el
 * artboard), no a porcentajes de scroll. Y todas las anclas caen en secciones
 * navy: las claras tapan la capa 3D, así que anclar ahí habría dejado estados
 * que nadie llega a ver nunca.
 *
 * Cada función devuelve la posición de la partícula `i` de `n` en ese estado.
 * El generador pseudoaleatorio es determinista para que la partícula 37 sea
 * siempre la misma partícula en los cinco estados — sin eso el morph no lee
 * como una transformación, sino como cinco imágenes distintas.
 */

/* PRNG determinista (mulberry32) */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Punto uniforme en una esfera de radio r, centrado en c */
function inSphere(rand, r, cx = 0, cy = 0, cz = 0) {
  const u = rand(), v = rand(), w = rand();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const rad = r * Math.cbrt(w);
  return [
    cx + rad * Math.sin(phi) * Math.cos(theta),
    cy + rad * Math.sin(phi) * Math.sin(theta),
    cz + rad * Math.cos(phi),
  ];
}

/* 0 — Núcleo: una esfera densa, con una corteza más poblada que el centro */
function core(rand) {
  const [x, y, z] = inSphere(rand, 1, 0, 0, 0);
  const d = Math.hypot(x, y, z) || 1e-6;
  const shell = 0.55 + 0.45 * Math.pow(rand(), 0.35);   // empuja hacia la corteza
  const r = 3.2 * shell;
  return [(x / d) * r, (y / d) * r, (z / d) * r];
}

/* 1 — Disperso: la IA en todas partes, la reinvención en ninguna */
function scattered(rand) {
  return [
    (rand() - 0.5) * 22,
    (rand() - 0.5) * 12,
    (rand() - 0.5) * 14,
  ];
}

/* 2 — Cuatro clústeres: people, data, agents, operations */
const CLUSTERS = [[-6.6, 0, 0], [-2.2, 0, 0], [2.2, 0, 0], [6.6, 0, 0]];
function clusters(rand, i) {
  const c = CLUSTERS[i % 4];
  return inSphere(rand, 1.45, c[0], c[1], c[2]);
}

/* 3 — Espina de seis: B-E-C-O-M-E, en arco ascendente */
function spine(rand, i) {
  const stage = i % 6;
  const x = -6.6 + stage * 2.64;
  const y = -1.4 + Math.sin((stage / 5) * Math.PI * 0.92) * 2.3;
  return inSphere(rand, 0.82, x, y, 0);
}

/* 4 — Convergencia: vuelve al núcleo, pero más apretado y con un anillo
   alrededor. Cierra donde abrió, que es lo que hace la propia página. */
function convergence(rand, i) {
  if (i % 3 === 0) {                                   // el anillo: una de cada tres
    const a = rand() * Math.PI * 2;
    const r = 4.6 + (rand() - 0.5) * 0.4;
    return [Math.cos(a) * r, Math.sin(a) * r * 0.46, (rand() - 0.5) * 0.9];
  }
  return inSphere(rand, 1.9);
}

export const STATE_COUNT = 5;

/**
 * Devuelve un Float32Array de 5 * n * 3: los cinco estados, uno tras otro.
 * Cada estado usa su propia semilla, así que las nubes no están correlacionadas
 * entre sí, pero la partícula i mantiene su identidad a lo largo de los cinco.
 */
export function buildStates(n) {
  const out = new Float32Array(STATE_COUNT * n * 3);
  const makers = [core, scattered, clusters, spine, convergence];
  for (let s = 0; s < STATE_COUNT; s++) {
    const rand = rng(0x9e3779b9 + s * 0x85ebca6b);
    const base = s * n * 3;
    for (let i = 0; i < n; i++) {
      const p = makers[s](rand, i);
      out[base + i * 3] = p[0];
      out[base + i * 3 + 1] = p[1];
      out[base + i * 3 + 2] = p[2];
    }
  }
  return out;
}

/**
 * Aristas de la red. Se eligen en el estado 2 (los cuatro clústeres), que es
 * donde la estructura tiene sentido: cada partícula se une a otra de su mismo
 * clúster. En los estados dispersos esas mismas aristas quedan estiradas, que
 * es justo lo que debe transmitir "conectado sobre el papel, roto en la
 * práctica".
 */
export function buildEdges(n, count) {
  const rand = rng(0xc2b2ae35);
  const edges = new Uint32Array(count * 2);
  for (let e = 0; e < count; e++) {
    const group = e % 4;
    /* dos índices que caen en el mismo clúster: i % 4 === group */
    const a = group + 4 * Math.floor(rand() * Math.floor((n - group) / 4));
    const b = group + 4 * Math.floor(rand() * Math.floor((n - group) / 4));
    edges[e * 2] = Math.min(a, n - 1);
    edges[e * 2 + 1] = Math.min(b, n - 1);
  }
  return edges;
}
