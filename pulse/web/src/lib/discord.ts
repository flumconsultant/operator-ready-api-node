import { prisma } from "./prisma";
import { inclusionFeed } from "./reconocimientos";

// El espejo del feed en Discord.
//
// La web no habla con la API de Discord: eso obligaría a tener el token del bot
// en dos contenedores. Habla con el bot, que ya está conectado, por su endpoint
// interno. Si el bot está caído esto falla en silencio y el reconocimiento sigue
// existiendo — el feed es la fuente de verdad, Discord es una copia.

const BOT_URL = process.env.BOT_INTERNAL_URL;
const TOKEN = process.env.INTERNAL_API_TOKEN;

export async function avisarADiscord(recognitionId: string) {
  if (!BOT_URL || !TOKEN) return;

  const r = await prisma.recognition.findUnique({
    where: { id: recognitionId },
    include: {
      ...inclusionFeed,
      // Se pide discordId aparte del resto: el feed web no lo necesita, pero
      // aquí es lo que convierte «Ana» en una mención real que le suena el móvil.
      para: { select: { nombre: true, discordId: true } },
      company: { select: { discordCanalFeedId: true } },
    },
  });
  if (!r?.company.discordCanalFeedId) return;

  try {
    await fetch(`${BOT_URL}/anunciar`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        canalId: r.company.discordCanalFeedId,
        de: r.de.nombre,
        para: r.para.nombre,
        paraDiscordId: r.para.discordId,
        valor: r.valor.nombre,
        mensaje: r.mensaje,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.warn("[pulse] no se pudo avisar al bot de Discord:", error);
  }
}
