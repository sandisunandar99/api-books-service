import { Request, Response } from "express";
import { BookInput, bookModel } from "../models/Book";
import { bookSchema } from "../validations/bookValidation";
export const createBook = async (req: Request, res: Response) => {
  try {
    
    //validation param before insert
    const { error, value } = bookSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map((detail) => ({
          field: detail.context?.key,
          message: detail.message,
        })),
      });
    }

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