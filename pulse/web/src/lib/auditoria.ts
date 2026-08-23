import type { AccionAuditada, Prisma } from "@prisma/client";

import { prisma } from "./prisma";

// El registro de auditoría.
//
// Se escribe desde aquí y desde ningún otro sitio, para que sea imposible
// añadir una acción de administración nueva y olvidarse de dejarla anotada:
// las funciones de `administracion.ts` llaman a `anotar` en la misma
// operación en la que hacen el cambio.
//
// Nunca lanza. Un fallo al escribir la auditoría no puede impedir que se
// desactive a alguien que se acaba de ir de la empresa; se registra el error y
// se sigue. Es la decisión contraria a la de un sistema financiero, y es la
// correcta aquí: el daño de no poder actuar es mayor que el de perder una
// línea de historial.

export type Cambio = { campo: string; antes: unknown; despues: unknown };

export async function anotar(datos: {
  companyId: string;
  actorId: string | null;
  actorNombre: string | null;
  accion: AccionAuditada;
  objetivoId?: string | null;
  objetivoNombre?: string | null;
  cambios?: Cambio[];
}) {
  try {
    await prisma.auditLog.create({
      data: {
        companyId: datos.companyId,
        actorId: datos.actorId,
        actorNombre: datos.actorNombre,
        accion: datos.accion,
        objetivoId: datos.objetivoId ?? null,
        objetivoNombre: datos.objetivoNombre ?? null,
        cambios: (datos.cambios ?? []) as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error("[pulse] no se pudo anotar en la auditoría:", error);
  }
}

/// Compara dos objetos y devuelve solo lo que cambió.
///
/// Guardar el estado entero antes y después haría el registro ilegible: para
/// saber que a alguien lo ascendieron habría que comparar dos bloques de JSON
/// de quince campos a ojo.
export function diferencias(
  antes: Record<string, unknown>,
  despues: Record<string, unknown>,
  etiquetas: Record<string, string> = {},
): Cambio[] {
  const cambios: Cambio[] = [];

  for (const clave of Object.keys(despues)) {
    const a = antes[clave] ?? null;
    const d = despues[clave] ?? null;
    // Se comparan como cadenas para que null, "" y undefined no cuenten como
    // tres valores distintos: en un formulario todos significan «vacío».
    if (String(a ?? "") === String(d ?? "")) continue;
    cambios.push({ campo: etiquetas[clave] ?? clave, antes: a, despues: d });
  }

  return cambios;
}

export function listarAuditoria(
  companyId: string,
  opciones: { accion?: AccionAuditada; limite?: number } = {},
) {
  return prisma.auditLog.findMany({
    where: { companyId, ...(opciones.accion ? { accion: opciones.accion } : {}) },
    orderBy: { creadoEn: "desc" },
    take: opciones.limite ?? 100,
  });
}
