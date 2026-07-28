import { getVisitors } from '../lib/dbHandler.js';
import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.time("getVisitors Execution Time");
    const visitors = await getVisitors();
    console.timeEnd("getVisitors Execution Time");
    console.log("Total visitors returned:", visitors.length);
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
