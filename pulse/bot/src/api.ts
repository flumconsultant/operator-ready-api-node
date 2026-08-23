import { entorno } from "./entorno.js";

// El bot no toca Postgres. Todo lo que necesita se lo pide a la web por la API
// interna: una sola definición de las reglas, un solo sitio donde mirar cuando
// algo no cuadra, y un contenedor menos con la cadena de conexión encima.

export type Valor = { id: string; nombre: string; emoji: string };
export type Directorio = { id: string; nombre: string; valores: Valor[] };

async function llamar<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<{ ok: true; datos: T } | { ok: false; error: string }> {
  try {
    const respuesta = await fetch(`${entorno.WEB_INTERNAL_URL}${ruta}`, {
      ...opciones,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${entorno.INTERNAL_API_TOKEN}`,
        ...opciones.headers,
      },
      signal: AbortSignal.timeout(10_000),
    });

    const cuerpo = (await respuesta.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!respuesta.ok) {
      return {
        ok: false,
        error:
          typeof cuerpo.error === "string"
            ? cuerpo.error
            : `La aplicación respondió ${respuesta.status}.`,
      };
    }
    return { ok: true, datos: cuerpo as T };
  } catch {
    return {
      ok: false,
      error: "No se pudo hablar con Pulse. Inténtalo en un momento.",
    };
  }
}

export function directorio(guildId: string) {
  return llamar<Directorio>(
    `/api/interno/directorio?guildId=${encodeURIComponent(guildId)}`,
  );
}

export function vincular(datos: {
  guildId: string;
  discordId: string;
  codigo: string;
}) {
  return llamar<{ nombre: string; empresa: string }>("/api/interno/vincular", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function reconocer(datos: {
  guildId: string;
  deDiscordId: string;
  paraDiscordId: string;
  valueId: string;
  mensaje: string;
}) {
  return llamar<{ id: string; para: string }>(
    "/api/interno/reconocimientos",
    { method: "POST", body: JSON.stringify(datos) },
  );
}
