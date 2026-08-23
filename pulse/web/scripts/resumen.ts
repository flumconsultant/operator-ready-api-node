import { prisma } from "../src/lib/prisma";
import { generarResumen } from "../src/lib/ia/resumen-semanal";
import { analizarPendientes } from "../src/lib/ia/sentimiento";

// Genera el resumen semanal a mano, sin esperar al cron.
//
//   npm run resumen            → todas las empresas
//   npm run resumen -- demo    → solo esa (por slug)
//
// Es el mismo trabajo que hace /api/cron/resumen-semanal, útil para verlo
// funcionar en desarrollo sin montar un cron.

async function main() {
  const slug = process.argv[2];

  const empresas = await prisma.company.findMany({
    where: slug ? { slug } : {},
    select: { id: true, nombre: true },
  });

  if (empresas.length === 0) {
    console.error(slug ? `No existe la empresa "${slug}".` : "No hay empresas.");
    process.exit(1);
  }

  for (const empresa of empresas) {
    const { analizados, motivo } = await analizarPendientes(empresa.id, 200);
    console.log(
      `${empresa.nombre}: ${analizados} reconocimientos analizados${motivo ? ` (${motivo})` : ""}`,
    );
    const insight = await generarResumen(empresa.id);
    console.log(`\n--- ${empresa.nombre}, semana ${insight.semanaIso} ---`);
    console.log(insight.contenido);
    console.log();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
