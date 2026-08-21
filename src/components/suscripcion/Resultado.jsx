import React from 'react';
import { useLocation } from 'react-router-dom';
import { Ico } from '../icons.jsx';

/**
 * Lo que se ve al volver de un enlace del correo: confirmar el alta, o la baja.
 *
 * ---- Por qué la baja necesita un botón y no basta el enlace ----
 *
 * Gmail, Outlook y los antivirus de correo abren los enlaces de un mensaje por
 * su cuenta, antes de que nadie los pulse, para comprobar que no llevan a nada
 * peligroso. Si el enlace de baja diera de baja por sí solo, esas visitas
 * automáticas irían borrando suscriptores sin que nadie hubiera hecho nada, y
 * la lista encogería sola y sin explicación.
 *
 * Así que el enlace del correo trae hasta aquí y la baja la hace este botón,
 * con un POST. El un-clic que ofrece el propio cliente de correo ya llega por
 * POST —lo exige la norma de List-Unsubscribe— así que ese camino sigue siendo
 * de un solo clic y no pasa por esta página.
 *
 * ---- Y por qué se anuncia ----
 *
 * role="status" y foco al aterrizar: quien llega aquí viene de otra aplicación,
 * y sin eso un lector de pantalla empieza a leer la página desde el principio
 * sin mencionar lo único que ha cambiado.
 */

const T = {
  es: {
    confirmada: ['Suscripción confirmada', 'Ya estás dentro. Recibirás un correo cuando publiquemos, y puedes darte de baja en un clic desde cualquiera de ellos.'],
    baja: ['Te has dado de baja', 'No volverás a recibir los artículos. Si fue sin querer, puedes suscribirte otra vez cuando quieras.'],
    confirmarTitulo: '¿Quieres dejar de recibir los artículos?',
    confirmarTexto: 'Pulsa el botón y no volveremos a escribirte.',
    confirmarBoton: 'Darme de baja',
    enviando: 'Dando de baja…',
    error: 'No se ha podido completar la baja. Inténtalo de nuevo en un momento.',
    cerrar: 'Cerrar',
  },
  en: {
    confirmada: ['Subscription confirmed', 'You are in. You will get an email when we publish, and you can unsubscribe in one click from any of them.'],
    baja: ['You have unsubscribed', 'You will not receive the articles again. If it was a mistake, you can subscribe again whenever you want.'],
    confirmarTitulo: 'Do you want to stop receiving the articles?',
    confirmarTexto: 'Press the button and we will not write to you again.',
    confirmarBoton: 'Unsubscribe',
    enviando: 'Unsubscribing…',
    error: 'We could not complete the unsubscribe. Please try again in a moment.',
    cerrar: 'Close',
  },
};

export default function Resultado() {
  const { pathname, search } = useLocation();
  const lang = pathname.startsWith('/en') ? 'en' : 'es';
  const t = T[lang] || T.es;

  const params = new URLSearchParams(search);
  const [estado, setEstado] = React.useState(params.get('suscripcion') || '');
  const token = params.get('t') || '';
  const [enviando, setEnviando] = React.useState(false);
  const [error, setError] = React.useState('');
  const caja = React.useRef(null);

  React.useEffect(() => {
    if (estado) caja.current?.focus();
  }, [estado]);

  if (!estado) return null;

  const darDeBaja = async () => {
    setEnviando(true); setError('');
    try {
      const cuerpo = new URLSearchParams({ t: token });
      const r = await fetch('/api/suscripcion.php?accion=baja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: cuerpo,
      });
      if (!r.ok) throw new Error();
      setEstado('baja');
    } catch {
      setError(t.error);
    } finally {
      setEnviando(false);
    }
  };

  const cerrado = estado === 'confirmada' || estado === 'baja';
  const [titulo, texto] = cerrado ? t[estado] : [t.confirmarTitulo, t.confirmarTexto];

  return (
    <div
      ref={caja}
      tabIndex={-1}
      role="status"
      style={{
        marginBottom: 'var(--space-9)', padding: 'var(--space-6)',
        border: '1px solid var(--green-line)', borderRadius: 2,
        background: 'var(--white)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
      }}
    >
      <Ico name={cerrado ? 'yes' : 'chat'} size={22} style={{ color: 'var(--text-accent)', marginTop: 2, flex: 'none' }} />
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-heading)' }}>{titulo}</p>
        <p style={{ margin: '4px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--text-muted)' }}>{texto}</p>
        {!cerrado && (
          <button
            type="button"
            onClick={darDeBaja}
            disabled={enviando || !token}
            style={{
              marginTop: 'var(--space-5)', minHeight: 44, padding: '0 20px',
              border: '1px solid var(--border-strong)', borderRadius: 2, cursor: enviando ? 'progress' : 'pointer',
              background: 'transparent', color: 'var(--text-heading)',
              font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11,
            }}
          >
            {enviando ? t.enviando : t.confirmarBoton}
          </button>
        )}
        {error && (
          <p role="alert" style={{ margin: 'var(--space-4) 0 0', font: 'var(--type-body)', fontSize: 14, color: '#c2410c' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
