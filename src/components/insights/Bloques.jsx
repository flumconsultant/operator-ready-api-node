import React from 'react';
import Reveal from '../Reveal.jsx';
import { Figure } from '../Media.jsx';
import { Kicker, Headline, Lead, Body, PrimaryCTA, Cols, Card, IndexRow } from '../ui.jsx';

/**
 * Traduce los bloques de un artículo a los componentes reales del sitio.
 *
 * Este archivo es el contrato entre el panel de /admin y la web: lo que el
 * constructor deja añadir es exactamente lo que aquí sabe dibujarse, ni más ni
 * menos. Por eso el catálogo (CATALOGO, abajo) vive junto al renderizador y no
 * en el panel — separados, el panel acabaría ofreciendo un bloque que la web no
 * sabe pintar, y el fallo aparecería en producción y no al componerlo.
 *
 * Un bloque desconocido no rompe la página ni desaparece en silencio: se avisa
 * en la consola y se omite. Un artículo publicado con un bloque de una versión
 * posterior del panel debe seguir leyéndose.
 */

/* Los artículos van en una sola columna a propósito: es un texto para leer
   seguido, no una página de aterrizaje, y una parrilla de bandas alternas
   convierte la lectura en una sucesión de interrupciones. Los bloques que
   rompen el ritmo (tarjetas, índice, imagen) lo hacen desde dentro del flujo,
   no cambiando de sección.

   El ancho ya no se fija aquí. Lo pone la columna centrada de ArticuloBase, que
   envuelve cabecera y cuerpo: cuando cada bloque llevaba su propio maxWidth, la
   columna quedaba pegada al margen izquierdo del ancho de contenido y en
   escritorio sobraban setecientos píxeles a la derecha. Fijar el ancho en dos
   sitios era justo lo que impedía centrarlo en uno. */
const PROSA = { maxWidth: 'none' };

const Parrafo = ({ b, i }) => (
  <Reveal as="div" index={i} style={PROSA}>
    <Body style={{ maxWidth: 'none' }}>{b.texto}</Body>
  </Reveal>
);

const Subtitulo = ({ b, i }) => (
  <Reveal as="div" index={i} style={{ ...PROSA, marginTop: 'var(--space-10)' }}>
    {b.antetitulo && <Kicker>{b.antetitulo}</Kicker>}
    <Headline as="h2" size="var(--text-h2)">{b.texto}</Headline>
  </Reveal>
);

const Entradilla = ({ b, i }) => (
  <Reveal as="div" index={i} style={PROSA}>
    <Lead>{b.texto}</Lead>
  </Reveal>
);

/* Misma lista con regla y guion que usan las señales de las páginas de
   solución. Se repite la forma a propósito: quien ya leyó una página de
   solución reconoce el patrón y sabe que está ante una enumeración de
   síntomas, no ante los pasos de un procedimiento. */
const Lista = ({ b, i }) => (
  <Reveal
    as="ul"
    index={i}
    style={{ ...PROSA, listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}
  >
    {(b.items || []).map((s, k) => (
      <li key={k} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline)' }}>
        <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
        <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{s}</span>
      </li>
    ))}
  </Reveal>
);

const Indice = ({ b }) => (
  <div style={{ marginTop: 'var(--space-8)' }}>
    {(b.items || []).map((it, k) => (
      <IndexRow key={k} index={k} num={String(k + 1).padStart(2, '0')} term={it.termino} def={it.definicion} />
    ))}
  </div>
);

const Tarjetas = ({ b }) => (
  <Cols min="240px">
    {(b.items || []).map((it, k) => (
      <Card key={k}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, letterSpacing: 'var(--track-heading)', color: 'var(--text-heading)' }}>
          {it.titulo}
        </h3>
        <Body>{it.texto}</Body>
      </Card>
    ))}
  </Cols>
);

/* La cita destacada no lleva comillas dibujadas: la tipografía de display a
   tamaño de entradilla ya la separa del cuerpo, y las comillas grandes son un
   recurso de revista que no está en ningún otro sitio de esta web. */
const Cita = ({ b, i }) => (
  <Reveal as="figure" index={i} style={{ ...PROSA, margin: 'var(--space-10) 0 0', paddingLeft: 'var(--space-6)', borderLeft: '2px solid var(--text-accent)' }}>
    <blockquote style={{ margin: 0, font: 'var(--type-lead)', color: 'var(--text-heading)' }}>{b.texto}</blockquote>
    {b.fuente && (
      <figcaption style={{ marginTop: 'var(--space-4)', font: 'var(--type-mono)', color: 'var(--text-faint)' }}>{b.fuente}</figcaption>
    )}
  </Reveal>
);

const Destacado = ({ b, i }) => (
  <Reveal as="aside" index={i} style={{ ...PROSA, marginTop: 'var(--space-10)', padding: 'var(--space-7)', background: 'var(--white)', border: '1px solid var(--border-hairline)' }}>
    {b.antetitulo && <Kicker>{b.antetitulo}</Kicker>}
    <Body style={{ maxWidth: 'none', color: 'var(--text-body)' }}>{b.texto}</Body>
  </Reveal>
);

const Imagen = ({ b, i }) => (
  <Reveal as="div" index={i} style={{ marginTop: 'var(--space-10)' }}>
    <Figure src={b.src} alt={b.alt || ''} ratio={b.ratio || '16 / 9'} caption={b.pie} />
  </Reveal>
);

/* Las preguntas frecuentes no son decoración: son el bloque que un asistente
   puede citar entero como respuesta, y el que alimenta el JSON-LD de FAQPage
   que genera scripts/seo.mjs. De ahí que pregunta y respuesta vayan separadas
   en campos y no escritas dentro de un párrafo. */
const Faq = ({ b }) => (
  <div style={{ marginTop: 'var(--space-11)', ...PROSA }}>
    <Kicker>{b.antetitulo || 'Preguntas frecuentes'}</Kicker>
    <div style={{ marginTop: 'var(--space-6)' }}>
      {(b.items || []).map((it, k) => (
        <Reveal
          key={k}
          as="div"
          index={k}
          style={{ paddingTop: 'var(--space-6)', marginTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline)' }}
        >
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--text-heading)' }}>
            {it.pregunta}
          </h3>
          <Body style={{ maxWidth: 'none' }}>{it.respuesta}</Body>
        </Reveal>
      ))}
    </div>
  </div>
);

const Cta = ({ b, i }) => (
  <Reveal as="div" index={i} style={{ marginTop: 'var(--space-10)' }}>
    <PrimaryCTA to={b.destino || '/es/contacto'}>{b.texto}</PrimaryCTA>
  </Reveal>
);

const RENDER = {
  parrafo: Parrafo,
  subtitulo: Subtitulo,
  entradilla: Entradilla,
  lista: Lista,
  indice: Indice,
  tarjetas: Tarjetas,
  cita: Cita,
  destacado: Destacado,
  imagen: Imagen,
  faq: Faq,
  cta: Cta,
};

/**
 * Lo que el panel ofrece añadir. `campos` describe el formulario de cada bloque
 * y `nuevo` el bloque vacío que se inserta, de modo que añadir un tipo de
 * bloque nuevo al sitio es tocar solo este archivo.
 */
export const CATALOGO = [
  { tipo: 'parrafo', nombre: 'Párrafo', campos: [['texto', 'area']], nuevo: { texto: '' } },
  { tipo: 'subtitulo', nombre: 'Subtítulo', campos: [['antetitulo', 'texto'], ['texto', 'texto']], nuevo: { texto: '' } },
  { tipo: 'entradilla', nombre: 'Entradilla', campos: [['texto', 'area']], nuevo: { texto: '' } },
  { tipo: 'lista', nombre: 'Lista de señales', campos: [['items', 'lineas']], nuevo: { items: [''] } },
  { tipo: 'indice', nombre: 'Índice numerado', campos: [['items', 'pares:termino,definicion']], nuevo: { items: [{ termino: '', definicion: '' }] } },
  { tipo: 'tarjetas', nombre: 'Tarjetas', campos: [['items', 'pares:titulo,texto']], nuevo: { items: [{ titulo: '', texto: '' }] } },
  { tipo: 'cita', nombre: 'Cita destacada', campos: [['texto', 'area'], ['fuente', 'texto']], nuevo: { texto: '', fuente: '' } },
  { tipo: 'destacado', nombre: 'Recuadro destacado', campos: [['antetitulo', 'texto'], ['texto', 'area']], nuevo: { texto: '' } },
  { tipo: 'imagen', nombre: 'Imagen', campos: [['src', 'texto'], ['alt', 'texto'], ['pie', 'texto']], nuevo: { src: '', alt: '', pie: '' } },
  { tipo: 'faq', nombre: 'Preguntas frecuentes', campos: [['items', 'pares:pregunta,respuesta']], nuevo: { items: [{ pregunta: '', respuesta: '' }] } },
  { tipo: 'cta', nombre: 'Llamada a la acción', campos: [['texto', 'texto'], ['destino', 'texto']], nuevo: { texto: '', destino: '/es/contacto' } },
];

export default function Bloques({ bloques = [] }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      {bloques.map((b, i) => {
        const C = RENDER[b.tipo];
        if (!C) {
          if (import.meta.env.DEV) console.warn(`insights: bloque desconocido «${b.tipo}», omitido`);
          return null;
        }
        return <C key={i} b={b} i={i} />;
      })}
    </div>
  );
}
