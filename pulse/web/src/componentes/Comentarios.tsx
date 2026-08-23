"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PaperPlaneTiltIcon, ChatCircleIcon } from "@phosphor-icons/react/dist/ssr";

import Avatar from "./Avatar";
import Fecha from "./Fecha";
import TextoConMenciones from "./TextoConMenciones";
import CampoConMenciones, { type Mencionable } from "./CampoConMenciones";

// La fecha llega como cadena ISO, igual que el resto del feed: ver
// lib/serializar.ts sobre por qué.
type Comentario = {
  id: string;
  texto: string;
  creadoEn: string;
  user: { id: string; nombre: string; imagen: string | null };
};

// El hilo de comentarios.
//
// Colapsado por defecto cuando hay más de dos: un feed donde cada publicación
// arrastra ocho comentarios abiertos deja de poder recorrerse. Los dos últimos
// se ven siempre, que es lo que da señal de que la conversación existe.

export default function Comentarios({
  recognitionId,
  comentarios,
  usuarioActual,
  companeros = [],
  siempreAbierto = false,
}: {
  recognitionId: string;
  comentarios: Comentario[];
  usuarioActual: { id: string; nombre: string; imagen: string | null };
  companeros?: Mencionable[];
  siempreAbierto?: boolean;
}) {
  const router = useRouter();
  const [, empezar] = useTransition();
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandido, setExpandido] = useState(siempreAbierto);

  const ocultos = expandido ? 0 : Math.max(0, comentarios.length - 2);
  const visibles = expandido ? comentarios : comentarios.slice(-2);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault?.();
    const limpio = texto.trim();
    if (!limpio) return;

    setEnviando(true);
    setError(null);

    const respuesta = await fetch("/api/comentarios", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ recognitionId, texto: limpio }),
    });

    setEnviando(false);

    if (!respuesta.ok) {
      const cuerpo = await respuesta.json().catch(() => ({}));
      setError(cuerpo.error ?? "No se ha podido publicar. Inténtalo de nuevo.");
      return;
    }

    setTexto("");
    empezar(() => router.refresh());
  }

  return (
    <div className="comentarios">
      {ocultos > 0 && (
        <button
          type="button"
          className="comentarios__ver-mas"
          onClick={() => setExpandido(true)}
        >
          <ChatCircleIcon size={16} aria-hidden="true" />
          Ver {ocultos} comentario{ocultos === 1 ? "" : "s"} más
        </button>
      )}

      {visibles.map((c) => (
        <article key={c.id} className="comentario">
          <Avatar persona={c.user} tamano="sm" />
          <div className="comentario__cuerpo">
            <p className="comentario__texto">
              <Link href={`/persona/${c.user.id}`} className="comentario__autor">
                {c.user.nombre}
              </Link>{" "}
              <TextoConMenciones texto={c.texto} />
            </p>
            <span className="meta">
              <Fecha valor={c.creadoEn} />
            </span>
          </div>
        </article>
      ))}

      <form className="comentarios__formulario" onSubmit={enviar}>
        <Avatar persona={usuarioActual} tamano="sm" enlazado={false} />
        <div className="comentarios__campo">
          <label className="visually-hidden" htmlFor={`comentario-${recognitionId}`}>
            Escribe un comentario
          </label>
          {/* Enter envía y Mayúsculas+Enter hace salto de línea, como en
              cualquier chat — salvo cuando la lista de menciones está abierta,
              donde Enter elige. De eso se encarga el propio campo. */}
          <CampoConMenciones
            id={`comentario-${recognitionId}`}
            valor={texto}
            alCambiar={setTexto}
            personas={companeros}
            maximo={600}
            filas={1}
            autoCrecer
            placeholder="Añade algo…"
            alPulsarEnter={() => void enviar(new Event("submit") as unknown as React.FormEvent)}
          />
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="boton-icono boton-icono--solido"
          disabled={enviando || !texto.trim()}
          aria-label="Publicar comentario"
        >
          <PaperPlaneTiltIcon size={18} weight="fill" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
