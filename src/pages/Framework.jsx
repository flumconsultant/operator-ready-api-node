import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/PaginaFramework.dc.html por scripts/dc-to-jsx.mjs */
export default function Framework() {
  return (
    <>
      <div data-page-root="" style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section data-band="--navy-900" data-bg-image="" style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <img fetchPriority="high" decoding="async" src="/images/01-neural-network.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              BECOME™ transformation framework
            </p>
            <Reveal as="h1" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(40px,5.2vw,80px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "22ch" }}>
              Un sistema para convertirse en una empresa AI-native.
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "56ch" }}>
              Seis etapas conectan ambition, discovery, capability choices, operating-model design, construcción y escala.
            </p>
          </div>
        </section>
        <section data-band="--off-white" style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: "var(--space-11)" }} data-cols="">
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
              La tesis
            </h2>
            <Reveal as="div">
              <p style={{ margin: "0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "62ch" }}>
                La IA no cambia una empresa desde el catálogo de use cases. La cambia cuando People, Data, Agents y Operations se rediseñan como un solo sistema, con decision rights, controles y medición explícitos.
              </p>
              <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-muted)", maxWidth: "62ch" }}>
                El framework existe para que cada etapa produzca una decisión, un output y una herramienta, en lugar de un documento.
              </p>
            </Reveal>
          </div>
        </section>
        <section data-band="--navy-900" data-deep="" style={{ background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              Las seis etapas
            </h2>
            <div style={{ position: "relative", margin: "var(--space-10) 0 0", display: "flex", flexDirection: "column" }}>
              <div data-spine="" style={{ position: "absolute", left: "26px", top: "8px", bottom: "8px", width: "1px", background: "linear-gradient(180deg,var(--electric-green) 0%,rgba(0,255,136,.5) 55%,rgba(0,255,136,.12) 100%)", pointerEvents: "none" }} />
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "192px 1fr 1fr 1fr", gap: "var(--space-6)", padding: "var(--space-8) var(--space-4) var(--space-8) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/strategy-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 56px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    B
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Business Ambition
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    ¿En qué debe convertirse la empresa y por qué importa?
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Output
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    AI-native ambition y tesis estratégica.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Herramienta
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    Business Ambition Canvas™
                  </p>
                </div>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "192px 1fr 1fr 1fr", gap: "var(--space-6)", padding: "var(--space-8) var(--space-4) var(--space-8) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/discover-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 56px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    E
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Enterprise Discovery
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    ¿Cómo funciona hoy la empresa y qué limita el cambio?
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Output
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Enterprise diagnostic y readiness por dominio.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Herramienta
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    Inside Readiness Index™
                  </p>
                </div>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "192px 1fr 1fr 1fr", gap: "var(--space-6)", padding: "var(--space-8) var(--space-4) var(--space-8) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/decision-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 56px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    C
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Capability Choices
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    ¿Dónde puede la IA crear valor empresarial diferencial?
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Output
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Value pools y portafolio priorizado de capabilities.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Herramienta
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    AI-Native Value Map™
                  </p>
                </div>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "192px 1fr 1fr 1fr", gap: "var(--space-6)", padding: "var(--space-8) var(--space-4) var(--space-8) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/design-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 56px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    O
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Operating Model Design
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    ¿Cómo debe funcionar el sistema futuro de People, Data, Agents y Operations?
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Output
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Target operating model y transformation blueprint.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Herramienta
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    Inside Target State Canvas™
                  </p>
                </div>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "192px 1fr 1fr 1fr", gap: "var(--space-6)", padding: "var(--space-8) var(--space-4) var(--space-8) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/build-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 56px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    M
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Make & Embed
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    ¿Cómo se construye la capability y se incorpora al trabajo real?
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Output
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Capability funcionando con adopción y controles.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Herramienta
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    Agentic Workflow Blueprint™
                  </p>
                </div>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "192px 1fr 1fr 1fr", gap: "var(--space-6)", padding: "var(--space-8) 0", borderTop: "1px solid var(--border-hairline-dark)", borderBottom: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/evolve-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 56px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    E
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Expand & Evolve
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    ¿Qué se mide, se gobierna, se transfiere y se escala?
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Output
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Scorecard, capability transfer y decisión de escala.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                    Herramienta
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    Embed Scorecard™ · Scale Readiness Gate™
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
        <section data-band="--off-white" style={{ background: "var(--off-white)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <Reveal as="h2" style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "24ch" }}>
              Cuatro dominios presentes en cada etapa
            </Reveal>
            <div style={{ margin: "var(--space-9) 0 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--space-7)" }} data-cols="">
              <Reveal as="div" style={{ borderTop: "2px solid var(--deep-navy)", paddingTop: "var(--space-5)" }}>
                <img loading="lazy" decoding="async" src="/icons/people-inside.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  People
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Liderazgo, roles, skills, decision rights y adopción.
                </p>
              </Reveal>
              <Reveal as="div" style={{ borderTop: "2px solid var(--deep-navy)", paddingTop: "var(--space-5)" }}>
                <img loading="lazy" decoding="async" src="/icons/data-inside.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Data
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Contexto, conocimiento, calidad y acceso gobernado.
                </p>
              </Reveal>
              <Reveal as="div" style={{ borderTop: "2px solid var(--deep-navy)", paddingTop: "var(--space-5)" }}>
                <img loading="lazy" decoding="async" src="/icons/agents-inside.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Agents
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Orquestación, human-in-the-loop model y excepciones.
                </p>
              </Reveal>
              <Reveal as="div" style={{ borderTop: "2px solid var(--deep-navy)", paddingTop: "var(--space-5)" }}>
                <img loading="lazy" decoding="async" src="/icons/operations-inside.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Operations
                </h3>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Procesos, governance, performance y valor a escala.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        <section data-band="--pale-100" style={{ background: "var(--pale-100)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
              Relación con los dos servicios
            </h2>
            <div style={{ margin: "var(--space-8) 0 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }} data-cols="">
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", border: "1px solid var(--border-hairline)", padding: "var(--space-8)" }}>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--text-accent)" }}>
                  B · E · C · O
                </p>
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  AI-Native Transformation Discovery
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                  Define la ambición, diagnostica la empresa, prioriza el valor y diseña el target operating model.
                </p>
                <Link to="/es/servicios/transformation-discovery" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-6) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)", textDecoration: "none", borderBottom: "1px solid var(--border-strong)" }}>
                  Conversemos sobre Discovery →
                </Link>
              </Reveal>
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", border: "1px solid var(--border-hairline)", padding: "var(--space-8)" }}>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--text-accent)" }}>
                  O · M · E
                </p>
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Build & Embed Sprint
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                  Valida el operating model, construye la capability prioritaria y la incorpora con adopción y medición.
                </p>
                <Link to="/es/servicios/build-and-embed" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-6) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)", textDecoration: "none", borderBottom: "1px solid var(--border-strong)" }}>
                  Conversemos sobre Build & Embed →
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
        <section data-band="--navy-900" id="herramientas" style={{ background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <Reveal as="h2" style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              Proprietary tools
            </Reveal>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "60ch" }}>
              Cada herramienta existe para habilitar una decisión. No publicamos scoring formulas ni know-how confidencial.
            </p>
            <div style={{ margin: "var(--space-9) 0 0", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Business Ambition Canvas™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Alinear al equipo ejecutivo alrededor de outcomes y strategic choices.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Inside Readiness Index™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Evaluar madurez en People, Data, Agents y Operations.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                  AI-Native Value Map™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Priorizar oportunidades por valor, feasibility, velocidad y riesgo.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Inside Target State Canvas™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Definir el target operating model y transformation blueprint.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Agentic Workflow Blueprint™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Diseñar roles, agents, datos, decisiones, excepciones y controles.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Embed Scorecard™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Medir uso, confianza, performance, control y valor.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline-dark)", borderBottom: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Scale Readiness Gate™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Decidir si iterar, integrar, escalar o detener.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section data-band="--off-white" style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: "var(--space-11)" }} data-cols="">
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
              Governance y medición
            </h2>
            <Reveal as="div" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <p style={{ margin: "0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "64ch" }}>
                Los agents ejecutan trabajo definido. Las personas establecen dirección, supervisan excepciones y mantienen accountability sobre los outcomes.
              </p>
              <p style={{ margin: "0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "64ch" }}>
                El nivel adecuado de autonomía depende de la decisión, la evidencia disponible, la consecuencia del error y el accountability model.
              </p>
              <p style={{ margin: "0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-muted)", maxWidth: "64ch" }}>
                Cada capability se mide frente a uso, confianza, performance, control y valor antes de decidir su escala.
              </p>
            </Reveal>
          </div>
        </section>
        <section data-band="--navy-950" data-deep="" style={{ background: "var(--navy-950)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "22ch" }}>
              Aplica el framework a tu empresa.
            </h2>
            <Link to="/es/contacto" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-8) 0 0", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
              Inicia tu Discovery
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
