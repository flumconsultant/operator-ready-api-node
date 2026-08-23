import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notificar } from "@/lib/notificaciones";

// Las cinco reacciones que la interfaz ofrece. Se comprueba aquí también: el
// cliente puede mandar lo que quiera, y sin esta lista cualquiera podría dejar
// un emoji arbitrario en el feed de su empresa.
const PERMITIDAS = new Set(["👏", "❤️", "🔥", "🎉", "💡"]);

export async function POST(peticion: Request) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const cuerpo = (await peticion.json().catch(() => ({}))) as {
    recognitionId?: string;
    emoji?: string;
  };

  const emoji = cuerpo.emoji ?? "👏";
  if (!cuerpo.recognitionId || !PERMITIDAS.has(emoji)) {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  // Comprobar la empresa aquí evita reaccionar a un reconocimiento de otra
  // compañía pasando un id a mano.
  const reconocimiento = await prisma.recognition.findFirst({
    where: {
      id: cuerpo.recognitionId,
      companyId: sesion.user.companyId,
      // No se reacciona a algo retirado.
      retiradoEn: null,
    },
    select: {
      id: true,
      deUserId: true,
      destinatarios: { select: { userId: true } },
    },
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

  // Tres estados: no había nada → se pone; había la misma → se quita; había
  // otra → se cambia. Una persona tiene una sola reacción por publicación.
  if (existente?.emoji === emoji) {
    await prisma.reaction.delete({ where: clave });
    return NextResponse.json({ emoji: null });
  }

  await prisma.reaction.upsert({
    where: clave,
    create: {
      recognitionId: reconocimiento.id,
      userId: sesion.user.id,
      emoji,
    },
    update: { emoji },
  });

  // Solo se avisa la primera vez. Quien cambia de aplauso a corazón no genera
  // una notificación nueva: sería ruido por un gesto que ya se avisó.
  if (!existente) {
    const quien = await prisma.user.findUnique({
      where: { id: sesion.user.id },
      select: { nombre: true },
    });
    const nombre = quien?.nombre ?? "Alguien";

    // Se avisa a los dos lados. Antes solo llegaba a la persona reconocida, y
    // eso dejaba fuera a quien se había tomado la molestia de escribirlo: si
    // nadie le dice que su reconocimiento gustó, deja de escribirlos.
    // `notificar` ya descarta al propio actor, así que quien reacciona a algo
    // suyo no se autoavisa, y el Set evita duplicar cuando ambos coinciden.
    const destinatarios = new Set([
      ...reconocimiento.destinatarios.map((d) => d.userId),
      reconocimiento.deUserId,
    ]);

    await Promise.all(
      [...destinatarios].map((userId) =>
        notificar({
          userId,
          actorId: sesion.user.id,
          recognitionId: reconocimiento.id,
          tipo: "REACCION",
          texto:
            userId === reconocimiento.deUserId
              ? `${nombre} reaccionó al reconocimiento que escribiste`
              : `${nombre} reaccionó al reconocimiento que recibiste`,
          enlace: `feed/${reconocimiento.id}`,
        }),
      ),
    );
  }

  return NextResponse.json({ emoji });
}
