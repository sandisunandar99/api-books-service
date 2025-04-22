import express from "express";
const router = express.Router();

import {
    createBook,
    getAllBooks
} from "../controllers/bookController";


router.post('/', createBook);
router.get('/', getAllBooks);

export default router;