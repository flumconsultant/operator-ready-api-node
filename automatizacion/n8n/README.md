# Los flujos de n8n, y dónde se toca cada cosa

Dos flujos viven aquí, cada uno con su guion generador y su JSON. Los guiones
son la fuente: se ejecutan sobre el original y producen el JSON que se sube.

    npm run n8n -- actualizar <id> automatizacion/n8n/<flujo>.json

---

## Flujo 1 · Diagnóstico TRAMMY

Formulario de dos páginas → índice → perfil → interpretación con Claude →
pantalla final. `kBbKnGEnIIwqX5dW`.

**Formulario:** https://n8n.srv836595.hstgr.cloud/form/trammy-diagnostico

### Dónde se cambian las preguntas y todo lo demás

**Pantalla de configuración:**
https://n8n.srv836595.hstgr.cloud/webhook/trammy-editor?clave=trammy-c15tyg9g

Una tabla con las preguntas, otra con las opciones de respuesta, otra con los
perfiles, y los textos de cada pantalla —incluido lo que se le dice a la IA que
interpreta—. Se escribe encima, se pulsa Guardar, y el siguiente formulario ya
sale con los cambios. No hace falta abrir la hoja ni entrar a n8n.

La clave está en la hoja, pestaña `Textos`, fila `clave_editor`; cambiándola
ahí cambia la de la pantalla. Es una cerradura sencilla para una pantalla
interna, no un sistema de usuarios: quien tenga la URL con la clave entra. Se
comprueba también al guardar, para que nadie pueda escribir llamando al
endpoint a mano.

La genera `scripts/n8n-editor-trammy.mjs` y vive en el flujo
«TRAMMY · Editor de configuración».

### Y por debajo, la misma hoja

Quien prefiera la hoja de cálculo puede seguir usándola: la pantalla y la hoja
son lo mismo, y el flujo lee de ahí en **cada ejecución**.

### Lo que se edita en una hoja, sin abrir n8n

[TRAMMY · Configuración del diagnóstico][config] — el flujo la lee en **cada
ejecución**. Se edita, se vuelve a rellenar el formulario, y ya está: no hay
que publicar nada.

| Pestaña | Qué contiene |
|---|---|
| `Instrucciones` | Qué es cada pestaña y qué poner en cada columna, en castellano. Es lo primero que debería leer quien no haya tocado esto antes |
| `Preguntas` | Una fila por pregunta: `id`, `pregunta`, `tipo`, `escala`, `obligatoria`, `activa`. Añadir una fila añade una pregunta; poner `activa` en `no` la retira sin borrarla. Las celdas de `tipo`, `escala`, `obligatoria` y `activa` tienen **desplegable**: no hay que acordarse de nada |
| `Escalas` | Las opciones de respuesta: `escala`, `orden`, `etiqueta`, `valor`. La **etiqueta** es lo que lee quien responde («Nunca», «Casi siempre»); el **valor** es lo que puntúa. Vienen tres hechas —`frecuencia`, `acuerdo`, `si_no`—, y una nueva es escribir sus filas con un nombre nuevo: aparece sola en el desplegable de `Preguntas` |
| `Perfiles` | `perfil`, `min`, `max`, `descripcion`. Un perfil nuevo es una fila nueva; cambiar un tramo son dos celdas |
| `Textos` | `clave`, `valor`. Los títulos y mensajes de las cuatro pantallas, y `prompt_sistema`, que es lo que se le dice a la IA |

Una pregunta con `tipo` = `escala` sale como desplegable con las etiquetas de su
escala. Con `texto`, como respuesta libre. Con `numero`, como número.

La puntuación se calcula con los `valor` de la escala de **cada** pregunta,
normalizando una por una: una escala de 1 a 5 y otra de 0 a 1 pesan igual, y
añadir una escala nueva no obliga a reajustar nada.

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
  —la media normalizada de las respuestas según la escala de cada pregunta— y lo
  marca como tal; esa marca
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
