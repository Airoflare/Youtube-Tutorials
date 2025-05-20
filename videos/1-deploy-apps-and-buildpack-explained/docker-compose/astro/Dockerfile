# Stage 1: Build the Astro project using Bun
FROM oven/bun:alpine AS builder
WORKDIR /app

# Copy dependency files first to leverage Docker caching
COPY package.json bun.lock ./
RUN bun install

# Copy the rest of the project files
COPY . .

# Build the Astro project (ensure your package.json has a "build" script)
RUN bun run build

# Stage 2: Serve the static site with unprivileged Nginx
FROM nginxinc/nginx-unprivileged:mainline-alpine

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default port (8080) for the unprivileged Nginx image
EXPOSE 8080