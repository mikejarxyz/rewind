import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// DATABASE_URL is optional for now - we'll add it when we start using Drizzle
const databaseUrl = process.env.DATABASE_URL || "postgresql://placeholder";
const client = postgres(databaseUrl);
export const db = drizzle(client);
