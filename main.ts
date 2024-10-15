import * as fs from "node:fs";
import * as cheerio from "npm:cheerio";

import {EmbeddingGenerator} from './src/generate-embeddings.ts';
import { GeminiAi } from './src/ai/GeminiAi.ts';


function getDocuments() {
  const xml = fs.readFileSync(
    "./documents-sources/2024-fr-swiss-civil-code.xml",
    {
      encoding: "utf8",
    },
  );

  const $ = cheerio.load(xml, { xmlMode: true });
  const articles = $("article");
  const articleTexts = [];

  articles.each((_, element) => {
    const paragraphs = $(element).find("paragraph content p");
    paragraphs.each((_, p) => {
      articleTexts.push($(p).text().trim());
    });
  });

  return articleTexts;
}

console.log('-------Generating Embedding')

const geminiAi = new GeminiAi();
const generator = new EmbeddingGenerator(geminiAi);

const results = await generator.generateEmbeddings(getDocuments());

console.log(results);
