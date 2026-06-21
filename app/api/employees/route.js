import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const mapped = employees.map((emp) => ({
      ...emp,
      id: emp.empId,
      photo: emp.photoUrl
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const employee = await prisma.employee.create({
      data: {
        empId: data.id, 
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        department: data.department,
        location: data.location,
        status: data.status || 'active',
        photoUrl: data.photo || null
      }
    });
    return NextResponse.json({
      ...employee,
      id: employee.empId,
      photo: employee.photoUrl
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}
