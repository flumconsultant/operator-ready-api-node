import { prisma } from "../prisma";
import { anthropic, MODELO } from "./cliente";
import { mapaDeInfluencia, personasDesconectadas } from "./influencia";
import { metricasDeEmpresa } from "../metricas";

// El resumen semanal para RRHH.
//
// El orden importa: primero se calculan las cifras con SQL, después se le pide
// a Claude que las redacte. Nunca al revés. Un modelo al que le pides que
// "analice la actividad de la semana" a partir de texto suelto inventa
// porcentajes; uno al que le das las cifras hechas y le pides tres frases
// accionables, no.

export function semanaIso(fecha = new Date()): string {
  const d = new Date(
    Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()),
  );
  // ISO 8601: la semana pertenece al año del jueves de esa semana.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const inicioAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const numero = Math.ceil(((d.getTime() - inicioAno.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-S${String(numero).padStart(2, "0")}`;
}

export async function reunirDatos(companyId: string) {
  const [metricas, influencia, desconectadas, empresa] = await Promise.all([
    metricasDeEmpresa(companyId, 7),
    mapaDeInfluencia(companyId, 30),
    personasDesconectadas(companyId, 60),
    prisma.company.findUnique({
      where: { id: companyId },
      select: { nombre: true },
    }),
  ]);

  const semanaAnterior = await prisma.recognition.count({
    where: {
      companyId,
      creadoEn: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  // Equipos que no han dado ni un reconocimiento en tres semanas. Es el insight
  // que el PRD pone de ejemplo y no se puede sacar de las métricas generales.
  const hace21Dias = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);
  const equipos = await prisma.user.groupBy({
    by: ["equipo"],
    where: { companyId, activo: true, equipo: { not: null } },
    _count: { _all: true },
  });
  const equiposActivos = new Set(
    (
      await prisma.recognition.findMany({
        where: { companyId, creadoEn: { gte: hace21Dias } },
        select: { de: { select: { equipo: true } } },
        distinct: ["deUserId"],
      })
    )
      .map((r) => r.de.equipo)
      .filter((e): e is string => Boolean(e)),
  );
  const equiposSilenciosos = equipos
    .filter((e) => e.equipo && !equiposActivos.has(e.equipo))
    .map((e) => ({ equipo: e.equipo as string, personas: e._count._all }));

  return {
    empresa: empresa?.nombre ?? "",
    ...metricas,
    reconocimientosSemanaAnterior: semanaAnterior,
    topInfluencia: influencia.slice(0, 5),
    desconectadas: desconectadas.map((p) => ({
      nombre: p.nombre,
      equipo: p.equipo,
    })),
    equiposSilenciosos,
  };
}

const SISTEMA = `Escribes el resumen semanal de cultura para el área de personas de una empresa mediana de LATAM, a partir de la actividad en BECOME Pulse.

Reglas:
- Entre 3 y 5 insights. Ni uno más.
- Cada insight es una frase de observación seguida de una acción concreta que RRHH pueda hacer esta semana.
- Usa ÚNICAMENTE las cifras que te doy. No estimes, no redondees hacia arriba, no inventes tendencias que no estén en los datos.
- Si un dato está vacío o el volumen es demasiado bajo para concluir nada, dilo en vez de rellenar.
- Español neutro de LATAM, sin anglicismos innecesarios y sin lenguaje de consultora.
- Sin encabezados ni markdown: una lista de guiones, un insight por línea.
- No nombres a personas concretas en negativo. Los nombres solo aparecen para reconocer algo positivo.`;

export async function generarResumen(companyId: string) {
  const datos = await reunirDatos(companyId);
  const semana = semanaIso();
  const cliente = anthropic();

  const contenido = cliente
    ? await redactar(cliente, datos)
    : resumenSinIa(datos);

  return prisma.weeklyInsight.upsert({
    where: { companyId_semanaIso: { companyId, semanaIso: semana } },
    create: { companyId, semanaIso: semana, contenido, datos },
    update: { contenido, datos, generadoEn: new Date() },
  });
}

async function redactar(
  cliente: NonNullable<ReturnType<typeof anthropic>>,
  datos: Awaited<ReturnType<typeof reunirDatos>>,
) {
  try {
    const respuesta = await cliente.messages.create({
      model: MODELO,
      max_tokens: 2000,
      output_config: { effort: "medium" },
      system: SISTEMA,
      messages: [
        {
          role: "user",
          content: `Actividad de esta semana en ${datos.empresa}:\n\n${JSON.stringify(datos, null, 2)}`,
        },
      ],
    });

    if (respuesta.stop_reason === "refusal") {
      console.warn("[pulse] resumen rechazado por el modelo");
      return resumenSinIa(datos);
    }

    const texto = respuesta.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return texto || resumenSinIa(datos);
  } catch (error) {
    console.error("[pulse] resumen semanal fallido:", error);
    return resumenSinIa(datos);
  }
}

/// El resumen cuando no hay clave de API, o cuando la llamada falla.
///
/// No es un mensaje de error disfrazado: son los mismos datos, dichos sin
/// adornos. Un piloto sin presupuesto de IA sigue teniendo su resumen semanal.
function resumenSinIa(datos: Awaited<ReturnType<typeof reunirDatos>>) {
  const lineas: string[] = [];
  const delta =
    datos.reconocimientos - datos.reconocimientosSemanaAnterior;
  const signo = delta > 0 ? "+" : "";

  lineas.push(
    `- ${datos.reconocimientos} reconocimientos esta semana (${signo}${delta} frente a la anterior), de ${datos.personasQueDieron} personas distintas sobre ${datos.personasActivas} activas.`,
  );
  if (datos.valorMasMencionado) {
    lineas.push(
      `- El valor más reconocido fue ${datos.valorMasMencionado.nombre}, con ${datos.valorMasMencionado.total} menciones.`,
    );
  }
  if (datos.equiposSilenciosos.length) {
    lineas.push(
      `- Sin actividad en tres semanas: ${datos.equiposSilenciosos.map((e) => e.equipo).join(", ")}. Conviene preguntar antes de que se note en otra parte.`,
    );
  }
  if (datos.desconectadas.length) {
    lineas.push(
      datos.desconectadas.length === 1
        ? "- 1 persona lleva 60 días sin dar ni recibir reconocimientos."
        : `- ${datos.desconectadas.length} personas llevan 60 días sin dar ni recibir reconocimientos.`,
    );
  }
  if (datos.topInfluencia.length) {
    const primero = datos.topInfluencia[0];
    lineas.push(
      // Sin participio: no se conoce el género de nadie y no se va a inferir
      // del nombre.
      `- Mayor alcance en la red: ${primero.nombre}, con reconocimientos de ${primero.reconocedores} personas distintas de ${primero.equiposAlcanzados} equipos.`,
    );
  }
  lineas.push(
    "",
    "(Resumen generado sin la capa de IA: ANTHROPIC_API_KEY no está configurada o la llamada falló.)",
  );
  return lineas.join("\n");
}
