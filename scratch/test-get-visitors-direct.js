import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.log("Directly calling prisma.visitor.findMany()...");
    const start = Date.now();
    const dbVisitors = await prisma.visitor.findMany({ orderBy: { createdAt: 'desc' } });
    console.log(`Query took ${Date.now() - start}ms`);
    console.log("Returned count:", dbVisitors.length);
  } catch (err) {
    console.error("Direct query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
