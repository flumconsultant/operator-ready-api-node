import { z } from "zod";

// Las variables de entorno se validan al arrancar, no la primera vez que
// alguien pulsa un botón. Un despliegue al que le falta AUTH_SECRET tiene que
// fallar en el arranque y no tres horas después, con un 500 que nadie entiende.
const esquema = z.object({
  DATABASE_URL: z.string().min(1, "falta la cadena de conexión a Postgres"),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET debe tener al menos 32 caracteres"),
  AUTH_URL: z.string().url().optional(),

  // Sin esto la capa de IA se apaga sola y el producto sigue funcionando.
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODELO: z.string().default("claude-opus-5"),

  // El bot y la web se hablan por esta clave compartida.
  INTERNAL_API_TOKEN: z
    .string()
    .min(24, "INTERNAL_API_TOKEN debe tener al menos 24 caracteres"),
  // Protege el endpoint del resumen semanal frente a quien acierte la URL.
  CRON_TOKEN: z.string().min(24).optional(),

  // Magic link. Si no hay SMTP el enlace se escribe en el log del servidor,
  // que para el piloto es suficiente y evita montar un correo antes de tiempo.
  SMTP_URL: z.string().optional(),
  SMTP_DESDE: z.string().default("BECOME Pulse <pulse@become.pe>"),

  APP_URL: z.string().url().default("http://localhost:3000"),
});

const resultado = esquema.safeParse(process.env);

if (!resultado.success) {
  const detalle = resultado.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(
    `Configuración inválida. Revisa el .env contra .env.example:\n${detalle}`,
  );
}

export const entorno = resultado.data;
export const iaActiva = Boolean(entorno.ANTHROPIC_API_KEY);
