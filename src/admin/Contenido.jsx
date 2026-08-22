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
    if (tipo === 'pares' || tipo === 'trios' || tipo === 'tupla') {
      /* La anchura la dan las columnas declaradas y no el nombre del tipo: con
         «pares» y «trios» fijos, un campo de cinco columnas obligaba a inventar
         un tipo por cada anchura. */
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
              {/* Un bloque puede llevar una lista dentro: «el problema» es un
                  titular más varios párrafos. Se reutiliza el mismo editor de
                  filas en vez de inventar un tipo por combinación. */}
              {p.tipo === 'lista' ? (
                <Filas filas={(v[p.id] || []).map((x) => [x])} columnas={[p.rotulo]} topes={[p.maximo]}
                       alCambiar={(n) => alCambiar({ ...v, [p.id]: n.map((f) => f[0]) })} />
              ) : p.tipo === 'pares' || p.tipo === 'tupla' ? (
                <Filas filas={v[p.id] || []} columnas={p.columnas || ['Uno', 'Dos']}
                       topes={Array.isArray(p.maximo) ? p.maximo : (p.columnas || ['', '']).map(() => p.maximo)}
                       alCambiar={(n) => alCambiar({ ...v, [p.id]: n })} />
              ) : (
                <Entrada valor={v[p.id]} tope={p.maximo} filas={p.tipo === 'parrafo' ? 4 : 0} alCambiar={(x) => alCambiar({ ...v, [p.id]: x })} />
              )}
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
  const [abierto, setAbierto] = React.useState(null);   // { esquema, datos, claves }
  const [clave, setClave] = React.useState('');
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

  /* Dónde está el contenido de un elemento. Tres formas, y el esquema dice
     cuál: un mapa por slug, una colección con bloques por idioma dentro, o un
     solo bloque por idioma. La misma resolución que hace el servidor. */
  const dentro = (datos, esquema, cl, lang) => {
    const base = esquema.raiz ? datos?.[esquema.raiz] : datos;
    if (esquema.forma === 'mapa') return esquema.porIdiomaDentro ? base?.[cl]?.[lang] : base?.[cl];
    if (esquema.coleccion) return base?.[Number(cl)]?.[lang];
    return base?.[lang];
  };

  const cargarValores = (datos, esquema, cl, lang) => {
    const fuente = dentro(datos, esquema, cl, lang);
    setValores(Object.fromEntries(esquema.campos.map((c) => [c.id, structuredClone(fuente?.[c.id] ?? (['lista','pares','trios','tupla'].includes(c.tipo) ? [] : c.tipo === 'bloque' ? {} : ''))])));
  };

  /* El idioma se recarga contra el servidor, no se cambia en el navegador:
     servicios tiene un archivo por idioma, así que los datos del otro idioma
     sencillamente no están aquí. */
  /* Al cambiar de idioma se conserva la POSICIÓN, no la clave.
   *
   * Los casos de uso tienen slug distinto en cada idioma —«escalar-ia» y
   * «scale-ai-beyond-pilots» son el mismo caso— así que arrastrar la clave
   * dejaba el formulario entero vacío: se pedía un elemento que en ese archivo
   * no existe. Se vio probándolo: al pasar a inglés, de 32 campos quedaban 17.
   *
   * Los dos archivos listan los mismos elementos en el mismo orden, y de ahí
   * sale la correspondencia. Si algún día dejaran de coincidir en número, se
   * vuelve al primero en vez de adivinar. */
  const abrir = async (id, lang, posicion) => {
    setError(''); setNota(''); setCargando(true);
    try {
      const d = await api.abrirEsquema(id, lang);
      const lista = d.claves || [];
      const i = posicion != null && posicion >= 0 && posicion < lista.length ? posicion : 0;
      const elegida = lista[i]?.clave ?? '';
      setAbierto({ esquema: d.esquema, datos: d.datos, claves: lista });
      setIdioma(d.idioma); setClave(elegida);
      cargarValores(d.datos, d.esquema, elegida, d.idioma);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  };

  const cambiarElemento = (cl) => { setClave(cl); cargarValores(abierto.datos, abierto.esquema, cl, idioma); setNota(''); };
  const cambiarIdioma = (l) => abrir(abierto.esquema.id, l, abierto.claves.findIndex((k) => k.clave === clave));

  const guardar = async () => {
    setGuardando(true); setError(''); setNota('');
    try {
      const d = await api.guardarContenido({ esquema: abierto.esquema.id, clave, idioma, valores });
      if (d.sin_cambios) setNota('No había nada que cambiar.');
      else {
        setNota(`Guardado. ${d.cambiados === 1 ? 'Un campo' : `${d.cambiados} campos`}. Estará en la web cuando termine el despliegue.`);
        const r = await api.abrirEsquema(abierto.esquema.id, idioma);
        setAbierto({ esquema: r.esquema, datos: r.datos, claves: r.claves || [] });
        cargarValores(r.datos, r.esquema, clave, idioma);
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

  const { esquema, claves } = abierto;

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
        {claves.length > 1 && (
          <select value={clave} onChange={(e) => cambiarElemento(e.target.value)} style={{ ...campoBase, width: 'auto', maxWidth: '100%' }}>
            {claves.map((k) => <option key={k.clave} value={k.clave}>{k.nombre}</option>)}
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
