import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { env } from "./env";
import { logger } from "./logger";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function connectPrisma() {
  try {
    await prisma.$connect();
    logger.info("Prisma connected to the database");
  } catch (error) {
    logger.error(`Prisma failed to connect to the database ${error}`);
    process.exit(1);
  }
}

connectPrisma();