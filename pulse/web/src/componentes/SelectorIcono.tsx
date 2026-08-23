"use client";

import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";

import {
  CATALOGO,
  CLAVES,
  ICONO_POR_DEFECTO,
  iconoDeValor,
  nombreDeIcono,
  type ClaveIcono,
} from "@/lib/iconos-valores";

// El selector de icono de un valor.
//
// Es una rejilla de botones de radio, no un desplegable: son veintiocho y se
// eligen mirando, no leyendo una lista de nombres. Son inputs de radio de
// verdad —uno por icono— para que se puedan recorrer con las flechas y para que
// el navegador se encargue de que solo haya uno marcado.
//
// Se puede plegar, y en el asistente de puesta en marcha va plegado: con cinco
// valores en pantalla, cinco rejillas abiertas son ciento cuarenta botones y
// una página de cinco mil píxeles en la que no se encuentra el botón de
// continuar. Plegado se ve el icono actual y se abre solo el que se quiere
// cambiar.

export default function SelectorIcono({
  nombre = "icono",
  valorInicial = ICONO_POR_DEFECTO,
  plegable = false,
  alCambiar,
}: {
  nombre?: string;
  valorInicial?: ClaveIcono | string;
  plegable?: boolean;
  alCambiar?: (clave: ClaveIcono) => void;
}) {
  const [elegido, setElegido] = useState<string>(valorInicial);
  const [abierto, setAbierto] = useState(!plegable);
  const Actual = iconoDeValor(elegido);

  return (
    <fieldset className="selector-icono">
      <legend className={plegable ? "visually-hidden" : undefined}>Icono</legend>

      {plegable && (
        <button
          type="button"
          className="selector-icono__resumen"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
        >
          <Actual size={20} weight="fill" aria-hidden="true" />
          <span>
            Icono: <strong>{nombreDeIcono(elegido)}</strong>
          </span>
          <CaretDownIcon
            size={16}
            aria-hidden="true"
            className={abierto ? "girado" : undefined}
          />
        </button>
      )}

      <div className="selector-icono__rejilla" hidden={!abierto}>
        {CLAVES.map((clave) => {
          const { Componente, nombre: etiqueta } = CATALOGO[clave];
          return (
            <label
              key={clave}
              className="selector-icono__opcion"
              data-elegido={elegido === clave || undefined}
              title={etiqueta}
            >
              <input
                type="radio"
                name={nombre}
                value={clave}
                checked={elegido === clave}
                onChange={() => {
                  setElegido(clave);
                  alCambiar?.(clave);
                  // Elegido el icono, la rejilla se pliega sola: se ha
                  // terminado con ella y ocupa media pantalla.
                  if (plegable) setAbierto(false);
                }}
                className="visually-hidden"
              />
              <Componente size={22} weight="fill" aria-hidden="true" />
              {/* El nombre del icono no se ve, pero es lo que oye un lector de
                  pantalla: sin él, la rejilla son veintiocho radios sin
                  etiqueta. */}
              <span className="visually-hidden">{etiqueta}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
