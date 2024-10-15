export abstract class AbstractAi {
  abstract getClient(): object;
  abstract prompt(systemContent: string, userContent: string): Promise<object> ;
  abstract getEmbedding(text: string): Promise<object>;
}
