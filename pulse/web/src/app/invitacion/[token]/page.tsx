import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Bienvenida from "./Bienvenida";

export const metadata = { title: "Tu invitación" };
export const dynamic = "force-dynamic";

// Donde aterriza quien recibe una invitación: elige su contraseña y entra.
//
// El token se comprueba aquí, en el servidor, antes de enseñar nada. Un token
// caducado o ya usado no dice «caducado» con el nombre de la persona delante:
// dice que no vale, y punto. Con el nombre se podría comprobar si una dirección
// concreta está dada de alta en la empresa.

export default async function Invitacion({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  // Si alguien ya tiene sesión y abre una invitación, lo más probable es que se
  // haya equivocado de enlace. No se cierra su sesión por sorpresa.
  const sesion = await auth();
  if (sesion?.user) redirect("/");

  const { token } = await params;

  const persona = await prisma.user.findUnique({
    where: { tokenInvitacion: token },
    select: {
      nombre: true,
      email: true,
      invitacionExpira: true,
      activo: true,
      company: { select: { nombre: true, logo: true } },
    },
  });

  if (
    !persona ||
    !persona.activo ||
    !persona.invitacionExpira ||
    persona.invitacionExpira < new Date()
  ) {
    notFound();
  }

  return (
    <Bienvenida
      token={token}
      nombre={persona.nombre}
      email={persona.email}
      empresa={persona.company.nombre}
      logo={persona.company.logo}
    />
  );
}
