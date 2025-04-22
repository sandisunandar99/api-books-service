import { Request, Response } from "express";

export const createBook = async (req: Request, res: Response) => {
  try {
    

    return res.status(201).json({"message": "Book created successfully" });
  } catch (error) {
    console.error("Error creating book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
