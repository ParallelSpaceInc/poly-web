import { createClient } from '@supabase/supabase-js';

const supabaseURL: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServerKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

export const supabase = createClient(supabaseURL, supabaseServerKey);
