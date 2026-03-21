# Stage 1: Build & Source Generation (Node & Vite)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency mappings
COPY package*.json ./
# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build the React/Vite Application
RUN npm run build


# Stage 2: Serve compiled code statically via Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy statically compiled build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Apply custom Vite routing rules
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Configure an HTTP healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
