import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import {
  Section, Kicker, Headline, Lead, Body,
  PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow,
} from '../components/ui.jsx';
import StateTransition from '../components/StateTransition.jsx';
import { USE_CASES } from '../site.js';

/**
 * Home.
 *
 * Es una página-disparador, no un directorio: instala la tesis, crea el journey
 * y deriva a las secciones de profundidad. El orden es canónico y viene del
 * documento (§6):
 *
 *   Promesa → Propósito → Cómo lo hacemos → Qué hacemos →
 *   Situación del cliente → Evidencia → Ideas → Conversación
 *
 * Cada bloque termina con una salida hacia una página de profundidad. La home
 * resume y activa; no duplica el contenido de las interiores.
 *
 * Los `nodeState` son las anclas del nodo 3D. Solo van en secciones oscuras: en
 * las claras el nodo baja tanto que un estado anclado ahí no se vería.
 */

const STAGES = [
  ['B', 'Business Ambition', 'Define en qué debe convertirse la empresa y qué outcomes importan.'],
  ['E', 'Enterprise Discovery', 'Comprende cómo funciona hoy y qué limita el cambio.'],
  ['C', 'Capability Choices', 'Prioriza dónde la IA puede crear valor diferencial.'],
  ['O', 'Operating Model Design', 'Diseña el sistema futuro.'],
  ['M', 'Make & Embed', 'Construye e incorpora la capability.'],
  ['E', 'Expand & Evolve', 'Mide, gobierna, transfiere y escala.'],
];

const DOMAINS = [
  ['People, inside.', 'Liderazgo, roles, skills y adopción diseñados para el trabajo entre personas e IA.', '/icons/people-inside-white.webp'],
  ['Data, inside.', 'Contexto y conocimiento convertidos en decisiones y acción.', '/icons/data-inside-white.webp'],
  ['Agents, inside.', 'Copilots y agents incorporados en workflows reales, con supervisión humana definida.', '/icons/agents-inside-white.webp'],
  ['Operations, inside.', 'Procesos, governance y performance rediseñados para crear valor a escala.', '/icons/operations-inside-white.webp'],
];

const TOOLS = [
  ['Business Ambition Canvas™', 'Alinear al equipo ejecutivo alrededor de outcomes y strategic choices.'],
  ['Inside Readiness Index™', 'Evaluar madurez en People, Data, Agents y Operations.'],
  ['AI-Native Value Map™', 'Priorizar oportunidades por valor, feasibility, velocidad y riesgo.'],
  ['Inside Target State Canvas™', 'Definir el target operating model y transformation blueprint.'],
  ['Agentic Workflow Blueprint™', 'Diseñar roles, agents, datos, decisiones, excepciones y controles.'],
  ['Embed Scorecard™', 'Medir uso, confianza, performance, control y valor.'],
  ['Scale Readiness Gate™', 'Decidir si iterar, integrar, escalar o detener.'],
];

const OUTCOMES = [
  ['Speed', 'Ciclos de decisión y ejecución más cortos.'],
  ['Quality', 'Trabajo consistente, menos errores y mejores outcomes.'],
  ['Growth', 'Nuevos products, experiences y fuentes de valor.'],
  ['Risk', 'Controles, accountability y human oversight claros.'],
  ['Capability', 'Equipos capaces de operar y mejorar el sistema.'],
];

const SCENARIOS = [
  ['Decision intelligence', 'Rediseñar una decisión de alto valor y su flujo de información.', 'Contexto compartido, rutas de excepción y decision rights explícitos.'],
  ['Agentic operations', 'Incorporar agents en un end-to-end workflow controlado.', 'Orquestación, human-in-the-loop model y controles operativos.'],
  ['AI-native product', 'Crear una nueva capability inteligente para clientes o colaboradores.', 'Data layer, ownership de producto y medición de valor.'],
];

const PRINCIPLES = [
  ['Business first', 'Comenzamos por el enterprise outcome, no por la herramienta.'],
  ['Build with, not for', 'Trabajamos con los equipos del cliente para crear ownership y confianza operativa.'],
  ['Adoption by design', 'Roles, controles, skills y medición forman parte de la solución desde el inicio.'],
];

export default function Home() {
  return (
    <div data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      {/* 01 — Hero. Comprensible sin animación; el CTA es usable desde el primer
          momento. Un solo CTA principal por viewport. */}
      <Section band="dark" nodeState={0} pad="var(--space-14)">
        <Kicker dark>AI-native transformation company</Kicker>
        <h1
          style={{
            margin: 'var(--space-6) 0 0',
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-display)',
            fontSize: 'var(--text-hero)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--track-hero)',
            color: 'var(--white)',
            maxWidth: '14ch',
          }}
        >
          BECOME WHAT COMES NEXT.
        </h1>
        <Lead dark>
          Rediseñamos cómo las empresas operan, deciden y crean valor alrededor de la IA.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Inicia tu Discovery</PrimaryCTA>
          <a href="#proposito" style={ghostAnchor}>Descubre cómo trabajamos</a>
        </div>
        <p
          style={{
            margin: 'var(--space-10) 0 0', paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-hairline-dark)',
            font: 'var(--type-body)', color: 'var(--slate-300)', maxWidth: '52ch',
          }}
        >
          Para equipos ejecutivos preparados para pasar de iniciativas de IA a
          reinvención empresarial.
        </p>
        <p style={{ margin: 'var(--space-9) 0 0', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--slate-400)' }}>
          Descubre BECOME ↓
        </p>
      </Section>

      {/* 02 — Nuestro propósito. Declaración breve, no sección institucional. */}
      <Section band="light" id="proposito">
        <Kicker>Our purpose</Kicker>
        <Headline>Hacer de la IA una capability de la empresa, no una colección de iniciativas.</Headline>
        <Lead>
          BECOME existe para ayudar a las empresas a convertirse en aquello que el
          futuro exige. Conectamos ambición, personas, datos, agents y operaciones
          para que la IA cambie cómo la organización decide, trabaja y crea valor.
        </Lead>
        <Reveal as="p" style={{ margin: 'var(--space-8) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', letterSpacing: 'var(--track-display)', color: 'var(--text-heading)', maxWidth: '24ch' }}>
          The next company is already inside yours.
        </Reveal>

        {/* La C y la O de BECOME como los dos estados de la misma empresa. La
            marca explicándose a sí misma, no un adorno. */}
        <div style={{ marginTop: 'var(--space-12)', display: 'grid', justifyItems: 'center' }}>
          <StateTransition dark={false} />
        </div>

        <TextCTA to="/es/nosotros">Conoce BECOME</TextCTA>
      </Section>

      {/* 03 — Cómo lo hacemos. Los cuatro dominios como un sistema, no como
          cuatro feature cards; y las seis etapas como recorrido, no seis cards. */}
      <Section band="dark" nodeState={1}>
        <Kicker dark>How we become</Kicker>
        <Headline dark>No añadimos IA desde fuera. Rediseñamos la empresa desde dentro.</Headline>
        <Lead dark>
          El BECOME™ Transformation Framework conecta strategy, operating-model
          design, building, adoption y scale. En cada etapa transformamos los cuatro
          sistemas que determinan si la IA se convierte en un experimento o en una
          capability empresarial.
        </Lead>

        <Cols min="230px" style={{ marginTop: 'var(--space-11)' }}>
          {DOMAINS.map(([name, line, icon]) => (
            <Reveal as="div" key={name} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <img src={icon} alt="" loading="lazy" decoding="async" style={{ width: 34, height: 34, display: 'block' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>
                {name}
              </h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>

        <TextCTA to="/es/framework" dark>Explora el BECOME Framework</TextCTA>
      </Section>

      <Section band="darker" nodeState={2}>
        <Kicker dark>El recorrido</Kicker>
        <Headline dark>Seis etapas. Un camino de la ambición al valor.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {STAGES.map(([letter, name, work], i) => (
            <Reveal
              as="div"
              key={name}
              data-cols
              className="row-hit"
              style={{
                display: 'grid',
                gridTemplateColumns: '56px minmax(0,1fr) minmax(0,1.4fr)',
                gap: 'var(--space-6)',
                padding: 'var(--space-5) 0',
                borderTop: '1px solid var(--border-hairline-dark)',
                alignItems: 'baseline',
              }}
            >
              <span
                aria-hidden="true"
                className="stage-letter"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--electric-green)' }}
              >
                {letter}
              </span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>
                <span className="sr-only">{`Etapa ${i + 1}: `}</span>{name}
              </h3>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>{work}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 04 — Qué hacemos. Tres servicios encadenados, no tres cards sueltas. */}
      <Section band="light">
        <Kicker>Our offer</Kicker>
        <Headline>Capacita el presente. Diseña lo que sigue. Construye desde dentro.</Headline>
        <Lead>
          Tres servicios conectan las capacidades que tu empresa necesita hoy con la
          transformación que necesita para el futuro.
        </Lead>

        <Reveal as="p" style={{ margin: 'var(--space-9) 0 0', font: 'var(--type-mono)', letterSpacing: 'var(--track-mono)', color: 'var(--text-accent)' }}>
          ENABLE → DEFINE → DESIGN → BUILD → EMBED → SCALE
        </Reveal>

        <Cols min="280px">
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>Aplícalo desde mañana</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              BECOME NOW™
            </h3>
            <Body>
              Capacitación in company para que cada área aprenda a utilizar ChatGPT,
              Claude y Gemini sobre sus propios procesos, documentos y desafíos.
            </Body>
            <Body style={{ color: 'var(--text-body)' }}>
              Equipos preparados, workflows reutilizables y capacidades que pueden
              aplicarse desde el día siguiente.
            </Body>
            <TextCTA to="/es/servicios/become-now">Explora BECOME NOW™</TextCTA>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 semanas</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              AI-Native Transformation Discovery
            </h3>
            <Body>
              Define la AI-native ambition, identifica dónde está el valor y diseña el
              operating model y el roadmap.
            </Body>
            <TextCTA to="/es/servicios/transformation-discovery">Explora Discovery</TextCTA>
          </Card>
          <Card>
            <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 semanas por capability</p>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              Build &amp; Embed Sprint
            </h3>
            <Body>
              Construye e incorpora una capability AI-native con adopción, controles y
              medición.
            </Body>
            <TextCTA to="/es/servicios/build-and-embed">Explora Build &amp; Embed</TextCTA>
          </Card>
        </Cols>

        <Reveal as="p" style={{ margin: 'var(--space-10) 0 0', font: 'var(--type-lead)', color: 'var(--text-heading)', maxWidth: '64ch' }}>
          BECOME NOW™ desarrolla las capacidades para el trabajo de hoy. Discovery
          define en qué debe convertirse la empresa. Build &amp; Embed construye las
          capabilities que harán posible ese futuro.
        </Reveal>

        <TextCTA to="/es/servicios">Explora nuestros servicios</TextCTA>
      </Section>

      {/* 05 — Casos de uso como preguntas. */}
      <Section band="sunken">
        <Kicker>Start with your question</Kicker>
        <Headline>¿Qué necesitas transformar ahora?</Headline>
        <Lead>
          No necesitas conocer el nombre de la solución. Empieza por la situación
          que hoy está bloqueando valor.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {USE_CASES.map((c, i) => (
            <IndexRow key={c.slug} to={c.to} num={String(i + 1).padStart(2, '0')} term={c.q} def={c.line} />
          ))}
        </div>
        <TextCTA to="/es/casos-de-uso">Encuentra tu punto de partida</TextCTA>
      </Section>

      {/* 06 — Proprietary tools. Índice editorial: la decisión que habilita cada
          herramienta, nunca la fórmula. */}
      <Section band="light">
        <Kicker>Built to make transformation concrete</Kicker>
        <Headline>La estrategia se vuelve útil cuando guía una decisión.</Headline>
        <Lead>
          BECOME combina criterio ejecutivo con proprietary tools que hacen visibles
          el readiness, el valor, el diseño, la adopción y la escala.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {TOOLS.map(([tool, decision]) => (
            <IndexRow key={tool} term={tool} def={decision} />
          ))}
        </div>
      </Section>

      {/* 07 — Outcomes. Sistema de medición, no métricas inventadas. */}
      <Section band="dark" nodeState={3}>
        <Kicker dark>Value, made visible</Kicker>
        <Headline dark>Mide lo que cambia, no cuánta IA implementas.</Headline>
        <Cols min="190px">
          {OUTCOMES.map(([dim, line]) => (
            <Reveal as="div" key={dim} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{dim}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>
          Todavía no publicamos cifras de cliente. Cuando existan casos aprobados
          mostraremos baseline, intervención, resultado, periodo y atribución. Hasta
          entonces explicamos el mecanismo de medición, que es lo que se puede
          verificar.
        </Body>
      </Section>

      {/* 08 — Por qué BECOME. */}
      <Section band="light">
        <Kicker>Por qué BECOME</Kicker>
        <Headline>Strategy that builds. Technology that embeds. Capability that stays.</Headline>
        <Cols min="260px">
          {PRINCIPLES.map(([name, line]) => (
            <Reveal as="div" key={name} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{name}</h3>
              <Body>{line}</Body>
            </Reveal>
          ))}
        </Cols>
        <Reveal as="p" style={{ margin: 'var(--space-9) 0 0', font: 'var(--type-lead)', color: 'var(--text-heading)', maxWidth: '46ch' }}>
          El trabajo termina cuando la capability pertenece a la empresa.
        </Reveal>
      </Section>

      {/* 09 — Trabajo y evidencia. Escenarios, marcados como escenarios. */}
      <Section band="darker" nodeState={4}>
        <Kicker dark>The work we are built to do</Kicker>
        <Headline dark>Tres transformaciones que sabemos conducir.</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          Son escenarios de transformación, no casos de cliente. Los publicamos así
          a propósito: cuando haya trabajo aprobado para contar, lo contaremos con
          baseline y atribución.
        </Body>
        <Cols min="260px">
          {SCENARIOS.map(([name, tension, inside]) => (
            <Card dark key={name}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{tension}</Body>
              <p style={{ margin: 'var(--space-5) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-300)' }}>
                <span style={{ color: 'var(--electric-green)' }}>Qué cambia dentro: </span>{inside}
              </p>
            </Card>
          ))}
        </Cols>
      </Section>

      {/* 10 — Insights. Máximo tres piezas. */}
      <Section band="light">
        <Kicker>Become insights</Kicker>
        <Headline>Ideas para la empresa que viene después.</Headline>
        <Lead>
          Perspectivas para líderes que están convirtiendo AI ambition en operating
          capability.
        </Lead>
        <Cols min="260px">
          {[
            ['The AI-native enterprise', 'Qué distingue a una empresa AI-native de una empresa con IA.'],
            ['Agentic work', 'Workflows, roles, agents y responsabilidad humana.'],
            ['Operating-model reinvention', 'Las decisiones de diseño que determinan dónde se acumula el valor.'],
          ].map(([title, line]) => (
            <Card key={title}>
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Pilar editorial
              </p>
              <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{title}</h3>
              <Body>{line}</Body>
            </Card>
          ))}
        </Cols>
        <TextCTA to="/es/insights">Explora Insights</TextCTA>
      </Section>

      {/* 11 — Conversión final. */}
      <Section band="darker" pad="var(--space-14)">
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>¿En qué debe convertirse tu empresa después?</Headline>
        <Lead dark>
          Comienza con una conversación enfocada en el business outcome, la
          capability o el workflow que necesitas transformar.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Inicia tu Discovery</PrimaryCTA>
          <span style={{ font: 'var(--type-body)', color: 'var(--slate-200)' }}>
            O escríbenos a{' '}
            <a href="mailto:hello@become.company" style={{ color: 'var(--electric-green)' }}>hello@become.company</a>
          </span>
        </div>
        <Reveal as="p" style={{ margin: 'var(--space-11) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', letterSpacing: 'var(--track-display)', color: 'var(--slate-200)', maxWidth: '26ch' }}>
          The next company is already inside yours.
        </Reveal>
      </Section>

      <SiteFooter />
    </div>
  );
}

const ghostAnchor = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minHeight: 48, padding: '0 var(--space-7)', borderRadius: 'var(--radius-pill)',
  border: '1px solid var(--border-strong-dark)', color: 'var(--white)',
  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap',
};
