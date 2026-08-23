import { z } from "zod";
import { Canal, Prisma } from "@prisma/client";

import { prisma } from "./prisma";
import { notificar, participantes } from "./notificaciones";
import { celebracionesEntre, type Celebracion } from "./celebraciones";
import { aTextoPlano, idsMencionados, largoVisible } from "./menciones";

// Crear un reconocimiento, leer el feed, comentar y retirar. Lo usan la web y el
// bot de Discord, y por eso vive aquí y no dentro de una ruta: las reglas —no
// reconocerse a sí mismo, el valor tiene que ser de tu empresa, las personas
// también— tienen que ser las mismas vengan de donde vengan.

const MENSAJE_MIN = 10;
const MENSAJE_MAX = 1000;
/// Un kudo a más de diez personas deja de ser un reconocimiento y pasa a ser un
/// correo circular. El límite está para que la restricción sea explícita y no
/// una consulta que se cae con doscientos destinatarios.
export const MAX_DESTINATARIOS = 10;

export const NuevoReconocimiento = z.object({
  paraUserIds: z
    .array(z.string().min(1))
    .min(1, "Elige al menos a una persona.")
    .max(MAX_DESTINATARIOS, `No puedes reconocer a más de ${MAX_DESTINATARIOS} personas a la vez.`)
    // Marcar a la misma persona dos veces en la interfaz no debería ser un
    // error, simplemente cuenta una.
    .transform((ids) => [...new Set(ids)]),
  valueId: z.string().min(1),
  mensaje: z
    .string()
    .trim()
    .min(1, "Escribe qué hizo.")
    .max(MENSAJE_MAX + 400, "El mensaje es demasiado largo.")
    // El largo se mide sobre el texto que se lee, no sobre el guardado: una
    // mención ocupa cuarenta caracteres del formato interno y ninguno para
    // quien escribe.
    .refine((m) => largoVisible(m) >= MENSAJE_MIN, {
      message: "Cuenta qué hizo. Con menos de diez caracteres no se entiende.",
    })
    .refine((m) => largoVisible(m) <= MENSAJE_MAX, {
      message: `Máximo ${MENSAJE_MAX} caracteres.`,
    }),
});

export type ResultadoCreacion =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function crearReconocimiento(datos: {
  companyId: string;
  deUserId: string;
  paraUserIds: string[];
  valueId: string;
  mensaje: string;
  imagen?: string | null;
  canal: Canal;
}): Promise<ResultadoCreacion> {
  const destinatarios = [...new Set(datos.paraUserIds)].filter(
    (id) => id !== datos.deUserId,
  );

  if (destinatarios.length === 0) {
    return {
      ok: false,
      error:
        datos.paraUserIds.length > 0
          ? "No puedes reconocerte a ti mismo."
          : "Elige al menos a una persona.",
    };
  }
  if (destinatarios.length > MAX_DESTINATARIOS) {
    return {
      ok: false,
      error: `No puedes reconocer a más de ${MAX_DESTINATARIOS} personas a la vez.`,
    };
  }

  const [personas, valor, autor] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: destinatarios }, companyId: datos.companyId, activo: true },
      select: { id: true, nombre: true },
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

  if (personas.length !== destinatarios.length) {
    return { ok: false, error: "Alguna de esas personas no está en tu empresa." };
  }
  if (!valor) return { ok: false, error: "Ese valor no existe o está desactivado." };

  const creado = await prisma.recognition.create({
    data: {
      companyId: datos.companyId,
      deUserId: datos.deUserId,
      valueId: datos.valueId,
      mensaje: datos.mensaje.trim(),
      imagen: datos.imagen ?? null,
      canal: datos.canal,
      destinatarios: { create: personas.map((p) => ({ userId: p.id })) },
    },
    select: { id: true },
  });

  const quien = autor?.nombre ?? "Alguien";

  await Promise.all([
    ...personas.map((p) =>
      notificar({
        userId: p.id,
        actorId: datos.deUserId,
        recognitionId: creado.id,
        tipo: "RECONOCIMIENTO_RECIBIDO",
        texto:
          personas.length === 1
            ? `${quien} te reconoció por ${valor.nombre}`
            : `${quien} os reconoció a ${personas.length} por ${valor.nombre}`,
        enlace: `/feed/${creado.id}`,
      }),
    ),
    avisarMencionados({
      companyId: datos.companyId,
      texto: datos.mensaje,
      actorId: datos.deUserId,
      actorNombre: quien,
      recognitionId: creado.id,
      // A quien ya se avisó por ser destinatario no se le avisa dos veces por
      // aparecer también mencionado en el texto.
      excluir: personas.map((p) => p.id),
    }),
  ]);

  return { ok: true, id: creado.id };
}

/// Avisa a quien se menciona en un texto, si está en la empresa y activo.
async function avisarMencionados(datos: {
  companyId: string;
  texto: string;
  actorId: string;
  actorNombre: string;
  recognitionId: string;
  excluir?: string[];
}) {
  const ids = idsMencionados(datos.texto).filter(
    (id) => !datos.excluir?.includes(id),
  );
  if (ids.length === 0) return;

  // El filtro por empresa importa: el texto lo escribe una persona y podría
  // llevar el id de alguien de otra compañía, pegado a mano.
  const mencionados = await prisma.user.findMany({
    where: { id: { in: ids }, companyId: datos.companyId, activo: true },
    select: { id: true },
  });

  await Promise.all(
    mencionados.map((m) =>
      notificar({
        userId: m.id,
        actorId: datos.actorId,
        recognitionId: datos.recognitionId,
        tipo: "MENCION",
        texto: `${datos.actorNombre} te mencionó`,
        enlace: `/feed/${datos.recognitionId}`,
      }),
    ),
  );
}

// ---- Comentarios ---------------------------------------------------------

export const NuevoComentario = z.object({
  recognitionId: z.string().min(1),
  texto: z
    .string()
    .trim()
    .min(1, "Escribe algo.")
    .max(1000, "El comentario es demasiado largo.")
    .refine((t) => largoVisible(t) <= 600, { message: "Máximo 600 caracteres." }),
});

export async function comentar(datos: {
  companyId: string;
  userId: string;
  recognitionId: string;
  texto: string;
}): Promise<ResultadoCreacion> {
  // El filtro por empresa impide comentar en un reconocimiento de otra
  // compañía pasando su id a mano. El de retirada impide seguir comentando en
  // algo que ya no se ve.
  const reconocimiento = await prisma.recognition.findFirst({
    where: { id: datos.recognitionId, companyId: datos.companyId, retiradoEn: null },
    select: { id: true },
  });
  if (!reconocimiento) return { ok: false, error: "No encontrado." };

  // Se leen los participantes ANTES de insertar: si no, quien comenta aparece
  // en su propia lista.
  const aAvisar = await participantes(reconocimiento.id);

  const comentario = await prisma.comment.create({
    data: {
      recognitionId: reconocimiento.id,
      userId: datos.userId,
      texto: datos.texto.trim(),
    },
    select: { id: true, user: { select: { nombre: true } } },
  });

  const quien = comentario.user.nombre;
  const mencionados = idsMencionados(datos.texto);

  await Promise.all([
    // A quien está mencionado se le avisa de la mención, que dice más, y no del
    // comentario genérico.
    ...aAvisar
      .filter((userId) => !mencionados.includes(userId))
      .map((userId) =>
        notificar({
          userId,
          actorId: datos.userId,
          recognitionId: reconocimiento.id,
          tipo: "COMENTARIO",
          texto: `${quien} comentó un reconocimiento`,
          enlace: `/feed/${reconocimiento.id}`,
        }),
      ),
    avisarMencionados({
      companyId: datos.companyId,
      texto: datos.texto,
      actorId: datos.userId,
      actorNombre: quien,
      recognitionId: reconocimiento.id,
    }),
  ]);

  return { ok: true, id: comentario.id };
}

// ---- Moderación ----------------------------------------------------------

/// Retirar una publicación. La puede retirar su autor o un administrador.
///
/// No se borra. Un borrado se llevaría por delante los comentarios y las
/// reacciones de otras personas, y el histórico de por qué se reconocía a la
/// gente. Retirado deja de verse en el feed y deja de contar en las métricas.
export async function retirarReconocimiento(datos: {
  companyId: string;
  actorId: string;
  esAdmin: boolean;
  recognitionId: string;
  motivo: string;
}) {
  const r = await prisma.recognition.findFirst({
    where: { id: datos.recognitionId, companyId: datos.companyId },
    select: { id: true, deUserId: true, retiradoEn: true },
  });
  if (!r) return { ok: false as const, error: "No encontrado." };
  if (r.retiradoEn) return { ok: false as const, error: "Ya estaba retirado." };

  if (!datos.esAdmin && r.deUserId !== datos.actorId) {
    return {
      ok: false as const,
      error: "Solo puede retirarlo quien lo escribió o un administrador.",
    };
  }

  await prisma.recognition.update({
    where: { id: r.id },
    data: {
      retiradoEn: new Date(),
      retiradoPorId: datos.actorId,
      motivoRetirada: datos.motivo.trim().slice(0, 300) || null,
    },
  });

  return { ok: true as const, autorId: r.deUserId };
}

// ---- Lectura -------------------------------------------------------------

const persona = {
  select: { id: true, nombre: true, imagen: true, equipo: true, cargo: true },
} as const;

export const inclusionFeed = {
  de: persona,
  destinatarios: { include: { user: persona } },
  valor: { select: { id: true, nombre: true, icono: true } },
  reacciones: {
    select: { emoji: true, user: { select: { id: true, nombre: true } } },
  },
  comentarios: {
    include: { user: { select: { id: true, nombre: true, imagen: true } } },
    orderBy: { creadoEn: "asc" },
  },
} satisfies Prisma.RecognitionInclude;

export type FilaFeed = Prisma.RecognitionGetPayload<{
  include: typeof inclusionFeed;
}>;

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

/// Lo retirado no se ve. Se aplica en todas las lecturas desde esta constante
/// para que añadir una consulta nueva no signifique acordarse de filtrarlo.
export const VISIBLE = { retiradoEn: null } as const;

export async function feed(
  companyId: string,
  opciones: { limite?: number; antesDe?: Date } = {},
): Promise<{ entradas: EntradaFeed[]; hayMas: boolean; cursor: string | null }> {
  const limite = opciones.limite ?? 20;

  const reconocimientos = await prisma.recognition.findMany({
    where: {
      companyId,
      ...VISIBLE,
      ...(opciones.antesDe ? { creadoEn: { lt: opciones.antesDe } } : {}),
    },
    include: inclusionFeed,
    orderBy: { creadoEn: "desc" },
    // Uno de más para saber si hay página siguiente sin contar el total, que en
    // una tabla que solo crece es una consulta cara y para nada.
    take: limite + 1,
  });

  const hayMas = reconocimientos.length > limite;
  const pagina = hayMas ? reconocimientos.slice(0, limite) : reconocimientos;

  const hasta = opciones.antesDe ?? new Date();
  const desde = pagina.length
    ? pagina[pagina.length - 1].creadoEn
    : new Date(hasta.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [celebraciones, presentaciones] = await Promise.all([
    celebracionesEntre(companyId, desde, hasta),
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
    where: { id, companyId, ...VISIBLE },
    include: inclusionFeed,
  });
}

/// El muro de una persona: lo que ha recibido.
export function muro(companyId: string, userId: string, limite = 20) {
  return prisma.recognition.findMany({
    where: { companyId, ...VISIBLE, destinatarios: { some: { userId } } },
    include: inclusionFeed,
    orderBy: { creadoEn: "desc" },
    take: limite,
  });
}

/// El texto legible de un reconocimiento, sin el formato de las menciones.
/// Es lo que se manda a Discord y a la API de Claude.
export const textoLegible = aTextoPlano;
