FROM node:18-alpine

WORKDIR /app

# Cài curl cho healthcheck
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install
RUN npm install express-fileupload

COPY . .

RUN mkdir -p public/images

EXPOSE 3000
CMD ["node", "server.js"]
