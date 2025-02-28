# Build Stage
FROM node:23-alpine AS build

ENV NODE_ENV=staging

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Use official nginx image as the base image
FROM nginx:latest

# Copy build contents and replace the default nginx contents.
COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

# Custom nginx config required for redirect handling
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80
