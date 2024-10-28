# Frontend Dockerfile
FROM node:16

WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the front-end source code into the container
COPY . .

# Build the front-end
RUN npm run build

# Expose port 3000 for the front-end
EXPOSE 3000

# Start the front-end server
CMD ["npm", "start"]
