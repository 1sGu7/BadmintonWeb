FROM node:18-alpine

# Cài curl cho healthcheck
RUN apk add --no-cache curl

# Đặt WORKDIR là /app (giữ nguyên)
WORKDIR /app

# Copy package.json trước để tận dụng cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy TOÀN BỘ project vào container
COPY . .

# Tạo thư mục hình ảnh
RUN mkdir -p public/images

# Kiểm tra cấu trúc thư mục
RUN ls -la app/

# Sử dụng server.js trong thư mục app
CMD ["node", "app/server.js"]
