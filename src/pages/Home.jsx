import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import {
  Section, Kicker, Headline, Lead, Body,
  PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow,
} from '../components/ui.jsx';
import { Ico, IcoBadge } from '../components/icons.jsx';
import { Figure, Split } from '../components/Media.jsx';
import ScrollStage from '../components/ScrollStage.jsx';
import GradientField from '../components/GradientField.jsx';
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
 * Dos decisiones sobre densidad, que es lo que más lastraba esta página:
 *
 *   · Justo debajo del hero va lo que hacemos en tres líneas concretas —
 *     capacitar, definir, construir— antes de cualquier explicación de método.
 *     Quien llega no sabe qué vendemos, y el propósito no se lo dice.
 *   · Ningún bloque lleva dos párrafos de introducción. Donde había un Lead y
 *     un Body diciendo lo mismo con distintas palabras, queda el Lead.
 *
 * Los `nodeState` son las anclas del nodo 3D. Solo van en secciones oscuras: en
 * las claras el nodo baja tanto que un estado anclado ahí no se vería.
 */

/* Lo que hacemos, sin método de por medio. Es el primer bloque tras el hero. */
const WHAT = [
  {
    icon: 'capability',
    label: 'Capacitamos',
    line: 'Cada área aprende a trabajar con IA sobre sus propios procesos y documentos.',
    to: '/es/servicios/become-now',
    cta: 'BECOME NOW™',
  },
  {
    icon: 'decision',
    label: 'Definimos',
    line: 'Dónde está el valor, qué debe cambiar y cómo debe operar la empresa después.',
    to: '/es/servicios/transformation-discovery',
    cta: 'Discovery',
  },
  {
    icon: 'build',
    label: 'Construimos',
    line: 'El workflow, el agent o el producto, dentro de la operación y con quien lo va a usar.',
    to: '/es/servicios/build-and-embed',
    cta: 'Build & Embed',
  },
];

const STAGES = [
  ['B', 'Business Ambition', 'Define en qué debe convertirse la empresa y qué outcomes importan.'],
  ['E', 'Enterprise Discovery', 'Comprende cómo funciona hoy y qué limita el cambio.'],
  ['C', 'Capacidad Choices', 'Prioriza dónde la IA puede crear valor diferencial.'],
  ['O', 'Operating Model Design', 'Diseña el sistema futuro.'],
  ['M', 'Make & Embed', 'Construye e incorpora la capacidad.'],
  ['E', 'Expand & Evolve', 'Mide, gobierna, transfiere y escala.'],
];

/* Los cinco sistemas conservan su pictograma de marca: son un set propio y con
   nombre, no iconografía de interfaz. El resto de la web usa Phosphor. */
const DOMAINS = [
  ['People, inside.', 'Liderazgo, roles, skills y adopción diseñados para el trabajo entre personas e IA.', '/icons/people-inside-white.webp'],
  ['Data, inside.', 'Contexto y conocimiento convertidos en decisiones y acción.', '/icons/data-inside-white.webp'],
  ['Agents, inside.', 'Copilots y agents incorporados en workflows reales, con supervisión humana definida.', '/icons/agents-inside-white.webp'],
  ['Products, inside.', 'Propuestas, experiencias y diferenciación construidas sobre lo que la IA hace posible.', '/icons/products-inside-white.webp'],
  ['Operations, inside.', 'Procesos, governance y performance rediseñados para crear valor a escala.', '/icons/operations-inside-white.webp'],
];

const OUTCOMES = [
  ['speed', 'Speed', 'Ciclos de decisión y ejecución más cortos.'],
  ['quality', 'Quality', 'Trabajo consistente, menos errores y mejores outcomes.'],
  ['growth', 'Growth', 'Nuevos products, experiences y fuentes de valor.'],
  ['risk', 'Risk', 'Controles, accountability y human oversight claros.'],
  ['capability', 'Capacidad', 'Equipos capaces de operar y mejorar el sistema.'],
];

const SCENARIOS = [
  ['decision', 'Decision intelligence', 'Rediseñar una decisión de alto valor y su flujo de información.', 'Contexto compartido, rutas de excepción y decision rights explícitos.', '/images/46-strategy-session.webp', 'Equipo directivo trabajando sobre una decisión'],
  ['flow', 'Agentic operations', 'Incorporar agents en un end-to-end workflow controlado.', 'Orquestación, human-in-the-loop model y controles operativos.', '/images/19-tech-workspace.webp', 'Puesto de trabajo con operaciones asistidas por IA'],
  ['product', 'AI-native product', 'Crear una nueva capacidad inteligente para clientes o colaboradores.', 'Data layer, ownership de producto y medición de valor.', '/images/50-next-gen.webp', 'Equipo construyendo un producto AI-native'],
];

const PRINCIPLES = [
  ['target', 'Business first', 'Comenzamos por el enterprise outcome, no por la herramienta.'],
  ['together', 'Build with, not for', 'Trabajamos con los equipos del cliente para crear ownership y confianza operativa.'],
  ['fit', 'Adoption by design', 'Roles, controles, skills y medición forman parte de la solución desde el inicio.'],
];

const INSIGHTS = [
  ['agents', 'The AI-native enterprise', 'Qué distingue a una empresa AI-native de una empresa con IA.'],
  ['flow', 'Agentic work', 'Workflows, roles, agents y responsabilidad humana.'],
  ['operations', 'Operating-model reinvention', 'Las decisiones de diseño que determinan dónde se acumula el valor.'],
];

export default function Home() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
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
          <a href="#que-hacemos" style={ghostAnchor}>Ver qué hacemos</a>
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
      </Section>

      {/* 02 — Qué hacemos, antes que cualquier método. Tres verbos, tres salidas. */}
      <Section band="light" id="que-hacemos">
        <Kicker>Qué hacemos</Kicker>
        <Headline>Capacitamos equipos, definimos el cambio y construimos la capacidad.</Headline>
        <Cols min="260px">
          {WHAT.map((w) => (
            <Reveal as="div" key={w.label} className="row-hit" style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <IcoBadge name={w.icon} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {w.label}
              </h3>
              <Body>{w.line}</Body>
              <TextCTA to={w.to}>{w.cta}</TextCTA>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* El tramo inmersivo: aquí el scroll deja de mover la página y mueve la
          cámara. Va justo después de "qué hacemos" a propósito — es el punto en
          el que alguien ya sabe qué vendemos y hay que enseñarle por qué. */}
      <ScrollStage
        variant="corridor"
        seed={13}
        steps={[
          { kicker: 'Hoy', title: 'La empresa que ya tienes.', line: 'Iniciativas de IA sueltas, pilotos que no escalan y decisiones que siguen tardando lo mismo.' },
          { kicker: 'Dentro', title: 'El sistema que la mueve.', line: 'Personas, datos, agents y operaciones. Cambiar la empresa es cambiar los cuatro a la vez.' },
          { kicker: 'Después', title: 'La empresa en la que se convierte.', line: 'Una capacidad propia, gobernada y medida, que sigue evolucionando sin nosotros delante.' },
        ]}
      />

      {/* 03 — Nuestro propósito. Declaración breve, no sección institucional. */}
      <Section band="light" id="proposito">
        <Kicker>Our purpose</Kicker>
        <Headline>Hacer de la IA una capacidad de la empresa, no una colección de iniciativas.</Headline>

        {/* La C y la O de BECOME como los dos estados de la misma empresa. La
            marca explicándose a sí misma, no un adorno. */}
        <div style={{ marginTop: 'var(--space-12)', display: 'grid', justifyItems: 'center' }}>
          <StateTransition dark={false} />
        </div>

        <TextCTA to="/es/nosotros">Conoce BECOME</TextCTA>
      </Section>

      {/* 04 — Cómo lo hacemos. Los cinco dominios como un sistema, no como
          cinco feature cards; y las seis etapas como recorrido, no seis cards. */}
      <Section band="dark" nodeState={1}>
        <Kicker dark>How we become</Kicker>
        <Headline dark>No añadimos IA desde fuera. Rediseñamos la empresa desde dentro.</Headline>
        <Lead dark>
          En cada etapa transformamos los cinco sistemas que deciden si la IA es un
          experimento o una capacidad de la empresa.
        </Lead>

        <Cols min="230px" style={{ marginTop: 'var(--space-11)' }}>
          {DOMAINS.map(([name, line, icon]) => (
            <Reveal as="div" key={name} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <img src={icon} alt="" loading="lazy" decoding="async" width="34" height="34" style={{ width: 34, height: 34, display: 'block' }} />
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
        {/* Tira compacta: la descripción de cada etapa vive en /framework. En la
            home estaba entera, y era el bloque que más pantallas costaba a
            cambio de decir lo mismo dos veces. */}
        <ol style={{ listStyle: 'none', margin: 'var(--space-10) 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-6)' }}>
          {STAGES.map(([letter, name], i) => (
            <Reveal as="li" key={name} className="row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <span aria-hidden="true" className="stage-letter" style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 1, color: 'var(--electric-green)' }}>
                {letter}
              </span>
              <p style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--white)' }}>
                <span className="sr-only">{`Etapa ${i + 1}: `}</span>{name}
              </p>
            </Reveal>
          ))}
        </ol>
        {/* Las siete herramientas propias eran una sección entera que solo
            anunciaba la de /framework. Aquí caben en una línea. */}
        <Body dark style={{ marginTop: 'var(--space-9)' }}>
          Cada etapa se apoya en una herramienta propia que desbloquea una decisión
          concreta: readiness, valor, diseño, adopción y escala.
        </Body>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <GhostCTA to="/es/framework" dark>Ver el framework y sus herramientas</GhostCTA>
          <PrimaryCTA to="/es/contacto">Empieza por tu etapa</PrimaryCTA>
        </div>
      </Section>

      {/* 05 — Los tres servicios encadenados, no tres cards sueltas. */}
      <Section band="light">
        <Kicker>Our offer</Kicker>
        <Headline>Capacita el presente. Diseña lo que sigue. Construye desde dentro.</Headline>

        <Reveal as="p" style={{ margin: 'var(--space-9) 0 0', font: 'var(--type-mono)', letterSpacing: 'var(--track-mono)', color: 'var(--text-accent)' }}>
          ENABLE → DEFINE → DESIGN → BUILD → EMBED → SCALE
        </Reveal>

        <Cols min="280px">
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="capability" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>Aplícalo desde mañana</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              BECOME NOW™
            </h3>
            <Body>
              Capacitación in company para que cada área use ChatGPT, Claude y Gemini
              sobre sus propios procesos, documentos y desafíos.
            </Body>
            <TextCTA to="/es/servicios/become-now">Explora BECOME NOW™</TextCTA>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="decision" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 semanas</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              AI-Native Transformation Discovery
            </h3>
            <Body>
              Define la ambición, identifica dónde está el valor y diseña el operating
              model y el roadmap.
            </Body>
            <TextCTA to="/es/servicios/transformation-discovery">Explora Discovery</TextCTA>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="build" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 semanas por capacidad</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              Build &amp; Embed Sprint
            </h3>
            <Body>
              Construye e incorpora una capacidad AI-native con adopción, controles y
              medición.
            </Body>
            <TextCTA to="/es/servicios/build-and-embed">Explora Build &amp; Embed</TextCTA>
          </Card>
        </Cols>

        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <GhostCTA to="/es/servicios#comparacion">Compara los tres</GhostCTA>
          <PrimaryCTA to="/es/contacto">Cuéntanos qué debe cambiar</PrimaryCTA>
        </div>
      </Section>

      {/* 06 — Casos de uso como preguntas. */}
      <Section band="sunken">
        <Kicker>Start with your question</Kicker>
        <Headline>¿Qué necesitas transformar ahora?</Headline>
        <Lead>Empieza por la situación, no por el nombre de la solución.</Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {USE_CASES.map((c, i) => (
            <IndexRow key={c.slug} index={i} icon={c.icon} to={c.to} num={String(i + 1).padStart(2, '0')} term={c.q} def={c.line} />
          ))}
        </div>
        <TextCTA to="/es/casos-de-uso">Encuentra tu punto de partida</TextCTA>
      </Section>

      {/* 08 — Outcomes. Sistema de medición, no métricas inventadas. */}
      <Section band="dark" nodeState={3}>
        <Kicker dark>Value, made visible</Kicker>
        <Headline dark>Mide lo que cambia, no cuánta IA implementas.</Headline>
        <Cols min="190px">
          {OUTCOMES.map(([icon, dim, line]) => (
            <Reveal as="div" key={dim} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{dim}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>
          Todavía no publicamos cifras de cliente. Cuando las haya irán con baseline
          y atribución.
        </Body>
      </Section>

      {/* 09 — Por qué BECOME, con imagen: el bloque de principios era el más
          textual de la página. */}
      <Section band="light">
        <Kicker>Por qué BECOME</Kicker>
        <Headline>Strategy that builds. Technology that embeds. Capacidad that stays.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          <Split src="/images/45-executive.webp" alt="Conversación ejecutiva sobre el modelo operativo" ratio="1 / 1">
            <div style={{ display: 'grid', gap: 'var(--space-7)' }}>
              {PRINCIPLES.map(([icon, name, line]) => (
                <Reveal as="div" key={name} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: 'var(--space-5)', alignItems: 'start', borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
                  <IcoBadge name={icon} />
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{name}</h3>
                    <Body>{line}</Body>
                  </div>
                </Reveal>
              ))}
              <Reveal as="p" style={{ margin: 0, font: 'var(--type-lead)', color: 'var(--text-heading)', maxWidth: '42ch' }}>
                El trabajo termina cuando la capacidad pertenece a la empresa.
              </Reveal>
              <div><GhostCTA to="/es/nosotros">Conoce cómo trabajamos</GhostCTA></div>
            </div>
          </Split>
        </div>
      </Section>

      {/* 10 — Trabajo y evidencia. Escenarios, marcados como escenarios. */}
      <Section band="darker" nodeState={4}>
        <Kicker dark>The work we are built to do</Kicker>
        <Headline dark>Tres transformaciones que sabemos conducir.</Headline>
        <Body dark style={{ marginTop: 'var(--space-6)' }}>
          Son escenarios, no casos de cliente.
        </Body>
        <Cols min="260px">
          {SCENARIOS.map(([icon, name, tension, inside, img, alt]) => (
            <Reveal as="article" key={name} data-lift="" style={{ background: 'var(--navy-850)', border: '1px solid var(--border-hairline-dark)' }}>
              <Figure src={img} alt={alt} ratio="16 / 10" />
              <div style={{ padding: 'var(--space-7)' }}>
                <Ico name={icon} size={26} style={{ color: 'var(--electric-green)' }} />
                <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{name}</h3>
                <Body dark style={{ marginTop: 'var(--space-4)' }}>{tension}</Body>
                <p style={{ margin: 'var(--space-5) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-300)' }}>
                  <span style={{ color: 'var(--electric-green)' }}>Qué cambia dentro: </span>{inside}
                </p>
              </div>
            </Reveal>
          ))}
        </Cols>
        <TextCTA to="/es/casos-de-uso" dark>Encuentra el escenario que se parece al tuyo</TextCTA>
      </Section>

      {/* 11 — Insights. Tres piezas, en índice: como tarjetas ocupaban una
          pantalla para decir tres frases. */}
      <Section band="light">
        <Kicker>Become insights</Kicker>
        <Headline>Ideas para la empresa que viene después.</Headline>
        <div style={{ marginTop: 'var(--space-9)' }}>
          {INSIGHTS.map(([icon, title, line], i) => (
            <IndexRow key={title} index={i} icon={icon} term={title} def={line} />
          ))}
        </div>
        <TextCTA to="/es/insights">Explora Insights</TextCTA>
      </Section>

      {/* 12 — Conversión final.
          El gradiente vivo va aquí y no en el hero: el hero ya es del nodo de
          partículas, y dos sistemas animados en la misma pantalla se anulan. En
          el cierre, en cambio, una mezcla que no para de transformarse es
          literalmente lo que dice el titular. */}
      <Section band="darker" pad="var(--space-14)" backdrop={<GradientField speed={1.6} />}>
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>¿En qué debe convertirse tu empresa después?</Headline>
        <Lead dark>
          Empieza con una conversación sobre el outcome, la capacidad o el workflow
          que necesitas transformar. Menos de dos minutos para contárnoslo.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Inicia tu Discovery</PrimaryCTA>
          <GhostCTA to="/es/servicios/become-now" dark>O capacita a tu equipo ya</GhostCTA>
        </div>
        <p style={{ margin: 'var(--space-7) 0 0', display: 'inline-flex', alignItems: 'center', gap: 10, font: 'var(--type-body)', color: 'var(--slate-200)' }}>
          <Ico name="chat" size={20} style={{ color: 'var(--electric-green)' }} />
          O escríbenos a{' '}
          <a href="mailto:hello@meetbecome.com" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 24, color: 'var(--electric-green)' }}>hello@meetbecome.com</a>
        </p>
      </Section>

      <SiteFooter />
    </main>
  );
}

const ghostAnchor = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minHeight: 48, padding: '0 var(--space-7)', borderRadius: 'var(--radius-pill)',
  border: '1px solid var(--border-strong-dark)', color: 'var(--white)',
  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap',
};
