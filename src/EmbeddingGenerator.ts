import { AbstractAi } from './ai/AbstractAi.ts';

export class EmbeddingGenerator {
  constructor(
    protected client: AbstractAi
  ) {
  }

  async generateEmbeddings(texts: string[]): Promise<object[]> {
    const embeddings: object[] = [];

    function textToRequest(text) {
      return { content: { role: "user", parts: [{ text }] } };
    }

    const batchEmbedding = [];
    texts.forEach((text) => {
      //const embedding = await this.client.getEmbedding(text);
      //embeddings.push({ content: text, embedding });

      // TODO: to remove when script is fully functional
      break;

      batchEmbedding.push(textToRequest(text));
    });

    console.debug(batchEmbedding);

    throw new Error('');
    return embeddings;
  }
}
