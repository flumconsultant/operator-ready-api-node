import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { NuevoComentario, comentar } from "@/lib/reconocimientos";

export async function POST(peticion: Request) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const validado = NuevoComentario.safeParse(
    await peticion.json().catch(() => null),
  );
  if (!validado.success) {
    return NextResponse.json(
      { error: validado.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 },
    );
  }

  const resultado = await comentar({
    companyId: sesion.user.companyId,
    userId: sesion.user.id,
    ...validado.data,
  });

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  return NextResponse.json({ id: resultado.id }, { status: 201 });
}
