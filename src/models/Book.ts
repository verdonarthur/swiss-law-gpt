import {SwissLawDb} from "./SwissLawDb.ts";
import {SQLite} from "../database/SQLite.ts";

export class Book {
    constructor(
        public id: number,
        public title: string,
        public chapters: Array<{
            title: string,
            content: string,
        }>,
    ) {}

    public insert() {
        const db = new SQLite();
        db.upsert('swiss_law_books ', [{title: this.title}], ['title'], ['id']);
        db.upsert('swiss_law_chapters', this.chapters, ['title', 'content'], ['id'])
    }

    public static fromObject(book: object): Book {
        return new Book(book?.id, book?.title, book?.chapters);
    }
}