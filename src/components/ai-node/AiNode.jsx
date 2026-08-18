import React from 'react';
/* Importación nominal, no `import * as THREE`: rollup se lleva solo lo usado. */
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Group,
  LineSegments,
  Mesh,
  NormalBlending,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { buildStates, buildEdges, STATE_COUNT } from './states.js';
import { sampleCamera, makeShot, pathSpeed } from './camera-path.js';

/**
 * El nodo de IA: una red de partículas en WebGL, fija detrás de la home, que
 * va cambiando de forma según por dónde vas leyendo. Los estados y su
 * correspondencia con las secciones están en states.js.
 *
 * Three.js en crudo, sin react-three-fiber: aquí hay un único objeto imperativo
 * y ningún árbol de componentes que reconciliar.
 *
 * ---- Por qué el canvas pinta también el fondo de la página ----
 *
 * La primera versión solo se veía en las secciones oscuras: las claras, opacas,
 * lo tapaban, y el nodo desaparecía a mitad de recorrido. Ahora el canvas pinta
 * las bandas de color de todas las secciones —los tokens que llevan anotados en
 * data-band— y dibuja las partículas encima. El nodo ya no se interrumpe: lo
 * que cambia es el suelo, y con él la tinta, verde sobre navy y navy sobre
 * claro. En claro además pesa mucho menos, para no ensuciar el texto.
 *
 * Nada de esto se activa hasta que el contexto WebGL existe de verdad; ver
 * AiNodeStage.
 */

const MAX_BANDS = 12;

/* El bloque de bandas se comparte entre fondo, puntos y aristas: los tres
   tienen que estar de acuerdo sobre dónde empieza el claro. */
const BANDS_GLSL = /* glsl */ `
  uniform vec2 uResolution;
  uniform float uBandTop[${MAX_BANDS}];
  uniform float uBandBot[${MAX_BANDS}];
  uniform vec3 uBandCol[${MAX_BANDS}];
  uniform float uBandLight[${MAX_BANDS}];
  uniform int uBandN;
  uniform vec3 uGround;

  void bandAt(float y, out vec3 col, out float light) {
    col = uGround;
    light = 0.0;
    for (int i = 0; i < ${MAX_BANDS}; i++) {
      if (i >= uBandN) break;
      if (y <= uBandTop[i] && y > uBandBot[i]) {
        col = uBandCol[i];
        light = uBandLight[i];
      }
    }
  }
`;

const VERT = /* glsl */ `
  attribute vec3 posA;
  attribute vec3 posB;
  attribute float seed;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uDrift;
  uniform float uStagger;   // qué parte de la transición ocupa el escalonado
  uniform float uBulge;     // cuánto se arquea la trayectoria
  uniform float uStreak;    // rastro: alarga los puntos en las pasadas rápidas
  varying float vDepth;
  varying float vSeed;
  varying float vNear;

  void main() {
    /* Escalonado por partícula. Con todas moviéndose a la vez el cambio se lee
       como un bloque que se desliza; desfasadas, la forma se deshace y se
       recompone, que es lo que hay que contar. */
    float d = seed * uStagger;
    float m = smoothstep(d, d + (1.0 - uStagger), uMix);

    /* Trayectoria en arco, no en línea recta: cada partícula sale de su sitio
       por un lado distinto y entra al siguiente por otro. */
    vec3 straight = mix(posA, posB, m);
    vec3 dir = posB - posA;
    vec3 perp = normalize(cross(dir, vec3(0.30, 0.87, 0.39)) + vec3(1e-4));
    float arc = sin(m * 3.14159265) * uBulge * (0.35 + seed * 1.3);
    vec3 p = straight + perp * arc;

    // respiración: nunca queda del todo quieto, ni siquiera sin scroll
    float w = uTime * 0.35 + seed * 6.2831;
    p += vec3(sin(w), cos(w * 0.9), sin(w * 1.3)) * uDrift;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;

    /* vNear marca las partículas que pasan pegadas a la cámara. Sin esto, al
       atravesar la nube, una sola partícula puede ocupar media pantalla. */
    vNear = smoothstep(7.0, 2.2, dist);
    vDepth = clamp((dist - 1.0) / 24.0, 0.0, 1.0);
    vDepth = 1.0 - vDepth;                 // 1 = cerca, 0 = lejos
    vSeed = seed;

    gl_Position = projectionMatrix * mv;

    /* El techo de 11 px es lo que impide que una partícula cercana se coma la
       pantalla. Sin él, en las pasadas escoradas el texto deja de leerse. */
    float size = uSize * (0.6 + seed * 0.8) * (14.0 / max(dist, 2.2));
    gl_PointSize = clamp(size * (1.0 + uStreak * 0.6), 0.0, 7.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uGreen;
  uniform vec3 uIce;
  uniform vec3 uInkLight;
  uniform float uOpacity;
  uniform float uStreak;
  varying float vDepth;
  varying float vSeed;
  varying float vNear;
  ${BANDS_GLSL}

  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    /* En las pasadas rápidas el punto se estira en horizontal: un rastro corto
       basta para que la velocidad se sienta sin ensuciar la imagen. */
    d.x /= (1.0 + uStreak * 1.2);
    float r = dot(d, d);
    if (r > 0.25) discard;
    float alpha = smoothstep(0.25, 0.01, r);

    vec3 bcol; float light;
    bandAt(gl_FragCoord.y / uResolution.y, bcol, light);

    // Sobre navy: verde, con el hielo asomando en las partículas cercanas.
    // Sobre claro: tinta navy. El mismo nodo, leído sobre otro papel.
    float ice = pow(clamp(vDepth, 0.0, 1.0), 3.0) * 0.6 * (0.4 + vSeed * 0.6);
    vec3 col = mix(mix(uGreen, uIce, ice), uInkLight, light);

    /* Sobre navy hace falta más cuerpo que con la mezcla aditiva anterior: el
       alfa normal no acumula brillo donde las partículas se solapan. Sobre
       claro, al revés — con poco basta y de más ensuciaría el texto. */
    float a = alpha * uOpacity * (0.42 + vDepth * 0.72) * mix(1.25, 0.17, light);

    /* Lo que pasa muy cerca se desvanece en vez de taparlo todo: es lo que hace
       que cruzar el campo se lea como profundidad y no como un borrón. */
    a *= (1.0 - vNear * 0.92);

    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

const LINE_VERT = /* glsl */ `
  attribute vec3 posA;
  attribute vec3 posB;
  uniform float uMix;
  varying float vDepth;
  void main() {
    float m = smoothstep(0.0, 1.0, uMix);
    vec3 p = mix(posA, posB, m);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = clamp((mv.z + 14.0) / 22.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const LINE_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uGreen;
  uniform vec3 uInkLight;
  uniform float uOpacity;
  varying float vDepth;
  ${BANDS_GLSL}

  void main() {
    vec3 bcol; float light;
    bandAt(gl_FragCoord.y / uResolution.y, bcol, light);
    vec3 col = mix(uGreen, uInkLight, light);
    gl_FragColor = vec4(col, uOpacity * (0.15 + vDepth * 0.85) * mix(1.0, 0.22, light));
    #include <colorspace_fragment>
  }
`;

/* ---- Capa de polvo ----
   Un volumen grande de motas que envuelve a la cámara y se recoloca por delante
   cuando queda atrás (un cubo con módulo, no una nube finita). Es lo que da la
   sensación de estar viajando dentro de algo: el nodo se mira, el polvo se
   atraviesa. Va detrás del nodo en el orden de dibujado y con un alfa mínimo,
   así que aporta profundidad sin disputarle el primer plano al texto. */
const DUST_VERT = /* glsl */ `
  attribute float dseed;
  uniform vec3 uCam;
  uniform float uSpan;      // arista del volumen que envuelve a la cámara
  uniform float uTime;
  uniform float uStreak;
  varying float vFade;

  void main() {
    vec3 p = position;

    /* Deriva lenta propia, para que no parezca un decorado rígido */
    p.y += sin(uTime * 0.15 + dseed * 6.2831) * 0.6;

    /* Envolver alrededor de la cámara: la mota que queda atrás reaparece
       delante. Con esto bastan 700 motas para un campo aparentemente infinito. */
    vec3 rel = p - uCam;
    rel = mod(rel + uSpan * 0.5, uSpan) - uSpan * 0.5;

    vec4 mv = viewMatrix * vec4(uCam + rel, 1.0);
    float dist = -mv.z;

    /* Se apaga cerca (no molestar) y lejos (no ensuciar el horizonte) */
    vFade = smoothstep(1.5, 7.0, dist) * (1.0 - smoothstep(uSpan * 0.30, uSpan * 0.5, dist));

    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((1.4 + dseed * 1.6) * (26.0 / max(dist, 2.0)) * (1.0 + uStreak * 0.8), 0.0, 5.0);
  }
`;

const DUST_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uGreen;
  uniform vec3 uInkLight;
  uniform float uOpacity;
  uniform float uStreak;
  varying float vFade;
  ${BANDS_GLSL}

  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    d.x /= (1.0 + uStreak * 1.0);       // rastro corto en las pasadas rápidas
    float r = dot(d, d);
    if (r > 0.25) discard;
    float soft = smoothstep(0.25, 0.02, r);   // sin esto, a 4 px se ve cuadrado

    vec3 bcol; float light;
    bandAt(gl_FragCoord.y / uResolution.y, bcol, light);
    vec3 col = mix(uGreen, uInkLight, light);

    gl_FragColor = vec4(col, soft * vFade * uOpacity * mix(0.30, 0.07, light));
    #include <colorspace_fragment>
  }
`;

const BG_VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const BG_FRAG = /* glsl */ `
  precision highp float;
  ${BANDS_GLSL}
  void main() {
    vec3 col; float light;
    bandAt(gl_FragCoord.y / uResolution.y, col, light);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export default function AiNode({ onReady }) {
  const hostRef = React.useRef(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

    /* Móvil: menos partículas, menos aristas, menos píxeles. */
    const COUNT = coarse ? 900 : 2600;
    const EDGES = coarse ? 90 : 260;
    const MAX_DPR = coarse ? 1.5 : 2;

    let renderer;
    try {
      renderer = new WebGLRenderer({ antialias: !coarse, powerPreference: 'low-power' });
    } catch {
      return;                                   // sin WebGL: la home se queda como estaba
    }
    if (!renderer.getContext()) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.autoClear = false;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new Scene();
    const camera = new PerspectiveCamera(52, host.clientWidth / host.clientHeight, 0.1, 120);
    const shot = makeShot();
    const lookAt = new Vector3();
    sampleCamera(0, shot);
    camera.position.set(shot.pos[0], shot.pos[1], shot.pos[2]);

    /* ---- uniforms de banda, compartidos por fondo, puntos y aristas ---- */
    const bandU = {
      uResolution: { value: new Vector2(1, 1) },
      uBandTop: { value: new Array(MAX_BANDS).fill(0) },
      uBandBot: { value: new Array(MAX_BANDS).fill(0) },
      uBandCol: { value: Array.from({ length: MAX_BANDS }, () => new Color(0x05070f)) },
      uBandLight: { value: new Array(MAX_BANDS).fill(0) },
      uBandN: { value: 0 },
      uGround: { value: new Color(0x05070f) },
    };

    /* ---- fondo: reproduce las bandas de color de las secciones ---- */
    const bgScene = new Scene();
    const bgCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const bgMat = new ShaderMaterial({
      vertexShader: BG_VERT,
      fragmentShader: BG_FRAG,
      uniforms: bandU,
      depthTest: false,
      depthWrite: false,
    });
    const bgMesh = new Mesh(new PlaneGeometry(2, 2), bgMat);
    bgMesh.frustumCulled = false;
    bgScene.add(bgMesh);

    /* ---- geometría de partículas ---- */
    const states = buildStates(COUNT);
    const stateOffset = (s) => states.subarray(s * COUNT * 3, (s + 1) * COUNT * 3);

    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = (i * 0.6180339887) % 1;

    const geo = new BufferGeometry();
    const posA = new BufferAttribute(new Float32Array(stateOffset(0)), 3);
    const posB = new BufferAttribute(new Float32Array(stateOffset(1)), 3);
    posA.setUsage(DynamicDrawUsage);
    posB.setUsage(DynamicDrawUsage);
    geo.setAttribute('position', posA);          // three necesita 'position'
    geo.setAttribute('posA', posA);
    geo.setAttribute('posB', posB);
    geo.setAttribute('seed', new BufferAttribute(seeds, 1));
    geo.boundingSphere = new Sphere(new Vector3(), 30);

    const uniforms = {
      ...bandU,
      uMix: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: coarse ? 2.4 : 2.9 },
      uDrift: { value: reduced ? 0 : 0.09 },
      uStagger: { value: reduced ? 0 : 0.55 },
      uBulge: { value: reduced ? 0 : 1.35 },
      uStreak: { value: 0 },
      uOpacity: { value: 0 },                    // entra con un fundido
      uGreen: { value: new Color('#00FF88') },
      uIce: { value: new Color('#E0F7FF') },
      uInkLight: { value: new Color('#0A0E27') },
    };

    const points = new Points(geo, new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
    }));

    /* ---- aristas ---- */
    const edges = buildEdges(COUNT, EDGES);
    const lineGeo = new BufferGeometry();
    const lA = new Float32Array(EDGES * 2 * 3);
    const lB = new Float32Array(EDGES * 2 * 3);
    const writeEdges = (target, src) => {
      for (let e = 0; e < EDGES * 2; e++) {
        const idx = edges[e] * 3;
        target[e * 3] = src[idx];
        target[e * 3 + 1] = src[idx + 1];
        target[e * 3 + 2] = src[idx + 2];
      }
    };
    writeEdges(lA, stateOffset(0));
    writeEdges(lB, stateOffset(1));
    const lAttrA = new BufferAttribute(lA, 3);
    const lAttrB = new BufferAttribute(lB, 3);
    lAttrA.setUsage(DynamicDrawUsage);
    lAttrB.setUsage(DynamicDrawUsage);
    lineGeo.setAttribute('position', lAttrA);
    lineGeo.setAttribute('posA', lAttrA);
    lineGeo.setAttribute('posB', lAttrB);
    lineGeo.boundingSphere = new Sphere(new Vector3(), 30);

    const lineUniforms = {
      ...bandU,
      uMix: uniforms.uMix,
      uOpacity: { value: 0 },
      uGreen: { value: uniforms.uGreen.value },
      uInkLight: { value: uniforms.uInkLight.value },
    };
    const lines = new LineSegments(lineGeo, new ShaderMaterial({
      vertexShader: LINE_VERT,
      fragmentShader: LINE_FRAG,
      uniforms: lineUniforms,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
    }));

    /* ---- polvo ---- */
    const DUST = coarse ? 380 : 900;
    const SPAN = 46;
    const dustGeo = new BufferGeometry();
    const dpos = new Float32Array(DUST * 3);
    const dseed = new Float32Array(DUST);
    {
      let a = 0x1f123bb5;
      const rnd = () => { a ^= a << 13; a ^= a >>> 17; a ^= a << 5; return ((a >>> 0) / 4294967296); };
      for (let i = 0; i < DUST; i++) {
        dpos[i * 3] = (rnd() - 0.5) * SPAN;
        dpos[i * 3 + 1] = (rnd() - 0.5) * SPAN;
        dpos[i * 3 + 2] = (rnd() - 0.5) * SPAN;
        dseed[i] = rnd();
      }
    }
    dustGeo.setAttribute('position', new BufferAttribute(dpos, 3));
    dustGeo.setAttribute('dseed', new BufferAttribute(dseed, 1));
    dustGeo.boundingSphere = new Sphere(new Vector3(), SPAN);

    const dustUniforms = {
      ...bandU,
      uCam: { value: new Vector3() },
      uSpan: { value: SPAN },
      uTime: { value: 0 },
      uStreak: { value: 0 },
      uOpacity: { value: 0 },
      uGreen: { value: uniforms.uGreen.value },
      uInkLight: { value: uniforms.uInkLight.value },
    };
    const dust = new Points(dustGeo, new ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      uniforms: dustUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: NormalBlending,
    }));
    dust.frustumCulled = false;
    dust.renderOrder = -1;                     // siempre por detrás del nodo
    scene.add(dust);

    /* Puntos y aristas van juntos: comparten encuadre y rotación. */
    const group = new Group();
    group.add(points);
    group.add(lines);
    group.scale.setScalar(coarse ? 0.9 : 1.15);
    scene.add(group);

    /* ---- bandas: leer del DOM lo que pintaba cada sección ---- */
    const css = getComputedStyle(document.documentElement);
    const tokenColor = new Map();
    const colorOf = (token) => {
      if (!tokenColor.has(token)) {
        tokenColor.set(token, new Color(css.getPropertyValue(token).trim() || '#05070F'));
      }
      return tokenColor.get(token);
    };
    let bandEls = [];

    const syncBands = () => {
      const H = window.innerHeight;
      let n = 0;
      for (const el of bandEls) {
        if (n >= MAX_BANDS) break;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H) continue;              // fuera de pantalla
        /* gl_FragCoord.y cuenta desde abajo; el DOM, desde arriba */
        bandU.uBandTop.value[n] = 1 - r.top / H;
        bandU.uBandBot.value[n] = 1 - r.bottom / H;
        const c = colorOf(el.dataset.band);
        bandU.uBandCol.value[n].copy(c);
        /* la luminancia decide la tinta de las partículas sobre esa banda */
        bandU.uBandLight.value[n] =
          c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722 > 0.35 ? 1 : 0;
        n++;
      }
      bandU.uBandN.value = n;
    };

    /* ---- anclas de estado ---- */
    let anchors = [];
    const measure = () => {
      bandEls = [...document.querySelectorAll('[data-band]')];
      anchors = [...document.querySelectorAll('[data-node-state]')]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { state: +el.dataset.nodeState, mid: r.top + window.scrollY + r.height / 2 };
        })
        .sort((a, b) => a.state - b.state);
    };

    let pair = -1;
    const loadPair = (i) => {
      if (i === pair) return;
      pair = i;
      const j = Math.min(i + 1, STATE_COUNT - 1);
      posA.array.set(stateOffset(i));
      posB.array.set(stateOffset(j));
      posA.needsUpdate = true;
      posB.needsUpdate = true;
      writeEdges(lA, stateOffset(i));
      writeEdges(lB, stateOffset(j));
      lAttrA.needsUpdate = true;
      lAttrB.needsUpdate = true;
    };

    let targetMix = 0, targetSpin = 0, lineTarget = 0.3, targetDoc = 0;
    const readScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetDoc = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      if (anchors.length < 2) { loadPair(0); return; }
      const eye = window.scrollY + window.innerHeight / 2;

      let t;
      if (eye <= anchors[0].mid) t = anchors[0].state;
      else if (eye >= anchors[anchors.length - 1].mid) t = anchors[anchors.length - 1].state;
      else {
        let k = 0;
        while (k < anchors.length - 2 && eye > anchors[k + 1].mid) k++;
        const span = anchors[k + 1].mid - anchors[k].mid || 1;
        const f = (eye - anchors[k].mid) / span;
        t = anchors[k].state + f * (anchors[k + 1].state - anchors[k].state);
      }

      const i = Math.min(Math.max(Math.floor(t), 0), STATE_COUNT - 2);
      loadPair(i);
      targetMix = t - i;
      targetSpin = t / (STATE_COUNT - 1);

      /* Las aristas se apagan alrededor del estado 1: la red sigue ahí, pero ya
         no sostiene nada. Es el argumento de la sección, dibujado. */
      const dispersion = Math.max(0, 1 - Math.abs(t - 1));
      lineTarget = 0.3 * (1 - dispersion * 0.88);
    };

    /* ---- paralaje de ratón, muy contenido ---- */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    /* ---- bucle ---- */
    let raf = 0, t0 = performance.now(), mix = 0, spin = 0, visible = true;
    let entry = 0, fade = 1, docT = 0, streak = 0;
    const offsetX = coarse ? 0 : 3.4;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min((now - t0) / 1000, 0.05);
      t0 = now;

      /* suavizado exponencial: el scroll llega a saltos y sin esto el morph se
         ve escalonado */
      const k = 1 - Math.pow(0.001, dt);
      mix += (targetMix - mix) * k;
      spin += (targetSpin - spin) * k;
      mouse.x += (mouse.tx - mouse.x) * k * 0.5;
      mouse.y += (mouse.ty - mouse.y) * k * 0.5;

      uniforms.uMix.value = mix;
      uniforms.uTime.value = reduced ? 0 : now / 1000;

      const st = spin * (STATE_COUNT - 1);

      /* Giro contenido del propio nodo: la cámara ya aporta el ángulo, así que
         el objeto solo necesita respirar. Girar los dos era mareante. */
      group.rotation.y = spin * 0.22 - 0.09 + mouse.x * 0.04;
      group.rotation.x = Math.sin(spin * Math.PI) * 0.04 + mouse.y * 0.025;
      /* Se aparta del titular solo en el hero; en cuanto adopta una forma que
         significa algo, se centra para cuadrar con el contenido. */
      group.position.x = offsetX * (1 - Math.min(mix + pair, 1));

      /* ---- Recorrido de cámara ----
         Va sobre el progreso del documento entero, no sobre los estados de
         forma: así hay cambio de plano en todas las secciones, también en las
         que no tienen una forma anclada. */
      docT += (targetDoc - docT) * k;
      sampleCamera(docT, shot);
      camera.position.set(
        shot.pos[0] + mouse.x * 0.5,
        shot.pos[1] + mouse.y * 0.35,
        shot.pos[2],
      );
      lookAt.set(shot.look[0], shot.look[1], shot.look[2]);
      camera.lookAt(lookAt);
      camera.rotateZ(shot.roll);
      if (Math.abs(camera.fov - shot.fov) > 0.01) {
        camera.fov = shot.fov;
        camera.updateProjectionMatrix();
      }

      /* El rastro solo aparece cuando la cámara corre de verdad. Se normaliza
         contra la velocidad máxima del recorrido para que no dependa de cuánto
         mide la página. */
      const speedTarget = reduced ? 0 : Math.min(pathSpeed(docT) / 260, 0.25);
      streak += (speedTarget - streak) * k * 0.7;
      uniforms.uStreak.value = streak;
      dustUniforms.uStreak.value = streak;
      dustUniforms.uTime.value = uniforms.uTime.value;
      dustUniforms.uCam.value.copy(camera.position);

      /* Presencia: manda en el hero, se retira donde la página se llena de
         texto, y vuelve a subir en el cierre, que es otra vez una sola frase. */
      fade = st <= 1 ? 1 : st <= 3 ? 1 - ((st - 1) / 2) * 0.58 : 0.42 + (st - 3) * 0.46;

      entry = Math.min(entry + dt * 1.1, 1);
      uniforms.uOpacity.value = entry * fade;
      lineUniforms.uOpacity.value = lineTarget * entry * fade;
      /* El polvo baja menos que el nodo donde hay texto: es lo que mantiene la
         continuidad del viaje incluso en las secciones más densas. */
      dustUniforms.uOpacity.value = entry * (0.55 + fade * 0.45);

      syncBands();
      bandU.uResolution.value.set(host.clientWidth, host.clientHeight);

      renderer.clear();
      renderer.render(bgScene, bgCam);
      renderer.render(scene, camera);

      /* Sin movimiento que animar, el bucle se apaga en cuanto entra. */
      if (reduced && entry >= 1) cancelAnimationFrame(raf);
    };

    const onResize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
      measure();
      readScroll();
    };
    const onVisibility = () => { visible = !document.hidden; t0 = performance.now(); };

    measure();
    readScroll();

    /* prefers-reduced-motion: el nodo se queda quieto en su primer estado. */
    if (reduced) { targetMix = 0; loadPair(0); lineTarget = 0.3; }

    /* Las imágenes en carga diferida cambian la altura de la página según
       entran; sin volver a medir, las anclas se desfasan del contenido. */
    const ro = new ResizeObserver(() => { measure(); readScroll(); });
    ro.observe(document.body);

    if (!reduced) {
      window.addEventListener('scroll', readScroll, { passive: true });
      if (!coarse) window.addEventListener('pointermove', onPointer, { passive: true });
    }
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);
    onReady?.();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (!reduced) {
        window.removeEventListener('scroll', readScroll);
        window.removeEventListener('pointermove', onPointer);
      }
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      geo.dispose();
      dustGeo.dispose();
      dust.material.dispose();
      lineGeo.dispose();
      bgMesh.geometry.dispose();
      bgMat.dispose();
      points.material.dispose();
      lines.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />;
}
