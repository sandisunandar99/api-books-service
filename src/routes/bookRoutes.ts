import express from "express";
const router = express.Router();

import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import {validateBook, validateBookId} from '../validations/bookValidation';

router.post('/', validateBook, createBook);
router.get('/', getAllBooks);
router.get("/:id", validateBookId, getBookById);
router.put("/:id", validateBookId, validateBook, updateBook);
router.delete("/:id", validateBookId, deleteBook);


export default router;