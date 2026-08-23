"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiscordLogoIcon, DotsThreeIcon } from "@phosphor-icons/react/dist/ssr";

import type { ReconocimientoSerializado } from "@/lib/serializar";
import Avatar from "./Avatar";
import Fecha from "./Fecha";
import IconoValor from "./IconoValor";
import Reacciones from "./Reacciones";
import Comentarios from "./Comentarios";
import TextoConMenciones from "./TextoConMenciones";
import type { Mencionable } from "./CampoConMenciones";
import { useRutas } from "./useRutas";

// La publicación del feed.
//
// La jerarquía: primero quién reconoce a quién —las caras, para que se lea como
// una relación y no como un registro—, después el valor, después el mensaje, y
// al final la foto y la conversación. El valor va arriba porque es lo que
// distingue esto de un canal de felicitaciones: se reconoce POR algo.

/// Hasta tres caras; a partir de ahí, un contador. Cinco avatares solapados en
/// una línea de 640px dejan de distinguirse unos de otros.
const CARAS_VISIBLES = 3;

export default function Reconocimiento({
  reconocimiento: r,
  usuarioActual,
  companeros = [],
  permalink = false,
  puedeModerar = false,
}: {
  reconocimiento: ReconocimientoSerializado;
  usuarioActual: { id: string; nombre: string; imagen: string | null };
  companeros?: Mencionable[];
  permalink?: boolean;
  puedeModerar?: boolean;
}) {
  const rt = useRutas();
  const router = useRouter();
  const [retirando, setRetirando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const propio = r.de.id === usuarioActual.id;
  const sePuedeRetirar = puedeModerar || propio;

  const caras = r.destinatarios.slice(0, CARAS_VISIBLES);
  const sobran = r.destinatarios.length - caras.length;

  async function retirar() {
    const motivo = window.prompt(
      "¿Por qué se retira? Lo verá el registro de auditoría, no el feed.",
      "",
    );
    // Cancelar devuelve null; una cadena vacía es un motivo vacío pero
    // deliberado, y se acepta.
    if (motivo === null) return;

    setRetirando(true);
    setError(null);

    const respuesta = await fetch(`/api/reconocimientos/${r.id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ motivo }),
    });

    setRetirando(false);

    if (!respuesta.ok) {
      const cuerpo = await respuesta.json().catch(() => ({}));
      setError(cuerpo.error ?? "No se ha podido retirar.");
      return;
    }
    router.refresh();
  }

  return (
    <article className="publicacion">
      <header className="publicacion__cabecera">
        <div className="publicacion__caras">
          <Avatar persona={r.de} tamano="md" />
          {caras.map((p) => (
            <Avatar key={p.id} persona={p} tamano="md" />
          ))}
        </div>

        <div className="publicacion__quien">
          <p className="publicacion__linea">
            <Link href={rt.persona(r.de.id)} className="enlace-persona">
              {r.de.nombre}
            </Link>{" "}
            <span className="publicacion__verbo">reconoció a</span>{" "}
            <ListaPersonas personas={r.destinatarios} />
          </p>
          <p className="publicacion__meta">
            {permalink ? (
              <Fecha valor={r.creadoEn} />
            ) : (
              <Link href={rt.publicacion(r.id)} className="enlace-discreto">
                <Fecha valor={r.creadoEn} />
              </Link>
            )}
            {r.destinatarios.length === 1 && r.destinatarios[0].equipo && (
              <> · {r.destinatarios[0].equipo}</>
            )}
            {r.canal === "DISCORD" && (
              <>
                {" · "}
                <span className="publicacion__origen">
                  <DiscordLogoIcon size={14} weight="fill" aria-hidden="true" />
                  Desde Discord
                </span>
              </>
            )}
          </p>
        </div>

        {sePuedeRetirar && (
          <button
            type="button"
            className="boton-icono publicacion__acciones"
            onClick={retirar}
            disabled={retirando}
          >
            <DotsThreeIcon size={20} weight="bold" aria-hidden="true" />
            <span className="visually-hidden">
              Retirar este reconocimiento de {r.de.nombre}
            </span>
          </button>
        )}
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <p className="insignia-valor">
        <IconoValor icono={r.valor.icono} />
        {r.valor.nombre}
      </p>

      <p className="publicacion__mensaje">
        <TextoConMenciones texto={r.mensaje} />
      </p>

      {r.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/imagenes/${r.imagen}`}
          alt={`Foto que acompaña al reconocimiento de ${r.de.nombre}`}
          className="publicacion__foto"
          loading="lazy"
          decoding="async"
        />
      )}

      <Reacciones
        recognitionId={r.id}
        reacciones={r.reacciones}
        usuarioActual={usuarioActual.id}
      />

      <Comentarios
        recognitionId={r.id}
        comentarios={r.comentarios}
        usuarioActual={usuarioActual}
        companeros={companeros}
        siempreAbierto={permalink}
      />

      {sobran > 0 && (
        <p className="visually-hidden">
          También lo recibieron: {r.destinatarios.slice(CARAS_VISIBLES).map((p) => p.nombre).join(", ")}.
        </p>
      )}
    </article>
  );
}

/// «Ana», «Ana y Diego», «Ana, Diego y 3 más». Escribir la lista entera de diez
/// nombres deja la cabecera en cuatro líneas y esconde el mensaje.
function ListaPersonas({ personas }: { personas: { id: string; nombre: string }[] }) {
  const rt = useRutas();
  const enlace = (p: { id: string; nombre: string }) => (
    <Link key={p.id} href={rt.persona(p.id)} className="enlace-persona">
      {p.nombre}
    </Link>
  );

  if (personas.length === 1) return enlace(personas[0]);

  if (personas.length === 2) {
    return (
      <>
        {enlace(personas[0])} <span className="publicacion__verbo">y</span>{" "}
        {enlace(personas[1])}
      </>
    );
  }

  const primeros = personas.slice(0, 2);
  const resto = personas.length - primeros.length;

  return (
    <>
      {enlace(primeros[0])}, {enlace(primeros[1])}{" "}
      <span className="publicacion__verbo">
        y {resto} {resto === 1 ? "persona más" : "personas más"}
      </span>
    </>
  );
}
