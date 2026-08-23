import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { anotar } from "@/lib/auditoria";

const Cuerpo = z.object({
  token: z.string().min(20),
  password: z.string().min(8, "La contraseña necesita al menos 8 caracteres."),
});

// Canjear la invitación: fija la contraseña y quema el token.
//
// No lleva sesión —quien llega aquí todavía no tiene cuenta activa— así que lo
// único que autoriza es el token, y por eso se invalida en la misma operación
// que fija la contraseña: si se hicieran en dos pasos, un enlace reenviado por
// error podría usarse dos veces.
export async function POST(peticion: Request) {
  const validado = Cuerpo.safeParse(await peticion.json().catch(() => null));
  if (!validado.success) {
    return NextResponse.json(
      { error: validado.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 },
    );
  }

  const persona = await prisma.user.findUnique({
    where: { tokenInvitacion: validado.data.token },
    select: {
      id: true,
      nombre: true,
      companyId: true,
      activo: true,
      invitacionExpira: true,
    },
  });

  if (
    !persona ||
    !persona.activo ||
    !persona.invitacionExpira ||
    persona.invitacionExpira < new Date()
  ) {
    return NextResponse.json(
      { error: "Esta invitación ya no vale. Pídele a tu administrador que te mande otra." },
      { status: 410 },
    );
  }

  await prisma.user.update({
    where: { id: persona.id },
    data: {
      passwordHash: await bcrypt.hash(validado.data.password, 10),
      // El correo se da por verificado: llegar hasta aquí exige tener el enlace
      // que se mandó a esa dirección.
      emailVerified: new Date(),
      primerAcceso: new Date(),
      tokenInvitacion: null,
      invitacionExpira: null,
    },
  });

  // El actor es la propia persona, pero todavía no tiene sesión: se anota con
  // su id, que es lo que hay, y sin actorId de administrador porque no lo hubo.
  await anotar({
    companyId: persona.companyId,
    actorId: persona.id,
    actorNombre: persona.nombre,
    accion: "INVITACION_ACEPTADA",
    objetivoId: persona.id,
    objetivoNombre: persona.nombre,
  });

  return NextResponse.json({ ok: true });
}
