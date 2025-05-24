#
# Sockpuppet Sentinel - Frontend Dockerfile
#
#

### Stage 1: Builder - Install dependencies and build Vite app
FROM node:18-alpine AS builder

LABEL maintainer="Sockpuppet Sentinel Team" \
    stage="builder" \
    description="builds optimized Vite Frontend"

WORKDIR /app

# Add non-root user for build safety
RUN addgroup -S react && adduser -S react -G react

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN chown -R react:react /app
USER react
RUN npm run build


### ==== Stage 2: NGINX Runtime ====
FROM nginx:alpine AS production

LABEL maintainer="Sockpupper Sentinel Team" \
    stage="runtime" \
    description="Minimal runtime image with NGINX"

# Install curl for health checks
RUN apk add --no-cache curl

# Add non-root user to run nginx
RUN addgroup -S nginx-app && adduser -S nginx-app -G nginx-app

# Fixes permissions for non-root user
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    mkdir -p /run && chown -R nginx-app:nginx-app /run

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Switch to non-root user
USER nginx-app

EXPOSE 80

#COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Health check to confirm frontend is served
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]