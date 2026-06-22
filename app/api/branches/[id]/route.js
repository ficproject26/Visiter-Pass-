import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.pincode !== undefined) updateData.pincode = body.pincode;
    if (body.manager !== undefined) updateData.manager = body.manager;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.password !== undefined) updateData.password = body.password;
    if (body.capacity !== undefined) updateData.capacity = body.capacity ? String(body.capacity) : null;
    if (body.status !== undefined) updateData.status = body.status;

    const branch = await prisma.branch.update({
      where: { id: id },
      data: updateData
    });

    return NextResponse.json(branch);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update branch' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.branch.delete({
      where: { id: id }
    });
    return NextResponse.json({ message: 'Branch deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete branch' }, { status: 500 });
  }
}
