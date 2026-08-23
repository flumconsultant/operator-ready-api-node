"use client";

import { useState } from "react";
import { Check, Plus, Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";

import IconoValor from "@/componentes/IconoValor";
import SelectorIcono from "@/componentes/SelectorIcono";
import { ICONO_POR_DEFECTO } from "@/lib/iconos-valores";

type ValorBorrador = {
  nombre: string;
  descripcion: string;
  icono: string;
  incluido: boolean;
};

type FilaResultado = {
  linea: number;
  nombre: string;
  email: string;
  estado: "alta" | "error";
  detalle?: string;
  enlace?: string;
};

const PASOS = ["Tu empresa", "Vuestros valores", "Vuestro equipo"] as const;

export default function AsistenteEmpresa({
  empresa,
  sugeridos,
  acciones,
}: {
  empresa: { nombre: string; logo: string | null };
  sugeridos: { nombre: string; descripcion: string; icono: string }[];
  acciones: {
    guardarIdentidad: (d: FormData) => Promise<{ error?: string; ok?: true }>;
    guardarValores: (d: FormData) => Promise<{ error?: string; ok?: true }>;
    invitarEquipo: (d: FormData) => Promise<{ resultados: FilaResultado[] }>;
    terminar: () => Promise<void>;
  };
}) {
  const [paso, setPaso] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [resultados, setResultados] = useState<FilaResultado[] | null>(null);

  // Los sugeridos entran marcados, pero se pueden desmarcar: una empresa que
  // arranca con cinco valores que no eligió tiene cinco valores que nadie usa.
  const [valores, setValores] = useState<ValorBorrador[]>(
    sugeridos.map((v) => ({ ...v, incluido: true })),
  );

  const incluidos = valores.filter((v) => v.incluido && v.nombre.trim().length >= 2);

  return (
    <div className="asistente">
      <div className="asistente__caja">
        <header className="asistente__cabecera">
          <p className="etiqueta">BECOME Pulse</p>
          <ol className="pasos" aria-label="Pasos de la puesta en marcha">
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

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {/* ---- Paso 1: identidad ---- */}
        {paso === 0 && (
          <form
            action={async (datos) => {
              setError(null);
              const r = await acciones.guardarIdentidad(datos);
              if (r.error) return setError(r.error);
              setPaso(1);
            }}
          >
            <h1>Vamos a poner en marcha tu empresa</h1>
            <p className="asistente__intro">
              Tres pasos. Cinco minutos. Después, Pulse funciona solo.
            </p>

            <div className="logo-editor">
              <div className="logo-editor__marco">
                {vistaPrevia || empresa.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={vistaPrevia ?? `/api/imagenes/${empresa.logo}`}
                    alt="Vista previa del logotipo"
                  />
                ) : (
                  <span className="logo-editor__vacio" aria-hidden="true">
                    ?
                  </span>
                )}
              </div>
              <div>
                <label className="boton boton--discreto">
                  <UploadSimple size={18} aria-hidden="true" />
                  Subir logotipo
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
                  Opcional. Lo puedes subir después desde Configuración.
                </p>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="nombre">¿Cómo se llama tu empresa?</label>
              <input
                id="nombre"
                name="nombre"
                required
                maxLength={80}
                defaultValue={empresa.nombre}
                autoFocus
              />
            </div>

            <button type="submit" className="boton boton--ancho">
              Siguiente
            </button>
          </form>
        )}

        {/* ---- Paso 2: valores ---- */}
        {paso === 1 && (
          <form
            action={async (datos) => {
              setError(null);
              datos.set(
                "valores",
                JSON.stringify(
                  incluidos.map(({ nombre, descripcion, icono }) => ({
                    nombre,
                    descripcion,
                    icono,
                  })),
                ),
              );
              const r = await acciones.guardarValores(datos);
              if (r.error) return setError(r.error);
              setPaso(2);
            }}
          >
            <h1>¿Qué valora tu empresa?</h1>
            <p className="asistente__intro">
              Son las opciones que verá la gente al reconocer a alguien. Te
              proponemos cinco; quita los que no os representen y cambia los
              nombres a vuestras palabras.
            </p>

            <ul className="borradores">
              {valores.map((v, i) => (
                <li key={i} data-incluido={v.incluido || undefined}>
                  <div className="borradores__fila">
                    <label className="borradores__interruptor">
                      <input
                        type="checkbox"
                        checked={v.incluido}
                        onChange={(e) =>
                          setValores((prev) =>
                            prev.map((x, j) =>
                              j === i ? { ...x, incluido: e.target.checked } : x,
                            ),
                          )
                        }
                      />
                      <span className="visually-hidden">
                        Incluir el valor {v.nombre || `número ${i + 1}`}
                      </span>
                    </label>

                    <span className="borradores__icono">
                      <IconoValor icono={v.icono} size={20} />
                    </span>

                    <input
                      className="borradores__nombre"
                      value={v.nombre}
                      maxLength={40}
                      placeholder="Nombre del valor"
                      aria-label={`Nombre del valor ${i + 1}`}
                      onChange={(e) =>
                        setValores((prev) =>
                          prev.map((x, j) =>
                            j === i ? { ...x, nombre: e.target.value } : x,
                          ),
                        )
                      }
                    />

                    <button
                      type="button"
                      className="boton-icono"
                      onClick={() =>
                        setValores((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      <Trash size={18} aria-hidden="true" />
                      <span className="visually-hidden">
                        Quitar el valor {v.nombre || `número ${i + 1}`}
                      </span>
                    </button>
                  </div>

                  <input
                    className="borradores__descripcion"
                    value={v.descripcion}
                    maxLength={160}
                    placeholder="Cómo se ve este valor en el día a día"
                    aria-label={`Descripción del valor ${i + 1}`}
                    onChange={(e) =>
                      setValores((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, descripcion: e.target.value } : x,
                        ),
                      )
                    }
                  />

                  {v.incluido && (
                    <SelectorIcono
                      nombre={`icono-${i}`}
                      valorInicial={v.icono}
                      plegable
                      alCambiar={(clave) =>
                        setValores((prev) =>
                          prev.map((x, j) => (j === i ? { ...x, icono: clave } : x)),
                        )
                      }
                    />
                  )}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="boton boton--discreto"
              onClick={() =>
                setValores((prev) => [
                  ...prev,
                  { nombre: "", descripcion: "", icono: ICONO_POR_DEFECTO, incluido: true },
                ])
              }
            >
              <Plus size={18} aria-hidden="true" />
              Añadir otro valor
            </button>

            <div className="asistente__botones">
              <button
                type="button"
                className="boton boton--discreto"
                onClick={() => setPaso(0)}
              >
                Atrás
              </button>
              <button type="submit" className="boton" disabled={incluidos.length === 0}>
                Guardar {incluidos.length} valor{incluidos.length === 1 ? "" : "es"}
              </button>
            </div>
          </form>
        )}

        {/* ---- Paso 3: equipo ---- */}
        {paso === 2 && (
          <div>
            <h1>Trae a tu equipo</h1>
            <p className="asistente__intro">
              Pega la lista desde tu hoja de cálculo: nombre, correo, equipo y
              cargo. Cada persona recibirá un enlace que puedes mandarle por
              donde quieras — no hace falta que tengas el correo configurado.
            </p>

            {!resultados ? (
              <form
                action={async (datos) => {
                  setError(null);
                  const r = await acciones.invitarEquipo(datos);
                  setResultados(r.resultados);
                }}
              >
                <div className="campo">
                  <label htmlFor="lista">Nombre, correo, equipo, cargo</label>
                  <textarea
                    id="lista"
                    name="lista"
                    rows={8}
                    placeholder={
                      "Ana Villanueva, ana@empresa.com, Producto, Líder de producto\nDiego Salazar, diego@empresa.com, Operaciones, Jefe de operaciones"
                    }
                  />
                </div>

                <div className="asistente__botones">
                  <button
                    type="button"
                    className="boton boton--discreto"
                    onClick={() => setPaso(1)}
                  >
                    Atrás
                  </button>
                  <button type="submit" className="boton">
                    Dar de alta
                  </button>
                </div>
              </form>
            ) : (
              <>
                <ResumenAltas resultados={resultados} />
                <form action={acciones.terminar} className="asistente__botones">
                  <button
                    type="button"
                    className="boton boton--discreto"
                    onClick={() => setResultados(null)}
                  >
                    Añadir más
                  </button>
                  <button type="submit" className="boton">
                    Listo, entrar a Pulse
                  </button>
                </form>
              </>
            )}

            {!resultados && (
              <form action={acciones.terminar} style={{ marginTop: "var(--space-5)" }}>
                <button type="submit" className="boton-enlace">
                  Lo haré después
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResumenAltas({ resultados }: { resultados: FilaResultado[] }) {
  const altas = resultados.filter((r) => r.estado === "alta");
  const fallos = resultados.filter((r) => r.estado === "error");

  return (
    <div className="tarjeta" style={{ marginBottom: "var(--space-5)" }}>
      <h2 className="titulo-seccion">
        {altas.length} de {resultados.length} dadas de alta
      </h2>

      {fallos.length > 0 && (
        <ul className="lista-fallos">
          {fallos.map((f) => (
            <li key={f.linea}>
              <strong>Línea {f.linea}</strong> — {f.nombre || f.email || "(vacía)"}:{" "}
              {f.detalle}
            </li>
          ))}
        </ul>
      )}

      {altas.length > 0 && (
        <>
          <p>Copia los enlaces y mándaselos. Cada uno caduca en 14 días.</p>
          <textarea
            readOnly
            rows={Math.min(8, altas.length + 1)}
            className="panel-enlace__lista"
            value={altas.map((a) => `${a.nombre}\t${a.enlace}`).join("\n")}
            onFocus={(e) => e.currentTarget.select()}
          />
        </>
      )}
    </div>
  );
}
