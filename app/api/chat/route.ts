import { createResource } from "@/lib/actions/resources";
import { groq } from "@ai-sdk/groq";
import { streamText, tool } from "ai";
import { z } from "zod";

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

    /* 
    In this code, you define a tool called addResource. This tool has three elements:
    description: description of the tool that will influence when the tool is picked.
    parameters: Zod schema that defines the parameters necessary for the tool to run.
    execute: An asynchronous function that is called with the arguments from the tool 
    call.
    In simple terms, on each generation, the model will decide whether it should call 
    the tool. If it deems it should call the tool, it will extract the parameters 
    from the input and then append a new message to the messages array of type 
    tool-call. The AI SDK will then run the execute function with the parameters 
    provided by the tool-call message.
    */
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });

  return result.toDataStreamResponse();
}
