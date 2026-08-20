import React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Retícula que se deforma hacia el puntero y ondea al tocarla.
 * (Adaptación del componente "KineticGrid".)
 *
 * Va donde alguien está eligiendo, no donde está leyendo: la retícula responde
 * al cursor, así que su sitio es la página en la que hay que decidir entre
 * varias opciones. Ahí el fondo confirma que la página está viva y reaccionando
 * a ti; debajo de un párrafo largo sería solo ruido moviéndose.
 *
 * Qué se cambió respecto del original:
 *
 *   · El puntero se lee en coordenadas del contenedor, no de la ventana, y el
 *     canvas no es `fixed`. El original ocupaba la pantalla entera y escuchaba
 *     en `window`: dentro de una página larga eso significa una retícula a
 *     pantalla completa deformándose por movimientos de ratón que ocurren a
 *     tres secciones de distancia.
 *   · `pointer` en vez de `mouse`, así que funciona con dedo y con lápiz. El
 *     original era solo ratón, es decir: en móvil no hacía nada y aun así
 *     gastaba un bucle de animación.
 *   · Al salir el puntero, la deformación vuelve al centro. Antes se quedaba
 *     clavada donde estaba el cursor la última vez.
 *   · Se aplica DPR: sin él la retícula se ve borrosa en cualquier pantalla
 *     moderna.
 *   · El bucle se para cuando la banda no está en pantalla, y también cuando
 *     no hay nada que animar: sin puntero encima y sin ondas, la retícula
 *     queda quieta en vez de repintar sesenta veces por segundo un dibujo
 *     idéntico.
 *   · Los colores salen de tokens/.
 *   · Con prefers-reduced-motion se dibuja la retícula sin deformación y no se
 *     registra ningún gesto. El contenido de encima no depende de ella.
 */

const CELL = 56;
const INFLUENCE = 240;
const MAX_WARP = 22;
const LERP = 0.1;
const DPR_CAP = 2;
const RIPPLE_SPEED = 420;   // px/s
const RIPPLE_FADE = 1.2;    // s
const WAVE_WIDTH = 55;

const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function rgb(hex) {
  const h = hex.replace('#', '').trim();
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const i = parseInt(n, 16);
  return [(i >> 16) & 255, (i >> 8) & 255, i & 255];
}
const mix = (a, b, t, aa, ab) =>
  `rgba(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))},${lerp(aa, ab, t).toFixed(3)})`;

export default function KineticGrid({ style }) {
  const reduced = useReducedMotion();
  const hostRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;

    const cs = getComputedStyle(host);
    const tok = (n, fb) => (cs.getPropertyValue(n) || '').trim() || fb;
    const BG = tok('--navy-950', '#05070f');
    const LINE = rgb(tok('--slate-100', '#e2e8f0'));
    const ACTIVE = rgb(tok('--electric-green', '#00ff88'));
    const GLOW = ACTIVE.join(',');

    /* Fuera de la banda: sin puntero no hay deformación */
    const OFF = { x: -99999, y: -99999 };
    let mouse = { ...OFF };
    let target = { ...OFF };

    /* Deriva de cortesía.
       Una retícula que solo reacciona al puntero es invisible hasta que alguien
       adivina que tiene que mover el ratón por encima — y en una web nadie lo
       adivina: llega, mira el titular, y baja. Así que hasta el primer gesto la
       zona de influencia se pasea sola en una elipse lenta, que es la manera de
       decir "esto responde" sin escribirlo. Al primer movimiento real del
       puntero la deriva se apaga para siempre en esta visita: ya no hace falta
       explicar nada y dos focos a la vez serían ruido. */
    let drifting = true;
    let ripples = [];
    let w = 0, h = 0, dpr = 1;
    let raf = 0, running = false, idleFrames = 0;

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

    const warp = (gx, gy, col, row, cols, rows) => {
      /* Los bordes quedan clavados: sin esto la retícula se despega de los
         lados de la banda y se ve el fondo por debajo. */
      const m = 1.5;
      const cp = Math.min(col / m, (cols - 1 - col) / m, 1);
      const rp = Math.min(row / m, (rows - 1 - row) / m, 1);
      const pin = cp * cp * rp * rp;

      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const dist = Math.hypot(dx, dy);
      const proximity = Math.max(0, 1 - dist / INFLUENCE) * pin;

      let rx = 0, ry = 0;
      for (const r of ripples) {
        const d = Math.hypot(gx - r.x, gy - r.y) - r.radius;
        if (Math.abs(d) >= WAVE_WIDTH) continue;
        const strength = (1 - Math.abs(d) / WAVE_WIDTH) * r.opacity * 18 * pin;
        const ang = Math.atan2(gy - r.y, gx - r.x);
        const sign = d < 0 ? 1 : -1;
        rx += Math.cos(ang) * strength * sign;
        ry += Math.sin(ang) * strength * sign;
      }

      if (dist < INFLUENCE && dist > 0 && pin > 0) {
        const t = dist / INFLUENCE;
        const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        const amt = eased * MAX_WARP * pin;
        const ang = Math.atan2(dy, dx);
        return { x: gx - Math.cos(ang) * amt + rx, y: gy - Math.sin(ang) * amt + ry, p: proximity };
      }
      return { x: gx + rx, y: gy + ry, p: proximity };
    };

    const draw = (now) => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * RIPPLE_SPEED);
        r.opacity = Math.max(0, 1 - age * RIPPLE_FADE);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      const cols = Math.max(2, Math.ceil(w / CELL)) + 1;
      const rows = Math.max(2, Math.ceil(h / CELL)) + 1;
      const cw = w / (cols - 1);
      const ch = h / (rows - 1);

      const pts = [];
      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        for (let col = 0; col < cols; col++) pts[row][col] = warp(col * cw, row * ch, col, row, cols, rows);
      }

      const seg = (a, b) => {
        const t = smooth((a.p + b.p) / 2);
        ctx.strokeStyle = mix(LINE, ACTIVE, t, 0.22, 0.9);
        ctx.lineWidth = lerp(0.8, 1.5, t);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      };
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols - 1; col++) seg(pts[row][col], pts[row][col + 1]);
      for (let col = 0; col < cols; col++) for (let row = 0; row < rows - 1; row++) seg(pts[row][col], pts[row + 1][col]);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const p = pts[row][col];
          const t = smooth(p.p);
          const r = lerp(1.6, 3.2, t);
          if (t > 0.3) {
            const gr = r + lerp(0, 6, (t - 0.3) / 0.7);
            const g = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, gr);
            g.addColorStop(0, `rgba(${GLOW},${(t * 0.34).toFixed(3)})`);
            g.addColorStop(1, `rgba(${GLOW},0)`);
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, gr, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = mix(LINE, ACTIVE, t, 0.34, 1);
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        }
      }

      for (const r of ripples) {
        ctx.strokeStyle = `rgba(${GLOW},${(r.opacity * 0.3).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(r.x, r.y, Math.max(0, r.radius), 0, Math.PI * 2); ctx.stroke();
      }
    };

    if (reduced) {
      draw(0);
      const ro = new ResizeObserver(() => { resize(); draw(0); });
      ro.observe(host);
      return () => ro.disconnect();
    }

    const loop = (now) => {
      if (drifting) {
        const t = now / 1000;
        target = {
          x: w * (0.5 + Math.cos(t * 0.42) * 0.3),
          y: h * (0.5 + Math.sin(t * 0.31) * 0.34),
        };
        if (mouse.x === OFF.x) mouse = { ...target };   // sin barrido inicial
      }
      mouse.x = lerp(mouse.x, target.x, LERP);
      mouse.y = lerp(mouse.y, target.y, LERP);
      draw(now);

      /* Nada que animar: puntero fuera, deformación ya asentada y sin ondas.
         Repintar aquí sería gastar la GPU en redibujar el mismo dibujo. */
      const settled = Math.abs(mouse.x - target.x) < 0.5 && Math.abs(mouse.y - target.y) < 0.5;
      if (!drifting && settled && target.x === OFF.x && ripples.length === 0) idleFrames++;
      else idleFrames = 0;
      if (idleFrames > 4) { running = false; return; }

      raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (!running) { running = true; idleFrames = 0; raf = requestAnimationFrame(loop); } };

    /* Se escucha en la ventana y se convierte a coordenadas de la banda, en vez
       de escuchar en el propio contenedor. El motivo es que el contenido de la
       sección va por encima de este fondo: con los oyentes en el fondo, todo
       gesto que ocurra sobre el titular o los botones —o sea, casi todos— no
       llegaba nunca y la retícula se quedaba quieta justo donde importa.
       El filtro por límites evita lo contrario: que reaccione a movimientos que
       pasan tres secciones más abajo. */
    const local = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      return { x, y, inside };
    };
    const onMove = (e) => {
      const p = local(e);
      drifting = false;
      target = p.inside ? { x: p.x, y: p.y } : { ...OFF };
      wake();
    };
    const onLeave = () => { target = { ...OFF }; wake(); };
    const onDown = (e) => {
      const p = local(e);
      if (!p.inside) return;
      drifting = false;
      ripples.push({ x: p.x, y: p.y, radius: 0, opacity: 1, born: performance.now() });
      if (ripples.length > 6) ripples.shift();   // tope: una ola por clic, no cien
      wake();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('blur', onLeave);

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) wake();
      else { running = false; cancelAnimationFrame(raf); if (!drifting) { target = { ...OFF }; mouse = { ...OFF }; } }
    }, { rootMargin: '100px' });
    io.observe(host);

    const ro = new ResizeObserver(() => { resize(); wake(); });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: 'var(--navy-950)',
        /* La banda escucha el puntero, pero no se lo quita a nada: el contenido
           va en otra capa por encima y con sus propios eventos. */
        touchAction: 'pan-y',
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
