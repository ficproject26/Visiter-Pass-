export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma, getEmployees, getBranches } from '@vos/database';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email || '').trim().toLowerCase();

    const isSuperAdmin = cleanEmail === 'superadmin@visitoros.com';
    const isSuperAdminPassword = isSuperAdmin && (password === 'super123' || password === 'super123123');

    // Fast-path instant auth for Super Admin (1ms response, async DB sync)
    if (isSuperAdminPassword) {
      prisma.employee.findFirst({
        where: { email: { equals: cleanEmail, mode: 'insensitive' } }
      }).then(async (emp) => {
        if (!emp) {
          await prisma.employee.create({
            data: {
              empId: 'E-SUPER',
              name: 'Super Admin',
              email: 'superadmin@visitoros.com',
              password: password,
              role: 'admin',
              department: 'Admin',
              location: 'all',
              status: 'active'
            }
          }).catch(() => null);
        } else if (emp.password !== password) {
          await prisma.employee.update({
            where: { id: emp.id },
            data: { password: password }
          }).catch(() => null);
        }
      }).catch(() => null);

      return NextResponse.json({
        email: cleanEmail,
        name: 'Super Admin',
        role: 'admin',
        branch: 'all',
        empId: 'E-SUPER'
      });
    }

    // 1. Check merged employees list (file cache + DB)
    const allEmployees = await getEmployees().catch(() => []);
    let employee = allEmployees.find(e => (e.email || '').trim().toLowerCase() === cleanEmail);

    if (employee && employee.password === password) {
      let appRole = 'hr'; 
      const deptLower = (employee.department || '').toLowerCase();
      const roleLower = (employee.role || '').toLowerCase();

      if (cleanEmail === 'superadmin@visitoros.com' || deptLower === 'admin' || roleLower === 'administrator' || roleLower === 'admin') {
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
        empId: employee.empId || employee.id
      });
    }

    // 2. Check branches
    const allBranches = await getBranches().catch(() => []);
    const branch = allBranches.find(b => (b.email || '').trim().toLowerCase() === cleanEmail);

    if (branch && branch.password === password) {
      return NextResponse.json({
        email: branch.email,
        name: branch.manager || branch.name,
        role: 'subadmin',
        branch: branch.name,
        empId: `MGR-${(branch.id || '123').substring(0, 5)}`
      });
    }

    // 3. Mock Fallback accounts
    if (cleanEmail === 'subadmin@visitoros.com' && password === 'sub123') {
      return NextResponse.json({ email: cleanEmail, role: 'subadmin', branch: 'Bangalore', name: 'Bangalore Admin' });
    } else if (cleanEmail === 'subadmin_chennai@visitoros.com' && password === 'sub123') {
      return NextResponse.json({ email: cleanEmail, role: 'subadmin', branch: 'Chennai', name: 'Chennai Admin' });
    } else if ((cleanEmail === 'security@visitoros.com' || cleanEmail === 'security@gmail.com') && (password === 'security123' || password === 'staff123')) {
      return NextResponse.json({ email: cleanEmail, role: 'security', name: 'Security Guard' });
    } else if (cleanEmail === 'staff@visitoros.com' && password === 'staff123') {
      return NextResponse.json({ email: cleanEmail, role: 'hr', name: 'Staff Member' });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
