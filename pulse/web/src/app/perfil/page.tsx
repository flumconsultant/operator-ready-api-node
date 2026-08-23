import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sesionConfigurada } from "@/lib/sesion";
import { guardarImagen } from "@/lib/imagenes";
import Marco from "@/componentes/Marco";
import FormularioPerfil from "./FormularioPerfil";

export const metadata = { title: "Mi perfil" };
export const dynamic = "force-dynamic";

export default async function Perfil() {
  const usuario = await sesionConfigurada();

  const yo = await prisma.user.findUniqueOrThrow({
    where: { id: usuario.id },
    select: {
      id: true,
      nombre: true,
      imagen: true,
      equipo: true,
      cargo: true,
      bio: true,
      cumpleanos: true,
      fechaIngreso: true,
    },
  });

  async function guardar(datos: FormData) {
    "use server";
    const u = await sesionConfigurada();

    const foto = datos.get("foto");
    let imagen: string | undefined;

    if (foto instanceof File && foto.size > 0) {
      const resultado = await guardarImagen(foto, "avatar");
      // Si la foto falla se guarda el resto igual: perder el texto que alguien
      // acaba de escribir porque su JPEG estaba corrupto es peor que quedarse
      // sin foto.
      if (resultado.ok) imagen = resultado.nombre;
    }

    const texto = (clave: string) => {
      const valor = String(datos.get(clave) ?? "").trim();
      return valor.length ? valor : null;
    };

    const fecha = (clave: string) => {
      const valor = String(datos.get(clave) ?? "").trim();
      if (!valor) return null;
      // El input date da AAAA-MM-DD; se fija a mediodía UTC para que ningún
      // huso horario mueva el cumpleaños de alguien un día.
      const d = new Date(`${valor}T12:00:00.000Z`);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    await prisma.user.update({
      where: { id: u.id },
      data: {
        cargo: texto("cargo"),
        bio: texto("bio"),
        cumpleanos: fecha("cumpleanos"),
        fechaIngreso: fecha("fechaIngreso"),
        ...(imagen ? { imagen } : {}),
      },
    });

    revalidatePath("/perfil");
    revalidatePath("/feed");
    revalidatePath(`/persona/${u.id}`);
  }

  return (
    <Marco actual="/perfil">
      <div className="columna-feed">
        <div className="cabecera-pagina">
          <h1>Mi perfil</h1>
          <p>
            Lo que ve el resto de la empresa. El equipo y el rol los gestiona tu
            administrador.
          </p>
        </div>

        <FormularioPerfil
          yo={{
            ...yo,
            cumpleanos: yo.cumpleanos?.toISOString().slice(0, 10) ?? "",
            fechaIngreso: yo.fechaIngreso?.toISOString().slice(0, 10) ?? "",
          }}
          guardar={guardar}
        />
      </div>
    </Marco>
  );
}
