import * as fs from "node:fs";
import { CheerioAPI } from "npm:cheerio@1.0.0";
import { Book } from "../models/Book.ts";
import { $ } from "../helpers.ts";

export class ProcessSwissLaw {
  protected swissLawDocument: CheerioAPI;

  constructor(path: string) {
    const swissLawXmlFile = fs.readFileSync(
      path,
      {
        encoding: "utf8",
      },
    );

    this.swissLawDocument = $(swissLawXmlFile, { xml: true });
  }

  protected processBooks() {
    const bookElements = this.swissLawDocument("book");

    const books: { title: string; heading: string; chapters: object[] }[] = [];
    bookElements.each((_, bookElement) => {
      const book$ = $(bookElement);

      const chapters = [];

      const parts = book$("book>part");
      if (parts.children().length > 0) {
        chapters.push(
          ...this.processParts(book$),
        );
      } else {
        chapters.push(
          ...this.processChapters(book$, "book>title>chapter"),
        );
      }

      books.push({
        title: book$("book>num").text(),
        heading: book$("book>heading").text(),
        chapters: chapters,
      });
    });

    return books;
  }

  protected processParts(document: CheerioAPI): object[] {
    const chapters: object[] = [];
    const parts = document("book>part");
    parts.each((_, partElement: string) => {
      const part$ = $(partElement);

      const partNum = part$("part>num").text();
      const partHeading = part$("part>heading").text();
      const partPrefix = `${partNum}${partHeading} - `;

      chapters.push(
        ...this.processChapters(
          part$,
          "part>title>chapter",
          partPrefix,
        ),
      );
    });

    return chapters;
  }

  protected processChapters(
    document: CheerioAPI,
    selector: string,
    partPrefix: string = "",
  ): object[] {
    const chapters: object[] = [];
    document(selector).each((_, chapterElement) => {
      const chapter$ = $(chapterElement);

      const chapterNum = chapter$("chapter>num").text();
      const chapterHeading = chapter$("chapter>heading").text();
      const chapterTitle = `${partPrefix}${chapterNum}${chapterHeading}`;

      chapters.push(
        {
          title: chapterTitle,
          content: chapter$("chapter>level").text(),
        },
      );
    });

    return chapters;
  }

  public generateBooks(): Book[] {
    const books = this.processBooks();
    return books.map(
      (book) => {
        return Book.fromObject(book);
      },
    );
  }
}
