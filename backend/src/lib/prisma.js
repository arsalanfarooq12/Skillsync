import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
// console.log("Current DB URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined in your .env file! or is not configured correctly"
  );
}
// Create a connection pool using the 'pg' library
// Initialize the Prisma adapter
// Pass the adapter to the Prisma Client
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
