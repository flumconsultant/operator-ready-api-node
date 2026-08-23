# Imagen del bot. Mucho más simple que la de la web: es un proceso de Node que
# se conecta a Discord y escucha en un puerto interno.

FROM node:22-alpine AS build
WORKDIR /app
COPY bot/package.json bot/package-lock.json* ./
RUN npm ci || npm install
COPY bot/ ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S bot -u 1001

COPY bot/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build --chown=bot:nodejs /app/dist ./dist

USER bot
EXPOSE 3001
CMD ["node", "dist/index.js"]
