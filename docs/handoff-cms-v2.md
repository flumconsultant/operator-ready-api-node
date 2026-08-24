# Handoff: CMS BECOME — panel de contenido móvil

## Overview

Rediseño del panel de administración de contenido de BECOME. Un editor que mantiene ~90 páginas
en dos idiomas (ES/EN) y que se usa mayoritariamente **desde el navegador de un iPhone**. En este
sistema **guardar es publicar**: el build del sitio tarda 2–4 minutos y el usuario no tiene forma
de previsualizar antes. Todo el diseño se ordena alrededor de esa única restricción.

Siete pantallas: entrada, lista de módulos, lista dentro de un módulo, editor de un elemento
(industria, 20 campos), cola del agente, conocimiento con deuda visible, suscriptores.
Móvil 390 px como referencia primaria; una pantalla clave (el editor) también en escritorio.

## About the Design Files

Los archivos de este paquete son **referencias de diseño escritas en HTML** — prototipos que
muestran intención visual y comportamiento, **no código de producción para copiar**. La tarea es
**recrear estos diseños dentro del entorno del código destino** (React, Vue, Next, lo que exista)
usando sus patrones y librerías. Si aún no hay entorno, elegir el framework adecuado e
implementarlos ahí.

- `CMS BECOME v2.dc.html` — **la referencia visual definitiva**: las nueve pantallas dibujadas y
  navegables. Ábrela en el navegador. Es la que manda si algo aquí contradice al texto.
- `CMS BECOME.dc.html` — primera vuelta: **diagnóstico** (6 fallos concretos del editor actual)
  y **el sistema** (retícula, tipografía, color, toque). Es la fuente de las decisiones.
- `cms-data.js` — el **esquema de contenido real** y el contenido de ejemplo, bilingüe (`[es, en]`).
  Esto es lo más importante del paquete: el editor se dibuja a partir de esta declaración.
- `brief-diseno-cms.md` — el briefing original del cliente.

## Fidelity

**Mixta, y conviene saber cuál es cuál:**

- El **diagnóstico y el sistema** (colores, tipos, medidas, reglas de toque) son **hi-fi**: los
  valores de esta guía son los definitivos, y son los del design system BECOME.
- El **esquema de campos** (`cms-data.js`) es **normativo**: tipos de campo, límites de caracteres
  y ayudas deben implementarse tal cual.
- Las **siete pantallas** están especificadas por escrito abajo, no como mockups terminados.
  Implementarlas siguiendo esta especificación + los tokens del design system.

## Design Tokens

Del design system BECOME (no inventar valores fuera de esta lista).

**Color**

| Uso | Hex |
| --- | --- |
| Fondo de app | `#05070F` (navy-950) |
| Fondo de pantalla / navy base | `#0A0E27` (deep-navy) |
| Superficie de tarjeta / campo | `#0E1330` (navy-850) |
| Superficie elevada / input enfocado | `#141A3A` (navy-800) |
| Acento (verde eléctrico) | `#00FF88` |
| Acento hover | `#00FFAA` |
| Texto principal | `#F7FAFC` |
| Texto secundario / ayuda | `#C3CEDD` (slate-200) |
| Texto tenue / metadatos | `#9BA9BF` (slate-300) |
| Hairline | `rgba(226,232,240,0.14)` |
| Hairline fuerte | `rgba(226,232,240,0.28)` |
| Tinte verde (selección) | `rgba(0,255,136,0.12)` |

Reglas de color que se rompen fácil:
- El verde **nunca es fondo de área**. Es la barra C→O, una cifra, un icono activo, **un** botón.
- **Texto sobre verde siempre `#0A0E27`, nunca blanco.**
- Sobre navy solo son legales `#E2E8F0` / `#C3CEDD` / `#9BA9BF` como texto.
- **Un solo verde por pantalla.** En el editor el verde es *Publicar*; por eso el selector de
  idioma va en blanco sobre hairline y no en verde.
- Sin sombras sobre navy: la profundidad es glow (`0 0 24px rgba(0,255,136,.28)`), un objeto por frame.
- Nada de rojo ni ámbar para los avisos: el aviso se marca con hairline fuerte + texto `#C3CEDD`
  y una etiqueta mono. La única excepción admitida es el borde de un campo pasado de límite.

**Tipografía** — Inter (600 títulos, 500 etiquetas, 400 cuerpo) y JetBrains Mono (cifras,
contadores, rutas, números de fila; nunca cuerpo de texto).

| Rol | Tamaño / peso / tracking |
| --- | --- |
| Título de pantalla móvil | 26 / 600 / −0.022em |
| Título de sección | 19 / 600 / −0.014em |
| Etiqueta de campo | 15 / 500 / 0 |
| **Texto editable (input/textarea)** | **16 / 400** — obligatorio: por debajo de 16 px iOS hace zoom al enfocar |
| Ayuda bajo el campo | 13 / 400 / line-height 1.45 |
| Etiqueta mono (contadores, `03/12`, rutas) | 11–12 / 0.14em / uppercase donde aplique |

**Espacio y forma** — base 4. Gutter lateral 16. Entre campos 20. Entre secciones 32.
Radios: 8 (campo), 12 (fila), 16 (tarjeta), 22 (hoja modal).

**Toque** — alto mínimo real 44 px en todo lo tocable; 8 px mínimo entre acciones opuestas;
área de *quitar* nunca adyacente a *reordenar*.

**Motion** — easing de entrada `cubic-bezier(.22,1,.36,1)`; hover 160 ms; cambio de estado 240 ms;
panel 420 ms; press `scale(.985)` 80 ms sin ripple; foco siempre anillo verde visible.
`prefers-reduced-motion` anula todo.

## Diagnóstico (por qué cada pantalla es así)

1. **Una industria es un scroll de 30 filas sin mapa.** 20 campos, 12 oportunidades, 5 métricas,
   6 procesos, 5 capacidades → índice fijo, contador de filas y colapso por sección.
2. **Guardar no avisa de que publica.** El botón dice *Publicar cambios* y la espera se muestra
   en tres pasos con nombre.
3. **Reordenar y borrar viven a un pulgar de distancia.** 44 px reales, quitar separado de
   reordenar, confirmación mostrando el texto de la fila.
4. **El límite de caracteres se descubre tarde.** Contador en vivo, aviso al 90 %, consecuencia
   escrita en palabras.
5. **El agente publica sin que nadie lo vea.** Cola con ventana de retención antes de la salida.
6. **La deuda de contenido está escondida.** 13 de 15 campos de Conocimiento vacíos: la entrada
   del módulo los lista por nombre y lleva directo al campo.

## Añadido en la segunda vuelta (v2) — implementar también

Sobre la especificación de pantallas de abajo, la v2 añade estos elementos. Todos están dibujados
en `CMS BECOME v2.dc.html`.

- **Pantalla Hoy** (nueva home, sustituye a la lista pelada de módulos): saludo, tarjeta del agente
  con **cuenta atrás circular** hasta la hora de publicación, dos cifras de deuda (campos sin
  escribir, campos sin traducir), cuadrícula de módulos 2×2 con icono del design system, cifra y
  barra de avance, y **barra de pestañas inferior** de 4 destinos (Hoy, Contenido, Agente, Ajustes).
- **Anillo de avance por elemento** en la lista de industrias (`conic-gradient`, verde sobre
  hairline) + **pastillas ES / EN** que dicen si ese idioma está traducido, y filtros
  (Todas / Sin traducir / Sin escribir).
- **Vista previa de Google en vivo** dentro del editor: caja con ruta, título en azul de enlace
  (`#8AB4F8`) y descripción, recortada a 60 y 155 caracteres. Se actualiza en cada pulsación.
- **Barra de avance del elemento** en la cabecera del editor (`16/20`) y **pastilla SIN PUBLICAR /
  AL DÍA**.
- **Puntos de estado por sección** en el índice: verde escrito, blanco a revisar, gris vacío.
- **Historial de versiones** (pantalla nueva): línea de tiempo con hora, autor, qué cambió y
  *Restaurar esta versión* en todas menos la actual.
- **Cola del agente enriquecida**: orbe con glow, forma de onda, cuenta atrás circular por artículo
  y estados pendiente / retenido / publicado.
- **Suscriptores**: dos métricas (412 total, +18 este mes) y avatar de iniciales por fila.
- **Escritorio**: riel de iconos de 76 px + índice de 250 + columna de formulario de 720 + **panel
  derecho de 320** con la vista previa de Google, el estado de la página y las tres últimas
  versiones. Ancho mínimo 1320 px.

## Screens / Views

Todas: ancho 390, gutter 16, fondo `#0A0E27`, barra superior de 56 px con *Volver* a la izquierda.

### 1. Entrada

- **Propósito:** entrar en 12 horas de sesión.
- **Layout:** columna centrada, logo BECOME (`assets/logo/wordmark-white.png`, 140 px de ancho)
  arriba a 88 px del borde, dos campos, botón, nota.
- **Componentes:** dos inputs (correo, contraseña) 52 px de alto, fondo `#0E1330`, radio 8,
  texto 16 px. Botón *Entrar* 52 px, ancho completo, `#00FF88`, texto `#0A0E27`, peso 600, radio 8.
  Nota bajo el botón, 13 px `#9BA9BF`: «La sesión dura 12 horas. Si caduca a media edición, lo
  escrito no se pierde.»
- **Estado de error:** hairline fuerte + línea de texto bajo el campo; no se vacía la contraseña.

### 2. Módulos (home)

- **Propósito:** elegir qué mantener hoy.
- **Layout:** título 26 px, luego lista de 6 filas de 72 px, separadas por hairline (sin tarjetas).
- **Fila:** nombre 17/600 a la izquierda; debajo, metadato 13 px `#9BA9BF`; a la derecha cifra en
  JetBrains Mono 15 px `#C3CEDD` + chevron.
- **Datos:** `MODULES` en `cms-data.js`. *Conocimiento* lleva `debt:13` y muestra su metadato
  («5 documentos · 13 campos sin escribir») con la cifra 13 en verde — es el único verde de la
  pantalla.
- **Estado activo:** fondo `rgba(0,255,136,.12)` durante el press.

### 3. Lista dentro de un módulo (Contenido → Industrias)

- **Propósito:** llegar al elemento correcto sin scroll ciego.
- **Layout:** barra de búsqueda fija (44 px) bajo el título; lista de filas de 68 px.
- **Fila:** nombre 17/600; metadato mono 12 px con campos y filas; a la derecha, última edición
  13 px `#9BA9BF`.
- **Vacíos:** `logistica` viene con `empty:true` → en vez de metadato, etiqueta *Sin escribir* en
  hairline, y la acción de la fila es *Escribir* en lugar de abrir.
- **Datos:** `INDUSTRIES`.

### 4. Editor de una industria — **la pantalla clave**

- **Propósito:** editar 20 campos en dos idiomas sin perderse ni publicar sin querer.
- **Estructura vertical:**
  1. Barra superior 56 px: *Volver* · nombre de la industria (17/600, truncado) · nada más.
  2. **Selector de idioma del contenido**, 40 px, dos segmentos ES / EN, blanco sobre hairline;
     el activo lleva fondo `#141A3A` y borde `rgba(226,232,240,.28)`. **No es verde.**
     Al cambiar: 400 ms de estado *Cambiando idioma* y el formulario se recarga con los valores
     del otro idioma. Lo editado no se pierde.
  3. **Índice fijo (sticky)**, 44 px: chips horizontales scrollables con las 9 secciones de
     `SCHEMA` (Identidad, Portada, El problema, Oportunidades, Métricas, Procesos, Capacidades,
     Cierre, SEO). El chip de la sección visible se marca con barra inferior de 2 px con
     `--gradient-energy`. Tocar un chip salta a la sección.
  4. Secciones colapsables. Cabecera de sección: título 19/600 + contador mono a la derecha
     (`04 campos` / `12 filas`) + chevron. Abierta por defecto solo la primera; el resto colapsadas.
  5. **Barra inferior fija** de 72 px, fondo `#0A0E27` con hairline superior: botón *Publicar
     cambios* ancho completo, 52 px, verde. Deshabilitado al 40 % con texto *No hay cambios que
     publicar* cuando el formulario está limpio.
- **Tipos de campo** (`ty` en `cms-data.js`), todos con etiqueta 15/500, ayuda 13 px `#9BA9BF`
  bajo el control, y `opt:true` → sufijo *opcional* en mono junto a la etiqueta:
  - `linea` — input de una línea, 52 px. Con `max` muestra contador mono a la derecha del label:
    `48/60`. Al 90 % el contador pasa a `#F7FAFC`; pasado el límite, el contador y el borde del
    campo se marcan y aparece la consecuencia escrita: «Google lo corta a partir de aquí».
    **No se bloquea la escritura.** `mono:true` (la ruta) se escribe en JetBrains Mono.
  - `parrafo` — textarea autoexpansible, mínimo 96 px, mismo contador.
  - `lista` — filas de texto de una línea. Cada fila: número mono a la izquierda (`01`), campo,
    y a la derecha un grupo de 44 px con *Subir* / *Bajar*; **Quitar va al extremo derecho,
    separado 8 px**, y abre confirmación. Debajo, botón *Añadir fila* de 44 px, hairline, no verde.
  - `pares` — filas de dos campos apilados (cabeceras de `cols`), mismo control de orden.
  - `tuplas` — filas de tres campos apilados, mismo control de orden.
- **Confirmación de quitar:** hoja inferior, radio 22 arriba, fondo `#0E1330`. Título *Quitar esta
  fila*, **el texto de la fila citado literalmente**, y la línea «No se puede deshacer desde el
  móvil. Queda en el historial de versiones.» Dos botones de 48 px: *Cancelar* (hairline) y
  *Quitar* (hairline fuerte). El destructivo **no** es verde.
- **Publicar:** al pulsar, la barra inferior se convierte en una tira de progreso con tres pasos
  nombrados, uno tras otro, ~1 s cada uno: *Guardando la versión* → *Compilando el sitio* →
  *Validando enlaces y SEO*; el paso activo lleva un pulso verde. Bajo ellos: «Suele tardar de 2 a
  4 minutos. Puedes cerrar el panel: termina solo.» Al terminar, *Publicado* con la hora en mono.
  Reintento si falla, conservando el texto escrito.

**Escritorio (≥1024 px):** misma retícula, no una segunda. Columna de formulario fija a 720 px
centrada; el índice de secciones se convierte en columna izquierda de 240 px, sticky, con las 9
secciones en vertical y su contador de campos; la barra de Publicar pasa a la esquina superior
derecha del contenido. Los campos crecen en ancho, no en número de columnas.

### 5. Cola del agente

- **Propósito:** ver y retener lo que el agente publicará hoy, antes de que salga.
- **Layout:** título + línea de contexto («Un artículo al día. Se publica solo si nadie lo retiene
  antes de su hora.»), luego tarjetas de 16 de radio, fondo `#0E1330`, 20 de padding, gap 12.
- **Tarjeta:** hora de salida en mono arriba (`sale 09:00`), titular 17/600 a dos líneas máximo,
  metadato 13 px (`940 palabras · 4 enlaces internos`). Si hay `warn`, línea extra con etiqueta
  mono *REVISAR* y el texto del aviso; el borde de la tarjeta sube a hairline fuerte.
  Pie con dos acciones de 44 px: *Retener* (hairline) y *Aprobar* (verde, único de la tarjeta).
- **Estados:** `pending` → acciones activas · `held` → tarjeta al 60 %, etiqueta *Retenido*, acción
  única *Devolver a la cola* · `live` → sin acciones, etiqueta mono *Publicado* + hora.
- **Datos:** `QUEUE`.

### 6. Conocimiento (deuda visible)

- **Propósito:** que los 13 campos vacíos se vean sin entrar documento por documento.
- **Layout:** cabecera con la cifra grande en mono: `13` en verde, 40 px, y al lado
  «campos sin escribir de 15». Debajo, un grupo por documento.
- **Grupo:** nombre del documento 17/600 + contador mono (`0/3`); debajo, los campos como filas de
  44 px: nombre a la izquierda, y a la derecha o bien un tic tenue (escrito) o la palabra
  *Escribir* en hairline. Tocar una fila abre el editor **en ese campo**, no en el documento.
- **Datos:** `KNOWLEDGE` (tercer valor de cada campo: 1 escrito, 0 vacío).

### 7. Suscriptores

- **Propósito:** consultar, no editar.
- **Layout:** título + etiqueta mono *SOLO LECTURA · exporta desde el panel de correo*; buscador;
  lista de filas de 60 px: correo en mono 14 px, ciudad y fecha 13 px `#9BA9BF` a la derecha.
- Sin acciones destructivas, sin verde en la pantalla.
- **Datos:** `SUBS`.

## Interactions & Behavior

- **Navegación:** entrada → módulos → lista → editor; *Volver* siempre a la izquierda de la barra.
  Si hay cambios sin publicar, *Volver* pregunta antes de salir.
- **Cambio de idioma del contenido:** 400 ms de transición con estado nombrado; carga los valores
  del otro idioma; los cambios no publicados de ambos idiomas se conservan en memoria.
- **Idioma de la interfaz:** conmutador ES/EN independiente del idioma del contenido (en ajustes);
  toda la copy de UI existe en ambos idiomas.
- **Contadores:** se recalculan en cada pulsación, sin debounce.
- **Reordenar:** *Subir*/*Bajar* mueven una posición y anuncian el cambio a lectores de pantalla
  (`aria-live`). Nada de drag como único mecanismo: el pulgar falla y no hay deshacer.
- **Publicar:** deshabilitado si no hay cambios; tres pasos nombrados; error recuperable.
- **Foco:** anillo verde visible siempre; el índice de secciones no roba foco al escribir.

## State Management

```
ui: 'es' | 'en'                 idioma de la interfaz
lang: 'es' | 'en'               idioma del contenido en edición
screen                          'login' | 'modules' | 'list' | 'editor' | 'queue' | 'knowledge' | 'subs'
mod, ind                        módulo y elemento abiertos
doc: { es: {...}, en: {...} }   valores por idioma, por id de campo (ver seedDoc)
dirty: boolean                  habilita Publicar
save: 'idle'|'saving'|'done'|'error'  +  step: 0..2
open: { [sectionId]: boolean }  secciones colapsadas
sec                             sección visible (para el índice)
confirm                         fila pendiente de confirmación de borrado
queue                           estado por artículo: pending | held | live
```

Datos: el editor **se dibuja a partir de `SCHEMA`**, no con formularios escritos a mano. Añadir un
campo al esquema debe bastar para que aparezca bien maquetado, con su contador y su ayuda.

## Assets

Del design system BECOME en `_ds/become-design-system-45ec6a75-ebb3-4907-87d0-262a9b0fd7fc/`:
logo (`assets/logo/wordmark-white.png`, `icon-white.svg`), librería de 39 iconos
(`assets/icons/`, cut `-white` para fondos navy — **nunca recolorear con filtros CSS**), tokens en
`tokens/*.css`. No hay imágenes de la librería en estas pantallas: un panel de trabajo no lleva
fotografía.

## Files

- `CMS BECOME.dc.html` — documento de diagnóstico y sistema.
- `cms-data.js` — esquema y contenido de ejemplo bilingüe.
- `brief-diseno-cms.md` — briefing original.
- `_ds/…` — design system BECOME (no incluido en este zip; está en el proyecto).
