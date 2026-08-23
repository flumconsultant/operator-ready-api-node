"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageSquare, X } from "@phosphor-icons/react/dist/ssr";

import Avatar from "./Avatar";
import IconoValor from "./IconoValor";

// El modal para enviar un kudo.
//
// Se abre desde la fila de valores del feed con el valor ya elegido, que es la
// diferencia que importa: pasar de «quiero reconocer a alguien» a «quiero
// reconocer a alguien POR criterio» quita un paso y, sobre todo, cambia el
// orden mental — primero el valor, después la persona. Es lo que hace que los
// valores de la empresa se usen en vez de quedarse en un póster.
//
// Va en un <dialog> nativo y no en un div con posición fija: el navegador se
// encarga del foco atrapado dentro, de Escape, y de la capa de fondo. Hacerlo a
// mano son sesenta líneas que casi siempre se equivocan en el foco.

export type ValorElegible = { id: string; nombre: string; icono: string; descripcion?: string | null };
export type Companero = { id: string; nombre: string; equipo: string | null; imagen: string | null };

const LARGO_MAXIMO = 1000;

export default function ModalKudo({
  abierto,
  alCerrar,
  yo,
  valores,
  companeros,
  valorInicial,
  personaInicial,
}: {
  abierto: boolean;
  alCerrar: () => void;
  yo: { id: string; nombre: string; imagen: string | null };
  valores: ValorElegible[];
  companeros: Companero[];
  valorInicial?: string | null;
  personaInicial?: string | null;
}) {
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const entradaFoto = useRef<HTMLInputElement>(null);

  const [valueId, setValor] = useState(valorInicial ?? "");
  const [paraUserId, setPara] = useState(personaInicial ?? "");
  const [mensaje, setMensaje] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al abrirse desde un valor concreto, ese valor entra ya elegido.
  useEffect(() => {
    if (abierto) {
      setValor(valorInicial ?? "");
      setPara(personaInicial ?? "");
    }
  }, [abierto, valorInicial, personaInicial]);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  function limpiar() {
    if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
    setVistaPrevia(null);
    setFoto(null);
    setMensaje("");
    setError(null);
    if (entradaFoto.current) entradaFoto.current.value = "";
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    const cuerpo = new FormData();
    cuerpo.set("paraUserId", paraUserId);
    cuerpo.set("valueId", valueId);
    cuerpo.set("mensaje", mensaje);
    if (foto) cuerpo.set("foto", foto);

    const respuesta = await fetch("/api/reconocimientos", { method: "POST", body: cuerpo });
    setEnviando(false);

    if (!respuesta.ok) {
      const datos = await respuesta.json().catch(() => ({}));
      setError(datos.error ?? "No se ha podido publicar. Inténtalo de nuevo.");
      return;
    }

    limpiar();
    alCerrar();
    router.refresh();
  }

  const elegido = valores.find((v) => v.id === valueId);
  const restantes = LARGO_MAXIMO - mensaje.length;
  const listo = paraUserId && valueId && mensaje.trim().length >= 10;

  return (
    <dialog
      ref={dialogo}
      className="modal"
      // Escape dispara `close`; el estado del padre tiene que enterarse o el
      // modal no se puede volver a abrir.
      onClose={() => {
        limpiar();
        alCerrar();
      }}
      onClick={(e) => {
        // Pulsar la capa de fondo cierra. El <dialog> recibe el clic cuando cae
        // fuera de su contenido, así que basta con comprobar el objetivo.
        if (e.target === dialogo.current) dialogo.current?.close();
      }}
      aria-labelledby="titulo-kudo"
    >
      <form className="modal__caja" onSubmit={enviar}>
        <header className="modal__cabecera">
          <h2 id="titulo-kudo">
            {elegido ? (
              <>
                Reconocer por <span className="modal__valor">{elegido.nombre}</span>
              </>
            ) : (
              "Reconocer a alguien"
            )}
          </h2>
          <button
            type="button"
            className="boton-icono"
            onClick={() => dialogo.current?.close()}
          >
            <X size={20} aria-hidden="true" />
            <span className="visually-hidden">Cerrar</span>
          </button>
        </header>

        {elegido?.descripcion && (
          <p className="modal__ayuda">{elegido.descripcion}</p>
        )}

        <div className="modal__cuerpo">
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {/* Los valores siguen visibles dentro del modal: quien lo abrió desde
              «Criterio» puede darse cuenta de que en realidad era «Cuidar al
              equipo» sin tener que cerrar y volver a empezar. */}
          <fieldset className="campo">
            <legend>Por qué valor</legend>
            <div className="fila-valores fila-valores--modal">
              {valores.map((v) => (
                <label
                  key={v.id}
                  className="pastilla-valor"
                  data-elegido={valueId === v.id || undefined}
                >
                  <input
                    type="radio"
                    name="valueId"
                    value={v.id}
                    checked={valueId === v.id}
                    onChange={() => setValor(v.id)}
                    className="visually-hidden"
                  />
                  <IconoValor icono={v.icono} size={18} />
                  {v.nombre}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="campo">
            <label htmlFor="kudo-para">A quién</label>
            <select
              id="kudo-para"
              required
              value={paraUserId}
              onChange={(e) => setPara(e.target.value)}
            >
              <option value="" disabled>
                Elige a una persona
              </option>
              {companeros.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                  {c.equipo ? ` — ${c.equipo}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="kudo-mensaje">Qué hizo</label>
            <div className="modal__mensaje">
              <Avatar persona={yo} tamano="sm" enlazado={false} />
              <textarea
                id="kudo-mensaje"
                required
                minLength={10}
                maxLength={LARGO_MAXIMO}
                rows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Cuenta el hecho concreto. «Gracias por todo» se olvida; «te quedaste el viernes a cerrar julio» no."
              />
            </div>
            <p className="meta" style={{ textAlign: "right" }} aria-live="polite">
              {restantes} caracteres
            </p>
          </div>

          {vistaPrevia && (
            <div className="composer__vista-previa">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vistaPrevia} alt="Vista previa de la foto que vas a publicar" />
              <button
                type="button"
                className="boton-icono composer__quitar-foto"
                onClick={() => {
                  if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
                  setVistaPrevia(null);
                  setFoto(null);
                  if (entradaFoto.current) entradaFoto.current.value = "";
                }}
              >
                <X size={18} weight="bold" aria-hidden="true" />
                <span className="visually-hidden">Quitar la foto</span>
              </button>
            </div>
          )}
        </div>

        <footer className="modal__pie">
          <label className="boton-icono composer__adjuntar">
            <ImageSquare size={20} aria-hidden="true" />
            <span>{foto ? "Cambiar foto" : "Añadir foto"}</span>
            <input
              ref={entradaFoto}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="visually-hidden"
              onChange={(e) => {
                const archivo = e.target.files?.[0] ?? null;
                if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
                setFoto(archivo);
                setVistaPrevia(archivo ? URL.createObjectURL(archivo) : null);
              }}
            />
          </label>

          <button type="submit" className="boton" disabled={enviando || !listo}>
            {enviando ? "Enviando…" : "Enviar reconocimiento"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
