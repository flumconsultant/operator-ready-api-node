import { z } from "zod";
import { Canal, Prisma } from "@prisma/client";

import { prisma } from "./prisma";

// Crear un reconocimiento. Lo usan la web y el bot de Discord, y por eso vive
// aquí y no dentro de una ruta: las reglas —no reconocerse a sí mismo, el valor
// tiene que ser de tu empresa, la otra persona también— tienen que ser las
// mismas vengan de donde vengan.

export const NuevoReconocimiento = z.object({
  paraUserId: z.string().min(1),
  valueId: z.string().min(1),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuenta qué hizo. Con menos de diez caracteres no se entiende.")
    .max(1000, "Máximo 1000 caracteres."),
});

export type ResultadoCreacion =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function crearReconocimiento(datos: {
  companyId: string;
  deUserId: string;
  paraUserId: string;
  valueId: string;
  mensaje: string;
  canal: Canal;
}): Promise<ResultadoCreacion> {
  if (datos.deUserId === datos.paraUserId) {
    return { ok: false, error: "No puedes reconocerte a ti mismo." };
  }

  const [destino, valor] = await Promise.all([
    prisma.user.findFirst({
      where: { id: datos.paraUserId, companyId: datos.companyId, activo: true },
      select: { id: true },
    }),
    prisma.value.findFirst({
      where: { id: datos.valueId, companyId: datos.companyId, activo: true },
      select: { id: true },
    }),
  ]);

  if (!destino) return { ok: false, error: "Esa persona no está en tu empresa." };
  if (!valor) return { ok: false, error: "Ese valor no existe o está desactivado." };

  const creado = await prisma.recognition.create({
    data: {
      companyId: datos.companyId,
      deUserId: datos.deUserId,
      paraUserId: datos.paraUserId,
      valueId: datos.valueId,
      mensaje: datos.mensaje.trim(),
      canal: datos.canal,
    },
    select: { id: true },
  });

  return { ok: true, id: creado.id };
}

export const inclusionFeed = {
  de: { select: { id: true, nombre: true, imagen: true, equipo: true } },
  para: { select: { id: true, nombre: true, imagen: true, equipo: true } },
  valor: { select: { id: true, nombre: true, emoji: true } },
  reacciones: { select: { userId: true, emoji: true } },
} satisfies Prisma.RecognitionInclude;

export async function feed(companyId: string, limite = 40, antesDe?: Date) {
  return prisma.recognition.findMany({
    where: {
      companyId,
      ...(antesDe ? { creadoEn: { lt: antesDe } } : {}),
    },
    include: inclusionFeed,
    orderBy: { creadoEn: "desc" },
    take: limite,
  });
}
