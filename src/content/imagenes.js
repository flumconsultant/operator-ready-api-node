/**
 * Catálogo de imágenes disponibles para los artículos.
 *
 * Existe para que ni el panel ni el trabajo automático escriban una ruta a
 * mano. Una ruta escrita a mano que no existe se publica igual y deja un hueco
 * roto en la página; una lista cerrada no puede equivocarse.
 *
 * `ratio` es el de verdad del archivo, no uno elegido: si se declara 16/9 sobre
 * una imagen cuadrada, el navegador recorta un tercio de la imagen y nadie se
 * entera hasta que alguien mira la página.
 *
 * `alt` describe lo que se ve, en cada idioma. No lleva palabras clave metidas
 * a presión: quien lo lee con un lector de pantalla necesita saber qué hay en
 * la imagen, y un buscador que detecta relleno lo penaliza.
 *
 * ---- Por qué algunas están marcadas como no usables ----
 *
 * Todas son generadas. En las abstractas eso da igual. En las que aparecen
 * personas, no: son personas que no existen, y este sitio dice en su propia
 * página de equipo que nombrará a las personas cuando pueda hacerlo. Publicar
 * retratos inventados mientras se dice eso es una contradicción que alguien
 * acabará viendo, y el daño de que la vea un cliente potencial es mayor que el
 * beneficio de ilustrar un artículo.
 */

export const IMAGENES = [
  {
    src: '/images/01-neural-network.webp',
    ratio: '16 / 9',
    usable: true,
    alt: {
      es: 'Red de nodos verdes conectados sobre un fondo azul oscuro.',
      en: 'A network of green nodes connected over a dark blue background.',
    },
    cuando: 'Sistemas, arquitectura, cómo se conecta lo que ya existe. La más neutra y la única en 16/9.',
  },
  {
    src: '/images/47-global-ops.webp',
    ratio: '1 / 1',
    usable: true,
    alt: {
      es: 'Mapa del mundo de noche con rutas verdes uniendo ciudades.',
      en: 'A world map at night with green routes linking cities.',
    },
    cuando: 'Operación distribuida, escala, despliegue en varios mercados.',
  },
  {
    src: '/images/19-tech-workspace.webp',
    ratio: '1 / 1',
    usable: true,
    alt: {
      es: 'Escritorio con dos pantallas mostrando código y un panel de datos.',
      en: 'A desk with two screens showing code and a data dashboard.',
    },
    cuando: 'Trabajo real, herramientas, el día a día de un equipo técnico.',
  },
  {
    src: '/images/42-future-forward.webp',
    ratio: '1 / 1',
    usable: true,
    alt: {
      es: 'Silueta de una persona mirando una ciudad iluminada desde una altura.',
      en: 'The silhouette of a person looking out over a lit city from above.',
    },
    cuando: 'Decisión, horizonte, el momento de elegir por dónde ir. Úsala poco: es la más literal del conjunto.',
  },
  {
    src: '/images/50-next-gen.webp',
    ratio: '1 / 1',
    usable: true,
    alt: {
      es: 'Silueta de una persona caminando hacia una luz entre columnas de datos.',
      en: 'The silhouette of a person walking towards a light between columns of data.',
    },
    cuando: 'Transición, entrar en algo nuevo. Comparte lenguaje con la anterior: no las pongas en el mismo artículo.',
  },

  /* ---------------------------------------------------------- no usables */

  {
    src: '/images/45-executive.webp',
    ratio: '1 / 1',
    usable: false,
    motivo: 'Retrato de una persona que no existe. Un directivo inventado en un sitio que promete nombrar a su gente cuando pueda.',
    alt: { es: '', en: '' },
  },
  {
    src: '/images/46-strategy-session.webp',
    ratio: '1 / 1',
    usable: false,
    motivo: 'Personas inventadas, y además las pantallas del fondo muestran texto ilegible: se nota generada a simple vista.',
    alt: { es: '', en: '' },
  },
  {
    src: '/images/17-team-collab.webp',
    ratio: '1 / 1',
    usable: false,
    motivo: 'Personas inventadas en una escena de reunión. Mismo problema que las anteriores.',
    alt: { es: '', en: '' },
  },
];

export const USABLES = IMAGENES.filter((i) => i.usable);

export const porSrc = (src) => IMAGENES.find((i) => i.src === src) || null;
