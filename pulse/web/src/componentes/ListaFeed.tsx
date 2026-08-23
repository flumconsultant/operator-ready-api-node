"use client";

import { useState } from "react";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr";

import type { EntradaSerializada } from "@/lib/serializar";
import Reconocimiento from "./Reconocimiento";
import type { Mencionable } from "./CampoConMenciones";
import Celebracion from "./Celebracion";
import Presentacion from "./Presentacion";

// La columna del feed, con «cargar más».
//
// Se pagina con cursor por fecha y no con `skip`/`offset`: en un feed donde se
// publica mientras alguien lee, un offset se desplaza y la persona ve dos veces
// la misma publicación o se salta una. Un cursor por fecha no tiene ese
// problema.
//
// No es scroll infinito. Un feed de empresa se recorre y se cierra; el scroll
// infinito quita el final, y con él la sensación de estar al día. También deja
// el pie de página inalcanzable, que es el motivo por el que casi nadie lo
// quiere en una intranet.

export default function ListaFeed({
  inicial,
  cursorInicial,
  hayMasInicial,
  usuarioActual,
  companeros = [],
  puedeModerar = false,
}: {
  inicial: EntradaSerializada[];
  cursorInicial: string | null;
  hayMasInicial: boolean;
  usuarioActual: { id: string; nombre: string; imagen: string | null };
  companeros?: Mencionable[];
  puedeModerar?: boolean;
}) {
  const [entradas, setEntradas] = useState(inicial);
  const [cursor, setCursor] = useState(cursorInicial);
  const [hayMas, setHayMas] = useState(hayMasInicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cargarMas() {
    if (!cursor || cargando) return;
    setCargando(true);
    setError(null);

    try {
      const respuesta = await fetch(
        `/api/feed?antesDe=${encodeURIComponent(cursor)}`,
      );
      if (!respuesta.ok) throw new Error(String(respuesta.status));

      const datos = (await respuesta.json()) as {
        entradas: EntradaSerializada[];
        cursor: string | null;
        hayMas: boolean;
      };

      // Se filtran las repetidas por si una celebración cae en el borde entre
      // dos páginas: la ventana de fechas de cada página se solapa por un
      // instante y esa celebración saldría dos veces.
      const vistas = new Set(entradas.map(clave));
      setEntradas([
        ...entradas,
        ...datos.entradas.filter((e) => !vistas.has(clave(e))),
      ]);
      setCursor(datos.cursor);
      setHayMas(datos.hayMas);
    } catch {
      setError("No se ha podido cargar más. Comprueba tu conexión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <div className="feed">
        {entradas.map((entrada) => {
          if (entrada.clase === "reconocimiento") {
            return (
              <Reconocimiento
                key={`r-${entrada.reconocimiento.id}`}
                reconocimiento={entrada.reconocimiento}
                usuarioActual={usuarioActual}
                companeros={companeros}
                puedeModerar={puedeModerar}
              />
            );
          }
          if (entrada.clase === "celebracion") {
            return <Celebracion key={clave(entrada)} celebracion={entrada.celebracion} />;
          }
          return <Presentacion key={clave(entrada)} presentacion={entrada.presentacion} />;
        })}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {hayMas ? (
        <button
          type="button"
          className="boton boton--discreto boton--ancho"
          onClick={cargarMas}
          disabled={cargando}
        >
          <ArrowClockwiseIcon
            size={18}
            aria-hidden="true"
            className={cargando ? "girando" : undefined}
          />
          {cargando ? "Cargando…" : "Ver más atrás"}
        </button>
      ) : (
        entradas.length > 0 && (
          <p className="feed__final">Has llegado al principio.</p>
        )
      )}
    </>
  );
}

function clave(entrada: EntradaSerializada) {
  if (entrada.clase === "reconocimiento") return `r-${entrada.reconocimiento.id}`;
  if (entrada.clase === "presentacion") return `p-${entrada.presentacion.id}`;
  return `c-${entrada.celebracion.tipo}-${entrada.celebracion.persona.id}-${entrada.fecha}`;
}
