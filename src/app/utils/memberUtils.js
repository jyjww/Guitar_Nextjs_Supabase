import { createClient } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트 가져오기

export async function checkUsernameDuplicate(username) {
  const { data, error } = await supabase
    .from('member')
    .select('username')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking username:', error)
    throw error
  }

  return !!data
}

export async function saveMember(memberData) {
  const { data, error } = await supabase
    .from('member')
    .insert([{ ...memberData, point: 1000 }])
    .select()

  if (error) {
    console.error('Error saving member:', error)
    throw error
  }

  return data[0]
}