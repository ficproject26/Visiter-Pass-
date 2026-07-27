import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email || '').trim().toLowerCase();

    // 1. Check Database Employees first (includes Super Admin, HR, Security, Sub-Admins)
    let employee = await prisma.employee.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } }
    }).catch(() => null);

    // Auto-seed Super Admin in DB if missing so password changes in DB/UI work dynamically
    if (!employee && cleanEmail === 'superadmin@visitoros.com') {
      try {
        employee = await prisma.employee.create({
          data: {
            empId: 'E-SUPER',
            name: 'Super Admin',
            email: 'superadmin@visitoros.com',
            password: password === 'super123' ? 'super123' : password,
            role: 'admin',
            department: 'Admin',
            location: 'all',
            status: 'active'
          }
        });
      } catch (e) {}
    }

    if (employee && employee.password === password) {
      let appRole = 'hr'; 
      const deptLower = (employee.department || '').toLowerCase();
      const roleLower = (employee.role || '').toLowerCase();

      if (cleanEmail === 'superadmin@visitoros.com' || deptLower === 'admin' || roleLower.includes('administrator') || roleLower === 'admin') {
        appRole = 'admin';
      } else if (deptLower === 'sub admin' || roleLower.includes('sub administrator') || roleLower.includes('sub admin') || roleLower.includes('sub')) {
        appRole = 'subadmin';
      } else if (deptLower.includes('security') || roleLower.includes('security') || roleLower.includes('gate') || roleLower.includes('guard')) {
        appRole = 'security';
      } else if (deptLower === 'hr' || roleLower.includes('hr') || roleLower.includes('recruiter')) {
        appRole = 'hr';
      }

      return NextResponse.json({
        email: employee.email,
        name: employee.name,
        role: appRole,
        branch: employee.location || 'all',
        empId: employee.empId
      });
    }

    // 2. Check Database Branches (Branch Managers)
    const branch = await prisma.branch.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } }
    }).catch(() => null);

    if (branch && branch.password === password) {
      return NextResponse.json({
        email: branch.email,
        name: branch.manager || branch.name,
        role: 'subadmin',
        branch: branch.name,
        empId: `MGR-${branch.id.substring(0, 5)}`
      });
    }

    // 3. Fallback mock accounts for initial setup
    if (cleanEmail === 'superadmin@visitoros.com' && password === 'super123') {
      return NextResponse.json({ email: cleanEmail, role: 'admin', branch: 'all', name: 'Super Admin' });
    } else if (cleanEmail === 'subadmin@visitoros.com' && password === 'sub123') {
      return NextResponse.json({ email: cleanEmail, role: 'subadmin', branch: 'Bangalore', name: 'Bangalore Admin' });
    } else if (cleanEmail === 'subadmin_chennai@visitoros.com' && password === 'sub123') {
      return NextResponse.json({ email: cleanEmail, role: 'subadmin', branch: 'Chennai', name: 'Chennai Admin' });
    } else if ((cleanEmail === 'security@visitoros.com' || cleanEmail === 'security@gmail.com') && (password === 'security123' || password === 'staff123')) {
      return NextResponse.json({ email: cleanEmail, role: 'security', name: 'Security Guard' });
    } else if (cleanEmail === 'staff@visitoros.com' && password === 'staff123') {
      return NextResponse.json({ email: cleanEmail, role: 'hr', name: 'Staff Member' });
    } else if (cleanEmail === 'visitor@visitoros.com' && password === 'visitor123') {
      return NextResponse.json({ email: cleanEmail, role: 'visitor', name: 'Visitor' });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
