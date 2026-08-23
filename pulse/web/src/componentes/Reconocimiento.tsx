"use client";

import Link from "next/link";
import { DiscordLogo } from "@phosphor-icons/react/dist/ssr";

import type { ReconocimientoSerializado } from "@/lib/serializar";
import Avatar from "./Avatar";
import IconoValor from "./IconoValor";
import Fecha from "./Fecha";
import Reacciones from "./Reacciones";
import Comentarios from "./Comentarios";

// La publicación del feed.
//
// La jerarquía está pensada así: primero quién reconoce a quién (dos avatares,
// para que se lea como una relación y no como un registro), después el valor,
// después el mensaje —que es lo que hay que leer— y al final la foto y la
// conversación. El valor va arriba y no abajo porque es lo que distingue esto
// de un canal de felicitaciones: se reconoce POR algo.

export default function Reconocimiento({
  reconocimiento: r,
  usuarioActual,
  permalink = false,
}: {
  reconocimiento: ReconocimientoSerializado;
  usuarioActual: { id: string; nombre: string; imagen: string | null };
  permalink?: boolean;
}) {
  return (
    <article className="publicacion">
      <header className="publicacion__cabecera">
        <div className="publicacion__caras">
          <Avatar persona={r.de} tamano="md" />
          <Avatar persona={r.para} tamano="md" />
        </div>

        <div className="publicacion__quien">
          <p className="publicacion__linea">
            <Link href={`/persona/${r.de.id}`} className="enlace-persona">
              {r.de.nombre}
            </Link>{" "}
            <span className="publicacion__verbo">reconoció a</span>{" "}
            <Link href={`/persona/${r.para.id}`} className="enlace-persona">
              {r.para.nombre}
            </Link>
          </p>
          <p className="publicacion__meta">
            {permalink ? (
              <Fecha valor={r.creadoEn} />
            ) : (
              <Link href={`/feed/${r.id}`} className="enlace-discreto">
                <Fecha valor={r.creadoEn} />
              </Link>
            )}
            {r.para.equipo && <> · {r.para.equipo}</>}
            {r.canal === "DISCORD" && (
              <>
                {" · "}
                <span className="publicacion__origen">
                  <DiscordLogo size={14} weight="fill" aria-hidden="true" />
                  Desde Discord
                </span>
              </>
            )}
          </p>
        </div>
      </header>

      <p className="insignia-valor">
        <IconoValor icono={r.valor.icono} />
        {r.valor.nombre}
      </p>

      <p className="publicacion__mensaje">{r.mensaje}</p>

      {r.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/imagenes/${r.imagen}`}
          alt={`Foto que acompaña al reconocimiento de ${r.de.nombre} a ${r.para.nombre}`}
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
        siempreAbierto={permalink}
      />
    </article>
  );
}
