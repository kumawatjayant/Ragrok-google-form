import { createClient } from '@supabase/supabase-js';

let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

// Auto-add https:// if the user just pasted the domain
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

// Remove trailing slash if present
if (supabaseUrl && supabaseUrl.endsWith('/')) {
  supabaseUrl = supabaseUrl.slice(0, -1);
}

// Only initialize if keys are present and valid to prevent black screen crashes
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
