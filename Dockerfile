# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Thay bằng lệnh build phù hợp (nếu có)

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html  # Thay /app/dist bằng output folder
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
