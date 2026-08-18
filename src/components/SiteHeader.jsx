import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/* Migrado de templates/website-es/SiteHeaderEs.dc.html por scripts/dc-to-jsx.mjs */
export default function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((o) => !o);
  const { pathname } = useLocation();
  React.useEffect(() => { setOpen(false); }, [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* La barra se retira al bajar y vuelve al subir. Devolver espacio de pantalla
     mientras se lee, y tener el menú a un gesto de distancia al querer salir. */
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    let last = window.scrollY;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const y = window.scrollY;
        const dy = y - last;
        /* Umbral de 6px: sin él, el rebote del trackpad y el movimiento de un
           dedo tembloroso hacen parpadear la barra. */
        if (Math.abs(dy) < 6) return;
        last = y;
        setHidden(dy > 0 && y > 140);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Con el menú móvil abierto la barra no se esconde nunca: el botón de cerrar
     vive dentro del overlay, pero el gesto de scroll no debe moverla. */
  React.useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', hidden && !open);
  }, [hidden, open]);
  React.useEffect(() => () => document.documentElement.removeAttribute('data-header-hidden'), []);

  return (
    <>
      <header data-header="" style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "50", background: "rgba(8,11,30,.94)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border-hairline-dark)", boxShadow: "0 18px 44px -34px rgba(0,0,0,.9)" }}>
        <div data-bar="" style={{ maxWidth: "var(--maxw-content)", margin: "0 auto", minHeight: "72px", paddingTop: "14px", paddingBottom: "14px", paddingLeft: "var(--gutter-page)", paddingRight: "var(--gutter-page)", display: "flex", alignItems: "center", gap: "var(--space-8)", flexWrap: "nowrap" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo/wordmark-white.webp" alt="BECOME" style={{ height: "23px", width: "auto", display: "block" }} />
          </Link>
          <nav data-nav="" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", marginLeft: "auto", flexWrap: "nowrap" }}>
            <Link to="/#propuesta" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none", padding: "12px 0", whiteSpace: "nowrap", borderBottom: "1px solid transparent" }} className="hv-cc518c6">
              Propuesta de valor
            </Link>
            <Link to="/como-trabajamos" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none", padding: "12px 0", whiteSpace: "nowrap", borderBottom: "1px solid transparent" }} className="hv-cc518c6">
              Cómo trabajamos
            </Link>
            <Link to="/casos" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none", padding: "12px 0", whiteSpace: "nowrap", borderBottom: "1px solid transparent" }} className="hv-cc518c6">
              Casos
            </Link>
            <Link to="/insights" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none", padding: "12px 0", whiteSpace: "nowrap", borderBottom: "1px solid transparent" }} className="hv-cc518c6">
              Insights
            </Link>
            <Link to="/nosotros" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none", padding: "12px 0", whiteSpace: "nowrap", borderBottom: "1px solid transparent" }} className="hv-cc518c6">
              Sobre nosotros
            </Link>
          </nav>
          <div data-bar-actions="" style={{ display: "flex", alignItems: "center", gap: "var(--space-5)" }}>
            <span data-lang="" style={{ font: "var(--type-label)", letterSpacing: "var(--track-label)", color: "var(--slate-300)", whiteSpace: "nowrap" }}>
              <span style={{ color: "var(--white)" }}>
                ES
              </span>
              {' '}
              /
              {' '}
              <a href="../website-en/WebsiteEn.dc.html" style={{ color: "var(--slate-300)", textDecoration: "none" }} className="hv-dc7f3e7">
                EN
              </a>
            </span>
            <Link data-cta="" to="/contacto" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 var(--space-6)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }} className="hv-a750771">
              Inicia tu Discovery
            </Link>
            <button data-burger="" type="button" aria-label="Abrir menú" onClick={toggle} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", border: "1px solid var(--border-strong-dark)", borderRadius: "2px", background: "transparent", color: "var(--white)", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {open && (
        <>
        <div style={{ position: "fixed", inset: "0", zIndex: "60", background: "var(--navy-950)", padding: "var(--space-6) var(--gutter-page)", display: "flex", flexDirection: "column", overflow: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src="/logo/wordmark-white.webp" alt="BECOME" style={{ height: "23px", width: "auto", display: "block" }} />
            <button type="button" aria-label="Cerrar menú" onClick={toggle} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", border: "1px solid var(--border-strong-dark)", borderRadius: "2px", background: "transparent", color: "var(--white)", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav style={{ marginTop: "var(--space-10)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <Link to="/#propuesta" style={{ font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", textDecoration: "none" }}>
              Propuesta de valor
            </Link>
            <Link to="/como-trabajamos" style={{ font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", textDecoration: "none" }}>
              Cómo trabajamos
            </Link>
            <Link to="/casos" style={{ font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", textDecoration: "none" }}>
              Casos
            </Link>
            <Link to="/insights" style={{ font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", textDecoration: "none" }}>
              Insights
            </Link>
            <Link to="/nosotros" style={{ font: "var(--type-h2)", letterSpacing: "var(--track-heading)", color: "var(--white)", textDecoration: "none" }}>
              Sobre nosotros
            </Link>
          </nav>
          <div style={{ marginTop: "var(--space-9)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-hairline-dark)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <Link to="/discovery" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              AI-Native Transformation Discovery
            </Link>
            <Link to="/build-embed" style={{ font: "var(--type-body)", color: "var(--slate-200)", textDecoration: "none" }}>
              Build & Embed Sprint
            </Link>
          </div>
          <Link to="/contacto" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: "var(--space-9)", minHeight: "52px", padding: "0 var(--space-7)", borderRadius: "var(--radius-pill)", background: "var(--electric-green)", color: "var(--deep-navy)", font: "var(--type-label)", letterSpacing: "var(--track-label)", textTransform: "uppercase", textDecoration: "none" }}>
            Inicia tu Discovery
          </Link>
          <span style={{ marginTop: "var(--space-8)", font: "var(--type-label)", letterSpacing: "var(--track-label)", color: "var(--slate-300)" }}>
            <span style={{ color: "var(--white)" }}>
              ES
            </span>
            {' '}
            /
            {' '}
            <a href="../website-en/WebsiteEn.dc.html" style={{ color: "var(--slate-300)", textDecoration: "none" }}>
              EN
            </a>
          </span>
        </div>
        </>
      )}
    </>
  );
}
