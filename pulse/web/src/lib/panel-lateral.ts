import { prisma } from "./prisma";
import { celebracionesEntre, type Celebracion } from "./celebraciones";

// Lo que acompaña al feed en la columna de la derecha.
//
// En escritorio el feed ocupa 640px porque más ancho no se lee bien, y eso deja
// media pantalla vacía. La columna la llena con tres cosas que responden a la
// pregunta que trae a alguien aquí: qué está pasando, qué se valora, y a quién
// le debo yo un reconocimiento.
//
// La tercera es personal y privada: dice a quién NO has reconocido tú, no a
// quién no ha reconocido nadie. La diferencia importa — «a Rosa no la reconoce
// nadie» publicado en la pantalla de toda la empresa es una humillación con
// forma de recordatorio.

export async function datosDelPanel(companyId: string, userId: string) {
  const ahora = new Date();
  const enUnaSemana = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);
  const hace30 = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [proximas, porValor, valores, yaReconocidos, yo] = await Promise.all([
    // Hacia adelante: aquí interesa lo que viene, no lo que pasó.
    celebracionesEntre(companyId, ahora, enUnaSemana),
    prisma.recognition.groupBy({
      by: ["valueId"],
      where: { companyId, retiradoEn: null, creadoEn: { gte: hace30 } },
      _count: { _all: true },
      orderBy: { _count: { valueId: "desc" } },
      take: 4,
    }),
    prisma.value.findMany({
      where: { companyId, activo: true },
      select: { id: true, nombre: true, icono: true },
    }),
    prisma.recognitionRecipient.findMany({
      where: {
        reconocimiento: {
          companyId,
          retiradoEn: null,
          deUserId: userId,
          creadoEn: { gte: hace30 },
        },
      },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { equipo: true } }),
  ]);

  const porId = new Map(valores.map((v) => [v.id, v]));
  const maximo = porValor[0]?._count._all ?? 1;

  const ranking = porValor
    .filter((v) => porId.has(v.valueId))
    .map((v) => ({
      id: v.valueId,
      nombre: porId.get(v.valueId)!.nombre,
      icono: porId.get(v.valueId)!.icono,
      total: v._count._all,
      porcentaje: Math.round((v._count._all / maximo) * 100),
    }));

  // Primero del propio equipo: sugerir reconocer a alguien con quien no se
  // trabaja produce reconocimientos vacíos, que es peor que ninguno.
  const fuera = [userId, ...yaReconocidos.map((r) => r.userId)];
  const seleccion = {
    id: true,
    nombre: true,
    imagen: true,
    cargo: true,
    equipo: true,
  } as const;

  let sugerencias = yo?.equipo
    ? await prisma.user.findMany({
        where: { companyId, activo: true, equipo: yo.equipo, id: { notIn: fuera } },
        select: seleccion,
        take: 3,
      })
    : [];

  // Pero si tu equipo eres tú solo —o ya has reconocido a todos— el bloque
  // desaparecería justo para quien más lo necesita. Se abre a la empresa.
  if (sugerencias.length === 0) {
    sugerencias = await prisma.user.findMany({
      where: { companyId, activo: true, id: { notIn: fuera } },
      select: seleccion,
      take: 3,
    });
  }

  return { proximas: proximas as Celebracion[], ranking, sugerencias };
}
