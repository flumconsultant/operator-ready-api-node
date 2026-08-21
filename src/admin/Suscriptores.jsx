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

/**
 * Por qué el correo del sitio acaba en spam.
 *
 * Un correo bien compuesto sigue yendo a spam si el DOMINIO no está
 * autenticado, y eso no se ve ni en el navegador ni en el código: son tres
 * registros en el DNS. Aquí se consultan de verdad, desde el servidor, y se
 * dice cuál falta y qué hay que pegar exactamente.
 *
 * Los tres hacen falta. Con dos de tres, sigue yendo a spam.
 */
function Entrega({ e }) {
  if (!e) return null;
  if (e.fallo) return null;

  if (!e.disponible) {
    return (
      <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16 }}>
        <Etiqueta>Autenticación del dominio</Etiqueta>
        <p style={{ margin: '8px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--text-muted)' }}>
          Este hosting no deja consultar el DNS desde PHP, así que desde aquí no se puede comprobar.
          Se revisa en <code style={{ font: 'var(--type-mono)', fontSize: 13 }}>mxtoolbox.com/SuperTool.aspx</code> escribiendo {e.dominio}.
        </p>
      </div>
    );
  }

  const filas = [
    {
      clave: 'SPF',
      ok: !!e.spf,
      valor: e.spf,
      que: 'Dice qué servidores pueden enviar correo en nombre del dominio.',
      arreglo: 'Añade un registro TXT en el dominio (nombre @) con el valor que indique tu proveedor de correo. Si el buzón es de Hostinger: v=spf1 include:_spf.mail.hostinger.com ~all',
    },
    {
      clave: 'DKIM',
      ok: e.dkim?.length > 0,
      valor: e.dkim?.length ? e.dkim.map((d) => `${d.selector} (${d.tipo}): ${d.valor}`).join(' · ') : null,
      que: 'Firma cada mensaje, para que se pueda comprobar que nadie lo ha tocado por el camino.',
      /* En Hostinger el DKIM son CNAME, no TXT. Decirlo aquí evita buscar un
         registro TXT que no existe y concluir que falta algo que está puesto. */
      arreglo: 'Lo genera el proveedor del buzón. En Hostinger: Correos → tu dominio → Configuración → DKIM. Son registros CNAME llamados hostingermail-a._domainkey, -b y -c, no registros TXT.',
    },
    {
      clave: 'DMARC',
      ok: !!e.dmarc,
      valor: e.dmarc,
      que: 'Dice qué hacer cuando SPF o DKIM fallan. Desde 2024 Gmail y Yahoo rechazan el correo masivo sin él.',
      arreglo: 'Añade un TXT en el nombre _dmarc con: v=DMARC1; p=none; rua=mailto:hello@' + e.dominio + '  — empieza con p=none para solo observar, y cuando lleves unas semanas sin fallos súbelo a p=quarantine.',
      /* Válido pero ciego: la política se aplica y los informes que dirían si
         algo falla no llegan a ninguna parte. */
      nota: e.dmarcSinInformes
        ? 'Está puesto pero sin «rua=»: no recibes los informes, así que si algo empieza a fallar no te enteras. Añade  rua=mailto:hello@' + e.dominio + '  al final del mismo registro.'
        : null,
    },
  ];
  const faltan = filas.filter((f) => !f.ok);

  return (
    <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16, display: 'grid', gap: 12 }}>
      <div>
        <Etiqueta>Autenticación del dominio {e.dominio}</Etiqueta>
        <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 14, color: faltan.length ? '#b45309' : 'var(--text-accent)' }}>
          {faltan.length
            ? `Faltan ${faltan.length} de 3. Mientras falte alguno, el correo seguirá cayendo en spam por bien escrito que esté.`
            : 'Los tres están puestos. Si aun así cae en spam, el motivo ya no es la autenticación.'}
        </p>
        {e.remitente && (
          <p style={{ margin: '4px 0 0', font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
            Remitente: {e.remitente}{e.mx?.length ? ` · MX: ${e.mx.join(', ')}` : ''}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {filas.map((f) => (
          <div key={f.clave} style={{ paddingTop: 10, borderTop: '1px solid var(--border-hairline)' }}>
            <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 13, color: f.ok ? 'var(--text-accent)' : '#b45309' }}>
              {f.ok ? '✓' : '✗'} {f.clave} — {f.ok ? 'puesto' : 'falta'}
            </p>
            <p style={{ margin: '4px 0 0', font: 'var(--type-body)', fontSize: 13, color: 'var(--text-muted)' }}>{f.que}</p>
            {f.ok
              ? <p style={{ margin: '4px 0 0', font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)', wordBreak: 'break-all' }}>{f.valor}</p>
              : <p style={{ margin: '4px 0 0', font: 'var(--type-body)', fontSize: 13, color: 'var(--text-heading)' }}>{f.arreglo}</p>}
            {f.ok && f.nota && (
              <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 13, color: '#b45309' }}>{f.nota}</p>
            )}
          </div>
        ))}
      </div>
      {e.dkim?.length === 0 && (
        <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 12, color: 'var(--text-faint)' }}>
          {/* Un DKIM vive siempre bajo un selector concreto, así que «no hay
              DKIM» solo significa «no hay bajo estos». Decir cuáles se
              probaron evita dar por ausente lo que está en otro sitio. */}
          Selectores probados: {e.selectoresProbados?.join(', ')}. Si tu proveedor usa otro, el DKIM puede existir bajo ese nombre.
        </p>
      )}
    </div>
  );
}

export default function Suscriptores({ alCerrar }) {
  const [datos, setDatos] = React.useState(null);
  const [entrega, setEntrega] = React.useState(null);
  const [error, setError] = React.useState('');
  const [cargando, setCargando] = React.useState(true);

  const cargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try {
      setDatos(await api.suscriptores());
      /* En su propio try: si el diagnóstico falla, la lista de correo tiene
         que seguir viéndose. Son dos preguntas distintas. */
      try { setEntrega(await api.diagnosticoCorreo()); } catch { setEntrega({ fallo: true }); }
    } catch (e) { setError(e.message); }
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

      <Entrega e={entrega} />

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

          {/* El registro de envíos. Es lo que responde a «se grabó pero no me
              llegó el correo»: si aquí hay una línea con el motivo, el fallo es
              del envío; si dice «aceptado por el servidor», el correo salió y
              el problema está en la bandeja de quien lo recibe. */}
          <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16 }}>
            <Etiqueta>Últimos envíos</Etiqueta>
            {datos.fallos?.length ? (
              <pre style={{
                margin: '8px 0 0', font: 'var(--type-mono)', fontSize: 12, lineHeight: 1.6,
                color: 'var(--text-body)', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
              }}>
                {datos.fallos.join('\n')}
              </pre>
            ) : (
              <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 14, color: 'var(--text-muted)' }}>
                No hay ningún registro de envío todavía.
              </p>
            )}
          </div>

          <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 13, color: 'var(--text-faint)' }}>
            Se muestran los 50 suscriptores más recientes. Muchos pendientes seguidos suelen significar que el
            correo de confirmación está cayendo en spam, no que la gente se arrepienta.
          </p>
        </>
      )}
    </div>
  );
}
