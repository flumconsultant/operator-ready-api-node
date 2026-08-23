import { z } from "zod";
import { Canal, Prisma } from "@prisma/client";

import { prisma } from "./prisma";
import { notificar, participantes } from "./notificaciones";
import { celebracionesEntre, type Celebracion } from "./celebraciones";

// Crear un reconocimiento, leer el feed y comentar. Lo usan la web y el bot de
// Discord, y por eso vive aquí y no dentro de una ruta: las reglas —no
// reconocerse a sí mismo, el valor tiene que ser de tu empresa, la otra persona
// también— tienen que ser las mismas vengan de donde vengan.

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
  imagen?: string | null;
  canal: Canal;
}): Promise<ResultadoCreacion> {
  if (datos.deUserId === datos.paraUserId) {
    return { ok: false, error: "No puedes reconocerte a ti mismo." };
  }

  const [destino, valor, autor] = await Promise.all([
    prisma.user.findFirst({
      where: { id: datos.paraUserId, companyId: datos.companyId, activo: true },
      select: { id: true },
    }),
    prisma.value.findFirst({
      where: { id: datos.valueId, companyId: datos.companyId, activo: true },
      select: { id: true, nombre: true },
    }),
    prisma.user.findUnique({
      where: { id: datos.deUserId },
      select: { nombre: true },
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
      imagen: datos.imagen ?? null,
      canal: datos.canal,
    },
    select: { id: true },
  });

  await notificar({
    userId: datos.paraUserId,
    actorId: datos.deUserId,
    recognitionId: creado.id,
    tipo: "RECONOCIMIENTO_RECIBIDO",
    texto: `${autor?.nombre ?? "Alguien"} te reconoció por ${valor.nombre}`,
    enlace: `/feed/${creado.id}`,
  });

  return { ok: true, id: creado.id };
}

// ---- Comentarios ---------------------------------------------------------

export const NuevoComentario = z.object({
  recognitionId: z.string().min(1),
  texto: z.string().trim().min(1, "Escribe algo.").max(600, "Máximo 600 caracteres."),
});

export async function comentar(datos: {
  companyId: string;
  userId: string;
  recognitionId: string;
  texto: string;
}): Promise<ResultadoCreacion> {
  // El filtro por empresa impide comentar en un reconocimiento de otra
  // compañía pasando su id a mano.
  const reconocimiento = await prisma.recognition.findFirst({
    where: { id: datos.recognitionId, companyId: datos.companyId },
    select: { id: true },
  });
  if (!reconocimiento) return { ok: false, error: "No encontrado." };

  // Se leen los participantes ANTES de insertar: si no, quien comenta aparece
  // en su propia lista y se ahorra una comprobación que `notificar` ya hace,
  // pero además se ahorra una consulta.
  const aAvisar = await participantes(reconocimiento.id);

  const comentario = await prisma.comment.create({
    data: {
      recognitionId: reconocimiento.id,
      userId: datos.userId,
      texto: datos.texto.trim(),
    },
    select: { id: true, user: { select: { nombre: true } } },
  });

  await Promise.all(
    aAvisar.map((userId) =>
      notificar({
        userId,
        actorId: datos.userId,
        recognitionId: reconocimiento.id,
        tipo: "COMENTARIO",
        texto: `${comentario.user.nombre} comentó un reconocimiento`,
        enlace: `/feed/${reconocimiento.id}`,
      }),
    ),
  );

  return { ok: true, id: comentario.id };
}

// ---- Lectura -------------------------------------------------------------

export const inclusionFeed = {
  de: { select: { id: true, nombre: true, imagen: true, equipo: true, cargo: true } },
  para: { select: { id: true, nombre: true, imagen: true, equipo: true, cargo: true } },
  valor: { select: { id: true, nombre: true, icono: true } },
  reacciones: {
    select: {
      emoji: true,
      user: { select: { id: true, nombre: true } },
    },
  },
  comentarios: {
    include: { user: { select: { id: true, nombre: true, imagen: true } } },
    orderBy: { creadoEn: "asc" },
  },
} satisfies Prisma.RecognitionInclude;

export type FilaFeed = Prisma.RecognitionGetPayload<{
  include: typeof inclusionFeed;
}>;

/// Lo que se pinta en el feed: reconocimientos y celebraciones, ordenados
/// juntos por fecha. El tipo es una unión y no dos listas porque el feed es
/// una sola columna cronológica; separarlas obligaría a ordenar en el
/// componente, que es donde peor se hace.
export type PresentacionFeed = {
  id: string;
  texto: string;
  creadaEn: Date;
  user: {
    id: string;
    nombre: string;
    imagen: string | null;
    equipo: string | null;
    cargo: string | null;
  };
};

export type EntradaFeed =
  | { clase: "reconocimiento"; fecha: Date; reconocimiento: FilaFeed }
  | { clase: "celebracion"; fecha: Date; celebracion: Celebracion }
  | { clase: "presentacion"; fecha: Date; presentacion: PresentacionFeed };

export async function feed(
  companyId: string,
  opciones: { limite?: number; antesDe?: Date } = {},
): Promise<{ entradas: EntradaFeed[]; hayMas: boolean; cursor: string | null }> {
  const limite = opciones.limite ?? 20;

  const reconocimientos = await prisma.recognition.findMany({
    where: {
      companyId,
      ...(opciones.antesDe ? { creadoEn: { lt: opciones.antesDe } } : {}),
    },
    include: inclusionFeed,
    orderBy: { creadoEn: "desc" },
    // Se pide uno de más para saber si hay página siguiente sin contar el
    // total, que en una tabla que solo crece es una consulta cara y para nada.
    take: limite + 1,
  });

  const hayMas = reconocimientos.length > limite;
  const pagina = hayMas ? reconocimientos.slice(0, limite) : reconocimientos;

  // Las celebraciones se buscan en el mismo tramo de tiempo que cubre esta
  // página de reconocimientos, para que caigan intercaladas donde toca.
  const hasta = opciones.antesDe ?? new Date();
  const desde = pagina.length
    ? pagina[pagina.length - 1].creadoEn
    : new Date(hasta.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [celebraciones, presentaciones] = await Promise.all([
    celebracionesEntre(companyId, desde, hasta),
    // Las presentaciones caen en el mismo tramo de tiempo que la página, para
    // que aparezcan donde les toca y no todas arriba.
    prisma.presentacion.findMany({
      where: { companyId, creadaEn: { gte: desde, lte: hasta } },
      include: {
        user: {
          select: { id: true, nombre: true, imagen: true, equipo: true, cargo: true },
        },
      },
      orderBy: { creadaEn: "desc" },
    }),
  ]);

  const entradas: EntradaFeed[] = [
    ...pagina.map(
      (r): EntradaFeed => ({
        clase: "reconocimiento",
        fecha: r.creadoEn,
        reconocimiento: r,
      }),
    ),
    ...celebraciones.map(
      (c): EntradaFeed => ({ clase: "celebracion", fecha: c.fecha, celebracion: c }),
    ),
    ...presentaciones.map(
      (p): EntradaFeed => ({
        clase: "presentacion",
        fecha: p.creadaEn,
        presentacion: p,
      }),
    ),
  ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  return {
    entradas,
    hayMas,
    cursor: hayMas ? pagina[pagina.length - 1].creadoEn.toISOString() : null,
  };
}

export function reconocimiento(companyId: string, id: string) {
  return prisma.recognition.findFirst({
    where: { id, companyId },
    include: inclusionFeed,
  });
}

/// El muro de una persona: lo que ha recibido, para su perfil.
export function muro(companyId: string, userId: string, limite = 20) {
  return prisma.recognition.findMany({
    where: { companyId, paraUserId: userId },
    include: inclusionFeed,
    orderBy: { creadoEn: "desc" },
    take: limite,
  });
}
