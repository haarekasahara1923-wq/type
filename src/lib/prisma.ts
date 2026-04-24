import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl) {
    console.log("[Prisma] Client initializing with DATABASE_URL:", dbUrl);
  } else {
    console.warn("[Prisma] WARNING: DATABASE_URL is NOT set. Prisma might fail or use default path.");
  }

  return new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Safer initialization to prevent top-level crashes
let prismaInstance: ReturnType<typeof prismaClientSingleton>;
try {
  prismaInstance = globalThis.prisma ?? prismaClientSingleton();
} catch (error) {
  console.error("[Prisma] FATAL ERROR during initialization:", error);
  // We don't throw here to allow the module to load, but we'll return a proxy or handle it in the routes
  prismaInstance = null as unknown as PrismaClient;
}

const prisma = prismaInstance;
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

