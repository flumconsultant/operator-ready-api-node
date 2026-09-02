# Revisión: «Regulación de asistencia de docente» (n8n)

Workflow `TaZPAk9GqnEQkrYm` en `n8n.srv836595.hstgr.cloud`, proyecto
`V9ZyLUroQrqbd7f4`. Revisado el 2026-09-02 leyendo el JSON tal como lo
devuelve la API, no la vista del editor.

Estado: **inactivo, 33 nodos, cero ejecuciones, creado el mismo día de la
revisión**. Es un esqueleto recién montado, no algo que haya corrido nunca.
Esto importa para leer el resto: ninguno de los fallos de abajo se ha
manifestado todavía porque nada se ha ejecutado.

---

## Lo primero: el flujo está partido por la mitad

De los 33 nodos, **11 no tienen ninguna entrada** y **13 no tienen salida**.
El camino vivo termina en `P03.2.1 Asignar responsable (Airtable)`. Todo lo
que viene después —comunicar al asistente, corte de planilla, aprobación de
jefatura, confirmación de ERP, cierre— está dibujado en el lienzo pero
**suelto**: son islas que nunca reciben un item.

Nodos sin entrada:

```
P04 Comunicar al asistente              P05 Confirmar actualización ERP
P04.1 Marcar notificada                 P05.1 Marcar Solicitud Atendida
P06.1 Aprobación de jefatura            P06.2 Decisión jefatura (OK / No OK)
P08 Confirmar actualización ERP         P08.1 Marcar Solicitud Atendida
P01.1.2 Slack revisión por calidad      P02.1.4 Slack revisión de clasificación
P03.2.2 Slack sin asistente disponible
```

Las conexiones que faltan son, una por una:

| Falta | Consecuencia hoy |
|---|---|
| `P01.1` rama **false** → `P01.1.2` | Una solicitud incompleta desaparece sin avisar a nadie |
| `P02.1` salida **revision_humana** → `P02.1.4` | El caso ambiguo, que el propio prompt manda escalar, se pierde |
| `P03.2` rama **false** → `P03.2.2` | Si no hay asistente libre, silencio |
| `P03.2.1` → `P04` | **Aquí muere el flujo real** |
| `P04` → `P04.1` → (ya conectado a `P04.2`) | — |
| `P04.2` salida **dentro** → `P05` | Toda la rama «dentro de corte» está muerta |
| `P05` → `P05.1` → `P05.2` | — |
| `P06` → `P06.1` → `P06.2` | La aprobación de jefatura nunca se pide |
| `P06.2` rama **true** → `P08` | La aprobación afirmativa no cierra nada |
| `P08` → `P08.1` → `P08.2` | — |

Tres de esas ramas huérfanas (`P01.1.2`, `P02.1.4`, `P03.2.2`) son
precisamente las de escalado humano. El diseño las previó y el cableado las
dejó fuera: el flujo, tal como está, **falla en silencio en los tres puntos
donde debía llamar a una persona**.

---

## Nada puede autenticarse

**Ningún nodo tiene credenciales asignadas.** Ni el trigger de Google Sheets,
ni los ocho de Airtable, ni los cinco de Gmail, ni los siete de Slack, ni el
modelo de OpenAI. El campo `credentials` está vacío en los 33.

Y los siete nodos de Slack tienen `parameters: {}` — no están configurados en
absoluto: sin canal, sin texto, sin operación. No es que apunten al canal
equivocado; es que están en blanco.

En Airtable, los ocho nodos traen `base` y `table` con `value: ""` y solo el
`cachedResultName` («Base de Solicitudes (Airtable)», «Solicitudes»,
«Asistentes»). El nombre en pantalla se ve bien y el identificador real no
existe: cualquiera de esos nodos revienta en la primera llamada.

---

## Errores de lógica que aparecerán en cuanto se cablee

### 1. El corte de planilla casi nunca dará «dentro»

`P04.2` compara con `equals` sensible a mayúsculas:

```
{{ $("P01.1.1 Preparar Registro").item.json["Dentro de corte"] }}  ==  "si"
```

Un formulario de Google devuelve `Sí`, `SI` o `Si`. Ninguno de los tres es
igual a `si`. Todo caerá por el `fallback` («fuera») y la rama de dentro de
corte no se usará nunca, incluso después de conectarla.

Aparte del literal, hay una decisión de fondo: **el corte se está tomando de
lo que declara el solicitante**, no calculándolo desde la fecha de la
incidencia contra la fecha de cierre de planilla. Quien pide la
regularización decide si va dentro o fuera del corte. Eso debería salir de un
dato, no de una casilla del formulario.

### 2. La aprobación de jefatura lee un campo que nadie escribe

`P06.2` evalúa `{{ $json.data.approved }}`. Ese campo solo existe si el nodo
Slack anterior usa la operación **«Send and Wait for Response»** con
aprobación. `P06.1` está vacío, así que hoy `data.approved` es `undefined` y,
con `typeValidation: strict` y operador booleano, el nodo lanzará error en
vez de escoger rama.

### 3. El correo de rechazo dice que la solicitud fue atendida

`P07 Marcar Rechazada (jefatura)` pone `estado = "Rechazada"`, y acto seguido
`P07.1` envía al docente:

> Asunto: **Solicitud atendida** — REG-…
> Su solicitud REG-… **ha sido atendida**.

El nodo es una copia literal de `P05.2` / `P08.2` sin adaptar el texto. El
docente recibirá una confirmación de algo que le acaban de denegar, y sin
motivo. Es el fallo con peor cara hacia fuera de todo el flujo.

### 4. El código de seguimiento puede colisionar

```js
const rand = Math.floor(Math.random() * 9000) + 1000;
const codigo = "REG-" + $now.toFormat("yyyyLLdd") + "-" + rand;
```

9.000 valores por día, sin comprobar que no exista ya. Con 40 solicitudes en
un día la probabilidad de repetido ronda el 8 % (paradoja del cumpleaños).
No sería grave si el código fuera decorativo, pero **es la clave con la que
los seis nodos siguientes hacen `update` en Airtable** (`matchingColumns:
["codigo_seguimiento"]`). Un duplicado no da error: **actualiza el registro
del otro docente**. Cerraría la solicitud equivocada.

Se arregla con un contador de Airtable, con `$execution.id`, o con un UUID.

### 5. Si el campo de disponibilidad no existe, todos quedan disponibles

En `P03.1`:

```js
.filter(a => (a.disponible === undefined) || a.disponible === true || a.disponible === "true")
```

Si la columna se llama `Disponible`, `activo` o no está, `a.disponible` es
`undefined` y **el filtro deja pasar a todo el mundo**, incluidos los de
baja. Un filtro que ante la duda abre en vez de cerrar. El propio código
admite el problema con el comentario `// [pendiente: estructura de los datos
de asistentes]`.

Lo mismo con `Number(a.carga) || 0`: si la columna de carga no se llama así,
todos valen 0 y el «menor carga» degenera en «el primero que devuelva
Airtable». El reparto parecerá funcionar y estará asignando siempre a la
misma persona.

### 6. La validación de entrada solo mira dos campos

`P01.1` comprueba que `Docente` y `Motivo` no estén vacíos. Después el flujo
usa, sin haberlos validado:

- `Correo del solicitante` → cinco nodos de Gmail. Vacío: error de envío.
- `Evidencia` → va al prompt del clasificador. Vacío: el modelo clasifica sin evidencia.
- `Dentro de corte` → decide la rama de planilla.

Además, con `typeValidation: strict`, si la columna `Docente` no llega en el
item (nombre cambiado en el formulario, fila movida) el IF **no manda a la
rama falsa: lanza error** y la ejecución muere. Que es justo lo contrario de
lo que se espera de un validador.

### 7. Lo que se guarda no basta para auditar

`P01.2` escribe en Airtable solo `codigo_seguimiento`, `docente`, `motivo`,
`estado` y `fecha_registro`. **No se guardan el correo del solicitante ni la
evidencia**, que son los dos datos que justifican la decisión. Viven solo en
memoria de la ejecución, vía `$("P01.1.1 Preparar Registro")`. Cuando n8n
pode el historial de ejecuciones, no queda rastro de por qué se aprobó o se
rechazó una regularización de asistencia. Para un proceso que toca la
planilla de un docente, eso es poco.

---

## Huecos de diseño

### Los criterios de clasificación no existen

El `systemMessage` del agente dice, literalmente:

```
[pendiente: criterios de clasificación y validación]
```

Es el hueco central. Hoy `gpt-5-mini` decide **aprobar o rechazar la
regularización de asistencia de un docente** sin ninguna regla escrita, solo
con las tres palabras del enum. Improvisará, y lo hará distinto cada vez.
Todo lo demás del flujo es fontanería alrededor de esta decisión.

Mientras no estén esos criterios, el flujo no debería activarse aunque se
arreglen las conexiones.

### El «ERP» no se toca

`P05` y `P08` se llaman «Confirmar actualización ERP» y son nodos de Slack.
No hay integración con ningún ERP: se manda un mensaje pidiendo (o avisando)
que alguien lo actualice, y **el flujo marca «Solicitud Atendida»
inmediatamente después, sin esperar confirmación de que la actualización
ocurrió**. El estado en Airtable dirá atendida; la planilla puede seguir sin
tocar. O se espera una respuesta (send-and-wait, como en la aprobación de
jefatura), o el estado debería ser «pendiente de ERP» hasta que alguien lo
confirme.

### Sin red de seguridad

- `settings` no define **workflow de error**. Si Airtable o Gmail fallan, la
  ejecución queda en rojo en el historial y nadie se entera.
- Ningún nodo tiene `onError`. Un fallo a mitad deja la solicitud en un
  estado intermedio (`Asignada`, por ejemplo) para siempre, sin reintento ni
  aviso.
- `retryOnFail: true` está puesto en `P01.2 Registrar solicitud`, que es un
  **create**. Si Airtable escribe y la respuesta se pierde, el reintento crea
  un segundo registro con el mismo código.
- No hay zona horaria en `settings`, y hay tres `$now.toISO()` y un
  `$now.toFormat("yyyyLLdd")` que dependen de ella. Con el servidor en UTC,
  una solicitud de las 20:00 en Lima se registra con fecha del día siguiente.
- El trigger consulta **cada minuto**. Para un formulario de asistencia
  docente es mucho; cada cinco o quince minutos sobra y baja la presión sobre
  las cuotas de API.

### Datos personales al modelo

Al prompt van nombre del docente, motivo y evidencia —que en un caso de
asistencia puede ser un parte médico o una situación familiar. Va a OpenAI.
No es un defecto técnico, es una decisión que conviene tomar a conciencia:
qué se manda, si se anonimiza el nombre, y si eso está cubierto por la
política de tratamiento de datos de la institución.

---

## Por dónde empezar

Ordenado por lo que bloquea a lo demás:

1. **Escribir los criterios de clasificación.** Sin eso, el resto es
   fontanería para una decisión que nadie ha definido.
2. **Decidir qué es «dentro de corte»** y calcularlo desde la fecha, no
   preguntárselo al solicitante.
3. Asignar credenciales a los 33 nodos y rellenar los siete Slack (canal,
   texto, y `sendAndWait` en `P06.1`).
4. Fijar `base` y `table` reales en los ocho nodos de Airtable, y confirmar
   los nombres de campo de la tabla `Asistentes` (`disponible`, `carga`,
   `nombre`, `slack_id`) para cerrar el filtro de `P03.1`.
5. Cablear las diez conexiones que faltan, empezando por las tres ramas de
   escalado humano.
6. Cambiar el código de seguimiento a algo único de verdad.
7. Reescribir el correo de `P07.1` como lo que es: una denegación, con
   motivo.
8. Guardar correo y evidencia en Airtable desde `P01.2`.
9. Zona horaria, workflow de error, `onError` en los nodos que escriben, y
   quitar el `retryOnFail` del create.
10. Bajar la frecuencia del trigger.

Una prueba de humo razonable, antes de activar: una solicitud completa que
llegue hasta cierre, una incompleta, una que el modelo mande a revisión
humana, y una sin asistentes disponibles. Ahora mismo las cuatro terminan en
el mismo sitio —en ninguno.
