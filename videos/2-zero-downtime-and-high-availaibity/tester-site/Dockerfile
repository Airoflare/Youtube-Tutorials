# Use the official Bun image as the base image
# Bun is a fast JavaScript runtime, and this image includes everything needed to run Bun apps.
FROM oven/bun:1.2.20-alpine

# Set the working directory inside the container
# All file operations and commands that follow will run inside the /app directory.
WORKDIR /app

# Copy package.json and bun.lock to leverage Bun's caching
# Copying these files first lets Docker cache dependency installation,
# so dependencies are only re-installed when these files change.
COPY package.json bun.lock ./

# Install dependencies exactly as locked in bun.lock
# The --frozen-lockfile flag ensures Bun installs the exact versions listed,
# preventing unexpected dependency changes.
RUN bun install --frozen-lockfile

# Copy the rest of the application code into the container
# This brings your full source code into the image after dependencies are installed.
COPY . .

# Build the Next.js application for production
# This step compiles the app, optimizes assets, and prepares everything for deployment.
RUN bun run build

# Expose the port that Next.js listens on (default: 3000)
# This makes the container accessible from outside via port 3000.
EXPOSE 3000

# Configure the app to listen on all network interfaces
# Required inside Docker so the app is reachable externally.
ENV HOST=0.0.0.0

# Set the environment to production mode
# This tells Next.js and other tools to use production optimizations.
ENV NODE_ENV=production

# Start the application
# Uses Bun to run the production server (`bun run start`).
# The `sh -c` wrapper allows executing the command via a shell.
CMD ["sh", "-c", "bun run start"]
