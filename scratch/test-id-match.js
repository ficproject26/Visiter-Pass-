import { updateVisitor } from '../lib/dbHandler.js';
import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    const v = await prisma.visitor.findFirst({ where: { visitorId: "V676" } });
    console.log("Found V676 document:", { id: v.id, visitorId: v.visitorId, status: v.status });

    console.log("\nAttempt 1: Updating with lowercase 'v676':");
    const r1 = await updateVisitor("v676", { status: "CHECKED_OUT" });
    console.log("Result 1:", r1 ? r1.status : "Failed");

    console.log("\nAttempt 2: Updating with UUID id:", v.id);
    const r2 = await updateVisitor(v.id, { status: "CHECKED_OUT" });
    console.log("Result 2:", r2 ? r2.status : "Failed");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
