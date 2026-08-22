import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import {
  Section, Kicker, Headline, Lead, Body,
  PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow,
} from '../components/ui.jsx';
import { MasIaNoEsTransformacion, VendorNeutral } from '../components/tecnologia.jsx';
import { Ico, IcoBadge } from '../components/icons.jsx';
import { Figure, Split } from '../components/Media.jsx';
import ScrollStage from '../components/ScrollStage.jsx';
import GradientField from '../components/GradientField.jsx';
import { SOLUCIONES_MENU, INDUSTRIAS_MENU } from '../site.js';

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
    to: '/es/servicios/become-discover',
    cta: 'BECOME DISCOVER™',
  },
  {
    icon: 'build',
    label: 'Construimos',
    line: 'El proceso, el agente o el producto, dentro de la operación y con quien lo va a usar.',
    to: '/es/servicios/become-embed',
    cta: 'BECOME EMBED™',
  },
];

const STAGES = [
  ['B', 'Business Ambition', 'Define en qué debe convertirse la empresa y qué resultados importan.'],
  ['E', 'Enterprise Discovery', 'Comprende cómo funciona hoy y qué limita el cambio.'],
  ['C', 'Elección de capacidades', 'Prioriza dónde la IA puede crear valor diferencial.'],
  ['O', 'Operating Model Design', 'Diseña el sistema futuro.'],
  ['M', 'Make & Embed', 'Construye e incorpora la capacidad.'],
  ['E', 'Expand & Evolve', 'Mide, gobierna, transfiere y escala.'],
];

/* Los cinco sistemas conservan su pictograma de marca: son un set propio y con
   nombre, no iconografía de interfaz. El resto de la web usa Phosphor. */
const DOMAINS = [
  ['People, inside.', 'Personas capaces de trabajar, decidir y colaborar con IA.', '/icons/people-inside-white.webp'],
  ['Data, inside.', 'Datos estructurados y no estructurados preparados para alimentar modelos, RAG, búsqueda empresarial y decisiones.', '/icons/data-inside-white.webp'],
  ['Agents, inside.', 'LLMs, copilotos y agentes de IA capaces de razonar, usar herramientas y ejecutar partes de un proceso dentro de límites definidos.', '/icons/agents-inside-white.webp'],
  ['Products, inside.', 'Productos y experiencias AI-native que incorporan modelos, datos e inteligencia directamente en la propuesta de valor.', '/icons/products-inside-white.webp'],
  ['Operations, inside.', 'Procesos rediseñados para combinar automatización, agentes, decisiones humanas, excepciones y controles.', '/icons/operations-inside-white.webp'],
];

const OUTCOMES = [
  ['speed', 'Velocidad', 'Ciclos de decisión y ejecución más cortos.'],
  ['quality', 'Calidad', 'Trabajo más consistente, menos errores y menos retrabajo.'],
  ['growth', 'Crecimiento', 'Nuevos productos, experiencias y fuentes de valor.'],
  ['risk', 'Riesgo', 'Controles, responsabilidades y supervisión humana claros.'],
  ['capability', 'Capacidad', 'Equipos capaces de operar y mejorar lo construido.'],
];

const SCENARIOS = [
  ['decision', 'Decision intelligence', 'Rediseñar una decisión de alto valor y su flujo de información.', 'Contexto compartido, rutas de excepción y responsabilidades de decisión explícitas.', '/images/46-strategy-session.webp', 'Equipo directivo trabajando sobre una decisión'],
  ['flow', 'Agentic operations', 'Incorporar agentes en un proceso controlado de principio a fin.', 'Orquestación, human-in-the-loop y controles operativos.', '/images/19-tech-workspace.webp', 'Puesto de trabajo con operaciones asistidas por IA'],
  ['product', 'AI-native product', 'Crear una nueva capacidad inteligente para clientes o colaboradores.', 'Capa de datos, responsable de producto y medición de valor.', '/images/50-next-gen.webp', 'Equipo construyendo un producto AI-native'],
];

const PRINCIPLES = [
  ['target', 'Business first', 'Comenzamos por el resultado de negocio, no por la herramienta.'],
  ['together', 'Build with, not for', 'Trabajamos con los equipos del cliente para que la capacidad quede en sus manos, con confianza operativa.'],
  ['fit', 'Adoption by design', 'Roles, controles, capacidades y medición forman parte de la solución desde el inicio.'],
];

const INSIGHTS = [
  ['agents', 'The AI-native enterprise', 'Qué distingue a una empresa AI-native de una empresa con IA.'],
  ['flow', 'Agentic work', 'Procesos, roles, agentes y responsabilidad humana.'],
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
          Convertimos la IA en una capacidad propia de tu empresa. Conectamos la
          estrategia con personas, datos, agentes, productos y operaciones para
          mejorar decisiones, rediseñar la forma de trabajar y crear nuevas
          fuentes de valor.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Encuentra tu punto de partida</PrimaryCTA>
          <a href="#que-hacemos" style={ghostAnchor}>Ver qué hacemos</a>
        </div>
        <p
          style={{
            margin: 'var(--space-10) 0 0', paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-hairline-dark)',
            font: 'var(--type-body)', color: 'var(--slate-300)', maxWidth: '52ch',
          }}
        >
          Para empresas que necesitan pasar de herramientas aisladas y pilotos a
          resultados gobernados, adoptados y medibles.
        </p>
      </Section>

      {/* 01b — Por qué más IA no es más transformación. Va aquí porque es la
          objeción que trae quien llega, y contestarla antes de vender nada es
          lo que separa una consultora de un catálogo. */}
      <MasIaNoEsTransformacion lang="es" />

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
          { kicker: 'Dentro', title: 'El sistema que la mueve.', line: 'Personas, datos, agentes, productos y operaciones. Cambiar la empresa es cambiar los cinco a la vez.' },
          { kicker: 'Después', title: 'La empresa en la que se convierte.', line: 'Una capacidad propia, gobernada y medida, que sigue evolucionando sin nosotros delante.' },
        ]}
      />

      {/* 03 — Los tres servicios. Suben aquí a propósito: quien acaba de leer
          el problema quiere saber qué puede contratar, no cómo trabajamos. El
          método viene después. */}
      <Section band="light">
        <Kicker>Nuestros servicios</Kicker>
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
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--text-accent)' }}>Capacitación en IA aplicada</p>
            <Body>
              Capacitación aplicada para que cada área use ChatGPT, Claude y Gemini sobre
              sus propios procesos, documentos y desafíos.
            </Body>
            <TextCTA to="/es/servicios/become-now">Explora BECOME NOW™</TextCTA>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="decision" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 semanas</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              BECOME DISCOVER™
            </h3>
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--text-accent)' }}>Estrategia y modelo operativo</p>
            <Body>
              Dónde está el valor de la IA en tu empresa, qué se hace primero y cómo
              hay que operar para conseguirlo.
            </Body>
            <TextCTA to="/es/servicios/become-discover">Explora BECOME DISCOVER™</TextCTA>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="build" size={24} style={{ color: 'var(--text-accent)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--text-accent)' }}>8–12 semanas por capacidad</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
              BECOME EMBED™
            </h3>
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--text-accent)' }}>Construcción e implementación</p>
            <Body>
              Construye e incorpora una capacidad AI-native con adopción, controles y
              medición.
            </Body>
            <TextCTA to="/es/servicios/become-embed">Explora BECOME EMBED™</TextCTA>
          </Card>
        </Cols>

        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <GhostCTA to="/es/servicios#comparacion">Compara los tres</GhostCTA>
          <PrimaryCTA to="/es/contacto">Cuéntanos qué debe cambiar</PrimaryCTA>
        </div>
      </Section>

      {/* 04 — Qué cambia dentro: los cinco sistemas. */}
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

        <TextCTA to="/es/como-transformamos" dark>Cómo transformamos</TextCTA>
      </Section>

      {/* 05 — Industrias. Va entre los servicios y los casos de uso a
          propósito: quien acaba de leer las tres formas de trabajar se
          pregunta si eso aplica a SU contexto, y esa es la pregunta que
          responde este bloque. Después ya puede elegir por problema. */}
      <Section band="light">
        <Kicker>Industrias</Kicker>
        <Headline>La tecnología puede ser la misma. El valor no.</Headline>
        <Lead>
          Las capacidades de IA son transversales; el valor no lo es. Lo que
          decide el resultado es qué decisiones, qué procesos y qué riesgos
          definen tu industria.
        </Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {INDUSTRIAS_MENU.map((i, n) => (
            <IndexRow key={i.slug} index={n} icon={i.icon} to={i.to} num={String(n + 1).padStart(2, '0')} term={i.label} def={i.line} />
          ))}
        </div>
        <TextCTA to="/es/industrias">Explora tu industria</TextCTA>
      </Section>

      {/* 06 — Casos de uso como preguntas. */}
      <Section band="sunken">
        <Kicker>Empieza por el problema</Kicker>
        <Headline>¿Qué necesitas transformar ahora?</Headline>
        <Lead>Empieza por la situación, no por el nombre de la solución.</Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {SOLUCIONES_MENU.map((c, i) => (
            <IndexRow key={c.slug} index={i} icon={c.icon} to={c.to} num={String(i + 1).padStart(2, '0')} term={c.label} def={c.q} />
          ))}
        </div>
        <TextCTA to="/es/casos-de-uso">Ver todos los casos de uso</TextCTA>
      </Section>

      {/* 07 — Cómo transformamos: el método viene después de que alguien
          ya sabe qué puede contratar y en qué industria o problema se
          reconoce. Primero la oferta, luego el método. */}
      <Section band="darker" nodeState={2}>
        <Kicker dark>Cómo transformamos</Kicker>
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
          concreta: preparación, valor, diseño, adopción y escala.
        </Body>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <GhostCTA to="/es/como-transformamos" dark>Cómo transformamos</GhostCTA>
          <PrimaryCTA to="/es/contacto">Empieza por tu etapa</PrimaryCTA>
        </div>
      </Section>

      {/* 07b — Vendor-neutral. Después del método a propósito: la pregunta
          «¿y con qué lo hacen?» aparece cuando ya se entiende el trabajo. */}
      <VendorNeutral lang="es" />


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
          Cada proyecto parte de una línea base y de métricas acordadas antes de
          intervenir. Medimos el cambio contra ese punto de partida.
        </Body>
      </Section>

      {/* 09 — Por qué BECOME, con imagen: el bloque de principios era el más
          textual de la página. */}
      <Section band="light">
        <Kicker>Por qué BECOME</Kicker>
        <Headline>Strategy that builds. Technology that embeds. Capability that stays.</Headline>
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
        <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--slate-300)' }}>
          Escenarios ilustrativos
        </p>
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
          Empieza con una conversación sobre el resultado, la capacidad o el proceso
          que necesitas transformar. Menos de dos minutos para contárnoslo.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Encuentra tu punto de partida</PrimaryCTA>
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
