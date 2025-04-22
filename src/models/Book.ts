export interface BookInput {
  title: string;
  author: string;
  publishedYear: number;
  genres: string[];
  stock: number;
}


export class BookModel {

}

// Singleton instance for the application
export const bookModel = new BookModel();