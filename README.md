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
| `src/pages/` | Una página por ruta, generadas desde los artboards. |
| `src/components/` | Cabecera, pie y `Reveal`. |
| `src/components/ai-node/` | El nodo 3D de la home: los cinco estados en `states.js`, el canvas en `AiNode.jsx`, la capa y la carga diferida en `AiNodeStage.jsx`. |
| `src/styles/global.css` | Lo que en los artboards vivía repetido en el `<helmet>` de cada uno. |
| `assets/` | Imágenes, iconos, logo y fuentes. Vite lo sirve como `publicDir`, así que las rutas son `/images/…`, `/icons/…`, `/logo/…`, `/fonts/…`. |
| `templates/website-es/` | Los artboards Durable originales. Siguen siendo el origen de la migración. |

### La migración

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

Para que se vea, `:root[data-ai-node="on"]` abre los fondos oscuros (ver
`global.css`). Esa marca solo la pone `AiNodeStage` **cuando el contexto WebGL
existe de verdad**, así que sin WebGL, sin el chunk o con
`prefers-reduced-motion`, la home se ve exactamente como antes: fondos navy
sólidos y la foto del hero.

`three.js` son 132 KB gzip en su propio chunk, que solo se descarga en la home
y solo cuando el navegador está ocioso. La carga inicial de la home no cambia.

## API

`index.js` es un ejemplo de API en Express, sin relación con el sitio.
`npm start` lo arranca.
