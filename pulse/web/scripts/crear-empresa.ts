import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

// Da de alta una empresa nueva con su primer administrador.
//
//   npm run empresa:crear -- "Nombre de la empresa" admin@empresa.com "Nombre Apellido"
//
// Es un script y no un formulario en la web a propósito. Pulse se vende con
// acompañamiento: no hay registro público, y un endpoint que crea empresas sin
// autenticación es una invitación a que alguien llene la base de compañías
// vacías. Cuando exista un flujo comercial de autoservicio, esta misma función
// es la que llamará.
//
// La empresa queda SIN configurar: su administrador recorre el asistente de
// puesta en marcha la primera vez que entra, igual que un cliente real.

const prisma = new PrismaClient();

function comoSlug(nombre: string) {
  return nombre
    .normalize("NFD")
    // Quita los acentos: "Compañía Ñandú" no puede acabar en una URL.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function main() {
  const [nombre, email, nombrePersona] = process.argv.slice(2);

  if (!nombre || !email || !nombrePersona) {
    console.error(
      'Uso: npm run empresa:crear -- "Empresa S.A." admin@empresa.com "Nombre Apellido"',
    );
    process.exit(1);
  }

  const correo = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    console.error(`«${email}» no parece un correo.`);
    process.exit(1);
  }

  const yaExiste = await prisma.user.findUnique({ where: { email: correo } });
  if (yaExiste) {
    console.error(`Ya hay una cuenta con ${correo}.`);
    process.exit(1);
  }

  // El slug tiene que ser único: si «Flum» ya existe, el siguiente es «flum-2».
  let slug = comoSlug(nombre);
  let sufijo = 1;
  while (await prisma.company.findUnique({ where: { slug } })) {
    sufijo++;
    slug = `${comoSlug(nombre)}-${sufijo}`;
  }

  const token = randomBytes(32).toString("base64url");
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  const empresa = await prisma.company.create({
    data: {
      nombre: nombre.trim(),
      slug,
      // Sin onboardingEn: su administrador pasa por el asistente.
      usuarios: {
        create: {
          nombre: nombrePersona.trim(),
          email: correo,
          rol: "ADMIN",
          tokenInvitacion: token,
          invitacionExpira: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
    },
    select: { id: true, nombre: true, slug: true, usuarios: { select: { id: true, nombre: true } } },
  });

  const admin = empresa.usuarios[0];

  await prisma.auditLog.create({
    data: {
      companyId: empresa.id,
      // Sin actor: esto lo hace quien opera el servidor, no una persona con
      // sesión. Dejarlo en blanco es más honesto que atribuírselo al admin.
      actorId: null,
      actorNombre: "Alta desde el servidor",
      accion: "EMPRESA_CREADA",
      objetivoId: empresa.id,
      objetivoNombre: empresa.nombre,
      cambios: [
        { campo: "identificador", antes: null, despues: empresa.slug },
        { campo: "administrador", antes: null, despues: correo },
      ],
    },
  });

  console.log(`\nEmpresa creada: ${empresa.nombre} (${empresa.slug})`);
  console.log(`Administrador:  ${admin.nombre} <${correo}>`);
  console.log(`\nMándale este enlace. Caduca en 14 días:\n`);
  console.log(`  ${appUrl}/invitacion/${token}\n`);
  console.log(
    "Al entrar recorrerá el asistente de puesta en marcha: identidad, valores y equipo.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
