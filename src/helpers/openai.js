import OpenAi from "openai";

function getClient() {
  return new OpenAi({ apiKey: process.env.OPEN_AI_API_KEY });
}

export async function getEmbedding(text) {
  // OpenAI recommends replacing newlines with spaces for best results
  const input = text.replace(/\n/g, " ");

  const client = getClient();

  const embeddingResponse = await client.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const [{ embedding }] = embeddingResponse.data;
  return embedding;
}

export async function prompt(systemContent, userContent) {
  let completionResponse = null;
  const client = getClient();
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
