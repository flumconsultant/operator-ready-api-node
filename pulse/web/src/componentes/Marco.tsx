import Link from "next/link";

import { signOut } from "@/lib/auth";
import { sesionRequerida } from "@/lib/sesion";

// El marco de la aplicación: barra lateral, navegación según el rol y el
// guardián de sesión. Todas las páginas privadas pasan por aquí, así que la
// comprobación de sesión se hace una vez y no una por página.

const ENLACES = [
  { href: "/feed", texto: "Feed", roles: ["ADMIN", "MANAGER", "COLABORADOR"] },
  { href: "/panel", texto: "Mi equipo", roles: ["ADMIN", "MANAGER"] },
  { href: "/admin", texto: "Cultura y valores", roles: ["ADMIN"] },
] as const;

export default async function Marco({
  children,
  actual,
}: {
  children: React.ReactNode;
  actual: string;
}) {
  const usuario = await sesionRequerida();
  const rol = usuario.rol;
  const visibles = ENLACES.filter((e) =>
    (e.roles as readonly string[]).includes(rol),
  );

  return (
    <div className="app">
      <aside className="lateral">
        <div className="lateral__marca">
          BECOME <span>Pulse</span>
        </div>

        <nav className="lateral__nav" aria-label="Secciones">
          {visibles.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="lateral__enlace"
              aria-current={actual === enlace.href ? "page" : undefined}
            >
              {enlace.texto}
            </Link>
          ))}
        </nav>

        <div className="lateral__pie">
          <p style={{ margin: "0 0 var(--space-4)", color: "var(--slate-200)" }}>
            {usuario.name}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/acceder" });
            }}
          >
            <button
              type="submit"
              className="boton boton--discreto"
              style={{
                color: "var(--slate-200)",
                borderColor: "var(--border-strong-dark)",
              }}
            >
              Salir
            </button>
          </form>
        </div>
      </aside>

      <main className="principal">{children}</main>
    </div>
  );
}
