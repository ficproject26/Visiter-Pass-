export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { updateEmployee, deleteEmployee } from '@vos/database';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const updated = await updateEmployee(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Employee update error:", error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await deleteEmployee(id);
    return NextResponse.json({ message: 'Employee deleted' });
  } catch (error) {
    console.error("Employee delete error:", error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
