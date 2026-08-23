import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACCEDER, rutas } from "@/lib/rutas";

// La portada. Manda a cada quien a su empresa, o al acceso.
export default async function Inicio() {
  const sesion = await auth();
  if (!sesion?.user) redirect(ACCEDER);

  const empresa = await prisma.company.findUnique({
    where: { id: sesion.user.companyId },
    select: { slug: true },
  });
  if (!empresa) redirect(ACCEDER);

  redirect(rutas(empresa.slug).feed);
}
