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

### 2b. Las credenciales del correo del formulario

En la misma pantalla, otros **dos secretos** más. Son los que permiten que lo
que alguien escriba en el formulario del sitio llegue a una bandeja de entrada:

- `MAIL_USER` — la dirección completa del buzón desde el que se envía, por
  ejemplo `formularios@meetbecome.com`. Tiene que ser una cuenta de correo
  real creada en hPanel → **Correos**, no un alias ni un reenvío: necesita
  poder autenticarse contra el servidor de salida.
- `MAIL_PASSWORD` — la contraseña de ese buzón.

Y tres **variables** (pestaña *Variables*, no *Secrets*). Sin ellas se usan
estos valores:

| Variable | Por defecto | Para qué |
|---|---|---|
| `MAIL_HOST` | `smtp.hostinger.com` | El servidor de salida, si el correo no está en Hostinger |
| `MAIL_PORT` | `465` | El puerto de SMTP con TLS |
| `MAIL_TO` | el mismo `MAIL_USER` | La bandeja donde se leen los avisos |

**Usa dos direcciones distintas: una que envía y otra que recibe.** Es la
diferencia entre que los avisos lleguen a la bandeja o a spam.

Al principio ambas eran `hello@meetbecome.com` y los mensajes acababan en
spam. Un correo cuyo remitente y destinatario son la misma dirección es
exactamente el patrón que usa el fraude para fingir que escribe desde dentro
de la empresa, y los filtros lo tratan en consecuencia.

La dirección del remitente **tiene que estar en el dominio del sitio** —si no,
el SPF y la firma DKIM no cuadran y el problema es mucho peor— pero no tiene
por qué ser la misma que lee los mensajes:

- `MAIL_USER` = `formularios@meetbecome.com` — un buzón dedicado a enviar
- `MAIL_TO` = `hello@meetbecome.com` — donde se leen

Evita nombres tipo `noreply@`: algunos filtros los penalizan.

En cada despliegue, estos valores se escriben en `api/config.php` dentro del
servidor. Ese archivo **no está en el repositorio** y no se puede leer desde
fuera: PHP lo ejecuta en vez de mostrarlo, y además hay una regla en
`api/.htaccess` que bloquea el acceso directo por si algún día PHP se
desactivara.

Si cambias la contraseña del buzón, actualiza el secreto y vuelve a lanzar el
despliegue: hasta que no se despliegue de nuevo, el servidor sigue con la
contraseña anterior y el formulario deja de enviar.

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

**El sitio no aparece, pero el despliegue dice que fue bien.**
Mira en el registro del despliegue la línea `Subiendo a:`. Si dice `public_html`
y en hPanel ves `public_html/public_html`, la cuenta FTP ya apuntaba dentro.
Crea una **variable** llamada `FTP_DIR` con valor `.` y vuelve a lanzarlo.

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
