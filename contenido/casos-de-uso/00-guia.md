# Casos de uso — guía para eliminar la canibalización

## Por qué toca ahora

Las 28 páginas de programa de BECOME NOW™ acaban de pasar de un 72,6 % de solapamiento máximo a un 4,5 %. Medido después, el eslabón más débil del sitio son las seis páginas de caso de uso.

| grupo | texto propio | solapamiento máximo entre dos |
|---|---|---|
| programas BECOME NOW™ (28) | 84–94 % | 4,5 % |
| industrias (12) | 60–66 % | — |
| **casos de uso (12)** | **52–59 %** | **43,3 %** |
| legales (6) | 96–98 % | — |

Los pares peores están todos dentro del grupo: `build-ai-enabled-products` con `deploy-governed-ai-agents` (43,3 %), con `measure-and-govern-ai-value` (41,3 %) y con `redesign-critical-workflows` (40,3 %).

## Diagnóstico

No es que falte contenido. Cada página ya trae cinco señales propias, su problema de fondo, su explicación de valor, sus herramientas, su resultado y su engagement recomendado. **Lo que se repite es el andamiaje**: los rótulos de sección, el titular de cada bloque y dos párrafos enteros.

Medido sobre el HTML publicado: **23 bloques compartidos por cuatro o más páginas, 1.122 caracteres — el 46 % del texto de una página media (2.411 caracteres)**.

De esos 23, tres ya están corregidos en código —las tarjetas de «Otras preguntas» repetían la pregunta y la descripción de las páginas vecinas—, y con eso el compartido baja a **20 bloques, 781 caracteres, el 37 %**. Los 37 puntos restantes necesitan texto, no código: son los de la tabla de abajo.

Se reparten así:

| Qué | Cuántas páginas | Acción |
|---|---|---|
| 12 rótulos de sección idénticos (`ESTO PROBABLEMENTE TE ESTÁ PASANDO`, `HERRAMIENTAS`, `QUÉ QUEDA INSTALADO`…) | 6 de 6 | **Se quedan.** Son etiquetas de navegación, no argumento. Cambiarlas por seis variantes solo confundiría. |
| «Señales que se reconocen desde dentro.» | 6 de 6 | Titular propio por página → `senalesTitular` |
| «People, Data, Agents, Products y Operations.» + su párrafo | 6 de 6 | Titular y párrafo propios → `dentroTitular`, `dentroTexto` |
| «Cuéntanos el contexto. Te responderemos con el punto de partida adecuado…» | 6 de 6 | Párrafo de cierre propio → `cierreTexto` |
| Las secciones «problema» y «valor» no tienen titular | 6 de 6 | Titular propio → `problemaTitular`, `valorTitular` |
| Las tarjetas de «Otras preguntas» repetían la pregunta y la descripción de las páginas vecinas | 5 de 6 | **Ya corregido en código.** Ahora la tarjeta muestra solo la etiqueta. |
| `Embed Scorecard™`, `Agentic Workflow Blueprint™` | 5 y 4 de 6 | **Se quedan.** Son las herramientas reales; inventar nombres distintos sería mentir. |

## Lo que se conserva

- La arquitectura visual: mismas secciones, mismo orden.
- La pregunta como H1 y la respuesta como bajada.
- Las cinco señales, el problema, el valor, el resultado y el engagement de cada página, que ya son propios.
- Los rótulos de sección.
- El tono: directo, sobrio, sin superlativos.
- Los nombres reales de las herramientas propietarias.

## Lo que cambia

### Antes

Las seis páginas cierran el bloque «Qué cambia dentro» con el mismo párrafo:

> Ninguna de estas situaciones se resuelve en una sola de las cinco capas. Por eso el trabajo cruza las cinco: si una queda fuera, el cambio no sobrevive al primer trimestre.

### Ahora

Cada página dice qué cambia en **su** situación. No «las cinco capas» en abstracto, sino cuál pesa más aquí y por qué. En «escalar la IA» probablemente sean Operations y Data; en «preparar equipos», People; en «agentes con control», Agents y la gobernanza. El párrafo genérico es verdad, pero es la misma verdad seis veces.

### Antes

> Cuéntanos el contexto. Te responderemos con el punto de partida adecuado, no con una secuencia comercial.

### Ahora

El cierre nombra lo que la persona traía cuando llegó. Quien viene de «mis pilotos no escalan» no cierra igual que quien viene de «necesito medir el valor».

### Antes

Las secciones «El problema detrás del síntoma» y «Cómo agrega valor BECOME» entran directas al párrafo, sin titular.

### Ahora

Cada una abre con una frase que se pueda leer sola. Es lo que hizo que las páginas de programa pasaran del 20 % al 90 % de texto propio: no más párrafos, sino un titular verificable en cada bloque.

## Reglas editoriales

- Una idea por párrafo. Frases declarativas.
- Un titular tiene que poder leerse solo y decir algo que las otras cinco páginas no digan.
- No prometer porcentajes, plazos ni resultados sin línea base.
- Nada de «revolucionar», «potenciar», «llevar al siguiente nivel» ni «solución innovadora».
- El español y el inglés son dos adaptaciones, no una traducción palabra por palabra.
- Si un titular vale igual para dos casos de uso, todavía no es propio.

## SEO on-page

- Una intención distinta por URL. Los slugs no cambian.
- Título de buscador de 50–60 caracteres contando « | BECOME» (9). Por encima de 51 caracteres el título ya no cabe con la marca.
- Meta description de 140–160. Tres de las seis en español y tres en inglés ya llevan una versión propia porque la respuesta no cabía.
- Un solo H1: la pregunta.
- `hreflang` recíproco y canonical autorreferente: ya están y no se tocan.

## Criterios de aceptación

Los mismos que se aplicaron a los programas, y que allí se cumplieron:

- Ningún párrafo de más de 12 palabras repetido literalmente entre casos de uso.
- Al menos 75 % de texto propio por página (hoy: 52–59 %).
- Solapamiento máximo entre dos páginas por debajo del 15 % (hoy: 43,3 %).
- Cada página con seis titulares propios: señales, problema, valor, qué cambia dentro, cierre y el H1.

## Cómo devolverlo

Rellena los campos marcados **NUEVO** en:

- `01-copy-casos-es.md` — las seis páginas en español
- `02-copy-cases-en.md` — las seis en inglés

Los campos marcados *PROPIO* ya están bien; cámbialos solo si quieres mejorarlos. Puedes dejar recados en una línea que empiece por `NOTA:`.

Si prefieres, escribe primero el español y yo adapto el inglés después.
