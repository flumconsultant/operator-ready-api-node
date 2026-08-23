import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { sesionDeAdmin } from "@/lib/sesion";
import { anotar } from "@/lib/auditoria";
import { prisma } from "@/lib/prisma";
import { metricasDeEmpresa } from "@/lib/metricas";
import { mapaDeInfluencia, personasDesconectadas } from "@/lib/ia/influencia";
import { iaActiva } from "@/lib/entorno";
import Marco from "@/componentes/Marco";
import PestanasAdmin from "@/componentes/PestanasAdmin";
import IconoValor from "@/componentes/IconoValor";
import Valores from "./Valores";

export const metadata = { title: "Cultura y valores" };
export const dynamic = "force-dynamic";

export default async function Admin() {
  const { companyId } = await sesionDeAdmin();

  const [metricas, valores, influencia, desconectadas, ultimoInsight] =
    await Promise.all([
      metricasDeEmpresa(companyId, 30),
      prisma.value.findMany({
        where: { companyId },
        orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      }),
      mapaDeInfluencia(companyId, 90),
      personasDesconectadas(companyId, 60),
      prisma.weeklyInsight.findFirst({
        where: { companyId },
        orderBy: { generadoEn: "desc" },
      }),
    ]);

  async function crearValor(datos: FormData) {
    "use server";
    const s = await auth();
    if (s?.user.rol !== "ADMIN") return;
    const nombre = String(datos.get("nombre") ?? "").trim();
    if (!nombre) return;
    const creado = await prisma.value.create({
      data: {
        companyId: s.user.companyId,
        nombre,
        icono: String(datos.get("icono") ?? "chispa"),
        descripcion: String(datos.get("descripcion") ?? "").trim() || null,
      },
      select: { id: true },
    });

    await anotar({
      companyId: s.user.companyId,
      actorId: s.user.id,
      actorNombre: s.user.name ?? null,
      accion: "VALOR_CREADO",
      objetivoId: creado.id,
      objetivoNombre: nombre,
    });

    revalidatePath("/[empresa]/admin", "page");
    revalidatePath("/[empresa]/feed", "page");
  }

  async function alternarValor(datos: FormData) {
    "use server";
    const s = await auth();
    if (s?.user.rol !== "ADMIN") return;
    const id = String(datos.get("id") ?? "");
    // El where lleva companyId: sin él, un id copiado de otra empresa la
    // desactivaría desde aquí.
    const valor = await prisma.value.findFirst({
      where: { id, companyId: s.user.companyId },
      select: { id: true, activo: true, nombre: true },
    });
    if (!valor) return;

    await prisma.value.update({
      where: { id: valor.id },
      data: { activo: !valor.activo },
    });

    await anotar({
      companyId: s.user.companyId,
      actorId: s.user.id,
      actorNombre: s.user.name ?? null,
      accion: valor.activo ? "VALOR_RETIRADO" : "VALOR_REACTIVADO",
      objetivoId: valor.id,
      objetivoNombre: valor.nombre,
    });

    revalidatePath("/[empresa]/admin", "page");
    revalidatePath("/[empresa]/feed", "page");
  }

  const maxRanking = metricas.ranking[0]?.total ?? 1;

  return (
    <Marco actual="cultura">
      <div className="cabecera-pagina">
        <h1>Cultura y valores</h1>
        <p>
          Lo que la actividad de los últimos 30 días dice del clima, sin haber
          lanzado ninguna encuesta.
        </p>
      </div>

      <PestanasAdmin />

      <div className="rejilla-metricas">
        <div className="tarjeta">
          <span className="metrica__cifra">{metricas.participacion}%</span>
          <span className="metrica__pie">
            de la plantilla dio al menos un reconocimiento
          </span>
        </div>
        <div className="tarjeta">
          <span className="metrica__cifra">{metricas.reconocimientos}</span>
          <span className="metrica__pie">reconocimientos en 30 días</span>
        </div>
        <div className="tarjeta">
          <span className="metrica__cifra">{metricas.porcentajeDiscord}%</span>
          <span className="metrica__pie">llegaron desde Discord</span>
        </div>
        <div className="tarjeta">
          <span className="metrica__cifra">{desconectadas.length}</span>
          <span className="metrica__pie">
            {desconectadas.length === 1 ? "persona" : "personas"} sin actividad
            en 60 días
          </span>
        </div>
      </div>

      <section className="tarjeta" style={{ marginBottom: "var(--space-8)" }}>
        <h2 style={{ font: "var(--type-h3)", margin: "0 0 var(--space-2)" }}>
          Resumen semanal
        </h2>
        <p className="meta">
          {ultimoInsight
            ? `Semana ${ultimoInsight.semanaIso}`
            : "Todavía no se ha generado ninguno"}
          {!iaActiva && " · capa de IA desactivada (falta ANTHROPIC_API_KEY)"}
        </p>
        <pre
          style={{
            font: "var(--type-body)",
            whiteSpace: "pre-wrap",
            margin: "var(--space-4) 0 0",
            color: "var(--text-body)",
          }}
        >
          {ultimoInsight?.contenido ??
            "El job semanal escribe aquí de 3 a 5 insights accionables. Se puede lanzar a mano con npm run resumen."}
        </pre>
      </section>

      <section className="tarjeta" style={{ marginBottom: "var(--space-8)" }}>
        <h2 style={{ font: "var(--type-h3)", margin: "0 0 var(--space-5)" }}>
          Valores más reconocidos
        </h2>
        {metricas.ranking.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Sin datos en la ventana.</p>
        ) : (
          <div className="tabla-envoltura">
            <table>
              <thead>
                <tr>
                  <th>Valor</th>
                  <th>Menciones</th>
                  <th style={{ width: "50%" }}>Peso</th>
                </tr>
              </thead>
              <tbody>
                {metricas.ranking.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <span className="insignia-valor">
                        <IconoValor icono={v.icono} />
                        {v.nombre}
                      </span>
                    </td>
                    <td>{v.total}</td>
                    <td>
                      <span
                        className="barra"
                        style={{ width: `${(v.total / maxRanking) * 100}%` }}
                        aria-hidden="true"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="tarjeta" style={{ marginBottom: "var(--space-8)" }}>
        <h2 style={{ font: "var(--type-h3)", margin: "0 0 var(--space-2)" }}>
          Mapa de influencia
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          Ordenado por cuánta <em>gente distinta</em> reconoce a cada persona, no
          por cuántos reconocimientos acumula. Es un proxy de influencia
          positiva, no una evaluación de desempeño.
        </p>
        {influencia.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>
            Aún no hay suficiente actividad para dibujar la red.
          </p>
        ) : (
          <div className="tabla-envoltura">
            <table>
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Equipo</th>
                  <th>Personas distintas</th>
                  <th>Equipos distintos</th>
                  <th>Índice</th>
                </tr>
              </thead>
              <tbody>
                {influencia.slice(0, 10).map((n) => (
                  <tr key={n.userId}>
                    <td>{n.nombre}</td>
                    <td>{n.equipo ?? "—"}</td>
                    <td>{n.reconocedores}</td>
                    <td>{n.equiposAlcanzados}</td>
                    <td>{n.influencia.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {desconectadas.length > 0 && (
        <section className="tarjeta" style={{ marginBottom: "var(--space-8)" }}>
          <h2 style={{ font: "var(--type-h3)", margin: "0 0 var(--space-2)" }}>
            Señal de desconexión
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            60 días sin dar ni recibir un reconocimiento. No significa que se
            vayan a ir; significa que merece una conversación.
          </p>
          <ul>
            {desconectadas.map((p) => (
              <li key={p.id} style={{ marginBottom: "var(--space-2)" }}>
                {p.nombre}
                {p.equipo ? ` — ${p.equipo}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Valores
        valores={valores}
        crearValor={crearValor}
        alternarValor={alternarValor}
      />
    </Marco>
  );
}
