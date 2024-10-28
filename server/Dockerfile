# Backend Dockerfile
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY package*.json ./

# Copy the rest of the back-end code
COPY . .

# Install dependencies
RUN npm install

# Expose port (e.g., 5001 for the back-end API)
EXPOSE 5001

# Keep container running
CMD ["sh", "-c", "cd server && node server.js"]