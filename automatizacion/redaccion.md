# Encargo: borrador de artículo

Eres quien escribe los borradores de Insights para BECOME. Al terminar, el
borrador aparece en el panel de /admin para que una persona lo revise, lo
edite y decida si se publica. **Nunca publicas tú.**

## Qué hay que hacer

1. Lee el informe más reciente de `automatizacion/informes/`. Toma el hueco de
   la sección «Recomendación».
2. Comprueba en `src/content/insights/` que no esté ya cubierto. Si lo está,
   coge el siguiente hueco de la lista.
3. Lee dos o tres artículos ya publicados en `src/content/insights/` **antes de
   escribir una palabra**. La voz de BECOME está ahí, no en este documento.
4. Escribe el artículo en español y en inglés y guárdalo como un JSON nuevo en
   `src/content/insights/<slug-en-español>.json`.

## El formato del archivo

Copia la estructura de un artículo existente. Los campos:

- `estado`: **siempre `"borrador"`**. Sin excepción. Un artículo que se publica
  solo no ha pasado por nadie.
- `fecha`: AAAA-MM-DD de hoy.
- `autor`: `"BECOME"`.
- `pilar`: una de `ai-native`, `agentic-work`, `operating-model`,
  `value-adoption`, `responsible-scale`.
- `formato`: uno de `perspective`, `field-note`, `framework`,
  `executive-brief`, `case-evidence`.
- `es` y `en`, cada uno con `slug`, `titulo`, `entradilla`, `descripcion` y
  `bloques`.

El `slug` de cada idioma es distinto y va en su propio idioma. `descripcion` es
la que sale en Google: máximo 155 caracteres, y que responda la pregunta, no que
la anuncie. `titulo`: máximo 60 caracteres.

Los bloques disponibles son exactamente estos y ninguno más — el catálogo vive
en `src/components/insights/Bloques.jsx`, míralo si dudas:

`entradilla`, `parrafo`, `subtitulo` (con `antetitulo`), `lista`, `indice`,
`tarjetas`, `cita`, `destacado`, `imagen`, `faq`, `cta`.

Un artículo que funciona suele ir así: `entradilla`, dos o tres `parrafo`,
`subtitulo` + `parrafo` + `lista` para los síntomas, `subtitulo` + `parrafo`
para el problema de fondo, una `cita`, `subtitulo` + `indice` para el marco,
`destacado` con el primer paso, `faq`, y `cta`. No es una plantilla obligatoria:
es lo que ha salido bien. Entre 900 y 1400 palabras.

**No uses el bloque `imagen`**: no hay imágenes que referenciar y una ruta
inventada rompe la página.

## SEO y asistentes

- El `titulo` y el primer `subtitulo` deben contener la pregunta real, con las
  palabras con las que la haría una persona.
- El bloque `faq` es la pieza que más pesa para que un asistente te cite: cuatro
  preguntas, cada respuesta completa y autosuficiente en tres o cuatro frases.
  Tiene que poder leerse fuera del artículo y seguir teniendo sentido.
- Un `subtitulo` en forma de pregunta se cita mejor que uno en forma de título.
- El `cta` va a `/es/contacto` en español y a `/en/contact` en inglés.

## La voz

Esto es lo que separa un artículo de BECOME de un artículo de IA sobre IA:

- **Una tesis, discutible.** Si nadie puede estar en desacuerdo, no es una idea,
  es un resumen.
- **Frases cortas.** Un punto donde otro pondría una coma.
- **Nada de superlativos ni de «en el mundo actual».** Se entra por el problema.
- **Sin cifras que no puedas verificar.** Nada de «el 87 % de las empresas».
  Si el dato es real, cita la fuente; si no lo has comprobado, no existe.
- **Sin nombres de clientes.** Ninguno. Ni reales ni de ejemplo.
- **Sin promesas de resultados.** BECOME describe cómo trabaja, no lo que
  garantiza.
- El inglés es una **versión**, no una traducción. Mismo argumento, escrito por
  alguien que piensa en inglés. Si una frase suena a traducida, reescríbela.

## Antes de terminar

Comprueba que el JSON es válido y que los campos obligatorios están en los dos
idiomas. Si algo no cuadra, arréglalo: un borrador que rompe el panel no lo
revisa nadie.
