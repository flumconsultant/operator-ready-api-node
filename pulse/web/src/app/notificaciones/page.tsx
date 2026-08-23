import Link from "next/link";
import { revalidatePath } from "next/cache";
import { BellSimpleIcon } from "@phosphor-icons/react/dist/ssr";

import { listar, marcarTodasLeidas } from "@/lib/notificaciones";
import { sesionConfigurada } from "@/lib/sesion";
import Marco from "@/componentes/Marco";
import Avatar from "@/componentes/Avatar";
import Fecha from "@/componentes/Fecha";

export const metadata = { title: "Novedades" };
export const dynamic = "force-dynamic";

export default async function Notificaciones() {
  const usuario = await sesionConfigurada();
  const notificaciones = await listar(usuario.id);

  async function marcarLeidas() {
    "use server";
    const u = await sesionConfigurada();
    await marcarTodasLeidas(u.id);
    revalidatePath("/notificaciones");
    revalidatePath("/feed");
  }

  const sinLeer = notificaciones.filter((n) => !n.leidaEn).length;

  return (
    <Marco actual="/notificaciones">
      <div className="columna-feed">
        <div className="cabecera-pagina cabecera-pagina--con-accion">
          <div>
            <h1>Novedades</h1>
            <p>Lo que ha pasado contigo mientras no mirabas.</p>
          </div>
          {sinLeer > 0 && (
            <form action={marcarLeidas}>
              <button type="submit" className="boton boton--discreto">
                Marcar todo como leído
              </button>
            </form>
          )}
        </div>

        {notificaciones.length === 0 ? (
          <div className="vacio">
            <BellSimpleIcon size={32} aria-hidden="true" />
            <h2>Nada nuevo</h2>
            <p>
              Aquí aparecerán los reconocimientos que recibas y los comentarios
              en las conversaciones donde participes.
            </p>
          </div>
        ) : (
          <ul className="notificaciones">
            {notificaciones.map((n) => (
              <li key={n.id}>
                {/* Pasa por la API para quedar marcada como leída antes de
                    llegar al destino. */}
                <Link
                  href={`/api/notificaciones/${n.id}`}
                  className="notificacion"
                  data-sin-leer={!n.leidaEn || undefined}
                >
                  {n.actor ? (
                    <Avatar persona={n.actor} tamano="md" enlazado={false} />
                  ) : (
                    <span className="notificacion__icono" aria-hidden="true">
                      <BellSimpleIcon size={20} weight="fill" />
                    </span>
                  )}
                  <span className="notificacion__cuerpo">
                    <span className="notificacion__texto">{n.texto}</span>
                    <span className="meta">
                      <Fecha valor={n.creadaEn.toISOString()} />
                    </span>
                  </span>
                  {!n.leidaEn && (
                    <span className="notificacion__punto" aria-label="Sin leer" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Marco>
  );
}
