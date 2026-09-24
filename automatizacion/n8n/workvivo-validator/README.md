# Middleware Workvivo ↔ Validator (versión simple)

Workflow **"Middleware Workvivo - Chatgpt"** (`jfKm2fSrV8EazttC`). Export: [`workflow.json`](./workflow.json).

## Cómo funciona

El canal API de un Workspace Agent de ChatGPT **es asíncrono**: `POST https://api.chatgpt.com/v1/workspace_agents/{agtch_...}/trigger`
responde `202` y **no devuelve la respuesta del agente**. Por eso hay dos tramos:

```
IDA:     Workvivo ─POST─▶ /webhook/workvivo/validator ─▶ ¿mensaje de usuario? ─▶ Enviar a Validator (202)
VUELTA:  Validator ─POST─▶ /webhook/workvivo/validator/respuesta ─▶ Responder en Workvivo
```

- **Ida.** Se filtran los mensajes que no son de un usuario (categoría distinta, otra app, mensajes del propio bot o texto vacío).
  - Se envían con `conversation_key = channel_url`, que da continuidad por conversación, e `Idempotency-Key = message_id`.
  - El `input` lleva el texto del usuario y, al final, `channel_url` y `bot_userid` para que Validator sepa a qué chat responder.
- **Vuelta.** Validator debe hacer `POST` a `https://n8n.srv836595.hstgr.cloud/webhook/workvivo/validator/respuesta` con el header de la credencial *Validator → n8n* y este body:
  ```json
  { "channel_url": "...", "bot_userid": "...", "message": "texto de la respuesta" }
  ```

## Configurar

1. **Enviar a Validator.** Cambia `agtch_PEGAR_AQUI` en la URL por el ID del canal API.
   Crea la credencial *Bearer Auth* "ChatGPT Validator" con el token de Workspace Agent (ChatGPT → Admin → Access tokens), no con una API key de Platform.
2. **Responder en Workvivo.** Crea la credencial *Bearer Auth* "Workvivo Bot API" con tu token de Workvivo.
   La URL es `https://api.workvivo.io/v1/chat/bots/message` y el header `Workvivo-Id: 1000242`. Ajústalo si tu región u organización son otras.
3. **Respuesta de Validator.** Crea la credencial *Header Auth* "Validator → n8n" (nombre y valor secretos) y configura el mismo header en la acción que use Validator.
4. En Workvivo, la URL del bot es `https://n8n.srv836595.hstgr.cloud/webhook/workvivo/validator`. Activa el workflow.

## Pendiente

- Hay que confirmar que tu Workspace Agent pueda hacer el `POST` de vuelta (acción o conector hacia una URL externa).
  Si no puede, el agente no tiene cómo devolver la respuesta a Workvivo por este canal.
- La ida no verifica la firma de SendBird: solo filtra por `app_id`. Es aceptable para una PoC. Para producción, añade la verificación de `x-sendbird-signature`.
