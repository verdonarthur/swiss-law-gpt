import type { IChapter } from "./IChapter.ts";

export interface IBook {
  id?: null | number;
  title: string;
  chapters: Array<IChapter>;
}
