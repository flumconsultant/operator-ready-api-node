# De dónde sale lo que la gente busca

Tres fuentes, las tres gratis, ninguna necesita clave ni conectar nada. Se
exportan a mano cada cierto tiempo y el archivo se deja en `automatizacion/`.
El observatorio lo lee solo cada domingo con `node scripts/demanda.mjs`.

El nombre del archivo da igual mientras acabe en `.csv` o `.tsv` y esté en esa
carpeta. Si Windows lo deja como `algo.csv.csv`, también vale: eso ya pasó una
vez y el script no lo encontraba.

---

## Antes que nada: esto no existe en tiempo real

Ningún servicio da volumen de búsqueda en tiempo real. Ni los de pago. Todos los
números son **promedios mensuales con uno o dos meses de retraso**, porque así
los publica Google. Lo único casi inmediato es el autocompletado del buscador y
Google Trends, y ninguno de los dos dice cuánta gente busca algo: dicen qué se
escribe y si sube o baja.

Y hay algo más importante para este caso concreto. Para una consultoría de
estrategia que escribe en español para directivos, **el volumen miente por
abajo**. «¿Cómo se decide qué comprar y qué construir en inteligencia
artificial?» va a salir como 0 o 10 en cualquier herramienta: no porque nadie la
haga, sino porque todas redondean a cero lo que está bajo su umbral, y ahí abajo
vive el cliente entero.

Lo que se compra con esas preguntas no es tráfico. Es que un asistente cite a
BECOME cuando alguien con presupuesto pregunte. **Un cero es ausencia de dato, no
prueba de que nadie lo busque**, y por eso el script las lista aparte en vez de
descartarlas.

---

## 1 · Search Console

Lo más fuerte cuando hay volumen, porque no es la estimación de nadie: son
búsquedas que ocurrieron, con las palabras exactas de quien las escribió.

Su límite: **solo ve aquello para lo que el sitio ya aparece**. Para lo que no
posiciona, es ciega.

1. Search Console → **Rendimiento**
2. Pestaña **Consultas** (no «Páginas»)
3. Rango: **Últimos 3 meses**
4. **Exportar** → **CSV**
5. Del ZIP, el archivo de consultas → `automatizacion/`

Cada dos o tres meses basta. Cuando ese archivo empiece a traer preguntas de
verdad, y no solo la marca, será la señal de que el posicionamiento funciona.

## 2 · Bing Webmaster Tools

Volumen mensual con cifras exactas, sin rangos. Bing es un buscador chico, pero
su volumen se comporta parecido al de Google y no cuesta nada.

1. Entra a **bing.com/webmasters** con la cuenta de Google
2. Si el sitio no está: **Importar de Google Search Console** lo trae en un clic
3. Menú lateral → **Keyword Research**
4. Escribe una pregunta del pilar, filtra por **país** e **idioma**
5. **Exportar** el resultado → el CSV a `automatizacion/`

Es la única de las tres que además sirve para descubrir: propone variantes que
no se te habrían ocurrido.

## 3 · Google Keyword Planner

Volumen de Google, que es el que importa. Cuenta de Google Ads gratis, sin
necesidad de gastar nada.

El detalle: **sin campañas activas muestra rangos** («100 - 1 mil») en vez de
cifras exactas. Para elegir entre dos preguntas sobra.

1. **ads.google.com** → crear cuenta. Cuando insista en crear una campaña, busca
   abajo **«Cambiar al modo experto»** y sáltala. No hace falta poner tarjeta
   para usar el planificador
2. Menú **Herramientas** → **Planificador de palabras clave**
3. **Descubre nuevas palabras clave** → pega dos o tres preguntas del pilar
4. Arriba: **idioma español**, **ubicación Perú** (o los países que interesen)
5. **Descargar ideas de palabras clave** → CSV a `automatizacion/`

Ojo con el archivo: a veces descarga en UTF-16 y abierto en un editor normal
parece corrupto. Da igual, el script lo lee.

---

## Qué hacer con el resultado

```
node scripts/demanda.mjs
```

Devuelve tres listas:

- **Términos con forma de pregunta y señal.** Candidatos directos a entrar en
  `automatizacion/preguntas.md`.
- **Se buscan y nos ven de lejos.** Solo de Search Console: muchas impresiones,
  mala posición. La demanda ya está demostrada y falta la respuesta. Es el hueco
  más barato que existe.
- **Por debajo del umbral.** Preguntas que la herramienta no sabe contar. No se
  descartan por eso.

Si un archivo no se puede leer, lo dice con sus primeras líneas en pantalla en
vez de callarse. Un script que da verde cuando no encontró el dato es peor que
no tenerlo.
