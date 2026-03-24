FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Cài đặt toàn bộ dependencies (bao gồm cả nest cli)
RUN npm install

COPY . .
# Cấp quyền thực thi cho node_modules (nếu cần) và build
RUN chmod +x ./node_modules/.bin/nest && npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
# Tạo thư mục uploads để sẵn sàng cho Volume
RUN mkdir -p uploads/jobs uploads/news

EXPOSE 3000
CMD ["node", "dist/main"]