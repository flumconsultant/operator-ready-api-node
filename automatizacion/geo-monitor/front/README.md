# BCP · Monitor de Visibilidad en IA

Código completo de la versión 2 publicada del sitio.
URL: https://bcp-geo-tracker.flum-9013.chatgpt.site
Commit: e83edfcf07fde2dd20ce52a754de732d7fd19cab

## Ejecutar en tu computadora

Requiere Python 3 para levantar un servidor local. No necesita npm ni compilación.

1. Descomprime el ZIP.
2. Abre una terminal dentro de BCP_GEO_Monitor.
3. Ejecuta:

   python3 -m http.server 8000 --directory dist

   En Windows también puedes utilizar:

   py -m http.server 8000 --directory dist

4. Abre http://localhost:8000 en el navegador.

Las fuentes Inter y PT Serif se solicitan a Google Fonts; sin internet se usan fuentes alternativas.

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

Se cargan data.js y loader.js; loader.js carga después app.js y monitor.js, en ese orden.

## Funcionalidades incluidas

Dashboard General, proyectos, prompts, competidores, fuentes y configuración.
Detalle de cada proyecto con las cinco pestañas originales.
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

**SoM por respuesta** = veces que se nombra a BCP ÷ veces que se nombra a
cualquier banco × 100. Lo cuenta el Analista IA del workflow. El KPI «Share of
Model» es el promedio sobre las respuestas válidas; las que tienen error no
cuentan.

El backend (workflows de n8n, código y pruebas) está en
`automatizacion/geo-monitor/` del repositorio.

## Volver a publicar

La configuración .openai/hosting.json contiene el identificador del sitio existente.
Para otro alojamiento estático, publica el contenido de dist.
Para crear un Site diferente, utiliza su propio identificador de proyecto.
