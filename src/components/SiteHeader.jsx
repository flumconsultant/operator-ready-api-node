import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as es from '../site.js';
import * as en from '../site.en.js';
import wordmark from '../logo/wordmark-white.webp';

/**
 * Cabecera del sitio en español.
 *
 * Escrita a mano, ya no sale del conversor: los desplegables tienen estado,
 * foco y teclado, y eso no cabía en el formato de los artboards.
 *
 * Reglas del documento que aquí son código, no estilo:
 *
 *   · La Home no es un ítem. El logotipo es el único acceso, con nombre
 *     accesible "BECOME — Inicio".
 *   · Los desplegables abren con click, teclado y foco. El hover es refuerzo,
 *     nunca el único mecanismo — un menú que solo responde a hover no existe
 *     para quien navega con teclado ni en una tableta.
 *   · Solo uno abierto a la vez.
 *   · Escape cierra y devuelve el foco al trigger que lo abrió.
 *   · En móvil son acordeones dentro del menú a pantalla completa; el hover no
 *     participa.
 */

const linkStyle = {
  font: 'var(--type-body)',
  color: 'var(--slate-200)',
  textDecoration: 'none',
  padding: '12px 0',
  whiteSpace: 'nowrap',
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
};

const slugOf = (to) => to.split('/').filter(Boolean).pop();

function Chevron({ open }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"
      style={{ transition: 'transform .2s ease', transform: open ? 'rotate(180deg)' : 'none' }}
    >
      <path d="M2 4.5L6 8.5L10 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeader() {
  const { pathname } = useLocation();
  /* Mismo criterio que en el pie: el prefijo /en decide el idioma, y
     cualquier otra ruta se trata como español. */
  const lang = pathname.startsWith('/en') ? 'en' : 'es';
  const t = lang === 'en' ? en : es;
  const other = lang === 'en' ? { code: 'ES', to: '/es' } : { code: 'EN', to: '/en' };
  const [open, setOpen] = React.useState(false);        // menú móvil
  const [drop, setDrop] = React.useState(null);         // índice del desplegable abierto
  const [acc, setAcc] = React.useState(null);           // acordeón móvil abierto
  const [sub, setSub] = React.useState(null);           // tercer nivel abierto (BECOME NOW™)
  const [hidden, setHidden] = React.useState(false);
  const triggers = React.useRef([]);
  const barRef = React.useRef(null);
  const closeTimer = React.useRef(0);

  /* El panel se cerraba en cuanto el puntero salía del trigger, así que al
     bajar hacia las opciones desaparecía antes de llegar. Dos arreglos: el
     panel arranca pegado al trigger (sin hueco que cruzar) y el cierre lleva
     un retardo corto que se cancela si el puntero entra en el panel. */
  const openDrop = (i) => { clearTimeout(closeTimer.current); setDrop(i); };
  React.useEffect(() => { if (drop === null) setSub(null); }, [drop]);
  const closeDropSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDrop(null), 220);
  };
  React.useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* Navegar cierra todo */
  React.useEffect(() => { setOpen(false); setDrop(null); setAcc(null); setSub(null); }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Escape cierra y devuelve el foco a quien abrió */
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (drop !== null) { const i = drop; setDrop(null); triggers.current[i]?.focus(); }
      else if (open) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drop, open]);

  /* Un click fuera de la barra cierra el desplegable */
  React.useEffect(() => {
    if (drop === null) return;
    const onDown = (e) => { if (!barRef.current?.contains(e.target)) setDrop(null); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [drop]);

  /* La barra se retira al bajar y vuelve al subir */
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
        if (Math.abs(dy) < 6) return;     // umbral: el rebote del trackpad no cuenta
        last = y;
        setHidden(dy > 0 && y > 140);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const hide = hidden && !open && drop === null;
    document.documentElement.toggleAttribute('data-header-hidden', hide);
  }, [hidden, open, drop]);
  React.useEffect(() => () => document.documentElement.removeAttribute('data-header-hidden'), []);

  const Logo = ({ size = 23 }) => (
    <Link to={t.HOME} aria-label={lang === 'en' ? 'BECOME — Home' : 'BECOME — Inicio'} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>
      <img src={wordmark} alt="" width={Math.round((size * 768) / 145)} height={size} style={{ height: size, width: 'auto', display: 'block' }} />
    </Link>
  );

  const langItem = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 24, minHeight: 24,
  };

  const Lang = () => (
    <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', color: 'var(--slate-300)', whiteSpace: 'nowrap' }}>
      {/* Cada opción con su propia área de 24×24: como texto suelto, "EN"
          medía 18×14 y era un objetivo por debajo del mínimo. Va a la home del
          otro idioma, no a la traducción de la página actual — la mayoría de
          páginas todavía no tienen su versión en inglés. */}
      <span style={{ ...langItem, color: 'var(--white)' }}>{lang === 'en' ? 'EN' : 'ES'}</span>
      {' / '}
      <Link to={other.to} style={{ ...langItem, color: 'var(--slate-300)', textDecoration: 'none' }} className="hv-lang">{other.code}</Link>
    </span>
  );

  return (
    <>
      {/* Enlace de salto: el primer tabulador de cada página. Sin él, llegar al
          contenido con teclado obliga a recorrer los cinco elementos del menú,
          sus dos desplegables y el CTA, en cada página. Solo aparece al recibir
          el foco. */}
      <a href={lang === 'en' ? '#content' : '#contenido'} data-skip-link className="skip-link">{lang === 'en' ? 'Skip to content' : 'Saltar al contenido'}</a>

      <header
        data-header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 'var(--z-header)',
          background: 'rgba(8,11,30,.94)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-hairline-dark)',
          boxShadow: '0 18px 44px -34px rgba(0,0,0,.9)',
        }}
      >
        <div
          ref={barRef}
          data-bar
          style={{
            maxWidth: 'var(--maxw-content)', margin: '0 auto', minHeight: 72,
            padding: '14px var(--gutter-page)', display: 'flex', alignItems: 'center',
            gap: 'var(--space-8)', flexWrap: 'nowrap',
          }}
        >
          <Logo />

          <nav data-nav aria-label="Principal" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginLeft: 'auto' }}>
            {t.NAV.map((item, i) =>
              item.items ? (
                /* Dos controles, no uno. El label es un enlace a la landing de
                   la sección y el chevrón es el botón que despliega. Con un
                   único botón que alterna, hover y click se pisan: el puntero
                   abre el panel al llegar y el click inmediato lo cierra, que
                   es exactamente lo que hace cualquiera. Separarlos también
                   deja el panel accesible por teclado sin secuestrar Enter. */
                <div
                  key={item.label}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}
                  onPointerEnter={() => window.matchMedia('(hover: hover)').matches && openDrop(i)}
                  onPointerLeave={() => window.matchMedia('(hover: hover)').matches && closeDropSoon()}
                >
                  <Link
                    to={item.to}
                    style={{ ...linkStyle, color: drop === i ? 'var(--electric-green)' : 'var(--slate-200)' }}
                    className="hv-nav"
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    ref={(el) => { triggers.current[i] = el; }}
                    aria-expanded={drop === i}
                    aria-controls={`drop-${i}`}
                    aria-label={`${drop === i ? 'Cerrar' : 'Desplegar'} ${item.label}`}
                    onClick={() => setDrop((d) => (d === i ? null : i))}
                    style={{
                      /* 9 px de aire a cada lado: con 4 el botón medía 18 de
                         ancho, por debajo del mínimo de 24 de WCAG 2.2. */
                      ...linkStyle, padding: '12px 9px', minWidth: 28,
                      color: drop === i ? 'var(--electric-green)' : 'var(--slate-300)',
                    }}
                    className="hv-nav"
                  >
                    <Chevron open={drop === i} />
                  </button>

                  {drop === i && (
                    <div
                      id={`drop-${i}`}
                      onPointerEnter={() => openDrop(i)}
                      onPointerLeave={closeDropSoon}
                      className="drop-panel"
                      style={{
                        position: 'absolute', top: '100%', left: item.wide ? 'auto' : 0,
                        right: item.wide ? 0 : 'auto',
                        /* el padding superior hace de puente: no hay hueco muerto
                           entre el trigger y el panel */
                        paddingTop: 14,
                        /* Al abrir el tercer nivel el panel se ensancha y los
                           programas ocupan una columna DENTRO. Sacándolos a un
                           panel flotante a la derecha se salían de la pantalla:
                           el menú está a media barra y no hay 620 px libres. */
                        width: item.wide
                          ? 'min(680px, 74vw)'
                          : sub ? 'min(940px, 90vw)' : 'min(440px, 74vw)',
                      }}
                    >
                      <div style={{
                        background: 'var(--navy-950)',
                        border: '1px solid var(--border-hairline-dark)',
                        boxShadow: '0 40px 80px -40px rgba(0,0,0,.9)',
                        padding: 'var(--space-6)',
                      }}>
                      {item.heading && (
                        <p style={{ margin: '0 0 var(--space-5)', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--slate-400)' }}>
                          {item.heading}
                        </p>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: (!item.wide && sub) ? 'minmax(0, 320px) minmax(0, 1fr)' : '1fr', gap: 'var(--space-7)' }}>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: item.wide ? '1fr 1fr' : '1fr', gap: 'var(--space-5)', alignContent: 'start' }}>
                        {item.items.map((opt) => (
                          <li key={opt.to} style={{ position: 'relative' }}>
                            <div
                              style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}
                              onPointerEnter={() => opt.groups && window.matchMedia('(hover: hover)').matches && setSub(opt.to)}
                            >
                              <Link to={opt.to} style={{ display: 'block', flex: 1, textDecoration: 'none' }} className="drop-item">
                                <span style={{ display: 'block', font: 'var(--type-body)', color: 'var(--white)' }}>{opt.label}</span>
                                <span style={{ display: 'block', marginTop: 6, font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-300)' }}>{opt.line}</span>
                              </Link>
                              {/* Indicador de que hay un nivel más: sin él nadie
                                  descubriría los catorce programas. */}
                              {opt.groups && (
                                <button
                                  type="button"
                                  aria-expanded={sub === opt.to}
                                  aria-controls={`sub-${slugOf(opt.to)}`}
                                  aria-label={`${sub === opt.to ? 'Cerrar' : 'Desplegar'} programas por área`}
                                  onClick={() => setSub((v) => (v === opt.to ? null : opt.to))}
                                  style={{
                                    border: 0, background: 'transparent', cursor: 'pointer', padding: 8,
                                    color: sub === opt.to ? 'var(--electric-green)' : 'var(--slate-300)',
                                    transform: 'rotate(-90deg)',
                                  }}
                                  className="hv-nav"
                                >
                                  <Chevron open={sub === opt.to} />
                                </button>
                              )}
                            </div>

                          </li>
                        ))}
                      </ul>

                      {/* Columna del tercer nivel */}
                      {!item.wide && sub && (() => {
                        const opt = item.items.find((o) => o.to === sub);
                        if (!opt?.groups) return null;
                        return (
                          <div id={`sub-${slugOf(opt.to)}`} className="drop-panel" style={{ borderLeft: '1px solid var(--border-hairline-dark)', paddingLeft: 'var(--space-7)' }}>
                            <p style={{ margin: '0 0 var(--space-5)', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--slate-400)' }}>
                              {opt.heading}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-6)' }}>
                              {opt.groups.map((g) => (
                                <div key={g.title}>
                                  <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', color: 'var(--electric-green)' }}>{g.title}</p>
                                  <ul style={{ listStyle: 'none', margin: 'var(--space-4) 0 0', padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
                                    {g.items.map((pr) => (
                                      <li key={pr.to}>
                                        <Link to={pr.to} className="hv-nav" style={{ font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-200)', textDecoration: 'none' }}>
                                          {pr.label.replace('IA aplicada a ', '')}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <Link to={opt.more.to} style={{
                              display: 'inline-block', marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)',
                              borderTop: '1px solid var(--border-hairline-dark)', width: '100%',
                              font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
                              color: 'var(--electric-green)', textDecoration: 'none',
                            }}>
                              {opt.more.label} →
                            </Link>
                          </div>
                        );
                      })()}
                      </div>

                      {item.more && (
                        <Link
                          to={item.more.to}
                          style={{
                            display: 'inline-block', marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)',
                            borderTop: '1px solid var(--border-hairline-dark)', width: '100%',
                            font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
                            color: 'var(--electric-green)', textDecoration: 'none',
                          }}
                        >
                          {item.more.label} →
                        </Link>
                      )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} to={item.to} style={linkStyle} className="hv-nav">{item.label}</Link>
              )
            )}
          </nav>

          <div data-bar-actions style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', marginLeft: 'auto' }}>
            <span data-lang><Lang /></span>
            <Link
              data-cta
              to={t.CONTACT.to}
              style={{
                display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 var(--space-6)',
                borderRadius: 'var(--radius-pill)', background: 'var(--electric-green)', color: 'var(--deep-navy)',
                font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
              className="cta-primary"
            >
              {t.CONTACT.label}
            </Link>
            <button
              data-burger
              type="button"
              aria-label={open ? (lang === 'en' ? 'Close menu' : 'Cerrar menú') : (lang === 'en' ? 'Open menu' : 'Abrir menú')}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44,
                border: '1px solid var(--border-strong-dark)', borderRadius: 2, background: 'transparent',
                color: 'var(--white)', cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M3 6h18M3 12h18M3 18h18'} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ---- menú móvil: editorial, a pantalla completa, con acordeones ---- */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 'var(--z-nav-overlay)', background: 'var(--navy-950)',
            padding: 'var(--space-6) var(--gutter-page)', display: 'flex', flexDirection: 'column', overflow: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo />
            <button
              type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44,
                border: '1px solid var(--border-strong-dark)', borderRadius: 2, background: 'transparent',
                color: 'var(--white)', cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Principal (móvil)" style={{ marginTop: 'var(--space-9)', display: 'flex', flexDirection: 'column' }}>
            {t.NAV.map((item, i) =>
              item.items ? (
                <div key={item.label} style={{ borderBottom: '1px solid var(--border-hairline-dark)' }}>
                  <button
                    type="button"
                    aria-expanded={acc === i}
                    aria-controls={`acc-${i}`}
                    onClick={() => setAcc((a) => (a === i ? null : i))}
                    style={{
                      width: '100%', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'transparent', border: 0, cursor: 'pointer', padding: 'var(--space-4) 0',
                      fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)',
                      fontSize: 'var(--text-h2)', letterSpacing: 'var(--track-heading)', color: 'var(--white)',
                    }}
                  >
                    {item.label}
                    <Chevron open={acc === i} />
                  </button>
                  {acc === i && (
                    <ul id={`acc-${i}`} style={{ listStyle: 'none', margin: 0, padding: '0 0 var(--space-6)', display: 'grid', gap: 'var(--space-5)' }}>
                      {item.items.map((opt) => (
                        <li key={opt.to}>
                          <Link to={opt.to} style={{ display: 'block', minHeight: 44, textDecoration: 'none', font: 'var(--type-body)', color: 'var(--slate-200)' }}>
                            {opt.label}
                          </Link>
                          {/* En móvil el tercer nivel es otro acordeón, nunca hover */}
                          {opt.groups && (
                            <>
                              <button
                                type="button"
                                aria-expanded={sub === opt.to}
                                aria-controls={`msub-${slugOf(opt.to)}`}
                                onClick={() => setSub((v) => (v === opt.to ? null : opt.to))}
                                style={{
                                  minHeight: 44, display: 'inline-flex', alignItems: 'center', gap: 8,
                                  background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
                                  font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
                                  textTransform: 'uppercase', color: 'var(--electric-green)',
                                }}
                              >
                                {opt.heading}
                                <Chevron open={sub === opt.to} />
                              </button>
                              {sub === opt.to && (
                                <div id={`msub-${slugOf(opt.to)}`} style={{ display: 'grid', gap: 'var(--space-5)', padding: '0 0 var(--space-5)' }}>
                                  {opt.groups.map((g) => (
                                    <div key={g.title}>
                                      <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 'var(--text-micro)', color: 'var(--slate-400)' }}>{g.title}</p>
                                      <ul style={{ listStyle: 'none', margin: 'var(--space-3) 0 0', padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
                                        {g.items.map((pr) => (
                                          <li key={pr.to}>
                                            <Link to={pr.to} style={{ display: 'block', minHeight: 40, textDecoration: 'none', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-200)' }}>
                                              {pr.label.replace('IA aplicada a ', '')}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                  <Link to={opt.more.to} style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--electric-green)', textDecoration: 'none' }}>
                                    {opt.more.label} →
                                  </Link>
                                </div>
                              )}
                            </>
                          )}
                        </li>
                      ))}
                      {item.more && (
                        <li>
                          <Link to={item.more.to} style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--electric-green)', textDecoration: 'none' }}>
                            {item.more.label} →
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  style={{
                    minHeight: 56, display: 'flex', alignItems: 'center', textDecoration: 'none',
                    borderBottom: '1px solid var(--border-hairline-dark)',
                    fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)',
                    fontSize: 'var(--text-h2)', letterSpacing: 'var(--track-heading)', color: 'var(--white)',
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <Link
            to={t.CONTACT.to}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-9)',
              minHeight: 52, padding: '0 var(--space-7)', borderRadius: 'var(--radius-pill)',
              background: 'var(--electric-green)', color: 'var(--deep-navy)', font: 'var(--type-label)',
              letterSpacing: 'var(--track-label)', textTransform: 'uppercase', textDecoration: 'none',
            }}
          >
            {t.CONTACT.label}
          </Link>

          <span style={{ marginTop: 'var(--space-8)' }}><Lang /></span>
        </div>
      )}
    </>
  );
}
