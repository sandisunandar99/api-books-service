import express from "express";
const router = express.Router();

import {
    createBook,
} from "../controllers/bookController";




router.post('/', createBook);