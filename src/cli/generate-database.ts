import {EmbeddingGenerator} from "../ai/EmbeddingGenerator.ts";
import {GeminiAi} from "../ai/GeminiAi.ts";
import {ProcessSwissLaw} from "../documents/ProcessSwissLaw.ts";
import {Chapter} from "../models/Chapter.ts";

const filePath = "./documents-sources/2024-fr-swiss-civil-code.xml";
const processSwissLaw = new ProcessSwissLaw(filePath);
const books = processSwissLaw.generateBooks();
books.forEach((book) => {
  book.insert();
});

const geminiAi = new GeminiAi();
const generator = new EmbeddingGenerator(geminiAi);

const chapters = Chapter.findAll();

const chapterContentEmbeddings = await generator.generateFromTexts(
  chapters.map((chapter) => chapter.content),
);
if (chapterContentEmbeddings.length !== chapters.length) {
  throw new Error("Error: Generated embeddings not corresponding to chapters");
}

chapters.forEach((chapter, i) => {
  chapter.saveEmbedding(chapterContentEmbeddings[i].values);
});
