import Link from "next/link";
import { CalendarHeart, TrendUp, HandHeart } from "@phosphor-icons/react/dist/ssr";

import { diaYMes } from "@/lib/fechas";
import Avatar from "./Avatar";

type Datos = Awaited<ReturnType<typeof import("@/lib/panel-lateral").datosDelPanel>>;

export default function PanelLateral({ datos }: { datos: Datos }) {
  const { proximas, ranking, sugerencias } = datos;

  return (
    <aside className="rail" aria-label="Resumen de la empresa">
      {proximas.length > 0 && (
        <section className="rail__bloque">
          <h2 className="rail__titulo">
            <CalendarHeart size={18} weight="fill" aria-hidden="true" />
            Esta semana
          </h2>
          <ul className="rail__lista">
            {proximas.map((c) => (
              <li key={`${c.tipo}-${c.persona.id}`}>
                <Avatar persona={c.persona} tamano="sm" />
                <span>
                  <Link href={`/persona/${c.persona.id}`} className="enlace-persona">
                    {c.persona.nombre}
                  </Link>
                  <span className="rail__detalle">
                    {c.tipo === "CUMPLEANOS"
                      ? `Cumple años el ${diaYMes(c.fecha)}`
                      : `${c.anos} ${c.anos === 1 ? "año" : "años"} en la empresa`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ranking.length > 0 && (
        <section className="rail__bloque">
          <h2 className="rail__titulo">
            <TrendUp size={18} weight="fill" aria-hidden="true" />
            Lo que más se reconoce
          </h2>
          <ul className="rail__valores">
            {ranking.map((v) => (
              <li key={v.id}>
                <span className="rail__valor-nombre">
                  <span aria-hidden="true">{v.emoji}</span>
                  {v.nombre}
                </span>
                {/* La barra es decorativa: la cifra ya está escrita al lado,
                    así que un lector de pantalla no necesita oírla. */}
                <span className="rail__barra" aria-hidden="true">
                  <span style={{ width: `${v.porcentaje}%` }} />
                </span>
                <span className="rail__cuenta">{v.total}</span>
              </li>
            ))}
          </ul>
          <p className="rail__pie">Últimos 30 días</p>
        </section>
      )}

      {sugerencias.length > 0 && (
        <section className="rail__bloque">
          <h2 className="rail__titulo">
            <HandHeart size={18} weight="fill" aria-hidden="true" />
            No les has reconocido nada
          </h2>
          <ul className="rail__lista">
            {sugerencias.map((p) => (
              <li key={p.id}>
                <Avatar persona={p} tamano="sm" />
                <span>
                  <Link href={`/persona/${p.id}`} className="enlace-persona">
                    {p.nombre}
                  </Link>
                  {p.cargo && <span className="rail__detalle">{p.cargo}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="rail__pie">
            En los últimos 30 días. Solo lo ves tú.
          </p>
        </section>
      )}
    </aside>
  );
}
