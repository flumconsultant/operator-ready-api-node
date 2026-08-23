import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sesionRequerida } from "@/lib/sesion";
import { rutas } from "@/lib/rutas";
import { guardarImagen } from "@/lib/imagenes";
import AsistentePersona from "./AsistentePersona";

export const metadata = { title: "Bienvenida" };
export const dynamic = "force-dynamic";

// El asistente que ve cada persona la primera vez que entra.
//
// Dos pasos y los dos se pueden saltar. Es deliberado: la primera pantalla de
// un producto que alguien no eligió instalar no puede ser un peaje. Lo que sí
// hace es pedir las dos cosas que hacen que el feed no parezca vacío —una cara
// y una presentación— en el único momento en que alguien está dispuesto a
// darlas.

export default async function OnboardingPersona() {
  const usuario = await sesionRequerida();

  const [yo, empresa] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: usuario.id },
      select: {
        id: true,
        nombre: true,
        imagen: true,
        cargo: true,
        equipo: true,
        cumpleanos: true,
        fechaIngreso: true,
        onboardingEn: true,
      },
    }),
    prisma.company.findUniqueOrThrow({
      where: { id: usuario.companyId },
      select: { nombre: true, logo: true, onboardingEn: true },
    }),
  ]);

  const r = rutas(usuario.empresaSlug);
  if (yo.onboardingEn) redirect(r.feed);
  // La empresa va primero: no tiene sentido pedir un primer reconocimiento en
  // una empresa que todavía no tiene valores.
  if (!empresa.onboardingEn && usuario.rol === "ADMIN") redirect(r.bienvenidaEmpresa);

  async function guardarPerfil(datos: FormData) {
    "use server";
    const u = await sesionRequerida();

    const archivo = datos.get("foto");
    let imagen: string | undefined;
    if (archivo instanceof File && archivo.size > 0) {
      const r = await guardarImagen(archivo, "avatar");
      // Si la foto falla se guarda el resto: perder el texto por un JPEG
      // corrupto es peor que quedarse sin foto.
      if (r.ok) imagen = r.nombre;
    }

    const texto = (clave: string) => {
      const v = String(datos.get(clave) ?? "").trim();
      return v.length ? v : null;
    };
    const fecha = (clave: string) => {
      const v = String(datos.get(clave) ?? "").trim();
      if (!v) return null;
      // Mediodía UTC para que ningún huso mueva el cumpleaños un día.
      const d = new Date(`${v}T12:00:00.000Z`);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    await prisma.user.update({
      where: { id: u.id },
      data: {
        cargo: texto("cargo"),
        cumpleanos: fecha("cumpleanos"),
        fechaIngreso: fecha("fechaIngreso"),
        ...(imagen ? { imagen } : {}),
      },
    });

    revalidatePath("/", "layout");
    return { ok: true as const };
  }

  async function terminar(datos: FormData) {
    "use server";
    const u = await sesionRequerida();

    const presentacion = String(datos.get("presentacion") ?? "").trim();
    if (presentacion.length >= 10) {
      // Una por persona: si vuelve a pasar por aquí, se actualiza la que hay en
      // vez de llenar el feed de presentaciones repetidas.
      await prisma.presentacion.upsert({
        where: { userId: u.id },
        create: {
          companyId: u.companyId,
          userId: u.id,
          texto: presentacion.slice(0, 400),
        },
        update: { texto: presentacion.slice(0, 400) },
      });
    }

    await prisma.user.update({
      where: { id: u.id },
      data: { onboardingEn: new Date() },
    });

    revalidatePath("/[empresa]/feed", "page");
    redirect(rutas(u.empresaSlug).feed);
  }

  return (
    <AsistentePersona
      yo={{
        ...yo,
        cumpleanos: yo.cumpleanos?.toISOString().slice(0, 10) ?? "",
        fechaIngreso: yo.fechaIngreso?.toISOString().slice(0, 10) ?? "",
      }}
      empresa={empresa}
      acciones={{ guardarPerfil, terminar }}
    />
  );
}
