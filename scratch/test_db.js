import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  console.log("Connecting to MongoDB Atlas...");
  const start = Date.now();
  try {
    const visitors = await prisma.visitor.findMany({ take: 10 });
    console.log("Successfully fetched from MongoDB Atlas in", Date.now() - start, "ms!");
    console.log("Count:", visitors.length);
    console.log("Visitors in MongoDB Atlas:", visitors.map(v => ({ visitorId: v.visitorId, name: v.fullName, status: v.approvalStatus })));
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
