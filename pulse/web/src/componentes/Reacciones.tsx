"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SmileyWink } from "@phosphor-icons/react/dist/ssr";

// Las reacciones del feed.
//
// Cinco, no una. El aplauso solo servía para decir «lo he visto»; con estas se
// puede decir algo distinto, y eso es lo que hace que la gente reaccione más de
// una vez a la semana. No son decorativas: cada una tiene un nombre y ese
// nombre es el que oye un lector de pantalla.
//
// Una persona tiene UNA reacción por reconocimiento y puede cambiarla. Es el
// comportamiento de LinkedIn y no el de Slack: cinco filas de emoji debajo de
// cada publicación convierten el reconocimiento en un concurso de reacciones,
// y en un feed de empresa eso se nota enseguida.

export const REACCIONES = [
  { emoji: "👏", nombre: "Aplauso" },
  { emoji: "❤️", nombre: "Me llega" },
  { emoji: "🔥", nombre: "Crack" },
  { emoji: "🎉", nombre: "A celebrarlo" },
  { emoji: "💡", nombre: "He aprendido algo" },
] as const;

type Reaccion = { emoji: string; user: { id: string; nombre: string } };

export default function Reacciones({
  recognitionId,
  reacciones,
  usuarioActual,
}: {
  recognitionId: string;
  reacciones: Reaccion[];
  usuarioActual: string;
}) {
  const router = useRouter();
  const [, empezar] = useTransition();
  const [abierto, setAbierto] = useState(false);

  const mia = reacciones.find((r) => r.user.id === usuarioActual)?.emoji ?? null;

  // Optimista: la reacción se dibuja antes de que conteste el servidor. Sin
  // esto se nota el viaje de ida y vuelta, y en cuanto un gesto se duda, se
  // deja de usar.
  const [estado, aplicar] = useOptimistic(
    { lista: reacciones, mia },
    (previo, emoji: string) => {
      const sinLaMia = previo.lista.filter((r) => r.user.id !== usuarioActual);
      const quita = previo.mia === emoji;
      return {
        mia: quita ? null : emoji,
        lista: quita
          ? sinLaMia
          : [...sinLaMia, { emoji, user: { id: usuarioActual, nombre: "Tú" } }],
      };
    },
  );

  function reaccionar(emoji: string) {
    setAbierto(false);
    empezar(async () => {
      aplicar(emoji);
      await fetch("/api/reacciones", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recognitionId, emoji }),
      });
      router.refresh();
    });
  }

  // Se agrupa por emoji conservando el orden de REACCIONES, para que la barra
  // no baile de posición cada vez que alguien reacciona.
  const grupos = REACCIONES.map((r) => ({
    ...r,
    quienes: estado.lista.filter((x) => x.emoji === r.emoji).map((x) => x.user.nombre),
  })).filter((g) => g.quienes.length > 0);

  return (
    <div className="reacciones">
      <div className="reacciones__disparador">
        <button
          type="button"
          className="boton-icono"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-haspopup="true"
        >
          <SmileyWink size={20} aria-hidden="true" />
          <span>{estado.mia ? "Cambiar reacción" : "Reaccionar"}</span>
        </button>

        {abierto && (
          <div className="selector-reacciones" role="menu">
            {REACCIONES.map((r) => (
              <button
                key={r.emoji}
                type="button"
                role="menuitemradio"
                aria-checked={estado.mia === r.emoji}
                className="selector-reacciones__opcion"
                onClick={() => reaccionar(r.emoji)}
                title={r.nombre}
              >
                <span aria-hidden="true">{r.emoji}</span>
                <span className="selector-reacciones__nombre">{r.nombre}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {grupos.map((g) => (
        <button
          key={g.emoji}
          type="button"
          className="pastilla-reaccion"
          data-mia={estado.mia === g.emoji || undefined}
          onClick={() => reaccionar(g.emoji)}
          // El title da la lista completa al ratón; el aria-label la da al
          // lector de pantalla, que no puede leer un title.
          title={g.quienes.join(", ")}
          aria-label={`${g.nombre}: ${g.quienes.join(", ")}. ${
            estado.mia === g.emoji ? "Quitar mi reacción" : "Reaccionar así"
          }`}
        >
          <span aria-hidden="true">{g.emoji}</span>
          <span className="pastilla-reaccion__cuenta">{g.quienes.length}</span>
        </button>
      ))}
    </div>
  );
}
