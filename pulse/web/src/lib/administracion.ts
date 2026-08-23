import { randomBytes } from "node:crypto";
import { z } from "zod";
import type { Rol } from "@prisma/client";

import { prisma } from "./prisma";
import { anotar, diferencias } from "./auditoria";

// Quién hace el cambio. Se pasa a cada función en vez de leerse de la sesión
// aquí dentro para que este módulo se pueda usar también desde un script o
// desde una importación masiva, donde no hay sesión que leer.
export type Actor = { id: string | null; nombre: string | null };

// Todo lo que hace un administrador: configurar su empresa y dar de alta a su
// gente. Vive aparte de las páginas porque las mismas reglas las van a
// necesitar una importación por CSV y, más adelante, una API.

// ---- Empresa -------------------------------------------------------------

export const DatosEmpresa = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio.").max(80),
  dominioCorreo: z
    .string()
    .trim()
    .toLowerCase()
    // Se acepta con y sin arroba porque la gente escribe las dos cosas.
    .transform((v) => v.replace(/^@/, ""))
    .refine((v) => v === "" || /^[a-z0-9.-]+\.[a-z]{2,}$/.test(v), {
      message: "Escribe un dominio como «empresa.com».",
    })
    .optional(),
  discordGuildId: z
    .string()
    .trim()
    .regex(/^\d*$/, "El ID de un servidor de Discord son solo números.")
    .optional(),
  discordCanalFeedId: z
    .string()
    .trim()
    .regex(/^\d*$/, "El ID de un canal de Discord son solo números.")
    .optional(),
  limiteIaMensual: z.coerce
    .number()
    .int()
    .min(0, "No puede ser negativo.")
    .max(1_000_000),
});

export async function guardarEmpresa(
  companyId: string,
  actor: Actor,
  datos: z.infer<typeof DatosEmpresa>,
  logo?: string,
) {
  const vacioANulo = (v?: string) => (v && v.length ? v : null);

  const antes = await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    select: {
      nombre: true,
      dominioCorreo: true,
      discordGuildId: true,
      discordCanalFeedId: true,
      limiteIaMensual: true,
      logo: true,
    },
  });

  // El guild de Discord es único en toda la instalación: dos empresas
  // apuntando al mismo servidor harían que los reconocimientos de una cayeran
  // en el feed de la otra.
  if (datos.discordGuildId) {
    const ocupado = await prisma.company.findFirst({
      where: { discordGuildId: datos.discordGuildId, NOT: { id: companyId } },
      select: { id: true },
    });
    if (ocupado) {
      return { ok: false as const, error: "Ese servidor de Discord ya está conectado a otra empresa." };
    }
  }

  const despues = {
    nombre: datos.nombre,
    dominioCorreo: vacioANulo(datos.dominioCorreo),
    discordGuildId: vacioANulo(datos.discordGuildId),
    discordCanalFeedId: vacioANulo(datos.discordCanalFeedId),
    limiteIaMensual: datos.limiteIaMensual,
    ...(logo ? { logo } : {}),
  };

  await prisma.company.update({ where: { id: companyId }, data: despues });

  const cambios = diferencias(antes, despues, {
    nombre: "nombre",
    dominioCorreo: "dominio de correo",
    discordGuildId: "servidor de Discord",
    discordCanalFeedId: "canal del feed",
    limiteIaMensual: "tope mensual de IA",
    logo: "logotipo",
  });

  // Un guardado que no cambió nada no se anota: llenaría el registro de ruido
  // cada vez que alguien abre el formulario y pulsa guardar por costumbre.
  if (cambios.length > 0) {
    await anotar({
      companyId,
      actorId: actor.id,
      actorNombre: actor.nombre,
      accion: "EMPRESA_ACTUALIZADA",
      objetivoNombre: despues.nombre,
      cambios,
    });
  }

  return { ok: true as const };
}

// ---- Personas ------------------------------------------------------------

export const NuevaPersona = z.object({
  nombre: z.string().trim().min(2, "Falta el nombre.").max(80),
  email: z.string().trim().toLowerCase().email("Ese correo no es válido."),
  rol: z.enum(["ADMIN", "MANAGER", "COLABORADOR"]).default("COLABORADOR"),
  equipo: z.string().trim().max(60).optional(),
  cargo: z.string().trim().max(80).optional(),
});

export type ResultadoAlta =
  | { ok: true; id: string; enlace: string }
  | { ok: false; error: string };

/// Da de alta a una persona y devuelve su enlace de invitación.
///
/// El enlace es un mecanismo propio y no el magic link de Auth.js. La razón es
/// práctica: en un piloto sin servidor de correo, el administrador tiene que
/// poder copiar el enlace y mandarlo por WhatsApp. Con el magic link eso no se
/// puede — el token se genera al pedirlo y se manda por correo o no existe.
export async function invitarPersona(
  companyId: string,
  actor: Actor,
  datos: z.infer<typeof NuevaPersona>,
  appUrl: string,
): Promise<ResultadoAlta> {
  const existente = await prisma.user.findUnique({
    where: { email: datos.email },
    select: { id: true, companyId: true },
  });

  if (existente) {
    return {
      ok: false,
      error:
        existente.companyId === companyId
          ? "Esa persona ya está en tu empresa."
          : "Ese correo ya está registrado en otra empresa.",
    };
  }

  const token = randomBytes(32).toString("base64url");

  const creada = await prisma.user.create({
    data: {
      companyId,
      nombre: datos.nombre,
      email: datos.email,
      rol: datos.rol as Rol,
      equipo: datos.equipo || null,
      cargo: datos.cargo || null,
      tokenInvitacion: token,
      // Catorce días: suficiente para unas vacaciones, poco para que un enlace
      // olvidado en un chat siga sirviendo dentro de un año.
      invitacionExpira: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    select: { id: true },
  });

  await anotar({
    companyId,
    actorId: actor.id,
    actorNombre: actor.nombre,
    accion: "PERSONA_INVITADA",
    objetivoId: creada.id,
    objetivoNombre: datos.nombre,
    cambios: [
      { campo: "correo", antes: null, despues: datos.email },
      { campo: "permisos", antes: null, despues: datos.rol },
      { campo: "equipo", antes: null, despues: datos.equipo || null },
    ],
  });

  return { ok: true, id: creada.id, enlace: `${appUrl}/invitacion/${token}` };
}

/// Vuelve a generar el enlace. El anterior deja de valer en el momento: si se
/// reenvía una invitación suele ser porque la primera acabó donde no debía.
export async function renovarInvitacion(
  companyId: string,
  actor: Actor,
  userId: string,
  appUrl: string,
): Promise<ResultadoAlta> {
  const persona = await prisma.user.findFirst({
    where: { id: userId, companyId },
    select: { id: true, nombre: true, passwordHash: true, primerAcceso: true },
  });
  if (!persona) return { ok: false, error: "No encontrada." };
  if (persona.primerAcceso) {
    return { ok: false, error: "Esa persona ya entró: puede acceder con su contraseña o pedir un enlace desde la portada." };
  }

  const token = randomBytes(32).toString("base64url");
  await prisma.user.update({
    where: { id: persona.id },
    data: {
      tokenInvitacion: token,
      invitacionExpira: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  await anotar({
    companyId,
    actorId: actor.id,
    actorNombre: actor.nombre,
    accion: "INVITACION_RENOVADA",
    objetivoId: persona.id,
    objetivoNombre: persona.nombre,
  });

  return { ok: true, id: persona.id, enlace: `${appUrl}/invitacion/${token}` };
}

/// Cambios sobre una persona ya existente. El correo no se toca: es la
/// identidad de la cuenta y cambiarlo silenciosamente rompe su acceso.
export const CambiosPersona = z.object({
  userId: z.string().min(1),
  rol: z.enum(["ADMIN", "MANAGER", "COLABORADOR"]),
  equipo: z.string().trim().max(60).optional(),
  cargo: z.string().trim().max(80).optional(),
  discordId: z
    .string()
    .trim()
    .regex(/^\d*$/, "El ID de Discord son solo números.")
    .optional(),
});

export async function guardarPersona(
  companyId: string,
  actor: Actor,
  datos: z.infer<typeof CambiosPersona>,
) {
  const persona = await prisma.user.findFirst({
    where: { id: datos.userId, companyId },
    select: { id: true, nombre: true, rol: true, equipo: true, cargo: true, discordId: true },
  });
  if (!persona) return { ok: false as const, error: "No encontrada." };

  // Nadie puede quitarse a sí mismo el rol de administrador: es la forma más
  // rápida de dejar una empresa sin nadie que pueda administrarla.
  if (persona.id === actor.id && datos.rol !== "ADMIN") {
    return { ok: false as const, error: "No puedes quitarte a ti mismo el rol de administrador." };
  }

  if (datos.discordId) {
    const ocupado = await prisma.user.findFirst({
      where: { discordId: datos.discordId, NOT: { id: persona.id } },
      select: { id: true },
    });
    if (ocupado) {
      return { ok: false as const, error: "Ese ID de Discord ya está enlazado a otra persona." };
    }
  }

  const despues = {
    rol: datos.rol as Rol,
    equipo: datos.equipo || null,
    cargo: datos.cargo || null,
    discordId: datos.discordId || null,
  };

  await prisma.user.update({ where: { id: persona.id }, data: despues });

  const cambios = diferencias(persona, despues, {
    rol: "permisos",
    equipo: "equipo",
    cargo: "cargo",
    discordId: "ID de Discord",
  });

  if (cambios.length > 0) {
    await anotar({
      companyId,
      actorId: actor.id,
      actorNombre: actor.nombre,
      accion: "PERSONA_EDITADA",
      objetivoId: persona.id,
      objetivoNombre: persona.nombre,
      cambios,
    });
  }

  return { ok: true as const };
}

/// Desactivar en vez de borrar. Un borrado se llevaría por delante todos los
/// reconocimientos que esa persona dio y recibió, y con ellos el histórico de
/// la empresa. Quien se va del equipo deja de entrar; lo que escribió se queda.
export async function cambiarEstado(
  companyId: string,
  actor: Actor,
  userId: string,
  activo: boolean,
) {
  if (userId === actor.id) {
    return { ok: false as const, error: "No puedes desactivarte a ti mismo." };
  }

  const persona = await prisma.user.findFirst({
    where: { id: userId, companyId },
    select: { id: true, nombre: true },
  });
  if (!persona) return { ok: false as const, error: "No encontrada." };

  // Si es el último administrador activo, la empresa se queda sin quien la
  // administre y sin forma de arreglarlo desde la interfaz.
  if (!activo) {
    const admins = await prisma.user.count({
      where: { companyId, rol: "ADMIN", activo: true, NOT: { id: userId } },
    });
    if (admins === 0) {
      return { ok: false as const, error: "No puedes desactivar al último administrador de la empresa." };
    }
  }

  await prisma.user.update({ where: { id: persona.id }, data: { activo } });

  await anotar({
    companyId,
    actorId: actor.id,
    actorNombre: actor.nombre,
    accion: activo ? "PERSONA_REACTIVADA" : "PERSONA_DESACTIVADA",
    objetivoId: persona.id,
    objetivoNombre: persona.nombre,
  });

  return { ok: true as const };
}

// ---- Vinculación con Discord ---------------------------------------------

/// Genera el código de un solo uso que la persona escribe en `/vincular`.
///
/// Seis caracteres de un alfabeto sin las letras que se confunden al leerlas en
/// voz alta o al teclearlas de una captura: nada de O contra 0, ni I contra 1.
/// Caduca en quince minutos porque es un código corto: lo que lo protege no es
/// su longitud sino que dure poco.
export async function generarCodigoDiscord(userId: string) {
  const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  const codigo = [...bytes].map((b) => ALFABETO[b % ALFABETO.length]).join("");

  await prisma.user.update({
    where: { id: userId },
    data: {
      codigoDiscord: codigo,
      codigoDiscordExpira: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  return codigo;
}

// ---- Alta por lista ------------------------------------------------------

export type FilaPegada = {
  linea: number;
  nombre: string;
  email: string;
  equipo?: string;
  cargo?: string;
  error?: string;
};

/// Lee una lista pegada desde una hoja de cálculo.
///
/// Acepta comas, punto y coma y tabuladores porque eso es lo que sale al copiar
/// de Excel, de Google Sheets y de un CSV exportado, y pedirle a alguien que
/// convierta el separador antes de pegar es pedirle que no lo use.
export function leerLista(texto: string): FilaPegada[] {
  const filas: FilaPegada[] = [];

  texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((linea, i) => {
      const partes = linea.split(/\t|;|,/).map((p) => p.trim());
      const [nombre = "", email = "", equipo = "", cargo = ""] = partes;

      // Una cabecera pegada por error se salta en vez de dar de alta a una
      // persona llamada «nombre».
      if (i === 0 && /^(nombre|name)$/i.test(nombre)) return;

      const fila: FilaPegada = { linea: i + 1, nombre, email, equipo, cargo };
      const validado = NuevaPersona.safeParse({ nombre, email, equipo, cargo });
      if (!validado.success) fila.error = validado.error.issues[0]?.message;

      filas.push(fila);
    });

  return filas;
}
