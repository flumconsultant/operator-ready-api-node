import React from 'react';
import * as api from './api.js';
import { Boton, Etiqueta, Aviso, marco } from './piezas.jsx';

/**
 * La lista de correo, para mirarla.
 *
 * Es de solo lectura. Poder dar de baja a alguien desde aquí sería cómodo y
 * sería también la vía más rápida a borrar una dirección por error sin que
 * quede rastro de quién ni por qué; la baja la hace cada persona con el enlace
 * que lleva cada correo.
 *
 * Los tres estados no son decoración, son el diagnóstico:
 *
 * · confirmado — recibe los artículos.
 * · pendiente  — se apuntó y no pulsó el enlace. Muchos pendientes seguidos
 *                significan que el correo de confirmación no está llegando, no
 *                que la gente no quiera; suele ser la carpeta de spam.
 * · baja       — se dio de baja. Que existan es buena señal: significa que el
 *                enlace funciona y nadie tiene que marcarte como spam.
 */

const COLOR = {
  confirmado: 'var(--text-accent)',
  pendiente: '#b45309',
  baja: 'var(--text-faint)',
};

const fecha = (s) => (s ? String(s).slice(0, 16).replace('T', ' ') : '');

export default function Suscriptores({ alCerrar }) {
  const [datos, setDatos] = React.useState(null);
  const [error, setError] = React.useState('');
  const [cargando, setCargando] = React.useState(true);

  const cargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try { setDatos(await api.suscriptores()); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);

  React.useEffect(() => { cargar(); }, [cargar]);

  const t = datos?.totales || {};
  const total = (t.confirmado || 0) + (t.pendiente || 0) + (t.baja || 0);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
          Lista de correo
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Boton variante="quieto" onClick={cargar} disabled={cargando}>{cargando ? 'Cargando…' : 'Actualizar'}</Boton>
          <Boton variante="quieto" onClick={alCerrar}>Artículos</Boton>
        </div>
      </div>

      <Aviso tono="mal">{error}</Aviso>

      {datos && !datos.configurado && (
        <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16 }}>
          <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-heading)' }}>
            La base de datos no está conectada todavía.
          </p>
          <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--text-muted)' }}>
            {datos.error
              ? <>El servidor respondió: <code style={{ font: 'var(--type-mono)', fontSize: 13 }}>{datos.error}</code></>
              : 'Faltan los secretos BD_HOST, BD_BASE, BD_USUARIO y BD_CLAVE, o el despliegue todavía no ha corrido con ellos.'}
          </p>
        </div>
      )}

      {datos?.configurado && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {[['confirmado', 'Confirmados'], ['pendiente', 'Pendientes'], ['baja', 'Bajas']].map(([k, nombre]) => (
              <div key={k} style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16 }}>
                <Etiqueta>{nombre}</Etiqueta>
                <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 30, color: COLOR[k] }}>
                  {t[k] || 0}
                </p>
              </div>
            ))}
          </div>

          {total === 0 ? (
            <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 20 }}>
              <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-heading)' }}>Todavía no hay nadie.</p>
              <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--text-muted)' }}>
                La conexión funciona y la tabla existe: cuando alguien se suscriba, aparecerá aquí en el acto.
              </p>
            </div>
          ) : (
            <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', font: 'var(--type-body)', fontSize: 14 }}>
                <thead>
                  <tr>
                    {['Correo', 'Estado', 'Idioma', 'Se apuntó', 'Confirmó', 'Desde'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: 'var(--text-faint)', borderBottom: marco.linea, whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datos.ultimos.map((s) => (
                    <tr key={s.email}>
                      {/* overflow-wrap: una dirección larga reflota en vez de
                          ensanchar la tabla y sacar el resto de la pantalla. */}
                      <td style={{ padding: '10px 14px', borderBottom: marco.linea, overflowWrap: 'anywhere' }}>{s.email}</td>
                      <td style={{ padding: '10px 14px', borderBottom: marco.linea, color: COLOR[s.estado], whiteSpace: 'nowrap' }}>{s.estado}</td>
                      <td style={{ padding: '10px 14px', borderBottom: marco.linea }}>{s.idioma}</td>
                      {/* Cifras tabulares: las fechas de una columna quedan
                          alineadas dígito con dígito y se comparan de un vistazo. */}
                      <td style={{ padding: '10px 14px', borderBottom: marco.linea, font: 'var(--type-mono)', fontSize: 12, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{fecha(s.alta_en)}</td>
                      <td style={{ padding: '10px 14px', borderBottom: marco.linea, font: 'var(--type-mono)', fontSize: 12, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{fecha(s.confirmado_en)}</td>
                      <td style={{ padding: '10px 14px', borderBottom: marco.linea, color: 'var(--text-faint)', fontSize: 12, overflowWrap: 'anywhere' }}>{s.origen || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 13, color: 'var(--text-faint)' }}>
            Se muestran los 50 más recientes. Muchos pendientes seguidos suelen significar que el correo de
            confirmación está cayendo en spam, no que la gente se arrepienta.
          </p>
        </>
      )}
    </div>
  );
}
