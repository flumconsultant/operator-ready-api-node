# BECOME Pulse — MVP

Reconocimiento entre pares con una capa de IA encima. Vive dentro del
repositorio del sitio de BECOME, en esta carpeta, y no comparte nada con él
salvo el sistema de diseño.

Este README está escrito para que puedas levantarlo sin haber montado un
proyecto así antes. Si algo no funciona, lo más probable es que sea el `.env`.

---

## 1. Por qué está en una rama y no en un repositorio nuevo

Preguntaste si convenía hacerlo en otra rama. Sí, y está hecho así: todo el
trabajo vive en la rama `claude/mvp-become-guidelines-ijxsdz`. Mientras no la
fusiones, `main` —el sitio de BECOME que está publicado— sigue exactamente
igual que antes. Puedes borrar la rama y no queda rastro.

Una rama es eso: una copia del proyecto donde trabajas sin tocar lo que está en
producción. No hace falta saber más para usarla.

**Un repositorio propio también es una opción razonable**, y probablemente sea
lo correcto el día que Pulse tenga clientes: es otro producto, con otro ciclo
de vida y otro equipo. No se ha hecho ahora por dos motivos: el sitio y Pulse
comparten el sistema de diseño, y separarlo el primer día obliga a montar el
mecanismo para compartirlo entre repositorios antes de saber si el producto
funciona. Cuando quieras separarlos, la carpeta `pulse/` se mueve entera a un
repositorio nuevo y lo único que hay que llevarse aparte es `tokens/`. El
archivo generado `web/src/app/tokens.css` ya viaja dentro, así que el proyecto
sigue construyendo desde el primer minuto.

Cómo mirar esta rama en tu ordenador, si nunca lo has hecho:

```bash
git clone https://github.com/flumconsultant/operator-ready-api-node.git
cd operator-ready-api-node
git checkout claude/mvp-become-guidelines-ijxsdz
cd pulse
```

---

## 2. Levantarlo en tu máquina

Necesitas Node 22 y un Postgres. Si tienes Docker, el Postgres te lo da el
propio proyecto.

```bash
# 1. Las variables de entorno
cp .env.example .env
# Abre .env y rellena al menos AUTH_SECRET e INTERNAL_API_TOKEN.
# En local, pon ALMACEN_IMAGENES a una carpeta tuya (p. ej. ./subidas).
# Los secretos se generan así:
#   openssl rand -base64 48   → AUTH_SECRET
#   openssl rand -hex 32      → INTERNAL_API_TOKEN y CRON_TOKEN

# 2. La base de datos (solo el contenedor de Postgres)
docker compose up -d db

# 3. La aplicación
cd web
npm install
npx prisma migrate deploy   # crea las tablas
npm run db:semilla          # empresa de demostración con datos dentro
npm run dev
```

Entra en <http://localhost:3000> con **carlos@demo.pe** / **pulse-demo-2026**.
Esa cuenta es admin, así que verás las tres secciones.

> La contraseña de la semilla es pública a propósito: son datos de demostración
> y el despliegue de producción no ejecuta la semilla.

El bot de Discord se levanta aparte, y solo si tienes un bot creado:

```bash
cd ../bot
npm install
npm run registrar   # registra /reconocer en Discord (se hace una vez)
npm run dev
```

---

## 3. Levantarlo entero con Docker

Es lo mismo que corre en el VPS.

```bash
docker compose up -d --build
```

Cuatro contenedores: `web` (Next.js), `bot` (Discord), `db` (Postgres) y
`caddy` (el que atiende internet y saca el certificado HTTPS solo). Las
migraciones de la base se aplican en el arranque de `web`, así que un cambio de
esquema no necesita ningún paso manual.

Solo `caddy` publica puertos. A Postgres y al bot se llega desde dentro de la
red de Docker y desde ningún otro sitio.

---

## 4. Qué hay dentro

| Carpeta | Qué hay |
|---|---|
| `web/prisma/schema.prisma` | El modelo de datos. Las cinco entidades del PRD más lo que Auth.js necesita. |
| `web/src/lib/` | La lógica de negocio: métricas, reconocimientos, celebraciones, notificaciones, imágenes, sesión, entorno. |
| `web/src/lib/ia/` | La capa de IA: sentimiento, mapa de influencia y resumen semanal. |
| `web/src/componentes/` | Las piezas del feed: avatar, publicación, reacciones, comentarios, celebración, columna lateral. |
| `web/src/app/` | Las páginas y las rutas de API. |
| `web/src/app/tokens.css` | El sistema de diseño de BECOME, **generado**. No se edita a mano. |
| `bot/src/` | El bot de Discord: `/reconocer`, y el espejo del feed en el canal. |
| `infra/Caddyfile` | El reverse proxy. |
| `scripts/sincronizar-tokens.mjs` | Regenera `tokens.css` desde `tokens/` de la raíz. |
| `web/scripts/revisar-interfaz.mjs` | Comprueba contraste, foco, áreas pulsables y encabezados. |
| `web/scripts/crear-empresa.ts` | Da de alta una empresa nueva con su primer administrador. |
| `web/pruebas/` | Las pruebas automáticas: `npm test`. |

## 5. El feed

Pulse es una red interna, no un formulario de RRHH. Lo que hay:

- **Kudos a varias personas.** Un logro de equipo se reconoce una vez a cinco
  personas, no cinco veces por separado. Es lo que StarMeUp llama kudos. El
  tope son diez: por encima deja de ser un reconocimiento y pasa a ser un
  correo circular. La tarjeta enseña hasta tres caras y resume el resto —cinco
  avatares solapados en 640px dejan de distinguirse—, y los nombres que no
  caben siguen estando ahí para un lector de pantalla.
- **Menciones con @.** Se guardan como `@[Nombre](id)` dentro del propio texto:
  el texto sigue siendo texto —se puede buscar, recortar y mandar a la API de
  Claude sin preprocesarlo— y a la vez lleva dentro a quién se refiere. Guardar
  solo «@Ana» no serviría: hay dos Anas en cualquier empresa de cincuenta
  personas. A quien se menciona le llega «te mencionó», que dice más que
  «comentó un reconocimiento».
- **Retirar una publicación.** La puede retirar su autor o un administrador,
  con un motivo que va a la auditoría. No se borra: un borrado se llevaría los
  comentarios y las reacciones de otras personas. Si la retira un
  administrador, su autor se entera — que algo desaparezca sin explicación es
  peor que la publicación.
- **Los valores, a la vista y pulsables.** Están en la primera pantalla, no
  escondidos en un desplegable: si para ver qué valora tu empresa hay que abrir
  un menú, nadie los ve. Pulsar uno abre el modal con ese valor ya elegido, lo
  que cambia el orden mental —primero el valor, después la persona— y es lo que
  hace que se usen en vez de quedarse en un póster.
- **Iconos de verdad, no emoji.** Los valores llevan un icono de un catálogo de
  veintiocho, elegidos para lo que una empresa suele poner como valor. Un emoji
  se dibuja distinto en Windows, en Android y en un Mac, no hereda el color del
  sistema de diseño, y pedir «escribe un emoji» en un campo de texto produce
  cajas vacías y banderas puestas por error.
- **Presentaciones.** Quien se incorpora se presenta y eso aparece una vez en el
  feed — es el «Say Hi» de Workvivo. Se distingue de un reconocimiento porque no
  lo es: lo escribe alguien sobre sí mismo.
- **Foto en la publicación.** Va a un volumen en disco, no a la base ni a un
  bucket. Todo lo que sube el navegador se reencodifica a WebP con sharp, que
  de paso **borra los metadatos EXIF** — una foto de móvil lleva las
  coordenadas GPS de donde se tomó, y nadie espera publicar su casa al subir
  una foto de equipo.
- **Cinco reacciones** en vez de un aplauso, y **una por persona**: quien ya
  aplaudió y pulsa el corazón cambia de reacción en vez de acumular dos. Es el
  comportamiento de LinkedIn y no el de Slack, porque cinco filas de emoji
  debajo de cada publicación convierten el reconocimiento en un concurso de
  reacciones.
- **Comentarios**, colapsados a partir del tercero para que el feed se pueda
  seguir recorriendo.
- **Cumpleaños y aniversarios**, calculados al leer el feed a partir de dos
  fechas del perfil. No se guardan como publicaciones: un job que las creara
  tendría que ser idempotente, saber qué hacer si alguien corrige su fecha y
  limpiar lo que generó mal. Así siempre están al día.
- **Perfil de cada persona** con su muro, por qué valores la reconocen y desde
  cuándo está.
- **Novedades**: reconocimientos recibidos, comentarios en las conversaciones
  donde participas, y reacciones —que avisan a los dos lados: a quien lo
  recibió y a quien se tomó la molestia de escribirlo. Nadie se notifica a sí
  mismo, cambiar de reacción no genera una notificación nueva, y abrir una la
  marca leída por el camino, así que la campana no se queda encendida para
  siempre.
- **Columna de contexto** en escritorio: quién cumple esta semana, qué valores
  se reconocen más, y a quién no has reconocido tú en 30 días. Esa última es
  privada y dice a quién no has reconocido **tú**, no a quién no ha reconocido
  nadie: «a Rosa no la reconoce nadie» en la pantalla de toda la empresa es una
  humillación con forma de recordatorio.

### Lo que se miró de StarMeUp y Workvivo

De [StarMeUp](https://www.capterra.com/p/160234/StarmeUp/): reconocimiento
ligado a valores, feed social, celebraciones de hitos y analítica de cultura.
De [Workvivo](https://www.workvivo.com/product/): el feed con fotos, «me
gusta» y comentarios, los perfiles de empleado y las celebraciones.

Lo que se dejó fuera a propósito, y por qué:

| Función | Por qué no está |
|---|---|
| Puntos canjeables y catálogo de premios | Está fuera del alcance del PRD, y convierte el reconocimiento en una moneda: la gente empieza a reconocer para que le devuelvan el favor. Si se añade, que sea con datos del piloto delante. |
| Espacios o grupos | Con 50-500 personas un solo feed todavía se lee entero. Se justifican cuando deje de leerse. |
| Encuestas y sondeos | Fuera del alcance del MVP. La tesis del producto es medir el clima **sin** encuestas. |
| Ranking público de quién recibe más | Premia a quien tiene el equipo más grande. El mapa de influencia mide otra cosa —cuánta gente distinta te reconoce— y vive en el panel de RRHH, no en el feed. |
| Espacios o grupos | Con 50-500 personas, un solo feed todavía se lee entero. Los grupos se justifican cuando deja de leerse. |
| Encuestas y sondeos | Fuera del alcance del MVP. La tesis del producto es medir el clima **sin** encuestas. |

### El sistema de diseño

Pulse no define ni un color propio. Todo sale de `tokens/` en la raíz del
repositorio, que es la misma fuente de verdad que usa el sitio de BECOME. El
script los vuelca en un archivo que Next.js puede servir:

```bash
node pulse/scripts/sincronizar-tokens.mjs
```

Si cambias un token en `tokens/`, lo ejecutas y comiteas el resultado. El
pipeline comprueba que no se te haya olvidado.

El reparto de color del manual (navy 60 % · verde 20 % · azul hielo 10 % ·
carbón 10 %) se traduce aquí en que el marco de la aplicación es navy, el
contenido va sobre off-white para poder leerlo ocho horas seguidas, y el verde
queda reservado para lo accionable.

---

## 6. Montar una empresa

### El asistente de puesta en marcha

La primera vez que entra el administrador de una empresa recién creada, Pulse
no le enseña un feed vacío: le enseña un asistente de tres pasos —identidad y
logotipo, valores, equipo— y hasta que no lo termina no puede entrar al resto.
El orden no es casual: sin valores no se puede reconocer, y sin gente no hay a
quién.

Los valores vienen propuestos y **marcados para poder desmarcarlos**. Una
empresa que arranca con cinco valores que no eligió tiene cinco valores que
nadie usa.

Cada persona pasa después por su propio asistente la primera vez que entra: su
foto, su cargo, su cumpleaños y su fecha de ingreso, y una presentación que se
publica una sola vez en el feed. Los dos pasos se pueden saltar — la primera
pantalla de un producto que alguien no eligió instalar no puede ser un peaje.

Para verlos como los verá un cliente:

```bash
npm run db:semilla -- --nueva   # deja la empresa y la gente sin configurar
```

### El administrador es el único que configura

Hay tres permisos y **solo uno configura la empresa**: el administrador. Es
quien ve las cuatro pestañas de `/admin` y quien pasa por el asistente de
puesta en marcha. Un manager ve el panel de su equipo; un colaborador, el feed.

La interfaz impide quedarse sin administrador: no puedes quitarte a ti mismo el
rol, ni desactivarte, ni desactivar al último que quede activo.

### Las cuatro pestañas

Todo se hace desde `/admin`.

**Empresa.** Nombre, logotipo, dominio de correo, conexión con Discord y el
tope mensual de la capa de IA. El logotipo sustituye al nombre de Pulse en la
barra lateral y en la pantalla de invitación: quien entra cada mañana tiene que
ver su casa, no la nuestra.

**Personas.** Aquí se da de alta a la gente. Dos formas:

- *Invitar a alguien*: nombre, correo, equipo, cargo y permisos.
- *Pegar una lista*: una persona por línea, separando con comas o tabuladores.
  Se puede copiar y pegar directamente desde Excel o Google Sheets — acepta los
  tres separadores porque eso es lo que sale al copiar de cada uno, y se salta
  la fila de cabecera si la pegas también. Las líneas con error se informan una
  a una y no impiden que el resto entre.

**Cultura.** Los valores configurables, el ranking, el mapa de influencia y el
resumen semanal.

**Auditoría.** Quién cambió qué y cuándo, con el antes y el después de cada
campo. Registra las altas, los cambios de permisos y de equipo, las
desactivaciones, las invitaciones renovadas y aceptadas, los cambios de
configuración y los valores creados o retirados.

Lo que **no** registra, a propósito: la actividad del feed. Quién reconoció a
quién ya está en la tabla de reconocimientos con su fecha, y duplicarlo aquí
daría dos versiones de la misma verdad que algún día no coincidirían.

El registro no se puede editar ni borrar desde ninguna parte de la aplicación.
Uno que la propia interfaz puede modificar no sirve para auditar nada.

### Cómo entra la gente invitada

Al dar de alta a alguien, Pulse genera un **enlace de invitación** que el
administrador copia y manda por donde quiera. Con él, la persona elige su
contraseña y entra directa: no hay una segunda pantalla pidiéndole que vuelva a
escribirla.

Es un mecanismo propio y no el magic link de Auth.js, por un motivo práctico:
en un piloto sin servidor de correo montado, el administrador tiene que poder
pegar el enlace en un WhatsApp. Con el magic link eso no se puede — el token se
genera al pedirlo y sale por correo o no existe.

El enlace caduca a los catorce días y **se quema al usarse**. Si se pierde, se
genera otro desde la lista de personas, y el anterior deja de valer en ese
momento: si alguien reenvía una invitación suele ser porque la primera acabó
donde no debía.

### Los tres permisos

| Permiso | Qué puede |
|---|---|
| Colaborador | Ver el feed, reconocer, comentar y reaccionar. |
| Manager | Además, el panel de su equipo. |
| Administrador | Además, configurar la empresa y dar de alta a la gente. |

### Lo que la interfaz no te deja hacer

Tres cosas, y las tres a propósito, porque dejan una empresa rota sin forma de
arreglarla desde dentro:

- Quitarte a ti mismo el rol de administrador.
- Desactivarte a ti mismo.
- Desactivar al último administrador activo.

Y una cuarta: **no se borra a nadie, se desactiva.** Un borrado se llevaría por
delante todos los reconocimientos que esa persona dio y recibió, y con ellos el
histórico de la empresa. Quien se va del equipo deja de entrar; lo que escribió
se queda.

### Conectar Discord

En la pestaña Empresa hacen falta dos identificadores: el del servidor y el del
canal donde se espeja el feed. Los dos se copian con clic derecho en Discord,
con el modo desarrollador activado. Después, cada persona necesita su **ID de
Discord** en su ficha (pestaña Personas → editar) para poder usar
`/reconocer`. Eso sigue siendo manual y es lo siguiente que hay que
automatizar.

## 7. La capa de IA

Son tres cosas, y ninguna es imprescindible para que el producto funcione. Si
`ANTHROPIC_API_KEY` está vacía, Pulse arranca igual: el feed, el bot y los
paneles no cambian, y el resumen semanal se escribe con las cifras en crudo en
vez de redactado.

**Análisis de sentimiento.** Cada reconocimiento se clasifica con la API de
Claude. Lo que se mide de verdad no es el tono —casi todo es positivo, y eso no
informa de nada— sino la **especificidad**: si el mensaje describe un hecho
concreto o es una fórmula que podría copiarse y pegarse a cualquiera. Corre
*después* de guardar, en segundo plano: quien reconoce a alguien no espera a
que conteste una API externa, y si la API está caída el reconocimiento existe
igual con el campo a `null`.

**Mapa de influencia.** No lleva IA y no debería llevarla: es un grafo pequeño
y una cuenta exacta vale más que una estimada. Ordena por *cuánta gente
distinta* reconoce a cada persona, no por cuántos reconocimientos acumula —
alguien reconocido veinte veces por su jefe es un caso, y alguien reconocido
nueve veces por nueve personas de cuatro equipos es otro. Es un proxy, y en el
panel se dice que es un proxy.

**Resumen semanal.** Primero se calculan las cifras con SQL, después se le pide
a Claude que las redacte. Nunca al revés: un modelo al que le pides que
"analice la semana" a partir de texto suelto se inventa porcentajes.

### El coste, que es lo que hay que vigilar

Cada empresa tiene un `limiteIaMensual` (2000 reconocimientos por defecto).
Agotado el cupo del mes se deja de analizar y se sigue guardando todo. Es el
freno que pedía el PRD y está puesto desde el primer día, no como pendiente.

El resumen semanal lo dispara cron desde el VPS, no un planificador dentro del
contenedor: un contenedor con su propio cron se duplica en cuanto escalas a dos
réplicas y RRHH recibe el resumen dos veces.

```
0 13 * * 1 curl -fsS -H "authorization: Bearer $CRON_TOKEN" \
  https://pulse.tu-dominio.com/api/cron/resumen-semanal
```

---

## 8. Discord

1. Crea una aplicación en <https://discord.com/developers/applications>, añádele
   un bot y copia el token y el Client ID a `.env`.
2. Invita al bot a tu servidor con el permiso de enviar mensajes.
3. `cd bot && npm run registrar` — registra `/reconocer`. Se hace una vez, no en
   cada despliegue: Discord limita cuántas veces al día se puede.
4. Vincula el servidor desde **Cultura → Empresa**, pegando los dos
   identificadores de Discord.
5. Cada persona se enlaza sola: en **Mi perfil** genera un código y escribe
   `/vincular CÓDIGO` en cualquier canal del servidor. El código lo genera
   estando ya autenticada en Pulse, y ahí está la seguridad: el bot solo sabe
   qué cuenta de Discord escribió el comando, y sin el código no podría
   demostrar que esa cuenta pertenece a nadie. Caduca en quince minutos y se
   quema al usarse.

   El administrador también puede ponerlo a mano en la ficha de cada persona,
   en **Cultura → Personas**, para los casos en que alguien no se aclare.

El bot no toca Postgres. Todo se lo pide a la web por una API interna
autenticada con `INTERNAL_API_TOKEN`, así hay una sola definición de las reglas
y un contenedor menos con la cadena de conexión encima. Esa API está cerrada en
Caddy: desde internet devuelve 404.

---

## 9. Despliegue

`.github/workflows/pulse.yml` comprueba tipos y build en cada push, y despliega
al VPS cuando el cambio llega a `main`. Se dispara solo con cambios dentro de
`pulse/`.

El PRD pedía GitLab CI/CD porque así estaba pensado el VPS. El repositorio está
en GitHub, así que el pipeline vive ahí: la mecánica es la misma —construir,
entrar por SSH y `docker compose up -d --build`— y si algún día se muda a
GitLab lo único que cambia es la sintaxis del archivo.

Secretos que hay que crear en GitHub (*Settings → Secrets and variables →
Actions*) para que despliegue: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`,
`VPS_RUTA`. Sin ellos el trabajo de despliegue se salta entero en vez de fallar
en rojo, así que puedes tener el pipeline montado antes de que el VPS exista.

**El `.env` de producción vive en el VPS y no pasa por el pipeline.** Las claves
no salen del servidor.

---

## 10. Lo que no está hecho, y por qué

| Pendiente | Motivo |
|---|---|
| Registro público de empresas | Se dan de alta con `npm run empresa:crear`, que crea la empresa, su primer administrador y el enlace de invitación. Es un script y no un formulario a propósito: Pulse se vende con acompañamiento, y un endpoint público que crea empresas sin autenticación es una invitación a llenar la base de compañías vacías. Cuando exista un flujo comercial de autoservicio, esa misma función es la que llamará. |
| Correo real | Sin `SMTP_URL`, el enlace de acceso por magic link se escribe en el log del contenedor en vez de enviarse. Las invitaciones no dependen de esto: su enlace se copia a mano. |
| Menciones con @ dentro del mensaje | El texto se guarda plano. Es lo siguiente que pide un feed en cuanto se usa de verdad. |
| Reconocer a varias personas a la vez | StarMeUp lo tiene y tiene sentido para un logro de equipo. Cambia el modelo de datos, así que no entró en esta pasada. |
| Cobertura de pruebas más allá de la lógica pura | `npm test` cubre lo que se rompe en silencio —fechas, menciones, celebraciones, listas pegadas— con 40 casos. Lo que no hay son pruebas de integración contra una base de datos real; eso lo cubre hoy `npm run revisar:interfaz` y las pruebas a mano. |
| Inglés | El MVP es solo español, como dice el PRD. |

Ninguna de estas es un bloqueo para arrancar un piloto. La primera sí lo es
para el segundo cliente.
