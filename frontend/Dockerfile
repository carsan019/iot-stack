FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration production

FROM nginx:alpine
COPY --from=builder /app/dist/proyect-iot/browser /usr/share/nginx/html
EXPOSE 80
