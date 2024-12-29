import {BindValue, Database} from "jsr:@db/sqlite@0.12";

export class SQLite {
  protected static readonly dbFilename = "swiss_law.db";
  protected static readonly sqliteVecExtension = "vec0.so";

  protected static instance: SQLite;

  protected db: Database | null = null;

  protected constructor() {
    this.initDb();
  }

  public static getInstance(): SQLite {
    if (!this.instance) {
      this.instance = new SQLite();
    }

    return this.instance;
  }

  public static getDb(): Database {
    const db = this.getInstance().db;
    if (!db) {
      throw new Error("No database instance found.");
    }

    return db;
  }

  protected initDb() {
    this.db = new Database(
      Deno.cwd() + `/cache/database/${SQLite.dbFilename}`,
    );
    this.db.enableLoadExtension = true;
    this.db.loadExtension(
      Deno.cwd() + `/sqlite-extensions/${SQLite.sqliteVecExtension}`,
    );
    this.db.enableLoadExtension = false;
  }

  protected closeDb() {
    if (this.db === null) {
      return;
    }

    this.db.close();
  }

  public select<T extends object>(
    query: string,
    params: Record<string, BindValue> | [] = [],
  ): T[] {
    return SQLite.getDb()
      .prepare(query)
      .all<T>(params);
  }

  public insert<T>(query: string, params: T | [] | null): number {
    let nbrOfRecords = 0;
    try {
      nbrOfRecords = SQLite.getDb().exec(query, params);
    } catch (e) {
      console.error(e, query);
    }
    return nbrOfRecords;
  }

  public query(query: string) {
    try {
      SQLite.getDb().exec(query);
    } catch (e) {
      console.error(e, query);
    }
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
    const onConflict = uniqueBy.length > 0
      ? `ON CONFLICT(${uniqueBy.join(",")}) DO UPDATE SET ${
        columnsToUpdate.map(
          (col) => `${col}=excluded.${col}`,
        ).join(",")
      }`
      : "";

    const preparedUpsert = SQLite.getDb().prepare(`
      INSERT INTO ${table}(${columns.join(",")})
      VALUES (${columns.map((col) => `:${col}`).join(",")})
        ${onConflict}
    `);

    try {
      SQLite.getDb().transaction((data: Array<any>) => {
        for (const item of data) {
          preparedUpsert.run(item);
        }
      })(values);
    } catch (e) {
      console.error(e, preparedUpsert.toString());
    }
  }
}
