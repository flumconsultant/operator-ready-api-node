import React from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';

/**
 * La entrada al aparecer en pantalla.
 *
 * Antes era una sola animación para todo el sitio: doce píxeles de subida y
 * medio segundo, igual para un titular que para la duodécima fila de una tabla.
 * Eso es lo que hacía que el scroll se sintiera plano — no faltaba movimiento,
 * faltaba jerarquía en el movimiento.
 *
 * Ahora hay tres decisiones dentro:
 *
 *   · Muelle en vez de curva fija. Una curva bezier llega y se detiene; un
 *     muelle llega, se pasa un poco y se asienta. Es la diferencia entre algo
 *     colocado y algo que ha aterrizado.
 *   · Entra desde abajo y desde algo más lejos (escala 0,985): el eje Z del
 *     resto del sitio también manda aquí, así que los bloques llegan desde el
 *     fondo en vez de deslizarse en plano.
 *   · Retardo por posición. Los elementos de una rejilla no aparecen a la vez:
 *     se escalonan 45 ms cada uno hasta el octavo. Más allá del octavo el
 *     escalonado deja de leerse como secuencia y empieza a leerse como retraso,
 *     así que el retardo se corta ahí.
 *
 * El índice lo inyecta `Cols`; una fila suelta no lo necesita.
 */

const STEP = 0.045;   // s entre elementos de una misma rejilla
const MAX_STEPS = 8;  // a partir de aquí el escalonado se lee como lentitud

export default function Reveal({ as = 'div', index = 0, children, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = React.useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  return (
    <Tag
      data-reveal-el=""
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{
        type: 'spring', stiffness: 120, damping: 20, mass: 0.9,
        delay: Math.min(index, MAX_STEPS) * STEP,
        opacity: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1], delay: Math.min(index, MAX_STEPS) * STEP },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
