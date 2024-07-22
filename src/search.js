import * as OpenAIHelper from "./helpers/openai.js";
import pg from "pg";
import * as GPTTokenizer from "gpt-tokenizer";
import { oneLine, stripIndent } from "common-tags";

const threshold = 0.5;
const matchCount = 5;
const maxTokenForContent = 50;
const defaultMessage = "Sorry, I don't find any article that could help you.";

async function getMatchingEmbedding(embedding) {
  const { Client } = pg;
  const client = new Client();
  await client.connect();

  let contents = [];

  try {
    const res = await client.query(
      `select content from match_swiss_law($1, $2, $3)`,
      [`[${embedding.join(",")}]`, threshold, matchCount],
    );

    contents.push(...res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }

  return contents;
}

function prepareDocumentsForPrompt(documents) {
  let text = "";
  let tokenCount = 0;

  documents.forEach((document) => {
    const content = document.content;

    const encoded = GPTTokenizer.encode(content);
    tokenCount += encoded.length;

    if (tokenCount > maxTokenForContent) {
      return;
    }

    text += `${content.trim()}\n---\n`;
  });

  return text;
}

async function prompt(context, query) {
  const text = await OpenAIHelper.prompt(
    stripIndent`${oneLine`
      You are a serious swiss law expert who loves help people!
      Given the articles between """ from the Swiss Law,
      answer the question between ''' using only those information.
      If you are unsure and the answer is not explicitly written in the articles, say
      "Sorry, I don't find any article that could help you."`}`,
    stripIndent`
      """
      ${context}
      """
      '''
      ${query}
      '''
    `,
  );

  return text ?? defaultMessage;
}

async function search(search) {
  const embeddingFromSearch = await OpenAIHelper.getEmbedding(search);
  const matchedDocuments = await getMatchingEmbedding(embeddingFromSearch);
  return await prompt(prepareDocumentsForPrompt(matchedDocuments), search);
}

console.log(search(`Que permet la loi ?`));
