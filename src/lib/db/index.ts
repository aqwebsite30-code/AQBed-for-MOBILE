import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

function createDb(): PrismaClient {
  if (typeof window !== "undefined") {
    return {} as PrismaClient;
  }
  if (process.env.NODE_ENV !== "production") {
    if (!globalThis.prisma) {
      globalThis.prisma = new PrismaClient();
    }
    return globalThis.prisma;
  }
  return new PrismaClient();
}

export const db = createDb();
