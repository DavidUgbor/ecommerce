FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

# Build frontend
COPY frontend/package*.json ./frontend/
RUN npm ci --prefix frontend
COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# Build backend
COPY backend/package*.json ./backend/
RUN npm ci --prefix backend
COPY backend/ ./backend/
ENV DATABASE_URL="file:./dev.db"
RUN cd backend && npx prisma generate && npm run build

# Run from backend directory so process.cwd() and all relative paths resolve correctly
WORKDIR /app/backend
RUN mkdir -p uploads data

ENV NODE_ENV=production
ENV DATABASE_URL="file:./data/prod.db"

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/seed.js && node dist/server.js"]
