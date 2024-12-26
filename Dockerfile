# Use official nginx image as the base image
FROM nginx:latest

# Copy build contents and replace the default nginx contents.
COPY ./build/ /usr/share/nginx/html

# Custom nginx config required for redirect handling
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80
