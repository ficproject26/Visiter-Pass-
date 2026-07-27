import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.department !== undefined) updateData.department = body.department;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.password !== undefined) updateData.password = body.password;

    // Find employee by empId or MongoDB id
    const target = await prisma.employee.findFirst({
      where: {
        OR: [
          { empId: id },
          { id: id }
        ]
      }
    });

    if (!target) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const employee = await prisma.employee.update({
      where: { id: target.id },
      data: updateData
    });

    return NextResponse.json({
      ...employee,
      id: employee.empId,
      photo: employee.photoUrl
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const target = await prisma.employee.findFirst({
      where: {
        OR: [
          { empId: id },
          { id: id }
        ]
      }
    });

    if (target) {
      await prisma.employee.delete({
        where: { id: target.id }
      });
    }

    return NextResponse.json({ message: 'Employee deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
