import pg from "pg";
import { env } from "@shared/index";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const provider = new pg.Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(provider);

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter, // <-- Use the newly created adapter
    log: env.NODE_ENV === "production" ? ["error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};
