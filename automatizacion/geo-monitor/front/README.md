# BCP · Monitor de Visibilidad en IA

Paquete completo para continuar el desarrollo de la versión 12 publicada. Incluye código editable del frontend, Worker del servidor, recursos BCP, fuentes Flexo, foto de perfil, scripts de compilación, pruebas y salida compilada.

Sitio: https://bcp-geo-tracker.flum-9013.chatgpt.site
Commit de origen: ff7033c67a2c545912bbbe50db00972cfc326d7a

## Qué conserva esta versión

- Tipografía anterior restaurada; etiquetas de gráficos sin contorno, líneas y marcadores más finos.
- Dashboard y detalle de proyectos, ChatGPT, Perplexity, Claude, Gemini y Google AI Overview; filtros, tablas, fuentes, gráficos y exportaciones.
- Navegación reorganizada, perfil de Carlos Andrés Ramírez, recomendaciones identificadas como redactadas por IA y rankings de bancos con operación en Perú.
- Auditoría GEO desactivada en la interfaz y sus rutas.
- Inicio de sesión nativo con ChatGPT en Sites y protección de recursos mediante Worker.
- Integración existente con n8n y gestión de prompts.

## Abrir el frontend para mejorarlo

Desde esta carpeta, con Python 3:

```bash
python3 -m http.server 8000 --directory dist
```

En Windows también puedes usar:

```powershell
py -m http.server 8000 --directory dist
```

Abre http://localhost:8000. Es una vista estática de desarrollo: no reproduce el inicio de sesión de ChatGPT ni la protección del Worker. El front intenta leer n8n; si no hay conexión o datos compatibles, usa la demostración de `dist/data.js`. Crear o editar prompts desde esta vista usa los endpoints configurados de n8n.

## Compilar y validar

Requiere Node.js 22 o posterior. No hay dependencias de npm que instalar.

```bash
node scripts/build-worker.mjs
node scripts/validate-artifact.mjs
node tests/test-metrics.cjs
node tests/test-auth.mjs
```

El build incorpora los recursos del front a `dist/server/index.js` y copia la configuración a `dist/.openai/hosting.json`. Edita `worker/index.js` para cambios del servidor; no edites el archivo generado. Vuelve a compilar después de modificar cualquier recurso del front.

## Mapa del código

| Ruta | Función |
| --- | --- |
| `dist/index.html` | Estructura y orden de hojas de estilo |
| `dist/bcp-ux.css` | Navegación, perfil, ajustes de UX y corrección de gráficos v12 |
| `dist/bcp-theme.css`, `dist/bcp-logo.css` | Identidad BCP y tipografía base |
| `dist/geo-v2.js`, `dist/geo-v2.css` | Pantallas y gráficos de analítica |
| `dist/geo-metrics.js` | Cálculos puros de métricas |
| `dist/monitor.js`, `dist/app.js` | Dashboard, detalle original, componentes y exportaciones |
| `dist/prompts-admin.js`, `dist/prompts-admin.css` | Gestión del catálogo de prompts |
| `dist/loader.js` | Carga de datos n8n y arranque de módulos |
| `dist/data.js` | Datos de respaldo y demostración |
| `dist/bcp-motion.js` | Transiciones y movimiento reducido |
| `dist/bcp-login.css`, `worker/index.js` | Login BCP y control de acceso |
| `dist/assets/`, `dist/fonts/` | Logotipos, foto y fuentes locales |
| `scripts/`, `tests/` | Compilación, validación y pruebas |
| `docs/` | Historial, integración y revisión de UX |

Las hojas de estilo se superponen según el orden de `index.html`. Las fuentes editables del front están en `dist/`; no existe una carpeta `src/` ni un proyecto React/Angular adicional.

## n8n y alcance del ZIP

Este ZIP contiene todo el código disponible de la aplicación web y su Worker. Los workflows de n8n, su base de datos y sus credenciales pertenecen al servicio externo y no están incluidos; no fueron entregados como archivos en este proyecto.

El endpoint de lectura actual es `https://n8n.srv836595.hstgr.cloud/webhook/geo-monitor-data`, configurado en `dist/loader.js`. Los demás endpoints están en `dist/prompts-admin.js` y `dist/geo-v2.js`. Consulta `docs/HISTORIAL.md` para contratos y funcionamiento de las integraciones existentes. No incluye una copia del histórico remoto de corridas.

## Autenticación y publicación

El acceso con ChatGPT depende del entorno de Sites, que valida la identidad e inyecta encabezados confiables al Worker. Alojar únicamente `dist/` como archivos estáticos no reproduce esa seguridad. Para otro proveedor hay que adaptar la autenticación en el servidor.

La configuración `.openai/hosting.json` conserva el proyecto existente. Usa otro identificador si decides crear un Site nuevo. El correo del propietario en el Worker identifica qué perfil recibe la foto de Carlos; no es una contraseña ni un token. El paquete no contiene credenciales de Git, de APIs ni de sesión de ChatGPT.

## Entrega

`ORIGEN.json` identifica la versión exportada. `SHA256SUMS.txt` permite verificar la integridad de los archivos incluidos. Los cambios de esta entrega respecto al commit se limitan a documentación y metadatos de exportación; el código de la aplicación corresponde a la versión 12.
