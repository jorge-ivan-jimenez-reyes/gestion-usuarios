# Use an official Node runtime as the base image
FROM node:14 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build -- --prod

# Use Nginx to serve the built Angular app
FROM nginx:1.21-alpine

# Copy the built app to Nginx's serve directory
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
