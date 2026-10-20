# Instrucciones para ChatGPT: módulo «Gestión de prompts»

Copia desde aquí hasta el final y pégalo en ChatGPT junto con el ZIP del sitio.

---

Agrega al sitio «BCP · Monitor de Visibilidad en IA» un módulo para gestionar
los prompts que mide el monitor. Los prompts viven en un Google Sheet, y el
sitio los lee y escribe con un backend en n8n que **ya está construido y
probado**. Solo hay que hacer el front.

## 1. Lo que NO se puede tocar

El sitio ya carga datos reales desde n8n. Si se rompe alguna de estas piezas,
vuelve a la demo sin avisar:

- `dist/loader.js` se queda tal cual. Pide `geo-monitor-data` antes de arrancar
  y después carga `app.js` y `monitor.js`, en ese orden.
- `dist/index.html` carga **solo** `data.js` y `loader.js`. No agregues
  `<script src="app.js">` ni `<script src="monitor.js">`.
- En `monitor.js`, la constante `LIVE`, los textos que dependen de ella y
  `o.response` en el modal de respuesta se quedan.
- El código nuevo va en un archivo aparte, `dist/prompts-admin.js`, cargado por
  `loader.js` **después** de `monitor.js` (agrega una línea más a la cadena de
  `cargarScript`).

## 2. Configuración

En un solo lugar (al inicio de `prompts-admin.js`):

```js
const API_BASE = 'https://n8n.srv836595.hstgr.cloud/webhook';
```

El CORS ya está habilitado para el dominio del sitio. No hace falta enviar
cabeceras de autenticación.

## 3. Endpoints

### Listar — `GET {API_BASE}/geo-prompts`

```json
{
  "prompts": [
    {
      "id": "mar-01",
      "proyecto": "Marca",
      "prompt": "cual es el banco mas grande del Peru",
      "categoria": "Liderazgo y Posicionamiento Institucional",
      "intencion": "Informacional",
      "activo": true,
      "fecha_creacion": "2026-10-20"
    }
  ],
  "proyectos": ["Ahorros", "Cards", "Marca", "..."],
  "categorias": ["Comparación de opciones", "Información del producto", "..."],
  "intenciones": ["Comparativa", "Informacional", "Navegacional", "Reputacional", "Transaccional"],
  "total": 150,
  "activos": 150
}
```

### Crear — `POST {API_BASE}/geo-prompts-save`

Body (sin `id`):

```json
{ "proyecto": "Ahorros", "prompt": "¿Qué cuenta de ahorros me conviene?", "categoria": "Comparación de opciones", "intencion": "Comparativa", "activo": true }
```

Respuesta 200: `{ "ok": true, "prompt": { "id": "p_xxxx", ... } }`. El id lo
genera el backend.

### Editar — mismo endpoint, con `id`

Manda **solo los campos que cambian**: `{ "id": "mar-01", "prompt": "texto nuevo" }`.
Para el switch de activo: `{ "id": "mar-01", "activo": false }`.
La fecha de creación no se toca.

### Eliminar — mismo endpoint

```json
{ "id": "mar-01", "accion": "eliminar" }
```

Borra la fila del Google Sheet. Respuesta 200:
`{ "ok": true, "accion": "eliminar", "id": "mar-01" }`; si no existe, 404
`{ "ok": false, "error": "No existe el prompt mar-01" }`. Las respuestas ya
medidas de ese prompt se conservan en el histórico del monitor.

### Errores de validación

400 `{ "ok": false, "error": "El prompt no puede estar vacío." }`. Muestra
`error` tal cual en el formulario.

### Ejecutar una medición — `POST {API_BASE}/geo-run`

- Body `{}`: todos los prompts activos.
- `{ "prompt_ids": ["mar-01", "aho-03"] }`: solo esos.
- `{ "proyecto": "Marca" }`: solo un proyecto.

Responde al instante `{ "message": "Workflow was started" }`. La medición
tarda: unos 10 segundos por prompt (150 prompts ≈ 30–40 minutos). Cuesta
dinero en APIs, así que pide confirmación.

## 4. Pantalla

Agrega en el menú lateral, debajo de «Prompts / Consultas», una entrada
**«Gestión de prompts»** (ruta `#gestion-prompts`). Usa los mismos estilos,
tarjetas, tablas y botones del sitio.

1. **Cabecera:** título, contador «150 prompts · 150 activos» y dos botones,
   «Nuevo prompt» y «Medir todos».
2. **Filtros:** proyecto (de `proyectos`), categoría, intención, estado
   (activos/inactivos/todos) y búsqueda por texto. Los filtros se aplican en el
   navegador, sin llamar al backend.
3. **Tabla:** casilla de selección, prompt, proyecto, categoría, intención,
   switch de activo, fecha de creación y acciones (editar, eliminar).
   Agrupar o paginar de a 25.
4. **Nuevo / Editar** (modal):
   - Textarea del prompt (obligatorio, máximo 2.000 caracteres).
   - Proyecto: combo con los existentes y una opción «+ Crear proyecto nuevo».
     Los proyectos no se crean aparte; existen cuando un prompt los usa.
   - Categoría: combo con `categorias`, permite escribir una nueva.
   - Intención: combo con `intenciones`.
   - Switch «Activo».
5. **Switch de activo en la tabla:** guarda al instante; si falla, vuelve a su
   posición y muestra el error.
6. **Eliminar:** confirmación «Se borrará del Google Sheet. Las mediciones
   anteriores se conservan.» y después el POST.
7. **Medir seleccionados:** aparece al marcar casillas; manda `prompt_ids`.
   Confirmación con la cantidad y el tiempo estimado.
8. **Después de guardar o eliminar:** recargar la lista con `GET /geo-prompts`
   y mostrar un toast. Después de medir: toast «Medición iniciada; los
   resultados aparecerán en unos minutos» y un botón «Actualizar datos» que
   recarga la página (así `loader.js` trae los resultados nuevos).
9. **Aviso fijo:** «Medición automática diaria · 7:00 a.m. (Lima)».

## 5. Estados

- **Cargando:** skeleton de la tabla.
- **Error** (n8n no responde): mensaje y botón «Reintentar». Mientras, los
  botones de guardar quedan deshabilitados.
- **Vacío:** «Todavía no hay prompts» con el botón «Nuevo prompt».
- Mientras un POST está en curso, deshabilita el botón que lo lanzó.

## 6. Cómo comprobarlo antes de publicar

1. Crear un prompt de prueba en un proyecto «Prueba», editarlo, desactivarlo y
   eliminarlo. Tras cada paso, la lista se recarga y refleja el cambio.
2. Abrir el sitio: la cabecera sigue diciendo «Datos en vivo» y el dashboard
   muestra datos (no la demo).
3. Consola del navegador sin errores de CORS ni de JavaScript.
