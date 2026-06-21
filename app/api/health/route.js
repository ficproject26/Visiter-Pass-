import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Connect visit API is running' });
}
