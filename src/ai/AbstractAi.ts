import type {IEmbedding} from "../types/IEmbedding.ts";

export abstract class AbstractAi {
  protected readonly abstract embeddingModelName: string;

  abstract getClient(): object;
  abstract prompt(
    systemContent: string,
    userContent: string,
  ): Promise<string>;
  abstract getEmbedding(text: string): Promise<IEmbedding>;
  abstract getBatchEmbeddings(texts: string[]): Promise<IEmbedding[]>;
}
