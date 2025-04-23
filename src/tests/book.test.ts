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

    describe("GET /books/:id", () => {
      it("should return a book by valid ID", async () => {
        const res = await request(app).get(`/books/${createdBookId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", createdBookId);
        expect(res.body.title).toBe(testBook.title);
      });

      it("should return 404 for non-existent book", async () => {
        const res = await request(app).get(`/books/${validUUID}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toContain("not found");
      });
    });

    describe("PUT /books/:id", () => {
      const updatedBook = {
        ...testBook,
        title: "Updated Test Book",
        author: "Updated Author",
        stock: 15,
      };

      it("should update a book with valid data", async () => {
        const res = await request(app)
          .put(`/books/${createdBookId}`)
          .send(updatedBook);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", createdBookId);
        expect(res.body.title).toBe(updatedBook.title);
        expect(res.body.author).toBe(updatedBook.author);
        expect(res.body.stock).toBe(updatedBook.stock);
      });

      it("should return 400 for invalid UUID format", async () => {
        const res = await request(app)
          .put(`/books/${invalidUUID}`)
          .send(updatedBook);

        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Invalid book ID format");
      });

      it("should return 404 for non-existent book", async () => {
        const res = await request(app)
          .put(`/books/${validUUID}`)
          .send(updatedBook);

        expect(res.status).toBe(404);
        expect(res.body.message).toContain("not found");
      });

      it("should return 400 for invalid data", async () => {
        const invalidUpdate = {
          ...updatedBook,
          publishedYear: 3000,
        };

        const res = await request(app)
          .put(`/books/${createdBookId}`)
          .send(invalidUpdate);

        expect(res.status).toBe(400);
        expect(res.body.errors[0].message).toContain(
          "Published year cannot be in the future"
        );
      });
    });

    describe("DELETE /books/:id", () => {
      it("should delete a book with valid ID", async () => {
        const res = await request(app).delete(`/books/${createdBookId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toContain("deleted successfully");

        // Verify the book was deleted
        const getRes = await request(app).get(`/books/${createdBookId}`);
        expect(getRes.status).toBe(404);
      });

      it("should return 400 for invalid UUID format", async () => {
        const res = await request(app).delete(`/books/${invalidUUID}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Invalid book ID format");
      });

      it("should return 404 for non-existent book", async () => {
        const res = await request(app).delete(`/books/${validUUID}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toContain("not found");
      });
    });

}); // End of describe('Book API Endpoints')