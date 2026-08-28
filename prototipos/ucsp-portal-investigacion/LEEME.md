# Prototipo — Portal de Investigación UCSP

Prototipo navegable del portal que sustituiría a la sección de Investigación de
la Universidad Católica San Pablo. Un solo archivo, sin build ni dependencias:
abre `index.html` en cualquier navegador.

```
open prototipos/ucsp-portal-investigacion/index.html
```

## Qué demuestra

El salto que plantea el documento de requerimientos: de «Dirección de
Investigación → páginas → pestañas → tablas → PDFs» a un portal de entidades
conectadas —**tema ↔ investigador ↔ grupo ↔ proyecto ↔ resultado ↔ patente ↔
capacidad ↔ impacto**— con descubrimiento, validación y activación.

| Vista | Ruta | Qué resuelve |
|---|---|---|
| Home | `#/` | Buscador como producto principal, temas, cifras navegables, destacados. |
| Buscador unificado | `#/buscar?q=…` | Pestañas por entidad, facetas con conteo, orden, chips, URL compartible, estado sin resultados. |
| Catálogo de temas | `#/temas` | Doce temas como entrada al portal. |
| Tema | `#/tema/inteligencia-artificial` | Volumen de actividad y relaciones automáticas. |
| Investigador | `#/investigador/…` | Expertise, ORCID, producción, red de colaboración, disponibilidad. |
| Grupo o centro | `#/grupo/citem` | Líneas, equipo enlazado, proyectos, producción, capacidades, aliados. |
| Proyecto | `#/proyecto/…` | Problema, objetivos, equipo, financiamiento, socios, resultados. |
| Publicación | `#/publicacion/…` | Página HTML propia, autores enlazados, DOI, cita APA/BibTeX/RIS. |
| Patente | `#/patente/…` | Estado, inventores, aplicaciones, transferencia. |
| Capacidad | `#/capacidad/…` | Equipamiento, aplicaciones, responsable, disponibilidad. |
| Impacto | `#/impacto` | Historias con desafío, resultado y evidencia. |
| Convocatorias | `#/convocatorias` | Estados visuales, filtros y archivo. |
| Colaborar | `#/colaborar` | Formulario condicionado por perfil e intención, con responsable y plazo. |
| Preguntar | `#/preguntar` | Capa de IA: respuesta construida solo con entidades del portal, con fuentes. |
| Gestión y gobierno | `#/gobierno` | La capa institucional, ya fuera del escaparate. |

El botón **Ver cobertura RF** de la barra superior abre el mapa de los 134
requerimientos funcionales: 109 están representados; los 25 restantes son
backoffice, integraciones y analítica, que no se resuelven en el front.

## Datos

- **Reales y públicos**: los diez grupos, centros e institutos de investigación
  que la UCSP publica hoy, y las cifras de la sección actual (204 proyectos con
  financiamiento interno, 141 con financiamiento externo, 11 patentes).
- **De demostración**: los catorce investigadores, catorce proyectos, dieciocho
  resultados, cuatro patentes, cinco capacidades, cuatro historias de impacto y
  siete convocatorias. Son ficticios y están escritos para poder probar el
  modelo de entidades y sus relaciones; no describen a personas reales.

## Cómo está hecho

HTML, CSS y JavaScript a mano en un único archivo, con enrutado por hash. El
conjunto de datos vive al principio del `<script>`; el índice de búsqueda, los
sinónimos, la corrección ortográfica y las facetas se construyen a partir de él,
así que cambiar los datos cambia todo el portal.

## Sistema visual

El prototipo aplica el **design system entregado en el handoff**
(`ucsp-investigacion-design-system`), no una dirección propia:

- **Color**: rampa navy con `#283E84` —el único valor cromático verificado del
  sitio, tomado de su `theme-color`— y rampa dorada de acento. Alias semánticos
  del sistema: `text-strong`, `text-body`, `surface-*`, `action-*`.
- **Tipografía**: Source Serif 4 en titulares, Barlow en interfaz, IBM Plex Mono
  en cifras e identificadores. Sentence case en títulos; versalitas reservadas a
  etiquetas de interfaz, botones y eyebrows, como pide el sistema.
- **Componentes**: cabecera navy con el logotipo oficial, `SectionHeading`
  (eyebrow dorado + título + filete de 56×3), `StatBlock` con filete lateral y
  cifra en serif, `Tag` en pastilla, botones en versalitas con radio de 4 px,
  fichas con borde `n-200`, radio 8 px y sombras `xs`/`md`.
- **Fotografía**: las imágenes del handoff se usan donde el diseño las pone —el
  hero y la banda de cifras— incrustadas en el archivo como data URI.
- **Portadas de tema**: cada tema conserva su matiz, pero teñido de navy para que
  toda la familia se lea como una sola marca. Se dibujan en SVG a partir del
  nombre del tema; no hay banco de fotos por tema.

### Desviaciones del sistema, y por qué

Tres pares del sistema no llegan a 4.5:1 en texto pequeño. Están corregidos y
anotados en el CSS:

| Del sistema | Medido | En el prototipo |
|---|---|---|
| `gold-600` como texto sobre blanco (eyebrows, categorías) | 3.27:1 | `gold-700` (4.94:1) |
| Botón dorado con texto blanco sobre `gold-600` | 3.27:1 | `gold-700` (4.94:1); el botón de acento usa navy sobre `gold-500` (6.89:1) |
| `Tag` de acento: `gold-700` sobre `gold-100` | 4.32:1 | `gold-800`, añadido a la rampa |

El sistema tampoco define modo oscuro. El del prototipo se deriva de sus propias
rampas —navy-900 de fondo, navy-100 de texto, gold-400 de acento— y se mide
aparte.

## Qué falta para que esto sea el portal

- Fuente de datos real: sistema interno de investigación, ORCID, Crossref/DOI y
  repositorio institucional.
- Backoffice editorial (RF-116 a RF-134) con flujo borrador → revisión →
  publicado y responsable editorial por registro.
- SEO/GEO servido desde el servidor: URL por entidad sin `#`, datos
  estructurados `Person`, `Organization`, `ScholarlyArticle`, `Dataset`.
- Analítica de descubrimiento, engagement y conversión.
