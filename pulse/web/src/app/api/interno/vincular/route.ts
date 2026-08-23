import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { autorizada } from "@/lib/interna";

// Canjear el código de vinculación que el bot recibe en /vincular.
//
// El código lo genera la persona desde su perfil en Pulse, donde ya está
// autenticada. Eso es lo que hace segura la operación: el bot solo sabe qué
// cuenta de Discord ha escrito el comando, y sin el código no podría demostrar
// que esa cuenta pertenece a nadie en particular. Con este orden, quien enlaza
// tiene que haber entrado antes a Pulse.

const Cuerpo = z.object({
  guildId: z.string().min(1),
  discordId: z.string().min(1),
  codigo: z.string().trim().min(4).max(20),
});

export async function POST(peticion: Request) {
  if (!autorizada(peticion)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const validado = Cuerpo.safeParse(await peticion.json().catch(() => null));
  if (!validado.success) {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }
  const { guildId, discordId, codigo } = validado.data;

  const empresa = await prisma.company.findUnique({
    where: { discordGuildId: guildId },
    select: { id: true, nombre: true },
  });
  if (!empresa) {
    return NextResponse.json(
      { error: "Este servidor no está vinculado a ninguna empresa de Pulse." },
      { status: 404 },
    );
  }

  const persona = await prisma.user.findFirst({
    // El código se compara en mayúsculas porque así se enseña y así lo
    // escribe la gente; se guarda ya normalizado.
    where: { codigoDiscord: codigo.toUpperCase(), companyId: empresa.id },
    select: {
      id: true,
      nombre: true,
      activo: true,
      codigoDiscordExpira: true,
      discordId: true,
    },
  });

  if (
    !persona ||
    !persona.activo ||
    !persona.codigoDiscordExpira ||
    persona.codigoDiscordExpira < new Date()
  ) {
    return NextResponse.json(
      { error: "Ese código no vale o ha caducado. Genera otro desde tu perfil en Pulse." },
      { status: 410 },
    );
  }

  // Una cuenta de Discord, una persona. Si no, dos personas podrían enlazar la
  // misma y los reconocimientos irían a quien no toca.
  const ocupada = await prisma.user.findFirst({
    where: { discordId, NOT: { id: persona.id } },
    select: { id: true },
  });
  if (ocupada) {
    return NextResponse.json(
      { error: "Esa cuenta de Discord ya está enlazada con otra persona." },
      { status: 409 },
    );
  }

  await prisma.user.update({
    where: { id: persona.id },
    data: { discordId, codigoDiscord: null, codigoDiscordExpira: null },
  });

  return NextResponse.json({ nombre: persona.nombre, empresa: empresa.nombre });
}
