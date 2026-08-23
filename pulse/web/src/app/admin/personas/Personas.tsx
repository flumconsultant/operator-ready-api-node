"use client";

import { useState } from "react";
import {
  ArrowClockwise,
  Check,
  Copy,
  PencilSimple,
  Prohibit,
  UserPlus,
  Users,
  X,
} from "@phosphor-icons/react/dist/ssr";

import Avatar from "@/componentes/Avatar";

type Persona = {
  id: string;
  nombre: string;
  email: string;
  imagen: string | null;
  rol: "ADMIN" | "MANAGER" | "COLABORADOR";
  equipo: string | null;
  cargo: string | null;
  discordId: string | null;
  activo: boolean;
  invitacionPendiente: boolean;
  invitacionExpira: string | null;
  primerAcceso: string | null;
};

type Acciones = {
  invitar: (d: FormData) => Promise<{ error?: string; enlace?: string; nombre?: string }>;
  invitarLista: (d: FormData) => Promise<{ resultados: FilaResultado[] }>;
  editar: (d: FormData) => Promise<{ error?: string; ok?: true }>;
  alternarEstado: (d: FormData) => Promise<{ error?: string; ok?: true }>;
  renovar: (d: FormData) => Promise<{ error?: string; enlace?: string }>;
};

type FilaResultado = {
  linea: number;
  nombre: string;
  email: string;
  estado: "alta" | "error";
  detalle?: string;
  enlace?: string;
};

const ROLES = [
  { valor: "COLABORADOR", texto: "Colaborador", ayuda: "Ve el feed y reconoce." },
  { valor: "MANAGER", texto: "Manager", ayuda: "Además ve el panel de su equipo." },
  { valor: "ADMIN", texto: "Administrador", ayuda: "Además configura la empresa y da de alta a la gente." },
] as const;

export default function Personas({
  gente,
  dominioCorreo,
  acciones,
}: {
  gente: Persona[];
  dominioCorreo: string | null;
  acciones: Acciones;
}) {
  const [modo, setModo] = useState<"ninguno" | "una" | "lista">("ninguno");
  const [error, setError] = useState<string | null>(null);
  const [enlace, setEnlace] = useState<{ nombre: string; url: string } | null>(null);
  const [resultados, setResultados] = useState<FilaResultado[] | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const filtrada = gente.filter((p) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return [p.nombre, p.email, p.equipo, p.cargo]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(q));
  });

  const pendientes = gente.filter((p) => p.invitacionPendiente).length;

  return (
    <>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {enlace && <EnlaceInvitacion nombre={enlace.nombre} url={enlace.url} alCerrar={() => setEnlace(null)} />}

      {resultados && (
        <ResumenLista resultados={resultados} alCerrar={() => setResultados(null)} />
      )}

      <div className="barra-acciones">
        <div className="campo campo--compacto barra-acciones__buscador">
          <label className="visually-hidden" htmlFor="buscar">
            Buscar una persona
          </label>
          <input
            id="buscar"
            type="search"
            placeholder="Buscar por nombre, correo o equipo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="boton"
          onClick={() => {
            setModo(modo === "una" ? "ninguno" : "una");
            setError(null);
          }}
        >
          <UserPlus size={18} aria-hidden="true" />
          Invitar a alguien
        </button>

        <button
          type="button"
          className="boton boton--discreto"
          onClick={() => {
            setModo(modo === "lista" ? "ninguno" : "lista");
            setError(null);
          }}
        >
          <Users size={18} aria-hidden="true" />
          Pegar una lista
        </button>
      </div>

      {modo === "una" && (
        <form
          className="tarjeta bloque-config"
          action={async (datos) => {
            setError(null);
            const r = await acciones.invitar(datos);
            if (r.error) return setError(r.error);
            setEnlace({ nombre: r.nombre!, url: r.enlace! });
            setModo("ninguno");
          }}
        >
          <h2 className="titulo-seccion">Nueva persona</h2>

          <div className="rejilla-dos">
            <div className="campo">
              <label htmlFor="n-nombre">Nombre y apellido</label>
              <input id="n-nombre" name="nombre" required maxLength={80} />
            </div>
            <div className="campo">
              <label htmlFor="n-email">Correo de trabajo</label>
              <input id="n-email" name="email" type="email" required maxLength={120} />
              {dominioCorreo && (
                <p className="meta">El dominio de tu empresa es @{dominioCorreo}.</p>
              )}
            </div>
          </div>

          <div className="rejilla-dos">
            <div className="campo">
              <label htmlFor="n-equipo">Equipo</label>
              <input id="n-equipo" name="equipo" maxLength={60} placeholder="Operaciones" />
            </div>
            <div className="campo">
              <label htmlFor="n-cargo">Cargo</label>
              <input id="n-cargo" name="cargo" maxLength={80} placeholder="Analista" />
            </div>
          </div>

          <fieldset className="campo">
            <legend>Permisos</legend>
            {ROLES.map((r) => (
              <label key={r.valor} className="opcion-radio">
                <input
                  type="radio"
                  name="rol"
                  value={r.valor}
                  defaultChecked={r.valor === "COLABORADOR"}
                />
                <span>
                  <strong>{r.texto}</strong>
                  <span className="opcion-radio__ayuda">{r.ayuda}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <button type="submit" className="boton">
            Crear y generar enlace
          </button>
        </form>
      )}

      {modo === "lista" && (
        <form
          className="tarjeta bloque-config"
          action={async (datos) => {
            setError(null);
            const r = await acciones.invitarLista(datos);
            setResultados(r.resultados);
            setModo("ninguno");
          }}
        >
          <h2 className="titulo-seccion">Pegar una lista</h2>
          <p>
            Una persona por línea, separando con comas o tabuladores. Puedes
            copiar y pegar directamente desde una hoja de cálculo. Todas entran
            como colaboradoras; los permisos se cambian después.
          </p>

          <div className="campo">
            <label htmlFor="lista">Nombre, correo, equipo, cargo</label>
            <textarea
              id="lista"
              name="lista"
              required
              rows={8}
              placeholder={"Ana Villanueva, ana@empresa.com, Producto, Líder de producto\nDiego Salazar, diego@empresa.com, Operaciones, Jefe de operaciones"}
            />
          </div>

          <button type="submit" className="boton">
            Dar de alta a toda la lista
          </button>
        </form>
      )}

      {pendientes > 0 && (
        <p className="aviso" role="status">
          {pendientes === 1
            ? "Una persona tiene la invitación pendiente y todavía no ha entrado."
            : `${pendientes} personas tienen la invitación pendiente y todavía no han entrado.`}
        </p>
      )}

      <section className="tarjeta">
        <div className="tabla-envoltura">
          <table>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Equipo</th>
                <th>Permisos</th>
                <th>Estado</th>
                <th><span className="visually-hidden">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {filtrada.map((p) =>
                editando === p.id ? (
                  <tr key={p.id}>
                    <td colSpan={5}>
                      <FormularioEdicion
                        persona={p}
                        alGuardar={async (datos) => {
                          setError(null);
                          const r = await acciones.editar(datos);
                          if (r.error) return setError(r.error);
                          setEditando(null);
                        }}
                        alCancelar={() => setEditando(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={p.id} data-inactiva={!p.activo || undefined}>
                    <td>
                      <span className="celda-persona">
                        <Avatar persona={p} tamano="sm" />
                        <span>
                          <strong>{p.nombre}</strong>
                          <span className="celda-persona__correo">{p.email}</span>
                        </span>
                      </span>
                    </td>
                    <td>
                      {p.equipo ?? "—"}
                      {p.cargo && <span className="celda-persona__correo">{p.cargo}</span>}
                    </td>
                    <td>{ROLES.find((r) => r.valor === p.rol)?.texto}</td>
                    <td>
                      {!p.activo ? (
                        <span className="insignia insignia--neutra">Desactivada</span>
                      ) : p.invitacionPendiente ? (
                        <span className="insignia insignia--aviso">Sin entrar</span>
                      ) : (
                        <span className="insignia">Activa</span>
                      )}
                      {p.discordId && (
                        <span className="celda-persona__correo">Discord enlazado</span>
                      )}
                    </td>
                    <td>
                      <div className="acciones-fila">
                        <button
                          type="button"
                          className="boton-icono"
                          onClick={() => setEditando(p.id)}
                        >
                          <PencilSimple size={18} aria-hidden="true" />
                          <span className="visually-hidden">Editar a {p.nombre}</span>
                        </button>

                        {p.invitacionPendiente && (
                          <form
                            action={async (datos) => {
                              setError(null);
                              const r = await acciones.renovar(datos);
                              if (r.error) return setError(r.error);
                              setEnlace({ nombre: p.nombre, url: r.enlace! });
                            }}
                          >
                            <input type="hidden" name="userId" value={p.id} />
                            <button type="submit" className="boton-icono">
                              <ArrowClockwise size={18} aria-hidden="true" />
                              <span className="visually-hidden">
                                Generar un enlace nuevo para {p.nombre}
                              </span>
                            </button>
                          </form>
                        )}

                        <form
                          action={async (datos) => {
                            setError(null);
                            const r = await acciones.alternarEstado(datos);
                            if (r.error) setError(r.error);
                          }}
                        >
                          <input type="hidden" name="userId" value={p.id} />
                          <input type="hidden" name="activo" value={p.activo ? "no" : "si"} />
                          <button type="submit" className="boton-icono">
                            {p.activo ? (
                              <Prohibit size={18} aria-hidden="true" />
                            ) : (
                              <Check size={18} aria-hidden="true" />
                            )}
                            <span className="visually-hidden">
                              {p.activo ? `Desactivar a ${p.nombre}` : `Reactivar a ${p.nombre}`}
                            </span>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {filtrada.length === 0 && (
          <p style={{ color: "var(--text-muted)", margin: "var(--space-6) 0 0" }}>
            Nadie coincide con «{busqueda}».
          </p>
        )}
      </section>
    </>
  );
}

function FormularioEdicion({
  persona,
  alGuardar,
  alCancelar,
}: {
  persona: Persona;
  alGuardar: (datos: FormData) => Promise<void>;
  alCancelar: () => void;
}) {
  return (
    <form className="edicion-fila" action={alGuardar}>
      <input type="hidden" name="userId" value={persona.id} />

      <p className="edicion-fila__quien">
        <strong>{persona.nombre}</strong>
        <span className="celda-persona__correo">{persona.email}</span>
      </p>

      <div className="rejilla-dos">
        <div className="campo">
          <label htmlFor={`e-equipo-${persona.id}`}>Equipo</label>
          <input
            id={`e-equipo-${persona.id}`}
            name="equipo"
            maxLength={60}
            defaultValue={persona.equipo ?? ""}
          />
        </div>
        <div className="campo">
          <label htmlFor={`e-cargo-${persona.id}`}>Cargo</label>
          <input
            id={`e-cargo-${persona.id}`}
            name="cargo"
            maxLength={80}
            defaultValue={persona.cargo ?? ""}
          />
        </div>
      </div>

      <div className="rejilla-dos">
        <div className="campo">
          <label htmlFor={`e-rol-${persona.id}`}>Permisos</label>
          <select id={`e-rol-${persona.id}`} name="rol" defaultValue={persona.rol}>
            {ROLES.map((r) => (
              <option key={r.valor} value={r.valor}>
                {r.texto}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor={`e-discord-${persona.id}`}>ID de Discord</label>
          <input
            id={`e-discord-${persona.id}`}
            name="discordId"
            inputMode="numeric"
            maxLength={25}
            defaultValue={persona.discordId ?? ""}
            placeholder="123456789012345678"
          />
          <p className="meta">
            Sin esto no puede usar <code>/reconocer</code> en Discord.
          </p>
        </div>
      </div>

      <div className="edicion-fila__botones">
        <button type="submit" className="boton">
          Guardar
        </button>
        <button type="button" className="boton boton--discreto" onClick={alCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

/// El enlace de invitación. Se enseña una vez y con un botón de copiar, porque
/// lo que va a pasar de verdad es que el administrador lo pegue en un WhatsApp.
function EnlaceInvitacion({
  nombre,
  url,
  alCerrar,
}: {
  nombre: string;
  url: string;
  alCerrar: () => void;
}) {
  const [copiado, setCopiado] = useState(false);

  return (
    <div className="tarjeta panel-enlace" role="status">
      <div className="panel-enlace__texto">
        <h2 className="titulo-seccion">Invitación lista para {nombre}</h2>
        <p>
          Mándale este enlace. Caduca en 14 días y con él elige su contraseña y
          entra. No hace falta que tengas el correo configurado.
        </p>
        <code className="panel-enlace__url">{url}</code>
      </div>

      <div className="panel-enlace__botones">
        <button
          type="button"
          className="boton"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2500);
            } catch {
              // Sin permiso de portapapeles el enlace sigue visible y
              // seleccionable, así que no hay nada que rescatar.
            }
          }}
        >
          {copiado ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {copiado ? "Copiado" : "Copiar enlace"}
        </button>
        <button type="button" className="boton-icono" onClick={alCerrar}>
          <X size={18} aria-hidden="true" />
          <span className="visually-hidden">Cerrar</span>
        </button>
      </div>
    </div>
  );
}

function ResumenLista({
  resultados,
  alCerrar,
}: {
  resultados: FilaResultado[];
  alCerrar: () => void;
}) {
  const altas = resultados.filter((r) => r.estado === "alta");
  const fallos = resultados.filter((r) => r.estado === "error");

  return (
    <div className="tarjeta panel-enlace" role="status">
      <div className="panel-enlace__texto">
        <h2 className="titulo-seccion">
          {altas.length} de {resultados.length} dadas de alta
        </h2>

        {fallos.length > 0 && (
          <>
            <p>Estas líneas no se pudieron procesar:</p>
            <ul className="lista-fallos">
              {fallos.map((f) => (
                <li key={f.linea}>
                  <strong>Línea {f.linea}</strong> — {f.nombre || f.email || "(vacía)"}:{" "}
                  {f.detalle}
                </li>
              ))}
            </ul>
          </>
        )}

        {altas.length > 0 && (
          <>
            <p>
              Copia los enlaces y mándaselos. Cada uno caduca en 14 días.
            </p>
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

      <div className="panel-enlace__botones">
        <button type="button" className="boton boton--discreto" onClick={alCerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
