FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Cài đặt toàn bộ dependencies
RUN npm install

# CẤP QUYỀN: Đảm bảo các file binary có quyền thực thi
RUN chmod -R +x node_modules/.bin

COPY . .

# Chạy build bằng npx để nó tự tìm đúng đường dẫn nest
RUN npx nest build

RUN mkdir -p uploads/jobs uploads/news

# Railway tự động inject PORT
CMD ["node", "dist/main"]