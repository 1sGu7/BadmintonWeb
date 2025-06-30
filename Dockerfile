FROM node:18-slim  # Sử dụng bản slim để giảm kích thước

# Cài curl cho healthcheck
RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p public/images

# Sử dụng script khởi động thông minh
CMD ["sh", "-c", "node app/server.js & while ! curl -s http://localhost:3000/health >/dev/null; do sleep 1; done; wait"]
