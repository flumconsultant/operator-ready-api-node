import { redirect } from "next/navigation";

import { auth } from "./auth";

// El guardián de las páginas privadas.
//
// Existe porque cada página consulta sus propios datos antes de renderizar el
// marco, así que no basta con que el marco redirija: para cuando se dibuja, la
// página ya ha intentado leer `sesion.user.companyId` de un null. Un `auth()`
// suelto con `!` detrás compila igual de bien y revienta en producción con un
// 500 en vez de mandar a la pantalla de acceso.

export async function sesionRequerida() {
  const sesion = await auth();
  if (!sesion?.user) redirect("/acceder");
  return sesion.user;
}

export async function sesionDeAdmin() {
  const usuario = await sesionRequerida();
  if (usuario.rol !== "ADMIN") redirect("/feed");
  return usuario;
}

export async function sesionDeManager() {
  const usuario = await sesionRequerida();
  if (usuario.rol === "COLABORADOR") redirect("/feed");
  return usuario;
}
