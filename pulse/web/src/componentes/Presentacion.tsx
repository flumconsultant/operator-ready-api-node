"use client";

import Link from "next/link";
import { HandWavingIcon } from "@phosphor-icons/react/dist/ssr";

import type { PresentacionSerializada } from "@/lib/serializar";
import Avatar from "./Avatar";
import Fecha from "./Fecha";
import { useRutas } from "./useRutas";

// La presentación de quien se incorpora.
//
// Se distingue de un reconocimiento —fondo propio, sin reacciones— porque no lo
// es: lo escribe alguien sobre sí mismo. Mezclarlas en la misma tarjeta haría
// que el feed pareciera tener más reconocimientos de los que tiene.

export default function Presentacion({
  presentacion: p,
}: {
  presentacion: PresentacionSerializada;
}) {
  const r = useRutas();
  return (
    <article className="presentacion">
      <div className="presentacion__cabecera">
        <Avatar persona={p.user} tamano="lg" />
        <div>
          <p className="presentacion__saluda">
            <HandWavingIcon size={18} weight="fill" aria-hidden="true" />
            Se ha incorporado
          </p>
          <p className="presentacion__nombre">
            <Link href={r.persona(p.user.id)} className="enlace-persona">
              {p.user.nombre}
            </Link>
          </p>
          <p className="presentacion__meta">
            {[p.user.cargo, p.user.equipo].filter(Boolean).join(" · ")}
            {(p.user.cargo || p.user.equipo) && " · "}
            <Fecha valor={p.creadaEn} />
          </p>
        </div>
      </div>

      <p className="presentacion__texto">{p.texto}</p>
    </article>
  );
}
