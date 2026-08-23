import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { leerImagen } from "@/lib/imagenes";

// Las imágenes se sirven desde aquí y no desde /public a propósito: las fotos
// de un equipo son de ese equipo. Si estuvieran en public, cualquiera con la
// URL las vería sin haber entrado nunca, y esas URLs acaban en el historial de
// un navegador compartido o en un enlace pegado en un chat.
//
// A cambio hay que dar el visto bueno en cada petición, y por eso la respuesta
// se cachea en el navegador de quien ya está dentro: el nombre del archivo es
// un UUID que no cambia nunca, así que el caché puede ser inmutable y largo.

export async function GET(
  _peticion: Request,
  contexto: { params: Promise<{ nombre: string }> },
) {
  const sesion = await auth();
  if (!sesion?.user) {
    return new NextResponse("No autenticado.", { status: 401 });
  }

  const { nombre } = await contexto.params;
  const contenido = await leerImagen(nombre);
  if (!contenido) return new NextResponse("No encontrada.", { status: 404 });

  return new NextResponse(new Uint8Array(contenido), {
    headers: {
      "content-type": "image/webp",
      "cache-control": "private, max-age=31536000, immutable",
    },
  });
}
