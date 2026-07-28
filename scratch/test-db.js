import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Connecting to database...");
    const visitors = await prisma.visitor.findMany({ take: 5 });
    console.log("Fetched visitors successfully:", visitors.length);
    console.log("Sample visitor:", visitors[0]);

    if (visitors.length > 0) {
      const visitor = visitors[0];
      console.log(`Attempting to update visitor ${visitor.visitorId}...`);
      const updated = await prisma.visitor.update({
        where: { visitorId: visitor.visitorId },
        data: {
          approvalStatus: visitor.approvalStatus
        }
      });
      console.log("Updated visitor successfully:", updated.visitorId);
    }
  } catch (error) {
    console.error("Database connection/query error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
