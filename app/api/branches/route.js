import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const branch = await prisma.branch.create({
      data: {
        name: data.name,
        type: data.type,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        manager: data.manager,
        phone: data.phone,
        email: data.email,
        password: data.password,
        capacity: data.capacity ? String(data.capacity) : null,
        status: data.status || 'active'
      }
    });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("Failed to create branch:", error);
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
  }
}
