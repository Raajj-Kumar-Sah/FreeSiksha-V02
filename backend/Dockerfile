# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files for caching
COPY package*.json ./
# Install ALL dependencies
RUN npm ci

# Copy the source code
COPY . .

# Stage 2: Production Image
FROM node:22-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
# Install ONLY production dependencies to keep image size minimal
RUN npm ci --only=production

# Copy remaining source code from builder
COPY --from=builder /app ./

# Expose backend port
EXPOSE 5000

# Health check to ensure the API is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/courses || exit 1

# Start the application natively
CMD ["node", "index.js"]
