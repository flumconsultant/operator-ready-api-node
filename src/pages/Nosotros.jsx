import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Ico } from '../components/icons.jsx';
import { Split } from '../components/Media.jsx';
import Equipo from '../components/Equipo.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, Cols } from '../components/ui.jsx';

/**
 * Nosotros (§12 del documento).
 *
 * Primero por qué existe BECOME, qué cree y cómo trabaja; las personas
 * después. El bloque de equipo sale de <Equipo>, que lee las fichas de autor:
 * nada de lo que aparece ahí está escrito en esta página, así que un cargo se
 * corrige desde el panel y no desde el código.
 */


const CULTURE = [
  ['outcome', 'Think in outcomes', 'Preguntamos qué decisión, qué comportamiento o qué resultado de negocio debe cambiar antes de hablar de tecnología.'],
  ['inspect', 'Go inside the system', 'Buscamos la causa en el modelo operativo, no una solución superficial al síntoma.'],
  ['together', 'Build with, not for', 'Diseñamos y construimos junto a quienes operarán la capacidad.'],
  ['idea', 'Stay curious, stay precise', 'Exploramos posibilidades sin confundir exploración con evidencia.'],
  ['trust', 'Earn trust', 'Hacemos visibles los límites, los riesgos, los supuestos, los controles y las decisiones.'],
  ['capability', 'Leave capability behind', 'El trabajo debe aumentar la autonomía del cliente, no su dependencia de BECOME.'],
];

const CAPACIDADES = [
  'Estrategia y transformación',
  'Producto y diseño',
  'Procesos y operaciones',
  'IA y datos',
  'Arquitectura e integración',
  'Gestión del cambio y adopción',
  'Medición de valor',
];

const DELIVERY = [
  'Un responsable claro por proyecto.',
  'Equipo del cliente involucrado desde el inicio.',
  'Decisiones, supuestos y riesgos visibles.',
  'Software funcional o artefactos utilizables, no solo presentaciones.',
  'Transferencia de conocimiento y capacidades incluida en el alcance.',
  'Gobierno y uso responsable incorporados al diseño, no añadidos al final.',
];

export default function Nosotros() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>About BECOME</Kicker>
        <Headline as="h1" dark>La próxima empresa ya existe dentro de la tuya.</Headline>
        <Lead dark>
          BECOME es una AI-native transformation company que conecta estrategia,
          modelo operativo, tecnología y adopción para convertir una ambición en
          capacidad real.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/como-transformamos">Conoce cómo trabajamos</PrimaryCTA>
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
      {/* Las capacidades de la firma, no las de cada persona. La distinción
          importa: un equipo senior y pequeño que dice dominar siete
          disciplinas no se cree, y con razón. Lo que se sostiene es que la
          composición cambia según el reto. */}
      <Section band="light">
        <Kicker>Capacidades</Kicker>
        <Headline>Negocio, transformación y tecnología en el mismo equipo.</Headline>
        <Body style={{ marginTop: 'var(--space-6)' }}>
          Según lo que el reto necesita, BECOME combina:
        </Body>
        <Cols min="220px" style={{ marginTop: 'var(--space-9)' }}>
          {CAPACIDADES.map((c) => (
            <Reveal as="div" key={c} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--text-heading)' }}>{c}</p>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* Cómo trabajamos, en comportamientos observables. Antes era una capa
         aparte llamada «cultura»: para una firma joven, seis adjetivos
         institucionales pesan más de lo que prueban. */}
      <Section band="darker">
        <Kicker dark>Cómo trabajamos</Kicker>
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
            <Kicker>El equipo de trabajo</Kicker>
            <Headline>Un equipo senior y multidisciplinario alrededor del resultado.</Headline>
            <Body>
              La composición combina negocio, transformación, producto, adopción,
              datos e IA según lo que el reto necesita. Cada proyecto mantiene un
              responsable claro.
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

      {/* 09 — equipo: personas reales, desde las fichas del panel */}
      <Equipo lang="es" id="equipo" />

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
