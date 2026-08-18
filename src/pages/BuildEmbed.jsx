import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/PaginaBuildEmbed.dc.html por scripts/dc-to-jsx.mjs */
export default function BuildEmbed() {
  return (
    <>
      <div data-page-root="" style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section data-band="--navy-900" data-bg-image="" style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <img fetchPriority="high" decoding="async" src="/images/50-next-gen.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              BECOME Embed™
            </p>
            <Reveal as="h1" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(40px,5.2vw,80px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "18ch" }}>
              Construye la capability. Incorpora el cambio.
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "56ch" }}>
              Un sprint de 8–12 semanas que convierte un transformation blueprint prioritario en una AI-native capability dentro de la operación.
            </p>
            <Link to="/es/contacto" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-9) 0 0", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
              Conversemos sobre Build & Embed
            </Link>
          </div>
        </section>
        <section data-band="--off-white" style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: "var(--space-11)" }} data-cols="">
            <div>
              <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                El problema
              </p>
              <h2 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "16ch" }}>
                Prototypes que nunca se convierten en operating capability.
              </h2>
            </div>
            <Reveal as="div">
              <p style={{ margin: "0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "62ch" }}>
                La demo funciona, pero el workflow real no cambia: no hay owner, ni controles, ni medición, ni un plan para que el equipo lo use todos los días. La capability se queda fuera de la operación.
              </p>
              <h3 style={{ margin: "var(--space-9) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                Qué puede construirse
              </h3>
              <div style={{ margin: "var(--space-5) 0 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Un agentic workflow end-to-end con controles.
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Un decision system para una decisión de alto valor.
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Una product capability para clientes o colaboradores.
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Una data and knowledge layer que habilite las tres anteriores.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
        <section data-band="--navy-900" data-deep="" style={{ background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              Etapas O · M · E
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "22ch" }}>
              Del blueprint a la operación.
            </Reveal>
            <div style={{ margin: "var(--space-10) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "var(--border-hairline-dark)" }} data-cols="">
              <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-8) var(--space-7)" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/design-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    O
                  </span>
                </span>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Operating Model Design
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Validamos el target state de la capability: roles, decisiones, datos y controles.
                </p>
              </Reveal>
              <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-8) var(--space-7)" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/build-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    M
                  </span>
                </span>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Make & Embed
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Construimos, validamos y desplegamos dentro del workflow real, con el equipo del cliente.
                </p>
              </Reveal>
              <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-8) var(--space-7)" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/evolve-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    E
                  </span>
                </span>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Expand & Evolve
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Medimos uso, confianza, performance, control y valor antes de decidir la escala.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        <section data-band="--off-white" style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <Reveal as="h2" style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "22ch" }}>
              Agentic Workflow Blueprint™
            </Reveal>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "62ch" }}>
              Antes de construir definimos quién decide, quién ejecuta, qué datos se usan y qué ocurre con las excepciones.
            </p>
            <div style={{ margin: "var(--space-9) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "var(--border-hairline)" }} data-cols="">
              <Reveal as="div" style={{ background: "var(--white)", padding: "var(--space-7)" }}>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Personas
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                  Dirección, criterio y accountability sobre los outcomes.
                </p>
              </Reveal>
              <Reveal as="div" style={{ background: "var(--white)", padding: "var(--space-7)" }}>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Agents
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                  Trabajo definido, orquestado y observable.
                </p>
              </Reveal>
              <Reveal as="div" style={{ background: "var(--white)", padding: "var(--space-7)" }}>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Controles
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                  Human-in-the-loop model, límites, rutas de excepción y trazabilidad.
                </p>
              </Reveal>
            </div>
            <p style={{ margin: "var(--space-8) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-muted)", maxWidth: "66ch" }}>
              El nivel adecuado de autonomía depende de la decisión, la evidencia disponible, la consecuencia del error y el accountability model.
            </p>
          </div>
        </section>
        <section data-band="--pale-100" style={{ background: "var(--pale-100)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-11)" }} data-cols="">
            <Reveal as="div">
              <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                Adopción y capability transfer
              </h2>
              <ul style={{ margin: "var(--space-6) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Roles y decision rights actualizados.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Entrenamiento en el trabajo real, no en abstracto.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Owner interno de la capability desde la semana uno.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Documentación operativa y runbook de excepciones.
                </li>
              </ul>
            </Reveal>
            <Reveal as="div">
              <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                Medición y decisión de escala
              </h2>
              <div style={{ margin: "var(--space-6) 0 0", background: "var(--white)", border: "1px solid var(--border-hairline)", padding: "var(--space-7)" }}>
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Embed Scorecard™
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Uso, confianza, performance, control y valor.
                </p>
                <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Scale Readiness Gate™
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Iterar, integrar, escalar o detener, con criterios definidos antes del build.
                </p>
              </div>
              <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "52ch" }}>
                Timeline: 8–12 semanas por capability prioritaria, con un client team dedicado a tiempo parcial.
              </p>
            </Reveal>
          </div>
        </section>
        <section data-band="--navy-950" data-deep="" style={{ background: "var(--navy-950)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--weight-display) var(--text-h3)/1.4 var(--font-display)", color: "var(--slate-200)", maxWidth: "60ch" }}>
              El sprint termina con una capability funcionando en un entorno real, con ownership, controles y medición frente a business outcomes.
            </p>
            <h2 style={{ margin: "var(--space-10) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              Pasa del blueprint a una capability incorporada.
            </h2>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "52ch" }}>
              Trae un workflow, decisión o product opportunity prioritario. Definiremos el build path correcto.
            </p>
            <Link to="/es/contacto" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-8) 0 0", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
              Inicia una conversación de build
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
