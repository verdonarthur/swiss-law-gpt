import {SQLite} from "../database/SQLite.ts";

export class SwissLawDb {
  protected static tableName = "swiss_law_texts";
  protected static embeddingTableName = "swiss_law_embeddings";
  constructor(
    protected db: SQLite,
  ) {
    this.db = SQLite.getInstance();
  }

  public insertEmbeddings(embeddingData: object[]): void {
    embeddingData.forEach((data) => {
      this.db.insert(
        `
        INSERT INTO ${SwissLawDb.embeddingTableName}(embedding)VALUES (:embedding)
      `,
        { embedding: data.embedding.values },
      );

      const insertedEmbeddingId = this.db
        .select(
          `SELECT rowid FROM ${SwissLawDb.embeddingTableName}ORDER BY rowid DESC LIMIT 1`,
        )[0].rowid;

      this.db.insert(
        `
        INSERT INTO ${SwissLawDb.tableName}(content, embedding_id)VALUES (:content, :embeddingId)
      `,
        { content: data.content, embeddingId: insertedEmbeddingId },
      );
    });
  }

  public getAllEmbeddings() {
    return this.db.select(`SELECT * FROM ${SwissLawDb.embeddingTableName}`);
  }
}
