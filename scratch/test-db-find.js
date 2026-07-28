import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Searching for visitor V676 or name ranjith...");
    const visitors = await prisma.visitor.findMany({
      where: {
        OR: [
          { visitorId: "V676" },
          { fullName: { contains: "ranjith", mode: "insensitive" } }
        ]
      }
    });
    console.log(`Found ${visitors.length} matching visitors in DB.`);
    visitors.forEach(v => {
      console.log({
        id: v.id,
        visitorId: v.visitorId,
        fullName: v.fullName,
        approvalStatus: v.approvalStatus,
        status: v.status,
        createdAt: v.createdAt
      });
    });
  } catch (error) {
    console.error("Error finding visitor:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
