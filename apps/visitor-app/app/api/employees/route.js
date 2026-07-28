export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getEmployees, createEmployee } from '@vos/database';

export async function GET() {
  try {
    const employees = await getEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const employee = await createEmployee(data);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: error.message || 'Failed to save employee' }, { status: 500 });
  }
}
