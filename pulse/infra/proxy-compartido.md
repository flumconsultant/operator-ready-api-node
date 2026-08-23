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

Sin archivos: se le dice a Traefik desde el propio contenedor. En
`docker-compose.compartido.yml`, al servicio `web`:

```yaml
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.pulse.rule=Host(`pulse.meetbecome.com`)"
      - "traefik.http.routers.pulse.entrypoints=websecure"
      - "traefik.http.routers.pulse.tls.certresolver=RESOLVER-QUE-YA-USES"
      - "traefik.http.services.pulse.loadbalancer.server.port=3000"
      - "traefik.http.routers.pulse-interno.rule=Host(`pulse.meetbecome.com`) && PathPrefix(`/api/interno`)"
      - "traefik.http.routers.pulse-interno.priority=100"
      - "traefik.http.routers.pulse-interno.middlewares=pulse-404"
      - "traefik.http.middlewares.pulse-404.replacepath.path=/no-existe"
    networks:
      - default
      - LA-RED-DE-TRAEFIK
```

Y declarar esa red como `external: true` al final del archivo. El nombre del
*certresolver* y el de la red salen del compose de n8n.

---

## Comprobar que quedó bien

```bash
# Desde el propio VPS: la aplicación responde en local.
curl -sI http://127.0.0.1:3000/acceder | head -1     # → HTTP/1.1 200 OK

# Desde tu ordenador: el proxy la sirve con certificado.
curl -sI https://pulse.meetbecome.com/acceder | head -1

# Y la API interna no se llega desde fuera.
curl -s -o /dev/null -w "%{http_code}\n" https://pulse.meetbecome.com/api/interno/directorio
# → 404
```

Y que n8n sigue igual, que es la parte que importa:

```bash
curl -sI https://TU-DOMINIO-DE-N8N/ | head -1
```
