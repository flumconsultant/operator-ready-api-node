"use client";

import Link from "next/link";

import { trocear } from "@/lib/menciones";
import { useRutas } from "./useRutas";

// Pinta un texto resolviendo las menciones a enlaces.
//
// Se hace al leer y no al guardar: el texto en la base sigue siendo texto, y el
// día que alguien se cambie el nombre en su perfil, las menciones antiguas
// siguen apuntando a la persona correcta aunque muestren el nombre de entonces.
// Es el mismo compromiso que hacen Slack y LinkedIn.

export default function TextoConMenciones({ texto }: { texto: string }) {
  const r = useRutas();
  return (
    <>
      {trocear(texto).map((trozo, i) =>
        trozo.tipo === "texto" ? (
          <span key={i}>{trozo.texto}</span>
        ) : (
          <Link key={i} href={r.persona(trozo.userId)} className="mencion">
            @{trozo.nombre}
          </Link>
        ),
      )}
    </>
  );
}
