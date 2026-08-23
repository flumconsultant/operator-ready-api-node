"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageSquareIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import Avatar from "./Avatar";
import IconoValor from "./IconoValor";
import CampoConMenciones from "./CampoConMenciones";
import { largoVisible } from "@/lib/menciones";

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
/// El mismo tope que aplica el servidor. Repetirlo aquí es lo que hace que el
/// buscador se apague antes de dejar elegir a alguien que se va a rechazar.
const MAXIMO_PERSONAS = 10;

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
  const [elegidas, setElegidas] = useState<string[]>(
    personaInicial ? [personaInicial] : [],
  );
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al abrirse desde un valor concreto, ese valor entra ya elegido.
  useEffect(() => {
    if (abierto) {
      setValor(valorInicial ?? "");
      setElegidas(personaInicial ? [personaInicial] : []);
      setBusqueda("");
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
    setBusqueda("");
    setError(null);
    if (entradaFoto.current) entradaFoto.current.value = "";
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    const cuerpo = new FormData();
    // Uno por destinatario: FormData admite claves repetidas y el endpoint las
    // lee con getAll, así que un kudo a cinco personas no necesita otro
    // formato ni serializar un JSON dentro de un campo.
    for (const id of elegidas) cuerpo.append("paraUserIds", id);
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
  const listo =
    elegidas.length > 0 &&
    valueId &&
    largoVisible(mensaje) >= 10 &&
    largoVisible(mensaje) <= LARGO_MAXIMO;

  const filtrados = companeros.filter((c) => {
    if (elegidas.includes(c.id)) return false;
    const q = busqueda.trim().toLowerCase();
    return !q || c.nombre.toLowerCase().includes(q) || (c.equipo ?? "").toLowerCase().includes(q);
  });

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
            <XIcon size={20} aria-hidden="true" />
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
            <label htmlFor="kudo-para">
              A quién
              {elegidas.length > 1 && (
                <span className="campo__contador"> · {elegidas.length} personas</span>
              )}
            </label>

            {elegidas.length > 0 && (
              <ul className="elegidas">
                {elegidas.map((id) => {
                  const p = companeros.find((c) => c.id === id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <Avatar persona={p} tamano="sm" enlazado={false} />
                      {p.nombre}
                      <button
                        type="button"
                        onClick={() => setElegidas((v) => v.filter((x) => x !== id))}
                      >
                        <XIcon size={14} weight="bold" aria-hidden="true" />
                        <span className="visually-hidden">Quitar a {p.nombre}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <input
              id="kudo-para"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={
                elegidas.length === 0
                  ? "Busca a una persona"
                  : `Añade a alguien más (hasta ${MAXIMO_PERSONAS})`
              }
              disabled={elegidas.length >= MAXIMO_PERSONAS}
              autoComplete="off"
            />

            {elegidas.length < MAXIMO_PERSONAS && (
              <ul className="candidatos" role="listbox" aria-label="Personas">
                {filtrados.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setElegidas((v) => [...v, c.id]);
                        setBusqueda("");
                      }}
                    >
                      <Avatar persona={c} tamano="sm" enlazado={false} />
                      <span>
                        {c.nombre}
                        {c.equipo && <span className="candidatos__equipo">{c.equipo}</span>}
                      </span>
                    </button>
                  </li>
                ))}
                {filtrados.length === 0 && busqueda.trim() && (
                  <li className="candidatos__vacio">Nadie coincide con «{busqueda}».</li>
                )}
              </ul>
            )}
          </div>

          <div className="campo">
            <label htmlFor="kudo-mensaje">Qué hizo</label>
            <div className="modal__mensaje">
              <Avatar persona={yo} tamano="sm" enlazado={false} />
              <CampoConMenciones
                id="kudo-mensaje"
                valor={mensaje}
                alCambiar={setMensaje}
                personas={companeros}
                maximo={LARGO_MAXIMO}
                placeholder="Cuenta el hecho concreto. «Gracias por todo» se olvida; «te quedaste el viernes a cerrar julio» no."
              />
            </div>
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
                <XIcon size={18} weight="bold" aria-hidden="true" />
                <span className="visually-hidden">Quitar la foto</span>
              </button>
            </div>
          )}
        </div>

        <footer className="modal__pie">
          <label className="boton-icono composer__adjuntar">
            <ImageSquareIcon size={20} aria-hidden="true" />
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
