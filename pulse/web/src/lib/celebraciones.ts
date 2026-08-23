import { prisma } from "./prisma";

// Cumpleaños y aniversarios de incorporación.
//
// Es lo que StarMeUp llama «milestone celebrations» y Workvivo «celebrations»,
// y es la función más barata de construir y la que más sostiene un feed nuevo:
// una empresa de cincuenta personas tiene una celebración cada pocos días,
// así que el feed no está vacío ni en la semana en que nadie reconoce a nadie.
//
// No se guardan en la base como publicaciones. Se calculan al leer el feed a
// partir de dos fechas del perfil. Un job que cree un post por cumpleaños tiene
// que ser idempotente, saber qué pasa si alguien corrige su fecha, y limpiar lo
// que generó mal; esto no tiene ninguno de esos problemas y siempre está al día.

export type Celebracion = {
  tipo: "CUMPLEANOS" | "ANIVERSARIO";
  fecha: Date;
  persona: { id: string; nombre: string; imagen: string | null; equipo: string | null };
  /// Solo en aniversarios: cuántos años cumple en la empresa.
  anos?: number;
};

/// Las celebraciones que caen dentro de una ventana de días hacia atrás.
/// La ventana es la misma que la del trozo de feed que se está pintando, para
/// que aparezcan intercaladas en su sitio cronológico y no todas arriba.
export async function celebracionesEntre(
  companyId: string,
  desde: Date,
  hasta: Date,
): Promise<Celebracion[]> {
  const personas = await prisma.user.findMany({
    where: {
      companyId,
      activo: true,
      OR: [{ cumpleanos: { not: null } }, { fechaIngreso: { not: null } }],
    },
    select: {
      id: true,
      nombre: true,
      imagen: true,
      equipo: true,
      cumpleanos: true,
      fechaIngreso: true,
    },
  });

  const salida: Celebracion[] = [];

  for (const persona of personas) {
    if (persona.cumpleanos) {
      const fecha = enLaVentana(persona.cumpleanos, desde, hasta);
      if (fecha) {
        salida.push({ tipo: "CUMPLEANOS", fecha, persona });
      }
    }
    if (persona.fechaIngreso) {
      const fecha = enLaVentana(persona.fechaIngreso, desde, hasta);
      // El día que alguien entra no es un aniversario: es su primer día.
      if (fecha && fecha.getUTCFullYear() > persona.fechaIngreso.getUTCFullYear()) {
        salida.push({
          tipo: "ANIVERSARIO",
          fecha,
          persona,
          anos: fecha.getUTCFullYear() - persona.fechaIngreso.getUTCFullYear(),
        });
      }
    }
  }

  return salida.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

/// Devuelve la fecha del año en curso (o del anterior) en que cae el
/// aniversario de `original`, si esa fecha está dentro de la ventana.
///
/// Se comprueban dos años porque una ventana que cruza el 31 de diciembre
/// contiene aniversarios de los dos: sin esto, del 28 de diciembre al 3 de
/// enero no se celebra nada.
///
/// Se exporta solo para poder probarla: es la única parte de este módulo que
/// puede equivocarse sin que se note hasta que a alguien no le felicitan.
export function enLaVentana(original: Date, desde: Date, hasta: Date): Date | null {
  for (const ano of [hasta.getUTCFullYear(), hasta.getUTCFullYear() - 1]) {
    const mes = original.getUTCMonth();
    const dia = original.getUTCDate();
    // El 29 de febrero se celebra el 28 los años que no son bisiestos, que es
    // lo que hace todo el mundo y evita que a esa persona no la felicite nadie
    // tres años de cada cuatro.
    const bisiesto = new Date(Date.UTC(ano, 1, 29)).getUTCMonth() === 1;
    const candidata =
      mes === 1 && dia === 29 && !bisiesto
        ? new Date(Date.UTC(ano, 1, 28))
        : new Date(Date.UTC(ano, mes, dia));

    if (candidata >= desde && candidata <= hasta) return candidata;
  }
  return null;
}
