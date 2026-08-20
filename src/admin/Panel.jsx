import React from 'react';
import { Link } from 'react-router-dom';
import * as gh from './github.js';
import Editor, { ARTICULO_NUEVO, problemas } from './Editor.jsx';
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
 * No hay autoguardado. Un editor que guarda solo, sobre un repositorio, deja un
 * historial de decenas de versiones a medio escribir por cada artículo — y en
 * un sitio donde publicar dispara un despliegue, cada guardado automático sería
 * además una subida al servidor.
 */

const ESTADO_CLAVE = 'become.admin.borrador';

function Puerta({ alEntrar }) {
  const [cfg, setCfg] = React.useState({ repo: 'flumconsultant/operator-ready-api-node', rama: 'main', token: '' });
  const [error, setError] = React.useState('');
  const [probando, setProbando] = React.useState(false);

  const entrar = async () => {
    setProbando(true); setError('');
    try {
      await gh.comprobar(cfg);
      gh.guardarConfig(cfg);
      alEntrar(cfg);
    } catch (e) { setError(e.message); } finally { setProbando(false); }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', color: 'var(--text-heading)' }}>
        Artículos de BECOME
      </h1>
      <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: '52ch' }}>
        Este panel escribe directamente en el repositorio del sitio. Quien
        autoriza es GitHub, así que hace falta un token con permiso de escritura
        — sin él, aquí no se puede ver ni cambiar nada.
      </p>

      <div style={{ display: 'grid', gap: 12, marginTop: 24, background: marco.papel, border: marco.linea, borderRadius: 2, padding: 20 }}>
        <div><Etiqueta>Repositorio</Etiqueta><Texto valor={cfg.repo} alCambiar={(v) => setCfg({ ...cfg, repo: v })} /></div>
        <div><Etiqueta pista="la rama que se despliega">Rama</Etiqueta><Texto valor={cfg.rama} alCambiar={(v) => setCfg({ ...cfg, rama: v })} /></div>
        <div>
          <Etiqueta>Token de GitHub</Etiqueta>
          <Texto valor={cfg.token} alCambiar={(v) => setCfg({ ...cfg, token: v.trim() })} type="password" placeholder="github_pat_…" autoComplete="off" />
        </div>
        <Fila>
          <Boton variante="fuerte" onClick={entrar} disabled={!cfg.token || probando}>
            {probando ? 'Comprobando…' : 'Entrar'}
          </Boton>
          <a
            href="https://github.com/settings/personal-access-tokens/new"
            target="_blank" rel="noreferrer"
            style={{ font: 'var(--type-body)', fontSize: 14, color: 'var(--text-accent)' }}
          >
            Crear un token
          </a>
        </Fila>
        <Aviso tono="mal">{error}</Aviso>
        <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 13, color: 'var(--text-faint)' }}>
          Al crearlo, elige «Only select repositories» → este repositorio, y en
          permisos únicamente <strong>Contents: Read and write</strong>. Con eso
          puede escribir artículos y nada más. El token se guarda solo en este
          navegador y no se envía a ningún sitio que no sea GitHub.
        </p>
      </div>
    </div>
  );
}

function Lista({ items, alAbrir, alNuevo, alRecargar, cargando }) {
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
        <Aviso>Todavía no hay ningún artículo. El primero que crees creará también la carpeta en el repositorio.</Aviso>
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

export default function Panel() {
  const [cfg, setCfg] = React.useState(() => gh.leerConfig());
  const [items, setItems] = React.useState([]);
  const [cargando, setCargando] = React.useState(false);
  const [abierto, setAbierto] = React.useState(null);   // { archivo, sha, articulo, publicadoAntes }
  const [error, setError] = React.useState('');
  const [nota, setNota] = React.useState('');
  const [guardando, setGuardando] = React.useState(false);

  /* /admin no es contenido: no debe aparecer en un buscador aunque alguien
     enlace la dirección. El sitemap ya la excluye; esto cubre el caso de que
     un rastreador llegue por otra vía. */
  React.useEffect(() => {
    document.title = 'Artículos — BECOME';
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  const cargar = React.useCallback(async (c) => {
    setCargando(true); setError('');
    try { setItems(await gh.listar(c)); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);

  React.useEffect(() => { if (cfg) cargar(cfg); }, [cfg, cargar]);

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

  const salir = () => { gh.olvidarConfig(); sessionStorage.removeItem(ESTADO_CLAVE); setCfg(null); setItems([]); setAbierto(null); };

  if (!cfg) return <Puerta alEntrar={setCfg} />;

  const publicar = async () => {
    const art = abierto.articulo;
    setGuardando(true); setError(''); setNota('');
    try {
      const archivo = abierto.archivo || `${art.es?.slug || art.en?.slug}.json`;
      await gh.guardar(cfg, {
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
      await cargar(cfg);
    } catch (e) { setError(e.message); } finally { setGuardando(false); }
  };

  const retirar = async () => {
    if (!abierto?.sha) return;
    if (!window.confirm('¿Retirar este artículo? Se borra del repositorio; el historial de git lo conserva.')) return;
    setGuardando(true); setError('');
    try {
      await gh.borrar(cfg, { archivo: abierto.archivo, sha: abierto.sha });
      sessionStorage.removeItem(ESTADO_CLAVE);
      setAbierto(null);
      setNota('Retirado. El sitio se está reconstruyendo.');
      await cargar(cfg);
    } catch (e) { setError(e.message); } finally { setGuardando(false); }
  };

  const fallos = abierto ? problemas(abierto.articulo) : [];

  return (
    <main style={{ minHeight: '100vh', background: marco.fondo, font: 'var(--type-body)', color: 'var(--text-body)' }}>
      <header style={{ borderBottom: marco.linea, background: marco.papel, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 24px', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <Fila gap={12}>
            <strong style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--track-label)' }}>BECOME · Artículos</strong>
            <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>{cfg.repo}@{cfg.rama}</span>
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
                <Link to="/es/insights" style={{ font: 'var(--type-body)', fontSize: 14, color: 'var(--text-accent)' }}>Ver Insights</Link>
                <Boton variante="quieto" onClick={salir}>Salir</Boton>
              </>
            )}
          </Fila>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <Aviso tono="mal">{error}</Aviso>
        <Aviso tono="bien">{nota}</Aviso>

        {abierto ? (
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
              alRecargar={() => cargar(cfg)}
              alNuevo={() => setAbierto({ archivo: null, sha: null, articulo: ARTICULO_NUEVO() })}
              alAbrir={(it) => setAbierto({ archivo: it.archivo, sha: it.sha, articulo: it.articulo })}
            />
          </div>
        )}
      </div>
    </main>
  );
}
