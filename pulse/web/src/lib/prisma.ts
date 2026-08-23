import { PrismaClient } from "@prisma/client";

// En desarrollo Next.js recarga el módulo en cada cambio. Sin este cacheo cada
// recarga abriría un pool nuevo contra Postgres y en media hora la base se
// queda sin conexiones.
const global_ = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  global_.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") global_.prisma = prisma;
