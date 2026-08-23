# Colgar Pulse de un proxy que ya existe

Cuando el VPS ya publica algo en internet —n8n, normalmente— el que da la cara
es su proxy, y Pulse se cuelga de él. Aquí están los fragmentos según cuál sea.

En los tres casos, Pulse se levanta así (fíjate en los **dos** `-f`):

```bash
docker compose -f docker-compose.yml -f docker-compose.compartido.yml \
  --env-file .env up -d --build
```

Eso deja `web` escuchando en `127.0.0.1:3000`, alcanzable desde la propia
máquina y desde ningún otro sitio.

Y en el `.env`, aunque no haya Caddy de Pulse:

```bash
APP_URL=https://pulse.meetbecome.com
AUTH_URL=https://pulse.meetbecome.com
```

Son las que usa la aplicación para componer los enlaces de invitación y el
magic link. Si apuntan a otro sitio, los enlaces salen mal.

---

## Si el proxy es Caddy

El archivo suele estar en `/etc/caddy/Caddyfile` o dentro del contenedor del
proxy. Se añade un bloque nuevo, sin tocar el que ya tiene n8n:

```caddyfile
pulse.meetbecome.com {
	encode zstd gzip

	# La API interna solo existe entre el bot y la web. Desde fuera, no existe.
	handle /api/interno/* {
		respond "No existe." 404
	}

	handle {
		reverse_proxy 127.0.0.1:3000
	}

	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		-Server
	}
}
```

Recargar sin cortar nada: `sudo systemctl reload caddy`, o
`docker exec CONTENEDOR caddy reload --config /etc/caddy/Caddyfile` si va en
Docker. El certificado lo saca solo en cuanto el DNS apunte al VPS.

> Si el Caddy del proxy corre **en un contenedor**, `127.0.0.1` es el propio
> contenedor y no el servidor. Ahí hay que usar `host.docker.internal:3000`
> (con `extra_hosts: ["host.docker.internal:host-gateway"]` en su compose), o
> mejor, meter los dos en la misma red de Docker y usar `web:3000`.

---

## Si el proxy es Nginx (o Nginx Proxy Manager)

Archivo nuevo en `/etc/nginx/sites-available/pulse`, enlazado desde
`sites-enabled/`:

```nginx
server {
    listen 80;
    server_name pulse.meetbecome.com;

    location /api/interno/ { return 404; }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";

        # Las fotos de perfil y de las publicaciones pasan por aquí.
        client_max_body_size 12M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/pulse /etc/nginx/sites-enabled/pulse
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d pulse.meetbecome.com
```

`certbot` reescribe el bloque para servir en 443 y renueva solo.

Con **Nginx Proxy Manager** (el de la interfaz web) es lo mismo desde el
navegador: *Proxy Hosts → Add Proxy Host*, dominio `pulse.meetbecome.com`,
destino `127.0.0.1` puerto `3000`, pestaña *SSL* → *Request a new certificate*
con *Force SSL*. En *Advanced*, pega `location /api/interno/ { return 404; }`.

---

## Si el proxy es Traefik

**Este es el caso del VPS de BECOME** (`root-traefik-1`, Traefik v2.10).

Traefik no se configura con archivos sino con etiquetas en los propios
contenedores: lee lo que hay puesto y se entera solo de que existe un sitio
nuevo. **No hay que tocar nada de n8n ni reiniciar el proxy.**

Las etiquetas ya están escritas en `docker-compose.traefik.yml`. Solo hay que
darle dos nombres que salen del Traefik que ya corre:

```bash
# La red de Docker donde vive Traefik.
docker inspect root-traefik-1 \
  -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}'

# El resolver de Let's Encrypt y el entrypoint de HTTPS.
docker inspect root-traefik-1 --format '{{json .Config.Cmd}}' | tr ',' '\n' \
  | grep -E 'certificatesresolvers|entrypoints'
```

De la segunda salen líneas como `--certificatesresolvers.mytlschallenge.acme…`
y `--entrypoints.websecure.address=:443`: lo que va entre los dos puntos es el
nombre. Con eso, al `.env`:

```bash
TRAEFIK_RED=la-red-que-salió
TRAEFIK_CERTRESOLVER=el-resolver-que-salió
TRAEFIK_ENTRYPOINT=websecure
```

Y se levanta con este archivo en vez del compartido:

```bash
docker compose -f docker-compose.yml -f docker-compose.traefik.yml \
  --env-file .env up -d --build
```

Aquí Pulse **no publica ningún puerto** en la máquina: Traefik le llega por la
red de Docker. Es incluso más cerrado que el montaje normal.

El corte de `/api/interno/*` se hace con un `ipwhitelist` que solo deja pasar
las IPs privadas —las de los contenedores—, así que desde internet devuelve
403. En Traefik v3 ese middleware se llama `ipallowlist`; si algún día se
actualiza el proxy, es la única línea que hay que cambiar.

---

## Comprobar que quedó bien

```bash
# Desde el propio VPS: la aplicación responde por dentro.
#   - con docker-compose.compartido.yml (Caddy o Nginx):
curl -sI http://127.0.0.1:3000/acceder | head -1
#   - con docker-compose.traefik.yml, que no publica puertos:
docker compose --env-file .env exec web wget -qS -O /dev/null http://localhost:3000/acceder
# En los dos casos: HTTP/1.1 200 OK

# Desde tu ordenador: el proxy la sirve con certificado.
curl -sI https://pulse.meetbecome.com/acceder | head -1

# Y a la API interna no se llega desde fuera.
curl -s -o /dev/null -w "%{http_code}\n" https://pulse.meetbecome.com/api/interno/directorio
# → 404 con Caddy o Nginx, 403 con Traefik. Lo que no puede salir es un 200.
```

Y que n8n sigue igual, que es la parte que importa:

```bash
curl -sI https://TU-DOMINIO-DE-N8N/ | head -1
```
