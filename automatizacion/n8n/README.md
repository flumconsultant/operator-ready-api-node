# Los flujos de n8n, y dónde se toca cada cosa

Dos flujos viven aquí, cada uno con su guion generador y su JSON. Los guiones
son la fuente: se ejecutan sobre el original y producen el JSON que se sube.

    npm run n8n -- actualizar <id> automatizacion/n8n/<flujo>.json

---

## Flujo 1 · Diagnóstico TRAMMY

Formulario de dos páginas → índice → perfil → interpretación con Claude →
pantalla final. `kBbKnGEnIIwqX5dW`.

**Formulario:** https://n8n.srv836595.hstgr.cloud/form/trammy-diagnostico

### Lo que se edita en una hoja, sin abrir n8n

[TRAMMY · Configuración del diagnóstico][config] — el flujo la lee en **cada
ejecución**. Se edita, se vuelve a rellenar el formulario, y ya está: no hay
que publicar nada.

| Pestaña | Qué contiene | Efecto |
|---|---|---|
| `Preguntas` | `id`, `pregunta`, `tipo`, `opciones`, `obligatoria`, `activa` | Las preguntas de la página 2. Añadir una fila añade una pregunta; poner `activa` en `no` la quita. `opciones` va separado por barras: `1\|2\|3\|4\|5`. `tipo` admite `dropdown`, `number` y `text` |
| `Perfiles` | `perfil`, `min`, `max`, `descripcion` | Los tramos del índice. Un perfil nuevo es una fila nueva; cambiar un rango es cambiar dos celdas |
| `Textos` | `clave`, `valor` | Los títulos y mensajes de las cuatro pantallas, y `prompt_sistema`, que es el prompt de la interpretación |

Comprobado en vivo: renombrando un perfil y acotando su rango de 60-79 a 61-78,
la siguiente ejecución clasificó con el nombre nuevo y mandó el 79 al error de
validación, nombrando el motivo. Sin volver a publicar el flujo.

### Lo que sigue dentro de n8n

- **Título y descripción de la página 1** (`Form Trigger · Credenciales`). Un
  disparador no puede leer nada antes de dispararse, así que esto no puede
  venir de la hoja.
- **La validación de credenciales** (`IF Credenciales Válidas`): hoy solo
  comprueba que usuario y contraseña no vengan vacíos, que es lo que decía la
  maqueta. El criterio real está pendiente.
- **El cálculo del índice** (`Code TRAMA Index`): la fórmula TRAMA sigue
  pendiente. Mientras no exista el backend, el nodo calcula uno **provisional**
  —la media de las respuestas llevada a 0-100— y lo marca como tal; esa marca
  llega al prompt y a la pantalla. `CALCULO_PROVISIONAL = false` en ese nodo lo
  desactiva y devuelve el comportamiento diseñado: sin índice válido, error de
  validación.
- **Los datos de prueba** (`Datos de prueba`): `TRAMA_INDEX` elige el perfil a
  recorrer y `OMITIR_UNA` prueba el camino de respuestas incompletas. Las
  respuestas no se escriben ahí: las rellena `Preparar configuración` a partir
  de las preguntas configuradas, así que siguen estando completas aunque mañana
  sean veinte.

### Desactivados a propósito

`HTTP · Enviar Respuestas al Backend`, `Supabase · Guardar Diagnóstico`,
`HTTP · Mostrar Resultado (React)`, `Send Email · Informe Final` y
`Wait · Revisión Humana`. n8n atraviesa un nodo desactivado dejando pasar los
datos, así que el flujo corre entero. Cada uno lleva el motivo en el nombre.

### Dos trampas que costaron encontrar y conviene no repetir

- **`httpRequest` typeVersion 4.5 no existe en esta instancia.** Al publicar
  contesta `Cannot read properties of undefined (reading 'execute')`, sin decir
  qué nodo. La versión buena es la 4.2.
- **Un nodo de Google Sheets antes de una página de formulario cuelga la
  página.** Un GET a la URL de espera no devuelve nada en más de veinte
  segundos y quien rellena el formulario ve un spinner eterno. La misma lectura
  con un `HTTP Request` contra la API de Sheets tarda 0,38 s. Por eso la
  configuración se lee así y no con el nodo de Sheets.

---

## Flujo 1 · Atención al Cliente por Chat — StetikGO

`RwH6PrJnjHYOf9fz` · chat en
https://n8n.srv836595.hstgr.cloud/webhook/stetikgo-chat/chat

Y su alternativa con agente, `Flujo 1b · Asesor StetikGO (agente)`
(`IytDLtWnyjY1nW8m`), en
https://n8n.srv836595.hstgr.cloud/webhook/stetikgo-asesor/chat

Ambos leen [StetikGO · Catálogo 2026][catalogo], que tiene tres pestañas:

| Pestaña | Para qué |
|---|---|
| `Catálogo 2026` | Servicios, duración y precio. **Los doce precios son de ejemplo**: hay que sustituirlos antes de atender a nadie |
| `Casos` | Los casos derivados a una persona. El asesor escribe en `respuesta_asesor` y el agente se la entrega al cliente si vuelve a preguntar |
| `Citas` | Las citas reservadas. El agente comprueba solapes aquí antes de agendar |

El prompt del agente está dentro de `scripts/n8n-asesor-agente.mjs`, no en la
hoja: es donde vive el criterio de cuándo derivar y cuándo resolver, y cambiarlo
merece quedar en el historial.

[config]: https://docs.google.com/spreadsheets/d/1OwVs_MVP8IbZSXcjKhUScHyVEXDTx1RIYeJuWucrRgk/edit
[catalogo]: https://docs.google.com/spreadsheets/d/18_DVDoAOecq08zBDrZPVSm_wEtsr-uN5ijDbIATlsXs/edit
