import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { reconocimiento } from "@/lib/reconocimientos";
import { serializarReconocimiento } from "@/lib/serializar";
import { sesionConfigurada } from "@/lib/sesion";
import Marco from "@/componentes/Marco";
import Reconocimiento from "@/componentes/Reconocimiento";

export const dynamic = "force-dynamic";

// La página de un reconocimiento suelto.
//
// Existe porque las notificaciones tienen que llevar a algún sitio concreto, y
// porque un reconocimiento que se puede enlazar se puede compartir por chat, que
// es como se entera la mitad de la empresa de que ha pasado algo.

export default async function Publicacion({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const usuario = await sesionConfigurada();
  const { id } = await params;

  const [r, yo] = await Promise.all([
    reconocimiento(usuario.companyId, id),
    prisma.user.findUniqueOrThrow({
      where: { id: usuario.id },
      select: { id: true, nombre: true, imagen: true },
    }),
  ]);

  if (!r) notFound();

  return (
    <Marco actual="/feed">
      <div className="columna-feed">
        <Link href="/feed" className="enlace-volver">
          <ArrowLeft size={18} aria-hidden="true" />
          Volver al feed
        </Link>

        <div className="feed">
          <Reconocimiento
            reconocimiento={serializarReconocimiento(r)}
            usuarioActual={yo}
            permalink
          />
        </div>
      </div>
    </Marco>
  );
}
