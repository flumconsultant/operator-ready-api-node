import React from 'react';
import * as api from './api.js';
import { Boton, Aviso, marco } from './piezas.jsx';

/**
 * Editar contenido con listas dentro: industrias, servicios, el método.
 *
 * ---- Por qué esto no sabe qué es una industria ----
 *
 * Lo dice el esquema, que vive en el repositorio. Este módulo lee la
 * declaración —qué campos hay, de qué tipo, con qué límite— y dibuja lo que
 * corresponda. Añadir servicios al panel no es tocar este archivo: es escribir
 * un esquema.
 *
 * Y hay una consecuencia de seguridad que importa más que la comodidad: el
 * navegador nunca dice qué archivo escribir. Dice qué esquema usar, y el
 * esquema —que solo cambia con un commit— dice a qué archivo apunta. Un panel
 * que acepta rutas del navegador es un panel que puede escribir donde le pidan.
 *
 * ---- Cinco formas y ni una más ----
 *
 * línea, párrafo, lista, pares, tríos y bloque. Salieron de mirar el contenido
 * real, no de imaginar lo que podría hacer falta: las seis industrias en dos
 * idiomas no usan ninguna otra. Cuando aparezca una séptima forma se añade;
 * inventarlas antes es construir un editor para contenido que no existe.
 */

const contar = (largo, tope) => {
  if (!tope) return null;
  const queda = tope - largo;
  if (queda < 0) return { color: '#A32B20', texto: `${largo}/${tope} · sobran ${-queda}` };
  if (queda <= tope * 0.1) return { color: '#8A5A00', texto: `${largo}/${tope}` };
  return { color: 'var(--text-faint)', texto: `${largo}/${tope}` };
};

const campoBase = {
  width: '100%', boxSizing: 'border-box', padding: '9px 11px',
  font: 'var(--type-body)', fontSize: 15, lineHeight: 1.5,
  color: 'var(--text-heading)', background: 'var(--white)',
  border: '1px solid var(--border-hairline)', borderRadius: 2, resize: 'vertical',
};

function Entrada({ valor, tope, filas, alCambiar, marcador }) {
  const c = contar(String(valor ?? '').length, tope);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      {filas ? (
        <textarea rows={filas} value={valor ?? ''} placeholder={marcador} onChange={(e) => alCambiar(e.target.value)} style={campoBase} />
      ) : (
        <input type="text" value={valor ?? ''} placeholder={marcador} onChange={(e) => alCambiar(e.target.value)} style={campoBase} />
      )}
      {c && <span style={{ font: 'var(--type-mono)', fontSize: 11, color: c.color, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.texto}</span>}
    </div>
  );
}

/* Una lista con sus botones. Reordenar existe porque el orden ES contenido:
   la primera oportunidad de una industria es la que más gente lee. */
function Filas({ filas, columnas, topes, alCambiar }) {
  const anchura = columnas.length;
  const vacia = () => Array.from({ length: anchura }, () => '');
  const cambiar = (i, k, v) => {
    const n = filas.map((f, j) => (j === i ? f.map((x, l) => (l === k ? v : x)) : f));
    alCambiar(n);
  };
  const mover = (i, d) => {
    if (i + d < 0 || i + d >= filas.length) return;
    const n = [...filas];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    alCambiar(n);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {filas.map((f, i) => (
        <div key={i} style={{ border: marco.linea, borderRadius: 2, padding: 10, background: 'var(--off-white)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{i + 1}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Boton onClick={() => mover(i, -1)} disabled={i === 0}>↑</Boton>
              <Boton onClick={() => mover(i, 1)} disabled={i === filas.length - 1}>↓</Boton>
              <Boton variante="peligro" onClick={() => alCambiar(filas.filter((_, j) => j !== i))}>Quitar</Boton>
            </div>
          </div>
          {columnas.map((col, k) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{col}</span>
              <Entrada valor={f[k]} tope={topes[k]} filas={topes[k] > 120 ? 3 : 0} alCambiar={(v) => cambiar(i, k, v)} />
            </div>
          ))}
        </div>
      ))}
      <div><Boton onClick={() => alCambiar([...filas, vacia()])}>Añadir</Boton></div>
    </div>
  );
}

function Campo({ campo, valor, alCambiar }) {
  const { tipo, rotulo, ayuda, maximo } = campo;
  const cuerpo = () => {
    if (tipo === 'linea') return <Entrada valor={valor} tope={maximo} alCambiar={alCambiar} />;
    if (tipo === 'parrafo') return <Entrada valor={valor} tope={maximo} filas={4} alCambiar={alCambiar} />;
    if (tipo === 'lista') {
      const filas = (valor || []).map((x) => [x]);
      return <Filas filas={filas} columnas={['Texto']} topes={[maximo]} alCambiar={(n) => alCambiar(n.map((f) => f[0]))} />;
    }
    if (tipo === 'pares' || tipo === 'trios') {
      const cols = campo.columnas || (tipo === 'pares' ? ['Uno', 'Dos'] : ['Uno', 'Dos', 'Tres']);
      const topes = Array.isArray(maximo) ? maximo : cols.map(() => maximo);
      return <Filas filas={valor || []} columnas={cols} topes={topes} alCambiar={alCambiar} />;
    }
    if (tipo === 'bloque') {
      const v = valor || {};
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, border: marco.linea, borderRadius: 2, padding: 10, background: 'var(--off-white)' }}>
          {(campo.partes || []).map((p) => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{p.rotulo}</span>
              <Entrada valor={v[p.id]} tope={p.maximo} filas={p.tipo === 'parrafo' ? 4 : 0} alCambiar={(x) => alCambiar({ ...v, [p.id]: x })} />
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' }}>
        <strong style={{ font: 'var(--type-body)', fontSize: 14, color: 'var(--text-heading)' }}>{rotulo}</strong>
        {campo.opcional && <span style={{ font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-faint)' }}>opcional</span>}
      </div>
      {ayuda && <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.45 }}>{ayuda}</p>}
      {cuerpo()}
    </div>
  );
}

export default function Contenido() {
  const [esquemas, setEsquemas] = React.useState([]);
  const [abierto, setAbierto] = React.useState(null);   // { esquema, datos }
  const [indice, setIndice] = React.useState(0);
  const [idioma, setIdioma] = React.useState('es');
  const [valores, setValores] = React.useState({});
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');
  const [nota, setNota] = React.useState('');
  const [guardando, setGuardando] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try { const d = await api.listarEsquemas(); setEsquemas(d.esquemas || []); }
      catch (e) { setError(e.message); }
      finally { setCargando(false); }
    })();
  }, []);

  const cargarValores = (datos, esquema, i, lang) => {
    const fuente = esquema.coleccion ? datos[i]?.[lang] : datos[lang];
    setValores(Object.fromEntries(esquema.campos.map((c) => [c.id, structuredClone(fuente?.[c.id] ?? (c.tipo === 'lista' || c.tipo === 'pares' || c.tipo === 'trios' ? [] : c.tipo === 'bloque' ? {} : ''))])));
  };

  const abrir = async (id) => {
    setError(''); setNota(''); setCargando(true);
    try {
      const d = await api.abrirEsquema(id);
      setAbierto({ esquema: d.esquema, datos: d.datos });
      setIndice(0); setIdioma(d.esquema.idiomas?.[0] || 'es');
      cargarValores(d.datos, d.esquema, 0, d.esquema.idiomas?.[0] || 'es');
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  };

  const cambiarElemento = (i) => { setIndice(i); cargarValores(abierto.datos, abierto.esquema, i, idioma); setNota(''); };
  const cambiarIdioma = (l) => { setIdioma(l); cargarValores(abierto.datos, abierto.esquema, indice, l); setNota(''); };

  const guardar = async () => {
    setGuardando(true); setError(''); setNota('');
    try {
      const d = await api.guardarContenido({ esquema: abierto.esquema.id, indice, idioma, valores });
      if (d.sin_cambios) setNota('No había nada que cambiar.');
      else {
        setNota(`Guardado. ${d.cambiados === 1 ? 'Un campo' : `${d.cambiados} campos`}. Estará en la web cuando termine el despliegue.`);
        const r = await api.abrirEsquema(abierto.esquema.id);
        setAbierto({ esquema: r.esquema, datos: r.datos });
      }
    } catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  };

  if (!abierto) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>Contenido del sitio</h2>
        <Aviso tono="mal">{error}</Aviso>
        {cargando && <p style={{ color: 'var(--text-faint)' }}>Cargando…</p>}
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {esquemas.map((e) => (
            <button key={e.id} type="button" onClick={() => abrir(e.id)}
              style={{ textAlign: 'left', cursor: 'pointer', background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16, display: 'flex', flexDirection: 'column', gap: 4, font: 'inherit', color: 'inherit' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-heading)' }}>{e.titulo}</strong>
              <span style={{ font: 'var(--type-body)', fontSize: 13, color: 'var(--text-faint)' }}>{e.campos} campos editables</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const { esquema, datos } = abierto;
  const elementos = esquema.coleccion ? datos : [datos];
  const nombre = (el, i) => el?.[idioma]?.[esquema.etiqueta] || el?.es?.[esquema.etiqueta] || `Elemento ${i + 1}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>{esquema.titulo}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Boton onClick={() => setAbierto(null)} disabled={guardando}>Volver</Boton>
          <Boton variante="fuerte" onClick={guardar} disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</Boton>
        </div>
      </div>

      <Aviso tono="mal">{error}</Aviso>
      <Aviso tono="bien">{nota}</Aviso>

      {/* Elegir qué se edita. Se guarda un elemento y un idioma cada vez: un
          botón que guardara los doce a la vez convertiría un error pequeño en
          doce errores. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {esquema.coleccion && (
          <select value={indice} onChange={(e) => cambiarElemento(Number(e.target.value))} style={{ ...campoBase, width: 'auto', maxWidth: '100%' }}>
            {elementos.map((el, i) => <option key={i} value={i}>{nombre(el, i)}</option>)}
          </select>
        )}
        {(esquema.idiomas || ['es']).map((l) => (
          <Boton key={l} variante={l === idioma ? 'fuerte' : 'quieto'} onClick={() => cambiarIdioma(l)}>{l.toUpperCase()}</Boton>
        ))}
      </div>

      <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 20, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {esquema.campos.map((c) => (
          <Campo key={c.id} campo={c} valor={valores[c.id]} alCambiar={(v) => setValores({ ...valores, [c.id]: v })} />
        ))}
      </div>
    </div>
  );
}
