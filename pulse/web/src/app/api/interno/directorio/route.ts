import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { autorizada } from "@/lib/interna";

// Lo que el bot necesita para montar el comando /reconocer en un servidor:
// quién es quién y qué valores hay. Se consulta por guild de Discord, que es lo
// único que el bot conoce.
export async function GET(peticion: Request) {
  if (!autorizada(peticion)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const guildId = new URL(peticion.url).searchParams.get("guildId");
  if (!guildId) {
    return NextResponse.json({ error: "Falta guildId." }, { status: 400 });
  }

  const empresa = await prisma.company.findUnique({
    where: { discordGuildId: guildId },
    select: {
      id: true,
      nombre: true,
      valores: {
        where: { activo: true },
        orderBy: [{ orden: "asc" }, { nombre: "asc" }],
        select: { id: true, nombre: true, icono: true },
      },
    },
  });

  if (!empresa) {
    return NextResponse.json(
      { error: "Este servidor de Discord no está vinculado a ninguna empresa." },
      { status: 404 },
    );
  }

  return NextResponse.json(empresa);
}
