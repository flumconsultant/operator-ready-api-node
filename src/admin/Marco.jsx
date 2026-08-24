import React from 'react';
import { ICONO_MODULO, IconoMenu, IconoCerrar, IconoMas } from './iconos.jsx';
import './panel.css';

/**
 * El marco del panel: dónde vive la navegación.
 *
 * ---- Qué había antes, y por qué no llegaba ----
 *
 * Los seis módulos eran una tira horizontal encima del contenido. Funcionaba,
 * pero tenía dos defectos que solo se ven usándolo:
 *
 *   · En el móvil la tira se desplaza en horizontal, así que los dos últimos
 *     módulos —autores y suscriptores— no se ven hasta que alguien arrastra.
 *     Un módulo que hay que buscar es un módulo que se olvida.
 *   · En el ordenador la tira ocupaba el ancho entero para seis palabras y
 *     dejaba el sitio donde está el trabajo empezando más abajo.
 *
 * ---- Lo que hace ahora, y es una sola estructura, no dos ----
 *
 * A partir de 1024 píxeles la navegación es una columna fija a la izquierda:
 * los seis módulos siempre a la vista, sin desplegar nada. Por debajo, la
 * MISMA lista es un cajón que se abre desde la izquierda con el botón de menú.
 *
 * Es el patrón que recomienda Material para pantallas grandes —barra lateral
 * arriba de 1024, navegación compacta por debajo— y no son dos diseños: es una
 * lista que cambia de sitio. Mantener dos habría sido mantener dos.
 *
 * ---- Reglas que se cumplen aquí y conviene no romper después ----
 *
 *   · Icono Y palabra, nunca icono solo. Un panel de seis módulos que solo
 *     enseña dibujos obliga a aprenderse los dibujos.
 *   · Donde estás se ve, y no solo por el color: el módulo activo lleva
 *     además una barra a la izquierda y `aria-current`.
 *   · El cajón se cierra con Escape, tocando fuera o al elegir un módulo, y
 *     mientras está abierto el foco no se escapa a lo que hay detrás.
 *   · Hay un enlace para saltar al contenido: quien navega con teclado no
 *     debería recorrer seis módulos en cada pantalla para llegar al formulario.
 */

export const MODULOS = [
  ['hoy', 'Hoy'],
  ['articulos', 'Artículos'],
  ['paginas', 'Páginas'],
  ['contenido', 'Contenido'],
  ['conocimiento', 'Conocimiento'],
  ['autores', 'Autores'],
  ['suscriptores', 'Suscriptores'],
];

/* Los tres destinos diarios de la barra inferior. El cuarto botón —«Más»— no
   es un módulo: abre el cajón con los seis. */
const PESTANAS = [
  ['hoy', 'Hoy'],
  ['contenido', 'Contenido'],
  ['articulos', 'Artículos'],
];

function Navegacion({ vista, alCambiar, alNavegar }) {
  return (
    <nav className="pnl-nav" aria-label="Módulos del panel">
      {MODULOS.map(([id, rotulo]) => {
        const Icono = ICONO_MODULO[id];
        return (
          <button
            key={id}
            type="button"
            className="pnl-nav-item"
            /* El nombre va también como rótulo accesible y como globo del
               navegador: en el editor de escritorio la columna se queda en
               76 px y la palabra deja de verse, y un botón sin nombre es un
               botón que hay que adivinar. */
            aria-label={rotulo}
            title={rotulo}
            aria-current={vista === id ? 'page' : undefined}
            onClick={() => { alCambiar(id); alNavegar?.(); }}
          >
            <Icono />
            <span>{rotulo}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function Marco({ vista, alCambiar, quien, acciones, children }) {
  const [cajon, setCajon] = React.useState(false);
  const cajaCajon = React.useRef(null);
  const botonMenu = React.useRef(null);
  const principal = React.useRef(null);

  /* Escape cierra, y el foco vuelve al botón que lo abrió. Sin eso, cerrar el
     cajón con el teclado deja el foco en un sitio que ya no existe y el
     siguiente tabulador empieza desde el principio de la página. */
  React.useEffect(() => {
    if (!cajon) return undefined;
    const tecla = (e) => { if (e.key === 'Escape') { setCajon(false); botonMenu.current?.focus(); } };
    document.addEventListener('keydown', tecla);
    /* El foco entra en el cajón al abrirlo: si se queda fuera, el primer
       tabulador se va a la página de debajo, que está tapada. */
    cajaCajon.current?.querySelector('button')?.focus();
    return () => document.removeEventListener('keydown', tecla);
  }, [cajon]);

  /* Al CAMBIAR de módulo, el foco pasa al contenido. Para quien ve la pantalla
     el cambio es evidente; para quien usa un lector, sin esto no pasa nada
     perceptible: sigue leyendo la lista de módulos de la que acaba de salir.
   *
   * Al montar no, y eso costó descubrirlo: enfocar el contenido nada más
   * abrir el panel dejaba el foco DENTRO de la página, así que el primer
   * tabulador saltaba al primer botón del contenido y el enlace de «saltar al
   * contenido» —que está antes— no se alcanzaba nunca. Dos reglas de
   * accesibilidad chocando; gana la que solo actúa cuando hay un cambio. */
  const montado = React.useRef(false);
  React.useEffect(() => {
    if (montado.current) principal.current?.focus?.();
    else montado.current = true;
  }, [vista]);

  return (
    <div className="pnl pnl-marco">
      <a href="#pnl-contenido" className="pnl-saltar">Saltar al contenido</a>

      {/* La columna fija. Solo existe a partir de 1024 px; por debajo, la
          oculta el CSS y su sitio lo ocupa el cajón. */}
      <aside className="pnl-lateral">
        <div className="pnl-lateral-marca">
          <strong>BECOME</strong>
          {/* La inicial, para cuando la columna se queda en 76 px con el editor
              abierto: «BECOME» no cabe y se sale por el borde. Es la misma
              marca dicha en un carácter, y va oculta a los lectores de pantalla
              porque el nombre completo sigue estando al lado. */}
          <span className="pnl-marca-corta" aria-hidden="true">B</span>
          <span className="pnl-quien">{quien}</span>
        </div>
        <Navegacion vista={vista} alCambiar={alCambiar} />
        <div className="pnl-lateral-pie">{acciones}</div>
      </aside>

      <div className="pnl-columna-principal">
        {/* La barra de arriba en móvil: el botón de menú, la marca y nada más.
            Las acciones de cada pantalla viven en su pantalla. */}
        <header className="pnl-superior">
          <button
            ref={botonMenu}
            type="button"
            className="pnl-btn pnl-btn--icono"
            /* El rótulo va en el botón, no en el icono: el icono va solo y sin
               esto sería un control sin nombre. */
            aria-label={cajon ? 'Cerrar el menú' : 'Abrir el menú'}
            aria-expanded={cajon}
            onClick={() => setCajon((x) => !x)}
          >
            {cajon ? <IconoCerrar /> : <IconoMenu />}
          </button>
          <div className="pnl-marca">
            <strong>BECOME</strong>
          </div>
        </header>

        {cajon && (
          <div className="pnl-cajon">
            {/* Cerrar tocando fuera. No es la única salida —están Escape y el
                botón— porque un fondo que cierra es un gesto que no se ve. */}
            <div className="pnl-cajon-fondo" onClick={() => setCajon(false)} />
            <div className="pnl-cajon-caja" ref={cajaCajon} role="dialog" aria-modal="true" aria-label="Módulos del panel">
              <div className="pnl-lateral-marca">
                <strong>BECOME</strong>
                <span className="pnl-quien">{quien}</span>
              </div>
              <Navegacion vista={vista} alCambiar={alCambiar} alNavegar={() => setCajon(false)} />
              <div className="pnl-lateral-pie">{acciones}</div>
            </div>
          </div>
        )}

        <main id="pnl-contenido" className="pnl-principal" ref={principal} tabIndex={-1}>
          {children}
        </main>

        {/* La barra de pestañas del móvil.
         *
         * Cuatro destinos y no seis, porque una barra de seis pone cada objetivo
         * en 65 píxeles de ancho y el pulgar de nadie mide eso. Los tres que
         * están son los tres a los que se entra a diario; el cuarto abre el
         * cajón con todo lo demás, y por eso dice «Más» y no el nombre de un
         * módulo: un botón que promete un sitio y abre una lista miente.
         *
         * Convive con el cajón en lugar de sustituirlo. Quitar el cajón habría
         * dejado Autores y Suscriptores sin ninguna puerta en el móvil. */}
        <nav className="pnl-pestanas" aria-label="Ir a">
          {PESTANAS.map(([id, rotulo]) => {
            const Icono = ICONO_MODULO[id];
            return (
              <button
                key={id}
                type="button"
                className="pnl-pestana"
                aria-current={vista === id ? 'page' : undefined}
                onClick={() => alCambiar(id)}
              >
                <Icono />
                <span>{rotulo}</span>
              </button>
            );
          })}
          <button
            type="button"
            className="pnl-pestana"
            aria-expanded={cajon}
            onClick={() => setCajon(true)}
          >
            <IconoMas />
            <span>Más</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
