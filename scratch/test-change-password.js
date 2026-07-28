import { prisma } from '../lib/prisma.js';

async function test() {
  try {
    console.log("Testing changing password for superadmin@visitoros.com to newpass123...");
    const res = await fetch('http://localhost:3000/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@visitoros.com',
        newPassword: 'super123'
      })
    }).catch(() => null);

    const emp = await prisma.employee.findFirst({
      where: { email: 'superadmin@visitoros.com' }
    });

    console.log("Super Admin in DB:", emp);
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
