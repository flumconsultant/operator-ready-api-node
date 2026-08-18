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
| `src/pages/` | Una página por ruta, todas escritas a mano. |
| `src/content/` | Contenido separado del componente: las seis páginas de casos de uso y los catorce programas de BECOME NOW™. |
| `src/components/` | Cabecera, pie, `Reveal` y `RouteLoader`. |
| `src/components/ai-node/` | El nodo 3D de la home: los cinco estados en `states.js`, el recorrido de cámara en `camera-path.js`, el canvas en `AiNode.jsx`, la capa y la carga diferida en `AiNodeStage.jsx`. |
| `src/styles/global.css` | Lo que en los artboards vivía repetido en el `<helmet>` de cada uno. |
| `assets/` | Imágenes, iconos, logo y fuentes. Vite lo sirve como `publicDir`, así que las rutas son `/images/…`, `/icons/…`, `/logo/…`, `/fonts/…`. |
| `templates/website-es/` | Los artboards Durable originales. Ya no se usan; se conservan como referencia. |

### Estado frente al documento de estrategia

La arquitectura y el copy del documento v2.0 están implementados en español,
más el tercer servicio (BECOME NOW™): menú de cinco entradas con dos
desplegables —uno de ellos con un tercer nivel de catorce programas—, 35 rutas
`/es/…`, footer de seis columnas, la home con su journey canónico y todas las
páginas escritas.

Lo que queda pendiente, y por qué:

| Pendiente | Motivo |
|---|---|
| Texto de Privacidad y Términos | Lo redacta asesoría legal. Las páginas existen y lo dicen. |
| Biografías del equipo (Nosotros) | No se inventan personas, cargos ni partnerships. |
| Artículos de Insights | La página está lista; todavía no hay nada publicado y se dice. |
| Destino del formulario de contacto | No hay backend. La confirmación avisa de que el mensaje no ha salido. |
| Versión inglesa | Sin empezar. |

### La maqueta original

`templates/website-es/` son los artboards Durable de los que salió la primera
versión. Ya no se usan: todas las páginas están escritas a mano. Se conservan
como referencia de diseño y como historial de dónde vino esto. El conversor
`scripts/dc-to-jsx.mjs` se retiró al quedarse sin trabajo — si necesitas
recuperarlo, está en el historial de git.

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
