import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.log("Directly calling prisma.visitor.findMany() without orderBy...");
    const start = Date.now();
    const dbVisitors = await prisma.visitor.findMany();
    console.log(`Query took ${Date.now() - start}ms`);
    console.log("Returned count:", dbVisitors.length);
    if (dbVisitors.length > 0) {
      dbVisitors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log("Sorted in memory successfully. Newest visitor date:", dbVisitors[0].createdAt);
    }
  } catch (err) {
    console.error("Direct query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
