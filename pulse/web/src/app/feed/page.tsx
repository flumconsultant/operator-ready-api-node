import { prisma } from "@/lib/prisma";
import { feed } from "@/lib/reconocimientos";
import { serializarEntradas } from "@/lib/serializar";
import { sesionConfigurada } from "@/lib/sesion";
import { datosDelPanel } from "@/lib/panel-lateral";
import Marco from "@/componentes/Marco";
import PanelLateral from "@/componentes/PanelLateral";
import ListaFeed from "@/componentes/ListaFeed";
import Reconocer from "./Reconocer";

export const metadata = { title: "Feed" };
export const dynamic = "force-dynamic";

export default async function Feed() {
  const usuario = await sesionConfigurada();
  const companyId = usuario.companyId;

  const [pagina, valores, companeros, yo, panel] = await Promise.all([
    feed(companyId, { limite: 15 }),
    prisma.value.findMany({
      where: { companyId, activo: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      select: { id: true, nombre: true, icono: true, descripcion: true },
    }),
    prisma.user.findMany({
      where: { companyId, activo: true, NOT: { id: usuario.id } },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, equipo: true, imagen: true },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: usuario.id },
      select: { id: true, nombre: true, imagen: true },
    }),
    datosDelPanel(companyId, usuario.id),
  ]);

  return (
    <Marco actual="/feed">
      <div className="con-rail">
        <div className="columna-feed">
          <Reconocer yo={yo} valores={valores} companeros={companeros} />

          {pagina.entradas.length === 0 ? (
            <div className="vacio">
              <h2>Aún no hay nada por aquí</h2>
              <p>
                El primer reconocimiento siempre cuesta. A partir del tercero
                esto se sostiene solo — empieza por alguien que te haya sacado
                de un apuro esta semana.
              </p>
            </div>
          ) : (
            <ListaFeed
              inicial={serializarEntradas(pagina.entradas)}
              cursorInicial={pagina.cursor}
              hayMasInicial={pagina.hayMas}
              usuarioActual={yo}
            />
          )}
        </div>

        <PanelLateral datos={panel} />
      </div>
    </Marco>
  );
}
