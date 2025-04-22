import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../database/data-source.js";
import { Book } from "../entities/Book.js";
import { Genre } from "../entities/Genre.js";

export interface BookInput {
  title: string;
  author: string;
  publishedYear: number;
  genres: string[];
  stock: number;
}

export class BookModel {
  private bookRepository = AppDataSource.getRepository(Book);
  private genreRepository = AppDataSource.getRepository(Genre);

  async create(bookInput: BookInput): Promise<Book> {
    const book = new Book();
    book.title = bookInput.title;
    book.author = bookInput.author;
    book.publishedYear = bookInput.publishedYear;
    book.stock = bookInput.stock;

    // Handle genres
    book.genres = await this.getOrCreateGenres(bookInput.genres);

    return this.bookRepository.save(book);
  }

  private async getOrCreateGenres(genreNames: string[]): Promise<Genre[]> {
    const genres: Genre[] = [];

    for (const name of genreNames) {
      let genre = await this.genreRepository.findOne({
        where: { name },
      });

      // if genre not add or exist, create it
      if (!genre) {
        genre = new Genre();
        genre.name = name;
        await this.genreRepository.save(genre);
      }

      genres.push(genre);
    }

    return genres;
  }
}

// Singleton instance for the application
export const bookModel = new BookModel();
