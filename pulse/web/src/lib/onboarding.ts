import { prisma } from "./prisma";

// Cuándo hay que llevar a alguien a un asistente y no al feed.
//
// La comprobación vive aquí y no en un middleware porque necesita la base de
// datos: el middleware de Next corre en el runtime del borde, donde Prisma no
// llega. Y vive en una función y no repetida en cada página para que añadir una
// pantalla nueva no signifique acordarse de esto.
//
// El orden importa. La empresa primero: no tiene sentido pedirle a alguien que
// complete su perfil y dé su primer reconocimiento en una empresa que todavía
// no tiene ni valores con los que reconocer.

export type Destino =
  | { ir: "empresa" }
  | { ir: "persona" }
  | { ir: null };

export async function dondeEmpezar(
  usuario: { id: string; companyId: string; rol: string },
): Promise<Destino> {
  const [empresa, persona] = await Promise.all([
    prisma.company.findUnique({
      where: { id: usuario.companyId },
      select: { onboardingEn: true },
    }),
    prisma.user.findUnique({
      where: { id: usuario.id },
      select: { onboardingEn: true },
    }),
  ]);

  // Solo el administrador puede configurar la empresa. Si entra alguien más
  // antes de que esté lista, no se le manda a un asistente que no puede
  // completar: se le deja pasar y verá el feed vacío con su explicación.
  if (!empresa?.onboardingEn && usuario.rol === "ADMIN") return { ir: "empresa" };
  if (!persona?.onboardingEn) return { ir: "persona" };
  return { ir: null };
}

export function rutaDe(destino: Destino) {
  if (destino.ir === "empresa") return "/bienvenida/empresa";
  if (destino.ir === "persona") return "/bienvenida";
  return null;
}
