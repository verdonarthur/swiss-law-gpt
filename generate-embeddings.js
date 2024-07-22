import * as fs from "fs";
import OpenAi from "openai";
import * as cheerio from "cheerio";
import pg from "pg";

async function getDocuments() {
  const xml = fs.readFileSync(
    "./documents-sources/2024-fr-swiss-civil-code.xml",
    {
      encoding: "utf8",
    },
  );

  const $ = cheerio.load(xml, { xmlMode: true });
  const articles = $("article");
  const articleTexts = [];

  articles.each((index, element) => {
    const paragraphs = $(element).find("paragraph content p");
    paragraphs.each((i, p) => {
      articleTexts.push($(p).text().trim());
    });
  });

  return articleTexts;
}

async function insertEmbeddings(embeddings) {
  const { Client } = pg;
  const client = new Client();
  await client.connect();

  const mappedEmbeddings = embeddings
    .map((embedding) => {
      return `('${embedding.content}', '[${embedding.embedding}]', 1)`;
    })
    .join(",");

  try {
    const res = await client.query(
      `
      INSERT INTO swiss_law_embeddings (content, embedding, book_id)
      VALUES ${mappedEmbeddings};
    `,
      [],
    );
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

async function generateEmbeddings() {
  const client = new OpenAi({ apiKey: process.env.OPEN_AI_API_KEY });

  const documents = await getDocuments();

  const embeddings = [];

  for (const document of documents) {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = document.replace(/\n/g, " ");

    const embeddingResponse = await client.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });

    const [{ embedding }] = embeddingResponse.data;

    embeddings.push({ content: input, embedding });

    // TODO: to remove when script is fully functional
    break;
  }

  insertEmbeddings(embeddings);
}

generateEmbeddings();
