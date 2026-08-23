"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

// El «me gusta» del feed. Va optimista porque el ida y vuelta al servidor se
// nota, y porque el gesto tiene que costar lo mismo que en cualquier otra red:
// en cuanto se duda, se deja de usar.

export default function Reacciones({
  recognitionId,
  reacciones,
  usuarioActual,
}: {
  recognitionId: string;
  reacciones: { userId: string; emoji: string }[];
  usuarioActual: string;
}) {
  const router = useRouter();
  const [, empezar] = useTransition();
  const yaReaccione = reacciones.some((r) => r.userId === usuarioActual);

  const [estado, aplicar] = useOptimistic(
    { total: reacciones.length, mia: yaReaccione },
    (previo) => ({
      total: previo.mia ? previo.total - 1 : previo.total + 1,
      mia: !previo.mia,
    }),
  );

  function alternar() {
    empezar(async () => {
      aplicar(null);
      await fetch("/api/reacciones", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recognitionId }),
      });
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className="boton boton--discreto"
      aria-pressed={estado.mia}
      style={{
        padding: "var(--space-1) var(--space-4)",
        borderColor: estado.mia ? "var(--green-line)" : undefined,
        background: estado.mia ? "var(--green-tint)" : undefined,
      }}
    >
      👏 <span>{estado.total}</span>
      <span className="visually-hidden" style={{ position: "absolute", left: "-9999px" }}>
        {estado.mia ? "Quitar mi aplauso" : "Aplaudir"}
      </span>
    </button>
  );
}
