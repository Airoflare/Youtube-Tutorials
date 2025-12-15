# Use the official Bun image as the base image
# Bun is a fast JavaScript runtime, and we're using this version to build and run our app.
FROM oven/bun:1.2.20-alpine

# Set the working directory inside the container
# This means all subsequent commands will run from the /app directory in the container.
WORKDIR /app

# Install OpenSSL (required by Prisma)
# Prisma requires OpenSSL to work properly, so we install it here.
RUN apk update && apk add openssl

# Copy package.json and bun.lock to leverage Bun's caching
# This copies only the package.json and bun.lock files to optimize dependency installation,
# ensuring that Bun can cache these files for faster builds if dependencies haven't changed.
COPY package.json bun.lock ./

# Install dependencies
# This command installs the app's dependencies from the package.json and bun.lock files.
RUN bun install --frozen-lockfile

# Copy the rest of the application code
# This step copies all of the application’s source code into the container.
COPY . .

# Generate Prisma Client (requires DATABASE_URL to be available at runtime)
# Prisma generates a client to interact with the database; this step ensures that it’s ready to use.
# The DATABASE_URL must be set as an environment variable for this command to work properly.
RUN bun prisma generate

# Build the Next.js application
# This command compiles the Next.js app for production. It optimizes your code for faster loading.
RUN bun run build

# Expose the port Next.js runs on
# By default, Next.js runs on port 3000, so we expose that port to make the app accessible.
EXPOSE 3000

# Set the environment variable to listen on all interfaces (0.0.0.0)
# This ensures that the app inside the container listens on all network interfaces.
# It is needed to make the app accessible from outside the container.
ENV HOST=0.0.0.0

# Set the environment to production mode
# This tells Next.js and other tools to use production optimizations.
ENV NODE_ENV=production

# Start the app and apply Prisma database migrations
# The final CMD runs two commands:
# 1. `bun prisma migrate deploy` ensures any pending database migrations are applied.
# 2. `bun run start` starts the Next.js app in production mode.
CMD ["sh", "-c", "bun prisma migrate deploy && bun run start"]
