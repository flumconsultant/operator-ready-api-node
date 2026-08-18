import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Field from './Field.jsx';

/**
 * El tramo inmersivo: el único sitio del sitio donde el scroll no mueve la
 * página, mueve la cámara.
 *
 * La sección mide varias pantallas de alto pero su contenido está fijo con
 * `sticky`, así que durante ese recorrido la vista se queda quieta y lo que
 * avanza es el campo: se entra por el pasillo y se sale por el otro lado. Es
 * deliberadamente el único momento así de la página. Un sitio entero con este
 * comportamiento se vuelve imposible de recorrer —nadie sabe cuánto falta— y
 * deja de sorprender a la segunda vez.
 *
 * Los tres mensajes se relevan por tramos de ese avance, no por temporizador:
 * quien sube vuelve a verlos en orden inverso, y quien va rápido no se pierde
 * ninguno a medias.
 *
 * Salvaguardas:
 *   · Con prefers-reduced-motion la sección colapsa a una pantalla y muestra
 *     los tres mensajes a la vez. No hay contenido solo accesible moviéndose.
 *   · El texto está siempre en el DOM; los relevos son opacidad, no montaje.
 *   · No se secuestra el scroll: la rueda y la barra siguen respondiendo con la
 *     velocidad del sistema. Lo único que hace la sección es ser alta.
 */
export default function ScrollStage({ variant = 'corridor', seed = 3, steps, height = '300vh' }) {
  const reduced = useReducedMotion();
  const ref = React.useRef(null);
  const depthRef = React.useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  /* El campo se dibuja en canvas, fuera de React: recibe el avance por ref para
     no provocar un render por fotograma. */
  useMotionValueEvent(scrollYProgress, 'change', (v) => { depthRef.current = v; });

  if (reduced) {
    return (
      <section style={{ position: 'relative', minHeight: '70vh', overflow: 'hidden', background: 'var(--navy-950)' }}>
        <Field variant={variant} seed={seed} />
        <div style={{ position: 'relative', display: 'grid', gap: 'var(--space-9)', alignContent: 'center', minHeight: '70vh', padding: 'var(--space-12) var(--gutter-page)' }}>
          <div style={{ maxWidth: 'var(--maxw-content)', margin: '0 auto', width: '100%', display: 'grid', gap: 'var(--space-8)' }}>
            {steps.map((s) => <StepText key={s.title} step={s} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ position: 'relative', height }}>
      <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden', background: 'var(--navy-950)' }}>
        <Field variant={variant} seed={seed} depthRef={depthRef} />
        <span
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(130% 90% at 50% 50%, rgba(5,7,15,0) 0%, rgba(5,7,15,.72) 78%)' }}
        />
        <div style={{ position: 'relative', height: '100%', display: 'grid', alignContent: 'center', padding: '0 var(--gutter-page)' }}>
          <div style={{ maxWidth: 'var(--maxw-content)', margin: '0 auto', width: '100%', position: 'relative' }}>
            {steps.map((s, i) => (
              <Relay key={s.title} step={s} index={i} count={steps.length} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        <Progress progress={scrollYProgress} />
      </div>
    </section>
  );
}

function StepText({ step, style }) {
  return (
    <div style={style}>
      <p style={{ margin: 0, font: 'var(--type-mono)', letterSpacing: 'var(--track-mono)', color: 'var(--electric-green)' }}>
        {step.kicker}
      </p>
      <h2
        style={{
          margin: 'var(--space-5) 0 0', maxWidth: '17ch',
          fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)',
          fontSize: 'var(--text-display)', lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--track-display)', color: 'var(--white)',
        }}
      >
        {step.title}
      </h2>
      {step.line && (
        <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-lead)', color: 'var(--slate-100)', maxWidth: '46ch' }}>
          {step.line}
        </p>
      )}
    </div>
  );
}

/* Cada mensaje ocupa su tercio del recorrido: entra desde el fondo, se sostiene
   y se va hacia el frente, para que el relevo se lea como avance y no como un
   carrusel. */
function Relay({ step, index, count, progress }) {
  const w = 1 / count;
  const a = index * w;
  const b = a + w;

  /* Los tramos se recortan a [0,1] y se fuerzan crecientes. framer enlaza estos
     rangos a una animación del navegador, y esa API rechaza un desplazamiento
     fuera de [0,1] o fuera de orden: el primer y el último mensaje, que se
     salían por los extremos, tiraban la página entera al montarla. */
  const stops = clampStops([a - w * 0.28, a + w * 0.2, b - w * 0.2, b + w * 0.14]);

  /* Los extremos no se desvanecen. El primer mensaje tiene que estar legible en
     el instante en que la sección se fija —si entra desde cero, quien llega ve
     una pantalla vacía— y el último tiene que aguantar hasta que el escenario
     se va físicamente hacia arriba, porque el avance llega a 1 antes de que eso
     ocurra y el bloque se quedaba en blanco al final. */
  const first = index === 0;
  const last = index === count - 1;

  /* La presencia se calcula con una función, no con un rango de cuatro paradas.
     Con el rango, framer entrega la interpolación a la animación nativa del
     navegador, y esa ruta no reproducía un "mantener y luego caer": el primer
     mensaje volvía a aparecer al final del recorrido, encima del último.
     Medido en el navegador: opacidad 0,98 donde el rango pedía 0. */
  const presence = React.useCallback((v) => {
    const [s0, s1, s2, s3] = stops;
    if (v <= s0) return first ? 1 : 0;
    if (v < s1) return first ? 1 : (v - s0) / (s1 - s0);
    if (v <= s2) return 1;
    if (v < s3) return last ? 1 : 1 - (v - s2) / (s3 - s2);
    return last ? 1 : 0;
  }, [stops[0], stops[1], stops[2], stops[3], first, last]); // eslint-disable-line react-hooks/exhaustive-deps

  const opacity = useTransform(progress, presence);
  const blur = useTransform(progress, (v) => (1 - presence(v)) * 5);
  const scale = useTransform(progress, [a, b], [0.9, 1.16]);
  const y = useTransform(progress, [a, b], [70, -70]);
  /* `blur(0px)` sigue creando una capa compuesta, y sobre el canvas eso dejaba
     un fantasma del titular al detenerse. En reposo no hay filtro. */
  const filter = useTransform(blur, (v) => (v < 0.08 ? 'none' : `blur(${v.toFixed(2)}px)`));

  return (
    <motion.div
      style={{
        gridArea: '1 / 1',
        position: index === 0 ? 'relative' : 'absolute',
        inset: index === 0 ? undefined : 0,
        opacity, scale, y, filter,
        transformOrigin: 'left center',
        willChange: 'transform, opacity',
      }}
    >
      <StepText step={step} />
    </motion.div>
  );
}

/* Recorta a [0,1] y garantiza que cada parada supere a la anterior; un rango de
   entrada plano o descendente rompe tanto la interpolación como la API de
   animación del navegador. */
function clampStops(list) {
  const out = [];
  let prev = -Infinity;
  list.forEach((v, i) => {
    const c = Math.min(1, Math.max(0, v));
    const safe = c > prev ? c : Math.min(1, prev + 1e-4 * (i + 1));
    out.push(safe);
    prev = safe;
  });
  return out;
}

/* Marca de avance del tramo: sin ella la sección alta se lee como una página
   que no termina. */
function Progress({ progress }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: 'var(--gutter-page)', right: 'var(--gutter-page)', bottom: 'var(--space-7)' }}>
      <div style={{ height: 2, background: 'var(--border-hairline-dark)' }}>
        <motion.div style={{ height: '100%', background: 'var(--electric-green)', transformOrigin: 'left', scaleX }} />
      </div>
    </div>
  );
}
