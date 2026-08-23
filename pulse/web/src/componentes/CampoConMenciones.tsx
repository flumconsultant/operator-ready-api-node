"use client";

import { useEffect, useRef, useState } from "react";

import Avatar from "./Avatar";
import { componerMencion, largoVisible, menciónEnCurso } from "@/lib/menciones";

// Un textarea que sabe de menciones.
//
// Al escribir «@» y unas letras, sale la lista de quién encaja; al elegir, se
// inserta `@[Nombre](id)` y el cursor queda detrás. Quien no escriba nunca una
// arroba no nota que existe, que es la propiedad que tiene que tener.
//
// Se navega con las flechas y Enter, no solo con el ratón: escribir una mención
// ocurre en mitad de una frase y soltar el teclado para ir al ratón rompe el
// hilo de lo que se estaba diciendo.

export type Mencionable = {
  id: string;
  nombre: string;
  imagen: string | null;
  equipo?: string | null;
};

export default function CampoConMenciones({
  id,
  valor,
  alCambiar,
  personas,
  maximo,
  placeholder,
  filas = 4,
  alPulsarEnter,
  autoCrecer = false,
}: {
  id: string;
  valor: string;
  alCambiar: (texto: string) => void;
  personas: Mencionable[];
  maximo: number;
  placeholder?: string;
  filas?: number;
  /// Para el campo de comentarios, donde Enter envía.
  alPulsarEnter?: () => void;
  autoCrecer?: boolean;
}) {
  const campo = useRef<HTMLTextAreaElement>(null);
  const [consulta, setConsulta] = useState<{ texto: string; desde: number } | null>(null);
  const [resaltado, setResaltado] = useState(0);

  const candidatos = consulta
    ? personas
        .filter((p) =>
          p.nombre.toLowerCase().includes(consulta.texto.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  useEffect(() => setResaltado(0), [consulta?.texto]);

  function revisarCursor(elemento: HTMLTextAreaElement) {
    const encontrada = menciónEnCurso(elemento.value, elemento.selectionStart);
    setConsulta(encontrada ? { texto: encontrada.consulta, desde: encontrada.desde } : null);
  }

  function insertar(persona: Mencionable) {
    const elemento = campo.current;
    if (!elemento || !consulta) return;

    const antes = valor.slice(0, consulta.desde);
    const despues = valor.slice(elemento.selectionStart);
    const token = componerMencion(persona.nombre, persona.id);
    const texto = `${antes}${token} ${despues}`;

    alCambiar(texto);
    setConsulta(null);

    // El cursor va detrás de la mención, no al final del texto: si alguien
    // menciona a alguien en mitad de una frase, seguir escribiendo al final
    // sería un salto que nadie espera.
    const posicion = antes.length + token.length + 1;
    requestAnimationFrame(() => {
      elemento.focus();
      elemento.setSelectionRange(posicion, posicion);
    });
  }

  const restantes = maximo - largoVisible(valor);

  return (
    <div className="campo-menciones">
      <textarea
        id={id}
        ref={campo}
        rows={filas}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => {
          alCambiar(e.target.value);
          revisarCursor(e.target);
          if (autoCrecer) {
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }
        }}
        onClick={(e) => revisarCursor(e.currentTarget)}
        onBlur={() => {
          // Con un retraso: sin él, el blur cierra la lista antes de que el
          // clic sobre una opción llegue a ejecutarse.
          setTimeout(() => setConsulta(null), 150);
        }}
        onKeyDown={(e) => {
          if (candidatos.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              return setResaltado((v) => (v + 1) % candidatos.length);
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              return setResaltado((v) => (v - 1 + candidatos.length) % candidatos.length);
            }
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              return insertar(candidatos[resaltado]);
            }
            if (e.key === "Escape") {
              e.preventDefault();
              return setConsulta(null);
            }
          }
          if (e.key === "Enter" && !e.shiftKey && alPulsarEnter) {
            e.preventDefault();
            alPulsarEnter();
          }
        }}
        aria-describedby={`${id}-ayuda`}
        aria-expanded={candidatos.length > 0}
        aria-autocomplete="list"
      />

      {candidatos.length > 0 && (
        <ul className="menciones-sugeridas" role="listbox" aria-label="Personas">
          {candidatos.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === resaltado}
                data-resaltado={i === resaltado || undefined}
                // onMouseDown y no onClick: el blur del textarea llega antes que
                // el click y la lista ya no estaría.
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertar(p);
                }}
              >
                <Avatar persona={p} tamano="sm" enlazado={false} />
                <span>
                  {p.nombre}
                  {p.equipo && <span className="menciones-sugeridas__equipo">{p.equipo}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="meta campo-menciones__pie" id={`${id}-ayuda`} aria-live="polite">
        {restantes < 0
          ? `Te has pasado por ${-restantes} caracteres`
          : `Escribe @ para mencionar · ${restantes} caracteres`}
      </p>
    </div>
  );
}
