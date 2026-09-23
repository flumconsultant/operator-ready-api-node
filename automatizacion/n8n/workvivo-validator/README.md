# Middleware Workvivo ↔ Validator (n8n)

Workflow **"Middleware Workvivo - Chatgpt"** (`jfKm2fSrV8EazttC`) en `n8n.srv836595.hstgr.cloud`.
Export importable: [`workflow.json`](./workflow.json) (sin secretos ni IDs de credenciales).

> ⚠️ **No habilites el bot en Workvivo ni actives el workflow hasta completar y aprobar todas las pruebas de seguridad de este documento.**
> Hoy n8n impide activarlo porque falta la credencial JWT; mantén esa barrera hasta terminar las pruebas.

## Flujo

```
Workvivo ──POST──▶ Webhook /workvivo/validator
  → Validar entrada básica (HTTPS, JSON, tamaño, x-workvivo-jwt, alg permitido, config)
  → Validar firma JWT (nodo JWT nativo, clave pública fijada en credencial)
  → Validar claims JWT (exp, nbf, iat, iss, aud, app, tenant)
  → Normalizar evento (mapeo, anti-bucle, adjuntos, rate limit)
  → Idempotencia (Data Table, 24 h) ──duplicado──▶ 200
  → ACK 200 {received, correlationId}  ← Workvivo recibe la respuesta aquí
  → Conversación (Data Table) → Enviar a Validator ⟲ backoff exponencial (429/5xx/timeout)
  → Extraer respuesta → Guardar conversación → Responder en Workvivo
  ↳ Ruta de error: log sin secretos + aviso neutral al usuario cuando corresponde
  ↳ Rechazos (401/403/4xx/429/503): log + respuesta con correlationId
```

El ACK se devuelve antes de llamar a Validator y el procesamiento continúa en la misma ejecución.
Esto cubre el caso de separar "recibir" y "procesar" sin mantener un segundo workflow.
Si más adelante el volumen lo exige, el tramo posterior al ACK se puede mover a un sub-workflow.

### Por qué la firma se valida con el nodo JWT y no con un nodo Code

Probé la instancia: en los nodos Code **`$env` está bloqueado y el módulo `crypto` no está permitido**.
Por eso la verificación criptográfica la hace el nodo nativo **JWT → Verify**. Usa `jsonwebtoken` con
`algorithms: [algoritmo de la credencial]`, así que rechaza `alg: none` y cualquier algoritmo distinto.
Antes de ese nodo, "Validar entrada básica" aplica una allowlist de algoritmos.
El ejemplo de referencia de Workvivo obtiene la clave desde un `publicKeyUrl` que viene **dentro** del token.
Aquí eso nunca se usa para obtener claves, porque sería confiar en datos sin verificar. La clave queda fijada en la credencial.

## 1. Workflow importable

- Ya está cargado en tu lienzo. Para otro entorno: *Workflows → Import from file →* `workflow.json`.
- Data Tables creadas en tu proyecto: `wv_validator_idempotencia`, `wv_validator_conversaciones` y `wv_validator_log`.
  En otra instancia, créalas con las mismas columnas y vuelve a seleccionarlas en los nodos Data Table.
- Settings: no guarda ejecuciones exitosas (así evita persistir JWT y contenido). Guarda solo ejecuciones con error y tiene un timeout de 300 s.

## 2. Credenciales y variables a configurar manualmente

### Credenciales de n8n (los secretos van solo aquí)

| Credencial (tipo) | Uso | Contenido |
|---|---|---|
| **Workvivo Bot API** (*Bearer Auth*) | Nodos "Responder en Workvivo" y "Aviso neutral en Workvivo" | `WORKVIVO_BEARER_TOKEN` |
| **ChatGPT Validator** (*Bearer Auth*) | Nodo "Enviar a Validator" | `CHATGPT_ACCESS_TOKEN` (token de *Workspace Agent*, no una API key de Platform) |
| **Workvivo JWT public key** (*JWT Auth*) | Nodo "Validar firma JWT (Workvivo)" | Key Type: *PEM Key*; Public Key: `WORKVIVO_PUBLIC_KEY` (PEM); Algorithm: el que use Workvivo (ver pendientes). Private Key: vacío |

Si Workvivo solo publica un JWKS (`WORKVIVO_JWKS_URL`), convierte la clave (`kid`) a PEM fuera de n8n y pégala en la credencial.
Cuando Workvivo rote la clave, actualiza la credencial.
Mientras tanto, los tokens firmados con la clave nueva se rechazan con 401, así que el sistema falla de forma segura.

### Nodo "Configuración" (sin secretos)

Tu instancia bloquea `$env` en los nodos y la licencia no incluye *Variables*.
Por eso la configuración no secreta vive en el nodo **Configuración** (un Set, justo después del Webhook). Edita ahí los valores.
Para **recibir** de Workvivo son obligatorios `WORKVIVO_API_BASE_URL`, `WORKVIVO_ID` y `DATASTORE_NAMESPACE`. Si falta alguno, la solicitud se rechaza con 503 `CONFIG_INCOMPLETA`.
`CHATGPT_AGENT_API_URL` y `CHATGPT_AGENT_CHANNEL_ID` se comprueban justo antes de llamar a Validator. Si faltan, se registra `CONFIG_VALIDATOR_PENDIENTE` y el usuario recibe el mensaje neutral.
En los rechazos de entrada y de JWT, `wv_validator_log.detail` guarda datos públicos del token (alg, kid, nombres de claims, iss, aud y publicKeyUrl), nunca el token.

| Variable | Ejemplo / nota |
|---|---|
| `WORKVIVO_API_BASE_URL` | Base de la API de tu región, p. ej. `https://api.workvivo.io/v1` (**confirmar**) |
| `WORKVIVO_ID` | ID de tu organización Workvivo (header `Workvivo-Id`) |
| `WORKVIVO_JWKS_URL` | URL oficial del JWKS; si el token trae `publicKeyUrl`, debe coincidir |
| `WORKVIVO_EXPECTED_ISSUER` | Valor exacto de `iss`, o `NO_APLICA` si Workvivo no lo emite (decisión explícita) |
| `WORKVIVO_EXPECTED_AUDIENCE` | Valor exacto de `aud`, o `NO_APLICA` |
| `WORKVIVO_APP_ID` | ID de la app, o `NO_APLICA` |
| `WORKVIVO_APP_ID_CLAIM` | Nombre del claim que contiene el ID de la app |
| `WORKVIVO_TENANT_CLAIM` | Opcional: nombre del claim cuyo valor debe coincidir con `WORKVIVO_ID` |
| `WORKVIVO_JWT_ALGORITHMS` | Allowlist, por defecto `RS256` |
| `JWT_MAX_AGE_SECONDS` | Antigüedad máxima de `iat` (por defecto `300`) |
| `CHATGPT_AGENT_API_URL` | URL **exacta** del trigger del canal API (https) |
| `CHATGPT_AGENT_CHANNEL_ID` | ID del canal API (`agtch_...`), **no** el ID del agente |
| `VALIDATOR_RESPONSE_TEXT_PATH` | Ruta al texto final en la respuesta (p. ej. `a.b.0.c`) |
| `VALIDATOR_RESPONSE_CONVERSATION_PATH` | Ruta al ID de conversación devuelto |
| `VALIDATOR_MAX_RETRIES` | Por defecto `3` |
| `DATASTORE_NAMESPACE` | `prod` / `dev`: separa claves entre entornos |
| `ALLOWED_ATTACHMENT_HOSTS` | Hosts de adjuntos autorizados, separados por comas |
| `MAX_REQUEST_BYTES` | Por defecto `262144` |
| `MAX_ATTACHMENT_BYTES` | Por defecto `10485760` |
| `RATE_LIMIT_PER_MINUTE` | Mensajes por conversación y minuto (por defecto `10`) |

Nunca pongas tokens en este nodo: los secretos van solo en las credenciales.

## 3. Campos que requieren documentación oficial

**Workvivo.** El mapeo actual sale del ejemplo público de un ingeniero de Workvivo/Zoom, no de la referencia oficial. Hay que confirmarlo en `developer.workvivo.com → Chat → Bots`.
- Payload del callback: `category`, `action`, `message.text`, `bot.bot_userid` y `channel.channel_url` vienen del ejemplo.
  **Faltan:** `eventId`, `messageId`, `threadId`, `userId` (remitente), nombre visible, menciones y adjuntos (URL, nombre, MIME y tamaño).
  Se completan en el objeto `MAP` de "Normalizar evento Workvivo".
- Mientras no exista `eventId`/`messageId`, la idempotencia usa el `jti` del JWT si viene. Si no viene, no hay deduplicación posible y queda marcado `dedupeAvailable: false`.
- JWT: algoritmo, `iss`, `aud`, claim de app/tenant, presencia de `exp`/`jti` y la URL oficial del JWKS.
  Cuando falta configuración, `wv_validator_log.detail` registra los **nombres** de los claims y los valores públicos `iss`/`aud`. Úsalos para completar la configuración.
- Endpoint de respuesta: `POST {base}/chat/bots/message` con `{bot_userid, channel_url, type:"message", message}` y el header `Workvivo-Id` (tomado del ejemplo).
- La respuesta esperada al webhook (hoy `200 {received, correlationId}`), el timeout del callback y la política de reintentos de Workvivo.

**Canal API de Validator (ChatGPT Agent Builder).**
- La URL exacta del trigger, el esquema de solicitud (editar el bloque marcado en "Preparar solicitud Validator") y el esquema de respuesta (las dos variables `VALIDATOR_RESPONSE_*`).
- Si la llamada es **asíncrona** (devuelve un run), hay que añadir una consulta de estado o un callback antes de "Extraer respuesta".
- Si admite `Idempotency-Key` (hoy se envía; si no lo admite, lo ignorará), cómo mantiene la continuidad de conversación y si acepta archivos y de qué tipos.
  Hasta confirmarlo, **ningún archivo se descarga ni se envía**. El usuario recibe una nota con los archivos no analizados.

## Origen real de los mensajes: SendBird

Con la *Fallback URL* de Workvivo, los mensajes llegan desde **SendBird** (`user-agent: SendBird`), **sin `x-workvivo-jwt`**.
Vienen firmados en `x-sendbird-signature` con HMAC-SHA256 del cuerpo crudo. El workflow admite los dos orígenes (nodo **Origen**):

- `x-workvivo-jwt` → verificación JWT, como se describe arriba.
- `x-sendbird-signature` → **Validar entrada básica** hace tres cosas:
  - comprueba que `app_id` sea igual a `SENDBIRD_APP_ID` (valor fijo, nunca una expresión);
  - reconstruye el cuerpo crudo: JSON compacto, `/` escapado y no-ASCII como `\uXXXX`, y exige que su tamaño coincida con `content-length`;
  - después, **HMAC SendBird** (nodo Crypto) calcula la firma y **Validar firma SendBird** la compara en tiempo constante. También rechaza eventos con `ts` fuera de la ventana (`JWT_MAX_AGE_SECONDS`).
- El secreto de firma se guarda en la Data Table `wv_validator_secretos`, en una fila con `name = SENDBIRD_SIGNING_SECRET` y `value = <secreto>`.
  Queda fuera del workflow y de sus exports. Mientras no exista, todo se rechaza con 503 `CONFIG_SENDBIRD_SECRET_PENDIENTE`.
- **PENDIENTE:** ese secreto no es el `bot_token` ni el `app_id` (lo comprobé contra una firma real). Lo tiene que proporcionar Workvivo o SendBird.
- Mapeo confirmado con un evento real:
  - `message.message_id` → idempotencia
  - `sender.user_id` y `sender.nickname` → remitente
  - `message.created_at` → fecha de creación
  - `mentioned` → menciones
  - `message.files` → adjuntos (los campos internos se confirman con un evento que traiga archivo)
- `bot.bot_token` viaja en el payload: nunca se usa, reenvía ni registra.

## 4. Payload ficticio de prueba (sin secretos)

```json
{
  "category": "bot_message_notification",
  "bot": { "bot_userid": "bot-prueba-001" },
  "channel": { "channel_url": "canal-prueba-001" },
  "message": { "text": "Revisa este titular: \"Nueva intranet disponible desde el lunes\"" }
}
```

Prepara las pruebas en una instancia o proyecto de **desarrollo** con `DATASTORE_NAMESPACE=dev`:

```bash
node probar-webhook.mjs claves          # par RSA de PRUEBA en ./claves-prueba (ignorado por git)
# Pega claves-prueba/publica.pem en la credencial "Workvivo JWT public key" de DEV (RS256)
export WEBHOOK_URL=https://<n8n-dev>/webhook/workvivo/validator
export TEST_ISS=prueba TEST_AUD=prueba TEST_APP_CLAIM=app_id TEST_APP_ID=app-prueba
# y en el nodo Configuración de DEV: WORKVIVO_EXPECTED_ISSUER=prueba, WORKVIVO_EXPECTED_AUDIENCE=prueba,
#           WORKVIVO_APP_ID_CLAIM=app_id, WORKVIVO_APP_ID=app-prueba
```

Para las pruebas de Validator y Workvivo, apunta `CHATGPT_AGENT_API_URL` y `WORKVIVO_API_BASE_URL` (nodo Configuración de DEV) a un **workflow mock** de n8n (Webhook + Respond to Webhook). Nunca uses los servicios reales.

## 5. Pruebas

| # | Prueba | Cómo | Resultado esperado |
|---|---|---|---|
| 1 | JWT válido | `node probar-webhook.mjs valido` | `200 {received:true}`, llamada al mock de Validator y POST al mock de Workvivo con `bot_userid`, `channel_url` y el texto |
| 2 | JWT inválido | `invalido`, `alg-none`, `expirado`, `sin-jwt` | `401`, fila en `wv_validator_log` (`JWT_FIRMA_INVALIDA`, `JWT_ALG_NO_PERMITIDO`, `JWT_EXPIRADO`, `JWT_AUSENTE`) y ninguna llamada a Validator |
| 3 | Evento duplicado | `duplicado` (mismo token dos veces) | Dos `200`; Validator se llama **una** sola vez |
| 4 | Mensaje vacío | `vacio` | `200`; Validator recibe `input: ""` y `has_reviewable_input: false`; n8n no genera diagnóstico |
| 5 | Timeout de Validator | Mock con Wait de 120 s (el timeout del nodo es 90 s) | 3 reintentos con backoff, log `VALIDATOR_TIMEOUT` y aviso neutral en Workvivo |
| 6 | Error 429 | Mock responde `429` con `Retry-After: 2` | Espera según `Retry-After`; al agotar reintentos, `VALIDATOR_429` y aviso neutral |
| 7 | Error de Workvivo | Mock de Workvivo responde `500` | 3 intentos y log `WORKVIVO_API`; **sin** aviso neutral (fallaría por la misma API) |
| 8 | Prevención de bucle | `bucle` (`action: chat_bot_message_sent`) | `200` ignorado, sin llamar a Validator ni publicar |
| extra | Rate limit | `ratelimit` | `429` a partir del mensaje 11 dentro del mismo minuto |
| extra | Configuración | Borra `WORKVIVO_EXPECTED_ISSUER` | `503 CONFIG_ISSUER_PENDIENTE` (nunca omite la validación en silencio) |

Después de cada prueba revisa que `wv_validator_log` **no** contenga JWT, tokens ni texto de mensajes.

## 6. Registrar la URL de producción en Workvivo

1. Configura las credenciales y variables de producción y completa los pendientes de la sección 3.
2. En n8n, abre el nodo **Workvivo Chatbot Callback** → pestaña **Production URL** y copia:
   `https://n8n.srv836595.hstgr.cloud/webhook/workvivo/validator` (nunca la *Test URL* ni `localhost`).
3. Solo después de aprobar todas las pruebas, activa el workflow (*Publish/Active*).
4. En Workvivo (admin del bot, con los scopes `chats.bots.read`, `chats.bots.write` y `chats.message.write`), pega esa URL como **Bot Callback URL** y guarda.
5. Envía un mensaje real al bot desde una cuenta de prueba y verifica el log. Solo entonces abre el bot a los usuarios.

## 7. Advertencia

**No habilites el bot en Workvivo hasta completar y aprobar las pruebas 1 a 8.**
Tampoco lo habilites sin confirmar `iss`, `aud` y la app con un token real, ni sin restringir el acceso al editor de n8n (usuarios, 2FA y sin exponer ejecuciones).
Mantén `dev` y `prod` separados con `DATASTORE_NAMESPACE` y credenciales distintas.
Revisa que ningún export del workflow incluya secretos (este no los incluye).

## Limitaciones conocidas

- La idempotencia es "buscar y luego registrar". Dos reintentos exactamente simultáneos podrían pasar ambos. Es aceptable a este volumen; si no lo es, usa Redis con `SET NX`.
- El rate limit vive en la memoria estática del workflow: es por instancia, no distribuido.
- `wv_validator_idempotencia` no se purga sola. Conviene borrar periódicamente las filas con `expiresAt` vencido.
