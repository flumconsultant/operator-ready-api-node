# Imagen de la web. Tres etapas para que la imagen final no lleve ni el código
# fuente ni las dependencias de desarrollo: `output: "standalone"` de Next
# empaqueta solo lo que el build ha demostrado que hace falta.
#
# El contexto de build es `pulse/` (así lo declara docker-compose.yml), por eso
# las rutas de aquí empiezan por `web/`.
#
# Los tokens de BECOME no se copian: ya están volcados en
# `src/app/tokens.css`, que se regenera con `npm run tokens` y se comitea. La
# imagen no necesita salir de su carpeta para construirse.

FROM node:22-alpine AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
# Al compilar, Next recorre las rutas y eso importa el módulo que valida el
# entorno. Estos valores son de mentira y solo existen en esta etapa: no hay
# base de datos ni claves reales durante el build, y la etapa final arranca
# limpia y recibe las de verdad desde el .env del servidor. Sin esto, `next
# build` se para con «Configuración inválida» aunque el .env esté perfecto.
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL=postgresql://compilar:compilar@localhost:5432/compilar \
    AUTH_SECRET=solo-para-compilar-la-imagen-nada-real-de-aqui \
    INTERNAL_API_TOKEN=solo-para-compilar-la-imagen-nada-real
COPY --from=deps /app/node_modules ./node_modules
COPY web/ ./
RUN npx prisma generate && npx next build

# El alta de empresas es un script suelto, no una pantalla de la web. Para que
# se pueda ejecutar dentro del contenedor —que no lleva ni TypeScript ni el
# código fuente— se transpila aquí a JavaScript plano. Solo importa
# node:crypto y @prisma/client, que sí viajan en la imagen final.
RUN npx tsc scripts/crear-empresa.ts \
      --module commonjs --target es2022 --moduleResolution node \
      --skipLibCheck --outDir scripts-js

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# La carpeta de las fotos se crea aquí, con dueño, y no la deja crear a Docker
# al montar el volumen: un volumen nuevo hereda el dueño de la carpeta que
# encuentra en la imagen, y si no encuentra ninguna la crea como root. El
# contenedor corre sin privilegios, así que en ese caso no podría escribir y
# cada subida de foto fallaría.
RUN mkdir -p /app/subidas && chown nextjs:nodejs /app/subidas

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# El CLI de Prisma y las migraciones viajan con la imagen: el arranque aplica
# lo que falte antes de servir la primera petición. Es lo que hace que un
# `docker compose pull && up -d` baste para desplegar un cambio de esquema.
#
# Se llama a `prisma/build/index.js` y no al atajo `.bin/prisma` a propósito:
# ese atajo es un enlace simbólico, y COPY lo convierte en un archivo real
# dentro de `.bin/`. Ahí deja de tener al lado los `.wasm` que carga desde su
# propia carpeta, y el contenedor se reinicia en bucle con un ENOENT.
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/scripts-js ./scripts

USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "node ./node_modules/prisma/build/index.js migrate deploy && node server.js"]
