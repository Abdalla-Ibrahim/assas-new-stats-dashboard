import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@workspace/db/schema";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL must be set before starting the API server.");
}

export const sqlClient = postgres(connectionString, {
  max: 10,
  prepare: false,
});

export const db = drizzle(sqlClient, { schema });

export { schema };
