import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import bookRoutes from "./routes/bookRoutes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


// Routes
app.use("/books", bookRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "up" });
});


export default app;