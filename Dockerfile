FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./package.json
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

RUN mkdir -p uploads data

ENV NODE_ENV=production

RUN npx prisma generate

# Create data dir, sync schema, seed (idempotent), then start
CMD ["sh", "-c", "mkdir -p data && npx prisma db push --accept-data-loss && (node dist/seed.js || echo 'seed skipped') && node dist/server.js"]
