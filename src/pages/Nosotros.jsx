import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Ico } from '../components/icons.jsx';
import { Split } from '../components/Media.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, TextCTA, Cols, IndexRow } from '../components/ui.jsx';

/**
 * Nosotros (§12 del documento).
 *
 * Primero por qué existe BECOME, qué cree y cómo trabaja. La historia
 * corporativa y las biografías vienen después — y de momento no vienen: el
 * documento prohíbe inventar integrantes, cargos, partnerships o años de
 * experiencia para completar el diseño, así que el bloque de equipo dice que
 * está pendiente en lugar de rellenarse con perfiles ficticios.
 */

const DNA = [
  ['target', 'Business-first', 'Comenzamos por el resultado y la decisión de negocio, no por la herramienta.'],
  ['native', 'AI-native', 'Diseñamos modelos de trabajo que incorporan inteligencia desde su origen.'],
  ['system', 'Systems-minded', 'Conectamos estrategia, personas, datos, agentes, productos, operaciones y gobernanza.'],
  ['build', 'Builder', 'Convertimos la dirección y el diseño en capacidades que funcionan.'],
  ['accountable', 'Human-accountable', 'La IA amplía la capacidad; las personas mantienen dirección, supervisión y responsabilidad.'],
  ['embed', 'Embedded', 'Trabajamos con el equipo del cliente para que la capacidad permanezca y evolucione.'],
];

const CULTURE = [
  ['outcome', 'Think in outcomes', 'Preguntamos qué decisión, qué comportamiento o qué resultado de negocio debe cambiar antes de hablar de tecnología.'],
  ['inspect', 'Go inside the system', 'Buscamos la causa en el modelo operativo, no una solución superficial al síntoma.'],
  ['together', 'Build with, not for', 'Diseñamos y construimos junto a quienes operarán la capacidad.'],
  ['idea', 'Stay curious, stay precise', 'Exploramos posibilidades sin confundir exploración con evidencia.'],
  ['trust', 'Earn trust', 'Hacemos visibles los límites, los riesgos, los supuestos, los controles y las decisiones.'],
  ['capability', 'Leave capability behind', 'El trabajo debe aumentar la autonomía del cliente, no su dependencia de BECOME.'],
];

const DELIVERY = [
  'Un accountable lead por engagement.',
  'Client team integrado desde el inicio.',
  'Decisiones y riesgos visibles.',
  'Working software o artefactos utilizables, no solo presentaciones.',
  'Transferencia de capacidades incluida en el alcance.',
  'Gobernanza e IA responsable incorporadas al diseño, no añadidas al final.',
];

export default function Nosotros() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>About BECOME</Kicker>
        <Headline as="h1" dark>La próxima empresa ya existe dentro de la tuya.</Headline>
        <Lead dark>
          BECOME es una AI-native transformation company creada para conectar
          strategy, operating-model design, building y adoption en un solo sistema.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/framework">Conoce cómo trabajamos</PrimaryCTA>
        </div>
      </Section>

      {/* 01 — Qué es BECOME */}
      <Section band="light" id="sobre-become">
        <Kicker>Qué es BECOME</Kicker>
        <Headline>No llegamos para agregar otra herramienta.</Headline>
        <Lead>
          Ayudamos a las empresas a rediseñar cómo operan, deciden y crean valor
          alrededor de la IA. Trabajamos dentro del negocio para convertir una
          ambición en una capacidad propia, gobernable y capaz de evolucionar.
        </Lead>
        <Cols min="240px">
          {[
            ['work', 'Categoría', 'AI-native transformation company.'],
            ['target', 'Promesa', 'Become what comes next.'],
            ['idea', 'Filosofía', 'The transformation happens inside.'],
          ].map(([icon, label, value]) => (
            <Reveal as="div" key={label} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={26} style={{ color: 'var(--text-accent)', marginBottom: 'var(--space-5)' }} />
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
              <p style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{value}</p>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* 02, 03, 04 — propósito, visión, misión */}
      <Section band="dark" id="proposito">
        <Kicker dark>Nuestro propósito</Kicker>
        <Headline dark>Ayudar a las empresas a convertirse en aquello que el futuro exige.</Headline>
        <Lead dark>
          Hacemos de la IA una capacidad interna para operar mejor, decidir con
          mayor inteligencia y crear nuevas formas de valor. La transformación
          importa cuando queda instalada en las personas, los datos, los agentes,
          los productos y las operaciones de la empresa.
        </Lead>

        <div id="vision-mision" data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-9)', marginTop: 'var(--space-11)', scrollMarginTop: '96px' }}>
          <Reveal as="div" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--electric-green)' }}>Nuestra visión</p>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Un futuro en el que las empresas no solo usen IA, sino que evolucionen
              la forma en que trabajan, aprenden y compiten; con inteligencia
              incorporada, responsabilidad humana y capacidad propia para seguir
              transformándose.
            </Body>
          </Reveal>
          <Reveal as="div" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--electric-green)' }}>Nuestra misión</p>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Convertir la ambición de la empresa en capacidades AI-native
              incorporadas, conectando la estrategia con Personas, Datos, Agentes,
              Productos y Operaciones, desde la definición del valor hasta la
              adopción y la escala.
            </Body>
          </Reveal>
        </div>
      </Section>

      {/* 05 — creencia.
          El titular vive dentro de la columna de texto, no encima del bloque.
          La altura de una fila la fija la imagen; con solo dos párrafos al lado,
          el texto quedaba flotando en el centro de una fila mucho más alta y la
          sección se leía medio vacía. Con el titular dentro, las dos columnas
          miden casi lo mismo y el aire vuelve a ser intencionado. */}
      <Section band="light">
        <Split
          src="/images/17-team-collab.webp"
          alt="Equipo del cliente trabajando junto al equipo de BECOME"
          ratio="1 / 1"
          media="0.78fr"
        >
          <Kicker>Nuestra creencia</Kicker>
          <Headline>La transformación no se instala. Se construye dentro.</Headline>
          <Lead>
            Los pilotos aislados no cambian una empresa. El cambio ocurre cuando se
            rediseñan a la vez los procesos, los roles, quién decide, los datos, los
            controles, las capacidades y las métricas: un solo sistema, no siete
            proyectos.
          </Lead>
          <Body>
            Por eso construimos con los equipos del cliente y les transferimos la responsabilidad
            desde el inicio.
          </Body>
        </Split>
      </Section>

      {/* 06 — ADN */}
      <Section band="sunken" id="cultura-adn">
        <Kicker>Nuestro ADN</Kicker>
        <Headline>Seis rasgos, y cómo se notan en el trabajo.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {DNA.map(([icon, trait, how], i) => <IndexRow key={trait} index={i} icon={icon} term={trait} def={how} />)}
        </div>
      </Section>

      {/* 07 — cultura como comportamientos, no adjetivos */}
      <Section band="darker">
        <Kicker dark>Nuestra cultura</Kicker>
        <Headline dark>Comportamientos observables, no adjetivos aspiracionales.</Headline>
        {/* 300px fuerza tres columnas: con 260 caben cuatro y los seis
            comportamientos quedaban en 4 + 2, con la segunda fila medio vacía. */}
        <Cols min="300px">
          {CULTURE.map(([icon, name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)', marginBottom: 'var(--space-5)' }} />
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* 08 — cómo trabajamos */}
      <Section id="como-trabajamos" band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>Cómo trabajamos</Kicker>
            <Headline>Equipos pequeños y con experiencia alrededor de un resultado común.</Headline>
            <Body>
              Business strategy, product, design, data, AI, engineering y change
              trabajando juntos. La composición cambia según el engagement; el
              accountability no.
            </Body>
          </Reveal>
          <Reveal as="ul" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            {DELIVERY.map((d) => (
              <li key={d} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline)' }}>
                <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{d}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 09 — equipo: pendiente, y dicho en voz alta */}
      <Section band="dark" id="equipo">
        <Kicker dark>Equipo</Kicker>
        <Headline dark>Las personas, cuando podamos nombrarlas.</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          Esta sección está pendiente de contenido real: founder y leadership team,
          core team y, solo cuando existan acuerdos firmados, specialist network o
          partners.
        </Body>
        <Body dark>
          No inventamos integrantes ni cargos para llenar el layout. Un equipo
          ficticio es exactamente el detalle que un comité ejecutivo verifica.
        </Body>
        <TextCTA to="/es/contacto" dark>Habla con nosotros</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>La próxima capacidad se construye desde dentro</Kicker>
        <Headline dark>Cuéntanos qué necesita cambiar en tu empresa.</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Contáctanos</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
