FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Tạo thư mục cho hình ảnh
RUN mkdir -p public/images

EXPOSE 3000
CMD ["node", "server.js"]
