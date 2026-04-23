import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const validCode = process.env.REGISTRATION_CODE || 'DynabuyNA';
  if (!code || code.trim() !== validCode) {
    return NextResponse.json({ error: 'INVALID_CODE' }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
