'use server';

/* 
This function is a Server Action, as denoted by the “use server”; directive at the 
top of the file. This means that it can be called anywhere in your Next.js 
application. This function will take an input, run it through a Zod schema to ensure 
it adheres to the correct schema, and then creates a new resource in the database. 
This is the ideal location to generate and store embeddings of the newly created 
resources.
*/
import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );

    return 'Resource successfully created and embedded.';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};

/* 
Server Actions are a powerful feature in Next.js that enable you to create 
asynchronous functions that run directly on the server.

Key Characteristics of Server Actions
- Server-Side Execution: Server Actions are functions marked with the "use server" 
  directive that run entirely on the server.

- Form Handling: They are particularly useful for handling form submissions and data 
  mutations.

Server Actions come with built-in security features:
- Encrypted action IDs
- Protection against CSRF attacks
- Origin validation

You can configure Server Actions in your next.config.js

Key Benefits
- Progressive enhancement
- Built-in form handling
- Secure server-side mutations
- Seamless integration with React forms
*/
