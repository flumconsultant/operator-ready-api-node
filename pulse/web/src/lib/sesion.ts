import { redirect } from "next/navigation";

import { auth } from "./auth";
import { dondeEmpezar, rutaDe } from "./onboarding";
import { ACCEDER, rutas } from "./rutas";

// El guardián de las páginas privadas.
//
// Existe porque cada página consulta sus propios datos antes de renderizar el
// marco, así que no basta con que el marco redirija: para cuando se dibuja, la
// página ya ha intentado leer `sesion.user.companyId` de un null. Un `auth()`
// suelto con `!` detrás compila igual de bien y revienta en producción con un
// 500 en vez de mandar a la pantalla de acceso.

export async function sesionRequerida() {
  const sesion = await auth();
  if (!sesion?.user) redirect(ACCEDER);
  return sesion.user;
}

/// Como `sesionRequerida`, pero además desvía a quien todavía tiene un
/// asistente pendiente. Lo usan las páginas normales; los propios asistentes
/// usan `sesionRequerida` a secas o se redirigirían a sí mismos para siempre.
export async function sesionConfigurada() {
  const usuario = await sesionRequerida();
  const ruta = rutaDe(await dondeEmpezar(usuario), usuario.empresaSlug);
  if (ruta) redirect(ruta);
  return usuario;
}

export async function sesionDeAdmin() {
  const usuario = await sesionConfigurada();
  if (usuario.rol !== "ADMIN") redirect(rutas(usuario.empresaSlug).feed);
  return usuario;
}

export async function sesionDeManager() {
  const usuario = await sesionConfigurada();
  if (usuario.rol === "COLABORADOR") redirect(rutas(usuario.empresaSlug).feed);
  return usuario;
}
