import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Book } from "../entities/Book.js";
import { Genre } from "../entities/Genre.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [
    // Add your entity classes here
    Book,
    Genre,
  ],
  migrations: [],
  subscribers: [],
});