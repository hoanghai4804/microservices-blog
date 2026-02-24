# ─────────────────────────────────
# Stage 1: Build React App
# ─────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production
# Copy source code
COPY . .

# Build production app
RUN npm run build

# ─────────────────────────────────
# Stage 2: Serve with Nginx
# ─────────────────────────────────
FROM nginx:1.25-alpine

# Install wget for healthcheck (not in alpine by default)
RUN apk add --no-cache wget

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]