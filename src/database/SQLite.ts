import { Database as DBSqlite } from "jsr:@db/sqlite@0.12";
import * as sqliteVec from "npm:sqlite-vec@0.1.4-alpha.2";

import { Database } from "././Database.ts";

export class SQLite extends Database {
    protected static readonly dbFilename = "swiss_law.db";

    protected db: DBSqlite = null;

    protected initDb() {
        this.db = new DBSqlite(
            Deno.cwd() + `/cache/database/${SQLite.dbFilename}`,
        );
        this.db.enableLoadExtension = true;
        sqliteVec.load(this.db);
    }

    protected closeDb() {
        if (this.db === null) {
            return;
        }

        this.db.close();
    }

    public select(query: string, params: object | [] | null = null): object[] {
        this.initDb();

        const rows = this.db
            .prepare(query)
            .all(params);

        this.closeDb();

        return rows;
    }

    public insert(query: string, params: object | [] | null): number {
        this.initDb();
        let nbrOfRecords = 0;
        try {
            nbrOfRecords = this.db.exec(query, params);
        } catch (e) {
            console.error(e, query);
        }
        this.closeDb();
        return nbrOfRecords;
    }

    public query(query: string) {
        this.initDb();
        try {
            this.db.exec(query);
        } catch (e) {
            console.error(e, query);
        }
        this.closeDb();
    }

    public upsert(
        table: string,
        values: object[],
        columnsToUpdate: string[],
        uniqueBy: string[] = [],
    ): void {
        if (values.length <= 0) {
            return;
        }

        this.initDb();

        const columns = Object.keys(values[0]);
        const onConflict = uniqueBy.length > 0 ? `
                ON CONFLICT(${uniqueBy.join(",")}) DO UPDATE SET ${
                columnsToUpdate.map(
                    (col) => `${col}=excluded.${col}`,
                ).join(",")
            }
        ` : '';

        const preparedUpsert = this.db.prepare(`
            INSERT INTO ${table}(${columns.join(",")})
            VALUES (${columns.map((col) => `:${col}`).join(",")})
            ${onConflict}
        `);

        try {
            this.db.transaction((data: Array<any>) => {
                for (const item of data) {
                    preparedUpsert.run(item);
                }
            })(values);
        } catch (e) {
            console.error(e, preparedUpsert.toString());
        }

        this.closeDb();
    }
}
