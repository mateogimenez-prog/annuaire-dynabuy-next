import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();
  const { prenom, nom, entreprise, secteur, ville, email, tel } = body;

  if (!prenom || !nom || !entreprise || !secteur || !ville || !email || !tel) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'INVALID_EMAIL' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) {
    return NextResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('members')
    .insert({ prenom, nom, entreprise, secteur, ville, email: email.toLowerCase(), tel })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
