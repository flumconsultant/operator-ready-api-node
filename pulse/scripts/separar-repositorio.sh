#!/usr/bin/env bash
#
# Saca Pulse a su propio repositorio, con su historia entera.
#
#   bash pulse/scripts/separar-repositorio.sh [carpeta-destino]
#
# Por defecto crea `../pulse` al lado del repositorio actual.
#
# Qué hace, en una frase: reescribe la historia de la carpeta `pulse/` como si
# siempre hubiera sido la raíz de un repositorio, y la deja en una carpeta
# nueva, lista para empujar a GitHub.
#
# Qué NO hace: tocar este repositorio. No borra `pulse/`, no cambia ninguna
# rama, no empuja nada a ningún sitio. Si el resultado no te convence, borras
# la carpeta destino y aquí no ha pasado nada.
#
# Lo que se lleva aparte:
#   - `tokens/`, que vive en la raíz de este repositorio y es la fuente del
#     sistema de diseño. Se copia a la raíz del nuevo.
#   - Un pipeline de CI adaptado: el de aquí filtra por `pulse/**` y allí ya no
#     existe esa carpeta.

set -euo pipefail

RAIZ=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
DESTINO=${1:-$(dirname "$RAIZ")/pulse}
RAMA_TMP=_separacion_pulse

cd "$RAIZ"

# --- Comprobaciones antes de tocar nada -------------------------------------

if [ ! -d pulse ]; then
  echo "No encuentro pulse/ en $RAIZ. ¿Estás en el repositorio correcto?" >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Hay cambios sin comitear. Haz commit o guárdalos antes de separar:" >&2
  git status --short >&2
  exit 1
fi

if [ -e "$DESTINO" ]; then
  echo "$DESTINO ya existe. Bórralo o dame otra carpeta." >&2
  exit 1
fi

echo "Repositorio de origen: $RAIZ"
echo "Repositorio nuevo:     $DESTINO"
echo

# --- La historia ------------------------------------------------------------

# `subtree split` recorre todos los commits que tocaron pulse/ y los reescribe
# con esa carpeta como raíz. La autoría y las fechas se conservan; lo que
# cambia son las rutas dentro de cada commit.
echo "Reescribiendo la historia de pulse/ …"
git branch -D "$RAMA_TMP" >/dev/null 2>&1 || true
git subtree split -q --prefix=pulse -b "$RAMA_TMP" >/dev/null

# Un repositorio nuevo de verdad, no un clon: así no arrastra ni las ramas ni
# los objetos del sitio de BECOME.
mkdir -p "$DESTINO"
git -C "$DESTINO" init -q -b main
git -C "$DESTINO" fetch -q "$RAIZ" "$RAMA_TMP"
git -C "$DESTINO" reset -q --hard FETCH_HEAD

git branch -D "$RAMA_TMP" >/dev/null

COMMITS=$(git -C "$DESTINO" rev-list --count HEAD)
echo "Listo: $COMMITS commits, con pulse/ como raíz."

# --- Lo que hay que llevarse aparte ------------------------------------------

echo "Copiando tokens/ …"
cp -R "$RAIZ/tokens" "$DESTINO/tokens"

# El script de sincronización busca los tokens en ../../tokens y en ../tokens,
# así que en la nueva estructura (scripts/ colgando de la raíz) los encuentra
# sin cambiar nada. Se regenera para dejarlo demostrado.
if [ -d "$DESTINO/web/node_modules" ] || command -v node >/dev/null; then
  (cd "$DESTINO" && node scripts/sincronizar-tokens.mjs) || true
fi

echo "Escribiendo el pipeline de CI …"
mkdir -p "$DESTINO/.github/workflows"
cat > "$DESTINO/.github/workflows/ci.yml" <<'YAML'
# Comprueba y despliega BECOME Pulse.
#
# Es el mismo pipeline que tenía dentro del repositorio del sitio, sin el
# prefijo `pulse/` y sin el filtro por carpeta: aquí todo el repositorio es
# Pulse.

name: Pulse

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

concurrency:
  group: pulse-${{ github.ref }}
  cancel-in-progress: true

jobs:
  comprobar:
    name: Tipos y build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Instalar dependencias de la web
        working-directory: web
        run: npm install --no-audit --no-fund

      - name: Generar el cliente de Prisma
        working-directory: web
        run: npx prisma generate

      # tokens.css es un archivo generado y comiteado. Si alguien tocó tokens/
      # y olvidó regenerarlo, aquí se ve.
      - name: Los tokens están al día
        run: |
          node scripts/sincronizar-tokens.mjs
          git diff --exit-code -- web/src/app/tokens.css \
            || { echo "::error::tokens.css está desactualizado. Ejecuta: node scripts/sincronizar-tokens.mjs"; exit 1; }

      - name: Comprobar tipos de la web
        working-directory: web
        run: npx tsc --noEmit

      - name: Pruebas
        working-directory: web
        run: npm test

      - name: Construir la web
        working-directory: web
        env:
          # Valores de mentira que solo existen durante la compilación: el
          # build importa el módulo que valida el entorno. No hay base de datos
          # ni claves reales en CI.
          DATABASE_URL: postgresql://ci:ci@localhost:5432/ci
          AUTH_SECRET: solo-para-compilar-en-ci-nada-real-aqui-32
          INTERNAL_API_TOKEN: solo-para-compilar-en-ci-nada-real
          NEXT_TELEMETRY_DISABLED: '1'
        run: npx next build

      - name: Instalar y comprobar el bot
        working-directory: bot
        run: |
          npm install --no-audit --no-fund
          npx tsc --noEmit

  desplegar:
    name: Desplegar al VPS
    needs: comprobar
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: ¿Hay VPS configurado?
        id: comprobacion
        run: |
          if [ -z "${{ secrets.VPS_HOST }}" ]; then
            echo "::notice::VPS_HOST no está configurado. No se despliega."
            echo "listo=no" >> "$GITHUB_OUTPUT"
          else
            echo "listo=si" >> "$GITHUB_OUTPUT"
          fi

      - name: Entrar al VPS y actualizar los contenedores
        if: steps.comprobacion.outputs.listo == 'si'
        env:
          CLAVE: ${{ secrets.VPS_SSH_KEY }}
          HOST: ${{ secrets.VPS_HOST }}
          USUARIO: ${{ secrets.VPS_USER }}
          RUTA: ${{ secrets.VPS_RUTA }}
        run: |
          mkdir -p ~/.ssh
          printf '%s\n' "$CLAVE" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -H "$HOST" >> ~/.ssh/known_hosts 2>/dev/null
          # El .env vive en el VPS y no pasa por aquí: las claves nunca salen
          # del servidor. La ruta va como argumento porque el heredoc está
          # entrecomillado y dentro no se expande nada del runner.
          ssh -i ~/.ssh/id_ed25519 "$USUARIO@$HOST" bash -s -- "${RUTA:-/opt/pulse}" <<'REMOTO'
            set -euo pipefail
            cd "$1"
            git fetch origin main
            git reset --hard origin/main
            docker compose --env-file .env up -d --build
            docker image prune -f
          REMOTO
YAML

# El README y la guía hablan de rutas con `pulse/` delante, que aquí ya no
# existen. Se ajustan para que los comandos se puedan copiar y pegar.
echo "Ajustando las rutas de la documentación …"
for archivo in "$DESTINO/README.md" "$DESTINO/DESPLIEGUE.md"; do
  [ -f "$archivo" ] || continue
  sed -i \
    -e 's|-f pulse/docker-compose\.yml --env-file pulse/\.env|--env-file .env|g' \
    -e 's|pulse/scripts/sincronizar-tokens\.mjs|scripts/sincronizar-tokens.mjs|g' \
    -e 's|cp pulse/\.env\.example pulse/\.env|cp .env.example .env|g' \
    -e 's|cd /opt/pulse/pulse|cd /opt/pulse|g' \
    -e 's|\.github/workflows/pulse\.yml|.github/workflows/ci.yml|g' \
    -e "s|docker compose -f /opt/pulse/pulse/docker-compose.yml --env-file /opt/pulse/pulse/.env|docker compose --project-directory /opt/pulse --env-file /opt/pulse/.env|g" \
    -e 's|^git clone git@github.com:flumconsultant/operator-ready-api-node.git /opt/pulse$|git clone git@github.com:TU-CUENTA/become-pulse.git /opt/pulse|' \
    -e '/^git checkout claude\/mvp-become-guidelines/d' \
    -e '/^> Si ya separaste Pulse a su propio repositorio/,+1d' \
    "$archivo"
done

cat > "$DESTINO/.gitignore" <<'EOF'
node_modules/
.next/
.env
.env.local
subidas/
EOF

git -C "$DESTINO" add -A
git -C "$DESTINO" -c user.email="$(git config user.email || echo pulse@meetbecome.com)" \
    -c user.name="$(git config user.name || echo BECOME)" \
    commit -q -m "Pulse en su propio repositorio

La carpeta pulse/ del repositorio del sitio pasa a ser la raíz de este, con
su historia entera. Se traen aparte los tokens del sistema de diseño, que
vivían en la raíz del otro, y el pipeline de CI adaptado a la estructura
nueva."

echo
echo "──────────────────────────────────────────────────────────────"
echo "Hecho. El repositorio nuevo está en:"
echo
echo "  $DESTINO"
echo
echo "Lo que falta, y hay que hacerlo a mano porque implica crear cosas"
echo "en GitHub:"
echo
echo "  1. Crea el repositorio VACÍO en github.com/new."
echo "     Nombre sugerido: become-pulse. Privado. Sin README ni licencia:"
echo "     si lo creas con archivos, el primer push choca."
echo
echo "  2. Conéctalo y súbelo:"
echo
echo "       cd $DESTINO"
echo "       git remote add origin git@github.com:TU-CUENTA/become-pulse.git"
echo "       git push -u origin main"
echo
echo "  3. Comprueba que el pipeline pasa en verde (pestaña Actions)."
echo
echo "  4. Solo entonces, en el repositorio del sitio, borra pulse/ en una"
echo "     rama aparte y revísalo antes de fusionar. Mientras no lo borres,"
echo "     no pasa nada: el código está en dos sitios y ninguno estorba."
echo "──────────────────────────────────────────────────────────────"
