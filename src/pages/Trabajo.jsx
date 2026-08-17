import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/PaginaTrabajo.dc.html por scripts/dc-to-jsx.mjs */
export default function Trabajo() {
  return (
    <>
      <div style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <img fetchPriority="high" decoding="async" src="/images/47-global-ops.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              Trabajo y evidencia
            </p>
            <Reveal as="h1" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(40px,5.2vw,80px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "18ch" }}>
              THE WORK WE ARE BUILT TO DO
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "58ch" }}>
              Tres transformation scenarios que describen cómo trabajamos. Son escenarios, no casos de clientes. Publicaremos resultados medidos cuando existan casos aprobados.
            </p>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-11)" }}>
            <Reveal as="article" style={{ display: "grid", gridTemplateColumns: ".7fr 1.3fr", gap: "var(--space-9)", paddingTop: "var(--space-7)", borderTop: "2px solid var(--deep-navy)" }} data-cols="">
              <div>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Escenario 01
                </p>
                <h2 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h1)", fontSize: "var(--text-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/decision.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                  Decision intelligence
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-7)" }} data-cols="">
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Enterprise tension
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Una decisión de alto valor depende de información fragmentada y coordinación manual entre áreas.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Qué cambia dentro
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Shared context, decision rights explícitos y rutas de excepción definidas.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Capability habilitada
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Un decision system con recomendación contextual y trazabilidad.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Cómo se mediría
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Tiempo de decisión, consistencia, tasa de excepciones y calidad del resultado frente al baseline.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal as="article" style={{ display: "grid", gridTemplateColumns: ".7fr 1.3fr", gap: "var(--space-9)", paddingTop: "var(--space-7)", borderTop: "2px solid var(--deep-navy)" }} data-cols="">
              <div>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Escenario 02
                </p>
                <h2 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h1)", fontSize: "var(--text-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/automation.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                  Agentic operations
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-7)" }} data-cols="">
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Enterprise tension
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Un workflow end-to-end acumula reprocesos, traspasos y tiempos de espera.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Qué cambia dentro
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Orquestación entre personas y agents, con human-in-the-loop model y controles operativos.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Capability habilitada
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Un agentic workflow supervisado, observable y con owner interno.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Cómo se mediría
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Lead time, capacidad por persona, tasa de error y cumplimiento de controles.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal as="article" style={{ display: "grid", gridTemplateColumns: ".7fr 1.3fr", gap: "var(--space-9)", paddingTop: "var(--space-7)", borderTop: "2px solid var(--deep-navy)" }} data-cols="">
              <div>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Escenario 03
                </p>
                <h2 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h1)", fontSize: "var(--text-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/products-inside.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                  AI-native product
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-7)" }} data-cols="">
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Enterprise tension
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    La propuesta de valor al cliente no aprovecha el conocimiento que la empresa ya tiene.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Qué cambia dentro
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Data and knowledge layer, ownership de producto y ciclo de mejora continua.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Capability habilitada
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Una product capability inteligente para clientes o colaboradores.
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                    Cómo se mediría
                  </p>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                    Adopción, retención, ingreso incremental y coste de servicio.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <section data-deep="" style={{ background: "var(--navy-900)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", maxWidth: "24ch" }}>
              Cómo publicaremos los casos
            </h2>
            <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--slate-200)", maxWidth: "62ch" }}>
              Cuando un cliente aprueba la publicación, el caso sigue siempre la misma secuencia y muestra baseline, intervención, resultado, periodo y atribución.
            </p>
            <div style={{ margin: "var(--space-8) 0 0", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "1px", background: "var(--border-hairline-dark)" }} data-cols="">
              <div style={{ background: "var(--navy-900)", padding: "var(--space-6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/people-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                  <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    01
                  </span>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-100)" }}>
                  What was
                </p>
              </div>
              <div style={{ background: "var(--navy-900)", padding: "var(--space-6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/data-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                  <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    02
                  </span>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-100)" }}>
                  What changed inside
                </p>
              </div>
              <div style={{ background: "var(--navy-900)", padding: "var(--space-6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/agents-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                  <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    03
                  </span>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-100)" }}>
                  What became possible
                </p>
              </div>
              <div style={{ background: "var(--navy-900)", padding: "var(--space-6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/operations-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                  <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                    04
                  </span>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-100)" }}>
                  Business outcome
                </p>
              </div>
              <div style={{ background: "var(--navy-900)", padding: "var(--space-6)" }}>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--electric-green)" }}>
                  05
                </p>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-100)" }}>
                  Capability retained
                </p>
              </div>
            </div>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-body)", color: "var(--slate-300)" }}>
              [EVIDENCIA REQUERIDA] Los casos con resultados medidos se publicarán solo con aprobación del cliente.
            </p>
            <Link to="/contacto" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-9) 0 0", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
              Inicia tu Discovery
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
