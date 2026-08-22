# Catálogo de conectores

> Generado por `scripts/catalogo.mjs` a partir de `conectores/*/conector.json`.
> No se edita a mano: se edita el manifiesto y se vuelve a generar.

8 conectores · 18 llaves · 1 con fecha de caducidad

## Registro de llaves

| Llave | Conector | Caduca | Cómo se renueva |
| --- | --- | --- | --- |
| `BD_BASE` | base-de-datos | nunca | Panel de Hostinger |
| `BD_CLAVE` | base-de-datos | al-rotarla | Panel de Hostinger |
| `BD_HOST` | base-de-datos | nunca | Panel de Hostinger |
| `BD_USUARIO` | base-de-datos | nunca | Panel de Hostinger |
| `CLAUDE_CODE_OAUTH_TOKEN` | redactor | al-rotarla | claude setup-token |
| `DIFUSION_TOKEN` | base-de-datos | al-rotarla | Se genera y se guarda como secreto del repositorio |
| `FTP_HOST` | hostinger-ftp | nunca | Panel de Hostinger |
| `FTP_PASSWORD` | hostinger-ftp | al-rotarla | Panel de Hostinger |
| `FTP_USER` | hostinger-ftp | nunca | Panel de Hostinger |
| `LINKEDIN_CLIENT_ID` | linkedin | nunca | docs/linkedin.md |
| `LINKEDIN_CLIENT_SECRET` | linkedin | al-rotarla | docs/linkedin.md |
| `LINKEDIN_ORG_ID` | linkedin | nunca | docs/linkedin.md |
| `LINKEDIN_TOKEN` | linkedin | 60d | docs/linkedin.md |
| `MAIL_PASSWORD` | correo | al-rotarla | Panel de correo de Hostinger |
| `MAIL_USER` | correo | nunca | Panel de correo de Hostinger |
| `PANEL_TOKEN` | panel | al-rotarla | Token de GitHub con permiso de escritura solo sobre este repositorio |
| `PANEL_USUARIOS` | panel | al-rotarla | Usuario y contraseña de quien edita |
| `clave-publica-indexnow` | indexnow | pública por diseño | El protocolo exige publicarla en assets/<clave>.txt. Guardarla como secreto daría una falsa sensación de protección sobre un valor que es público por diseño. |

Tres reglas, sin excepciones: ninguna llave viaja por un chat ni por correo —una clave que pasa por una conversación es una clave que hay que rotar—; ninguna llave entra en el código; y toda llave con caducidad avisa antes, no después.

## Conectores

### base-de-datos

**MySQL de Hostinger** — Guarda la lista de suscripción con doble confirmación: altas pendientes, confirmadas y bajas.

- Implementación: `assets/api/suscripcion.php`
- Se dispara: formulario-del-sitio
- Acciones: alta-pendiente, confirmar, baja
- Registro de lo hecho: no lleva
- Centinela: **ninguno**
- **Guarda datos personales de terceros.**

AQUI VIVEN DATOS DE PERSONAS REALES. Correos de terceros con consentimiento demostrable. Es la pieza con obligaciones legales, y ya está en produccion.

### correo

**SMTP del dominio · meetbecome.com** — Envía los formularios de contacto y los correos de la lista de suscripción.

- Implementación: `assets/api/contacto.php · assets/api/correo.php`
- Se dispara: formulario-del-sitio, difusion
- Acciones: enviar (irreversible)
- Registro de lo hecho: no lleva
- Centinela: **ninguno**

El despliegue falla si faltan los secretos: sin ellos el formulario que trae clientes queda mudo. Sin ensayo: enviar correo de prueba desde el hosting es la única forma de verificarlo.

### hostinger-ftp

**Hostinger · alojamiento del sitio** — Sube el sitio compilado a public_html por FTPS.

- Implementación: `.github/workflows/deploy.yml`
- Se dispara: push-a-main, a-mano
- Acciones: subir-sitio
- Registro de lo hecho: no lleva
- Centinela: scripts/centinela.mjs

Reintentos con espera creciente en reintentar-despliegue.yml: 1 min, 10 min, 30 min.

### indexnow

**IndexNow · Bing, Yandex, Seznam, Naver** — Avisa a los buscadores de las direcciones que cambiaron. Google no usa este protocolo.

- Implementación: `scripts/indexnow.mjs`
- Se dispara: tras-subir-el-sitio
- Acciones: avisar-cambios
- Registro de lo hecho: no lleva
- Centinela: **ninguno**

Sin registro porque avisar dos veces de la misma dirección no causa daño.

### linkedin

**LinkedIn · página de empresa** — Anuncia en la página de empresa el artículo recién publicado.

- Implementación: `scripts/linkedin.mjs`
- Se dispara: tras-despliegue, a-mano
- Acciones: publicar-articulo (irreversible)
- Registro de lo hecho: .github/linkedin-publicado.json
- Centinela: **ninguno**

Sin centinela: nadie comprueba que el post exista de verdad en la página.

### panel

**GitHub · contenido del sitio** — Deja escribir y publicar artículos desde /admin sin que nadie necesite cuenta de GitHub. El token vive en el servidor y no sale de él.

- Implementación: `assets/api/panel.php`
- Se dispara: persona-en-admin
- Acciones: publicar-articulo
- Registro de lo hecho: el historial de git
- Centinela: **ninguno**

Es el CMS actual y el punto de partida del CMS completo. Reversible porque todo cambio queda en el historial y se puede deshacer.

### redactor

**Claude Code · rutina diaria** — Escribe y publica el artículo del día a partir del informe del observatorio, sin revisión humana previa.

- Implementación: `.github/workflows/redactor.yml · scripts/validar-articulo.mjs`
- Se dispara: cada-manana
- Acciones: escribir-articulo
- Registro de lo hecho: el historial de git
- Centinela: scripts/validar-articulo.mjs

El centinela es la validacion: un articulo que no la pasa no se publica y el dia se queda sin articulo. Es el comportamiento correcto.

### sitio-publicado

**meetbecome.com · el sitio en vivo** — Pregunta al dominio real si sirve todo lo que el repositorio da por publicado, y relanza el despliegue si no.

- Implementación: `scripts/centinela.mjs`
- Se dispara: dos-veces-al-dia, tras-despliegue, a-mano
- Acciones: comprobar, relanzar-despliegue
- Registro de lo hecho: no lleva
- Centinela: es el centinela

Sin credenciales a proposito: lee archivos del repositorio y hace peticiones publicas.

