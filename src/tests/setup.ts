import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "../entities/Book.js";
import { Genre } from "../entities/Genre.js";
import dotenv from 'dotenv';

dotenv.config();

export const testDataSource = new DataSource({
  type: "mysql",
  database: "library_test",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: false,
  entities: [Book, Genre],
  dropSchema: true
});

beforeAll(async () => {
  try {
    await testDataSource.initialize();
  } catch (error) {
    console.error("Error during Data Source initialization", error);
  }
});

afterAll(async () => {
  try {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
  } catch (error) {
    console.error("Error during Data Source destruction", error);
  }
});

beforeEach(async () => {
  try {
    if (testDataSource.isInitialized) {
      await testDataSource.query("SET FOREIGN_KEY_CHECKS = 0");
      await testDataSource.query("DELETE FROM book_genres");
      await testDataSource.getRepository(Book).clear();
      await testDataSource.getRepository(Genre).clear();
      await testDataSource.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  } catch (error) {
    console.error("Error during test cleanup", error);
  }
});

