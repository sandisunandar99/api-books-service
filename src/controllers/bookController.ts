import { Request, Response } from "express";
import { BookInput, bookModel } from "../models/Book.ts";

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
    // create pagination and searching data
    // check param query first
    // check query available on path
    const queryKeys = Object.keys(req.query).length > 0;

    if (queryKeys) {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";

      const skip = (page - 1) * limit;

      const [books, totalBooks] = await bookModel.getAll({
        search,
        skip,
        limit,
      });

      const totalPages = Math.ceil(totalBooks / limit);

      return res.status(200).json({
        page,
        totalPages,
        totalBooks,
        books: books,
      });
    }

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

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookInput: BookInput = req.body;

    const updatedBook = await bookModel.update(id, bookInput);

    if (!updatedBook) {
      return res.status(404).json({ message: `Book with id ${id} not found` });
    }

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error(`Error updating book with id ${req.params.id}:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await bookModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: `Book with id ${id} not found` });
    }

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(`Error deleting book with id ${req.params.id}:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
};