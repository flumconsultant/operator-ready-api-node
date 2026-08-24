#!/usr/bin/env bash
#
# Copia de seguridad de Pulse: la base de datos y las fotos.
#
#   bash /opt/pulse/pulse/scripts/copia.sh
#
# Se instala en cron una vez (ver DESPLIEGUE.md, sección 9.2) y a partir de ahí
# corre solo cada noche.
#
# Solo hay dos cosas en todo el servidor que no se pueden reconstruir: la base
# de datos y las imágenes que ha subido la gente. Todo lo demás sale del
# repositorio en un `docker compose up --build`. Esas dos son las que van aquí.
#
# Se guardan 14 días. Es un compromiso: suficiente para darse cuenta de que
# algo se borró por error hace una semana, y poco para que no se coma el disco.

set -euo pipefail

RAIZ=${PULSE_RAIZ:-/opt/pulse/pulse}
DESTINO=${PULSE_COPIAS:-/opt/copias}
DIAS=${PULSE_DIAS:-14}

if [ ! -f "$RAIZ/.env" ]; then
  echo "No encuentro $RAIZ/.env. Ajusta PULSE_RAIZ." >&2
  exit 1
fi

# Los dos archivos de compose, igual que al desplegar: con uno solo, Docker no
# reconoce los contenedores que están corriendo y `exec` falla.
COMPOSE=(docker compose
  -f "$RAIZ/docker-compose.yml"
  -f "$RAIZ/docker-compose.traefik.yml"
  --env-file "$RAIZ/.env")

# El usuario y la base salen del .env, no van escritos aquí: si algún día
# cambian, este script no se entera y sigue funcionando.
USUARIO=$(grep '^POSTGRES_USER=' "$RAIZ/.env" | cut -d= -f2-)
BASE=$(grep '^POSTGRES_DB=' "$RAIZ/.env" | cut -d= -f2-)

mkdir -p "$DESTINO"
DIA=$(date +%F-%H%M)

# --- La base ----------------------------------------------------------------
#
# A un archivo temporal primero, y se renombra al terminar. Si la copia se
# corta a la mitad —el servidor se reinicia, se llena el disco— no queda un
# .sql.gz truncado con pinta de copia buena.
echo "Copiando la base de datos…"
"${COMPOSE[@]}" exec -T db pg_dump -U "$USUARIO" "$BASE" \
  | gzip > "$DESTINO/base-$DIA.sql.gz.parcial"
mv "$DESTINO/base-$DIA.sql.gz.parcial" "$DESTINO/base-$DIA.sql.gz"

# --- Las imágenes -----------------------------------------------------------
echo "Copiando las imágenes…"
"${COMPOSE[@]}" exec -T web tar -cz -C /app subidas \
  > "$DESTINO/imagenes-$DIA.tar.gz.parcial"
mv "$DESTINO/imagenes-$DIA.tar.gz.parcial" "$DESTINO/imagenes-$DIA.tar.gz"

# --- Limpieza ---------------------------------------------------------------
find "$DESTINO" -name '*.gz' -mtime "+$DIAS" -delete
find "$DESTINO" -name '*.parcial' -mtime +1 -delete

# --- Comprobación -----------------------------------------------------------
#
# Una copia de 20 bytes es un error que nadie mira hasta que hace falta
# restaurar. Se comprueba que el archivo pesa algo y que el gzip está entero.
BASE_ARCHIVO="$DESTINO/base-$DIA.sql.gz"
TAMANO=$(stat -c %s "$BASE_ARCHIVO")
if [ "$TAMANO" -lt 1024 ] || ! gzip -t "$BASE_ARCHIVO" 2>/dev/null; then
  echo "AVISO: la copia de la base parece vacía o dañada ($TAMANO bytes)." >&2
  exit 1
fi

echo "Listo: $(du -h "$BASE_ARCHIVO" | cut -f1) de base, $(du -h "$DESTINO/imagenes-$DIA.tar.gz" | cut -f1) de imágenes."
echo "En $DESTINO. Se guardan $DIAS días."
