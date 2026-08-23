"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartLineUp, Buildings, UsersThree } from "@phosphor-icons/react/dist/ssr";

// Las tres pantallas de administración.
//
// Van como pestañas dentro de /admin y no como tres entradas más en la
// navegación principal: la barra inferior de móvil no admite más de cinco
// entradas sin volverse ilegible, y ya están las cinco puestas. Además, esto
// solo lo ve un administrador, que es una persona por empresa.

const PESTANAS = [
  { href: "/admin", texto: "Cultura", Icono: ChartLineUp },
  { href: "/admin/personas", texto: "Personas", Icono: UsersThree },
  { href: "/admin/empresa", texto: "Empresa", Icono: Buildings },
];

export default function PestanasAdmin() {
  const ruta = usePathname();

  return (
    <nav className="pestanas" aria-label="Administración">
      {PESTANAS.map(({ href, texto, Icono }) => {
        const activa = ruta === href;
        return (
          <Link
            key={href}
            href={href}
            className="pestanas__enlace"
            aria-current={activa ? "page" : undefined}
          >
            <Icono size={18} weight={activa ? "fill" : "regular"} aria-hidden="true" />
            {texto}
          </Link>
        );
      })}
    </nav>
  );
}
