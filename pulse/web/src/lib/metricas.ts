import { prisma } from "./prisma";

// Las métricas que comparten el panel de manager, el de RRHH y el resumen
// semanal. Viven en un solo sitio para que las tres superficies no acaben
// contando cosas ligeramente distintas y nadie sepa cuál mirar.

export async function metricasDeEmpresa(companyId: string, dias = 30) {
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

  const [
    reconocimientos,
    personasActivas,
    dieron,
    recibieron,
    porValor,
    porCanal,
  ] = await Promise.all([
    prisma.recognition.count({ where: { companyId, creadoEn: { gte: desde } } }),
    prisma.user.count({ where: { companyId, activo: true } }),
    prisma.recognition.findMany({
      where: { companyId, creadoEn: { gte: desde } },
      select: { deUserId: true },
      distinct: ["deUserId"],
    }),
    prisma.recognition.findMany({
      where: { companyId, creadoEn: { gte: desde } },
      select: { paraUserId: true },
      distinct: ["paraUserId"],
    }),
    prisma.recognition.groupBy({
      by: ["valueId"],
      where: { companyId, creadoEn: { gte: desde } },
      _count: { _all: true },
      orderBy: { _count: { valueId: "desc" } },
    }),
    prisma.recognition.groupBy({
      by: ["canal"],
      where: { companyId, creadoEn: { gte: desde } },
      _count: { _all: true },
    }),
  ]);

  const valores = await prisma.value.findMany({
    where: { companyId },
    select: { id: true, nombre: true, emoji: true },
  });
  const nombrePorId = new Map(valores.map((v) => [v.id, v]));

  const ranking = porValor.map((fila) => ({
    id: fila.valueId,
    nombre: nombrePorId.get(fila.valueId)?.nombre ?? "—",
    emoji: nombrePorId.get(fila.valueId)?.emoji ?? "✨",
    total: fila._count._all,
  }));

  const desdeDiscord =
    porCanal.find((c) => c.canal === "DISCORD")?._count._all ?? 0;

  return {
    dias,
    reconocimientos,
    personasActivas,
    personasQueDieron: dieron.length,
    personasQueRecibieron: recibieron.length,
    // La métrica de éxito número uno del PRD: más del 50% dando al menos uno.
    participacion: personasActivas
      ? Math.round((dieron.length / personasActivas) * 100)
      : 0,
    // La hipótesis del canal, medida: ¿el reconocimiento ocurre donde el equipo
    // ya conversa, o hay que entrar a una web a propósito?
    porcentajeDiscord: reconocimientos
      ? Math.round((desdeDiscord / reconocimientos) * 100)
      : 0,
    ranking,
    valorMasMencionado: ranking[0] ?? null,
  };
}

export async function metricasDeEquipo(
  companyId: string,
  equipo: string | null,
  dias = 30,
) {
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
  const miembros = await prisma.user.findMany({
    where: { companyId, activo: true, equipo },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
  const ids = miembros.map((m) => m.id);
  if (ids.length === 0) return { dias, equipo, filas: [] };

  const [dados, recibidos] = await Promise.all([
    prisma.recognition.groupBy({
      by: ["deUserId"],
      where: { companyId, deUserId: { in: ids }, creadoEn: { gte: desde } },
      _count: { _all: true },
    }),
    prisma.recognition.groupBy({
      by: ["paraUserId"],
      where: { companyId, paraUserId: { in: ids }, creadoEn: { gte: desde } },
      _count: { _all: true },
    }),
  ]);

  const mapaDados = new Map(dados.map((d) => [d.deUserId, d._count._all]));
  const mapaRecibidos = new Map(
    recibidos.map((r) => [r.paraUserId, r._count._all]),
  );

  return {
    dias,
    equipo,
    filas: miembros.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      dados: mapaDados.get(m.id) ?? 0,
      recibidos: mapaRecibidos.get(m.id) ?? 0,
    })),
  };
}
