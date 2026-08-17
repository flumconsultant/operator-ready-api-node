import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * El reveal al entrar en viewport. En los artboards Durable era una animación
 * CSS (`@keyframes omreveal`) que disparaba en carga, no al hacer scroll: los
 * bloques del pie de página terminaban de animar antes de que nadie los viera.
 * Aquí dispara cuando el elemento entra en pantalla, una sola vez.
 *
 * `as` conserva la etiqueta semántica del artboard original (section, article,
 * a, h2...) o acepta un componente — <Link> en los enlaces internos.
 */
export default function Reveal({ as = 'div', children, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = React.useMemo(() => motion.create(as), [as]);

  if (reduced) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }

  return (
    <Tag
      data-reveal-el=""
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
