# Middleware Workvivo ↔ Validator (Workspace Agent)

Workflow n8n **"Middleware Workvivo - Chatgpt"** (`jfKm2fSrV8EazttC`). Export sin secretos: [`workflow.json`](./workflow.json).
El agente sigue viviendo en ChatGPT Workspace. n8n solo resuelve transporte, correlación, idempotencia, estado y observabilidad.

## Flujo

```
Workvivo ─▶ /webhook/workvivo/validator
  ├─ filtro: solo mensajes de usuario (sin eventos del bot, app_id propio, texto no vacío)
  ├─ ¿evento ya recibido? (event_id = message_id)  → duplicado: se descarta
  ├─ Crear solicitud: request_id = req_<24 hex>, conversation_key = workvivo:v2:{bot_userid}:{channel_url}
  ├─ wv_requests: status received
  ├─ Workvivo: "Estoy revisando tu consulta…"      (fijo, sin IA)
  └─ POST …/workspace_agents/{agtch}/trigger        (Idempotency-Key: workvivo:{event_id})
        202 → triggered   |   error tras 3 intentos → failed + "No pude procesar tu consulta…"

Validator ─▶ MCP ─▶ send_workvivo_reply(request_id, message)
  ├─ valida formato; busca request_id en wv_requests (debe haberlo creado el backend)
  ├─ completed/sending → already_sent · vencida → timeout · inexistente → not_found
  ├─ status sending → publica en Workvivo con el channel_url guardado → completed
  └─ devuelve { success, request_id, status }

Cada 5 min: solicitudes triggered con expires_at vencido (TTL 10 min) → timeout.
```

## Estados y métricas (tabla `wv_requests`)

- Estados: `received → triggered → sending → completed`; también `failed` y `timeout`.
  El paso `acknowledged` queda registrado como `ack_at`, y `processing` equivale a `triggered`: sin seguimiento de runs no se puede observar por separado.
- Métricas:

| Métrica | Mide |
|---|---|
| `t_ack_ms` | mensaje del usuario → acuse |
| `t_trigger_ms` | recepción → 202 |
| `t_agent_ms` | 202 → llamada MCP |
| `t_delivery_ms` | llamada MCP → publicación |
| `t_total_ms` | mensaje del usuario → respuesta publicada |

## Instrucciones que deben estar en el Workspace Agent

```
Cuando recibas una solicitud cuyo Source sea Workvivo:
1. Identifica el Request ID recibido.
2. Procesa la pregunta normalmente utilizando tus instrucciones, Skills, Apps y fuentes disponibles.
3. Genera una única respuesta final para el usuario.
4. Cuando tengas completamente preparada la respuesta, llama exactamente una vez a la herramienta send_workvivo_reply.
5. Envía: request_id y message.
6. No envíes respuestas parciales.
7. No llames varias veces a send_workvivo_reply para la misma solicitud.
8. Después de recibir confirmación de que la herramienta envió correctamente el mensaje, finaliza la ejecución.
9. No intentes reconstruir, modificar ni inventar URLs de Workvivo.
10. Nunca cambies el Request ID recibido.
```

## Pendientes conocidos

- **Autenticación del webhook:** llega desde SendBird (`x-sendbird-signature`), sin JWT de Workvivo. Solo se filtra por `app_id`. Verificar la firma requiere el secreto de firma de SendBird/Workvivo.
- **Autenticación del MCP:** hoy la protege una ruta secreta. Si el conector de ChatGPT admite un header o OAuth, conviene activarlo en el nodo "MCP para Validator".
- **Fallos del run del agente:** no hay un endpoint documentado de seguimiento de runs configurado. Un run fallido se detecta por timeout (sin mensaje al usuario).
- **Concurrencia:** entre "Buscar solicitud" y "Reservar envío" hay una ventana mínima en la que dos llamadas simultáneas idénticas podrían publicar dos veces.
