import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // Log which DB is being used — helps debug Electron packaging issues
  if (process.env.DATABASE_URL) {
    console.log("[Prisma] DATABASE_URL =", process.env.DATABASE_URL);
  } else {
    console.warn("[Prisma] DATABASE_URL is NOT set! Using default prisma path.");
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
