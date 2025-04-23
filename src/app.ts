import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import bookRoutes from "./routes/bookRoutes";
import { AppDataSource } from "./database/data-source";

// set middleware for rate limiting and error handling
import {apiLimiter} from "./middleware/rateLimiter";
import {notFoundHandler, errorHandler} from "./middleware/errorHandler";


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


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(apiLimiter); // Apply rate limiting middleware

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