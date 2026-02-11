import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Create a connection pool using the 'pg' library
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Initialize the Prisma adapter
const adapter = new PrismaPg(pool);

// Pass the adapter to the Prisma Client
const prisma = new PrismaClient({ adapter });

export default prisma;
