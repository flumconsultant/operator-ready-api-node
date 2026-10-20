# GEO Monitor: Share of Model de BCP

Le hace las mismas preguntas a ChatGPT, Claude, Gemini, Perplexity y al AI
Overview de Google. Mide si mencionan a BCP, en qué posición, con qué tono y si
citan sus dominios. Son dos workflows de n8n y un Google Sheet.

## El recorrido

**[GEO TRACKER BCP · Corrida](https://n8n.srv836595.hstgr.cloud/workflow/dS2FTRZuU8eNPTL5)**:

```
Cada día 7:00 ─┐                    ┌→ ChatGPT ─────────────────────────┐
Webhook geo-run┴→ Leer prompts      ├→ Claude ──────────────────────────┤
                  → Elegir prompts ─┼→ Gemini ──────────────────────────┼→ Esperar a los 5 motores (Merge)
                                    ├→ Perplexity ──────────────────────┤   → Juntar respuestas
                                    └→ Google (SerpAPI) → AI Overview ──┘   → Analista IA (+ Gemini · analista)
                                                                            → Armar fila → Guardar resultados
```

- **Los motores** van en paralelo, un nodo HTTP cada uno, con su credencial y
  el modelo en el body. Cada uno recibe solo el prompt, tal cual; ninguno
  recibe la respuesta de otro, así que no se gastan tokens de más. n8n
  ejecuta las ramas una tras otra, aunque en el lienzo estén en paralelo, y
  el Merge espera a que terminen las 5. No hay un Agent porque reescribiría
  la pregunta, resumiría las respuestas y perdería las fuentes citadas.
- **POST y GET:** las APIs de los modelos piden POST, con el mensaje en el
  cuerpo. La de SerpAPI es una búsqueda por GET, con la consulta en la URL.
- **AI Overview** a veces necesita una segunda llamada (`page_token`). Si no
  hace falta, el nodo consulta `account.json` de SerpAPI, que no gasta
  búsquedas.
- **Juntar respuestas** saca de cada API el texto y los dominios citados, y deja
  5 items por prompt, uno por motor.
- **Analista IA** es un Information Extractor con Gemini 2.5 Flash. Lee cada
  respuesta y devuelve `menciona_bcp`, `posicion_bcp`, `sentimiento` (-1 a 1)
  y `marcas_mencionadas`.
- **Armar fila** agrega `citado_bcp`, que sale de los dominios y no necesita IA,
  y escribe la fila con las columnas de la hoja `resultados`.
- Si un motor falla (saldo, modelo, límite), su fila queda con
  `estado = error` y la corrida sigue. El dashboard no cuenta esas filas.

**[GEO TRACKER BCP · API](https://n8n.srv836595.hstgr.cloud/workflow/AxHUZMTaaBAsnO3l)**
tiene los tres endpoints que usa el front, cada uno en su fila:
`geo-dashboard`, `geo-prompts` y `geo-prompts-save`.

## Archivos

| Archivo | Qué es |
|---|---|
| `geo-corrida.n8n.json`, `geo-api.n8n.json` | Los workflows. **Se generan, no se editan a mano.** |
| `plantilla-geo-monitor.xlsx` | La plantilla del Sheet: pestañas `prompts` y `resultados`. |
| `src/` | El código de los nodos Code: `analisis.js` (respuestas → filas), `dashboard.js`, `prompts.js`, `config.js` (marca y competidores). |
| `build.mjs` | Arma los JSON a partir de `src/`: `node automatizacion/geo-monitor/build.mjs` |
| `test.mjs` | Corre el código real de los nodos con respuestas de ejemplo: `node automatizacion/geo-monitor/test.mjs` |
| `publicar.mjs` | Sube los dos workflows a n8n con el Sheet y las credenciales: `N8N_API_KEY=… node automatizacion/geo-monitor/publicar.mjs` |

## Estado en n8n

- **Sheet:** [BCP GEO Monitor](https://docs.google.com/spreadsheets/d/12JvqnIyNiUbS9o4HlrJrcSKGi9gNyL57ahepsZE8XY0/edit),
  con la credencial **Google Sheets account**.
- **Credenciales asignadas:** **LLM BCP** (Claude), **GEMINI BCP** (Gemini y
  Gemini · analista) y **SerpAPI account** (los 2 nodos de Google).
- **Probado el 20/10:** `geo-prompts` devuelve los 6 prompts del Sheet,
  `geo-dashboard` responde `vacio: true` y `geo-prompts-save` rechaza un prompt
  vacío con 400. Todavía no se ha hecho ninguna corrida.
- **Falta:**
  1. Crear las credenciales de **ChatGPT** y **Perplexity** (Header Auth,
     `Authorization: Bearer …`) y asignarlas en sus nodos.
  2. Hacer una corrida de prueba.
  3. Activar los dos workflows.

## Cambiar algo

- **Modelos de los motores:** en el body de cada nodo HTTP. Son
  `gpt-4o-search-preview`, `claude-sonnet-4-5`, `gemini-2.5-flash` y `sonar`.
- **Modelo del analista:** en el nodo **Gemini · analista**.
- **Marca, alias, dominios propios y competidores:** en `src/config.js`. Después
  se corren `build.mjs` y `publicar.mjs`. Si se cambian a mano en n8n, hay que
  tocar «Armar fila», «Dashboard» y las descripciones del Analista IA.

## Supuestos

- **Claude** responde sin búsqueda web. ChatGPT y Perplexity usan ubicación
  Perú, y Gemini usa Google Search.
- **Share of Model:** el % de respuestas válidas que mencionan a BCP. En AI
  Overview, una búsqueda sin overview cuenta como respuesta sin mención. Aparte
  se informa `presencia_ai_overview`.
- **Variación:** puntos porcentuales del último día con datos frente al día con
  datos anterior.
- **«Eliminar» un prompt** solo lo desactiva. Un `prompt_id` pedido a mano en
  `/geo-run` corre aunque esté inactivo.
- **Costo:** por prompt son 4 llamadas a modelos, 1 o 2 búsquedas en SerpAPI y
  5 análisis con Gemini Flash. Con 6 prompts al día son unas 30 consultas
  pagadas más 30 análisis baratos.
- **Seguridad:** los webhooks quedan abiertos, sin autenticación y con CORS `*`.
  Está bien para un prototipo. Si va a salir del equipo, conviene ponerles
  Header Auth.

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
                                   → {ok:true, prompt} | 400 {ok:false, error}
POST {API_BASE}/geo-run            body: {prompt_ids?: [], proyecto?}  → responde al instante {"message":"Workflow was started"}; la corrida tarda varios minutos
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
