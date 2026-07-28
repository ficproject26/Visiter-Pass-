import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.log("Checking or creating Super Admin in MongoDB...");
    let emp = await prisma.employee.findFirst({
      where: { email: "superadmin@visitoros.com" }
    });

    if (!emp) {
      emp = await prisma.employee.create({
        data: {
          empId: 'E-SUPER',
          name: 'Super Admin',
          email: 'superadmin@visitoros.com',
          password: 'super123',
          role: 'admin',
          department: 'Admin',
          location: 'all',
          status: 'active'
        }
      });
      console.log("Super Admin seeded in DB:", emp);
    } else {
      console.log("Super Admin already in DB:", emp);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
