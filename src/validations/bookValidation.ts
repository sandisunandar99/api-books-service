import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const bookSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title should have at least {#limit} characters",
    "string.max": "Title should not exceed {#limit} characters",
    "any.required": "Title is required",
  }),

  author: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Author cannot be empty",
    "string.min": "Author should have at least {#limit} characters",
    "string.max": "Author should not exceed {#limit} characters",
    "any.required": "Author is required",
  }),

  publishedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Published year must be a number",
      "number.integer": "Published year must be an integer",
      "number.min": "Published year must be greater than or equal to 1800",
      "number.max": "Published year cannot be in the future",
      "any.required": "Published year is required",
    }),

  genres: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.base": "Genres must be an array",
    "array.min": "At least one genre is required",
    "any.required": "Genres are required",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),
});

export const validateBook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = bookSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        field: detail.context?.key,
        message: detail.message,
      })),
    });
  }

  next();
};

export const validateBookId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: "Invalid book ID format",
    });
  }

  next();
};
