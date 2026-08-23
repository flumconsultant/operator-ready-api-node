import { prisma } from "../prisma";

// Mapa de influencia.
//
// La métrica no es "quién recibe más reconocimientos" —eso premia a quien
// tiene un equipo grande o un amigo entusiasta— sino de cuánta gente distinta
// los recibe. Alguien reconocido veinte veces por su jefe es un caso; alguien
// reconocido nueve veces por nueve personas de cuatro equipos distintos es otro,
// y es el que interesa a RRHH.
//
// Todo esto se calcula en SQL y en memoria. No hay IA aquí y no debería
// haberla: es un grafo pequeño y una cuenta exacta vale más que una estimada.

export type NodoInfluencia = {
  userId: string;
  nombre: string;
  equipo: string | null;
  /// Reconocimientos entrantes en la ventana.
  recibidos: number;
  /// Cuántas personas distintas se los dieron. El numerador de verdad.
  reconocedores: number;
  /// Cuántos equipos distintos. Distingue influencia real de popularidad
  /// dentro del propio equipo.
  equiposAlcanzados: number;
  /// 0-1. Combina alcance de personas, alcance de equipos y calidad del
  /// mensaje. Es un proxy, y se llama proxy en toda la interfaz.
  influencia: number;
};

export async function mapaDeInfluencia(
  companyId: string,
  dias = 90,
): Promise<NodoInfluencia[]> {
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

  const aristas = await prisma.recognition.findMany({
    where: { companyId, creadoEn: { gte: desde } },
    select: {
      deUserId: true,
      paraUserId: true,
      especificidad: true,
      de: { select: { equipo: true } },
      para: { select: { id: true, nombre: true, equipo: true } },
    },
  });

  type Acumulado = {
    nombre: string;
    equipo: string | null;
    recibidos: number;
    reconocedores: Set<string>;
    equipos: Set<string>;
    especificidades: number[];
  };
  const porPersona = new Map<string, Acumulado>();

  for (const arista of aristas) {
    // Auto-reconocerse no cuenta. La interfaz no lo permite, pero la API
    // interna la usa un bot y conviene no fiarse.
    if (arista.deUserId === arista.paraUserId) continue;

    const actual = porPersona.get(arista.para.id) ?? {
      nombre: arista.para.nombre,
      equipo: arista.para.equipo,
      recibidos: 0,
      reconocedores: new Set<string>(),
      equipos: new Set<string>(),
      especificidades: [],
    };
    actual.recibidos++;
    actual.reconocedores.add(arista.deUserId);
    if (arista.de.equipo) actual.equipos.add(arista.de.equipo);
    if (arista.especificidad !== null)
      actual.especificidades.push(arista.especificidad);
    porPersona.set(arista.para.id, actual);
  }

  if (porPersona.size === 0) return [];

  const maxReconocedores = Math.max(
    ...[...porPersona.values()].map((p) => p.reconocedores.size),
  );
  const maxEquipos = Math.max(
    ...[...porPersona.values()].map((p) => p.equipos.size),
    1,
  );

  const nodos: NodoInfluencia[] = [...porPersona.entries()].map(
    ([userId, p]) => {
      const alcancePersonas = p.reconocedores.size / maxReconocedores;
      const alcanceEquipos = p.equipos.size / maxEquipos;
      // Sin análisis de IA la calidad se asume neutra (0,5) en vez de cero: si
      // no se ha medido, no se penaliza.
      const calidad = p.especificidades.length
        ? p.especificidades.reduce((a, b) => a + b, 0) / p.especificidades.length
        : 0.5;

      return {
        userId,
        nombre: p.nombre,
        equipo: p.equipo,
        recibidos: p.recibidos,
        reconocedores: p.reconocedores.size,
        equiposAlcanzados: p.equipos.size,
        influencia:
          Math.round(
            (alcancePersonas * 0.55 + alcanceEquipos * 0.25 + calidad * 0.2) *
              1000,
          ) / 1000,
      };
    },
  );

  return nodos.sort((a, b) => b.influencia - a.influencia);
}

/// Quién lleva `dias` sin dar ni recibir un reconocimiento.
///
/// El PRD lo llama señal de desconexión. Es la alerta más útil del panel de
/// RRHH y la más barata de calcular: no hace falta ninguna encuesta.
export async function personasDesconectadas(companyId: string, dias = 60) {
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

  const personas = await prisma.user.findMany({
    where: {
      companyId,
      activo: true,
      // Quien se incorporó hace menos que la ventana todavía no puede estar
      // "desconectado": aún no ha tenido tiempo.
      invitadoEn: { lt: desde },
      dados: { none: { creadoEn: { gte: desde } } },
      recibidos: { none: { creadoEn: { gte: desde } } },
    },
    select: { id: true, nombre: true, email: true, equipo: true, invitadoEn: true },
    orderBy: { nombre: "asc" },
  });

  return personas;
}
