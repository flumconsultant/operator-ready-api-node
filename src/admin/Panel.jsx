import React from 'react';
import { Link } from 'react-router-dom';
import * as api from './api.js';
import Editor, { ARTICULO_NUEVO, problemas } from './Editor.jsx';
import Autores from './Autores.jsx';
import Suscriptores from './Suscriptores.jsx';
import Paginas from './Paginas.jsx';
import { Etiqueta, Texto, Boton, Fila, Aviso, marco } from './piezas.jsx';

/**
 * Panel de artículos.
 *
 * Publicar es escribir un archivo JSON en el repositorio; a partir de ahí actúa
 * el despliegue que ya existe. Por eso publicar no es inmediato y el panel lo
 * dice con todas las letras: dar a un botón y no ver el cambio en la web es
 * indistinguible de que el botón no haya funcionado, y lleva a pulsarlo otra
 * vez.
 *
 * Quien entra lo hace con usuario y contraseña contra /api/panel.php; el token
 * de GitHub vive en el servidor y nunca llega al navegador. Eso es lo que
 * permite dar acceso a alguien del equipo sin darle también permiso de
 * escritura sobre el repositorio entero.
 *
 * No hay autoguardado. Un editor que guarda solo, sobre un repositorio, deja un
 * historial de decenas de versiones a medio escribir por cada artículo — y en
 * un sitio donde publicar dispara un despliegue, cada guardado automático sería
 * además una subida al servidor.
 */

const ESTADO_CLAVE = 'become.admin.borrador';

function Puerta({ alEntrar }) {
  const [usuario, setUsuario] = React.useState('');
  const [clave, setClave] = React.useState('');
  const [error, setError] = React.useState('');
  const [entrando, setEntrando] = React.useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setEntrando(true); setError('');
    try { alEntrar(await api.entrar(usuario, clave)); }
    catch (err) { setError(err.message); setClave(''); }
    finally { setEntrando(false); }
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '80px 24px' }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
        Artículos de BECOME
      </h1>
      <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>
        Entra para escribir y publicar en Insights.
      </p>

      {/* Un formulario de verdad, no dos campos sueltos: así el gestor de
          contraseñas del navegador ofrece guardarlas y rellenarlas, y la tecla
          Intro envía. */}
      <form onSubmit={enviar} style={{ display: 'grid', gap: 12, marginTop: 24, background: marco.papel, border: marco.linea, borderRadius: 2, padding: 20 }}>
        <div>
          <Etiqueta>Usuario</Etiqueta>
          <Texto valor={usuario} alCambiar={setUsuario} type="email" name="username" autoComplete="username" autoFocus />
        </div>
        <div>
          <Etiqueta>Contraseña</Etiqueta>
          <Texto valor={clave} alCambiar={setClave} type="password" name="password" autoComplete="current-password" />
        </div>
        <div>
          <Boton variante="fuerte" type="submit" disabled={!usuario || !clave || entrando}>
            {entrando ? 'Entrando…' : 'Entrar'}
          </Boton>
        </div>
        <Aviso tono="mal">{error}</Aviso>
      </form>

      <p style={{ font: 'var(--type-body)', fontSize: 13, color: 'var(--text-faint)' }}>
        ¿No tienes acceso? Las cuentas las da quien administra el sitio.
      </p>
    </div>
  );
}

function Lista({ items, alAbrir, alNuevo, alRecargar, cargando, vacioEn }) {
  return (
    <>
      <Fila style={{ justifyContent: 'space-between', marginBottom: 20 }}>
        <Fila gap={8}>
          <Boton variante="fuerte" onClick={alNuevo}>Nuevo artículo</Boton>
          <Boton onClick={alRecargar} disabled={cargando}>{cargando ? 'Cargando…' : 'Recargar'}</Boton>
        </Fila>
        <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
          {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
        </span>
      </Fila>

      {items.length === 0 && !cargando && (
        <Aviso>
          Todavía no hay ningún artículo. El primero que crees creará también la carpeta en el repositorio.
          {vacioEn ? ` Se miró en ${vacioEn}.` : ''}
        </Aviso>
      )}

      <div style={{ display: 'grid', gap: 1, background: 'var(--border-hairline)', border: marco.linea }}>
        {items.map((it) => (
          <button
            key={it.archivo}
            type="button"
            onClick={() => alAbrir(it)}
            style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 16, alignItems: 'center',
              textAlign: 'left', padding: '14px 16px', background: marco.papel, border: 0, cursor: 'pointer',
            }}
          >
            <span>
              <span style={{ display: 'block', font: 'var(--type-h3)', color: 'var(--text-heading)' }}>
                {it.articulo.es?.titulo || it.articulo.en?.titulo || it.archivo}
              </span>
              <span style={{ display: 'block', marginTop: 4, font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
                {it.articulo.fecha} · {it.articulo.es?.slug ? 'ES' : '—'} {it.articulo.en?.slug ? 'EN' : ''}
              </span>
            </span>
            <span style={{
              font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 999,
              background: it.articulo.estado === 'publicado' ? 'var(--electric-green)' : 'var(--off-white)',
              color: it.articulo.estado === 'publicado' ? 'var(--navy-900)' : 'var(--text-muted)',
              border: it.articulo.estado === 'publicado' ? 0 : marco.linea,
            }}>
              {it.articulo.estado === 'publicado' ? 'Publicado' : 'Borrador'}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}


/* La navegación del panel.
 *
 * Antes eran botones que cambiaban de nombre según dónde estabas: el de
 * «Suscriptores» pasaba a decir «Artículos» al entrar, así que el rótulo
 * describía a dónde te llevaba y no dónde estabas. Con dos secciones se
 * aguanta; con cinco es un laberinto.
 *
 * Ahora cada módulo tiene un sitio fijo y el activo se ve. La barra se
 * desplaza en horizontal a propósito: quien administra esto lo hace desde el
 * móvil, y apilar los módulos en vertical empujaría el contenido fuera de la
 * pantalla antes de empezar a trabajar. */
const MODULOS = [
  ['articulos', 'Artículos'],
  ['paginas', 'Páginas'],
  ['autores', 'Autores'],
  ['suscriptores', 'Suscriptores'],
];

function Modulos({ vista, alCambiar }) {
  return (
    <nav
      aria-label="Secciones del panel"
      style={{
        display: 'flex', gap: 2, overflowX: 'auto', borderTop: marco.linea,
        background: marco.papel, padding: '0 12px', WebkitOverflowScrolling: 'touch',
      }}
    >
      {MODULOS.map(([id, rotulo]) => {
        const activo = vista === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => alCambiar(id)}
            aria-current={activo ? 'page' : undefined}
            style={{
              appearance: 'none', border: 0, background: 'transparent', cursor: 'pointer',
              font: 'var(--type-body)', fontSize: 14,
              fontWeight: activo ? 600 : 400,
              color: activo ? 'var(--text-heading)' : 'var(--text-faint)',
              padding: '13px 14px', whiteSpace: 'nowrap',
              borderBottom: `2px solid ${activo ? 'var(--text-accent)' : 'transparent'}`,
            }}
          >
            {rotulo}
          </button>
        );
      })}
    </nav>
  );
}

export default function Panel() {
  /* null = no se sabe todavía; false = no hay sesión; objeto = quién eres.
     El tercer estado importa: sin él, el panel enseñaría la pantalla de entrada
     durante un instante a alguien que ya tiene la sesión abierta. */
  const [sesion, setSesion] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [vacioEn, setVacioEn] = React.useState('');
  const [cargando, setCargando] = React.useState(false);
  const [abierto, setAbierto] = React.useState(null);   // { archivo, sha, articulo, publicadoAntes }
  const [error, setError] = React.useState('');
  const [nota, setNota] = React.useState('');
  const [guardando, setGuardando] = React.useState(false);

  /* /admin no es contenido: no debe aparecer en un buscador aunque alguien
     enlace la dirección. El sitemap ya la excluye; esto cubre el caso de que
     un rastreador llegue por otra vía. */
  React.useEffect(() => {
    document.title = 'Panel — BECOME';
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  const cargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try { const d = await api.listar(); setItems(d.articulos || []); setVacioEn(d.vacio_en || ''); }
    catch (e) {
      if (e.tipo === 'sin_sesion') { setSesion(false); return; }
      setError(e.message);
    } finally { setCargando(false); }
  }, []);

  /* Quién eres se le pregunta al servidor, no se deduce de nada guardado en el
     navegador: la cookie es ilegible desde aquí a propósito, y la sesión puede
     haber caducado o haberse revocado desde el último uso. */
  React.useEffect(() => {
    let vivo = true;
    api.quienSoy()
      .then((d) => vivo && setSesion(d))
      .catch(() => vivo && setSesion(false));
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { if (sesion) cargar(); }, [sesion, cargar]);

  /* Un cambio a medio escribir sobrevive a un refresco accidental. Vive en el
     navegador y no en el repositorio: no es una versión, es lo que había en
     pantalla. */
  React.useEffect(() => {
    if (!abierto) return undefined;
    const id = setTimeout(() => sessionStorage.setItem(ESTADO_CLAVE, JSON.stringify(abierto)), 400);
    return () => clearTimeout(id);
  }, [abierto]);

  React.useEffect(() => {
    if (abierto) return;
    const guardado = sessionStorage.getItem(ESTADO_CLAVE);
    if (guardado) { try { setAbierto(JSON.parse(guardado)); } catch { /* se descarta */ } }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cerrar = () => { setAbierto(null); sessionStorage.removeItem(ESTADO_CLAVE); setNota(''); };

  /* La pantalla de autores es una vista aparte y no una pestaña dentro del
     editor: se toca una vez cada muchos meses, y meterla junto a lo que se usa
     todos los días solo estorba. */
  const [vista, setVista] = React.useState('articulos');

  const cerrarSesion = async () => {
    await api.salir().catch(() => {});
    sessionStorage.removeItem(ESTADO_CLAVE);
    setSesion(false); setItems([]); setAbierto(null);
  };

  if (sesion === null) {
    return <div style={{ padding: 80, textAlign: 'center', font: 'var(--type-mono)', color: 'var(--text-faint)' }}>Comprobando la sesión…</div>;
  }
  if (!sesion) return <Puerta alEntrar={setSesion} />;

  /* Si la sesión caducó a media edición, no se enseña un error: se vuelve a la
     pantalla de entrada. Lo escrito sigue en sessionStorage, así que al
     volver a entrar el artículo aparece tal como se dejó. */
  const fallo = (e) => {
    if (e.tipo === 'sin_sesion') { setSesion(false); return; }
    setError(e.message);
  };

  const publicar = async () => {
    const art = abierto.articulo;
    setGuardando(true); setError(''); setNota('');
    try {
      const archivo = abierto.archivo || `${art.es?.slug || art.en?.slug}.json`;
      await api.guardar({
        archivo,
        sha: abierto.sha,
        articulo: art,
        mensaje: `${abierto.sha ? 'Actualizar' : 'Añadir'} artículo: ${art.es?.titulo || art.en?.titulo}`,
      });
      sessionStorage.removeItem(ESTADO_CLAVE);
      setAbierto(null);
      setNota(art.estado === 'publicado'
        ? 'Guardado. El sitio se está reconstruyendo: tarda unos tres minutos en verse en meetbecome.com.'
        : 'Guardado como borrador. No aparece en la web hasta que lo pongas en «Publicado».');
      await cargar();
    } catch (e) { fallo(e); } finally { setGuardando(false); }
  };

  const retirar = async () => {
    if (!abierto?.sha) return;
    if (!window.confirm('¿Retirar este artículo? Se borra del repositorio; el historial de git lo conserva.')) return;
    setGuardando(true); setError('');
    try {
      await api.borrar({ archivo: abierto.archivo, sha: abierto.sha });
      sessionStorage.removeItem(ESTADO_CLAVE);
      setAbierto(null);
      setNota('Retirado. El sitio se está reconstruyendo.');
      await cargar();
    } catch (e) { fallo(e); } finally { setGuardando(false); }
  };

  const fallos = abierto ? problemas(abierto.articulo) : [];

  return (
    <main style={{ minHeight: '100vh', background: marco.fondo, font: 'var(--type-body)', color: 'var(--text-body)' }}>
      <header style={{ borderBottom: marco.linea, background: marco.papel, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 24px', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <Fila gap={12}>
            <strong style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--track-label)' }}>BECOME</strong>
            <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>{sesion.nombre}</span>
          </Fila>
          <Fila gap={8}>
            {abierto ? (
              <>
                <Boton onClick={cerrar} disabled={guardando}>Volver</Boton>
                {abierto.sha && <Boton variante="peligro" onClick={retirar} disabled={guardando}>Retirar</Boton>}
                <Boton variante="fuerte" onClick={publicar} disabled={guardando || fallos.length > 0}>
                  {guardando ? 'Guardando…' : abierto.articulo.estado === 'publicado' ? 'Publicar' : 'Guardar borrador'}
                </Boton>
              </>
            ) : (
              <>
                <Link to="/es" style={{ font: 'var(--type-body)', fontSize: 14, color: 'var(--text-accent)' }}>Ver el sitio</Link>
                <Boton variante="quieto" onClick={cerrarSesion}>Salir</Boton>
              </>
            )}
          </Fila>
        </div>
        {!abierto && <Modulos vista={vista} alCambiar={setVista} />}
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <Aviso tono="mal">{error}</Aviso>
        <Aviso tono="bien">{nota}</Aviso>

        {vista === 'paginas' && !abierto ? (
          <div style={{ marginTop: 16 }}>
            <Paginas />
          </div>
        ) : vista === 'suscriptores' && !abierto ? (
          <Suscriptores alCerrar={() => setVista('articulos')} />
        ) : vista === 'autores' && !abierto ? (
          <div style={{ marginTop: 16 }}>
            <Autores alCerrar={() => setVista('articulos')} />
          </div>
        ) : abierto ? (
          <div style={{ marginTop: 16 }}>
            <Editor
              articulo={abierto.articulo}
              publicadoAntes={Boolean(abierto.sha) && abierto.articulo.estado === 'publicado'}
              alCambiar={(a) => setAbierto({ ...abierto, articulo: a })}
            />
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <Lista
              items={items}
              cargando={cargando}
              vacioEn={vacioEn}
              alRecargar={cargar}
              alNuevo={() => setAbierto({ archivo: null, sha: null, articulo: ARTICULO_NUEVO() })}
              alAbrir={(it) => setAbierto({ archivo: it.archivo, sha: it.sha, articulo: it.articulo })}
            />
          </div>
        )}
      </div>
    </main>
  );
}
