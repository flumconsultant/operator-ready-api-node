import React from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Card, Cols } from '../components/ui.jsx';
import { Ico, IcoBadge } from '../components/icons.jsx';
import { INDUSTRIAS_MENU } from '../site.js';
import { Banner } from '../components/Media.jsx';

/**
 * Landing de servicios.
 *
 * Su función no es listar dos engagements —eso ya lo hace el desplegable— sino
 * explicar el journey completo antes de pedirle a nadie que elija. Por eso el
 * eje de la página es la secuencia DEFINE → DESIGN → BUILD → EMBED → SCALE, y
 * los dos servicios aparecen como tramos de ese eje, no como dos tarjetas
 * intercambiables.
 */

const JOURNEY = [
  { n: '00', icon: 'capability', step: 'Enable', who: 'BECOME NOW™', q: '¿Sabe el equipo trabajar con IA hoy?', out: 'Capacidades aplicadas, procesos y recursos reutilizables.' },
  { n: '01', icon: 'decision', step: 'Define', who: 'BECOME DISCOVER™', q: '¿Dónde está el valor y qué debe cambiar?', out: 'Ambición, diagnóstico y decisiones prioritarias.' },
  { n: '02', icon: 'layers', step: 'Design', who: 'Punto de conexión', q: '¿Cómo debe operar el modelo futuro?', out: 'Modelo operativo objetivo y diseño de la transformación.' },
  { n: '03', icon: 'build', step: 'Build', who: 'BECOME EMBED™', q: '¿Qué capacidad debe existir y cómo funcionará?', out: 'Proceso, agente, copiloto, producto o sistema de decisión.' },
  { n: '04', icon: 'embed', step: 'Embed', who: 'BECOME EMBED™', q: '¿Cómo se incorpora con adopción y control?', out: 'Responsable asignado, supervisión humana, controles y medición.' },
  { n: '05', icon: 'scale', step: 'Scale', who: 'Evolución posterior', q: '¿Está lista para expandirse?', out: 'Decisión sobre escalar y lista de mejoras pendientes.' },
];

const COMPARE = [
  ['Úsalo cuando', 'Falta claridad estratégica, priorización o diseño del modelo futuro.', 'Existe una oportunidad priorizada y condiciones para construir.'],
  ['Duración', '8–12 semanas.', '8–12 semanas por capacidad.'],
  ['Comienza con', 'Ambición, tensión empresarial o dominio a transformar.', 'Un diseño que se pueda validar, un proceso o una oportunidad priorizada.'],
  ['Termina con', 'Estrategia, portafolio, estado objetivo, caso de negocio y hoja de ruta.', 'Capacidad funcionando, adoptada, controlada y medida.'],
  ['Framework', 'B–E–C–O.', 'O–M–E.'],
  /* La fila de tecnología va aquí y no en una sección aparte: en una tabla de
     comparación se lee como un criterio más de decisión, que es lo que es. */
  ['Foco tecnológico', 'AI landscape, estrategia de modelos, casos de uso, madurez de datos, governance e implicaciones de arquitectura.', 'LLMs, agents, APIs, datos, integraciones, orquestación, evaluación y observabilidad.'],
  ['Siguiente paso', 'BECOME EMBED™ del primer caso priorizado.', 'Iterar, integrar, escalar o detener.'],
];

export default function Servicios() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Nuestros servicios</Kicker>
        <Headline as="h1" dark>De la capacidad de hoy a la empresa que viene.</Headline>
        <Lead dark>
          Tres formas de empezar: capacitar a tu equipo, definir la estrategia
          o construir la solución. Se contratan por separado o en secuencia.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/soluciones">Encuentra tu punto de partida</PrimaryCTA>
          <GhostCTA to="/es/contacto" dark>Conversemos</GhostCTA>
        </div>
      </Section>

      {/* El journey primero: los servicios se entienden como tramos de un eje */}
      <Section band="light">
        <Kicker>El recorrido</Kicker>
        <Headline>Un solo eje. Tres engagements que lo recorren.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {JOURNEY.map((j) => (
            <Reveal
              as="div"
              key={j.n}
              data-cols
              style={{
                display: 'grid',
                gridTemplateColumns: '34px 52px minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.1fr)',
                gap: 'var(--space-6)',
                padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)',
                alignItems: 'start',
              }}
            >
              <Ico name={j.icon} size={26} style={{ color: 'var(--text-accent)', marginTop: 2 }} />
              <span style={{ font: 'var(--type-mono)', color: 'var(--text-faint)' }}>{j.n}</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
                  {j.step}
                </h3>
                <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-faint)' }}>{j.who}</p>
              </div>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{j.q}</p>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)' }}>{j.out}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Banner variant="corridor" seed={67} height="clamp(280px, 36vw, 440px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '26ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          Un eje. Tres formas de entrar en él.
        </Reveal>
      </Banner>

      <Section band="dark">
        <Kicker dark>Our offer</Kicker>
        <Headline dark>Capacita el presente. Diseña lo que sigue. Construye desde dentro.</Headline>
        <Cols min="280px">
          <Card dark>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="capability" size={24} style={{ color: 'var(--electric-green)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>Aplícalo desde mañana</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              BECOME NOW™
            </h3>
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--electric-green)' }}>Capacitación en IA aplicada</p>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Capacitación in company en ChatGPT, Claude y Gemini, construida sobre los
              procesos, documentos y desafíos reales de cada área.
            </Body>
            <TextCTA to="/es/servicios/become-now" dark>Explora BECOME NOW™</TextCTA>
          </Card>
          <Card dark>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="decision" size={24} style={{ color: 'var(--electric-green)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>8–12 semanas</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              BECOME DISCOVER™
            </h3>
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--electric-green)' }}>Estrategia y modelo operativo</p>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Alinea la ambición. Diagnostica la empresa. Identifica el valor. Diseña
              el operating model y el roadmap necesarios para avanzar.
            </Body>
            <TextCTA to="/es/servicios/become-discover" dark>Explora BECOME DISCOVER™</TextCTA>
          </Card>
          <Card dark>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="build" size={24} style={{ color: 'var(--electric-green)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>8–12 semanas por capacidad</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              BECOME EMBED™
            </h3>
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--electric-green)' }}>Construcción e implantación</p>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Diseña, construye e incorpora un proceso, un agente o un producto AI-native
              dentro de la operación, con adopción, controles y medición desde el inicio.
            </Body>
            <TextCTA to="/es/servicios/become-embed" dark>Explora BECOME EMBED™</TextCTA>
          </Card>
        </Cols>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>
          BECOME NOW™ puede contratarse solo o integrarse como capa de adoption y
          construcción de capacidades dentro de los otros dos.
        </Body>
      </Section>

      <Section band="light" id="comparacion">
        <Kicker>Comparación</Kicker>
        <Headline>Cuál necesitas y por qué.</Headline>
        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th scope="col" style={{ ...th, width: '18%' }} />
                <th scope="col" style={th}>BECOME DISCOVER™<span style={{ display: 'block', marginTop: 4, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', textTransform: 'none', letterSpacing: 'normal', color: 'var(--text-muted)' }}>Estrategia y modelo operativo</span></th>
                <th scope="col" style={th}>BECOME EMBED™<span style={{ display: 'block', marginTop: 4, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', textTransform: 'none', letterSpacing: 'normal', color: 'var(--text-muted)' }}>Construcción e implantación</span></th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, a, b]) => (
                <tr key={label}>
                  <th scope="row" style={{ ...td, color: 'var(--text-muted)', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase' }}>{label}</th>
                  <td style={td}>{a}</td>
                  <td style={td}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section band="sunken" id="cual-necesito">
        <Kicker>¿Cuál necesito?</Kicker>
        <Headline>En una frase.</Headline>
        <Cols min="260px">
          <Card>
            <IcoBadge name="decision" />
            <Body style={{ color: 'var(--text-body)' }}>
              Si buscas <strong>definir dirección, priorizar inversiones o diseñar el
              operating model</strong>, necesitas BECOME DISCOVER™.
            </Body>
            <TextCTA to="/es/servicios/become-discover">Ir a BECOME DISCOVER™</TextCTA>
          </Card>
          <Card>
            <IcoBadge name="build" />
            <Body style={{ color: 'var(--text-body)' }}>
              Si ya sabes <strong>qué capacidad construir</strong> y necesitas llevarla
              a la operación, necesitas BECOME EMBED™.
            </Body>
            <TextCTA to="/es/servicios/become-embed">Ir a BECOME EMBED™</TextCTA>
          </Card>
          <Card>
            <IcoBadge name="signpost" />
            <Body style={{ color: 'var(--text-body)' }}>
              Si tienes una oportunidad pero <strong>todavía no un diseño validado</strong>,
              hacemos una revisión corta antes de recomendar BECOME EMBED™.
            </Body>
            <TextCTA to="/es/contacto">Hablemos de esa revisión</TextCTA>
          </Card>
        </Cols>
      </Section>

      {/* El puente a industrias. Los tres servicios describen CÓMO se trabaja;
          quien acaba de leerlos se pregunta si eso aplica a su sector, y sin
          este bloque tendría que volver al menú para averiguarlo. */}
      <Section band="light">
        <Kicker>Tu industria</Kicker>
        <Headline>Los servicios son los mismos. Dónde está el valor, no.</Headline>
        <Body>
          El método no cambia entre sectores. Lo que cambia es qué decisiones
          pesan, qué workflows concentran el problema y qué riesgo hay que
          acotar antes de construir.
        </Body>
        <Cols min="220px" style={{ marginTop: 'var(--space-9)' }}>
          {INDUSTRIAS_MENU.map((i, n) => (
            <Reveal as="div" key={i.slug} index={n} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26 }}>
                <Link to={i.to} style={{ color: 'var(--text-heading)', textDecoration: 'none' }} className="hv-link">{i.label}</Link>
              </h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>{i.line}</Body>
            </Reveal>
          ))}
        </Cols>
        <TextCTA to="/es/industrias">Ver todas las industrias</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>Your next operating model starts with a question</Kicker>
        <Headline dark>No empieces por el servicio. Empieza por la decisión que necesitas tomar.</Headline>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">Cuéntanos qué debe cambiar</PrimaryCTA>
          <GhostCTA to="/es/soluciones" dark>Empieza por tu pregunta</GhostCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}

const th = {
  padding: 'var(--space-4) var(--space-5) var(--space-4) 0',
  borderBottom: '1px solid var(--border-strong)',
  fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
  fontSize: 'var(--text-h3)', color: 'var(--text-heading)', textAlign: 'left',
};
const td = {
  padding: 'var(--space-5) var(--space-5) var(--space-5) 0',
  borderBottom: '1px solid var(--border-hairline)',
  font: 'var(--type-body)', fontSize: 'var(--text-body-md)',
  color: 'var(--text-body)', verticalAlign: 'top', textAlign: 'left',
};
