import React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Bandas generadas: el sustituto de las fotos de stock.
 *
 * Las imágenes que había antes eran archivos de 760 px estirados a todo el
 * ancho del viewport. A 1440 px eso es un escalado de casi 2×, y por eso se
 * veían pixeladas: no era el encuadre ni la compresión, era que no había
 * píxeles suficientes. Subir la resolución solo mueve el problema al monitor
 * siguiente.
 *
 * Estas bandas se dibujan a la resolución del dispositivo, así que no tienen
 * un tamaño nativo que superar. Además hacen algo que una foto no puede: el
 * scroll las atraviesa. La cámara avanza en Z con la posición de la sección en
 * pantalla, de modo que bajar por la página es literalmente entrar en el campo.
 *
 * Variantes, tomadas del lenguaje visual de la marca:
 *
 *   plexus   — nodos conectados; la red que se densifica al acercarse.
 *   corridor — retícula en perspectiva; el viaje hacia el punto de fuga.
 *   streams  — flujos de luz y datos que cruzan de lado a lado.
 *   circuit  — trazas ortogonales con pulsos hacia un núcleo.
 *   dust     — campo de partículas con profundidad de campo.
 *
 * Coste: un canvas 2D por banda, con el bucle parado mientras la banda está
 * fuera de pantalla, DPR limitado a 1.5 y el número de elementos acotado. Con
 * prefers-reduced-motion se dibuja un fotograma y se detiene: la banda sigue
 * existiendo, deja de moverse.
 */

const DPR_CAP = 1.5;

/* Los colores salen de las variables del documento, no de literales: si la
   paleta cambia en tokens/, estas bandas cambian con ella. */
function palette(el) {
  const cs = getComputedStyle(el);
  const v = (n, fallback) => (cs.getPropertyValue(n) || '').trim() || fallback;
  return {
    bg: v('--navy-950', '#05070f'),
    green: v('--electric-green', '#00ff88'),
    neon: v('--neon-green', '#00ffaa'),
    /* --ice-blue es casi blanco (#E0F7FF): en la paleta es el 10% de destello,
       no un segundo color de campo. Usarlo como tal dejaba las bandas grises.
       El segundo tono es --neon-green; el hielo queda para las chispas. */
    ice: v('--ice-blue', '#e0f7ff'),
  };
}

/* rgba() a partir de un hex de token, para poder modular alfa por profundidad */
function rgba(hex, a) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const i = parseInt(n, 16);
  return `rgba(${(i >> 16) & 255},${(i >> 8) & 255},${i & 255},${a})`;
}

/* ---------------- escenas ---------------- */

function makePlexus(rnd) {
  const N = 170;
  return Array.from({ length: N }, () => ({
    x: rnd() * 2 - 1,
    y: rnd() * 2 - 1,
    z: rnd(),
    vx: (rnd() - 0.5) * 0.00016,
    vy: (rnd() - 0.5) * 0.00016,
    hub: rnd() < 0.09,
  }));
}

function drawPlexus(ctx, w, h, pts, t, depth, c) {
  const cx = w / 2;
  const cy = h / 2;
  /* La distancia focal sigue al ancho, no al lado corto: con el lado corto la
     nube se apelotonaba en el centro de una banda apaisada y dejaba los bordes
     vacíos. */
  const fx = w * 0.78;
  const fy = h * 0.82;
  const proj = [];

  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x > 1 || p.x < -1) p.vx *= -1;
    if (p.y > 1 || p.y < -1) p.vy *= -1;
    /* z avanza con el scroll: el campo se atraviesa, no se mira */
    const z = (p.z + depth) % 1;
    const s = 0.5 + z * 1.7;
    proj.push({
      sx: cx + p.x * fx * s * 0.5,
      sy: cy + p.y * fy * s * 0.5,
      /* cerca = grande y opaco; lejos = punto tenue */
      r: (p.hub ? 3.6 : 1.7) * s,
      a: Math.min(1, z * 2.6) * (1 - z * 0.22),
      hub: p.hub,
    });
  }

  /* Aristas antes que nodos: las líneas quedan por debajo, como en la
     referencia, y los nodos brillantes las cortan. */
  const link = Math.min(w, h) * 0.30;
  ctx.lineWidth = 1;
  for (let i = 0; i < proj.length; i++) {
    for (let j = i + 1; j < proj.length; j++) {
      const dx = proj[i].sx - proj[j].sx;
      const dy = proj[i].sy - proj[j].sy;
      const d = Math.hypot(dx, dy);
      if (d > link) continue;
      const a = (1 - d / link) * 0.62 * Math.min(proj[i].a, proj[j].a);
      if (a < 0.012) continue;
      ctx.strokeStyle = rgba(c.green, a);
      ctx.beginPath();
      ctx.moveTo(proj[i].sx, proj[i].sy);
      ctx.lineTo(proj[j].sx, proj[j].sy);
      ctx.stroke();
    }
  }

  for (const p of proj) {
    if (p.a <= 0.02) continue;
    if (p.hub) {
      const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, p.r * 7);
      g.addColorStop(0, rgba(c.green, p.a * 0.9));
      g.addColorStop(1, rgba(c.green, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, p.r * 7, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!p.hub && p.a > 0.3) {
      const g2 = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, p.r * 4);
      g2.addColorStop(0, rgba(c.green, p.a * 0.34));
      g2.addColorStop(1, rgba(c.green, 0));
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(p.sx, p.sy, p.r * 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = rgba(p.hub ? c.green : c.ice, p.a * (p.hub ? 1 : 0.8));
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function makeCorridor(rnd) {
  /* Bloques a ambos lados del pasillo. El hueco central se respeta siempre:
     es por donde entra la mirada, y donde va el titular. */
  return Array.from({ length: 26 }, (_, i) => ({
    side: i % 2 ? 1 : -1,
    off: 0.28 + rnd() * 0.5,
    w: 0.1 + rnd() * 0.16,
    h: 0.2 + rnd() * 0.62,
    z: (i / 26) + rnd() * 0.03,
  }));
}

function drawCorridor(ctx, w, h, blocks, t, depth, c) {
  const cx = w / 2;
  const hz = h * 0.44;            // horizonte
  const f = w * 0.5;
  const P = (x, y, z) => {
    const s = f / Math.max(z, 0.001);
    return [cx + x * s, hz + y * s];
  };
  const travel = (depth * 4 + t * 0.06) % 1;

  ctx.lineWidth = 1;

  /* Suelo: líneas de fuga y travesaños que se acercan */
  ctx.strokeStyle = rgba(c.green, 0.34);
  for (let i = -7; i <= 7; i++) {
    const x = i * 0.16;
    const [ax, ay] = P(x, 0.5, 0.06);
    const [bx, by] = P(x, 0.5, 3.4);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  for (let i = 0; i < 22; i++) {
    const z = ((i - travel) * 0.16) + 0.08;
    if (z < 0.06) continue;
    const a = Math.max(0, 0.6 - z * 0.16);
    if (a < 0.01) continue;
    ctx.strokeStyle = rgba(c.green, a);
    const [ax, ay] = P(-1.2, 0.5, z);
    const [bx, by] = P(1.2, 0.5, z);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    /* Vértices de la retícula: la referencia los tiene, y son los que hacen
       legible la velocidad al pasar el suelo por debajo. */
    ctx.fillStyle = rgba(c.green, a * 1.3);
    for (let k = -7; k <= 7; k++) {
      const [vx, vy] = P(k * 0.16, 0.5, z);
      /* Tope al radio: sin él los vértices cercanos crecían hasta 11 px y en
         móvil se comían la retícula que están ahí para marcar. */
      ctx.beginPath(); ctx.arc(vx, vy, Math.min(3.4, Math.max(0.8, 2.2 / Math.max(z, 0.2))), 0, Math.PI * 2); ctx.fill();
    }
  }

  /* Bloques: solo aristas, como en la referencia — el volumen se sugiere */
  for (const b of blocks) {
    const z = ((b.z - travel) * 3.2 + 3.2) % 3.2 + 0.12;
    const a = Math.max(0, 0.78 - z * 0.2);
    if (a < 0.015) continue;
    ctx.strokeStyle = rgba(c.green, a);
    const x0 = b.side * b.off;
    const x1 = x0 + b.side * b.w;
    const [ax, ay] = P(x0, 0.5, z);
    const [bx, by] = P(x1, 0.5, z);
    const [, ty] = P(x0, 0.5 - b.h, z);
    ctx.beginPath();
    ctx.rect(Math.min(ax, bx), ty, Math.abs(bx - ax), ay - ty);
    ctx.stroke();
    /* Vértices marcados: es lo que da la lectura de "wireframe" y no de caja */
    ctx.fillStyle = rgba(c.green, a);
    for (const [vx, vy] of [[ax, ay], [bx, by], [ax, ty], [bx, ty]]) {
      ctx.beginPath(); ctx.arc(vx, vy, 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }

  /* Punto de fuga: el destino, encendido */
  const g = ctx.createRadialGradient(cx, hz, 0, cx, hz, w * 0.075);
  g.addColorStop(0, rgba(c.ice, 1));
  g.addColorStop(0.06, rgba(c.green, 0.72));
  g.addColorStop(0.3, rgba(c.green, 0.16));
  g.addColorStop(1, rgba(c.green, 0));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, hz, w * 0.075, 0, Math.PI * 2); ctx.fill();
}

function makeStreams(rnd) {
  return Array.from({ length: 26 }, (_, i) => ({
    y: rnd(),
    amp: 0.05 + rnd() * 0.16,
    freq: 1.1 + rnd() * 2.1,
    phase: rnd() * Math.PI * 2,
    speed: 0.1 + rnd() * 0.34,
    alt: i % 3 === 0,
    spark: i % 7 === 0,
    dotted: rnd() < 0.42,
    wt: 0.8 + rnd() * 2.6,
  }));
}

function drawStreams(ctx, w, h, lines, t, depth, c) {
  const shift = depth * 2 + t * 0.05;
  ctx.lineCap = 'round';
  for (const L of lines) {
    const col = L.spark ? c.ice : L.alt ? c.neon : c.green;
    const y0 = ((L.y + shift * L.speed * 0.3) % 1.2 - 0.1) * h;
    /* Halo bajo el trazo: es lo que convierte una curva en un haz de luz */
    if (!L.dotted) {
      ctx.strokeStyle = rgba(col, 0.1);
      ctx.lineWidth = L.wt * 5;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 10) {
        const u = px / w;
        const y = y0 + Math.sin(u * L.freq * Math.PI * 2 + L.phase + t * L.speed) * L.amp * h;
        if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = rgba(col, L.dotted ? 0 : 0.72);
    ctx.lineWidth = L.wt;
    ctx.beginPath();
    for (let px = 0; px <= w; px += 8) {
      const u = px / w;
      const y = y0 + Math.sin(u * L.freq * Math.PI * 2 + L.phase + t * L.speed) * L.amp * h;
      if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    if (!L.dotted) ctx.stroke();
    else {
      /* Las líneas punteadas son las que llevan el dato: puntos discretos
         viajando, no un trazo continuo. */
      for (let px = 0; px <= w; px += 13) {
        const u = px / w;
        const y = y0 + Math.sin(u * L.freq * Math.PI * 2 + L.phase + t * L.speed) * L.amp * h;
        const a = 0.3 + 0.6 * Math.abs(Math.sin(u * 9 - t * L.speed * 3));
        ctx.fillStyle = rgba(col, a);
        ctx.beginPath(); ctx.arc(px, y, L.wt * 0.9, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
}

function makeCircuit(rnd) {
  /* Trazas en ángulo recto que salen del núcleo: un codo por traza basta para
     leerse como circuito sin convertirse en ruido. */
  return Array.from({ length: 22 }, (_, i) => {
    const dir = i % 4;
    return {
      dir,
      lane: (rnd() * 2 - 1) * 0.86,
      elbow: 0.16 + rnd() * 0.3,
      len: 0.55 + rnd() * 0.5,
      wt: rnd() < 0.3 ? 2.4 : 1.2,
      pulse: rnd(),
      speed: 0.16 + rnd() * 0.4,
    };
  });
}

function drawCircuit(ctx, w, h, traces, t, depth, c) {
  const cx = w / 2;
  const cy = h / 2;
  const core = Math.min(w, h) * 0.11;

  for (const tr of traces) {
    const horiz = tr.dir < 2;
    const sign = tr.dir % 2 ? 1 : -1;
    const path = [];
    if (horiz) {
      const y = cy + tr.lane * h * 0.42;
      path.push([cx + sign * core, cy]);
      path.push([cx + sign * (core + tr.elbow * w), cy]);
      path.push([cx + sign * (core + tr.elbow * w), y]);
      path.push([cx + sign * (core + tr.len * w), y]);
    } else {
      const x = cx + tr.lane * w * 0.44;
      path.push([cx, cy + sign * core]);
      path.push([cx, cy + sign * (core + tr.elbow * h)]);
      path.push([x, cy + sign * (core + tr.elbow * h)]);
      path.push([x, cy + sign * (core + tr.len * h)]);
    }

    ctx.strokeStyle = rgba(c.green, 0.4);
    ctx.lineWidth = tr.wt;
    ctx.beginPath();
    path.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();

    /* El pulso es lo que hace que el circuito esté vivo y no impreso */
    const u = (tr.pulse + t * tr.speed + depth) % 1;
    const seg = u * 3;
    const i0 = Math.min(2, Math.floor(seg));
    const k = seg - i0;
    const px = path[i0][0] + (path[i0 + 1][0] - path[i0][0]) * k;
    const py = path[i0][1] + (path[i0 + 1][1] - path[i0][1]) * k;
    const g = ctx.createRadialGradient(px, py, 0, px, py, 16);
    g.addColorStop(0, rgba(c.green, 0.95));
    g.addColorStop(1, rgba(c.green, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill();
  }

  /* Núcleo */
  ctx.strokeStyle = rgba(c.green, 0.6);
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - core, cy - core, core * 2, core * 2);
  const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, core * 2.4);
  gg.addColorStop(0, rgba(c.green, 0.3));
  gg.addColorStop(1, rgba(c.green, 0));
  ctx.fillStyle = gg;
  ctx.beginPath(); ctx.arc(cx, cy, core * 2.4, 0, Math.PI * 2); ctx.fill();
}

function makeDust(rnd) {
  /* Dos poblaciones: el bokeh grande disperso y una cresta diagonal de granos
     finos. La cresta es lo que da dirección al campo; sin ella son puntos. */
  const big = Array.from({ length: 60 }, () => ({
    x: rnd(), y: rnd(), z: rnd(), alt: rnd() < 0.45,
    drift: (rnd() - 0.5) * 0.05, ridge: false,
  }));
  const fine = Array.from({ length: 190 }, () => {
    const u = rnd();
    return {
      x: u,
      y: 0.62 - u * 0.34 + (rnd() - 0.5) * 0.2,
      z: 0.15 + rnd() * 0.35, alt: rnd() < 0.5,
      drift: (rnd() - 0.5) * 0.02, ridge: true,
    };
  });
  return [...fine, ...big];
}

function drawDust(ctx, w, h, pts, t, depth, c) {
  for (const p of pts) {
    const z = (p.z + depth * 1.4 + t * 0.008) % 1;
    const s = 0.2 + z * 2.4;
    const x = ((p.x + p.drift * t * 0.02) % 1) * w;
    const y = ((p.y + (1 - z) * 0.12) % 1) * h;
    /* Lo cercano se desenfoca: es lo que convierte puntos en bokeh */
    const r = p.ridge ? Math.max(1, s * 1.4) : s * 7;
    const a = (1 - Math.abs(z - 0.45) * 1.3) * (p.ridge ? 1.05 : 0.85);
    if (a <= 0.01) continue;
    const col = p.alt ? c.neon : c.green;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(col, Math.min(1, a * 1.15)));
    g.addColorStop(0.5, rgba(col, a * 0.42));
    g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    /* Núcleo sólido dentro del halo: sin él el bokeh se lee como niebla */
    if (!p.ridge) {
      ctx.fillStyle = rgba(col, Math.min(1, a * 1.5));
      ctx.beginPath(); ctx.arc(x, y, Math.max(1, r * 0.16), 0, Math.PI * 2); ctx.fill();
    }
  }
}

const SCENES = {
  plexus: [makePlexus, drawPlexus],
  corridor: [makeCorridor, drawCorridor],
  streams: [makeStreams, drawStreams],
  circuit: [makeCircuit, drawCircuit],
  dust: [makeDust, drawDust],
};

/* Aleatoriedad reproducible: dos recargas de la misma página deben dar la
   misma composición, si no la banda "salta" al navegar hacia atrás. */
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function Field({ variant = 'plexus', seed = 7, depthRef, className, style }) {
  const reduced = useReducedMotion();
  const hostRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const [make, draw] = SCENES[variant] || SCENES.plexus;
    const items = make(seeded(seed));
    const c = palette(host);

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* Progreso de la banda por la ventana, 0 al entrar y 1 al salir. Es lo que
       convierte el scroll en avance de cámara. */
    let depth = 0;
    const readDepth = () => {
      /* Si el contenedor es sticky su rect no se mueve con el scroll, así que
         el avance tiene que venir de fuera. Ahí el padre pasa un ref y manda
         él. */
      if (depthRef) { depth = depthRef.current || 0; return; }
      const r = host.getBoundingClientRect();
      const span = window.innerHeight + r.height;
      depth = Math.min(1, Math.max(0, (window.innerHeight - r.top) / span));
    };

    const frame = (ms) => {
      readDepth();
      const t = ms / 1000;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, w, h);
      draw(ctx, w, h, items, t, depth, c);
    };

    if (reduced) {
      /* Un fotograma en el punto medio: la banda se ve, no se mueve */
      depth = 0.5;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, w, h);
      draw(ctx, w, h, items, 0, 0.5, c);
      const ro = new ResizeObserver(() => { resize(); ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h); draw(ctx, w, h, items, 0, 0.5, c); });
      ro.observe(host);
      return () => ro.disconnect();
    }

    let raf = 0;
    let running = false;
    const loop = (ms) => { frame(ms); raf = requestAnimationFrame(loop); };
    /* Fuera de pantalla el bucle se para del todo: cinco bandas animando a la
       vez mientras nadie las mira es el camino más corto a un scroll a tirones. */
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { rootMargin: '120px' });
    io.observe(host);

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [variant, seed, reduced, depthRef]);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--navy-950)', ...style }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
