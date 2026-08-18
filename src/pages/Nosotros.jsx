import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
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
  ['Business-first', 'Comenzamos por el outcome y la decisión empresarial, no por la herramienta.'],
  ['AI-native', 'Diseñamos modelos de trabajo que incorporan inteligencia desde su origen.'],
  ['Systems-minded', 'Conectamos estrategia, personas, datos, agents, operaciones y governance.'],
  ['Builder', 'Convertimos direction y blueprint en capabilities que funcionan.'],
  ['Human-accountable', 'La IA amplía la capacidad; las personas mantienen dirección, supervisión y responsabilidad.'],
  ['Embedded', 'Trabajamos con el equipo del cliente para que la capability permanezca y evolucione.'],
];

const CULTURE = [
  ['Think in outcomes', 'Preguntamos qué decisión, comportamiento o business result debe cambiar antes de hablar de tecnología.'],
  ['Go inside the system', 'Buscamos la causa en el operating model, no una solución superficial al síntoma.'],
  ['Build with, not for', 'Diseñamos y construimos junto a quienes operarán la capability.'],
  ['Stay curious, stay precise', 'Exploramos posibilidades sin confundir exploración con evidencia.'],
  ['Earn trust', 'Hacemos visibles límites, riesgos, assumptions, controls y decisiones.'],
  ['Leave capability behind', 'El trabajo debe aumentar la autonomía del cliente, no su dependencia de BECOME.'],
];

const DELIVERY = [
  'Un accountable lead por engagement.',
  'Client team integrado desde el inicio.',
  'Decisiones y riesgos visibles.',
  'Working software o artefactos utilizables, no solo presentaciones.',
  'Capability transfer incluida en el alcance.',
  'Governance y responsible AI incorporados al delivery.',
];

export default function Nosotros() {
  return (
    <div data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
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
      <Section band="light">
        <Kicker>Qué es BECOME</Kicker>
        <Headline>No llegamos para agregar otra herramienta.</Headline>
        <Lead>
          Ayudamos a las empresas a rediseñar cómo operan, deciden y crean valor
          alrededor de la IA. Trabajamos dentro del negocio para convertir una
          ambición en una capability propia, gobernable y capaz de evolucionar.
        </Lead>
        <Cols min="240px">
          {[
            ['Categoría', 'AI-native transformation company.'],
            ['Promesa', 'Become what comes next.'],
            ['Filosofía', 'The transformation happens inside.'],
          ].map(([label, value]) => (
            <Reveal as="div" key={label} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
              <p style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{value}</p>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* 02, 03, 04 — propósito, visión, misión */}
      <Section band="dark">
        <Kicker dark>Nuestro propósito</Kicker>
        <Headline dark>Ayudar a las empresas a convertirse en aquello que el futuro exige.</Headline>
        <Lead dark>
          Hacemos de la IA una capability interna para operar mejor, decidir con
          mayor inteligencia y crear nuevas formas de valor. La transformación
          importa cuando queda instalada en las personas, los datos, los agents y
          las operaciones de la empresa.
        </Lead>

        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-9)', marginTop: 'var(--space-11)' }}>
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
              Convertir ambiciones empresariales en AI-native capabilities
              incorporadas, conectando strategy, People, Data, Agents y Operations
              desde la definición del valor hasta la adopción y la escala.
            </Body>
          </Reveal>
        </div>
      </Section>

      {/* 05 — creencia */}
      <Section band="light">
        <Kicker>Nuestra creencia</Kicker>
        <Headline>La transformación no se instala. Se construye dentro.</Headline>
        <Lead>
          Los pilotos aislados no cambian una empresa. El cambio ocurre cuando se
          rediseñan workflows, roles, decision rights, data, controls, skills y
          measures como un solo operating system.
        </Lead>
        <Body>
          Por eso construimos con los equipos del cliente y transferimos ownership
          desde el inicio.
        </Body>
      </Section>

      {/* 06 — ADN */}
      <Section band="sunken">
        <Kicker>Nuestro ADN</Kicker>
        <Headline>Seis rasgos, y cómo se notan en el trabajo.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {DNA.map(([trait, how]) => <IndexRow key={trait} term={trait} def={how} />)}
        </div>
      </Section>

      {/* 07 — cultura como comportamientos, no adjetivos */}
      <Section band="darker">
        <Kicker dark>Nuestra cultura</Kicker>
        <Headline dark>Comportamientos observables, no adjetivos aspiracionales.</Headline>
        <Cols min="260px">
          {CULTURE.map(([name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--border-hairline-dark)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* 08 — cómo trabajamos */}
      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>Cómo trabajamos</Kicker>
            <Headline>Equipos pequeños y senior alrededor de un outcome común.</Headline>
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
      <Section band="dark">
        <Kicker dark>Equipo</Kicker>
        <Headline dark>Las personas, cuando podamos nombrarlas.</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          Esta sección está pendiente de contenido real: founder y leadership team,
          core team y, solo cuando existan acuerdos firmados, specialist network o
          partners.
        </Body>
        <Body dark>
          No inventamos integrantes, cargos, certificaciones ni años de experiencia
          para que el layout quede lleno. Un equipo ficticio en una página de una
          consultora de transformación es exactamente el tipo de detalle que un
          comité ejecutivo verifica.
        </Body>
        <TextCTA to="/es/contacto" dark>Habla con nosotros</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>La próxima capability se construye desde dentro</Kicker>
        <Headline dark>Cuéntanos qué necesita cambiar en tu empresa.</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Contáctanos</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
