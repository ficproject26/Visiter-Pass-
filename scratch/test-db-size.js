import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.log("Checking document sizes in MongoDB...");
    const visitors = await prisma.visitor.findMany({
      select: {
        visitorId: true,
        fullName: true,
        photoUrl: true,
        idProofUrl: true
      }
    });
    console.log("Total visitors:", visitors.length);
    visitors.forEach(v => {
      const photoSize = v.photoUrl ? v.photoUrl.length : 0;
      const proofSize = v.idProofUrl ? v.idProofUrl.length : 0;
      if (photoSize > 1000 || proofSize > 1000) {
        console.log(`Visitor ${v.visitorId} (${v.fullName}): Photo size = ${photoSize} chars, Proof size = ${proofSize} chars`);
      }
    });
  } catch (error) {
    console.error("Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
