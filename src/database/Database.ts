export abstract class Database {
  abstract select(query: string, params: []): object;
  abstract insert(query: string, params: object): number;
  abstract upsert(
      table: string,
      values: object[],
      columnsToUpdate: string[],
      uniqueBy: string[],
  ): void;
}
