import { redirect } from "next/navigation";

import { auth, signIn } from "@/lib/auth";
import { entorno } from "@/lib/entorno";
import FormularioAcceso from "./FormularioAcceso";

export const metadata = { title: "Entrar" };

export default async function Acceder({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sesion = await auth();
  if (sesion) redirect("/feed");

  const { error } = await searchParams;

  // Las dos formas de entrar viven en el servidor. El formulario de cliente
  // solo las llama, así que la contraseña nunca pasa por una ruta propia.
  async function conPassword(datos: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: String(datos.get("email") ?? ""),
        password: String(datos.get("password") ?? ""),
        redirectTo: "/feed",
      });
    } catch (e) {
      // signIn lanza para redirigir; hay que dejar pasar esa excepción.
      if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
      if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
      redirect("/acceder?error=credenciales");
    }
  }

  async function conEnlace(datos: FormData) {
    "use server";
    await signIn("nodemailer", {
      email: String(datos.get("email") ?? ""),
      redirectTo: "/feed",
    });
  }

  return (
    <div className="acceso">
      <div className="acceso__caja">
        <p className="etiqueta" style={{ marginBottom: "var(--space-3)" }}>
          BECOME Pulse
        </p>
        <h1>Entra a tu empresa</h1>
        <p>
          Pulse no tiene registro abierto: te da de alta el administrador de tu
          organización.
        </p>

        {error === "credenciales" && (
          <p className="error">
            El correo o la contraseña no coinciden con ninguna cuenta activa.
          </p>
        )}

        <FormularioAcceso
          conPassword={conPassword}
          conEnlace={conEnlace}
          correoConfigurado={Boolean(entorno.SMTP_URL)}
        />
      </div>
    </div>
  );
}
