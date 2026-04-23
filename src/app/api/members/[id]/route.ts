import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { prenom, nom, entreprise, secteur, ville, email, tel } = body;

  if (!prenom || !nom || !entreprise || !secteur || !ville || !email || !tel) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('members')
    .update({ prenom, nom, entreprise, secteur, ville, email, tel })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
