import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/PaginaNosotros.dc.html por scripts/dc-to-jsx.mjs */
export default function Nosotros() {
  return (
    <>
      <div data-page-root="" style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section data-dark-image="" style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <img fetchPriority="high" decoding="async" src="/images/46-strategy-session.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              About BECOME
            </p>
            <Reveal as="h1" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(40px,5.2vw,80px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "20ch" }}>
              Estamos construyendo una compañía de transformación diferente.
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "52ch" }}>
              Business-first. AI-native. Diseñada para conectar strategy, building y adoption en un solo sistema.
            </p>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: "var(--space-11)" }} data-cols="">
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
              Por qué existe BECOME
            </h2>
            <Reveal as="div" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <p style={{ margin: "0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "62ch" }}>
                La mayoría de las empresas ya tiene acceso a la IA. Lo que falta es la distancia entre un modelo capaz de ejecutar una tarea y una empresa capaz de usar esa capability de manera responsable, repetible y a escala.
              </p>
              <p style={{ margin: "0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "62ch" }}>
                Cerrar esa distancia exige cambios en roles, datos, workflows, controles y ownership. Por eso trabajamos dentro del operating model, no al lado de él.
              </p>
              <p style={{ margin: "0", font: "var(--weight-display) var(--text-h3)/1.4 var(--font-display)", color: "var(--text-heading)" }}>
                The transformation happens inside.
              </p>
            </Reveal>
          </div>
        </section>
        <section data-dark-plain="" data-deep="" style={{ background: "var(--navy-900)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <Reveal as="h2" style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "22ch" }}>
              Qué nos hace diferentes
            </Reveal>
            <div style={{ margin: "var(--space-9) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-8)" }} data-cols="">
              <Reveal as="div" style={{ borderTop: "1px solid var(--green-line)", paddingTop: "var(--space-5)" }}>
                <img loading="lazy" decoding="async" src="/icons/strategy-white.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Strategy that builds
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  No entregamos un roadmap y salimos. El blueprint entra a producción.
                </p>
              </Reveal>
              <Reveal as="div" style={{ borderTop: "1px solid var(--green-line)", paddingTop: "var(--space-5)" }}>
                <img loading="lazy" decoding="async" src="/icons/integration-white.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Technology that embeds
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  La capability vive dentro del workflow real, con controles y medición.
                </p>
              </Reveal>
              <Reveal as="div" style={{ borderTop: "1px solid var(--green-line)", paddingTop: "var(--space-5)" }}>
                <img loading="lazy" decoding="async" src="/icons/leadership-white.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                  Capability that stays
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  El trabajo termina cuando la capability pertenece a la empresa.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
              Liderazgo
            </h2>
            <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-muted)", maxWidth: "62ch" }}>
              Las biografías comienzan por outcomes de transformación y capacidad ejecutiva, no por historiales laborales extensos.
            </p>
            <div style={{ margin: "var(--space-8) 0 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }} data-cols="">
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", border: "1px solid var(--border-hairline)", padding: "var(--space-8)" }}>
                <img loading="lazy" decoding="async" src="/images/45-executive.webp" alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", marginBottom: "var(--space-6)" }} />
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Fundador
                </p>
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  [EVIDENCIA REQUERIDA] Nombre y rol
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                  [EVIDENCIA REQUERIDA] Dos frases: transformaciones lideradas, dominios y tipo de decisión en la que aporta criterio.
                </p>
              </Reveal>
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", border: "1px solid var(--border-hairline)", padding: "var(--space-8)" }}>
                <img loading="lazy" decoding="async" src="/images/17-team-collab.webp" alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", marginBottom: "var(--space-6)" }} />
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Liderazgo
                </p>
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  [EVIDENCIA REQUERIDA] Nombre y rol
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--text-body)" }}>
                  [EVIDENCIA REQUERIDA] Dos frases: capability construida, sector y responsabilidad operativa.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        <section style={{ background: "var(--pale-100)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-11)" }} data-cols="">
            <Reveal as="div">
              <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                Delivery model
              </h2>
              <ul style={{ margin: "var(--space-6) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Equipos pequeños y senior, con owners del cliente integrados.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Red de especialistas en datos, agents, arquitectura y adopción.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Un solo sistema de trabajo entre Discovery y Build & Embed.
                </li>
              </ul>
            </Reveal>
            <Reveal as="div">
              <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                Responsible work
              </h2>
              <ul style={{ margin: "var(--space-6) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Human accountability explícita en cada capability.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Intended use, límites y excepciones documentados.
                </li>
                <li style={{ font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-3)" }}>
                  Datos, seguridad y medición como parte del diseño.
                </li>
              </ul>
            </Reveal>
          </div>
        </section>
        <section data-dark-plain="" data-deep="" style={{ background: "var(--navy-950)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "22ch" }}>
              Conversemos sobre lo que tu empresa debe convertirse.
            </h2>
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
