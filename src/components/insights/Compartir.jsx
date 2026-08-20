import React from 'react';
import { Ico } from '../icons.jsx';

/**
 * Compartir un artículo.
 *
 * ---- Por qué no son los botones oficiales ----
 *
 * LinkedIn, X y WhatsApp publican widgets que se pegan con un <script>. Cada
 * uno carga código de un tercero en la página y deja una cookie a TODO el que
 * pasa por el artículo, comparta o no. Eso son tres peticiones a tres dominios,
 * el aviso de cookies que hoy no hace falta, y unos cuantos kilobytes en la
 * ruta crítica, a cambio de nada: lo único que hacen esos widgets es abrir una
 * URL que se puede escribir a mano.
 *
 * Aquí son enlaces. No hay JavaScript de nadie más, no se rastrea a quien no
 * comparte, y funcionan igual.
 *
 * ---- Por qué estas cuatro y en este orden ----
 *
 * LinkedIn primero porque es donde está la audiencia de este sitio. WhatsApp
 * tercero y no cuarto porque en Latinoamérica es donde de verdad se pasa un
 * enlace entre dos personas que trabajan juntas. Copiar el enlace al final
 * porque es el que sirve para todo lo demás: correo, Slack, un documento.
 */

const T = {
  es: {
    titulo: 'Compartir',
    linkedin: 'Compartir en LinkedIn',
    x: 'Compartir en X',
    whatsapp: 'Compartir por WhatsApp',
    copiar: 'Copiar enlace',
    copiado: 'Enlace copiado',
  },
  en: {
    titulo: 'Share',
    linkedin: 'Share on LinkedIn',
    x: 'Share on X',
    whatsapp: 'Share on WhatsApp',
    copiar: 'Copy link',
    copiado: 'Link copied',
  },
};

/* 44px es el mínimo por el que una persona acierta con el dedo sin fallar. Los
   iconos son de 20, así que el resto lo pone el relleno. */
const BOTON = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 44, height: 44,
  border: '1px solid var(--border-hairline)', borderRadius: 2,
  background: 'transparent', color: 'var(--text-muted)',
  cursor: 'pointer', textDecoration: 'none',
  transition: 'color .2s, border-color .2s',
};

function Boton({ href, etiqueta, icono, alPulsar }) {
  const [dentro, setDentro] = React.useState(false);
  const estilo = {
    ...BOTON,
    color: dentro ? 'var(--text-accent)' : 'var(--text-muted)',
    borderColor: dentro ? 'var(--text-accent)' : 'var(--border-hairline)',
  };
  const props = {
    style: estilo,
    'aria-label': etiqueta,
    title: etiqueta,
    onMouseEnter: () => setDentro(true),
    onMouseLeave: () => setDentro(false),
    onFocus: () => setDentro(true),
    onBlur: () => setDentro(false),
  };
  return href
    /* noopener: sin él, la página que se abre puede manipular esta desde
       window.opener. noreferrer además no le cuenta de dónde viene. */
    ? <a href={href} target="_blank" rel="noopener noreferrer" {...props}><Ico name={icono} size={20} /></a>
    : <button type="button" onClick={alPulsar} {...props}><Ico name={icono} size={20} /></button>;
}

export default function Compartir({ url, titulo, lang = 'es' }) {
  const t = T[lang] || T.es;
  const [copiado, setCopiado] = React.useState(false);

  const u = encodeURIComponent(url);
  const tit = encodeURIComponent(titulo);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* Sin permiso de portapapeles —o sin HTTPS— no se deja a la persona sin
         salida: se selecciona el enlace para que lo copie a mano. */
      const campo = document.createElement('input');
      campo.value = url;
      document.body.appendChild(campo);
      campo.select();
      try { document.execCommand('copy'); } catch { /* nada más que ofrecer */ }
      campo.remove();
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2400);
  };

  return (
    <div style={{ marginTop: 'var(--space-11)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-hairline)' }}>
      <p style={{ margin: '0 0 var(--space-4)', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
        {t.titulo}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Boton icono="linkedin" etiqueta={t.linkedin} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} />
        <Boton icono="x" etiqueta={t.x} href={`https://twitter.com/intent/tweet?url=${u}&text=${tit}`} />
        <Boton icono="whatsapp" etiqueta={t.whatsapp} href={`https://wa.me/?text=${tit}%20${u}`} />
        <Boton icono={copiado ? 'copiado' : 'enlace'} etiqueta={copiado ? t.copiado : t.copiar} alPulsar={copiar} />
      </div>
      {/* Se anuncia el resultado a quien no ve el icono cambiar */}
      <p aria-live="polite" style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-accent)', minHeight: '1.2em' }}>
        {copiado ? t.copiado : ''}
      </p>
    </div>
  );
}
