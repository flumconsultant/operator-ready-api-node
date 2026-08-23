import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { NuevoReconocimiento, crearReconocimiento } from "@/lib/reconocimientos";
import { guardarImagen } from "@/lib/imagenes";
import { analizarPendientes } from "@/lib/ia/sentimiento";
import { avisarADiscord } from "@/lib/discord";

// Acepta JSON y multipart. El composer manda multipart porque puede llevar una
// foto; cualquier otro cliente puede seguir mandando JSON sin enterarse.
async function leerCuerpo(peticion: Request) {
  const tipo = peticion.headers.get("content-type") ?? "";

  if (tipo.includes("multipart/form-data")) {
    const datos = await peticion.formData();
    const foto = datos.get("foto");
    return {
      campos: {
        // getAll: el composer manda una clave repetida por destinatario.
        paraUserIds: datos.getAll("paraUserIds").map(String).filter(Boolean),
        valueId: String(datos.get("valueId") ?? ""),
        mensaje: String(datos.get("mensaje") ?? ""),
      },
      foto: foto instanceof File && foto.size > 0 ? foto : null,
    };
  }

  const json = await peticion.json().catch(() => ({}));
  return { campos: json, foto: null };
}

export async function POST(peticion: Request) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { campos, foto } = await leerCuerpo(peticion);
  const validado = NuevoReconocimiento.safeParse(campos);
  if (!validado.success) {
    return NextResponse.json(
      { error: validado.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 },
    );
  }

  // La foto se procesa antes de crear nada: si la imagen es inválida hay que
  // decirlo, no publicar un reconocimiento a medias y avisar después.
  let imagen: string | null = null;
  if (foto) {
    const resultado = await guardarImagen(foto, "post");
    if (!resultado.ok) {
      return NextResponse.json({ error: resultado.error }, { status: 400 });
    }
    imagen = resultado.nombre;
  }

  const resultado = await crearReconocimiento({
    companyId: sesion.user.companyId,
    deUserId: sesion.user.id,
    canal: "WEB",
    imagen,
    ...validado.data,
  });

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  // El análisis y el espejo en Discord van después de responder. Quien acaba de
  // reconocer a alguien no tiene por qué esperar a que conteste una API externa.
  void analizarPendientes(sesion.user.companyId, 5).catch(() => {});
  void avisarADiscord(resultado.id).catch(() => {});

  return NextResponse.json({ id: resultado.id }, { status: 201 });
}
