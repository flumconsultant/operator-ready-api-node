import type { Prisma } from "@prisma/client";
import { inclusionFeed } from "@/lib/reconocimientos";
import Reacciones from "./Reacciones";

type Fila = Prisma.RecognitionGetPayload<{ include: typeof inclusionFeed }>;

const FORMATO = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default function Reconocimiento({
  reconocimiento: r,
  usuarioActual,
}: {
  reconocimiento: Fila;
  usuarioActual: string;
}) {
  return (
    <article className="reconocimiento">
      <div className="reconocimiento__linea">
        <strong>{r.de.nombre}</strong>
        <span>reconoció a</span>
        <strong>{r.para.nombre}</strong>
        <span className="insignia">
          {r.valor.emoji} {r.valor.nombre}
        </span>
        {r.canal === "DISCORD" && (
          <span className="insignia insignia--neutra">Discord</span>
        )}
      </div>

      <p className="reconocimiento__mensaje">{r.mensaje}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <Reacciones
          recognitionId={r.id}
          reacciones={r.reacciones}
          usuarioActual={usuarioActual}
        />
        <time className="meta" dateTime={r.creadoEn.toISOString()}>
          {FORMATO.format(r.creadoEn)}
        </time>
      </div>
    </article>
  );
}
