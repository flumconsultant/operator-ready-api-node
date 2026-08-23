import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

import { prisma } from "../prisma";
import { iaActiva } from "../entorno";
import { anthropic, MODELO } from "./cliente";

// Análisis de sentimiento de un reconocimiento.
//
// Dos cosas que no son obvias y son deliberadas:
//
// 1. Esto NO decide si el reconocimiento se guarda. El reconocimiento ya está
//    en la base cuando esta función corre. Si Claude no contesta, el feed
//    funciona igual y el campo se queda a null.
// 2. Lo interesante no es el tono —casi todos los reconocimientos son
//    positivos, medirlo no dice nada— sino la especificidad: distinguir
//    "gracias por todo, crack" de "te quedaste el viernes a cerrar el cierre de
//    julio". Eso es lo que separa una cultura de reconocimiento real de un
//    canal de felicitaciones.

const Analisis = z.object({
  tono: z
    .enum(["cálido", "cordial", "neutro", "formulario"])
    .describe("El registro del mensaje"),
  score: z
    .number()
    .min(-1)
    .max(1)
    .describe("-1 frío o desganado, 0 neutro, 1 cálido y genuino"),
  especificidad: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "0 si es una fórmula intercambiable entre cualquier par de personas, 1 si describe un hecho concreto, con contexto y consecuencia",
    ),
});

export type Analisis = z.infer<typeof Analisis>;

const SISTEMA = `Analizas mensajes de reconocimiento entre compañeros de trabajo en empresas de LATAM, escritos en español.

Criterios:
- La mayoría de reconocimientos son positivos. No premies el entusiasmo: mide si el mensaje aporta información.
- especificidad alta = nombra un hecho, un momento, un proyecto o una consecuencia concreta.
- especificidad baja = podría copiarse y pegarse a cualquier otra persona sin cambiar nada.
- El registro peruano y latinoamericano es directo y usa diminutivos y jerga local. Eso no lo hace menos genuino.
- No juzgues a la persona reconocida. Analizas el mensaje, no a quien lo recibe.`;

export async function analizarSentimiento(
  mensaje: string,
): Promise<Analisis | null> {
  const cliente = anthropic();
  if (!cliente) return null;

  try {
    const respuesta = await cliente.messages.parse({
      model: MODELO,
      max_tokens: 512,
      // Clasificación corta: no necesita pensar largo, y el coste por
      // reconocimiento es lo primero que hay que vigilar en el piloto.
      output_config: { effort: "low", format: zodOutputFormat(Analisis) },
      system: SISTEMA,
      messages: [
        {
          role: "user",
          content: `Reconocimiento a analizar:\n\n"""\n${mensaje}\n"""`,
        },
      ],
    });
    return respuesta.parsed_output ?? null;
  } catch (error) {
    // Un fallo aquí no puede tumbar nada. Se registra y se sigue.
    console.error("[pulse] análisis de sentimiento fallido:", error);
    return null;
  }
}

/// Procesa los reconocimientos pendientes de una empresa.
///
/// Se llama desde el endpoint interno tras crear un reconocimiento y desde el
/// job semanal para recoger los que quedaron atrás. `limiteIaMensual` de la
/// empresa es el freno de coste: agotado el cupo del mes, se deja de analizar y
/// se sigue guardando todo.
export async function analizarPendientes(companyId: string, tope = 25) {
  // Sin clave no hay nada que hacer, y se dice por qué: un "0 analizados" a
  // secas parece un fallo cuando en realidad es la configuración.
  if (!iaActiva) return { analizados: 0, motivo: "capa de IA desactivada" };

  const empresa = await prisma.company.findUnique({
    where: { id: companyId },
    select: { limiteIaMensual: true },
  });
  if (!empresa) return { analizados: 0, motivo: "empresa inexistente" };

  const inicioDeMes = new Date();
  inicioDeMes.setUTCDate(1);
  inicioDeMes.setUTCHours(0, 0, 0, 0);

  const gastadosEsteMes = await prisma.recognition.count({
    where: { companyId, analizadoEn: { gte: inicioDeMes } },
  });
  const margen = empresa.limiteIaMensual - gastadosEsteMes;
  if (margen <= 0) return { analizados: 0, motivo: "cupo mensual agotado" };

  const pendientes = await prisma.recognition.findMany({
    where: { companyId, analizadoEn: null },
    orderBy: { creadoEn: "desc" },
    take: Math.min(tope, margen),
    select: { id: true, mensaje: true },
  });

  let analizados = 0;
  for (const reconocimiento of pendientes) {
    const analisis = await analizarSentimiento(reconocimiento.mensaje);
    if (!analisis) continue;
    await prisma.recognition.update({
      where: { id: reconocimiento.id },
      data: {
        sentimientoScore: analisis.score,
        especificidad: analisis.especificidad,
        sentimientoTono: analisis.tono,
        analizadoEn: new Date(),
      },
    });
    analizados++;
  }

  return { analizados, motivo: null };
}
