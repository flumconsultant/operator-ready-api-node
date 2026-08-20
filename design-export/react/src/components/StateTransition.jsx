import React from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';

/**
 * La transición C → O.
 *
 * Es la marca explicándose a sí misma: la C y la O de BECOME dejan de ser dos
 * letras y pasan a ser dos estados de la misma empresa. La C está abierta —le
 * falta un trozo, es lo que hoy no cierra— y la O está completa. Entre las dos,
 * la línea que sale de la boca de la C y entra en la O: eso es el trabajo.
 *
 * La abertura de la C es deliberadamente pequeña (±35°): con un hueco mayor la
 * letra deja de leerse como una C y pasa a leerse como un arco cualquiera, que
 * es exactamente lo que rompía el sentido. El trazo es grueso por el mismo
 * motivo — a 26 px sobre 54 de radio la letra pesaba menos que la línea.
 *
 * Se anima al entrar en pantalla: la C aparece, la línea sale del hueco y cruza
 * hasta tocar la O, y la O cierra el círculo. Con prefers-reduced-motion se
 * pinta el estado final sin recorrido — la idea se entiende igual, que es la
 * prueba de que la animación explica y no decora.
 *
 * Las dos letras se dibujan con SVG y no con texto: una fuente distinta en el
 * equipo de quien mira cambiaría el grosor del trazo y con él el sentido.
 */

const EASE = [0.2, 0.7, 0.2, 1];

// Geometría compartida: la boca de la C y el borde de la O definen el trayecto.
const C_CX = 80;
const O_CX = 340;
const CY = 80;
const R = 54;
const STROKE = 34;
const MOUTH_X = 124;              // punto donde abre la C
const O_EDGE = O_CX - R - STROKE / 2 + 2; // borde exterior de la O
const RUN = O_EDGE - MOUTH_X;

export default function StateTransition({ dark = true }) {
  const reduced = useReducedMotion();
  const ink = dark ? 'var(--white)' : 'var(--deep-navy)';
  const label = dark ? 'var(--slate-300)' : 'var(--text-muted)';

  const show = reduced ? {} : { initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '0px 0px -18% 0px' } };

  return (
    <figure style={{ margin: 0, display: 'grid', justifyItems: 'center', gap: 'var(--space-7)' }}>
      <motion.svg
        {...show}
        viewBox="0 0 420 160"
        role="img"
        aria-label="La C de current state se transforma en la O de future state"
        style={{ width: 'min(460px, 100%)', height: 'auto', overflow: 'visible' }}
      >
        {/* C — estado actual. El arco no cierra: ese hueco es el problema. */}
        <motion.path
          d={`M${MOUTH_X} ${CY - 31} A${R} ${R} 0 1 0 ${MOUTH_X} ${CY + 31}`}
          fill="none"
          stroke={ink}
          strokeWidth={STROKE}
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 1, transition: { duration: 0.8, ease: EASE } },
          }}
        />

        {/* La línea: sale de la boca de la C y llega hasta tocar la O. */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            shown: { opacity: 1, transition: { duration: 0.2, delay: 0.5 } },
          }}
        >
          <motion.rect
            x={MOUTH_X} y={CY - 7} height="14" rx="7"
            fill="url(#becomeFlow)"
            variants={{
              hidden: { width: 0 },
              shown: { width: RUN, transition: { duration: 0.6, ease: EASE, delay: 0.5 } },
            }}
          />
          <motion.path
            d={`M${O_EDGE - 20} ${CY - 15} L${O_EDGE + 3} ${CY} L${O_EDGE - 20} ${CY + 15} Z`}
            fill="var(--neon-green)"
            variants={{
              hidden: { opacity: 0, x: -22 },
              shown: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE, delay: 1 } },
            }}
          />
        </motion.g>

        {/* O — estado futuro. El círculo cerrado. */}
        <motion.circle
          cx={O_CX} cy={CY} r={R}
          fill="none"
          stroke={ink}
          strokeWidth={STROKE}
          strokeLinecap="round"
          transform={`rotate(-90 ${O_CX} ${CY})`}
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.9 } },
          }}
        />

        <defs>
          <linearGradient id="becomeFlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--electric-green)" stopOpacity="0.35" />
            <stop offset="45%" stopColor="var(--electric-green)" />
            <stop offset="100%" stopColor="var(--neon-green)" />
          </linearGradient>
        </defs>
      </motion.svg>

      <figcaption
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 'var(--space-6)',
          width: 'min(460px, 100%)',
          font: 'var(--type-label)',
          letterSpacing: 'var(--track-label)',
          textTransform: 'uppercase',
          color: label,
        }}
      >
        <span style={{ textAlign: 'left' }}>Current state (C)</span>
        {/* El verde puro sobre el fondo claro da 1,28:1. El token de acento ya
            resuelve el verde legible de cada tema; el literal no. */}
        <span aria-hidden="true" style={{ color: dark ? 'var(--electric-green)' : 'var(--text-accent)' }}>→</span>
        <span style={{ textAlign: 'right' }}>Future state (O)</span>
      </figcaption>
    </figure>
  );
}
