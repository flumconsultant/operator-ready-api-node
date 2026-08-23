"use client";

import { useState } from "react";
import { Camera, Check } from "@phosphor-icons/react/dist/ssr";

import Avatar from "@/componentes/Avatar";

const PASOS = ["Tu foto y tus datos", "Preséntate"] as const;

export default function AsistentePersona({
  yo,
  empresa,
  acciones,
}: {
  yo: {
    id: string;
    nombre: string;
    imagen: string | null;
    cargo: string | null;
    equipo: string | null;
    cumpleanos: string;
    fechaIngreso: string;
  };
  empresa: { nombre: string; logo: string | null };
  acciones: {
    guardarPerfil: (d: FormData) => Promise<{ ok?: true; error?: string }>;
    terminar: (d: FormData) => Promise<void>;
  };
}) {
  const [paso, setPaso] = useState(0);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [presentacion, setPresentacion] = useState("");

  return (
    <div className="asistente">
      <div className="asistente__caja">
        <header className="asistente__cabecera">
          {empresa.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={`/api/imagenes/${empresa.logo}`} alt="" className="acceso__logo" />
          ) : (
            <p className="etiqueta">BECOME Pulse</p>
          )}

          <ol className="pasos" aria-label="Pasos de la bienvenida">
            {PASOS.map((texto, i) => (
              <li
                key={texto}
                data-estado={i < paso ? "hecho" : i === paso ? "actual" : "pendiente"}
                aria-current={i === paso ? "step" : undefined}
              >
                <span className="pasos__numero" aria-hidden="true">
                  {i < paso ? <Check size={14} weight="bold" /> : i + 1}
                </span>
                {texto}
              </li>
            ))}
          </ol>
        </header>

        {paso === 0 && (
          <form
            action={async (datos) => {
              await acciones.guardarPerfil(datos);
              setPaso(1);
            }}
          >
            <h1>Hola, {yo.nombre.split(" ")[0]}</h1>
            <p className="asistente__intro">
              {empresa.nombre} usa Pulse para reconocerse entre compañeros. Antes
              de entrar, dos cosas que hacen que te reconozcan: tu cara y cuándo
              felicitarte.
            </p>

            <div className="perfil-editor__foto">
              {vistaPrevia ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={vistaPrevia}
                  alt="Vista previa de tu foto"
                  className="avatar avatar--previa"
                />
              ) : (
                <Avatar persona={yo} tamano="xl" enlazado={false} />
              )}

              <div>
                <label className="boton boton--discreto">
                  <Camera size={18} aria-hidden="true" />
                  Subir una foto
                  <input
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
                <p className="meta" style={{ marginTop: "var(--space-3)" }}>
                  Sin foto se usan tus iniciales. Con foto, la gente te encuentra
                  antes en el feed.
                </p>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="cargo">¿Qué haces aquí?</label>
              <input
                id="cargo"
                name="cargo"
                maxLength={80}
                defaultValue={yo.cargo ?? ""}
                placeholder="Analista de operaciones"
              />
            </div>

            <div className="rejilla-dos">
              <div className="campo">
                <label htmlFor="cumpleanos">Tu cumpleaños</label>
                <input id="cumpleanos" name="cumpleanos" type="date" defaultValue={yo.cumpleanos} />
                <p className="meta">Solo se ven el día y el mes, nunca el año.</p>
              </div>
              <div className="campo">
                <label htmlFor="fechaIngreso">Entraste a la empresa el</label>
                <input
                  id="fechaIngreso"
                  name="fechaIngreso"
                  type="date"
                  defaultValue={yo.fechaIngreso}
                />
                <p className="meta">Para celebrar tus aniversarios.</p>
              </div>
            </div>

            <button type="submit" className="boton boton--ancho">
              Siguiente
            </button>
          </form>
        )}

        {paso === 1 && (
          <form action={acciones.terminar}>
            <h1>Preséntate</h1>
            <p className="asistente__intro">
              Va al feed una sola vez, para que el resto sepa quién eres antes de
              cruzárselo en una reunión. Puedes saltártelo.
            </p>

            <div className="campo">
              <label htmlFor="presentacion">En dos líneas</label>
              <textarea
                id="presentacion"
                name="presentacion"
                rows={4}
                maxLength={400}
                value={presentacion}
                onChange={(e) => setPresentacion(e.target.value)}
                placeholder="Llevo seis años en operaciones y me toca el cierre de mes. Si algo no cuadra en un reporte, probablemente sea yo quien lo esté mirando."
              />
              <p className="meta">
                {presentacion.trim().length < 10
                  ? "Con menos de diez caracteres no se publica nada."
                  : `${400 - presentacion.length} caracteres`}
              </p>
            </div>

            <div className="asistente__botones">
              <button
                type="button"
                className="boton boton--discreto"
                onClick={() => setPaso(0)}
              >
                Atrás
              </button>
              <button type="submit" className="boton">
                {presentacion.trim().length >= 10
                  ? "Publicar y entrar"
                  : "Entrar a Pulse"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
