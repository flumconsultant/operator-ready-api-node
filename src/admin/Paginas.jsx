import React from 'react';
import * as api from './api.js';
import { Boton, Aviso } from './piezas.jsx';
import { Formulario, BarraPublicar } from './Formulario.jsx';

/**
 * Editar los textos del sitio, no solo los artículos.
 *
 * ---- Por qué el formulario no está escrito, sino dibujado ----
 *
 * Cada página declara sus campos en su JSON, con rótulo, ayuda, tipo y límite.
 * Este módulo no sabe qué es una portada: lee esa declaración y dibuja lo que
 * diga. Así, añadir una página nueva al panel no es tocar este archivo — es
 * añadir un JSON.
 *
 * La alternativa era un formulario por página, y con doce páginas eso son doce
 * sitios donde el rótulo puede acabar diciendo algo distinto del límite que se
 * aplica de verdad. Aquí solo hay una fuente y la comprueba el servidor.
 *
 * ---- El contador no es decoración ----
 *
 * Un título que pasa de sesenta caracteres se corta en Google, y una promesa
 * corta desperdicia el espacio que Google da. Quien escribe necesita ver eso
 * MIENTRAS escribe, no descubrirlo en una auditoría tres semanas después. Por
 * eso el contador avisa antes de llegar al tope, no cuando ya se pasó.
 */

/* El formulario es el mismo que el del módulo de Contenido: sabe dibujar
   líneas, párrafos, listas y tablas, plegar por secciones y contar caracteres.
   Tener dos editores era tener dos sitios donde el contador puede decir un
   número distinto del límite que aplica el servidor. */

/* Un campo está sin escribir si no tiene nada dentro, sea texto o lista. */
const sinEscribir = (p) => (p.campos || []).filter((c) => {
  const v = c.valor;
  if (Array.isArray(v)) return v.length === 0;
  if (v && typeof v === 'object') return Object.values(v).every((x) => !x || (Array.isArray(x) && !x.length));
  return !String(v ?? '').trim();
}).length;

export default function Paginas({ alCerrar, carpeta = 'paginas', titulo = 'Páginas del sitio', vacio }) {
  const [paginas, setPaginas] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [abierta, setAbierta] = React.useState(null);
  const [valores, setValores] = React.useState({});
  const [inicial, setInicial] = React.useState({});
  const [error, setError] = React.useState('');
  const [nota, setNota] = React.useState('');
  const [guardando, setGuardando] = React.useState(false);

  const cargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try { const d = await api.listarPaginas(carpeta); setPaginas(d.paginas || []); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, [carpeta]);

  React.useEffect(() => { cargar(); }, [cargar]);

  const abrir = (p) => {
    setAbierta(p);
    const v = Object.fromEntries((p.campos || []).map((c) => [
      c.id,
      structuredClone(c.valor ?? (['lista','pares','trios','tupla'].includes(c.tipo) ? [] : '')),
    ]));
    setValores(v);
    setInicial(structuredClone(v));
    setNota(''); setError('');
  };

  /* Se avisa de lo que está mal ANTES de intentar guardar, y con el nombre del
     campo. El servidor lo vuelve a comprobar —nunca se confía en el navegador—
     pero enterarse por un error del servidor es enterarse tarde. */
  /* En las páginas del sitio un campo vacío es un hueco en una página real, y
     por eso se impide. En el conocimiento no: se rellena poco a poco, y exigir
     que esté completo para guardar sería exigir que se invente. */
  const problemas = (abierta?.campos || []).filter((c) => {
    if (typeof valores[c.id] !== 'string') return false;
    const v = (valores[c.id] ?? '').trim();
    if (v === '') return carpeta === 'paginas';
    return typeof c.maximo === 'number' && v.length > c.maximo;
  });

  const guardar = async () => {
    setGuardando(true); setError(''); setNota('');
    try {
      const d = await api.guardarPagina({ carpeta, archivo: abierta._archivo, valores });
      if (d.sin_cambios) setNota('No había nada que cambiar.');
      else {
        setNota(`Publicado. ${d.cambiados === 1 ? 'Un campo' : `${d.cambiados} campos`}. Estará en la web en unos minutos, cuando termine el despliegue.`);
        await cargar();
      }
    } catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  };

  if (abierta) {
    const sucio = JSON.stringify(valores) !== JSON.stringify(inicial);
    return (
      <div className="pnl-lienzo pnl-lienzo--publica" style={{ padding: 0 }}>
        <div className="pnl-barra">
          <div>
            <h2 className="pnl-titulo">{abierta.titulo}</h2>
            <p className="pnl-sub">{abierta.ruta || abierta.pregunta}</p>
          </div>
          <div className="pnl-acciones">
            <Boton onClick={() => setAbierta(null)} disabled={guardando}>Volver</Boton>
          </div>
        </div>

        <Aviso tono="mal">{error}</Aviso>
        <Aviso tono="bien">{nota}</Aviso>
        {problemas.length > 0 && (
          <Aviso tono="mal">
            {problemas.map((c) => c.rotulo).join(' · ')} — revisa {problemas.length === 1 ? 'ese campo' : 'esos campos'} antes de publicar.
          </Aviso>
        )}

        <Formulario
          key={abierta._archivo}
          campos={abierta.campos || []}
          valores={valores}
          alCambiar={(id, v) => setValores((x) => ({ ...x, [id]: v }))}
        />

        <BarraPublicar sucio={sucio} guardando={guardando} problemas={problemas.length} onPublicar={guardar} />
      </div>
    );
  }

  const vacios = paginas.reduce((n, p) => n + sinEscribir(p), 0);
  const total = paginas.reduce((n, p) => n + (p.campos || []).length, 0);

  return (
    <div className="pnl-lienzo" style={{ padding: 0 }}>
      <div className="pnl-barra">
        <h2 className="pnl-titulo">{titulo}</h2>
        <div className="pnl-acciones">
          <Boton onClick={cargar} disabled={cargando}>{cargando ? 'Cargando…' : 'Recargar'}</Boton>
          {alCerrar && <Boton onClick={alCerrar}>Cerrar</Boton>}
        </div>
      </div>

      <Aviso tono="mal">{error}</Aviso>

      {/* La deuda, a la vista. Trece campos de conocimiento sin escribir no se
          ven entrando documento por documento: se ven cuando alguien los
          cuenta y los pone en la primera pantalla. Solo aparece si hay algo
          que deber; un contador que siempre dice cero es ruido. */}
      {vacios > 0 && (
        <p className="pnl-deuda">
          <strong>{vacios}</strong> {vacios === 1 ? 'campo sin escribir' : 'campos sin escribir'} de {total}
        </p>
      )}

      {!cargando && paginas.length === 0 && (
        <div className="pnl-vacio">
          <p style={{ margin: 0 }}>
            {vacio || 'Todavía no hay ninguna página migrada. Las páginas se van pasando de una en una: cada una que llega aquí se puede editar sin tocar código.'}
          </p>
        </div>
      )}

      <div className="pnl-rejilla">
        {paginas.map((p) => (
          <button
            key={p._archivo}
            type="button"
            onClick={() => abrir(p)}
            className="pnl-tarjeta"
          >
            <strong>{p.titulo}</strong>
            {p.ruta && <span className="pnl-meta">{p.ruta}</span>}
            <span className="pnl-nota">
              {p.pregunta || `${(p.campos || []).length} ${(p.campos || []).length === 1 ? 'campo' : 'campos'} editables`}
            </span>
            {sinEscribir(p) > 0 && (
              <span className="pnl-pendiente">{sinEscribir(p)} sin escribir</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
