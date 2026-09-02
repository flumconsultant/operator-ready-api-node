# Flujo 1 · Validación y registro de facturas — revisión y copia de prueba

Revisión del workflow de n8n
[`qmdiBzPWYJAN197e`](https://n8n.srv836595.hstgr.cloud/workflow/qmdiBzPWYJAN197e)
("Flujo 1 · Validación y registro de facturas copy copy", 59 nodos, inactivo)
y copia de prueba ejecutable sin credenciales.

| Archivo | Qué es |
|---|---|
| `flujo1-facturas.original.json` | Export del workflow de producción tal como estaba el 2026-09-02 |
| `flujo1-facturas.prueba.json` | Copia con datos dummy, importable en cualquier n8n |
| `mocks/D00-caso-de-prueba.js` | Nodo Code con los 12 escenarios de prueba |

---

## 1. Copia de prueba ya creada

**[Flujo 1 · Validación y registro de facturas — PRUEBA (datos dummy)](https://n8n.srv836595.hstgr.cloud/workflow/IQFQjHC4QfbVhBau)**
(`IQFQjHC4QfbVhBau`, mismo proyecto)

No toca Gmail, Google Sheets, OpenAI, Gemini ni ningún subflujo: los 21
nodos externos están sustituidos por nodos *Code* que devuelven exactamente
la misma forma de datos que el nodo real. **Toda la lógica de negocio
(P02–P30) es la de producción, sin un solo cambio.**

### Cómo usarla

1. Abre el nodo **`D00 · Caso de prueba (dummy)`**.
2. Cambia `const CASO = 1;` por el número del escenario.
3. **Execute workflow**.

### Escenarios y resultado verificado

Los 12 casos se ejecutaron dentro de n8n (12 ejecuciones, todas `success`):

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

## 2. Fallos encontrados en el flujo de producción

### 2.1 Ningún nodo tiene credenciales — bloqueante

Los **59 nodos** salen del API con `credentials: {}`. Es el efecto típico de
duplicar/importar un workflow: Gmail Trigger, los 4 nodos de Google Sheets,
los 4 de Gmail, el modelo de OpenAI, Gemini y la herramienta de política
fallan en el primer intento con *"Credentials not set"*.

Credenciales disponibles en la instancia para reasignar:

- `gmailOAuth2` → `equipo.cornerstone.ec@gmail.com` · `pr.flum@gmail.com`
- `googleSheetsOAuth2Api` → `Google Sheets account` · `BCP Google Sheet`
- `openAiApi` → `OpenAi account 3` · `PoC_Alese` · `Traductor Voz OpenAI`
- `googlePalmApi` (Gemini) → 3 cuentas

### 2.2 El subflujo de incidencias no existe — bloqueante

Los 5 nodos `Cerrar incidencia - *` apuntan a `ix3aTQ9kotACGZa5`
("SUBFLOW - Cerrar incidencia factura"). Ese id devuelve **404** en la
instancia. Es decir: **todas las salidas de error del flujo terminan en
fallo**, no en una incidencia cerrada.

### 2.3 La rama XML muere en silencio

`Extraer datos XML (P04.2)` **no tiene ninguna conexión de salida**. Una
factura XML se enruta correctamente en P03, se extrae... y ahí se acaba la
ejecución: sin registro, sin incidencia y sin aviso al colaborador.

Además, aunque se conectara a `Normalizar factura (P05)` no bastaría: el
nodo devuelve el XML crudo en `rawText`, no los campos canónicos
(`supplierTaxId`, `documentNumber`, `total`…). Falta un nodo equivalente a
`Extraer campos PDF (P04.1.2)` que mapee UBL 2.1 de SUNAT.

En la copia de prueba esa rama sí está conectada y el caso 12 la recorre.

### 2.4 Dos nodos huérfanos

- `Notificar archivo duplicado (P12.1)` (Gmail) está configurado pero **no
  está conectado a nada**: cuando se detecta un archivo repetido, el
  colaborador nunca recibe el aviso que el nodo redacta.
- `Bloquear archivo repetido (P06.3)` (Remove Duplicates) tampoco tiene
  conexiones; queda duplicado con la lógica de `¿Hash ya registrado? (P10)`.

### 2.5 Salidas *false* sin destino

- `¿Email final válido? (P24)` — si el correo del colaborador no es válido,
  la rama falsa no va a ningún sitio: no se envía el resumen **y tampoco se
  actualiza el estado en la hoja**. La factura queda como `AUTO_APPROVED` /
  `PENDING` sin cierre.
- `¿Email rechazo válido? (P09.12)` — mismo problema en la rama de rechazo.

Recomendación: llevar ambas salidas falsas directamente a
`Preparar actualización aprobado (P26)` / `(P.29)`, para que la hoja quede
consistente aunque el correo no salga.

### 2.6 Aprobador escrito a mano

`Aprobación humana viáticos (HITL)(P23.2)` envía siempre a
`ccastilloh31@icloud.com`. Debería salir de la hoja `Colaboradores`
(columna de jefatura o centro de costo) o de una variable de entorno.

### 2.7 Una sola factura por ejecución

`Preparar duplicado (P14)`, `Parsear decisión del agente (P17)`,
`Restaurar contexto (P21)`, `Normalizar aprobación humana (P23.2.1)`,
`Preparar actualización aprobado (P26)` y `(P.29)` usan `.first()`.
`Detectar tipo de archivo (P02)` en cambio **emite un item por adjunto**.
Un correo con dos facturas procesa datos cruzados: la decisión del primer
adjunto se aplica a los dos. Está documentado en los comentarios del propio
flujo, pero no resuelto.

### 2.8 Columnas de estado en la hoja RegistroFacturas

`Registrar factura (P20)` escribe el registro inicial, pero los campos que
después actualizan `P27`/`P30` (`finalStatus`, `finalStatusLabel`,
`finalApproved`, `approvalType`, `humanApprovalStatus`,
`humanApprovalRespondedAt`, `finalProcessedAt`) **no se escriben en el
append**. Si esas columnas no existen ya en la cabecera de la hoja, el
update no tiene dónde escribir.

### 2.9 Detalles menores

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

## 3. Orden sugerido para dejar producción operativa

1. Asignar credenciales a los 59 nodos (§2.1).
2. Recrear el subflujo `SUBFLOW - Cerrar incidencia factura` o reapuntar los
   5 nodos `Cerrar incidencia` a un subflujo existente (§2.2).
3. Conectar `P12.1` y cerrar las salidas falsas de `P24` y `P09.12` (§2.4, §2.5).
4. Confirmar la cabecera de `RegistroFacturas` (§2.8).
5. Resolver la rama XML: mapeo UBL o descartarla explícitamente con una
   incidencia (§2.3).
6. Sacar el aprobador del nodo (§2.6).
7. Decidir qué hacer con correos de varios adjuntos (§2.7).
