import React from 'react';
/* Importación nominal, no `import * as THREE`: así rollup se lleva solo lo
   que se usa y el chunk de three baja de forma apreciable. */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Group,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three';
import { buildStates, buildEdges, STATE_COUNT } from './states.js';

/**
 * El nodo de IA: una red de partículas en WebGL, fija detrás de la home, que
 * va cambiando de forma según por dónde vas leyendo. Los cinco estados están
 * en states.js.
 *
 * Three.js en crudo, sin react-three-fiber: aquí hay un único objeto imperativo
 * y ningún árbol de componentes que reconciliar, así que el reconciler solo
 * añadiría ~18 KB y una capa de indirección. La app sigue siendo React; esto es
 * un canvas dentro de un efecto.
 *
 * El componente se carga en diferido (ver AiNodeStage) y solo marca
 * data-ai-node="on" cuando el contexto WebGL existe de verdad. Hasta entonces
 * —y para siempre, si el dispositivo no puede— la home se ve exactamente como
 * antes.
 */

const GREEN = new Color('#00FF88');
const ICE = new Color('#E0F7FF');

const VERT = /* glsl */ `
  attribute vec3 posA;
  attribute vec3 posB;
  attribute float seed;
  uniform float uMix;        // 0..1 entre el estado A y el B
  uniform float uTime;
  uniform float uSize;
  uniform float uDrift;      // cuánta vida propia tiene la nube
  varying float vDepth;
  varying float vSeed;

  void main() {
    // smoothstep en vez de lineal: las formas se asientan en vez de deslizarse
    float m = smoothstep(0.0, 1.0, uMix);
    vec3 p = mix(posA, posB, m);

    // respiración: nunca queda del todo quieto, ni siquiera sin scroll
    float w = uTime * 0.35 + seed * 6.2831;
    p += vec3(sin(w), cos(w * 0.9), sin(w * 1.3)) * uDrift;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = clamp((mv.z + 14.0) / 22.0, 0.0, 1.0);
    vSeed = seed;
    gl_Position = projectionMatrix * mv;
    // el divisor fija el tamaño en pantalla: a z~15 esto da puntos de 2-4 px,
    // que es lo que hace que se lea como red y no como niebla
    gl_PointSize = uSize * (0.6 + seed * 0.8) * (14.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uGreen;
  uniform vec3 uIce;
  uniform float uOpacity;
  varying float vDepth;
  varying float vSeed;

  void main() {
    // sprite redondo suave, sin textura
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = dot(d, d);
    if (r > 0.25) discard;
    float alpha = smoothstep(0.25, 0.0, r);

    // verde dominante; el hielo solo asoma en las partículas más cercanas, como
    // un reflejo. Mezclar a partes iguales lo volvía gris.
    float ice = pow(clamp(vDepth, 0.0, 1.0), 3.0) * 0.6 * (0.4 + vSeed * 0.6);
    vec3 col = mix(uGreen, uIce, ice);
    gl_FragColor = vec4(col, alpha * uOpacity * (0.35 + vDepth * 0.65));
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
  precision mediump float;
  uniform vec3 uGreen;
  uniform float uOpacity;
  varying float vDepth;
  void main() {
    gl_FragColor = vec4(uGreen, uOpacity * (0.15 + vDepth * 0.85));
  }
`;

export default function AiNode({ onReady }) {
  const hostRef = React.useRef(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

    /* Móvil: menos partículas, menos aristas, menos píxeles. Mismo efecto,
       una fracción del coste — es la versión simplificada, no otra pieza. */
    const COUNT = coarse ? 900 : 2600;
    const EDGES = coarse ? 90 : 260;
    const MAX_DPR = coarse ? 1.5 : 2;

    let renderer;
    try {
      renderer = new WebGLRenderer({ antialias: !coarse, alpha: true, powerPreference: 'low-power' });
    } catch {
      return;                                   // sin WebGL: la home se queda como estaba
    }
    if (!renderer.getContext()) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new Scene();
    const camera = new PerspectiveCamera(52, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 15.5);

    /* --- geometría --- */
    const states = buildStates(COUNT);
    const stateOffset = (s) => states.subarray(s * COUNT * 3, (s + 1) * COUNT * 3);

    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = (i * 0.6180339887) % 1;

    const geo = new BufferGeometry();
    const posA = new BufferAttribute(new Float32Array(stateOffset(0)), 3);
    const posB = new BufferAttribute(new Float32Array(stateOffset(1)), 3);
    posA.setUsage(DynamicDrawUsage);
    posB.setUsage(DynamicDrawUsage);
    geo.setAttribute('position', posA);          // three necesita 'position' para el frustum
    geo.setAttribute('posA', posA);
    geo.setAttribute('posB', posB);
    geo.setAttribute('seed', new BufferAttribute(seeds, 1));
    geo.boundingSphere = new Sphere(new Vector3(), 30);

    const uniforms = {
      uMix: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: coarse ? 3.0 : 3.6 },
      uDrift: { value: reduced ? 0 : 0.09 },
      uOpacity: { value: 0 },                    // entra con un fundido
      uGreen: { value: GREEN },
      uIce: { value: ICE },
    };

    const points = new Points(geo, new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }));

    /* --- aristas --- */
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
      uMix: uniforms.uMix,
      uOpacity: { value: 0 },
      uGreen: { value: GREEN },
    };
    const lines = new LineSegments(lineGeo, new ShaderMaterial({
      vertexShader: LINE_VERT,
      fragmentShader: LINE_FRAG,
      uniforms: lineUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }));

    /* Puntos y aristas van juntos en un grupo: comparten rotación y encuadre.
       En escritorio el nodo se desplaza a la derecha para no pelearse con el
       titular; en móvil se centra, porque ahí el texto va debajo. */
    const group = new Group();
    group.add(points);
    group.add(lines);
    group.position.x = coarse ? 0 : 3.4;   // se recalcula por estado en el bucle
    group.scale.setScalar(coarse ? 0.9 : 1.15);
    scene.add(group);

    /* --- estado del scroll --- */
    let pair = -1;                               // qué par de estados hay cargado
    const loadPair = (i) => {
      if (i === pair) return;
      pair = i;
      posA.array.set(stateOffset(i));
      posB.array.set(stateOffset(Math.min(i + 1, STATE_COUNT - 1)));
      posA.needsUpdate = true;
      posB.needsUpdate = true;
      writeEdges(lA, stateOffset(i));
      writeEdges(lB, stateOffset(Math.min(i + 1, STATE_COUNT - 1)));
      lAttrA.needsUpdate = true;
      lAttrB.needsUpdate = true;
    };

    /* Anclas: la posición en el documento donde cada estado está "cuajado".
       Vienen del artboard (data-node-state), no de porcentajes de scroll: si
       mañana crece una sección, el nodo sigue cuadrando con el texto sin tocar
       una línea de esto. */
    let anchors = [];
    const measure = () => {
      anchors = [...document.querySelectorAll('[data-node-state]')]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { state: +el.dataset.nodeState, mid: r.top + window.scrollY + r.height / 2 };
        })
        .sort((a, b) => a.state - b.state);
    };

    let targetMix = 0, targetSpin = 0, lineTarget = 0.3;
    const readScroll = () => {
      if (anchors.length < 2) { loadPair(0); return; }
      const eye = window.scrollY + window.innerHeight / 2;

      /* posición continua dentro de la escala de estados */
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

    /* --- bucle --- */
    let raf = 0, t0 = performance.now(), mix = 0, spin = 0, visible = true;
    let entry = 0, fade = 1;
    const offsetX = coarse ? 0 : 3.4;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min((now - t0) / 1000, 0.05);
      t0 = now;

      /* suavizado exponencial: el scroll del ratón llega a saltos y sin esto
         el morph se ve escalonado */
      const k = 1 - Math.pow(0.001, dt);
      mix += (targetMix - mix) * k;
      spin += (targetSpin - spin) * k;

      uniforms.uMix.value = mix;
      uniforms.uTime.value = reduced ? 0 : (now - 0) / 1000;
      entry = Math.min(entry + dt * 1.1, 1);          // fundido de entrada
      uniforms.uOpacity.value = entry * fade;
      lineUniforms.uOpacity.value = lineTarget * entry * fade;

      /* Giro contenido: las formas con significado (los cuatro clústeres, la
         espina de seis) tienen que leerse casi de frente. Girar más las
         convertía en un borrón diagonal. */
      group.rotation.y = spin * 0.34 - 0.14;
      group.rotation.x = Math.sin(spin * Math.PI) * 0.05;

      /* El nodo se aparta del titular solo en el hero; en cuanto adopta una
         forma que significa algo, se centra para cuadrar con el contenido. */
      group.position.x = offsetX * (1 - Math.min(mix + pair, 1));

      /* La presencia no es una rampa, es una curva: manda en el hero, se retira
         donde la página se llena de texto (clústeres y framework) y vuelve a
         subir en el cierre, que es otra vez una sola frase. */
      const st = spin * (STATE_COUNT - 1);
      fade = st <= 1 ? 1
        : st <= 3 ? 1 - ((st - 1) / 2) * 0.58
        : 0.42 + ((st - 3) / 1) * 0.46;

      renderer.render(scene, camera);

      /* Sin movimiento que animar, el bucle se apaga en cuanto termina el
         fundido: cero trabajo de GPU el resto de la visita. */
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

    /* prefers-reduced-motion: el nodo se queda quieto en su primer estado. El
       morph al hacer scroll es movimiento no esencial, que es exactamente lo
       que pide evitar quien activa esa preferencia. Sigue estando —textura de
       fondo, no coreografía. */
    if (reduced) {
      targetMix = 0;
      loadPair(0);
      lineTarget = 0.3;
    }

    /* Las imágenes en carga diferida cambian la altura de la página según
       entran; sin volver a medir, las anclas se desfasan del contenido. */
    const ro = new ResizeObserver(() => { measure(); readScroll(); });
    ro.observe(document.body);

    if (!reduced) window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);
    onReady?.();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (!reduced) window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      geo.dispose();
      lineGeo.dispose();
      points.material.dispose();
      lines.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />;
}
