# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy production dependencies only
COPY --from=build /app/package*.json ./
RUN npm ci --only=production

# Copy build files and ensure directory exists
COPY --from=build /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "build/server.js"]