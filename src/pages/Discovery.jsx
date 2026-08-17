import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/PaginaDiscovery.dc.html por scripts/dc-to-jsx.mjs */
export default function Discovery() {
  return (
    <>
      <div style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <img fetchPriority="high" decoding="async" src="/images/46-strategy-session.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              BECOME Discover™
            </p>
            <Reveal as="h1" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(40px,5.2vw,80px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "20ch" }}>
              Define en qué debe convertirse tu empresa después.
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "56ch" }}>
              Un engagement corporativo de 8–12 semanas que conecta AI-native strategy, enterprise diagnosis, value prioritization y operating-model design.
            </p>
            <Link to="/contacto" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-9) 0 0", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
              Conversemos sobre Discovery
            </Link>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: "var(--space-11)" }} data-cols="">
            <div>
              <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                El problema
              </p>
              <h2 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "16ch" }}>
                Actividad de IA sin dirección empresarial.
              </h2>
            </div>
            <Reveal as="div">
              <p style={{ margin: "0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "62ch" }}>
                Existen pilotos, asistentes y automatizaciones, pero no una ambición compartida, un portafolio priorizado ni un operating model que sostenga el cambio. Cada función avanza a su ritmo y el valor no llega a la cuenta de resultados.
              </p>
              <h3 style={{ margin: "var(--space-9) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                Para quién es el engagement
              </h3>
              <ul style={{ margin: "var(--space-5) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <li style={{ font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Existe executive sponsorship.
                </li>
                <li style={{ font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Hay iniciativas de IA sin coherencia empresarial.
                </li>
                <li style={{ font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Un dominio de negocio necesita reinvención.
                </li>
                <li style={{ font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  El liderazgo necesita portfolio, target state o roadmap.
                </li>
                <li style={{ font: "var(--type-body)", color: "var(--text-muted)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  La empresa involucrará a líderes de negocio, tecnología, datos y People.
                </li>
              </ul>
            </Reveal>
          </div>
        </section>
        <section data-deep="" style={{ background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              Etapas B · E · C · O
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              Cuatro etapas, un blueprint ejecutable.
            </Reveal>
            <div style={{ margin: "var(--space-10) 0 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "var(--border-hairline-dark)" }} data-cols="">
              <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/strategy-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 40px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    B
                  </span>
                </span>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Business Ambition
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Alineación ejecutiva sobre outcomes y strategic choices.
                </p>
              </Reveal>
              <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/discover-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 40px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    E
                  </span>
                </span>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Enterprise Discovery
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Diagnóstico de workflows, datos, decisiones y readiness.
                </p>
              </Reveal>
              <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/decision-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 40px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    C
                  </span>
                </span>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Capability Choices
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Value pools priorizados por valor, feasibility, velocidad y riesgo.
                </p>
              </Reveal>
              <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/design-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 40px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    O
                  </span>
                </span>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Operating Model Design
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Target operating model, blueprint, business case y roadmap.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-11)" }} data-cols="">
            <Reveal as="div">
              <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                Actividades y participación ejecutiva
              </h2>
              <ul style={{ margin: "var(--space-6) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Sesiones de ambition con el equipo ejecutivo.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Entrevistas y observación de workflows críticos.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Evaluación de datos, arquitectura, controles y skills.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Workshops de priorización de value pools.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Diseño del target operating model con los owners reales.
                </li>
              </ul>
            </Reveal>
            <Reveal as="div">
              <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                Entregables
              </h2>
              <ul style={{ margin: "var(--space-6) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  AI-native ambition y tesis estratégica
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Enterprise diagnostic e Inside Readiness Index™
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Value pools y portafolio priorizado de capabilities
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Target operating model
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-3)" }}>
                  Transformation blueprint, business case y roadmap
                </li>
              </ul>
            </Reveal>
          </div>
        </section>
        <section style={{ background: "var(--pale-100)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "24ch" }}>
              Decisiones que pueden tomarse al final
            </h2>
            <div style={{ margin: "var(--space-8) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-8)" }} data-cols="">
              <Reveal as="div" style={{ borderTop: "2px solid var(--electric-green)", paddingTop: "var(--space-5)" }}>
                <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Dónde crear valor
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Qué value pools se atacan primero y con qué secuencia.
                </p>
              </Reveal>
              <Reveal as="div" style={{ borderTop: "2px solid var(--electric-green)", paddingTop: "var(--space-5)" }}>
                <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Qué cambia dentro
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Qué roles, decisiones, datos y controles se rediseñan.
                </p>
              </Reveal>
              <Reveal as="div" style={{ borderTop: "2px solid var(--electric-green)", paddingTop: "var(--space-5)" }}>
                <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Qué construir primero
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Qué capability entra al primer Build & Embed Sprint.
                </p>
              </Reveal>
            </div>
            <div style={{ margin: "var(--space-10) 0 0", padding: "var(--space-8)", background: "var(--white)", border: "1px solid var(--border-hairline)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }} data-cols="">
              <div>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Timeline
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  8–12 semanas, con checkpoints ejecutivos cada dos semanas.
                </p>
              </div>
              <div>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Working model
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Equipo mixto BECOME y cliente. Build with, not for.
                </p>
              </div>
            </div>
            <p style={{ margin: "var(--space-9) 0 0", font: "var(--weight-display) var(--text-h3)/1.4 var(--font-display)", color: "var(--text-heading)", maxWidth: "60ch" }}>
              Al terminar Discovery, el liderazgo sabe dónde la IA puede crear valor, qué debe cambiar dentro de la empresa y qué capability debe construir primero.
            </p>
          </div>
        </section>
        <section data-deep="" style={{ background: "var(--navy-950)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              Encuentra el punto correcto para comenzar.
            </h2>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "52ch" }}>
              Cuéntanos qué necesita cambiar en el negocio. Determinaremos si Discovery es el primer paso adecuado.
            </p>
            <Link to="/contacto" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-8) 0 0", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
              Inicia tu Discovery
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
