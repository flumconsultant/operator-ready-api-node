# BCP · Monitor de Visibilidad en IA

Versión actualizada desde BCP Design System.zip, con tipografía Flexo local e inicio desde el endpoint de lectura de n8n.
URL: https://bcp-geo-tracker.flum-9013.chatgpt.site
Base anterior: e83edfcf07fde2dd20ce52a754de732d7fd19cab

## Ejecutar en tu computadora

Requiere Python 3 para levantar un servidor local. No necesita npm ni compilación.

1. Descomprime el ZIP.
2. Abre una terminal dentro de BCP_GEO_Monitor.
3. Ejecuta:

   python3 -m http.server 8000 --directory dist

   En Windows también puedes utilizar:

   py -m http.server 8000 --directory dist

4. Abre http://localhost:8000 en el navegador.

Las seis variantes de Flexo están incluidas en dist/fonts y se sirven localmente.

## Archivos

- dist/index.html: estructura de la aplicación y carga de recursos.
- dist/style.css: estilos de la vista original del proyecto.
- dist/monitor.css: identidad BCP, dashboard, navegación y adaptación móvil.
- dist/data.js: objeto DATA completo, con registros originales y simulados.
- dist/app.js: componentes originales, eventos compartidos, diálogos y exportador XLSX.
- dist/monitor.js: dashboard general, cinco motores, filtros, rutas y adaptación del detalle.
- dist/loader.js: trae los datos en vivo de n8n antes de arrancar las vistas.
- dist/favicon.svg: favicon BCP.
- .openai/hosting.json: configuración de la publicación existente en Sites.

- dist/geo-metrics.js: fórmulas del SPEC v2 (funciones puras, sin DOM). Pruebas: `node tests/test-metrics.cjs`.
- dist/geo-v2.js y dist/geo-v2.css: vistas del SPEC v2.

Se cargan data.js y loader.js; loader.js carga después app.js, monitor.js, prompts-admin.js, geo-metrics.js y geo-v2.js, en ese orden.

## Funcionalidades incluidas

Dashboard General, proyectos, prompts, competidores, fuentes y configuración.
Detalle de cada proyecto con las cinco pestañas originales y la nueva pestaña Segmentos.
ChatGPT, Perplexity, Claude, Gemini y Google AI Overview.
Filtros globales de periodo, proyecto y selección múltiple de motores.
KPIs, gráficos, rankings, respuestas, fuentes, recomendaciones y exportaciones CSV/XLSX.
El historial original por marcas se conserva en el proyecto original, rango de seis meses y ChatGPT seleccionado.

## Datos y límites de esta versión

- Conserva los 37 prompts y las 35 recomendaciones del requerimiento original.
- Los proyectos adicionales, nuevos motores y periodos posteriores utilizan datos simulados.
- La fecha de referencia de la demostración está fijada en 20 de octubre de 2026: DATA.monitor.referenceDate.
- Los valores sin evidencia en la fuente original se muestran como datos no disponibles.
- Las respuestas literales, capturas y otras evidencias no incluidas en la fuente no se recuperan automáticamente.
- Los cambios de estado de recomendaciones se guardan únicamente durante la sesión.
- La autenticación y el acceso privado de la publicación los gestiona Sites. El código estático exportado no incorpora un sistema propio de login.
- El backend vive en n8n (ver «Conexión con n8n»). Este código no guarda credenciales: el endpoint de lectura es público.
- La revisión visual en navegador quedó pendiente por una restricción del entorno. Se verificaron cálculos, filtros, rutas y exportaciones mediante comprobaciones de código.

## Conexión con n8n (datos en vivo)

El sitio ya lee los datos reales del GEO Tracker. `dist/loader.js` pide
`https://n8n.srv836595.hstgr.cloud/webhook/geo-monitor-data` al abrir la página.
Mete las observaciones reales en `DATA.monitor` y recién después carga `app.js`
y `monitor.js`.

- **Con corridas en n8n:** dashboard, proyectos, prompts, competidores y fuentes
  muestran datos reales. La cabecera dice «Datos en vivo». Al abrir una fila se
  ve la respuesta literal del motor.
- **Sin corridas todavía, o sin conexión con n8n** (15 s de espera): se usan los
  datos de demostración de `data.js`. La cabecera lo indica: «Demo · aún sin
  corridas» o «Demo · sin conexión con n8n».
- **Lo que sigue siendo de `data.js`:** los modelos (colores e iconos), las 35
  recomendaciones, *Brand Intelligence* y la serie histórica original por marca.
  El backend no genera esos datos.

Cambios respecto a la versión 2 publicada:

| Archivo | Cambio |
|---|---|
| `dist/loader.js` | Nuevo. Carga los datos de n8n y después `app.js` y `monitor.js`. |
| `dist/index.html` | Carga `data.js` y `loader.js` (antes `app.js` y `monitor.js`). |
| `dist/monitor.js` | Textos de cabecera, aviso, pie y exportaciones según haya datos en vivo o no. La respuesta del modal sale de cada observación. Protección si no existe el proyecto `marca`. |

**Share of Voice por respuesta** proviene de `sov` (con `som` como alias de compatibilidad), calculado por el backend ponderando posición, prominencia y contexto frente a otros bancos. El front únicamente promedia los scores disponibles de las respuestas válidas; no recalcula la fórmula. El % de mención es respuestas válidas con `brandMentioned` ÷ respuestas válidas × 100.

El ZIP entregado no contiene los workflows de n8n ni su base de datos. El sitio consulta únicamente el endpoint de lectura proporcionado.

## Volver a publicar

La configuración .openai/hosting.json contiene el identificador del sitio existente.
Para otro alojamiento estático, publica el contenido de dist.
Para crear un Site diferente, utiliza su propio identificador de proyecto.

## Validación del arranque

El cargador valida la respuesta antes de actualizar DATA, tiene un límite de 15 segundos y conserva la demostración si n8n falla, no devuelve corridas o entrega un payload incompatible. Los datos se consultan al abrir el monitor; no hay suscripción ni polling automático.

## Identidad BCP corregida

- Los logotipos de cabecera y navegación son vectores con trazados, sin recreaciones tipográficas.
- Fuente de los vectores: SVG embebidos en la cabecera de https://www.viabcp.com/ (consultada el 20 de octubre de 2026).
- dist/assets/logo-bcp.svg conserva el logotipo completo original azul/naranja.
- dist/assets/bcp-symbol.svg y dist/favicon-bcp.svg conservan el símbolo original.
- dist/bcp-brand.css aplica #002A8D y #FF7800 a navegación, cabeceras, tarjetas, pestañas, filtros, tablas, botones y diálogos.
- Los colores de motores y estados semánticos conservan su significado.
- Las referencias de recursos llevan versión para evitar conservar archivos previos en caché.

## Gestión de prompts

- Entrada de navegación: Gestión de prompts, ruta #gestion-prompts.
- Módulo independiente: dist/prompts-admin.js y dist/prompts-admin.css.
- loader.js conserva el arranque y agrega únicamente la carga del módulo después de monitor.js.
- El HTML sigue cargando directamente solo data.js y loader.js.
- La URL base de los endpoints se configura una sola vez al inicio de prompts-admin.js.
- El catálogo se obtiene de GET /geo-prompts. Los filtros y la paginación de 25 filas se aplican localmente.
- Crear, editar, activar y eliminar usan POST /geo-prompts-save; las ediciones envían solo los campos modificados.
- La lista se vuelve a consultar después de guardar o eliminar. Los errores del backend se muestran en el formulario.
- Toda medición requiere una confirmación con cantidad, tiempo aproximado y aviso de consumo de APIs.
- POST /geo-run se llama solo después de esa confirmación; Actualizar datos recarga la página para consultar los nuevos resultados.
- No se modifica el histórico del dashboard al eliminar un prompt del catálogo.
- El aviso de medición diaria a las 7:00 a.m. de Lima se muestra según las instrucciones del backend; el front no crea ni modifica su programación.

Validación: se completó un ciclo real de crear, editar, desactivar y eliminar un único prompt temporal en Prueba. Las mediciones se comprobaron con respuestas simuladas, sin iniciar corridas de pago. Se comprobaron también el arranque del monitor, estados de error, filtros, confirmaciones y payloads. La revisión visual y consola de un navegador real siguen sin verificarse por la restricción del entorno.


## Indicadores estratégicos y segmentos

- Dashboard y detalle muestran Share of Voice, Posición promedio y % de mención. Las variaciones porcentuales se expresan en puntos porcentuales y una menor posición se considera mejor.
- El ranking de competidores promedia `sovByBrand[marca]` sobre todas las respuestas válidas del filtro; un banco ausente aporta cero. Muestra también % de mención y posición promedio desde `brandDetail`. BCP permanece resaltado, incluso cuando queda fuera del top del resumen.
- En datos locales anteriores a `sovByBrand`, el SoV de competidores se indica como no disponible; no se inventa una distribución a partir del ranking.
- Segmentos (sexta pestaña del detalle) agrupa por `category`, con las tres métricas por motor y filtro local por `intent`. La tabla muestra el número de respuestas válidas y permite exportar a Excel.
- Fuentes y Referencias incorporan «Solo las que citan a BCP», usando `brandCited`, y la posición de la primera URL de BCP, desde `linkPosition`. El filtro se respeta en la exportación.
- El módulo de gestión de prompts conserva sus endpoints, validación, payloads y confirmaciones. El indicador visual de solicitudes se carga desde ese módulo para que index.html incluya únicamente data.js y loader.js; el skeleton inicial se conserva.
- loader.js y los campos de respuestas literales permanecen intactos.

Validación de esta actualización: pruebas de arranque con el payload actual de n8n (605 observaciones, 152 válidas), escenarios sin corridas, desconexión y payload inválido; navegación por seis pantallas y seis pestañas; porcentajes, exclusión de errores, bancos ausentes, filtros de intención/fuentes y exportaciones. Regresión de gestión de prompts con backend simulado: crear, editar, activar/desactivar, eliminar, errores, paginación y confirmación de mediciones. No se iniciaron nuevas mediciones de pago. La revisión visual y la consola en navegador real continúan sin verificarse por el bloqueo del entorno.


## Versión 10 · SPEC v2

Se agrega sin tocar la vista de proyecto (R1–R10); esa vista solo pasa a respetar los filtros globales nuevos.

- **Filtros globales en la URL**: rango (7/14/30/90 días, 6 meses, todo, personalizado; por defecto 14 días), tags, motor (los que no tienen corridas válidas aparecen como «No activo»), país y proyecto. Ejemplo: `?country=pe&engine=chatgpt,claude&tags=Ahorros&preset=last14#resumen`. Botón **Exportar** (CSV de la vista).
- **Resumen** (nuevo inicio): cobertura, posición, sentimiento (−100…+100), SOV de menciones y SOV ponderado (legado), con delta vs el periodo anterior y la fórmula en ⓘ; desempeño en el tiempo (día/semana, leyenda clicable); ranking de marcas ordenable; prompts Top/Subiendo/Bajando; índice de visibilidad; cambios en citas; fuentes por categoría; alertas de salud de datos.
- **Prompts**: tabla con columnas elegibles, búsqueda, orden y paginación 20/50/100. Al hacer clic se abre el **drawer** (Resumen · Respuestas · Citas) y la **vista de respuesta** con el texto, marcas con ✓/✕ y sentimiento, fuentes y búsquedas del motor. «Ver detalle» de la vista de proyecto abre el mismo drawer.
- **Citas y fuentes**: ganadores/perdedores, explorador de URLs (Top/Nuevas/Subiendo/Estables/Bajando/Perdidas/★), mix por categoría, cobertura de dominio en el tiempo y tabla de dominios con la categoría editable (se guarda en `_dominios` del Sheet).
- **Índice de visibilidad**: cuadrante cobertura × probabilidad de compra con umbrales configurables y time-lapse.
- **Recomendaciones**: generadas por reglas (nueva página, mix de prompts, prompts branded, presencia off-page, técnicas desde la auditoría), con razonamiento, prompt origen, titular sugerido y URLs de referencia; estados Sugeridas → Por hacer → En progreso → Hechas → Archivo, responsable y fecha objetivo (se guardan en `_recomendaciones`).
- **Prompts y tags**: tags con color y conteo, asignación en lote, mix por etapa del funnel, prompts branded, aviso de prompts sin contexto país, contador contra el límite (150).
- **Investigación de prompts**: desde keywords, desde una URL o brainstorm de marca → candidatos con etapa, tag y volumen → «Agregar a seguimiento».
- **Auditoría GEO**: crawlability con los 21 bots y robots.txt, contenido (estático vs dinámico, encabezados, FAQ, schema.org) y query fan-out. El historial queda en `_auditorias`.
- **Tráfico de bots IA**: carga un archivo de logs (se procesa en el navegador) y cruza visitas con páginas citadas.
- **Perfil de marca**: mapa de calor de atributos por banco; cada celda abre las respuestas que la sustentan.
- **Salud de datos**: en la cabecera, última corrida por motor (ámbar >8 días, rojo >14). Las respuestas con error no entran en ningún denominador.

Endpoints nuevos de n8n (workflows «GEO TRACKER BCP · API» y «· Herramientas»): `POST /geo-recs-save`, `POST /geo-domain-save`, `POST /geo-audit`, `POST /geo-fanout`, `POST /geo-prompt-research`.
