import { getVisitorById, getVisitors } from '../lib/dbHandler.js';
import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.log("Fetching visitors list...");
    const visitors = await getVisitors();
    console.log("Total visitors:", visitors.length);
    if (visitors.length > 0) {
      const first = visitors[0];
      console.log("Testing lookup for pass ID:", first.id);

      const found = await getVisitorById(first.id);
      console.log("Result from getVisitorById:", found ? found.fullName : "NOT FOUND");
    }
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
