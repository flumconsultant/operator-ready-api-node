# Poner Pulse en `pulse.meetbecome.com` — paso a paso

Esta guía asume que no has montado un servidor antes. Cada paso dice qué
escribir, qué tiene que salir por pantalla y qué hacer si sale otra cosa.

Al final vas a tener:

- `https://pulse.meetbecome.com` sirviendo la aplicación, con certificado.
- `https://pulse.meetbecome.com/flum` como la dirección de la primera empresa.
- Copias de seguridad diarias y el resumen semanal de IA disparándose solo.

`meetbecome.com` no se toca. Un subdominio es un registro más en el DNS: el
sitio de BECOME sigue exactamente donde está, en el servidor donde esté hoy.

Calcula **una hora larga** la primera vez. Los pasos 1 a 3 son de esperar
(hay que aguardar a que el VPS se cree y a que el DNS se propague).

---

## Resumen de lo que vas a hacer

| # | Paso | Dónde |
|---|---|---|
| 1 | Contratar el VPS *(el de BECOME ya está)* | Web de Hostinger |
| 2 | Apuntar `pulse` a su IP | Panel DNS de `meetbecome.com` |
| 3 | Entrar por SSH y asegurar el servidor | Terminal |
| 4 | Instalar Docker *(ya está en el de BECOME)* | Terminal (en el VPS) |
| 5 | Traer el código | Terminal (en el VPS) |
| 6 | Escribir el `.env` | Terminal (en el VPS) |
| 7 | Levantarlo | Terminal (en el VPS) |
| 8 | Crear la empresa Flum | Terminal (en el VPS) |
| 9 | El resumen semanal y las copias | Terminal (en el VPS) |
| 10 | Despliegue automático desde GitHub | Web de GitHub |

> ### El VPS de BECOME ya existe, y ya tiene cosas
>
> Si vas a montarlo en `srv836595.hstgr.cloud` (31.97.41.59), donde ya corren
> n8n, searxng y la API de WhatsApp, **sáltate el paso 1** —el servidor está
> contratado y es el tamaño correcto— **y el 4**, que Docker ya está puesto.
> Los pasos 3.4 y 7 cambian, porque el proxy que da la cara a internet ya es
> el Traefik que hay, no el Caddy de Pulse.
>
> Está todo en **[«Si el VPS ya tiene otra cosa — el caso de
> BECOME»](#si-el-vps-ya-tiene-otra-cosa--el-caso-de-become)**, justo después
> del paso 7, con lo que hay montado hoy y lo que cambia en cada paso.
>
> Para otro servidor con otro proxy (Caddy, Nginx), los fragmentos están en
> [`infra/proxy-compartido.md`](infra/proxy-compartido.md).

---

## 1. Contratar el VPS

En Hostinger, **VPS Hosting** (no «Hosting Web»: eso no deja instalar Docker).

**Qué plan.** El que va bien para empezar es el de **2 vCPU y 8 GB de RAM**
(hoy se llama *KVM 2*). Los nombres y los precios cambian; lo que hay que
mirar son los números:

| | Mínimo | Recomendado | Por qué |
|---|---|---|---|
| vCPU | 1 | 2 | El build de la web dentro del servidor se come una CPU entera durante tres minutos. Con una sola, mientras despliegas la app va lenta. |
| RAM | 4 GB | 8 GB | Postgres + la web + el bot + Caddy caben en 4 GB. El *build* es lo que aprieta: con 4 GB hay que construir las imágenes fuera (paso 10). |
| Disco | 50 GB | 100 GB | La base de una empresa de 200 personas no llega a 1 GB en un año. El disco se lo comen las imágenes de Docker y las fotos. |

**Sistema operativo: Ubuntu 24.04 LTS**, limpio. Si Hostinger ofrece
«Ubuntu 24.04 with Docker», mejor todavía: te ahorra el paso 4.

**Ubicación**: la más cercana a tus usuarios. Para Perú y LATAM, Brasil o
Estados Unidos (este). Da igual a efectos prácticos, son milisegundos.

Cuando termine el aprovisionamiento, el panel te da tres cosas. **Apúntalas**:

- La **IP** del servidor (algo como `191.96.xxx.xxx`).
- El usuario `root`.
- La contraseña de `root`, o la clave SSH si te dejó subirla al crearlo.

> Esto no es exclusivo de Hostinger. Hetzner (CX22), DigitalOcean o Vultr
> sirven igual y el resto de la guía no cambia ni una línea.

---

## 2. Apuntar `pulse` al VPS

Esto va **en el DNS de `meetbecome.com`**, no en el VPS. Entra donde
administres el dominio hoy (el registrador, o Cloudflare si lo pasaste por
ahí) y añade **un registro**:

| Campo | Valor |
|---|---|
| Tipo | `A` |
| Nombre / Host | `pulse` |
| Apunta a / Valor | la IP del VPS |
| TTL | 300 (5 minutos) |

Algunos paneles piden el nombre completo (`pulse.meetbecome.com`) y otros
solo la parte de delante (`pulse`). Si al guardar te queda
`pulse.meetbecome.com.meetbecome.com`, es que pedía solo `pulse`.

> **Si usas Cloudflare**, pon el registro en **DNS only** (la nubecita gris,
> no naranja). Con el proxy activado, Caddy no puede completar el reto de
> Let's Encrypt y te quedas sin certificado. Cuando todo funcione puedes
> encenderlo si quieres, pero no hace falta: Caddy ya da HTTPS.

Comprueba desde tu ordenador que ya resuelve. Puede tardar de un minuto a
media hora:

```bash
dig +short pulse.meetbecome.com
```

Tiene que responder la IP del VPS. Hasta que no responda eso, **no sigas al
paso 7**: Caddy pedirá el certificado, fallará, y Let's Encrypt limita los
reintentos (cinco fallos por hora y dominio).

---

## 3. Entrar y asegurar el servidor

Desde tu ordenador (Terminal en Mac, PowerShell en Windows):

```bash
ssh root@LA-IP-DEL-VPS
```

La primera vez pregunta si confías en el servidor: `yes`. Luego pide la
contraseña de root que te dio Hostinger.

### 3.1 Actualizar el sistema

```bash
apt update && apt upgrade -y
```

Si al terminar pide reiniciar, hazlo con `reboot` y vuelve a entrar al minuto.

### 3.2 Crear tu usuario

Trabajar como `root` todo el rato es la forma más fácil de romper algo sin
querer.

```bash
adduser become            # te pide una contraseña; ponla larga y guárdala
usermod -aG sudo become
```

### 3.3 Entrar con clave en vez de con contraseña

**En tu ordenador**, no en el VPS. Si ya tienes una clave SSH (mira si existe
`~/.ssh/id_ed25519.pub`), sáltate el primer comando:

```bash
ssh-keygen -t ed25519 -C "become"        # Enter a todo
ssh-copy-id become@LA-IP-DEL-VPS         # pide la contraseña de `become`
```

Comprueba que entras sin contraseña:

```bash
ssh become@LA-IP-DEL-VPS
```

Si entra directo, ya puedes cerrar la puerta de las contraseñas. **En el VPS**:

```bash
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

> **No cierres esta terminal todavía.** Abre otra y comprueba que sigues
> pudiendo entrar. Si te equivocaste, con la sesión abierta lo arreglas; si la
> cerraste, hay que entrar por la consola web de Hostinger.

### 3.4 El cortafuegos

Solo tres puertas: SSH, web y web segura.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

Postgres **no** se abre. Se llega a él desde dentro de Docker, y con
`docker compose exec` cuando tú lo necesites.

### 3.5 Parches de seguridad automáticos

```bash
sudo apt install -y unattended-upgrades fail2ban
sudo dpkg-reconfigure -plow unattended-upgrades   # responde «Sí»
```

`fail2ban` bloquea las IPs que prueban contraseñas a lo bruto. Con
`PasswordAuthentication no` ya no pueden entrar, pero el log deja de llenarse.

---

## 4. Instalar Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Sal y vuelve a entrar (`exit`, y otra vez `ssh become@...`) para que el grupo
`docker` haga efecto. Comprueba:

```bash
docker run --rm hello-world
docker compose version
```

Lo primero imprime «Hello from Docker!». Lo segundo, `Docker Compose version
v2.x`. Si `docker compose` no existe pero `docker-compose` sí, tienes la
versión vieja: `sudo apt install docker-compose-plugin`.

---

## 5. Traer el código

Necesitas que el VPS pueda leer el repositorio. Como es privado, se hace con
una **clave de despliegue**: una clave SSH que solo sirve para leer ese
repositorio y nada más.

**En el VPS**:

```bash
ssh-keygen -t ed25519 -C "vps-pulse" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Copia la línea entera que imprime. **En GitHub**, en el repositorio →
*Settings* → *Deploy keys* → *Add deploy key*. Título: `VPS Pulse`. Pega la
clave. **No marques** «Allow write access»: el servidor solo tiene que leer.

Vuelve al VPS y clona:

```bash
sudo mkdir -p /opt/pulse && sudo chown $USER:$USER /opt/pulse
git clone git@github.com:flumconsultant/operator-ready-api-node.git /opt/pulse
cd /opt/pulse
git checkout claude/mvp-become-guidelines-ijxsdz
```

> Si ya separaste Pulse a su propio repositorio (ver `SEPARAR.md`), clona ese
> en su lugar y quítale el `pulse/` a todas las rutas de aquí en adelante.

---

## 6. El `.env`

Aquí es donde falla la gente. Este archivo **no está en el repositorio y no
puede estarlo**: son las claves. Vive solo en el servidor.

```bash
cd /opt/pulse/pulse
cp .env.example .env
```

Genera los tres secretos y guárdalos a mano; los vas a pegar en un momento:

```bash
openssl rand -base64 48   # → AUTH_SECRET
openssl rand -hex 32      # → INTERNAL_API_TOKEN
openssl rand -hex 32      # → CRON_TOKEN
openssl rand -hex 24      # → POSTGRES_PASSWORD
```

Abre el archivo con `nano .env` (se guarda con `Ctrl+O`, `Enter`, y se sale
con `Ctrl+X`) y déjalo así, sustituyendo lo que está en mayúsculas:

```bash
POSTGRES_USER=pulse
POSTGRES_PASSWORD=LA-DE-24-HEX
POSTGRES_DB=pulse
DATABASE_URL=postgresql://pulse:LA-DE-24-HEX@db:5432/pulse?schema=public

AUTH_SECRET=LA-DE-BASE64
APP_URL=https://pulse.meetbecome.com
AUTH_URL=https://pulse.meetbecome.com

INTERNAL_API_TOKEN=LA-PRIMERA-DE-32-HEX
CRON_TOKEN=LA-SEGUNDA-DE-32-HEX

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODELO=claude-opus-5

ALMACEN_IMAGENES=/app/subidas

DISCORD_TOKEN=
DISCORD_CLIENT_ID=

SMTP_URL=
SMTP_DESDE=BECOME Pulse <pulse@meetbecome.com>

DOMINIO=pulse.meetbecome.com
```

Tres avisos sobre esto:

- **`DATABASE_URL` lleva la misma contraseña que `POSTGRES_PASSWORD`.** Si no
  coinciden, el contenedor `web` no arranca. Si la contraseña lleva `@`, `/`
  o `#`, hay que escaparla en la URL; por eso el `openssl rand -hex`, que
  solo da letras y números.
- **`db` es el nombre correcto del host**, no `localhost`. Dentro de Docker
  cada servicio se llama por su nombre.
- **La clave de Anthropic es opcional.** Sin ella Pulse funciona entero: feed,
  paneles, invitaciones, bot. Lo que se apaga es el análisis de sentimiento y
  el resumen semanal. Se puede poner después, reiniciando `web`.

Cierra el archivo a lecturas ajenas:

```bash
chmod 600 .env
```

### El correo, si lo quieres desde el primer día

Sin `SMTP_URL`, el enlace de acceso por correo se escribe en el log del
contenedor en vez de mandarse. Para el piloto sirve —las invitaciones se
copian a mano— pero si quieres el magic link de verdad, con cualquier proveedor
(Resend, Brevo, Amazon SES, el Google Workspace de BECOME) la línea es:

```bash
SMTP_URL=smtps://usuario:contraseña@smtp.proveedor.com:465
```

Y el remitente tiene que ser un dominio que controles y que tenga SPF y DKIM,
o va a spam. `pulse@meetbecome.com` es el candidato natural.

---

## 7. Levantarlo

```bash
cd /opt/pulse
docker compose -f pulse/docker-compose.yml --env-file pulse/.env up -d --build
```

La primera vez tarda **entre 5 y 10 minutos**: descarga Node, Postgres y Caddy,
e instala las dependencias. Las siguientes son de un minuto.

Mira que los cuatro estén arriba:

```bash
docker compose -f pulse/docker-compose.yml --env-file pulse/.env ps
```

Los cuatro (`db`, `web`, `bot`, `caddy`) tienen que decir `running`. El `bot`
se reinicia en bucle si no pusiste `DISCORD_TOKEN`: es normal y no afecta a la
web. Si te molesta verlo, párala con `docker compose ... stop bot`.

Las migraciones de la base **se aplican solas** al arrancar `web`. No hay que
ejecutar nada.

Ahora abre `https://pulse.meetbecome.com` en el navegador. Tiene que salir la
pantalla de acceso, con el candado. Si sale, ya está desplegado.

### Si no sale

```bash
# ¿Qué dice la web?
docker compose -f pulse/docker-compose.yml --env-file pulse/.env logs web --tail 50
# ¿Y el certificado?
docker compose -f pulse/docker-compose.yml --env-file pulse/.env logs caddy --tail 50
```

| Lo que ves | Qué pasa |
|---|---|
| `Configuración inválida. Revisa el .env` | Falta una variable. El mensaje dice cuál. |
| `Can't reach database server at db:5432` | La contraseña de `DATABASE_URL` no coincide con `POSTGRES_PASSWORD`. Corrígela y `up -d` otra vez. |
| Caddy: `no such host` o `timeout` | El DNS todavía no apunta al VPS. Vuelve al paso 2 y espera. |
| Caddy: `too many failed authorizations` | Let's Encrypt te frenó por reintentos. Espera una hora con el DNS ya correcto. |
| El navegador no carga nada, ni error | El cortafuegos. `sudo ufw status` tiene que listar 80 y 443. |
| Sale sin estilos, todo texto plano | Es la única forma de un build a medias. `docker compose ... up -d --build --force-recreate web`. |

---

## Si el VPS ya tiene otra cosa — el caso de BECOME

Todo lo anterior asume un servidor vacío. **El VPS que vas a usar no lo está**,
y eso cambia dos pasos. Esto es lo que hay hoy en `srv836595.hstgr.cloud`
(31.97.41.59, KVM 2, Ubuntu):

| Contenedor | Qué es | Puertos |
|---|---|---|
| `root-traefik-1` | Traefik v2.10 — **el proxy**: el que tiene el 80 y el 443 y saca los certificados | 80, 443 |
| `root-n8n-1` | n8n | solo `127.0.0.1:5678`, detrás de Traefik |
| `searxng` | buscador | 8081 |
| `evolution_api` | API de WhatsApp | 8080 |
| `evolution_redis` | Redis de esa API | 6379 |
| `evolution_postgres` | Postgres de esa API | 5432 |

Y de sitio va sobrado: **5,4 GB de RAM libres de 7,8**, y 86 GB de disco de 96.
Pulse en marcha se lleva menos de 1 GB. Cabe sin discusión.

Lo que **no** cabe es un segundo proxy: el 80 y el 443 los tiene Traefik. Si
levantas el compose normal, el contenedor `caddy` de Pulse no arranca — y si
arrancara sería peor, porque se pelearía con el que sostiene n8n.

La buena noticia es que Traefik es el proxy más fácil de los tres para esto:
**no se configura con archivos, sino con etiquetas en los propios
contenedores**. Se entera solo de que existe un sitio nuevo. No hay que tocar
nada de n8n, ni reiniciar el proxy, ni editar ningún archivo suyo.

### Lo que cambia

**Paso 3.2 y 3.3 (usuario y clave).** Estás entrando como `root`. Si te vale
así para el piloto, sáltatelos; si quieres hacerlo bien, créate el usuario
`become` y usa ese. No cambia nada del resto de la guía salvo que `sudo` pasa a
hacer falta.

**Paso 3.4, el cortafuegos.** Comprueba con `sudo ufw status`. Si dice
`inactive`, **no lo actives ahora**: encender el cortafuegos de golpe en un
servidor en marcha es la forma más rápida de cortar n8n. Déjalo como está y lo
vemos aparte.

**Paso 4, Docker.** Ya está instalado. Sáltatelo.

**Paso 5, traer el código.** Igual que está escrito. Clona en `/opt/pulse`,
que está libre.

**Paso 6, el `.env`.** Igual, más tres líneas al final, que le dicen a Pulse
cómo colgarse del Traefik que ya existe. Los dos primeros valores salen de
preguntárselo al propio Traefik:

```bash
# La red de Docker donde vive.
docker inspect root-traefik-1 \
  -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}'

# El resolver de Let's Encrypt y el entrypoint de HTTPS.
docker inspect root-traefik-1 --format '{{json .Config.Cmd}}' | tr ',' '\n' \
  | grep -E 'certificatesresolvers|entrypoints'
```

De la segunda salen líneas tipo `--certificatesresolvers.mytlschallenge.acme…`
y `--entrypoints.websecure.address=:443`. Lo que va entre los dos puntos es el
nombre que hace falta:

```bash
TRAEFIK_RED=la-red-que-salió
TRAEFIK_CERTRESOLVER=el-resolver-que-salió
TRAEFIK_ENTRYPOINT=websecure
```

**Paso 7, levantarlo.** Con dos `-f`, y el segundo es el de Traefik:

```bash
cd /opt/pulse/pulse
docker compose -f docker-compose.yml -f docker-compose.traefik.yml \
  --env-file .env up -d --build
```

Salen tres contenedores en vez de cuatro (`db`, `web`, `bot`) y **Pulse no
publica ningún puerto en la máquina**: Traefik le llega por la red de Docker.
Es más cerrado que el montaje normal, no menos.

En un minuto, `https://pulse.meetbecome.com` responde con su certificado. Si no:

```bash
docker logs root-traefik-1 --tail 50 | grep -i pulse
docker compose -f docker-compose.yml -f docker-compose.traefik.yml \
  --env-file .env logs web --tail 50
```

El resto de la guía —crear la empresa, el cron del resumen, las copias— es
exactamente igual.

### Dos cosas que conviene saber

**El build aprieta.** Compilar la web se lleva una CPU entera un par de
minutos, y en un KVM 2 son las dos que hay. Si n8n tiene automatizaciones
sensibles a la hora, despliega cuando no estén corriendo.

**Y una que no es de Pulse, pero se ve desde aquí.** En ese servidor,
`evolution_postgres` y `evolution_redis` publican sus puertos en `0.0.0.0`, o
sea, **abiertos a internet**: cualquiera puede intentar conectarse al 5432 y al
6379 desde fuera. Redis, además, viene sin contraseña por defecto. Pulse no
hace eso —su base no publica ningún puerto— pero comparte máquina con ellos.
Se arregla cambiando `5432:5432` por `127.0.0.1:5432:5432` en el compose de esa
API, y lo mismo con Redis; siguen funcionando igual, porque quien los usa está
en la misma máquina. Ojo: `ufw` **no** protege de esto —Docker abre sus puertos
por debajo del cortafuegos—, así que la única solución es esa.

---

## 8. Crear la empresa

Las empresas se dan de alta con un comando, no con un formulario público. Es a
propósito: un endpoint abierto que crea empresas sin autenticación se llena de
basura en una semana.

```bash
cd /opt/pulse
docker compose -f pulse/docker-compose.yml --env-file pulse/.env exec web \
  node scripts/crear-empresa.js "Flum" carlos@flum.pe "Carlos Ramírez"
```

Los tres datos son: nombre de la empresa, correo del administrador y su nombre.
El comando imprime:

```
Empresa creada: Flum (flum)
Administrador:  Carlos Ramírez <carlos@flum.pe>

Mándale este enlace. Caduca en 14 días:

  https://pulse.meetbecome.com/invitacion/xxxxxxxxxxxxxxxx
```

Ese `flum` de entre paréntesis es el slug: la empresa vive en
**`https://pulse.meetbecome.com/flum`**. Sale del nombre; si necesitas otro, lo
cambias luego en *Cultura → Empresa*.

Abre el enlace de invitación en el navegador, pon una contraseña, y el
asistente de puesta en marcha te lleva por las tres pantallas: identidad y
logo, valores, y las personas del equipo. Al terminar estás dentro del feed en
`https://pulse.meetbecome.com/flum/feed`.

Cada empresa nueva es otra vez este mismo comando. La segunda vivirá en
`/otra-empresa` y ni ve ni sabe de la primera.

---

## 9. El resumen semanal y las copias de seguridad

### 9.1 El resumen semanal

El análisis semanal no se dispara solo: lo llama `cron` desde el propio
servidor. Está fuera de la aplicación a propósito, para que el día que haya dos
copias de `web` corriendo el resumen no salga por duplicado.

```bash
sudo nano /etc/cron.d/pulse
```

Pega esto, con **tu** `CRON_TOKEN` (el del `.env`):

```cron
# Resumen semanal de Pulse: lunes a las 08:00 hora de Perú (13:00 UTC).
0 13 * * 1 become curl -fsS -X POST -H "authorization: Bearer EL-CRON-TOKEN" https://pulse.meetbecome.com/api/cron/resumen-semanal >> /var/log/pulse-resumen.log 2>&1
```

El archivo tiene que acabar en salto de línea o cron lo ignora en silencio.
Pruébalo a mano antes de esperar al lunes:

```bash
curl -fsS -X POST -H "authorization: Bearer EL-CRON-TOKEN" \
  https://pulse.meetbecome.com/api/cron/resumen-semanal
```

Devuelve un JSON con lo que analizó de cada empresa. Un `401` es que el token
no coincide; un `503`, que `CRON_TOKEN` está vacío en el `.env`.

### 9.2 Las copias

Hay dos cosas que no se pueden reconstruir: **la base de datos** y **las fotos
subidas**. Todo lo demás sale del repositorio.

```bash
sudo mkdir -p /opt/copias && sudo chown $USER:$USER /opt/copias
nano /opt/pulse/copia.sh
```

```bash
#!/usr/bin/env bash
# Copia diaria de Pulse: base de datos e imágenes. Guarda 14 días.
set -euo pipefail
cd /opt/pulse
COMPOSE="docker compose -f pulse/docker-compose.yml --env-file pulse/.env"
DIA=$(date +%F)

$COMPOSE exec -T db pg_dump -U pulse pulse | gzip > "/opt/copias/base-$DIA.sql.gz"
$COMPOSE exec -T web tar -cz -C /app subidas > "/opt/copias/imagenes-$DIA.tar.gz"

find /opt/copias -name '*.gz' -mtime +14 -delete
```

```bash
chmod +x /opt/pulse/copia.sh
sudo tee /etc/cron.d/pulse-copias >/dev/null <<'EOF'
# Copia de seguridad de Pulse, todas las noches a las 03:30 UTC.
30 3 * * * become /opt/pulse/copia.sh >> /var/log/pulse-copias.log 2>&1
EOF
```

Pruébalo ahora mismo: `/opt/pulse/copia.sh && ls -lh /opt/copias`.

> **Una copia que vive en el mismo servidor no es una copia.** Si el VPS se
> pierde, se pierde con él. En cuanto haya datos de un cliente de verdad, esto
> tiene que salir del servidor: `rclone` a un bucket, o la copia automática que
> vende Hostinger (unos pocos dólares al mes, y es lo más barato que vas a
> comprar nunca).

### 9.3 Restaurar

Para saber que la copia sirve hay que haberla restaurado una vez:

```bash
cd /opt/pulse
gunzip -c /opt/copias/base-2026-08-23.sql.gz | \
  docker compose -f pulse/docker-compose.yml --env-file pulse/.env exec -T db \
  psql -U pulse -d pulse
```

---

## 10. Desplegar sin entrar al servidor

Ya está el pipeline hecho en `.github/workflows/pulse.yml`. Comprueba tipos,
pruebas y build en cada push, y despliega cuando el cambio llega a `main`.

Para que despliegue, en GitHub → *Settings* → *Secrets and variables* →
*Actions* → *New repository secret*, crea cuatro:

| Secreto | Valor |
|---|---|
| `VPS_HOST` | la IP del VPS |
| `VPS_USER` | `become` |
| `VPS_SSH_KEY` | el contenido de `~/.ssh/id_ed25519` **de tu ordenador** (la privada, la que no acaba en `.pub`) |
| `VPS_RUTA` | `/opt/pulse` |

Sin estos secretos el trabajo de despliegue se salta y el pipeline sigue en
verde: puedes tenerlo montado antes de que exista el VPS.

**El `.env` no pasa por el pipeline.** GitHub trae el código, entra por SSH y
reconstruye; las claves nunca salen del servidor.

> Si el VPS tiene 4 GB de RAM, construir ahí dentro puede quedarse sin memoria.
> La salida a eso es construir las imágenes en el pipeline, empujarlas a
> `ghcr.io` y que el VPS solo haga `docker compose pull`. Con 8 GB no hace
> falta.

### Mientras tanto, a mano

```bash
cd /opt/pulse
git pull
docker compose -f pulse/docker-compose.yml --env-file pulse/.env up -d --build
```

---

## Chuleta

Todos los comandos empiezan por lo mismo. Ahórratelo con un alias: añade a
`~/.bashrc` en el VPS

```bash
alias pulse='docker compose -f /opt/pulse/pulse/docker-compose.yml --env-file /opt/pulse/pulse/.env'
```

y después de `source ~/.bashrc`:

| Para | Comando |
|---|---|
| Ver el estado | `pulse ps` |
| Ver los logs en vivo | `pulse logs -f web` |
| Reiniciar la web | `pulse restart web` |
| Aplicar un cambio de código | `cd /opt/pulse && git pull && pulse up -d --build` |
| Crear una empresa | `pulse exec web node scripts/crear-empresa.js "Nombre" correo@x.pe "Persona"` |
| Entrar a la base | `pulse exec db psql -U pulse -d pulse` |
| Espacio en disco | `df -h` y `docker system df` |
| Liberar espacio | `docker image prune -af` |
| Pararlo todo | `pulse down` (los datos siguen: están en volúmenes) |

---

## Lo que cuesta al mes

| Concepto | Aproximado |
|---|---|
| VPS (2 vCPU / 8 GB) | 8–15 USD |
| Copias automáticas del proveedor | 2–3 USD |
| Dominio | ya lo tienes |
| Certificado | 0 — Let's Encrypt vía Caddy |
| Correo saliente | 0 en el nivel gratuito de casi todos |
| API de Anthropic | depende del uso; el panel de *Cultura → Empresa* lleva la cuenta y hay un tope mensual configurable por empresa |

Un piloto de 200 personas entra de sobra en el plan de 8 GB, y la parte de IA
es la única partida que crece con el uso.
