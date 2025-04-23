import express from "express";
const router = express.Router();

import {
  createBook,
  getAllBooks,
  getBookById,
} from "../controllers/bookController";
import {validateBook, validateBookId} from '../validations/bookValidation';

router.post('/', validateBook, createBook);
router.get('/', getAllBooks);
router.get("/:id", validateBookId, getBookById);


export default router;