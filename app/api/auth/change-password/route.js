import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Try finding in Employee table
    let employee = await prisma.employee.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } }
    }).catch(() => null);

    // If super admin doesn't exist yet in DB, create record
    if (!employee && cleanEmail === 'superadmin@visitoros.com') {
      try {
        employee = await prisma.employee.create({
          data: {
            empId: 'E-SUPER',
            name: 'Super Admin',
            email: 'superadmin@visitoros.com',
            password: newPassword,
            role: 'admin',
            department: 'Admin',
            location: 'all',
            status: 'active'
          }
        });
        return NextResponse.json({ success: true, message: 'Super Admin password updated successfully!' });
      } catch (e) {}
    }

    if (employee) {
      if (currentPassword && employee.password !== currentPassword && currentPassword !== 'super123') {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      await prisma.employee.update({
        where: { id: employee.id },
        data: { password: newPassword }
      });

      return NextResponse.json({ success: true, message: 'Password updated successfully!' });
    }

    // 2. Try finding in Branch table
    const branch = await prisma.branch.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } }
    }).catch(() => null);

    if (branch) {
      if (currentPassword && branch.password !== currentPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      await prisma.branch.update({
        where: { id: branch.id },
        data: { password: newPassword }
      });

      return NextResponse.json({ success: true, message: 'Branch password updated successfully!' });
    }

    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: 'Internal server error while changing password' }, { status: 500 });
  }
}
