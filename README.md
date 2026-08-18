# Become — sitio web

Sitio de Become en React. Nació como maqueta de artboards Durable y se migró a
componentes; el sistema de tokens no cambió de sitio.

## Ejecutar

```
npm install
npm run dev        # servidor de desarrollo en :5173
npm run build      # build de producción en dist/
npm run preview    # sirve dist/ para comprobar el build
```

## Cómo está montado

| Carpeta | Qué hay |
|---|---|
| `tokens/*.css` | El sistema de diseño. Fuente de verdad de color, tipografía, espaciado, patrones y motion. |
| `src/site.js` | El mapa del sitio: rutas, menú y pie. Una sola fuente para los tres. |
| `src/routes.jsx` | Las rutas del router, con redirecciones desde la maqueta anterior. |
| `src/pages/` | Una página por ruta. Las nuevas están escritas a mano; las que quedan de la primera maqueta se siguen generando desde los artboards. |
| `src/content/` | Contenido separado del componente — hoy, las seis páginas de casos de uso. |
| `src/components/` | Cabecera, pie, `Reveal` y `RouteLoader`. |
| `src/components/ai-node/` | El nodo 3D de la home: los cinco estados en `states.js`, el recorrido de cámara en `camera-path.js`, el canvas en `AiNode.jsx`, la capa y la carga diferida en `AiNodeStage.jsx`. |
| `src/styles/global.css` | Lo que en los artboards vivía repetido en el `<helmet>` de cada uno. |
| `assets/` | Imágenes, iconos, logo y fuentes. Vite lo sirve como `publicDir`, así que las rutas son `/images/…`, `/icons/…`, `/logo/…`, `/fonts/…`. |
| `templates/website-es/` | Los artboards Durable originales. Siguen siendo el origen de la migración. |

### Estado de la migración al documento de estrategia

La arquitectura del documento v2.0 está montada: menú de cinco entradas con dos
desplegables, rutas `/es/…`, footer de cinco columnas y la home con su journey
canónico. Lo que todavía arrastra copy de la primera maqueta:

| Ruta | Estado |
|---|---|
| `/es/framework` · `/es/nosotros` · `/es/insights` · `/es/contacto` | Artboard migrado, en su URL definitiva. Copy pendiente. |
| `/es/servicios/transformation-discovery` · `/es/servicios/build-and-embed` | Igual. |
| `/es/privacidad` · `/es/terminos` | Estructura lista, texto legal pendiente de asesoría. |
| Versión inglesa | Sin empezar. |

### La migración desde Durable

`npm run migrate:dc` regenera `src/pages/` y `src/components/` desde
`templates/website-es/*.dc.html`. Convierte el formato Durable a JSX: `style=""`
a objetos de estilo, `style-hover` a una hoja de `:hover` generada, `sc-if` a
condicionales, `dc-import` a componentes, `data-reveal` al componente `Reveal`,
y los enlaces `./PaginaX.dc.html` a rutas del router.

Esto significa que **los ficheros de `src/pages/` y `src/components/` no se
editan a mano**: se sobreescriben en cada regeneración. Mientras los artboards
sigan siendo el origen, los cambios de maquetación van ahí. Lo que sí es código
propio y editable: `src/App.jsx`, `src/main.jsx`, `src/components/Reveal.jsx`,
`src/styles/` y los tokens.

Cuando los artboards se retiren, se borra el script y `src/` pasa a ser el
origen. Ese es el final previsto de la migración, no un estado permanente.

## El nodo 3D de la home

Una red de partículas en WebGL, fija detrás de la home, que cambia de forma
según por dónde vas leyendo. Los cinco estados no son decorativos: cada uno es
la sección que tiene detrás.

| Sección | Estado |
|---|---|
| Hero — *Become what comes next* | Núcleo denso |
| *La IA está en todas partes. La reinvención, no.* | Disperso, sin aristas |
| *The transformation happens inside* | Cuatro clústeres: people, data, agents, operations |
| *El framework BECOME™ — seis etapas* | Espina de seis nodos |
| *¿En qué debe convertirse tu empresa después?* | Vuelve a converger |

Los estados van anclados a secciones concretas con `data-node-state` en el
artboard, no a porcentajes de scroll: si mañana crece una sección, el nodo
sigue cuadrando con el texto. Las cinco anclas caen en secciones navy a
propósito — las claras tapan la capa 3D.

**El canvas pinta el fondo de la página entera**, no solo las partículas: las
bandas de color de cada sección (los tokens anotados en `data-band`) y el nodo
encima. Por eso el nodo no se interrumpe al cruzar una sección clara — lo que
cambia es el suelo, y con él la tinta: verde sobre navy, navy sobre claro, y
mucho más tenue en claro para no ensuciar el texto. **La cámara hace un plano secuencia** sobre el documento entero (`camera-path.js`,
diez planos interpolados con Catmull-Rom): picados, contrapicados, tres cuartos
por los dos lados, horizonte inclinado y focal de 50 a 76 mm. Va sobre el
progreso de la página, no sobre los estados de forma, así que hay cambio de
plano en todas las secciones.

La cámara **no entra** en la nube principal: se probó y a esa distancia una
partícula ocupa media pantalla y el texto deja de leerse. La sensación de
viajar por dentro la da una segunda capa de polvo que sí envuelve a la cámara y
se recoloca por delante cuando queda atrás — un volumen aparentemente infinito
con 900 motas.

Las transiciones entre formas van escalonadas por partícula y en arco, no en
línea recta: la forma se deshace y se recompone en vez de deslizarse como un
bloque.

Para que se vea, `:root[data-ai-node="on"]` deja transparentes html, body, el
contenedor de página y todas las secciones (ver `global.css`). Esa marca solo la pone `AiNodeStage` **cuando el contexto WebGL
existe de verdad**, así que sin WebGL, sin el chunk o con
`prefers-reduced-motion`, la home se ve exactamente como antes: fondos navy
sólidos y la foto del hero.

`three.js` son 132 KB gzip en su propio chunk, que solo se descarga en la home
y solo cuando el navegador está ocioso. La carga inicial de la home no cambia.

## Cabecera y carga de rutas

La barra se retira al bajar y vuelve al subir, con un umbral de 6px para que el
rebote del trackpad no la haga parpadear. Nunca se esconde con el menú móvil
abierto. El estado vive en `data-header-hidden` sobre `<html>`; la transición,
en `global.css`.

`RouteLoader` es lo que se ve mientras se descarga el chunk de una página:
el isotipo de Become con su barra verde barriendo. Aparece con 180 ms de
retraso, así que en una conexión normal no llega a verse — solo cuando la
espera es real. El `<Suspense>` lleva `key={pathname}` a propósito: React 19
trata la navegación como una transición y mantendría la pantalla anterior en
vez de mostrar el fallback.

## API

`index.js` es un ejemplo de API en Express, sin relación con el sitio.
`npm start` lo arranca.
