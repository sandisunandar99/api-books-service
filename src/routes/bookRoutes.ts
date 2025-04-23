/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publishedYear
 *         - genres
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         publishedYear:
 *           type: integer
 *           description: The year the book was published
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: The genres of the book
 *         stock:
 *           type: integer
 *           description: Number of books in stock
 *     BookInput:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publishedYear
 *         - genres
 *         - stock
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         publishedYear:
 *           type: integer
 *           description: The year the book was published
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: The genres of the book
 *         stock:
 *           type: integer
 *           description: Number of books in stock
 *     BookOutput:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publishedYear
 *         - genres
 *         - stock
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         publishedYear:
 *           type: integer
 *           description: The year the book was published
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: The genres of the book
 *         stock:
 *           type: integer
 *           description: Number of books in stock
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */

import express from "express";
const router = express.Router();

import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { validateBook, validateBookId } from "../validations/bookValidation";

router.post("/", validateBook, createBook);
router.get("/", getAllBooks);
router.get("/:id", validateBookId, getBookById);
router.put("/:id", validateBookId, validateBook, updateBook);
router.delete("/:id", validateBookId, deleteBook);

export default router;
