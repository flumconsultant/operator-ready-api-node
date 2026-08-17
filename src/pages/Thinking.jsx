import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/PaginaThinking.dc.html por scripts/dc-to-jsx.mjs */
export default function Thinking() {
  return (
    <>
      <div style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <img fetchPriority="high" decoding="async" src="/images/42-future-forward.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              BECOME thinking
            </p>
            <Reveal as="h1" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(40px,5.2vw,80px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "18ch" }}>
              Ideas para la empresa después de lo digital.
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "58ch" }}>
              Perspectivas sobre AI-native operating models, agentic work, decision intelligence y enterprise reinvention.
            </p>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
              Pilares editoriales
            </h2>
            <div style={{ margin: "var(--space-9) 0 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border-hairline)" }} data-cols="">
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", padding: "var(--space-9)" }}>
                <img loading="lazy" decoding="async" src="/icons/intelligence.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "20ch" }}>
                  The AI-native enterprise
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "52ch" }}>
                  Qué distingue a una empresa AI-native de una empresa con IA: dónde se toman las decisiones, quién responde por ellas y cómo se acumula la capability.
                </p>
              </Reveal>
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", padding: "var(--space-9)" }}>
                <img loading="lazy" decoding="async" src="/icons/agents-inside.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "20ch" }}>
                  Agentic workflows y el futuro del trabajo
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "52ch" }}>
                  Cómo se reparten decisión y ejecución entre personas y agents, y qué exige eso de roles, skills y supervisión.
                </p>
              </Reveal>
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", padding: "var(--space-9)" }}>
                <img loading="lazy" decoding="async" src="/icons/design.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "20ch" }}>
                  Reinvención del operating model
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "52ch" }}>
                  Las decisiones de diseño que determinan dónde se acumula el valor empresarial: decision rights, datos, workflows y governance.
                </p>
              </Reveal>
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", padding: "var(--space-9)" }}>
                <img loading="lazy" decoding="async" src="/icons/value.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "20ch" }}>
                  Valor, adopción y escala responsable
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "52ch" }}>
                  Cómo se mide el valor real de una capability y qué condiciones deben cumplirse antes de escalarla.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        <section style={{ background: "var(--pale-100)", padding: "var(--space-12) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: "var(--space-11)" }} data-cols="">
            <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
              Últimas publicaciones
            </h2>
            <Reveal as="div">
              <p style={{ margin: "0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)", maxWidth: "60ch" }}>
                Este índice se administra desde el CMS. Cada pieza declara pilar editorial, audiencia y la decisión que ayuda a tomar.
              </p>
              <div style={{ margin: "var(--space-7) 0 0", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-strong)" }} data-cols="">
                  <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--text-muted)" }}>
                    Pilar 01
                  </p>
                  <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    [EVIDENCIA REQUERIDA] Título de la pieza
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-strong)" }} data-cols="">
                  <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--text-muted)" }}>
                    Pilar 03
                  </p>
                  <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    [EVIDENCIA REQUERIDA] Título de la pieza
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-strong)", borderBottom: "1px solid var(--border-strong)" }} data-cols="">
                  <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--text-muted)" }}>
                    Pilar 04
                  </p>
                  <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    [EVIDENCIA REQUERIDA] Título de la pieza
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <section data-deep="" style={{ background: "var(--navy-950)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <h2 style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "22ch" }}>
              ¿En qué debe convertirse tu empresa después?
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
