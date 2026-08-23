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
| `web/src/lib/` | La lógica de negocio: métricas, reconocimientos, sesión, entorno. |
| `web/src/lib/ia/` | La capa de IA: sentimiento, mapa de influencia y resumen semanal. |
| `web/src/app/` | Las páginas y las rutas de API. |
| `web/src/app/tokens.css` | El sistema de diseño de BECOME, **generado**. No se edita a mano. |
| `bot/src/` | El bot de Discord: `/reconocer`, y el espejo del feed en el canal. |
| `infra/Caddyfile` | El reverse proxy. |
| `scripts/sincronizar-tokens.mjs` | Regenera `tokens.css` desde `tokens/` de la raíz. |

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

## 5. La capa de IA

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

## 6. Discord

1. Crea una aplicación en <https://discord.com/developers/applications>, añádele
   un bot y copia el token y el Client ID a `.env`.
2. Invita al bot a tu servidor con el permiso de enviar mensajes.
3. `cd bot && npm run registrar` — registra `/reconocer`. Se hace una vez, no en
   cada despliegue: Discord limita cuántas veces al día se puede.
4. En la base de datos, vincula la empresa con el servidor:

   ```sql
   update companies
      set "discordGuildId" = 'ID_DEL_SERVIDOR',
          "discordCanalFeedId" = 'ID_DEL_CANAL'
    where slug = 'demo';
   ```

5. Cada persona necesita su `discordId` en la tabla `users` para poder
   reconocer desde Discord. Es lo que queda pendiente de automatizar: hoy se
   pone a mano, y en v2 debería ser un `/vincular` en el propio bot.

El bot no toca Postgres. Todo se lo pide a la web por una API interna
autenticada con `INTERNAL_API_TOKEN`, así hay una sola definición de las reglas
y un contenedor menos con la cadena de conexión encima. Esa API está cerrada en
Caddy: desde internet devuelve 404.

---

## 7. Despliegue

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

## 8. Lo que no está hecho, y por qué

| Pendiente | Motivo |
|---|---|
| Invitar colaboradores desde el panel | Hoy las cuentas se crean con la semilla o a mano en la base. Es lo primero que hay que construir para el piloto. |
| `/vincular` en el bot | Enlazar Discord con Pulse se hace hoy escribiendo el `discordId` en la tabla. Funciona, pero no escala más allá de una empresa piloto. |
| Correo real | Sin `SMTP_URL`, el enlace de acceso se escribe en el log del contenedor en vez de enviarse. Para un piloto sirve; para producción hay que ponerlo. |
| Paginación del feed | Se cargan los 40 últimos. La consulta ya acepta un cursor; falta el botón. |
| Pruebas automáticas | No hay ninguna. El pipeline comprueba tipos y build, que atrapa bastante, pero no es lo mismo. |
| Inglés | El MVP es solo español, como dice el PRD. |

Ninguna de estas es un bloqueo para arrancar un piloto. La primera sí lo es
para el segundo cliente.
