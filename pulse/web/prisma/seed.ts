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

// Con --nueva, la empresa y las personas quedan sin configurar, para poder
// recorrer los dos asistentes de puesta en marcha como los verá un cliente.
const nueva = process.argv.includes("--nueva");

// nombre, clave del icono (ver src/lib/iconos-valores.tsx), descripción
const VALORES = [
  ["Colaboración", "colaboracion", "Sale de su carril para que otro llegue."],
  ["Obsesión por el cliente", "cliente", "Decide mirando al cliente, no al proceso."],
  ["Criterio", "criterio", "Decide bien con información incompleta."],
  ["Aprender rápido", "aprendizaje", "Cambia de opinión cuando aparece el dato."],
  ["Cuidar al equipo", "cuidado", "Se nota cuando no está."],
] as const;

// nombre, correo, rol, equipo, cargo, día de cumpleaños (MM-DD), año de ingreso
type Persona = [
  string,
  string,
  "ADMIN" | "MANAGER" | "COLABORADOR",
  string,
  string,
  string,
  number,
];

const PERSONAS: Persona[] = [
  ["Carlos Ramírez", "carlos@demo.pe", "ADMIN", "Dirección", "Director general", "03-14", 2019],
  ["Ana Villanueva", "ana@demo.pe", "MANAGER", "Producto", "Líder de producto", "07-02", 2021],
  ["Diego Salazar", "diego@demo.pe", "MANAGER", "Operaciones", "Jefe de operaciones", "11-23", 2020],
  ["Lucía Ferrer", "lucia@demo.pe", "COLABORADOR", "Producto", "Diseñadora de producto", dentroDe(2), 2023],
  ["Martín Ochoa", "martin@demo.pe", "COLABORADOR", "Producto", "Desarrollador", "01-30", 2022],
  ["Rosa Quispe", "rosa@demo.pe", "COLABORADOR", "Operaciones", "Analista de operaciones", "09-17", 2022],
  ["Javier Tello", "javier@demo.pe", "COLABORADOR", "Operaciones", "Coordinador logístico", dentroDe(4), 2024],
  ["Sofía Mendoza", "sofia@demo.pe", "COLABORADOR", "Comercial", "Ejecutiva comercial", "12-11", 2023],
];

/// Dos personas cumplen dentro de los próximos días, para que la columna de
/// «esta semana» tenga algo que enseñar en cuanto se levanta la demo. El resto
/// llevan fechas fijas.
function dentroDe(dias: number) {
  const d = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

const COMENTARIOS = [
  "Totalmente de acuerdo, se notó muchísimo.",
  "Yo estaba ese día y confirmo cada palabra.",
  "Grande. Gracias por sacar la cara por el equipo.",
  "Esto merecía decirse en voz alta.",
  "Lo mismo pensé la semana pasada y no lo dije. Bien ahí.",
];

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
      // La demo entra directa al feed: es para enseñar el producto, no para
      // recorrer los asistentes. Para verlos, `npm run db:semilla -- --nueva`.
      onboardingEn: nueva ? null : new Date(),
      // Se rellenan a mano cuando se conecta un servidor de Discord real.
      discordGuildId: null,
      discordCanalFeedId: null,
    },
  });

  const valores = [];
  for (const [i, [nombre, icono, descripcion]] of VALORES.entries()) {
    valores.push(
      await prisma.value.upsert({
        where: { companyId_nombre: { companyId: empresa.id, nombre } },
        update: { icono, descripcion, orden: i },
        create: { companyId: empresa.id, nombre, icono, descripcion, orden: i },
      }),
    );
  }

  // Todas las cuentas de demo comparten contraseña. Es una semilla local; el
  // README lo dice y el despliegue de producción no la ejecuta.
  const hash = await bcrypt.hash("pulse-demo-2026", 10);

  const anoActual = new Date().getUTCFullYear();

  const usuarios = [];
  for (const [nombre, email, rol, equipo, cargo, cumple, anoIngreso] of PERSONAS) {
    // El cumpleaños se pone en el año actual para que el feed de la demo tenga
    // alguna celebración cerca; el año no se muestra en ninguna parte.
    const cumpleanos = new Date(`${anoActual}-${cumple}T12:00:00.000Z`);
    // El aniversario cae seis meses después del cumpleaños: si coincidieran, la
    // misma persona aparecería dos veces seguidas en «esta semana» y parecería
    // un fallo de la aplicación en vez de una casualidad de los datos.
    const mesIngreso = ((Number(cumple.slice(0, 2)) + 5) % 12) + 1;
    const fechaIngreso = new Date(
      `${anoIngreso}-${String(mesIngreso).padStart(2, "0")}-${cumple.slice(3)}T12:00:00.000Z`,
    );

    const datos = {
      nombre,
      rol,
      equipo,
      cargo,
      cumpleanos,
      fechaIngreso,
      companyId: empresa.id,
      onboardingEn: nueva ? null : new Date(),
    };

    usuarios.push(
      await prisma.user.upsert({
        where: { email },
        update: datos,
        create: {
          ...datos,
          email,
          passwordHash: hash,
          emailVerified: new Date(),
          // Repartidos en el tiempo para que la alerta de desconexión de 60
          // días tenga a quién señalar.
          invitadoEn: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
          onboardingEn: nueva ? null : new Date(),
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

  const REACCIONES = ["👏", "❤️", "🔥", "🎉", "💡"];

  let creados = 0;
  for (let dia = 55; dia >= 0; dia -= 2) {
    // Dos o tres reconocimientos cada par de días, en parejas rotativas: da un
    // grafo con varias personas reconociendo a varias, que es lo que el mapa de
    // influencia necesita para no ser una lista de uno.
    for (let k = 0; k < 2 + (dia % 2); k++) {
      const de = activos[(dia + k) % activos.length];
      const para = activos[(dia * 3 + k * 5 + 1) % activos.length];
      if (de.id === para.id) continue;

      const creadoEn = new Date(Date.now() - dia * 24 * 60 * 60 * 1000);

      const reconocimiento = await prisma.recognition.create({
        data: {
          companyId: empresa.id,
          deUserId: de.id,
          destinatarios: { create: [{ userId: para.id }] },
          valueId: valores[(dia + k) % valores.length].id,
          mensaje: MENSAJES[(dia + k * 3) % MENSAJES.length],
          canal: (dia + k) % 3 === 0 ? "DISCORD" : "WEB",
          creadoEn,
        },
      });
      creados++;

      // Reacciones de dos o tres personas distintas, para que la barra no
      // salga vacía y se vea cómo se agrupan.
      for (let r = 0; r < 2 + ((dia + k) % 2); r++) {
        const quien = activos[(dia * 2 + k + r * 3) % activos.length];
        if (quien.id === de.id) continue;
        await prisma.reaction.upsert({
          where: {
            recognitionId_userId: {
              recognitionId: reconocimiento.id,
              userId: quien.id,
            },
          },
          create: {
            recognitionId: reconocimiento.id,
            userId: quien.id,
            emoji: REACCIONES[(dia + r) % REACCIONES.length],
            creadaEn: new Date(creadoEn.getTime() + 3600_000),
          },
          update: {},
        });
      }

      // Un comentario en uno de cada tres, que es más o menos la proporción
      // real en un feed de empresa: no todo se comenta.
      if ((dia + k) % 3 === 0) {
        const quien = activos[(dia + k * 2) % activos.length];
        await prisma.comment.create({
          data: {
            recognitionId: reconocimiento.id,
            userId: quien.id,
            texto: COMENTARIOS[(dia + k) % COMENTARIOS.length],
            creadoEn: new Date(creadoEn.getTime() + 7200_000),
          },
        });
      }
    }
  }

  // Un kudo a tres personas y una mención, para que la demo enseñe las dos
  // cosas sin tener que crearlas a mano.
  const productoYOperaciones = activos.filter((u) =>
    ["ana@demo.pe", "martin@demo.pe", "rosa@demo.pe"].includes(u.email),
  );
  const carlos = usuarios.find((u) => u.email === "carlos@demo.pe")!;
  const diego = usuarios.find((u) => u.email === "diego@demo.pe")!;

  if (productoYOperaciones.length === 3) {
    await prisma.recognition.create({
      data: {
        companyId: empresa.id,
        deUserId: carlos.id,
        valueId: valores[0].id,
        mensaje: `Sacaron el cierre de julio en tres días entre los tres, con @[${diego.nombre}](${diego.id}) cubriendo lo que faltaba de operaciones.`,
        canal: "WEB",
        creadoEn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        destinatarios: {
          create: productoYOperaciones.map((u) => ({ userId: u.id })),
        },
      },
    });
    creados++;
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
