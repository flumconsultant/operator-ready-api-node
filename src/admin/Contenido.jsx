import React from 'react';
import * as api from './api.js';
import { Boton, Aviso } from './piezas.jsx';
import { Formulario, BarraPublicar, AvanceElemento, VistaGoogle } from './Formulario.jsx';
import { avance } from './avance.js';
import './panel.css';

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

export default function Contenido() {
  const [esquemas, setEsquemas] = React.useState([]);
  const [abierto, setAbierto] = React.useState(null);   // { esquema, datos, claves }
  /* Los datos del OTRO idioma, solo para saber qué está traducido. No se editan
     desde aquí: se piden una vez al abrir el esquema y sirven para pintar las
     pastillas ES/EN de la lista. Sin ellos, «sin traducir» sería una suposición,
     y un filtro que supone es un filtro que esconde trabajo real. */
  const [otros, setOtros] = React.useState(null);
  const [filtro, setFiltro] = React.useState('todas');
  /* Tres niveles y no dos: esquemas → elementos → editor. Antes el elemento se
     elegía en un desplegable dentro del editor, y un desplegable de doce
     nombres no dice cuál de los doce está a medias: hay que abrirlos uno a uno
     para descubrirlo. La lista lo dice sin entrar en ninguno. */
  const [enLista, setEnLista] = React.useState(true);
  const [busca, setBusca] = React.useState('');
  const [clave, setClave] = React.useState('');
  const [idioma, setIdioma] = React.useState('es');
  const [valores, setValores] = React.useState({});
  /* La copia de lo que había al abrir. Sin ella no se puede saber si hay algo
     que publicar, y un botón que siempre se puede pulsar acaba pulsándose por
     si acaso: dos versiones en el historial por un texto que nadie cambió. */
  const [inicial, setInicial] = React.useState({});
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
    const v = Object.fromEntries(esquema.campos.map((c) => [c.id, structuredClone(fuente?.[c.id] ?? (['lista','pares','trios','tupla'].includes(c.tipo) ? [] : c.tipo === 'bloque' ? {} : ''))]));
    setValores(v);
    setInicial(structuredClone(v));
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
      setIdioma(d.idioma); setClave(elegida); setEnLista(lista.length > 1);
      cargarValores(d.datos, d.esquema, elegida, d.idioma);

      /* El otro idioma, en segundo plano y sin bloquear nada. Si falla, las
         pastillas se quedan sin pintar y el resto del panel funciona igual:
         saber qué está traducido es útil, no imprescindible. */
      const otroIdioma = (d.esquema.idiomas || []).find((x) => x !== d.idioma);
      if (otroIdioma) {
        api.abrirEsquema(id, otroIdioma)
          .then((o) => setOtros({ idioma: otroIdioma, datos: o.datos, esquema: o.esquema, claves: o.claves || [] }))
          .catch(() => setOtros(null));
      } else setOtros(null);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  };

  const cambiarElemento = (cl) => { setClave(cl); setEnLista(false); cargarValores(abierto.datos, abierto.esquema, cl, idioma); setNota(''); };
  const cambiarIdioma = (l) => abrir(abierto.esquema.id, l, abierto.claves.findIndex((k) => k.clave === clave));

  const guardar = async () => {
    setGuardando(true); setError(''); setNota('');
    try {
      const d = await api.guardarContenido({ esquema: abierto.esquema.id, clave, idioma, valores });
      if (d.sin_cambios) setNota('No había nada que cambiar.');
      else {
        setNota(`Publicado. ${d.cambiados === 1 ? 'Un campo' : `${d.cambiados} campos`}. Estará en la web en unos minutos, cuando termine el despliegue.`);
        const r = await api.abrirEsquema(abierto.esquema.id, idioma);
        setAbierto({ esquema: r.esquema, datos: r.datos, claves: r.claves || [] });
        cargarValores(r.datos, r.esquema, clave, idioma);
      }
    } catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  };

  if (!abierto) {
    return (
      <div className="pnl-lienzo" style={{ padding: 0 }}>
        <h2 className="pnl-titulo">Contenido del sitio</h2>
        <Aviso tono="mal">{error}</Aviso>
        {cargando && <p className="pnl-ayuda">Cargando…</p>}
        <div className="pnl-rejilla">
          {esquemas.map((e) => (
            <button key={e.id} type="button" className="pnl-tarjeta" onClick={() => abrir(e.id)}>
              <strong>{e.titulo}</strong>
              <span className="pnl-nota">{e.campos} campos editables</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const { esquema, claves } = abierto;

  /* El avance de cada elemento, en los dos idiomas.
   *
   * Se cuenta aquí y no en el servidor porque los datos del esquema ya están
   * descargados enteros: pedir una cifra que se puede calcular con lo que ya
   * hay en memoria es una petición de red por cada fila de la lista.
   *
   * La correspondencia con el otro idioma es por POSICIÓN, no por clave. Es la
   * misma razón que ya está escrita más arriba: «escalar-ia» y
   * «scale-ai-beyond-pilots» son el mismo elemento con dos direcciones. */
  const resumen = claves.map((k, i) => {
    const propio = avance(esquema.campos, dentro(abierto.datos, esquema, k.clave, idioma) || {});
    const otroClave = otros?.claves?.[i]?.clave;
    const otro = otros && otroClave != null
      ? avance(esquema.campos, dentro(otros.datos, otros.esquema, otroClave, otros.idioma) || {})
      : null;
    return { ...k, i, propio, otro };
  });

  if (enLista && claves.length > 1) {
    const norm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const visibles = resumen.filter((r) => {
      if (busca && !norm(r.nombre).includes(norm(busca))) return false;
      if (filtro === 'sinescribir') return r.propio.escritos < r.propio.total;
      if (filtro === 'sintraducir') return r.otro && r.otro.escritos < r.otro.total;
      return true;
    });

    return (
      <div className="pnl-lienzo" style={{ padding: 0 }}>
        <div className="pnl-barra">
          <h2 className="pnl-titulo">{esquema.titulo}</h2>
          <div className="pnl-acciones">
            <Boton onClick={() => setAbierto(null)}>Volver</Boton>
          </div>
        </div>

        <Aviso tono="mal">{error}</Aviso>
        <Aviso tono="bien">{nota}</Aviso>

        <input
          className="pnl-entrada"
          type="search"
          placeholder={`Buscar en ${esquema.titulo.toLowerCase()}`}
          aria-label={`Buscar en ${esquema.titulo}`}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ marginBottom: 'var(--pnl-3)' }}
        />

        {/* Los filtros son los dos estados que provocan trabajo. «Todas» está
            porque un filtro del que no se puede salir es una trampa. El de
            «sin traducir» solo aparece si el esquema tiene dos idiomas: un
            filtro que siempre devuelve la lista entera enseña a no usarlos. */}
        <div className="pnl-indice" style={{ position: 'static', margin: '0 0 var(--pnl-4)', borderBottom: 0, padding: 0 }}>
          {[['todas', 'Todas'], ['sinescribir', 'Sin escribir'], ...(otros ? [['sintraducir', 'Sin traducir']] : [])].map(([id, rotulo]) => (
            <button key={id} type="button" className="pnl-chip" aria-current={filtro === id ? 'true' : undefined} onClick={() => setFiltro(id)}>
              {rotulo}
            </button>
          ))}
        </div>

        {visibles.length === 0 && (
          <p className="pnl-ayuda">Nada que enseñar con este filtro.</p>
        )}

        <div className="pnl-filas">
          {visibles.map((r) => (
            <button key={r.clave} type="button" className="pnl-fila-elem" onClick={() => cambiarElemento(r.clave)}>
              <span className="pnl-anillo" style={{ background: `conic-gradient(var(--pnl-verde) ${r.propio.pct}%, var(--pnl-linea) 0)` }} aria-hidden="true">
                <span>{r.propio.pct}</span>
              </span>
              <span className="pnl-fila-texto">
                <strong>{r.nombre}</strong>
                <span className="pnl-fila-meta">
                  {r.propio.escritos === r.propio.total
                    ? `${r.propio.total} campos escritos`
                    : `${r.propio.escritos} de ${r.propio.total} campos`}
                </span>
              </span>
              {/* Las pastillas dicen si ese idioma está completo. Van con su
                  rótulo accesible porque «ES» apagado y «ES» encendido son la
                  misma palabra para quien no ve el contraste. */}
              <span className="pnl-idiomas">
                <span className="pnl-idioma" data-hecho={r.propio.escritos === r.propio.total || undefined}>
                  {idioma.toUpperCase()}
                </span>
                {r.otro && (
                  <span className="pnl-idioma" data-hecho={r.otro.escritos === r.otro.total || undefined}>
                    {otros.idioma.toUpperCase()}
                  </span>
                )}
              </span>
              <span className="pnl-sr">
                {r.propio.escritos === r.propio.total ? `Completo en ${idioma.toUpperCase()}.` : `Falta contenido en ${idioma.toUpperCase()}.`}
                {r.otro && (r.otro.escritos === r.otro.total ? ` Completo en ${otros.idioma.toUpperCase()}.` : ` Falta contenido en ${otros.idioma.toUpperCase()}.`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const sucio = JSON.stringify(valores) !== JSON.stringify(inicial);

  /* Lo que impide publicar, dicho antes de intentarlo. El servidor lo vuelve a
     comprobar —nunca se confía en el navegador— pero enterarse por un error
     del servidor es enterarse después de haber pulsado. */
  const problemas = esquema.campos.filter((c) => {
    const v = valores[c.id];
    return typeof v === 'string' && typeof c.maximo === 'number' && v.length > c.maximo;
  });

  return (
    <div className="pnl-lienzo pnl-lienzo--publica" style={{ padding: 0 }}>
      <div className="pnl-barra">
        <h2 className="pnl-titulo">{esquema.titulo}</h2>
        <div className="pnl-acciones">
          <Boton onClick={() => (claves.length > 1 ? setEnLista(true) : setAbierto(null))} disabled={guardando}>Volver</Boton>
        </div>
      </div>

      <Aviso tono="mal">{error}</Aviso>
      <Aviso tono="bien">{nota}</Aviso>
      {problemas.length > 0 && (
        <Aviso tono="mal">
          {problemas.map((c) => c.rotulo).join(' · ')} — {problemas.length === 1 ? 'ese campo pasa' : 'esos campos pasan'} de su límite.
        </Aviso>
      )}

      {/* Elegir qué se edita. Se guarda un elemento y un idioma cada vez: un
          botón que guardara los doce a la vez convertiría un error pequeño en
          doce errores. */}
      <div className="pnl-acciones">
        {/* Segmentado y no dos botones: el activo se distingue por superficie,
            no por el verde, que está reservado para la acción principal. */}
        <div className="pnl-segmento" role="group" aria-label="Idioma que se edita">
          {(esquema.idiomas || ['es']).map((l) => (
            <button key={l} type="button" aria-pressed={l === idioma} onClick={() => cambiarIdioma(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <AvanceElemento
        campos={esquema.campos}
        valores={valores}
        sucio={sucio}
        titulo={claves.find((k) => k.clave === clave)?.nombre}
      />

      {/* Dos columnas a partir de 1320 px: el formulario y, a su derecha, la
          vista previa de Google fija. Por debajo de ese ancho la vista previa
          viaja dentro del formulario, encima de los campos: en el móvil no hay
          sitio para una segunda columna, y bajarla al final la dejaría fuera de
          la pantalla justo mientras se escribe el título. */}
      <div className="pnl-conlado">
        <div className="pnl-columna">
          <div className="pnl-serp--dentro">
            <VistaGoogle campos={esquema.campos} valores={valores} />
          </div>

          {/* La clave y el idioma en la firma: al cambiar de elemento el
              formulario se monta de nuevo y las secciones vuelven a su estado
              inicial. */}
          <Formulario
            key={`${esquema.id}·${clave}·${idioma}`}
            campos={esquema.campos}
            valores={valores}
            alCambiar={(id, v) => setValores((x) => ({ ...x, [id]: v }))}
          />
        </div>

        <aside className="pnl-lado" aria-label="Estado de esta página">
          <VistaGoogle campos={esquema.campos} valores={valores} />
          <div className="pnl-lado-estado">
            <p className="pnl-hoy-etiqueta">Estado de la página</p>
            <dl className="pnl-lado-lista">
              <div><dt>Campos escritos</dt><dd>{avance(esquema.campos, valores).escritos}/{avance(esquema.campos, valores).total}</dd></div>
              <div><dt>Idioma</dt><dd>{idioma.toUpperCase()}</dd></div>
              <div><dt>Sin publicar</dt><dd>{sucio ? 'sí' : 'no'}</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      <BarraPublicar sucio={sucio} guardando={guardando} problemas={problemas.length} onPublicar={guardar} />
    </div>
  );
}
