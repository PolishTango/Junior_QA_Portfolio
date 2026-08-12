import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjkxnpdbqmtfwxbiuphe.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_pF92XiIaDHnm-WgnLv_2Gw_MpAckufc';

export const supabase = createClient(supabaseUrl, supabaseKey);