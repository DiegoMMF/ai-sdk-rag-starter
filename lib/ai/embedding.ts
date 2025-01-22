import { embedMany } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#embedding-models
const genAI = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY || "" });
// const model = genAI('gemini-1.5-flash')
const embeddingModel = genAI.textEmbeddingModel("text-embedding-3-small", {
  outputDimensionality: 1536,
});

/* 
Remember, to create an embedding, you will start with a piece of source material 
(unknown length), break it down into smaller chunks, embed each chunk, and then save 
the chunk to the database. Let’s start by creating a function to break the source 
material into small chunks.

This function will take an input string and split it by periods, filtering out any 
empty items. This will return an array of strings. It is worth experimenting with 
different chunking techniques in your projects as the best technique will vary.
*/
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

/* 
This function will take in the source material (value) as an input and return a 
promise of an array of objects, each containing an embedding and content. Within the 
function, you first generate chunks for the input. Then, you pass those chunks to the 
embedMany function imported from the AI SDK which will return embeddings of the 
chunks you passed in. Finally, you map over and return the embeddings in a format 
that is ready to save in the database.
*/
export const generateEmbeddings = async (
  value: string
): Promise<
  Array<{
    embedding: number[];
    content: string;
  }>
> => {
  const chunks = generateChunks(value);
  const embeddedChunks = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  const embeddingArray = Array.from(embeddedChunks.embeddings);

  return embeddingArray.map((e, i) => ({
    embedding: e,
    content: chunks[i],
  }));
};
