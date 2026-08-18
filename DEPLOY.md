# Cómo publicar el sitio BECOME en Hostinger

## Qué es este sitio

El sitio vive en `templates/website-es/` y está hecho con el formato `.dc.html`
(runtime `support.js` + design system `_ds_bundle.js`). Es un **sitio estático**:
HTML, CSS, JS y assets. **No es WordPress** y **no necesita Node.js en el servidor**.

La carpeta `dist/` es ese mismo sitio ya preparado para subir: rutas corregidas,
nombres de página limpios y `index.html` como portada.

## Contenido de `dist/`

| Archivo | URL final |
|---|---|
| `index.html` | `midominio.com/` |
| `framework.html` | `midominio.com/framework.html` |
| `trabajo.html` | `midominio.com/trabajo.html` |
| `thinking.html` | `midominio.com/thinking.html` |
| `nosotros.html` | `midominio.com/nosotros.html` |
| `contacto.html` | `midominio.com/contacto.html` |
| `discovery.html` | `midominio.com/discovery.html` |
| `build.html` | `midominio.com/build.html` |
| `SiteHeaderEs.dc.html`, `SiteFooterEs.dc.html` | componentes, no se visitan directamente |
| `support.js`, `ds-base.js`, `_ds_bundle.js`, `styles.css`, `tokens/`, `assets/` | recursos |

## Subirlo (WordPress ya instalado)

WordPress ocupa `public_html`. Elige una opción:

### Opción 1 — El sitio estático es la web principal (recomendado)

1. hPanel → **Sitios web → Panel → Administrador de archivos**.
2. Haz respaldo de WordPress si quieres conservarlo (Archivos → Copias de seguridad).
3. Vacía `public_html` (borra `wp-admin`, `wp-content`, `wp-includes`, `wp-*.php`, `index.php`, `.htaccess` de WP).
4. Sube **el contenido de `dist/`** (no la carpeta, su contenido) dentro de `public_html`.
5. Comprueba `https://midominio.com` → debe cargar la portada.

Para desinstalar WordPress limpiamente: hPanel → **Auto Installer** → tu instalación → **Eliminar**.

### Opción 2 — Conservar WordPress y publicar el sitio en un subdirectorio

1. Crea `public_html/become/`.
2. Sube ahí el contenido de `dist/`.
3. Queda en `https://midominio.com/become/`.

Funciona sin cambios: las rutas de `dist/` son relativas.

## Cómo subir los archivos

- **Administrador de archivos (más fácil):** comprime `dist/` en `.zip`, súbelo y usa *Extraer*.
- **FTP:** hPanel → *Archivos → Cuentas FTP*, conecta con FileZilla y arrastra el contenido.

## Notas importantes

- El sitio se renderiza en el navegador y carga **React 18 desde `unpkg.com`** en tiempo de
  ejecución (`support.js`). Necesita internet abierto hacia unpkg; si unpkg falla, la página
  queda en blanco. Para producción seria conviene descargar React/ReactDOM a `assets/vendor/`
  y apuntar `support.js` ahí.
- Por lo mismo, el HTML inicial va vacío: **el SEO es limitado**, los buscadores ven la página
  sin contenido hasta ejecutar JS.
- Las fuentes vienen de Google Fonts (`fonts.googleapis.com`).
- `index.js` de la raíz es una API Express de ejemplo. **El hosting compartido de Hostinger no
  ejecuta Node.js**; si algún día la necesitas, va en un VPS o en un servicio aparte.

## Regenerar `dist/` tras editar las plantillas

```bash
rm -rf dist && mkdir -p dist
cp -r assets tokens styles.css _ds_bundle.js dist/
cp templates/website-es/{support.js,ds-base.js,SiteHeaderEs.dc.html,SiteFooterEs.dc.html} dist/
cp templates/website-es/WebsiteEs.dc.html       dist/index.html
cp templates/website-es/PaginaContacto.dc.html  dist/contacto.html
cp templates/website-es/PaginaFramework.dc.html dist/framework.html
cp templates/website-es/PaginaTrabajo.dc.html   dist/trabajo.html
cp templates/website-es/PaginaThinking.dc.html  dist/thinking.html
cp templates/website-es/PaginaNosotros.dc.html  dist/nosotros.html
cp templates/website-es/PaginaDiscovery.dc.html dist/discovery.html
cp templates/website-es/PaginaBuildEmbed.dc.html dist/build.html
cd dist && sed -i \
 -e 's#\.\./\.\./assets/#./assets/#g' \
 -e 's#\./WebsiteEs\.dc\.html#./index.html#g' \
 -e 's#\./PaginaContacto\.dc\.html#./contacto.html#g' \
 -e 's#\./PaginaFramework\.dc\.html#./framework.html#g' \
 -e 's#\./PaginaTrabajo\.dc\.html#./trabajo.html#g' \
 -e 's#\./PaginaThinking\.dc\.html#./thinking.html#g' \
 -e 's#\./PaginaNosotros\.dc\.html#./nosotros.html#g' \
 -e 's#\./PaginaDiscovery\.dc\.html#./discovery.html#g' \
 -e 's#\./PaginaBuildEmbed\.dc\.html#./build.html#g' \
 *.html
sed -i "s#const base = '\.\./\.\.';#const base = '.';#" ds-base.js
```

## Probar en local antes de subir

```bash
cd dist && python3 -m http.server 8080
# abre http://localhost:8080
```
