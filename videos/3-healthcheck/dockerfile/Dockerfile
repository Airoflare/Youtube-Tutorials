# Use the official lightweight nginx image based on Alpine Linux
FROM nginx:alpine

# Define a health check to verify nginx is serving HTTP traffic
# - Runs every 30 seconds
# - Times out after 5 seconds
# - Waits 5 seconds before the first check
# - Marks container unhealthy after 3 failures
# The command fetches the homepage from localhost and fails if it can't
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost || exit 1

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
