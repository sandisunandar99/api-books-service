import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Book } from "./Book.js";

@Entity("genres")
export class Genre {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true, type: "varchar" })
  name!: string;

  @ManyToMany(() => Book, book => book.genres)
  books!: Book[];
}