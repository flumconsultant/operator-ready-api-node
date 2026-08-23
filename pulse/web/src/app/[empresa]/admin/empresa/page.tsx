import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sesionDeAdmin } from "@/lib/sesion";
import { guardarImagen } from "@/lib/imagenes";
import { DatosEmpresa, guardarEmpresa } from "@/lib/administracion";
import { entorno, iaActiva } from "@/lib/entorno";
import Marco from "@/componentes/Marco";
import PestanasAdmin from "@/componentes/PestanasAdmin";
import FormularioEmpresa from "./FormularioEmpresa";

export const metadata = { title: "Empresa" };
export const dynamic = "force-dynamic";

export default async function Empresa() {
  const { companyId } = await sesionDeAdmin();

  const empresa = await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    select: {
      nombre: true,
      slug: true,
      plan: true,
      logo: true,
      dominioCorreo: true,
      discordGuildId: true,
      discordCanalFeedId: true,
      limiteIaMensual: true,
      _count: { select: { usuarios: true } },
    },
  });

  const inicioDeMes = new Date();
  inicioDeMes.setUTCDate(1);
  inicioDeMes.setUTCHours(0, 0, 0, 0);
  const analizadosEsteMes = await prisma.recognition.count({
    where: { companyId, analizadoEn: { gte: inicioDeMes } },
  });

  async function guardar(datos: FormData) {
    "use server";
    const s = await sesionDeAdmin();

    const validado = DatosEmpresa.safeParse({
      nombre: datos.get("nombre"),
      dominioCorreo: datos.get("dominioCorreo") ?? "",
      discordGuildId: datos.get("discordGuildId") ?? "",
      discordCanalFeedId: datos.get("discordCanalFeedId") ?? "",
      limiteIaMensual: datos.get("limiteIaMensual"),
    });
    if (!validado.success) {
      return { error: validado.error.issues[0]?.message ?? "Datos inválidos." };
    }

    const archivo = datos.get("logo");
    let logo: string | undefined;
    if (archivo instanceof File && archivo.size > 0) {
      const resultado = await guardarImagen(archivo, "avatar");
      if (!resultado.ok) return { error: resultado.error };
      logo = resultado.nombre;
    }

    const resultado = await guardarEmpresa(
      s.companyId,
      { id: s.id, nombre: s.name ?? null },
      validado.data,
      logo,
    );
    if (!resultado.ok) return { error: resultado.error };

    // El logo sale en la barra lateral de todas las páginas, así que se
    // invalida el marco entero y no solo esta.
    revalidatePath("/", "layout");
    return { ok: true as const };
  }

  return (
    <Marco actual="cultura">
      <div className="cabecera-pagina">
        <h1>Configuración</h1>
        <p>Los datos de tu empresa, su marca y las conexiones con el exterior.</p>
      </div>

      <PestanasAdmin />

      <FormularioEmpresa
        empresa={empresa}
        guardar={guardar}
        contexto={{
          personas: empresa._count.usuarios,
          analizadosEsteMes,
          iaActiva,
          appUrl: entorno.APP_URL,
        }}
      />
    </Marco>
  );
}
