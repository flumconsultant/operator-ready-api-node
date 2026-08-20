# BECOME — Sistema de diseño (React)

La parte visual del sitio de BECOME, como proyecto independiente.

    npm install
    npm run dev

Se abre una página con todas las piezas del sistema: tipografía, bandas,
rejilla, tarjetas, índices, los 173 tokens y los iconos.

## Qué hay

    src/components/   las piezas: ui.jsx es el núcleo
    src/styles/       tokens.css (los 173 tokens), fonts.css y base.css
    public/fonts/     Inter y JetBrains Mono, variables y auto-alojadas
    src/Showcase.jsx  la página que las muestra todas

## Qué NO hay, y por qué

**El nodo 3D.** Son 534 KB de three.js y un shader escrito para este sitio en
concreto; no es una pieza reutilizable.

**Las páginas, el contenido y las rutas.** Esto es el sistema visual, no el
sitio. Las páginas viven en el repositorio de meetbecome.com.

**La cabecera, el pie y los formularios.** Arrastran el mapa del sitio y su
contenido, que no son parte del sistema.

## Las reglas que no se ven en el código

**La proporción de color.** Navy 60 % · verde 20 % · azul hielo 10 % ·
carbón 10 %. El verde es acento: en cuanto se usa para superficies grandes,
la marca deja de parecerse a sí misma.

**Las bandas.** `Section` acepta `dark`, `darker`, `light` y `sunken`. La
alternancia no es decorativa: cada cambio marca un cambio de tema. Dos claras
seguidas se leen como una sola sección larga.

**Sobre navy, solo los grises 100, 200 y 300 son legales para texto.** Los más
oscuros no llegan al contraste mínimo.

**Ningún valor suelto.** Todo sale de `var(--token)`. Si algo necesita un
valor que no existe, el token es lo que falta.

---

Generado con `npm run design:export` desde el repositorio del sitio. No se
edita a mano: se regenera.
