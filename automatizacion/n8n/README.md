# Flujo de regularización de asistencia docente — versión de prueba

Qué hay aquí, y para qué:

| Archivo | Qué es |
|---|---|
| `regulacion-asistencia-PRUEBA.json` | El workflow corregido, listo para importar en n8n. 34 nodos. |
| `airtable-base-solicitudes.json` | Payload para crear la base en Airtable con sus dos tablas. |
| `airtable-asistentes-dummy.json` | Tres asistentes de mentira para poder probar el reparto. |

La revisión que motivó todo esto está en
[`docs/revision-n8n-regularizacion-asistencia.md`](../../docs/revision-n8n-regularizacion-asistencia.md).

El original (`TaZPAk9GqnEQkrYm`) **no se ha tocado**. Esto es una copia de
prueba, con trigger de chat y datos dummy, para comprobar que la lógica corre
entera antes de llevar los cambios al flujo real.

---

## Lo que cambia respecto del original

**Las diez conexiones que faltaban.** El flujo original moría en `P03.2.1`;
ahora los 34 nodos están en el camino y las cinco bifurcaciones tienen sus dos
o tres salidas cableadas. Las tres ramas de escalado humano —calidad de
información, revisión de clasificación, sin asistente disponible— ya reciben
items en vez de quedarse decorando el lienzo.

**Slack fuera, Chat nativo dentro.** No existe ninguna credencial de Slack en
la instancia, así que los siete nodos se sustituyen por el nodo **Chat**
(`@n8n/n8n-nodes-langchain.chat`), que no necesita credencial. Los cuatro
avisos usan `operation: send`; los tres que esperan a una persona
—aprobación de jefatura y las dos confirmaciones de ERP— usan
`operation: sendAndWait` con `responseType: approval`, que devuelve
`{ data: { approved } }`. Por eso `P06.2` sigue evaluando `$json.data.approved`
sin cambios: la expresión que antes no tenía quien la alimentara ahora sí la
tiene.

Esto obliga a que el trigger sea un **Chat Trigger con
`responseMode: responseNodes`**. Si se cambia el trigger, los nodos Chat dejan
de funcionar.

**El corte de planilla se calcula.** Ya no se compara contra el literal `"si"`
—que nunca iba a coincidir con el `Sí` del formulario—. `P01.1.1` calcula un
booleano `dentro_de_corte` desde la fecha de la incidencia contra el día de
corte, y `P04.2` bifurca por ese booleano. El día de corte está en una sola
línea, `DIA_CORTE = 20`, y **hay que confirmarlo**: es un supuesto.

**El código de seguimiento ya no puede colisionar.** Era
`REG-<fecha>-<4 dígitos al azar>`, con 9.000 valores por día, y es la clave con
la que seis nodos hacen `update`. Un duplicado no daba error: actualizaba el
registro de otro docente. Ahora es
`REG-<fecha>-<id de ejecución>-<índice>`.

**El correo de rechazo de jefatura dice que fue rechazada.** Antes era copia
literal del de aprobación y le decía al docente «su solicitud ha sido
atendida» justo cuando se la habían denegado.

**El ERP se confirma antes de cerrar.** `P05` y `P08` esperan a que alguien
pulse «Actualizado en el ERP». Antes se marcaba «Solicitud Atendida»
inmediatamente, sin que nadie hubiera tocado la planilla.

**El filtro de asistentes cierra ante la duda.** Antes, `a.disponible ===
undefined` dejaba pasar a todo el mundo: si la columna no existía o se llamaba
distinto, asignaba gente de baja. Ahora exige `disponible === true` explícito.
Además `P03` lleva `alwaysOutputData: true`, sin lo cual cero asistentes
significaba que la rama «no hay nadie» no se ejecutaba nunca.

**Se guarda lo que hace falta para auditar.** `P01.2` ahora escribe también
correo, evidencia, fecha de la incidencia y si estaba dentro de corte. Antes
esos datos vivían solo en la memoria de la ejecución.

**Validación de entrada de cuatro campos y sin reventar.** `P01.1` comprueba
docente, motivo, correo y fecha, con `typeValidation: loose`, para que un campo
ausente vaya a la rama falsa en vez de lanzar un error y matar la ejecución.

**Criterios de clasificación escritos.** El `systemMessage` decía
`[pendiente: criterios de clasificación y validación]`. Ahora hay tipos
admitidos, condiciones de aceptación, de rechazo y de escalado. Van marcados
como propuesta: **los tiene que aprobar RR. HH. antes de activar nada**.

**Higiene.** Zona horaria `America/Lima` en los ajustes (hay cuatro `$now`
que dependen de ella), `retryOnFail` retirado del `create` de Airtable —donde
un reintento duplicaba el registro— y mantenido en lecturas y updates, y
`onError: continueRegularOutput` en los correos para que un fallo de Gmail no
deje la solicitud a medias.

---

## Cómo se aplica

### 1. Crear la base en Airtable

`airtable-base-solicitudes.json` tiene un hueco, `__WORKSPACE_ID__`. Sale de
la URL de Airtable al abrir el workspace: `airtable.com/wsp.../...`. La API de
Airtable no permite listar workspaces, así que ese dato hay que sacarlo a mano.

```
POST https://api.airtable.com/v0/meta/bases
Authorization: Bearer <PAT de la credencial "Airtable Personal Access Token account">
Content-Type: application/json
  → cuerpo: airtable-base-solicitudes.json
```

El PAT necesita los alcances `schema.bases:write` y `data.records:write`.
La respuesta trae el `id` de la base y el de cada tabla.

Después, los asistentes de prueba:

```
POST https://api.airtable.com/v0/<baseId>/<tablaAsistentes>
  → cuerpo: airtable-asistentes-dummy.json
```

### 2. Rellenar los identificadores en el workflow

`regulacion-asistencia-PRUEBA.json` trae tres marcadores:

```
__BASE_ID__            → appXXXXXXXXXXXXXX
__TBL_SOLICITUDES__    → tblXXXXXXXXXXXXXX
__TBL_ASISTENTES__     → tblXXXXXXXXXXXXXX
```

Sustituirlos y ya se puede importar en n8n.

### 3. Probar

Se abre el chat del workflow y se escribe un número:

| Caso | Qué prueba | Dónde debe terminar |
|---|---|---|
| `1` | Solicitud completa, dentro de corte | Confirmación de ERP → Atendida + correo |
| `2` | Completa, fuera de corte | Aprobación de jefatura → según el botón, P08 o P07 |
| `3` | Incompleta, sin motivo | Aviso de calidad de información |
| `4` | Ambigua | Revisión humana de clasificación |
| `5` | Válida, sin asistentes libres | Aviso de sin asistente disponible |
| `6` | Evidencia que contradice el motivo | Rechazada por validación + correo |

Los casos `1`, `2` y `5` dependen de la fecha: `1` sale «dentro de corte» solo
si hoy es día 20 o antes. Todo el correo dummy va a
`flum2.carlos.ramirez@gmail.com`, así que nada sale hacia terceros.

---

## Lo que sigue pendiente

- **Los criterios de clasificación son una propuesta.** Están escritos para que
  el flujo pueda probarse, no porque nadie los haya aprobado. Lo mismo el día
  de corte (20) y el plazo de 30 días.
- **El caso 5 hace trampa.** `P03.1` mira una bandera `forzar_sin_asistente`
  del nodo dummy para poder llegar a esa rama. Es andamio de prueba y se quita
  al pasar a producción.
- **El ERP sigue sin integrarse.** `P05` y `P08` piden a una persona que lo
  actualice y esperan su confirmación. Es mejor que cerrar a ciegas, pero no es
  una integración.
- **Al pasar a producción hay que cambiar dos cosas**: el trigger (Chat Trigger
  → Google Sheets Trigger, que necesita una credencial de tipo
  `googleSheetsTriggerOAuth2Api` que hoy no existe en la instancia) y los nodos
  Chat, que sin sesión de chat no tienen a quién escribir. Ahí habría que
  crear por fin la credencial de Slack, o mover esos avisos a Gmail
  `sendAndWait`, que sí tiene credencial.
- **Datos personales al modelo.** Nombre, motivo y evidencia van a OpenAI. En
  un caso de asistencia la evidencia puede ser un parte médico. Es una decisión
  a tomar a conciencia, no un defecto técnico.
