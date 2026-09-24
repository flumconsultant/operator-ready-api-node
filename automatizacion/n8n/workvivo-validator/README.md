# Middleware Workvivo ↔ Validator (versión simple)

Workflow **"Middleware Workvivo - Chatgpt"** (`jfKm2fSrV8EazttC`). Export: [`workflow.json`](./workflow.json).

## Cómo funciona

```
IDA:     Workvivo ─▶ /webhook/workvivo/validator ─▶ ¿mensaje de usuario? ─▶ Enviar a Validator (canal API, 202)
VUELTA:  Validator ─▶ MCP para Validator (herramienta responder_en_workvivo) ─▶ Workvivo
```

El canal API es asíncrono: no devuelve la respuesta. Validator la entrega llamando a la herramienta MCP `responder_en_workvivo`, que publica el texto en el chat.

## Configurar la vuelta en Agent Builder

1. En el agente Validator, añade un **MCP personalizado**:
   - URL: `https://n8n.srv836595.hstgr.cloud/mcp/<ruta secreta del nodo "MCP para Validator">`
   - Autenticación: ninguna. La ruta aleatoria actúa como secreto; no la compartas.
2. Añade a las instrucciones del agente:
   > Cuando recibas una solicitud por el canal API, al terminar usa SIEMPRE la herramienta responder_en_workvivo
   > con los valores channel_url y bot_userid indicados al final del mensaje, y en message solo tu respuesta final.
3. Publica el agente. El workflow debe estar activo.
