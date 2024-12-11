import type { IChapter } from "../types/IChapter.ts";
import { SQLite } from "../database/SQLite.ts";
import { Embedding } from "./Embedding.ts";

export class Chapter implements IChapter {
    constructor(
        public id: null | number,
        public title: string,
        public content: string,
        public embeddings: null | number[],
    ) {}

    public saveEmbedding(embedding: number[]) {
        if (!this.id) {
            throw new Error("Chapter does not exist");
        }

        const db = new SQLite();
        const idEmbedding = Embedding.insert(embedding);
        db.query(`update swiss_law_chapters set embedding_id=${idEmbedding} where id=${this.id}`);
    }

    public static findAll(): Array<Chapter> {
        const db = new SQLite();
        const chapters = db.select("select * from swiss_law_chapters");

        if (chapters.length === 0) {
            return [];
        }

        // deno-lint-ignore no-explicit-any
        return chapters.map((chapter: any) => this.fromObject(chapter));
    }

    public static fromObject(chapter: IChapter): Chapter {
        return new Chapter(
            chapter?.id ?? null,
            chapter?.title,
            chapter?.content,
            chapter?.embeddings ?? null,
        );
    }
}
