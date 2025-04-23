# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build  # Assumes this compiles TypeScript into dist/

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy built files from build stage
COPY --from=build /app/dist ./dist
# Copy any other necessary files like package.json
COPY --from=build /app/package.json ./

# Expose port
EXPOSE 3000

CMD ["node", "./dist/server.js"]