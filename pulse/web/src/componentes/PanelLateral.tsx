"use client";

import Link from "next/link";
import {
  CalendarHeartIcon,
  TrendUpIcon,
  HandHeartIcon,
  CompassIcon,
} from "@phosphor-icons/react/dist/ssr";

import { diaYMes } from "@/lib/fechas";
import Avatar from "./Avatar";
import IconoValor from "./IconoValor";
import { useRutas } from "./useRutas";

type Datos = Awaited<ReturnType<typeof import("@/lib/panel-lateral").datosDelPanel>>;

export default function PanelLateral({ datos }: { datos: Datos }) {
  const r = useRutas();
  const { proximas, ranking, sugerencias } = datos;

  // Los tres bloques dependen de que ya haya pasado algo: cumpleaños en la
  // agenda, kudos que contar, gente a quien no has reconocido. En una empresa
  // recién creada no hay ninguna de las tres cosas y la columna se queda en
  // blanco, que es la peor primera impresión posible. Los primeros días se
  // llena con lo que sí se puede decir siempre: qué hacer a continuación.
  const vacio =
    proximas.length === 0 && ranking.length === 0 && sugerencias.length === 0;

  return (
    <aside className="rail" aria-label="Resumen de la empresa">
      {vacio && (
        <section className="rail__bloque">
          <h2 className="rail__titulo">
            <CompassIcon size={18} weight="fill" aria-hidden="true" />
            Los primeros días
          </h2>
          <ul className="rail__pasos">
            <li>
              Escribe el primer reconocimiento. Concreto: qué hizo y qué
              cambió. Es lo que marca el tono de todos los demás.
            </li>
            <li>
              Invita al equipo desde <Link href={r.equipo}>Mi equipo</Link>. Un
              feed de dos personas no es un feed.
            </li>
            <li>
              Cuando haya movimiento, aquí verás los cumpleaños de la semana, los
              valores que más se reconocen y a quién llevas tiempo sin
              mencionar.
            </li>
          </ul>
        </section>
      )}
      {proximas.length > 0 && (
        <section className="rail__bloque">
          <h2 className="rail__titulo">
            <CalendarHeartIcon size={18} weight="fill" aria-hidden="true" />
            Esta semana
          </h2>
          <ul className="rail__lista">
            {proximas.map((c) => (
              <li key={`${c.tipo}-${c.persona.id}`}>
                <Avatar persona={c.persona} tamano="sm" />
                <span>
                  <Link href={r.persona(c.persona.id)} className="enlace-persona">
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
            <TrendUpIcon size={18} weight="fill" aria-hidden="true" />
            Lo que más se reconoce
          </h2>
          <ul className="rail__valores">
            {ranking.map((v) => (
              <li key={v.id}>
                <span className="rail__valor-nombre">
                  <IconoValor icono={v.icono} />
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
            <HandHeartIcon size={18} weight="fill" aria-hidden="true" />
            No les has reconocido nada
          </h2>
          <ul className="rail__lista">
            {sugerencias.map((p) => (
              <li key={p.id}>
                <Avatar persona={p} tamano="sm" />
                <span>
                  <Link href={r.persona(p.id)} className="enlace-persona">
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
