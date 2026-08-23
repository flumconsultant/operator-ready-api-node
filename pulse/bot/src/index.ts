import { createServer } from "node:http";
import {
  Client,
  GatewayIntentBits,
  Events,
  type TextChannel,
} from "discord.js";

import { entorno } from "./entorno.js";
import * as reconocer from "./comando-reconocer.js";
import * as vincular from "./comando-vincular.js";

// El bot de Discord de BECOME Pulse.
//
// Hace dos cosas: atiende /reconocer, y expone un servidor HTTP mínimo en la
// red interna de Docker para que la web pueda pedirle que publique en un canal
// lo que se ha reconocido desde el navegador. Ese servidor no sale a internet:
// en docker-compose el puerto no se publica y Caddy no lo enruta.

const cliente = new Client({ intents: [GatewayIntentBits.Guilds] });

cliente.once(Events.ClientReady, (listo) => {
  console.log(`[bot] conectado como ${listo.user.tag}`);
});

cliente.on(Events.InteractionCreate, async (interaccion) => {
  try {
    if (interaccion.isAutocomplete() && interaccion.commandName === "reconocer") {
      return await reconocer.autocompletar(interaccion);
    }
    if (interaccion.isChatInputCommand() && interaccion.commandName === "reconocer") {
      return await reconocer.ejecutar(interaccion);
    }
    if (interaccion.isChatInputCommand() && interaccion.commandName === "vincular") {
      return await vincular.ejecutar(interaccion);
    }
  } catch (error) {
    console.error("[bot] interacción fallida:", error);
  }
});

await cliente.login(entorno.DISCORD_TOKEN);

// ---- API interna ---------------------------------------------------------

const servidor = createServer(async (peticion, respuesta) => {
  const responder = (codigo: number, cuerpo: unknown) => {
    respuesta.writeHead(codigo, { "content-type": "application/json" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (peticion.url === "/salud") return responder(200, { ok: true });

  if (peticion.method !== "POST" || peticion.url !== "/anunciar") {
    return responder(404, { error: "No existe." });
  }

  const autorizacion = (peticion.headers.authorization ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (autorizacion !== entorno.INTERNAL_API_TOKEN) {
    return responder(401, { error: "No autorizado." });
  }

  let cuerpo = "";
  for await (const trozo of peticion) cuerpo += trozo;

  try {
    const datos = JSON.parse(cuerpo) as {
      canalId: string;
      de: string;
      destinatarios: { nombre: string; discordId: string | null }[];
      valor: string;
      mensaje: string;
    };

    const canal = await cliente.channels.fetch(datos.canalId);
    if (!canal?.isTextBased() || !("send" in canal)) {
      return responder(400, { error: "El canal no admite mensajes." });
    }

    // A quien tiene su Discord enlazado se le menciona de verdad: la
    // notificación es la mitad del valor de que esto viva en Discord. A quien
    // no, se le pone en negrita.
    const para = datos.destinatarios
      .map((d) => (d.discordId ? `<@${d.discordId}>` : `**${d.nombre}**`))
      .join(", ");

    await (canal as TextChannel).send({
      embeds: [
        reconocer.tarjeta({
          de: `**${datos.de}**`,
          para,
          valor: datos.valor,
          mensaje: datos.mensaje,
        }),
      ],
    });

    responder(200, { ok: true });
  } catch (error) {
    console.error("[bot] no se pudo publicar el anuncio:", error);
    responder(500, { error: "No se pudo publicar." });
  }
});

servidor.listen(entorno.PUERTO, () => {
  console.log(`[bot] API interna escuchando en :${entorno.PUERTO}`);
});

for (const senal of ["SIGINT", "SIGTERM"] as const) {
  process.on(senal, () => {
    console.log(`[bot] ${senal}: cerrando`);
    servidor.close();
    void cliente.destroy();
    process.exit(0);
  });
}
