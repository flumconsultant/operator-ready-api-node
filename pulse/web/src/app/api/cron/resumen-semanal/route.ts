import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { entorno } from "@/lib/entorno";
import { generarResumen } from "@/lib/ia/resumen-semanal";
import { analizarPendientes } from "@/lib/ia/sentimiento";

// El job semanal. Lo dispara cron desde el VPS:
//
//   0 13 * * 1 curl -fsS -H "authorization: Bearer $CRON_TOKEN" \
//     https://pulse.tu-dominio.com/api/cron/resumen-semanal
//
// Está fuera de la aplicación a propósito: un contenedor con su propio
// planificador dentro se duplica en cuanto escalas a dos réplicas y RRHH recibe
// el resumen dos veces.

export const maxDuration = 300;

export async function POST(peticion: Request) {
  const esperado = entorno.CRON_TOKEN;
  if (!esperado) {
    return NextResponse.json(
      { error: "CRON_TOKEN no está configurado." },
      { status: 503 },
    );
  }

  const recibido = (peticion.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const empresas = await prisma.company.findMany({ select: { id: true, nombre: true } });
  const resultados = [];

  for (const empresa of empresas) {
    // Primero se recogen los reconocimientos que quedaron sin analizar durante
    // la semana; después se redacta. Al revés, el resumen ignoraría la mitad de
    // los datos de calidad.
    const { analizados } = await analizarPendientes(empresa.id, 200);
    const insight = await generarResumen(empresa.id);
    resultados.push({
      empresa: empresa.nombre,
      analizados,
      semana: insight.semanaIso,
    });
  }

  return NextResponse.json({ resultados });
}

// El mismo trabajo por GET, para poder dispararlo con un curl simple desde
// cron sin acordarse de poner -X POST.
export const GET = POST;
