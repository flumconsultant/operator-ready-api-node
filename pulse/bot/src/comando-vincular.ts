import {
  SlashCommandBuilder,
  MessageFlags,
  type ChatInputCommandInteraction,
} from "discord.js";

import { vincular } from "./api.js";

// /vincular CÓDIGO
//
// Enlaza la cuenta de Discord de quien lo escribe con su cuenta de Pulse. El
// código lo genera esa persona desde su perfil en Pulse, donde ya está
// autenticada, y ahí está la seguridad de todo esto: el bot solo sabe qué
// cuenta de Discord ha escrito el comando, y sin el código no podría demostrar
// que esa cuenta pertenece a nadie en particular.
//
// Antes esto lo hacía el administrador copiando identificadores de Discord a
// mano en la ficha de cada persona. Funcionaba para una empresa y no para dos.

export const definicion = new SlashCommandBuilder()
  .setName("vincular")
  .setDescription("Enlaza tu cuenta de Discord con tu cuenta de Pulse")
  .addStringOption((o) =>
    o
      .setName("codigo")
      .setDescription("El código que genera tu perfil en Pulse")
      .setRequired(true)
      .setMinLength(4)
      .setMaxLength(20),
  )
  .toJSON();

export async function ejecutar(interaccion: ChatInputCommandInteraction) {
  if (!interaccion.guildId) {
    return interaccion.reply({
      content: "Este comando solo funciona dentro del servidor de tu empresa.",
      flags: MessageFlags.Ephemeral,
    });
  }

  // Siempre en privado: el código es de un solo uso, pero enseñarlo en el canal
  // le da a cualquiera la oportunidad de gastarlo antes.
  await interaccion.deferReply({ flags: MessageFlags.Ephemeral });

  const resultado = await vincular({
    guildId: interaccion.guildId,
    discordId: interaccion.user.id,
    codigo: interaccion.options.getString("codigo", true),
  });

  if (!resultado.ok) {
    return interaccion.editReply({ content: resultado.error });
  }

  await interaccion.editReply({
    content: `Listo, ${resultado.datos.nombre}. Tu Discord ya está enlazado con ${resultado.datos.empresa}: prueba \`/reconocer\`.`,
  });
}
