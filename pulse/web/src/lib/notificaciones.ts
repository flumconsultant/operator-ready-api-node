import type { TipoNotificacion } from "@prisma/client";

import { prisma } from "./prisma";

// Las notificaciones de dentro de la aplicación: la campana.
//
// Se crean siempre desde aquí y nunca desde una página, para que se cumpla en
// un solo sitio la regla que más se olvida: **nadie se notifica a sí mismo**.
// Sin eso, quien comenta su propio reconocimiento se lleva un punto rojo por
// su propio comentario, y el contador deja de significar nada en una semana.

export async function notificar(datos: {
  userId: string;
  actorId: string | null;
  recognitionId?: string;
  tipo: TipoNotificacion;
  texto: string;
  enlace: string;
}) {
  if (datos.actorId && datos.actorId === datos.userId) return null;

  return prisma.notification.create({
    data: {
      userId: datos.userId,
      actorId: datos.actorId,
      recognitionId: datos.recognitionId,
      tipo: datos.tipo,
      texto: datos.texto,
      enlace: datos.enlace,
    },
  });
}

/// Quiénes deben enterarse de que hay algo nuevo en un reconocimiento: la
/// persona reconocida, quien lo escribió y todos los que ya comentaron. Es lo
/// que hace que una conversación siga viva en vez de morir en el primer
/// comentario que nadie ve.
export async function participantes(recognitionId: string) {
  const r = await prisma.recognition.findUnique({
    where: { id: recognitionId },
    select: {
      deUserId: true,
      paraUserId: true,
      comentarios: { select: { userId: true }, distinct: ["userId"] },
    },
  });
  if (!r) return [];

  return [
    ...new Set([
      r.deUserId,
      r.paraUserId,
      ...r.comentarios.map((c) => c.userId),
    ]),
  ];
}

export function sinLeer(userId: string) {
  return prisma.notification.count({ where: { userId, leidaEn: null } });
}

export function listar(userId: string, limite = 40) {
  return prisma.notification.findMany({
    where: { userId },
    include: {
      actor: { select: { id: true, nombre: true, imagen: true } },
    },
    orderBy: { creadaEn: "desc" },
    take: limite,
  });
}

export function marcarTodasLeidas(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, leidaEn: null },
    data: { leidaEn: new Date() },
  });
}
