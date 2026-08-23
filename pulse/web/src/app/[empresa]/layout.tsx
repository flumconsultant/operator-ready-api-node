import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { sesionRequerida } from "@/lib/sesion";
import { rutas } from "@/lib/rutas";

// El guardián del slug.
//
// Todo lo que cuelga de /{empresa} pasa por aquí. Comprueba que el slug de la
// URL sea el de la empresa de quien está mirando, y si no lo es, lo devuelve a
// la suya. No devuelve un 403: alguien que llega a la dirección de otra empresa
// casi siempre ha pinchado un enlace viejo o se ha equivocado escribiendo, y un
// error en rojo no le aclara nada; llevarlo a su sitio, sí.
//
// Que el slug exista se comprueba aparte, y ahí sí hay 404: una dirección
// inventada tiene que comportarse como lo que es.

export default async function LayoutEmpresa({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ empresa: string }>;
}) {
  const [{ empresa }, usuario] = await Promise.all([params, sesionRequerida()]);

  const laSuya = await prisma.company.findUnique({
    where: { id: usuario.companyId },
    select: { slug: true },
  });
  if (!laSuya) notFound();

  if (empresa !== laSuya.slug) {
    const existe = await prisma.company.findUnique({
      where: { slug: empresa },
      select: { id: true },
    });
    if (!existe) notFound();
    redirect(rutas(laSuya.slug).feed);
  }

  return children;
}
