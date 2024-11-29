import {EmbeddingGenerator} from './src/EmbeddingGenerator.ts';
import { GeminiAi } from './src/ai/GeminiAi.ts';
import { SwissLawDb } from './src/models/SwissLawDb.ts'
import {ProcessSwissLaw} from "./src/documents/ProcessSwissLaw.ts";

// const geminiAi = new GeminiAi();
// const generator = new EmbeddingGenerator(geminiAi);

const filePath = "./documents-sources/2024-fr-swiss-civil-code.xml";
const processSwissLaw = new ProcessSwissLaw(filePath);
const books = processSwissLaw.generateBooks();
books.forEach(book => {
    book.insert();
})

// const db = new SwissLawDb();
// const results = await generator.generateEmbeddings(getDocuments());
// db.insertEmbeddings(results);
// dd(db.getAllEmbeddings());
