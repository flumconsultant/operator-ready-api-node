"use client";

import { useState } from "react";

import Avatar from "@/componentes/Avatar";
import IconoValor from "@/componentes/IconoValor";
import ModalKudo, {
  type Companero,
  type ValorElegible,
} from "@/componentes/ModalKudo";

// Lo que abre el feed: la caja de escribir y, debajo, los valores de la
// empresa.
//
// Los valores están a la vista y no escondidos dentro de un formulario. Es la
// diferencia entre un póster en la pared y una herramienta: si para ver qué
// valora tu empresa hay que abrir un desplegable, nadie los ve; si están en la
// primera pantalla y se pulsan, se usan. Pulsar uno abre el modal con ese valor
// ya elegido.

export default function Reconocer({
  yo,
  valores,
  companeros,
}: {
  yo: { id: string; nombre: string; imagen: string | null };
  valores: ValorElegible[];
  companeros: Companero[];
}) {
  const [abierto, setAbierto] = useState(false);
  const [valorInicial, setValorInicial] = useState<string | null>(null);

  if (valores.length === 0) {
    return (
      <p className="aviso" role="status">
        Tu empresa todavía no tiene valores configurados. El administrador puede
        crearlos en «Cultura y valores».
      </p>
    );
  }

  function abrir(valueId: string | null) {
    setValorInicial(valueId);
    setAbierto(true);
  }

  return (
    <>
      <div className="lanzador">
        <div className="lanzador__fila">
          <Avatar persona={yo} tamano="md" enlazado={false} />
          <button
            type="button"
            className="composer__invitacion"
            onClick={() => abrir(null)}
          >
            ¿A quién quieres reconocer hoy, {yo.nombre.split(" ")[0]}?
          </button>
        </div>

        <div className="lanzador__valores">
          <p className="etiqueta" id="etiqueta-valores">
            Reconocer por
          </p>
          <div className="fila-valores" aria-labelledby="etiqueta-valores">
            {valores.map((v) => (
              <button
                key={v.id}
                type="button"
                className="pastilla-valor"
                onClick={() => abrir(v.id)}
                // El título da la descripción al ratón; el aria-label la lleva
                // al lector de pantalla, que no lee los title.
                title={v.descripcion ?? undefined}
                aria-label={
                  v.descripcion
                    ? `Reconocer por ${v.nombre}. ${v.descripcion}`
                    : `Reconocer por ${v.nombre}`
                }
              >
                <IconoValor icono={v.icono} size={18} />
                {v.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ModalKudo
        abierto={abierto}
        alCerrar={() => setAbierto(false)}
        yo={yo}
        valores={valores}
        companeros={companeros}
        valorInicial={valorInicial}
      />
    </>
  );
}
