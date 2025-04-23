import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import bookRoutes from "./routes/bookRoutes.ts";
import { AppDataSource } from "./database/data-source.ts";

// set middleware for rate limiting and error handling
import {apiLimiter} from "./middleware/rateLimiter.ts";
import {notFoundHandler, errorHandler} from "./middleware/errorHandler.ts";

// init swagger
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });


// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Book Service",
      version: "1.0.0",
      description: "A RESTful API for managing library books",
      contact: {
        name: "sandi sunandar",
        email: "sandisunandar99@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(apiLimiter); // Apply rate limiting middleware


// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/books", bookRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "up" });
});

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;