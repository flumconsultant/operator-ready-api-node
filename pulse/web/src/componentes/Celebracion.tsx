"use client";

import Link from "next/link";
import { CakeIcon, ConfettiIcon } from "@phosphor-icons/react/dist/ssr";

import type { CelebracionSerializada as Datos } from "@/lib/serializar";
import Avatar from "./Avatar";
import Fecha from "./Fecha";

// Cumpleaños y aniversarios en el feed.
//
// Se ven distintos de un reconocimiento a propósito —fondo navy, sin
// reacciones ni comentarios— porque no son lo mismo: un reconocimiento lo
// escribe una persona sobre otra; esto lo sabe el sistema. Mezclarlos en la
// misma tarjeta haría que el feed pareciera más activo de lo que está.

export default function Celebracion({ celebracion: c }: { celebracion: Datos }) {
  const cumpleanos = c.tipo === "CUMPLEANOS";

  return (
    <article className="celebracion">
      <span className="celebracion__icono" aria-hidden="true">
        {cumpleanos ? <CakeIcon size={22} weight="fill" /> : <ConfettiIcon size={22} weight="fill" />}
      </span>

      <Avatar persona={c.persona} tamano="md" />

      <div>
        <p className="celebracion__texto">
          {cumpleanos ? (
            <>
              Hoy cumple años{" "}
              <Link href={`/persona/${c.persona.id}`} className="enlace-persona">
                {c.persona.nombre}
              </Link>
            </>
          ) : (
            <>
              <Link href={`/persona/${c.persona.id}`} className="enlace-persona">
                {c.persona.nombre}
              </Link>{" "}
              cumple {c.anos} {c.anos === 1 ? "año" : "años"} en la empresa
            </>
          )}
        </p>
        <p className="celebracion__meta">
          <Fecha valor={c.fecha} />
          {c.persona.equipo && <> · {c.persona.equipo}</>}
        </p>
      </div>
    </article>
  );
}
