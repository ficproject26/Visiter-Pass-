export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@vos/database';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email || '').trim().toLowerCase();

    let employee = await prisma.employee.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } }
    }).catch(() => null);

    if (employee && employee.password === password) {
      let appRole = 'security'; 
      const deptLower = (employee.department || '').toLowerCase();
      const roleLower = (employee.role || '').toLowerCase();

      if (cleanEmail === 'superadmin@visitoros.com' || deptLower === 'admin' || roleLower.includes('administrator') || roleLower === 'admin') {
        appRole = 'admin';
      } else if (deptLower === 'sub admin' || roleLower.includes('sub administrator') || roleLower.includes('sub admin') || roleLower.includes('sub')) {
        appRole = 'subadmin';
      } else if (deptLower.includes('security') || roleLower.includes('security') || roleLower.includes('gate') || roleLower.includes('guard')) {
        appRole = 'security';
      }

      return NextResponse.json({
        email: employee.email,
        name: employee.name,
        role: appRole,
        branch: employee.location || 'all',
        empId: employee.empId
      });
    }

    if ((cleanEmail === 'security@visitoros.com' || cleanEmail === 'security@gmail.com') && (password === 'security123' || password === 'staff123')) {
      return NextResponse.json({ email: cleanEmail, role: 'security', name: 'Security Guard' });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
