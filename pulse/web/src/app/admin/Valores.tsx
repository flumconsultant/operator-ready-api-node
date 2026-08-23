"use client";

import { useRef } from "react";

type Valor = {
  id: string;
  nombre: string;
  descripcion: string | null;
  emoji: string;
  activo: boolean;
};

// Los valores de la empresa. Se desactivan en vez de borrarse: si un valor
// desaparece de la base, los reconocimientos que lo citaban se quedan huérfanos
// y con ellos el histórico del ranking.

export default function Valores({
  valores,
  crearValor,
  alternarValor,
}: {
  valores: Valor[];
  crearValor: (datos: FormData) => Promise<void>;
  alternarValor: (datos: FormData) => Promise<void>;
}) {
  const formulario = useRef<HTMLFormElement>(null);

  return (
    <section className="tarjeta">
      <h2 style={{ font: "var(--type-h3)", margin: "0 0 var(--space-5)" }}>
        Valores de la empresa
      </h2>

      <div className="tabla-envoltura" style={{ marginBottom: "var(--space-7)" }}>
        <table>
          <thead>
            <tr>
              <th>Valor</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {valores.map((v) => (
              <tr key={v.id}>
                <td>
                  {v.emoji} {v.nombre}
                </td>
                <td style={{ color: "var(--text-muted)" }}>
                  {v.descripcion ?? "—"}
                </td>
                <td>
                  <span
                    className={
                      v.activo ? "insignia" : "insignia insignia--neutra"
                    }
                  >
                    {v.activo ? "Activo" : "Retirado"}
                  </span>
                </td>
                <td>
                  <form action={alternarValor}>
                    <input type="hidden" name="id" value={v.id} />
                    <button className="boton boton--discreto" type="submit">
                      {v.activo ? "Retirar" : "Reactivar"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        ref={formulario}
        action={async (datos) => {
          await crearValor(datos);
          formulario.current?.reset();
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr",
            gap: "var(--space-4)",
          }}
        >
          <div className="campo">
            <label htmlFor="emoji">Emoji</label>
            <input id="emoji" name="emoji" defaultValue="✨" maxLength={4} />
          </div>
          <div className="campo">
            <label htmlFor="nombre">Nombre del valor</label>
            <input id="nombre" name="nombre" required maxLength={40} />
          </div>
        </div>
        <div className="campo">
          <label htmlFor="descripcion">Descripción (opcional)</label>
          <input id="descripcion" name="descripcion" maxLength={160} />
        </div>
        <button className="boton" type="submit">
          Añadir valor
        </button>
      </form>
    </section>
  );
}
