"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

// Dos formas de entrar, un solo campo de correo compartido: quien escribe su
// correo y prefiere no acordarse de la contraseña no tiene que volver a
// teclearlo abajo.

function Enviar({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="boton" disabled={pending}>
      {pending ? "Un momento…" : children}
    </button>
  );
}

export default function FormularioAcceso({
  conPassword,
  conEnlace,
  correoConfigurado,
}: {
  conPassword: (datos: FormData) => Promise<void>;
  conEnlace: (datos: FormData) => Promise<void>;
  correoConfigurado: boolean;
}) {
  const [email, setEmail] = useState("");

  return (
    <>
      <form action={conPassword}>
        <div className="campo">
          <label htmlFor="email">Correo de trabajo</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={8}
            required
          />
        </div>
        <Enviar>Entrar</Enviar>
      </form>

      <div className="separador">o</div>

      <form action={conEnlace}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          className="boton boton--discreto"
          disabled={!email}
          style={{ width: "100%" }}
        >
          Enviarme un enlace de acceso
        </button>
      </form>

      {!correoConfigurado && (
        <p
          className="meta"
          style={{ marginTop: "var(--space-4)", marginBottom: 0 }}
        >
          Sin SMTP configurado el enlace se escribe en el log del servidor.
        </p>
      )}
    </>
  );
}
