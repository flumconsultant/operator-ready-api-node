import React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Gradiente vivo en WebGL (adaptación del componente "Velaris").
 *
 * Tres capas de ruido simplex que se mezclan sobre la paleta de la marca. No es
 * un degradado animado con CSS: la mezcla se recalcula por píxel, así que las
 * manchas se deforman entre ellas en vez de desplazarse rígidas. Sobre navy con
 * los dos verdes lee como algo que está transformándose, que es exactamente lo
 * que dice la sección donde va.
 *
 * Qué se cambió respecto del original, y por qué:
 *
 *   · Se comprueba la compilación y el enlazado de los shaders. Sin eso, en una
 *     GPU que rechace el shader el canvas queda negro y no hay ni un aviso en
 *     consola: un fondo de sección desaparecido y ninguna pista de por qué.
 *   · Los colores se convierten a RGB una vez, no en cada fotograma. Eran ocho
 *     parseInt y un Float32Array nuevo sesenta veces por segundo para un valor
 *     que no cambia.
 *   · La localización del array uniforme se pide como `u_colors[0]`, que es lo
 *     que exige la especificación; sin el índice hay implementaciones que
 *     devuelven null y los colores se quedan en negro.
 *   · El bucle se para cuando la banda sale de pantalla, y se recupera si el
 *     navegador pierde el contexto WebGL (pasa al suspender el equipo).
 *   · DPR fijado a 1. El shader evalúa ruido simplex tres veces por píxel y
 *     aquí no hay ni una arista que resolver: son manchas difusas, así que
 *     duplicar los píxeles duplica el coste sin diferencia visible. No hay
 *     medición fiable que lo respalde — el único entorno donde se ha podido
 *     medir usa render por software, donde todo va a 11-17 fps y la varianza
 *     entre pasadas es mayor que el efecto. Es una decisión por prudencia, no
 *     por dato.
 *   · Con prefers-reduced-motion se dibuja un fotograma y se detiene.
 */

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = u_time * 0.1;

  float n1 = snoise(p * 0.4  + vec2( t * 0.20, -t * 0.30));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15,  t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2( t * 0.10, -t * 0.20) + n2 * 0.20);

  vec3 col = u_bg;
  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);

  col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1) * 0.85);
  col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2) * 0.70);
  col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3) * 0.60);
  col = mix(col, u_colors[3], smoothstep( 0.0, 0.7, n1 * n2) * 0.50);

  float glow = smoothstep(0.8, 0.0, dist) * 0.3;
  col += u_colors[1] * glow;

  col = mix(col * 0.2, col, vignette);

  /* El grano cumple aquí la misma función que en las bandas de canvas: un
     degradado sobre navy casi negro escalona en anillos, y el ruido rompe el
     redondeo. */
  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* Un degradado difuso no gana nada con más píxeles, y el coste del shader es
   por píxel. Ver la nota de la cabecera sobre por qué esto no está medido. */
const DPR_CAP = 1;

const hexToRgb = (hex) => {
  const h = hex.replace('#', '').trim();
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const i = parseInt(n, 16);
  return [((i >> 16) & 255) / 255, ((i >> 8) & 255) / 255, (i & 255) / 255];
};

/* Los colores salen de tokens/, no de literales: el degradado tiene que moverse
   con la paleta si la paleta cambia. */
function brandColors(el) {
  const cs = getComputedStyle(el);
  const v = (n, fb) => (cs.getPropertyValue(n) || '').trim() || fb;
  return {
    bg: v('--navy-950', '#05070f'),
    stops: [
      v('--electric-green', '#00ff88'),
      v('--neon-green', '#00ffaa'),
      v('--navy-800', '#0d1330'),
      v('--navy-950', '#05070f'),
    ],
  };
}

function compile(gl, type, src, label) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(`GradientField: el shader ${label} no compila —`, gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export default function GradientField({ speed = 2, grain = 0.3, style }) {
  const reduced = useReducedMotion();
  const hostRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return undefined;

    let gl = null;
    let raf = 0;
    let running = false;
    let io = null;
    let ro = null;
    let start = 0;

    const setup = () => {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
      if (!gl) return false;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT, 'de vértices');
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG, 'de fragmentos');
      if (!vs || !fs) return false;

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('GradientField: el programa no enlaza —', gl.getProgramInfoLog(program));
        return false;
      }
      gl.useProgram(program);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const loc = {
        res: gl.getUniformLocation(program, 'u_resolution'),
        time: gl.getUniformLocation(program, 'u_time'),
        grain: gl.getUniformLocation(program, 'u_grain'),
        /* Con índice: la especificación lo exige para arrays y sin él hay
           implementaciones que devuelven null. */
        colors: gl.getUniformLocation(program, 'u_colors[0]'),
        bg: gl.getUniformLocation(program, 'u_bg'),
      };

      /* Una vez, no por fotograma */
      const brand = brandColors(host);
      const flat = new Float32Array(brand.stops.flatMap(hexToRgb));
      const bg = hexToRgb(brand.bg);
      gl.uniform3fv(loc.colors, flat);
      gl.uniform3f(loc.bg, bg[0], bg[1], bg[2]);
      gl.uniform1f(loc.grain, grain);

      const resize = () => {
        const r = host.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
        canvas.width = Math.max(1, Math.round(r.width * dpr));
        canvas.height = Math.max(1, Math.round(r.height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(loc.res, canvas.width, canvas.height);
      };
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(host);

      const frame = (ms) => {
        if (!start) start = ms;
        gl.uniform1f(loc.time, ((ms - start) / 1000) * speed);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };

      if (reduced) {
        /* Un fotograma con el reloj parado en un punto bonito de la mezcla */
        gl.uniform1f(loc.time, 8);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        return true;
      }

      const loop = (ms) => { frame(ms); raf = requestAnimationFrame(loop); };
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
      }, { rootMargin: '100px' });
      io.observe(host);
      return true;
    };

    /* El navegador tira el contexto al suspender el equipo o al cambiar de GPU.
       Sin esto la banda se queda negra hasta recargar. */
    const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); running = false; };
    const onRestored = () => { io?.disconnect(); ro?.disconnect(); start = 0; setup(); };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    const ok = setup();
    if (!ok) host.setAttribute('data-gl-failed', '');

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [speed, grain, reduced]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        /* Suelo sólido debajo: si WebGL no arranca la sección conserva su
           color de banda en vez de quedarse en blanco. */
        background: 'var(--navy-950)',
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
