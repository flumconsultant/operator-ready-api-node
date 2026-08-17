import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/WebsiteEs.dc.html por scripts/dc-to-jsx.mjs */
export default function Home() {
  return (
    <>
      <div data-page-root="" style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section data-dark-image="" data-node-state="0" style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-14) var(--gutter-page) var(--space-13)" }}>
          <img fetchPriority="high" decoding="async" src="/images/01-neural-network.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              AI-native transformation company
            </p>
            <Reveal as="h1" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "20ch", textWrap: "balance" }}>
              BECOME WHAT COMES NEXT.
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "46ch" }}>
              Rediseñamos cómo las empresas operan, deciden y crean valor alrededor de la IA.
            </p>
            <div style={{ margin: "var(--space-9) 0 0", display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <Link to="/contacto" style={{ display: "inline-flex", alignItems: "center", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
                Inicia tu Discovery
              </Link>
              <Link to="/como-trabajamos" style={{ display: "inline-flex", alignItems: "center", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong-dark)", color: "var(--white)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-692648d">
                Explora el framework
              </Link>
            </div>
            <p style={{ margin: "var(--space-9) 0 0", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-hairline-dark)", font: "var(--type-body)", color: "var(--slate-300)", maxWidth: "52ch" }}>
              Para equipos ejecutivos preparados para pasar de iniciativas de IA a reinvención empresarial.
            </p>
            <div style={{ margin: "var(--space-9) 0 0", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-hairline-dark)", display: "flex", flexWrap: "wrap", gap: "var(--space-6)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-200)" }}>
                <img loading="lazy" decoding="async" src="/icons/people-inside-white.webp" alt="" style={{ width: "22px", height: "22px" }} />
                People
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-200)" }}>
                <img loading="lazy" decoding="async" src="/icons/data-inside-white.webp" alt="" style={{ width: "22px", height: "22px" }} />
                Data
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-200)" }}>
                <img loading="lazy" decoding="async" src="/icons/agents-inside-white.webp" alt="" style={{ width: "22px", height: "22px" }} />
                Agents
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-200)" }}>
                <img loading="lazy" decoding="async" src="/icons/operations-inside-white.webp" alt="" style={{ width: "22px", height: "22px" }} />
                Operations
              </span>
            </div>
          </div>
        </section>
        <section data-node-state="1" style={{ background: "var(--off-white)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: "var(--space-11)" }} data-cols="">
            <div>
              <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                The enterprise gap
              </p>
              <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "18ch" }}>
                La IA está en todas partes. La reinvención, no.
              </Reveal>
            </div>
            <Reveal as="div">
              <p style={{ margin: "0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "62ch" }}>
                Muchas compañías están agregando IA a la organización que ya tienen: asistentes aislados, automatizaciones locales y pilotos que nunca rediseñan el negocio. El resultado es más tecnología, no una empresa AI-native.
              </p>
              <div style={{ margin: "var(--space-8) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "var(--border-hairline)" }}>
                <div style={{ background: "var(--off-white)", padding: "var(--space-5) var(--space-5) var(--space-5) 0" }}>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Pilotos
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                    Aislados por función
                  </p>
                </div>
                <div style={{ background: "var(--off-white)", padding: "var(--space-5)" }}>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Workflows
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                    Sin rediseñar
                  </p>
                </div>
                <div style={{ background: "var(--off-white)", padding: "var(--space-5)" }}>
                  <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Decision rights
                  </p>
                  <p style={{ margin: "var(--space-2) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                    Sin cambios
                  </p>
                </div>
              </div>
              <p style={{ margin: "var(--space-8) 0 0", font: "var(--weight-display) var(--text-h3)/1.4 var(--font-display)", color: "var(--text-heading)", maxWidth: "48ch" }}>
                AI transformation is not something you add to the company. It changes the company from the inside.
              </p>
            </Reveal>
          </div>
        </section>
        <section data-dark-plain="" data-node-state="2" id="que-transformamos" data-deep="" style={{ position: "relative", background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              The inside system
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              THE TRANSFORMATION HAPPENS INSIDE.
            </Reveal>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "58ch" }}>
              Conectamos los cuatro sistemas que determinan si la IA se convierte en un experimento o en una capability empresarial.
            </p>
            <div style={{ margin: "var(--space-10) 0 0" }}>
              <svg data-connect="" viewBox="0 0 1000 88" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "88px", pointerEvents: "none" }} data-hide-sm="">
                <path data-line="" d="M500 6 V40" fill="none" stroke="var(--electric-green)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path data-line="" d="M125 40 H875" fill="none" stroke="var(--green-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path data-line="" d="M125 40 V82" fill="none" stroke="var(--green-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path data-line="" d="M375 40 V82" fill="none" stroke="var(--green-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path data-line="" d="M625 40 V82" fill="none" stroke="var(--green-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path data-line="" d="M875 40 V82" fill="none" stroke="var(--green-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <circle cx="500" cy="6" r="4" fill="var(--electric-green)" />
                <circle cx="125" cy="82" r="3" fill="var(--electric-green)" />
                <circle cx="375" cy="82" r="3" fill="var(--electric-green)" />
                <circle cx="625" cy="82" r="3" fill="var(--electric-green)" />
                <circle cx="875" cy="82" r="3" fill="var(--electric-green)" />
              </svg>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "var(--border-hairline-dark)" }} data-cols="">
                <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <img loading="lazy" decoding="async" src="/icons/people-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                    <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                      01
                    </span>
                  </div>
                  <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                    People, inside.
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Liderazgo, roles, skills y adopción diseñados para el trabajo entre personas e IA.
                  </p>
                </Reveal>
                <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <img loading="lazy" decoding="async" src="/icons/data-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                    <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                      02
                    </span>
                  </div>
                  <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Data, inside.
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Contexto y conocimiento convertidos en decisiones y acción.
                  </p>
                </Reveal>
                <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <img loading="lazy" decoding="async" src="/icons/agents-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                    <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                      03
                    </span>
                  </div>
                  <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Agents, inside.
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Copilots y agents incorporados en workflows reales, con supervisión humana definida.
                  </p>
                </Reveal>
                <Reveal as="div" style={{ background: "var(--navy-900)", padding: "var(--space-7) var(--space-6)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <img loading="lazy" decoding="async" src="/icons/operations-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                    <span style={{ font: "var(--type-mono)", color: "var(--electric-green)" }}>
                      04
                    </span>
                  </div>
                  <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Operations, inside.
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Procesos, governance y performance rediseñados para crear valor a escala.
                  </p>
                </Reveal>
              </div>
            </div>
            <Link to="/como-trabajamos" style={{ display: "inline-flex", alignItems: "center", gap: "10px", margin: "var(--space-9) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)", textDecoration: "none", borderBottom: "1px solid var(--green-line)" }}>
              Descubre qué cambia dentro →
            </Link>
          </div>
        </section>
        <section id="propuesta" style={{ background: "var(--off-white)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
              From ambition to embedded capability
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "22ch" }}>
              Dos servicios. Un solo sistema de transformación.
            </Reveal>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "60ch" }}>
              Discovery define en qué debe convertirse la empresa. Build & Embed convierte la capability prioritaria en una realidad operativa.
            </p>
            <div style={{ margin: "var(--space-11) 0 0", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "var(--space-8)", alignItems: "stretch" }} data-cols="">
              <Reveal as="article" data-lift="" style={{ background: "var(--white)", border: "1px solid var(--border-hairline)", padding: "var(--space-9)" }}>
                <img loading="lazy" decoding="async" src="/icons/discover.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-mono)", color: "var(--text-muted)" }}>
                  8–12 semanas
                </p>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "20ch" }}>
                  AI-Native Transformation Discovery
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Alinea la ambición. Diagnostica la empresa. Identifica el valor. Diseña el operating model y el roadmap necesarios para avanzar.
                </p>
                <ul style={{ margin: "var(--space-7) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-6)" }}>
                  <li style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
                    AI-native ambition y tesis estratégica
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
                    Enterprise diagnostic e Inside Readiness Index
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
                    Value pools y portafolio priorizado de capabilities
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
                    Target operating model
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
                    Transformation blueprint, business case y roadmap
                  </li>
                </ul>
                <Link to="/discovery" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-8) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)", textDecoration: "none", borderBottom: "1px solid var(--border-strong)" }}>
                  Explora Discovery →
                </Link>
              </Reveal>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4) 0" }} data-hide-sm="">
                <span style={{ flex: "1", width: "1px", background: "var(--border-strong)" }} />
                <span style={{ writingMode: "vertical-rl", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Operating model design
                </span>
                <span style={{ flex: "1", width: "1px", background: "var(--border-strong)" }} />
              </div>
              <Reveal as="article" data-lift="" style={{ background: "var(--navy-900)", border: "1px solid var(--border-hairline-dark)", padding: "var(--space-9)" }}>
                <img loading="lazy" decoding="async" src="/icons/build-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-mono)", color: "var(--slate-300)" }}>
                  8–12 semanas por capability
                </p>
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", maxWidth: "20ch" }}>
                  Build & Embed Sprint
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--slate-100)" }}>
                  Diseña, construye e incorpora un AI-native workflow, agent o product dentro de la operación, con adopción, controles y medición desde el inicio.
                </p>
                <ul style={{ margin: "var(--space-7) 0 0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", borderTop: "1px solid var(--border-hairline-dark)", paddingTop: "var(--space-6)" }}>
                  <li style={{ font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Workflow y capability blueprint validados
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Agent, product o decision system funcionando
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Human-in-the-loop model y controles operativos
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Plan de adopción y capability transfer
                  </li>
                  <li style={{ font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Scorecard de performance, riesgo y valor
                  </li>
                </ul>
                <Link to="/build-embed" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-8) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)", textDecoration: "none", borderBottom: "1px solid var(--green-line)" }}>
                  Explora Build & Embed →
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
        <section data-dark-plain="" data-node-state="3" data-deep="" style={{ background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              The BECOME™ transformation framework
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              Seis etapas. Un camino de la ambición al valor.
            </Reveal>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "58ch" }}>
              Nuestro framework propietario conecta estrategia, operating-model design, construcción, adopción y escala.
            </p>
            <div style={{ position: "relative", margin: "var(--space-10) 0 0", display: "flex", flexDirection: "column" }}>
              <div data-spine="" style={{ position: "absolute", left: "26px", top: "8px", bottom: "8px", width: "1px", background: "linear-gradient(180deg,var(--electric-green) 0%,rgba(0,255,136,.5) 55%,rgba(0,255,136,.12) 100%)", pointerEvents: "none" }} />
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "176px 1.05fr 1fr .9fr", gap: "var(--space-6)", alignItems: "center", padding: "var(--space-7) var(--space-4) var(--space-7) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/strategy-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    B
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Business Ambition
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Define en qué debe convertirse la empresa y por qué importa.
                  </p>
                </div>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Output: AI-native ambition y tesis estratégica.
                </p>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--slate-300)" }}>
                  Business Ambition Canvas™
                </p>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "176px 1.05fr 1fr .9fr", gap: "var(--space-6)", alignItems: "center", padding: "var(--space-7) var(--space-4) var(--space-7) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/discover-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    E
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Enterprise Discovery
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Comprende cómo funciona hoy y qué limita el cambio.
                  </p>
                </div>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Output: enterprise diagnostic y readiness.
                </p>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--slate-300)" }}>
                  Inside Readiness Index™
                </p>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "176px 1.05fr 1fr .9fr", gap: "var(--space-6)", alignItems: "center", padding: "var(--space-7) var(--space-4) var(--space-7) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/decision-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    C
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Capability Choices
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Identifica dónde la IA puede crear valor empresarial diferencial.
                  </p>
                </div>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Output: value pools y portafolio priorizado.
                </p>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--slate-300)" }}>
                  AI-Native Value Map™
                </p>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "176px 1.05fr 1fr .9fr", gap: "var(--space-6)", alignItems: "center", padding: "var(--space-7) var(--space-4) var(--space-7) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/design-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    O
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Operating Model Design
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Diseña el sistema futuro de People, Data, Agents y Operations.
                  </p>
                </div>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Output: target operating model y blueprint.
                </p>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--slate-300)" }}>
                  Inside Target State Canvas™
                </p>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "176px 1.05fr 1fr .9fr", gap: "var(--space-6)", alignItems: "center", padding: "var(--space-7) var(--space-4) var(--space-7) 0", borderTop: "1px solid var(--border-hairline-dark)", transition: "background .2s ease" }} data-cols="" className="hv-8db6650">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/build-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    M
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Make & Embed
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Construye la capability y la incorpora en el trabajo real.
                  </p>
                </div>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Output: capability funcionando con controles.
                </p>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--slate-300)" }}>
                  Agentic Workflow Blueprint™
                </p>
              </Reveal>
              <Reveal as="div" style={{ display: "grid", gridTemplateColumns: "176px 1.05fr 1fr .9fr", gap: "var(--space-6)", alignItems: "baseline", padding: "var(--space-7) 0", borderTop: "1px solid var(--border-hairline-dark)", borderBottom: "1px solid var(--border-hairline-dark)" }} data-cols="">
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "var(--space-4)", color: "var(--electric-green)" }}>
                  <span style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "52px", flex: "none", border: "1px solid var(--green-line)", background: "linear-gradient(var(--green-tint),var(--green-tint)),var(--navy-900)" }}>
                    <img loading="lazy" decoding="async" src="/icons/evolve-white.webp" alt="" style={{ width: "26px", height: "26px", display: "block" }} />
                  </span>
                  <span style={{ font: "var(--weight-display-strong) 44px/1 var(--font-display)", letterSpacing: "var(--track-hero)", color: "var(--electric-green)" }}>
                    E
                  </span>
                </span>
                <div>
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--white)" }}>
                    Expand & Evolve
                  </h3>
                  <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                    Mide, gobierna, transfiere y escala lo que funciona.
                  </p>
                </div>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Output: scorecard y decisión de escala.
                </p>
                <p style={{ margin: "0", font: "var(--type-mono)", color: "var(--slate-300)" }}>
                  Embed Scorecard™ · Scale Readiness Gate™
                </p>
              </Reveal>
            </div>
            <p style={{ margin: "var(--space-8) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--slate-200)", maxWidth: "64ch" }}>
              Discovery cubre B–E–C–O. Build & Embed valida O y ejecuta M–E. El output de un servicio se convierte en el punto de partida del siguiente.
            </p>
            <Link to="/como-trabajamos" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-8) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)", textDecoration: "none", borderBottom: "1px solid var(--green-line)" }}>
              Explora el BECOME framework →
            </Link>
          </div>
        </section>
        <section data-dark-plain="" data-deep="" style={{ background: "var(--navy-900)", borderTop: "1px solid var(--border-hairline-dark)", padding: "var(--space-11) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-8)", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
                El primer paso
              </p>
              <h2 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", maxWidth: "26ch" }}>
                Un Discovery de 8–12 semanas convierte la ambición en un blueprint ejecutable.
              </h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <Link to="/contacto" style={{ display: "inline-flex", alignItems: "center", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
                Inicia tu Discovery
              </Link>
              <Link to="/discovery" style={{ display: "inline-flex", alignItems: "center", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong-dark)", color: "var(--white)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-692648d">
                Ver el servicio
              </Link>
            </div>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: "var(--space-11)" }} data-cols="">
            <div>
              <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
                Built to make transformation concrete
              </p>
              <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "16ch" }}>
                La estrategia se vuelve útil cuando guía una decisión.
              </Reveal>
              <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "44ch" }}>
                BECOME combina criterio ejecutivo con proprietary tools que hacen visibles el readiness, el valor, el diseño, la adopción y la escala.
              </p>
            </div>
            <Reveal as="div" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Business Ambition Canvas™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Alinear al equipo ejecutivo alrededor de outcomes y strategic choices.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Inside Readiness Index™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Evaluar madurez en People, Data, Agents y Operations.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  AI-Native Value Map™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Priorizar oportunidades por valor, feasibility, velocidad y riesgo.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Inside Target State Canvas™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Definir el target operating model y transformation blueprint.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Agentic Workflow Blueprint™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Diseñar roles, agents, datos, decisiones, excepciones y controles.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Embed Scorecard™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Medir uso, confianza, performance, control y valor.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", padding: "var(--space-5) 0", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }} data-cols="">
                <p style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                  Scale Readiness Gate™
                </p>
                <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Decidir si iterar, integrar, escalar o detener.
                </p>
              </div>
              <Link to="/como-trabajamos#herramientas" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-7) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)", textDecoration: "none", borderBottom: "1px solid var(--border-strong)" }}>
                Conoce cómo funcionan las herramientas →
              </Link>
            </Reveal>
          </div>
        </section>
        <section style={{ background: "var(--pale-100)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
              Value, made visible
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "22ch" }}>
              Mide lo que cambia, no cuánta IA implementas.
            </Reveal>
            <div style={{ margin: "var(--space-10) 0 0", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "var(--space-6)" }} data-cols="">
              <Reveal as="div" style={{ paddingTop: "var(--space-5)", borderTop: "2px solid var(--electric-green)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/performance.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    Speed
                  </h3>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Ciclos de decisión y ejecución más cortos.
                </p>
              </Reveal>
              <Reveal as="div" style={{ paddingTop: "var(--space-5)", borderTop: "2px solid var(--electric-green)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/analytics.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    Quality
                  </h3>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Trabajo consistente, menos errores y mejores outcomes.
                </p>
              </Reveal>
              <Reveal as="div" style={{ paddingTop: "var(--space-5)", borderTop: "2px solid var(--electric-green)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/growth.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    Growth
                  </h3>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Nuevos products, experiences y fuentes de valor.
                </p>
              </Reveal>
              <Reveal as="div" style={{ paddingTop: "var(--space-5)", borderTop: "2px solid var(--electric-green)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/decision.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    Risk
                  </h3>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Controles, accountability y human oversight claros.
                </p>
              </Reveal>
              <Reveal as="div" style={{ paddingTop: "var(--space-5)", borderTop: "2px solid var(--electric-green)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <img loading="lazy" decoding="async" src="/icons/leadership.webp" alt="" style={{ width: "36px", height: "36px", display: "block" }} />
                  <h3 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                    Capability
                  </h3>
                </div>
                <p style={{ margin: "var(--space-3) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Equipos capaces de operar y mejorar el sistema.
                </p>
              </Reveal>
            </div>
            <p style={{ margin: "var(--space-9) 0 0", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-hairline)", font: "var(--type-body)", color: "var(--text-muted)", maxWidth: "70ch" }}>
              Antes de contar con casos públicos, explicamos el mecanismo de medición. En casos reales mostramos baseline, intervención, resultado, periodo y atribución.
            </p>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <Reveal as="h2" style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "24ch" }}>
              Strategy that builds. Technology that embeds. Capability that stays.
            </Reveal>
            <div style={{ margin: "var(--space-10) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-9)" }} data-cols="">
              <Reveal as="div">
                <img loading="lazy" decoding="async" src="/icons/enterprise.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                  Business first
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Comenzamos por el enterprise outcome, no por la herramienta.
                </p>
              </Reveal>
              <Reveal as="div">
                <img loading="lazy" decoding="async" src="/icons/partnership.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                  Build with, not for
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Trabajamos con los equipos del cliente para crear ownership y confianza operativa.
                </p>
              </Reveal>
              <Reveal as="div">
                <img loading="lazy" decoding="async" src="/icons/transformation.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                  Adoption by design
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", fontSize: "var(--text-body-lg)", color: "var(--text-body)" }}>
                  Roles, controles, skills y medición forman parte de la solución desde el inicio.
                </p>
              </Reveal>
            </div>
            <p style={{ margin: "var(--space-10) 0 0", font: "var(--weight-display) var(--text-h3)/1.4 var(--font-display)", color: "var(--text-heading)" }}>
              El trabajo termina cuando la capability pertenece a la empresa.
            </p>
          </div>
        </section>
        <section data-dark-plain="" data-deep="" style={{ background: "var(--navy-900)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <Reveal as="h2" style={{ margin: "0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--white)", maxWidth: "20ch" }}>
              THE WORK WE ARE BUILT TO DO
            </Reveal>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "58ch" }}>
              Tres transformation scenarios. Son escenarios de trabajo, no casos de clientes.
            </p>
            <div style={{ margin: "var(--space-10) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "var(--border-hairline-dark)" }} data-cols="">
              <Reveal as="article" style={{ background: "var(--navy-900)", padding: "var(--space-8) var(--space-7)" }}>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                  Escenario
                </p>
                <img loading="lazy" decoding="async" src="/icons/decision-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)" }}>
                  Decision intelligence
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Rediseñar una decisión de alto valor y su flujo de información.
                </p>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Qué cambia dentro: contexto compartido, rutas de excepción y decision rights explícitos.
                </p>
              </Reveal>
              <Reveal as="article" style={{ background: "var(--navy-900)", padding: "var(--space-8) var(--space-7)" }}>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                  Escenario
                </p>
                <img loading="lazy" decoding="async" src="/icons/automation-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)" }}>
                  Agentic operations
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Incorporar agents en un end-to-end workflow controlado.
                </p>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Qué cambia dentro: orquestación, human-in-the-loop model y controles operativos.
                </p>
              </Reveal>
              <Reveal as="article" style={{ background: "var(--navy-900)", padding: "var(--space-8) var(--space-7)" }}>
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
                  Escenario
                </p>
                <img loading="lazy" decoding="async" src="/icons/products-inside-white.webp" alt="" style={{ width: "40px", height: "40px", display: "block" }} />
                <h3 style={{ margin: "var(--space-5) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)" }}>
                  AI-native product
                </h3>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", color: "var(--slate-200)" }}>
                  Crear una nueva capability inteligente para clientes o colaboradores.
                </p>
                <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-body)", color: "var(--slate-300)" }}>
                  Qué cambia dentro: data layer, ownership de producto y medición de valor.
                </p>
              </Reveal>
            </div>
            <Link to="/casos" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-9) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)", textDecoration: "none", borderBottom: "1px solid var(--green-line)" }}>
              Conoce nuestro trabajo →
            </Link>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-13) var(--gutter-page)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)" }}>
              BECOME thinking
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-5) 0 0", font: "var(--type-h1)", letterSpacing: "var(--track-display)", color: "var(--text-heading)", maxWidth: "20ch" }}>
              Ideas para la empresa después de lo digital.
            </Reveal>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "58ch" }}>
              Perspectivas sobre AI-native operating models, agentic work, decision intelligence y enterprise reinvention.
            </p>
            <div style={{ margin: "var(--space-10) 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-8)" }} data-cols="">
              <Reveal as={Link} to="/insights" style={{ textDecoration: "none", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-5)" }} className="hv-4759c0e">
                <img loading="lazy" decoding="async" src="/images/01-neural-network.webp" alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", marginBottom: "var(--space-5)" }} />
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Pilar editorial
                </p>
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                  The AI-native enterprise
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Qué distingue a una empresa AI-native de una empresa con IA.
                </p>
              </Reveal>
              <Reveal as={Link} to="/insights" style={{ textDecoration: "none", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-5)" }} className="hv-4759c0e">
                <img loading="lazy" decoding="async" src="/images/19-tech-workspace.webp" alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", marginBottom: "var(--space-5)" }} />
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Pilar editorial
                </p>
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                  Agentic workflows y el futuro del trabajo
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Cómo se reparten decisión, ejecución y accountability.
                </p>
              </Reveal>
              <Reveal as={Link} to="/insights" style={{ textDecoration: "none", borderTop: "1px solid var(--border-strong)", paddingTop: "var(--space-5)" }} className="hv-4759c0e">
                <img loading="lazy" decoding="async" src="/images/01-neural-network.webp" alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", marginBottom: "var(--space-5)" }} />
                <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Pilar editorial
                </p>
                <h3 style={{ margin: "var(--space-4) 0 0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)" }}>
                  Reinvención del operating model
                </h3>
                <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-body)", color: "var(--text-muted)" }}>
                  Las decisiones de diseño que determinan dónde se acumula el valor.
                </p>
              </Reveal>
            </div>
            <Link to="/insights" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-9) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)", textDecoration: "none", borderBottom: "1px solid var(--border-strong)" }}>
              Lee las últimas ideas →
            </Link>
          </div>
        </section>
        <section data-dark-image="" data-node-state="4" style={{ position: "relative", overflow: "hidden", background: "var(--navy-950)", padding: "var(--space-14) var(--gutter-page)" }}>
          <img loading="lazy" decoding="async" src="/images/50-next-gen.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--navy-950) 0%,rgba(5,7,15,.9) 32%,rgba(5,7,15,.3) 78%,rgba(5,7,15,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              Your next operating model starts with a question
            </p>
            <Reveal as="h2" style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(38px,4.6vw,72px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "22ch" }}>
              ¿En qué debe convertirse tu empresa después?
            </Reveal>
            <p style={{ margin: "var(--space-7) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "52ch" }}>
              Comienza con una conversación enfocada en el business outcome, la capability o el workflow que necesitas transformar.
            </p>
            <div style={{ margin: "var(--space-9) 0 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-7)" }}>
              <Link to="/contacto" style={{ display: "inline-flex", alignItems: "center", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }} className="hv-a750771">
                Inicia tu Discovery
              </Link>
              <span style={{ font: "var(--type-body)", color: "var(--slate-300)" }}>
                O escríbenos a
                {' '}
                <a href="mailto:hello@become.company" style={{ color: "var(--electric-green)", textDecoration: "none" }}>
                  hello@become.company
                </a>
              </span>
            </div>
            <p style={{ margin: "var(--space-12) 0 0", font: "var(--weight-display) var(--text-h2)/1.2 var(--font-display)", letterSpacing: "var(--track-heading)", color: "var(--slate-200)" }}>
              The next company is already inside yours.
            </p>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
