import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Un solo endpoint que alterna: si ya reaccionaste, quita; si no, pone. El
// cliente no lleva la cuenta de en qué estado estaba, y así dos pulsaciones
// rápidas no dejan reacciones duplicadas.
export async function POST(peticion: Request) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const cuerpo = (await peticion.json().catch(() => ({}))) as {
    recognitionId?: string;
  };
  if (!cuerpo.recognitionId) {
    return NextResponse.json({ error: "Falta el reconocimiento." }, { status: 400 });
  }

  // Comprobar la empresa aquí evita que alguien reaccione a un reconocimiento
  // de otra compañía pasando un id a mano.
  const reconocimiento = await prisma.recognition.findFirst({
    where: { id: cuerpo.recognitionId, companyId: sesion.user.companyId },
    select: { id: true },
  });
  if (!reconocimiento) {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

  const clave = {
    recognitionId_userId: {
      recognitionId: reconocimiento.id,
      userId: sesion.user.id,
    },
  };
  const existente = await prisma.reaction.findUnique({ where: clave });

  if (existente) {
    await prisma.reaction.delete({ where: clave });
    return NextResponse.json({ reaccionado: false });
  }

  await prisma.reaction.create({
    data: { recognitionId: reconocimiento.id, userId: sesion.user.id },
  });
  return NextResponse.json({ reaccionado: true });
}
