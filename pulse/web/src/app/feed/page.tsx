import { sesionRequerida } from "@/lib/sesion";
import { prisma } from "@/lib/prisma";
import { feed } from "@/lib/reconocimientos";
import Marco from "@/componentes/Marco";
import Reconocimiento from "@/componentes/Reconocimiento";
import Reconocer from "./Reconocer";

export const metadata = { title: "Feed" };
export const dynamic = "force-dynamic";

export default async function Feed() {
  const usuario = await sesionRequerida();
  const companyId = usuario.companyId;

  const [reconocimientos, valores, companeros] = await Promise.all([
    feed(companyId),
    prisma.value.findMany({
      where: { companyId, activo: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      select: { id: true, nombre: true, emoji: true },
    }),
    prisma.user.findMany({
      where: { companyId, activo: true, NOT: { id: usuario.id } },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, equipo: true },
    }),
  ]);

  return (
    <Marco actual="/feed">
      <div className="cabecera-pagina">
        <h1>Feed</h1>
        <p>
          Lo que está pasando en tu empresa. Da igual si se escribió aquí o en
          Discord: llega al mismo sitio.
        </p>
      </div>

      <Reconocer valores={valores} companeros={companeros} />

      <section
        className="tarjeta"
        style={{ marginTop: "var(--space-8)", paddingBlock: "var(--space-2)" }}
      >
        {reconocimientos.length === 0 ? (
          <p style={{ padding: "var(--space-8) 0", color: "var(--text-muted)" }}>
            Todavía no hay reconocimientos. El primero suele costar; a partir del
            tercero se sostiene solo.
          </p>
        ) : (
          reconocimientos.map((r) => (
            <Reconocimiento
              key={r.id}
              reconocimiento={r}
              usuarioActual={usuario.id}
            />
          ))
        )}
      </section>
    </Marco>
  );
}
