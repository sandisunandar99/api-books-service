import "reflect-metadata";
import request from 'supertest';
import app from '../app.js';
import { testDataSource } from './setup.js';
import { Genre } from '../entities/Genre.js';

describe('Book API Endpoints', () => {
  const validUUID = "10ad0784-ef6d-44ae-a2db-d2ac1be6f819";
  const invalidUUID = "invalid-uuid-format"; // Changed to clearly invalid UUID format
  let createdBookId: string;

  // Test book data
  const testBook = {
    title: "Test",
    author: "Test Author",
    publishedYear: 2023,
    genres: ["Fiction", "Drama"],
    stock: 10,
  };

  beforeEach(async () => {
    // Create genres
    const genreRepository = testDataSource.getRepository(Genre);
    for (const genreName of testBook.genres) {
      await genreRepository.save({ name: genreName });
    }

    // Create a test book and store its ID
    const response = await request(app)
      .post("/books")
      .send(testBook);
    
    if (response.status === 201) {
      createdBookId = response.body.id;
    }
  });


  // start of test cases here !!!!!!!!!!!!

    describe("POST /books", () => {
        it("should create a new book with valid data", async () => {
        const res = await request(app).post("/books").send(testBook);

            expect(res.status).toBe(201);
            expect(res.body.genres).toBeInstanceOf(Array);
            createdBookId = res.body.id;
        });

        it("should return 400 for missing required fields", async () => {
        const invalidBook = {
            title: "",
            author: "Test Author",
        };

        const res = await request(app).post("/books").send(invalidBook);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("errors");
        });

        it("should return 400 for invalid published year", async () => {
        const invalidBook = {
            ...testBook,
            publishedYear: 3000,
        };

        const res = await request(app).post("/books").send(invalidBook);

        expect(res.status).toBe(400);
        expect(res.body.errors[0].message).toContain(
            "Published year cannot be in the future"
        );
        });
    });

    describe("GET /books", () => {
      it("should return all books with pagination", async () => {
        const res = await request(app).get("/books?page=1&limit=10");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("page");
        expect(res.body).toHaveProperty("totalPages");
        expect(res.body).toHaveProperty("totalBooks");
        expect(res.body).toHaveProperty("books");
      });

      it("should search books", async () => {
        const res = await request(app).get(
          "/books?search=Test&page=1&limit=10"
        );

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("page");
        expect(res.body).toHaveProperty("totalPages");
        expect(res.body).toHaveProperty("totalBooks");
        expect(res.body).toHaveProperty("books");
      });
    });

}); // End of describe('Book API Endpoints')