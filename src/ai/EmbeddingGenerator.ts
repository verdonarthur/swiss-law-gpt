import {AbstractAi} from "./AbstractAi.ts";
import {IEmbedding} from "../types/IEmbedding.ts";

export class EmbeddingGenerator {
  constructor(
    protected client: AbstractAi,
  ) {
  }

  async generateFromText(text: string) {
    return await this.client.getEmbedding(text);
  }

  async generateFromTexts(texts: string[]): Promise<IEmbedding[]> {
    const maxTextsByBatch = 100;

    if (texts.length <= maxTextsByBatch) {
      return await this.client.getBatchEmbeddings(texts);
    }

    const embeddings = [];

    for (let i = 0; i <= Math.ceil(texts.length / maxTextsByBatch); i++) {
      const batchOfTexts = texts.slice(i * maxTextsByBatch, i * maxTextsByBatch + maxTextsByBatch);

      if(batchOfTexts.length <= 0) {
        break;
      }

      embeddings.push(
        ...await this.client.getBatchEmbeddings(
            batchOfTexts,
        ),
      );
    }

    return embeddings;
  }
}
