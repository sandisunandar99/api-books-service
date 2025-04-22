import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Genre } from "./Genre.js";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100, type: "varchar" })
  title!: string;

  @Column({ length: 100, type: "varchar" })
  author!: string;

  @Column({ name: "published_year", type: "int" })
  publishedYear!: number;

  @Column({ name: "stock", type: "int" })
  stock!: number;

  @ManyToMany(() => Genre, { cascade: true })
  @JoinTable({
    name: "book_genres",
    joinColumn: {
      name: "book_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "genre_id",
      referencedColumnName: "id"
    }
  })
  genres!: Genre[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}