import { redirect } from "next/navigation";

import { rutas } from "@/lib/rutas";

// pulse.meetbecome.com/flum lleva al feed de Flum.
//
// Es una redirección y no el feed en sí para que solo exista una dirección
// canónica de cada página: con las dos, el feed se cachearía dos veces y los
// enlaces que la gente comparte apuntarían unos a un sitio y otros a otro.
export default async function Empresa({
  params,
}: {
  params: Promise<{ empresa: string }>;
}) {
  const { empresa } = await params;
  redirect(rutas(empresa).feed);
}
