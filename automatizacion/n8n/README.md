# Flujo 1 · Validación y registro de facturas — revisión y copia de prueba

Revisión del workflow de n8n
[`qmdiBzPWYJAN197e`](https://n8n.srv836595.hstgr.cloud/workflow/qmdiBzPWYJAN197e)
("Flujo 1 · Validación y registro de facturas copy copy", 59 nodos, inactivo)
y copia de prueba ejecutable sin credenciales.

| Archivo | Qué es |
|---|---|
| `flujo1-facturas.original.json` | Export del workflow de producción tal como estaba el 2026-09-02 |
| `flujo1-facturas.optimizado.json` | Versión rediseñada, lista para producción (solo faltan credenciales) |
| `flujo1-facturas.prueba.json` | La misma versión con datos dummy, ejecutable sin credenciales |
| `BD_Rendiciones.xlsx` | La tabla resultante de los 12 casos, en Excel, con enlaces a los PDF |
| `BD_Rendiciones.ejemplo.csv` | La misma tabla en CSV |
| `comprobantes-prueba/` | Los 12 PDF de prueba (los mismos que están en Drive) |
| `mocks/D00-caso-de-prueba.js` | Nodo Code con los 12 escenarios |
| `mocks/P31-preparar-fila-bd.js` | Nodo que traduce cualquier final a una fila de la tabla |

---

## Rutas — dónde está todo

### Lo que puedes abrir ahora

| Qué | Dónde |
|---|---|
| **Carpeta con los 12 comprobantes en PDF** | https://drive.google.com/drive/folders/1is6o8AJwhu3BqFx-1vicwgZAzRPvHRfs |
| **La base de datos (Google Sheet)** | https://docs.google.com/spreadsheets/d/15kXhMOMLa4LwSrQdWYPbMXzYEt0VSUkcIxA106ZAJ2w/edit |
| **La misma tabla en Excel** | `automatizacion/n8n/BD_Rendiciones.xlsx` (en el repo) |
| **Descargar la hoja como Excel** | https://docs.google.com/spreadsheets/d/15kXhMOMLa4LwSrQdWYPbMXzYEt0VSUkcIxA106ZAJ2w/export?format=xlsx |
| **Flujo de prueba ejecutable** | https://n8n.srv836595.hstgr.cloud/workflow/IQFQjHC4QfbVhBau |
| **Flujo original (roto)** | https://n8n.srv836595.hstgr.cloud/workflow/qmdiBzPWYJAN197e |

La columna `archivoUrl` de la hoja es un hipervínculo: se abre el PDF del
comprobante desde la fila. Funciona igual en el `.xlsx`.

### Identificadores para configurar los nodos

| Nodo | Parámetro | Valor |
|---|---|---|
| `Archivar comprobante en Drive (P02.1)` | carpeta destino | `1is6o8AJwhu3BqFx-1vicwgZAzRPvHRfs` |
| `Guardar en base de datos (P32)` | documento | `15SJtCETq8MPhIaXnZ0ks3y54OrmX42RViqQXrqMBOZQ` (`RegistroFacturas`) |
| `Guardar en base de datos (P32)` | pestaña | `BD_Rendiciones` |
| `Guardar en base de datos (P32)` | columna clave | `id` |
| `Reservar en base de datos (P12.2)` | igual que P32 | — |
| `¿Hash ya registrado? (P10)` | busca en | `BD_Rendiciones` · columna `fileHash` |
| `Buscar duplicado (P13)` | busca en | `BD_Rendiciones` · columna `duplicateKey` |
| `Buscar colaborador (P06)` | documento | `1H7GrPpkj0Qe8KnEjzLsdw5Za1HS2mWwSBnxSUAgZYRQ` (`Colaboradores`) |
| Herramienta de política del agente | documento | `1zqNjBinx06T5OwgPapj1HWGA-_Px5qDpKX5ZEFTjpgo` (`PoliticaViaticos`) |
| `Cerrar incidencia (P34)` | subflujo | `ix3aTQ9kotACGZa5` — **no existe, hay que recrearlo** |

> La carpeta de Drive y la hoja de arriba están en `flum2.carlos.ramirez@gmail.com`.
> Si la credencial de Google que usa n8n es otra cuenta, comparte ambas con ella o
> crea la carpeta y la pestaña en la cuenta de la credencial y cambia esos dos IDs.

### Para imprimir en Excel

Tres caminos, de menos a más automático:

1. **Manual:** en la hoja, *Archivo → Descargar → Microsoft Excel (.xlsx)*.
2. **Enlace directo** (siempre trae la última versión):
   `https://docs.google.com/spreadsheets/d/15kXhMOMLa4LwSrQdWYPbMXzYEt0VSUkcIxA106ZAJ2w/export?format=xlsx`
3. **Automático desde n8n:** un flujo aparte con *Schedule Trigger* →
   *HTTP Request* (`GET` a esa URL de `export`, respuesta en formato *File*) →
   *Google Drive · upload* o *Gmail · send*. Así llega el Excel al correo o a
   Drive cada mañana sin tocar nada.

---

## 1. Copia de prueba ya creada

**[Flujo 1 · Validación y registro de facturas — PRUEBA (datos dummy)](https://n8n.srv836595.hstgr.cloud/workflow/IQFQjHC4QfbVhBau)**
(`IQFQjHC4QfbVhBau`, mismo proyecto)

No toca Gmail, Google Sheets, OpenAI, Gemini ni ningún subflujo: los nodos
externos están sustituidos por nodos *Code* que devuelven exactamente la misma
forma de datos que el nodo real. **Toda la lógica de negocio es la de
producción, sin un solo cambio.** `Guardar en base de datos (P32)` devuelve la
fila que habría escrito, así que puedes verla en la ejecución.

### Cómo usarla

1. Abre el nodo **`D00 · Caso de prueba (dummy)`**.
2. Cambia `const CASO = 1;` por el número del escenario.
3. **Execute workflow**.

### Escenarios y resultado verificado

Los 12 casos se ejecutaron dentro de n8n, todos `success`, y cada uno produce
su fila en la tabla:

| # | Escenario | Resultado obtenido |
|---|---|---|
| 1 | Almuerzo S/38.00, límite S/50 | `AUTO_APPROVED` |
| 2 | Almuerzo S/95.00, límite S/50 → humano aprueba | `HUMAN_APPROVED` |
| 3 | Almuerzo S/95.00, límite S/50 → humano rechaza | `REJECTED` (`rejectionType: HUMAN`) |
| 4 | Hotel S/540.00 / 3 noches = S/180 por noche, límite S/200 | `AUTO_APPROVED`, noches por `TEXT_AND_DATES` |
| 5 | Consumo con alcohol, política no lo permite | `REJECTED` (`rejectionType: POLICY`) |
| 6 | Escaneo sin RUC ni total | incidencia `INVALID_INVOICE` |
| 7 | Remitente fuera de la hoja Colaboradores | incidencia `INVALID_COLLABORATOR` |
| 8 | Hash del archivo ya registrado | incidencia `DUPLICATE_FILE` |
| 9 | Mismo RUC + número ya en la hoja | incidencia `DUPLICATE_INVOICE` |
| 10 | Foto JPG leída por Vision | `AUTO_APPROVED` |
| 11 | Foto ilegible → fallback a Gemini | `AUTO_APPROVED` |
| 12 | Comprobante XML | `AUTO_APPROVED` *(rama rota en producción, ver §2.3)* |

Los textos de comprobante de los casos 1–9 pasan por el parser real
`Extraer campos PDF (P04.1.2)`: RUC, número, fecha, moneda, subtotal, IGV,
total y razón social se extraen con las expresiones regulares de producción,
no están precocinados.

### Política de viáticos simulada

El nodo que sustituye al agente devuelve los límites que se esperan de la
hoja `PoliticaViaticos`. Ajústalos en `D00` si los reales son otros:

| Categoría | Límite | Permitido |
|---|---|---|
| BREAKFAST | 25 | sí |
| LUNCH | 50 | sí |
| DINNER | 55 | sí |
| MOBILITY | 40 | sí |
| AIRFARE | 900 | sí |
| LODGING | 200 (por noche) | sí |
| ALLOWED_BEVERAGES | 15 | sí |
| MINOR_PURCHASE | 120 | sí |
| Bebidas alcohólicas | — | no |

---

## 2. La base de datos

El resultado final se escribe en **una sola tabla**: la hoja `BD_Rendiciones`,
dentro del mismo documento `RegistroFacturas`. Una fila por correo recibido,
clave primaria `id` = `gmailMessageId`.

Hoja con el resultado de los 12 casos de prueba:
**[BD_Rendiciones — Flujo 1 Facturas](https://docs.google.com/spreadsheets/d/12MKrlQNUQKLFsvB8whm4hA92HNuGjTIyl2PiPqdwjwM/edit)**
(la misma tabla está en `BD_Rendiciones.ejemplo.csv`).

### Cabecera (fila 1, en este orden)

```
id  procesadoEn  estado  estadoEtiqueta  resultado  motivo  accionRequerida
senderEmail  colaborador  centroCosto  colaboradorEstado
gmailMessageId  asunto  fileName  fileType  fileHash  archivoUrl  archivoDriveId
proveedor  ruc  documento  fechaEmision  moneda  subtotal  igv  total
categoria  categoriaEtiqueta  confianza
politicaVersion  politicaLimite  baseComparacion  montoComparado
dentroLimite  excedente  usoPct  noches  montoPorNoche
decisionPolitica  tipoAprobacion  respondidoEn  duplicateKey
```

### Valores de `estado`

`EN_PROCESO` · `AUTO_APPROVED` · `HUMAN_APPROVED` · `REJECTED` ·
`DUPLICATE_FILE` · `DUPLICATE_INVOICE` · `INVALID_INVOICE` ·
`INVALID_COLLABORATOR` · `UNPROCESSABLE_DOCUMENT`

`resultado` los agrupa en `APROBADA` / `RECHAZADA` / `NO_PROCESADA`, y es lo que
usa `Enrutar cierre (P33)` para decidir a quién se avisa.

### El comprobante queda archivado

`Archivar comprobante en Drive (P02.1)` cuelga en paralelo de `P02` y sube el
adjunto tal como llegó, con el nombre `<gmailMessageId> - <fileName>`. La fila
guarda `archivoUrl` y `archivoDriveId`, así que desde la tabla se abre el PDF.

Se archiva **todo** adjunto que entre, incluidos los que después se descartan:
un escaneo ilegible o un remitente no autorizado también dejan su copia, que es
justo lo que se quiere poder mirar.

Va en paralelo y antes de `P03` a propósito: n8n v1 ejecuta las ramas de arriba
abajo, y si el archivado quedara debajo se ejecutaría *después* de `P31` y la
fila saldría sin enlace.

### Dos reglas que conviene conocer

- **La clave primaria es el correo, no la factura.** Un reenvío del mismo
  comprobante genera una fila nueva marcada como duplicada; no pisa la original.
- **Solo los estados que cierran una rendición guardan `duplicateKey`.** Así un
  comprobante inválido puede corregirse y reenviarse sin que el flujo lo trate
  como duplicado — que es como se comporta hoy.

---

## 3. Qué se optimizó (sin tocar la lógica de negocio)

| | Antes | Ahora |
|---|---|---|
| Escrituras por factura | 3 (Data table + append + update) | 2 (reserva + cierre) |
| Almacenes | 2 (Data table + Google Sheets) | 1 (Google Sheets) |
| Finales que quedan registrados | 2 de 8 | 8 de 8 |
| Nodos | 59 | 54 |

**Fuera** (7 nodos): `Preparar registro (P19)`, `Registrar factura (P20)`,
`Restaurar contexto (P21)`, `Preparar actualización aprobado (P26)`,
`Actualizar estado aprobado (P27)`, `Preparar actualización rechazado (P.29)`,
`Actualizar estado rechazado (P30)`. Los sustituyen `Preparar fila de base de
datos (P31)` + `Guardar en base de datos (P32)`.

**Cinco `Cerrar incidencia` → uno.** Eran idénticos salvo el literal de
`incidentType`; ahora el tipo y el motivo viajan en el item hasta
`Cerrar incidencia (P34)`.

**Sin Data table.** `¿Hash ya registrado? (P10)` consulta la columna `fileHash`
de la misma hoja. La reserva se mantiene: `Reservar en base de datos (P12.2)`
escribe una fila `EN_PROCESO` antes de llamar al agente, para que un reenvío
durante una aprobación pendiente se siga detectando como duplicado.

**Arreglado de paso** (§4.3, §4.4, §4.5):

- `Notificar archivo duplicado (P12.1)` ya está conectado.
- La fila se escribe **antes** de intentar el correo, así que un email inválido
  ya no deja la rendición sin registrar.
- La rama XML de `P04.2` ya entra a `P05`.

**Un fallo que apareció al rediseñar:** `Preparar duplicado (P14)` reconstruye el
item desde `Evaluar factura (P08.2)`, que es anterior al cálculo del hash, así
que `fileHash` no llegaba a la fila final. `P31` lo recupera del nodo que lo
calculó. Con el Data table esto no se notaba porque el hash se guardaba aparte.

**Sin cambios:** P02–P18 y P22–P23.x son byte a byte los de producción.
`Normalizar aprobación humana (P23.2.1)` solo cambia la referencia
`Restaurar contexto (P21)` → `Evaluar política (P18)`, porque ese nodo ya no existe.

---

## 4. Fallos encontrados en el flujo de producción

### 4.1 Ningún nodo tiene credenciales — bloqueante

Los **59 nodos** salen del API con `credentials: {}`. Es el efecto típico de
duplicar/importar un workflow: Gmail Trigger, los 4 nodos de Google Sheets,
los 4 de Gmail, el modelo de OpenAI, Gemini y la herramienta de política
fallan en el primer intento con *"Credentials not set"*.

Credenciales disponibles en la instancia para reasignar:

- `gmailOAuth2` → `equipo.cornerstone.ec@gmail.com` · `pr.flum@gmail.com`
- `googleSheetsOAuth2Api` → `Google Sheets account` · `BCP Google Sheet`
- `openAiApi` → `OpenAi account 3` · `PoC_Alese` · `Traductor Voz OpenAI`
- `googlePalmApi` (Gemini) → 3 cuentas

### 4.2 El subflujo de incidencias no existe — bloqueante

Los 5 nodos `Cerrar incidencia - *` apuntan a `ix3aTQ9kotACGZa5`
("SUBFLOW - Cerrar incidencia factura"). Ese id devuelve **404** en la
instancia. Es decir: **todas las salidas de error del flujo terminan en
fallo**, no en una incidencia cerrada.

### 4.3 La rama XML muere en silencio

`Extraer datos XML (P04.2)` **no tiene ninguna conexión de salida**. Una
factura XML se enruta correctamente en P03, se extrae... y ahí se acaba la
ejecución: sin registro, sin incidencia y sin aviso al colaborador.

Además, aunque se conectara a `Normalizar factura (P05)` no bastaría: el
nodo devuelve el XML crudo en `rawText`, no los campos canónicos
(`supplierTaxId`, `documentNumber`, `total`…). Falta un nodo equivalente a
`Extraer campos PDF (P04.1.2)` que mapee UBL 2.1 de SUNAT.

En la copia de prueba esa rama sí está conectada y el caso 12 la recorre.

### 4.4 Dos nodos huérfanos

- `Notificar archivo duplicado (P12.1)` (Gmail) está configurado pero **no
  está conectado a nada**: cuando se detecta un archivo repetido, el
  colaborador nunca recibe el aviso que el nodo redacta.
- `Bloquear archivo repetido (P06.3)` (Remove Duplicates) tampoco tiene
  conexiones; queda duplicado con la lógica de `¿Hash ya registrado? (P10)`.

### 4.5 Salidas *false* sin destino

- `¿Email final válido? (P24)` — si el correo del colaborador no es válido,
  la rama falsa no va a ningún sitio: no se envía el resumen **y tampoco se
  actualiza el estado en la hoja**. La factura queda como `AUTO_APPROVED` /
  `PENDING` sin cierre.
- `¿Email rechazo válido? (P09.12)` — mismo problema en la rama de rechazo.

Recomendación: llevar ambas salidas falsas directamente a
`Preparar actualización aprobado (P26)` / `(P.29)`, para que la hoja quede
consistente aunque el correo no salga.

### 4.6 Aprobador escrito a mano

`Aprobación humana viáticos (HITL)(P23.2)` envía siempre a
`ccastilloh31@icloud.com`. Debería salir de la hoja `Colaboradores`
(columna de jefatura o centro de costo) o de una variable de entorno.

### 4.7 Una sola factura por ejecución

`Preparar duplicado (P14)`, `Parsear decisión del agente (P17)`,
`Restaurar contexto (P21)`, `Normalizar aprobación humana (P23.2.1)`,
`Preparar actualización aprobado (P26)` y `(P.29)` usan `.first()`.
`Detectar tipo de archivo (P02)` en cambio **emite un item por adjunto**.
Un correo con dos facturas procesa datos cruzados: la decisión del primer
adjunto se aplica a los dos. Está documentado en los comentarios del propio
flujo, pero no resuelto.

### 4.8 Columnas de estado en la hoja RegistroFacturas

`Registrar factura (P20)` escribe el registro inicial, pero los campos que
después actualizan `P27`/`P30` (`finalStatus`, `finalStatusLabel`,
`finalApproved`, `approvalType`, `humanApprovalStatus`,
`humanApprovalRespondedAt`, `finalProcessedAt`) **no se escriben en el
append**. Si esas columnas no existen ya en la cabecera de la hoja, el
update no tiene dónde escribir.

### 4.9 Detalles menores

- `¿Colaborador activo? (P08)`: la primera condición compara
  `collaboratorFound` (booleano) contra el texto `"Activo"`. Funciona
  porque el operador `is true` ignora el `rightValue`, pero confunde al leer.
- `Resultado política (P22)` no tiene salida de reserva; si algún día
  `policyDecision` trae otro valor, el item se pierde sin rastro.
- `¿Hash duplicado? (P11)` funciona apoyándose en un comportamiento poco
  evidente: el nodo *Data table · Row exists* devuelve el item de entrada si
  encuentra la fila y nada si no la encuentra, y como el nodo tiene
  `alwaysOutputData`, n8n inyecta `{}`. Por eso preguntar por `fileHash`
  vacío/no vacío es correcto — pero conviene dejarlo escrito en una nota,
  porque parece un error y no lo es.

---

## 5. Orden sugerido para dejar producción operativa

Partiendo de `flujo1-facturas.optimizado.json` (que ya trae resueltos §4.3,
§4.4, §4.5 y la consolidación en una sola tabla):

1. **Crear la pestaña `BD_Rendiciones`** en el documento `RegistroFacturas` con
   la cabecera de §2, y comprobar que la credencial de Google de n8n ve la
   carpeta de Drive de las *Rutas*. Sin la pestaña, los nodos de Sheets no
   tienen dónde escribir; sin la carpeta, el archivado falla.
2. **Asignar credenciales** a todos los nodos (§4.1).
3. **Recrear el subflujo** `SUBFLOW - Cerrar incidencia factura`, o apuntar
   `Cerrar incidencia (P34)` a uno existente (§4.2).
4. **Mapear el XML** de verdad: hoy `P04.2` entrega el XML crudo, falta el
   equivalente a `Extraer campos PDF (P04.1.2)` para UBL 2.1 de SUNAT (§4.3).
5. **Sacar el aprobador** del nodo HITL (§4.6).
6. **Decidir qué hacer con correos de varios adjuntos** (§4.7).

§4.8 ya no aplica: la tabla nueva se define entera desde el flujo.
