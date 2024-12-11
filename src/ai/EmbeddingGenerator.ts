import {AbstractAi} from "./AbstractAi.ts";
import {IEmbedding} from "../types/IEmbedding.ts";

export class EmbeddingGenerator {
    constructor(
        protected client: AbstractAi,
    ) {
    }

    async generateFromTexts(texts: string[]): Promise<IEmbedding[]> {
        return await this.client.getBatchEmbeddings(texts);
    }
}
