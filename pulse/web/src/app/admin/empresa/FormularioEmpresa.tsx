"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Buildings, DiscordLogo, Sparkle, UploadSimple } from "@phosphor-icons/react/dist/ssr";

type Empresa = {
  nombre: string;
  slug: string;
  plan: string;
  logo: string | null;
  dominioCorreo: string | null;
  discordGuildId: string | null;
  discordCanalFeedId: string | null;
  limiteIaMensual: number;
};

function Guardar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="boton" disabled={pending}>
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export default function FormularioEmpresa({
  empresa,
  guardar,
  contexto,
}: {
  empresa: Empresa;
  guardar: (datos: FormData) => Promise<{ error?: string; ok?: true }>;
  contexto: {
    personas: number;
    analizadosEsteMes: number;
    iaActiva: boolean;
    appUrl: string;
  };
}) {
  const [mensaje, setMensaje] = useState<{ error?: string; ok?: boolean } | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const formulario = useRef<HTMLFormElement>(null);

  const consumo = contexto.analizadosEsteMes;
  const tope = empresa.limiteIaMensual;
  const porcentaje = tope > 0 ? Math.min(100, Math.round((consumo / tope) * 100)) : 0;

  return (
    <form
      ref={formulario}
      action={async (datos) => {
        const r = await guardar(datos);
        setMensaje(r);
        if (r.ok) setVistaPrevia(null);
      }}
    >
      {mensaje?.error && (
        <p className="error" role="alert">
          {mensaje.error}
        </p>
      )}
      {mensaje?.ok && (
        <p className="aviso aviso--ok" role="status">
          Guardado.
        </p>
      )}

      <section className="tarjeta bloque-config">
        <h2 className="titulo-seccion">
          <Buildings size={18} weight="fill" aria-hidden="true" />
          Identidad
        </h2>

        <div className="logo-editor">
          <div className="logo-editor__marco">
            {vistaPrevia || empresa.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={vistaPrevia ?? `/api/imagenes/${empresa.logo}`}
                alt={`Logotipo de ${empresa.nombre}`}
              />
            ) : (
              <span className="logo-editor__vacio" aria-hidden="true">
                {empresa.nombre.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <label className="boton boton--discreto">
              <UploadSimple size={18} aria-hidden="true" />
              {empresa.logo ? "Cambiar logotipo" : "Subir logotipo"}
              <input
                type="file"
                name="logo"
                accept="image/jpeg,image/png,image/webp"
                className="visually-hidden"
                onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
                  setVistaPrevia(archivo ? URL.createObjectURL(archivo) : null);
                }}
              />
            </label>
            <p className="meta" style={{ marginTop: "var(--space-3)" }}>
              Se recorta a cuadrado y se guarda a 400px. Sustituye al nombre de
              Pulse en la barra lateral y en la pantalla de acceso.
            </p>
          </div>
        </div>

        <div className="campo">
          <label htmlFor="nombre">Nombre de la empresa</label>
          <input id="nombre" name="nombre" required maxLength={80} defaultValue={empresa.nombre} />
        </div>

        <div className="campo">
          <label htmlFor="dominioCorreo">Dominio de correo</label>
          <input
            id="dominioCorreo"
            name="dominioCorreo"
            maxLength={80}
            defaultValue={empresa.dominioCorreo ?? ""}
            placeholder="empresa.com"
          />
          <p className="meta">
            Al invitar se avisa cuando una dirección no lo cumple. No se bloquea:
            los externos y los becarios existen.
          </p>
        </div>

        <dl className="datos-fijos">
          <div>
            <dt>Identificador</dt>
            <dd>{empresa.slug}</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd>{empresa.plan}</dd>
          </div>
          <div>
            <dt>Personas dadas de alta</dt>
            <dd>{contexto.personas}</dd>
          </div>
        </dl>
      </section>

      <section className="tarjeta bloque-config">
        <h2 className="titulo-seccion">
          <DiscordLogo size={18} weight="fill" aria-hidden="true" />
          Discord
        </h2>
        <p>
          Conecta tu servidor para que <code>/reconocer</code> funcione y el feed
          se espeje en un canal. Los dos identificadores se copian con clic
          derecho sobre el servidor y sobre el canal, con el modo desarrollador
          activado en Discord.
        </p>

        <div className="rejilla-dos">
          <div className="campo">
            <label htmlFor="discordGuildId">ID del servidor</label>
            <input
              id="discordGuildId"
              name="discordGuildId"
              inputMode="numeric"
              maxLength={25}
              defaultValue={empresa.discordGuildId ?? ""}
              placeholder="123456789012345678"
            />
          </div>
          <div className="campo">
            <label htmlFor="discordCanalFeedId">ID del canal del feed</label>
            <input
              id="discordCanalFeedId"
              name="discordCanalFeedId"
              inputMode="numeric"
              maxLength={25}
              defaultValue={empresa.discordCanalFeedId ?? ""}
              placeholder="123456789012345678"
            />
          </div>
        </div>
      </section>

      <section className="tarjeta bloque-config">
        <h2 className="titulo-seccion">
          <Sparkle size={18} weight="fill" aria-hidden="true" />
          Capa de IA
        </h2>

        {!contexto.iaActiva && (
          <p className="aviso">
            La capa de IA está apagada: falta <code>ANTHROPIC_API_KEY</code> en
            el servidor. Pulse funciona igual; lo que no se hace es el análisis
            de los mensajes ni la redacción del resumen semanal.
          </p>
        )}

        <div className="campo">
          <label htmlFor="limiteIaMensual">
            Reconocimientos que se analizan al mes
          </label>
          <input
            id="limiteIaMensual"
            name="limiteIaMensual"
            type="number"
            min={0}
            max={1000000}
            required
            defaultValue={empresa.limiteIaMensual}
          />
          <p className="meta">
            Agotado el cupo se deja de analizar y se sigue guardando todo. Es el
            freno del coste de la API.
          </p>
        </div>

        <p className="consumo">
          <span className="consumo__barra" aria-hidden="true">
            <span style={{ width: `${porcentaje}%` }} />
          </span>
          <span>
            {consumo} de {tope} analizados este mes
          </span>
        </p>
      </section>

      <Guardar />
    </form>
  );
}
