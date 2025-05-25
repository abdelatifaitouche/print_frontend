# Use Node 20 alpine base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy rest of the app source code
COPY . .

# Build the React app for production
RUN npm run build

# Use a lightweight web server to serve the static files (optional but recommended)
FROM nginx:stable-alpine

# Copy built files from previous stage
COPY --from=0 /app/build /usr/share/nginx/html

# Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to serve
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
