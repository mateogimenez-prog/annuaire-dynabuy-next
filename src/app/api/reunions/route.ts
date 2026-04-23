import { NextResponse } from 'next/server';
import { getMeetings } from '@/lib/meetings';

export async function GET() {
  const meetings = await getMeetings();
  return NextResponse.json(meetings);
}
