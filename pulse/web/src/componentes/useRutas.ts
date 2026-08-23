"use client";

import { usePathname } from "next/navigation";

import { empresaDeRuta, rutas } from "@/lib/rutas";

// Las rutas, para los componentes de cliente.
//
// El slug sale de la URL y no de un contexto ni de una prop: ya está delante, y
// cualquier componente del árbol puede leerlo sin que alguien tenga que
// acordarse de pasárselo. Si la ruta no cuelga de ninguna empresa —no debería
// pasar dentro de la aplicación— cae en una cadena vacía, que produce enlaces
// relativos en vez de reventar.
export function useRutas() {
  const ruta = usePathname();
  return rutas(empresaDeRuta(ruta) ?? "");
}
