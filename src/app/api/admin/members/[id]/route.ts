import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { prenom, nom, entreprise, secteur, ville, email, tel } = body;

  const { data, error } = await getAdminClient()
    .from('members')
    .update({ prenom, nom, entreprise, secteur, ville, email, tel })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
