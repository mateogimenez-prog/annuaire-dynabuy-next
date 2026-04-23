import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function checkAuth(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { titre, date, heure, fin, lieu, format, animateur, prix, lien } = body;

  if (!titre || !date || !heure || !lieu || !lien) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('meetings')
    .insert([{ titre, date, heure, fin: fin || '', lieu, format: format || 'Présentiel', animateur: animateur || '', prix: prix || '', lien }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { error } = await supabase.from('meetings').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
