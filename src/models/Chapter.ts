import type {IChapter} from "../types/IChapter.ts";
import {SQLite} from "../database/SQLite.ts";
import {Embedding} from "./Embedding.ts";

export class Chapter implements IChapter {
  constructor(
    public id: null | number,
    public title: string,
    public content: string,
  ) {}

  public saveEmbedding(embedding: number[]) {
    if (!this.id) {
      throw new Error("Chapter does not exist");
    }

    const db = SQLite.getInstance();
    const idEmbedding = Embedding.insert(embedding);
    db.query(
      `update swiss_law_chapters set embedding_id=${idEmbedding} where id=${this.id}`,
    );
  }

  public static findAll(): Array<Chapter> {
    const db = SQLite.getInstance();
    const chapters = db.select("select * from swiss_law_chapters");

    if (chapters.length === 0) {
      return [];
    }

    // deno-lint-ignore no-explicit-any
    return chapters.map((chapter: any) => this.fromObject(chapter));
  }

  static findBy(column: string, value: number | string) {
    const db = SQLite.getInstance();

    const row = db.select(
      `
            select id, title, content from swiss_law_chapters where ${column}=:value
        `,
      { value },
    );

    if (!row[0]) {
      return null;
    }

    return this.fromObject(row[0]);
  }

  public static fromObject(chapter: IChapter): Chapter {
    return new Chapter(
      chapter?.id ?? null,
      chapter?.title,
      chapter?.content,
    );
  }
}
