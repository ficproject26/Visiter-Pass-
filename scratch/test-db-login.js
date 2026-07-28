import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Checking for Employee with email ficproject26@gmail.com...");
    const emp = await prisma.employee.findFirst({
      where: { email: "ficproject26@gmail.com" }
    });
    console.log("Employee found:", emp);

    console.log("Checking for Branch with email ficproject26@gmail.com...");
    const branch = await prisma.branch.findFirst({
      where: { email: "ficproject26@gmail.com" }
    });
    console.log("Branch found:", branch);

    console.log("Listing all employees emails in DB:");
    const emps = await prisma.employee.findMany({ select: { email: true, name: true, password: true } });
    console.log(emps);

    console.log("Listing all branch emails in DB:");
    const branches = await prisma.branch.findMany({ select: { email: true, name: true, password: true } });
    console.log(branches);

  } catch (error) {
    console.error("Error during DB login test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
