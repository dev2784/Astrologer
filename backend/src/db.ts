// backend/src/db.ts
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// Initialize the native Postgres connection pool
const pool = new Pool({ connectionString });

// Pass the pool into Prisma's adapter
const adapter = new PrismaPg(pool);

// Export the strictly typed Prisma client
export const prisma = new PrismaClient({ adapter });