import {SQLite} from "../database/SQLite.ts";

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
}
