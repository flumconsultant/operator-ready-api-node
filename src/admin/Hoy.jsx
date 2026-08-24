import React from 'react';
import * as api from './api.js';
import { ICONO_MODULO } from './iconos.jsx';
import { Aviso } from './piezas.jsx';
import './panel.css';

/**
 * Hoy: la primera pantalla del panel.
 *
 * ---- Qué había antes ----
 *
 * Una lista de seis módulos. Correcta y muda: decía a dónde se puede ir y no
 * decía a dónde hay que ir. Quien administra esto entra desde el móvil, casi
 * siempre con una pregunta concreta —¿salió el artículo?, ¿qué falta por
 * escribir?— y la lista obligaba a entrar en dos o tres sitios para responderla.
 *
 * ---- Y por qué las cifras son las que son ----
 *
 * Todo lo que se enseña aquí sale de datos que el panel ya sabe. Ninguna cifra
 * es una estimación ni un porcentaje inventado para que la barra se vea bonita:
 * una pantalla de estado que miente una vez deja de mirarse para siempre, y
 * entonces vuelve a hacer falta entrar en los seis módulos.
 *
 * Por eso hay módulos con barra de avance y módulos sin ella. Conocimiento y
 * Páginas tienen campos exigibles que se pueden contar, así que su barra
 * significa algo. Autores o Suscriptores no: no existe «un autor al 60 %».
 * Dibujarles una barra al 100 % sería decoración, y una barra decorativa quita
 * autoridad a las dos que sí informan.
 */

const SALUDO = () => {
  const h = new Date().getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 13) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

/* El nombre de pila, con su mayúscula.
 *
 * La cuenta puede ser «carlos» o «carlos@meetbecome.com», y un saludo que dice
 * «Buenos días, carlos@meetbecome.com» —o «carlos» en minúscula— es lo que
 * distingue una pantalla escrita de una pantalla generada. */
const nombreCorto = (quien) => {
  const x = String(quien).split(/[@\s]/)[0].trim();
  return x ? x[0].toUpperCase() + x.slice(1) : '';
};

const FECHA = () => {
  try {
    return new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch { return ''; }
};

/* Cuántos campos de un documento están sin escribir. La misma definición que
   usa el módulo de Conocimiento; si un día cambia allí, cambia aquí. */
const sinEscribir = (p) => (p.campos || []).filter((c) => {
  const v = c.valor;
  if (Array.isArray(v)) return v.length === 0;
  if (v && typeof v === 'object') return Object.values(v).every((x) => !x || (Array.isArray(x) && !x.length));
  return !String(v ?? '').trim();
}).length;

const hoyISO = () => new Date().toISOString().slice(0, 10);

function Barra({ hechos, total }) {
  const pct = total ? Math.round((hechos / total) * 100) : 0;
  return (
    <div
      className="pnl-mod-barra"
      role="progressbar"
      aria-valuenow={hechos}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${hechos} de ${total}`}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Hoy({ quien, alIr }) {
  const [datos, setDatos] = React.useState(null);
  const [error, setError] = React.useState('');
  const [cargando, setCargando] = React.useState(true);

  React.useEffect(() => {
    let vivo = true;
    (async () => {
      /* En paralelo y tolerando fallos sueltos: si la base de datos de la lista
         de correo está caída, la pantalla tiene que enseñar igual el estado del
         artículo de hoy. Un `Promise.all` a secas dejaría la pantalla en blanco
         por el módulo que menos importa. */
      const [articulos, conocimiento, paginas, esquemas, suscriptores] = await Promise.all([
        api.listar().catch(() => null),
        api.listarPaginas('conocimiento').catch(() => null),
        api.listarPaginas('paginas').catch(() => null),
        api.listarEsquemas().catch(() => null),
        api.suscriptores().catch(() => null),
      ]);
      if (!vivo) return;
      if (!articulos && !conocimiento && !paginas) setError('No se pudo hablar con el servidor. Vuelve a entrar o recarga.');
      setDatos({ articulos, conocimiento, paginas, esquemas, suscriptores });
      setCargando(false);
    })();
    return () => { vivo = false; };
  }, []);

  const arts = datos?.articulos?.articulos || [];
  /* El más reciente por fecha, no el primero de la lista: el orden lo decide el
     servidor y no es el que importa aquí. */
  const ultimo = arts.slice().sort((a, b) => String(b.articulo?.fecha || '').localeCompare(String(a.articulo?.fecha || '')))[0];
  const deHoy = ultimo?.articulo?.fecha === hoyISO();
  const sinIngles = arts.filter((a) => !a.articulo?.en?.titulo).length;

  const docs = datos?.conocimiento?.paginas || [];
  const deudaConocimiento = docs.reduce((n, p) => n + sinEscribir(p), 0);
  const totalConocimiento = docs.reduce((n, p) => n + (p.campos || []).length, 0);

  const pags = datos?.paginas?.paginas || [];
  const deudaPaginas = pags.reduce((n, p) => n + sinEscribir(p), 0);
  const totalPaginas = pags.reduce((n, p) => n + (p.campos || []).length, 0);

  const modulos = [
    { id: 'articulos', nombre: 'Artículos', cifra: arts.length },
    { id: 'contenido', nombre: 'Contenido', cifra: (datos?.esquemas?.esquemas || []).length, unidad: 'esquemas' },
    { id: 'conocimiento', nombre: 'Conocimiento', cifra: `${totalConocimiento - deudaConocimiento}/${totalConocimiento}`, hechos: totalConocimiento - deudaConocimiento, total: totalConocimiento },
    { id: 'paginas', nombre: 'Páginas', cifra: `${totalPaginas - deudaPaginas}/${totalPaginas}`, hechos: totalPaginas - deudaPaginas, total: totalPaginas },
  ];

  return (
    <div className="pnl-hoy">
      <header className="pnl-hoy-cab">
        <p className="pnl-hoy-fecha">{FECHA()}</p>
        <h2 className="pnl-titulo">{SALUDO()}{quien ? `, ${nombreCorto(quien)}` : ''}</h2>
      </header>

      <Aviso tono="mal">{error}</Aviso>

      {/* El artículo del día. Es la pregunta que trae aquí a casi todo el
          mundo, así que va arriba y en una tarjeta propia.
       *
       * No hay cuenta atrás hasta la hora de publicación, y es deliberado: la
       * cadencia diaria la lleva una tarea programada fuera de este panel, así
       * que el panel no sabe a qué hora sale. Un reloj que cuenta hacia una
       * hora inventada es peor que no tener reloj. */}
      <section className="pnl-hoy-agente" aria-label="El artículo del agente">
        {cargando ? (
          <p className="pnl-hoy-esperando">Mirando qué escribió el agente…</p>
        ) : ultimo ? (
          <>
            <p className="pnl-hoy-etiqueta">{deHoy ? 'El agente escribió hoy' : 'Lo último que escribió el agente'}</p>
            <p className="pnl-hoy-titular">{ultimo.articulo?.es?.titulo || ultimo.archivo}</p>
            <p className="pnl-hoy-meta">
              <span className="pnl-pastilla" data-sucio={ultimo.articulo?.estado !== 'publicado' || undefined}>
                {ultimo.articulo?.estado === 'publicado' ? 'Publicado' : 'Borrador'}
              </span>
              <span className="pnl-hoy-cuando">{ultimo.articulo?.fecha}</span>
            </p>
            <button type="button" className="pnl-btn" onClick={() => alIr('articulos')}>Ver los artículos</button>
          </>
        ) : (
          <p className="pnl-hoy-esperando">Todavía no hay ningún artículo.</p>
        )}
      </section>

      {/* Las dos deudas. Solo aparecen si se debe algo: un contador que siempre
          dice cero es ruido, y el ruido en la primera pantalla enseña a no
          mirarla. */}
      {!cargando && (deudaConocimiento > 0 || sinIngles > 0) && (
        <section className="pnl-hoy-deudas" aria-label="Lo que falta por escribir">
          {deudaConocimiento > 0 && (
            <button type="button" className="pnl-hoy-deuda" onClick={() => alIr('conocimiento')}>
              <strong>{deudaConocimiento}</strong>
              <span>campos de Conocimiento sin escribir</span>
            </button>
          )}
          {sinIngles > 0 && (
            <button type="button" className="pnl-hoy-deuda" onClick={() => alIr('articulos')}>
              <strong>{sinIngles}</strong>
              <span>{sinIngles === 1 ? 'artículo sin versión en inglés' : 'artículos sin versión en inglés'}</span>
            </button>
          )}
        </section>
      )}

      <h3 className="pnl-hoy-rotulo">Módulos</h3>
      <div className="pnl-hoy-rejilla">
        {modulos.map((m) => {
          const Icono = ICONO_MODULO[m.id];
          return (
            <button key={m.id} type="button" className="pnl-mod" onClick={() => alIr(m.id)}>
              <span className="pnl-mod-icono">{Icono ? <Icono /> : null}</span>
              <span className="pnl-mod-nombre">{m.nombre}</span>
              <span className="pnl-mod-cifra">{cargando ? '—' : m.cifra}{m.unidad ? ` ${m.unidad}` : ''}</span>
              {m.total > 0 && <Barra hechos={m.hechos} total={m.total} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
