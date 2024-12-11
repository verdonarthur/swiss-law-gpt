import {SQLite} from "../database/SQLite.ts";
import type { IBook } from "../types/IBook.ts";
import {IChapter} from "../types/IChapter.ts";

export class Book implements IBook {
    constructor(
        public id: null|number,
        public title: string,
        public chapters: Array<IChapter>,
    ) {}

    public insert() {
        const db = new SQLite();
        db.upsert('swiss_law_books ', [{title: this.title}], ['title'], ['title']);
        db.upsert('swiss_law_chapters', this.chapters, ['title', 'content'])
    }

    public static fromObject(book: IBook): Book {
        return new Book(book?.id ?? null, book?.title, book?.chapters);
    }
}