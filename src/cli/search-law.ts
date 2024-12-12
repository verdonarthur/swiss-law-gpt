import {GeminiAi} from "../ai/GeminiAi.ts";
import {EmbeddingGenerator} from "../ai/EmbeddingGenerator.ts";
import { Embedding } from "../models/Embedding.ts";
import { Chapter } from "../models/Chapter.ts";

const prompt = Deno.args[0] ?? '';

if(! prompt) {
    console.error('No prompt provided, exiting....');
    Deno.exit(0);
}

const geminiAi = new GeminiAi();
const generator = new EmbeddingGenerator(geminiAi);

const promptEmbedding = await generator.generateFromText(prompt);

const closestEmbedding = Embedding.findClosestEmbedding(promptEmbedding);

if(!closestEmbedding) {
    console.error(1, 'No law found related to your request');
    Deno.exit(0);
}

const chapter = Chapter.findBy('embedding_id', closestEmbedding.id);

if(!chapter) {
    console.error(2, 'No law found related to your request');
    Deno.exit(0);
}

const promptResult = await geminiAi.prompt(chapter.content, prompt);

console.log(promptResult);