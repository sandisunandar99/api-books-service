import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BookInput, bookModel } from "../models/Book.js";
export const createBook = async (req: Request, res: Response) => {
  try {
    
    //validation param before insert
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
