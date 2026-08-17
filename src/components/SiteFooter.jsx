import React from 'react';
import { Link } from 'react-router-dom';

/* Migrado de templates/website-es/SiteFooterEs.dc.html por scripts/dc-to-jsx.mjs */
export default function SiteFooter() {
  return (
    <>
      <footer style={{ background: "var(--navy-950)", borderTop: "1px solid var(--border-hairline-dark)", padding: "var(--space-11) var(--gutter-page) var(--space-8)" }}>
        <div data-cols="" style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "var(--space-9)" }}>
          <div>
            <img src="/logo/wordmark-white.webp" alt="BECOME" style={{ height: "26px", width: "auto", display: "block" }} />
            <p style={{ margin: "var(--space-4) 0 0", font: "var(--type-label)", letterSpacing: "var(--track-descriptor)", textTransform: "uppercase", color: "var(--slate-300)" }}>
              AI-native transformation company
            </p>
            <p style={{ margin: "var(--space-6) 0 0", font: "var(--type-body)", color: "var(--slate-300)", maxWidth: "34ch" }}>
              The next company is already inside yours.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
              Servicios
            </p>
            <Link to="/discovery" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              AI-Native Transformation Discovery
            </Link>
            <Link to="/build-embed" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              Build & Embed Sprint
            </Link>
            <Link to="/como-trabajamos" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              BECOME™ Framework
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
              Compañía
            </p>
            <Link to="/nosotros" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              Sobre nosotros
            </Link>
            <Link to="/casos" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              Casos
            </Link>
            <Link to="/insights" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              Insights
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ margin: "0", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", color: "var(--slate-400)" }}>
              Contacto
            </p>
            <a href="mailto:hello@become.company" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              hello@become.company
            </a>
            <Link to="/contacto" style={{ font: "var(--type-body)", color: "var(--electric-green)", textDecoration: "none" }}>
              Inicia tu Discovery
            </Link>
          </div>
        </div>
        <div style={{ maxWidth: "var(--maxw-content)", margin: "var(--space-9) auto 0", paddingTop: "var(--space-5)", borderTop: "1px solid var(--border-hairline-dark)", display: "flex", gap: "var(--space-6)", alignItems: "center" }}>
          <span style={{ font: "var(--type-body)", fontSize: "var(--text-body-sm)", color: "var(--slate-400)" }}>
            © 2026 BECOME
          </span>
          <a href="#" style={{ font: "var(--type-body)", fontSize: "var(--text-body-sm)", color: "var(--slate-400)", textDecoration: "none" }}>
            Privacidad
          </a>
          <a href="#" style={{ font: "var(--type-body)", fontSize: "var(--text-body-sm)", color: "var(--slate-400)", textDecoration: "none" }}>
            Términos
          </a>
          <span style={{ marginLeft: "auto", font: "var(--type-label)", letterSpacing: "var(--track-label)", color: "var(--slate-400)" }}>
            <span style={{ color: "var(--slate-200)" }}>
              ES
            </span>
            /
            <a href="../website-en/WebsiteEn.dc.html" style={{ color: "var(--slate-400)", textDecoration: "none" }}>
              EN
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
