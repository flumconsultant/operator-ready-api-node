# Despliegue a Hostinger

El sitio es una SPA estática: se compila aquí y lo que se publica es el
contenido de `dist/`. Hostinger no ejecuta nada, solo sirve archivos.

Cada push a `main` (o a la rama de trabajo) compila y sube el resultado por
FTPS. No hay que tocar el servidor a mano.

---

## Puesta en marcha — una sola vez

### 1. Crear la cuenta FTP en hPanel

hPanel → **Archivos → Cuentas FTP**. Anota tres datos:

| Dato | Dónde sale | Ejemplo |
|---|---|---|
| Servidor FTP | En la misma pantalla | `ftp.meetbecome.com` o `82.180.xxx.xxx` |
| Usuario | El de la cuenta FTP | `u123456789` |
| Contraseña | La que definas al crearla | — |

Usa una **cuenta FTP dedicada al despliegue**, no la principal de la cuenta de
Hostinger. Si algún día hay que revocarla, se revoca esa y nada más.

### 2. Guardar las credenciales en GitHub

En el repositorio: **Settings → Secrets and variables → Actions → New
repository secret**. Tres secretos, con estos nombres exactos:

- `FTP_HOST`
- `FTP_USER`
- `FTP_PASSWORD`

Son secretos, no variables: GitHub los cifra y los oculta en los registros.
Nunca van dentro de un archivo del repositorio.

### 3. Apuntar el dominio

hPanel → **Dominios**. `meetbecome.com` tiene que apuntar a este hosting y con
la raíz del documento en `public_html`. Si el dominio se compró en Hostinger,
ya lo está. Si está en otro registrador, hay que cambiar los DNS a los
servidores de nombres que indica hPanel — tarda entre minutos y 24 horas.

Activa también el **SSL gratuito** (hPanel → Seguridad → SSL). Sin certificado,
la redirección a HTTPS del `.htaccess` deja el sitio inaccesible.

### 4. Lanzar el primer despliegue

Pestaña **Actions → Desplegar a Hostinger → Run workflow**. O simplemente haz
un push.

---

## Qué hace el despliegue, exactamente

1. Instala dependencias y compila (`npm run build`).
2. Genera `sitemap.xml` y `robots.txt` a partir de las rutas reales.
3. Comprueba que `dist/` lleva `index.html`, `.htaccess`, sitemap y robots.
   Si falta alguno, **para y no sube nada**.
4. Sube por FTPS a `public_html`:
   - `assets/` (el bundle con hash) se sincroniza **con borrado**: esa carpeta
     es exclusivamente nuestra y si no se limpia acumula los bundles de todos
     los despliegues anteriores para siempre.
   - El resto se sube **sin borrar**, a propósito. Si hay algo más en
     `public_html` puesto a mano —un archivo de verificación de dominio, una
     carpeta de correo— borrarlo desde aquí sería destruir trabajo que este
     repositorio desconoce.

---

## Si algo va mal

**Todas las páginas menos la home dan 404.**
No llegó el `.htaccess`. Está en `assets/.htaccess` y Vite lo copia a `dist/`,
pero algunos clientes FTP ignoran los archivos ocultos. Compruébalo en hPanel →
Administrador de archivos, activando "mostrar archivos ocultos".

**El despliegue falla con un error de certificado TLS.**
El certificado FTP de Hostinger puede no validar contra las autoridades del
runner. Crea una **variable** (no un secreto) llamada `FTP_TLS_RELAJADO` con
valor `true`. El tráfico sigue cifrado, pero deja de comprobarse que el
servidor es quien dice ser: es un apaño aceptable en una red de confianza, no
una solución.

**Se ve la versión anterior después de desplegar.**
`index.html` se sirve sin caché justamente para que esto no pase. Si ocurre, es
la caché de Hostinger: hPanel → Rendimiento → **Vaciar caché**.

**El formulario no envía nada.**
Correcto, y es lo esperado: no hay backend. Los formularios lo dicen en pantalla
y remiten a `hello@meetbecome.com`. Conectarlos es un trabajo aparte.

---

## Lo que este despliegue todavía no resuelve

- **Metaetiquetas por página.** El servidor devuelve el mismo `index.html` para
  las 32 URLs, así que el título, la descripción y el canonical son los de la
  home en todas. Los buscadores ejecutan JavaScript y ven el contenido real,
  pero al compartir cualquier página en LinkedIn o WhatsApp saldrá siempre la
  tarjeta de la home. Se arregla con prerenderizado.
- **Versión en inglés.** El selector ES/EN apunta a `/en`, que no existe.
- **Content-Security-Policy.** Deliberadamente ausente: mal escrita rompe el
  sitio en silencio.
