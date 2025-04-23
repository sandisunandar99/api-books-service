import express from "express";
const router = express.Router();

import {
    createBook,
    getAllBooks
} from "../controllers/bookController";
import {validateBook, validateBookId} from '../validations/bookValidation';

router.post('/',validateBook, createBook);
router.get('/', getAllBooks);

export default router;