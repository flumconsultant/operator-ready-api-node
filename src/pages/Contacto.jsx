import React from 'react';
import { Link } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

/* Migrado de templates/website-es/PaginaContacto.dc.html por scripts/dc-to-jsx.mjs */
export default function Contacto() {
  const [sent, setSent] = React.useState(false);
  const pending = !sent;
  const submitted = sent;
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div style={{ font: "var(--type-body)", color: "var(--text-body)", background: "var(--off-white)", paddingTop: "72px" }}>
        <SiteHeader />
        <section style={{ position: "relative", overflow: "hidden", background: "var(--navy-900)", padding: "var(--space-12) var(--gutter-page)" }}>
          <img fetchPriority="high" decoding="async" src="/images/01-neural-network.webp" alt="" style={{ position: "absolute", inset: "-6% 0", width: "100%", height: "112%", objectFit: "cover", objectPosition: "center right", opacity: ".85" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(95deg,var(--deep-navy) 0%,rgba(10,14,39,.88) 34%,rgba(10,14,39,.3) 78%,rgba(10,14,39,.5) 100%)" }} />
          <div style={{ position: "absolute", top: "0", right: "0", width: "46%", height: "100%", backgroundImage: "var(--pattern-scattered-nodes)", backgroundSize: "180px 180px", opacity: "var(--pattern-opacity)", WebkitMaskImage: "linear-gradient(to left,#000 18%,transparent 92%)", maskImage: "linear-gradient(to left,#000 18%,transparent 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "0", background: "var(--gradient-environment)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: "var(--maxw-content)", margin: "0 auto" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--electric-green)" }}>
              Your next operating model starts with a question
            </p>
            <h1 style={{ margin: "var(--space-6) 0 0", font: "var(--type-hero)", fontSize: "clamp(36px,4.4vw,68px)", letterSpacing: "var(--track-hero)", color: "var(--white)", maxWidth: "22ch" }}>
              ¿En qué necesita convertirse tu empresa después?
            </h1>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-lead)", color: "var(--slate-100)", maxWidth: "56ch" }}>
              Cuéntanos el business outcome, la capability o el workflow que necesitas transformar. Responderemos con la conversación adecuada.
            </p>
          </div>
        </section>
        <section style={{ background: "var(--off-white)", padding: "var(--space-12) var(--gutter-page) var(--space-13)" }}>
          <div style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: "var(--space-11)", alignItems: "start" }} data-cols="">
            <div>
              {pending && (
                <>
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }} data-cols="">
                    <div>
                      <label htmlFor="nombre">
                        Nombre
                      </label>
                      <input id="nombre" name="nombre" type="text" required="required" autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="email">
                        Email corporativo
                      </label>
                      <input id="email" name="email" type="email" required="required" autoComplete="email" />
                    </div>
                    <div>
                      <label htmlFor="empresa">
                        Empresa
                      </label>
                      <input id="empresa" name="empresa" type="text" required="required" autoComplete="organization" />
                    </div>
                    <div>
                      <label htmlFor="rol">
                        Rol
                      </label>
                      <input id="rol" name="rol" type="text" required="required" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cambio">
                      ¿Qué necesita cambiar?
                    </label>
                    <textarea id="cambio" name="cambio" rows="5" required="required" style={{ minHeight: "140px", resize: "vertical" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }} data-cols="">
                    <div>
                      <label htmlFor="etapa">
                        Etapa actual
                      </label>
                      <select id="etapa" name="etapa">
                        <option>
                          Definiendo la estrategia
                        </option>
                        <option>
                          Priorizando oportunidades
                        </option>
                        <option>
                          Diseñando el operating model
                        </option>
                        <option>
                          Construyendo una capability
                        </option>
                        <option>
                          Escalando una solución existente
                        </option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timeline">
                        Timeline (opcional)
                      </label>
                      <input id="timeline" name="timeline" type="text" placeholder="Por ejemplo: este trimestre" />
                    </div>
                  </div>
                  <p style={{ margin: "0", font: "var(--type-body)", color: "var(--text-muted)", maxWidth: "62ch" }}>
                    Usamos esta información únicamente para preparar la conversación. No la compartimos con terceros y no te inscribimos en ninguna secuencia comercial.
                  </p>
                  <div>
                    <button type="submit" style={{ display: "inline-flex", alignItems: "center", minHeight: "52px", padding: "0 var(--space-7)", border: "0", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", cursor: "pointer" }} className="hv-a750771">
                      Iniciemos la conversación
                    </button>
                  </div>
                </form>
                </>
              )}
              {submitted && (
                <>
                <div role="status" aria-live="polite" style={{ background: "var(--white)", border: "1px solid var(--border-hairline)", borderTop: "2px solid var(--electric-green)", padding: "var(--space-9)" }}>
                  <h2 style={{ margin: "0", font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--text-heading)", maxWidth: "24ch" }}>
                    Gracias.
                  </h2>
                  <p style={{ margin: "var(--space-5) 0 0", font: "var(--type-lead)", color: "var(--text-body)", maxWidth: "56ch" }}>
                    Revisaremos el contexto y responderemos con la conversación adecuada, no con una secuencia comercial automatizada.
                  </p>
                  <Link to="/" style={{ display: "inline-flex", alignItems: "center", margin: "var(--space-7) 0 0", minHeight: "44px", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--text-accent)", textDecoration: "none", borderBottom: "1px solid var(--border-strong)" }}>
                    Volver al inicio →
                  </Link>
                </div>
                </>
              )}
            </div>
            <aside style={{ borderTop: "2px solid var(--deep-navy)", paddingTop: "var(--space-6)" }}>
              <h2 style={{ margin: "0", font: "var(--type-h3)", color: "var(--text-heading)" }}>
                Qué ocurre después
              </h2>
              <ol style={{ margin: "var(--space-5) 0 0", padding: "0 0 0 var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <li style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
                  Leemos tu contexto y lo mapeamos a las etapas BECOME.
                </li>
                <li style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
                  Proponemos una conversación de 30 minutos centrada en el business outcome y las restricciones actuales.
                </li>
                <li style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
                  Definimos juntos si Discovery o Build & Embed es el primer paso adecuado.
                </li>
              </ol>
              <p style={{ margin: "var(--space-8) 0 0", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-hairline)", font: "var(--type-body)", color: "var(--text-muted)" }}>
                También puedes escribir a
                <a href="mailto:hello@become.company" style={{ color: "var(--text-accent)", textDecoration: "none" }}>
                  hello@become.company
                </a>
              </p>
            </aside>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
