import OpenAi from "npm:openai";
import "jsr:@std/dotenv/load";
import { AbstractAi } from './AbstractAi.ts';

export class OpenAi extends AbstractAi {
  getClient() {
    const openAiApiKey = Deno.env.get('OPEN_AI_API_KEY');
    return new OpenAi({ apiKey: openAiApiKey  });
  }

  async getEmbedding(text: string): Promise<object> {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = text.replace(/\n/g, " ");

    const client = this.getClient();

    const embeddingResponse = await client.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });

    const [{ embedding }] = embeddingResponse.data;
    return embedding;
  }

  async prompt(systemContent:string , userContent:string) {
    let completionResponse = null;
    const client = this.getClient();
    try {
      completionResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemContent,
          },
          {
            role: "user",
            content: userContent,
          },
        ],
        max_tokens: 512,
        temperature: 0,
      });
    } catch (err) {
      console.error(err);
      return null;
    }

    if (!completionResponse) {
      return null;
    }

    const {
      choices: [
        {
          message: { content: text },
        },
      ],
    } = completionResponse;

    return text;
  }
}
