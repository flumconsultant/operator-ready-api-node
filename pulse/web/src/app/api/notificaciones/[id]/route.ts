import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { marcarLeida } from "@/lib/notificaciones";
import { rutas, ACCEDER } from "@/lib/rutas";

// Abrir una notificación: la marca leída y redirige a donde apuntaba.
//
// Es una redirección del servidor y no un `onClick` en el cliente por dos
// motivos. Funciona sin JavaScript, y sobre todo funciona con «abrir en una
// pestaña nueva»: con un manejador de clic, quien abre con el botón central se
// lleva la notificación sin marcar y la campana se queda encendida para
// siempre.
export async function GET(
  _peticion: Request,
  contexto: { params: Promise<{ id: string }> },
) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.redirect(new URL(ACCEDER, process.env.APP_URL));
  }

  const { id } = await contexto.params;
  const destino = await marcarLeida(sesion.user.id, id);
  const r = rutas(sesion.user.empresaSlug);

  // Si la notificación no existe o no es suya, se va al listado en vez de dar
  // un error: no hay nada que un 404 le aclare a quien acaba de pulsar.
  return NextResponse.redirect(
    new URL(
      destino ? `/${sesion.user.empresaSlug}/${destino}` : r.novedades,
      process.env.APP_URL,
    ),
  );
}
