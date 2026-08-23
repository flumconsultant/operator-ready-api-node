import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  const { nombre } = await contexto.params;
  const sesion = await auth();

  if (!sesion?.user) {
    // Los logotipos son la excepción, y es deliberada: la pantalla de
    // invitación tiene que enseñar la marca de la empresa a alguien que
    // todavía no tiene cuenta. Un logotipo es material público —está en la web
    // de la empresa— y una foto de equipo no. Se comprueba contra la columna
    // `logo`, así que solo pasa el archivo que es de verdad un logotipo.
    const esLogo = await prisma.company.findFirst({
      where: { logo: nombre },
      select: { id: true },
    });
    if (!esLogo) return new NextResponse("No autenticado.", { status: 401 });
  }
  const contenido = await leerImagen(nombre);
  if (!contenido) return new NextResponse("No encontrada.", { status: 404 });

  return new NextResponse(new Uint8Array(contenido), {
    headers: {
      "content-type": "image/webp",
      // Privado cuando hay sesión: una foto de equipo no debe quedarse en el
      // caché de un proxy compartido. El nombre es un UUID que no cambia
      // nunca, así que el caché puede ser largo e inmutable.
      "cache-control": sesion?.user
        ? "private, max-age=31536000, immutable"
        : "public, max-age=86400",
    },
  });
}
