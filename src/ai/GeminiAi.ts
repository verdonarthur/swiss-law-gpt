import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import "jsr:@std/dotenv/load";
import { AbstractAi } from './AbstractAi.ts';

export class GeminiAi extends AbstractAi {
  getClient() {
    const openAiApiKey = Deno.env.get('GEMINI_AI_API_KEY');
    return new GoogleGenerativeAI(openAiApiKey);
  }

  async getEmbedding(text: string): Promise<object> {
    const model = this.getClient().getGenerativeModel({
      model: 'text-embedding-004',
    });

    const result = await model.embedContent(text.replace(/\n/g, " "));

    return result.embedding;
  }

  async prompt(systemContent:string , userContent:string) {
    const model = this.getClient().getGenerativeModel({
      model: 'gemini-1.5-flash',
    })

    try {

      const result = await model.generateContent(
        `
          You are an helpful AI specialized in the Swiss Law.

          From the request given between """ and the laws articles given between ***, give a professional 
          answer. If there is no laws articles given, just say "I don't know" or the equivalent in the language
          of the request.

          """
          ${systemContent}
          """

          ***
          ${userContent}
          ***
        `
      );

      return result.response.text();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
