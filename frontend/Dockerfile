# Use an official Node.js LTS (Long Term Support) image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY src/ ./src/
COPY public/ ./public/


# Expose the port for the server (default is 80 for production builds)
EXPOSE 3000

# Set the command to start the server and serve the built files
CMD npm start
