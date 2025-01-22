import { env } from "@/lib/env.mjs";
  
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

/*
This will first add the pgvector extension to your database. Then it will create a 
new table for your resources schema that is defined in lib/db/schema/resources.ts. 
This schema has four columns: id, content, createdAt, and updatedAt.
*/

const runMigrate = async () => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  
const connection = postgres(env.DATABASE_URL, { max: 1 });

const db = drizzle(connection);


  console.log("⏳ Running migrations...");

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'lib/db/migrations' });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});