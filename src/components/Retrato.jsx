import React from 'react';

/**
 * El retrato de una persona del equipo, con el tratamiento de marca.
 *
 * ---- Por qué hay tratamiento y no la foto tal cual ----
 *
 * Las fotos de un equipo pequeño nunca vienen de la misma sesión: una tiene
 * fondo navy de estudio, otra fondo gris, otra beige. Puestas juntas en una
 * rejilla, lo primero que se ve no son las personas sino que las tres fotos son
 * de sitios distintos, y eso es exactamente lo que resta a una consultora que
 * vende criterio.
 *
 * El tratamiento las lleva al mismo sitio: se quita el color, se tiñe de navy y
 * se levanta la luz con el verde de la marca. Sigue siendo la foto de la
 * persona —no es un filtro que la disfrace— pero las tres pertenecen ya a la
 * misma página.
 *
 * ---- Y por qué se levanta al pasar por encima ----
 *
 * Al apuntar o al tabular, el color vuelve. La razón no es el efecto: es que un
 * duotono fuerte esconde matices de la cara, y quien quiere ver a la persona de
 * verdad tiene que poder. Va también en :focus-within para que exista sin
 * ratón, y el color final es el mismo con o sin animación, así que quien pide
 * menos movimiento no pierde información.
 *
 * ---- Cuando todavía no hay foto ----
 *
 * Un hueco gris con un icono de persona rota anuncia que la página está a
 * medias. En su lugar van las iniciales sobre la misma retícula y el mismo
 * verde: se ve intencional, se distingue una persona de otra, y cuando llegue
 * la foto el sitio no cambia de forma.
 */

const iniciales = (nombre = '') =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

/* Un único bloque de estilos para todas las tarjetas: :hover y :focus-within no
   existen en estilos en línea, y duplicar la regla por retrato mete el mismo
   CSS tres veces en el HTML. */
export const ESTILOS_RETRATO = `
  .becomeRetrato {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 2px;
    background: var(--navy-950);
    border: 1px solid var(--border-hairline-dark);
  }
  .becomeRetrato img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    /* El contraste sube un punto porque quitar el color aplana la cara: sin
       ese punto, el duotono convierte un retrato en una mancha. */
    filter: grayscale(1) contrast(1.08);
    transform: scale(1.01);
    transition: filter .38s ease, transform .38s ease;
  }
  .becomeRetrato .tinte {
    position: absolute; inset: 0; pointer-events: none;
    /* mix-blend-mode: color tiñe conservando la luminosidad, que es lo que
       hace que esto sea un duotono y no una capa azul por encima. */
    mix-blend-mode: color;
    background: linear-gradient(155deg, #16204a 0%, #0A0E27 55%, #05070F 100%);
    transition: opacity .38s ease;
  }
  .becomeRetrato .luz {
    position: absolute; inset: 0; pointer-events: none;
    mix-blend-mode: screen;
    background: radial-gradient(120% 90% at 78% 6%, rgba(0,255,136,.20) 0%, rgba(0,255,136,0) 58%);
    transition: opacity .38s ease;
  }
  .becomeRetrato .velo {
    position: absolute; inset: 0; pointer-events: none;
    /* Viñeta en multiply. Existe porque el duotono iguala el TONO pero no la
       luminosidad: dos de las tres fotos vienen con fondo claro de estudio y,
       puestas al lado de una con fondo navy, la fila se leía como dos fotos
       encendidas y una apagada.
       La viñeta baja el fondo —que es donde está la diferencia— y deja el
       centro casi intacto, así que la cara no se oscurece. Sobre una foto que
       ya es oscura apenas hace nada, que es justo lo que se quiere: corrige
       solo lo que hay que corregir. */
    mix-blend-mode: multiply;
    background: radial-gradient(115% 100% at 50% 40%, rgba(10,14,39,0) 0%, rgba(10,14,39,.10) 46%, rgba(5,7,15,.55) 100%);
    transition: opacity .38s ease;
  }
  .becomeRetrato .reticula {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 44px 44px;
  }
  .becomeRetrato .linea {
    position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
    pointer-events: none;
    background: linear-gradient(90deg, var(--electric-green), rgba(0,255,136,0));
    transform: scaleX(.28);
    transform-origin: left;
    transition: transform .38s cubic-bezier(.2,.7,.2,1);
  }

  .becomeFicha:hover .becomeRetrato img,
  .becomeFicha:focus-within .becomeRetrato img {
    filter: grayscale(.12) contrast(1.02);
    transform: scale(1.045);
  }
  .becomeFicha:hover .becomeRetrato .tinte,
  .becomeFicha:focus-within .becomeRetrato .tinte { opacity: .3 }
  .becomeFicha:hover .becomeRetrato .luz,
  .becomeFicha:focus-within .becomeRetrato .luz { opacity: .45 }
  .becomeFicha:hover .becomeRetrato .velo,
  .becomeFicha:focus-within .becomeRetrato .velo { opacity: .35 }
  .becomeFicha:hover .becomeRetrato .linea,
  .becomeFicha:focus-within .becomeRetrato .linea { transform: scaleX(1) }

  /* El estado final es idéntico; lo único que se quita es el recorrido. Quien
     pide menos movimiento sigue viendo la foto en color al apuntar. */
  @media (prefers-reduced-motion: reduce) {
    .becomeRetrato img,
    .becomeRetrato .tinte,
    .becomeRetrato .luz,
    .becomeRetrato .velo,
    .becomeRetrato .linea { transition: none }
    .becomeFicha:hover .becomeRetrato img,
    .becomeFicha:focus-within .becomeRetrato img { transform: none }
  }
`;

export default function Retrato({ nombre, foto, alt }) {
  return (
    <div className="becomeRetrato">
      {foto ? (
        <img
          src={foto}
          alt={alt || nombre}
          width="800"
          height="800"
          /* Ancho y alto declarados y aspect-ratio en el contenedor: sin ellos
             la rejilla salta cuando cargan las tres fotos. */
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
            fontSize: 'clamp(38px, 7vw, 64px)', letterSpacing: '.04em',
            color: 'var(--electric-green)',
            background: 'linear-gradient(155deg, #141A3A 0%, #05070F 100%)',
          }}
        >
          {iniciales(nombre)}
        </div>
      )}
      {foto && <span className="velo" aria-hidden="true" />}
      {foto && <span className="tinte" aria-hidden="true" />}
      {foto && <span className="luz" aria-hidden="true" />}
      <span className="reticula" aria-hidden="true" />
      <span className="linea" aria-hidden="true" />
    </div>
  );
}
