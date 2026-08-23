import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sesionDeAdmin } from "@/lib/sesion";
import { entorno } from "@/lib/entorno";
import {
  CambiosPersona,
  NuevaPersona,
  cambiarEstado,
  guardarPersona,
  invitarPersona,
  leerLista,
  renovarInvitacion,
} from "@/lib/administracion";
import Marco from "@/componentes/Marco";
import PestanasAdmin from "@/componentes/PestanasAdmin";
import Personas from "./Personas";

export const metadata = { title: "Personas" };
export const dynamic = "force-dynamic";

export default async function PaginaPersonas() {
  const { companyId } = await sesionDeAdmin();

  const [gente, empresa] = await Promise.all([
    prisma.user.findMany({
      where: { companyId },
      orderBy: [{ activo: "desc" }, { nombre: "asc" }],
      select: {
        id: true,
        nombre: true,
        email: true,
        imagen: true,
        rol: true,
        equipo: true,
        cargo: true,
        discordId: true,
        activo: true,
        primerAcceso: true,
        invitacionExpira: true,
        tokenInvitacion: true,
      },
    }),
    prisma.company.findUniqueOrThrow({
      where: { id: companyId },
      select: { dominioCorreo: true },
    }),
  ]);

  async function invitar(datos: FormData) {
    "use server";
    const s = await sesionDeAdmin();
    const validado = NuevaPersona.safeParse({
      nombre: datos.get("nombre"),
      email: datos.get("email"),
      rol: datos.get("rol") || "COLABORADOR",
      equipo: datos.get("equipo") ?? "",
      cargo: datos.get("cargo") ?? "",
    });
    if (!validado.success) {
      return { error: validado.error.issues[0]?.message ?? "Datos inválidos." };
    }

    const r = await invitarPersona(s.companyId, validado.data, entorno.APP_URL);
    if (!r.ok) return { error: r.error };

    revalidatePath("/admin/personas");
    return { enlace: r.enlace, nombre: validado.data.nombre };
  }

  async function invitarLista(datos: FormData) {
    "use server";
    const s = await sesionDeAdmin();
    const filas = leerLista(String(datos.get("lista") ?? ""));

    const resultados = [];
    for (const fila of filas) {
      if (fila.error) {
        resultados.push({ ...fila, estado: "error" as const, detalle: fila.error });
        continue;
      }
      const r = await invitarPersona(
        s.companyId,
        {
          nombre: fila.nombre,
          email: fila.email,
          rol: "COLABORADOR",
          equipo: fila.equipo,
          cargo: fila.cargo,
        },
        entorno.APP_URL,
      );
      resultados.push(
        r.ok
          ? { ...fila, estado: "alta" as const, enlace: r.enlace }
          : { ...fila, estado: "error" as const, detalle: r.error },
      );
    }

    revalidatePath("/admin/personas");
    return { resultados };
  }

  async function editar(datos: FormData) {
    "use server";
    const s = await sesionDeAdmin();
    const validado = CambiosPersona.safeParse({
      userId: datos.get("userId"),
      rol: datos.get("rol"),
      equipo: datos.get("equipo") ?? "",
      cargo: datos.get("cargo") ?? "",
      discordId: datos.get("discordId") ?? "",
    });
    if (!validado.success) {
      return { error: validado.error.issues[0]?.message ?? "Datos inválidos." };
    }

    const r = await guardarPersona(s.companyId, s.id, validado.data);
    if (!r.ok) return { error: r.error };

    revalidatePath("/admin/personas");
    return { ok: true as const };
  }

  async function alternarEstado(datos: FormData) {
    "use server";
    const s = await sesionDeAdmin();
    const r = await cambiarEstado(
      s.companyId,
      s.id,
      String(datos.get("userId")),
      datos.get("activo") === "si",
    );
    revalidatePath("/admin/personas");
    return r.ok ? { ok: true as const } : { error: r.error };
  }

  async function renovar(datos: FormData) {
    "use server";
    const s = await sesionDeAdmin();
    const r = await renovarInvitacion(
      s.companyId,
      String(datos.get("userId")),
      entorno.APP_URL,
    );
    revalidatePath("/admin/personas");
    return r.ok ? { enlace: r.enlace } : { error: r.error };
  }

  return (
    <Marco actual="/admin">
      <div className="cabecera-pagina">
        <h1>Personas</h1>
        <p>
          Quién puede entrar a Pulse, con qué permisos y en qué equipo. Aquí se
          da de alta a la gente: no hay registro abierto.
        </p>
      </div>

      <PestanasAdmin />

      <Personas
        gente={gente.map((p) => ({
          ...p,
          // El token nunca llega al navegador. Lo que se manda es si hay una
          // invitación pendiente, no cuál es: la lista de personas se pinta en
          // cada carga y un token en el HTML acaba en el caché de alguien.
          invitacionPendiente: Boolean(p.tokenInvitacion) && !p.primerAcceso,
          invitacionExpira: p.invitacionExpira?.toISOString() ?? null,
          primerAcceso: p.primerAcceso?.toISOString() ?? null,
          tokenInvitacion: undefined,
        }))}
        dominioCorreo={empresa.dominioCorreo}
        acciones={{ invitar, invitarLista, editar, alternarEstado, renovar }}
      />
    </Marco>
  );
}
