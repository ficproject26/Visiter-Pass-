import { PrismaClient } from '@prisma/client';

const dbUrl = process.env.DATABASE_URL || "mongodb://VisitorPass:x78Gh0YY4yeePtGU@ac-ay3wkhi-shard-00-01.g1gnttt.mongodb.net:27017/visitor_db?ssl=true&authSource=admin&directConnection=true";

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  });
}

export const prisma = globalForPrisma.prisma;
