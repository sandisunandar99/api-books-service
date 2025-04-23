import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../database/data-source.js";
import { Book } from "../entities/Book.js";
import { Genre } from "../entities/Genre.js";
import { Book } from '../entities/Book';
import { promises } from "dns";

export interface BookInput {
  title: string;
  author: string;
  publishedYear: number;
  genres: string[];
  stock: number;
}

export interface BookOutput {
  id: string;
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

  async getAll(): Promise<BookOutput[]> {
    const queryBuilder = this.bookRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.genres", "genre");

    const books = await queryBuilder.getMany();

    return books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
      genres: book.genres.map((genre) => genre.name),
      stock: book.stock,
    }));
  }

  async getById(id: string): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ["genres"],
    });
  }

  async update(id: string, bookInput: BookInput): Promise<Book | null> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ["genres"],
    });

    if (!book) {
      return null;
    }

    book.title = bookInput.title;
    book.author = bookInput.author;
    book.publishedYear = bookInput.publishedYear;
    book.stock = bookInput.stock;
    book.genres = await this.getOrCreateGenres(bookInput.genres);

    return this.bookRepository.save(book);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}// end class

// Singleton instance for the application
export const bookModel = new BookModel();
