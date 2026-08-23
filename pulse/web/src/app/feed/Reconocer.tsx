"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// El formulario de reconocer. Es un componente de cliente y no una acción de
// servidor porque tiene estado real: el contador de caracteres, el error en
// línea y el reseteo tras enviar. La misma API que usa es la que usa el bot.

type Valor = { id: string; nombre: string; emoji: string };
type Companero = { id: string; nombre: string; equipo: string | null };

export default function Reconocer({
  valores,
  companeros,
}: {
  valores: Valor[];
  companeros: Companero[];
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");

  if (valores.length === 0) {
    return (
      <p className="aviso">
        Tu empresa todavía no tiene valores configurados. El administrador puede
        crearlos en «Cultura y valores».
      </p>
    );
  }

  if (!abierto) {
    return (
      <button className="boton" onClick={() => setAbierto(true)}>
        Reconocer a alguien
      </button>
    );
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    const datos = new FormData(evento.currentTarget);
    const respuesta = await fetch("/api/reconocimientos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        paraUserId: datos.get("paraUserId"),
        valueId: datos.get("valueId"),
        mensaje: datos.get("mensaje"),
      }),
    });

    setEnviando(false);

    if (!respuesta.ok) {
      const cuerpo = await respuesta.json().catch(() => ({}));
      setError(cuerpo.error ?? "No se ha podido guardar. Inténtalo de nuevo.");
      return;
    }

    setMensaje("");
    setAbierto(false);
    router.refresh();
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      {error && <p className="error">{error}</p>}

      <div className="campo">
        <label htmlFor="paraUserId">A quién</label>
        <select id="paraUserId" name="paraUserId" required defaultValue="">
          <option value="" disabled>
            Elige a una persona
          </option>
          {companeros.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
              {c.equipo ? ` — ${c.equipo}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="valueId">Por qué valor</label>
        <select id="valueId" name="valueId" required defaultValue="">
          <option value="" disabled>
            Elige un valor
          </option>
          {valores.map((v) => (
            <option key={v.id} value={v.id}>
              {v.emoji} {v.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="mensaje">Qué hizo</label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          minLength={10}
          maxLength={1000}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Cuenta el hecho concreto. «Gracias por todo» se olvida; «te quedaste el viernes a cerrar julio» no."
        />
        <span className="meta">{mensaje.length}/1000</span>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <button className="boton" type="submit" disabled={enviando}>
          {enviando ? "Enviando…" : "Publicar"}
        </button>
        <button
          className="boton boton--discreto"
          type="button"
          onClick={() => setAbierto(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
