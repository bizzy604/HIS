import { PrismaClient } from './generated/prisma'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

// Only initialize PrismaClient in a non-build environment
const isNotBuildEnvironment = 
  process.env.NODE_ENV !== 'production' || 
  process.env.NEXT_PHASE !== 'phase-production-build';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = isNotBuildEnvironment 
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    }))
  : null as unknown as PrismaClient; // During build, return null but type as PrismaClient

if (process.env.NODE_ENV !== 'production' && isNotBuildEnvironment) {
  globalForPrisma.prisma = prisma as PrismaClient;
}
