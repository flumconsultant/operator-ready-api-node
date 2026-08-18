/**
 * El recorrido de cámara: un plano secuencia alrededor del nodo.
 *
 * La versión anterior solo cambiaba la distancia. Esto orbita de verdad:
 * picados, contrapicados, tres cuartos por los dos lados, horizonte inclinado
 * y focal variable — de 50 mm cerrados en el hero a 76 abiertos en la pasada
 * más agresiva.
 *
 * La cámara NO entra en la nube principal. Se probó y no funciona: a esa
 * distancia una sola partícula ocupa media pantalla y el texto deja de leerse.
 * La sensación de volar por dentro la da la capa de polvo (DUST en AiNode),
 * que sí envuelve a la cámara y pasa de largo. El nodo se mantiene legible;
 * el vuelo ocurre alrededor.
 *
 * Cada waypoint es un plano. Se interpolan con Catmull-Rom, que pasa por los
 * puntos en vez de aproximarlos: sin eso el recorrido se redondea tanto que la
 * cámara nunca llega a los ángulos que se le piden.
 *
 * `t` va de 0 a 1 sobre el documento entero, así que el recorrido cubre todas
 * las secciones, no solo las que tienen un estado de forma anclado.
 */

/* pos: dónde está la cámara · look: a dónde mira · roll: giro de horizonte
   fov: campo de visión — abrirlo dentro de la nube exagera la profundidad */
export const WAYPOINTS = [
  /* 0.00 — hero. De frente, contenido. El titular manda. */
  { at: 0.00, pos: [0.4, 0.0, 16.5], look: [0, 0, 0], roll: 0.00, fov: 50 },

  /* 0.11 — se descuelga a un lado y baja el horizonte */
  { at: 0.11, pos: [-6.2, 2.6, 13.0], look: [1.2, -0.6, 0], roll: -0.10, fov: 58 },

  /* 0.23 — picado sobre la dispersión, gran angular */
  { at: 0.23, pos: [2.4, 7.4, 10.5], look: [-0.8, 0.6, 0], roll: 0.13, fov: 70 },

  /* 0.35 — contrapicado desde abajo, casi a ras del campo */
  { at: 0.35, pos: [-3.0, -6.4, 9.0], look: [0.4, 0.8, 0], roll: -0.18, fov: 66 },

  /* 0.46 — de frente y cerca sobre los cinco sistemas */
  { at: 0.46, pos: [0.0, 0.6, 11.2], look: [0, 0.2, 0], roll: 0.03, fov: 52 },

  /* 0.57 — rodea por la derecha, tres cuartos */
  { at: 0.57, pos: [10.5, 1.6, 8.6], look: [-1.6, 0.0, 0], roll: 0.16, fov: 62 },

  /* 0.69 — travelling lateral a lo largo de la espina, desde el otro lado */
  { at: 0.69, pos: [-11.0, 2.2, 8.0], look: [2.6, -0.4, 0], roll: -0.14, fov: 60 },

  /* 0.80 — el plano más agresivo: muy escorado y muy abierto */
  { at: 0.80, pos: [6.0, -7.6, 7.4], look: [-1.0, 1.4, 0], roll: 0.26, fov: 76 },

  /* 0.91 — frena, se endereza y se acerca */
  { at: 0.91, pos: [-2.2, 1.0, 10.0], look: [0.3, 0.0, 0], roll: -0.06, fov: 55 },

  /* 1.00 — cierre: de frente, cerca. La pregunta final se lee limpia. */
  { at: 1.00, pos: [0.0, 0.0, 12.5], look: [0, 0, 0], roll: 0.00, fov: 50 },
];

/* Catmull-Rom uniforme en una dimensión */
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/**
 * Devuelve el plano en el punto `t` (0..1) del recorrido, escrito sobre `out`
 * para no crear objetos en cada frame.
 */
export function sampleCamera(t, out) {
  const n = WAYPOINTS.length;
  const p = Math.min(Math.max(t, 0), 1);

  let i = 0;
  while (i < n - 2 && p > WAYPOINTS[i + 1].at) i++;

  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const span = b.at - a.at || 1;
  const f = Math.min(Math.max((p - a.at) / span, 0), 1);

  const p0 = WAYPOINTS[Math.max(i - 1, 0)];
  const p3 = WAYPOINTS[Math.min(i + 2, n - 1)];

  for (let k = 0; k < 3; k++) {
    out.pos[k] = cr(p0.pos[k], a.pos[k], b.pos[k], p3.pos[k], f);
    out.look[k] = cr(p0.look[k], a.look[k], b.look[k], p3.look[k], f);
  }
  out.roll = cr(p0.roll, a.roll, b.roll, p3.roll, f);
  out.fov = cr(p0.fov, a.fov, b.fov, p3.fov, f);
  return out;
}

export const makeShot = () => ({ pos: [0, 0, 0], look: [0, 0, 0], roll: 0, fov: 52 });

/**
 * Cuánto "empuja" el recorrido en este punto: la derivada aproximada de la
 * posición. Se usa para alargar las partículas en las pasadas rápidas — el
 * rastro de movimiento solo aparece cuando la cámara corre de verdad.
 */
export function pathSpeed(t) {
  const A = makeShot(), B = makeShot();
  sampleCamera(Math.max(t - 0.01, 0), A);
  sampleCamera(Math.min(t + 0.01, 1), B);
  const dx = B.pos[0] - A.pos[0];
  const dy = B.pos[1] - A.pos[1];
  const dz = B.pos[2] - A.pos[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz) / 0.02;
}
