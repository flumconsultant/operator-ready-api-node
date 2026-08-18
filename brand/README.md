# Originales de marca

Aquí viven los archivos de identidad que **no** se publican en el sitio:
originales en PNG a tamaño completo, las variantes del isotipo y el manual de
marca.

## Por qué están fuera de `assets/`

Todo lo que hay en `assets/` se copia tal cual a la web. Estos archivos estaban
ahí sin que ninguna página los usara, y pesaban 8,6 MB de los 13 MB del sitio:
se subían enteros en cada despliegue, a un hosting que ya nos limita las
conexiones, y `brand-guidelines.png` quedaba además accesible para cualquiera
que acertara la URL.

No se han borrado porque son los originales: aquí siguen versionados, listos
para exportar de ellos las piezas que el sitio sí necesita.

## Lo que el sitio usa de verdad

Vive en `assets/logo/` y son tres archivos:

| Archivo | Dónde |
|---|---|
| `wordmark-white.webp` | La cabecera y la capa del formulario |
| `favicon.svg` | El icono de la pestaña |
| `icon-white.svg` | El logo declarado en los datos estructurados |

Si añades uno nuevo a `assets/logo/`, comprueba antes que alguna página lo
referencie: lo que no se referencia solo suma peso.
