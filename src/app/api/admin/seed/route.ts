import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SAMPLE_MEETINGS } from '@/lib/meetings';

export async function POST(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  if (pw !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const meetings = SAMPLE_MEETINGS.map(({ id: _id, ...m }) => m);
  const { error } = await supabase.from('meetings').upsert(meetings);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, count: meetings.length });
}
