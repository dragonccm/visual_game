# Multi-stage build for Dokploy / Docker
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY --from=builder /app/dist /app/dist

EXPOSE 80
CMD ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":80"]
