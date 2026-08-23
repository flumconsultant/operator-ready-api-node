import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Inicio() {
  const sesion = await auth();
  redirect(sesion ? "/feed" : "/acceder");
}
