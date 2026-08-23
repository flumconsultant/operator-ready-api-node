import React from 'react';
import { Boton } from './piezas.jsx';
import { IconoSubir, IconoBajar, IconoQuitar, IconoArriba, IconoAbajo, IconoNuevo } from './iconos.jsx';
import './panel.css';

/**
 * El formulario: cómo se dibuja un esquema y cómo se navega cuando es largo.
 *
 * ---- El problema que resuelve, que no es estético ----
 *
 * Editar una industria son veinte campos y treinta filas. En una pantalla de
 * 390 píxeles eso son varias pantallas de altura idéntica: nada dice dónde
 * estás ni cuánto falta, y el botón de guardar queda a un scroll largo de
 * donde estás escribiendo. Se sale de la página por cansancio, no por haber
 * terminado.
 *
 * Tres piezas lo arreglan, y ninguna es decoración:
 *
 *   · Las secciones. El esquema declara a qué sección pertenece cada campo, y
 *     el formulario se pliega por secciones con su cuenta de campos y de filas
 *     a la vista. Se abre la primera; el resto esperan.
 *   · El índice fijo. Una tira de secciones arriba que dice en cuál estás y
 *     lleva a cualquier otra sin recorrer lo que hay en medio.
 *   · La barra de publicar abajo. Siempre bajo el pulgar, y apagada mientras
 *     no haya nada que publicar: un botón que se puede pulsar sin que pase
 *     nada enseña a desconfiar del botón.
 *
 * Si un esquema no declara secciones, todo cae en una sola y el formulario se
 * comporta como antes. Añadir secciones a un esquema nuevo es escribirlas, no
 * tocar este archivo.
 *
 * ---- Quitar una fila es lo único que no se puede deshacer desde aquí ----
 *
 * Reordenar se arregla reordenando. Escribir de más se arregla borrando. Pero
 * quitar una fila de doce oportunidades borra un texto escrito a mano, y en un
 * teléfono el dedo falla. Por eso quitar pregunta, y al preguntar ENSEÑA el
 * texto que se va a perder: una confirmación que no dice qué se borra es una
 * confirmación que se acepta sin leer.
 */

/* El contador avisa ANTES del tope, no cuando ya se pasó: un título que se
   corta en Google solo se descubre publicado. */
export const contar = (largo, tope) => {
  if (!tope) return null;
  const queda = tope - largo;
  if (queda < 0) return { clase: ' pnl-cuenta--pasa', texto: `${largo}/${tope}`, exceso: -queda };
  if (queda <= tope * 0.1) return { clase: ' pnl-cuenta--cerca', texto: `${largo}/${tope}` };
  return { clase: '', texto: `${largo}/${tope}` };
};

function Entrada({ valor, tope, filas, alCambiar, marcador, mono }) {
  const c = contar(String(valor ?? '').length, tope);
  const pasa = c?.exceso > 0;
  const clase = `pnl-entrada${pasa ? ' pnl-entrada--pasa' : ''}${mono ? ' pnl-entrada--mono' : ''}`;
  return (
    <div className="pnl-columna">
      {filas ? (
        <textarea className={clase} rows={filas} value={valor ?? ''} placeholder={marcador} onChange={(e) => alCambiar(e.target.value)} />
      ) : (
        <input className={clase} type="text" value={valor ?? ''} placeholder={marcador} onChange={(e) => alCambiar(e.target.value)} />
      )}
      {c && <span className={`pnl-cuenta${c.clase}`}>{c.texto}</span>}
      {/* La consecuencia, escrita. Un número en rojo dice que algo va mal; no
          dice qué pasa si se deja así. Y no se bloquea la escritura: quien
          está redactando necesita poder pasarse y luego recortar. */}
      {pasa && (
        <p className="pnl-consecuencia">
          {c.exceso === 1 ? 'Sobra un carácter' : `Sobran ${c.exceso} caracteres`}. Con este texto el servidor no lo va a guardar.
        </p>
      )}
    </div>
  );
}

/* Una lista con sus botones. Reordenar existe porque el orden ES contenido:
   la primera oportunidad de una industria es la que más gente lee. */
function Filas({ filas, columnas, topes, alCambiar }) {
  const [confirmar, setConfirmar] = React.useState(null);
  const anchura = columnas.length;
  const vacia = () => Array.from({ length: anchura }, () => '');
  const cambiar = (i, k, v) => {
    alCambiar(filas.map((f, j) => (j === i ? f.map((x, l) => (l === k ? v : x)) : f)));
  };
  const mover = (i, d) => {
    if (i + d < 0 || i + d >= filas.length) return;
    const n = [...filas];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    alCambiar(n);
  };
  const quitar = (i) => { setConfirmar(null); alCambiar(filas.filter((_, j) => j !== i)); };

  return (
    <div className="pnl-filas">
      {filas.map((f, i) => (
        <div key={i} className="pnl-fila">
          <div className="pnl-fila-cab">
            <span className="pnl-fila-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="pnl-fila-mandos">
              {/* El rótulo va en el botón: el icono va solo, y un control sin
                  nombre no se puede usar con un lector de pantalla. */}
              <Boton menudo onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir el elemento ${i + 1}`}><IconoSubir /></Boton>
              <Boton menudo onClick={() => mover(i, 1)} disabled={i === filas.length - 1} aria-label={`Bajar el elemento ${i + 1}`}><IconoBajar /></Boton>
              {/* Separado del par de reordenar: los tres controles que más daño
                  hacen no deberían compartir el mismo centímetro de pantalla. */}
              <span className="pnl-fila-corte" aria-hidden="true" />
              <Boton menudo variante="peligro" onClick={() => setConfirmar(i)} aria-label={`Quitar el elemento ${i + 1}`}><IconoQuitar /></Boton>
            </div>
          </div>
          {columnas.map((col, k) => (
            <div key={k} className="pnl-columna">
              <span className="pnl-columna-rotulo">{col}</span>
              <Entrada valor={f[k]} tope={topes[k]} filas={topes[k] > 120 ? 3 : 0} alCambiar={(v) => cambiar(i, k, v)} />
            </div>
          ))}
        </div>
      ))}
      <div><Boton onClick={() => alCambiar([...filas, vacia()])}><IconoNuevo />Añadir fila</Boton></div>

      {confirmar != null && (
        <div className="pnl-hoja" role="dialog" aria-modal="true" aria-label="Quitar esta fila">
          <div className="pnl-hoja-fondo" onClick={() => setConfirmar(null)} />
          <div className="pnl-hoja-caja">
            <h3 className="pnl-hoja-titulo">Quitar esta fila</h3>
            <blockquote className="pnl-hoja-cita">
              {(filas[confirmar] || []).filter(Boolean).join(' · ') || '(la fila está vacía)'}
            </blockquote>
            <p className="pnl-ayuda">
              No se puede deshacer desde aquí. Queda en el historial de versiones del repositorio.
            </p>
            <div className="pnl-hoja-mandos">
              <Boton onClick={() => setConfirmar(null)}>Cancelar</Boton>
              <Boton variante="peligro" onClick={() => quitar(confirmar)}>Quitar</Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Campo({ campo, valor, alCambiar }) {
  const { tipo, rotulo, ayuda, maximo } = campo;
  const cuerpo = () => {
    if (tipo === 'linea') return <Entrada valor={valor} tope={maximo} mono={campo.mono} alCambiar={alCambiar} />;
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
        <div className="pnl-fila">
          {(campo.partes || []).map((p) => (
            <div key={p.id} className="pnl-columna">
              <span className="pnl-columna-rotulo">{p.rotulo}</span>
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
    <div className="pnl-campo" id={`campo-${campo.id}`}>
      <div className="pnl-campo-cab">
        <strong className="pnl-rotulo">{rotulo}</strong>
        {campo.opcional && <span className="pnl-opcional">opcional</span>}
      </div>
      {ayuda && <p className="pnl-ayuda">{ayuda}</p>}
      {cuerpo()}
    </div>
  );
}

/* Cuántas filas hay dentro de una sección. Es lo que de verdad mide el trabajo
   pendiente: cuatro campos con doce filas dentro no son cuatro campos. */
const filasDe = (campos, valores) => campos.reduce((n, c) => {
  const v = valores[c.id];
  if (Array.isArray(v)) return n + v.length;
  if (c.tipo === 'bloque' && v && typeof v === 'object') {
    return n + Object.values(v).reduce((m, x) => m + (Array.isArray(x) ? x.length : 0), 0);
  }
  return n;
}, 0);

export const agrupar = (campos) => {
  const orden = [];
  const dentro = new Map();
  for (const c of campos) {
    const s = c.seccion || 'Contenido';
    if (!dentro.has(s)) { dentro.set(s, []); orden.push(s); }
    dentro.get(s).push(c);
  }
  return orden.map((titulo, i) => ({ id: `sec-${i}`, titulo, campos: dentro.get(titulo) }));
};

/**
 * El formulario entero: índice arriba, secciones plegables debajo.
 *
 * Se vuelve a montar cuando cambia `firma` —otro elemento, otro idioma—, y con
 * ella vuelve el estado de plegado. Conservarlo entre elementos sonaba cómodo
 * hasta probarlo: al cambiar de industria quedaban abiertas las secciones de
 * la anterior, que no son las mismas que hacen falta ahora.
 */
export function Formulario({ campos, valores, alCambiar }) {
  const secciones = React.useMemo(() => agrupar(campos), [campos]);
  const solaSeccion = secciones.length < 2;
  const [abiertas, setAbiertas] = React.useState(() => new Set(secciones.slice(0, 1).map((s) => s.id)));
  const [visible, setVisible] = React.useState(secciones[0]?.id);
  const cajas = React.useRef({});

  /* Qué sección se está mirando, para marcarla en el índice. Se observa la
     cabecera de cada sección y no el bloque entero: un bloque de treinta filas
     ocupa la pantalla entera y estaría «visible» a la vez que el siguiente. */
  React.useEffect(() => {
    const nodos = Object.values(cajas.current).filter(Boolean);
    if (!nodos.length || typeof IntersectionObserver !== 'function') return undefined;
    const ojo = new IntersectionObserver((entradas) => {
      const dentro = entradas.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (dentro) setVisible(dentro.target.dataset.seccion);
    }, { rootMargin: '-96px 0px -60% 0px' });
    nodos.forEach((n) => ojo.observe(n));
    return () => ojo.disconnect();
  }, [secciones]);

  const ir = (id) => {
    setAbiertas((s) => new Set(s).add(id));
    const quieto = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      cajas.current[id]?.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'start' });
    });
  };

  const alternar = (id) => setAbiertas((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <div className="pnl-formulario">
      {!solaSeccion && (
        <nav className="pnl-indice" aria-label="Secciones de este formulario">
          {secciones.map((s) => (
            <button key={s.id} type="button" className="pnl-chip" aria-current={s.id === visible ? 'true' : undefined} onClick={() => ir(s.id)}>
              {s.titulo}
            </button>
          ))}
        </nav>
      )}

      {secciones.map((s) => {
        const abierta = solaSeccion || abiertas.has(s.id);
        const filas = filasDe(s.campos, valores);
        return (
          <section key={s.id} className="pnl-seccion" ref={(n) => { cajas.current[s.id] = n; }} data-seccion={s.id}>
            {!solaSeccion && (
              <button type="button" className="pnl-seccion-cab" aria-expanded={abierta} onClick={() => alternar(s.id)}>
                <span className="pnl-seccion-titulo">{s.titulo}</span>
                <span className="pnl-seccion-cuenta">
                  {s.campos.length} {s.campos.length === 1 ? 'campo' : 'campos'}
                  {filas > 0 && ` · ${filas} ${filas === 1 ? 'fila' : 'filas'}`}
                </span>
                <span className="pnl-seccion-flecha">{abierta ? <IconoArriba /> : <IconoAbajo />}</span>
              </button>
            )}
            {abierta && (
              <div className="pnl-panel">
                {s.campos.map((c) => (
                  <Campo key={c.id} campo={c} valor={valores[c.id]} alCambiar={(v) => alCambiar(c.id, v)} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

/**
 * La barra de publicar. Fija abajo, donde está el pulgar.
 *
 * Dice «Publicar» y no «Guardar» porque aquí guardar ES publicar: no hay
 * borrador intermedio ni una segunda pantalla donde revisar. Y explica la
 * demora, porque un cambio que tarda minutos en verse, sin explicación, se
 * lee como un fallo y se vuelve a pulsar: dos versiones en el historial por
 * un texto que solo se cambió una vez.
 */
export function BarraPublicar({ sucio, guardando, problemas = 0, onPublicar, etiqueta = 'Publicar cambios' }) {
  const parado = guardando || !sucio || problemas > 0;
  const texto = guardando ? 'Publicando…'
    : problemas > 0 ? `Revisa ${problemas === 1 ? 'un campo' : `${problemas} campos`}`
    : !sucio ? 'No hay cambios que publicar'
    : etiqueta;
  return (
    <div className="pnl-publicar">
      <Boton variante="fuerte" ancho onClick={onPublicar} disabled={parado}>{texto}</Boton>
      <p className="pnl-publicar-nota">
        {guardando
          ? 'Se está guardando la versión. El sitio se compila después: tarda unos minutos y termina solo.'
          : 'Publicar guarda la versión y lanza el despliegue. Tarda unos minutos en verse en la web.'}
      </p>
    </div>
  );
}
