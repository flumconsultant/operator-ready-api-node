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

Dirección de arte trabajada con la skill de UX del repositorio: patrón
*marketplace/directory* (la búsqueda es la acción principal, las categorías son
visuales) sobre una retícula editorial.

- **Color**: azul institucional profundo `#0E2C52`, interactivo `#1A5399`, acento
  cálido de sillar `#A5651F`, neutros con sesgo frío. Modo claro y oscuro
  diseñados por separado.
- **Tipografía**: EB Garamond para titulares, IBM Plex Sans para interfaz e IBM
  Plex Mono para cifras, identificadores y etiquetas de tipo.
- **Portadas generadas**: no hay banco de fotos. Cada tema tiene un matiz propio
  y una portada dibujada en SVG a partir de su nombre —curvas de nivel, red de
  nodos, ondas, trama de puntos, celosía de sillar o arcos—. El mismo tema dibuja
  siempre la misma portada, y ese color lo acompaña en tarjetas, etiquetas,
  avatares y miniaturas de resultados.
- **Hero**: malla de nodos y aristas en canvas —las entidades y sus relaciones—
  que se detiene al salir de pantalla y no se anima con `prefers-reduced-motion`.
- **Datos como imagen**: producción por año en barras con valor etiquetado, red
  de colaboración en SVG, cifras de impacto en grande.
- **Movimiento**: aparición escalonada de las rejillas al entrar en pantalla,
  elevación de 2-3 px al pasar el cursor, 180 ms. Todo se desactiva con
  `prefers-reduced-motion`.
## Accesibilidad y calidad de interacción

Auditado contra el checklist de la skill de UX y verificado en Chromium, en modo
claro y oscuro:

- **Contraste AA medido**, no estimado: los estados «cierra pronto», «cerrada» y
  «finalizado» fallaban a 12 px; el acento cálido pasó a `#95591A` y el neutro a
  `#556781` para que texto y botones superen 4.5:1 en ambos temas.
- **Jerarquía de encabezados** sin saltos: un solo `h1` por vista y encabezados de
  apoyo para lectores de pantalla donde la retícula no tenía uno visible.
- **Teclado**: el buscador global se recorre con flechas, Inicio/Fin y Enter
  (`aria-activedescendant`); al cambiar de vista el foco entra en el contenido;
  `scroll-padding-top` evita que la cabecera fija tape el elemento enfocado.
- **Formulario**: campos obligatorios marcados, validación al salir del campo
  (nunca al teclear), error junto al campo con `aria-invalid` y resumen enlazado
  al inicio que recibe el foco tras un envío fallido.
- **Objetivos táctiles**: 44 px con puntero grueso, 16 px en los campos en móvil
  para que iOS no haga zoom, y enlaces de pie y migas con área ampliada.
- **Iconos SVG** de una sola familia (nunca emoji), decorativos ocultos al lector
  de pantalla; gráficos con `role="img"` y descripción; sin scroll horizontal a
  390 px.

## Qué falta para que esto sea el portal

- Fuente de datos real: sistema interno de investigación, ORCID, Crossref/DOI y
  repositorio institucional.
- Backoffice editorial (RF-116 a RF-134) con flujo borrador → revisión →
  publicado y responsable editorial por registro.
- SEO/GEO servido desde el servidor: URL por entidad sin `#`, datos
  estructurados `Person`, `Organization`, `ScholarlyArticle`, `Dataset`.
- Analítica de descubrimiento, engagement y conversión.
