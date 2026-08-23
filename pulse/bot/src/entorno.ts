// Igual que en la web: si falta algo, que falle al arrancar.

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(
      `Falta la variable ${nombre}. Revisa el .env contra pulse/.env.example.`,
    );
  }
  return valor;
}

export const entorno = {
  DISCORD_TOKEN: requerida("DISCORD_TOKEN"),
  DISCORD_CLIENT_ID: requerida("DISCORD_CLIENT_ID"),
  WEB_INTERNAL_URL: process.env.WEB_INTERNAL_URL ?? "http://web:3000",
  INTERNAL_API_TOKEN: requerida("INTERNAL_API_TOKEN"),
  PUERTO: Number(process.env.PUERTO ?? 3001),
  APP_URL: process.env.APP_URL ?? "http://localhost:3000",
};
