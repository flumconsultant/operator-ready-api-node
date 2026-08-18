import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Field from './Field.jsx';

/**
 * Imagen de marca.
 *
 * Las fotografías del sitio no son ilustración de relleno: acompañan al nodo 3D,
 * y por eso se mueven con él. Cada una recorre un tramo corto de parallax
 * mientras la sección pasa por pantalla, de modo que la página entera —fondo,
 * partículas e imágenes— comparte la misma sensación de profundidad en lugar de
 * tener un plano animado y otro quieto.
 *
 * El velo navy no es un filtro estético. Las fotos vienen de stock con
 * temperaturas distintas y, sin él, cada sección cambia de paleta; con él, todas
 * pertenecen al mismo sitio. Encima va una capa verde muy baja que las ata a la
 * marca.
 *
 * Con prefers-reduced-motion no hay parallax ni escala: la imagen entra fija.
 * El contenido no depende del movimiento en ningún caso.
 */

const RANGE = 46; // px de recorrido: suficiente para leerse, corto para no marear

export function Figure({
  src, alt, ratio = '4 / 5', caption, veil = 0.42, radius = 0, style,
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [RANGE, -RANGE]);

  return (
    <figure ref={ref} style={{ margin: 0, ...style }}>
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        style={{
          position: 'relative',
          aspectRatio: ratio,
          overflow: 'hidden',
          borderRadius: radius,
          background: 'var(--navy-950)',
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: `-${RANGE}px 0`,
            width: '100%',
            height: `calc(100% + ${RANGE * 2}px)`,
            objectFit: 'cover',
            y: reduced ? 0 : y,
          }}
        />
        {/* Velo de marca: unifica temperaturas y deja sitio al texto encima */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, rgba(5,7,15,${veil * 0.5}) 0%, rgba(5,7,15,${veil}) 100%)`,
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, mixBlendMode: 'overlay',
            background: 'linear-gradient(140deg, rgba(0,255,136,.16) 0%, rgba(0,0,0,0) 58%)',
          }}
        />
      </motion.div>
      {caption && (
        <figcaption
          style={{
            margin: 'var(--space-4) 0 0',
            font: 'var(--type-label)',
            letterSpacing: 'var(--track-label)',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Banda a sangre entre dos secciones.
 *
 * Antes era una fotografía de stock estirada al ancho del viewport; ahora es un
 * campo generado (ver Field.jsx), que no tiene resolución nativa que superar y
 * además se atraviesa con el scroll. El titular encima entra desde el fondo
 * mientras la banda cruza la pantalla: no es un cartel colocado sobre una
 * imagen, es lo que hay al final del recorrido.
 */
export function Banner({ variant = 'plexus', seed = 7, children, height = 'clamp(300px, 46vw, 520px)' }) {
  const reduced = useReducedMotion();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  /* El titular llega desde lejos y se va de largo: refuerza el eje Z de la
     banda en vez de flotar por encima de ella. */
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.24, 0.76, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ position: 'relative', height, overflow: 'hidden', background: 'var(--navy-950)' }}>
      <Field variant={variant} seed={seed} />
      {/* Suelo de contraste bajo el texto: el campo es luminoso en el centro */}
      <span
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,7,15,.9) 0%, rgba(5,7,15,.45) 46%, rgba(5,7,15,.1) 100%)' }}
      />
      {children && (
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 var(--gutter-page)' }}>
          <motion.div
            style={{
              maxWidth: 'var(--maxw-content)', margin: '0 auto', width: '100%',
              scale: reduced ? 1 : scale,
              y: reduced ? 0 : y,
              opacity: reduced ? 1 : opacity,
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </div>
  );
}

/**
 * Bloque de imagen + contenido. `flip` pone la imagen a la derecha; alternarlos
 * es lo que da ritmo a una página larga.
 */
export function Split({ src, alt, ratio = '4 / 5', media = '1fr', flip = false, children }) {
  /* `media` y `ratio` van juntos y no por gusto: la altura de la fila la fija la
     imagen, así que una imagen vertical al lado de tres líneas de texto deja un
     hueco vertical enorme y la sección se lee vacía. Cuando el texto es corto,
     la imagen tiene que ser apaisada y su columna más estrecha. */
  return (
    <div
      data-cols
      style={{
        display: 'grid',
        gridTemplateColumns: `minmax(0, ${media}) minmax(0, 1.1fr)`,
        gap: 'var(--space-10)',
        alignItems: 'center',
        direction: flip ? 'rtl' : 'ltr',
      }}
    >
      <div style={{ direction: 'ltr' }}>
        <Figure src={src} alt={alt} ratio={ratio} />
      </div>
      <div style={{ direction: 'ltr' }}>{children}</div>
    </div>
  );
}
