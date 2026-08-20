import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, PrimaryCTA, IndexRow } from '../components/ui.jsx';
import Listado from '../components/insights/Listado.jsx';

/**
 * Insights (§13 del documento).
 *
 * Autoridad mediante ideas propias, no un repositorio de SEO. El listado de
 * artículos lo pone Listado, que sigue diciendo que no hay nada publicado
 * mientras sea verdad en vez de mostrar tarjetas con fechas inventadas. Los
 * cinco pilares editoriales son el compromiso de qué se va a publicar, y son
 * también las claves con las que cada artículo declara a cuál pertenece.
 */

const PILLARS = [
  ['The AI-native enterprise', 'Estrategia, ambition y enterprise design. Qué distingue a una empresa AI-native de una empresa con IA.'],
  ['Agentic work', 'Procesos, roles, agentes y responsabilidad humana. Cómo cambia el trabajo cuando parte lo hace un sistema.'],
  ['Operating-model reinvention', 'Personas, Datos, Agentes, Productos y Operaciones. Las decisiones de diseño que determinan dónde se acumula el valor.'],
  ['Value and adoption', 'Medición, confianza, gestión del cambio y transferencia de capacidades. Por qué la adopción es un problema de diseño, no de comunicación.'],
  ['Responsible scale', 'Gobernanza, controles, riesgo y condiciones para escalar. Cuándo hacerlo y, sobre todo, cuándo no.'],
];

const FORMATS = [
  ['Perspective', 'Una tesis argumentada sobre hacia dónde va algo.'],
  ['Field Note', 'Lo aprendido dentro de un problema concreto.'],
  ['Framework', 'Una forma reutilizable de estructurar una decisión.'],
  ['Executive Brief', 'Lo que un comité necesita saber, en su formato.'],
  ['Case Evidence', 'Trabajo real, solo cuando el cliente lo aprueba.'],
];

export default function Insights() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>BECOME Insights</Kicker>
        <Headline as="h1" dark>Ideas para la empresa que viene después.</Headline>
        <Lead dark>
          Perspectivas sobre AI-native operating models, agentic work, decision
          intelligence, adoption y responsible scale.
        </Lead>
      </Section>

      <Section band="light">
        <Listado lang="es" />
      </Section>

      <Section band="darker">
        <Kicker dark>Pilares editoriales</Kicker>
        <Headline dark>Sobre qué vamos a escribir, y sobre qué no.</Headline>
        <Lead dark>
          Cinco líneas. Nada de noticias de modelos, comparativas de herramientas ni
          resúmenes de lo que ya dijo otro.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {PILLARS.map(([name, line], i) => (
            <IndexRow key={name} index={i} dark num={String(i + 1).padStart(2, '0')} term={name} def={line} />
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>Formatos</Kicker>
        <Headline>Cada idea tiene su forma.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {FORMATS.map(([name, line], i) => <IndexRow key={name} index={i} term={name} def={line} />)}
        </div>
      </Section>

      <Section band="dark" pad="var(--space-13)">
        <Kicker dark>Become insights</Kicker>
        <Headline dark>¿Qué idea necesita convertirse en capacidad?</Headline>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to="/es/contacto">Contáctanos</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
