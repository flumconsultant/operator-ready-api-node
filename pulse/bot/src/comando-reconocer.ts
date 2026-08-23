import {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  type ChatInputCommandInteraction,
  type AutocompleteInteraction,
} from "discord.js";

import { directorio, reconocer } from "./api.js";

// /reconocer @persona [valor] [mensaje]
//
// El valor va con autocompletado y no con una lista fija: los valores los
// configura cada empresa desde el panel, y un `addChoices` obligaría a volver a
// registrar el comando en Discord cada vez que alguien añade uno.

export const definicion = new SlashCommandBuilder()
  .setName("reconocer")
  .setDescription("Reconoce a alguien de tu equipo sin salir de Discord")
  .addUserOption((o) =>
    o
      .setName("persona")
      .setDescription("A quién quieres reconocer")
      .setRequired(true),
  )
  .addStringOption((o) =>
    o
      .setName("valor")
      .setDescription("Qué valor de la empresa representa")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption((o) =>
    o
      .setName("mensaje")
      .setDescription("Qué hizo, concretamente")
      .setRequired(true)
      .setMinLength(10)
      .setMaxLength(1000),
  )
  .toJSON();

// El directorio se cachea un minuto. Discord da tres segundos para responder a
// un autocompletado y va pidiéndolo tecla a tecla: sin caché son diez llamadas
// a la API por cada comando escrito.
const cache = new Map<string, { hasta: number; valores: { id: string; nombre: string; emoji: string }[] }>();

async function valoresDe(guildId: string) {
  const guardado = cache.get(guildId);
  if (guardado && guardado.hasta > Date.now()) return guardado.valores;

  const respuesta = await directorio(guildId);
  if (!respuesta.ok) return [];

  cache.set(guildId, {
    hasta: Date.now() + 60_000,
    valores: respuesta.datos.valores,
  });
  return respuesta.datos.valores;
}

export async function autocompletar(interaccion: AutocompleteInteraction) {
  if (!interaccion.guildId) return interaccion.respond([]);

  const escrito = interaccion.options.getFocused().toLowerCase();
  const valores = await valoresDe(interaccion.guildId);

  await interaccion.respond(
    valores
      .filter((v) => v.nombre.toLowerCase().includes(escrito))
      .slice(0, 25)
      .map((v) => ({ name: `${v.emoji} ${v.nombre}`, value: v.id })),
  );
}

export async function ejecutar(interaccion: ChatInputCommandInteraction) {
  if (!interaccion.guildId) {
    return interaccion.reply({
      content: "Este comando solo funciona dentro del servidor de tu empresa.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const persona = interaccion.options.getUser("persona", true);
  const valueId = interaccion.options.getString("valor", true);
  const mensaje = interaccion.options.getString("mensaje", true);

  if (persona.id === interaccion.user.id) {
    return interaccion.reply({
      content: "No puedes reconocerte a ti mismo. Buen intento.",
      flags: MessageFlags.Ephemeral,
    });
  }
  if (persona.bot) {
    return interaccion.reply({
      content: "Los bots no cuentan.",
      flags: MessageFlags.Ephemeral,
    });
  }

  // La llamada a Pulse puede tardar más de los tres segundos que Discord
  // concede, así que primero se aplaza la respuesta.
  await interaccion.deferReply();

  const resultado = await reconocer({
    guildId: interaccion.guildId,
    deDiscordId: interaccion.user.id,
    paraDiscordId: persona.id,
    valueId,
    mensaje,
  });

  if (!resultado.ok) {
    // El error se ve solo para quien lo provocó: un "no estás enlazado" delante
    // de todo el canal no ayuda a nadie.
    await interaccion.deleteReply().catch(() => {});
    return interaccion.followUp({
      content: resultado.error,
      flags: MessageFlags.Ephemeral,
    });
  }

  const valores = await valoresDe(interaccion.guildId);
  const valor = valores.find((v) => v.id === valueId);

  await interaccion.editReply({
    embeds: [
      tarjeta({
        de: interaccion.user.toString(),
        para: persona.toString(),
        valor: valor ? `${valor.emoji} ${valor.nombre}` : "Reconocimiento",
        mensaje,
      }),
    ],
  });
}

export function tarjeta(datos: {
  de: string;
  para: string;
  valor: string;
  mensaje: string;
}) {
  return new EmbedBuilder()
    // El verde eléctrico del manual de BECOME. Discord solo entiende enteros.
    .setColor(0x00ff88)
    .setAuthor({ name: datos.valor })
    .setDescription(`${datos.de} reconoció a ${datos.para}\n\n> ${datos.mensaje}`)
    .setFooter({ text: "BECOME Pulse" })
    .setTimestamp(new Date());
}
