import React from 'react';
import * as api from './api.js';
import { Boton, Aviso, marco } from './piezas.jsx';
import { Campo } from './Contenido.jsx';

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

/* El editor de campos es el del módulo de Contenido: sabe dibujar líneas,
   párrafos, listas y tablas, que es lo que llevan los documentos de
   conocimiento. Tener dos editores era tener dos sitios donde el contador
   puede decir un número distinto del límite que aplica el servidor. */

export default function Paginas({ alCerrar, carpeta = 'paginas', titulo = 'Páginas del sitio', vacio }) {
  const [paginas, setPaginas] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [abierta, setAbierta] = React.useState(null);
  const [valores, setValores] = React.useState({});
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
    setValores(Object.fromEntries((p.campos || []).map((c) => [
      c.id,
      structuredClone(c.valor ?? (['lista','pares','trios','tupla'].includes(c.tipo) ? [] : '')),
    ])));
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
        setNota(`Guardado. ${d.cambiados === 1 ? 'Un campo' : `${d.cambiados} campos`}. Estará en la web en unos minutos, cuando termine el despliegue.`);
        await cargar();
      }
    } catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  };

  if (abierta) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
              {abierta.titulo}
            </h2>
            <p style={{ margin: '2px 0 0', font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>{abierta.ruta || abierta.pregunta}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Boton onClick={() => setAbierta(null)} disabled={guardando}>Volver</Boton>
            <Boton variante="fuerte" onClick={guardar} disabled={guardando || problemas.length > 0}>
              {guardando ? 'Guardando…' : 'Guardar y publicar'}
            </Boton>
          </div>
        </div>

        <Aviso tono="mal">{error}</Aviso>
        <Aviso tono="bien">{nota}</Aviso>
        {problemas.length > 0 && (
          <Aviso tono="mal">
            {problemas.map((c) => c.rotulo).join(' · ')} — revisa {problemas.length === 1 ? 'ese campo' : 'esos campos'} antes de guardar.
          </Aviso>
        )}

        <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 20, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {(abierta.campos || []).map((c) => (
            <Campo key={c.id} campo={c} valor={valores[c.id]} alCambiar={(v) => setValores({ ...valores, [c.id]: v })} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
          {titulo}
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Boton onClick={cargar} disabled={cargando}>{cargando ? 'Cargando…' : 'Recargar'}</Boton>
          {alCerrar && <Boton onClick={alCerrar}>Cerrar</Boton>}
        </div>
      </div>

      <Aviso tono="mal">{error}</Aviso>

      {!cargando && paginas.length === 0 && (
        <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 24 }}>
          <p style={{ margin: 0, color: 'var(--text-faint)' }}>
            {vacio || 'Todavía no hay ninguna página migrada. Las páginas se van pasando de una en una: cada una que llega aquí se puede editar sin tocar código.'}
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {paginas.map((p) => (
          <button
            key={p._archivo}
            type="button"
            onClick={() => abrir(p)}
            style={{
              textAlign: 'left', cursor: 'pointer', background: marco.papel,
              border: marco.linea, borderRadius: 2, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 4, font: 'inherit', color: 'inherit',
            }}
          >
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-heading)' }}>{p.titulo}</strong>
            {p.ruta && <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>{p.ruta}</span>}
            <span style={{ font: 'var(--type-body)', fontSize: 13, color: 'var(--text-faint)', marginTop: 4 }}>
              {p.pregunta || `${(p.campos || []).length} ${(p.campos || []).length === 1 ? 'campo' : 'campos'} editables`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
