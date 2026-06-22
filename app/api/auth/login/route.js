import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    // 1. Check hardcoded mock accounts first
    if (email === 'superadmin@visitoros.com' && password === 'super123') {
      return NextResponse.json({ email, role: 'admin', branch: 'all', name: 'Super Admin' });
    } else if (email === 'subadmin@visitoros.com' && password === 'sub123') {
      return NextResponse.json({ email, role: 'subadmin', branch: 'Bangalore', name: 'Bangalore Admin' });
    } else if (email === 'subadmin_chennai@visitoros.com' && password === 'sub123') {
      return NextResponse.json({ email, role: 'subadmin', branch: 'Chennai', name: 'Chennai Admin' });
    } else if (email === 'staff@visitoros.com' && password === 'staff123') {
      return NextResponse.json({ email, role: 'hr', name: 'Staff Member' });
    } else if (email === 'visitor@visitoros.com' && password === 'visitor123') {
      return NextResponse.json({ email, role: 'visitor', name: 'Visitor' });
    }

    // 2. Check Database Employees
    const employee = await prisma.employee.findUnique({
      where: { email: email }
    });

    if (employee && employee.password === password) {
      let appRole = 'hr'; 
      const deptLower = (employee.department || '').toLowerCase();
      const roleLower = (employee.role || '').toLowerCase();

      if (deptLower === 'sub admin' || roleLower.includes('sub administrator') || roleLower.includes('sub admin') || roleLower.includes('sub')) {
        appRole = 'subadmin';
      } else if (deptLower === 'admin' || roleLower.includes('administrator') || roleLower === 'admin') {
        appRole = 'admin';
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

    // 3. Check Database Branches (Branch Managers)
    const branch = await prisma.branch.findFirst({
      where: { email: email }
    });

    if (branch && branch.password === password) {
      return NextResponse.json({
        email: branch.email,
        name: branch.manager || branch.name,
        role: 'subadmin',
        branch: branch.name,
        empId: `MGR-${branch.id.substring(0, 5)}`
      });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
