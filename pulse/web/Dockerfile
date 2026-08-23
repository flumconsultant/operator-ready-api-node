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
ENV NEXT_TELEMETRY_DISABLED=1
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

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# El CLI de Prisma y las migraciones viajan con la imagen: el arranque aplica
# lo que falte antes de servir la primera petición. Es lo que hace que un
# `docker compose pull && up -d` baste para desplegar un cambio de esquema.
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=build /app/scripts-js ./scripts

USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node server.js"]
