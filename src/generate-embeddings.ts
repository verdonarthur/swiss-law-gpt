import { AbstractAi } from './ai/AbstractAi.ts';


//async function insertEmbeddings(embeddings) {
//  const { Client } = pg;
//  const client = new Client();
//  await client.connect();
//
//  const mappedEmbeddings = embeddings
//    .map((embedding) => {
//      return `('${embedding.content}', '[${embedding.embedding}]', 1)`;
//    })
//    .join(",");
//
//  try {
//    const res = await client.query(
//      `
//      INSERT INTO swiss_law_embeddings (content, embedding, book_id)
//      VALUES ${mappedEmbeddings};
//    `,
//      [],
//    );
//  } catch (err) {
//    console.error(err);
//  } finally {
//    await client.end();
//  }
//}


export class EmbeddingGenerator {
  constructor(
    protected client: AbstractAi) {
  }

  async generateEmbeddings(texts: string[]): Promise<object[]> {
    const embeddings: object[] = [];

    for (const text of texts) {
      const embedding = await this.client.getEmbedding(text);
      embeddings.push({ content: text, embedding });

      // TODO: to remove when script is fully functional
      break;
    }

    return embeddings;
  }
}
