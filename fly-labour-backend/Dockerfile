FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
COPY tsconfig.json ./
RUN node node_modules/@nestjs/cli/bin/nest.js build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN mkdir -p uploads/jobs uploads/news uploads/cv

# Tạo entrypoint
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'echo "=== Starting migration ==="' >> /entrypoint.sh && \
    echo 'node dist/database/migrate.js' >> /entrypoint.sh && \
    echo 'echo "=== Starting app ==="' >> /entrypoint.sh && \
    echo 'exec node dist/main' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]