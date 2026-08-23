import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retirarReconocimiento } from "@/lib/reconocimientos";
import { anotar } from "@/lib/auditoria";
import { notificar } from "@/lib/notificaciones";

// Retirar una publicación.
//
// Es DELETE aunque no borre nada: desde fuera, la publicación deja de existir.
// Por dentro se marca, porque borrarla se llevaría los comentarios y las
// reacciones de otras personas y el histórico del valor.
export async function DELETE(
  peticion: Request,
  contexto: { params: Promise<{ id: string }> },
) {
  const sesion = await auth();
  if (!sesion?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { id } = await contexto.params;
  const cuerpo = (await peticion.json().catch(() => ({}))) as { motivo?: string };

  const resultado = await retirarReconocimiento({
    companyId: sesion.user.companyId,
    actorId: sesion.user.id,
    esAdmin: sesion.user.rol === "ADMIN",
    recognitionId: id,
    motivo: String(cuerpo.motivo ?? ""),
  });

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  await anotar({
    companyId: sesion.user.companyId,
    actorId: sesion.user.id,
    actorNombre: sesion.user.name ?? null,
    accion: "PUBLICACION_RETIRADA",
    objetivoId: id,
    cambios: cuerpo.motivo?.trim()
      ? [{ campo: "motivo", antes: null, despues: cuerpo.motivo.trim() }]
      : [],
  });

  // Si lo retira un administrador, su autor se entera. Que una publicación
  // desaparezca sin explicación es peor que la publicación.
  if (resultado.autorId !== sesion.user.id) {
    await notificar({
      userId: resultado.autorId,
      actorId: sesion.user.id,
      tipo: "COMENTARIO",
      texto: `Un administrador retiró un reconocimiento que escribiste${
        cuerpo.motivo?.trim() ? `: ${cuerpo.motivo.trim()}` : "."
      }`,
      enlace: "feed",
    });
  }

  // Las notificaciones que apuntaban a la publicación se quedarían llevando a
  // un 404. Se limpian.
  await prisma.notification.deleteMany({ where: { recognitionId: id } });

  return NextResponse.json({ ok: true });
}
