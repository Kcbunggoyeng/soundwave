import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import WebSocket from "ws";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for Prisma Client initialization.");
}

neonConfig.webSocketConstructor = WebSocket;
const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaOptions = {
  adapter,
  errorFormat: "pretty" as const,
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions);
export const db = prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;