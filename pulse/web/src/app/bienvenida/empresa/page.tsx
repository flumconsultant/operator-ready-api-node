import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sesionRequerida } from "@/lib/sesion";
import { guardarImagen } from "@/lib/imagenes";
import { entorno } from "@/lib/entorno";
import { anotar } from "@/lib/auditoria";
import { invitarPersona, leerLista } from "@/lib/administracion";
import { VALORES_SUGERIDOS } from "@/lib/iconos-valores";
import AsistenteEmpresa from "./AsistenteEmpresa";

export const metadata = { title: "Poner en marcha tu empresa" };
export const dynamic = "force-dynamic";

// El asistente que ve el administrador la primera vez.
//
// Tres pasos y ninguno opcional por capricho: sin valores no se puede
// reconocer, y sin gente no hay a quién. El logotipo sí es opcional — un
// piloto que arranca un martes por la tarde no siempre tiene el SVG a mano.

export default async function OnboardingEmpresa() {
  const usuario = await sesionRequerida();

  // Solo el administrador configura la empresa. Es el único rol que puede, y
  // el que llegue aquí sin serlo se va al feed en vez de a una pantalla que no
  // podría completar.
  if (usuario.rol !== "ADMIN") redirect("/feed");

  const empresa = await prisma.company.findUniqueOrThrow({
    where: { id: usuario.companyId },
    select: {
      nombre: true,
      logo: true,
      onboardingEn: true,
      valores: { select: { id: true }, take: 1 },
    },
  });

  // Ya configurada: se puede volver a Empresa desde el panel, pero el asistente
  // no se repite.
  if (empresa.onboardingEn) redirect("/admin/empresa");

  async function guardarIdentidad(datos: FormData) {
    "use server";
    const u = await sesionRequerida();
    const nombre = String(datos.get("nombre") ?? "").trim();
    if (nombre.length < 2) return { error: "Escribe el nombre de tu empresa." };

    const archivo = datos.get("logo");
    let logo: string | undefined;
    if (archivo instanceof File && archivo.size > 0) {
      const r = await guardarImagen(archivo, "avatar");
      if (!r.ok) return { error: r.error };
      logo = r.nombre;
    }

    await prisma.company.update({
      where: { id: u.companyId },
      data: { nombre, ...(logo ? { logo } : {}) },
    });

    revalidatePath("/", "layout");
    return { ok: true as const };
  }

  async function guardarValores(datos: FormData) {
    "use server";
    const u = await sesionRequerida();

    // Llegan como JSON porque son una lista de longitud variable con tres
    // campos cada uno; con inputs sueltos habría que inventar nombres
    // indexados y volver a componerlos aquí.
    let lista: { nombre: string; descripcion: string; icono: string }[];
    try {
      lista = JSON.parse(String(datos.get("valores") ?? "[]"));
    } catch {
      return { error: "No se han podido leer los valores." };
    }

    const limpios = lista
      .map((v) => ({
        nombre: String(v.nombre ?? "").trim().slice(0, 40),
        descripcion: String(v.descripcion ?? "").trim().slice(0, 160),
        icono: String(v.icono ?? "chispa"),
      }))
      .filter((v) => v.nombre.length >= 2);

    if (limpios.length === 0) {
      return { error: "Necesitas al menos un valor para poder reconocer." };
    }

    // No se borra ninguno: se crean los nuevos, se actualizan por nombre los
    // que ya estaban, y los que se hayan quitado se desactivan.
    //
    // Borrar parecía más simple hasta que se probó: un valor referenciado por
    // un reconocimiento no se puede borrar, y aunque se pudiera, borrarlo se
    // llevaría por delante el histórico de por qué se reconocía a la gente. Es
    // la misma regla que en el panel de administración, y tiene que valer
    // también aquí porque a este asistente se puede volver.
    const existentes = await prisma.value.findMany({
      where: { companyId: u.companyId },
      select: { id: true, nombre: true },
    });
    const porNombre = new Map(existentes.map((v) => [v.nombre.toLowerCase(), v.id]));
    const conservados = new Set<string>();

    for (const [i, v] of limpios.entries()) {
      const yaEstaba = porNombre.get(v.nombre.toLowerCase());

      if (yaEstaba) {
        conservados.add(yaEstaba);
        await prisma.value.update({
          where: { id: yaEstaba },
          data: {
            descripcion: v.descripcion || null,
            icono: v.icono,
            orden: i,
            activo: true,
          },
        });
        continue;
      }

      const creado = await prisma.value.create({
        data: {
          companyId: u.companyId,
          nombre: v.nombre,
          descripcion: v.descripcion || null,
          icono: v.icono,
          orden: i,
        },
        select: { id: true },
      });
      conservados.add(creado.id);

      await anotar({
        companyId: u.companyId,
        actorId: u.id,
        actorNombre: u.name ?? null,
        accion: "VALOR_CREADO",
        objetivoId: creado.id,
        objetivoNombre: v.nombre,
      });
    }

    const retirados = existentes.filter((v) => !conservados.has(v.id));
    if (retirados.length > 0) {
      await prisma.value.updateMany({
        where: { id: { in: retirados.map((v) => v.id) } },
        data: { activo: false },
      });
      for (const v of retirados) {
        await anotar({
          companyId: u.companyId,
          actorId: u.id,
          actorNombre: u.name ?? null,
          accion: "VALOR_RETIRADO",
          objetivoId: v.id,
          objetivoNombre: v.nombre,
        });
      }
    }

    return { ok: true as const };
  }

  async function invitarEquipo(datos: FormData) {
    "use server";
    const u = await sesionRequerida();
    const filas = leerLista(String(datos.get("lista") ?? ""));

    const resultados = [];
    for (const fila of filas) {
      if (fila.error) {
        resultados.push({ ...fila, estado: "error" as const, detalle: fila.error });
        continue;
      }
      const r = await invitarPersona(
        u.companyId,
        { id: u.id, nombre: u.name ?? null },
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

    return { resultados };
  }

  async function terminar() {
    "use server";
    const u = await sesionRequerida();

    // Sin valores no se puede reconocer, así que el asistente devuelve al paso
    // de valores en vez de dar por terminada una empresa que no funciona.
    const valores = await prisma.value.count({ where: { companyId: u.companyId } });
    if (valores === 0) redirect("/bienvenida/empresa?paso=valores");

    await prisma.company.update({
      where: { id: u.companyId },
      data: { onboardingEn: new Date() },
    });

    await anotar({
      companyId: u.companyId,
      actorId: u.id,
      actorNombre: u.name ?? null,
      accion: "EMPRESA_ACTUALIZADA",
      objetivoNombre: "Puesta en marcha completada",
    });

    revalidatePath("/", "layout");
    redirect("/bienvenida");
  }

  return (
    <AsistenteEmpresa
      empresa={{ nombre: empresa.nombre, logo: empresa.logo }}
      sugeridos={VALORES_SUGERIDOS}
      acciones={{ guardarIdentidad, guardarValores, invitarEquipo, terminar }}
    />
  );
}
