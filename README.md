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

## API

`index.js` es un ejemplo de API en Express, sin relación con el sitio.
`npm start` lo arranca.
