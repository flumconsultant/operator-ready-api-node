import { campo, listasDe } from '../content/paginas/index.js';
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
const LISTAS = listasDe('home');

const WHAT = LISTAS.WHAT;

const STAGES = LISTAS.STAGES;

/* Los cinco sistemas conservan su pictograma de marca: son un set propio y con
   nombre, no iconografía de interfaz. El resto de la web usa Phosphor. */
const DOMAINS = LISTAS.DOMAINS;

const OUTCOMES = LISTAS.OUTCOMES;

const SCENARIOS = LISTAS.SCENARIOS;

const PRINCIPLES = LISTAS.PRINCIPLES;

const CAPACIDADES = LISTAS.CAPACIDADES;

const INSIGHTS = LISTAS.INSIGHTS;

/* Lo que la empresa se queda cuando BECOME se va. Va justo detrás de lo que
   BECOME puede construir, y el orden no es casual: primero qué se construye,
   después qué queda cuando ya no estamos. Es la diferencia entre vender un
   proyecto y vender una capacidad, y es lo único de esta página que responde a
   la pregunta que un comprador se hace al final. */
const QUEDA_DENTRO = LISTAS.QUEDA_DENTRO;

export default function Home() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      {/* 01 — Hero. Comprensible sin animación; el CTA es usable desde el primer
          momento. Un solo CTA principal por viewport. */}
      <Section band="dark" nodeState={0} pad="var(--space-14)">
        <Kicker dark>{campo('home', 'kicker')}</Kicker>
        {/* La línea de marca se queda EXACTAMENTE igual a la vista y deja de ser
            el h1. El motivo es medible: «BECOME WHAT COMES NEXT.» era el mismo
            h1 en /es y en /en —dos páginas distintas diciéndose lo mismo— y en
            la versión española estaba, además, en inglés. El h1 pasa a la frase
            que sí describe esta página, en su idioma. La línea conserva su
            tamaño, su tipografía y su sitio: no cambia un píxel. */}
        <p
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
          {campo('home', 'marca')}
        </p>
        <Lead as="h1" dark>{campo('home', 'promesa')}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">{campo('home', 'ctaPrincipal')}</PrimaryCTA>
          <a href="#que-hacemos" style={ghostAnchor}>{campo('home', 'ctaSecundario')}</a>
        </div>
        <p
          style={{
            margin: 'var(--space-10) 0 0', paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-hairline-dark)',
            font: 'var(--type-body)', color: 'var(--slate-300)', maxWidth: '52ch',
          }}
        >
          {campo('home', 'paraQuien')}
        </p>
      </Section>

      {/* 01b — Por qué más IA no es más transformación. Va aquí porque es la
          objeción que trae quien llega, y contestarla antes de vender nada es
          lo que separa una consultora de un catálogo. */}
      <MasIaNoEsTransformacion lang="es" />

      {/* 02 — Qué hacemos, antes que cualquier método. Tres verbos, tres salidas. */}
      <Section band="light" id="que-hacemos">
        <Kicker>{campo('home', 's1kicker')}</Kicker>
        <Headline>{campo('home', 's1headline')}</Headline>
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
        <Kicker>{campo('home', 's2kicker')}</Kicker>
        <Headline>{campo('home', 's2headline')}</Headline>

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
            <Body>{campo('home', 's2body')}</Body>
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
            <Body>{campo('home', 's2body2')}</Body>
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
            <Body>{campo('home', 's2body3')}</Body>
            <TextCTA to="/es/servicios/become-embed">Explora BECOME EMBED™</TextCTA>
          </Card>
        </Cols>

        <div style={{ marginTop: 'var(--space-10)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <GhostCTA to="/es/servicios#comparacion">Compara los tres</GhostCTA>
          <PrimaryCTA to="/es/contacto">Cuéntanos qué debe cambiar</PrimaryCTA>
        </div>
      </Section>

      {/* 03b — Qué puede construir BECOME.
          Va pegado a los tres servicios porque contesta la pregunta que deja
          leerlos: «vale, ¿y qué sabéis hacer exactamente?». No es una cuarta
          línea de servicio —la arquitectura comercial sigue siendo NOW,
          DISCOVER y EMBED—: es la amplitud de lo que esos tres cubren. */}
      <Section band="sunken">
        <Kicker>{campo('home', 's3kicker')}</Kicker>
        <Headline>{campo('home', 's3headline')}</Headline>
        <Lead>{campo('home', 's3lead')}</Lead>
        <Cols min="200px" style={{ marginTop: 'var(--space-10)' }}>
          {CAPACIDADES.map(([icon, nombre, linea]) => (
            <Reveal as="div" key={nombre} className="icon-hit row-hit" style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={26} style={{ color: 'var(--text-accent)' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {nombre}
              </h3>
              <Body>{linea}</Body>
            </Reveal>
          ))}
        </Cols>
        <TextCTA to="/es/como-transformamos">Conoce cómo transformamos</TextCTA>
      </Section>

      {/* 03b — Lo que queda dentro. */}
      <Section band="light">
        <Kicker>{campo('home', 's13kicker')}</Kicker>
        <Headline>{campo('home', 's13headline')}</Headline>
        <Lead>{campo('home', 's13lead')}</Lead>
        <Cols min="240px" style={{ marginTop: 'var(--space-10)' }}>
          {QUEDA_DENTRO.map(([nombre, linea]) => (
            <Reveal as="div" key={nombre} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                {nombre}
              </h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* 04 — Qué cambia dentro: los cinco sistemas. */}
      <Section band="dark" nodeState={1}>
        <Kicker dark>{campo('home', 's4kicker')}</Kicker>
        <Headline dark>{campo('home', 's4headline')}</Headline>
        <Lead dark>{campo('home', 's4lead')}</Lead>

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
        <Kicker>{campo('home', 's5kicker')}</Kicker>
        <Headline>{campo('home', 's5headline')}</Headline>
        <Lead>{campo('home', 's5lead')}</Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {INDUSTRIAS_MENU.map((i, n) => (
            <IndexRow key={i.slug} index={n} icon={i.icon} to={i.to} num={String(n + 1).padStart(2, '0')} term={i.label} def={i.line} />
          ))}
        </div>
        <TextCTA to="/es/industrias">Explora tu industria</TextCTA>
      </Section>

      {/* 06 — Casos de uso como preguntas. */}
      <Section band="sunken">
        <Kicker>{campo('home', 's6kicker')}</Kicker>
        <Headline>{campo('home', 's6headline')}</Headline>
        <Lead>{campo('home', 's6lead')}</Lead>
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
        <Kicker dark>{campo('home', 's7kicker')}</Kicker>
        <Headline dark>{campo('home', 's7headline')}</Headline>
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
        <Body dark style={{ marginTop: 'var(--space-9)' }}>{campo('home', 's7body')}</Body>
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
        <Kicker dark>{campo('home', 's8kicker')}</Kicker>
        <Headline dark>{campo('home', 's8headline')}</Headline>
        <Cols min="190px">
          {OUTCOMES.map(([icon, dim, line]) => (
            <Reveal as="div" key={dim} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <Ico name={icon} size={28} style={{ color: 'var(--electric-green)' }} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--white)' }}>{dim}</h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{line}</Body>
            </Reveal>
          ))}
        </Cols>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>{campo('home', 's8body')}</Body>
      </Section>

      {/* 09 — Por qué BECOME, con imagen: el bloque de principios era el más
          textual de la página. */}
      <Section band="light">
        <Kicker>{campo('home', 's9kicker')}</Kicker>
        <Headline>{campo('home', 's9headline')}</Headline>
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
        <Kicker dark>{campo('home', 's10kicker')}</Kicker>
        <Headline dark>{campo('home', 's10headline')}</Headline>
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
        <Kicker>{campo('home', 's11kicker')}</Kicker>
        <Headline>{campo('home', 's11headline')}</Headline>
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
        <Kicker dark>{campo('home', 's12kicker')}</Kicker>
        <Headline dark>{campo('home', 's12headline')}</Headline>
        <Lead dark>{campo('home', 's12lead')}</Lead>
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
