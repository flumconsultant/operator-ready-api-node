# GEO Monitor: Share of Model de BCP

Le hace las mismas preguntas a ChatGPT, Claude, Gemini, Perplexity y al AI
Overview de Google. Mide si mencionan a BCP, en qué posición, con qué tono y si
citan sus dominios. Son dos workflows de n8n, un Google Sheet y el front
«BCP · Monitor de Visibilidad en IA» (`front/`), que ya lee los datos en vivo.

## El recorrido

**[GEO TRACKER BCP · Corrida](https://n8n.srv836595.hstgr.cloud/workflow/dS2FTRZuU8eNPTL5)**:

```
Cada día 7:00 ─┐                    ┌→ ChatGPT ─────────────────────────┐
Webhook geo-run┴→ Leer prompts      ├→ Claude ──────────────────────────┤
                  → Elegir prompts ─┼→ Gemini ──────────────────────────┼→ Esperar a los 5 motores (Merge)
                                    ├→ Perplexity ──────────────────────┤   → Juntar respuestas
                                    └→ Google (SerpAPI) → AI Overview ──┘   → Analista IA (+ Claude · analista)
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
  hace falta, el nodo consulta `locations.json` de SerpAPI, que no gasta
  búsquedas y no devuelve datos de la cuenta.
- **SerpAPI (AI Overview) está apagado** desde el 20/10. Lo controla
  `SERPAPI_ACTIVO` en `build.mjs`: apagado, los nodos de Google no existen, el
  Merge espera 4 ramas y no se escriben filas de `ai_overview`. Para
  encenderlo, ponerlo en `true` y correr `build.mjs` y `publicar.mjs`.
- **Juntar respuestas** saca de cada API el texto y los dominios citados, y deja
  un item por prompt y motor encendido.
- **Analista IA** es un Information Extractor con Claude Haiku 5.5 (credencial
  LLM BCP). Lee cada respuesta y devuelve `menciona_bcp`, `posicion_bcp`,
  `sentimiento` (-1 a 1), `marcas_mencionadas` y dos conteos para el SOV:
  `n_menciones_bcp` y `n_menciones_bancos`.
- **Share of Voice** (`src/sov.js`), como lo define la Estrategia SEO/GEO: el
  Analista desglosa cada banco (`detalle_marcas`: posición, menciones,
  sentimiento) y cada uno recibe un score = (1/posición + menciones ÷
  menciones totales) / 2 × contexto (positivo 1, neutral 0,75, negativo
  0,25). El SoV de BCP (`sov_bcp`) es su score ÷ la suma de todos × 100. El
  front lo recibe en `sov`/`som` y el de cada banco en `sovByBrand`.
- **Claude busca en la web** (`web_search_20260209`, hasta 3 búsquedas) con la
  zona horaria de Lima y una línea de sistema «El usuario está en Lima, Perú».
  La herramienta rechaza `country: "PE"`. Las fuentes son las URLs citadas o,
  si no citó, las consultadas. Claude decide cuándo buscar: en Marca buscó en
  10 de 27 prompts.
- **Armar fila** agrega `citado_bcp`, que sale de los dominios y no necesita IA,
  pasa los bancos a sus nombres canónicos («Banco Pichincha» → «Pichincha») y
  escribe la fila con las columnas de la hoja `resultados`.
- Si un motor o el Analista fallan (saldo, modelo, límite), la fila queda con
  `estado = error` y la corrida sigue. El dashboard y el front no cuentan esas
  filas.

**[GEO TRACKER BCP · API](https://n8n.srv836595.hstgr.cloud/workflow/AxHUZMTaaBAsnO3l)**
tiene un endpoint por fila:

- `geo-monitor-data`: **el que usa el front.** Devuelve las hojas con la forma
  `DATA.monitor` y `DATA.prompts`, con una observación por proyecto, motor,
  prompt y día. El SOV de cada respuesta es `n_menciones_bcp ÷
  n_menciones_bancos × 100`.
- `geo-dashboard`: los KPIs ya calculados. Sirve para otro front o para
  consultarlos a mano.
- `geo-prompts` y `geo-prompts-save`: listar, crear, editar, activar o
  desactivar y **eliminar** prompts (eliminar borra la fila del Sheet; sus
  mediciones anteriores se conservan). La pantalla del front se pide con
  `front/INSTRUCCIONES-CHATGPT.md`.

## Archivos

| Archivo | Qué es |
|---|---|
| `geo-corrida.n8n.json`, `geo-api.n8n.json` | Los workflows. **Se generan, no se editan a mano.** |
| `plantilla-geo-monitor.xlsx` | La plantilla del Sheet: una pestaña por proyecto con los 150 prompts y `_Léeme`. |
| `front/` | El front «BCP · Monitor de Visibilidad en IA», con `dist/loader.js`, que lee `geo-monitor-data`. Ver `front/README.md`. |
| `src/` | El código de los nodos Code: `analisis.js` (respuestas → filas), `monitor.js` (filas → datos del front), `dashboard.js`, `prompts.js`, `config.js` (marca y competidores). |
| `build.mjs` | Arma los JSON a partir de `src/`: `node automatizacion/geo-monitor/build.mjs` |
| `test.mjs` | Corre el código real de los nodos con respuestas de ejemplo: `node automatizacion/geo-monitor/test.mjs` |
| `publicar.mjs` | Sube los dos workflows a n8n con el Sheet y las credenciales: `N8N_API_KEY=… node automatizacion/geo-monitor/publicar.mjs` |

## El Google Sheet

Organizado como el Excel del universo de prompts de BCP:

- **Una pestaña por proyecto** (Marca, Ahorros, Depósito a Plazo Fijo, Fondos
  Mutuos, Loans, Seguro Vehicular, Seguro de Salud, Cards) con `id · Categoría ·
  Intención de Búsqueda · Prompt · Activo · Fecha de creación`. Crear un
  proyecto desde el front crea su pestaña.
- **Una pestaña por día de medición** (`2026-10-20`, `2026-10-21`…), con una
  fila por prompt y motor. La crea la primera corrida del día, justo después de
  las pestañas de proyecto.
- Las pestañas que empiezan con `_` (`_respaldo prompts`, `_Léeme`) se ignoran.

Todo se lee y escribe con la API de Google Sheets (`src/hoja.js`): nodos HTTP con
la credencial de Sheets que leen varias pestañas en una sola llamada
(`batchGetByDataFilter`) y ejecutan, en orden, las peticiones que arma el
código (crear pestaña, agregar, actualizar o borrar una fila).

## Estado en n8n (20/10)

- **Los dos workflows están activos.** La Corrida se ejecuta todos los días a
  las 7:00 a.m. (Lima) con los prompts activos del Sheet.
- **Sheet:** [BCP GEO Monitor](https://docs.google.com/spreadsheets/d/12JvqnIyNiUbS9o4HlrJrcSKGi9gNyL57ahepsZE8XY0/edit),
  con la credencial **Google Sheets account**.
- **Corrida real probada con `p001`:** Claude, Google (SerpAPI) y AI Overview
  responden. El Analista y el guardado en el Sheet funcionan, y el front
  muestra los datos.
- **Motores que todavía devuelven `error`:**
  - **ChatGPT y Perplexity:** falta crear sus credenciales (Header Auth,
    `Authorization: Bearer …`) y asignarlas en sus nodos.
  - **Gemini:** la credencial **GEMINI BCP** no tiene saldo («prepayment credits
    are depleted»). Hay que recargarla en AI Studio o asignar otra credencial
    al nodo Gemini.

## Cambiar algo

- **Modelos de los motores:** en el body de cada nodo HTTP. Desde el 20/10, los
  más baratos: `gpt-4o-mini-search-preview` (búsqueda `low`),
  `claude-sonnet-5-5` (esfuerzo `low`), `gemini-2.5-flash-lite` y `sonar`
  (búsqueda `low`).
- **Modelo del analista:** en el nodo **Claude · analista**.
- **Marca, alias, dominios propios y competidores:** en `src/config.js`. Después
  se corren `build.mjs` y `publicar.mjs`. Si se cambian a mano en n8n, hay que
  tocar «Armar fila», «Dashboard» y las descripciones del Analista IA.

## Supuestos

- **Claude** responde sin búsqueda web. ChatGPT y Perplexity usan ubicación
  Perú, y Gemini usa Google Search.
- **Share of Model en el front:** el promedio del SOV de cada respuesta válida
  (`n_menciones_bcp ÷ n_menciones_bancos × 100`).
- **Share of Model en `geo-dashboard`:** el % de respuestas válidas que
  mencionan a BCP. En AI Overview, una búsqueda sin overview cuenta como
  respuesta sin mención. Aparte se informa `presencia_ai_overview`.
- **Variación:** puntos porcentuales del último día con datos frente al día con
  datos anterior.
- **«Eliminar» un prompt** borra su fila del Sheet; para pausarlo sin
  borrarlo, se desactiva. Un `prompt_id` pedido a mano en `/geo-run` corre
  aunque esté inactivo.
- **Costo:** por prompt son 4 llamadas a modelos y hasta 5 análisis con Claude
  Haiku 5.5 (más 1 o 2 búsquedas en SerpAPI si se enciende). Con 150 prompts,
  cada medición ronda los US$ 5–10 con los modelos baratos.
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
