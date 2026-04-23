import { supabase } from './supabase';
import type { Member } from '@/types';

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data as Member[];
}
