# Indexación y redirecciones · 23 de agosto de 2026

## Antes de nada: los documentos que este encargo daba por existentes

El encargo pedía leer `conocimiento/00-MASTER-HANDOFF.md`,
`04-EQUIVALENCIAS-ES-EN.md`, `05-SEO-QA-ESTADO-ACTUAL.md`,
`06-VOZ-TONO-Y-REGLAS.md` y `07-CRAWL-RAW-2026-08-22.json`.

**Ninguno de los cinco existe en este repositorio.** La carpeta `conocimiento/`
se crea con este documento. Lo que sí hay, y es de donde salió el criterio:

| Lo que pedía el encargo | Lo que hay aquí |
|---|---|
| Master handoff | `docs/CATALOGO.md` y este documento |
| Equivalencias ES–EN | `src/seo-meta.js` (mapa `PAGES`, que genera los hreflang) |
| Estado del SEO | `scripts/gate-seo.mjs`, `scripts/auditar-seo.mjs` |
| Voz y tono | `src/content/conocimiento/voz.json`, `automatizacion/redaccion.md` |
| Crawl del 22 de agosto | no existe; se midió sobre `dist/` recién compilado |

Se dice aquí porque un informe que cita fuentes que no existen no se puede
auditar, y porque quien retome esto mañana buscará esos archivos.

## Diagnóstico

Sitio: Vite + React con enrutador propio, prerenderizado a HTML estático. Cada
ruta se compila a `dist/_pages/<ruta>.html` con su cabecera —título,
descripción, canonical, hreflang y datos estructurados— y el servidor la sirve
bajo la URL real mediante una reescritura de Apache. El sitemap, el robots y los
feeds los genera `scripts/seo.mjs`. El despliegue es un workflow de GitHub
Actions que sube por FTP a Hostinger.

Estado medido el 23 de agosto de 2026 sobre el build:

| | |
|---|---|
| Páginas compiladas | 92 |
| URLs en el sitemap | 92, sin repetidas |
| Canonicals autorreferentes | 92 de 92 |
| Pares de hreflang recíprocos | 92 de 92 |
| Páginas con exactamente un H1 | 92 de 92 |
| Enlaces internos a direcciones viejas | 0 |
| **Títulos con la marca duplicada** | **12** |

Son 92 y no las 90 de la inspección de Search Console porque desde entonces se
publicaron dos artículos. Ninguna de las 90 desapareció.

### Lo único que estaba roto

Doce páginas de casos de uso publicaban el título con la marca dos veces:

```
Agentes de IA con control | BECOME | BECOME
Escalar pilotos de IA a producción | BECOME | BECOME
…y diez más
```

La causa no era el contenido. `soluciones.json` guarda un `seoTitulo` escrito a
mano que ya termina en « | BECOME», y el generador de `scripts/seo.mjs` le
pegaba la marca detrás sin mirar si ya estaba.

## Lo que se cambió

### 1. El generador de títulos, no los doce textos

`scripts/seo.mjs`, función `tituloConMarca`: si el texto ya contiene la marca,
no se le añade otra.

Se arregla ahí y no en el contenido porque el `seoTitulo` se edita desde el
panel: quien lo escriba puede poner la marca o no ponerla, y ninguna de las dos
decisiones debería producir un título roto. Cambiar los doce textos arreglaba
hoy; cambiar el generador arregla también el que se escriba mañana.

Resultado tras recompilar: **0 títulos con marca duplicada**, y ninguno quedó
cortado con puntos suspensivos por el cambio.

### 2. Las redirecciones, que ya estaban

No se tocaron: se comprobaron. Están en `assets/.htaccess`, línea 144, escritas
como `RewriteRule … [R=301,L]` y colocadas **antes** de la regla que sirve las
cabeceras por ruta.

Esto ya se corrigió el 22 de agosto y el motivo conviene no perderlo:
originalmente eran `RedirectMatch`, que ejecuta `mod_alias`, mientras que la
reescritura del sitio la ejecuta `mod_rewrite`. Cuál de los dos actúa primero lo
decide el servidor, no el orden del archivo, y cuando ganaba la reescritura la
dirección vieja respondía **200 con la página nueva dentro** en vez de 301. Al
escribirlas en el mismo módulo, el orden del archivo pasa a mandar.

Las ocho reglas cubren también la forma con barra final (`/?$`), así que
`/es/industrias/servicios-financieros/` redirige en un solo salto y no encadena
con la regla de barra final que viene después. Los parámetros de consulta se
conservan: `mod_rewrite` los arrastra solo cuando la sustitución no lleva `?`,
y ninguna de las ocho lo lleva.

### 3. Un guardián nuevo: `scripts/qa-indexacion.mjs`

Corre en el despliegue, después de compilar y **antes de subir**. Comprueba
sobre el HTML que se va a publicar:

- el sitemap: sin repetidas, sin parámetros, sin ninguna dirección vieja, y con
  una página compilada detrás de cada entrada;
- un canonical por página y apuntándose a sí misma;
- ningún `noindex`;
- exactamente un H1;
- la marca una sola vez en el título;
- ni un enlace interno hacia las ocho direcciones viejas;
- las quince pendientes: en el sitemap **y** enlazadas desde su índice con un
  enlace de HTML;
- el límite clínico de la página de salud, en los dos idiomas.

Se le hicieron nueve sabotajes —marca duplicada, canonical hacia otra página,
`noindex`, dos H1, enlace a una dirección vieja, dirección vieja en el sitemap,
sitemap con una repetida, página anunciada y no enlazada, límite clínico
borrado— y los detectó los nueve, sin dar ningún falso positivo sobre el build
correcto. Un guardián que no se ha intentado engañar no es un guardián.

Lo que **no** puede comprobar es la respuesta del servidor. Los 301, los 200 y
las cadenas solo existen con un servidor delante: eso lo mide
`scripts/verificar-redirects.mjs`, que ya corría en el despliegue después de
subir.

## Archivos modificados

| Archivo | Qué |
|---|---|
| `scripts/seo.mjs` | `tituloConMarca` deja de duplicar la marca |
| `scripts/qa-indexacion.mjs` | nuevo: el guardián de indexación |
| `.github/workflows/deploy.yml` | ejecuta el guardián antes de subir |
| `conectores/linkedin/conector.json`, `docs/CATALOGO.md` | declaran `LINKEDIN_MEMBER_ID` |
| `conocimiento/08-…md` | este documento |

No se tocó: ni una URL, ni un slug, ni el copy aprobado, ni los H1, ni la
arquitectura bilingüe, ni el límite clínico de salud.

## Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `npx vite build` | correcto |
| `node scripts/seo.mjs` | 92 páginas · 92 URLs en el sitemap |
| `node scripts/prerender.mjs` | 82 páginas con su texto dentro del HTML |
| `node scripts/qa-indexacion.mjs` | sin hallazgos |
| `node scripts/gate-seo.mjs` | 8 comprobaciones en verde · 0 fallos |
| `node scripts/qa-lenguaje.mjs` | sin palabras importadas ni anglicismos |
| `node scripts/qa-english.mjs` | sin lenguaje genérico ni español colado |
| `node scripts/catalogo.mjs` | cuadra con el repositorio |
| `node scripts/validar-articulo.mjs` (5 artículos) | 4 correctos, 1 aviso de título largo |

**No hay linter configurado** en este repositorio: `package.json` no declara
ningún script de lint. Decirlo es más útil que inventar una ejecución.

Las comprobaciones HTTP **no se ejecutaron desde aquí**: este entorno no tiene
salida a internet. Corren en el despliegue, contra el sitio ya publicado, con
`scripts/verificar-redirects.mjs`.

## Las quince URLs para pedir indexación a mano en Search Console

Ninguna se eliminó, consolidó ni redirigió. Las quince están en el sitemap y
enlazadas desde su índice, comprobado sobre el HTML compilado.

**Descubiertas, todavía sin rastrear**

1. `/es/casos-de-uso/escalar-ia`
2. `/es/casos-de-uso/redisenar-procesos-criticos`
3. `/en/use-cases/scale-ai-beyond-pilots`
4. `/es/servicios/become-now/operaciones`
5. `/es/servicios/become-now/project-management-pmo`

**Todavía desconocidas para Google**

6. `/es/nosotros`
7. `/es/industrias/banca-seguros-fintech`
8. `/es/industrias/mineria-energia`
9. `/es/industrias/retail-consumo-masivo`
10. `/es/industrias/turismo-hoteleria`
11. `/en/use-cases/redesign-critical-workflows`
12. `/es/servicios/become-now/recursos-humanos`
13. `/es/servicios/become-now/legal-compliance-risk`
14. `/es/servicios/become-now/data-analytics`
15. `/en/services/become-now/data-analytics`

## Qué hacer en Search Console después del despliegue

1. Inspeccionar cada una de las quince y pulsar **Solicitar indexación**. Hay un
   límite diario de peticiones; si se agota, se continúa al día siguiente.
2. El sitemap que se reenvía es `https://meetbecome.com/sitemap.xml`, **una sola
   vez**. Reenviarlo repetidamente no acelera nada.
3. No se implementó ningún atajo: no hay API general para pedir indexación, y la
   Indexing API está reservada a ofertas de empleo y retransmisiones en directo.
   Usarla para otra cosa es motivo de sanción.

Que una página sea técnicamente indexable no obliga a Google a indexarla.
Rastrear cuesta, y decide él en qué lo gasta. Lo que sí depende de nosotros
—responder 200, un canonical honesto, un H1, hreflang recíprocos y un enlace
desde una página que ya se rastrea— está cumplido y ahora se comprueba solo en
cada despliegue.

## Pendiente, y no es de este encargo

El título `Cómo rediseñar un proceso para que lo ejecute una IA` mide 52
caracteres y el guardián editorial pide 51 o menos, porque con « | BECOME»
detrás Google lo cortaría. El artículo es anterior a esa regla. Arreglarlo pide
acortar el titular sin tocar la dirección, y eso es una decisión editorial.
