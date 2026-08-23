"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  CameraIcon,
  CheckIcon,
  DiscordLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

import Avatar from "@/componentes/Avatar";

function Guardar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="boton" disabled={pending}>
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export default function FormularioPerfil({
  yo,
  guardar,
  discord,
}: {
  yo: {
    id: string;
    nombre: string;
    imagen: string | null;
    equipo: string | null;
    cargo: string | null;
    bio: string | null;
    cumpleanos: string;
    fechaIngreso: string;
    discordId?: string | null;
  };
  guardar: (datos: FormData) => Promise<void>;
  discord?: {
    enlazado: boolean;
    servidorConectado: boolean;
    generarCodigo: () => Promise<{ codigo: string }>;
  };
}) {
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [codigo, setCodigo] = useState<string | null>(null);
  const entrada = useRef<HTMLInputElement>(null);

  return (
    <>
    <form action={guardar} className="tarjeta">
      <div className="perfil-editor__foto">
        {vistaPrevia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vistaPrevia} alt="Vista previa de tu nueva foto" className="avatar avatar--previa" />
        ) : (
          <Avatar persona={yo} tamano="xl" enlazado={false} />
        )}

        <label className="boton boton--discreto">
          <CameraIcon size={18} aria-hidden="true" />
          Cambiar foto
          <input
            ref={entrada}
            type="file"
            name="foto"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="visually-hidden"
            onChange={(e) => {
              const archivo = e.target.files?.[0];
              if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
              setVistaPrevia(archivo ? URL.createObjectURL(archivo) : null);
            }}
          />
        </label>
      </div>

      <div className="campo">
        <label htmlFor="cargo">Cargo</label>
        <input
          id="cargo"
          name="cargo"
          maxLength={80}
          defaultValue={yo.cargo ?? ""}
          placeholder="Analista de operaciones"
        />
      </div>

      <div className="campo">
        <label htmlFor="bio">Sobre ti</label>
        <textarea
          id="bio"
          name="bio"
          maxLength={280}
          rows={3}
          defaultValue={yo.bio ?? ""}
          placeholder="Una línea para que te conozcan los que aún no han trabajado contigo."
        />
      </div>

      <div className="rejilla-dos">
        <div className="campo">
          <label htmlFor="cumpleanos">Cumpleaños</label>
          <input
            id="cumpleanos"
            name="cumpleanos"
            type="date"
            defaultValue={yo.cumpleanos}
          />
          <p className="meta">Solo se muestran el día y el mes, nunca el año.</p>
        </div>

        <div className="campo">
          <label htmlFor="fechaIngreso">Entré a la empresa el</label>
          <input
            id="fechaIngreso"
            name="fechaIngreso"
            type="date"
            defaultValue={yo.fechaIngreso}
          />
          <p className="meta">Sirve para que el feed celebre tus aniversarios.</p>
        </div>
      </div>

      <Guardar />
    </form>

    {discord?.servidorConectado && (
      <section className="tarjeta" style={{ marginTop: "var(--space-6)" }}>
        <h2 className="titulo-seccion">
          <DiscordLogoIcon size={18} weight="fill" aria-hidden="true" />
          Discord
        </h2>

        {discord.enlazado ? (
          <p className="aviso aviso--ok">
            <CheckIcon size={18} aria-hidden="true" /> Tu cuenta de Discord está
            enlazada. Ya puedes usar <code>/reconocer</code> en el servidor de tu
            empresa.
          </p>
        ) : (
          <>
            <p>
              Enlaza tu cuenta para poder reconocer desde Discord. Genera un
              código y escribe <code>/vincular</code> seguido de él en cualquier
              canal del servidor de tu empresa.
            </p>

            {codigo ? (
              <p className="codigo-vinculacion" role="status">
                <code>{codigo}</code>
                <span className="meta">Caduca en 15 minutos.</span>
              </p>
            ) : (
              <form
                action={async () => {
                  const r = await discord.generarCodigo();
                  setCodigo(r.codigo);
                }}
              >
                <button type="submit" className="boton boton--discreto">
                  Generar mi código
                </button>
              </form>
            )}
          </>
        )}
      </section>
    )}
    </>
  );
}
