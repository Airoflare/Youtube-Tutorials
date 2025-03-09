# Use the unprivileged Nginx image from nginxinc based on Alpine Linux.
FROM nginxinc/nginx-unprivileged:mainline-alpine

# Copy the contents of the local "dist" directory into the Nginx default directory.
# This directory is where Nginx will serve the files from.
COPY dist/ /usr/share/nginx/html

# Expose port 8080 so that the container can serve HTTP traffic on that port.
EXPOSE 8080
