import { sesionDeManager } from "@/lib/sesion";
import { prisma } from "@/lib/prisma";
import { metricasDeEquipo, metricasDeEmpresa } from "@/lib/metricas";
import Marco from "@/componentes/Marco";

export const metadata = { title: "Mi equipo" };
export const dynamic = "force-dynamic";

// El panel del manager: cuántos reconocimientos ha dado y recibido su gente en
// los últimos 30 días. Nada más. La tentación de meter aquí el ranking de
// influencia es fuerte y está resistida a propósito: un manager que ve quién
// puntúa alto empieza a gestionar la puntuación.

export default async function Panel({
  searchParams,
}: {
  searchParams: Promise<{ equipo?: string }>;
}) {
  const { rol, companyId, id } = await sesionDeManager();

  const yo = await prisma.user.findUnique({
    where: { id },
    select: { equipo: true },
  });

  // Un admin puede mirar cualquier equipo; un manager, el suyo.
  const { equipo: pedido } = await searchParams;
  const equipo = rol === "ADMIN" ? (pedido ?? yo?.equipo ?? null) : yo?.equipo ?? null;

  const [equipos, datos, empresa] = await Promise.all([
    rol === "ADMIN"
      ? prisma.user.findMany({
          where: { companyId, activo: true, equipo: { not: null } },
          distinct: ["equipo"],
          select: { equipo: true },
          orderBy: { equipo: "asc" },
        })
      : Promise.resolve([]),
    metricasDeEquipo(companyId, equipo, 30),
    metricasDeEmpresa(companyId, 30),
  ]);

  const totalDados = datos.filas.reduce((a, f) => a + f.dados, 0);
  const totalRecibidos = datos.filas.reduce((a, f) => a + f.recibidos, 0);
  const sinDar = datos.filas.filter((f) => f.dados === 0).length;

  return (
    <Marco actual="/panel">
      <div className="cabecera-pagina">
        <h1>{equipo ?? "Sin equipo asignado"}</h1>
        <p>Últimos 30 días. La media de la empresa está al lado de cada cifra.</p>
      </div>

      {rol === "ADMIN" && equipos.length > 0 && (
        <form className="campo" style={{ maxWidth: 320 }}>
          <label htmlFor="equipo">Ver otro equipo</label>
          <select id="equipo" name="equipo" defaultValue={equipo ?? ""}>
            {equipos.map((e) => (
              <option key={e.equipo} value={e.equipo!}>
                {e.equipo}
              </option>
            ))}
          </select>
          <button className="boton boton--discreto" type="submit">
            Ver
          </button>
        </form>
      )}

      <div className="rejilla-metricas">
        <div className="tarjeta">
          <span className="metrica__cifra">{totalDados}</span>
          <span className="metrica__pie">reconocimientos dados por el equipo</span>
        </div>
        <div className="tarjeta">
          <span className="metrica__cifra">{totalRecibidos}</span>
          <span className="metrica__pie">recibidos por el equipo</span>
        </div>
        <div className="tarjeta">
          <span className="metrica__cifra">{sinDar}</span>
          <span className="metrica__pie">
            personas que no han dado ninguno
          </span>
        </div>
        <div className="tarjeta">
          <span className="metrica__cifra">{empresa.participacion}%</span>
          <span className="metrica__pie">
            participación en toda la empresa
          </span>
        </div>
      </div>

      <section className="tarjeta">
        <h2 style={{ font: "var(--type-h3)", margin: "0 0 var(--space-5)" }}>
          Persona a persona
        </h2>
        {datos.filas.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>
            No hay nadie asignado a este equipo todavía.
          </p>
        ) : (
          <div className="tabla-envoltura">
            <table>
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Dados</th>
                  <th>Recibidos</th>
                </tr>
              </thead>
              <tbody>
                {datos.filas.map((f) => (
                  <tr key={f.id}>
                    <td>{f.nombre}</td>
                    <td>{f.dados}</td>
                    <td>{f.recibidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Marco>
  );
}
