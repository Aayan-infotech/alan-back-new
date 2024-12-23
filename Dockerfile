# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the entire project to the container
COPY . .

# Expose the backend port
EXPOSE 7878

# Start the application
CMD ["node", "server.js"]



