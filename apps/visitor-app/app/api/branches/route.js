export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getBranches, createBranch } from '@vos/database';

export async function GET() {
  try {
    const branches = await getBranches();
    return NextResponse.json(branches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const branch = await createBranch(data);
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json({ error: error.message || 'Failed to create branch' }, { status: 500 });
  }
}
