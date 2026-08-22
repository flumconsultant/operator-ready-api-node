import React from 'react';
import Reveal from './Reveal.jsx';
import { Ico } from './icons.jsx';
import { Section, Kicker, Headline, Lead } from './ui.jsx';
import Retrato, { ESTILOS_RETRATO } from './Retrato.jsx';
import { EQUIPO } from '../content/equipo.js';

/**
 * La sección de equipo de Nosotros, en los dos idiomas.
 *
 * ---- De dónde sale el contenido ----
 *
 * De las mismas fichas de autor que firman los artículos, no de una lista
 * aparte. Que Carlos aparezca aquí y firme un artículo tiene que ser el mismo
 * dato: con dos listas, el día que alguien cambie de cargo se cambia en una y
 * la otra se queda contando otra cosa, y quien lo note deduce lo peor.
 *
 * De paso, todo esto se edita desde el panel sin tocar código: quién sale, en
 * qué orden, con qué cargo y con qué foto.
 *
 * ---- Sobre lo que NO hay aquí ----
 *
 * No hay años de experiencia, ni número de proyectos, ni logos de clientes. Lo
 * que hay es lo que cada persona escribió de sí misma y un enlace a su
 * LinkedIn, que es lo único de esta página que alguien puede contrastar. Un
 * comité ejecutivo verifica exactamente eso.
 */

const T = {
  es: {
    kicker: 'Equipo',
    titulo: 'Las personas detrás de BECOME.',
    lead: 'Un equipo senior y multidisciplinario alrededor del resultado. Cada engagement mantiene un responsable claro.',
    linkedin: 'Conoce más en LinkedIn',
    sinFoto: 'Foto pendiente',
    contexto: 'Perfil de',
  },
  en: {
    kicker: 'Team',
    titulo: 'The people behind BECOME.',
    lead: 'A senior, multidisciplinary team built around the outcome. Every engagement keeps one clear owner.',
    linkedin: 'More on LinkedIn',
    sinFoto: 'Photo pending',
    contexto: 'Portrait of',
  },
};

export default function Equipo({ lang = 'es', id = 'equipo' }) {
  const t = T[lang] || T.es;
  const personas = EQUIPO;

  if (!personas.length) return null;

  return (
    <Section band="dark" id={id}>
      <style>{ESTILOS_RETRATO}</style>

      <Kicker dark>{t.kicker}</Kicker>
      <Headline dark>{t.titulo}</Headline>
      <Lead dark>{t.lead}</Lead>

      <div
        style={{
          marginTop: 'var(--space-10)',
          display: 'grid',
          /* minmax(0, 1fr) y no auto: con auto, una biografía larga ensancha su
             columna y las tres dejan de medir lo mismo. */
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 'var(--space-9) var(--space-8)',
        }}
      >
        {personas.map((p, i) => {
          const txt = p[lang] || p.es || {};
          return (
            <Reveal key={p.id || p.nombre} as="article" index={i} className="becomeFicha" style={{ minWidth: 0 }}>
              <Retrato
                nombre={p.nombre}
                foto={p.foto}
                alt={`${t.contexto} ${p.nombre}`}
              />

              <h3 style={{
                margin: 'var(--space-5) 0 0',
                fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
                fontSize: 'var(--text-h4, 22px)', lineHeight: 1.25,
                letterSpacing: 'var(--track-heading)', color: 'var(--white)',
              }}>
                {p.nombre}
              </h3>

              {txt.rol && (
                <p style={{
                  margin: '6px 0 0', font: 'var(--type-mono)', fontSize: 13,
                  lineHeight: 1.45, color: 'var(--electric-green)',
                }}>
                  {txt.rol}
                </p>
              )}

              {txt.bio && (
                <p style={{
                  margin: 'var(--space-4) 0 0', font: 'var(--type-body)',
                  fontSize: 15, lineHeight: 1.62, color: 'var(--slate-200)',
                }}>
                  {txt.bio}
                </p>
              )}

              {txt.credencial && (
                /* Separada de la bio y en gris: la bio es lo que la persona
                   hace, esto es lo que se puede comprobar. Mezcladas, lo
                   segundo se lee como más de lo primero. */
                <p style={{
                  margin: 'var(--space-4) 0 0', paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border-hairline-dark)',
                  font: 'var(--type-body)', fontSize: 14, lineHeight: 1.55,
                  color: 'var(--slate-300)',
                }}>
                  {txt.credencial}
                </p>
              )}

              {p.linkedin && (
                <a
                  href={p.linkedin}
                  target="_blank"
                  /* noopener por seguridad; noreferrer además porque no hay
                     ninguna razón para contarle a LinkedIn desde qué página
                     exacta salió cada visita. */
                  rel="noopener noreferrer"
                  /* 44 px de alto para el dedo, pero el subrayado va en el
                     texto y no en la caja: en la caja queda catorce píxeles por
                     debajo de las letras y deja de leerse como un enlace. */
                  style={{
                    marginTop: 'var(--space-4)', minHeight: 44,
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
                    textTransform: 'uppercase', fontSize: 11,
                    color: 'var(--electric-green)', textDecoration: 'none',
                  }}
                >
                  <Ico name="linkedin" size={15} />
                  <span style={{ borderBottom: '1px solid var(--green-line)', paddingBottom: 2 }}>
                    {t.linkedin}
                  </span>
                </a>
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
