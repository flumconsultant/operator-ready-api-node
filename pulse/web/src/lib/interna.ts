import { entorno } from "./entorno";
import { timingSafeEqual } from "node:crypto";

// El bot y la web comparten una clave. Es suficiente porque los dos
// contenedores viven en la misma red de Docker y `web` no publica /api/interno
// fuera: Caddy solo enruta el resto. Aun así se compara en tiempo constante,
// que cuesta una línea.

export function autorizada(peticion: Request): boolean {
  const cabecera = peticion.headers.get("authorization") ?? "";
  const recibido = cabecera.replace(/^Bearer\s+/i, "");
  const esperado = entorno.INTERNAL_API_TOKEN;

  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
