FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p public/images

# Thêm script healthcheck riêng
RUN echo '#!/bin/sh\ncurl -f http://localhost:3000/health || exit 1' > /healthcheck.sh
RUN chmod +x /healthcheck.sh

# Sử dụng script khởi động cải tiến
CMD ["sh", "-c", "node app/server.js & while sleep 1; do :; done"]
