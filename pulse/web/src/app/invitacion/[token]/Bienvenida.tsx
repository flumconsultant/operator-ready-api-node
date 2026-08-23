"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const MINIMO = 8;

export default function Bienvenida({
  token,
  nombre,
  email,
  empresa,
  logo,
}: {
  token: string;
  nombre: string;
  email: string;
  empresa: string;
  logo: string | null;
}) {
  const [password, setPassword] = useState("");
  const [repetida, setRepetida] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const corta = password.length > 0 && password.length < MINIMO;
  const distintas = repetida.length > 0 && password !== repetida;

  async function aceptar(evento: React.FormEvent) {
    evento.preventDefault();
    setError(null);

    if (password.length < MINIMO) return setError(`La contraseña necesita al menos ${MINIMO} caracteres.`);
    if (password !== repetida) return setError("Las dos contraseñas no coinciden.");

    setEnviando(true);

    const respuesta = await fetch("/api/invitacion", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (!respuesta.ok) {
      setEnviando(false);
      const cuerpo = await respuesta.json().catch(() => ({}));
      return setError(cuerpo.error ?? "No se ha podido activar la cuenta.");
    }

    // Se entra sola: pedirle a alguien que acaba de elegir su contraseña que la
    // vuelva a escribir en otra pantalla es un paso que nadie entiende.
    const entrada = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setEnviando(false);

    if (entrada?.error) {
      setError("La cuenta quedó activada, pero no se ha podido entrar. Prueba desde la portada.");
      return;
    }

    window.location.href = "/perfil";
  }

  return (
    <div className="acceso">
      <div className="acceso__caja">
        {logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/api/imagenes/${logo}`}
            alt=""
            className="acceso__logo"
          />
        ) : (
          <p className="etiqueta" style={{ marginBottom: "var(--space-3)" }}>
            BECOME Pulse
          </p>
        )}

        <h1>Hola, {nombre.split(" ")[0]}</h1>
        <p>
          {empresa} te ha dado de alta en Pulse. Elige una contraseña y entras.
        </p>

        <form onSubmit={aceptar}>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="campo">
            <label htmlFor="email">Tu correo</label>
            <input id="email" type="email" value={email} readOnly aria-readonly="true" />
          </div>

          <div className="campo">
            <label htmlFor="password">Contraseña nueva</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MINIMO}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="ayuda-password"
            />
            <p className="meta" id="ayuda-password">
              {corta ? `Todavía le faltan ${MINIMO - password.length} caracteres.` : `Al menos ${MINIMO} caracteres.`}
            </p>
          </div>

          <div className="campo">
            <label htmlFor="repetida">Repítela</label>
            <input
              id="repetida"
              type="password"
              autoComplete="new-password"
              required
              value={repetida}
              onChange={(e) => setRepetida(e.target.value)}
            />
            {distintas && <p className="meta">Las dos no coinciden todavía.</p>}
          </div>

          <button
            type="submit"
            className="boton"
            disabled={enviando || password.length < MINIMO || password !== repetida}
          >
            {enviando ? "Entrando…" : "Entrar a Pulse"}
          </button>
        </form>
      </div>
    </div>
  );
}
