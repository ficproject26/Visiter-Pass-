export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getVisitors, createVisitor } from '@vos/database';

export async function GET() {
  try {
    const visitors = await getVisitors();
    return NextResponse.json(visitors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const visitor = await createVisitor(data);
    return NextResponse.json(visitor, { status: 201 });
  } catch (error) {
    console.error("Error creating visitor:", error);
    return NextResponse.json({ error: error.message || 'Failed to register visitor' }, { status: 500 });
  }
}
