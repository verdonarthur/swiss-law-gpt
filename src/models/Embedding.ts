import {SQLite} from "../database/SQLite.ts";
import { IEmbedding } from "../types/IEmbedding.ts";
import type {IChapter} from "../types/IChapter.ts";

export class Embedding {
    constructor(
        public id: number,
        public embedding: number[],
    ) {
    }

    public static insert(embedding: number[]): number | null {
        const db = new SQLite();

        db.upsert(
            'swiss_law_embeddings',
            [{embedding}],
            ['embedding']
        );

        const data = db.select('SELECT id from swiss_law_embeddings order by id DESC limit 1')
        return data[0]?.id ?? null;
    }

    static findClosestEmbedding(promptEmbedding: IEmbedding) {
        const db = new SQLite();

        const row = db.select(`
            select id,
                   embedding,
                   distance 
            from swiss_law_embeddings
            where embedding match :embedding
            order by distance
            limit 1;
        `, {embedding: promptEmbedding.values});

        if(!row[0]) {
            return null;
        }

        return this.fromObject(row[0]);
    }

    public static fromObject(embedding: {id: number, embedding: number[]}): Embedding {
        return new Embedding(embedding.id, embedding.embedding);
    }
}
