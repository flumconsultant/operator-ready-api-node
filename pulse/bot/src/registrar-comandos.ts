import { REST, Routes } from "discord.js";

import { entorno } from "./entorno.js";
import { definicion as reconocer } from "./comando-reconocer.js";
import { definicion as vincular } from "./comando-vincular.js";

// Registra /reconocer en Discord. Se ejecuta a mano, no en cada arranque:
// Discord limita cuántas veces al día se puede hacer, y el comando no cambia
// entre despliegues.
//
//   npm run registrar               → global, tarda hasta una hora en propagarse
//   GUILD_ID=... npm run registrar  → en un solo servidor, instantáneo (pruebas)

const rest = new REST({ version: "10" }).setToken(entorno.DISCORD_TOKEN);
const guildId = process.env.GUILD_ID;

const ruta = guildId
  ? Routes.applicationGuildCommands(entorno.DISCORD_CLIENT_ID, guildId)
  : Routes.applicationCommands(entorno.DISCORD_CLIENT_ID);

await rest.put(ruta, { body: [reconocer, vincular] });

console.log(
  guildId
    ? `/reconocer y /vincular registrados en el servidor ${guildId}.`
    : "/reconocer y /vincular registrados globalmente. Pueden tardar hasta una hora en aparecer.",
);
