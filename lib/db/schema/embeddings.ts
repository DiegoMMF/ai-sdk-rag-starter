import { generateId } from 'ai';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

/* 
Currently, your application has one table (resources) which has a column (content) 
for storing content. 

Remember, each resource (source material) will have to be 
chunked, embedded, and then stored. Let’s create a table called embeddings to store 
these chunks.

To perform similarity search, you also need to include an index (HNSW or IVFFlat) on 
this column for better performance.
*/

export const embeddings = pgTable(
  'embeddings',
  {
    // id is a unique identifier for each embedding
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    // resourceId is a foreign key that references the id column in the resources table
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    // content is the plaintext content of the chunk
    content: text('content').notNull(),
    // embedding is the vector (embedding) representation of the chunk
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  table => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);