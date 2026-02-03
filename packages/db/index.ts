import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./src/schema";

const connectionString = process.env.POSTGRES_URL || "postgres://postgres:postgres@localhost:5432/fevrex";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export * from "./src/schema";
