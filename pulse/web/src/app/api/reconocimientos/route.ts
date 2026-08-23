import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  NuevoReconocimiento,
  crearReconocimiento,
} from "@/lib/reconocimientos";
import { analizarPendientes } from "@/lib/ia/sentimiento";
import { avisarADiscord } from "@/lib/discord";

export async function POST(peticion: Request) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const cuerpo = await peticion.json().catch(() => null);
  const validado = NuevoReconocimiento.safeParse(cuerpo);
  if (!validado.success) {
    return NextResponse.json(
      { error: validado.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 },
    );
  }

  const resultado = await crearReconocimiento({
    companyId: sesion.user.companyId,
    deUserId: sesion.user.id,
    canal: "WEB",
    ...validado.data,
  });

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  // El análisis y el espejo en Discord van después de responder. Quien acaba de
  // reconocer a alguien no tiene por qué esperar a que conteste una API externa.
  void analizarPendientes(sesion.user.companyId, 5).catch(() => {});
  void avisarADiscord(resultado.id).catch(() => {});

  return NextResponse.json({ id: resultado.id }, { status: 201 });
}
