import Link from "next/link";
import {
  HouseIcon,
  UsersThreeIcon,
  ChartLineUpIcon,
  BellSimpleIcon,
  SignOutIcon,
} from "@phosphor-icons/react/dist/ssr";

import { signOut } from "@/lib/auth";
import { sesionRequerida } from "@/lib/sesion";
import { ACCEDER, rutas } from "@/lib/rutas";
import { sinLeer } from "@/lib/notificaciones";
import { prisma } from "@/lib/prisma";
import Avatar from "./Avatar";

// El marco de la aplicación.
//
// En pantalla ancha es una barra lateral; por debajo de 860px se convierte en
// una barra inferior de cuatro entradas, que es donde llega el pulgar. Las
// entradas son las mismas y en el mismo orden en los dos sitios: una navegación
// que cambia de contenido según el tamaño obliga a reaprenderla en el móvil.
//
// Los iconos son de Phosphor, la misma familia que usa el sitio de BECOME.
// Ninguno va solo: todos llevan su texto al lado. Un icono sin etiqueta se
// entiende el segundo día y no el primero, y el primero es el que decide si
// alguien vuelve.

const ENLACES = [
  { clave: "feed", texto: "Feed", Icono: HouseIcon, roles: ["ADMIN", "MANAGER", "COLABORADOR"] },
  { clave: "novedades", texto: "Novedades", Icono: BellSimpleIcon, roles: ["ADMIN", "MANAGER", "COLABORADOR"] },
  { clave: "equipo", texto: "Mi equipo", Icono: UsersThreeIcon, roles: ["ADMIN", "MANAGER"] },
  { clave: "cultura", texto: "Cultura", Icono: ChartLineUpIcon, roles: ["ADMIN"] },
] as const;

export default async function Marco({
  children,
  actual,
}: {
  children: React.ReactNode;
  actual: string;
}) {
  const usuario = await sesionRequerida();
  const r = rutas(usuario.empresaSlug);

  const [pendientes, yo, empresa] = await Promise.all([
    sinLeer(usuario.id),
    prisma.user.findUniqueOrThrow({
      where: { id: usuario.id },
      select: { id: true, nombre: true, imagen: true, cargo: true },
    }),
    prisma.company.findUniqueOrThrow({
      where: { id: usuario.companyId },
      select: { nombre: true, logo: true },
    }),
  ]);

  const visibles = ENLACES.filter((e) =>
    (e.roles as readonly string[]).includes(usuario.rol),
  );

  const enlaces = visibles.map(({ clave, texto, Icono }) => {
    const href = r[clave];
    const activo = actual === clave;
    const pendiente = clave === "novedades" ? pendientes : 0;

    return (
      <Link
        key={href}
        href={href}
        className="nav__enlace"
        aria-current={activo ? "page" : undefined}
      >
        <span className="nav__icono">
          <Icono size={22} weight={activo ? "fill" : "regular"} aria-hidden="true" />
          {pendiente > 0 && (
            <span className="nav__punto" aria-hidden="true">
              {pendiente > 9 ? "9+" : pendiente}
            </span>
          )}
        </span>
        <span className="nav__texto">{texto}</span>
        {pendiente > 0 && (
          // El número también en texto, porque la pastilla es decorativa para
          // un lector de pantalla y «Novedades» a secas no dice que hay tres.
          <span className="visually-hidden">
            , {pendiente} sin leer
          </span>
        )}
      </Link>
    );
  });

  return (
    <div className="app">
      <aside className="lateral">
        {/* Con logo, la barra enseña la marca de la empresa; sin él, la de
            Pulse. Quien entra cada mañana tiene que ver su casa, no la nuestra
            — y a la vez el pie recuerda de qué producto se trata. */}
        <Link href={r.feed} className="lateral__marca">
          {empresa.logo ? (
            /* Solo el logo. Un logo casi siempre lleva el nombre dentro, y
               ponerlo otra vez al lado lo repite: «FLUM Flum». El nombre sigue
               ahí para quien no ve la imagen, en el texto alternativo. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={`/api/imagenes/${empresa.logo}`}
              alt={empresa.nombre}
              className="lateral__logo"
            />
          ) : (
            <>
              BECOME <span>Pulse</span>
            </>
          )}
        </Link>

        <nav className="nav nav--lateral" aria-label="Secciones">
          {enlaces}
        </nav>

        <div className="lateral__pie">
          <Link href={r.perfil} className="lateral__yo">
            <Avatar persona={yo} tamano="md" enlazado={false} />
            <span>
              <strong>{yo.nombre}</strong>
              {yo.cargo && <span className="lateral__cargo">{yo.cargo}</span>}
            </span>
          </Link>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: ACCEDER });
            }}
          >
            <button type="submit" className="lateral__salir">
              <SignOutIcon size={18} aria-hidden="true" />
              Salir
            </button>
          </form>
        </div>
      </aside>

      <main className="principal">{children}</main>

      {/* La misma navegación, abajo, en móvil. */}
      <nav className="nav nav--inferior" aria-label="Secciones">
        {enlaces}
        <Link
          href={r.perfil}
          className="nav__enlace"
          aria-current={actual === "perfil" ? "page" : undefined}
        >
          <span className="nav__icono">
            <Avatar persona={yo} tamano="sm" enlazado={false} />
          </span>
          <span className="nav__texto">Tú</span>
        </Link>
      </nav>
    </div>
  );
}
