import React from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { campo } from '../content/paginas/index.js';
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
  { n: '00', icon: 'capability', step: 'Enable', who: 'BECOME NOW™', out: 'Capacidades aplicadas, procesos y recursos reutilizables.' },
  { n: '01', icon: 'decision', step: 'Define', who: 'BECOME DISCOVER™', out: 'Ambición, diagnóstico y decisiones prioritarias.' },
  { n: '02', icon: 'layers', step: 'Design', who: 'Punto de conexión', out: 'Modelo operativo objetivo y diseño de la transformación.' },
  { n: '03', icon: 'build', step: 'Build', who: 'BECOME EMBED™', out: 'Proceso, agente, copiloto, producto o sistema de decisión.' },
  { n: '04', icon: 'embed', step: 'Embed', who: 'BECOME EMBED™', out: 'Responsable asignado, supervisión humana, controles y medición.' },
  { n: '05', icon: 'scale', step: 'Scale', who: 'Evolución posterior', out: 'Decisión sobre escalar y lista de mejoras pendientes.' },
];

const COMPARE = [
  ['Si hoy necesitas',
   'Que un equipo trabaje mejor con IA sobre su propio trabajo.',
   'Decidir dónde está el valor de la IA y qué debe cambiar.',
   'Convertir una prioridad en una capacidad que opere.'],
  ['Qué hacemos',
   'Capacitación aplicada sobre procesos, documentos y herramientas reales.',
   'Estrategia, priorización, modelo operativo objetivo y hoja de ruta.',
   'Diseño, construcción, integración, control y transferencia.'],
  ['Qué queda',
   'Flujos de trabajo, asistentes, activos reutilizables, criterios de validación y plan de adopción.',
   'Bolsas de valor, prioridades, modelo operativo objetivo, caso de negocio y hoja de ruta.',
   'Capacidad funcionando, integraciones, controles, manual de operación, responsable y medición.'],
  ['Duración',
   '12, 18 o 24 horas lectivas, en 4, 6 u 8 sesiones.',
   '8–12 semanas, según alcance.',
   '8–12 semanas por capacidad priorizada.'],
  ['Comienza con',
   'El trabajo real del área y los casos que vale la pena llevar al programa.',
   'Una ambición, una tensión de negocio o un dominio a transformar.',
   'Una prioridad decidida y condiciones para construir.'],
  /* La fila de tecnología va aquí y no en una sección aparte: en una tabla de
     comparación se lee como un criterio más de decisión, que es lo que es. */
  ['Foco tecnológico',
   'Las herramientas autorizadas del cliente: ChatGPT, Claude, Gemini, Microsoft Copilot y las de su propio entorno.',
   'Panorama de IA, estrategia de modelos, madurez de datos, gobierno e implicaciones de arquitectura.',
   'LLMs, agentes, APIs, datos, integraciones, orquestación, evaluación y observabilidad.'],
  ['Siguiente paso',
   'Ampliar a otra área, o priorizar un caso con DISCOVER™.',
   'BECOME EMBED™ del primer caso priorizado.',
   'Iterar, integrar, escalar o detener.'],
];

export default function Servicios() {
  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>{campo('servicios', 'kicker')}</Kicker>
        <Headline as="h1" dark>{campo('servicios', 'h1')}</Headline>
        <Lead dark>{campo('servicios', 'lead')}</Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/casos-de-uso">{campo('servicios', 'ctaPrincipal')}</PrimaryCTA>
          <GhostCTA to="/es/contacto" dark>{campo('servicios', 'ctaSecundario')}</GhostCTA>
        </div>
      </Section>

      <Section band="light" id="comparacion">
        <Kicker>{campo('servicios', 'comparaKicker')}</Kicker>
        <Headline as="h2">{campo('servicios', 'comparaTitular')}</Headline>
        <Lead>{campo('servicios', 'comparaLead')}</Lead>
        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th scope="col" style={{ ...th, width: '16%' }} />
                <th scope="col" style={th}>BECOME NOW™<span style={sub}>Capacitación en IA aplicada</span></th>
                <th scope="col" style={th}>BECOME DISCOVER™<span style={sub}>Estrategia y modelo operativo</span></th>
                <th scope="col" style={th}>BECOME EMBED™<span style={sub}>Construcción e implementación</span></th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, ahora, discover, embed]) => (
                <tr key={label}>
                  <th scope="row" style={{ ...td, color: 'var(--text-muted)', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase' }}>{label}</th>
                  <td style={td}>{ahora}</td>
                  <td style={td}>{discover}</td>
                  <td style={td}>{embed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* El journey primero: los servicios se entienden como tramos de un eje */}
      <Section band="light">
        <Kicker>{campo('servicios', 'ejeKicker')}</Kicker>
        <Headline>{campo('servicios', 'ejeTitular')}</Headline>
        <Lead>{campo('servicios', 'ejeLead')}</Lead>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {JOURNEY.map((j) => (
            <Reveal
              as="div"
              key={j.n}
              data-cols
              style={{
                display: 'grid',
                gridTemplateColumns: '34px 52px minmax(0,1fr) minmax(0,1.6fr)',
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
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-body)' }}>{j.out}</p>
            </Reveal>
          ))}
        </div>
        <TextCTA to="/es/como-transformamos">Conoce el método completo</TextCTA>
      </Section>

      <Banner variant="corridor" seed={67} height="clamp(280px, 36vw, 440px)">
        <Reveal as="p" style={{ margin: 0, maxWidth: '26ch', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--track-display)', color: 'var(--white)' }}>
          Un eje. Tres formas de entrar en él.
        </Reveal>
      </Banner>

      <Section band="dark">
        <Kicker dark>{campo('servicios', 'tresKicker')}</Kicker>
        <Headline dark>{campo('servicios', 'tresTitular')}</Headline>
        <Cols min="280px">
          <Card dark>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Ico name="capability" size={24} style={{ color: 'var(--electric-green)' }} />
              <p style={{ margin: 0, font: 'var(--type-mono)', color: 'var(--electric-green)' }}>12, 18 o 24 horas lectivas</p>
            </div>
            <h3 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--white)' }}>
              BECOME NOW™
            </h3>
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--electric-green)' }}>Capacitación en IA aplicada</p>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Capacitación aplicada en ChatGPT, Claude y Gemini, construida sobre los
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
              Alinea la ambición, identifica dónde está el valor y diseña el modelo
              operativo y la hoja de ruta necesarios para avanzar.
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
            <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--electric-green)' }}>Construcción e implementación</p>
            <Body dark style={{ marginTop: 'var(--space-5)' }}>
              Diseña, construye e incorpora un proceso, un agente o un producto AI-native
              dentro de la operación, con adopción, controles y medición desde el inicio.
            </Body>
            <TextCTA to="/es/servicios/become-embed" dark>Explora BECOME EMBED™</TextCTA>
          </Card>
        </Cols>
        <Body dark style={{ marginTop: 'var(--space-9)' }}>{campo('servicios', 'tresCierre')}</Body>
      </Section>

      {/* El puente a industrias. Los tres servicios describen CÓMO se trabaja;
          quien acaba de leerlos se pregunta si eso aplica a su sector, y sin
          este bloque tendría que volver al menú para averiguarlo. */}
      <Section band="light">
        <Kicker>{campo('servicios', 'industriaKicker')}</Kicker>
        <Headline>{campo('servicios', 'industriaTitular')}</Headline>
        <Body>
          El método no cambia entre sectores. Lo que cambia es qué decisiones
          pesan, qué procesos concentran el problema y qué riesgo hay que
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
        <Kicker dark>{campo('servicios', 'cierreKicker')}</Kicker>
        <Headline dark>{campo('servicios', 'cierreTitular')}</Headline>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/es/contacto">{campo('servicios', 'cierreCtaPrincipal')}</PrimaryCTA>
          <GhostCTA to="/es/casos-de-uso" dark>{campo('servicios', 'cierreCtaSecundario')}</GhostCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}

const sub = {
  display: 'block', marginTop: 4,
  font: 'var(--type-body)', fontSize: 'var(--text-body-sm)',
  textTransform: 'none', letterSpacing: 'normal', color: 'var(--text-muted)',
};
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
