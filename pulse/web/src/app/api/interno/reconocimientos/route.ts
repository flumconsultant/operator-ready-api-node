import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { autorizada } from "@/lib/interna";
import { crearReconocimiento } from "@/lib/reconocimientos";
import { analizarPendientes } from "@/lib/ia/sentimiento";

// Crear un reconocimiento desde Discord.
//
// El bot manda identidades de Discord, no de Pulse: es lo único que tiene. La
// traducción a usuarios ocurre aquí, del lado que sí conoce la base de datos.

const Cuerpo = z.object({
  guildId: z.string().min(1),
  deDiscordId: z.string().min(1),
  paraDiscordId: z.string().min(1),
  valueId: z.string().min(1),
  mensaje: z.string().trim().min(10).max(1000),
});

export async function POST(peticion: Request) {
  if (!autorizada(peticion)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const validado = Cuerpo.safeParse(await peticion.json().catch(() => null));
  if (!validado.success) {
    return NextResponse.json(
      { error: "El mensaje debe tener entre 10 y 1000 caracteres." },
      { status: 400 },
    );
  }
  const datos = validado.data;

  const empresa = await prisma.company.findUnique({
    where: { discordGuildId: datos.guildId },
    select: { id: true },
  });
  if (!empresa) {
    return NextResponse.json(
      { error: "Este servidor no está vinculado a ninguna empresa de Pulse." },
      { status: 404 },
    );
  }

  const [de, para] = await Promise.all([
    prisma.user.findFirst({
      where: { companyId: empresa.id, discordId: datos.deDiscordId, activo: true },
      select: { id: true },
    }),
    prisma.user.findFirst({
      where: { companyId: empresa.id, discordId: datos.paraDiscordId, activo: true },
      select: { id: true, nombre: true },
    }),
  ]);

  if (!de) {
    return NextResponse.json(
      {
        error:
          "Tu cuenta de Discord no está enlazada con Pulse. Pídele a tu administrador que la vincule.",
      },
      { status: 403 },
    );
  }
  if (!para) {
    return NextResponse.json(
      { error: "Esa persona todavía no tiene su Discord enlazado con Pulse." },
      { status: 404 },
    );
  }

  const resultado = await crearReconocimiento({
    companyId: empresa.id,
    deUserId: de.id,
    paraUserIds: [para.id],
    valueId: datos.valueId,
    mensaje: datos.mensaje,
    canal: "DISCORD",
  });

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  void analizarPendientes(empresa.id, 5).catch(() => {});

  return NextResponse.json(
    { id: resultado.id, para: para.nombre },
    { status: 201 },
  );
}
