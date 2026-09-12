# Observatorio de reputación — BCP

Monitoreo diario de menciones de BCP (redes sociales, prensa, reseñas) y de
qué responden los asistentes de IA sobre BCP (GEO), clasificado por un agente
de IA (no una lista de palabras clave), con log en el MySQL de Hostinger,
alertas inmediatas por correo cuando algo es grave y un reporte diario
redactado en prosa.

## Arquitectura

```
Google Sheets (config)              n8n — "PoC Solución de Monitoreo"
  · Config (marca, keywords,   →     1. Trigger diario (cron)
    competidores, categorías,        2. Lee Config, Búsquedas Apify y GEO Prompts
    palabras críticas)               3. Rama social/prensa: por cada fila
  · Búsquedas Apify (una fila            activa de "Búsquedas Apify", corre
    por búsqueda a correr)               el actor de Apify con esa query
  · GEO Prompts (prompt, motor)     4. Rama GEO: por cada prompt activo,
                                        llama a ChatGPT / Gemini / Claude
                                     5a. Agente de Menciones (Apify): lee
                                        cada reclamo/reseña/prensa real en
                                        su contexto y decide sentimiento,
                                        categoría y alerta urgente
                                     5b. Agente GEO (aparte, con su propio
                                        criterio): evalúa presencia, postura
                                        frente a competidores y precisión de
                                        cada respuesta de IA, comparando con
                                        la corrida anterior del mismo prompt
                                     6. Guarda el lote combinado en:
                                        · monitoreo.php → tabla MySQL (log)
                                        · Google Sheet "Log Dashboard"
                                          (para el tablero en Looker Studio)
                                     7. Guardarraíl determinista: si algún
                                        agente ya marcó algo crítico, o el
                                        texto trae una palabra crítica de la
                                        hoja Config, fuerza la alerta sin
                                        depender del criterio del modelo
                                     8. Agente de Triage y Reporte: compara
                                        hoy contra la tendencia de 7 días,
                                        decide gravedad y redacta en prosa
                                        el correo de resumen diario (y el de
                                        alerta urgente, si aplica)
```

### Por qué son agentes separados y no uno genérico

La primera versión tenía un único "Agente Clasificador" atendiendo tanto
menciones reales como respuestas de GEO con el mismo criterio. Son dos
trabajos distintos: una reseña real se evalúa por sentimiento y contexto; una
respuesta de un asistente de IA se evalúa por si menciona la marca, con qué
postura frente a la competencia y si dice algo incorrecto — eso no es
"sentimiento". Separarlos en dos agentes con su propio `systemMessage` deja
afinar cada criterio sin arriesgar el otro, y cada uno trae solo las
herramientas que le sirven. Son cuatro piezas en total, todas nodos nativos
de **Agente de IA** de n8n (LangChain: modelo + salida estructurada +
herramientas), no llamados HTTP sueltos:

- **Agente de Menciones (Apify)** — reclamos, reseñas y prensa reales. Puede
  *usar una herramienta* para consultar el historial de 7 días (¿esto es una
  racha nueva o algo ya conocido?), y siempre explica su razonamiento en un
  campo `razonamiento` auditable.
- **Agente GEO** — nada de palabras clave ni sentimiento clásico: evalúa
  presencia (¿aparece la marca?), postura relativa frente a otros bancos,
  qué competidores nombra, y si el asistente afirmó algo posiblemente
  incorrecto. Puede *usar una herramienta* para comparar con la última
  corrida guardada del mismo prompt+motor y notar si la respuesta cambió
  (deriva) — esto es GEO, no sentiment analysis genérico.
- **Agente de Triage y Reporte** — no compara contra un múltiplo fijo: lee
  el resumen de hoy y el de 7 días, juzga si hay una racha real, y **redacta**
  el correo de resumen diario en prosa, no con una plantilla HTML armada a
  mano.
- **Guardarraíl determinista** — la única regla fija que queda a propósito:
  si cualquiera de los dos clasificadores ya marcó algo crítico, o el texto
  trae una palabra crítica de la hoja Config, la alerta se dispara sí o sí.
  Es la red de seguridad para que un desacierto puntual de un modelo nunca
  silencie un fraude real. Los agentes deciden la *gravedad* y la
  *redacción*, nunca si avisar o no — eso lo protege el guardarraíl.

Esta combinación (agentes con criterio propio + guardarraíl determinista de
mínimos) es la práctica recomendada para alertas de reputación/seguridad: un
agente solo puede fallar por un mal juicio puntual, y una regla fija sola es
ciega al contexto. Juntos, ninguno de los dos es el único punto de falla.

## Dónde se edita cada cosa

| Qué | Dónde | Quién lo toca |
|---|---|---|
| Marca, alias, competidores, categorías, palabras críticas | [BCP Monitoreo — Config](https://docs.google.com/spreadsheets/d/16ZDs6OX_WF7y0U5vp9tVWKSEp2bIIvvN3Ugxx42YEPA/edit) | Tú, cuando quieras — n8n la relee en cada corrida |
| Prompts de GEO y en qué motor correr cada uno | [BCP Monitoreo — GEO Prompts](https://docs.google.com/spreadsheets/d/1Y0ggnirBN1YwUISWrqA1FhOMGFjAoyBa3xJbSE0Wzro/edit) | Tú — pon `activo=si` en los que quieras correr |
| Qué buscar con Apify (prensa, social, lo que sea) | [BCP Monitoreo — Búsquedas Apify](https://docs.google.com/spreadsheets/d/1Mk2qwKEVSe3wGjYfQH22hfM8rHSCd3ENTa-ieZXkho0/edit) | Tú — una fila por búsqueda, `{marca}` se reemplaza solo |
| Datos para el tablero (Looker Studio / Sheets) | [BCP Monitoreo — Log Dashboard](https://docs.google.com/spreadsheets/d/1MWEkDJY9_gRQqLITFWxIM_IBs5N6gJfVFQZ4G1k9sFU/edit) | Nadie a mano — la escribe n8n en cada corrida |
| El workflow en sí (nodos, credenciales, horario) | [n8n — PoC Solución de Monitoreo](https://n8n.srv836595.hstgr.cloud/workflow/wDgtcn0SkJFnqRNM) | Tú, para poner credenciales y activarlo |
| El log completo, histórico | Tabla `monitoreo_menciones` en el MySQL de Hostinger | Nadie a mano — la escribe `assets/api/monitoreo.php` |

## ¿Apify me scrapea todo solo?

No. Apify no "sabe" qué es BCP ni sale a buscar por su cuenta — solo corre
**las búsquedas que tú pusiste** en la hoja "Búsquedas Apify", una corrida
por fila activa. Y en esta primera versión, esas búsquedas usan el actor
`apify/google-search-scraper`: es una búsqueda de Google, no una lectura
directa de X/Twitter, Instagram o Facebook. La fila "social" que viene
precargada funciona buscando `site:twitter.com OR site:x.com OR ...` dentro
de Google — te trae lo que Google haya indexado de esos sitios, que es
bastante para arrancar barato y sin cuentas de redes sociales, pero no es lo
mismo que un scraper nativo de cada red (que ve posts, comentarios y
engagement reales, y normalmente cuesta más y pide más configuración).

Para ampliar cobertura más adelante: añade una fila nueva a la hoja con
`fuente`/`plataforma`/`query` distintos (por ejemplo, reseñas de Google Maps,
o una comparación contra un competidor — ya hay un ejemplo desactivado en la
hoja), o cambia el actor por uno dedicado a una red social específica.

## Por qué el log vive en dos sitios (MySQL y una hoja)

Pediste que el log viviera en el MySQL que ya usa el sitio, y también un
tablero. Looker Studio conecta nativamente y gratis a Google Sheets; conectar
Looker a un MySQL de hosting compartido normalmente exige activar «Remote
MySQL» en Hostinger y un conector de pago. Para no depender de eso, n8n
escribe cada fila clasificada en los dos sitios: MySQL es el registro
definitivo (el mismo criterio que ya usa `conectores/base-de-datos`), y la
hoja "Log Dashboard" es solo el espejo que alimenta el tablero. Si más
adelante activas Remote MySQL, el tablero puede apuntar directo a la tabla y
se deja de escribir la hoja.

## Alertas urgentes

Un lote dispara correo inmediato (aparte del resumen diario) si:

- el **guardarraíl determinista** encuentra algo que el clasificador ya
  marcó como `negativo_critico`/`alerta_urgente`, o que trae una **palabra
  crítica** de la hoja de Config (esto siempre gana, pase lo que pase), o
- el **Agente de Triage y Reporte** juzga, comparando contra la tendencia de
  7 días, que la situación amerita avisar aunque nada haya saltado el
  guardarraíl (por ejemplo, una racha sostenida de quejas del mismo tipo).

La gravedad (`baja`/`media`/`alta`/`critica`) y el texto del correo los
decide y redacta el agente en cada corrida — no hay una plantilla fija.

## Qué falta para que esto corra de verdad

El workflow y el endpoint ya están armados; lo que sigue es dar de alta las
credenciales, porque son cuentas de terceros que no puedo crear por ti:

1. **Apify**: crear cuenta en apify.com, tomar el API token, ponerlo como
   credencial en el nodo HTTP de cada fuente (X/Twitter, prensa, reseñas) en
   n8n. Actores sugeridos están anotados como sticky notes en el workflow.
2. **OpenAI y Gemini**: API key de cada uno, para los nodos GEO de ChatGPT y
   Gemini.
3. **Anthropic, dos veces**: la misma API key, pero como **dos credenciales
   distintas** en n8n — una "HTTP Header Auth" (la usa el nodo HTTP de
   GEO-Claude) y una credencial **nativa "Anthropic Account"** (la usan los
   tres nodos "Modelo Claude (...)" — Menciones, GEO y Triage —, que son
   nodos de Agente de IA, no HTTP Request, y n8n les exige su propio tipo de
   credencial).
4. **Secreto `MONITOREO_TOKEN`** en GitHub (Settings → Secrets and variables
   → Actions): cualquier cadena aleatoria larga. El próximo despliegue a
   `main` la deja activa en `assets/api/monitoreo.php`. El mismo valor va en
   la credencial HTTP Header Auth del nodo que llama a `monitoreo.php` en
   n8n.
5. **Revisar los 3 nodos "Formato de salida"** (Structured Output Parser) de
   los agentes: llevan puesto el JSON Schema que esperan, pero si al abrir el
   nodo en n8n lo ves vacío, pégalo tú — está en
   `monitoreo-bcp/schemas-agentes.md` de este mismo repo.
6. **Activar el workflow** en n8n una vez estén las credenciales.
7. **Conectar Looker Studio** al tablero — ver la sección de abajo.

## Conectar Looker Studio (el tablero)

Esto no lo puedo automatizar por ti: Looker Studio no tiene una API pública
para crear reportes desde fuera, es un par de clics dentro de su propia
interfaz, con tu cuenta de Google. Con la hoja **Log Dashboard** ya
recibiendo filas de n8n, son cinco pasos:

1. Entra a [lookerstudio.google.com](https://lookerstudio.google.com) con la
   misma cuenta de Google que es dueña de las hojas (la que usaste para
   crearlas conmigo).
2. **Crear** → **Informe**. Te va a pedir una fuente de datos: elige el
   conector **Hojas de cálculo de Google**, y selecciona el archivo **BCP
   Monitoreo — Log Dashboard** → la única pestaña que tiene.
3. Marca "Usar la primera fila como encabezados" si te lo pregunta (los
   nombres de columna ya vienen listos: `fecha`, `fuente`, `plataforma`,
   `sentimiento`, `categoria`, `alerta_urgente`, etc.) y pulsa **Añadir**,
   luego **Añadir al informe**.
4. Ya tienes un lienzo en blanco conectado a datos reales. Gráficos que valen
   la pena de entrada:
   - **Serie de tiempo** de `fecha` (eje X) contando filas (eje Y), desglosado
     por `sentimiento` — el pulso diario.
   - **Tabla** con `fuente`, `plataforma`, `categoria` y conteo — dónde
     aparece más y de qué se habla.
   - **Tabla o lista** filtrada por `alerta_urgente = 1` — el historial de
     alertas.
   - Un **control de fecha** (date range control) arriba de todo, para mirar
     una semana o un mes a la vez.
5. **Compartir** → dale acceso a quien más necesite verlo, o **Programar
   envío por correo** desde el propio Looker Studio si además quieres un PDF
   periódico (esto es aparte del correo de resumen diario que ya manda n8n).

El tablero se actualiza solo: cada corrida de n8n añade filas nuevas a la
hoja, y Looker Studio las refleja (por defecto cachea unos minutos; hay un
botón "Actualizar" en el propio informe para forzarlo al momento).

## Coste

Apify cobra por uso (tiene plan gratis limitado); OpenAI, Gemini y Anthropic
cobran por token consumido en cada corrida diaria. Con el volumen de una
marca (BCP) y quince prompts de GEO como mucho, el consumo diario es bajo,
pero no es cero como el resto de la automatización del sitio.
