"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SmileyWinkIcon } from "@phosphor-icons/react/dist/ssr";

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
  { emoji: "❤️", nombre: "Me encanta" },
  { emoji: "🔥", nombre: "Crack" },
  { emoji: "🎉", nombre: "A celebrarlo" },
  { emoji: "💡", nombre: "Aprendí algo" },
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
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);

  // Escape y clic fuera cierran el selector. Sin esto, abrir uno y desplazarse
  // dejaba el menú flotando sobre otra publicación, y quien navega con teclado
  // se quedaba dentro sin una salida evidente.
  useEffect(() => {
    if (!abierto) return;

    const alPulsarTecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      // El foco vuelve al botón que abrió el menú, no al principio del
      // documento: cerrar algo no debería perder el sitio.
      disparador.current?.focus();
    };

    const alPulsarFuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };

    document.addEventListener("keydown", alPulsarTecla);
    document.addEventListener("pointerdown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.removeEventListener("pointerdown", alPulsarFuera);
    };
  }, [abierto]);

  // La lista vive aquí, en el componente, y no se recalcula desde las props en
  // cada render. Es deliberado: el feed guarda sus entradas en memoria del
  // navegador y no se entera de los cambios del servidor, así que apoyarse en
  // las props hacía que la reacción se dibujara y desapareciera medio segundo
  // después. Ahora manda lo que el servidor confirmó, y solo se vuelve a
  // sincronizar cuando el servidor trae una lista realmente distinta.
  const [lista, setLista] = useState<Reaccion[]>(reacciones);

  const huella = reacciones
    .map((r) => `${r.user.id}${r.emoji}`)
    .sort()
    .join("|");
  useEffect(() => {
    setLista(reacciones);
    // `huella` compara el contenido, no la identidad del array: si dependiera
    // del array, cualquier render del padre borraría la reacción recién puesta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huella]);

  const mia = lista.find((r) => r.user.id === usuarioActual)?.emoji ?? null;

  async function reaccionar(emoji: string) {
    setAbierto(false);

    const previo = lista;
    const sinLaMia = lista.filter((r) => r.user.id !== usuarioActual);
    const quita = mia === emoji;

    // Se dibuja antes de preguntar al servidor: en cuanto un gesto se duda, se
    // deja de usar. Si el servidor dice que no, se devuelve a como estaba.
    setLista(
      quita
        ? sinLaMia
        : [...sinLaMia, { emoji, user: { id: usuarioActual, nombre: "Tú" } }],
    );

    try {
      const respuesta = await fetch("/api/reacciones", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recognitionId, emoji }),
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      // Refresca lo que sí depende del servidor: el contador de novedades.
      router.refresh();
    } catch {
      setLista(previo);
    }
  }

  // Se agrupa por emoji conservando el orden de REACCIONES, para que la barra
  // no baile de posición cada vez que alguien reacciona.
  const grupos = REACCIONES.map((r) => ({
    ...r,
    quienes: lista.filter((x) => x.emoji === r.emoji).map((x) => x.user.nombre),
  })).filter((g) => g.quienes.length > 0);

  return (
    <div className="reacciones">
      <div className="reacciones__disparador" ref={caja}>
        <button
          type="button"
          ref={disparador}
          className="boton-icono"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-haspopup="true"
        >
          <SmileyWinkIcon size={20} aria-hidden="true" />
          <span>{mia ? "Cambiar reacción" : "Reaccionar"}</span>
        </button>

        {abierto && (
          <div className="selector-reacciones" role="menu">
            {REACCIONES.map((r) => (
              <button
                key={r.emoji}
                type="button"
                role="menuitemradio"
                aria-checked={mia === r.emoji}
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
          data-mia={mia === g.emoji || undefined}
          onClick={() => reaccionar(g.emoji)}
          // El title da la lista completa al ratón; el aria-label la da al
          // lector de pantalla, que no puede leer un title.
          title={g.quienes.join(", ")}
          aria-label={`${g.nombre}: ${g.quienes.join(", ")}. ${
            mia === g.emoji ? "Quitar mi reacción" : "Reaccionar así"
          }`}
        >
          <span aria-hidden="true">{g.emoji}</span>
          <span className="pastilla-reaccion__cuenta">{g.quienes.length}</span>
        </button>
      ))}
    </div>
  );
}
