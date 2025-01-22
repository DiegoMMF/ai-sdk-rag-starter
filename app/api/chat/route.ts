import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

/* 
In this code, you declare and export an asynchronous function called POST. You 
retrieve the messages from the request body and then pass them to the streamText 
function imported from the AI SDK, alongside the model you would like to use. 
Finally, you return the model’s response in AIStreamResponse format.
*/

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq("mixtral-8x7b-32768"),
    system: `You are a helpful assistant. Check your knowledge base before answering 
    any questions. Only respond to questions using information from tool calls. If no 
    relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
  });

  return result.toDataStreamResponse();
}
