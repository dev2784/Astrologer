// backend/src/db.ts
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;

// Initialize the native Postgres connection pool with connection timeout adjustments
const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 10000, // Gives Neon 10s to wake up from suspended state
  idleTimeoutMillis: 30000,
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });