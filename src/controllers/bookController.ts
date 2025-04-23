import { Request, Response } from "express";
import { BookInput, bookModel } from "../models/Book";
export const createBook = async (req: Request, res: Response) => {
  try {
    //define model for input data
    const bookInput: BookInput = req.body;
    const newBook = await bookModel.create(bookInput);

    return res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookModel.getAll();
    return res.status(200).json(books);
  } catch (error) {
    console.error("Error getting all books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookModel.getById(id);

    if (!book) {
      return res.status(404).json({ message: `Book with id ${id} not found` });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error(`Error getting book with id ${req.params.id}:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
};