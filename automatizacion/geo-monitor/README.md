# GEO Monitor: Share of Model de BCP

Pregunta lo mismo a ChatGPT, Claude, Gemini, Perplexity y al AI Overview de
Google, y mide si mencionan a BCP, en qué posición, con qué tono y si citan sus
dominios. Es un workflow de n8n con 4 endpoints y una corrida diaria a las
7:00 a.m. (Lima). Guarda los datos en un Google Sheet.

| Archivo | Qué es |
|---|---|
| `geo-monitor.n8n.json` | El workflow que se importa en n8n. **Se genera, no se edita a mano.** |
| `plantilla-geo-monitor.xlsx` | La plantilla del Sheet: pestañas `prompts` (6 prompts de ejemplo) y `resultados`. Los nombres de pestañas y columnas son los que usa el workflow. |
| `src/` | El código de los nodos Code: análisis, dashboard, prompts y config. |
| `build.mjs` | Arma el JSON a partir de `src/`: `node automatizacion/geo-monitor/build.mjs` |
| `test.mjs` | Corre el código real de cada nodo con respuestas de ejemplo: `node automatizacion/geo-monitor/test.mjs` |
| `publicar.mjs` | Sube el JSON al workflow «GEO TRACKER BCP» de n8n por la API y asigna las credenciales BCP: `N8N_API_KEY=… [GEO_SHEET_ID=…] node automatizacion/geo-monitor/publicar.mjs` |

## Configuración (unos 15 min)

1. Sube `plantilla-geo-monitor.xlsx` a Drive y ábrela como Google Sheet
   (*Archivo → Guardar como Hoja de cálculo de Google*). Copia el ID de la URL,
   lo que va entre `/d/` y `/edit`.
2. En n8n, *Workflows → Import from file* y elige `geo-monitor.n8n.json`.
   Reemplaza `PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET` en los 5 nodos de Google
   Sheets (Leer Resultados, Leer Prompts, Guardar prompt, Leer Prompts corrida,
   Guardar resultados) y asígnales tu credencial de Google Sheets OAuth2.
3. Crea estas credenciales y asígnalas en los nodos HTTP:

| Nodo | Tipo de credencial | Nombre | Valor |
|---|---|---|---|
| ChatGPT | Header Auth | `Authorization` | `Bearer sk-...` |
| Claude | Header Auth | `x-api-key` | tu key de Anthropic |
| Gemini | Header Auth | `x-goog-api-key` | tu key de Google AI Studio |
| Perplexity | Header Auth | `Authorization` | `Bearer pplx-...` |
| AI Overview (búsqueda) y AI Overview (página) | Query Auth | `api_key` | tu key de SerpAPI |

4. En el nodo **Config** puedes cambiar la marca, sus alias, los dominios
   propios, los competidores y los modelos. Vienen cargados Interbank, BBVA,
   Scotiabank, BanBif, Pichincha y Banco de la Nación.
5. Activa el workflow. Las URLs quedan en
   `https://n8n.srv836595.hstgr.cloud/webhook/geo-dashboard` y equivalentes.

Para comprobarlo antes del primer día: `POST /webhook/geo-run` con `{}`,
espera unos minutos y abre `GET /webhook/geo-dashboard`.

## Publicado en n8n

El workflow ya está subido a
[GEO TRACKER BCP](https://n8n.srv836595.hstgr.cloud/workflow/dS2FTRZuU8eNPTL5),
inactivo. `publicar.mjs` asignó estas credenciales que ya existían en la
instancia: **BCP Google Sheet** (los 5 nodos de Sheets), **LLM BCP** (Claude),
**GEMINI BCP** (Gemini) y **SerpAPI account** (los 2 nodos de AI Overview).
Esos nodos usan la credencial predefinida de cada servicio en lugar de Header
Auth o Query Auth.

El Sheet es
[BCP GEO Monitor](https://docs.google.com/spreadsheets/d/12JvqnIyNiUbS9o4HlrJrcSKGi9gNyL57ahepsZE8XY0/edit),
en el Drive de flum2.carlos.ramirez@gmail.com, y su ID ya está en los 5 nodos.
En `resultados`, `estado` vale `ok`, `sin_overview` (Google no mostró un AI
Overview) o `error`.

Falta:
1. Reconectar la credencial **BCP Google Sheet**: n8n la rechaza con «needs to
   be reconnected». La cuenta con la que se reconecte tiene que poder editar el
   Sheet. Si no es flum2.carlos.ramirez@gmail.com, compártelo con esa cuenta.
2. Las credenciales de **ChatGPT** y **Perplexity**. Para BCP no hay ninguna,
   así que se crean como Header Auth, según la tabla de abajo.
3. Activar el workflow.

Al volver a correr `publicar.mjs` se conservan el ID del Sheet y las
credenciales asignadas a mano.

## Cómo está montado

Los cinco disparadores entran en un solo nodo **Config**, que mira cuál se
ejecutó y deja la ruta en `ruta`. El nodo **Ruta** (Switch) manda cada
ejecución a su rama. Así la configuración vive en un único sitio.

En la corrida, **Elegir prompts** deja un item por prompt y lo manda a los
cinco motores. Cada respuesta pasa por su nodo **Resultado …**, que extrae el
texto y las fuentes y analiza la respuesta. Después se agrega una fila a
Resultados. Los nodos HTTP siguen aunque fallen (`continueRegularOutput`, con
un reintento). Si a un motor se le acaba el saldo, su fila queda con `error` y
el dashboard la descarta. Así un fallo no se cuenta como «no nos menciona».

SerpAPI a veces no trae el AI Overview en la primera búsqueda y devuelve un
`page_token`. En ese caso **¿Pide segunda llamada?** hace la consulta a
`google_ai_overview`.

## Supuestos (todos se pueden cambiar)

- **Modelos:** gpt-4o-search-preview (con búsqueda web, ubicación Lima),
  claude-sonnet-4-5, gemini-2.5-flash (con Google Search) y sonar (ubicación
  PE). Están en `modelos` del nodo Config: si alguno da error de modelo,
  cámbialo ahí.
- **Claude** responde sin búsqueda web.
- **Sentimiento:** cuenta palabras positivas y negativas de un diccionario
  dentro de una ventana de 12 palabras alrededor de cada mención de BCP.
  Invierte el signo si hay un negador justo antes («sin comisiones» suma, «no es
  seguro» resta). Va de -1 a 1. No usa una IA, así que no cuesta nada. Es
  aproximado: si una frase compara a BCP con otro banco, las palabras sobre el
  otro banco también cuentan.
- **Posición:** el orden en que aparece BCP entre las marcas mencionadas
  (1 = la primera).
- **Share of Model:** el % de respuestas válidas que mencionan a BCP. En AI
  Overview, una búsqueda sin overview cuenta como respuesta sin mención. Aparte
  se informa `presencia_ai_overview`.
- **Variación (`var_share_of_model`):** puntos porcentuales del último día con
  datos frente al día con datos anterior.
- **«Eliminar» un prompt** solo lo desactiva (`activo = FALSE`), para no perder
  su historial. Un `prompt_id` pedido a mano en `/geo-run` corre aunque esté
  inactivo.

## Costo y seguridad

Cada prompt hace 5 consultas por corrida, una por motor (la de AI Overview es
una búsqueda en SerpAPI), y a veces una segunda para AI Overview. Con 6
prompts al día son unas 30 consultas diarias.

Los webhooks quedan abiertos, sin autenticación, y con CORS `*`. Eso está bien
para un prototipo desechable. Si va a salir del equipo, conviene ponerles
Header Auth en cada nodo Webhook y mandar esa cabecera desde el front.

## Lo que está probado y lo que no

`test.mjs` corre el código real de los nodos Code del JSON generado. Usa un
`$` simulado y respuestas con la forma de cada API, y cubre rutas, prompts,
análisis por motor, fallos y dashboard con filtros. No probé importarlo en n8n
ni hacer llamadas reales a las APIs.

## Bloque para el front

```
MÓDULO PROMPTS + CONEXIÓN AL BACKEND (n8n)

1. Configuración
- Constante API_BASE = "https://n8n.srv836595.hstgr.cloud/webhook" en un solo archivo de config.
- Todas las vistas leen datos reales de estos endpoints (quitar datos mock).
- Estados obligatorios: cargando (skeleton), error (mensaje + botón Reintentar) y vacío.

2. Endpoints
GET  {API_BASE}/geo-dashboard?proyecto=&motor=&desde=&hasta=&prompt_id=
GET  {API_BASE}/geo-prompts
POST {API_BASE}/geo-prompts-save   body: {id?, proyecto, prompt, categoria, activo}  | eliminar: {id, accion:"eliminar"}
                                   → {ok:true, accion, prompt} | 400 {ok:false, error}
POST {API_BASE}/geo-run            body: {prompt_ids?: [], proyecto?}  → responde al instante; la corrida tarda varios minutos
Fechas desde/hasta en formato AAAA-MM-DD.

3. Motores (keys fijas)
chatgpt=ChatGPT, claude=Claude, gemini=Gemini, perplexity=Perplexity, ai_overview=AI Overview.
Usar el array "motores" que devuelve el dashboard ({key, label, color}) para leyendas, colores y filtros.

4. Respuesta de /geo-dashboard (JSON)
{
 vacio: boolean,
 kpis: {share_of_model, var_share_of_model, menciones, total_respuestas, citaciones, tasa_citacion,
        sentimiento_promedio (-1 a 1), posicion_promedio, presencia_ai_overview, ultima_corrida},
 por_motor: [{motor, label, share_of_model, var_share_of_model, menciones, total_respuestas, citaciones, sentimiento_promedio, posicion_promedio}],
 tendencia: [{fecha, chatgpt, claude, gemini, perplexity, ai_overview, total}],   // gráfico de líneas
 competidores: [{ranking, marca, menciones, share_of_model, es_bcp}],            // resaltar BCP
 fuentes: [{dominio, citas, es_bcp}],
 proyectos: [{proyecto, prompts, share_of_model, var_share_of_model, menciones}],
 prompts: [{prompt_id, prompt, proyecto, share_of_model, ultima_fecha,
            motores: {chatgpt: {menciona, posicion, sentimiento, citado, marcas, fecha, disponible} | null, ...}}],
 respuestas: [{fecha, motor, prompt, menciona, posicion, sentimiento, marcas, fuentes, respuesta, error}]  // solo si se envía proyecto o prompt_id
}
- Los porcentajes vienen de 0 a 100 con un decimal. Los valores sin dato vienen como null.
- Dashboard General: llamar sin filtros.
- Detalle de proyecto: llamar con ?proyecto=NOMBRE; mostrar la matriz prompt × motor (✓/✗ + posición) y la lista de respuestas (expandible).
- Sentimiento: >0.2 positivo (verde), <-0.2 negativo (rojo), resto neutral. Variaciones en puntos porcentuales (pp).
- Si vacio=true: estado vacío "Aún no hay corridas" con botón que lleve a Prompts.
- Si vacio=false pero total_respuestas=0: "Sin resultados para estos filtros".

5. Nuevo módulo "Prompts / Consultas" (menú)
- Tabla: prompt, proyecto, categoría, estado activo (switch), fecha de creación, acciones (editar, eliminar).
- Filtros por proyecto y búsqueda por texto. Contador total / activos (de /geo-prompts: {prompts, proyectos, categorias, total, activos}).
- Botón "Nuevo prompt": modal con textarea del prompt, proyecto (combo con /geo-prompts.proyectos + opción "crear nuevo"), categoría (Reputación, Producto, Digital, Otra).
- Guardar / editar / switch de activo → POST /geo-prompts-save y recargar la lista. El switch puede mandar solo {id, activo}.
- Eliminar → confirmación → POST {id, accion:"eliminar"}.
- Selección múltiple con checkbox + botón "Ejecutar seleccionados" → POST /geo-run {prompt_ids}.
- Botón principal "Ejecutar todos" → POST /geo-run {}.
- Tras ejecutar: toast "Corrida iniciada; los resultados aparecerán en unos minutos" y botón "Actualizar dashboard".
- Aviso fijo: "Corrida automática diaria 7:00 a.m. (Lima)".
- Los "Proyectos" no se crean aparte: salen del campo proyecto de cada prompt.
```
