# BECOME — todo lo que queda por revisar, en un solo paquete

Aquí está **todo**. No hay una segunda entrega después de esta.

## Los cinco archivos

| Archivo | Qué es | ¿Obligatorio? |
|---|---|---|
| `01-industrias-es.md` | Las seis industrias en español | **Sí** — es el único grupo que todavía falla |
| `02-industries-en.md` | Las seis en inglés | Sí, o dime y lo adapto yo desde el español |
| `03-titulos-y-descripciones.md` | Los 88 títulos y descripciones de Google | Recomendado |
| `04-resto-del-sitio-es.md` | Portada, servicios, nosotros, contacto e índices | Opcional |
| `05-rest-of-site-en.md` | Lo mismo en inglés | Opcional |

Si solo vas a hacer una cosa: **`01-industrias-es.md`**.

---

## Dónde está el sitio hoy

Medido sobre el HTML publicado, grupo por grupo:

| grupo | texto propio | solapamiento máximo | estado |
|---|---|---|---|
| programas BECOME NOW™ (28) | 86–94 % | 8,6 % | resuelto |
| casos de uso (12) | 88–92 % | 9,1 % | resuelto |
| **industrias (12)** | **63–71 %** | **33,3 %** | **pendiente** |
| legales (6) | 96–98 % | — | correcto |
| artículos (6) | 96–98 % | — | correcto |

Las industrias son lo único que queda. El resto del sitio son páginas únicas: no compiten entre sí.

---

## 1 · Industrias — el trabajo de verdad

Las seis páginas comparten **35 bloques de texto, 1.581 caracteres, el 33 % de cada página**.

De esos 35:

**Se quedan (23).** Los rótulos de sección —`DÓNDE VEMOS OPORTUNIDAD`, `QUÉ SE MIDE`, `SERVICIO RECOMENDADO`…— son navegación, no argumento. La garantía vendor-neutral y la nota de métricas —«no publicamos resultados de terceros»— son promesas que tienen que decirse igual en las seis; cambiarlas por seis versiones distintas las debilitaría.

**Ya corregidos en código (7).** Las tarjetas de «Otras industrias» repetían el descriptor de la industria vecina, y la tarjeta del método repetía su línea en las seis. Es el mismo fallo que ya se arregló en programas y en casos de uso. Con eso el solapamiento máximo baja de 36,1 % a 33,3 % y el texto propio sube de 59-67 % a 63-71 %. El resto necesita texto.

**Los tienes que escribir tú (5 por página, 60 en total).** Son cinco titulares y un párrafo:

| Campo | Hoy las seis dicen |
|---|---|
| `oportunidadesTitular` | «Seis frentes donde la IA cambia el trabajo, no solo la herramienta.» |
| `workflowsTitular` | «El trabajo real donde ocurre el cambio.» |
| `tecnologiaTitular` | «La capacidad se elige después del problema.» |
| `metricasTitular` | «Indicadores que dicen si algo cambió de verdad.» |
| `empezarTitular` | «Tres puntos de entrada, según qué esté resuelto.» |
| `cierreTexto` | «Cuéntanos el contexto de tu organización…» |

Es exactamente lo que hicimos en casos de uso, y allí llevó el texto propio del 52 % al 88 %.

**El truco que funcionó las dos veces:** el titular tiene que decir algo que las otras cinco páginas no puedan decir. «Indicadores que dicen si algo cambió de verdad» vale para cualquier sector. «Un expediente que tarda menos no sirve si nadie puede explicar por qué se aprobó» solo vale para servicios financieros.

Y en `cierreTexto`, nombra lo que trae quien llega a esa página. Quien viene de minería no cierra igual que quien viene de retail.

### Salud tiene una regla propia

`healthcare-life-sciences` lleva un bloque `limite` que dice qué NO hacemos: diagnóstico, tratamiento, triaje clínico, conformidad de dispositivos. **No lo suavices.** Es lo que impide que la página prometa algo clínico, y en esa industria eso no es una cuestión de estilo.

---

## 2 · Títulos y descripciones — 75 de 88 desaprovechan sitio

Ninguno está mal. **75 títulos miden menos de 50 caracteres y 50 descripciones menos de 140**, cuando Google muestra hasta 60 y 160.

No es un fallo y no penaliza. Pero son entre 10 y 30 caracteres por página de resultado de Google que hoy están en blanco, y es donde un ajuste pequeño rinde más: se ven antes de que nadie entre.

Los más cortos son las legales —`Terms of use | BECOME`, 21 caracteres— y los índices.

En el archivo, cada ruta trae su título y su descripción con la cuenta y una etiqueta: `ok`, `CORTO` (sobra sitio) o `LARGO` (hay que arreglarlo). No hay ninguno `LARGO`.

---

## 3 · El resto del sitio — opcional

Portada, servicios, nosotros, contacto y los índices. No tienen problema de duplicación: son páginas únicas. Va su texto por si lo quieres mejorar.

**Una cosa que te señalo y no toco porque es decisión de marca:** el único titular de la portada española está en inglés —**«BECOME WHAT COMES NEXT.»**— y es el único H1 repetido de las 88 páginas, porque la portada inglesa dice lo mismo. No contiene ninguna palabra clave del título de buscador. Puede estar bien así si es la línea de marca; solo quiero que sea una decisión y no un descuido.

---

## Reglas, las mismas de siempre

- Una idea por párrafo. Frases declarativas.
- Un titular tiene que poder leerse solo y decir algo que las otras cinco no digan.
- Nada de porcentajes, plazos ni resultados sin línea base.
- Nada de «revolucionar», «potenciar», «llevar al siguiente nivel», «solución innovadora».
- Español e inglés son dos adaptaciones, no una traducción palabra por palabra.
- Si un titular vale igual para dos industrias, todavía no es propio.

## Cuándo está hecho

Cuando las industrias lleguen a lo mismo que los otros dos grupos:

- texto propio por encima del **75 %** (hoy 63–71 %)
- solapamiento máximo por debajo del **15 %** (hoy 33,3 %)
- **cero** párrafos de más de 12 palabras repetidos entre industrias

Te doy la tabla de antes y después en cuanto me lo devuelvas, como las dos veces anteriores.

## Cómo devolverlo

Reescribe encima y mándame los archivos que hayas tocado. No hace falta que sean los cinco. Si dejas un recado, ponlo en una línea que empiece por `NOTA:`.
