import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { feed } from "@/lib/reconocimientos";
import { serializarEntradas } from "@/lib/serializar";

// La paginación del feed. Solo hace falta para «ver más atrás»: la primera
// página la pinta el servidor con la página, que es más rápido y funciona sin
// JavaScript.
export async function GET(peticion: Request) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const parametro = new URL(peticion.url).searchParams.get("antesDe");
  const antesDe = parametro ? new Date(parametro) : undefined;
  if (antesDe && Number.isNaN(antesDe.getTime())) {
    return NextResponse.json({ error: "Cursor inválido." }, { status: 400 });
  }

  const pagina = await feed(sesion.user.companyId, { limite: 15, antesDe });

  return NextResponse.json({
    entradas: serializarEntradas(pagina.entradas),
    cursor: pagina.cursor,
    hayMas: pagina.hayMas,
  });
}
