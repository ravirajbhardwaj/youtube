import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { env } from './env'

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
}

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (env.APP_ENV !== 'production') globalForPrisma.prisma = prisma

export async function connectPrisma() {
  try {
    await prisma.$connect()
    console.info('Prisma connected to the database')
  } catch (error) {
    console.error(`Prisma failed to connect to the database ${error}`)
    process.exit(1)
  }
}

connectPrisma()
