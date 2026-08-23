"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageSquare, X, CaretDown } from "@phosphor-icons/react/dist/ssr";

import Avatar from "@/componentes/Avatar";

// La caja de escribir del feed.
//
// Cerrada es una línea que invita, con la cara de quien va a escribir; abierta
// es el formulario entero. Ese patrón —el de cualquier red— importa aquí más
// que en otros sitios: un formulario de cuatro campos siempre desplegado
// arriba del feed le dice a la gente «esto es una herramienta de RRHH», y un
// campo que pregunta le dice «esto es para ti».

type Valor = { id: string; nombre: string; emoji: string };
type Companero = { id: string; nombre: string; equipo: string | null; imagen: string | null };

const LARGO_MAXIMO = 1000;

export default function Composer({
  yo,
  valores,
  companeros,
}: {
  yo: { id: string; nombre: string; imagen: string | null };
  valores: Valor[];
  companeros: Companero[];
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paraUserId, setPara] = useState("");
  const [valueId, setValor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const entradaFoto = useRef<HTMLInputElement>(null);

  if (valores.length === 0) {
    return (
      <p className="aviso" role="status">
        Tu empresa todavía no tiene valores configurados. El administrador puede
        crearlos en «Cultura y valores».
      </p>
    );
  }

  function elegirFoto(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0] ?? null;
    if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
    setFoto(archivo);
    setVistaPrevia(archivo ? URL.createObjectURL(archivo) : null);
  }

  function quitarFoto() {
    if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
    setFoto(null);
    setVistaPrevia(null);
    if (entradaFoto.current) entradaFoto.current.value = "";
  }

  function cerrar() {
    quitarFoto();
    setAbierto(false);
    setError(null);
    setPara("");
    setValor("");
    setMensaje("");
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    // Va como FormData y no como JSON porque puede llevar una foto. El mismo
    // endpoint acepta las dos formas.
    const cuerpo = new FormData();
    cuerpo.set("paraUserId", paraUserId);
    cuerpo.set("valueId", valueId);
    cuerpo.set("mensaje", mensaje);
    if (foto) cuerpo.set("foto", foto);

    const respuesta = await fetch("/api/reconocimientos", {
      method: "POST",
      body: cuerpo,
    });

    setEnviando(false);

    if (!respuesta.ok) {
      const datos = await respuesta.json().catch(() => ({}));
      setError(datos.error ?? "No se ha podido publicar. Inténtalo de nuevo.");
      return;
    }

    cerrar();
    router.refresh();
  }

  if (!abierto) {
    return (
      <div className="composer composer--cerrado">
        <Avatar persona={yo} tamano="md" enlazado={false} />
        <button
          type="button"
          className="composer__invitacion"
          onClick={() => setAbierto(true)}
        >
          ¿A quién quieres reconocer hoy, {yo.nombre.split(" ")[0]}?
        </button>
      </div>
    );
  }

  const restantes = LARGO_MAXIMO - mensaje.length;

  return (
    <form className="composer" onSubmit={enviar}>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="composer__fila">
        <Avatar persona={yo} tamano="md" enlazado={false} />

        <div className="composer__selectores">
          <div className="campo campo--compacto">
            <label htmlFor="para">A quién</label>
            <div className="select-envoltura">
              <select
                id="para"
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
              <CaretDown size={16} aria-hidden="true" />
            </div>
          </div>

          <div className="campo campo--compacto">
            <label htmlFor="valor">Por qué valor</label>
            <div className="select-envoltura">
              <select
                id="valor"
                required
                value={valueId}
                onChange={(e) => setValor(e.target.value)}
              >
                <option value="" disabled>
                  Elige un valor
                </option>
                {valores.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.emoji} {v.nombre}
                  </option>
                ))}
              </select>
              <CaretDown size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="campo">
        <label htmlFor="mensaje">Qué hizo</label>
        <textarea
          id="mensaje"
          required
          minLength={10}
          maxLength={LARGO_MAXIMO}
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Cuenta el hecho concreto. «Gracias por todo» se olvida; «te quedaste el viernes a cerrar julio» no."
        />
        <p
          className="meta composer__contador"
          data-cerca={restantes < 100 || undefined}
          aria-live="polite"
        >
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
            onClick={quitarFoto}
            aria-label="Quitar la foto"
          >
            <X size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="composer__pie">
        <label className="boton-icono composer__adjuntar">
          <ImageSquare size={20} aria-hidden="true" />
          <span>{foto ? "Cambiar foto" : "Añadir foto"}</span>
          <input
            ref={entradaFoto}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="visually-hidden"
            onChange={elegirFoto}
          />
        </label>

        <div className="composer__acciones">
          <button type="button" className="boton boton--discreto" onClick={cerrar}>
            Cancelar
          </button>
          <button
            type="submit"
            className="boton"
            disabled={enviando || !paraUserId || !valueId || mensaje.trim().length < 10}
          >
            {enviando ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </div>
    </form>
  );
}
