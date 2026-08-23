import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Semilla de desarrollo: una empresa, sus valores y ocho personas con actividad
// de los últimos dos meses. Sin esto, la primera vez que arrancas Pulse ves
// cuatro paneles vacíos y no se entiende qué hace el producto.
//
//   npm run db:semilla
//
// Es idempotente: se puede volver a lanzar sin duplicar nada.

const prisma = new PrismaClient();

const VALORES = [
  ["Colaboración", "🤝", "Sale de su carril para que otro llegue."],
  ["Obsesión por el cliente", "🎯", "Decide mirando al cliente, no al proceso."],
  ["Criterio", "🧭", "Decide bien con información incompleta."],
  ["Aprender rápido", "🌱", "Cambia de opinión cuando aparece el dato."],
  ["Cuidar al equipo", "🫱", "Se nota cuando no está."],
] as const;

const PERSONAS = [
  ["Carlos Ramírez", "carlos@demo.pe", "ADMIN", "Dirección"],
  ["Ana Villanueva", "ana@demo.pe", "MANAGER", "Producto"],
  ["Diego Salazar", "diego@demo.pe", "MANAGER", "Operaciones"],
  ["Lucía Ferrer", "lucia@demo.pe", "COLABORADOR", "Producto"],
  ["Martín Ochoa", "martin@demo.pe", "COLABORADOR", "Producto"],
  ["Rosa Quispe", "rosa@demo.pe", "COLABORADOR", "Operaciones"],
  ["Javier Tello", "javier@demo.pe", "COLABORADOR", "Operaciones"],
  ["Sofía Mendoza", "sofia@demo.pe", "COLABORADOR", "Comercial"],
] as const;

// Mensajes de distinta calidad a propósito: la mitad concretos, la otra mitad
// fórmulas. Es lo que hace que el análisis de especificidad se vea trabajar.
const MENSAJES = [
  "Se quedó el viernes hasta tarde para cerrar la conciliación de julio y el lunes el equipo comercial pudo facturar sin bloqueos.",
  "Gracias por todo, crack.",
  "Reescribió el guion de onboarding después de escuchar tres llamadas de soporte seguidas. La tasa de tickets de la primera semana bajó a la mitad.",
  "Siempre dispuesto a ayudar, un ejemplo para todos.",
  "Paró la reunión para decir que no teníamos el dato que estábamos asumiendo. Nos ahorró dos semanas de construir lo que no era.",
  "Excelente trabajo esta semana.",
  "Cubrió el turno de Rosa sin que nadie se lo pidiera cuando se enfermó, y avisó al cliente antes de que preguntara.",
  "Un capo, sigue así.",
  "Documentó el proceso de cierre que solo tenía él en la cabeza. Ahora cualquiera del equipo puede hacerlo.",
  "Gran actitud siempre.",
];

async function main() {
  const empresa = await prisma.company.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      nombre: "Empresa Demo",
      slug: "demo",
      plan: "piloto",
      // Se rellenan a mano cuando se conecta un servidor de Discord real.
      discordGuildId: null,
      discordCanalFeedId: null,
    },
  });

  const valores = [];
  for (const [i, [nombre, emoji, descripcion]] of VALORES.entries()) {
    valores.push(
      await prisma.value.upsert({
        where: { companyId_nombre: { companyId: empresa.id, nombre } },
        update: { emoji, descripcion, orden: i },
        create: { companyId: empresa.id, nombre, emoji, descripcion, orden: i },
      }),
    );
  }

  // Todas las cuentas de demo comparten contraseña. Es una semilla local; el
  // README lo dice y el despliegue de producción no la ejecuta.
  const hash = await bcrypt.hash("pulse-demo-2026", 10);

  const usuarios = [];
  for (const [nombre, email, rol, equipo] of PERSONAS) {
    usuarios.push(
      await prisma.user.upsert({
        where: { email },
        update: { nombre, rol, equipo, companyId: empresa.id },
        create: {
          companyId: empresa.id,
          nombre,
          email,
          equipo,
          rol,
          passwordHash: hash,
          emailVerified: new Date(),
          // Repartidos en el tiempo para que la alerta de desconexión de 60
          // días tenga a quién señalar.
          invitadoEn: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        },
      }),
    );
  }

  const yaHay = await prisma.recognition.count({
    where: { companyId: empresa.id },
  });
  if (yaHay > 0) {
    console.log(
      `Ya había ${yaHay} reconocimientos: no se añade actividad de nuevo.`,
    );
    return;
  }

  // Sofía (Comercial) se queda fuera del reparto a propósito: es la persona
  // desconectada que el panel de RRHH tiene que detectar.
  const activos = usuarios.filter((u) => u.email !== "sofia@demo.pe");

  let creados = 0;
  for (let dia = 55; dia >= 0; dia -= 2) {
    // Dos o tres reconocimientos cada par de días, en parejas rotativas: da un
    // grafo con varias personas reconociendo a varias, que es lo que el mapa de
    // influencia necesita para no ser una lista de uno.
    for (let k = 0; k < 2 + (dia % 2); k++) {
      const de = activos[(dia + k) % activos.length];
      const para = activos[(dia * 3 + k * 5 + 1) % activos.length];
      if (de.id === para.id) continue;

      await prisma.recognition.create({
        data: {
          companyId: empresa.id,
          deUserId: de.id,
          paraUserId: para.id,
          valueId: valores[(dia + k) % valores.length].id,
          mensaje: MENSAJES[(dia + k * 3) % MENSAJES.length],
          canal: (dia + k) % 3 === 0 ? "DISCORD" : "WEB",
          creadoEn: new Date(Date.now() - dia * 24 * 60 * 60 * 1000),
        },
      });
      creados++;
    }
  }

  console.log(
    `Listo: ${usuarios.length} personas, ${valores.length} valores y ${creados} reconocimientos.`,
  );
  console.log("Entra con carlos@demo.pe / pulse-demo-2026 (rol admin).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
