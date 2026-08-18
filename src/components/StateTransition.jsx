import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * La transición C → O.
 *
 * Es la marca explicándose a sí misma: la C y la O de BECOME dejan de ser dos
 * letras y pasan a ser dos estados de la misma empresa. La C está abierta —le
 * falta un trozo, es lo que hoy no cierra— y la O está completa. Entre las dos,
 * la línea verde de 3 px, que es el trabajo.
 *
 * Se anima al entrar en pantalla: la C aparece, la línea crece de izquierda a
 * derecha y la O cierra el círculo detrás. Con prefers-reduced-motion se pinta
 * el estado final sin recorrido — la idea se entiende igual, que es la prueba
 * de que la animación explica y no decora.
 *
 * Las dos letras se dibujan con SVG y no con texto: una fuente distinta en el
 * equipo de quien mira cambiaría el grosor del trazo y con él el sentido.
 */

const EASE = [0.2, 0.7, 0.2, 1];

export default function StateTransition({ dark = true }) {
  const reduced = useReducedMotion();
  const ink = dark ? 'var(--white)' : 'var(--deep-navy)';
  const label = dark ? 'var(--slate-300)' : 'var(--text-muted)';
  const caption = dark ? 'var(--slate-400)' : 'var(--text-faint)';

  const show = reduced ? {} : { initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '0px 0px -18% 0px' } };

  return (
    <figure
      style={{
        margin: 0,
        display: 'grid',
        justifyItems: 'center',
        gap: 'var(--space-7)',
      }}
    >
      <motion.svg
        {...show}
        viewBox="0 0 420 160"
        role="img"
        aria-label="La C de current state se transforma en la O de future state"
        style={{ width: 'min(420px, 100%)', height: 'auto', overflow: 'visible' }}
      >
        {/* C — estado actual. El arco no cierra: ese hueco es el problema. */}
        <motion.path
          d="M104 26 A54 54 0 1 0 104 134"
          fill="none"
          stroke={ink}
          strokeWidth="26"
          strokeLinecap="butt"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 1, transition: { duration: 0.8, ease: EASE } },
          }}
        />

        {/* La línea verde: el trabajo que lleva de un estado al otro */}
        <motion.rect
          x="168" y="76.5" height="7" rx="3.5"
          fill="url(#becomeFlow)"
          variants={{
            hidden: { width: 0, opacity: 0 },
            shown: { width: 84, opacity: 1, transition: { duration: 0.55, ease: EASE, delay: 0.5 } },
          }}
        />

        {/* O — estado futuro. El círculo cerrado. */}
        <motion.circle
          cx="342" cy="80" r="54"
          fill="none"
          stroke={ink}
          strokeWidth="26"
          transform="rotate(-90 342 80)"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.75 } },
          }}
        />

        <defs>
          <linearGradient id="becomeFlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--deep-navy)" stopOpacity="0.15" />
            <stop offset="45%" stopColor="var(--electric-green)" />
            <stop offset="100%" stopColor="var(--neon-green)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Etiqueta de la línea, como en el diagrama de marca */}
      <motion.p
        {...show}
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 1.1, duration: 0.4 } } }}
        style={{
          margin: 0,
          font: 'var(--type-mono)',
          fontSize: 'var(--text-micro)',
          letterSpacing: 'var(--track-mono)',
          color: caption,
          textAlign: 'center',
        }}
      >
        3 px · gradient line
      </motion.p>

      <figcaption
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 'var(--space-6)',
          width: 'min(420px, 100%)',
          font: 'var(--type-label)',
          letterSpacing: 'var(--track-label)',
          textTransform: 'uppercase',
          color: label,
        }}
      >
        <span style={{ textAlign: 'left' }}>Current state (C)</span>
        <span aria-hidden="true" style={{ color: 'var(--electric-green)' }}>→</span>
        <span style={{ textAlign: 'right' }}>Future state (O)</span>
      </figcaption>
    </figure>
  );
}
