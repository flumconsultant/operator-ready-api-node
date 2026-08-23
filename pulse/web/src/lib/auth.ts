import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "./prisma";
import { entorno } from "./entorno";

// La sesión lleva empresa y rol porque cada consulta de la aplicación se filtra
// por empresa. Si eso viviera solo en la base habría que ir a buscarlo en cada
// página, y basta con que se olvide una vez para enseñarle a alguien el feed de
// otra compañía.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      companyId: string;
      /// El slug de la empresa. Va en la sesión porque cada enlace de la
      /// aplicación lo lleva delante: sin él aquí, habría una consulta a la
      /// base por página para un dato que no cambia.
      empresaSlug: string;
      rol: "ADMIN" | "MANAGER" | "COLABORADOR";
    } & DefaultSession["user"];
  }
}

const credenciales = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // El proveedor de credenciales no es compatible con sesiones en base de
  // datos, así que la sesión va en JWT. El adaptador sigue haciendo falta: los
  // tokens del magic link sí se guardan en Postgres.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  secret: entorno.AUTH_SECRET,
  trustHost: true,
  pages: { signIn: "/acceder", verifyRequest: "/acceder/revisa-tu-correo" },
  providers: [
    Credentials({
      name: "Correo y contraseña",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(datos) {
        const validado = credenciales.safeParse(datos);
        if (!validado.success) return null;

        const usuario = await prisma.user.findUnique({
          where: { email: validado.data.email.toLowerCase() },
        });
        // Se comprueba el hash aunque el usuario no exista para que el tiempo
        // de respuesta no distinga entre "no está" y "contraseña incorrecta".
        const hash =
          usuario?.passwordHash ??
          "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi";
        const coincide = await bcrypt.compare(validado.data.password, hash);

        if (!usuario || !usuario.passwordHash || !coincide) return null;
        if (!usuario.activo) return null;

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          image: usuario.imagen,
        };
      },
    }),
    Nodemailer({
      from: entorno.SMTP_DESDE,
      // El servidor solo se usa si está configurado; `sendVerificationRequest`
      // decide qué hacer en cada caso.
      server: entorno.SMTP_URL ?? "smtp://localhost:1025",
      async sendVerificationRequest({ identifier, url, provider }) {
        if (!entorno.SMTP_URL) {
          // Piloto sin correo montado: el enlace sale por el log del servidor.
          // Es deliberado y está documentado en el README; en producción, con
          // SMTP_URL puesto, esta rama no se ejecuta.
          console.warn(
            `[pulse] SMTP_URL sin configurar. Enlace de acceso para ${identifier}:\n${url}`,
          );
          return;
        }
        const { createTransport } = await import("nodemailer");
        const transporte = createTransport(provider.server);
        await transporte.sendMail({
          to: identifier,
          from: provider.from,
          subject: "Tu acceso a BECOME Pulse",
          text: `Entra en Pulse con este enlace (caduca en 24 horas):\n\n${url}\n`,
          html: enlaceHtml(url),
        });
      },
    }),
  ],
  callbacks: {
    // Solo entra quien ya está dado de alta en una empresa. Pulse no tiene
    // registro abierto: a la gente la invita su admin.
    async signIn({ user }) {
      if (!user.email) return false;
      const existente = await prisma.user.findUnique({
        where: { email: user.email.toLowerCase() },
        select: { activo: true },
      });
      return Boolean(existente?.activo);
    },
    async jwt({ token, user, trigger }) {
      // Al iniciar sesión, y cuando el cliente pide refresco, se relee el rol:
      // si a alguien lo ascienden a admin no tiene que esperar treinta días a
      // que caduque el token.
      if (user?.email || trigger === "update") {
        const email = (user?.email ?? token.email) as string | undefined;
        if (email) {
          const fila = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
              id: true,
              companyId: true,
              rol: true,
              nombre: true,
              company: { select: { slug: true } },
            },
          });
          if (fila) {
            token.sub = fila.id;
            token.companyId = fila.companyId;
            token.empresaSlug = fila.company.slug;
            token.rol = fila.rol;
            token.name = fila.nombre;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.companyId = token.companyId as string;
      session.user.empresaSlug = token.empresaSlug as string;
      session.user.rol = token.rol as "ADMIN" | "MANAGER" | "COLABORADOR";
      return session;
    },
  },
});

function enlaceHtml(url: string) {
  // Sin hoja de estilos externa: los clientes de correo la ignoran. Los colores
  // son los del manual, escritos a mano porque aquí no llegan las variables CSS.
  return `<body style="margin:0;background:#F7FAFC;font-family:Inter,system-ui,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 24px">
      <table role="presentation" width="100%" style="max-width:440px;background:#FFFFFF;border-radius:16px;padding:40px">
        <tr><td>
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#626E82">BECOME Pulse</p>
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#0A0E27">Tu acceso está listo</h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.55;color:#2D3748">Pulsa el botón para entrar. El enlace caduca en 24 horas y solo funciona una vez.</p>
          <a href="${url}" style="display:inline-block;background:#00FF88;color:#0A0E27;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px;font-weight:500">Entrar en Pulse</a>
          <p style="margin:28px 0 0;font-size:13px;line-height:1.5;color:#626E82">Si no has pedido este acceso, ignora el mensaje.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>`;
}
